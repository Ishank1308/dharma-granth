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
  // Saved under the audio engine's own key, so the engine starts with it at the first play.
  await expect.poll(() => page.evaluate(() => localStorage.getItem('dharma_parayana_mode'))).toBe('sanskrit_hindi');

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

/**
 * A stand-in voice: it notes what it is asked to speak and finishes each line at once. The engine
 * announces a spoken translation with its own event, which is noted too.
 */
async function standInVoice(page: Page) {
  await page.addInitScript(() => {
    const heard = { lines: [] as string[], translations: [] as string[] };
    (window as unknown as { __heard: typeof heard }).__heard = heard;
    window.addEventListener('dharma:recitation-chunk', (event) => {
      const detail = (event as CustomEvent<{ isTranslation?: boolean; language?: string }>).detail;
      if (detail?.isTranslation && detail.language) heard.translations.push(detail.language);
    });
    const synth = window.speechSynthesis;
    synth.cancel = () => {};
    synth.speak = (utterance) => {
      heard.lines.push(utterance.text);
      setTimeout(() => {
        utterance.onstart?.(new Event('start') as SpeechSynthesisEvent);
        utterance.onend?.(new Event('end') as SpeechSynthesisEvent);
      }, 0);
    };
  });
  return () => page.evaluate(() => (window as unknown as { __heard: { lines: string[]; translations: string[] } }).__heard);
}

test('the first Listen press after a page load speaks the shloka, then the meaning chosen before it', async ({ page }) => {
  const heard = await standInVoice(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(gitaChapter);
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();

  // Chosen before any audio has played, so before the audio engine has loaded.
  let sheet = await openAaSheet(page);
  await sheet.getByRole('group', { name: /Read aloud/ }).getByText('+ हिन्दी').click();
  await expect(sheet.getByRole('group', { name: /Read aloud/ }).getByRole('radio', { name: /हिन्दी/ })).toBeChecked();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();

  // The dock's श्रवण button chants the chapter from the verse in view.
  const dock = page.locator('[aria-label*="Reader dock"]');
  await dock.getByRole('button', { name: /Listen/ }).click();
  await expect.poll(async () => (await heard()).lines.length).toBeGreaterThan(0);
  expect((await heard()).lines[0]).toMatch(/[\u0900-\u097F]/);
  // The page shows that it is chanting, and the Hindi meaning follows the shloka.
  await expect(dock.getByRole('button', { name: /Pause chanting/ })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(async () => (await heard()).translations, { timeout: 10_000 }).toContain('hi');
  await dock.getByRole('button', { name: /Pause chanting/ }).click();
  await expect(dock.getByRole('button', { name: /Listen/ })).toHaveAttribute('aria-pressed', 'false');

  // The engine has loaded by now; the sheet still shows the reader's choice, and so does the next visit.
  sheet = await openAaSheet(page);
  await expect(sheet.getByRole('group', { name: /Read aloud/ }).getByRole('radio', { name: /हिन्दी/ })).toBeChecked();
  await page.reload();
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  sheet = await openAaSheet(page);
  await expect(sheet.getByRole('group', { name: /Read aloud/ }).getByRole('radio', { name: /हिन्दी/ })).toBeChecked();
});

// The service worker serves /_next/static/ cache-first, and page.route() does not see requests
// a service worker answers. Once it has claimed the page, the late audio engine below would
// arrive instantly (or never be counted), so this test runs without it.
test.describe('with the audio engine arriving late', () => {
  test.use({ serviceWorkers: 'block' });

  test('a pause pressed while the audio is still loading keeps the shloka silent', async ({ page }) => {
    const heard = await standInVoice(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(gitaChapter);
    await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
    await page.waitForLoadState('networkidle');

    // From here on, code the page fetches arrives late: the audio engine loads on the first press.
    let late = 0;
    let inFlight = 0;
    await page.route('**/_next/static/chunks/**', async (route) => {
      late++;
      inFlight++;
      await new Promise((resolve) => setTimeout(resolve, 2500));
      await route.continue().finally(() => inFlight--);
    });

    const dock = page.locator('[aria-label*="Reader dock"]');
    await dock.getByRole('button', { name: /Listen/ }).click();
    await dock.getByRole('button', { name: /Pause chanting/ }).click();
    await expect(dock.getByRole('button', { name: /Listen/ })).toHaveAttribute('aria-pressed', 'false');

    // Once the engine has arrived and run, nothing was spoken and the dock still says stopped.
    await expect.poll(() => late > 0 && inFlight === 0, { timeout: 15_000 }).toBe(true);
    await page.waitForTimeout(1000);
    expect((await heard()).lines).toEqual([]);
    await expect(dock.getByRole('button', { name: /Listen/ })).toHaveAttribute('aria-pressed', 'false');

    // The engine works: the next press speaks.
    await page.unroute('**/_next/static/chunks/**');
    await dock.getByRole('button', { name: /Listen/ }).click();
    await expect.poll(async () => (await heard()).lines.length).toBeGreaterThan(0);
  });
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
