import { expect, test } from '@playwright/test';

test('scripture library uses truthful coverage wording and singular chapter counts', async ({ page }) => {
  await page.goto('/scriptures/');

  await expect(page).toHaveTitle(/ग्रंथालय/);
  await expect(page.getByText('1 chapter · 18 verses', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('मूल पाठ, हिन्दी अर्थ एवं व्याख्या — जहाँ उपलब्ध')).toBeVisible();
  await expect(page.getByText(/भाषा प्रतिशत केवल यहाँ उपलब्ध श्लोकों में भाषा-पाठ की उपलब्धता/)).toBeVisible();

  // The listing must not suggest all translations are independently authenticated.
  await expect(page.getByText('प्रामाणिक हिंदी अनुवाद')).toHaveCount(0);
});

test('opening the last chapter does not imply the whole book is finished', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('dharma.recentChapters', JSON.stringify([{
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      chapterId: 18,
      chapterTitle: 'Moksha Sannyasa Yoga',
      totalChapters: 18,
      readAt: new Date().toISOString(),
    }]));
  });
  await page.goto('/scriptures/');

  const card = page.locator('article').filter({ hasText: 'Shrimad Bhagavad Gita' }).first();
  await expect(card.getByText('हाल में खोला · अध्याय 18 / 18')).toBeVisible();
  await expect(card.getByRole('link', { name: 'इस अध्याय को खोलें' }))
    .toHaveAttribute('href', '/scripture/bhagavadgita/chapter/18/');
  await expect(card.getByText('पठन प्रगति')).toHaveCount(0);
});
