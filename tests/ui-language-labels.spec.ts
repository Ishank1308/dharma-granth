import { expect, test, type Page } from '@playwright/test';

/**
 * The language choice in the header shows two-language labels (data-bi="en" / "hi") in that
 * language only. The choice sits on <html data-ui-lang>; app/layout.tsx sets it before first
 * paint and lib/useLanguagePreference.ts keeps it in step afterwards.
 */

const header = '[data-site-header="true"]';

async function chooseInHeader(page: Page, option: RegExp) {
  await page.getByRole('button', { name: /^भाषा प्राथमिकता/ }).click();
  await page.getByRole('listbox', { name: 'भाषा प्राथमिकता चुनें' }).getByRole('option', { name: option }).click();
}

test('the header language choice shows labels in one language and survives a reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');

  // First desktop nav link: "Home" beside "मुख".
  const english = page.locator(`${header} a [data-bi="en"]`).first();
  const hindi = page.locator(`${header} a [data-bi="hi"]`).first();
  await expect(english).toBeVisible();
  await expect(hindi).toBeVisible();

  await chooseInHeader(page, /हिन्दी \(Hindi\)/);
  await expect(page.locator('html')).toHaveAttribute('data-ui-lang', 'hindi');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(english).toBeHidden();
  await expect(hindi).toBeVisible();
  // Both halves stay in the page for crawlers and screen readers that ignore the choice.
  await expect(english).toHaveCount(1);

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-ui-lang', 'hindi');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(english).toBeHidden();
  await expect(hindi).toBeVisible();

  await chooseInHeader(page, /^English/);
  await expect(page.locator('html')).toHaveAttribute('data-ui-lang', 'english');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(english).toBeVisible();
  await expect(hindi).toBeHidden();

  await chooseInHeader(page, /द्विभाषी/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(english).toBeVisible();
  await expect(hindi).toBeVisible();
});

