import { expect, test } from '@playwright/test';

test('learning course shows calm progress and accessible keyboard tabs on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn/beginner/');

  const progress = page.getByRole('progressbar', { name: 'Lessons completed' });
  await expect(progress).toBeVisible();
  await expect(progress).toHaveAttribute('aria-valuemin', '0');
  await expect(progress).toHaveAttribute('aria-valuenow', /^\d+$/);

  const tabs = page.getByRole('tablist', { name: 'Course Sections' });
  await expect(tabs).toBeVisible();
  const overview = tabs.getByRole('tab', { name: /Overview & Lessons/ });
  const concepts = tabs.getByRole('tab', { name: /Key Concepts/ });
  await expect(overview).toHaveAttribute('aria-selected', 'true');
  await overview.focus();
  await page.keyboard.press('ArrowRight');
  await expect(concepts).toHaveAttribute('aria-selected', 'true');
  await expect(concepts).toBeFocused();
  await page.keyboard.press('Home');
  await expect(overview).toBeFocused();
  await expect(overview).toHaveAttribute('aria-selected', 'true');
});

test('saved reading collection tabs remain usable on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/practice/bookmarks/');
  const tabs = page.getByRole('tablist', { name: 'Sanctuary sections' });
  const saved = tabs.getByRole('tab', { name: /Saved Verses/ });
  const highlights = tabs.getByRole('tab', { name: /Highlights & Tags/ });
  await expect(saved).toBeVisible();
  await saved.focus();
  await page.keyboard.press('ArrowRight');
  await expect(highlights).toBeFocused();
  await expect(highlights).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab', { name: /Privacy Guarantee/ })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(saved).toBeFocused();
  await expect(saved).toHaveAttribute('aria-selected', 'true');
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(321);
});
