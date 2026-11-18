import { expect, test } from '@playwright/test';

/** Splitting words must remain a reading aid: it cannot replace the canonical scripture. */
test('chapter padaccheda keeps original Sanskrit, verse number and recitation text visible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scripture/ishavasya/chapter/1/');

  const card = page.locator('article.verse-card:not(.vt)#verse-4');
  await card.scrollIntoViewIfNeeded();
  const source = card.locator('.verse-folio > p[lang="sa"]');
  await expect(source).toBeVisible();

  const canonicalText = await source.innerText();
  expect(canonicalText.trim().length).toBeGreaterThan(15);
  await expect(source.locator('.verse-mark')).toContainText('॥ 4 ॥');

  const toolbar = card.getByRole('group', { name: 'श्लोक विकल्प (Verse actions)' });
  await toolbar.getByRole('button', { name: 'और विकल्प · More actions' }).click();
  await page.getByRole('menuitem', { name: /पदच्छेद विच्छेद दृश्य/ }).click();

  await expect(source).toBeVisible();
  expect(await source.innerText()).toBe(canonicalText);
  await expect(card.getByRole('group', { name: /पदच्छेद और शब्दार्थ/ })).toBeVisible();

  await toolbar.getByRole('button', { name: 'और विकल्प · More actions' }).click();
  await page.getByRole('menuitem', { name: /संयुक्त श्लोक दृश्य/ }).click();
  await expect(source).toBeVisible();
  expect(await source.innerText()).toBe(canonicalText);
  await expect(card.getByRole('group', { name: /पदच्छेद और शब्दार्थ/ })).toHaveCount(0);
});
