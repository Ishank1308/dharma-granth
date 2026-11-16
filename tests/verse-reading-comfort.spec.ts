import { expect, test } from '@playwright/test';

const chapter = '/scripture/bhagavadgita/chapter/2/';

test('interactive verse keeps the Sanskrit and meaning within readable line measures', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 850 });
  await page.goto(chapter);
  const card = page.locator('.verse-card.book-verse').first();
  await expect(card).toBeVisible();

  const sanskrit = card.locator('.verse-folio > p[lang="sa"]');
  const meaning = card.locator('section[id$="-arth"] > div').first();
  await expect(sanskrit).toBeVisible();
  await expect(meaning).toBeVisible();

  const measurements = await page.evaluate(() => {
    const root = document.querySelector('.verse-card.book-verse')!;
    const original = root.querySelector('.verse-folio > p[lang="sa"]')!;
    const meaning = root.querySelector('section[id$="-arth"] > div')!;
    return {
      originalMax: getComputedStyle(original).maxInlineSize,
      meaningMax: getComputedStyle(meaning).maxInlineSize,
      originalWidth: original.getBoundingClientRect().width,
      meaningWidth: meaning.getBoundingClientRect().width,
      cardWidth: root.getBoundingClientRect().width,
    };
  });

  expect(measurements.originalMax).not.toBe('none');
  expect(measurements.meaningMax).not.toBe('none');
  expect(measurements.originalWidth).toBeLessThanOrEqual(measurements.cardWidth);
  expect(measurements.meaningWidth).toBeLessThanOrEqual(measurements.cardWidth);
});

test('static, no-JavaScript verse has the same reading-width rules', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1366, height: 850 } });
  try {
    const page = await context.newPage();
    await page.goto(chapter);
    const card = page.locator('.verse-card.vt').first();
    await expect(card).toBeVisible();
    await expect(card.locator('.vt-sa')).toBeVisible();
    expect(await card.locator('.vt-sa').evaluate((el) => getComputedStyle(el).maxInlineSize)).not.toBe('none');
    const meaning = card.locator('.vt-block').first();
    await expect(meaning).toBeVisible();
    expect(await meaning.evaluate((el) => getComputedStyle(el).maxInlineSize)).not.toBe('none');
  } finally {
    await context.close();
  }
});

test('verse remains within a narrow phone viewport without hiding study actions', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(chapter);
  const card = page.locator('.verse-card.book-verse').first();
  await expect(card).toBeVisible();

  const original = card.locator('.verse-folio > p[lang="sa"]');
  const folio = card.locator('.verse-folio');
  const originalBox = await original.boundingBox();
  const folioBox = await folio.boundingBox();
  expect(originalBox).not.toBeNull();
  expect(folioBox).not.toBeNull();
  expect(originalBox!.x).toBeGreaterThanOrEqual(0);
  expect(originalBox!.x + originalBox!.width).toBeLessThanOrEqual(321);
  expect(folioBox!.x + folioBox!.width).toBeLessThanOrEqual(321);

  const toolbar = card.getByRole('group', { name: /Verse actions/ });
  await expect(toolbar).toBeVisible();
  await expect(toolbar.getByRole('button', { name: /Bookmark/ })).toBeVisible();
});
