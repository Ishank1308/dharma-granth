import { expect, test } from '@playwright/test';

test('Collections modal contains keyboard focus, closes on Escape and returns to opener', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('/collections/');
  const trigger = page.getByRole('button', { name: 'New Collection', exact: true });
  await expect(trigger).toBeVisible();
  await trigger.click();
  const modal = page.getByRole('dialog', { name: 'New Collection' });
  const name = modal.getByRole('textbox', { name: 'Name', exact: true });
  await expect(modal).toHaveAttribute('aria-modal', 'true');
  await expect(name).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  for (let i = 0; i < 8; i++) {
    await page.keyboard.press(i % 2 ? 'Shift+Tab' : 'Tab');
    const within = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return Boolean(modal?.contains(document.activeElement));
    });
    expect(within).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('Ritual details trap focus and restore the selected ritual', async ({ page }) => {
  await page.goto('/rituals/');
  const trigger = page.locator('button.fade-up-in.apple-card').first();
  await expect(trigger).toBeVisible();
  await trigger.click();
  const modal = page.getByRole('dialog');
  const close = modal.getByRole('button', { name: /Close ritual details/ });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]');
    return Boolean(modal?.contains(document.activeElement));
  })).toBe(true);
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Sacred geography exposes schematic provenance and keyboard-operable map markers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/locations/');
  await expect(page.getByText(/सांकेतिक मानचित्र/).first()).toBeVisible();
  const marker = page.getByRole('group', { name: 'सांकेतिक तीर्थ स्थान मानचित्र' })
    .getByRole('button', { name: /स्थान का विवरण खोलें/ }).first();
  await marker.focus();
  await expect(marker).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('div.grid.lg\\:grid-cols-3 h2').first()).toBeVisible();
});
