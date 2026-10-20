import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerseNetworkClient } from './VerseNetworkClient';
import { NetworkHero } from './NetworkHero';

export const metadata: Metadata = {
  title: 'Interactive Verse Relationship Engine & Knowledge Graph · Dharma Granth',
  description:
    'Visually explore the interconnected network of Hindu scriptures. Discover supporting verses, cross-scriptural parallels between the Bhagavad Gita and Upanishads, and philosophical concept connections.',
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
    url: 'https://dharmagranth.in/network/',
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
            <div className="py-8 text-center text-sm text-dharma-muted">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-saffron-500 border-t-transparent" />
              <p className="mt-3">Loading Verse Knowledge Graph...</p>
            </div>
          </div>
        }
      >
        <VerseNetworkClient />
      </Suspense>
    </main>
  );
}
