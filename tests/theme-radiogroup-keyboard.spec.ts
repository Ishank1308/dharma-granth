import { expect, test } from '@playwright/test';

test('two-theme radiogroup supports arrow keys and one tab stop', async ({ page }) => {
  await page.setViewportSize({ width: 1900, height: 950 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('dharma-theme', 'night'));
  await page.goto('/');

  const themes = page.getByRole('radiogroup', { name: 'Color theme' });
  await expect(themes).toBeVisible();
  const light = themes.getByRole('radio', { name: 'Light theme' });
  const dark = themes.getByRole('radio', { name: 'Dark theme' });
  await expect(dark).toHaveAttribute('aria-checked', 'true');
  await expect(dark).toHaveAttribute('tabindex', '0');
  await expect(light).toHaveAttribute('tabindex', '-1');

  await dark.focus();
  await page.keyboard.press('ArrowRight');
  await expect(light).toBeFocused();
  await expect(light).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
  await expect(light).toHaveAttribute('tabindex', '0');
  await expect(dark).toHaveAttribute('tabindex', '-1');

  await page.keyboard.press('End');
  await expect(dark).toBeFocused();
  await expect(dark).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');

  await page.keyboard.press('Home');
  await expect(light).toBeFocused();
  await expect(light).toHaveAttribute('aria-checked', 'true');

  await page.keyboard.press('ArrowLeft');
  await expect(dark).toBeFocused();
  await expect(dark).toHaveAttribute('aria-checked', 'true');
});
