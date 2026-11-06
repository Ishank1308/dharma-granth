import { clipDescription } from '@/lib/meta-text';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChapterVisitRecorder } from '@/app/components/ChapterVisitRecorder';
import { ReviewRequiredNotice } from '@/app/components/study/ReviewRequiredNotice';
import { VerseReader } from '@/app/components/reader/VerseReader';
import { getVerseInsight } from '@/lib/verse-insights';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { getScriptureMeta } from '@/data/scriptures';
import { readSeededChapter, readSeededChapterPreviews } from '@/lib/read-seeded-chapters';
import { verseStaticParams } from '@/lib/verse-pages';
import { commentaryFor, verseMeaningSummary } from '@/lib/verse-meaning';
import { verseOgPath, versePageHref, verseSlug } from '@/lib/verse-paths';
import { scriptureLastChanged } from '@/lib/content-dates';
import { cleanVerseField, splitVyakhyaCommentary, verseLines } from '@/lib/verse-format';
import { resolveVerseKnowledge } from '@/lib/knowledge-graph';
import { TrustBadges } from '@/app/components/TrustBadges';
import { VerseCompletion } from '@/app/components/understand/VerseCompletion';
import { getPedagogicalVerse } from '@/data/pedagogical-registry';
import { ActivityRecorder } from '@/app/components/study/ActivityRecorder';
import { badgesFor, latestReview } from '@/lib/review-badges';
import { PENDING_CORRECTIONS, REVIEW_RECORDS } from '@/data/review-records';
import { getScriptureSourceMeta, SCRIPTURE_SOURCES } from '@/data/sources-registry';
import type { VerseLink, VerseQuestionLink } from '@/data/types';

/**
 * One static page per verse for the scriptures in VERSE_PAGE_SCRIPTURE_IDS
 * (lib/verse-paths.ts) — the Gita and principal Upanishads, which people
 * search verse by verse ("gita 2.47 meaning in hindi", "karmanye
 * vadhikaraste"). The verse body is server HTML; copy, share and
 * bookmark are a small client toolbar.
 */

interface PageProps {
  params: { id: string; chapterId: string; verseId: string };
}

interface SeedVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  /** The Hindi translates a range of verses together ("15-17"). */
  hindiRange?: string;
  /** This verse's Hindi is stored on that verse (the first of its range). */
  hindiSeeVerse?: number | string;
  translation?: string;
  explanation?: string;
  commentary?: string;
  science?: string;
  lifeLesson?: string;
  wordMeaning?: string;
  /** Set when the Hindi / English text was machine-translated. */
  hindiSource?: 'ai';
  translationSource?: 'ai';
}

/** "https://sanskritdocuments.org/doc_x/" -> "sanskritdocuments.org/doc_x" */
function repoLabel(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    const host = u.hostname.startsWith('www.') ? u.hostname.slice(4) : u.hostname;
    let path = u.pathname;
    while (path.endsWith('/')) path = path.slice(0, -1);
    return `${host}${path}`;
  } catch {
    return undefined;
  }
}

const chapterCache = new Map<string, ReturnType<typeof readSeededChapter>>();

function loadChapter(scriptureId: string, chapterId: number) {
  const key = `${scriptureId}:${chapterId}`;
  if (!chapterCache.has(key)) chapterCache.set(key, readSeededChapter(scriptureId, chapterId));
  return chapterCache.get(key) ?? null;
}

function findVerse(scriptureId: string, chapterId: number, verseId: string) {
  const seeded = loadChapter(scriptureId, chapterId);
  if (!seeded) return null;
  const verses = seeded.chapter.verses as SeedVerse[];
  const decoded = decodeURIComponent(verseId).trim();
  const index = verses.findIndex((verse) => {
    const slug = verseSlug(verse.number);
    return slug === verseId || slug === decoded || String(verse.number).trim() === decoded;
  });
  if (index < 0) return null;
  return { seeded, verses, index, verse: verses[index] };
}

