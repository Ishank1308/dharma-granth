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


test('long chapter indexes start with 20 cards and allow all or direct range selection', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scripture/bhagavatapurana/');

  const contents = page.locator('section[aria-labelledby="contents-heading"]');
  const cards = contents.locator('ol > li');
  const all = page.getByRole('group', { name: 'Chapter range filter' }).getByRole('button', { name: /^All/ });
  const range = page.getByRole('combobox', { name: 'Choose chapter range' });
  await expect(range).toBeVisible();
  await expect(cards).toHaveCount(20);
  await expect(all).toHaveAttribute('aria-pressed', 'false');
  await expect(contents.getByRole('status')).toContainText('20 of');

  await range.selectOption({ index: 2 });
  await expect(cards).toHaveCount(20);
  await expect(range).toHaveValue('21');
  await expect(contents.locator('a[href="/scripture/bhagavatapurana/chapter/21/"]')).toBeVisible();

  await all.click();
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  expect(await cards.count()).toBeGreaterThan(60);

  // Searching must cover the whole book even when a range was selected.
  await range.selectOption({ index: 1 });
  const search = page.getByRole('searchbox', { name: 'Filter chapters by number or title' });
  await search.fill('50');
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await expect(contents.locator('a[href="/scripture/bhagavatapurana/chapter/50/"]')).toBeVisible();

  // A new range choice overrides the search, not merely the highlighted chip.
  await range.selectOption({ index: 2 });
  await expect(search).toHaveValue('');
  await expect(cards).toHaveCount(20);
  await search.fill('50');
  await page.getByRole('button', { name: 'Clear chapter filter' }).click();
  await expect(cards).toHaveCount(20);
  await expect(range).toHaveValue('1');
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(321);
});

test('short scripture indexes keep all chapters visible without the long-book controls', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/');
  const contents = page.locator('section[aria-labelledby="contents-heading"]');
  await expect(contents.locator('ol > li')).toHaveCount(18);
  await expect(page.getByRole('combobox', { name: 'Choose chapter range' })).toHaveCount(0);
});

test('last-read chapter remains discoverable in compact long-book contents', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('dharma.recentChapters', JSON.stringify([{
      scriptureId: 'bhagavatapurana',
      scriptureTitle: 'Bhagavata Purana',
      chapterId: 50,
      chapterTitle: 'Chapter 50',
      totalChapters: 335,
      readAt: '2026-11-18T04:00:00.000Z',
    }]));
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/scripture/bhagavatapurana/');

  const contents = page.locator('section[aria-labelledby="contents-heading"]');
  const cards = contents.locator('ol > li');
  await expect(cards).toHaveCount(20);
  const saved = page.getByRole('region', { name: /Continue reading/ });
  await expect(saved.getByRole('link', { name: /Resume reading/ })).toHaveAttribute(
    'href', '/scripture/bhagavatapurana/chapter/50/',
  );
  await saved.getByRole('button', { name: 'Find chapter 50 in contents' }).click();
  await expect(cards).toHaveCount(20);

  const target = contents.locator('a[href="/scripture/bhagavatapurana/chapter/50/"]');
  await expect(target).toBeVisible();
  await expect(target).toBeFocused();
  await expect(contents.getByRole('combobox', { name: 'Choose chapter range' })).toHaveValue('41');
  await expect(contents.getByRole('status')).toContainText('20 of');
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(321);
});

test('short books do not show the compact last-read locator', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('dharma.recentChapters', JSON.stringify([{
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      chapterId: 9,
      chapterTitle: 'Chapter 9',
      totalChapters: 18,
      readAt: '2026-11-18T04:00:00.000Z',
    }]));
  });
  await page.goto('/scripture/bhagavadgita/');
  await expect(page.getByRole('region', { name: /Continue reading/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Find chapter .* in contents/ })).toHaveCount(0);
});
