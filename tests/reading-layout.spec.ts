import { expect, test } from '@playwright/test';

// The reading layout fixes from the 21 Nov UI review: the reader dock stays out of the text on
// a desktop, the Library offers search before its curated shelf, and Devanagari is never set
// smaller than it can be read on a phone.

test('the reader dock sits beside the reading column on a desktop, not over it', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/scripture/bhagavadgita/chapter/2/');

  const dock = page.getByRole('navigation', { name: 'पठन नियंत्रण · Reader dock' });
  await expect(dock).toBeVisible();
  const folio = page.locator('.verse-folio').first();
  await expect(folio).toBeVisible();

  const dockBox = (await dock.locator('> div').first().boundingBox())!;
  const folioBox = (await folio.boundingBox())!;
  expect(dockBox.x).toBeGreaterThanOrEqual(folioBox.x + folioBox.width);
  expect(dockBox.height).toBeGreaterThan(dockBox.width);

  // A rail in the margin has no reason to hide while reading.
  await page.mouse.wheel(0, 1600);
  await page.waitForTimeout(400);
  await expect(dock).toHaveCSS('opacity', '1');
});

test('the Library puts search and filters before its curated shelf', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/scriptures/');

  const search = page.getByRole('searchbox').first();
  const shelf = page.locator('section[aria-label="दुर्लभ एवं व्यावहारिक दर्शन ग्रंथ"]');
  await expect(search).toBeVisible();
  await expect(shelf).toBeVisible();

  const searchTop = (await search.boundingBox())!.y;
  const shelfTop = (await shelf.boundingBox())!.y;
  expect(searchTop).toBeLessThan(780);
  expect(searchTop).toBeLessThan(shelfTop);

  // Searching is a request for results, so the shelf steps aside and comes back afterwards.
  await search.fill('gita');
  await expect(shelf).toHaveCount(0);
  await search.fill('');
  await expect(shelf).toBeVisible();
});

test('Devanagari labels are at least 13px on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });

  for (const route of ['/mantras/', '/practice/', '/scriptures/']) {
    await page.goto(route);
    await expect(page.locator('main').first()).toBeVisible();
    const small = await page.evaluate(() => {
      const found: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>('main [lang="hi"], main [lang="sa"], main .font-devanagari')) {
        if (el.closest('svg') || !el.textContent?.trim()) continue;
        const box = el.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) continue;
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size < 13) found.push(`${size}px ${el.textContent.trim().slice(0, 24)}`);
      }
      return found;
    });
    expect(small, `${route} sets Devanagari under 13px`).toEqual([]);
  }
});
