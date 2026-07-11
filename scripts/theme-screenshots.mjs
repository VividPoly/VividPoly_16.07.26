/**
 * Capture theme screenshots at desktop and mobile in light and dark modes.
 * Prerequisite: npm run build && npx next start --port 3015 (in another terminal)
 * Usage: THEME_SCREENSHOT_PORT=3015 npm run test:theme-screenshots
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'test-results', 'theme-screenshots');
const port = Number(process.env.THEME_SCREENSHOT_PORT || 3015);
const baseUrl = `http://127.0.0.1:${port}`;

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-375', width: 375, height: 812 },
];

const themes = ['light', 'dark'];

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();

  for (const theme of themes) {
    const context = await browser.newContext({
      colorScheme: theme,
    });

    for (const viewport of viewports) {
      const page = await context.newPage();
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 120000 });
      await page.waitForSelector('.vp-hero-title', { timeout: 120000 });
      await page.waitForTimeout(800);
      const file = path.join(outDir, `home-${viewport.name}-${theme}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`saved ${file}`);
      await page.close();
    }

    await context.close();
  }

  await browser.close();
  console.log('Theme screenshots complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
