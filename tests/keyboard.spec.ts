import { expect, test } from '@playwright/test';

/** Keyboard-only use of the search modal and the skip link. */

test('search modal: open with Ctrl+K, arrow to a result, Enter navigates', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Global Search' });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('gita 2.47');
  const first = dialog.getByRole('option').first();
  await expect(first).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/scripture\/bhagavadgita\/chapter\/2\/verse\/47\/?$/);
});

test('search modal: "/" opens it, Escape closes it and returns focus to the page', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('/');
  const dialog = page.getByRole('dialog', { name: 'Global Search' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  // Focus must not be lost to <body>: the next Tab lands on a real control.
  await page.keyboard.press('Tab');
  const tag = await page.evaluate(() => document.activeElement?.tagName);
  expect(tag).not.toBe('BODY');
});

test('search modal keeps Tab focus inside the dialog', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('/');
  const dialog = page.getByRole('dialog', { name: 'Global Search' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"][aria-label="Global Search"]'),
    );
    expect(inside, `focus escaped the dialog on Tab #${i + 1}`).toBe(true);
  }
});

test('skip link is the first Tab stop and moves focus to the main content', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

/** Chapter reader controls, keyboard only. */

test('reader: settings dialog opens with Enter, Space toggles a layer, Escape closes and restores focus', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  // The language and layer choices live in the reader settings dialog.
  const trigger = page.getByRole('button', { name: /Reader settings/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const hindi = page.getByRole('checkbox', { name: /Hindi translation/ });
  await hindi.focus();
  const before = await hindi.isChecked();
  await page.keyboard.press('Space');
  expect(await hindi.isChecked()).toBe(!before);
  await page.keyboard.press('Space');

  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});

test('reader: ArrowRight goes to the next chapter, ArrowLeft back', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  // The first cards are server-rendered, so they show before the key handler hydrates.
  await page.waitForLoadState('networkidle');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/chapter\/3\/?$/);
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/chapter\/2\/?$/);
});

test('reader: toggle buttons expose their state to keyboard users', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  // The reader tools sit behind Options; open it from the keyboard first.
  const options = page.getByRole('button', { name: /Options/ });
  await options.focus();
  await page.keyboard.press('Enter');
  await expect(options).toHaveAttribute('aria-expanded', 'true');
  const chanting = page.getByRole('button', { name: 'स्वाध्याय मोड' });
  await chanting.focus();
  await expect(chanting).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Enter');
  await expect(chanting).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Enter');
  await expect(chanting).toHaveAttribute('aria-pressed', 'false');
});

test('reader: every button and link that takes focus shows a focus indicator', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();
  const missing: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const snap = () => {
        const cs = getComputedStyle(el);
        return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor, cs.color, cs.textDecorationLine].join('|');
      };
      // A real indicator changes something when the element gains focus.
      const focused = snap();
      el.blur();
      const unfocused = snap();
      el.focus();
      const outline = focused !== unfocused;
      const ring = false;
      const label = (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 40);
      return { visible: outline || ring, label, tag: el.tagName };
    });
    if (info && !info.visible) missing.push(`${info.tag} "${info.label}"`);
  }
  expect(missing).toEqual([]);
});

test('Story Deck traps keyboard focus, closes with Escape, and restores focus', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await expect(page.locator('article.verse-card:not(.vt)').first()).toBeVisible();

  const trigger = page
    .getByRole('group', { name: 'श्लोक विकल्प (Verse actions)' })
    .first()
    .getByRole('button', { name: 'और विकल्प · More actions' });
  await trigger.click();
  await page.getByRole('menuitem', { name: /60-सेकंड सार/ }).click();

  const dialog = page.getByRole('dialog', { name: /60-सेकंड सार/ });
  const close = dialog.getByRole('button', { name: 'कथा डेक बंद करें' });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  const lastControl = dialog.getByRole('button', { name: /आगे बढ़ें/ });
  await expect(lastControl).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('reader: verse study opens in place with a touch-sized control on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/scripture/bhagavadgita/chapter/2/');

  // Vyakhya, Modern Context and Reflection sit behind one disclosure per verse, inside the chapter.
  const card = page.locator('article.verse-card:not(.vt)').filter({ has: page.getByRole('button', { name: /Verse study/ }) }).first();
  const study = card.getByRole('button', { name: /Verse study/ });
  await expect(study).toBeVisible();
  if ((await study.getAttribute('aria-expanded')) === 'true') await study.click();
  await study.focus();
  await page.keyboard.press('Enter');
  await expect(study).toHaveAttribute('aria-expanded', 'true');
  await expect(card.getByRole('region', { name: /Verse study/ })).toBeVisible();

  const targetHeight = await study.evaluate((el) => el.getBoundingClientRect().height);
  expect(targetHeight).toBeGreaterThanOrEqual(44);
});

test('reader: approved related teachings stay collapsed and show their editorial reasons on request', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');

  // Verses past the first few upgrade to full cards as they near the viewport.
  await page.locator('#verse-47').scrollIntoViewIfNeeded();
  const card = page.locator('article.verse-card:not(.vt)#verse-47');
  const study = card.getByRole('button', { name: /Verse study/ });
  if ((await study.getAttribute('aria-expanded')) !== 'true') await study.click();
  const disclosure = card.locator('details').filter({ hasText: /Related teachings/ });
  const summary = disclosure.locator('summary');
  await expect(summary).toBeVisible();
  await expect(disclosure).not.toHaveAttribute('open', '');

  await summary.click();
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(disclosure).toContainText('The next verse names the balance that 2.47 asks for.');
  await expect(disclosure).toContainText('Editorial links for study. A link does not claim that two passages teach exactly the same thing.');
  expect(await disclosure.locator('li').count()).toBeLessThanOrEqual(3);

  await expect(page.locator('#verse-1 details').filter({ hasText: /Related teachings/ })).toHaveCount(0);
});
