import { expect, test } from '@playwright/test';

test('Reading Lite stills Panchang ambient sky and Kāla-chakra without hiding the diagram', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/panchang/');

  const turn = page.locator('.cosmos .cosmos-turn').first();
  const drift = page.locator('.cosmos .cosmos-drift-far').first();
  await expect(turn).toHaveCount(1);
  await expect(drift).toHaveCount(1);
  await expect(page.getByRole('img', { name: /काल चक्र/ })).toBeVisible();

  const animation = () => turn.evaluate((el) => getComputedStyle(el).animationName);
  await expect.poll(animation).toContain('cosmos-turn');
  await page.evaluate(() => document.documentElement.setAttribute('data-reading-lite', 'true'));
  await expect.poll(animation).toBe('none');
  expect(await drift.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.getByRole('img', { name: /काल चक्र/ })).toBeVisible();

  await page.evaluate(() => document.documentElement.removeAttribute('data-reading-lite'));
  await expect.poll(animation).toContain('cosmos-turn');
});

for (const theme of ['sunset', 'night'] as const) {
  test(`Practice inherits the ${theme} canvas while preserving a transparent page shell`, async ({ page }) => {
    await page.addInitScript((value) => window.localStorage.setItem('dharma-theme', value), theme);
    await page.goto('/practice/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

    // app/globals.css deliberately makes main.bg-dharma-bg transparent so the
    // shared liquid backdrop is visible. The visible canvas belongs to body.
    const actual = await page.locator('main.apple-scope').evaluate((el) => {
      const readPixels = (color: string): number[] => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data);
      };
      const root = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);
      const main = getComputedStyle(el);
      return {
        bgToken: root.getPropertyValue('--dharma-bg').trim(),
        textToken: root.getPropertyValue('--dharma-text').trim(),
        bodyBackground: body.backgroundColor,
        mainBackground: main.backgroundColor,
        // Compare actual painted colors, not serialized CSS syntax:
        // Chromium can return either rgb(...) or color(srgb ...).
        bodyPixels: readPixels(body.backgroundColor),
        tokenPixels: readPixels(root.getPropertyValue('--dharma-bg').trim()),
      };
    });
    const tokens = theme === 'sunset'
      ? { bgToken: '#fff4e5', textToken: '#332016' }
      : { bgToken: '#000000', textToken: '#f5f5f7' };

    expect(actual.bgToken).toBe(tokens.bgToken);
    expect(actual.textToken).toBe(tokens.textToken);
    expect(actual.bodyPixels, 'Painted body background must match the selected theme').toEqual(actual.tokenPixels);
    expect(actual.mainBackground).toBe('rgba(0, 0, 0, 0)');
  });
}
