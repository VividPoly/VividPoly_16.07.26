import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForSelector('.vp-root', { timeout: 30000 });
await page.waitForTimeout(2000);

const result = await page.evaluate(() => ({
  siteClass: document.querySelector('.vp-site')?.className ?? null,
  tagline: document.querySelector('.vp-hero-tagline')?.textContent?.trim() ?? null,
  taglineVisible: !!document.querySelector('.vp-hero-tagline') && getComputedStyle(document.querySelector('.vp-hero-tagline')).display !== 'none',
  navButtons: Array.from(document.querySelectorAll('.vp-header-nav-btn')).map((b) => b.textContent?.trim()),
  quoteCta: document.querySelector('.vp-header-quote-cta')?.textContent?.trim() ?? null,
  heroVisualDisplay: document.querySelector('.vp-hero-visual') ? getComputedStyle(document.querySelector('.vp-hero-visual')).display : null,
}));

console.log(JSON.stringify(result, null, 2));
await browser.close();
