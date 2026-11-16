import { expect, test } from '@playwright/test';

const gita = '/scripture/bhagavadgita/chapter/2/verse/47/';

test('mobile verse picker traps focus, locks background scroll and restores its opener', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(gita);
  const trigger = page.getByRole('navigation', { name: 'Verse navigation' })
    .getByRole('button', { name: /श्लोक 47/ });
  const before = await page.evaluate(() => document.body.style.overflow);
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'श्लोक अन्वेषक' });
  const close = dialog.getByRole('button', { name: 'बंद करें' });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null)).toBe(true);
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(before);
});

test('verse picker controls are touch-sized and respect reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ashtavakra/1/3/');
  await page.getByRole('button', { name: 'श्लोक माला खोलें' }).click();
  const dialog = page.getByRole('dialog', { name: 'श्लोक अन्वेषक' });
  await expect(dialog).toBeVisible();

  for (const element of [
    dialog.getByRole('button', { name: 'बंद करें' }),
    dialog.getByRole('textbox', { name: /Search verse number/ }),
    dialog.getByRole('button', { name: /प्रथम श्लोक/ }),
    dialog.getByRole('button', { name: /अंतिम श्लोक/ }),
  ]) {
    const box = await element.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  const gridButton = dialog.locator('.grid button').first();
  expect((await gridButton.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  const ping = dialog.locator('.animate-ping').first();
  if (await ping.count()) {
    await expect(ping).toHaveCSS('animation-name', 'none');
  }
});

test('study-guide links reopen a previously collapsed commentary branch', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(gita);
  const branch = page.locator('#reader-study-bhagavadgita-2-47-vyakhya');
  const details = branch.locator('details').first();
  await expect(details).toHaveAttribute('open', '');
  await details.locator('summary').click();
  await expect(details).not.toHaveAttribute('open', '');

  await page.getByRole('navigation', { name: /Verse study guide/ })
    .getByRole('link', { name: /व्याख्या/ }).click();
  await expect(page).toHaveURL(/#reader-study-bhagavadgita-2-47-vyakhya$/);
  await expect(details).toHaveAttribute('open', '');
});
