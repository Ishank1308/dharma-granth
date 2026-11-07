import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NAKSHATRA_DATA, getNakshatraBySlug, nakshatraSlug } from '@/lib/panchang';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { clipDescription } from '@/lib/meta-text';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Star, Compass, ArrowLeft, ArrowRight, BookOpen, Sparkles, Calendar, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NAKSHATRA_DATA.map((n) => ({ slug: nakshatraSlug(n.name) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const nakshatra = getNakshatraBySlug(resolved.slug);
  if (!nakshatra) return { title: 'Nakshatra Not Found' };

  const title = `${nakshatra.name} Nakshatra (${nakshatra.nameHi}) — Deity, Symbol & Vedic Meaning`;
  const description = clipDescription(
    `${nakshatra.name} (${nakshatra.nameHi}) is the ${nakshatra.index + 1}th lunar mansion of the Vedic zodiac. Presiding deity: ${nakshatra.deity}. Ruling planet: ${nakshatra.rulingPlanet}. ${nakshatra.explanation} ${nakshatra.studyTheme}`
  );
  const canonical = `/panchang/nakshatras/${resolved.slug}/`;
  const ogImageUrl = `/og/nakshatra/${resolved.slug}.png`;

  return {
    title,
    description,
    keywords: [
      `${nakshatra.name} nakshatra meaning`,
      `${nakshatra.name} nakshatra deity`,
      `${nakshatra.name} nakshatra lord`,
      `${nakshatra.nameHi} नक्षत्र`,
      `${nakshatra.nameHi} नक्षत्र के देवता`,
      '27 nakshatras',
      'vedic nakshatra sukta',
      'dharma granth panchang',
    ],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title: `${title} — Dharma Granth`,
      description,
      url: `https://dharmagranth.dev${canonical}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${nakshatra.name} Nakshatra (${nakshatra.nameHi}) — Deity, Symbol & Vedic Meaning`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function NakshatraDetailPage({ params }: PageProps) {
  const resolved = await params;
  const nakshatra = getNakshatraBySlug(resolved.slug);
  if (!nakshatra) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/panchang/nakshatras/${resolved.slug}/`;

  const total = NAKSHATRA_DATA.length;
  const prevIndex = (nakshatra.index - 1 + total) % total;
  const nextIndex = (nakshatra.index + 1) % total;
  const prevNakshatra = NAKSHATRA_DATA[prevIndex];
  const nextNakshatra = NAKSHATRA_DATA[nextIndex];

  // Arc span calculation: each nakshatra spans 13°20'
  const startDeg = nakshatra.index * 13 + Math.floor((nakshatra.index * 20) / 60);
  const startMin = (nakshatra.index * 20) % 60;
  const endDeg = (nakshatra.index + 1) * 13 + Math.floor(((nakshatra.index + 1) * 20) / 60);
  const endMin = ((nakshatra.index + 1) * 20) % 60;
  const arcSpan = `${startDeg}°${startMin.toString().padStart(2, '0')}' – ${endDeg}°${endMin.toString().padStart(2, '0')}'`;

  const faqs = [
    {
      q: `What is the presiding Vedic deity of ${nakshatra.name} Nakshatra?`,
      a: `${nakshatra.name} (${nakshatra.nameHi}) is governed by ${nakshatra.deity}. In the Taittiriya Brahmana Nakshatra Sukta, invoking this divinity awakens the corresponding celestial qualities and moral virtues.`,
    },
    {
      q: `What is the symbol and ruling planetary force of ${nakshatra.name}?`,
      a: `The traditional symbol of ${nakshatra.name} is "${nakshatra.symbol}", and its planetary ruler (Graha) is ${nakshatra.rulingPlanet}.`,
    },
    {
      q: `What is the spiritual study theme associated with ${nakshatra.name}?`,
      a: `${nakshatra.studyTheme} Svadhyaya under this star emphasizes internalizing these ethical principles.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: `${nakshatra.name} Nakshatra (${nakshatra.nameHi}) — Deity, Symbol & Meaning`,
        description: clipDescription(nakshatra.explanation),
        abstract: nakshatra.explanation,
        text: `${nakshatra.name} (${nakshatra.nameHi}, ${nakshatra.transliteration}). Presiding deity: ${nakshatra.deity}. Ruling planet: ${nakshatra.rulingPlanet}. Symbol: ${nakshatra.symbol}. Explanation: ${nakshatra.explanation}. Study theme: ${nakshatra.studyTheme}. Arc span: ${arcSpan}.`,
        inLanguage: ['sa', 'hi', 'en'],
        isAccessibleForFree: true,
        genre: 'Vedic Astronomy & Philosophy',
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Dharma Granth',
          url: siteUrl,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/icon-512.png` },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Panchang', item: `${siteUrl}/panchang/` },
          { '@type': 'ListItem', position: 3, name: '27 Nakshatras', item: `${siteUrl}/panchang/nakshatras/` },
          { '@type': 'ListItem', position: 4, name: nakshatra.name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Panchang', href: '/panchang/' },
          { label: '27 Nakshatras', href: '/panchang/nakshatras/' },
          { label: nakshatra.name },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header Hero */}
        <header className="text-center pb-8 border-b border-dharma-border">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
              <Star className="w-3.5 h-3.5" />
              <span>Nakshatra #{nakshatra.index + 1} of 27</span>
            </span>
            <span className="text-xs text-dharma-muted font-medium border border-dharma-border rounded-full px-3 py-1">
              {arcSpan} of the Zodiac
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-dharma-text">
            {nakshatra.name}
          </h1>
          <p lang="sa" className="font-devanagari text-2xl sm:text-3xl text-saffron-800 dark:text-saffron-300 font-semibold mt-2">
            {nakshatra.nameHi} <span className="font-serif text-lg sm:text-xl font-normal text-dharma-muted">({nakshatra.transliteration})</span>
          </p>
        </header>

        {/* Key Astronomical & Scriptural Attributes */}
        <section aria-labelledby="attributes-heading" className="my-8">
          <h2 id="attributes-heading" className="sr-only">Nakshatra Coordinates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                अधिष्ठाता देवता (Vedic Deity)
              </span>
              <p className="font-serif text-base font-bold text-saffron-900 dark:text-saffron-200">
                {nakshatra.deity}
              </p>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                स्वामी ग्रह (Ruling Planet)
              </span>
              <p className="font-serif text-base font-bold text-saffron-900 dark:text-saffron-200">
                {nakshatra.rulingPlanet}
              </p>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                प्रतीक चिन्ह (Sacred Symbol)
              </span>
              <p className="font-serif text-base font-bold text-saffron-900 dark:text-saffron-200">
                {nakshatra.symbol}
              </p>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                वैदिक स्रोत (Vedic Source)
              </span>
              <p className="font-serif text-base font-bold text-saffron-900 dark:text-saffron-200">
                Taittiriya Br. 3.1.4
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Explanation & Symbolism */}
        <section aria-labelledby="explanation-heading" className="my-8 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 id="explanation-heading" className="font-serif text-xl sm:text-2xl font-bold">
              शास्त्रीय स्वरूप एवं सांकेतिक अर्थ (Nature & Symbolism)
            </h2>
          </div>

          <div className="space-y-4 leading-relaxed text-sm sm:text-base text-dharma-text">
            <p>
              {nakshatra.explanation}
            </p>
            <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300/40 dark:border-amber-800/40 p-5 sm:p-6">
              <span className="font-devanagari text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 block mb-1.5">
                स्वाध्याय एवं साधना संकेत (Spiritual Contemplation Theme)
              </span>
              <p className="font-serif text-sm sm:text-base italic text-amber-950 dark:text-amber-100">
                &ldquo;{nakshatra.studyTheme}&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Daily Panchang Connection Box */}
        <section className="my-8 rounded-2xl border border-dharma-border bg-gradient-to-r from-saffron-500/10 via-amber-500/5 to-transparent p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-dharma-text">
              Track Current Nakshatra & Tithi Today
            </h3>
            <p className="text-xs sm:text-sm text-dharma-muted mt-1">
              Use our educational astronomical calculator to see when the Moon transitions across {nakshatra.name}.
            </p>
          </div>
          <Link
            href="/panchang/"
            className="inline-flex items-center gap-2 rounded-xl bg-saffron-700 hover:bg-saffron-800 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold transition shadow-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Vedic Panchang</span>
          </Link>
        </section>

        {/* FAQs */}
        <section aria-labelledby="faq-heading" className="my-10 space-y-4">
          <h2 id="faq-heading" className="font-serif text-xl sm:text-2xl font-bold">
            Frequently Asked Questions (जिज्ञासा समाधान)
          </h2>
          <div className="space-y-3">
            {faqs.map((f, idx) => (
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

        {/* Prev / Next navigation across the 27 Nakshatras */}
        <nav aria-label="Nakshatras cycle navigation" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-dharma-border pt-6">
          <Link
            href={`/panchang/nakshatras/${nakshatraSlug(prevNakshatra.name)}/`}
            className="inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-xs sm:text-sm font-semibold hover:border-saffron-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>#{prevNakshatra.index + 1} {prevNakshatra.name} ({prevNakshatra.nameHi})</span>
          </Link>

          <Link
            href="/panchang/nakshatras/"
            className="text-xs sm:text-sm font-bold text-saffron-800 dark:text-saffron-300 underline underline-offset-2"
          >
            All 27 Nakshatras (सम्पूर्ण नक्षत्र सूची)
          </Link>

          <Link
            href={`/panchang/nakshatras/${nakshatraSlug(nextNakshatra.name)}/`}
            className="inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-xs sm:text-sm font-semibold hover:border-saffron-400 transition"
          >
            <span>#{nextNakshatra.index + 1} {nextNakshatra.name} ({nextNakshatra.nameHi})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </article>
    </main>
  );
}

