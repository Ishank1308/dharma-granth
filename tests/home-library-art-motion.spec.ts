import { expect, test } from '@playwright/test';

test('homepage library reveals local artwork while retaining usable scripture links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  // Query the unique dynamic library panel directly; imagery is decorative.
  const gallery = page.locator('[data-library-category="featured"]');
  await expect(gallery).toBeVisible();
  const cards = gallery.locator('article.library-showcase-book');
  await expect(cards).toHaveCount(6);

  for (const card of await cards.all()) {
    const art = card.locator('.library-book-art img');
    await expect(art).toHaveCount(1);
    await expect(art).toHaveAttribute('alt', '');
    const src = await art.getAttribute('src');
    expect(src).toContain('verse-bg');
    const bounds = await card.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(-1);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(391);
    await expect(card.getByRole('link', { name: /अध्ययन आरम्भ करें/ })).toBeVisible();
  }

  await page.getByRole('tab', { name: /Four Vedas/ }).click();
  const vedas = page.locator('[data-library-category="veda"]');
  await expect(vedas.locator('article.library-showcase-book')).toHaveCount(4);
  await expect(vedas.locator('.library-book-art img')).toHaveCount(4);
  for (const image of await vedas.locator('.library-book-art img').all()) {
    await expect(image).toHaveAttribute('src', /verse-bg.*veda/);
  }
});

test('featured passage 3D depth is optional and still keyboard-accessible without motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const featured = page.getByRole('complementary', { name: 'Featured paths into the library' });
  const passage = featured.locator('[data-tilt="subtle"]');
  await expect(passage).toHaveCount(1);
  await expect(passage).toHaveAttribute('href', '/scripture/bhagavadgita/chapter/2/verse/47/');
  await expect(passage).toContainText('कर्मण्येवाधिकारस्ते');

  await passage.focus();
  await expect(passage).toBeFocused();
  const state = await passage.evaluate(el => {
    const s = getComputedStyle(el);
    return { transform: s.transform, animation: s.animationName };
  });
  expect(state.transform).toBe('none');
  expect(state.animation).toBe('none');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/scripture\/bhagavadgita\/chapter\/2\/verse\/47\/$/);
});

test('featured artwork stays decorative and the hero aura honors reduced-motion and quiet mode', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const passage = page.getByRole('complementary', { name: 'Featured paths into the library' }).locator('[data-tilt="subtle"]');
  const artwork = passage.locator('[data-decorative]');
  await expect(artwork).toHaveAttribute('aria-hidden', 'true');
  const image = await artwork.evaluate(el => getComputedStyle(el).backgroundImage);
  expect(image).toContain('/verse-bg/itihasa.webp');
  await expect(passage).toContainText('कर्मण्येवाधिकारस्ते');

  const aura = page.locator('.hero-halo-aura');
  const animation = async () => aura.evaluate(el => getComputedStyle(el).animationName);
  expect(await animation()).toBe('none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(animation).toBe('pulse');

  await page.evaluate(() => document.documentElement.setAttribute('data-low-power', 'true'));
  await expect.poll(animation).toBe('none');
});

test('fluid pointer wake can resume when Data Saver is turned off without reloading', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    document.documentElement.dataset.dataSaver = 'true';
  });
  await page.goto('/');

  const wake = page.locator('.prana-fluid-stage .prana-blob.pointer-events-none');
  await expect(wake).toHaveCount(1);
  const transform = () => wake.evaluate(element => (element as HTMLElement).style.transform);
  const initial = await transform();

  await page.mouse.move(450, 450);
  await page.waitForTimeout(200);
  expect(await transform(), 'Data Saver must suppress initial pointer motion').toBe(initial);

  await page.evaluate(() => { delete document.documentElement.dataset.dataSaver; });
  await page.mouse.move(1050, 550);
  await expect.poll(transform).not.toBe(initial);

  // The same live listener must immediately respect a fresh quiet-mode change.
  await page.evaluate(() => { document.documentElement.dataset.dataSaver = 'true'; });
  await page.waitForTimeout(100);
  const stopped = await transform();
  await page.mouse.move(550, 200);
  await page.waitForTimeout(120);
  expect(await transform(), 'Pointer motion must stay quiet after Data Saver is re-enabled').toBe(stopped);
});
