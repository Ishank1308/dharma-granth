import { expect, test } from '@playwright/test';

test('only Light and Dark appear in the site header, with Light using the existing sunset palette', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('meta[name="dharma-theme-options"]')).toHaveAttribute('content', 'sunset,night');
  await expect(page.locator('[data-site-header="true"]')).toHaveAttribute('data-theme-options', 'sunset,night');

  const picker = page.getByRole('button', { name: /थीम बदलें/ });
  await picker.click();
  const menu = page.getByRole('menu', { name: /Theme/ });
  await expect(menu.getByRole('menuitemradio')).toHaveCount(2);
  await expect(menu.getByRole('menuitemradio', { name: /Light/ })).toBeVisible();
  await expect(menu.getByRole('menuitemradio', { name: /Dark/ })).toBeVisible();

  await menu.getByRole('menuitemradio', { name: /Light/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
  const lightBackground = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--dharma-bg').trim(),
  );
  expect(lightBackground.toLowerCase()).toBe('#fff4e5');

  await picker.click();
  await page.getByRole('menuitemradio', { name: /Dark/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  expect(await page.evaluate(() => localStorage.getItem('dharma-theme'))).toBe('night');
});

test('saved day and paper themes migrate to sunset Light before hydration', async ({ page }) => {
  for (const oldTheme of ['day', 'paper']) {
    await page.addInitScript((value: string) => localStorage.setItem('dharma-theme', value), oldTheme);
    await page.goto('/scriptures/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
    expect(await page.evaluate(() => localStorage.getItem('dharma-theme'))).toBe('sunset');
  }
});

test('saved auto preference resolves to one of the two fixed themes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => localStorage.setItem('dharma-theme', 'auto'));
  await page.goto('/scriptures/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  expect(await page.evaluate(() => localStorage.getItem('dharma-theme'))).toBe('night');
});

test('design preview exposes only the two supported themes', async ({ page }) => {
  await page.goto('/design-system-preview/');
  const group = page.getByRole('group', { name: 'Preview theme' });
  await expect(group.locator('[data-testid^="preview-theme-"]')).toHaveCount(2);
  await expect(page.getByTestId('preview-theme-sunset')).toHaveText('Light');
  await expect(page.getByTestId('preview-theme-night')).toHaveText('Dark');
  await page.getByTestId('preview-theme-sunset').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
});
