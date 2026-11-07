import { expect, test } from '@playwright/test';
import { scriptureVibe } from '@/lib/scripture-vibes';
import type { ScriptureCategory } from '@/data/types';

/**
 * The design system on the built site: tokens resolve in every theme, the home page's new pieces
 * are in the exported HTML at their true values, and reduced motion stills the moving parts.
 */

const THEMES = ['day', 'sunset', 'paper', 'night'] as const;
const COVER_CATEGORIES: ScriptureCategory[] = [
  'veda', 'upanishad', 'vedanta', 'sutra', 'shakta', 'purana', 'itihasa', 'smriti', 'tantra', 'stotra', 'other',
];
const COVER_PALETTES = [
  ...COVER_CATEGORIES.map((category) => ({ label: category, vibe: scriptureVibe(`contrast-${category}`, category) })),
  { label: 'Bhagavad Gita override', vibe: scriptureVibe('bhagavadgita', 'itihasa') },
  { label: 'Rāmāyaṇa override', vibe: scriptureVibe('ramayana', 'itihasa') },
  { label: 'Ramcharitmanas override', vibe: scriptureVibe('ramcharitmanas', 'itihasa') },
];

type RGB = [number, number, number];

function parseHex(color: string): RGB {
  const value = color.replace('#', '');
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16)) as RGB;
}

function mixSrgb(from: RGB, to: RGB, share: number): RGB {
  return from.map((channel, index) => channel * (1 - share) + to[index] * share) as RGB;
}

function contrastAgainstWhite(color: RGB): number {
  const linear = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  return 1.05 / (luminance + 0.05);
}

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
  const stats = html.match(/<dd[^>]*>[\s\S]*?<\/dd>/g) ?? [];
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

  test('preview hydrates and its theme controls work with reduced motion', async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on('pageerror', (error) => {
      if (/hydrat/i.test(error.message)) hydrationErrors.push(error.message);
    });
    await page.goto('/design-system-preview/');
    await page.getByTestId('preview-theme-day').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'day');
    await page.getByTestId('preview-theme-night').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
    expect(hydrationErrors).toEqual([]);
  });
});

test('verse cards retain visible outlines in forced colors', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/design-system-preview/');
  const card = page.getByTestId('preview-card-durgasaptashati');
  await expect(card).toHaveCSS('border-top-style', 'solid');
  await expect(card.locator('.verse-ref')).toHaveCSS('border-top-style', 'solid');
});

test('preview demonstrates an accessible study disclosure and larger text', async ({ page }) => {
  await page.goto('/design-system-preview/');
  const card = page.getByTestId('preview-card-rigveda');
  const trigger = card.getByRole('button', { name: /Verse study/ });
  const panel = card.locator('#preview-study-rigveda');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(panel).toBeHidden();

  const text = card.locator('.verse-folio p[lang="sa"]');
  const normalSize = await text.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
  await page.getByTestId('preview-large-text').click();
  await expect(page.getByTestId('preview-large-text')).toHaveAttribute('aria-pressed', 'true');
  const largeSize = await text.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
  expect(largeSize).toBeGreaterThan(normalSize);
});

test('design preview keeps verse-pill text at WCAG AA contrast in every theme', async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on('pageerror', (error) => {
    if (/hydrat/i.test(error.message)) hydrationErrors.push(error.message);
  });
  await page.goto('/design-system-preview/');
  const sample = page.getByTestId('preview-card-durgasaptashati');
  await expect(sample).toBeVisible();
  await expect(sample.locator('.verse-ref')).toHaveCSS('color', 'rgb(255, 255, 255)');

  const shares = await sample.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      lightAccent: Number.parseFloat(style.getPropertyValue('--vc-pill-accent-share')) / 100,
      nightMain: Number.parseFloat(style.getPropertyValue('--vc-night-main-share')) / 100,
      nightAccent: Number.parseFloat(style.getPropertyValue('--vc-night-accent-share')) / 100,
    };
  });

  for (const theme of THEMES) {
    await page.getByTestId(`preview-theme-${theme}`).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

    for (const { label, vibe } of COVER_PALETTES) {
      const [, mainHex, accentHex] = vibe.cover;
      const main = parseHex(mainHex);
      const accent = parseHex(accentHex);
      const stops = theme === 'night'
        ? [
            mixSrgb(main, [0, 0, 0], 1 - shares.nightMain),
            mixSrgb(accent, [0, 0, 0], 1 - shares.nightAccent),
          ]
        : [main, mixSrgb(main, accent, shares.lightAccent)];
      const minimum = Math.min(...stops.map(contrastAgainstWhite));
      expect(minimum, `${label} cover in ${theme}`).toBeGreaterThanOrEqual(4.5);
    }
  }
  expect(hydrationErrors).toEqual([]);
});
