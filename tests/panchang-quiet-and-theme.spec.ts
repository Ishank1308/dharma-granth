import { expect, test } from '@playwright/test';

test('Reading Lite stills Panchang ambient sky and Kāla-chakra without hiding the diagram', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/panchang/');

  const turn = page.locator('.cosmos .cosmos-turn').first();
  const drift = page.locator('.cosmos .cosmos-drift-far').first();
  await expect(turn).toHaveCount(1);
  await expect(drift).toHaveCount(1);
  await expect(page.getByRole('img', { name: /काल चक्र/ })).toBeVisible();

  const animation = () => turn.evaluate((el) => getComputedStyle(el).animationName);
  await expect.poll(animation).toContain('cosmos-turn');
  await page.evaluate(() => document.documentElement.setAttribute('data-reading-lite', 'true'));
  await expect.poll(animation).toBe('none');
  expect(await drift.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.getByRole('img', { name: /काल चक्र/ })).toBeVisible();

  await page.evaluate(() => document.documentElement.removeAttribute('data-reading-lite'));
  await expect.poll(animation).toContain('cosmos-turn');
});

for (const theme of ['sunset', 'night'] as const) {
  test(`Practice canvas responds to ${theme} theme instead of forcing Night`, async ({ page }) => {
    await page.addInitScript((value) => window.localStorage.setItem('dharma-theme', value), theme);
    await page.goto('/practice/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const actual = await page.locator('main.apple-scope').evaluate((el) => ({
      background: getComputedStyle(el).backgroundColor,
      foreground: getComputedStyle(el).color,
    }));
    const expected = theme === 'sunset'
      ? { background: 'rgb(255, 244, 229)', foreground: 'rgb(51, 32, 22)' }
      : { background: 'rgb(0, 0, 0)', foreground: 'rgb(245, 245, 247)' };
    expect(actual, `Practice surface does not honor ${theme} design tokens`).toEqual(expected);
  });
}
