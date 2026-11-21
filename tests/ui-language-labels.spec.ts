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
  await expect(english).toBeHidden();
  await expect(hindi).toBeVisible();
  // Both halves stay in the page for crawlers and screen readers that ignore the choice.
  await expect(english).toHaveCount(1);

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-ui-lang', 'hindi');
  await expect(english).toBeHidden();
  await expect(hindi).toBeVisible();

  await chooseInHeader(page, /^English/);
  await expect(page.locator('html')).toHaveAttribute('data-ui-lang', 'english');
  await expect(english).toBeVisible();
  await expect(hindi).toBeHidden();

  await chooseInHeader(page, /द्विभाषी/);
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
