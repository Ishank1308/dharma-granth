import { expect, test } from '@playwright/test';

const gita = '/scripture/bhagavadgita/chapter/2/verse/47/';
const chapter = '/scripture/bhagavadgita/chapter/2/';
const ashtavakra = '/ashtavakra/1/3/';

function measureSanskrit(page: import('@playwright/test').Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const box = el.getBoundingClientRect();
    return {
      size: parseFloat(getComputedStyle(el).fontSize),
      lineHeight: parseFloat(getComputedStyle(el).lineHeight),
      left: box.left,
      right: box.right,
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    };
  });
}

test('dedicated reader uses readable fluid Sanskrit sizes on phone, tablet and desktop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const sizes: number[] = [];
  for (const width of [320, 390, 768, 1366]) {
    await page.setViewportSize({ width, height: 820 });
    if (!sizes.length) await page.goto(gita);
    const original = page.locator('#sanskrit-text');
    await expect(original).toBeVisible();
    const m = await measureSanskrit(page, '#sanskrit-text');
    expect(m.left).toBeGreaterThanOrEqual(-1);
    expect(m.right).toBeLessThanOrEqual(width + 1);
    expect(m.document).toBeLessThanOrEqual(width + 1);
    expect(m.lineHeight).toBeGreaterThan(m.size * 1.7);
    sizes.push(m.size);
  }
  expect(sizes[0]).toBeGreaterThanOrEqual(22);
  expect(sizes[1]).toBeGreaterThan(sizes[0]);
  expect(sizes[2]).toBeGreaterThan(sizes[1]);
  expect(sizes[3]).toBeGreaterThanOrEqual(sizes[2]);
});

test('manual text-size choices still override the responsive base', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(gita);
  const first = await measureSanskrit(page, '#sanskrit-text');
  // Sizes are chosen in the Aa sheet; the default is L.
  await page.getByRole('button', { name: /^Reader settings/ }).first().click();
  const sizes = page.getByRole('dialog', { name: /Reader settings/ }).getByRole('group', { name: /Sanskrit size/ });
  await sizes.getByText('S', { exact: true }).click();
  const smaller = await measureSanskrit(page, '#sanskrit-text');
  expect(smaller.size).toBeLessThan(first.size);
  await sizes.getByText('L', { exact: true }).click();
  const restored = await measureSanskrit(page, '#sanskrit-text');
  expect(restored.size).toBeGreaterThan(smaller.size);
});

test('chapter verse settings change both hydrated and plain verses', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(chapter);
  const list = page.locator('[data-verse-size]').first();
  await expect(list).toBeVisible();
  const text = page.locator('.verse-card.book-verse .verse-folio > p[lang="sa"]').first();
  await expect(text).toBeVisible();
  await list.evaluate((el) => el.setAttribute('data-verse-size', 'sm'));
  const small = await text.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  await list.evaluate((el) => el.setAttribute('data-verse-size', 'xl'));
  const extraLarge = await text.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(extraLarge).toBeGreaterThan(small);

  await list.evaluate((el) => el.setAttribute('data-verse-leading', 'compact'));
  const tight = await text.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
  await list.evaluate((el) => el.setAttribute('data-verse-leading', 'loose'));
  const loose = await text.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
  expect(loose).toBeGreaterThan(tight);
});

test('no-JavaScript chapter verses scale up without clipping or overflow', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 740 } });
  try {
    const page = await context.newPage();
    await page.goto(chapter);
    await expect(page.locator('.verse-card.vt').first()).toBeVisible();
    const small = await measureSanskrit(page, '.verse-card.vt .vt-sa');
    expect(small.size).toBeGreaterThanOrEqual(18);
    expect(small.document).toBeLessThanOrEqual(321);
    await page.setViewportSize({ width: 1366, height: 820 });
    const big = await measureSanskrit(page, '.verse-card.vt .vt-sa');
    expect(big.size).toBeGreaterThan(small.size);
    expect(big.document).toBeLessThanOrEqual(1367);
  } finally {
    await context.close();
  }
});

test('Ashtavakra verse also grows with available screen width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(ashtavakra);
  const selector = '.verse-leaf p[lang="sa"]';
  await expect(page.locator(selector)).toBeVisible();
  const phone = await measureSanskrit(page, selector);
  expect(phone.document).toBeLessThanOrEqual(321);
  await page.setViewportSize({ width: 1024, height: 820 });
  const tablet = await measureSanskrit(page, selector);
  expect(tablet.size).toBeGreaterThan(phone.size);
  expect(tablet.document).toBeLessThanOrEqual(1025);
});
