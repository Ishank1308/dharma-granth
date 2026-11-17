import { expect, test } from '@playwright/test';

const verseUrl = '/scripture/bhagavadgita/chapter/2/verse/47/';

test('verse study path follows the Sanskrit, navigates to real layers, and resizes text', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(verseUrl);

  const source = page.locator('#layer-sanskrit');
  const guide = page.getByRole('navigation', { name: /Verse study guide/ });
  await expect(source).toBeVisible();
  await expect(guide).toBeVisible();

  const sourceBeforeGuide = await source.evaluate((node) => {
    const guideNode = document.getElementById('reader-study-guide');
    return Boolean(guideNode && (node.compareDocumentPosition(guideNode) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  expect(sourceBeforeGuide).toBe(true);

  const vyakhya = guide.getByRole('link', { name: /व्याख्या/ });
  await expect(vyakhya).toBeVisible();
  await vyakhya.click();
  await expect(page).toHaveURL(/#reader-study-bhagavadgita-2-47-vyakhya$/);
  await expect(page.locator('#reader-study-bhagavadgita-2-47-vyakhya')).toBeVisible();

  const sanskrit = page.locator('#sanskrit-text');
  const before = await sanskrit.getAttribute('class');
  await guide.getByRole('button', { name: 'Decrease verse and translation text size' }).click();
  await expect(sanskrit).not.toHaveAttribute('class', before ?? '');
});

test('verse study controls fit 320px and work in both supported themes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(verseUrl);

  const guide = page.getByRole('navigation', { name: /Verse study guide/ });
  await expect(guide.getByRole('button', { name: 'Increase verse and translation text size' })).toBeVisible();
  await expect(guide.getByRole('link', { name: /Sources and edition/ })).toHaveAttribute('href', '#layer-sources');

  for (const theme of ['sunset', 'night']) {
    await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth,
      page: document.documentElement.scrollWidth,
      guide: document.getElementById('reader-study-guide')?.getBoundingClientRect().width ?? 0,
    }));
    expect(layout.page, `horizontal page overflow in ${theme}`).toBeLessThanOrEqual(layout.viewport + 1);
    expect(layout.guide).toBeGreaterThan(0);
    expect(layout.guide).toBeLessThanOrEqual(layout.viewport);
  }
});
