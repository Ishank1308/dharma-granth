import { expect, test } from '@playwright/test';

const featured = 'section[aria-label="दुर्लभ एवं व्यावहारिक दर्शन ग्रंथ"]';

test('library editorial collection gives four real books varied shelf widths', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/scriptures/');

  const cards = page.locator(featured).getByRole('link');
  await expect(cards).toHaveCount(4);

  const urls = ['/scripture/viduraniti/', '/scripture/shivaswarodaya/', '/ashtavakra/', '/scripture/naradabhaktisutra/'];
  for (let i = 0; i < urls.length; i++) {
    await expect(cards.nth(i)).toHaveAttribute('href', urls[i]);
  }

  await expect(cards.nth(0)).toHaveClass(/lg:col-span-7/);
  await expect(cards.nth(1)).toHaveClass(/lg:col-span-5/);
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs(first!.y - second!.y)).toBeLessThan(3);
  expect(first!.width).toBeGreaterThan(second!.width);
});

test('library featured books stay within a 320px screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scriptures/');

  const cards = page.locator(featured).getByRole('link');
  await expect(cards).toHaveCount(4);

  for (const card of await cards.all()) {
    const bounds = await card.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(321);
  }

  await cards.nth(0).focus();
  await expect(cards.nth(0)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/scripture\/viduraniti\/$/);
});
