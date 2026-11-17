import { expect, test } from '@playwright/test';

test('practice reflection hydrates when the client IST date differs from the static build date', async ({ page }) => {
  // Static-exported HTML was built at an earlier time. Simulate reading it
  // on a different Indian calendar day, the production case after midnight.
  await page.clock.install({ time: new Date('2030-01-01T12:00:00.000Z') });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/practice/');
  await expect(page.getByRole('heading', { name: 'Daily Reflection' })).toBeVisible();
  await expect(page.getByRole('button', { name: /आज|Today|Jump to today/i }).first()).toBeVisible();
  await page.waitForTimeout(300);

  expect(errors.filter((error) => /hydration|Minified React error #418|text content does not match/i.test(error)))
    .toEqual([]);
});
