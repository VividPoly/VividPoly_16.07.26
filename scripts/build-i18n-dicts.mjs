// Regenerates the pre-shipped translation dictionaries in
// client/public/i18n/<lang>.json.
//
// These dictionaries are what makes a language switch feel instant and work
// offline: every string they cover is applied without touching the network.
// An earlier generation truncated its keys at 200 characters, so every body
// paragraph, product introduction and footer blurb was stored under a key that
// could never match the real DOM string — which is why only headings and
// titles used to translate. Keys here are always the FULL string.
//
// Usage:  node scripts/build-i18n-dicts.mjs <strings.json>
//
// <strings.json> is an array of English source strings (produced by crawling
// the built site). Existing dictionary entries are kept, so re-runs only fetch
// what is genuinely new and stay well clear of provider rate limits.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "client", "public", "i18n");

const LANGS = ["es", "pt", "fr", "ar", "hi", "ja", "vi", "th", "id", "sw", "zh"];
const PROVIDER_LANG = { zh: "zh-CN" };

// Pacing. The endpoint is keyless and will rate-limit a burst, which is how a
// previous run produced empty dictionaries for some languages.
const CONCURRENCY = 4;
const PAUSE_BETWEEN_CHUNKS = 900;
const CHUNK = 40;
const PAUSE_BETWEEN_LANGS = 4000;
const MAX_CHUNK_CHARS = 1200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function splitLong(text) {
  if (text.length <= MAX_CHUNK_CHARS) return [text];
  const parts = [];
  let rest = text;
  while (rest.length > MAX_CHUNK_CHARS) {
    const win = rest.slice(0, MAX_CHUNK_CHARS);
    let cut = Math.max(win.lastIndexOf(". "), win.lastIndexOf("! "), win.lastIndexOf("? "));
    cut = cut > MAX_CHUNK_CHARS * 0.5 ? cut + 2 : -1;
    if (cut < 0) {
      const ws = win.lastIndexOf(" ");
      cut = ws > MAX_CHUNK_CHARS * 0.5 ? ws + 1 : MAX_CHUNK_CHARS;
    }
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) parts.push(rest);
  return parts;
}

async function fetchPart(text, lang) {
  const tl = PROVIDER_LANG[lang] || lang;
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t" +
    `&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(text)}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const out = (data[0] || []).map((s) => s[0]).join("");
      if (out && /\S/.test(out)) return out;
      return null;
    } catch {
      if (attempt === 3) return null;
      await sleep(700 * (attempt + 1)); // back off through rate limits
    }
  }
  return null;
}

async function translate(text, lang) {
  const parts = splitLong(text);
  const out = [];
  for (const p of parts) {
    const done = await fetchPart(p, lang);
    if (done === null) return null; // don't store partial translations
    out.push(done);
  }
  return out.join("");
}

async function buildLang(lang, sources) {
  const file = path.join(OUT_DIR, `${lang}.json`);
  let dict = {};
  try {
    dict = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    dict = {};
  }
  // Drop the old truncated keys: a 200-char key that is a strict prefix of a
  // real source string never matched anything and only wasted bytes.
  const truncated = new Set();
  for (const key of Object.keys(dict)) {
    if (key.length === 200 && sources.some((s) => s.length > 200 && s.startsWith(key))) {
      truncated.add(key);
    }
  }
  for (const key of truncated) delete dict[key];

  const todo = sources.filter((s) => dict[s] === undefined);
  process.stdout.write(
    `[${lang}] have ${Object.keys(dict).length}, dropped ${truncated.size} truncated, fetching ${todo.length}\n`
  );

  let done = 0;
  let failed = 0;
  for (let i = 0; i < todo.length; i += CHUNK) {
    const slice = todo.slice(i, i + CHUNK);
    let cursor = 0;
    const worker = async () => {
      while (cursor < slice.length) {
        const text = slice[cursor++];
        const out = await translate(text, lang);
        if (out === null) failed += 1;
        else {
          dict[text] = out;
          done += 1;
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, slice.length) }, worker));
    fs.writeFileSync(file, JSON.stringify(dict, null, 0)); // checkpoint
    process.stdout.write(`[${lang}] ${done}/${todo.length} (${failed} failed)\n`);
    await sleep(PAUSE_BETWEEN_CHUNKS);
  }

  fs.writeFileSync(file, JSON.stringify(dict, null, 0));
  process.stdout.write(`[${lang}] DONE total=${Object.keys(dict).length} failed=${failed}\n`);
  return failed;
}

const srcFile = process.argv[2];
if (!srcFile) {
  console.error("usage: node scripts/build-i18n-dicts.mjs <strings.json>");
  process.exit(1);
}
const sources = JSON.parse(fs.readFileSync(srcFile, "utf8"));
console.log(`source strings: ${sources.length}, longest ${Math.max(...sources.map((s) => s.length))}`);
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const lang of LANGS) {
  await buildLang(lang, sources);
  await sleep(PAUSE_BETWEEN_LANGS);
}
console.log("all dictionaries rebuilt");
