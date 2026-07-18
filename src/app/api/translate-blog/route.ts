import { NextResponse } from 'next/server';

// On-the-fly translation of a single published blog post into the visitor's
// language, with a persistent write-through cache.
//
// The client sends only { id, locale }. The server loads that post's English
// text from the database itself (published posts only) — it never trusts
// caller-supplied content — translates it (HTML-aware: tags and <img> survive
// untouched), returns it, and stores it in the blogs.translations JSONB column
// so every later view (any visitor, and after a restart) reads it straight from
// the database. See src/lib/supabase.ts (select('*')) and src/lib/blog-i18n.ts.
//
// This keeps blog-content translation fully automatic and safe: only real
// published posts can be translated, ids are validated, and the service-role
// key is used only server-side. Machine output — review important posts by a
// native speaker before production.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PROVIDER_LANG: Record<string, string> = { 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW' };

// Locales we translate into (mirrors the UI's supported set). Anything else —
// including English variants — is a no-op (the original English is shown).
const SUPPORTED = new Set([
  'fr', 'de', 'es', 'it', 'pt', 'nl', 'pl', 'ru',
  'ar', 'fa', 'he', 'tr', 'sw', 'ha', 'am',
  'zh-Hans', 'zh-Hant',
  'hi', 'gu', 'mr', 'ta', 'te', 'kn', 'bn', 'pa', 'ml',
  'id', 'ms', 'th',
]);
const provLang = (code: string) => PROVIDER_LANG[code] || code.split('-')[0];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Fields = { title: string; excerpt: string; category: string; readTime: string; body: string };

// In-memory cache (warm-server fast path) keyed by `${id}:${srcHash}:${locale}`.
// The DB column is the durable store this derives from.
const CACHE = new Map<string, Fields>();
const CACHE_LIMIT = 500;

// Per-blog write lock so concurrent locale requests merge into the JSONB column
// sequentially instead of clobbering each other. A dropped write self-heals on
// the next view.
const writeChains = new Map<string, Promise<unknown>>();

// Must match src/lib/blog.ts `blogSourceHash` exactly (FNV-1a over the same
// fields, space-joined) so client and server agree on staleness.
function sourceHash(f: Fields): string {
  const s = [f.title, f.excerpt, f.category, f.readTime, f.body].join(' ');
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } };
}

// Tracks whether any part of a single request's translation had to give up and
// fall back to the English source. When that happens we must NOT cache or store
// the result — otherwise the English fallback gets saved as if it were a real
// translation (with a matching source hash) and the post is stuck in English
// forever, never retried. Passed per-request so concurrent requests don't share.
type TxCtx = { failed: boolean };

async function translateText(text: string, target: string, ctx: TxCtx): Promise<string> {
  if (!text || !/\S/.test(text)) return text;
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t' +
    `&tl=${encodeURIComponent(provLang(target))}&q=${encodeURIComponent(text)}`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as unknown[][];
      const segments = (data[0] as unknown[]) || [];
      return segments.map((seg) => (seg as string[])[0]).join('');
    } catch {
      if (attempt === 2) {
        ctx.failed = true; // give up: keep English, but mark the result untrustworthy
        return text;
      }
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  ctx.failed = true;
  return text;
}

// Translate HTML, leaving tags (and attributes like <img src>) untouched and
// translating only the visible text between them.
async function translateHtml(html: string, target: string, ctx: TxCtx): Promise<string> {
  const parts = html.split(/(<[^>]+>)/);
  const out: string[] = [];
  for (const part of parts) {
    if (!part || part.startsWith('<') || !/\S/.test(part)) out.push(part);
    else out.push(await translateText(part, target, ctx));
  }
  return out.join('');
}

// A stored/served translation is only trustworthy if it actually differs from
// the English source. If title and body both equal the source, translation
// really failed (Google echoed English back) — treat it as missing so it gets
// retried rather than shown as a permanent English "translation".
function looksUntranslated(t: Partial<Fields>, source: Fields): boolean {
  return (t.title ?? source.title) === source.title && (t.body ?? source.body) === source.body;
}

type BlogRow = {
  title: string | null;
  excerpt: string | null;
  category: string | null;
  read_time: string | null;
  body: string | null;
  translations: Record<string, { srcHash?: string } & Partial<Fields>> | null;
};

