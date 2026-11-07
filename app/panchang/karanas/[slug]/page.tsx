import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllKaranas, getKaranaBySlug } from '@/lib/panchang';
import { clipDescription } from '@/lib/meta-text';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Sparkles, Moon, Sun, ArrowLeft, ArrowRight, BookOpen, Layers, ShieldCheck, Compass, HelpCircle, AlertCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllKaranas().map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const karana = getKaranaBySlug(resolved.slug);
  if (!karana) return { title: 'Karana Not Found' };

  const title = `${karana.name} Karana (${karana.nameHi}) — Nature, Deity & Rules`;
  const description = clipDescription(
    `${karana.name} (${karana.nameHi}) is one of the 11 Vedic Karanas (half-tithi) of the Hindu calendar. Classification: ${karana.nature}. Presiding deity: ${karana.deity}. ${karana.explanation} ${karana.spiritualFocus}`
  );
  const canonical = `/panchang/karanas/${resolved.slug}/`;
  const ogImageUrl = `/og/karana/${resolved.slug}.png`;

  return {
    title,
    description,
    keywords: [
      `${karana.name} karana meaning in hindi`,
      `${karana.name} karana rules`,
      `${karana.name} karana in astrology`,
      `${karana.nameHi} करण`,
      `${karana.nameHi} करण के फल`,
      '11 karanas',
      'half tithi vedic calendar',
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
          alt: `${karana.name} Karana (${karana.nameHi}) — Vedic Half-Tithi Classification`,
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

export default async function KaranaDetailPage({ params }: PageProps) {
  const resolved = await params;
  const karana = getKaranaBySlug(resolved.slug);
  if (!karana) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/panchang/karanas/${resolved.slug}/`;

  const allKaranas = getAllKaranas();
  const total = allKaranas.length;
  const currentIndex = allKaranas.findIndex((k) => k.slug === karana.slug);
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;
  const prevKarana = allKaranas[prevIndex];
  const nextKarana = allKaranas[nextIndex];

  const isBhadra = karana.slug === 'vishti';
  const isChara = karana.nature.startsWith('Chara');

  const faqs = [
    {
      q: `What is the significance of ${karana.name} (${karana.nameHi}) in the Vedic calendar?`,
      a: `${karana.explanation} It spans exactly 6 degrees of angular elongation between the Sun and the Moon.`,
    },
    {
      q: `Who is the governing deity of ${karana.name} Karana?`,
      a: `${karana.name} Karana is presided over by ${karana.deity} (${karana.deityHi}).`,
    },
    {
      q: `What is the occurrence pattern of ${karana.name} Karana?`,
      a: `${karana.occurrence} It is classified as a ${karana.nature} (${karana.natureHi}) Karana.`,
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
        headline: `${karana.name} Karana (${karana.nameHi}) — Nature, Deity, Rules & Svadhyaya`,
        description: karana.explanation,
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
            name: '11 Karanas',
            item: `${siteUrl}/panchang/karanas/`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: karana.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };

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
            { label: '11 Karanas', href: '/panchang/karanas/' },
            { label: karana.name },
          ]}
        />

        {/* Header Hero */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-surface border border-dharma-border/80 text-dharma-muted">
              {karana.nature}
            </span>
            <span
              className={`text-xs font-sans px-2.5 py-0.5 rounded-full font-medium ${
                isBhadra
                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                  : isChara
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                  : 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border border-indigo-500/20'
              }`}
            >
              {karana.natureHi}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-dharma-text mb-2">
            {karana.name} Karana{' '}
            <span className="text-2xl sm:text-4xl font-normal text-dharma-muted">
              ({karana.nameHi})
            </span>
          </h1>
          <p className="font-sans text-sm text-dharma-muted tracking-wide">
            IAST: <span className="font-medium italic">{karana.transliteration}</span> · Presiding Deity:{' '}
            <span className="font-medium text-dharma-text">{karana.deity}</span> ({karana.deityHi})
          </p>
        </header>

        {/* Special Bhadra Advisory if Vishti */}
        {isBhadra && (
          <div className="mt-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-dharma-text">
                  Bhadra Observance &amp; Scriptural Caution (भद्रा नियम)
                </h2>
                <p className="text-xs sm:text-sm text-dharma-muted font-sans mt-1.5 leading-relaxed">
                  In the <em>Muhurta Chintamani</em> and <em>Brihat Samhita</em>, Vishti Karana (Bhadra) is governed
                  by the fiery energy of Yama and Chhaya. Commercial undertakings, travel, weddings, and housewarmings (griha pravesha)
                  are paused. However, spiritual japa, health remedies, fasting, and contemplation of Lord Shiva or Hanuman are highly praised.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Data Cards */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-sm">
          <div className="p-4 rounded-xl bg-surface border border-dharma-border">
            <span className="text-xs text-dharma-muted uppercase tracking-wider block mb-1">
              Angular Solar-Lunar Span
            </span>
            <span className="font-mono font-bold text-dharma-text text-base">
              6°00&apos; (Half-Tithi)
            </span>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-dharma-border">
            <span className="text-xs text-dharma-muted uppercase tracking-wider block mb-1">
              Governing Deity
            </span>
            <span className="font-semibold text-dharma-text text-base">
              {karana.deity}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-dharma-border">
            <span className="text-xs text-dharma-muted uppercase tracking-wider block mb-1">
              Occurrence Cycle
            </span>
            <span className="font-semibold text-dharma-text text-xs leading-snug">
              {karana.occurrence}
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
              {karana.explanation}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-dharma-bg border border-dharma-border/60">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-sans font-semibold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Svadhyaya Contemplation &amp; Action Guideline</span>
            </div>
            <p className="text-sm text-dharma-muted font-sans leading-relaxed">
              {karana.spiritualFocus}
            </p>
          </div>

          <div className="pt-4 border-t border-dharma-border/50 text-xs font-sans text-dharma-muted flex items-center justify-between">
            <span>60 Karanas in a 30-day lunar month (56 Chara + 4 Sthira)</span>
            <Link
              href="/panchang/"
              className="text-amber-700 dark:text-amber-400 hover:underline font-semibold"
            >
              View Today&apos;s Live Karana →
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
          aria-label="Karana navigation"
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm"
        >
          <Link
            href={`/panchang/karanas/${prevKarana.slug}/`}
            className="group p-4 rounded-xl bg-surface border border-dharma-border hover:border-amber-500/40 transition-colors flex items-center gap-3"
          >
            <ArrowLeft className="w-4 h-4 text-dharma-muted group-hover:-translate-x-1 transition-transform" />
            <div>
              <span className="text-xs text-dharma-muted block">Previous Karana</span>
              <span className="font-semibold text-dharma-text">{prevKarana.name} ({prevKarana.nameHi})</span>
            </div>
          </Link>

          <Link
            href={`/panchang/karanas/${nextKarana.slug}/`}
            className="group p-4 rounded-xl bg-surface border border-dharma-border hover:border-amber-500/40 transition-colors flex items-center justify-between text-right"
          >
            <div>
              <span className="text-xs text-dharma-muted block">Next Karana</span>
              <span className="font-semibold text-dharma-text">{nextKarana.name} ({nextKarana.nameHi})</span>
            </div>
            <ArrowRight className="w-4 h-4 text-dharma-muted group-hover:translate-x-1 transition-transform" />
          </Link>
        </nav>
      </div>
    </main>
  );
}
