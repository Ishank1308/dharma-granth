import { expect, test } from '@playwright/test';

const chapter = '/scripture/bhagavadgita/chapter/2/';

test('reading-depth radios have one Tab stop and arrow navigation does not change chapters', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('dharma.readingDepth', 'read'));
  await page.goto(chapter);

  // Reading depth lives in the Aa sheet with the other reading choices.
  await page.getByRole('button', { name: /Reader settings/ }).click();
  const group = page.getByRole('radiogroup', { name: /Reading depth/ });
  await expect(group).toBeVisible();

  const radios = group.getByRole('radio');
  await expect(radios).toHaveCount(3);
  await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(0)).toHaveAttribute('tabindex', '0');
  await expect(radios.nth(1)).toHaveAttribute('tabindex', '-1');

  await radios.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
  await expect(radios.nth(1)).toHaveAttribute('tabindex', '0');
  await expect(radios.nth(0)).toHaveAttribute('tabindex', '-1');
  await expect(page).toHaveURL(/\/scripture\/bhagavadgita\/chapter\/2\/?$/);

  await page.keyboard.press('End');
  await expect(radios.nth(2)).toBeFocused();
  await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');

  await page.keyboard.press('Home');
  await expect(radios.nth(0)).toBeFocused();
  await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');

  await page.keyboard.press('ArrowLeft');
  await expect(radios.nth(2)).toBeFocused();
  await expect(page).toHaveURL(/\/scripture\/bhagavadgita\/chapter\/2\/?$/);

  const height = await radios.nth(2).evaluate((el) => el.getBoundingClientRect().height);
  expect(height).toBeGreaterThanOrEqual(44);
});

test('opening ordinary verse explanation does not fetch full verse-page extras', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dharma.readingDepth', 'read'));
  await page.goto(chapter);
  await page.locator('#verse-47').scrollIntoViewIfNeeded();

  const card = page.locator('article.verse-card:not(.vt)#verse-47');
  const study = card.getByRole('button', { name: /Verse study/ });
  await expect(study).toHaveAttribute('aria-expanded', 'false');

  await study.click();
  await expect(study).toHaveAttribute('aria-expanded', 'true');
  await expect(card.locator('.verse-study-panel')).toBeVisible();
  await expect(card.locator('.verse-page-extras')).toHaveCount(0);

  const extra = card.getByRole('button', { name: /Show more study details/ });
  await expect(extra).toBeVisible();
  await extra.click();
  await expect(card.locator('.verse-page-extras')).toBeVisible({ timeout: 30_000 });
});

test('saved Understand preference opens explanations without automatic motion', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dharma.readingDepth', 'understand'));
  await page.goto(chapter);

  const card = page.locator('article.verse-card:not(.vt)').first();
  const study = card.getByRole('button', { name: /Verse study/ });
  // Returning readers may prefer expanded notes; hydration must not animate all of them.
  await expect(study).toHaveAttribute('aria-expanded', 'true');
  const panel = card.locator('.verse-study-panel');
  await expect(panel).toBeVisible();
  await expect(panel).not.toHaveClass(/liquid-reveal/);

  await study.click();
  await expect(study).toHaveAttribute('aria-expanded', 'false');
  await study.click();
  await expect(study).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toHaveClass(/liquid-reveal/);
});

test('first-time readers see Sanskrit and meaning, with optional study folded', async ({ page }) => {
  await page.goto(chapter);

  await page.getByRole('button', { name: /Reader settings/ }).click();
  const group = page.getByRole('radiogroup', { name: /Reading depth/ });
  await expect(group.getByRole('radio').nth(0)).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(group).toBeHidden();

  const card = page.locator('article.verse-card:not(.vt)').first();
  await expect(card.locator('.verse-folio > p[lang="sa"]')).toBeVisible();
  await expect(card.locator('section[id$="-arth"]')).toBeVisible();

  const study = card.getByRole('button', { name: /Verse study/ });
  await expect(study).toHaveAttribute('aria-expanded', 'false');
  await study.click();
  await expect(card.locator('.verse-study-panel')).toBeVisible();
});
