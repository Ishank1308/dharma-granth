import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const ALL_CURATED_SRCS = [
  '/images/curated/navratri/day-1-shailputri.webp',
  '/images/curated/navratri/day-2-brahmacharini.webp',
  '/images/curated/navratri/day-3-chandraghanta.webp',
  '/images/curated/navratri/day-4-kushmanda.webp',
  '/images/curated/navratri/day-5-skandamata.webp',
  '/images/curated/navratri/day-6-katyayani.webp',
  '/images/curated/navratri/day-7-kalaratri.webp',
  '/images/curated/navratri/day-8-mahagauri.webp',
  '/images/curated/navratri/day-9-siddhidatri.webp',
  '/images/curated/wisdom/dharyate-iti-dharmah.webp',
  '/images/curated/wisdom/gita-2-48.webp',
  '/images/curated/wisdom/gita-3-9.webp',
  '/images/curated/wisdom/gita-15-15.webp',
  '/images/curated/wisdom/isha-upanishad-6.webp',
  '/images/curated/wisdom/shvetashvatara-grace.webp',
  '/images/curated/wisdom/japa-mala-bhakti.webp',
  '/images/curated/scenes/diwali-ghat-celebration.webp',
  '/images/curated/scenes/temple-darshan-puja.webp',
  '/images/curated/scenes/temple-kirtan-satsang.webp',
  '/images/curated/scenes/devotional-veena.webp',
  '/images/curated/scenes/sacred-grove-tapovan.webp',
  '/images/curated/scenes/ghat-morning-offering.webp',
];

async function open(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

async function assertCuratedImagesLoaded(page: Page, selector = 'img[src^="/images/curated/"]', minCount = 1) {
  const imgs = page.locator(selector);
  const count = await imgs.count();
  expect(count).toBeGreaterThanOrEqual(minCount);
  for (let i = 0; i < count; i++) {
    const img = imgs.nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), { timeout: 10_000 })
      .toBe(true);
  }
}

test('all 22 curated WebP assets are served with image/webp and cache headers', async ({ request }) => {
  expect(ALL_CURATED_SRCS.length).toBe(22);
  for (const src of ALL_CURATED_SRCS) {
    const res = await request.get(src);
    expect(res.status(), `asset ${src}`).toBe(200);
    expect(res.headers()['content-type'] ?? '', `content-type for ${src}`).toContain('image/webp');
    expect(res.headers()['cache-control'] ?? '', `cache-control for ${src}`).toContain('max-age=604800');
    const body = await res.body();
    expect(body.byteLength, `non-empty ${src}`).toBeGreaterThan(10_000);
  }
});

test('home sanctuary gateway loads all 4 curated scene images and lazy-hydrated live Panchang', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await open(page, '/');
  const section = page.locator('section[aria-labelledby="home-sanctuary-heading"]');
  await section.scrollIntoViewIfNeeded();
  await assertCuratedImagesLoaded(page, 'section[aria-labelledby="home-sanctuary-heading"] img[src^="/images/curated/"]', 4);

  // Lazy-loaded HomeLivePanchang island hydrates sunrise/sunset summary on the client.
  await expect(section).toContainText('सूर्योदय', { timeout: 10_000 });
  expect(errors).toEqual([]);
});

test('Navaratri 9-day Navadurga gallery opens lightbox, supports keyboard navigation, and passes axe', async ({ page }) => {
  await open(page, '/festivals/navaratri/');

  // Contents list jumps to the Navadurga gallery section.
  const nav = page.locator('#main-content nav[aria-label="On this page"]');
  await expect(nav.locator('a[href="#navadurga-darshan"]')).toHaveCount(1);

  const gallery = page.locator('#navadurga-darshan');
  await expect(gallery).toBeVisible();
  await assertCuratedImagesLoaded(page, '#navadurga-darshan img[src^="/images/curated/navratri/"]', 9);

  // Open Day 1 lightbox
  await gallery.locator('button').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toContainText('Navratri Day 1 of 9');
  await expect(dialog.locator('a[download="dharma-granth-navratri-day-1-shailputri.webp"]')).toBeVisible();
  await expect(dialog.locator('a[href^="https://api.whatsapp.com/send?text="]')).toBeVisible();
  await assertCuratedImagesLoaded(page, '[role="dialog"] img[src^="/images/curated/navratri/"]', 1);

  // Keyboard navigation: ArrowRight -> Day 2, ArrowLeft -> Day 1
  await page.keyboard.press('ArrowRight');
  await expect(dialog).toContainText('Navratri Day 2 of 9');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog).toContainText('Navratri Day 1 of 9');

  // Accessibility check on the open modal
  const axe = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

  // Escape closes the lightbox cleanly
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('curated visuals render cleanly across scriptures, mantras, verses, concepts, and wisdom pathways', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  // Festivals hub: 9-day preview strip linking to Navaratri gallery
  await open(page, '/festivals/');
  await expect(page.locator('a[href="/festivals/navaratri/#navadurga-darshan"]').first()).toBeVisible();
  await assertCuratedImagesLoaded(page, '#main-content img[src^="/images/curated/"]', 9);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  // Durga Saptashati scripture page includes Navadurga gallery
  await open(page, '/scripture/durgasaptashati/');
  await expect(page.locator('#navadurga-darshan')).toBeVisible();

  // Devi Kavacham mantra page includes Navadurga gallery
  await open(page, '/mantras/devi-kavacham/');
  await expect(page.locator('#navadurga-darshan')).toBeVisible();

  // Bhagavad Gita 2.48 verse page renders its VersePosterSpotlight with download, share, and ImageObject JSON-LD
  await open(page, '/scripture/bhagavadgita/chapter/2/verse/48/');
  await assertCuratedImagesLoaded(page, 'img[src="/images/curated/wisdom/gita-2-48.webp"]', 1);
  await expect(page.locator('a[download="dharma-granth-gita-2-48.webp"]')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="verse-poster-gita-2-48"] a[href^="https://api.whatsapp.com/send?text="]')).toBeVisible();
  const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(jsonLdText ?? '').toContain('"ImageObject"');
  expect(jsonLdText ?? '').toContain('/images/curated/wisdom/gita-2-48.webp');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  // Concepts visual hub renders all 7 curated scriptural posters and opens an accessible lightbox
  await open(page, '/concepts/visuals/');
  await assertCuratedImagesLoaded(page, 'img[src^="/images/curated/wisdom/"]', 7);
  await page.locator('section[aria-labelledby="curated-posters-heading"] figure button').first().click();
  const posterDialog = page.getByRole('dialog');
  await expect(posterDialog).toBeVisible();
  await expect(posterDialog.locator('a[download^="dharma-granth-"]')).toBeVisible();
  await expect(posterDialog.locator('a[href^="https://api.whatsapp.com/send?text="]')).toBeVisible();
  const posterAxe = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(posterAxe.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(posterDialog).toHaveCount(0);

  // Wisdom pathways renders Tapovan scene + scriptural posters
  await open(page, '/wisdom-pathways/');
  await assertCuratedImagesLoaded(page, 'img[src^="/images/curated/"]', 7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test('Data Saver hides decorative curated editorial scenes cleanly', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dharma.perf.dataSaver', 'true'));
  await open(page, '/');
  await expect(page.locator('html')).toHaveAttribute('data-data-saver', 'true');
  await expect(page.locator('.curated-scene-media').first()).toBeHidden();
});
