import type { Metadata } from 'next';
import { GitaSankalpaClient } from './GitaSankalpaClient';

export const metadata: Metadata = {
  title: 'Bhagavad Gita Daily Sankalpa & Parayana · श्रीमद्भगवद्गीता नित्य स्वाध्याय एवं पारायण संकल्प — Dharma Granth',
  description:
    'Take a sacred daily vow (Sankalpa) for Bhagavad Gita recitation: 18-day sequential parayana, daily favorite chapter, or weekly study. Track streaks, learn traditional Vedic invocation mantras, and download all 18 chapters for 100% offline reading.',
  keywords: [
    'gita sankalpa',
    'bhagavad gita daily reading',
    'gita parayana',
    'गीता संकल्प',
    'भगवद्गीता पारायण',
    'gita streak tracker',
    'offline bhagavad gita',
    'gita 18 days challenge',
  ],
  alternates: { canonical: '/practice/gita-sankalpa/' },
  openGraph: {
    title: 'Bhagavad Gita Daily Sankalpa & Parayana · श्रीमद्भगवद्गीता नित्य स्वाध्याय संकल्प',
    description:
      'Take a sacred daily vow for Bhagavad Gita recitation: 18-day parayana, daily chapter pledge, traditional Vedic invocation, streak tracker, and 100% offline access.',
    url: 'https://dharmagranth.dev/practice/gita-sankalpa/',
    type: 'article',
    images: [{ url: '/og/bhagavadgita.png', width: 1200, height: 630, alt: 'Bhagavad Gita Daily Sankalpa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhagavad Gita Daily Sankalpa & Parayana — Dharma Granth',
    description:
      'Daily Bhagavad Gita recitation pledge: 18-day parayana, daily chapter pledge, traditional Vedic invocation, and offline reader.',
    images: ['/og/bhagavadgita.png'],
  },
};

export default function GitaSankalpaPage() {
  const siteUrl = 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/practice/gita-sankalpa/`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Practice', item: `${siteUrl}/practice/` },
      { '@type': 'ListItem', position: 3, name: 'Gita Sankalpa', item: pageUrl },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Bhagavad Gita Daily Sankalpa (गीता नित्य संकल्प)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Gita Sankalpa is a sacred intention and personal vow to recite and contemplate upon the Bhagavad Gita regularly. Practitioners traditionally choose between an 18-day cycle (one chapter daily), reciting a crucial chapter daily (such as Chapter 12 Bhakti Yoga or Chapter 15 Purushottama Yoga), or weekly parayana.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I read the Bhagavad Gita offline without internet connection?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Dharma Granth allows you to save all 18 chapters with full Sanskrit verses, word meanings, and Hindi/English commentaries directly to your device cache using modern PWA storage. Once saved, you can read anywhere—during travel, flights, or in temples—with zero internet connectivity.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which Bhagavad Gita chapter is traditionally recommended for daily recitation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For readers seeking a single daily chapter, Chapter 12 (Bhakti Yoga, 20 verses) and Chapter 15 (Purushottama Yoga, 20 verses) are most universally recited across traditional ashrams and lineages for their concise, profound spiritual essence.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="min-h-screen bg-dharma-bg">
        <GitaSankalpaClient />
      </main>
    </>
  );
}
