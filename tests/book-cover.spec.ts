import { expect, test } from '@playwright/test';

// The scripture book (app/components/vibe/ScriptureBook.tsx, book-cover.css): a foil-stamped cover that
// opens on a frontispiece picture facing the title page. The picture is one of the licensed photos,
// credited on /sources/; Data Saver fetches no picture and drops the credit.

test('the Gita book opens on its frontispiece, with a credit link for the picture', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scripture/bhagavadgita/');

  const book = page.locator('.sbook-wrap');
  await expect(book.locator('.sbook-cover-title')).toHaveText('श्रीमद्भगवद्गीता');
  await expect(book.locator('.sbook-frontis-art')).toHaveAttribute('data-photo', 'gita-chariot');
  const image = await book.locator('.sbook-frontis-art').evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(image).toContain('gita-chariot');

  // Reduce Motion shows the book already open: the cover lies back past the spine.
  const cover = await book.locator('.sbook-cover').evaluate((el) => getComputedStyle(el).transform);
  expect(cover).not.toBe('none');

  const credit = book.getByRole('link', { name: /Picture credit/ });
  await expect(credit).toHaveAttribute('href', '/sources/#picture-credits');
});

test('Data Saver shows the emblem in place of the picture and no credit', async ({ page }) => {
  // The saved choice, read by the early script in app/layout.tsx; setting the attribute by hand
  // is undone when the app applies its performance mode.
  await page.addInitScript(() => localStorage.setItem('dharma.perf.dataSaver', 'true'));
  await page.goto('/scripture/katha/');
  await expect(page.locator('html')).toHaveAttribute('data-data-saver', 'true');
  const book = page.locator('.sbook-wrap');
  await expect(book.locator('.sbook-frontis-art')).toBeHidden();
  await expect(book.getByRole('link', { name: /Picture credit/ })).toBeHidden();
});