function plain(text: string | undefined, max: number): string {
  if (!text) return '';
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

/** Opening words of the transliteration without diacritics, as people type them ("karmany evadhikaras te ma phaleshu"). */
function openingLatin(transliteration: string | undefined): string {
  const first = (transliteration ?? '').split(/[|।\n]/)[0] ?? '';
  // Spell it the way it is typed in India: ś/ṣ → sh, c → ch, ṛ → ri ("phaleshu kadachana").
  const typed = first
    .toLowerCase()
    .replace(/[śṣ]h?/g, 'sh')
    .replace(/c(?!h)/g, 'ch')
    .replace(/ṛ/g, 'ri');
  const words = typed.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z' ]/g, ' ').toLowerCase().split(/\s+/).filter(Boolean);
  let out = '';
  for (const w of words) {
    if (out && `${out} ${w}`.length > 40) break;
    out = out ? `${out} ${w}` : w;
  }
  return out;
}

/** The verse's opening words, as people type them into search. */
function opening(sanskrit: string | undefined): string {
  const first = verseLines(cleanVerseField(sanskrit))[0] ?? '';
  return plain(first, 40);
}

export function generateStaticParams() {
  return verseStaticParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const meta = getScriptureMeta(params.id);
  const chapterId = parseInt(params.chapterId, 10);
  const found = meta && Number.isFinite(chapterId) ? findVerse(params.id, chapterId, params.verseId) : null;
  if (!meta || !found) return {};

  const ref = `${meta.title} ${chapterId}.${params.verseId}`;
  const words = opening(found.verse.sanskrit);
  // The title names only the meanings the page really has; a page with none says so and is kept out of the index
  // (and out of the sitemap, see lib/sitemap-sections.ts) until a meaning is written.
  const has = verseMeaningSummary(meta.id, chapterId, found.verse);
  const promise = has.hindi && has.english ? 'Meaning in Hindi & English' : has.hindi ? 'Meaning in Hindi' : has.english ? 'Meaning in English' : has.explanation ? 'Explanation' : 'Original Text';
  // Search engines show about 60 characters: lead with the reference and what the page offers.
  const title = `${ref} ${promise}${words ? ` | ${words}` : ''}`;
  // Hindi reference stays in the keywords ("श्रीमद्भगवद्गीता 2.47 का हिंदी अर्थ").
  const refHi = `${meta.titleSanskrit ?? meta.title} ${chapterId}.${params.verseId}`;
  const cleanSanskrit = cleanVerseField(found.verse.sanskrit).replace(/\s+/g, ' ').trim();
  const cleanTranslation = (found.verse.translation || found.verse.hindi || '').replace(/\s+/g, ' ').trim();
  const description = clipDescription(
    cleanSanskrit && cleanTranslation
      ? `${ref}: ${cleanSanskrit} — ${cleanTranslation}`
      : cleanSanskrit || cleanTranslation || `${refHi} का मूल श्लोक, हिंदी अर्थ एवं व्याख्या`,
    160,
  );
  const latin = openingLatin(found.verse.transliteration);
  const canonical = versePageHref(meta.id, chapterId, params.verseId);
  const image = verseOgPath(meta.id, chapterId, params.verseId) ?? `/og/${meta.id}.png`;

  return {
    title: { absolute: `${title} — Dharma Granth` },
    description,
    keywords: [
      ref,
      `${ref} meaning in hindi`,
      `${ref} meaning in english`,
      `${ref} in hindi`,
      `${ref} translation`,
      words,
      latin && `${latin} meaning`,
      `${refHi} अर्थ`,
      `${refHi} हिंदी अर्थ`,
      meta.titleSanskrit,
      'श्लोक अर्थ',
      'traditional commentary',
    ].filter(
      (k): k is string => Boolean(k),
    ),
    alternates: { canonical },
    ...(has.any ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title,
      description,
      url: canonical,
      tags: meta.tags,
      images: [{ url: image, width: 1200, height: 630, alt: ref }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default function VersePage({ params }: PageProps) {
  const meta = getScriptureMeta(params.id);
  if (!meta) return notFound();

  const chapterId = parseInt(params.chapterId, 10);
  if (!Number.isFinite(chapterId) || chapterId < 1) return notFound();

  const found = findVerse(params.id, chapterId, params.verseId);
  if (!found) return notFound();

  const { seeded, verses, index, verse } = found;
  // The nearest verse in one direction that has a page of its own. That is the next verse,
  // except in a scripture with pages only for some verses (PARTIAL_VERSE_PAGE_SCRIPTURE_IDS).
  const pagedVerse = (list: SeedVerse[], listChapterId: number, from: number, step: 1 | -1) => {
    for (let i = from; i >= 0 && i < list.length; i += step) {
      const href = versePageHref(meta.id, listChapterId, list[i].number);
      if (href) return { verse: list[i], href };
    }
    return undefined;
  };
  const before = pagedVerse(verses as SeedVerse[], chapterId, index - 1, -1);
  const after = pagedVerse(verses as SeedVerse[], chapterId, index + 1, 1);
  let prev = before?.verse;
  let next = after?.verse;
  let prevHref = before?.href;
  let nextHref = after?.href;
  let nextChapterId = chapterId;
  const chapterHref = `/scripture/${meta.id}/chapter/${chapterId}`;

  const edgeVerse = (neighborId: number, which: 'first' | 'last') => {
    const seededNeighbor = loadChapter(meta.id, neighborId);
    const list = seededNeighbor?.chapter.verses as SeedVerse[] | undefined;
    if (!list || list.length === 0) return undefined;
    return which === 'first' ? pagedVerse(list, neighborId, 0, 1) : pagedVerse(list, neighborId, list.length - 1, -1);
  };
  if (!nextHref || !prevHref) {
    const previews = readSeededChapterPreviews(meta.id);
    const pos = previews.findIndex((item) => item.id === chapterId);
    // Chapters with no verse page (most Ramayana kandas) are skipped.
    for (let p = pos + 1; !nextHref && pos >= 0 && p < previews.length; p++) {
      const edge = edgeVerse(previews[p].id, 'first');
      if (edge) {
        next = edge.verse;
        nextHref = edge.href;
        nextChapterId = previews[p].id;
      }
    }
    for (let p = pos - 1; !prevHref && p >= 0; p--) {
      const edge = edgeVerse(previews[p].id, 'last');
      if (edge) {
        prev = edge.verse;
        prevHref = edge.href;
      }
    }
  }

  // Same key as the chapter reader, so dotted verse numbers (Brihadaranyaka "1.3.28") find their commentary too.
  const comment = commentaryFor(meta.id, chapterId, params.verseId);
  const { vyakhya, commentary } = splitVyakhyaCommentary(
    [comment?.explanation, verse.explanation, verse.commentary],
    verse.wordMeaning,
  );
  const explanation = vyakhya ?? commentary;
  const science = comment?.science ?? verse.science;
  const lesson = comment?.lifeLesson ?? verse.lifeLesson;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const verseHref = versePageHref(meta.id, chapterId, params.verseId) ?? '';
  const pageUrl = `${siteUrl}${verseHref.endsWith('/') ? verseHref : `${verseHref}/`}`;
  const ref = `${meta.title} ${chapterId}.${params.verseId}`;
  const hindi = plain(verse.hindi, 600);
  const english = plain(verse.translation, 600);
  const modified = scriptureLastChanged(meta.id)?.toISOString();

  const questions = [
    hindi && { '@type': 'Question', name: `${ref} का हिन्दी अर्थ क्या है?`, acceptedAnswer: { '@type': 'Answer', text: hindi } },
    english && { '@type': 'Question', name: `What is the meaning of ${ref}?`, acceptedAnswer: { '@type': 'Answer', text: english } },
  ].filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: `${ref} — Meaning in Hindi & English (हिंदी अर्थ)`,
        inLanguage: ['sa', 'hi', 'en'],
        isAccessibleForFree: true,
        genre: 'Scriptural study',
        ...(modified ? { dateModified: modified } : {}),
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        isPartOf: {
          '@type': 'Book',
          name: meta.title,
          alternateName: meta.titleSanskrit,
          url: `${siteUrl}/scripture/${meta.id}/`,
        },
      },
      ...(questions.length > 0 ? [{ '@type': 'FAQPage', '@id': `${pageUrl}#faq`, mainEntity: questions }] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Library', item: `${siteUrl}/scriptures/` },
          { '@type': 'ListItem', position: 3, name: meta.title, item: `${siteUrl}/scripture/${meta.id}/` },
          { '@type': 'ListItem', position: 4, name: `Chapter ${chapterId}`, item: `${siteUrl}${chapterHref}/` },
          { '@type': 'ListItem', position: 5, name: `Verse ${params.verseId}`, item: pageUrl },
        ],
      },
    ],
  };

  const chapterName = seeded.chapter.title ?? `अध्याय ${chapterId}`;

  const tagged = verse as { concepts?: string[]; relatedVerses?: VerseLink[]; relatedQuestions?: VerseQuestionLink[]; questions?: VerseQuestionLink[]; lifeSituations?: string[]; relatedScriptures?: string[]; relatedPathways?: string[]; relatedSages?: string[] };
  const knowledge = resolveVerseKnowledge(meta.id, chapterId, params.verseId, tagged);

  const source = (seeded.source ?? {}) as { repo?: string; license?: string; fetchedAt?: string };
  const chapterLinks = readSeededChapterPreviews(meta.id).map((c) => ({
    id: c.id,
    title: c.title,
    titleSanskrit: c.titleSanskrit,
    verseCount: c.verseCount,
    href: `/scripture/${meta.id}/chapter/${c.id}`,
  }));
  const verseLinks = verses.flatMap((v) => {
    const href = versePageHref(meta.id, chapterId, v.number);
    return href ? [{ number: v.number, href }] : [];
  });

  const pedagogical = getPedagogicalVerse(meta.id, chapterId, params.verseId);
  const sourceMeta = getScriptureSourceMeta(meta.id, meta.title, meta.titleSanskrit);
  const translationReview = latestReview(REVIEW_RECORDS, 'translation', meta.id, chapterId, params.verseId);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Library', href: '/scriptures/' },
          { label: meta.title, href: `/scripture/${meta.id}/` },
          { label: chapterName, href: `${chapterHref}/` },
          { label: `Verse ${params.verseId}` },
        ]}
      />
      <ActivityRecorder scriptureId={meta.id} chapterId={chapterId} verseId={String(params.verseId)} concepts={knowledge.concepts.flatMap((concept) => concept.id ? [concept.id] : [])} />
      <ChapterVisitRecorder
        scriptureId={meta.id}
        scriptureTitle={meta.title}
        scriptureTitleSanskrit={meta.titleSanskrit}
        chapterId={chapterId}
        chapterTitle={chapterName}
        totalChapters={meta.totalChapters}
        verseId={params.verseId}
      />
      <VerseReader
        scriptureId={meta.id}
        scriptureTitle={meta.title}
        scriptureTitleSanskrit={meta.titleSanskrit}
        chapterId={chapterId}
        chapterTitle={chapterName}
        scriptureHref={`/scripture/${meta.id}`}
        chapterHref={chapterHref}
        pageUrl={pageUrl}
        chapters={chapterLinks}
        verses={verseLinks}
        index={Math.max(0, verseLinks.findIndex((v) => verseSlug(v.number) === params.verseId))}
        verse={{
          number: verse.number,
          sanskrit: verse.sanskrit,
          transliteration: verse.transliteration,
          wordMeaning: verse.wordMeaning,
          hindi: verse.hindi,
          hindiRange: verse.hindiRange,
          hindiSeeVerse: verse.hindiSeeVerse,
          translation: verse.translation,
          explanation,
          reflection: lesson,
          research: science,
        }}
        provenance={{
          sourceHost: repoLabel(source.repo),
          sourceUrl: source.repo,
          sourceLicense: source.license,
          sourceFetched: source.fetchedAt,
          hindiIsAi: verse.hindiSource === 'ai',
          englishIsAi: verse.translationSource === 'ai',
          commentaryIsAi: Boolean(comment?.ai),
          explanationIsAi: Boolean(comment?.ai || comment?.explanationAi),
          researchIsAi: Boolean(comment?.ai || comment?.scienceAi),
          lastUpdated: modified,
          translator: sourceMeta.primaryTranslator,
          edition: `${sourceMeta.sanskritEdition}. ${sourceMeta.publisherArchive}`,
          translationReview: translationReview ? `Reviewed ${translationReview.date}` : 'Not yet reviewed',
          variantNote: SCRIPTURE_SOURCES[meta.id]?.alternativeReadingNote,
        }}
        prev={prev && prevHref ? { number: prev.number, href: prevHref } : undefined}
        next={next && nextHref ? { number: next.number, href: nextHref } : undefined}
        sourceStatus={
          <TrustBadges
            className="mb-4"
            sourceHost={repoLabel(source.repo)}
            translationIsAi={verse.hindiSource === 'ai' || verse.translationSource === 'ai'}
            commentaryIsAi={Boolean(comment?.ai)}
            hasEditorial={Boolean(pedagogical)}
            badges={badgesFor({ scriptureId: meta.id, chapter: chapterId, verse: params.verseId, hasEditorial: Boolean(pedagogical), records: REVIEW_RECORDS, corrections: PENDING_CORRECTIONS })}
          />
        }
        insight={getVerseInsight(meta.id, chapterId, params.verseId)}
      >
        {/*
          Below the pillars only a quiet close: the source card lives inside the verse, and
          related-wisdom, diagrams, scenario, graph and suggestion blocks were removed as
          distractions from the reading (2026-10-25).
        */}
        {!pedagogical && !explanation && <ReviewRequiredNotice className="mt-8" />}
        <VerseCompletion
          reference={ref}
          readerRef={{ scriptureId: meta.id, scriptureTitle: meta.title, scriptureTitleSanskrit: meta.titleSanskrit, chapterId, chapterTitle: chapterName, url: pageUrl }}
          verse={{ number: verse.number, sanskrit: verse.sanskrit, transliteration: verse.transliteration, hindi: verse.hindi, translation: verse.translation }}
          nextHref={nextHref}
          chapterHref={chapterHref}
        />
      </VerseReader>
    </>
  );
}
