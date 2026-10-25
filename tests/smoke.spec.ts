import { expect, test, type Page } from '@playwright/test';

/**
 * Smoke test of the production build (dist/, served with public/_headers so
 * the CSP is enforced). Catches what the static export check cannot: runtime
 * errors, hydration failures, CSP violations and client-side redirects.
 *
 *   npm run build && npm run test:e2e
 */

/** Console errors, uncaught page errors and CSP violations on a page. */
async function collectProblems(page: Page): Promise<string[]> {
  const problems: string[] = [];
  page.on('console', (msg) => {
    // Failed requests are reported below with their URL instead.
    if (msg.type() === 'error' && !msg.text().startsWith('Failed to load resource')) {
      problems.push(`console: ${msg.text()}`);
    }
  });
  page.on('response', (res) => {
    if (res.status() >= 400) problems.push(`HTTP ${res.status()}: ${new URL(res.url()).pathname}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.error(`CSP violation: ${e.violatedDirective} blocked ${e.blockedURI}`);
    });
  });
  return problems;
}

const PAGES = [
  '/',
  '/scriptures/',
  '/scripture/bhagavadgita/',
  '/scripture/bhagavadgita/chapter/2/',
  '/scripture/bhagavadgita/chapter/2/verse/47/',
  '/scripture/mahabharata/chapter/12/part/2/',
  '/wisdom-for-life/',
  '/learn/',
  '/learn/plans/',
  '/collections/',
  '/practice/',
  '/practice/dashboard/',
  '/contribute/',
];

for (const path of PAGES) {
  test(`no errors or CSP violations: ${path}`, async ({ page }) => {
    const problems = await collectProblems(page);
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    // Scroll through so lazy sections (3D codex, chakra) load too.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    expect(problems).toEqual([]);
    await expect(page.locator('h1').first()).toBeVisible();
  });
}

test('chapter hydrates every plain verse into an interactive card', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await expect(page.locator('article.verse-card:not(.vt)')).toHaveCount(72);
  await expect(page.locator('article.vt')).toHaveCount(0);
});

test('verse deep link lands on the verse', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/#verse-47');
  await expect(page.locator('article.verse-card:not(.vt)#verse-47')).toBeInViewport();
});

test('split chapter: an old #verse link redirects to its part', async ({ page }) => {
  await page.goto('/scripture/mahabharata/chapter/12/#verse-200.5');
  await expect(page).toHaveURL(/\/chapter\/12\/part\/\d+\/#verse-200\.5$/);
  await expect(page.locator('[id="verse-200.5"]')).toBeInViewport();
});

test('verse page carries its schema and share image', async ({ page }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/verse/47/');
  const types = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes.flatMap((n) => {
      const json = JSON.parse(n.textContent ?? '{}');
      return (json['@graph'] ?? [json]).map((node: { '@type': string }) => node['@type']);
    }),
  );
  expect(types).toEqual(expect.arrayContaining(['Article', 'FAQPage', 'BreadcrumbList']));
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/verse\/bhagavadgita\/2-47\.jpg$/);
});

test('concept graph offers an expandable relationship list on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/concepts/');

  const list = page.locator('section[aria-labelledby="mobile-concepts-heading"]');
  await expect(list).toBeVisible();
  const brahman = list.locator('#concept-brahman details');
  await brahman.locator('summary').click();
  await expect(brahman.getByText('Related concepts')).toBeVisible();
  await expect(brahman.getByRole('link', { name: /Atman/ })).toBeVisible();
  await expect(page.getByText('Brahman', { exact: true }).first()).toBeVisible();
});

test('floating island stays hidden beside the reader dock on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await page.waitForLoadState('networkidle');
  const island = page.locator('button[aria-label="Open Prāṇa Live Island"]');
  const dock = page.getByRole('navigation', { name: 'पठन नियंत्रण · Reader dock' });
  await expect(island).toBeHidden();
  await expect(dock).toBeVisible();
});

test('service worker registers and serves an opened page offline', async ({ page, context }) => {
  await page.goto('/scripture/bhagavadgita/chapter/2/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  // Reload once so the page is fetched under the worker's control and cached.
  await page.reload();
  await page.waitForLoadState('networkidle');
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('h1').first()).toBeVisible();
  await context.setOffline(false);
});

test('dashboard backup exports bookmarks and restores them', async ({ page }) => {
  await page.goto('/practice/dashboard/');
  await page.evaluate(() => localStorage.setItem('dharma.bookmarkedVerses', '["x"]'));
  const download = page.waitForEvent('download');
  await page.locator('section[aria-labelledby="backup-heading"]').getByRole('button', { name: /export/i }).click();
  const file = await download;
  const path = await file.path();
  const json = JSON.parse(require('node:fs').readFileSync(path!, 'utf8'));
  expect(json.format).toBe('dharma-granth-backup');
  expect(json.data['dharma.bookmarkedVerses']).toBe('["x"]');

  await page.evaluate(() => localStorage.clear());
  page.on('dialog', (dialog) => dialog.accept());
  await page.locator('section[aria-labelledby="backup-heading"]').locator('input[type=file]').setInputFiles(path!);
  await page.waitForLoadState('load');
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('dharma.bookmarkedVerses')))
    .toBe('["x"]');
});
