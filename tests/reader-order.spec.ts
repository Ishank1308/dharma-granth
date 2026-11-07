import { expect, test } from '@playwright/test';

test('verse reader presents the source and meaning before editorial insight', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/verse/47/');
  const source = page.locator('#layer-sanskrit');
  const meaning = page.locator('#layer-hindi');
  const marma = page.getByTestId('reader-marma');
  await expect(source).toBeVisible();
  await expect(meaning).toBeVisible();
  await expect(marma).toBeVisible();
  const order = await page.evaluate(() => {
    const source = document.querySelector('#layer-sanskrit');
    const meaning = document.querySelector('#layer-hindi');
    const marma = document.querySelector('[data-testid="reader-marma"]');
    if (!source || !meaning || !marma) return false;
    return Boolean(source.compareDocumentPosition(meaning) & Node.DOCUMENT_POSITION_FOLLOWING)
      && Boolean(meaning.compareDocumentPosition(marma) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(order).toBe(true);
  await expect(marma).toContainText('Editorial, not scripture');

  const answers = page.locator('section[aria-labelledby="verse-answers"]');
  await expect(answers).toBeVisible();
});

test('chapter study shows related questions once after grouping', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await page.locator('#verse-47').scrollIntoViewIfNeeded();
  const card = page.locator('article.verse-card:not(.vt)#verse-47');
  const trigger = card.getByRole('button', { name: /Verse study/ });
  if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
  const extras = card.locator('.verse-page-extras');
  await expect(extras).toBeVisible({ timeout: 30000 });
  await expect(extras.getByText('Questions this verse answers')).toHaveCount(1);
});
