import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT_DIR = resolve('C:/Users/ishan/.gemini/antigravity/brain/009495ac-d85e-45fa-965a-271b5a03bc10/screenshots');
if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

const PORT = process.env.PORT || '4180';
const BASE_URL = `http://localhost:${PORT}`;

const THEMES = ['day', 'sunset', 'paper', 'night'];
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 850 },
  { name: 'phone', width: 390, height: 844 },
];

async function capture() {
  console.log('Starting screenshot capture against', BASE_URL);
  const browser = await chromium.launch({ headless: true });

  // First warm up the pages in dev server
  const warmupContext = await browser.newContext();
  const warmupPage = await warmupContext.newPage();
  console.log('Warming up home page...');
  await warmupPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await warmupPage.waitForTimeout(2000);
  console.log('Warming up verse page...');
  await warmupPage.goto(`${BASE_URL}/scripture/bhagavadgita/chapter/2/verse/47/`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await warmupPage.waitForTimeout(2000);
  console.log('Warming up preview page...');
  await warmupPage.goto(`${BASE_URL}/design-system-preview/`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await warmupPage.waitForTimeout(2000);
  await warmupContext.close();

  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      console.log(`\n=== Capturing ${theme} on ${vp.name} ===`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      // Set theme via init script
      await page.addInitScript((t) => {
        localStorage.setItem('dharma_theme', t);
        localStorage.setItem('dharma-theme', t);
        document.documentElement.setAttribute('data-theme', t);
      }, theme);

      // 1. Home - Verse of the Day
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.waitForTimeout(1000);

      const votdCard = page.locator('.verse-card.today-verse, section.verse-card').first();
      if (await votdCard.count() > 0) {
        await votdCard.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        const votdPath = resolve(OUT_DIR, `home-votd-${theme}-${vp.name}.png`);
        await votdCard.screenshot({ path: votdPath });
        console.log(`Saved ${votdPath}`);
      }
      const homeViewportPath = resolve(OUT_DIR, `home-viewport-${theme}-${vp.name}.png`);
      await page.screenshot({ path: homeViewportPath });
      console.log(`Saved ${homeViewportPath}`);

      // 2. Single Verse Page (Gita 2.47)
      await page.goto(`${BASE_URL}/scripture/bhagavadgita/chapter/2/verse/47/`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.waitForTimeout(1000);

      const singleVerseCard = page.locator('.verse-card.single-verse, .verse-card').first();
      if (await singleVerseCard.count() > 0) {
        await singleVerseCard.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        const verseCardPath = resolve(OUT_DIR, `single-verse-card-${theme}-${vp.name}.png`);
        await singleVerseCard.screenshot({ path: verseCardPath });
        console.log(`Saved ${verseCardPath}`);
      }
      const versePagePath = resolve(OUT_DIR, `single-verse-page-${theme}-${vp.name}.png`);
      await page.screenshot({ path: versePagePath });
      console.log(`Saved ${versePagePath}`);

      await context.close();
    }
  }

  // Capture design-system-preview and dedicated 3D Tadpatra closeups
  for (const vp of VIEWPORTS) {
    const previewContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const previewPage = await previewContext.newPage();
    for (const theme of THEMES) {
      await previewPage.goto(`${BASE_URL}/design-system-preview/`, { waitUntil: 'networkidle', timeout: 60000 });
      await previewPage.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await previewPage.waitForTimeout(800);

      // Full preview page
      if (vp.name === 'desktop') {
        const prevPath = resolve(OUT_DIR, `preview-${theme}-desktop.png`);
        await previewPage.screenshot({ path: prevPath });
        console.log(`Saved ${prevPath}`);
      }

      // Targeted 3D Tadpatra (Palm-leaf Rigveda card) closeup
      const tadpatra = previewPage.getByTestId('preview-card-rigveda');
      if (await tadpatra.count() > 0) {
        await tadpatra.scrollIntoViewIfNeeded();
        await previewPage.waitForTimeout(500);
        const tadpatraPath = resolve(OUT_DIR, `tadpatra-card-${theme}-${vp.name}.png`);
        await tadpatra.screenshot({ path: tadpatraPath });
        console.log(`Saved ${tadpatraPath}`);

        // Also capture folio closeup
        const folio = tadpatra.locator('.verse-folio');
        if (await folio.count() > 0) {
          const folioPath = resolve(OUT_DIR, `tadpatra-folio-${theme}-${vp.name}.png`);
          await folio.screenshot({ path: folioPath });
          console.log(`Saved ${folioPath}`);
        }
      }
    }
    await previewContext.close();
  }

  await browser.close();
  console.log('\nAll theme & device previews captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
