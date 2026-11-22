import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { readHref } from '@/lib/verse-paths';
import { FEATURED_SEEDS } from './network-seeds';
import { VerseNetworkClient } from './VerseNetworkClient';
import { NetworkHero } from './NetworkHero';

export const metadata: Metadata = {
  title: { absolute: 'Verse Relationship Graph · श्लोक संबंध जाल | Dharma Granth' },
  description:
    'Explore cross-scriptural echoes across the Bhagavad Gita, Upanishads, Vedas, and Epics through verified supporting verses and concept links.',
  keywords: [
    'Hindu scripture knowledge graph',
    'Bhagavad Gita Upanishad connections',
    'Verse relationship engine',
    'Sanskrit shloka network',
    'Vedic philosophy graph',
  ],
  openGraph: {
    title: 'Interactive Verse Relationship Engine · Dharma Granth',
    description:
      'Explore interconnected canonical verses across the Bhagavad Gita, Upanishads, Vedas, and Epics in an interactive visual network.',
    url: 'https://dharmagranth.dev/network/',
  },
  alternates: { canonical: '/network/' },
};

export default function VerseNetworkPage() {
  return (
    <main id="main" className="min-h-screen pb-16 pt-4">
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
            <NetworkHero />
            <section aria-label="Featured scriptural connections" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_SEEDS.map((seed) => (
                <article
                  key={seed.key}
                  className="rounded-2xl border border-dharma-border bg-dharma-card p-5 space-y-2.5"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                    {seed.scriptureTitle} {seed.chapterId}.{seed.verseId} · <span lang="hi" className="font-devanagari">{seed.themeHi}</span>
                  </p>
                  <p lang="sa" className="font-devanagari text-sm leading-relaxed text-dharma-text">
                    {seed.sanskrit}
                  </p>
                  <p className="text-xs leading-relaxed text-dharma-muted">{seed.description}</p>
                  <Link
                    href={readHref(seed.scriptureId, seed.chapterId, seed.verseId)}
                    className="inline-flex min-h-[44px] items-center text-xs font-semibold text-saffron-700 underline underline-offset-2 dark:text-saffron-300"
                  >
                    Open verse {seed.chapterId}.{seed.verseId} →
                  </Link>
                </article>
              ))}
            </section>
          </div>
        }
      >
        <VerseNetworkClient />
      </Suspense>
    </main>
  );
}
