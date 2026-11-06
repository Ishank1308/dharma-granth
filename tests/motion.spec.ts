import { expect, test } from '@playwright/test';

/**
 * Motion-system checks for the world-class UI upgrade. Runs against the
 * production export like the rest of the suite:
 *
 *   npm run build && npm run test:e2e
 */

test('home: hero, stats and wisdom ticker render with final values', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#home-hero-heading')).toBeVisible();

  // Stats carry their final formatted values in the server HTML, so they read
  // correctly even before the count-up plays.
  const stats = page.getByTestId('library-stats');
  await expect(stats).toBeVisible();
  for (const label of ['Texts with verses:', 'Chapters in the library:', 'Verses in the library:']) {
    await expect(stats.getByText(label, { exact: true })).toBeVisible();
  }

  // The count-up settles on a real formatted number once scrolled into view.
  const verses = stats.locator('div', { hasText: 'Verses in the library:' }).locator('dd');
  await verses.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  const text = (await verses.textContent())?.trim() ?? '';
  expect(text).toMatch(/^[1-9][\d,]*$/);

  // Wisdom ticker present with real lines (loop copy is aria-hidden).
  const ticker = page.getByTestId('wisdom-ticker');
  await expect(ticker).toBeVisible();
  await expect(ticker.getByText('सत्यमेव जयते').first()).toBeVisible();

  // Scroll through so scroll-linked reveals settle; nothing stays hidden.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await expect(page.locator('.reveal-stagger-item').first()).toBeVisible();
});

test('reduced motion: entrances and ticker are static', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const fade = await page.evaluate(() => {
    const el = document.querySelector('.fade-up-in');
    return el ? getComputedStyle(el).animationName : 'missing';
  });
  expect(fade).toBe('none');

  const ticker = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="wisdom-ticker"] .ticker-track');
    return el ? getComputedStyle(el).animationName : 'missing';
  });
  expect(ticker).toBe('none');

  await context.close();
});
