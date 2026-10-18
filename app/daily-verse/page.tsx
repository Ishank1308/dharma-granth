import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { DailyVerseFeed } from './DailyVerseFeed';

export const metadata: Metadata = {
  title: 'Daily Verse for WhatsApp · दैनिक श्लोक',
  description:
    "Today's verse as a ready-to-send WhatsApp message: Sanskrit, Hindi and English meaning, and a link to the verse. Copy it into a WhatsApp Channel or send it to a friend.",
  alternates: { canonical: '/daily-verse/' },
  openGraph: {
    title: 'Daily Verse for WhatsApp · दैनिक श्लोक',
    description:
      "Today's verse as a ready-to-send WhatsApp message: Sanskrit, Hindi and English meaning, and a link to the verse. Copy it into a WhatsApp Channel or send it to a friend.",
    url: '/daily-verse/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function DailyVersePage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg dark:from-amber-950/20 py-12 px-5 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
            दैनिक श्लोक · Daily Verse
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold">Today&apos;s verse, ready for WhatsApp</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-dharma-muted">
            One verse a day with its Hindi and English meaning, formatted as a WhatsApp message with a link back to the
            verse. Copy it into your WhatsApp Channel or group, or send it straight to a friend. The week ahead is below
            so you can schedule posts.
          </p>
        </div>
      </section>
      <DailyVerseFeed />
    </main>
  );
}
