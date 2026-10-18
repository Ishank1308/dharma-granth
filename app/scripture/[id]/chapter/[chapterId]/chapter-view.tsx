/**
 * The chapter page, shared by the chapter URL (part 1) and, for chapters
 * too large for one page, `part/[part]/` (see lib/chapter-parts).
 * Not a route file: page.tsx and part/[part]/page.tsx render it.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AmbientOrbs } from '@/app/components/motion/AmbientOrbs';
import { ChapterHero } from '@/app/components/motion/ChapterHero';
import { FullChapterVerses } from '@/app/components/FullChapterVerses';
import { ChapterOrientation } from '@/app/components/ChapterOrientation';
import { ChapterSummaryBox } from '@/app/components/ChapterSummaryBox';
import { getGitaChapterSummary } from '@/data/gita-chapter-summaries';
import { ChapterKeyboardNav } from '@/app/components/ChapterKeyboardNav';
import { ChapterCompletion } from '@/app/components/ChapterCompletion';
import { ChapterVisitRecorder } from '@/app/components/ChapterVisitRecorder';
import { FadeUpOnView } from '@/app/components/motion/primitives';
import { getScriptureMeta, getScriptureChapters } from '@/data/scriptures';
import {
  readChapterCommentary,
  readSeededChapter,
  readSeededChapterNumbers,
  readSeededChapterPreviews,
  type ChapterPreview,
} from '@/lib/read-seeded-chapters';
import type { InitialChapter } from '@/app/components/FullChapterVerses';
import type { HiCommentaryEntry } from '@/data/hi-commentary/_types';
import { ArrowLeft, ArrowRight, BookOpen, Layers, MessageCircle } from 'lucide-react';
import { ShareButton } from '@/app/components/ShareButton';
import { whatsappShareUrl } from '@/lib/whatsapp';
import { ChapterPartRedirect } from '@/app/components/ChapterPartRedirect';
import { SourcesAndInterpretation } from '@/app/components/SourcesAndInterpretation';
import { chapterPartHref, chapterParts, INLINE_CHAPTER_MAX_BYTES, type ChapterPart } from '@/lib/chapter-parts';

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
  return part.first === part.last ? part.first : `${part.first}–${part.last}`;
}

/** Every part of a split chapter, as compact links (current one marked). */
function PartsNav({ parts, current, href }: { parts: ChapterPart[]; current: number; href: (p: number) => string }) {
  return (
    <nav aria-label="अध्याय के भाग" className="mb-6 rounded-2xl border border-dharma-border bg-dharma-card p-4">
      <p lang="hi" className="mb-3 text-sm font-semibold text-dharma-text">
        यह अध्याय बड़ा है — {parts.length} भागों में पढ़ें
      </p>
      <ol className="flex flex-wrap gap-2">
        {parts.map((p) => (
          <li key={p.part}>
            <Link
              href={href(p.part)}
              aria-current={p.part === current ? 'page' : undefined}
              title={`श्लोक ${partRange(p)}`}
              className={`inline-flex items-baseline gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition ${
                p.part === current
                  ? 'border-saffron-500 bg-saffron-600 font-semibold text-white'
                  : 'border-dharma-border text-dharma-text hover:border-saffron-300'
              }`}
            >
              <span className="font-semibold">{p.part}</span>
              <span className={p.part === current ? 'text-white/80' : 'text-dharma-muted'}>{partRange(p)}</span>
            </Link>
          </li>
        ))}
      </ol>
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
  // Gita chapters describe themselves with their editorial summary (गीता सार); others with the first verse.
  const gitaSummary = meta.id === 'bhagavadgita' && !part ? getGitaChapterSummary(chapter.id)?.summaryHi : undefined;
  const opening = (gitaSummary || firstVerse?.hindi || firstVerse?.translation || chapter.summary || '').replace(/\s+/g, ' ').trim();
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
        }
      : undefined;
  const partHref = (p: number) => chapterPartHref(meta.id, chapterId, p);
  const prevPartHref = part && part.part > 1 ? partHref(part.part - 1) : undefined;
  const nextPartHref = part && parts && part.part < parts.length ? partHref(part.part + 1) : undefined;

  const prevHref = chapterId > 1 ? `/scripture/${params.id}/chapter/${chapterId - 1}` : undefined;
  const nextHref =
    chapterId < totalChapterCount ? `/scripture/${params.id}/chapter/${chapterId + 1}` : undefined;
  const prevLabel = prevHref ? neighbourLabel(meta.id, chapterId - 1) : undefined;
  const nextLabel = nextHref ? neighbourLabel(meta.id, chapterId + 1) : undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';
  // Share links are built here, at build time: the WhatsApp link is a plain anchor (no JS),
  // and the page's own canonical URL (with the trailing slash the site is served at) is what gets shared.
  const shareUrl = `${siteUrl}${chapterPartHref(meta.id, chapter.id, part?.part ?? 1)}/`;
  const shareHeading = `${meta.title} · ${chapter.title}${part ? ` (भाग ${part.part})` : ''}`;
  const shareSummary = (chapter.summary ?? '').replace(/\s+/g, ' ').trim();
  const shareLines = [shareSummary.length > 180 ? `${shareSummary.slice(0, 179).trimEnd()}…` : shareSummary];
  const whatsappHref = whatsappShareUrl({ heading: `${shareHeading} · Dharma Granth`, body: shareLines, url: shareUrl });
  const shareChip =
    'inline-flex min-h-[44px] items-center gap-1.5 px-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white';

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
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Scriptures', item: `${siteUrl}/scriptures` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: `${siteUrl}/scripture/${meta.id}` },
      {
        '@type': 'ListItem',
        position: 4,
        name: chapter.title,
        item: `${siteUrl}/scripture/${meta.id}/chapter/${chapter.id}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-dharma-bg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ChapterHero className="bg-gradient-to-br from-saffron-900 via-saffron-700 to-orange-600 text-white py-16">
        <div className="relative max-w-4xl mx-auto px-6">
          <Link href={`/scripture/${meta.id}`} className="inline-flex min-h-[44px] items-center gap-2 text-white/70 hover:text-white text-sm transition mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>{meta.title}</span>
            {meta.titleIast && <span className="opacity-75 italic font-serif">· {meta.titleIast}</span>}
          </Link>
          <div className="flex items-start gap-5 mb-4">
            <span className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/15 backdrop-blur text-white flex items-center justify-center text-2xl font-bold ring-1 ring-white/20 shadow-xl">
              {chapter.id}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase text-saffron-200/90 mb-1">अध्याय {chapter.id} / {totalChapterCount}</div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-1">{chapter.title}</h1>
              <p lang="sa" className="text-xl font-devanagari opacity-90">{chapter.titleSanskrit}</p>
            </div>
          </div>
          {chapter.summary ? (
            <p className="text-base opacity-80 max-w-3xl leading-relaxed">{chapter.summary}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {chapter.verseCount > 0 ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  {chapter.verseCount} श्लोक
                </span>
                {part && parts && (
                  <span lang="hi" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur text-xs font-semibold">
                    <Layers className="w-3.5 h-3.5" />
                    भाग {part.part}/{parts.length} · श्लोक {partRange(part)}
                  </span>
                )}
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                श्लोक पाठ अभी प्रकाशित नहीं है
              </span>
            )}
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={`Share ${shareHeading} on WhatsApp`} className={shareChip}>
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <ShareButton title={`${shareHeading} · Dharma Granth`} text={shareLines[0]} url={shareUrl} className={shareChip}>
              Share
            </ShareButton>
          </div>
        </div>
      </ChapterHero>

      <div className="relative max-w-4xl mx-auto px-4 py-8 sm:px-6 md:py-12">
        <AmbientOrbs />
        <div className="relative">
        {(!part || part.part === 1) && meta.id === 'bhagavadgita' && getGitaChapterSummary(chapter.id) && (
          <ChapterSummaryBox summary={getGitaChapterSummary(chapter.id)!} allHref={`/scripture/${meta.id}/summary`} />
        )}
        {(!part || part.part === 1) && (
          <ChapterOrientation
            scriptureId={meta.id}
            chapterId={chapter.id}
            verseCount={chapter.verseCount}
            firstVerseHref={`/scripture/${meta.id}/chapter/${chapter.id}/verse/1`}
          />
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
        {/* With initialChapter, the reader's server render is the plain
            VerseText list (every verse in the HTML); it swaps in the
            interactive cards once hydrated. */}
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
        />

        {part && parts && (
          <nav className="mt-10 flex items-stretch justify-between gap-4" aria-label="इस अध्याय के भाग">
            {prevPartHref ? (
              <Link
                href={prevPartHref}
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

        <FadeUpOnView className="mt-14 flex items-stretch justify-between gap-4">
          {prevHref ? (
            <Link
              href={prevHref}
              aria-keyshortcuts="ArrowLeft"
              className="group inline-flex min-w-0 max-w-[48%] items-center gap-2 px-5 py-3 rounded-xl border border-dharma-border bg-dharma-card text-dharma-text hover:bg-dharma-bg hover:border-saffron-300 hover:shadow-md transition"
            >
              <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span className="min-w-0">
                <span className="block text-[10px] uppercase text-dharma-muted">पिछला</span>
                <span className="block text-sm font-semibold">अध्याय {chapterId - 1}</span>
                {prevLabel && (
                  <span className="block truncate text-xs text-dharma-muted">{prevLabel}</span>
                )}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextHref && (
            <Link
              href={nextHref}
              aria-keyshortcuts="ArrowRight"
              className="group inline-flex min-w-0 max-w-[48%] items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-saffron-600 to-saffron-700 text-white hover:shadow-lg transition ml-auto"
            >
              <span className="min-w-0 text-right">
                <span className="block text-[10px] uppercase opacity-80">अगला</span>
                <span className="block text-sm font-semibold">अध्याय {chapterId + 1}</span>
                {nextLabel && (
                  <span className="block truncate text-xs opacity-80">{nextLabel}</span>
                )}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </FadeUpOnView>
        {(prevHref || nextHref) && (
          <p className="mt-3 hidden text-center text-xs text-dharma-muted md:block">
            कीबोर्ड: <kbd className="rounded border border-dharma-border px-1 font-mono">←</kbd>{' '}
            <kbd className="rounded border border-dharma-border px-1 font-mono">→</kbd> से अध्याय बदलें
          </p>
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
