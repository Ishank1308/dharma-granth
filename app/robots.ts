import type { MetadataRoute } from 'next';

// Emitted as a static /robots.txt by `output: 'export'`.
export const dynamic = 'force-static';

// Same origin as the canonical tags and the sitemap (NEXT_PUBLIC_SITE_URL).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev').replace(/\/+$/, '');

/**
 * Only the personal, client-side pages are disallowed (they hold the reader's
 * own bookmarks and progress and are also noindex). Scripture, chapters,
 * verses, assets (/_next/, /fonts/, /og/) and everything else stay crawlable.
 * robots.txt is a crawl hint, not access control: nothing private lives here.
 *
 * AI answer-retrieval crawlers (GPTBot, OAI-SearchBot, PerplexityBot,
 * ClaudeBot, Bytespider) are explicitly allowed on content paths so verse
 * text can be cited. Google-Extended is disallowed as a model-training
 * opt-out signal. NOTE: keep public/robots.txt absent — a static file there
 * shadows this route.
 */
export default function robots(): MetadataRoute.Robots {
  const privatePaths = ['/practice/dashboard/', '/practice/bookmarks/'];
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot', 'Bytespider'],
        allow: ['/', '/scripture/', '/knowledge/', '/wisdom-pathways/', '/pathways/', '/_next/', '/fonts/', '/og/'],
        disallow: privatePaths,
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
