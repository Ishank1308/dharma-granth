import { expect, test, type Page } from '@playwright/test';

/**
 * The bento openings of Learn, Sadhana, Festivals and Characters (app/styles/bento.css):
 * one large tile for the reader's next step beside smaller ones, then the full list.
 *
 * What these check: the lead tile really is the large one, it reads the reader's saved state
 * without moving the page, the exported HTML already holds every link, and the layout holds
 * on a phone with 44px targets.
 */

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };

// The grids rise into view as they scroll in (.reveal-grid), and a tile that is still below the
// fold is mid-way through that move, so its measured box is a few pixels off. These tests measure
// the layout at rest, so they ask for Reduce Motion throughout.
test.use({ reducedMotion: 'reduce' });

const lead = (page: Page) => page.locator('#main-content .bento > [data-tile="lead"]').first();

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

async function leadHeight(page: Page) {
  const box = await lead(page).boundingBox();
  expect(box).not.toBeNull();
  return Math.round(box!.height);
}

test('Learn opens with the next step as the large tile, beside the three ways to study', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/learn/');

  const cells = page.locator('#main-content .bento').first().locator('> li');
  await expect(cells).toHaveCount(4);
  const [big, journeys, pathways] = await Promise.all([0, 1, 2].map((i) => cells.nth(i).boundingBox()));
  // 2 × 2 beside a tall tile and two stacked ones: wider and taller than the small tiles, on one top line.
  expect(big!.width).toBeGreaterThan(pathways!.width * 1.8);
  expect(big!.height).toBeGreaterThan(pathways!.height * 1.8);
  expect(journeys!.height).toBeGreaterThan(pathways!.height * 1.8);
  expect(Math.abs(big!.y - journeys!.y)).toBeLessThan(3);

  // A first visit: the way in is the starting-point questions.
  await expect(lead(page).getByRole('link', { name: /Find your starting point/ })).toHaveAttribute('href', '/learn/start/');
  await expect(page.locator('[data-learn-lead]')).toHaveAttribute('data-learn-lead', 'start');
  for (const href of ['/learn/journeys/', '/wisdom-pathways/', '/learn/plans/', '/learn/faq/', '/sources/']) {
    await expect(page.locator(`section[aria-labelledby="learn-start-heading"] a[href="${href}"]`)).toHaveCount(1);
  }
});

test('Learn shows the path the reader is on, with the next lesson, and the tile keeps its height', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/learn/');
  await expect(page.locator('[data-learn-lead="start"]')).toBeVisible();
  const before = await leadHeight(page);

  await page.evaluate(() =>
    localStorage.setItem(
      'dharma.pathways',
      JSON.stringify([{ pathwayId: 'beginner', completedSteps: ['beg-1', 'beg-2'], startedAt: '2026-11-01T05:00:00.000Z' }]),
    ),
  );
  await page.reload();
  const tile = page.locator('[data-learn-lead="continue"]');
  await expect(tile).toBeVisible();
  await expect(tile.getByRole('link', { name: /Complete Beginner/ })).toHaveAttribute('href', '/learn/beginner/');
  await expect(tile).toContainText('Lesson 3 of');
  await expect(tile.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  // The other way in stays one tap away.
  await expect(tile.getByRole('link', { name: /Other ways to begin/ })).toHaveAttribute('href', '/learn/start/');

  // The exported HTML shows the first-visit state; swapping it for saved progress must not push the page down.
  expect(await leadHeight(page)).toBe(before);
  expect(await overflow(page)).toBeLessThanOrEqual(1);
});

