import { test, expect, type Page } from '@playwright/test';

/**
 * Round B, step by step: Puja mode on ritual and festival pages, and the quiet notice before a
 * festival or ekadashi on Practice and Panchang.
 */

const puja = (page: Page) => page.locator('[data-puja-mode]');

/** Record Screen Wake Lock requests, so the test does not depend on the headless browser's support. */
async function stubWakeLock(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __wakeRequests: number };
    w.__wakeRequests = 0;
    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: {
        request: async () => {
          w.__wakeRequests += 1;
          const target = new EventTarget() as EventTarget & { released: boolean; release: () => Promise<void> };
          target.released = false;
          target.release = async () => {
            target.released = true;
            target.dispatchEvent(new Event('release'));
          };
          return target;
        },
      },
    });
  });
}

test.describe('Puja mode', () => {
  test('a ritual opens one step at a time, keeps the screen awake and resumes where it stopped', async ({ page }) => {
    await stubWakeLock(page);
    await page.goto('/rituals/?ritual=puja');
    await page.getByRole('dialog').getByRole('button', { name: /Puja mode/ }).click();

    await expect(puja(page)).toBeVisible();
    await expect(puja(page)).toContainText('Step 1 of');
    await expect(puja(page)).toContainText('Screen stays on');
    expect(await page.evaluate(() => (window as unknown as { __wakeRequests: number }).__wakeRequests)).toBeGreaterThan(0);

    // Next button, then the arrow keys.
    await puja(page).getByRole('button', { name: /Next/ }).click();
    await expect(puja(page)).toContainText('Step 2 of');
    await page.keyboard.press('ArrowRight');
    await expect(puja(page)).toContainText('Step 3 of');
    await page.keyboard.press('ArrowLeft');
    await expect(puja(page)).toContainText('Step 2 of');

    // Closing brings the ritual's detail back.
    await page.keyboard.press('Escape');
    await expect(puja(page)).toHaveCount(0);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    // Opening again resumes at step 2, and "From step 1" starts over.
    await page.getByRole('dialog').getByRole('button', { name: /Puja mode/ }).click();
    await expect(puja(page)).toContainText('Step 2 of');
    await expect(puja(page)).toContainText('You stopped here last time.');
    await puja(page).getByRole('button', { name: /From step 1/ }).click();
    await expect(puja(page)).toContainText('Step 1 of');
  });

  test('closing the ritual detail after Puja mode leaves the page scrollable', async ({ page }) => {
    await page.goto('/rituals/?ritual=puja');
    await page.getByRole('dialog').getByRole('button', { name: /Puja mode/ }).click();
    await expect(puja(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });

  test('a festival page pre-renders its steps and Puja mode runs to the end', async ({ page, request }) => {
    const html = await (await request.get('/festivals/diwali/')).text();
    expect(html).toContain('id="steps"');
    expect(html).not.toContain('data-puja-mode');

    await page.goto('/festivals/diwali/');
    const items = page.locator('#steps ol > li');
    const count = await items.count();
    expect(count).toBeGreaterThan(5);

    await page.locator('#steps').getByRole('button', { name: /Puja mode/ }).click();
    for (let i = 0; i < count; i++) await puja(page).getByRole('button', { name: /Next|Finish/ }).click();
    await expect(puja(page)).toContainText('Puja complete');
    await puja(page).getByRole('button', { name: /Close/ }).first().click();
    await expect(puja(page)).toHaveCount(0);
  });

  test('nothing moves under Reduce Motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/festivals/diwali/');
    await page.locator('#steps').getByRole('button', { name: /Puja mode/ }).click();
    await puja(page).getByRole('button', { name: /Next/ }).click();
    const animations = await puja(page).evaluate((root) =>
      [root, ...root.querySelectorAll('*')].map((el) => getComputedStyle(el).animationName).filter((n) => n && n !== 'none'),
    );
    expect(animations).toEqual([]);
    await context.close();
  });
});

test.describe('Notice before a festival or ekadashi', () => {
  test('pages are pre-rendered without a notice', async ({ request }) => {
    for (const path of ['/practice/', '/panchang/']) {
      const html = await (await request.get(path)).text();
      expect(html).not.toContain('data-observance-notice');
    }
  });

  test('Practice shows tomorrow\'s festival once, until it is dismissed', async ({ page }) => {
    // Midday on 28 October 2027; Diwali is on the 29th.
    await page.clock.setFixedTime(new Date('2027-10-28T12:00:00'));
    await page.goto('/practice/');
    const notice = page.locator('[data-observance-notice="tomorrow"]');
    await expect(notice).toContainText('Tomorrow: Diwali');
    await expect(notice.getByRole('link')).toHaveAttribute('href', '/festivals/diwali/#steps');

    await notice.getByRole('button', { name: /Dismiss/ }).click();
    await expect(notice).toHaveCount(0);
    await page.reload();
    await expect(page.locator('[data-observance-notice]')).toHaveCount(0);
  });

  test('Panchang shows tomorrow\'s ekadashi', async ({ page }) => {
    // 3 January 2027; Saphala Ekadashi is on the 4th.
    await page.clock.setFixedTime(new Date('2027-01-03T12:00:00'));
    await page.goto('/panchang/');
    const notice = page.locator('[data-observance-notice="tomorrow"]');
    await expect(notice).toContainText('Saphala Ekadashi');
    await expect(notice.getByRole('link')).toHaveAttribute('href', '/panchang/ekadashi/');
  });

  test('an ordinary day shows nothing', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2027-06-10T12:00:00'));
    await page.goto('/practice/');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('[data-observance-notice]')).toHaveCount(0);
  });
});