// Load a published post's English text + existing translations by id.
async function loadBlog(id: string): Promise<{ fields: Fields; translations: BlogRow['translations'] } | null> {
  const sb = supabase();
  if (!sb) return null;
  const res = await fetch(
    `${sb.url}/rest/v1/blogs?id=eq.${encodeURIComponent(id)}&published=eq.true` +
      '&select=title,excerpt,category,read_time,body,translations&limit=1',
    { headers: sb.headers },
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as BlogRow[];
  const row = rows[0];
  if (!row) return null;
  return {
    fields: {
      title: row.title ?? '',
      excerpt: row.excerpt ?? '',
      category: row.category ?? '',
      readTime: row.read_time ?? '',
      body: row.body ?? '',
    },
    translations: row.translations ?? {},
  };
}

// Merge one locale's translation into the post's translations column under the
// per-blog write lock, skipping the write if it's already stored and current.
async function persist(id: string, locale: string, fields: Fields, srcHash: string, source: Fields): Promise<void> {
  const sb = supabase();
  if (!sb) return;
  const prior = writeChains.get(id) ?? Promise.resolve();
  const next = prior
    .catch(() => {})
    .then(async () => {
      const getRes = await fetch(
        `${sb.url}/rest/v1/blogs?id=eq.${encodeURIComponent(id)}&select=translations&limit=1`,
        { headers: sb.headers },
      );
      if (!getRes.ok) return;
      const rows = (await getRes.json()) as { translations: Record<string, { srcHash?: string } & Partial<Fields>> | null }[];
      const current = rows[0]?.translations ?? {};
      // Already stored, up to date, AND a real translation? Skip the write so we
      // don't needlessly bump updated_at (the blogs table trigger does so on
      // every update). If the stored value is a failed English row, fall through
      // and overwrite it with this good translation (self-heal).
      const stored = current[locale];
      if (stored?.srcHash === srcHash && !looksUntranslated(stored, source)) return;
      const merged = { ...current, [locale]: { ...fields, srcHash } };
      await fetch(`${sb.url}/rest/v1/blogs?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: sb.headers,
        body: JSON.stringify({ translations: merged }),
      });
    });
  writeChains.set(id, next);
  try {
    await next;
  } finally {
    if (writeChains.get(id) === next) writeChains.delete(id);
  }
}

export async function POST(request: Request) {
  let payload: { id?: string; locale?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const locale = (payload.locale || '').trim();
  const id = (payload.id || '').trim();
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  // Unsupported/English locale: nothing to translate.
  if (!SUPPORTED.has(locale)) return NextResponse.json({});

  const blog = await loadBlog(id);
  if (!blog) return NextResponse.json({}); // unknown/unpublished, or DB unavailable

  const srcHash = sourceHash(blog.fields);
  const cacheId = `${id}:${srcHash}:${locale}`;
  const cached = CACHE.get(cacheId);
  if (cached) return NextResponse.json(cached);

  // Already translated and current in the DB? Serve it without re-translating —
  // unless the stored value is actually just the English source (a failed
  // translation from before), in which case fall through and try again.
  const existing = blog.translations?.[locale];
  if (existing && existing.srcHash === srcHash && !looksUntranslated(existing, blog.fields)) {
    const fromDb: Fields = {
      title: existing.title ?? blog.fields.title,
      excerpt: existing.excerpt ?? blog.fields.excerpt,
      category: existing.category ?? blog.fields.category,
      readTime: existing.readTime ?? blog.fields.readTime,
      body: existing.body ?? blog.fields.body,
    };
    CACHE.set(cacheId, fromDb);
    return NextResponse.json(fromDb);
  }

  const ctx: TxCtx = { failed: false };
  const result: Fields = {
    title: await translateText(blog.fields.title, locale, ctx),
    excerpt: await translateText(blog.fields.excerpt, locale, ctx),
    category: await translateText(blog.fields.category, locale, ctx),
    readTime: await translateText(blog.fields.readTime, locale, ctx),
    body: await translateHtml(blog.fields.body, locale, ctx),
  };

  // Translation failed (rate-limited) or came back as plain English? Don't
  // cache or store it — return 503 so the client keeps English for now and
  // retries on the next visit instead of caching a broken "translation".
  if (ctx.failed || looksUntranslated(result, blog.fields)) {
    return NextResponse.json({}, { status: 503 });
  }

  if (CACHE.size >= CACHE_LIMIT) CACHE.delete(CACHE.keys().next().value as string);
  CACHE.set(cacheId, result);

  // Durably cache in the DB (best-effort — never block the response on it).
  persist(id, locale, result, srcHash, blog.fields).catch(() => {});

  return NextResponse.json(result);
}
