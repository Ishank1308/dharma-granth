import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * One place for every reading choice: the Aa sheet (ReaderSettingsPanel). The chapter's running
 * head keeps what moves the reader through the chapter (verse count, jump, search); reading depth,
 * the recitation and conversation views, the one-verse view and what read-aloud speaks sit in the
 * sheet. The verse page's study path only navigates; text size is in the sheet.
 */

const gitaChapter = '/scripture/bhagavadgita/chapter/2/';
const otherChapter = '/scripture/ishavasya/chapter/1/';
const gitaVerse = '/scripture/bhagavadgita/chapter/2/verse/47/';

async function openAaSheet(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: /Reader settings/ }).first().click();
  const sheet = page.getByRole('dialog', { name: /Reader settings/ });
  await expect(sheet).toBeVisible();
  return sheet;
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
  test(`the chapter's running head offers jump, Aa and search only at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(gitaChapter);
    await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();

    await expect(page.getByRole('button', { name: /Options/ })).toHaveCount(0);
    await expect(page.getByRole('group', { name: /Language layers/ })).toHaveCount(0);
    await expect(page.getByRole('combobox', { name: /Jump to verse/ })).toBeVisible();

    for (const name of [/Reader settings/, /Search this chapter/]) {
      const box = await page.getByRole('button', { name }).boundingBox();
      expect(box?.width, `${name} is a full touch target`).toBeGreaterThanOrEqual(44);
      expect(box?.height, `${name} is a full touch target`).toBeGreaterThanOrEqual(44);
    }
  });
}

test('the Aa sheet holds reading depth, the chapter views and what read-aloud speaks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('dharma.readingDepth', 'read'));
  await page.goto(gitaChapter);
  const card = page.locator('article.verse-card:not(.vt)').first();
  await expect(card).toBeVisible();
  await expect(card.locator('section[id$="-arth"]')).toBeVisible();

  const sheet = await openAaSheet(page);
  await expect(sheet.getByRole('radiogroup', { name: /Reading depth/ }).getByRole('radio')).toHaveCount(3);
  await expect(sheet.getByRole('group', { name: /Show reading layers/ }).getByRole('checkbox')).toHaveCount(4);

  // What read-aloud speaks after each shloka is kept for the next visit.
  const aloud = sheet.getByRole('group', { name: /Read aloud/ });
  await expect(aloud.getByRole('radio')).toHaveCount(3);
  await aloud.getByText('+ हिन्दी').click();
  await expect(aloud.getByRole('radio', { name: /हिन्दी/ })).toBeChecked();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('dharma:parayana-mode'))).toBe('sanskrit_hindi');

  // Recitation view leaves the Sanskrit alone on the page.
  const recitation = sheet.getByRole('checkbox', { name: /Recitation view/ });
  await recitation.check();
  await expect(card.locator('section[id$="-arth"]')).toBeHidden();
  await expect(card.locator('.verse-folio > p[lang="sa"]')).toBeAttached();
  await recitation.uncheck();
  await expect(card.locator('section[id$="-arth"]')).toBeAttached();

  // The one-verse view opens from the sheet, and the sheet steps aside for it.
  await sheet.getByRole('button', { name: /One verse at a time/ }).click();
  await expect(page.getByRole('dialog', { name: /एकाग्रता मोड/ })).toBeVisible();
  await expect(sheet).toBeHidden();
});

test('the conversation view is offered for the Gita only', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(gitaChapter);
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  let sheet = await openAaSheet(page);
  const conversation = sheet.getByRole('checkbox', { name: /Conversation view/ });
  await conversation.check();
  await expect(page.getByLabel('Conversation Mode')).toBeVisible();
  await conversation.uncheck();
  await expect(page.getByLabel('Conversation Mode')).toHaveCount(0);

  await page.goto(otherChapter);
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  sheet = await openAaSheet(page);
  await expect(sheet.getByRole('checkbox', { name: /Recitation view/ })).toBeVisible();
  await expect(sheet.getByRole('checkbox', { name: /Conversation view/ })).toHaveCount(0);
});

test('search within the chapter opens from the running head and takes the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(gitaChapter);
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();

  const toggle = page.getByRole('button', { name: /Search this chapter/ });
  const field = page.getByRole('searchbox', { name: /Search verses in this chapter/ });
  await expect(field).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(field).toBeFocused();

  await page.keyboard.type('47');
  await expect(page.locator('#verse-47')).toBeVisible();
  await expect(page.locator('#verse-1')).toHaveCount(0);

  await page.getByRole('button', { name: 'Clear filter' }).click();
  await expect(field).toHaveValue('');
  await expect(field).toBeFocused();
  await expect(page.locator('#verse-1')).toBeAttached();
});

test('the verse page keeps text size in the Aa sheet, not in the study path', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(gitaVerse);
  const guide = page.getByRole('navigation', { name: /Verse study guide/ });
  await expect(guide).toBeVisible();
  await expect(guide.getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /text size/ })).toHaveCount(0);

  const sheet = await openAaSheet(page);
  await expect(sheet.getByRole('group', { name: /Sanskrit size/ }).getByRole('radio')).toHaveCount(4);
  await expect(sheet.getByRole('group', { name: /Translation size/ }).getByRole('radio')).toHaveCount(4);
});

// The sheet now carries the chapter's controls too, so it gets the audit the pages get (WCAG 2 A/AA,
// serious and critical findings), in both themes, and the phone touch-target rule.
for (const theme of ['sunset', 'night'] as const) {
  test(`the chapter's Aa sheet passes the accessibility audit in the ${theme} theme`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((t) => localStorage.setItem('dharma-theme', t), theme);
    await page.goto(gitaChapter);
    await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
    await openAaSheet(page);
    await page.waitForTimeout(500);

    // Two runs: withRules replaces withTags on one builder.
    const wcag = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const targets = await new AxeBuilder({ page }).include('[role="dialog"]').withRules(['target-size']).analyze();
    const blocking = [
      ...wcag.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
      ...targets.violations,
    ];
    expect(
      blocking.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`),
    ).toEqual([]);
  });
}
