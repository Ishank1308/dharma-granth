import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { UNIQUE_TITHI_ARCHETYPES, getUniqueTithiBySlug } from '@/lib/panchang';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { clipDescription } from '@/lib/meta-text';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Moon, Sun, ArrowLeft, ArrowRight, BookOpen, Sparkles, Calendar, Layers, ShieldCheck, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return UNIQUE_TITHI_ARCHETYPES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const tithi = getUniqueTithiBySlug(resolved.slug);
  if (!tithi) return { title: 'Tithi Not Found' };

  const title = `${tithi.name} Tithi (${tithi.nameHi}) — Meaning, Deity, Rules & Significance`;
  const description = clipDescription(
    `${tithi.name} (${tithi.nameHi}) is the ${tithi.number}th lunar day archetype of Vedic astronomy. Presiding deity: ${tithi.deity}. Category: ${tithi.categoryType} (${tithi.categoryTypeHi}). ${tithi.explanation} ${tithi.spiritualFocus}`
  );
  const canonical = `/panchang/tithis/${resolved.slug}/`;
  const ogImageUrl = `/og/tithi/${resolved.slug}.png`;

  return {
    title,
    description,
    keywords: [
      `${tithi.name} tithi meaning in hindi`,
      `${tithi.name} tithi rules`,
      `${tithi.nameHi} तिथि`,
      `${tithi.name} tithi deity`,
      `shukla ${tithi.name}`,
      `krishna ${tithi.name}`,
      'pancha tithi',
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
          alt: `${tithi.name} (${tithi.nameHi}) — Vedic Tithi, Pancha Tithi Class & Vrata`,
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

export default async function TithiDetailPage({ params }: PageProps) {
  const resolved = await params;
  const tithi = getUniqueTithiBySlug(resolved.slug);
  if (!tithi) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/panchang/tithis/${resolved.slug}/`;

  const total = UNIQUE_TITHI_ARCHETYPES.length;
  const currentIndex = UNIQUE_TITHI_ARCHETYPES.findIndex((t) => t.slug === tithi.slug);
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;
  const prevTithi = UNIQUE_TITHI_ARCHETYPES[prevIndex];
  const nextTithi = UNIQUE_TITHI_ARCHETYPES[nextIndex];

  const faqs = [
    {
      q: `What is the significance of ${tithi.name} (${tithi.nameHi}) in the Vedic calendar?`,
      a: `${tithi.explanation} It spans ${tithi.lunarDegrees} of angular separation between the Sun and Moon.`,
    },
    {
      q: `Which deity governs ${tithi.name} Tithi?`,
      a: `${tithi.name} is governed by ${tithi.deity}. Worship and meditation directed to this divinity on this day aligns the mind with cosmic harmony.`,
    },
    {
      q: `What is the Pancha Tithi class of ${tithi.name}?`,
      a: `${tithi.name} belongs to the ${tithi.categoryType} (${tithi.categoryTypeHi}) category: ${tithi.categoryMeaning}`,
    },
    {
      q: `What spiritual discipline (svadhyaya) is recommended on ${tithi.name}?`,
      a: `${tithi.spiritualFocus}`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: `${tithi.name} Tithi (${tithi.nameHi}) — Meaning, Deity & Significance`,
        description: clipDescription(tithi.explanation),
        abstract: tithi.explanation,
        text: `${tithi.name} (${tithi.nameHi}, ${tithi.transliteration}). Presiding deity: ${tithi.deity}. Category: ${tithi.categoryType}. Arc: ${tithi.lunarDegrees}. Spiritual focus: ${tithi.spiritualFocus}. Famous observances: ${tithi.famousObservances.join(', ')}.`,
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
          { '@type': 'ListItem', position: 3, name: '16 Vedic Tithis', item: `${siteUrl}/panchang/tithis/` },
          { '@type': 'ListItem', position: 4, name: tithi.name, item: pageUrl },
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
          { label: '16 Vedic Tithis', href: '/panchang/tithis/' },
          { label: tithi.name },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header Hero */}
        <header className="text-center pb-8 border-b border-dharma-border">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
              <Moon className="w-3.5 h-3.5" />
              <span>Tithi Archetype #{tithi.number} of 16</span>
            </span>
            <span className="text-xs text-dharma-muted font-medium border border-dharma-border rounded-full px-3 py-1">
              Class: {tithi.categoryType} ({tithi.categoryTypeHi})
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-dharma-text">
            {tithi.name}
          </h1>
          <p lang="sa" className="font-devanagari text-2xl sm:text-3xl text-saffron-800 dark:text-saffron-300 font-semibold mt-2">
            {tithi.nameHi} <span className="font-serif text-lg sm:text-xl font-normal text-dharma-muted">({tithi.transliteration})</span>
          </p>
        </header>

        {/* Key Astronomical & Scriptural Attributes */}
        <section aria-labelledby="attributes-heading" className="my-8">
          <h2 id="attributes-heading" className="sr-only">Tithi Coordinates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                अधिष्ठाता देवता (Governing Deity)
              </span>
              <p className="font-serif text-base font-bold text-saffron-900 dark:text-saffron-200">
                {tithi.deity}
              </p>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                पंच-तिथि वर्ग (Pancha Tithi Group)
              </span>
              <p className="font-serif text-base font-bold text-saffron-900 dark:text-saffron-200">
                {tithi.categoryType} ({tithi.categoryTypeHi})
              </p>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                कोणीय विस्तार (Lunar Arc)
              </span>
              <p className="font-serif text-base font-bold text-saffron-900 dark:text-saffron-200">
                {tithi.lunarDegrees}
              </p>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                पक्ष स्वरूप (Fortnight Manifestations)
              </span>
              <p className="font-serif text-xs font-bold text-saffron-900 dark:text-saffron-200 leading-snug">
                {tithi.shuklaNumber ? `Shukla #${tithi.shuklaNumber}` : ''}
                {tithi.shuklaNumber && tithi.krishnaNumber ? ' · ' : ''}
                {tithi.krishnaNumber ? `Krishna #${tithi.krishnaNumber}` : ''}
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Explanation & Psychological Impact */}
        <section aria-labelledby="explanation-heading" className="my-8 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 id="explanation-heading" className="font-serif text-xl sm:text-2xl font-bold">
              शास्त्रीय स्वरूप एवं साधना (Nature & Contemplation)
            </h2>
          </div>

          <div className="space-y-4 leading-relaxed text-sm sm:text-base text-dharma-text">
            <p>
              {tithi.explanation}
            </p>
            <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300/40 dark:border-amber-800/40 p-5 sm:p-6">
              <span className="font-devanagari text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 block mb-1.5">
                स्वाध्याय एवं साधना संकेत (Spiritual Focus)
              </span>
              <p className="font-serif text-sm sm:text-base italic text-amber-950 dark:text-amber-100">
                &ldquo;{tithi.spiritualFocus}&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Famous Observances and Vratas */}
        {tithi.famousObservances.length > 0 && (
          <section aria-labelledby="observances-heading" className="my-8 rounded-2xl border border-dharma-border bg-dharma-card p-6">
            <h3 id="observances-heading" className="font-serif text-lg font-bold text-dharma-text mb-3">
              Key Vratas & Festivals Celebrated on {tithi.name}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-dharma-text">
              {tithi.famousObservances.map((obs, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-dharma-bg border border-dharma-border/60">
                  <span className="text-saffron-600 font-bold">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>

            {tithi.dedicatedHubUrl && (
              <div className="mt-4 pt-3 border-t border-dharma-border/50">
                <Link
                  href={tithi.dedicatedHubUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 dark:text-saffron-300 hover:underline"
                >
                  <span>Explore dedicated {tithi.name} landing hub & calendar dates</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Daily Panchang Connection Box */}
        <section className="my-8 rounded-2xl border border-dharma-border bg-gradient-to-r from-saffron-500/10 via-amber-500/5 to-transparent p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-dharma-text">
              Check Today&apos;s Active Tithi & Transition Timing
            </h3>
            <p className="text-xs sm:text-sm text-dharma-muted mt-1">
              View accurate solar sunrise and lunar tithi boundary calculations for your location.
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

        {/* Prev / Next navigation across all 16 Tithis */}
        <nav aria-label="Tithis cycle navigation" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-dharma-border pt-6">
          <Link
            href={`/panchang/tithis/${prevTithi.slug}/`}
            className="inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-xs sm:text-sm font-semibold hover:border-saffron-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>#{prevTithi.number} {prevTithi.name} ({prevTithi.nameHi})</span>
          </Link>

          <Link
            href="/panchang/tithis/"
            className="text-xs sm:text-sm font-bold text-saffron-800 dark:text-saffron-300 underline underline-offset-2"
          >
            All 16 Tithis (सम्पूर्ण तिथि कोश)
          </Link>

          <Link
            href={`/panchang/tithis/${nextTithi.slug}/`}
            className="inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-xs sm:text-sm font-semibold hover:border-saffron-400 transition"
          >
            <span>#{nextTithi.number} {nextTithi.name} ({nextTithi.nameHi})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </article>
    </main>
  );
}

