import { expect, test } from '@playwright/test';

test('compact Light/Dark theme menu opens focused and supports arrows, Enter, Escape and Tab', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('dharma-theme', 'night'));
  await page.goto('/');

  const trigger = page.getByRole('button', { name: /थीम बदलें · Theme/ });
  await trigger.click();

  const menu = page.getByRole('menu', { name: 'Theme · थीम' });
  const light = menu.getByRole('menuitemradio', { name: /Light/ });
  const dark = menu.getByRole('menuitemradio', { name: /Dark/ });
  await expect(menu).toBeVisible();
  await expect(dark).toBeFocused();
  await expect(dark).toHaveAttribute('tabindex', '-1');

  await page.keyboard.press('ArrowDown');
  await expect(light).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');

  await trigger.click();
  await expect(light).toBeFocused();
  await page.keyboard.press('End');
  await expect(dark).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(light).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(menu).toHaveCount(0);
});
