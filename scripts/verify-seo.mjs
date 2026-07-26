/**
 * Validates the generated SEO data against the app's actual routes and assets.
 * Run after build-seo-data.mjs:  node scripts/verify-seo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const failures = [];
const warnings = [];
const fail = (m) => failures.push(m);
const warn = (m) => warnings.push(m);

// --- load generated data -----------------------------------------------------
const gen = read('client/src/data/seo.generated.ts');
const start = gen.indexOf('export const pageSEO: Record<string, PageSEO> = ');
const slice = gen.slice(start + 'export const pageSEO: Record<string, PageSEO> = '.length);
const pageSEO = JSON.parse(slice.slice(0, slice.lastIndexOf('};') + 1));
const pages = Object.values(pageSEO);

// --- routes declared in App.tsx ---------------------------------------------
const app = read('client/src/App.tsx');
const routePatterns = [...app.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);
const staticRoutes = new Set(routePatterns.filter((r) => !r.includes(':')));
const dynamicRoutes = routePatterns
  .filter((r) => r.includes(':'))
  .map((r) => new RegExp('^' + r.replace(/:[^/]+/g, '[^/]+') + '$'));

const productSlugs = new Set(
  [...read('client/src/data/productCategories.ts').matchAll(/slug:\s*['"]([a-z0-9-]+)['"]/g)].map((m) => m[1])
);
const industrySlugs = new Set(
  [...read('client/src/pages/IndustryDetail.tsx').matchAll(/^\s{2}"?([a-z-]+)"?:\s*\{$/gm)].map((m) => m[1])
);

// --- per-page checks ---------------------------------------------------------
for (const p of pages) {
  const label = p.path;

  // 1. the path must actually be routable
  const routable =
    staticRoutes.has(p.path) || dynamicRoutes.some((re) => re.test(p.path));
  if (!routable) fail(`${label}: no matching <Route> in App.tsx`);

  // 2. dynamic routes must have backing data, or they render NotFound
  if (p.path.startsWith('/products/')) {
    const slug = p.path.split('/')[2];
    if (!productSlugs.has(slug)) fail(`${label}: slug "${slug}" missing from productCategories.ts`);
  }
  if (p.path.startsWith('/industry/')) {
    const slug = p.path.split('/')[2];
    if (!industrySlugs.has(slug)) fail(`${label}: slug "${slug}" missing from industryData`);
  }

  // 3. canonical must be the apex origin and agree with the path
  const expected = `https://vividpoly.com${p.path === '/' ? '/' : p.path}`;
  if (p.canonical !== expected) fail(`${label}: canonical "${p.canonical}" != "${expected}"`);

  // 4. meta present and within the lengths Google will render
  if (!p.title) fail(`${label}: empty title`);
  else if (p.title.length > 60) warn(`${label}: title ${p.title.length} chars (>60, may truncate)`);
  if (!p.description) fail(`${label}: empty description`);
  else if (p.description.length > 160)
    warn(`${label}: description ${p.description.length} chars (>160, may truncate)`);
  if (!p.h1) warn(`${label}: sheet has no H1`);

  // 5. JSON-LD sanity
  if (!p.schema.length) warn(`${label}: no JSON-LD`);
  for (const block of p.schema) {
    if (block['@context'] !== 'https://schema.org') fail(`${label}: block missing @context`);
    if (!block['@type']) fail(`${label}: block missing @type`);
    if (JSON.stringify(block).includes('aggregateRating'))
      fail(`${label}: aggregateRating present (unsupported by on-page reviews)`);
    if (JSON.stringify(block).includes('www.vividpoly.com'))
      fail(`${label}: block references the redirecting www host`);

    // breadcrumb positions must be 1..n in order
    if (block['@type'] === 'BreadcrumbList') {
      const items = block.itemListElement ?? [];
      items.forEach((it, i) => {
        if (it.position !== i + 1) fail(`${label}: breadcrumb position ${it.position} at index ${i}`);
      });
    }
  }

  // 6. every image the schema points at must exist in public/
  for (const url of JSON.stringify(p.schema).matchAll(/https:\/\/vividpoly\.com(\/[^"]+\.(?:webp|png|jpg|jpeg))/g)) {
    const asset = path.join(ROOT, 'client/public', decodeURIComponent(url[1]));
    if (!fs.existsSync(asset)) fail(`${label}: schema image 404 -> ${url[1]}`);
  }
}

// --- cross-file consistency --------------------------------------------------
const sitemap = read('client/public/sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== pages.length) fail(`sitemap has ${locs.length} URLs, expected ${pages.length}`);
for (const p of pages) {
  if (!locs.includes(p.canonical)) fail(`sitemap missing ${p.canonical}`);
}

const robots = read('client/public/robots.txt');
if (robots.includes('www.vividpoly.com')) fail('robots.txt still references the www host');
if (!robots.includes('Sitemap: https://vividpoly.com/sitemap.xml')) fail('robots.txt sitemap URL wrong');

const html = read('client/index.html');
if (html.includes('www.vividpoly.com')) fail('index.html still references the www host');
for (const needle of ['G-ZKH4KLN4Q4', 'GTM-59TXTBGV', "gtag('consent', 'default'", 'googletagmanager.com/ns.html'])
  if (!html.includes(needle)) fail(`index.html missing: ${needle}`);
// consent defaults must be pushed before the tag loaders run
if (html.indexOf("gtag('consent', 'default'") > html.indexOf('gtag/js?id='))
  fail('index.html: consent defaults run after gtag.js loads');

// --- report ------------------------------------------------------------------
console.log(`Checked ${pages.length} pages, ${pages.reduce((n, p) => n + p.schema.length, 0)} JSON-LD blocks.`);
for (const w of warnings) console.log(`  WARN  ${w}`);
if (failures.length) {
  for (const f of failures) console.log(`  FAIL  ${f}`);
  console.log(`\n${failures.length} failure(s).`);
  process.exit(1);
}
console.log(`\nAll checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
