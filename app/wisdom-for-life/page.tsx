import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { FadeUp } from '@/app/components/motion/primitives';
import { WisdomClient } from './WisdomClient';
import Link from 'next/link';
import { SEARCH_INTENTS } from '@/data/search-intent';
import { Compass, BookOpen, Heart, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wisdom for Life — जीवन के लिए शास्त्रीय मार्गदर्शन',
  description:
    'Source-linked passages from the Gita and Upanishads for reflecting on life questions, relationships, discipline, grief, purpose, and attention.',
  alternates: { canonical: '/wisdom-for-life/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Wisdom for Life — जीवन के लिए शास्त्रीय मार्गदर्शन — Dharma Granth',
    description:
      'Life questions opened through verses already in the library, without requiring a scripture name first.',
    url: 'https://dharmagranth.dev/wisdom-for-life',
  },
};

export default function WisdomForLifeIndexPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-amber-900 to-stone-950 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <FadeUp>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-200 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
                <Compass className="w-3.5 h-3.5 text-amber-300" />
                शास्त्रीय जीवन-दृष्टि — Life Guidance
              </span>
              <span className="text-xs text-amber-200/80 hidden sm:inline">•</span>
              <span className="text-xs text-amber-100/90 hidden sm:inline">
                No prior scripture knowledge needed
              </span>
            </div>

            <div className="max-w-3xl">
              <p
                lang="hi"
                className="text-2xl sm:text-3xl font-devanagari font-bold text-amber-200 drop-shadow-md mb-2"
              >
                जीवन के लिए शास्त्रीय मार्गदर्शन
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight mb-5 leading-tight">
                Wisdom for Life
              </h1>
              <p className="text-base sm:text-lg text-amber-50/90 leading-relaxed font-normal mb-6">
                Explore selected passages by a life question, situation, or practice—without needing chapter coordinates. Each topic is a starting point for study and reflection, not a diagnosis or treatment.
              </p>
              <p lang="hi" className="max-w-3xl text-sm sm:text-base leading-relaxed font-devanagari text-amber-100/90">
                जीवन के प्रश्नों और परिस्थितियों के अनुसार चयनित शास्त्रीय पाठ पढ़ें। ये अध्ययन और मनन के विषय हैं, निदान या उपचार नहीं।
              </p>
            </div>

            {/* Quick feature pill highlights */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 text-xs sm:text-sm text-white/85">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Original Sanskrit & Literal Translations</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Traditional Context & Practical Contemplation</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10">
                <Heart className="w-4 h-4 text-amber-300" />
                <span>Study and reflection • Sources shown</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section aria-labelledby="search-phrases" className="mx-auto max-w-6xl px-6 py-8">
        <h2 id="search-phrases" className="font-serif text-2xl font-bold text-dharma-text">
          <span lang="hi" className="font-devanagari">खोज के वाक्य</span>
        </h2>
        <p lang="hi" className="mt-2 text-sm text-dharma-text">हर वाक्य उसी जीवन-विषय को खोलता है। नया पृष्ठ नहीं बनाया गया।</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SEARCH_INTENTS.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/wisdom-for-life/${item.slug}`}
                className="inline-flex min-h-[44px] items-center rounded-full border border-dharma-border bg-dharma-card px-3 text-sm font-semibold text-saffron-600"
              >
                <span lang="hi" className="font-devanagari">{item.titleHi}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Client Search, Filters & Cards ───────────────────────── */}
      <WisdomClient />
    </main>
  );
}
