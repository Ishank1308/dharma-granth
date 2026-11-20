import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllKaranas, calculateEducationalPanchang, PRESET_LOCATIONS, todayForLocation, type KaranaMeta } from '@/lib/panchang';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PanchangLimbSwitcher } from '@/app/panchang/components/PanchangLimbSwitcher';
import { Sparkles, Moon, Sun, ArrowRight, BookOpen, Layers, ShieldCheck, Compass, HelpCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '11 Vedic Karanas (11 करण) — Chara & Sthira Half-Tithi Classification',
  description:
    'Comprehensive guide to the 11 Karanas of Vedic astronomy and Muhurta science — 7 Chara (Movable: Bava, Balava, Kaulava, Taitila, Garaja, Vanija, Vishti/Bhadra) and 4 Sthira (Fixed: Shakuni, Chatushpada, Naga, Kimstughna). Presiding deities, Bhadra rules, and spiritual contemplation.',
  keywords: [
    '11 karanas in astrology',
    'bhadra karana rules',
    'vishti karana meaning',
    'chara sthira karana',
    'bava balava kaulava',
    'shakuni chatushpada naga kimstughna',
    '11 करण के नाम और स्वामी',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/karanas/' },
  openGraph: {
    images: [
      {
        url: '/og/karanas.png',
        width: 1200,
        height: 630,
        alt: 'The 11 Vedic Karanas — Half-Tithi Cosmic Classification',
      },
    ],
    title: '11 Vedic Karanas (11 करण) — Dharma Granth',
    description:
      'Complete guide to the 11 Karanas of Vedic astronomy and Muhurta science — 7 Chara and 4 Sthira Karanas.',
    url: 'https://dharmagranth.dev/panchang/karanas/',
  },
  twitter: {
    card: 'summary_large_image',
    title: '11 Vedic Karanas (11 करण) — Dharma Granth',
    description:
      'Complete guide to the 11 Karanas of Vedic astronomy and Muhurta science — 7 Chara and 4 Sthira Karanas.',
    images: ['/og/karanas.png'],
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
const pageUrl = `${siteUrl}/panchang/karanas/`;

const FAQS = [
  {
    q: 'What is a Karana in Vedic Panchanga?',
    a: 'A Karana is exactly one-half of a Tithi, representing 6 degrees of angular elongation between the Sun and Moon. Since a lunar month contains 30 Tithis, there are exactly 60 Karanas in each lunar month.',
  },
  {
    q: 'What is the difference between Chara (Movable) and Sthira (Fixed) Karanas?',
    a: 'Out of the 11 Karanas, 7 are Chara (Movable: Bava, Balava, Kaulava, Taitila, Garaja, Vanija, Vishti) which cycle 8 times each across the month (7 × 8 = 56 Karanas). The remaining 4 are Sthira (Fixed: Shakuni, Chatushpada, Naga, Kimstughna) which appear only once per month during the darkest phase leading into the new moon (Krishna Chaturdashi second half through Shukla Pratipada first half). Total = 56 + 4 = 60 Karanas.',
  },
  {
    q: 'What is Vishti Karana (Bhadra), and why is it significant?',
    a: 'Vishti Karana is widely known as Bhadra. In classical Muhurta texts, Bhadra is regarded as a fierce energy suited for defensive warfare, medical detoxification, deep cleaning, fasting, and spiritual japa, while worldly celebratory starts (weddings, home purchase, travel) are postponed.',
  },
  {
    q: 'Can spiritual practices (sadhana) be performed during Bhadra or fixed Karanas?',
    a: 'Yes, absolutely. The restriction on Bhadra applies specifically to outward commercial and social celebrations. Inward spiritual disciplines, japa of Shiva or Hanuman, meditation, and charity are considered highly meritorious and purifying during reflective Karanas.',
  },
];

const allKaranas = getAllKaranas();

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#page`,
      url: pageUrl,
      name: '11 Vedic Karanas (11 करण) — Meaning, Deities & Bhadra Rules',
      description:
        'Complete guide to the 11 Karanas of Vedic astronomy and Muhurta science — 7 Chara and 4 Sthira Karanas.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dharma Granth',
        url: `${siteUrl}/`,
      },
    },
    {
      '@type': 'ItemList',
      itemListElement: allKaranas.map((k, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `${k.name} (${k.nameHi})`,
        url: `${siteUrl}/panchang/karanas/${k.slug}/`,
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

function KaranaCard({
  karana,
  index,
  isToday,
  variant,
}: {
  karana: KaranaMeta;
  index: number;
  isToday: boolean;
  variant: 'chara' | 'sthira';
}) {
  const isChara = variant === 'chara';
  return (
    <Link
      href={`/panchang/karanas/${karana.slug}/`}
      className={`group card-sacred sheen-sweep relative p-5 rounded-2xl border flex flex-col justify-between ${
        isToday
          ? 'border-saffron-500 bg-saffron-500/[0.04] shadow-md ring-2 ring-saffron-500/50 animate-prana-pulse'
          : `bg-surface border-dharma-border/80 ${isChara ? 'hover:border-amber-500/50' : 'hover:border-indigo-500/50'}`
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-dharma-bg text-dharma-muted border border-dharma-border/60">
              {isChara ? 'Chara' : 'Fixed'} #{index + 1}
            </span>
            {isToday && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500/15 border border-saffron-500/40 px-2.5 py-0.5 text-[11px] font-bold text-saffron-800 dark:text-saffron-200">
                <span className="size-1.5 rounded-full bg-saffron-600 animate-pulse" />
                आज का करण · Active Today
              </span>
            )}
          </div>
          <span
            className={`text-xs font-sans px-2.5 py-0.5 rounded-full font-medium border ${
              isChara
                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                : 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-500/20'
            }`}
          >
            {karana.natureHi}
          </span>
        </div>

        <h3
          className={`text-lg font-bold text-dharma-text transition-colors ${
            isChara ? 'group-hover:text-amber-600 dark:group-hover:text-amber-400' : 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
          }`}
        >
          {karana.name}{' '}
          <span className="text-base text-dharma-muted font-normal">
            ({karana.nameHi})
          </span>
        </h3>
        <p
          className={`text-xs font-sans font-medium mt-0.5 ${
            isChara ? 'text-amber-700/90 dark:text-amber-400' : 'text-indigo-700/90 dark:text-indigo-400'
          }`}
        >
          Deity: {karana.deity}
        </p>

        <p className="text-xs text-dharma-muted font-sans mt-2.5 leading-relaxed line-clamp-2">
          {karana.explanation}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-dharma-border/50 flex items-center justify-between text-xs font-sans text-dharma-muted">
        <span className={`text-[11px] text-dharma-muted ${isChara ? '' : 'truncate max-w-[120px]'}`}>
          {isChara ? '6° Half-Tithi' : karana.occurrence}
        </span>
        <span
          className={`flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform ${
            isChara ? 'text-amber-700 dark:text-amber-400' : 'text-indigo-700 dark:text-indigo-400'
          }`}
        >
          Details
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function KaranasPage() {
  const charaKaranas = allKaranas.filter((k) => k.nature.startsWith('Chara'));
  const sthiraKaranas = allKaranas.filter((k) => k.nature.startsWith('Sthira'));
  const todayPanchang = calculateEducationalPanchang(todayForLocation(PRESET_LOCATIONS[0]), PRESET_LOCATIONS[0]);
  const todayKaranaName = todayPanchang.karana.name;

  return (
    <main className="apple-scope panchang-scope panchang-limb min-h-screen bg-dharma-bg text-dharma-text font-serif relative overflow-hidden" data-limb="karanas">
      {/* Earthly Tulsi Karana Aura Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-[460px] w-full max-w-5xl rounded-full bg-radial from-emerald-500/18 via-teal-500/12 to-transparent blur-3xl"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="mx-auto max-w-6xl px-gutter pt-8 pb-16 relative z-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: '11 Karanas' },
          ]}
        />

        <div className="mt-4 mb-2">
          <PanchangLimbSwitcher activeLimb="karanas" />
        </div>

        {/* Hero Header */}
        <header className="mt-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans tracking-wide uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Fifth Limb of Panchanga · पञ्चम अङ्ग</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-dharma-text mb-4">
            The 11 Vedic Karanas (11 करण)
          </h1>
          <p className="text-base sm:text-lg text-dharma-muted font-sans leading-relaxed">
            The micro-rhythm of the lunar month. Each Karana spans half of a Tithi (6° elongation).
            Discover the 7 movable (Chara) and 4 fixed (Sthira) archetypes, the rules of Bhadra, and spiritual insights.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-sans">
            <span className="px-3.5 py-1.5 rounded-lg bg-surface border border-dharma-border/60 text-dharma-text font-medium flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              60 Half-Tithi Spans (6° each)
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              7 Chara Karanas (Cycle 8×)
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              4 Sthira Karanas (Fixed Once/Month)
            </span>
          </div>
        </header>

        {/* Vishti / Bhadra Spotlight Banner */}
        <section className="mt-12 p-6 sm:p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-sans uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
                Muhurta Science Deep-Dive
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-dharma-text mt-1">
                Understanding Vishti Karana (भद्रा विचार)
              </h2>
              <p className="text-sm text-dharma-muted font-sans mt-2 leading-relaxed">
                The 7th movable Karana is <strong>Vishti</strong>, widely known as <strong>Bhadra</strong>.
                In classical astronomical texts, it recurs 8 times during a lunar month (on Shukla 8, 11, 15 and Krishna 3, 7, 10, 14).
                Traditional Muhurta treatises recommend reserving Bhadra for defensive strategies, medicinal cures, deep cleaning,
                fasting, and meditation upon Shiva or Hanuman, while deferring celebratory beginnings.
              </p>
              <div className="mt-4">
                <Link
                  href="/panchang/karanas/vishti/"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  Read full Bhadra scriptural guidelines and timings →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: 7 Chara (Movable) Karanas */}
        <section className="mt-14">
          <div className="mb-6">
            <div className="inline-block text-xs font-sans uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
              Part 1 · The Recurring Cycle
            </div>
            <h2 className="text-2xl font-bold text-dharma-text">
              7 Chara (Movable) Karanas (7 चर करण)
            </h2>
            <p className="text-sm text-dharma-muted font-sans mt-1">
              These 7 Karanas repeat in continuous succession 8 times across the 30 lunar days (7 × 8 = 56 half-tithis).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {charaKaranas.map((k, idx) => (
              <KaranaCard
                key={k.slug}
                karana={k}
                index={idx}
                isToday={k.name === todayKaranaName}
                variant="chara"
              />
            ))}
          </div>
        </section>

        {/* Section 2: 4 Sthira (Fixed) Karanas */}
        <section className="mt-14">
          <div className="mb-6">
            <div className="inline-block text-xs font-sans uppercase tracking-widest text-indigo-700 dark:text-indigo-400 font-semibold mb-1">
              Part 2 · The Dark Phase Anchors
            </div>
            <h2 className="text-2xl font-bold text-dharma-text">
              4 Sthira (Fixed) Karanas (4 स्थिर करण)
            </h2>
            <p className="text-sm text-dharma-muted font-sans mt-1">
              These 4 Karanas occur exactly once per lunar month, bridging Krishna Chaturdashi, Amavasya, and Shukla Pratipada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sthiraKaranas.map((k, idx) => (
              <KaranaCard
                key={k.slug}
                karana={k}
                index={idx}
                isToday={k.name === todayKaranaName}
                variant="sthira"
              />
            ))}
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
