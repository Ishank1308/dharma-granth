import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Automated accessibility audit (axe, WCAG 2 A/AA) in every colour theme.
 * Fails on serious and critical violations; lesser ones are only logged.
 */
const THEMES = ['day', 'sunset', 'night'] as const;
const PAGES = [
  '/',
  '/scriptures/',
  '/scripture/bhagavadgita/',
  '/scripture/bhagavadgita/chapter/2/',
  '/scripture/bhagavadgita/chapter/2/verse/47/',
  '/dashboard/',
  '/practice/',
  '/concepts/',
  '/dictionary/',
  '/topics/',
  '/characters/',
  '/festivals/',
  '/curiosity/',
  '/learn/',
  '/learn/pathways/',
  '/collections/',
  '/bookmarks/',
  '/timelines/',
  '/contribute/',
];

for (const theme of THEMES) {
  for (const path of PAGES) {
    test(`a11y [${theme}]: ${path}`, async ({ page }) => {
      if (path.includes('/chapter/')) {
        test.slow();
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((t) => localStorage.setItem('dharma-theme', t), theme);
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      // Scroll through so scroll-triggered sections appear, then let fades finish.
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 800) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1000);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      console.log(
        `${theme} ${path}: ` + (violations.map((v) => `${v.id}(${v.impact},${v.nodes.length})`).join(' ') || 'clean'),
      );
      expect(
        blocking.map(
          (v) => `${v.id}: ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`,
        ),
      ).toEqual([]);
    });
  }
}

/** Interactive states: overlays and menus that the page-load audit never opens. */
async function audit(page: import('@playwright/test').Page, label: string) {
  await page.waitForTimeout(800);
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  console.log(`${label}: ` + (violations.map((v) => `${v.id}(${v.impact},${v.nodes.length})`).join(' ') || 'clean'));
  expect(
    blocking.map((v) => `${v.id}: ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`),
  ).toEqual([]);
}

for (const theme of THEMES) {
  test(`a11y [${theme}]: search modal with results`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((t) => localStorage.setItem('dharma-theme', t), theme);
    await page.goto('/scriptures/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /खोजें|Search/ }).first().click();
    const box = page.getByRole('dialog', { name: 'Global Search' }).getByRole('combobox');
    await box.fill('karma');
    await expect(page.getByRole('dialog', { name: 'Global Search' }).getByRole('option').first()).toBeVisible();
    await audit(page, `${theme} search modal`);
  });

  test(`a11y [${theme}]: mobile navigation menu`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((t) => localStorage.setItem('dharma-theme', t), theme);
    await page.goto('/scriptures/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /नेविगेशन मेनू खोलें|Open navigation menu/ }).click();
    await expect(page.locator('#mobile-navigation-drawer')).toBeVisible();
    await audit(page, `${theme} mobile menu`);
  });
}

test('a11y: desktop discovery menu', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'अन्वेषण' }).click();
  await expect(page.locator('#desktop-discovery-menu')).toBeVisible();
  await audit(page, 'desktop discovery menu');
});

/** WCAG 2.2 AA: touch targets on a phone-sized screen. */
for (const path of ['/', '/scriptures/', '/scripture/bhagavadgita/', '/scripture/bhagavadgita/chapter/2/', '/dashboard/']) {
  test(`a11y [mobile target size]: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1200);
    const { violations } = await new AxeBuilder({ page }).withRules(['target-size']).analyze();
    expect(
      violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`),
    ).toEqual([]);
  });
}
