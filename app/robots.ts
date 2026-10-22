import type { MetadataRoute } from 'next';

// Emitted as a static /robots.txt by `output: 'export'`.
export const dynamic = 'force-static';

// Same origin as the canonical tags and the sitemap (NEXT_PUBLIC_SITE_URL).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in').replace(/\/+$/, '');

/**
 * Only the personal, client-side pages are disallowed (they hold the reader's
 * own bookmarks and progress and are also noindex). Scripture, chapters,
 * verses, assets (/_next/, /fonts/, /og/) and everything else stay crawlable.
 * robots.txt is a crawl hint, not access control: nothing private lives here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/practice/dashboard/', '/practice/bookmarks/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
