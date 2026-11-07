import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { YOGA_DATA, yogaSlug } from '@/lib/panchang';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Sparkles, Sun, Moon, ArrowRight, BookOpen, Layers, ShieldCheck, Compass, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '27 Nitya Yogas (27 नित्य योग) — Meaning, Deities & Vedic Calculation',
  description:
    'Complete guide to the 27 Nitya Yogas of Vedic astronomy and Surya-Siddhanta — Vishkambha to Vaidhriti. Presiding Vedic deities, combined solar-lunar arc calculations, auspicious and reflective classifications, and spiritual contemplation themes.',
  keywords: [
    '27 yogas in vedic astrology',
    'nitya yoga panchang',
    'shubha yoga meaning',
    'vyatipata yoga',
    'siddhi yoga',
    'brahma yoga',
    '27 योग के नाम और फल',
    'surya siddhanta yoga calculation',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/yogas/' },
  openGraph: {
    images: [
      {
        url: '/og/yogas.png',
        width: 1200,
        height: 630,
        alt: 'The 27 Nitya Yogas — Combined Solar-Lunar Harmonic Framework',
      },
    ],
    title: '27 Nitya Yogas (27 नित्य योग) — Dharma Granth',
    description:
      'Complete guide to the 27 Nitya Yogas of Vedic astronomy and Surya-Siddhanta — Vishkambha to Vaidhriti.',
    url: 'https://dharmagranth.dev/panchang/yogas/',
  },
  twitter: {
    card: 'summary_large_image',
    title: '27 Nitya Yogas (27 नित्य योग) — Dharma Granth',
    description:
      'Complete guide to the 27 Nitya Yogas of Vedic astronomy and Surya-Siddhanta — Vishkambha to Vaidhriti.',
    images: ['/og/yogas.png'],
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
const pageUrl = `${siteUrl}/panchang/yogas/`;

const FAQS = [
  {
    q: 'What is a Nitya Yoga in Vedic astronomy and Panchang?',
    a: 'In Vedic astronomy and the Surya-Siddhanta, a Nitya Yoga is the sum of the sidereal longitudes of the Sun and the Moon divided into 27 equal arcs of 13°20\' each. While Tithi measures the difference between Moon and Sun (Moon minus Sun), Yoga measures their additive cosmic union (Moon plus Sun).',
  },
  {
    q: 'How many Yogas are there and how are they classified?',
    a: 'There are exactly 27 Nitya Yogas, from Vishkambha (0°00\' to 13°20\') to Vaidhriti (346°40\' to 360°00\'). Traditionally, they are categorized into Auspicious (Shubha) Yogas suited for outward enterprise and noble ceremonies, and Reflective (Samyami) Yogas suited for inward contemplation, japa, and restraint.',
  },
  {
    q: 'Why are Vyatipata and Vaidhriti considered special reflective Yogas?',
    a: 'Vyatipata and Vaidhriti are designated in classical texts as Mahapatas (intense energetic intersections). Rather than initiating worldly business or celebratory events, the scriptures advise that charity (dana), quiet meditation, and japa performed during these Yogas yield manifold spiritual merit.',
  },
  {
    q: 'How does Nitya Yoga differ from Patanjali Raja Yoga or Hatha Yoga?',
    a: 'The word "Yoga" fundamentally means "union". In astronomy and the Panchanga, it denotes the mathematical union (sum) of solar and lunar longitudes. In philosophy, it denotes the union of individual consciousness with the Supreme Self (as in Patanjali\'s Yoga Sutras and Bhagavad Gita).',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#page`,
      url: pageUrl,
      name: '27 Nitya Yogas (27 नित्य योग) — Meaning, Deities & Calculation',
      description:
        'Complete guide to the 27 Nitya Yogas of Vedic astronomy and Surya-Siddhanta — Vishkambha to Vaidhriti.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dharma Granth',
        url: `${siteUrl}/`,
      },
    },
    {
      '@type': 'ItemList',
      itemListElement: YOGA_DATA.map((y) => ({
        '@type': 'ListItem',
        position: y.index + 1,
        name: `${y.name} (${y.nameHi})`,
        url: `${siteUrl}/panchang/yogas/${y.slug}/`,
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

export default function YogasPage() {
  const auspiciousCount = YOGA_DATA.filter((y) => y.nature === 'Auspicious').length;
  const reflectiveCount = YOGA_DATA.filter((y) => y.nature !== 'Auspicious').length;

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text font-serif">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="mx-auto max-w-6xl px-gutter pt-8 pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: '27 Yogas' },
          ]}
        />

        {/* Hero Header */}
        <header className="mt-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans tracking-wide uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Fourth Limb of Panchanga · चतुर्थ अङ्ग</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-dharma-text mb-4">
            27 Nitya Yogas (27 नित्य योग)
          </h1>
          <p className="text-base sm:text-lg text-dharma-muted font-sans leading-relaxed">
            The additive harmony of the Sun (soul) and the Moon (mind). Discover the 27 solar-lunar
            arcs of the Vedic cosmos, their presiding deities, and contemplative svadhyaya guidance.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-sans">
            <span className="px-3.5 py-1.5 rounded-lg bg-surface border border-dharma-border/60 text-dharma-text font-medium flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              27 Arc Intervals (13°20&apos; each)
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {auspiciousCount} Auspicious Yogas
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-medium flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              {reflectiveCount} Contemplative / Tapas Yogas
            </span>
          </div>
        </header>

        {/* Astronomical Formula Banner */}
        <section className="mt-12 p-6 sm:p-8 rounded-2xl bg-surface border border-dharma-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <span className="text-xs font-sans uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
                Surya-Siddhanta Astronomical Formula
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-dharma-text mt-1">
                How Yoga Is Calculated (संयोग गणित)
              </h2>
              <p className="text-sm text-dharma-muted font-sans mt-2.5 leading-relaxed">
                In Sanskrit, <em>Yoga</em> signifies union or addition. While a <strong>Tithi</strong> measures
                the angular separation between the Moon and Sun (Moon − Sun), a <strong>Nitya Yoga</strong> measures
                their additive combination (Moon + Sun).
              </p>
              <div className="mt-4 p-3.5 rounded-xl bg-dharma-bg border border-dharma-border/70 font-mono text-xs sm:text-sm text-dharma-text">
                Yoga Index = ⌊ (Moon Longitude + Sun Longitude) ÷ 13°20&apos; ⌋
              </div>
            </div>
            <div className="space-y-3 font-sans text-xs sm:text-sm text-dharma-muted">
              <div className="p-3 rounded-xl bg-dharma-bg/60 border border-dharma-border/40">
                <strong className="text-dharma-text block mb-1">Solar &amp; Lunar Synergy</strong>
                The Sun represents the pure Self (Atman) and vital fire, while the Moon represents the reflective mind (Manas).
                Their additive total represents the combined psychic climate of the day.
              </div>
              <div className="p-3 rounded-xl bg-dharma-bg/60 border border-dharma-border/40">
                <strong className="text-dharma-text block mb-1">Svadhyaya Contemplation</strong>
                Each Yoga carries a presiding deity (such as Vishnu for Priti, Shiva for Shiva Yoga, or Ganesha for Siddhi Yoga)
                guiding intentional focus and righteous action.
              </div>
            </div>
          </div>
        </section>

        {/* 27 Yogas Directory Grid */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dharma-text">
                All 27 Nitya Yogas (27 नित्य योग सूची)
              </h2>
              <p className="text-sm text-dharma-muted font-sans mt-1">
                Arranged in continuous 13°20&apos; zodiacal arc sequence from 0° to 360°.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {YOGA_DATA.map((y) => {
              const isAuspicious = y.nature === 'Auspicious';
              return (
                <Link
                  key={y.slug}
                  href={`/panchang/yogas/${y.slug}/`}
                  className="group relative p-5 rounded-2xl bg-surface border border-dharma-border/80 hover:border-amber-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Index, Nature Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-dharma-bg text-dharma-muted border border-dharma-border/60">
                        #{y.index + 1}
                      </span>
                      <span
                        className={`text-xs font-sans px-2.5 py-0.5 rounded-full font-medium ${
                          isAuspicious
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {y.nature}
                      </span>
                    </div>

                    {/* Titles */}
                    <h3 className="text-lg font-bold text-dharma-text group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {y.name}{' '}
                      <span className="text-base text-dharma-muted font-normal">
                        ({y.nameHi})
                      </span>
                    </h3>
                    <p className="text-xs font-sans text-amber-700/90 dark:text-amber-400 font-medium mt-0.5">
                      Deity: {y.deity}
                    </p>

                    {/* Short Description */}
                    <p className="text-xs text-dharma-muted font-sans mt-2.5 leading-relaxed line-clamp-2">
                      {y.explanation}
                    </p>
                  </div>

                  {/* Footer Arc and Action */}
                  <div className="mt-4 pt-3 border-t border-dharma-border/50 flex items-center justify-between text-xs font-sans text-dharma-muted">
                    <span className="font-mono text-[11px] text-dharma-muted">
                      {y.arc}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-16 border-t border-dharma-border pt-12">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-2xl font-bold text-dharma-text">
              Frequently Asked Questions (अक्सर पूछे जाने वाले प्रश्न)
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface border border-dharma-border shadow-sm"
              >
                <h3 className="text-base sm:text-lg font-bold text-dharma-text mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-dharma-muted font-sans leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Panchang Hub Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/panchang/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-sans font-medium shadow-md transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Open Today&apos;s Live Panchang Calculator</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
