import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { YOGA_DATA, getYogaBySlug } from '@/lib/panchang';
import { clipDescription } from '@/lib/meta-text';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Sparkles, Sun, Moon, ArrowLeft, ArrowRight, BookOpen, Layers, ShieldCheck, Compass, HelpCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return YOGA_DATA.map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const yoga = getYogaBySlug(resolved.slug);
  if (!yoga) return { title: 'Yoga Not Found' };

  const title = `${yoga.name} Yoga (${yoga.nameHi}) — Meaning, Deity & Svadhyaya`;
  const description = clipDescription(
    `${yoga.name} (${yoga.nameHi}) is the ${yoga.index + 1}th Nitya Yoga of Vedic astronomy spanning ${yoga.arc}. Presiding deity: ${yoga.deity}. Nature: ${yoga.nature}. ${yoga.explanation} ${yoga.spiritualFocus}`
  );
  const canonical = `/panchang/yogas/${resolved.slug}/`;
  const ogImageUrl = `/og/yoga/${resolved.slug}.png`;

  return {
    title,
    description,
    keywords: [
      `${yoga.name} yoga meaning in hindi`,
      `${yoga.name} yoga deity`,
      `${yoga.name} yoga in astrology`,
      `${yoga.nameHi} योग`,
      `${yoga.nameHi} योग के फल`,
      '27 nitya yogas',
      'surya siddhanta yoga',
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
          alt: `${yoga.name} Yoga (${yoga.nameHi}) — Vedic Nitya Yoga & Svadhyaya`,
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

export default async function YogaDetailPage({ params }: PageProps) {
  const resolved = await params;
  const yoga = getYogaBySlug(resolved.slug);
  if (!yoga) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/panchang/yogas/${resolved.slug}/`;

  const total = YOGA_DATA.length;
  const currentIndex = YOGA_DATA.findIndex((y) => y.slug === yoga.slug);
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;
  const prevYoga = YOGA_DATA[prevIndex];
  const nextYoga = YOGA_DATA[nextIndex];

  const faqs = [
    {
      q: `What is the spiritual meaning of ${yoga.name} Yoga (${yoga.nameHi})?`,
      a: `${yoga.explanation} It spans the additive solar-lunar arc of ${yoga.arc} and is governed by ${yoga.deity}.`,
    },
    {
      q: `What activities are best suited during ${yoga.name} Yoga?`,
      a: `${yoga.spiritualFocus} In the Surya-Siddhanta tradition, it is categorized as ${yoga.nature} (${yoga.natureHi}).`,
    },
    {
      q: `How is ${yoga.name} Yoga calculated in the Panchanga?`,
      a: `In Vedic astronomy, when the combined longitude of the Sun and Moon (Sun longitude + Moon longitude) falls within ${yoga.arc}, ${yoga.name} Yoga is active.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Dharma Granth',
          url: `${siteUrl}/`,
        },
        headline: `${yoga.name} Yoga (${yoga.nameHi}) — Meaning, Deity, Nature & Svadhyaya`,
        description: yoga.explanation,
        mainEntityOfPage: pageUrl,
        inLanguage: ['hi', 'sa', 'en'],
        author: {
          '@type': 'Organization',
          name: 'Dharma Granth Curatorial Council',
          url: `${siteUrl}/editorial/`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Dharma Granth',
          url: `${siteUrl}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/og-default.png`,
          },
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
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Panchang',
            item: `${siteUrl}/panchang/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '27 Yogas',
            item: `${siteUrl}/panchang/yogas/`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: yoga.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  const isAuspicious = yoga.nature === 'Auspicious';

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text font-serif">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-gutter pt-8 pb-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: '27 Yogas', href: '/panchang/yogas/' },
            { label: yoga.name },
          ]}
        />

        {/* Header Hero */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-surface border border-dharma-border/80 text-dharma-muted">
              Yoga #{yoga.index + 1} of 27
            </span>
            <span
              className={`text-xs font-sans px-2.5 py-0.5 rounded-full font-medium ${
                isAuspicious
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
              }`}
            >
              {yoga.nature} ({yoga.natureHi})
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-dharma-text mb-2">
            {yoga.name} Yoga{' '}
            <span className="text-2xl sm:text-4xl font-normal text-dharma-muted">
              ({yoga.nameHi})
            </span>
          </h1>
          <p className="font-sans text-sm text-dharma-muted tracking-wide">
            IAST: <span className="font-medium italic">{yoga.transliteration}</span> · Presiding Deity:{' '}
            <span className="font-medium text-dharma-text">{yoga.deity}</span> ({yoga.deityHi})
          </p>
        </header>

        {/* Quick Astronomical Data Cards */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-sm">
          <div className="p-4 rounded-xl bg-surface border border-dharma-border">
            <span className="text-xs text-dharma-muted uppercase tracking-wider block mb-1">
              Combined Solar-Lunar Arc
            </span>
            <span className="font-mono font-bold text-dharma-text text-base">
              {yoga.arc}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-dharma-border">
            <span className="text-xs text-dharma-muted uppercase tracking-wider block mb-1">
              Governing Deity
            </span>
            <span className="font-semibold text-dharma-text text-base">
              {yoga.deity}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-dharma-border">
            <span className="text-xs text-dharma-muted uppercase tracking-wider block mb-1">
              Panchanga Classification
            </span>
            <span className="font-semibold text-dharma-text text-base">
              {yoga.nature}
            </span>
          </div>
        </section>

        {/* Main Meaning & Classical Insight */}
        <section className="mt-10 p-6 sm:p-8 rounded-2xl bg-surface border border-dharma-border space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-dharma-text mb-3">
              Astronomical Nature &amp; Classical Meaning
            </h2>
            <p className="text-base text-dharma-text/90 leading-relaxed font-sans">
              {yoga.explanation}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-dharma-bg border border-dharma-border/60">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-sans font-semibold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Svadhyaya Contemplation &amp; Action Guideline</span>
            </div>
            <p className="text-sm text-dharma-muted font-sans leading-relaxed">
              {yoga.spiritualFocus}
            </p>
          </div>

          <div className="pt-4 border-t border-dharma-border/50 text-xs font-sans text-dharma-muted flex items-center justify-between">
            <span>Formula: ⌊ (Sun Longitude + Moon Longitude) ÷ 13°20&apos; ⌋</span>
            <Link
              href="/panchang/"
              className="text-amber-700 dark:text-amber-400 hover:underline font-semibold"
            >
              View Today&apos;s Live Yoga →
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-12 border-t border-dharma-border pt-10">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-2xl font-bold text-dharma-text">
              Frequently Asked Questions (प्रश्न व उत्तर)
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-surface border border-dharma-border"
              >
                <h3 className="text-base font-bold text-dharma-text mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-dharma-muted font-sans leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cyclic Prev / Next Navigation */}
        <nav
          aria-label="Yoga navigation"
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm"
        >
          <Link
            href={`/panchang/yogas/${prevYoga.slug}/`}
            className="group p-4 rounded-xl bg-surface border border-dharma-border hover:border-amber-500/40 transition-colors flex items-center gap-3"
          >
            <ArrowLeft className="w-4 h-4 text-dharma-muted group-hover:-translate-x-1 transition-transform" />
            <div>
              <span className="text-xs text-dharma-muted block">Previous Yoga #{prevYoga.index + 1}</span>
              <span className="font-semibold text-dharma-text">{prevYoga.name} ({prevYoga.nameHi})</span>
            </div>
          </Link>

          <Link
            href={`/panchang/yogas/${nextYoga.slug}/`}
            className="group p-4 rounded-xl bg-surface border border-dharma-border hover:border-amber-500/40 transition-colors flex items-center justify-between text-right"
          >
            <div>
              <span className="text-xs text-dharma-muted block">Next Yoga #{nextYoga.index + 1}</span>
              <span className="font-semibold text-dharma-text">{nextYoga.name} ({nextYoga.nameHi})</span>
            </div>
            <ArrowRight className="w-4 h-4 text-dharma-muted group-hover:translate-x-1 transition-transform" />
          </Link>
        </nav>
      </div>
    </main>
  );
}
