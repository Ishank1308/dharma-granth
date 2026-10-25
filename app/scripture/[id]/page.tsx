import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ScriptureContents } from '@/app/components/ScriptureContents';
import { ChapterHero } from '@/app/components/motion/ChapterHero';
import { FadeUp } from '@/app/components/motion/primitives';
import { getScripture, getScriptureMeta, getAllScriptures } from '@/data/scriptures';
import { ChevronRight } from 'lucide-react';

import { ChapterPreview, readSeededChapterPreviews } from '@/lib/read-seeded-chapters';
import { getLibraryFacts } from '@/lib/library-server';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  // The old 'yogavasistha' spelling is a 301 in public/_redirects, not a page.
  return getAllScriptures().map(s => ({ id: s.id }));
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
  const publishedChapterCount = chapterPreviews.length;
  const languageFacts = getLibraryFacts(meta.id).languages;
  const inLanguage = [
    languageFacts.sa ? 'sa' : null,
    languageFacts.hi ? 'hi' : null,
    languageFacts.en ? 'en' : null,
  ].filter((code): code is 'sa' | 'hi' | 'en' => code !== null);

  // JSON-LD structured data: emit a Book entity for any catalog entry, with workExample
  // pointing to a Chapter entity for chapters that actually have verse data.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
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
    <main className="min-h-screen bg-dharma-bg" data-scripture={meta.category} data-scripture-id={meta.id}>
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
      <ChapterHero className="liquid-glass border-b border-dharma-border/60 py-5 text-dharma-text sm:py-7">
        <div className="relative mx-auto max-w-5xl px-6">
          <FadeUp>
            <nav aria-label="Breadcrumb" className="mb-3">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-dharma-muted">
                <li>
                  <Link href="/" className="rounded-md px-1 py-1 transition hover:text-saffron-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li>
                  <Link href="/scriptures/" className="rounded-md px-1 py-1 transition hover:text-saffron-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
                    Scriptures
                  </Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="px-1 font-semibold text-dharma-text">
                  {meta.title}
                </li>
              </ol>
            </nav>
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="editorial-section-eyebrow">Scripture contents · ग्रंथ सूची</p>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-dharma-text md:text-5xl">{meta.title}</h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <p lang="sa" className="font-devanagari text-2xl text-dharma-muted">{meta.titleSanskrit}</p>
              {meta.titleIast && (
                <span className="font-serif text-sm italic text-dharma-muted">
                  ({meta.titleIast})
                </span>
              )}
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-3 max-w-2xl text-base leading-7 text-dharma-muted line-clamp-2">{meta.description}</p>
            {meta.author && <p className="mt-2 text-sm font-semibold text-dharma-muted">Attributed to {meta.author}</p>}
          </FadeUp>
        </div>
      </ChapterHero>

      <div className="mx-auto max-w-5xl px-6 pb-10 pt-5 sm:pt-7">
        <ScriptureContents
          scriptureId={meta.id}
          chapters={chapterPreviews}
          totalChapters={publishedChapterCount}
        />
      </div>
    </main>
  );
}
