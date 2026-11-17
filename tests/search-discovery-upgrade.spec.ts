import { expect, test } from '@playwright/test';

async function openSearch(page: import('@playwright/test').Page) {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Global Search' });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  return { dialog, input };
}

test('homepage quick queries open search with the selected bilingual example', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Search example: गीता 2.47' }).click();
  const modal = page.getByRole('dialog', { name: 'Global Search' });
  await expect(modal.getByRole('combobox')).toHaveValue('Gita 2.47');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
});

test('Tab leaves the combobox even with an autocomplete suggestion', async ({ page }) => {
  const { dialog, input } = await openSearch(page);
  await input.fill('git');
  await page.keyboard.press('Tab');
  await expect(input).not.toBeFocused();
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"][aria-label="Global Search"]')))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('first ArrowDown highlights the first result and exposes aria-activedescendant', async ({ page }) => {
  const { dialog, input } = await openSearch(page);
  await input.fill('karma');
  const first = dialog.getByRole('option').first();
  await expect(first).toBeVisible();
  await expect(first).toHaveAttribute('aria-selected', 'false');
  await input.press('ArrowDown');
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(input).toHaveAttribute('aria-activedescendant', await first.getAttribute('id') ?? '');
  await input.press('ArrowUp');
  const last = dialog.getByRole('option').last();
  await expect(last).toHaveAttribute('aria-selected', 'true');
});

test('a narrow category with zero matches can be cleared without losing the query', async ({ page }) => {
  const { dialog, input } = await openSearch(page);
  await input.fill('gita');
  const facets = dialog.getByRole('group', { name: 'Show results from' });
  const scripture = facets.getByRole('button', { name: /ग्रंथ.*Scriptures/ });
  await expect(scripture).toBeVisible();
  await scripture.click();
  await input.fill('meditation timer');
  const recover = dialog.getByRole('button', { name: 'Show all results' });
  await expect(recover).toBeVisible();
  await expect(input).toHaveValue('meditation timer');
  await recover.click();
  await expect(dialog.getByRole('option').first()).toBeVisible();
  await expect(input).toHaveValue('meditation timer');
});

test('mobile search filters and clear control meet a 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  const { dialog, input } = await openSearch(page);
  await input.fill('karma');
  const filter = dialog.getByRole('group', { name: 'Show results from' }).getByRole('button', { name: /All/ });
  await expect(filter).toBeVisible();
  const clear = dialog.getByRole('button', { name: 'Clear search' });
  for (const button of [filter, clear]) {
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
});


test('scripture library can expand a query to the entire site search without retyping', async ({ page }) => {
  await page.goto('/scriptures/');
  const catalogInput = page.getByRole('searchbox', { name: 'Search scriptures' });
  await catalogInput.fill('karma');
  const expand = page.getByRole('button', { name: 'Search all content for karma' });
  await expect(expand).toBeVisible();
  await expand.click();
  const dialog = page.getByRole('dialog', { name: 'Global Search' });
  await expect(dialog.getByRole('combobox')).toHaveValue('karma');
});
