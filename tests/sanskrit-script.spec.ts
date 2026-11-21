import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * "Sanskrit script" in the Aa sheet shows the stored Devanagari letter for letter in another
 * Indian script (lib/sanskrit-script-view.ts). The verse here is Gita 2.47.
 */

const verse = '/scripture/bhagavadgita/chapter/2/verse/47/';
const chapter = '/scripture/bhagavadgita/chapter/2/';
const DEVANAGARI_LETTER = /[ऄ-ह]/;

const FIRST_LINE = {
  deva: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
  telu: 'కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన',
  // Malayalam writes the repha as the chillu ർ.
  mlym: 'കർമണ്യേവാധികാരസ്തേ മാ ഫലേഷു കദാചന',
  // Bengali has no separate va.
  beng: 'কর্মণ্যেবাধিকারস্তে মা ফলেষু কদাচন',
};

async function openAaSheet(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: /^Reader settings/ }).first().click();
  const sheet = page.getByRole('dialog', { name: /Reader settings/ });
  await expect(sheet).toBeVisible();
  return sheet;
}

test('the Aa sheet shows the shloka in the chosen script and brings Devanagari back', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(verse);
  const shloka = page.locator('#sanskrit-text');
  await expect(shloka).toContainText(FIRST_LINE.deva);
  await expect(page.locator('html')).not.toHaveAttribute('data-sa-script');

  const sheet = await openAaSheet(page);
  await sheet.getByText('తెలుగు').click();
  await expect(shloka).toContainText(FIRST_LINE.telu);
  await expect(shloka).not.toContainText(DEVANAGARI_LETTER);
  await expect(page.locator('html')).toHaveAttribute('data-sa-script', 'telu');
  // The preview inside the sheet follows too.
  await expect(sheet.locator('[lang="sa"]').first()).not.toContainText(DEVANAGARI_LETTER);

  // The choice is kept on the device.
  await page.reload();
  await expect(shloka).toContainText(FIRST_LINE.telu);

  const again = await openAaSheet(page);
  await again.getByText('മലയാളം').click();
  await expect(shloka).toContainText(FIRST_LINE.mlym);

  await again.getByText('देवनागरी').click();
  await expect(shloka).toContainText(FIRST_LINE.deva);
  await expect(page.locator('html')).not.toHaveAttribute('data-sa-script');
});

test('a chapter follows the stored script as verses load, and only the Sanskrit changes', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('dharma.readerSettings', JSON.stringify({ sanskritScript: 'beng' }));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(chapter);

  const first = page.locator('#verse-1');
  await expect(first.locator('p[lang="sa"]').first()).not.toContainText(DEVANAGARI_LETTER);
  // The speaker line above the verse is Sanskrit too.
  await expect(first).toContainText('উবাচ');
  // The Hindi meaning stays in Devanagari.
  await expect(first.locator('[lang="hi"]').filter({ hasText: DEVANAGARI_LETTER }).first()).toBeVisible();

  // Verse 47 is far down the page and becomes an interactive card only when it nears the screen.
  const later = page.locator('#verse-47');
  await later.scrollIntoViewIfNeeded();
  await expect(later.locator('p[lang="sa"]').first()).toContainText(FIRST_LINE.beng);
  await expect(later.locator('p[lang="sa"]').first()).not.toContainText(DEVANAGARI_LETTER);
});
