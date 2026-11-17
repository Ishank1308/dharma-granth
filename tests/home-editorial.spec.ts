import { expect, test } from '@playwright/test';

test('editorial homepage has an honest headline, searchable entry point and full featured verse', async ({ page }) => {
  await page.goto('/');

  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toHaveText(/Ancient words\.\s*Living wisdom\./);
  await expect(heading).not.toContainText('Complete');

  await expect(page.getByRole('button', { name: /Search scriptures/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Explore the library/ })).toHaveAttribute('href', '/scriptures/');

  const featured = page.getByRole('complementary', { name: 'Featured paths into the library' });
  const verseLink = featured.getByRole('link', { name: /Read the verse/ });
  await expect(verseLink).toHaveAttribute('href', '/scripture/bhagavadgita/chapter/2/verse/47/');
  await expect(verseLink).toContainText('कर्मण्येवाधिकारस्ते मा फलेषु कदाचन');
  await expect(verseLink).toContainText('मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि');
  await expect(featured.getByRole('link', { name: /Discover the Upanishads/ })).toHaveAttribute('href', '/scripture/ishavasya/');
  await expect(featured.getByRole('link', { name: /A moment to reflect/ })).toHaveAttribute('href', '/daily-verse/');
});

test('editorial homepage keeps the main actions and eight discovery paths usable on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: /Search scriptures/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Start with the Gita/ })).toBeVisible();

  for (const title of [/Life & reflection/, /Daily practice/]) {
    const links = page.getByRole('navigation', { name: title }).getByRole('link');
    await expect(links).toHaveCount(4);
    for (const link of await links.all()) {
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(321);
    }
  }
});
