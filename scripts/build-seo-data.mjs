/**
 * Regenerates client/src/data/seo.generated.ts from the SEO team's Google Sheet.
 *
 * The sheet (one spreadsheet, four tabs) is the source of truth for per-page
 * meta, canonicals and JSON-LD. Run this after the SEO team edits it:
 *
 *   node scripts/build-seo-data.mjs
 *
 * Tabs are published read-only via the CSV export endpoint, so no auth is
 * needed. Pass --offline to reuse the CSVs cached in scripts/.seo-cache/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CACHE = path.join(__dirname, '.seo-cache');
const OUT = path.join(ROOT, 'client/src/data/seo.generated.ts');

const SHEET_ID = '1tKgqUm66nJMSaYCr_PwcG71VgumHUCpWGVDCAFVvUUQ';
const TABS = { meta: '0', canonical: '225586545', schema: '1532156778' };

/**
 * The sheet ships aggregateRating on every Product and on the Organization
 * (a flat 5/5 with an invented reviewCount). Google's structured data policy
 * requires ratings to come from reviews genuinely collected and visible on the
 * page, and self-serving Organization ratings are ineligible outright — so
 * shipping these risks a "spammy structured markup" manual action against the
 * whole domain, not just the rich result. They are stripped here.
 *
 * Flip this to true only once real, on-page reviews exist to back the numbers.
 */
const INCLUDE_AGGREGATE_RATING = false;

const OFFLINE = process.argv.includes('--offline');

function parseCSV(text) {
  text = text.replace(/\r\n/g, '\n');
  const rows = [];
  let row = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = false;
      } else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(cur);
      cur = '';
    } else if (c === '\n') {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = '';
    } else cur += c;
  }
  if (cur !== '' || row.length) {
    row.push(cur);
    rows.push(row);
  }
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

async function loadTab(name, gid) {
  const cached = path.join(CACHE, `${name}.csv`);
  if (OFFLINE) return parseCSV(fs.readFileSync(cached, 'utf8'));
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name} tab: HTTP ${res.status}`);
  const body = await res.text();
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(cached, body);
  return parseCSV(body);
}

/** https://vividpoly.com/about -> /about ; https://vividpoly.com/ -> / */
function toPath(url) {
  if (!url) return null;
  try {
    const p = new URL(url.trim()).pathname;
    return p.length > 1 ? p.replace(/\/$/, '') : '/';
  } catch {
    return null;
  }
}

/** Sheet cells wrap the JSON-LD in a <script> tag; unwrap and parse it. */
function unwrapJsonLd(cell) {
  if (!cell || !cell.trim()) return null;
  const inner = cell.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
  if (!inner) return null;
  try {
    return JSON.parse(inner);
  } catch (err) {
    throw new Error(`Unparseable JSON-LD: ${err.message}\n${inner.slice(0, 200)}`);
  }
}

function stripAggregateRating(node) {
  if (Array.isArray(node)) return node.map(stripAggregateRating);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === 'aggregateRating' && !INCLUDE_AGGREGATE_RATING) continue;
      out[k] = stripAggregateRating(v);
    }
    return out;
  }
  return node;
}

const [metaRows, canonicalRows, schemaRows] = await Promise.all(
  Object.entries(TABS).map(([name, gid]) => loadTab(name, gid))
);

const canonicalByPath = new Map();
for (const r of canonicalRows) {
  const p = toPath(r['URL']);
  if (p) canonicalByPath.set(p, r['Suggested Canonical URL'].trim());
}

const schemaByPath = new Map();
let strippedRatings = 0;
for (const r of schemaRows) {
  const p = toPath(r['URL']);
  if (!p) continue;
  const blocks = [];
  for (const col of ['Organization Schema', 'FAQ Schema', 'BreadcrumbList', 'Review Schema']) {
    const parsed = unwrapJsonLd(r[col]);
    if (!parsed) continue;
    if (JSON.stringify(parsed).includes('"aggregateRating"')) strippedRatings++;
    const cleaned = stripAggregateRating(parsed);
    // The Review column on the home page is an Organization stub that exists
    // only to carry the rating; once stripped it duplicates the real
    // Organization block, so drop it.
    const keys = Object.keys(cleaned).filter((k) => !k.startsWith('@'));
    if (keys.length <= 2 && col === 'Review Schema') continue;
    blocks.push(cleaned);
  }
  if (blocks.length) schemaByPath.set(p, blocks);
}

const pages = [];
for (const r of metaRows) {
  const p = toPath(r['URL']);
  if (!p) continue;
  pages.push({
    path: p,
    name: r['Page'],
    title: r['Meta TItle'] || r['Meta Title'],
    description: r['Meta Description'],
    h1: r['H1'],
    canonical: canonicalByPath.get(p) ?? `https://vividpoly.com${p === '/' ? '/' : p}`,
    schema: schemaByPath.get(p) ?? [],
  });
}

