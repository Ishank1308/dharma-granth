import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SACRED_MANTRAS, getMantraBySlug } from '@/data/mantras';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { clipDescription } from '@/lib/meta-text';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Copy, MessageCircle, ArrowLeft, ArrowRight, BookOpen, Sparkles, Check, ExternalLink } from 'lucide-react';
import { MantraDetailClient } from './MantraDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SACRED_MANTRAS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const mantra = getMantraBySlug(resolved.slug);
  if (!mantra) return { title: 'Mantra Not Found' };

  const title = `${mantra.title} (${mantra.titleHi}) — Meaning & Lyrics`;
  const description = clipDescription(`${mantra.sanskrit} — ${mantra.hindiMeaning} ${mantra.englishMeaning}`);
  const canonical = `/mantras/${mantra.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${mantra.title} meaning in hindi`,
      `${mantra.title} lyrics and meaning`,
      `${mantra.titleHi} अर्थ`,
      `${mantra.title} in english`,
      mantra.sourceCoordinates,
      'vedic mantra',
      'shanti mantra',
      'dharma granth',
    ],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title: `${title} — Dharma Granth`,
      description,
      url: `https://dharmagranth.dev/mantras/${mantra.slug}/`,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function MantraDetailPage({ params }: PageProps) {
  const resolved = await params;
  const mantra = getMantraBySlug(resolved.slug);
  if (!mantra) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/mantras/${mantra.slug}/`;

  const currentIndex = SACRED_MANTRAS.findIndex((m) => m.slug === mantra.slug);
  const prevMantra = currentIndex > 0 ? SACRED_MANTRAS[currentIndex - 1] : undefined;
  const nextMantra = currentIndex < SACRED_MANTRAS.length - 1 ? SACRED_MANTRAS[currentIndex + 1] : undefined;

  const faqItems = [
    {
      '@type': 'Question',
      name: `${mantra.title} (${mantra.titleHi}) का हिन्दी अर्थ क्या है?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: mantra.hindiMeaning,
      },
    },
    {
      '@type': 'Question',
      name: `What is the English translation and meaning of the ${mantra.title}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: mantra.englishMeaning,
      },
    },
    {
      '@type': 'Question',
      name: `What is the scriptural source and coordinates of ${mantra.title}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${mantra.sourceCoordinates}. Rishi: ${mantra.rishi || 'Classical Vedic Tradition'}, Devata: ${mantra.devata || 'Parabrahman'}, Chhandas: ${mantra.chhandas || 'Vedic Metre'}.`,
      },
    },
    ...mantra.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: `${mantra.title} (${mantra.titleHi}) — Lyrics, Meaning in Hindi & English`,
        description: clipDescription(`${mantra.sanskrit} — ${mantra.hindiMeaning}`),
        abstract: mantra.hindiMeaning,
        text: [mantra.sanskrit, mantra.transliteration, mantra.hindiMeaning, mantra.englishMeaning].join('\n\n'),
        inLanguage: ['sa', 'hi', 'en'],
        isAccessibleForFree: true,
        genre: 'Sacred Vedic Mantras & Chants',
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
        mainEntity: faqItems,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Library', item: `${siteUrl}/scriptures/` },
          { '@type': 'ListItem', position: 3, name: 'Sacred Mantras', item: `${siteUrl}/mantras/` },
          { '@type': 'ListItem', position: 4, name: mantra.title, item: pageUrl },
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
          { label: 'Library', href: '/scriptures/' },
          { label: 'Mantras & Suktas', href: '/mantras/' },
          { label: mantra.title },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <header className="text-center pb-8 border-b border-dharma-border">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
              {mantra.categoryLabelHi} · {mantra.categoryLabel}
            </span>
            <span className="text-xs text-dharma-muted font-medium border border-dharma-border rounded-full px-3 py-1">
              {mantra.sourceCoordinates}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-dharma-text">
            {mantra.title}
          </h1>
          <p lang="sa" className="font-devanagari text-2xl sm:text-3xl text-saffron-800 dark:text-saffron-300 font-semibold mt-2">
            {mantra.titleHi}
          </p>

          <dl className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-dharma-muted">
            {mantra.rishi && <div><dt className="inline font-medium">ऋषि: </dt><dd className="inline text-dharma-text">{mantra.rishi}</dd></div>}
            {mantra.devata && <div><dt className="inline font-medium">देवता: </dt><dd className="inline text-dharma-text">{mantra.devata}</dd></div>}
            {mantra.chhandas && <div><dt className="inline font-medium">छन्द: </dt><dd className="inline text-dharma-text">{mantra.chhandas}</dd></div>}
          </dl>
        </header>

        {/* Shloka Card with Interactive Toolbar */}
        <MantraDetailClient mantra={mantra} pageUrl={pageUrl} />

        {/* Padaccheda & Word-by-word meaning table */}
        <section aria-labelledby="word-meanings-heading" className="my-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-saffron-600" />
            <h2 id="word-meanings-heading" className="font-serif text-xl sm:text-2xl font-bold">
              पदच्छेद, अन्वय एवं शब्दार्थ (Word-by-Word Meaning)
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-dharma-border shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-dharma-border bg-dharma-card/80 text-xs font-bold uppercase tracking-wider text-dharma-muted">
                <tr>
                  <th scope="col" className="p-3.5 sm:px-4">पद (Sanskrit)</th>
                  <th scope="col" className="p-3.5 sm:px-4">IAST</th>
                  <th scope="col" className="p-3.5 sm:px-4">हिन्दी अर्थ</th>
                  <th scope="col" className="p-3.5 sm:px-4">English Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dharma-border/60 bg-dharma-card">
                {mantra.wordMeanings.map((w, idx) => (
                  <tr key={idx} className="hover:bg-dharma-bg/50 transition-colors">
                    <td lang="sa" className="p-3.5 sm:px-4 font-devanagari font-bold text-saffron-900 dark:text-saffron-200">
                      {w.sanskrit}
                    </td>
                    <td className="p-3.5 sm:px-4 font-serif text-xs italic text-dharma-muted">
                      {w.iast}
                    </td>
                    <td lang="hi" className="p-3.5 sm:px-4 font-devanagari text-dharma-text">
                      {w.hindi}
                    </td>
                    <td className="p-3.5 sm:px-4 font-serif text-xs text-dharma-muted">
                      {w.english}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Spiritual Significance & Contemplation */}
        <section aria-labelledby="significance-heading" className="my-10 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 id="significance-heading" className="font-serif text-xl sm:text-2xl font-bold">
              दार्शनिक रहस्य एवं साधना-महत्त्व (Spiritual Significance)
            </h2>
          </div>
          <p lang="hi" className="font-devanagari text-sm sm:text-base leading-relaxed text-dharma-text">
            {mantra.significanceHi}
          </p>
          <p className="font-serif text-xs sm:text-sm italic leading-relaxed text-dharma-muted border-t border-dharma-border/60 pt-3">
            {mantra.significance}
          </p>

          {mantra.sourceHref && (
            <div className="pt-2">
              <Link
                href={mantra.sourceHref}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-800 dark:text-saffron-300 underline underline-offset-2"
              >
                <span>Read in full scripture recension on Dharma Granth</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </section>

        {/* FAQs */}
        {mantra.faqs.length > 0 && (
          <section aria-labelledby="faq-heading" className="my-10 space-y-4">
            <h2 id="faq-heading" className="font-serif text-xl sm:text-2xl font-bold">
              Frequently Asked Questions (जिज्ञासा समाधान)
            </h2>
            <div className="space-y-3">
              {mantra.faqs.map((f, idx) => (
                <details key={idx} className="group rounded-2xl border border-dharma-border bg-dharma-card p-4 transition-all">
                  <summary className="font-serif text-base font-bold text-dharma-text cursor-pointer list-none flex items-center justify-between">
                    <span>{f.question}</span>
                    <span className="text-saffron-600 text-lg transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-dharma-muted border-t border-dharma-border/50 pt-3">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Prev / Next navigation */}
        <nav aria-label="Mantra navigation" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-dharma-border pt-6">
          {prevMantra ? (
            <Link
              href={`/mantras/${prevMantra.slug}/`}
              className="inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-xs sm:text-sm font-semibold hover:border-saffron-400 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{prevMantra.title} ({prevMantra.titleHi})</span>
            </Link>
          ) : <span />}

          <Link
            href="/mantras/"
            className="text-xs sm:text-sm font-bold text-saffron-800 dark:text-saffron-300 underline underline-offset-2"
          >
            All Mantras (सम्पूर्ण मन्त्र संग्रह)
          </Link>

          {nextMantra ? (
            <Link
              href={`/mantras/${nextMantra.slug}/`}
              className="inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-xs sm:text-sm font-semibold hover:border-saffron-400 transition"
            >
              <span>{nextMantra.title} ({nextMantra.titleHi})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <span />}
        </nav>
      </article>
    </main>
  );
}

