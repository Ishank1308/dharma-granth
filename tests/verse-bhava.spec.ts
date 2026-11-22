import { expect, test } from '@playwright/test';

// The picture behind a chapter's verses follows the scripture's bhāva (lib/scripture-bhava.ts): a
// picture outside the text's feeling, or a chapter with none, shows one of the scripture's own
// pictures, and the bhāva is on the reading wrapper for the colour (scene-photos.css).

const CASES: [path: string, bhava: string, photo: RegExp][] = [
  // Karma Yoga used to sit on a photo of an unlit havan kund; the Gita keeps to Krishna and Arjuna.
  ['/scripture/bhagavadgita/chapter/3/', 'vira', /^(gita-chariot|kurukshetra)$/],
  // A battle painting stood behind this Upanishad section.
  ['/scripture/chandogya/chapter/5/', 'shanta', /^(gurukul|forest|dawn|stars)$/],
  // No picture at all before.
  ['/scripture/tejobindu/chapter/1/', 'shanta', /^(gurukul|forest|dawn|stars)$/],
  ['/scripture/durgasaptashati/chapter/2/', 'shakti', /^devi$/],
];

for (const [path, bhava, photo] of CASES) {
  test(`verse pictures carry the scripture's bhāva: ${path}`, async ({ page }) => {
    await page.goto(path);
    const reading = page.locator('main[data-chapter-reading]');
    await expect(reading).toHaveAttribute('data-bhava', bhava);
    await expect(reading).toHaveAttribute('data-photo', photo);
  });
}

test('the bhāva colour is blended into the picture, and the verse stays readable over it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scripture/yajurveda/chapter/1/');
  const reading = page.locator('main[data-chapter-reading]');
  await expect(reading).toHaveAttribute('data-bhava', 'tejas');
  const folio = page.locator('.verse-card .verse-folio').first();
  await expect(folio).toBeVisible();
  const before = await folio.evaluate((el) => {
    const s = getComputedStyle(el, '::before');
    return { blend: s.backgroundBlendMode, layers: s.backgroundImage.split('gradient(').length - 1, image: s.backgroundImage };
  });
  // Veil, two bhāva layers, then the photo itself.
  expect(before.blend).toContain('soft-light');
  expect(before.layers).toBeGreaterThanOrEqual(3);
  expect(before.image).toContain('yajna');
});
