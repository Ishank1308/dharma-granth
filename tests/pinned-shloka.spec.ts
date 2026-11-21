import { expect, test } from '@playwright/test';

/**
 * The shloka stays beside its commentary (app/components/reader/PinnedShloka.tsx): once the
 * verse has scrolled off the top of a verse page, the whole shloka is still in reach.
 * The verse is Gita 2.47.
 */

const verse = '/scripture/bhagavadgita/chapter/2/verse/47/';
const FIRST_WORD = 'कर्मण्येवाधिकारस्ते';
const LAST_WORD = 'सङ्गोऽस्त्वकर्मणि';

const scrollIntoCommentary = (page: import('@playwright/test').Page) => page.evaluate(() => window.scrollTo(0, 1400));

test('wide screens show the whole shloka in the sidebar while the commentary is read', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(verse);
  const original = page.locator('#sanskrit-text');
  const pinned = page.locator('[data-pinned-shloka="aside"]');
  await expect(original).toBeInViewport();
  await expect(pinned).toHaveCount(0);

  await scrollIntoCommentary(page);
  await expect(original).not.toBeInViewport();
  await expect(pinned).toBeInViewport();
  // The whole verse, first word to last, with nothing clipped.
  await expect(pinned).toContainText(FIRST_WORD);
  await expect(pinned).toContainText(LAST_WORD);
  const clipped = await pinned.locator('p[lang="sa"]').evaluate((el) => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1);
  expect(clipped).toBe(false);
  // The verse numbers are still there under it.
  await expect(page.getByRole('navigation', { name: 'Verses in this chapter' })).toBeVisible();

  await pinned.getByRole('button', { name: /Back to the verse/ }).click();
  await expect(original).toBeInViewport();
  await expect(pinned).toHaveCount(0);
});

test('phones offer the shloka, and keep it pinned once the reader takes it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(verse);
  const offer = page.getByRole('button', { name: /श्लोक देखें/ });
  const pinned = page.locator('[data-pinned-shloka="bar"]');
  await expect(page.locator('#sanskrit-text')).toBeInViewport();
  await expect(offer).toHaveCount(0);
  await expect(pinned).toHaveCount(0);

  await scrollIntoCommentary(page);
  await expect(offer).toBeInViewport();
  await offer.click();
  await expect(pinned).toBeInViewport();
  await expect(pinned).toContainText(FIRST_WORD);
  await expect(pinned).toContainText(LAST_WORD);

  // The choice is kept on the device: the next visit pins the verse without asking.
  await page.reload();
  await scrollIntoCommentary(page);
  await expect(pinned).toBeInViewport();

  await pinned.getByRole('button', { name: /Unpin the verse/ }).click();
  await expect(pinned).toHaveCount(0);
  await expect(offer).toBeInViewport();
});
