import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { CHARACTER_PHOTOS, FESTIVAL_PHOTOS, MANTRA_PHOTOS } from '../lib/page-photos';

// Pictures on pages outside the reader (lib/page-photos.ts, app/components/PagePhoto.tsx). They
// reuse the chapter photos in app/styles/photos/, so no page may name a picture that has no file,
// each one's credit link must land on its entry on /sources/, and Data Saver loads none.

/** The picture a cover or hero shows, as the browser resolved it ('' when hidden). */
function shownPicture(page: Page, selector: string, pseudo: '::before' | null) {
  return page.locator(selector).first().evaluate((el, p) => {
    if (getComputedStyle(el).display === 'none') return '';
    return getComputedStyle(el, p).backgroundImage;
  }, pseudo);
}

test('every festival, character and mantra picture has a file', () => {
  const photos = new Set([...Object.values(FESTIVAL_PHOTOS), ...Object.values(CHARACTER_PHOTOS), ...Object.values(MANTRA_PHOTOS)]);
  for (const id of photos) {
    for (const ext of ['avif', 'webp']) {
      expect(existsSync(resolve(__dirname, `../app/styles/photos/${id}.${ext}`)), `${id}.${ext}`).toBe(true);
    }
  }
});

test('a festival hero shows its picture under the colour band, with a credit that lands on /sources/', async ({ page }) => {
  await page.goto('/festivals/diwali/');
  expect(await shownPicture(page, '.hero-photo', '::before')).toContain('/_next/static/media/lamp.');
  const credit = page.locator('a.hero-photo-credit');
  await expect(credit).toHaveAttribute('href', '/sources/#picture-lamp');
  await expect(credit).toBeVisible();

  await credit.click();
  await expect(page).toHaveURL(/\/sources\/#picture-lamp$/);
  await expect(page.locator('#picture-lamp')).toBeInViewport();
  await expect(page.locator('#picture-lamp a')).toHaveAttribute('href', /commons\.wikimedia\.org/);
});

test('section and mantra pages open with a cover picture', async ({ page }) => {
  for (const [route, photo] of [
    ['/scriptures/', 'manuscript'],
    ['/mantras/gayatri-mantra/', 'dawn'],
  ] as const) {
    await page.goto(route);
    expect(await shownPicture(page, '.page-cover-art', null), route).toContain(`/_next/static/media/${photo}.`);
    await expect(page.locator('.page-cover-art').first()).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('a.page-cover-credit').first()).toHaveAttribute('href', `/sources/#picture-${photo}`);
  }
});

test('Data Saver loads no page picture', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dharma.perf.dataSaver', 'true'));
  // The early script in app/layout.tsx sets Data Saver before first paint, so not even the
  // moment before hydration starts a photo download.
  const photos: string[] = [];
  page.on('request', (request) => {
    if (/\/_next\/static\/media\/[^/]+\.(avif|webp)/.test(request.url())) photos.push(request.url());
  });
  await page.goto('/characters/hanuman/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-data-saver', 'true');
  expect(await shownPicture(page, '.hero-photo', '::before')).toBe('');
  await expect(page.locator('a.hero-photo-credit')).toBeHidden();
  await page.goto('/scriptures/', { waitUntil: 'load' });
  await expect(page.locator('.page-cover').first()).toBeHidden();
  expect(photos).toEqual([]);
});

test('print shows no page picture', async ({ page }) => {
  await page.goto('/scriptures/');
  await expect(page.locator('.page-cover').first()).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.page-cover').first()).toBeHidden();
});
