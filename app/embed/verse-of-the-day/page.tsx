import type { Metadata } from 'next';
import { EmbedCard } from './EmbedCard';

export const metadata: Metadata = {
  title: 'Daily Sacred Verse Widget · दैनिक श्लोक विजेट · Dharma Granth',
  description:
    'Embeddable Daily Verse widget featuring Sanskrit shloka, Hindi meaning, English translation and authentic scriptural citation.',
  alternates: { canonical: '/embed/verse-of-the-day/' },
};

export default function VerseEmbedPage() {
  return (
    <main className="embed-card-root flex min-h-screen items-center justify-center p-2 sm:p-4">
      <EmbedCard />
    </main>
  );
}
