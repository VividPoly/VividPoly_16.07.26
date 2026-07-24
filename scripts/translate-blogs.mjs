/**
 * Blog Translation Script
 * Translates all English blog posts into 11 target languages using the built-in LLM.
 * Run with: DATABASE_URL="..." BUILT_IN_FORGE_API_URL="..." BUILT_IN_FORGE_API_KEY="..." node scripts/translate-blogs.mjs
 */
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!DATABASE_URL || !FORGE_API_URL || !FORGE_API_KEY) {
  console.error("Missing required env vars: DATABASE_URL, BUILT_IN_FORGE_API_URL, BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

const TARGET_LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "fr", name: "French" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian (Bahasa Indonesia)" },
  { code: "sw", name: "Swahili" },
  { code: "zh", name: "Chinese (Simplified)" },
];

async function invokeLLM(messages, responseFormat) {
  const body = {
    model: "gemini-2.5-flash",
    messages,
    max_tokens: 32768,
    ...(responseFormat ? { response_format: responseFormat } : {}),
  };

  const res = await fetch(`${FORGE_API_URL.replace(/\/$/, '')}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM API error ${res.status}: ${text}`);
  }

  return await res.json();
}

async function translatePost(post, targetLang) {
  const systemPrompt = `You are a professional translator specializing in industrial/manufacturing content for the PP woven bags and packaging industry. Translate the following blog post into ${targetLang.name}. 

IMPORTANT RULES:
- Maintain ALL HTML formatting tags exactly as they are
- Keep brand names like "VividPoly" unchanged
- Keep technical terms in their commonly used form in the target language
- Do NOT mention BRC or BRCGS certificates
- The translation should sound natural and professional in ${targetLang.name}
- Return a JSON object with fields: title, excerpt, content (HTML)`;

  const userContent = JSON.stringify({
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
  });

  const response = await invokeLLM(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    {
      type: "json_schema",
      json_schema: {
        name: "blog_translation",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Translated title" },
            excerpt: { type: "string", description: "Translated excerpt" },
            content: { type: "string", description: "Translated HTML content" },
          },
          required: ["title", "excerpt", "content"],
          additionalProperties: false,
        },
      },
    }
  );

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty LLM response");
  return JSON.parse(content);
}

async function main() {
  // Parse DATABASE_URL for mysql2
  const url = new URL(DATABASE_URL);
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
  });

  console.log("Connected to database");

  // Get all English posts (published)
  const [englishPosts] = await connection.execute(
    "SELECT * FROM blog_posts WHERE language = 'en' AND published = 1 ORDER BY id"
  );

  console.log(`Found ${englishPosts.length} English posts to translate`);

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const post of englishPosts) {
    console.log(`\n--- Translating: "${post.title}" (id: ${post.id}) ---`);

    for (const lang of TARGET_LANGUAGES) {
      // Check if translation already exists
      const [existing] = await connection.execute(
        "SELECT id FROM blog_posts WHERE parentId = ? AND language = ?",
        [post.id, lang.code]
      );

      if (existing.length > 0) {
        console.log(`  [SKIP] ${lang.name} (${lang.code}) - already exists`);
        totalSkipped++;
        continue;
      }

      try {
        console.log(`  [TRANSLATING] ${lang.name} (${lang.code})...`);
        const translated = await translatePost(post, lang);

        const slug = `${post.slug}-${lang.code}`;

        // Check if slug already exists (edge case)
        const [slugCheck] = await connection.execute(
          "SELECT id FROM blog_posts WHERE slug = ?",
          [slug]
        );
        if (slugCheck.length > 0) {
          console.log(`  [SKIP] ${lang.name} - slug already exists: ${slug}`);
          totalSkipped++;
          continue;
        }

        await connection.execute(
          `INSERT INTO blog_posts (title, slug, excerpt, content, coverImage, author, category, tags, language, parentId, published, publishedAt, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW(), NOW())`,
          [
            translated.title,
            slug,
            translated.excerpt,
            translated.content,
            post.coverImage || null,
            post.author || "VividPoly Team",
            post.category || null,
            post.tags || null,
            lang.code,
            post.id,
          ]
        );

        console.log(`  [DONE] ${lang.name} (${lang.code}) ✓`);
        totalCreated++;

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        console.error(`  [ERROR] ${lang.name} (${lang.code}):`, err.message);
      }
    }
  }

  console.log(`\n=== Translation Complete ===`);
  console.log(`Created: ${totalCreated} translations`);
  console.log(`Skipped: ${totalSkipped} (already existed)`);
  console.log(`Total posts in DB: ${englishPosts.length} originals + ${totalCreated} translations`);

  await connection.end();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
