import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const PORT = process.env.RADIUS_AUDIT_PORT || '3025';
const BASE = `http://localhost:${PORT}/`;
const OUT = 'test-results/radius-audit';

mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('.vp-hero-title', { timeout: 30000 });

  const samples = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      return { selector: sel, radius: s.borderRadius, border: s.borderTopLeftRadius };
    };
    return [
      pick('.vp-hero-ctas .vp-cta-whatsapp'),
      pick('.vp-hero-ctas .vp-cta-secondary'),
      pick('.vp-hero-ctas .vp-cta-primary'),
      pick('.vp-theme-toggle'),
      pick('.vp-header-menu-btn'),
      pick('.vp-enquiry-fab'),
      pick('.vp-start-card'),
      pick('.vp-faq-accordion'),
      pick('button.vp-gallery-thumb'),
    ].filter(Boolean);
  });

  console.log(`\n${vp.name} (${vp.width}px):`);
  for (const s of samples) console.log(`  ${s.selector}: ${s.radius}`);

  await page.screenshot({ path: `${OUT}/home-hero-${vp.name}.png` });

  await page.getByRole('button', { name: /^contact us$/i }).first().click();
  await page.waitForSelector('[data-screen-label="Contact"]', { timeout: 12000 });
  await page.screenshot({ path: `${OUT}/contact-${vp.name}.png` });

  await page.goto(`${BASE}#catalogue/type`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-screen-label="Catalogue"]', { timeout: 15000 });
  await page.screenshot({ path: `${OUT}/catalogue-${vp.name}.png` });

  await page.close();
}

await browser.close();
console.log(`\nScreenshots saved to ${OUT}/`);
