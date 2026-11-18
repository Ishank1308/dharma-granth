import { expect, test } from '@playwright/test';

/** Editorial prose accidentally stored in a word-meaning field is not a Sanskrit glossary. */
test('chapter reader retains the canonical verse and hides false padaccheda controls', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scripture/ishavasya/chapter/1/');

  await page.locator('#verse-4').scrollIntoViewIfNeeded();
  const card = page.locator('article.verse-card:not(.vt)#verse-4');
  const source = card.locator('.verse-folio > p[lang="sa"]');
  await expect(source).toBeVisible();
  await expect(source.locator('.verse-mark')).toContainText('॥ 4 ॥');

  const toolbar = card.getByRole('group', { name: 'श्लोक विकल्प (Verse actions)' });
  await toolbar.getByRole('button', { name: 'और विकल्प · More actions' }).click();
  await expect(page.getByRole('menuitem', { name: /पदच्छेद विच्छेद दृश्य/ })).toHaveCount(0);
  await expect(source).toBeVisible();
});
