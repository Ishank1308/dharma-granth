import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookLearningClient } from '@/app/components/BookLearningClient';
import { ChapterHero } from '@/app/components/motion/ChapterHero';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { getBookExplanation } from '@/data/book-explanations';
import { getScripture, getScriptureMeta, getAllScriptures } from '@/data/scriptures';
import { ArrowLeft } from 'lucide-react';
import { SourcesAndInterpretation } from '@/app/components/SourcesAndInterpretation';

import { ChapterPreview, readSeededChapterPreviews } from '@/lib/read-seeded-chapters';
import { getLibraryFacts } from '@/lib/library-server';
import { formatCount } from '@/lib/holdings-label';

const CATEGORY_NAMES: Record<string, string> = {
  itihasa: 'Itihāsa · इतिहास',
  upanishad: 'Upaniṣad · उपनिषद्',
  veda: 'Veda · वेद',
  purana: 'Purāṇa · पुराण',
  smriti: 'Smṛti · स्मृति',
  tantra: 'Tantra · तन्त्र',
  stotra: 'Stotra · स्तोत्र',
  other: 'Other · अन्य',
};

function formatCategory(cat: string): string {
  return CATEGORY_NAMES[cat] || cat;
}

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  const params = getAllScriptures().map(s => ({ id: s.id }));
  params.push({ id: 'yogavasistha' });
  return params;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const meta = getScriptureMeta(params.id);
  if (!meta) return {};

  // Hindi first, as people search ("भगवद गीता हिंदी अर्थ"); English name kept.
  const title = `${meta.titleSanskrit} (${meta.title}) — हिंदी अर्थ सहित श्लोक | Hindi & English Meaning`;
  const held = readSeededChapterPreviews(params.id).filter((chapter) => chapter.verseCount > 0);
  const heldVerses = held.reduce((sum, chapter) => sum + chapter.verseCount, 0);
  const counts =
    held.length > 0 && heldVerses > 0
      ? `${held.length} अध्याय, ${heldVerses.toLocaleString('en-IN')} श्लोक पुस्तकालय में — `
      : '';
  const lead = meta.hasData
    ? `${meta.titleSanskrit} (${meta.title}): ${counts}संस्कृत मूल, हिंदी अर्थ और English translation, श्लोक-दर-श्लोक।`
    : `${meta.titleSanskrit} (${meta.title}) — हमारे बढ़ते ग्रंथालय में।`;
  const room = 158 - lead.length - 1;
  const description =
    room > 30
      ? `${lead} ${meta.description.length > room ? `${meta.description.slice(0, room - 1).trimEnd()}…` : meta.description}`
      : lead;

  const ogImage = {
    url: `/og/${meta.id}.png`,
    width: 1200,
    height: 630,
    alt: `${meta.title} — Dharma Granth`,
  };

  return {
    title,
    description,
    keywords: [
      `${meta.title} verses`,
      `${meta.title} meaning in english`,
      `${meta.title} meaning in hindi`,
      `${meta.title} with translation`,
      `${meta.titleSanskrit} हिंदी अर्थ`,
    ],
    alternates: { canonical: `/scripture/${meta.id}/` },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title,
      description,
      url: `/scripture/${meta.id}/`,
      tags: meta.tags,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default function ScripturePage({ params }: PageProps) {
  const meta = getScriptureMeta(params.id);
  if (!meta) return notFound();

  const scripture = getScripture(params.id);
  const chapters = scripture?.chapters ?? [];
  const explanation = getBookExplanation(params.id);
  const chapterPreviewsById = new Map<number, ChapterPreview>();
  for (const chapter of chapters) {
    chapterPreviewsById.set(chapter.id, {
    id: chapter.id,
    title: chapter.title,
    titleSanskrit: chapter.titleSanskrit,
    summary: chapter.summary,
    verseCount: chapter.verses.length,
    });
  }
  for (const seededChapter of readSeededChapterPreviews(params.id)) {
    const existing = chapterPreviewsById.get(seededChapter.id);
    chapterPreviewsById.set(seededChapter.id, {
      ...seededChapter,
      ...existing,
      summary: existing?.summary?.trim() || seededChapter.summary,
      verseCount: seededChapter.verseCount,
    });
  }
  const chapterPreviews = Array.from(chapterPreviewsById.values()).sort(
    (a, b) => a.id - b.id,
  );
  const publishedChapters = chapterPreviews.filter((chapter) => chapter.verseCount > 0);
  const publishedVerses = publishedChapters.reduce((sum, chapter) => sum + chapter.verseCount, 0);
  const catalogueVerses = meta.canonicalTotalVerses ?? meta.totalVerses;
  const catalogueChapters = meta.totalChapters;
  const partial = publishedVerses > 0 && catalogueVerses > publishedVerses;
  const languageFacts = getLibraryFacts(meta.id).languages;
  const inLanguage = [
    languageFacts.sa ? 'sa' : null,
    languageFacts.hi ? 'hi' : null,
    languageFacts.en ? 'en' : null,
  ].filter((code): code is 'sa' | 'hi' | 'en' => code !== null);

  // JSON-LD structured data: emit a Book entity for any catalog entry, with workExample
  // pointing to a Chapter entity for chapters that actually have verse data.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';
  const workExample =
    meta.hasData && chapterPreviews.length > 0
      ? chapterPreviews
          .filter(ch => ch.verseCount > 0)
          .map(ch => ({
            '@type': 'Chapter' as const,
            name: ch.title,
            alternateName: ch.titleSanskrit,
            position: ch.id,
            url: `${siteUrl}/scripture/${meta.id}/chapter/${ch.id}`,
          }))
      : undefined;
  const bookJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${siteUrl}/scripture/${meta.id}`,
    name: meta.title,
    alternateName: meta.titleSanskrit,
    description: meta.description,
    genre: meta.category,
    keywords: meta.tags.join(', '),
    publisher: { '@type': 'Organization', name: 'Dharma Granth' },
    isAccessibleForFree: true,
  };
  if (inLanguage.length > 0) bookJsonLd.inLanguage = inLanguage;
  if (meta.author) {
    bookJsonLd.author = { '@type': 'Person', name: meta.author };
  }
  if (workExample && workExample.length > 0) {
    bookJsonLd.workExample = workExample;
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Scriptures', item: `${siteUrl}/scriptures` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: `${siteUrl}/scripture/${meta.id}` },
    ],
  };

  return (
    <main className="min-h-screen bg-dharma-bg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ChapterHero className="bg-gradient-to-b from-saffron-800 to-saffron-600 text-white py-14">
        <div className="relative max-w-5xl mx-auto px-6">
          <FadeUp>
            <Link href="/scriptures" className="inline-flex min-h-[44px] items-center gap-2 text-white/70 hover:text-white text-sm mb-2 transition">
              <ArrowLeft className="w-4 h-4" />
              All Scriptures
            </Link>
          </FadeUp>
          <FadeUp delay={0.05} className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 uppercase tracking-wide">
              {formatCategory(meta.category)}
            </span>
            {meta.isCurated || partial ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/25 text-amber-100 border border-amber-400/30">
                {meta.isCurated
                  ? 'सार संकलन · Curated selection'
                  : `${publishedChapters.length} Chapters Indexed · ~${formatCount(catalogueVerses)} Canonical Verses`}
              </span>
            ) : publishedVerses > 0 ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/25">
                पुस्तकालय में पाठ · Text in the library
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/25">
                सूची प्रविष्टि · Catalogue entry
              </span>
            )}
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">{meta.title}</h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="flex flex-wrap items-baseline gap-2 mb-4">
              <p lang="sa" className="text-xl font-devanagari opacity-90">{meta.titleSanskrit}</p>
              {meta.titleIast && (
                <span className="text-base font-serif italic text-white/75">
                  ({meta.titleIast})
                </span>
              )}
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-lg opacity-80 max-w-3xl">{meta.description}</p>
            {meta.author && <p className="mt-3 text-sm opacity-60">Attributed to {meta.author}</p>}
          </FadeUp>
        </div>
      </ChapterHero>

      <FadeUpOnView className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <BookLearningClient
          meta={meta}
          explanation={explanation}
          chapters={chapterPreviews}
          catalogueVerses={catalogueVerses}
          catalogueChapters={catalogueChapters}
        />
        <SourcesAndInterpretation
          scriptureId={meta.id}
          scriptureTitle={meta.title}
          scriptureTitleSanskrit={meta.titleSanskrit}
        />
      </FadeUpOnView>
    </main>
  );
}
