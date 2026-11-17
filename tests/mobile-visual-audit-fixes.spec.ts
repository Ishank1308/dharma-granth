import { expect, test, type Page } from '@playwright/test';

test('published scripture pages expose reading and chapter navigation before the decorative book', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/scripture/bhagavadgita/');

  const firstChapter = page.locator('section.scripture-vibe-hero a[href="/scripture/bhagavadgita/chapter/1/"]');
  await expect(firstChapter).toBeVisible();
  await expect(firstChapter).toContainText('पढ़ना शुरू करें');
  const bounds = await firstChapter.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y, 'Start-reading action must be discoverable in the initial 320px viewport').toBeLessThan(844);

  const browse = page.locator('section.scripture-vibe-hero a[href="#contents-heading"]');
  await expect(browse).toBeVisible();
  await browse.click();
  await expect(page).toHaveURL(/#contents-heading$/);
  await expect(page.locator('#contents-heading')).toBeVisible();
});

test('five mobile navigation labels do not collide at 200% text resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });

  const labels = page.locator('[data-mobile-nav-label]');
  await expect(labels).toHaveCount(5);
  const widths = await labels.evaluateAll((elements) => elements.map((element) => {
    const r = element.getBoundingClientRect();
    const parent = element.parentElement!.getBoundingClientRect();
    return { left: r.left, right: r.right, parentLeft: parent.left, parentRight: parent.right };
  }));
  for (const box of widths) {
    expect(box.left).toBeGreaterThanOrEqual(box.parentLeft - 1);
    expect(box.right).toBeLessThanOrEqual(box.parentRight + 1);
  }
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(391);
});

test('narrow reader dock shows clear Hindi mode names instead of abbreviated Roman fragments', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  const dock = page.locator('nav[aria-label*="Reader dock"]');
  await expect(dock).toBeVisible();
  const roman = dock.locator('[data-dock-label="primary"]');
  const hindi = dock.locator('[data-dock-label="hindi"]');
  await expect(roman).toHaveCount(5);
  await expect(hindi).toHaveCount(5);
  for (const label of await roman.all()) await expect(label).toBeHidden();
  for (const label of await hindi.all()) await expect(label).toBeVisible();
  await expect(hindi.nth(1)).toHaveText('शब्दार्थ');
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(321);
});

async function wordLineRects(page: Page, selector: string, word: string): Promise<number> {
  return page.locator(selector).evaluate((element, needle) => {
    const node = Array.from(element.childNodes).find((child) =>
      child.nodeType === Node.TEXT_NODE && child.textContent?.includes(needle),
    );
    if (!node || !node.textContent) return -1;
    const i = node.textContent.indexOf(needle);
    const range = document.createRange();
    range.setStart(node, i);
    range.setEnd(node, i + needle.length);
    return range.getClientRects().length;
  }, word);
}

test('200% mobile headings preserve whole words rather than orphan letters', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await wordLineRects(page, '#hero-title', 'Ancient')).toBe(1);

  await page.goto('/scripture/bhagavadgita/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await wordLineRects(page, 'h1', 'Bhagavad')).toBe(1);
});
