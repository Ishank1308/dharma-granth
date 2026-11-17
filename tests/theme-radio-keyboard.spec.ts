import { expect, test } from '@playwright/test';

test('theme picker offers one Tab stop and arrow-key radio navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('dharma-theme', 'night'));
  await page.goto('/');

  const group = page.getByRole('radiogroup', { name: 'Color theme' }).first();
  const options = group.getByRole('radio');
  await expect(options).toHaveCount(2);
  const light = options.nth(0);
  const dark = options.nth(1);

  await expect(dark).toHaveAttribute('aria-checked', 'true');
  await expect(dark).toHaveAttribute('tabindex', '0');
  await expect(light).toHaveAttribute('tabindex', '-1');

  await dark.focus();
  await page.keyboard.press('ArrowRight');
  await expect(light).toBeFocused();
  await expect(light).toHaveAttribute('aria-checked', 'true');
  await expect(light).toHaveAttribute('tabindex', '0');
  await expect(dark).toHaveAttribute('tabindex', '-1');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');

  await page.keyboard.press('ArrowLeft');
  await expect(dark).toBeFocused();
  await expect(dark).toHaveAttribute('aria-checked', 'true');

  await page.keyboard.press('Home');
  await expect(light).toBeFocused();
  await page.keyboard.press('End');
  await expect(dark).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(light).not.toBeFocused();
  await expect(dark).not.toBeFocused();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
});
