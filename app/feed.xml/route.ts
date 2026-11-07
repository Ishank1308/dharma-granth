import { DAILY_WISDOM_REGISTRY } from '@/data/daily-wisdom-engine';

export const dynamic = 'force-static';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev').replace(/\/+$/, '');
  const feedUrl = `${siteUrl}/feed.xml`;
  const buildDate = new Date().toUTCString();

  const itemsXml = DAILY_WISDOM_REGISTRY.slice(0, 30)
    .map((item) => {
      const link = `${siteUrl}${item.href.endsWith('/') ? item.href : `${item.href}/`}`;
      const title = `${item.scriptureTitle} ${item.chapterId}.${item.verseId}`;
      const content = [
        item.sanskrit,
        '',
        item.hindi ? `भावार्थ (Hindi): ${item.hindi}` : '',
        item.translation ? `Meaning (English): ${item.translation}` : '',
        item.practicalTeaching ? `जीवन सूत्र: ${item.practicalTeaching}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(content)}</description>
      <category>${escapeXml(item.scriptureTitle)}</category>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dharma Granth — Daily Sacred Verse &amp; Wisdom</title>
    <link>${escapeXml(siteUrl)}/</link>
    <description>Authentic Sanskrit verses from the Bhagavad Gita, Upanishads, and sacred scriptures with Hindi and English translations.</description>
    <language>hi</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
