import { expect, test } from '@playwright/test';

test('theme switching remains instant in Data Saver and Reading Lite', async ({ page }) => {
  // The segmented radio picker is intentionally visible only at >=1800px.
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  // Count attempts to launch the View Transitions API, independent of timing.
  await page.evaluate(() => {
    const win = window as Window & { __themeTransitions?: number };
    win.__themeTransitions = 0;
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: (update: () => void) => {
        win.__themeTransitions = (win.__themeTransitions ?? 0) + 1;
        update();
        return { finished: Promise.resolve() };
      },
    });
    document.documentElement.dataset.dataSaver = 'true';
  });

  await page.getByRole('radio', { name: 'Light theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
  expect(await page.evaluate(() => (window as Window & { __themeTransitions?: number }).__themeTransitions)).toBe(0);

  await page.evaluate(() => {
    delete document.documentElement.dataset.dataSaver;
    document.documentElement.dataset.readingLite = 'true';
  });
  await page.getByRole('radio', { name: 'Dark theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  expect(await page.evaluate(() => (window as Window & { __themeTransitions?: number }).__themeTransitions)).toBe(0);

  await page.evaluate(() => { delete document.documentElement.dataset.readingLite; });
  await page.getByRole('radio', { name: 'Light theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
  expect(await page.evaluate(() => (window as Window & { __themeTransitions?: number }).__themeTransitions)).toBe(1);
});