const missingCanonical = pages.filter((p) => !canonicalByPath.has(p.path)).map((p) => p.path);
const missingSchema = pages.filter((p) => !p.schema.length).map((p) => p.path);

const banner = `// GENERATED FILE — do not edit by hand.
// Source: SEO Google Sheet (meta / canonical / schema tabs).
// Regenerate with: node scripts/build-seo-data.mjs
// Generated ${new Date().toISOString().slice(0, 10)} from ${pages.length} pages.
`;

const body = `${banner}
export interface PageSEO {
  /** Route path, e.g. "/products/valve-bags". */
  path: string;
  /** Human label from the sheet, e.g. "Valve Bags". */
  name: string;
  title: string;
  description: string;
  /** The H1 the SEO sheet expects this page to render. */
  h1: string;
  canonical: string;
  /** JSON-LD blocks injected into <head> while this route is mounted. */
  schema: Record<string, unknown>[];
}

/** Canonical origin. The live site 308-redirects www -> apex, so no "www." here. */
export const SITE_ORIGIN = 'https://vividpoly.com';

export const pageSEO: Record<string, PageSEO> = ${JSON.stringify(
  Object.fromEntries(pages.map((p) => [p.path, p])),
  null,
  2
)};

/** Every path covered by the SEO sheet, in sheet order — used to build the sitemap. */
export const seoPaths: string[] = ${JSON.stringify(pages.map((p) => p.path), null, 2)};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, body);

// ---------------------------------------------------------------------------
// sitemap.xml, from the same source, so it can never drift from the routes the
// sheet defines. Blog posts are DB-driven and intentionally not listed here.
// ---------------------------------------------------------------------------
const LANGS = [['es', 'es'], ['pt-BR', 'pt'], ['fr', 'fr'], ['ja', 'ja'], ['hi', 'hi'], ['ar', 'ar']];

function priorityFor(p) {
  if (p === '/') return '1.0';
  if (p === '/products' || p === '/industries') return '0.9';
  if (p.startsWith('/products/') || p.startsWith('/industry/')) return '0.8';
  if (p === '/privacy-policy') return '0.3';
  return '0.7';
}

function changefreqFor(p) {
  if (p === '/' || p === '/products' || p === '/blog') return 'weekly';
  if (p === '/privacy-policy' || p === '/careers') return 'yearly';
  return 'monthly';
}

const today = new Date().toISOString().slice(0, 10);
const urls = pages
  .map(({ path: p, canonical }) => {
    const alts = [
      `    <xhtml:link rel="alternate" hreflang="en" href="${canonical}"/>`,
      ...LANGS.map(
        ([hreflang, code]) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${canonical}?lang=${code}"/>`
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${canonical}"/>`,
    ].join('\n');
    return `  <url>
    <loc>${canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreqFor(p)}</changefreq>
    <priority>${priorityFor(p)}</priority>
${alts}
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- GENERATED FILE — regenerate with: node scripts/build-seo-data.mjs -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'client/public/sitemap.xml'), sitemap);
console.log(`  sitemap.xml:      ${pages.length} URLs`);

console.log(`Wrote ${path.relative(ROOT, OUT)}`);
console.log(`  pages:            ${pages.length}`);
console.log(`  with schema:      ${pages.length - missingSchema.length}`);
console.log(`  aggregateRating:  ${strippedRatings} block(s) ${INCLUDE_AGGREGATE_RATING ? 'kept' : 'stripped'}`);
if (missingCanonical.length) console.log(`  no canonical row: ${missingCanonical.join(', ')}`);
if (missingSchema.length) console.log(`  no schema row:    ${missingSchema.join(', ')}`);
