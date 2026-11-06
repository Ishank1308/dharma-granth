/**
 * The chapter page, shared by the chapter URL (part 1) and, for chapters
 * too large for one page, `part/[part]/` (see lib/chapter-parts).
 * Not a route file: page.tsx and part/[part]/page.tsx render it.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FullChapterVerses } from '@/app/components/FullChapterVerses';
import { ChapterOrientation } from '@/app/components/ChapterOrientation';
import { ChapterSummaryBox } from '@/app/components/ChapterSummaryBox';
import { getChapterSummary, getChapterSummaryCollection } from '@/data/chapter-summaries';
import { getChapterOrientation } from '@/data/chapter-orientation';
import { ChapterKeyboardNav } from '@/app/components/ChapterKeyboardNav';
import { ChapterCompletion } from '@/app/components/ChapterCompletion';
import { ChapterVisitRecorder } from '@/app/components/ChapterVisitRecorder';
import { getScriptureMeta, getScriptureChapters } from '@/data/scriptures';
import {
  readChapterCommentary,
  readSeededChapter,
  readSeededChapterNumbers,
  readSeededChapterPreviews,
  type ChapterPreview,
} from '@/lib/read-seeded-chapters';
import type { InitialChapter } from '@/app/components/FullChapterVerses';
import { getChapterInsights } from '@/lib/verse-insights';
import type { HiCommentaryEntry } from '@/data/hi-commentary/_types';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { ShareButton } from '@/app/components/ShareButton';
import { ChapterPartRedirect } from '@/app/components/ChapterPartRedirect';
import { ChapterAudioHeroAction } from '@/app/components/ChapterAudioHeroAction';
import { scriptureVibe, vibeAttrs } from '@/lib/scripture-vibes';
import { jsonLdGraph } from '@/lib/jsonld-graph';
import { SourcesAndInterpretation } from '@/app/components/SourcesAndInterpretation';
import { chapterPartHref, chapterParts, INLINE_CHAPTER_MAX_BYTES, type ChapterPart } from '@/lib/chapter-parts';
import { CONNECTIONS, type Connection } from '@/data/study-content';
import { MeaningPendingNotice } from '@/app/components/MeaningPending';
import { commentaryOf, verseHasMeaning } from '@/lib/verse-has-meaning';

export interface ChapterParams {
  id: string;
  chapterId: string;
}

function getChapterPreview(scriptureId: string, chapterId: number): ChapterPreview | undefined {
  const indexedChapter = getScriptureChapters(scriptureId).find(
    (chapter) => chapter.id === chapterId,
  );
  const seededChapter = readSeededChapterPreviews(scriptureId).find(
    (chapter) => chapter.id === chapterId,
  );

  if (!indexedChapter && !seededChapter) return undefined;

  return {
    id: chapterId,
    title: indexedChapter?.title ?? seededChapter?.title ?? `अध्याय ${chapterId}`,
    titleSanskrit: indexedChapter?.titleSanskrit ?? seededChapter?.titleSanskrit,
    summary: seededChapter?.summary,
    verseCount: seededChapter ? seededChapter.verseCount : (indexedChapter?.verseCount ?? 0),
  };
}

const GENERIC_TITLE = /^(adhyaya|chapter|अध्याय)\s*[\d०-९]+$/i;

/** A neighbouring chapter's name for the prev/next buttons, if it says more than its number. */
function neighbourLabel(scriptureId: string, chapterId: number): string | undefined {
  const preview = getChapterPreview(scriptureId, chapterId);
  if (!preview) return undefined;
  return [preview.title, preview.titleSanskrit].find(
    (t): t is string => Boolean(t?.trim()) && !GENERIC_TITLE.test(t!.trim()),
  );
}

/** A part's verse range as a label, e.g. "1.1–12.45". */
function partRange(part: ChapterPart): string {
  // A section's verse 0 is its opening invocation (॥ श्रीगणेशाय नमः), not a verse: label from verse 1.
  const first = part.first.replace(/^(\d+)\.0$/, '$1.1');
  return first === part.last ? first : `${first}–${part.last}`;
}

