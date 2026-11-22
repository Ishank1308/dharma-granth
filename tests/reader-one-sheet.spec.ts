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

/**
 * A chapter at Study renders every explanation, so it hydrates late and a first press can land before
 * the button listens. The button only opens the sheet, so pressing again until it shows is safe.
 */
async function openAaSheetWhenReady(page: Page): Promise<Locator> {
  const sheet = page.getByRole('dialog', { name: /Reader settings/ });
  await expect(async () => {
    if (!(await sheet.isVisible())) await page.getByRole('button', { name: /Reader settings/ }).first().click({ timeout: 2000 });
    await expect(sheet).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 30_000 });
  return sheet;
}

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

test('the Aa sheet holds reading depth and the chapter views', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('dharma.readingDepth', 'read'));
  await page.goto(gitaChapter);
  const card = page.locator('article.verse-card:not(.vt)').first();
  await expect(card).toBeVisible();
  await expect(card.locator('section[id$="-arth"]')).toBeVisible();

  const sheet = await openAaSheet(page);
  await expect(sheet.getByRole('radiogroup', { name: /Reading depth/ }).getByRole('radio')).toHaveCount(3);
  await expect(sheet.getByRole('group', { name: /Show reading layers/ }).getByRole('checkbox')).toHaveCount(4);

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

test('the reading depth choices fit the sheet on a 320px phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(gitaChapter);
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  const sheet = await openAaSheet(page);
  const group = sheet.getByRole('radiogroup', { name: /Reading depth/ });
  await expect(group.getByRole('radio')).toHaveCount(3);

  const fit = await group.evaluate((el) => {
    const edge = el.getBoundingClientRect().right;
    return {
      groupRight: edge,
      radios: [...el.querySelectorAll<HTMLElement>('[role="radio"]')].map((radio) => ({
        name: radio.textContent,
        // Inside the group, and neither name cut off.
        inside: radio.getBoundingClientRect().right <= edge + 0.5,
        whole: radio.scrollWidth <= radio.clientWidth,
      })),
    };
  });
  expect(fit.groupRight).toBeLessThanOrEqual(320);
  expect(fit.radios.filter((radio) => !radio.inside || !radio.whole)).toEqual([]);
  // Both names of each choice stay on screen.
  for (const name of ['समझें', 'Understand']) await expect(group.getByText(name, { exact: true })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
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

// One reading depth for chapter and verse pages (lib/reading-depth). Before a first choice each page
// keeps the view it always opened with; after one, both follow it, and "Reset to defaults" forgets it.
test('chapter and verse pages share one Read / Understand / Study choice', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const depthIn = (sheet: Locator) => sheet.getByRole('radiogroup', { name: /Reading depth/ });

  await page.goto(gitaChapter);
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  let sheet = await openAaSheet(page);
  await expect(depthIn(sheet).getByRole('radio', { name: /Read/ })).toBeChecked();

  await page.goto(gitaVerse);
  await expect(page.locator('#layer-explanation-title')).toHaveText('Vyakhya (व्याख्या)');
  sheet = await openAaSheet(page);
  await expect(depthIn(sheet).getByRole('radio')).toHaveCount(3);
  await expect(depthIn(sheet).getByRole('radio', { name: /Understand/ })).toBeChecked();
  // The verse page's own four levels are gone; the perspective stays beside the depth.
  await expect(sheet.getByRole('button', { name: /Traditional|Quick|शास्त्रीय|त्वरित/ })).toHaveCount(0);
  await expect(sheet.getByRole('group', { name: /Reading perspective/ }).getByRole('button')).toHaveCount(4);

  // Study chosen on a verse page opens the next chapter at Study.
  await depthIn(sheet).getByRole('radio', { name: /Study/ }).click();
  await expect(depthIn(sheet).getByRole('radio', { name: /Study/ })).toBeChecked();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('dharma.readingDepth'))).toBe('study');

  await page.goto(gitaChapter);
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  sheet = await openAaSheetWhenReady(page);
  await expect(depthIn(sheet).getByRole('radio', { name: /Study/ })).toBeChecked();

  // Read chosen on the chapter gives the verse page its short view.
  await depthIn(sheet).getByRole('radio', { name: /Read/ }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('dharma.readingDepth'))).toBe('read');
  await page.goto(gitaVerse);
  await expect(page.locator('#layer-explanation-title')).toHaveText('Key Message');
  sheet = await openAaSheet(page);
  await expect(depthIn(sheet).getByRole('radio', { name: /Read/ })).toBeChecked();

  // Reset forgets the choice: each page opens as it did at first.
  await sheet.getByRole('button', { name: /Reset to defaults/ }).click();
  await expect(depthIn(sheet).getByRole('radio', { name: /Understand/ })).toBeChecked();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('dharma.readingDepth'))).toBeNull();
  await expect(page.locator('#layer-explanation-title')).toHaveText('Vyakhya (व्याख्या)');
});
