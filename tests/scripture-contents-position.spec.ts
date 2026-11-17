import { expect, test } from '@playwright/test';

test('continue reading describes chapter position rather than claiming completion', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('dharma.recentChapters', JSON.stringify([{
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      chapterId: 9,
      chapterTitle: 'Chapter 9',
      totalChapters: 18,
      readAt: '2026-11-17T12:00:00.000Z',
    }]));
  });
  await page.goto('/scripture/bhagavadgita/');

  const resume = page.getByRole('region', { name: /Continue reading/ });
  await expect(resume).toContainText('Adhyay 9 of 18');
  await expect(resume).toContainText('last opened, not completion');
  await expect(resume.getByRole('img', { name: /Chapter position 9 of 18; this does not indicate completion/ })).toBeVisible();
  await expect(resume.getByRole('progressbar', { name: /Reading progress/ })).toHaveCount(0);
});

test('long scripture navigation announces filtered counts with accessible mobile targets', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scripture/bhagavatapurana/');

  const range = page.getByRole('group', { name: 'Chapter range filter' });
  await expect(range).toBeVisible();
  const all = range.getByRole('button', { name: /^All/ });
  const size = await all.boundingBox();
  expect(size).not.toBeNull();
  expect(size!.height).toBeGreaterThanOrEqual(43);

  const search = page.getByRole('searchbox', { name: 'Filter chapters by number or title' });
  await expect(search).toBeVisible();
  await search.fill('999999');
  await expect(page.locator('section[aria-labelledby="contents-heading"] [role="status"]')).toContainText('0 of');
  await expect(page.getByText('कोई अध्याय नहीं मिला।')).toBeVisible();

  const clear = page.getByRole('button', { name: 'Clear chapter filter' });
  const clearBox = await clear.boundingBox();
  expect(clearBox).not.toBeNull();
  expect(clearBox!.height).toBeGreaterThanOrEqual(43);
  await clear.click();
  await expect(search).toHaveValue('');

  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(321);
});
