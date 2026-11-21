import { expect, test } from '@playwright/test';

/**
 * On a phone the Library's compact view lists each text as one short row (name, kind, size) that
 * opens on a tap; the fuller card returns from 640px (app/components/library/LibraryCard.tsx).
 */

const cardFor = (page: import('@playwright/test').Page) => page.locator('article').filter({ hasText: 'Ishavashya Upanishad' }).first();

test('on a phone the Library lists each text as one short row that opens on a tap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/scriptures/');

  const row = cardFor(page);
  await row.scrollIntoViewIfNeeded();
  const box = (await row.boundingBox())!;
  expect(box.height).toBeLessThan(130);
  await expect(row).toContainText('Upanishads · 1 chapter · 18 verses');
  // The description and badges wait for the text's own page.
  await expect(row.getByText(/One of the shortest/)).toBeHidden();

  // Saving a text does not open it.
  await row.getByRole('button', { name: 'Save Isha Upanishad' }).click();
  await expect(row.getByRole('button', { name: 'Remove Isha Upanishad from saved' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/scriptures\/$/);

  // A tap anywhere else on the row does.
  await row.click({ position: { x: 60, y: Math.round(box.height / 2) } });
  await expect(page).toHaveURL(/\/scripture\/ishavasya\/?$/);
});

test('from tablet width up the Library keeps its full cards', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/scriptures/');

  const card = cardFor(page);
  await expect(card.getByText(/One of the shortest/)).toBeVisible();
  await expect(card.getByText('Reading level: Introductory')).toBeVisible();
  await expect(card.getByRole('link', { name: 'Start reading Isha Upanishad' })).toBeVisible();
});
