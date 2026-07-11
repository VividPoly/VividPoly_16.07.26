/**
 * WCAG contrast audit via axe-core across pages, viewports, and themes.
 * Prerequisite: npm run build && npx next start --port 3015
 * Usage: node scripts/contrast-audit.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'test-results', 'contrast-audit');
const port = Number(process.env.CONTRAST_AUDIT_PORT || 3015);
const baseUrl = `http://127.0.0.1:${port}`;

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-375', width: 375, height: 812 },
];

const themes = ['light', 'dark'];

async function waitForAppReady(page) {
  await page.waitForFunction(
    () => {
      const loading = document.querySelector('.vp-app-loading');
      if (loading && loading.offsetParent !== null) return false;
      return Boolean(document.querySelector('.vp-hero-title, .vp-root'));
    },
    { timeout: 120000 },
  );
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('vp-theme', t);
  }, theme);
  await page.waitForTimeout(400);
}

async function dismissMobileNav(page) {
  const backdrop = page.locator('.vp-mobile-nav-backdrop');
  if (await backdrop.isVisible().catch(() => false)) {
    await backdrop.click({ force: true, timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
}

async function openCatalogue(page) {
  const isMobile = (page.viewportSize()?.width ?? 1440) < 768;
  if (isMobile) {
    await dismissMobileNav(page);
    await page.getByRole('button', { name: /menu/i }).first().click({ timeout: 12000 });
    await page.getByRole('button', { name: /^product$/i }).first().click({ timeout: 12000 });
    await page.getByRole('button', { name: /view all products by type/i }).first().click({ timeout: 12000 });
    await dismissMobileNav(page);
  } else {
    await page.getByRole('button', { name: /shop by product type/i }).first().click({ timeout: 12000 });
  }
  await page.waitForSelector('[data-screen-label="Catalogue"]', { timeout: 12000 });
}

async function openFilters(page) {
  const toggle = page.locator('.vp-catalogue-filter-toggle').first();
  if (await toggle.isVisible().catch(() => false)) {
    const open = await page.locator('.vp-catalogue-layout--filters-open').count();
    if (!open) {
      await toggle.click({ timeout: 8000 });
      await page.waitForTimeout(400);
    }
  }
}

async function clickMobileDrawerLink(page, pattern) {
  await page.locator('.vp-mobile-drawer-link').filter({ hasText: pattern }).first().click({ timeout: 12000 });
}

async function openNavScreen(page, { desktopNavPattern, mobileLabel, screenLabel }) {
  const isMobile = (page.viewportSize()?.width ?? 1440) < 768;
  if (isMobile) {
    await dismissMobileNav(page);
    await page.getByRole('button', { name: /menu/i }).first().click({ timeout: 12000 });
    await page.getByRole('button', { name: /news and update/i }).first().click({ timeout: 12000 });
    await page.getByRole('button', { name: mobileLabel }).first().click({ timeout: 12000 });
    await dismissMobileNav(page);
  } else {
    await page.getByRole('button', { name: desktopNavPattern }).first().hover({ timeout: 12000 });
    await page.waitForTimeout(300);
    await page.locator('.vp-nav-resources-card').filter({ hasText: mobileLabel }).first().click({ timeout: 12000 });
  }
  await page.waitForSelector(`[data-screen-label="${screenLabel}"], #vp-home-faq`, { timeout: 12000 });
}

const PAGES = [
  { id: 'home', label: 'Home', setup: async () => {} },
  {
    id: 'catalogue',
    label: 'Catalogue',
    setup: async (page) => {
      await openCatalogue(page);
    },
  },
  {
    id: 'catalogue-filtered',
    label: 'Catalogue (filtered)',
    setup: async (page) => {
      await openCatalogue(page);
      await openFilters(page);
      const firstOption = page.locator('.vp-filter-option').first();
      await firstOption.scrollIntoViewIfNeeded();
      await firstOption.click({ timeout: 12000 });
    },
  },
  {
    id: 'pdp',
    label: 'PDP',
    setup: async (page) => {
      await openCatalogue(page);
      await page.locator('article.vp-catalogue-card').first().click({ timeout: 12000 });
      await page.waitForSelector('[data-screen-label="Product detail"]', { timeout: 12000 });
    },
  },
  {
    id: 'about',
    label: 'About',
    setup: async (page) => {
      const isMobile = (page.viewportSize()?.width ?? 1440) < 768;
      if (isMobile) {
        await dismissMobileNav(page);
        await page.getByRole('button', { name: /menu/i }).first().click({ timeout: 12000 });
        await clickMobileDrawerLink(page, /^about us$/i);
        await dismissMobileNav(page);
      } else {
        await page.getByRole('button', { name: /^about us$/i }).first().click({ timeout: 12000 });
      }
      await page.waitForSelector('[data-screen-label="About"]', { timeout: 12000 });
    },
  },
  {
    id: 'contact',
    label: 'Contact',
    setup: async (page) => {
      const isMobile = (page.viewportSize()?.width ?? 1440) < 768;
      if (isMobile) {
        await dismissMobileNav(page);
        await page.getByRole('button', { name: /menu/i }).first().click({ timeout: 12000 });
        await clickMobileDrawerLink(page, /^contact us$/i);
        await dismissMobileNav(page);
      } else {
        await page.getByRole('button', { name: /^contact us$/i }).first().click({ timeout: 12000 });
      }
      await page.waitForSelector('[data-screen-label="Contact"]', { timeout: 12000 });
    },
  },
  {
    id: 'careers',
    label: 'Careers',
    setup: async (page) => {
      const isMobile = (page.viewportSize()?.width ?? 1440) < 768;
      if (isMobile) {
        await dismissMobileNav(page);
        await page.getByRole('button', { name: /menu/i }).first().click({ timeout: 12000 });
        await clickMobileDrawerLink(page, /^career$/i);
        await dismissMobileNav(page);
      } else {
        await page.getByRole('button', { name: /^career$/i }).first().click({ timeout: 12000 });
      }
      await page.waitForSelector('[data-screen-label="Careers"]', { timeout: 12000 });
    },
  },
  {
    id: 'blog',
    label: 'Blog',
    setup: async (page) => {
      await openNavScreen(page, {
        desktopNavPattern: /news and update/i,
        mobileLabel: /blog/i,
        screenLabel: 'Blog',
      });
    },
  },
  {
    id: 'faq',
    label: 'FAQ',
    setup: async (page) => {
      await openNavScreen(page, {
        desktopNavPattern: /news and update/i,
        mobileLabel: /faqs/i,
        screenLabel: 'FAQs',
      });
    },
  },
  {
    id: 'enquiry-modal',
    label: 'Enquiry modal',
    setup: async (page) => {
      await dismissMobileNav(page);
      await page.locator('.vp-enquiry-fab').first().click({ timeout: 12000 });
      await page.waitForSelector('.vp-enquiry-modal', { timeout: 12000 });
    },
  },
];

async function runAxeContrast(page) {
  return page.evaluate(async () => {
    if (!window.axe) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const results = await window.axe.run(document, {
      runOnly: { type: 'rule', values: ['color-contrast'] },
      rules: { 'color-contrast': { enabled: true } },
    });

    return results.violations.flatMap((violation) =>
      violation.nodes.map((node) => ({
        rule: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        html: node.html.slice(0, 200),
        target: node.target.slice(0, 3),
        failureSummary: node.failureSummary,
      })),
    );
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const allResults = [];
  const failureMap = new Map();

  for (const theme of themes) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: theme,
      });
      const page = await context.newPage();

      for (const pg of PAGES) {
        try {
          await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
          await waitForAppReady(page);
          await setTheme(page, theme);
          await pg.setup(page);
          await page.waitForTimeout(600);

          const violations = await runAxeContrast(page);
          const entry = {
            theme,
            viewport: viewport.name,
            page: pg.id,
            pageLabel: pg.label,
            violationCount: violations.length,
            violations,
          };
          allResults.push(entry);

          for (const v of violations) {
            const sig = `${v.target.join(' ')}|${v.failureSummary}`;
            if (!failureMap.has(sig)) {
              failureMap.set(sig, {
                ...v,
                occurrences: [],
              });
            }
            failureMap.get(sig).occurrences.push({ theme, viewport: viewport.name, page: pg.id });
          }

          console.log(
            `${theme.padEnd(5)} ${viewport.name.padEnd(14)} ${pg.id.padEnd(20)} ${violations.length} contrast issue(s)`,
          );
        } catch (error) {
          allResults.push({
            theme,
            viewport: viewport.name,
            page: pg.id,
            error: String(error),
          });
          console.log(`${theme} ${viewport.name} ${pg.id} ERROR: ${error.message}`);
        }
      }

      await context.close();
    }
  }

  await browser.close();

  const uniqueFailures = [...failureMap.values()].sort(
    (a, b) => b.occurrences.length - a.occurrences.length,
  );

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    summary: {
      totalChecks: allResults.length,
      checksWithViolations: allResults.filter((r) => (r.violationCount ?? 0) > 0).length,
      checksWithErrors: allResults.filter((r) => r.error).length,
      uniqueFailurePatterns: uniqueFailures.length,
      totalViolationInstances: allResults.reduce((sum, r) => sum + (r.violationCount ?? 0), 0),
    },
    uniqueFailures,
    allResults,
  };

  const reportPath = path.join(outDir, 'report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log('\n=== CONTRAST AUDIT SUMMARY ===');
  console.log(`Checks run: ${report.summary.totalChecks}`);
  console.log(`Checks with violations: ${report.summary.checksWithViolations}`);
  console.log(`Checks with errors: ${report.summary.checksWithErrors}`);
  console.log(`Unique failure patterns: ${report.summary.uniqueFailurePatterns}`);
  console.log(`Total violation instances: ${report.summary.totalViolationInstances}`);
  console.log(`Report: ${reportPath}`);

  if (uniqueFailures.length > 0 || report.summary.checksWithErrors > 0) {
    if (uniqueFailures.length > 0) {
      console.log('\n=== TOP UNIQUE FAILURES ===');
      uniqueFailures.slice(0, 20).forEach((f, i) => {
        console.log(`\n${i + 1}. ${f.failureSummary}`);
        console.log(`   Selector: ${f.target.join(' ')}`);
        console.log(`   Occurrences (${f.occurrences.length}): ${f.occurrences.map((o) => `${o.theme}/${o.viewport}/${o.page}`).join(', ')}`);
      });
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
