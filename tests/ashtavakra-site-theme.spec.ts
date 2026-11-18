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

test('Ashtavakra index uses standard scripture breadcrumbs and responsive chapter cards', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ashtavakra/');

  const breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(breadcrumbs.getByRole('link', { name: 'Scriptures' })).toHaveAttribute('href', '/scriptures/');
  const chapters = page.locator('#chapters');
  await expect(chapters.getByRole('heading', { name: /Adhyay \/ Sections/ })).toBeVisible();
  const cards = chapters.locator('ol > li');
  await expect(cards).toHaveCount(20);
  await expect(chapters.locator('.ash-path')).toHaveCount(0);
  await expect(chapters.getByRole('link', { name: /पहला प्रकरण/ }).first()).toBeVisible();

  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(321);
});

test('Ashtavakra chapter shares scripture breadcrumb and reading header', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/ashtavakra/1/');
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(breadcrumb.getByRole('link', { name: 'Scriptures' })).toHaveAttribute('href', '/scriptures/');
  await expect(breadcrumb.getByRole('link', { name: 'अष्टावक्र गीता' })).toHaveAttribute('href', '/ashtavakra/');
  await expect(page.getByText('Sacred reading · पवित्र पाठ · अध्याय 1')).toBeVisible();
  await expect(page.locator('#verses')).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(321);
});
