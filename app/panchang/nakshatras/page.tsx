import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { NAKSHATRA_DATA, nakshatraSlug } from '@/lib/panchang';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Sparkles, Compass, Moon, Sun, ArrowRight, BookOpen, Star, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: '27 Vedic Nakshatras (27 नक्षत्र) — Deities, Symbols & Spiritual Significance',
  description:
    'Complete guide to the 27 lunar asterisms of Vedic astronomy and Taittiriya Brahmana — Ashwini to Revati. Presiding Vedic deities, ruling planets, symbols, and spiritual contemplation themes.',
  keywords: [
    '27 nakshatras names and deities',
    'Vedic nakshatras list',
    '27 नक्षत्र के नाम और स्वामी',
    'Rohini nakshatra',
    'Ashwini nakshatra',
    'Pushya nakshatra',
    'Nakshatra Sukta Taittiriya Brahmana',
    'Vedic astrology lunar mansions',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/nakshatras/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: '27 Vedic Nakshatras (27 नक्षत्र) — Dharma Granth',
    description:
      'Complete guide to the 27 lunar asterisms of Vedic astronomy and Taittiriya Brahmana — Ashwini to Revati. Presiding Vedic deities, symbols, and spiritual study themes.',
    url: 'https://dharmagranth.dev/panchang/nakshatras/',
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
const pageUrl = `${siteUrl}/panchang/nakshatras/`;

const FAQS = [
  {
    q: 'What are the 27 Nakshatras in Vedic tradition?',
    a: 'In Vedic astronomy and philosophy, the 360° ecliptic is divided into 27 equal lunar mansions called Nakshatras, each spanning exactly 13°20\'. The Moon travels through approximately one Nakshatra each day, marking the daily cosmic rhythm and mental temperament.',
  },
  {
    q: 'What is the scriptural source of the 27 Nakshatras?',
    a: 'The Nakshatras are expounded in the oldest strata of Vedic literature: Rigveda (10.85), Atharvaveda (19.7), and most systematically in the Taittiriya Brahmana (3.1.4–5) and Taittiriya Samhita (4.4.10) in the revered Nakshatra Sukta.',
  },
  {
    q: 'How does a Nakshatra differ from a Rashi (Zodiac Sign)?',
    a: 'A Rashi is a 30° solar division of the sky (12 signs in total), whereas a Nakshatra is a 13°20\' lunar division (27 asterisms in total). Exactly 2.25 Nakshatras (9 padas of 3°20\' each) constitute one Rashi, creating an intricate harmonic bridge between the solar year and lunar month.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#page`,
      url: pageUrl,
      name: '27 Vedic Nakshatras (27 नक्षत्र) — Deities, Symbols & Meaning',
      description:
        'Complete guide to the 27 lunar asterisms of Vedic astronomy and Taittiriya Brahmana — Ashwini to Revati.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dharma Granth',
        url: `${siteUrl}/`,
      },
    },
    {
      '@type': 'ItemList',
      itemListElement: NAKSHATRA_DATA.map((n) => ({
        '@type': 'ListItem',
        position: n.index + 1,
        name: `${n.name} (${n.nameHi})`,
        url: `${siteUrl}/panchang/nakshatras/${nakshatraSlug(n.name)}/`,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    },
  ],
};

export default function NakshatrasHubPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Panchang', href: '/panchang/' },
          { label: '27 Nakshatras' },
        ]}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950/20 via-saffron-950/10 to-transparent pt-10 pb-12 border-b border-dharma-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 mb-4">
            <Star className="w-3.5 h-3.5" />
            <span>वैदिक नक्षत्र कोश · 27 Lunar Asterisms</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-dharma-text mb-4">
            27 Vedic Nakshatras
          </h1>
          <p lang="sa" className="font-devanagari text-xl sm:text-2xl text-saffron-800 dark:text-saffron-300 font-semibold mb-4">
            सप्तविंशति नक्षत्र · अधिष्ठाता देवता, प्रतीक व स्वाध्याय
          </p>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-dharma-muted leading-relaxed">
            The 27 celestial asterisms of the Taittiriya Brahmana Nakshatra Sukta. Each lunar mansion embodies a distinct presiding Vedic divinity, planetary influence, and psychological contemplation archetype.
          </p>
        </div>
      </section>

      {/* Grid of 27 Nakshatras */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-dharma-text">
              The 27 Lunar Asterisms in Zodiac Order
            </h2>
            <p className="text-xs sm:text-sm text-dharma-muted mt-1">
              Click any nakshatra to explore its presiding Vedic deity, classical mantra coordinate, and contemplation theme.
            </p>
          </div>
          <Link
            href="/panchang/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-3.5 py-2 text-xs font-semibold hover:border-saffron-400 transition"
          >
            <Calendar className="w-4 h-4 text-saffron-600" />
            <span>Today&apos;s Panchang</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NAKSHATRA_DATA.map((n) => {
            const slug = nakshatraSlug(n.name);
            return (
              <article
                key={n.index}
                className="group relative rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-xs transition-all hover:border-saffron-500/50 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-dharma-border/60 pb-3 mb-3">
                    <span className="text-xs font-mono font-bold text-saffron-700 dark:text-saffron-400 bg-saffron-500/10 px-2 py-0.5 rounded-md">
                      #{n.index + 1}
                    </span>
                    <span className="text-xs text-dharma-muted">
                      {n.rulingPlanet} (ग्रह)
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition-colors">
                    {n.name}{' '}
                    <span lang="sa" className="font-devanagari font-normal text-dharma-muted">
                      ({n.nameHi})
                    </span>
                  </h3>
                  <p className="font-serif text-xs italic text-dharma-muted mt-0.5">
                    {n.transliteration}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-dharma-text">
                    <p>
                      <strong className="text-dharma-muted font-normal">Deity: </strong>
                      {n.deity}
                    </p>
                    <p>
                      <strong className="text-dharma-muted font-normal">Symbol: </strong>
                      {n.symbol}
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-dharma-muted leading-relaxed line-clamp-2">
                    {n.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dharma-border/50 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-dharma-muted truncate max-w-[180px]">
                    {n.studyTheme}
                  </span>
                  <Link
                    href={`/panchang/nakshatras/${slug}/`}
                    className="inline-flex items-center gap-1 font-bold text-saffron-700 dark:text-saffron-300 hover:underline shrink-0"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Scriptural Framework Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 my-16 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-saffron-600" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold">
            The Scriptural Architecture of Vedic Nakshatras
          </h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-dharma-text">
          <p>
            In the ancient <em>Vedanga Jyotisha</em> and <em>Taittiriya Brahmana</em>, the sky is not an empty vacuum but an inhabited, conscious field (Kshetra). The 27 nakshatras are visualized as the celestial cosmic stations where universal principles take shape.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-dharma-bg border border-dharma-border">
              <h3 className="font-bold text-saffron-700 dark:text-saffron-300 text-sm mb-1">13°20&apos; Division</h3>
              <p className="text-xs text-dharma-muted leading-relaxed">
                Each nakshatra spans exactly 13 degrees and 20 minutes of arc. 27 nakshatras complete the full 360-degree circle of the heavens.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-dharma-bg border border-dharma-border">
              <h3 className="font-bold text-saffron-700 dark:text-saffron-300 text-sm mb-1">4 Padas per Star</h3>
              <p className="text-xs text-dharma-muted leading-relaxed">
                Each nakshatra is subdivided into 4 quarters (padas) of 3°20&apos; each, correlating with the 108 sacred beads of the japa mala.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-dharma-bg border border-dharma-border">
              <h3 className="font-bold text-saffron-700 dark:text-saffron-300 text-sm mb-1">Taittiriya Sukta</h3>
              <p className="text-xs text-dharma-muted leading-relaxed">
                In Taittiriya Brahmana 3.1.4, each star is paired with its Vedic devata (Agni, Prajapati, Soma, Rudra) for spiritual invocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 my-12 space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold">
          Frequently Asked Questions (जिज्ञासा समाधान)
        </h2>
        <div className="space-y-3">
          {FAQS.map((f, idx) => (
            <details key={idx} className="group rounded-2xl border border-dharma-border bg-dharma-card p-4 transition-all">
              <summary className="font-serif text-base font-bold text-dharma-text cursor-pointer list-none flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-saffron-600 text-lg transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-dharma-muted border-t border-dharma-border/50 pt-3">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

