import { expect, test } from '@playwright/test';

/**
 * One voice on every page: titles in the interface face at the large-title size,
 * whichever classes the page was written with, and the pages that had fallen out
 * of the system (Academy, the Wisdom page) built from the shared pieces.
 */

// Pages whose title still carries the older serif classes in its markup.
const OLDER_TITLE_PAGES = ['/mantras/', '/collections/', '/learn/plans/', '/panchang/tithis/', '/privacy/'];

for (const route of OLDER_TITLE_PAGES) {
  test(`the title on ${route} uses the interface face at the large-title size`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route);
    const title = page.locator('#main-content h1').first();
    await expect(title).toBeVisible();
    const style = await title.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        face: computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
        size: Number.parseFloat(computed.fontSize),
        weight: computed.fontWeight,
      };
    });
    expect(style).toEqual({ face: 'Inter', size: 48, weight: '600' });
  });
}

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const route of ['/panchang/', '/practice/']) {
    test(`${route} keeps the exported page instead of rendering it again`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(route);
      await expect(page.locator('#main-content h1').first()).toBeVisible();
      await page.waitForTimeout(500);
      expect(errors.filter((error) => /hydration failed|Minified React error #(418|423|425)|did not match/i.test(error)))
        .toEqual([]);
    });
  }
});

test('the Wisdom page has a title and its tabs keep their labels on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/wos/');
  await expect(page.getByRole('heading', { level: 1, name: /Wisdom Operating System/ })).toBeVisible();

  const tabs = page.getByRole('navigation', { name: 'Wisdom Operating System surfaces' }).getByRole('button');
  await expect(tabs).toHaveCount(6);
  const boxes = await tabs.evaluateAll((buttons) =>
    buttons.map((button) => {
      const box = button.getBoundingClientRect();
      return { left: box.left, right: box.right, clipped: button.scrollWidth > button.clientWidth + 1 };
    }),
  );
  expect(boxes.filter((box) => box.clipped)).toEqual([]);
  for (let i = 1; i < boxes.length; i += 1) {
    expect(boxes[i].left, `tab ${i + 1} starts after tab ${i} ends`).toBeGreaterThanOrEqual(boxes[i - 1].right);
  }
});

test('the Academy lists its courses as rows that open the course', async ({ page }) => {
  await page.goto('/learn/academy/');
  await expect(page.getByRole('heading', { level: 1, name: /Dharma Academy/ })).toBeVisible();
  const rows = page.locator('#main-content .apple-group a.apple-row');
  expect(await rows.count()).toBeGreaterThan(5);
  await expect(rows.first()).toHaveAttribute('href', /^\/learn\/[a-z0-9-]+\/$/);
});
