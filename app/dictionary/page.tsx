import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { FadeUp } from '@/app/components/motion/primitives';
import { DictionaryClient } from './DictionaryClient';
import { SITE_URL } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Terminology Dictionary (शब्दकोश)',
  description:
    'Dictionary of core Hindu terms: Dharma, Ṛta, Ātman, Brahman, Karma, Mokṣa and more, with Sanskrit, etymology, interpretations and related verses.',
  alternates: { canonical: '/dictionary/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Terminology Dictionary (शब्दकोश) — Dharma Granth',
    description:
      'A structured dictionary of fundamental Hindu terminology: Dharma, Ṛta, Satya, Ātman, Brahman, Mokṣa, and more.',
    url: `${SITE_URL}/dictionary/`,
  },
};

export default function DictionaryPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-amber-800 to-orange-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              शब्दकोश — Hindu Terminology Dictionary
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Terminology Dictionary
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed">
              A structured reference for foundational concepts of Hindu philosophy. Each term includes permanent identifiers, Sanskrit etymology, cross-tradition interpretations, and related scriptural verses.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Interactive Terms Grid ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        <DictionaryClient />
      </section>
    </main>
  );
}