/** Every part of a split chapter, as compact links (current one marked), folded so the first verse stays in view. */
function PartsNav({ parts, current, href }: { parts: ChapterPart[]; current: number; href: (p: number) => string }) {
  const here = parts.find((p) => p.part === current);
  return (
    <nav aria-label="अध्याय के भाग" className="mb-6 rounded-card border border-separator/80 bg-surface-raised px-4 py-2.5 shadow-xs">
      <details className="group">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-subhead font-semibold text-label-primary [&::-webkit-details-marker]:hidden">
          <span lang="hi" className="font-devanagari">
            भाग {current} / {parts.length}
            {here && <span className="ml-2 font-normal text-label-secondary font-sans">श्लोक {partRange(here)}</span>}
          </span>
          <span className="inline-flex items-center gap-1.5 text-caption-1 font-semibold text-accent">
            <span lang="hi">भाग चुनें</span>
            <ChevronDown className="h-4 w-4 transition-transform duration-standard ease-standard group-open:rotate-180" aria-hidden="true" />
          </span>
        </summary>
        <p lang="hi" className="mb-3 mt-1.5 font-devanagari text-caption-1 text-label-secondary">
          यह अध्याय बड़ा है — {parts.length} भागों में पढ़ें
        </p>
        <ol className="flex flex-wrap gap-2 pb-2">
        {parts.map((p) => (
          <li key={p.part}>
            <Link
              href={href(p.part)}
              aria-current={p.part === current ? 'page' : undefined}
              title={`श्लोक ${partRange(p)}`}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-pill border px-3 py-1 text-xs transition-all duration-fast select-none ${
                p.part === current
                  ? 'border-separator bg-surface-elevated font-semibold text-label-primary shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                  : 'border-separator/60 bg-fill-tertiary text-label-secondary hover:bg-fill-quaternary hover:text-label-primary'
              }`}
            >
              <span className="font-semibold">{p.part}</span>
              <span className={p.part === current ? 'opacity-80' : 'text-label-tertiary'}>{partRange(p)}</span>
            </Link>
          </li>
        ))}
        </ol>
      </details>
    </nav>
  );
}

export function chapterMetadata(params: ChapterParams, partNumber = 1): Metadata {
  const meta = getScriptureMeta(params.id);
  if (!meta) return {};

  const chapterId = parseInt(params.chapterId, 10);
  const chapter = getChapterPreview(params.id, chapterId);
  if (!chapter) return {};
  const parts = chapterParts(meta.id, chapterId);
  const part = parts?.[partNumber - 1];
  if (partNumber > 1 && !part) return {};

  // Hindi first: most searches for scripture meanings in India are in Hindi
  // ("भगवद गीता अध्याय 2 हिंदी अर्थ"). The English names stay in the title for
  // English searches; the first verse's meaning makes each description unique.
  const genericTitle = GENERIC_TITLE.test(chapter.title);
  const hindiPart = `${meta.titleSanskrit} अध्याय ${chapter.id}${chapter.titleSanskrit ? ` — ${chapter.titleSanskrit}` : ''}`;
  const englishPart = genericTitle ? ` (${meta.title} ${chapter.id})` : ` (${chapter.title})`;
  // Long English chapter names ("Adhyāya 1 · Vallī 1 — Naciketas Goes to
  // Death") would push the title far past what results show; keep the
  // Hindi, and fall back to just the book's English name.
  // Split chapters: each part names its place and verse range.
  const partLabel = part && parts ? ` — भाग ${part.part}/${parts.length} (श्लोक ${partRange(part)})` : '';
  const title =
    Array.from(`${hindiPart}${englishPart}${partLabel}`).length <= 75
      ? `${hindiPart}${englishPart}${partLabel} | हिंदी अर्थ · English Meaning`
      : `${hindiPart}${partLabel} (${meta.title}) | हिंदी अर्थ · English Meaning`;
  const firstVerse = readSeededChapter(meta.id, chapterId)?.chapter.verses[part?.start ?? 0] as
    | { hindi?: string; translation?: string }
    | undefined;
  // Chapters with an editorial summary (गीता सार, योगसूत्र सार) describe themselves with it; others with the first verse.
  const editorialSummary = !part ? getChapterSummary(meta.id, chapter.id)?.summaryHi : undefined;
  const opening = (editorialSummary || firstVerse?.hindi || firstVerse?.translation || chapter.summary || '').replace(/\s+/g, ' ').trim();
  const lead = part
    ? `${meta.titleSanskrit} (${meta.title}) अध्याय ${chapter.id}, भाग ${part.part}: श्लोक ${partRange(part)} — संस्कृत मूल, हिंदी अर्थ और English translation।`
    : `${meta.titleSanskrit} (${meta.title}) अध्याय ${chapter.id}` +
      (chapter.verseCount > 0 ? ` के ${chapter.verseCount} श्लोक` : '') +
      ' — संस्कृत मूल, हिंदी अर्थ और English translation।';
  const rawHref = chapterPartHref(meta.id, chapter.id, part?.part ?? 1);
  const canonical = rawHref.endsWith('/') ? rawHref : `${rawHref}/`;
  const room = 158 - lead.length - 1;
  const description =
    opening && room > 30 ? `${lead} ${opening.length > room ? `${opening.slice(0, room - 1).trimEnd()}…` : opening}` : lead;

  const ogImage = {
    url: `/og/${meta.id}.png`,
    width: 1200,
    height: 630,
    alt: `${meta.title} — Dharma Granth`,
  };

  return {
    title,
    description,
    // A chapter whose own text is not in the library yet (its filler verses are not published) is not indexed.
    ...(chapter.verseCount === 0 ? { robots: { index: false, follow: true } } : {}),
    keywords: [
      `${meta.title} chapter ${chapter.id}`,
      `${meta.title} chapter ${chapter.id} meaning in english`,
      `${meta.title} chapter ${chapter.id} meaning in hindi`,
      `${meta.title} adhyay ${chapter.id}`,
      `${meta.titleSanskrit} अध्याय ${chapter.id} अर्थ`,
    ],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title,
      description,
      url: canonical,
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

export function ChapterView({ params, part: partNumber = 1 }: { params: ChapterParams; part?: number }) {
  const meta = getScriptureMeta(params.id);
  if (!meta) return notFound();

  const chapterId = parseInt(params.chapterId, 10);
  if (!Number.isFinite(chapterId) || chapterId < 1) return notFound();
  const parts = chapterParts(meta.id, chapterId);
  const part = parts?.[partNumber - 1];
  if (partNumber > 1 && !part) return notFound();

  const chapter = getChapterPreview(params.id, chapterId) ?? {
    id: chapterId,
    title: `अध्याय ${chapterId}`,
    titleSanskrit: undefined,
    summary: 'इस अध्याय का सारांश अभी दर्ज नहीं है।',
    verseCount: 0,
  };

  // Determine the navigable chapter range. Curated TS may stop short
  // of the seeded JSON (e.g. yajurveda curated 1–4 / seeded 1–40); we
  // want pagination to span the full seeded range so users can keep
  // moving forward into seeded-only chapters.
  const seededChapters = readSeededChapterNumbers(meta.id);
  const maxSeeded = seededChapters.reduce((m, n) => (n > m ? n : m), 0);
  const indexedChapters = getScriptureChapters(meta.id);
  const maxIndexed = indexedChapters.reduce((m, ch) => (ch.id > m ? ch.id : m), 0);
  // Catalogue chapter totals can run past the files (a reader would land on an
  // empty chapter). Paginate across chapters that are actually indexed or seeded.
  const knownMax = Math.max(maxIndexed, maxSeeded);
  const totalChapterCount = knownMax > 0 ? knownMax : meta.totalChapters;
  if (chapterId > totalChapterCount) return notFound();

  // The chapter's text, read at build time so every verse is in the exported
  // HTML — scripture never changes between builds, and crawlers, link
  // previews and AI search engines don't run the page's JavaScript.
  // Chapters over 1 MB (Mahabharata parvas, Shiva Purana samhitas, up to
  // 12,000+ verses) are split into parts; this page carries one part.
  const seeded = readSeededChapter(meta.id, chapterId);
  const allVerses = (seeded?.chapter.verses ?? []) as InitialChapter['verses'];
  const pageVerses = part ? allVerses.slice(part.start, part.end) : allVerses;
  const initialChapter: InitialChapter | undefined =
    seeded &&
    pageVerses.length > 0 &&
    (part || Buffer.byteLength(JSON.stringify(pageVerses)) <= INLINE_CHAPTER_MAX_BYTES)
      ? {
          verses: pageVerses,
          commentary: readChapterCommentary<HiCommentaryEntry>(meta.id, chapterId),
          source: seeded.source as InitialChapter['source'],
          insights: getChapterInsights(
            meta.id,
            chapterId,
            pageVerses.map((v) => v.number),
          ),
        }
      : undefined;
  const summaryCollection = getChapterSummaryCollection(meta.id);
  const chapterSummary = getChapterSummary(meta.id, chapter.id);

  // Verses on this page whose meaning is not published yet (see MeaningPending): counted once, in the HTML.
  const pageCommentary = initialChapter?.commentary ?? readChapterCommentary<HiCommentaryEntry>(meta.id, chapterId);
  const pageHasMeaning = pageVerses.map((v) => verseHasMeaning(v, commentaryOf(pageCommentary, chapterId, v.number)));
  const pendingCount = pageHasMeaning.filter((h) => !h).length;
  const pendingSummary = (chapterSummary?.summaryHi || (seeded ? chapter.summary : undefined) || '').trim() || undefined;
  const pageWithMeaning = pageVerses.filter((_, i) => pageHasMeaning[i]).slice(0, 6).map((v) => String(v.number));
  const hasChapterContext = Boolean(chapterSummary || getChapterOrientation(meta.id, chapter.id));

  // Only send the current chapter part's existing, approved editorial links
  // to the reader. No recommendations are inferred or generated here.
  const relatedTeachingsByVerse: Record<string, Connection[]> = {};
  const pageVerseNumbers = new Set(pageVerses.map((verse) => String(verse.number)));
  const connectionPrefix = `${meta.id}:${chapter.id}:`;
  for (const [key, connections] of Object.entries(CONNECTIONS)) {
    if (!key.startsWith(connectionPrefix)) continue;
    const verseNumber = key.slice(connectionPrefix.length);
    if (!pageVerseNumbers.has(verseNumber)) continue;
    const approvedConnections = connections
      .filter((connection) => connection.review === 'approved')
      .slice(0, 3);
    if (approvedConnections.length > 0) {
      relatedTeachingsByVerse[verseNumber] = approvedConnections;
    }
  }
  const partHref = (p: number) => chapterPartHref(meta.id, chapterId, p);
  const prevPartHref = part && part.part > 1 ? partHref(part.part - 1) : undefined;
  const nextPartHref = part && parts && part.part < parts.length ? partHref(part.part + 1) : undefined;

  const prevHref = chapterId > 1 ? `/scripture/${params.id}/chapter/${chapterId - 1}` : undefined;
  const nextHref =
    chapterId < totalChapterCount ? `/scripture/${params.id}/chapter/${chapterId + 1}` : undefined;
  const prevLabel = prevHref ? neighbourLabel(meta.id, chapterId - 1) : undefined;
  const nextLabel = nextHref ? neighbourLabel(meta.id, chapterId + 1) : undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  // Share links are built here, at build time: the WhatsApp link is a plain anchor (no JS),
  // and the page's own canonical URL (with the trailing slash the site is served at) is what gets shared.
  const shareUrl = `${siteUrl}${chapterPartHref(meta.id, chapter.id, part?.part ?? 1)}/`;
  const shareHeading = `${meta.title} · ${chapter.title}${part ? ` (भाग ${part.part})` : ''}`;
  const shareSummary = (chapter.summary ?? '').replace(/\s+/g, ' ').trim();
  const shareLines = [shareSummary.length > 180 ? `${shareSummary.slice(0, 179).trimEnd()}…` : shareSummary];
  const quietAction =
    'focus-ring inline-flex min-h-[38px] items-center gap-2 rounded-pill border border-separator/80 bg-surface-raised px-4 text-subhead font-medium text-label-primary transition hover:bg-fill-quaternary active:scale-[0.98] shadow-xs';

  const vibe = scriptureVibe(meta.id, meta.category);

  const chapterJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    '@id': `${siteUrl}/scripture/${meta.id}/chapter/${chapter.id}`,
    name: chapter.title,
    alternateName: chapter.titleSanskrit,
    position: chapter.id,
    inLanguage: ['sa', 'hi', 'en'],
    description: chapter.summary,
    isPartOf: {
      '@type': 'Book',
      name: meta.title,
      alternateName: meta.titleSanskrit,
      url: `${siteUrl}/scripture/${meta.id}`,
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Library', item: `${siteUrl}/scriptures/` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: `${siteUrl}/scripture/${meta.id}/` },
      {
        '@type': 'ListItem',
        position: 4,
        name: chapter.title,
        item: `${siteUrl}/scripture/${meta.id}/chapter/${chapter.id}/`,
      },
    ],
  };

  return (
    <main data-chapter-reading data-scripture={meta.category} data-scripture-id={meta.id} {...vibeAttrs(vibe)} className="min-h-screen bg-dharma-bg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph(chapterJsonLd, breadcrumbJsonLd)) }}
      />
      {/* A book's chapter opening, as an Apple large title: the chapter, its Sanskrit name and two quiet actions,
          nothing else between the reader and the first verse. The summary lives in "About this chapter" below. */}
      <header className="mx-auto max-w-3xl px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-12">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/scripture/${meta.id}`}
            className="focus-ring inline-flex items-center gap-1.5 rounded-pill border border-separator/80 bg-surface-raised px-3 py-1 text-caption-1 font-semibold text-label-secondary transition hover:bg-fill-quaternary hover:text-label-primary shadow-xs"
          >
            <span>{meta.title}</span>
            <span aria-hidden="true" className="opacity-40">›</span>
          </Link>
          <span className="inline-flex items-center gap-1 rounded-pill bg-fill-tertiary px-2.5 py-1 text-caption-1 font-medium text-label-secondary border border-separator/40">
            <span>Chapter {chapter.id} of {totalChapterCount}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span lang="hi" className="font-devanagari">अध्याय {chapter.id}</span>
          </span>
          {part && parts && (
            <span className="inline-flex items-center rounded-pill bg-fill-tertiary px-2.5 py-1 text-caption-1 font-medium text-label-secondary border border-separator/40">
              <span lang="hi" className="font-devanagari">भाग {part.part}/{parts.length} · श्लोक {partRange(part)}</span>
            </span>
          )}
        </div>
        <h1 className="mt-3 text-title-1 sm:text-large-title font-bold tracking-tight text-label-primary">{chapter.title}</h1>
        {chapter.titleSanskrit && (
          <p lang="sa" className="mt-2 font-devanagari text-title-3 sm:text-title-2 font-medium text-label-secondary">{chapter.titleSanskrit}</p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          {chapter.verseCount > 0 ? (
            <ChapterAudioHeroAction
              className={quietAction}
              tone="quiet"
              scriptureId={meta.id}
              chapterId={chapter.id}
              chapterTitle={chapter.title}
              firstVerseId={part ? part.first : 1}
              totalVerses={chapter.verseCount}
            />
          ) : (
            <span lang="hi" className="text-footnote text-label-tertiary">श्लोक पाठ अभी प्रकाशित नहीं है</span>
          )}
          <ShareButton title={`${shareHeading} · Dharma Granth`} text={shareLines[0]} url={shareUrl} className={quietAction}>
            Share
          </ShareButton>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-[calc(11rem+env(safe-area-inset-bottom))] sm:px-6 lg:pb-32">
        <div className="relative">
        {(!part || part.part === 1) && hasChapterContext && (
          <details className="apple-card group mb-8 overflow-hidden rounded-card border border-separator/80 bg-surface-raised/80 shadow-xs">
            <summary className="focus-ring flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-fill-quaternary [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <span className="text-subhead font-semibold text-label-primary">About this chapter</span>
                <span lang="hi" className="font-devanagari text-caption-1 font-normal text-label-secondary">· अध्याय परिचय</span>
              </span>
              <span aria-hidden="true" className="apple-chevron text-lg transition-transform duration-standard ease-standard group-open:rotate-90">›</span>
            </summary>
            <div className="border-t border-separator/60 p-5 space-y-5">
              {chapterSummary && summaryCollection && (
                <ChapterSummaryBox
                  summary={chapterSummary}
                  unitHi={summaryCollection.unitHi}
                  allHref={`/scripture/${meta.id}/summary/`}
                  allLinkHi={summaryCollection.allLinkHi}
                />
              )}
              <ChapterOrientation scriptureId={meta.id} chapterId={chapter.id} verseCount={chapter.verseCount} />
            </div>
          </details>
        )}
        {part && parts && (
          <>
            <PartsNav parts={parts} current={part.part} href={partHref} />
            <ChapterPartRedirect
              basePath={`/scripture/${meta.id}/chapter/${chapterId}`}
              currentPart={part.part}
              parts={parts.map(({ part: p, first, last }) => ({ part: p, first, last }))}
            />
          </>
        )}
        {pendingCount > 0 && (
          <MeaningPendingNotice
            chapterId={chapter.id}
            pending={pendingCount}
            total={pageVerses.length}
            summary={pendingSummary}
            withMeaning={pageWithMeaning}
          />
        )}
        {/* With initialChapter, the reader's server render is the plain
            VerseText list (every verse in the HTML); it swaps in the
            interactive cards once hydrated. */}
        <div id="chapter-text" className="scroll-mt-24">
          {seeded && allVerses.length === 0 ? (
            // The chapter's own text is not in the library yet (scripts/lib/filler-chapters.ts): say so plainly.
            <section className="rounded-2xl border border-dashed border-dharma-border bg-dharma-bg/60 p-5 text-center">
              <p lang="hi" className="font-devanagari text-base text-dharma-text">इस अध्याय का पाठ जोड़ा जा रहा है।</p>
              <p lang="en" className="mt-1 text-sm text-dharma-muted">This chapter&apos;s text is being added.</p>
              <Link
                href={`/scripture/${meta.id}/`}
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card px-4 text-sm font-semibold text-saffron-800 transition hover:border-saffron-300 dark:text-saffron-200"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span lang="hi" className="font-devanagari">ग्रंथ सूची</span> <span aria-hidden="true">·</span> <span lang="en">{meta.title} contents</span>
              </Link>
            </section>
          ) : (
            <FullChapterVerses
              scriptureId={params.id}
              category={meta.category}
              chapterId={chapter.id}
              curatedVerseIds={[]}
              scriptureTitle={meta.title}
              chapterTitle={chapter.title || `अध्याय ${chapter.id}`}
              basePath={process.env.NEXT_PUBLIC_BASE_PATH || ''}
              autoLoad
              initialChapter={initialChapter}
              relatedTeachingsByVerse={relatedTeachingsByVerse}
            />
          )}
        </div>

        {part && parts && (
          <nav className="mt-10 flex items-stretch justify-between gap-4" aria-label="इस अध्याय के भाग">
            {prevPartHref ? (
              <Link
                href={prevPartHref}
                rel="prev"
                className="inline-flex min-w-0 max-w-[48%] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-5 py-3 text-dharma-text transition hover:border-saffron-300"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase text-dharma-muted">पिछला भाग</span>
                  <span className="block text-sm font-semibold">
                    भाग {part.part - 1} · श्लोक {partRange(parts[part.part - 2])}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextPartHref && (
              <Link
                href={nextPartHref}
                rel="next"
                className="ml-auto inline-flex min-w-0 max-w-[48%] items-center gap-2 rounded-xl bg-gradient-to-br from-saffron-600 to-saffron-700 px-5 py-3 text-white transition hover:shadow-lg"
              >
                <span className="min-w-0 text-right">
                  <span className="block text-[10px] uppercase opacity-80">अगला भाग</span>
                  <span className="block text-sm font-semibold">
                    भाग {part.part + 1} · श्लोक {partRange(parts[part.part])}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            )}
          </nav>
        )}

        {!nextPartHref && (
          <p aria-hidden="true" className="mt-16 text-center font-devanagari text-base text-saffron-700/80 dark:text-amber-300/80">
            ॥ ॐ तत्सत् ॥
          </p>
        )}
        {(prevHref || nextHref) && (
          <nav aria-label="अध्याय" className="mt-10 flex flex-col sm:flex-row items-stretch justify-between gap-3 border-t border-separator/60 pt-6">
            {prevHref ? (
              <Link
                href={prevHref}
                rel="prev"
                aria-keyshortcuts="ArrowLeft"
                className="group flex flex-1 min-w-0 items-center gap-3 rounded-card border border-separator/80 bg-surface-raised p-4 transition-all hover:bg-fill-quaternary hover:border-separator shadow-xs"
              >
                <ArrowLeft className="h-5 w-5 shrink-0 text-label-secondary transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-caption-2 uppercase font-semibold tracking-wider text-label-tertiary">Previous · पिछला अध्याय</span>
                  <span lang="hi" className="block text-subhead font-bold text-label-primary">अध्याय {chapterId - 1}</span>
                  {prevLabel && <span className="block truncate text-caption-1 text-label-secondary">{prevLabel}</span>}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block flex-1" />
            )}
            {nextHref && (
              <Link
                href={nextHref}
                rel="next"
                aria-keyshortcuts="ArrowRight"
                className="group flex flex-1 min-w-0 items-center justify-end text-right gap-3 rounded-card border border-separator/80 bg-surface-raised p-4 transition-all hover:bg-fill-quaternary hover:border-separator shadow-xs"
              >
                <span className="min-w-0">
                  <span className="block text-caption-2 uppercase font-semibold tracking-wider text-label-tertiary">Next · अगला अध्याय</span>
                  <span lang="hi" className="block text-subhead font-bold text-label-primary">अध्याय {chapterId + 1}</span>
                  {nextLabel && <span className="block truncate text-caption-1 text-label-secondary">{nextLabel}</span>}
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-label-secondary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            )}
          </nav>
        )}
        {/* A split chapter is complete only at the end of its last part. */}
        {!nextPartHref && (
          <ChapterCompletion
            key={`${meta.id}-${chapter.id}`}
            scriptureId={meta.id}
            chapterId={chapter.id}
            chapterTitle={chapter.title || `अध्याय ${chapter.id}`}
            totalChapters={totalChapterCount}
            nextHref={nextHref}
            nextLabel={nextLabel}
          />
        )}
        {/* One quiet line after the reading, never during it (audit 2026-10-22, Phase 8). */}
        {!nextPartHref && (
          <p className="mt-10 text-center text-sm leading-relaxed text-dharma-muted">
            <span lang="hi" className="font-devanagari">धर्म ग्रंथ निःशुल्क और विज्ञापन-रहित है।</span>{' '}
            <span lang="en">Dharma Granth is free and has no ads.</span>{' '}
            <Link href="/contribute/" className="inline-flex min-h-11 items-center font-semibold text-saffron-700 underline-offset-4 hover:underline dark:text-saffron-300">
              <span lang="hi" className="font-devanagari">इसे ऐसा बनाए रखने में सहयोग करें</span>
              <span aria-hidden="true" className="mx-1">·</span>
              <span lang="en">Help keep it that way →</span>
            </Link>{' '}
            <Link href="/about/funding/" className="inline-flex min-h-11 items-center text-xs underline underline-offset-4 hover:text-dharma-text">
              How it is funded
            </Link>
          </p>
        )}
        <SourcesAndInterpretation
          scriptureId={meta.id}
          scriptureTitle={meta.title}
          scriptureTitleSanskrit={meta.titleSanskrit}
          chapterId={chapter.id}
          className="mt-12"
        />
        <ChapterKeyboardNav prevHref={prevPartHref ?? prevHref} nextHref={nextPartHref ?? nextHref} />
        <ChapterVisitRecorder
          scriptureId={meta.id}
          scriptureTitle={meta.title}
          scriptureTitleSanskrit={meta.titleSanskrit}
          chapterId={chapter.id}
          chapterTitle={chapter.title || `अध्याय ${chapter.id}`}
          totalChapters={totalChapterCount}
        />
        </div>
      </div>
    </main>
  );
}