test('Sadhana opens with today, and each row jumps to its practice', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize(PHONE);
  await page.goto('/practice/');

  const today = lead(page);
  await expect(today.getByRole('heading', { name: /Today.s sadhana/ })).toBeVisible();
  const rows = today.locator('.bento-rows a');
  await expect(rows).toHaveCount(4);
  for (const id of ['japa', 'meditation', 'pranayama', 'reflection']) {
    await expect(today.locator(`a[href="#practice-${id}"]`)).toHaveCount(1);
    await expect(page.locator(`#practice-${id}`)).toHaveCount(1);
  }
  await expect(today.locator('[data-practice-state="japa"]')).toHaveText(/Not yet/);

  // The reader's own spaces are still here, and rows are finger-sized.
  for (const href of ['/practice/gita-sankalpa/', '/practice/bookmarks/', '/practice/journal/']) {
    await expect(page.locator(`nav[aria-label="Today and your practice spaces"] a[href="${href}"]`)).toHaveCount(1);
  }
  const heights = await rows.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
  expect(await overflow(page)).toBeLessThanOrEqual(1);
  expect(errors.filter((e) => /hydration|Minified React error #418|text content does not match/i.test(e))).toEqual([]);
});

test('Sadhana shows what was already done today, and the tile keeps its height', async ({ browser }) => {
  const heights: number[] = [];
  for (const seeded of [false, true]) {
    const context = await browser.newContext({ viewport: PHONE, reducedMotion: 'reduce' });
    // Saved before the page first loads, the way a returning reader's data is (the same keys the tools write).
    if (seeded) {
      await context.addInitScript(() => {
        const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
        localStorage.setItem('dharma.practice.japa', JSON.stringify({ date: day, count: 12, rounds: 2, lifetimeRounds: 9, mantra: '' }));
        localStorage.setItem('dharma.practice.meditation', JSON.stringify({ sessions: 3, minutes: 40, history: { [day]: 15 } }));
        localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify([{ id: 'a' }, { id: 'b' }]));
      });
    }
    const page = await context.newPage();
    await page.goto('/practice/');
    const today = lead(page);
    if (seeded) {
      await expect(today.locator('[data-practice-state="japa"]')).toHaveText(/2 malas/);
      await expect(today.locator('[data-practice-state="meditation"]')).toHaveText(/15 min/);
      await expect(today.locator('[data-practice-state="reflection"]')).toHaveText(/Not yet/);
      await expect(today.locator('.bento-mark[data-done="true"]')).toHaveCount(2);
      await expect(today).toContainText('Well begun');
      await expect(page.locator('[data-saved-count]')).toHaveText('2 saved');
    } else {
      await expect(today.locator('[data-practice-state="japa"]')).toHaveText(/Not yet/);
    }
    heights.push(await leadHeight(page));
    await context.close();
  }
  expect(heights[1]).toBe(heights[0]);
});

test('Sadhana lists only the practices the reader keeps active', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'dharma.practice.tools',
      JSON.stringify({ japa: true, meditation: false, pranayama: false, reflection: true, reading: false, verse: false }),
    ),
  );
  await page.setViewportSize(PHONE);
  await page.goto('/practice/');
  await expect(lead(page).locator('.bento-rows a')).toHaveCount(2);
  await expect(lead(page).locator('a[href="#practice-meditation"]')).toHaveCount(0);
});

test('Festivals opens with the next festival, counted from the reader\'s own day', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-22T06:00:00.000Z') });
  await page.setViewportSize(DESKTOP);
  await page.goto('/festivals/');

  const tile = page.locator('[data-festival-lead="next"]');
  await expect(tile).toBeVisible();
  await expect(tile.getByRole('heading', { level: 3 })).toContainText('Kartik Purnima');
  await expect(tile.locator('time').first()).toHaveAttribute('datetime', '2026-11-24');
  await expect(tile).toContainText('In 2 days');
  // The two after it, each a link, and the one with its own page goes there.
  const after = tile.locator('.bento-rows a');
  await expect(after).toHaveCount(2);
  await expect(after.first()).toContainText('Gita Jayanti');
  await expect(after.first()).toHaveAttribute('href', '/festivals/gita-jayanti/');

  const cells = page.locator('#main-content .bento').first().locator('> li');
  await expect(cells).toHaveCount(4);
  const [big, small] = await Promise.all([cells.nth(0).boundingBox(), cells.nth(2).boundingBox()]);
  expect(big!.height).toBeGreaterThan(small!.height * 1.8);
  for (const href of ['/panchang/ekadashi/', '/panchang/purnima/', '/panchang/amavasya/']) {
    await expect(page.locator(`section[aria-labelledby="festivals-coming-heading"] a[href="${href}"]`)).toHaveCount(1);
  }
  // The full list follows, under its own heading.
  await expect(page.locator('section[aria-labelledby="festivals-all-heading"] a[href^="/festivals/"]')).toHaveCount(9);
});

test('a festival that falls today is named as today', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-12-20T06:00:00.000Z') });
  await page.setViewportSize(PHONE);
  await page.goto('/festivals/');
  const tile = page.locator('[data-festival-lead="next"]');
  await expect(tile.getByRole('link', { name: /Gita Jayanti/ }).first()).toHaveAttribute('href', '/festivals/gita-jayanti/');
  await expect(tile.locator('.bento-kicker')).toContainText('Today');
  expect(await overflow(page)).toBeLessThanOrEqual(1);
});

