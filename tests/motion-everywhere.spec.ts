import { expect, test, type Page } from '@playwright/test';

// Motion on pages outside the reader (Round A of the 22 Nov 2026 plan). Hub cards cascade in on
// their own scroll timelines (.reveal-grid, app/motion.css), detail sections rise in
// (.fade-up-on-view), a cover settles and a hero picture drifts (app/styles/page-photos.css).
// The HTML is never hidden, and Reduce Motion keeps all of it still.

const animationOf = (page: Page, selector: string, pseudo: string | null = null) =>
  page.locator(selector).first().evaluate((el, p) => getComputedStyle(el, p).animationName, pseudo);

// CI runners have few cores, where the site may choose low-power mode and still its motion;
// these tests are about a device that has not asked for quiet.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dharma.perf.lowPower', 'false'));
});

const HUBS = [
  ['/festivals/', '.reveal-grid > *'],
  ['/concepts/', '.reveal-grid > *'],
  ['/rituals/', '.reveal-grid > *'],
  ['/learn/', '.reveal-grid > *'],
  ['/practice/', '.reveal-grid > *'],
  ['/ask/', '.reveal-grid > *'],
  ['/festivals/diwali/', '.fade-up-on-view'],
  ['/mantras/gayatri-mantra/', '.fade-up-on-view'],
] as const;

test('hub cards and detail sections arrive on scroll, and what is on screen is fully visible', async ({ page }) => {
  for (const [route, selector] of HUBS) {
    await page.goto(route);
    const items = page.locator(selector);
    expect(await items.count(), route).toBeGreaterThan(0);
    expect(await animationOf(page, selector), route).toMatch(/^reveal-(3d|rise)$/);
    // An item that is fully inside the first screen is past its range: nothing starts hidden.
    const opacities = await items.evaluateAll((els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.top >= 0 && r.bottom <= innerHeight - 300;
        })
        .map((el) => getComputedStyle(el).opacity),
    );
    for (const opacity of opacities) expect(Number(opacity), route).toBe(1);
  }
});

test('pictures move: a cover settles and a hero picture drifts with the scroll', async ({ page }) => {
  await page.goto('/scriptures/');
  expect(await animationOf(page, '.page-cover-art')).toBe('cover-settle');
  await page.goto('/festivals/diwali/');
  expect(await animationOf(page, '.hero-photo', '::before')).toBe('hero-photo-drift');
  const shift = () =>
    page.locator('.hero-photo').first().evaluate((el) => new DOMMatrix(getComputedStyle(el, '::before').transform).m42);
  const atTop = await shift();
  expect(atTop).toBeLessThan(1);
  await page.evaluate(() => scrollTo(0, 240));
  await expect.poll(shift).toBeGreaterThan(atTop + 10);
});

test('a page title comes into focus line by line, and section headings rise on scroll', async ({ page }) => {
  await page.goto('/learn/');
  const lines = page.locator('h1.title-kinetic > span');
  await expect(lines).toHaveCount(2);
  const timing = await lines.evaluateAll((els) =>
    els.map((el) => [getComputedStyle(el).animationName, parseFloat(getComputedStyle(el).animationDelay)] as const),
  );
  expect(timing[0][0]).toBe('hero-focus');
  expect(timing[1][0]).toBe('hero-focus');
  expect(timing[1][1]).toBeGreaterThan(timing[0][1]);
  // The title ends fully painted, and its text is one readable string throughout.
  await expect.poll(() => lines.first().evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await expect(page.locator('h1')).toHaveText(/^Study the scriptures\s+शास्त्र स्वाध्याय$/);
  expect(await animationOf(page, '.heading-arrive')).toBe('heading-arrive');
});

test.describe('with Reduce Motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing arrives, settles or drifts', async ({ page }) => {
    for (const [route, selector] of HUBS) {
      await page.goto(route);
      expect(await animationOf(page, selector), route).toBe('none');
    }
    await page.goto('/scriptures/');
    expect(await animationOf(page, '.page-cover-art')).toBe('none');
    expect(await animationOf(page, 'h1.title-kinetic > span')).toBe('none');
    await page.goto('/learn/');
    expect(await animationOf(page, '.heading-arrive')).toBe('none');
    await page.goto('/festivals/diwali/');
    expect(await animationOf(page, '.hero-photo', '::before')).toBe('none');
  });
});

test('low-power mode keeps pictures still', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dharma.perf.lowPower', 'true'));
  await page.goto('/festivals/diwali/');
  await expect(page.locator('html')).toHaveAttribute('data-low-power', 'true');
  expect(await animationOf(page, '.hero-photo', '::before')).toBe('none');
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('the tab bar icon of the page you open gives a small spring', async ({ page }) => {
    await page.goto('/scriptures/');
    const bar = page.getByRole('navigation', { name: 'Mobile quick navigation' });
    const icon = (name: RegExp) => bar.getByRole('link', { name }).locator('svg');
    const animation = (name: RegExp) => icon(name).evaluate((el) => getComputedStyle(el).animationName);
    expect(await animation(/Library|ग्रंथ/)).toBe('icon-answer');
    expect(await animation(/Home/)).toBe('none');
    await bar.getByRole('link', { name: /Home/ }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect.poll(() => animation(/Home/)).toBe('icon-answer');
  });
});

