/**
 * Responsive overflow audit. Run: node scripts/responsive-audit.mjs
 * Requires dev server at http://localhost:3000
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.VP_AUDIT_URL ?? 'http://localhost:3000';
const OUT = path.join(process.cwd(), 'audit-screenshots');

const VIEWPORTS_ALL = [
  { name: 'fold-folded-320', width: 320, height: 740 },
  { name: 'iphone-390', width: 390, height: 844 },
  { name: 'iphone-428', width: 428, height: 926 },
  { name: 'fold-unfolded-717', width: 717, height: 512 },
  { name: 'fold-unfolded-884', width: 884, height: 1104 },
  { name: 'ipad-768', width: 768, height: 1024 },
  { name: 'ipad-820', width: 820, height: 1180 },
  { name: 'ipad-1024', width: 1024, height: 1366 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

const QUICK_WIDTHS = (process.env.VP_AUDIT_QUICK ?? '')
  .split(',')
  .map((s) => Number(s.trim()))
  .filter(Boolean);
const VIEWPORTS =
  QUICK_WIDTHS.length > 0
    ? VIEWPORTS_ALL.filter((v) => QUICK_WIDTHS.includes(v.width))
    : VIEWPORTS_ALL;

const PAGES = [
  { id: 'home', label: 'Home', setup: async () => {} },
  {
    id: 'catalogue',
    label: 'Catalogue',
    setup: async (page) => {
      await page.getByRole('button', { name: /shop by product type/i }).first().click({ timeout: 8000 });
      await page.waitForSelector('[data-screen-label="Catalogue"]', { timeout: 8000 });
    },
  },
  {
    id: 'pdp',
    label: 'PDP',
    setup: async (page) => {
      await page.getByRole('button', { name: /shop by product type/i }).first().click({ timeout: 8000 });
      await page.waitForSelector('[data-screen-label="Catalogue"]', { timeout: 8000 });
      await page.locator('.vp-catalogue-card-hit').first().click({ timeout: 8000 });
      await page.waitForSelector('[data-screen-label="Product detail"]', { timeout: 8000 });
    },
  },
  {
    id: 'quote',
    label: 'Quote',
    setup: async (page) => {
      await page.getByRole('button', { name: /request export quote/i }).first().click({ timeout: 8000 });
      await page.waitForSelector('.vp-quote-contact-overlay', { timeout: 8000 });
    },
  },
  {
    id: 'quote-page',
    label: 'Quote page',
    setup: async (page) => {
      await page.getByRole('button', { name: /get quote/i }).last().click({ timeout: 8000 });
      await page.waitForSelector('[data-screen-label="Get a quote"]', { timeout: 8000 });
    },
  },
];

async function checkOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const overflow = Math.max(0, doc.scrollWidth - doc.clientWidth);
    const offenders = [];
    document.querySelectorAll('body *').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      if (rect.right > window.innerWidth + 2) {
        const cls = el.className && typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName;
        offenders.push({ tag: el.tagName, cls, right: Math.round(rect.right), vw: window.innerWidth });
      }
    });
    offenders.sort((a, b) => b.right - a.right);
    return { overflow, offenders: offenders.slice(0, 8) };
  });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const pg of PAGES) {
      await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForSelector('.vp-root', { timeout: 15000 });
      try {
        await pg.setup(page);
      } catch (err) {
        results.push({ viewport: vp.name, page: pg.id, error: String(err) });
        continue;
      }
      await page.waitForTimeout(400);
      const check = await checkOverflow(page);
      const file = `${vp.name}__${pg.id}.png`;
      await page.screenshot({ path: path.join(OUT, file), fullPage: true });
      results.push({
        viewport: vp.name,
        width: vp.width,
        page: pg.id,
        overflow: check.overflow,
        offenders: check.offenders,
        screenshot: file,
      });
    }
    await context.close();
  }

  await browser.close();

  const reportPath = path.join(OUT, 'report.json');
  await writeFile(reportPath, JSON.stringify(results, null, 2));

  const issues = results.filter((r) => (r.overflow ?? 0) > 2);
  console.log(`\nAudit complete. ${results.length} checks, ${issues.length} with overflow.\n`);
  for (const r of issues) {
    console.log(`⚠ ${r.viewport} (${r.width}px) / ${r.page}: overflow ${r.overflow}px`);
    for (const o of r.offenders ?? []) {
      console.log(`   → ${o.tag}.${o.cls} right=${o.right} (vw=${o.vw})`);
    }
  }
  if (issues.length === 0) console.log('No horizontal overflow detected.');
  console.log(`Report: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
