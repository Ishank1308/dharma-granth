import { expect, test } from '@playwright/test';

/**
 * The design system on the built site: tokens resolve in every theme, the home page's new pieces
 * are in the exported HTML at their true values, and reduced motion stills the moving parts.
 */

const THEMES = ['day', 'sunset', 'paper', 'night'] as const;

for (const theme of THEMES) {
  test(`tokens resolve in the ${theme} theme`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('dharma-theme', t), theme);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const tokens = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      const read = (n: string) => s.getPropertyValue(n).trim();
      return {
        radiusCard: read('--radius-card'),
        bodySize: read('--text-body'),
        separator: read('--separator'),
        material: read('--material-regular'),
        shadow: read('--shadow-raised'),
        spring: read('--motion-spring'),
      };
    });
    expect(tokens.radiusCard).toBe('22px');
    expect(tokens.bodySize).toBe('1.0625rem');
    expect(tokens.separator).toContain('color-mix');
    expect(tokens.material).toContain('color-mix');
    expect(tokens.spring).not.toBe('');
    if (theme === 'night') expect(tokens.shadow).toBe('none');
    else expect(tokens.shadow).toContain('rgba');
  });
}

test('home stats and sayings are in the exported HTML', async ({ request }) => {
  const html = await (await request.get('/')).text();
  // The library's numbers ship at their true values, not at zero.
  const stats = html.match(/<dd[^>]*>.*?<\/dd>/gs) ?? [];
  expect(stats.length).toBeGreaterThanOrEqual(4);
  expect(stats[0]).not.toMatch(/>0</);
  // The wisdom band: every saying is linked, and the loop's second copy is hidden.
  expect(html).toContain('data-testid="wisdom-ticker"');
  expect(html).toContain('तत्त्वमसि');
  expect(html).toMatch(/<ul aria-hidden="true" class="ticker-group"/);
});

test('Devanagari inside a tracked heading is not letter-spaced', async ({ page }) => {
  await page.goto('/');
  const spacing = await page.locator('#home-library-heading [lang="hi"]').evaluate((el) => getComputedStyle(el).letterSpacing);
  expect(spacing).toBe('normal');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the ticker is a still list and durations collapse', async ({ page }) => {
    await page.goto('/');
    const ticker = page.getByTestId('wisdom-ticker');
    await expect(ticker).toBeVisible();
    const track = await ticker.locator('.ticker-track').evaluate((el) => getComputedStyle(el).animationName);
    expect(track).toBe('none');
    await expect(ticker.locator('.ticker-group').nth(1)).toBeHidden();
    const duration = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--duration-base').trim());
    expect(duration).toBe('1ms');
  });
});
