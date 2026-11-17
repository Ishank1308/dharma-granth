import { expect, test } from '@playwright/test';

test('Ashtavakra index and chapter use Ratri Night even with legacy saved Light', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('dharma-theme', 'night');
    localStorage.setItem('dharma.ash.settings.v1', JSON.stringify({ scheme: 'light', visual: 'balanced', motion: 'none' }));
  });

  for (const url of ['/ashtavakra/', '/ashtavakra/1/']) {
    await page.goto(url);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
    const accent = await page.locator('.ash').evaluate((el) => getComputedStyle(el).getPropertyValue('--ash-accent').trim());
    expect(accent).toBe('#e0b066');
  }
});

test('Legacy Ashtavakra Dark choice cannot override Sandhya Sunset', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('dharma-theme', 'sunset');
    localStorage.setItem('dharma.ash.settings.v1', JSON.stringify({ scheme: 'dark', visual: 'balanced', motion: 'none' }));
  });
  await page.goto('/ashtavakra/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset');
  const accent = await page.locator('.ash').evaluate((el) => getComputedStyle(el).getPropertyValue('--ash-accent').trim());
  expect(accent).not.toBe('#e0b066');
});