test.describe('without script', () => {
  test.use({ javaScriptEnabled: false });

  test('the exported pages already hold every tile and link', async ({ page }) => {
    await page.setViewportSize(PHONE);

    // Festivals: today is unknown in the HTML, so the lead is the way into the calendar, at the same height.
    await page.goto('/festivals/');
    const calendar = page.locator('[data-festival-lead="calendar"]');
    await expect(calendar.getByRole('link', { name: /festival dates/ })).toHaveAttribute('href', '/panchang/calendar/');
    const staticHeight = await leadHeight(page);

    // Characters: all 25 character pages are linked from the groups, which need no script.
    await page.goto('/characters/');
    const groups = page.locator('#main-content section[id^="characters-"]:has(.bento)');
    await expect(groups).toHaveCount(4);
    const hrefs = await groups.locator('.bento a[href^="/characters/"]').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(25);
    expect(hrefs.every((href) => /^\/characters\/[a-z-]+\/$/.test(href ?? ''))).toBe(true);
    for (const id of ['krishna', 'rama', 'shiva', 'valmiki']) {
      await expect(page.locator(`.bento > [data-tile="lead"] a[href="/characters/${id}/"]`)).toHaveCount(1);
    }

    // Learn and Sadhana: the first-visit state is in the HTML.
    await page.goto('/learn/');
    await expect(page.locator('[data-learn-lead="start"] a[href="/learn/start/"]')).toHaveCount(1);
    await page.goto('/practice/');
    await expect(lead(page).locator('.bento-rows a')).toHaveCount(4);

    test.info().annotations.push({ type: 'festival lead height without script', description: String(staticHeight) });
  });
});

test('the festival tile is the same height before and after it learns the date', async ({ browser }) => {
  const heights: number[] = [];
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({ viewport: PHONE, javaScriptEnabled, reducedMotion: 'reduce' });
    const page = await context.newPage();
    if (javaScriptEnabled) await page.clock.install({ time: new Date('2026-11-22T06:00:00.000Z') });
    await page.goto('/festivals/');
    if (javaScriptEnabled) await expect(page.locator('[data-festival-lead="next"]')).toBeVisible();
    heights.push(await leadHeight(page));
    await context.close();
  }
  expect(heights[1]).toBe(heights[0]);
});

test('character groups alternate the side of their large tile', async ({ page }) => {
  // Still, so a group further down is measured where it rests, not part-way through its arrival.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize(DESKTOP);
  await page.goto('/characters/');
  const sides = await page.locator('#main-content section[id^="characters-"] .bento').evaluateAll((grids) =>
    grids.map((grid) => {
      const big = grid.querySelector('[data-tile="lead"]')!.getBoundingClientRect();
      const box = grid.getBoundingClientRect();
      // Every row is full: no cell hangs alone in the last row.
      const bottoms = [...grid.children].map((cell) => Math.round(cell.getBoundingClientRect().bottom));
      const lastRow = [...grid.children].filter((cell) => Math.round(cell.getBoundingClientRect().bottom) === Math.max(...bottoms));
      const lastRowWidth = lastRow.reduce((sum, cell) => sum + cell.getBoundingClientRect().width, 0);
      return { side: big.left - box.left < 4 ? 'start' : 'end', full: lastRowWidth > box.width * 0.9 };
    }),
  );
  expect(sides.map((s) => s.side)).toEqual(['start', 'end', 'start', 'end']);
  expect(sides.every((s) => s.full)).toBe(true);
  // The map is still on the page, under its own heading.
  await expect(page.getByRole('heading', { name: /Relationship map/ })).toBeVisible();
  await expect(page.locator('#characters-map .character-map')).toHaveCount(1);
});

for (const route of ['/learn/', '/practice/', '/festivals/', '/characters/']) {
  test(`${route} bento holds on a phone: two columns, no overflow, finger-sized tiles, still under Reduce Motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize(PHONE);
    await page.goto(route);
    const grid = page.locator('#main-content .bento').first();
    await expect(grid).toBeVisible();

    const facts = await grid.evaluate((el) => {
      const box = el.getBoundingClientRect();
      const big = el.querySelector('[data-tile="lead"]')!.getBoundingClientRect();
      const cells = [...el.children].map((cell) => cell.getBoundingClientRect());
      const links = [...el.querySelectorAll('a')].map((a) => {
        // A stretched title link is as large as its tile.
        const tile = a.classList.contains('bento-link') ? a.closest('.bento-tile')! : a;
        return tile.getBoundingClientRect().height;
      });
      return {
        leadFull: big.width > box.width * 0.95,
        narrowest: Math.min(...cells.map((c) => c.width)),
        gridWidth: box.width,
        shortestLink: Math.min(...links),
        moving: [...el.querySelectorAll<HTMLElement>('*')].filter((n) => getComputedStyle(n).animationName !== 'none').length,
      };
    });
    expect(facts.leadFull).toBe(true);
    // Small tiles sit two to a row, never three.
    expect(facts.narrowest).toBeGreaterThan(facts.gridWidth * 0.45);
    expect(facts.shortestLink).toBeGreaterThanOrEqual(44);
    expect(facts.moving).toBe(0);
    expect(await overflow(page)).toBeLessThanOrEqual(1);
  });
}