test.describe('the time of day on home', () => {
  for (const [time, part, greeting] of [
    ['2026-11-22T05:10:00', 'brahma', 'ब्राह्म मुहूर्त · The hour before dawn'],
    ['2026-11-22T08:00:00', 'morning', 'सुप्रभात · Good morning'],
    ['2026-11-22T17:30:00', 'sandhya', 'शुभ सन्ध्या · Evening sandhya'],
    ['2026-11-22T22:00:00', 'night', 'शुभ रात्रि · A quiet night'],
  ] as const) {
    test(`${part}: the hero greets the hour`, async ({ page }) => {
      await page.clock.setFixedTime(new Date(time));
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-daypart', part);
      const line = page.locator('.daypart-greeting');
      await expect(line).toBeVisible();
      expect(await line.evaluate((el) => getComputedStyle(el, '::before').content.replace(/" "|"/g, ''))).toBe(greeting);
    });
  }

  test('midday shows no greeting, and the page is as before', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-11-22T13:00:00'));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-daypart', 'day');
    await expect(page.locator('.daypart-greeting')).toBeHidden();
  });
});

test('a tapped festival card grows into the festival page', async ({ page }) => {
  await page.goto('/festivals/');
  // Record every element that carries a transition name while the page changes.
  await page.evaluate(() => {
    const seen: string[] = [];
    (window as unknown as { __vt: string[] }).__vt = seen;
    new MutationObserver(() => {
      const kind = document.documentElement.getAttribute('data-vt');
      if (kind) seen.push(`kind:${kind}`);
      document.querySelectorAll<HTMLElement>('[style*="view-transition-name"]').forEach((el) => {
        seen.push(`${el.tagName}:${el.style.getPropertyValue('view-transition-name')}`);
      });
    }).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['style', 'data-vt'] });
  });
  const card = page.locator('a[data-vt="open"][href="/festivals/diwali/"]');
  // React has taken over the page (its handle is on the link), so the tap is a client navigation.
  await card.evaluate((el) => new Promise<void>((resolve) => {
    const hydrated = () => Object.keys(el).some((key) => key.startsWith('__reactFiber'));
    const check = () => (hydrated() ? requestAnimationFrame(() => resolve()) : setTimeout(check, 50));
    check();
  }));
  await card.click();
  await expect(page).toHaveURL(/\/festivals\/diwali\/$/);
  await expect(page.locator('section[data-vt-hero]')).toBeVisible();
  const seen = await page.evaluate(() => (window as unknown as { __vt: string[] }).__vt);
  expect(seen).toContain('kind:open');
  expect(seen).toContain('A:verse-hero');
  expect(seen).toContain('SECTION:verse-hero');
  // Nothing is left named once the page has settled, and the page opens at its top.
  await expect(page.locator('html')).not.toHaveAttribute('data-vt', /./);
  await expect(page.locator('[style*="view-transition-name"]')).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('a tapped library card grows into its scripture book', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.evaluate(() => {
    const seen: string[] = [];
    (window as unknown as { __vt: string[] }).__vt = seen;
    new MutationObserver(() => {
      const kind = document.documentElement.getAttribute('data-vt');
      if (kind) seen.push(`kind:${kind}`);
      document.querySelectorAll<HTMLElement>('[style*="view-transition-name"]').forEach((el) => {
        seen.push(`${el.tagName}:${el.style.getPropertyValue('view-transition-name')}`);
      });
    }).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['style', 'data-vt'] });
  });
  const link = page.locator('article[data-vt-source] a[data-vt="open"][href="/scripture/bhagavadgita/"]').first();
  await link.evaluate((el) => new Promise<void>((resolve) => {
    const hydrated = () => Object.keys(el).some((key) => key.startsWith('__reactFiber'));
    const check = () => (hydrated() ? requestAnimationFrame(() => resolve()) : setTimeout(check, 50));
    check();
  }));
  await link.click();
  await expect(page).toHaveURL(/\/scripture\/bhagavadgita\/$/);
  await expect(page.locator('.sbook-wrap[data-vt-hero]')).toBeVisible();
  const seen = await page.evaluate(() => (window as unknown as { __vt: string[] }).__vt);
  expect(seen).toContain('kind:open');
  expect(seen).toContain('ARTICLE:verse-hero');
  expect(seen).toContain('DIV:verse-hero');
  await expect(page.locator('html')).not.toHaveAttribute('data-vt', /./);
  await expect(page.locator('[style*="view-transition-name"]')).toHaveCount(0);
});

test('the Listen sound wave animates cleanly and stays still in low-power or Reduce Motion', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/1/');
  const waveAnim = () =>
    page.evaluate(() => {
      const wave = document.createElement('span');
      wave.className = 'dock-wave dock-wave-sm dock-wave-current is-playing';
      const bar = document.createElement('span');
      wave.appendChild(bar);
      document.body.appendChild(wave);
      const name = getComputedStyle(bar).animationName;
      wave.remove();
      return name;
    });
  expect(await waveAnim()).toBe('dock-wave');
  await page.evaluate(() => document.documentElement.setAttribute('data-low-power', 'true'));
  expect(await waveAnim()).toBe('none');
  await page.evaluate(() => document.documentElement.removeAttribute('data-low-power'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await waveAnim()).toBe('none');
});
