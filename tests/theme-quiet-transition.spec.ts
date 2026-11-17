import { expect, test } from '@playwright/test';

test('theme switching remains instant in Data Saver and Reading Lite', async ({ page }) => {
  // The segmented radio picker is intentionally visible only at >=1800px.
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  // Exercise genuine persisted preferences, not hand-written DOM attributes:
  // performance-mode's hydration sync can otherwise remove synthetic attributes.
  const setQuietPreferences = async (dataSaver: boolean, readingLite: boolean) => {
    await page.evaluate(({ dataSaver, readingLite }) => {
      localStorage.setItem('dharma.perf.dataSaver', String(dataSaver));
      localStorage.setItem('dharma.perf.readingLite', String(readingLite));
      localStorage.setItem('dharma.perf.lowPower', 'false');
    }, { dataSaver, readingLite });
    await page.reload();
    if (dataSaver) await expect(page.locator('html')).toHaveAttribute('data-data-saver', 'true');
    else await expect(page.locator('html')).not.toHaveAttribute('data-data-saver', 'true');
    if (readingLite) await expect(page.locator('html')).toHaveAttribute('data-reading-lite', 'true');
    else await expect(page.locator('html')).not.toHaveAttribute('data-reading-lite', 'true');
  };

  const spyOnThemeTransitions = async () => {
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
    });
  };
  const transitionCount = () =>
    page.evaluate(() => (window as Window & { __themeTransitions?: number }).__themeTransitions);

  await setQuietPreferences(true, false);
  await spyOnThemeTransitions();
  await page.getByRole('radio', { name: 'Light theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
  expect(await transitionCount()).toBe(0);

  await setQuietPreferences(false, true);
  await spyOnThemeTransitions();
  await page.getByRole('radio', { name: 'Dark theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  expect(await transitionCount()).toBe(0);

  await setQuietPreferences(false, false);
  await spyOnThemeTransitions();
  await page.getByRole('radio', { name: 'Light theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
  expect(await transitionCount()).toBe(1);
});