test('the phone drawer shows the same choice as the header menu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await chooseInHeader(page, /हिन्दी \(Hindi\)/);
  await expect(page.locator('html')).toHaveAttribute('data-ui-lang', 'hindi');

  // Same page, now at phone width: the drawer's copy of the setting must agree without a reload.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('button[aria-controls="mobile-navigation-drawer"]').first().click();
  const radios = page.getByRole('radiogroup', { name: 'भाषा प्राथमिकता' }).getByRole('radio');
  await expect(radios.filter({ hasText: 'प्राथमिक हिन्दी' })).toHaveAttribute('aria-checked', 'true');

  await radios.filter({ hasText: 'English focus' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-ui-lang', 'english');
  await expect(radios.filter({ hasText: 'English focus' })).toHaveAttribute('aria-checked', 'true');
});

for (const choice of [
  { lang: 'hindi', shown: 'hi', hidden: 'en', title: 'शास्त्र स्वाध्याय' },
  { lang: 'english', shown: 'en', hidden: 'hi', title: 'Study the scriptures' },
] as const) {
  test(`page titles, section headings and the footer show ${choice.lang} alone when it is chosen`, async ({ page }) => {
    await page.addInitScript((lang) => localStorage.setItem('dharma.language_preference', JSON.stringify(lang)), choice.lang);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/learn/');

    // PageHeader: the title in the chosen language, at title size and in the title's own colour.
    const title = page.locator('#main-content h1').first();
    const shown = title.locator(`[data-bi="${choice.shown}"]`);
    await expect(shown).toBeVisible();
    await expect(shown).toHaveText(choice.title);
    await expect(title.locator(`[data-bi="${choice.hidden}"]`)).toBeHidden();
    // Both halves stay in the page for crawlers and screen readers that ignore the choice.
    await expect(title.locator(`[data-bi="${choice.hidden}"]`)).toHaveCount(1);
    const look = await shown.evaluate((el) => ({
      size: Number.parseFloat(getComputedStyle(el).fontSize),
      sameColour: getComputedStyle(el).color === getComputedStyle(el.closest('h1') as HTMLElement).color,
    }));
    expect(look.size).toBeGreaterThanOrEqual(26);
    if (choice.shown === 'hi') expect(look.sameColour).toBe(true);

    // The eyebrow's second part here is a Sanskrit phrase, not a translation: both parts stay.
    const eyebrow = page.locator('#main-content header p').first();
    await expect(eyebrow.locator('span').first()).toHaveText('Learn');
    await expect(eyebrow.locator('span').first()).toBeVisible();
    await expect(eyebrow.locator('[lang="sa"]')).toBeVisible();

    // SectionTitle
    const section = page.locator('#main-content h2').filter({ has: page.locator('[data-bi]') }).first();
    await expect(section.locator(`[data-bi="${choice.shown}"]`)).toBeVisible();
    await expect(section.locator(`[data-bi="${choice.hidden}"]`)).toBeHidden();
    // Alone, the half that stays starts where the heading starts, without the gap that set it off.
    expect(await section.locator(`[data-bi="${choice.shown}"]`).evaluate((el) => getComputedStyle(el).marginLeft)).toBe('0px');

    // Footer links
    const link = page.locator('footer nav a').first();
    await expect(link.locator(`[data-bi="${choice.shown}"]`)).toBeVisible();
    await expect(link.locator(`[data-bi="${choice.hidden}"]`)).toBeHidden();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

// Headings written by hand on older pages (not through PageHeader or SectionTitle) carry the same
// marks. With one language chosen, each must still read as a whole heading: not empty, no bracket
// or dot left hanging where the other half was, and the page no wider than the phone.
const handWrittenHeadingRoutes = [
  '/panchang/', '/panchang/karanas/', '/panchang/yogas/', '/panchang/calendar/', '/panchang/muhurta/',
  '/locations/', '/timelines/', '/pathways/', '/rituals/upakarma/', '/practice/', '/wisdom-for-life/',
  '/concepts/dharma/',
];

// Once a page title has scrolled under the bar, the bar shows its short form (lib/useFoldingTitle).
const barTitle = async (page: Page) => {
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(page.locator('[data-title-folded="true"]')).toHaveCount(1);
  return page.locator('.bar-page-title');
};

test('the bar shows a two-language title without the bracket that joined its halves', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/panchang/karanas/');
  await expect(await barTitle(page)).toHaveText('The 11 Vedic Karanas');
  // A title that opens with its Hindi half.
  await page.goto('/locations/');
  await expect(await barTitle(page)).toHaveText('Sacred Geography');

  // A language chosen later on the same page (the phone drawer's copy of the setting): the bar
  // follows it without a reload.
  await page.locator('button[aria-controls="mobile-navigation-drawer"]').first().click();
  await page.getByRole('radiogroup', { name: 'भाषा प्राथमिकता' }).getByRole('radio').filter({ hasText: 'प्राथमिक हिन्दी' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-ui-lang', 'hindi');
  await page.keyboard.press('Escape');
  await expect(await barTitle(page)).toHaveText('पवित्र स्थान मानचित्र');
});

for (const choice of [
  { lang: 'hindi', hidden: 'en', sample: '11 करण' },
  { lang: 'english', hidden: 'hi', sample: 'The 11 Vedic Karanas' },
] as const) {
  test(`hand-written headings read whole with ${choice.lang} alone`, async ({ page }) => {
    test.slow();
    await page.addInitScript((lang) => localStorage.setItem('dharma.language_preference', JSON.stringify(lang)), choice.lang);
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of handWrittenHeadingRoutes) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('data-ui-lang', choice.lang);
      await expect(page.locator('#main-content h1').first()).toBeVisible();

      const report = await page.evaluate((hidden) => {
        // The page's own headings: the site footer (also in #main-content) is checked above, and a
        // heading inside a closed section has no visible text to read.
        const marked = [...document.querySelectorAll<HTMLElement>('#main-content :is(h1, h2, h3, h4)')]
          .filter((heading) => heading.querySelector('[data-bi]') && heading.getClientRects().length > 0)
          .filter((heading) => !heading.closest('footer, details:not([open])'));
        const text = (heading: HTMLElement) => heading.innerText.replace(/\s+/g, ' ').trim();
        const isShown = (el: Element | null) => el instanceof HTMLElement && el.getClientRects().length > 0;
        return {
          count: marked.length,
          // A half standing alone where the other half was starts flush, without the margin that set it off.
          indented: marked.flatMap((heading) => [...heading.querySelectorAll<HTMLElement>('[data-bi="en"], [data-bi="hi"]')])
            .filter((half) => isShown(half) && half.previousElementSibling?.matches('[data-bi]') && !isShown(half.previousElementSibling))
            .filter((half) => getComputedStyle(half).marginLeft !== '0px')
            .map((half) => half.textContent),
          // innerText leaves out what the choice hides.
          broken: marked.map(text).filter((t) => t === '' || /^[·|/(]|[·|/(]$|\(\s*\)/.test(t)),
          stillShown: marked.flatMap((heading) => [...heading.querySelectorAll<HTMLElement>(`[data-bi="${hidden}"]`)])
            .filter((half) => half.getClientRects().length > 0).length,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
        };
      }, choice.hidden);
      expect(report.count, `${route} has marked headings`).toBeGreaterThan(0);
      expect(report.broken, `${route} headings read whole`).toEqual([]);
      expect(report.stillShown, `${route} hides the other language`).toBe(0);
      expect(report.indented, `${route} halves alone start flush`).toEqual([]);
      expect(report.overflow, `${route} fits the phone`).toBeLessThanOrEqual(1);
    }

    await page.goto('/panchang/karanas/');
    await expect(page.locator('#main-content h1').first()).toHaveText(choice.sample, { useInnerText: true });
    // The bar's short title follows the same choice.
    await expect(await barTitle(page)).toHaveText(choice.sample);
  });
}
