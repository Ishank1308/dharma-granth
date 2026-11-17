import { expect, test } from '@playwright/test';

test('Gita chapter highlights use real linked chapters and static local artwork', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scripture/bhagavadgita/');

  const highlights = page.getByRole('region', { name: 'Explore a section' });
  const links = highlights.locator('a.chapter-highlight-link');
  await expect(links).toHaveCount(3);
  const expected = [1, 3, 6];
  const artwork = ['kurukshetra', 'yajna', 'yogi'];

  for (let i = 0; i < expected.length; i++) {
    await expect(links.nth(i)).toHaveAttribute('href', `/scripture/bhagavadgita/chapter/${expected[i]}/`);
    const scene = links.nth(i).locator('.chapter-highlight-art');
    await expect(scene).toHaveAttribute('data-painting', artwork[i]);
    await expect(scene).toHaveAttribute('aria-hidden', 'true');
    const style = await scene.evaluate(el => {
      const computed = getComputedStyle(el);
      return { backgroundImage: computed.backgroundImage, animationName: computed.animationName, transform: computed.transform };
    });
    expect(style.backgroundImage).toContain('#still');
    expect(style.animationName).toBe('none');
    expect(style.transform).toBe('none');
  }

  // Cards scroll inside the shelf; the document itself must not overflow at 320px.
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(321);
  await expect(page.getByRole('heading', { name: 'Adhyay / Sections' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Start reading/ })).toBeVisible();
});

test('Ramayana artwork follows known kanda scenes, while uncurated books remain text first', async ({ page }) => {
  await page.goto('/scripture/ramayana/');
  const highlighted = page.getByRole('region', { name: 'Explore a section' });
  await expect(highlighted.locator('a.chapter-highlight-link')).toHaveCount(3);
  await expect(highlighted.locator('[data-painting="palace"]')).toHaveCount(1);
  await expect(highlighted.locator('a.chapter-highlight-link').first()).toContainText('काण्ड 1');
  await expect(highlighted.locator('[data-painting="forest"]')).toHaveCount(1);
  await expect(highlighted.locator('[data-painting="ocean"]')).toHaveCount(1);

  await page.goto('/scripture/rigveda/');
  await expect(page.getByRole('region', { name: 'Explore a section' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Adhyay / Sections' })).toBeVisible();
});

test('illustrated chapter entry points resolve actual local SVG assets', async ({ page, request }) => {
  await page.goto('/scripture/bhagavadgita/');
  const artworks = page.locator('.chapter-highlight-art');
  await expect(artworks).toHaveCount(3);
  const backgrounds = await artworks.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).backgroundImage),
  );

  for (const background of backgrounds) {
    const resource = background.match(/url\(["']?([^"')]+)/)?.[1];
    expect(resource, `Missing chapter painting: ${background}`).toBeTruthy();
    const imageUrl = new URL(resource!, page.url());
    imageUrl.hash = ''; // #still disables animation; it is not part of the HTTP path.
    const response = await request.get(imageUrl.toString());
    expect(response.status(), `Missing artwork ${imageUrl.pathname}`).toBe(200);
    expect(response.headers()['content-type']).toMatch(/image\/svg\+xml/);
  }
});
