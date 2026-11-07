import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { GitaJourneyClient } from './GitaJourneyClient';
import { GITA_CHAPTER_JOURNEYS } from '@/data/gita-journey-data';
import { Compass, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bhagavad Gita 18 Adhyayas Journey: The Dilemma Compass · गीता यात्रा — Dharma Granth',
  description:
    'Master the 18 chapters of Srimad Bhagavad Gita across the 3 classical Shatkas (Karma, Bhakti, Jnana). Map Arjuna’s inner crises to Sri Krishna’s counsel, centerpiece Mahavakyas, and daily dilemma resolutions.',
  keywords: [
    'bhagavad gita 18 chapters summary',
    'gita dilemma compass',
    'karma shatka bhakti shatka jnana shatka',
    'gita in 18 lessons',
    'श्रीमद्भगवद्गीता 18 अध्याय सार',
    'गीता विषाद और समाधान',
    'tat tvam asi bhagavad gita',
    'dharma granth',
  ],
  alternates: {
    canonical: '/learn/journeys/gita/',
  },
  openGraph: {
    type: 'article',
    locale: 'hi_IN',
    alternateLocale: ['en_US'],
    title: 'Bhagavad Gita 18 Adhyayas Journey: The Dilemma Compass — Dharma Granth',
    description:
      'Master the 18 chapters of Srimad Bhagavad Gita across the 3 classical Shatkas (Karma, Bhakti, Jnana). Map Arjuna’s inner crises to Sri Krishna’s counsel and daily dilemma resolutions.',
    url: 'https://dharmagranth.dev/learn/journeys/gita/',
    images: [
      {
        url: '/og/gita-journey.png',
        width: 1200,
        height: 630,
        alt: 'Srimad Bhagavad Gita 18 Adhyayas Journey & Dilemma Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhagavad Gita 18 Adhyayas Journey: The Dilemma Compass',
    description: 'Master the 18 chapters of Srimad Bhagavad Gita across the 3 classical Shatkas.',
    images: ['/og/gita-journey.png'],
  },
};

export default function GitaJourneyPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/learn/journeys/gita/`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        '@id': `${pageUrl}#course`,
        name: 'Srimad Bhagavad Gita 18 Adhyayas Journey: The Dilemma Compass',
        description:
          'Comprehensive 18-chapter pedagogical pathway through Srimad Bhagavad Gita organized across the 3 classical Shatkas (Karma, Bhakti, Jnana).',
        provider: {
          '@type': 'Organization',
          name: 'Dharma Granth',
          url: siteUrl,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: 'PT3H',
        },
        numberOfLessons: 18,
        inLanguage: ['en', 'hi', 'sa'],
        isAccessibleForFree: true,
        itemListElement: GITA_CHAPTER_JOURNEYS.map((ch, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'LearningResource',
            name: `Chapter ${ch.chapter}: ${ch.title} (${ch.titleHi})`,
            description: ch.dilemmaSummary,
            url: `${siteUrl}/scripture/bhagavadgita/chapter/${ch.chapter}/`,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Learn', item: `${siteUrl}/learn/` },
          { '@type': 'ListItem', position: 3, name: 'Journeys', item: `${siteUrl}/learn/journeys/` },
          { '@type': 'ListItem', position: 4, name: 'Gita Journey', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Learn', href: '/learn/' },
          { label: 'Journeys', href: '/learn/journeys/' },
          { label: 'Gita Journey (18 Chapters)' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        {/* Sacred Header */}
        <header className="space-y-4 border-b border-dharma-border pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
              <Compass className="w-3.5 h-3.5" />
              <span>Flagship Spiritual Pathway · तत्त्वमसि</span>
            </span>
            <span className="text-xs text-dharma-muted font-medium border border-dharma-border rounded-full px-3 py-1">
              18 Chapters · 3 Classical Shatkas · 700 Verses
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-dharma-text tracking-tight">
            Bhagavad Gita 18 Adhyayas Journey
          </h1>
          <p lang="hi" className="font-devanagari text-2xl sm:text-3xl text-saffron-800 dark:text-saffron-300 font-semibold">
            श्रीमद्भगवद्गीता 18 अध्याय: संशय से समत्व तक
          </p>

          <p className="text-sm sm:text-base text-dharma-muted leading-relaxed max-w-3xl">
            A comprehensive journey mapping Arjuna’s psychological crisis to Sri Krishna’s counsel across the three classical Shatkas—<strong>Karma</strong> (Action &amp; Svadharma), <strong>Bhakti</strong> (Devotion &amp; Vision), and <strong>Jnana</strong> (Wisdom &amp; Liberation). Use the Dilemma Compass to resolve inner conflict, or study all 18 chapters sequentially.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <Link
              href="/scripture/bhagavadgita/"
              className="inline-flex items-center gap-1.5 font-bold text-saffron-800 dark:text-saffron-300 hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Bhagavad Gita Library Recension</span>
            </Link>
            <span className="text-dharma-border">•</span>
            <Link
              href="/learn/journeys/"
              className="inline-flex items-center gap-1 text-dharma-muted hover:text-dharma-text"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Guided Journeys</span>
            </Link>
          </div>
        </header>

        {/* Client Interactive Component */}
        <GitaJourneyClient />
      </div>
    </main>
  );
}
