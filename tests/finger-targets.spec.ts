import { expect, test } from '@playwright/test';

// Small links that keep their look but answer a finger across 44 x 44px (.tap-halo in components.css):
// the verse number capsule in a chapter's plain verse list (48 x 28) and the book pill above the
// chapter title (about 26px tall). With a mouse nothing changes.

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

/** What a tap just outside the link's box, above and below its middle, would land on. */
async function edges(page: import('@playwright/test').Page, selector: string) {
  return page.evaluate((sel) => {
    const link = document.querySelector<HTMLElement>(sel)!;
    link.scrollIntoView({ block: 'center' });
    const box = link.getBoundingClientRect();
    const lands = (y: number) => {
      const el = document.elementFromPoint(box.left + box.width / 2, y);
      return Boolean(el && (el === link || link.contains(el)));
    };
    return { height: Math.round(box.height), above: lands(box.top - 7), below: lands(box.bottom + 7) };
  }, selector);
}

test('the chapter list verse number and the book pill answer a finger across 44px', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await expect(page.locator('article.verse-card.vt .vt-title a').first()).toBeAttached();

  const verse = await edges(page, 'article.verse-card.vt .vt-title a');
  expect(verse.height, 'the capsule keeps its size').toBeLessThan(32);
  expect(verse).toMatchObject({ above: true, below: true });

  const pill = await edges(page, 'header a.tap-halo[href^="/scripture/bhagavadgita"]');
  expect(pill.height, 'the pill keeps its size').toBeLessThan(32);
  expect(pill).toMatchObject({ above: true, below: true });
});
