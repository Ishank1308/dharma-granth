import { test, expect, type Page } from '@playwright/test';

/**
 * The Panchang list pages mark "today". The site is a static export, so that
 * mark has to come from the reader's clock, not from the day the site was built.
 * Each test pins the browser clock and checks the page follows it.
 */

const LIMB_PAGES = [
  '/panchang/tithis/',
  '/panchang/nakshatras/',
  '/panchang/yogas/',
  '/panchang/karanas/',
  '/panchang/varas/',
] as const;

const todayCards = (page: Page) => page.locator('main [data-today="true"]');

async function openAt(page: Page, path: string, instant: string) {
  await page.clock.setFixedTime(new Date(instant));
  await page.goto(path);
}

test.describe('Panchang "today" follows the reader\'s clock', () => {
  for (const path of LIMB_PAGES) {
    test(`${path} is pre-rendered without a today mark`, async ({ request }) => {
      const html = await (await request.get(path)).text();
      expect(html).not.toContain('Active Today');
      expect(html).not.toContain('data-today="true"');
    });

    test(`${path} marks exactly one card as today's`, async ({ page }) => {
      await openAt(page, path, '2026-01-05T06:30:00Z');
      await expect(todayCards(page)).toHaveCount(1);
      await expect(todayCards(page).getByText('Active Today')).toBeVisible();
    });
  }

  test('the weekday is the one on the pinned date', async ({ page }) => {
    // Noon in India on Monday 5 January 2026, then on Tuesday.
    await openAt(page, '/panchang/varas/', '2026-01-05T06:30:00Z');
    await expect(todayCards(page)).toHaveAttribute('href', '/panchang/varas/somavara/');

    await openAt(page, '/panchang/varas/', '2026-01-06T06:30:00Z');
    await expect(todayCards(page)).toHaveAttribute('href', '/panchang/varas/mangalavara/');
  });

  test('the nakshatra changes with the date', async ({ page }) => {
    const nameOn = async (instant: string) => {
      await openAt(page, '/panchang/nakshatras/', instant);
      await expect(todayCards(page)).toHaveCount(1);
      return todayCards(page).locator('h3').innerText();
    };
    const first = await nameOn('2026-01-05T06:30:00Z');
    const later = await nameOn('2026-01-09T06:30:00Z');
    expect(later).not.toBe(first);
  });

  test.describe('in a browser set to another time zone', () => {
    test.use({ timezoneId: 'America/Los_Angeles' });

    test('the day is the day in India, the default place', async ({ page }) => {
      // 01:30 on Tuesday in India; still Monday afternoon in Los Angeles.
      await openAt(page, '/panchang/varas/', '2026-01-05T20:00:00Z');
      await expect(todayCards(page)).toHaveAttribute('href', '/panchang/varas/mangalavara/');
    });
  });

  test('day length on the solar vratas page follows the date', async ({ page }) => {
    // The page is pre-rendered with the build day's times, so wait for the live ones.
    const dayLengthMinutes = async () => {
      const text = await page
        .locator('section[aria-label="Solar Astronomical Parameters"] div.rounded-2xl', { hasText: 'Day Length' })
        .locator('p.font-serif')
        .innerText();
      const match = text.match(/(\d+)h (\d+)m/);
      return match ? Number(match[1]) * 60 + Number(match[2]) : Number.NaN;
    };

    // Varanasi: about 13h 40m at the June solstice, about 10h 35m in December.
    await openAt(page, '/panchang/solar-vratas/', '2026-06-21T06:30:00Z');
    await expect.poll(dayLengthMinutes).toBeGreaterThan(13 * 60);

    await openAt(page, '/panchang/solar-vratas/', '2026-12-21T06:30:00Z');
    await expect.poll(dayLengthMinutes).toBeLessThan(11 * 60);
  });
});
