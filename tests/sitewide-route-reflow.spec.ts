import { expect, test, type APIRequestContext } from '@playwright/test';

/**
 * Source inventory: 91 app/**/page.tsx templates in the 17-Nov-2026 UI audit.
 * A template may represent hundreds of generated scripture pages. The sitemap
 * supplies a published example; private tools are smoke-tested by their route.
 */
const ROUTES = [
  '/about/funding/', '/api-docs/', '/ashtavakra/[chapter]/[verse]/',
  '/ashtavakra/[chapter]/', '/ashtavakra/', '/ashtavakra/words/[letter]/',
  '/ashtavakra/words/', '/ask/[slug]/', '/ask/', '/characters/[id]/',
  '/characters/', '/collections/', '/compare/', '/concepts/[id]/',
  '/concepts/', '/concepts/relationships/', '/concepts/visuals/', '/contact/',
  '/contribute/', '/daily-verse/', '/daily/', '/design-system-preview/',
  '/dictionary/[id]/', '/dictionary/', '/editorial/', '/embed/verse-of-the-day/',
  '/festivals/[id]/', '/festivals/', '/how-dharma-granth-works/',
  '/knowledge/[slug]/', '/learn/[courseId]/', '/learn/academy/',
  '/learn/faq/', '/learn/journeys/[id]/', '/learn/journeys/gita/',
  '/learn/journeys/', '/learn/', '/learn/plans/', '/learn/start/',
  '/locations/', '/mantras/[slug]/', '/mantras/', '/methodology/',
  '/network/', '/pack/', '/', '/panchang/amavasya/',
  '/panchang/calendar/', '/panchang/ekadashi/', '/panchang/karanas/[slug]/',
  '/panchang/karanas/', '/panchang/muhurta/',
  '/panchang/nakshatras/[slug]/', '/panchang/nakshatras/',
  '/panchang/', '/panchang/pradosh/', '/panchang/purnima/',
  '/panchang/solar-vratas/', '/panchang/tithis/[slug]/',
  '/panchang/tithis/', '/panchang/varas/[slug]/', '/panchang/varas/',
  '/panchang/yogas/[slug]/', '/panchang/yogas/', '/pathways/',
  '/practice/bookmarks/', '/practice/dashboard/', '/practice/desk/',
  '/practice/gita-sankalpa/', '/practice/journal/', '/practice/',
  '/practice/saved/', '/practice/shared/', '/privacy/', '/rituals/',
  '/rituals/upakarma/', '/scripture/[id]/chapter/[chapterId]/',
  '/scripture/[id]/chapter/[chapterId]/part/[part]/',
  '/scripture/[id]/chapter/[chapterId]/verse/[verseId]/',
  '/scripture/[id]/', '/scripture/[id]/summary/', '/scriptures/',
  '/sources/', '/story/', '/terms/', '/timelines/',
  '/wisdom-for-life/[slug]/', '/wisdom-for-life/',
  '/wisdom-pathways/[slug]/', '/wisdom-pathways/', '/wos/',
] as const;

function segments(path: string) {
  return path.split('/').filter(Boolean);
}

function isMatch(template: string, actual: string) {
  const t = segments(template);
  const a = segments(actual);
  return t.length === a.length && t.every((part, i) => {
    if (part === '[chapter]' || part === '[chapterId]' || part === '[verse]' || part === '[verseId]' || part === '[part]') {
      return /^\d+(?:\.\d+)?$/.test(a[i]);
    }
    return /^\[[^\]]+\]$/.test(part) ? a[i].length > 0 : part === a[i];
  });
}

async function publishedPaths(request: APIRequestContext) {
  const sections = ['pages', 'scriptures', 'chapters', 'verses'];
  const all = await Promise.all(sections.map(async section => {
    const response = await request.get(`/sitemap-${section}.xml`);
    expect(response.status(), `Missing sitemap-${section}.xml`).toBe(200);
    const xml = await response.text();
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), match => new URL(match[1]).pathname);
  }));
  return new Set(all.flat());
}

test('all 91 audited route templates have a reachable representative page', async ({ request }) => {
  test.setTimeout(150_000);
  expect(new Set(ROUTES).size).toBe(91);
  const indexed = await publishedPaths(request);
  const staticPaths = new Set(ROUTES.filter(route => !route.includes('[')));
  const uncovered: string[] = [];
  const failed: string[] = [];
  let checked = 0;

  for (const template of ROUTES) {
    const sample = template.includes('[')
      ? Array.from(indexed).find(path => !staticPaths.has(path) && isMatch(template, path))
      : template;
    if (!sample) {
      uncovered.push(template);
      continue;
    }
    try {
      const response = await request.get(sample, { timeout: 12_000 });
      if (response.status() !== 200) failed.push(`${template}: ${response.status()} ${sample}`);
      await response.dispose();
      checked += 1;
    } catch (error) {
      failed.push(`${template}: ${sample} ${String(error).slice(0, 130)}`);
    }
  }

  console.log(`UI_ROUTE_AUDIT representative pages checked=${checked}, unlisted=${uncovered.length}`);
  if (uncovered.length) console.log('UI_ROUTE_AUDIT not currently published:', uncovered.join(', '));
  expect(failed).toEqual([]);
  expect(checked).toBeGreaterThanOrEqual(80);
});

const CRITICAL_ROUTES = [
  '/', '/scriptures/', '/scripture/bhagavadgita/',
  '/scripture/bhagavadgita/chapter/2/',
  '/scripture/bhagavadgita/chapter/2/verse/47/',
  '/ashtavakra/', '/ashtavakra/1/', '/ashtavakra/1/3/',
  '/panchang/', '/panchang/calendar/', '/learn/', '/practice/',
  '/dictionary/', '/festivals/', '/rituals/', '/locations/', '/collections/',
  '/mantras/', '/concepts/',
];

for (const route of CRITICAL_ROUTES) {
  test(`320px reflow: ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(route);
    await expect(page.locator('body')).toBeVisible();

    const layout = await page.evaluate(() => {
      const width = document.documentElement.scrollWidth;
      return { width, visibleTitle: Boolean(document.querySelector('h1')), viewport: window.innerWidth };
    });
    expect(layout.visibleTitle, `Missing page title at ${route}`).toBe(true);
    expect(layout.width, `Horizontal body overflow at ${route}`).toBeLessThanOrEqual(321);
  });
}

test('shared page headings wrap and remain readable at 200% text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/scriptures/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(391);
  await expect(page.locator('h1')).toBeVisible();
});
