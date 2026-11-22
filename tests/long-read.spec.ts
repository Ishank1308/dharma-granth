import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * The phone pass on long older pages (app/styles/long-read.css, app/components/OnThisPage.tsx):
 * running text reads at 16px, a contents list jumps to each section, nothing scrolls the page
 * sideways and a wide table scrolls inside its own box.
 */
const PHONE = { width: 390, height: 844 };
const LONG_PAGES = ['/festivals/diwali/', '/characters/krishna/', '/concepts/dharma/'];

test.use({ viewport: PHONE });

async function open(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

async function sidewaysOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

for (const path of LONG_PAGES) {
  test(`contents list on ${path}: closed at first, every row reaches its section`, async ({ page }) => {
    await open(page, path);
    const nav = page.locator('#main-content nav[aria-label="On this page"]');
    await expect(nav).toHaveCount(1);
    const details = nav.locator('details');
    const summary = nav.locator('summary');
    await expect(summary).toContainText('On this page');
    await expect(summary.locator('[lang="hi"][data-bi="hi"]')).toHaveText('इस पृष्ठ पर');
    expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);

    const links = nav.locator('ol a');
    const count = await links.count();
    expect(count).toBeGreaterThan(4);
    // More than four rows: the list waits behind its summary, so the first paragraph stays near.
    await expect(details).not.toHaveAttribute('open', /.*/);
    await summary.click();
    await expect(details).toHaveAttribute('open', /.*/);

    const hrefs = await links.evaluateAll((as) => as.map((a) => a.getAttribute('href') || ''));
    expect(new Set(hrefs).size).toBe(count);
    for (const href of hrefs) {
      expect(href.startsWith('#')).toBe(true);
      await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
    }
    const heights = await links.evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height));
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);

    // A row lands its heading below the sticky header, not under it.
    await links.nth(2).click();
    await page.waitForTimeout(500);
    const top = await page.evaluate((id) => document.getElementById(id)!.getBoundingClientRect().top, hrefs[2].slice(1));
    expect(top).toBeGreaterThanOrEqual(56);
    expect(top).toBeLessThan(PHONE.height / 2);
  });

  test(`running text on ${path} is at least 16px and the page does not scroll sideways`, async ({ page }) => {
    await open(page, path);
    const small = await page.evaluate(() => {
      const main = document.querySelector('#main-content')!;
      return [...main.querySelectorAll<HTMLElement>('p, li, dd')]
        .filter((el) => !el.closest('footer, nav, a, button, table') && el.offsetParent !== null)
        // Transliteration keeps its line breaks and its own small italic; footnotes are italic too.
        .filter((el) => !el.matches('.whitespace-pre-line, .italic, [lang="sa"]'))
        .filter((el) => (el.textContent || '').trim().length > 120)
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
        .map((el) => `${el.tagName}.${el.className}`.slice(0, 80));
    });
    expect(small).toEqual([]);
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
  });
}

test('a Sanskrit verse on a long page keeps its own size and is never clamped', async ({ page }) => {
  await open(page, '/concepts/dharma/');
  const verses = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('#main-content article p[lang="sa"]')].map((el) => {
      const cs = getComputedStyle(el);
      return { size: parseFloat(cs.fontSize), clamp: cs.webkitLineClamp, overflow: cs.overflow, cut: el.scrollHeight - el.clientHeight };
    }),
  );
  expect(verses.length).toBeGreaterThan(0);
  for (const v of verses) {
    expect(v.size).toBeGreaterThanOrEqual(17);
    expect(v.clamp).toBe('none');
    expect(v.cut).toBeLessThanOrEqual(1);
  }
});

test('a short contents list starts open', async ({ page }) => {
  await open(page, '/sources/');
  const nav = page.locator('#main-content nav[aria-label="On this page"]');
  await expect(nav.locator('details')).toHaveAttribute('open', /.*/);
  const hrefs = await nav.locator('ol a').evaluateAll((as) => as.map((a) => a.getAttribute('href') || ''));
  expect(hrefs.length).toBeLessThanOrEqual(4);
  for (const href of hrefs) await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
});

test('the mantra list offers only the mantras now showing', async ({ page }) => {
  await open(page, '/mantras/');
  const rows = page.locator('#main-content nav[aria-label="On this page"] ol a');
  const all = await rows.count();
  expect(all).toBeGreaterThan(10);
  await page.getByRole('button', { name: /Shanti Patha/ }).click();
  await expect.poll(() => rows.count()).toBeLessThan(all);
  const hrefs = await rows.evaluateAll((as) => as.map((a) => a.getAttribute('href') || ''));
  for (const href of hrefs) await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
});

test('a wide table scrolls inside its own box, and a keyboard can reach it', async ({ page }) => {
  await open(page, '/mantras/gayatri-mantra/');
  const box = page.locator('#main-content .long-read-table');
  await expect(box).toHaveCount(1);
  await expect(box).toHaveAttribute('tabindex', '0');
  await expect(box).toHaveAttribute('role', 'region');
  await expect(box).toHaveAttribute('aria-label', /.+/);
  await expect(box.locator('table thead th')).toHaveCount(4);

  const before = await box.evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
  expect(before.scroll).toBeGreaterThan(before.client);
  expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);

  await box.evaluate((el) => el.scrollTo({ left: 200 }));
  expect(await box.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollX)).toBe(0);

  const cells = await box.locator('tbody td').evaluateAll((tds) => tds.map((td) => parseFloat(getComputedStyle(td).fontSize)));
  expect(Math.min(...cells)).toBeGreaterThanOrEqual(15);
});

for (const theme of ['sunset', 'night'] as const) {
  test(`axe [${theme}]: the open contents list and the table box`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('dharma-theme', t), theme);
    await open(page, '/festivals/diwali/');
    await page.locator('.on-this-page summary').click();
    await page.waitForTimeout(400);
    const list = await new AxeBuilder({ page })
      .include('.on-this-page')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(list.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

    await open(page, '/mantras/gayatri-mantra/');
    const table = await new AxeBuilder({ page })
      .include('.long-read-table')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(table.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}
