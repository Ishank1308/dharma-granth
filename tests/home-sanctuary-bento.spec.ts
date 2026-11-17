import { expect, test } from '@playwright/test';

const region = 'section[aria-labelledby="home-sanctuary-heading"]';

test('living sanctuary uses a varied bento layout and keeps all four primary destinations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const sanctuary = page.locator(region);
  const cards = sanctuary.locator('article');
  await expect(cards).toHaveCount(4);

  await expect(cards.nth(0)).toHaveClass(/xl:col-span-7/);
  await expect(cards.nth(1)).toHaveClass(/xl:col-span-5/);
  await expect(cards.nth(2)).toHaveClass(/xl:col-span-6/);
  await expect(cards.nth(3)).toHaveClass(/xl:col-span-6/);

  await expect(sanctuary.getByRole('link', { name: /Today.s Vedic Almanac/ })).toHaveAttribute('href', '/panchang/');
  await expect(sanctuary.getByRole('link', { name: /Wisdom Pathways/ })).toHaveAttribute('href', '/wisdom-pathways/');
  await expect(sanctuary.getByRole('link', { name: /Sacred Mantras/ })).toHaveAttribute('href', '/mantras/');
  await expect(sanctuary.getByRole('link', { name: /Sadhana & Rituals/ })).toHaveAttribute('href', '/practice/');

  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs(first!.y - second!.y)).toBeLessThan(3);
  expect(first!.width).toBeGreaterThan(second!.width);
});

test('living sanctuary stays within the screen and retains keyboard-accessible links on narrow phones', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const cards = page.locator(region).locator('article');
  await expect(cards).toHaveCount(4);

  for (const card of await cards.all()) {
    const bounds = await card.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(321);
  }

  const panchangLink = page.locator(region).getByRole('link', { name: /Today.s Vedic Almanac/ });
  await panchangLink.focus();
  await expect(panchangLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/panchang\/$/);
});
