import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

/**
 * Screenshot evidence is opt-in for audit PRs and CI manual runs. It never
 * changes the production site or adds runtime dependencies.
 *
 * Each image is a real Chromium rendering of the built static export, not
 * a mockup. Save independent JSON layout measurements alongside the PNG.
 */
test.skip(process.env.CAPTURE_UI_VISUAL_AUDIT !== 'true', 'Opt-in screenshot evidence run');

const ROUTES = [
  { id: 'home', url: '/' },
  { id: 'library', url: '/scriptures/' },
  { id: 'gita-index', url: '/scripture/bhagavadgita/' },
  { id: 'ramayana-index', url: '/scripture/ramayana/' },
  { id: 'devi-index', url: '/scripture/durgasaptashati/' },
  { id: 'long-index', url: '/scripture/bhagavatapurana/' },
  { id: 'gita-chapter', url: '/scripture/bhagavadgita/chapter/2/' },
  { id: 'gita-verse', url: '/scripture/bhagavadgita/chapter/2/verse/47/' },
  { id: 'ashtavakra', url: '/ashtavakra/1/' },
  { id: 'panchang', url: '/panchang/' },
  { id: 'practice', url: '/practice/' },
] as const;

const THEMES = ['sunset', 'night'] as const;
const WIDTHS = [320, 390, 768, 1280] as const;
const OUT = 'ui-audit-screenshots';

async function prepare(page: Page, url: string, theme: typeof THEMES[number], width: number) {
  await page.setViewportSize({ width, height: width >= 768 ? 900 : 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript((name) => localStorage.setItem('dharma-theme', name), theme);
  await page.goto(url);
  await expect(page.locator('h1').first()).toBeVisible();
  await page.evaluate(async () => {
    // Required for the real Sanskrit font to be settled before capture.
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
}

async function capture(page: Page, id: string, theme: string, width: number, zoom: boolean) {
  const filename = `${id}-${theme}-${width}${zoom ? '-text200' : ''}`;
  await mkdir(OUT, { recursive: true });
  const measurements = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const heading = h1?.getBoundingClientRect();
    const cs = h1 ? getComputedStyle(h1) : null;
    return {
      viewport: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      theme: document.documentElement.dataset.theme,
      heading: {
        text: h1?.textContent?.trim().slice(0, 160),
        left: heading?.left,
        right: heading?.right,
        top: heading?.top,
        height: heading?.height,
        fontSize: cs?.fontSize,
        lineHeight: cs?.lineHeight,
      },
      images: Array.from(document.querySelectorAll<HTMLImageElement>('main img')).slice(0, 40).map((img) => ({
        alt: img.alt.slice(0, 80),
        src: img.currentSrc.split('/').slice(-2).join('/').slice(0, 120),
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      })),
    };
  });
  await page.screenshot({ path: join(OUT, `${filename}-top.png`), animations: 'disabled', timeout: 20_000 });
  await writeFile(join(OUT, `${filename}-layout.json`), JSON.stringify(measurements, null, 2));
  expect(measurements.documentWidth, `Body overflow in ${filename}`).toBeLessThanOrEqual(width + 1);
  expect(measurements.theme, `Incorrect theme in ${filename}`).toBe(theme);
  const brokenImages = measurements.images.filter((img) => img.complete && img.naturalWidth === 0);
  expect(brokenImages, `Broken main-content images in ${filename}`).toEqual([]);
  expect(measurements.heading.left ?? -1, `Heading clipped on left: ${filename}`).toBeGreaterThanOrEqual(-1);
  expect(measurements.heading.right ?? width + 2, `Heading clipped on right: ${filename}`).toBeLessThanOrEqual(width + 1);
}

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    for (const route of ROUTES) {
      test(`visual audit ${route.id}: ${theme}, ${width}px`, async ({ page }) => {
        if (route.id === 'gita-chapter' || route.id === 'gita-verse') test.slow();
        await prepare(page, route.url, theme, width);
        await capture(page, route.id, theme, width, false);

        if (route.id === 'gita-index' || route.id === 'ramayana-index' || route.id === 'devi-index') {
          const illustrations = page.locator('section[aria-labelledby="chapter-highlights-title"]');
          if (await illustrations.count()) {
            await illustrations.screenshot({
              path: join(OUT, `${route.id}-${theme}-${width}-illustrations.png`),
              animations: 'disabled',
              timeout: 20_000,
            });
          }
        }
        if (route.id === 'gita-chapter' || route.id === 'gita-verse') {
          const verse = page.locator('[id^="verse-"]').first();
          if (await verse.count()) {
            await verse.scrollIntoViewIfNeeded();
            await page.screenshot({
              path: join(OUT, `${route.id}-${theme}-${width}-verse.png`),
              animations: 'disabled',
              timeout: 20_000,
            });
          }
        }
      });
    }
  }

  for (const route of ROUTES.filter((r) => ['home', 'gita-index', 'long-index', 'gita-chapter', 'ashtavakra'].includes(r.id))) {
    test(`200% text resize ${route.id}: ${theme}, 390px`, async ({ page }) => {
      if (route.id === 'gita-chapter') test.slow();
      await prepare(page, route.url, theme, 390);
      await page.evaluate(async () => {
        document.documentElement.style.fontSize = '200%';
        await document.fonts.ready;
      });
      await capture(page, route.id, theme, 390, true);
    });
  }
}
