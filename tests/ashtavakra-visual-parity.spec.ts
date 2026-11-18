import { expect, test } from '@playwright/test';

/**
 * Ashtavakra keeps its distinct scholarly content and canonical /ashtavakra/
 * URLs, but must share the entry, chapter-grid, and Sanskrit-first experience
 * with the rest of Dharma Granth.
 */
for (const theme of ['sunset', 'night'] as const) {
  test(`Ashtavakra contents match shared scripture design on a phone [${theme}]`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((value) => localStorage.setItem('dharma-theme', value), theme);
    await page.goto('/ashtavakra/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const hero = page.locator('header.scripture-vibe-hero');
    await expect(hero.getByRole('heading', { name: 'अष्टावक्र गीता', exact: true })).toBeVisible();
    await expect(hero.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await expect(hero.getByRole('link', { name: /Start reading/ })).toHaveAttribute('href', '/ashtavakra/1/');

    const chapters = page.locator('#chapters');
    await expect(chapters.getByRole('heading', { name: 'Adhyay / Sections' })).toBeVisible();
    const cards = chapters.locator('ol > li');
    await expect(cards).toHaveCount(20);
    const links = cards.locator('a.vibe-card');
    await expect(links).toHaveCount(20);
    await expect(links.first()).toHaveAttribute('href', '/ashtavakra/1/');
    await expect(links.last()).toHaveAttribute('href', '/ashtavakra/20/');
    await expect(cards.first()).toContainText('पहला प्रकरण');

    const positions = await page.evaluate(() => {
      const chapterTop = document.querySelector('#chapters')!.getBoundingClientRect().top;
      const introTop = document.querySelector('#why')!.getBoundingClientRect().top;
      return { chapterTop, introTop, width: document.documentElement.scrollWidth };
    });
    expect(positions.chapterTop).toBeLessThan(positions.introTop);
    expect(positions.width).toBeLessThanOrEqual(321);
  });

  test(`Ashtavakra chapter opens with verse list before editorial commentary [${theme}]`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((value) => localStorage.setItem('dharma-theme', value), theme);
    await page.goto('/ashtavakra/1/');

    const hero = page.locator('header.scripture-vibe-hero');
    await expect(hero.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await expect(hero.locator('h1')).toBeVisible();
    await expect(hero.getByRole('link', { name: /Start reading/ })).toHaveAttribute('href', '#verses');

    const verses = page.locator('#verses');
    await expect(verses).toBeVisible();
    await expect(verses.locator('article').first()).toContainText('श्लोक 1.1');
    const order = await page.evaluate(() => {
      const versesEl = document.querySelector('#verses')!;
      const introEl = document.querySelector('#intro')!;
      return {
        versePrecedesIntro: Boolean(versesEl.compareDocumentPosition(introEl) & Node.DOCUMENT_POSITION_FOLLOWING),
        width: document.documentElement.scrollWidth,
      };
    });
    expect(order.versePrecedesIntro).toBe(true);
    expect(order.width).toBeLessThanOrEqual(391);
    await expect(page.locator('a[href="/ashtavakra/1/1/"]').first()).toBeAttached();
  });
}

test('Ashtavakra retains its canonical verse flow and source verification', async ({ page }) => {
  await page.goto('/ashtavakra/1/3/');
  await expect(page.locator('#ash-1-3-verse p[lang="sa"]').first()).toBeVisible();
  await expect(page.locator('#ash-1-3-arth')).toBeVisible();
  await expect(page.locator('#ash-1-3-vyakhya')).toBeVisible();
  await expect(page.locator('#ash-1-3-sources')).toContainText('स्रोत');
  await expect(page.getByRole('navigation', { name: /अष्टावक्र श्लोक नेविगेशन/ })).toBeAttached();
});
