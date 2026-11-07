import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { UNIQUE_TITHI_ARCHETYPES } from '@/lib/panchang';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PanchangLimbSwitcher } from '@/app/panchang/components/PanchangLimbSwitcher';
import { Moon, Sun, ArrowRight, BookOpen, Sparkles, Calendar, Layers, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: '16 Vedic Tithis (16 तिथियाँ) — Meaning, Deities & Pancha Tithi Categories',
  description:
    'Complete guide to the 16 lunar day archetypes of Vedic astronomy and Muhurta tradition — Pratipada to Purnima and Amavasya. Presiding deities, Nanda-Bhadra-Jaya-Rikta-Poorna classes, and spiritual significance.',
  keywords: [
    '16 tithis in vedic astrology',
    'tithi meaning in hindi',
    'pancha tithi nanda bhadra jaya rikta poorna',
    'shukla paksha krishna paksha tithi',
    'chaturthi tithi significance',
    'ashtami tithi meaning',
    'ekadashi tithi',
    'purnima amavasya tithi',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/tithis/' },
  openGraph: {
    images: [
      {
        url: '/og/tithis.png',
        width: 1200,
        height: 630,
        alt: 'The 16 Vedic Tithis — Lunar Days & Pancha Tithi Harmonic Framework',
      },
    ],
    title: '16 Vedic Tithis (16 तिथियाँ) — Dharma Granth',
    description:
      'Complete guide to the 16 lunar day archetypes of Vedic astronomy and Muhurta tradition — Pratipada to Purnima and Amavasya.',
    url: 'https://dharmagranth.dev/panchang/tithis/',
  },
  twitter: {
    card: 'summary_large_image',
    title: '16 Vedic Tithis (16 तिथियाँ) — Dharma Granth',
    description:
      'Complete guide to the 16 lunar day archetypes of Vedic astronomy and Muhurta tradition — Pratipada to Purnima and Amavasya.',
    images: ['/og/tithis.png'],
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
const pageUrl = `${siteUrl}/panchang/tithis/`;

const FAQS = [
  {
    q: 'What is a Tithi in Vedic astronomy?',
    a: 'A Tithi is a lunar day defined by the exact longitudinal distance between the Sun and the Moon. Each Tithi represents exactly 12 degrees of angular separation. Since the Moon moves at variable speeds in its elliptical orbit, a Tithi can vary between approximately 19 and 26 hours in length.',
  },
  {
    q: 'What are the 5 Pancha Tithi categories (नन्दा, भद्रा, जया, रिक्ता, पूर्णा)?',
    a: 'In classical texts like the Surya Siddhanta and Muhurta Chintamani, the 15 tithis of each fortnight repeat in a 5-fold harmonic cycle: Nanda (1, 6, 11 — Joy-bestowing), Bhadra (2, 7, 12 — Auspicious), Jaya (3, 8, 13 — Victorious), Rikta (4, 9, 14 — Eliminating/Purifying), and Poorna (5, 10, 15/30 — Complete).',
  },
  {
    q: 'Why are there 16 unique Tithi archetypes for 30 lunar days?',
    a: 'There are 14 recurring tithis shared by both fortnights (Pratipada through Chaturdashi in Shukla and Krishna Paksha), plus two culmination days: Purnima (15th day, Full Moon of Shukla Paksha) and Amavasya (30th day, New Moon of Krishna Paksha), totaling 16 distinct astronomical and spiritual archetypes.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#page`,
      url: pageUrl,
      name: '16 Vedic Tithis (16 तिथियाँ) — Meaning, Deities & Pancha Tithi',
      description:
        'Complete guide to the 16 lunar day archetypes of Vedic astronomy and Muhurta tradition — Pratipada to Purnima and Amavasya.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dharma Granth',
        url: `${siteUrl}/`,
      },
    },
    {
      '@type': 'ItemList',
      itemListElement: UNIQUE_TITHI_ARCHETYPES.map((t) => ({
        '@type': 'ListItem',
        position: t.number,
        name: `${t.name} (${t.nameHi})`,
        url: `${siteUrl}/panchang/tithis/${t.slug}/`,
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

const CATEGORY_COLORS: Record<string, string> = {
  Nanda: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
  Bhadra: 'border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300',
  Jaya: 'border-purple-500/30 bg-purple-500/10 text-purple-800 dark:text-purple-300',
  Rikta: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  Poorna: 'border-saffron-500/30 bg-saffron-500/10 text-saffron-800 dark:text-saffron-300',
};

export default function TithisHubPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Panchang', href: '/panchang/' },
          { label: '16 Vedic Tithis' },
        ]}
      />

      <PanchangLimbSwitcher activeLimb="tithis" />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-950/20 via-saffron-950/10 to-transparent pt-10 pb-12 border-b border-dharma-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 border border-saffron-500/20 mb-4">
            <Moon className="w-3.5 h-3.5" />
            <span>वैदिक तिथि दर्शन · 16 Lunar Day Archetypes</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-dharma-text mb-4">
            16 Vedic Tithis
          </h1>
          <p lang="sa" className="font-devanagari text-xl sm:text-2xl text-saffron-800 dark:text-saffron-300 font-semibold mb-4">
            प्रतिपदा से पूर्णिमा व अमावस्या · पंच-तिथि वर्ग, देवता एवं साधना
          </p>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-dharma-muted leading-relaxed">
            In Vedic astronomical science, a Tithi represents exactly 12 degrees of angular movement between the Sun and Moon. Discover the governing Vedic deities, the 5 cyclic categories, and the spiritual purpose of each day.
          </p>
        </div>
      </section>

      {/* The 5 Cyclic Groups Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-saffron-600" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              The 5-Fold Harmonic Cycle (पंच-तिथि वर्ग)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-dharma-muted leading-relaxed mb-6">
            In the Surya Siddhanta, the 15 lunar days of each fortnight repeat in a 5-fold rhythmic progression reflecting the ebb and flow of cosmic prana:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { name: 'Nanda (नन्दा)', sub: '1, 6, 11', desc: 'Joy & Beginnings', col: 'text-emerald-700 dark:text-emerald-300' },
              { name: 'Bhadra (भद्रा)', sub: '2, 7, 12', desc: 'Auspicious Welfare', col: 'text-blue-700 dark:text-blue-300' },
              { name: 'Jaya (जया)', sub: '3, 8, 13', desc: 'Victory & Fortitude', col: 'text-purple-700 dark:text-purple-300' },
              { name: 'Rikta (रिक्ता)', sub: '4, 9, 14', desc: 'Emptying & Purifying', col: 'text-amber-700 dark:text-amber-300' },
              { name: 'Poorna (पूर्णा)', sub: '5, 10, 15/30', desc: 'Fullness & Mastery', col: 'text-saffron-700 dark:text-saffron-300' },
            ].map((c) => (
              <div key={c.name} className="p-4 rounded-2xl bg-dharma-bg border border-dharma-border text-center">
                <span className={`font-serif text-sm font-bold block ${c.col}`}>{c.name}</span>
                <span className="text-[11px] font-mono text-dharma-muted block mt-0.5">Tithis {c.sub}</span>
                <span className="text-xs text-dharma-text block mt-1">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of the 16 Unique Tithis */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-dharma-text">
              The 16 Unique Lunar Archetypes
            </h2>
            <p className="text-xs sm:text-sm text-dharma-muted mt-1">
              Click any tithi to view its governing deity, Shukla & Krishna dynamics, and famous spiritual observances.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {UNIQUE_TITHI_ARCHETYPES.map((t) => {
            const badgeClass = CATEGORY_COLORS[t.categoryType] || 'border-dharma-border bg-dharma-bg text-dharma-text';
            return (
              <article
                key={t.slug}
                className="group card-sacred sheen-sweep relative rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-xs hover:border-saffron-500/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-dharma-border/60 pb-3 mb-3">
                    <span className="text-xs font-mono font-bold text-saffron-700 dark:text-saffron-400 bg-saffron-500/10 px-2 py-0.5 rounded-md">
                      #{t.number}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                      {t.categoryType}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition-colors">
                    {t.name}{' '}
                    <span lang="sa" className="font-devanagari font-normal text-dharma-muted">
                      ({t.nameHi})
                    </span>
                  </h3>
                  <p className="font-serif text-xs italic text-dharma-muted mt-0.5">
                    {t.transliteration}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-dharma-text">
                    <p>
                      <strong className="text-dharma-muted font-normal">Deity: </strong>
                      {t.deity}
                    </p>
                    <p>
                      <strong className="text-dharma-muted font-normal">Arc: </strong>
                      {t.lunarDegrees}
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-dharma-muted leading-relaxed line-clamp-2">
                    {t.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dharma-border/50 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-dharma-muted truncate max-w-[150px]">
                    {t.famousObservances[0] || t.spiritualFocus}
                  </span>
                  <Link
                    href={`/panchang/tithis/${t.slug}/`}
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

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 my-16 space-y-4">
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

