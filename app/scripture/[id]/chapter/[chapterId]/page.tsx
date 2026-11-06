import type { Metadata } from 'next';
import { getAllScriptures, getScriptureChapters } from '@/data/scriptures';
import { readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { ChapterView, chapterMetadata, type ChapterParams } from './chapter-view';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { getScriptureMeta } from '@/data/scriptures';
import { chapterHasMeaning } from '@/lib/verse-meaning';
import { OriginalOnlyNotice } from './original-only-notice';

interface PageProps {
  params: ChapterParams;
}

export function generateStaticParams() {
  const params: ChapterParams[] = [];
  for (const meta of getAllScriptures()) {
    const seen = new Set<string>();
    for (const ch of getScriptureChapters(meta.id)) {
      const cid = String(ch.id);
      if (!seen.has(cid)) {
        params.push({ id: meta.id, chapterId: cid });
        seen.add(cid);
      }
    }
    // Also emit params for chapters that exist only in the seeded
    // full-text JSON. For scriptures whose curated TS module covers
    // fewer chapters than were seeded (e.g. yajurveda's curated 1–4 vs
    // seeded 1–40), this is what makes the seeded chapters reachable
    // as static pages.
    for (const n of readSeededChapterNumbers(meta.id)) {
      const cid = String(n);
      if (!seen.has(cid)) {
        params.push({ id: meta.id, chapterId: cid });
        seen.add(cid);
      }
    }
    // The old 'yogavasistha' spelling is a 301 in public/_redirects, not a page.
  }
  return params;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const metadata = chapterMetadata(params, 1);
  // Original text only: kept out of the index (and the sitemap) until a meaning is written.
  return chapterHasMeaning(params.id, parseInt(params.chapterId, 10))
    ? metadata
    : { ...metadata, robots: { index: false, follow: true } };
}

/** The chapter (or, for chapters split into parts, its first part). */
export default function ChapterPage({ params }: PageProps) {
  const meta = getScriptureMeta(params.id);
  const chapterNumber = parseInt(params.chapterId, 10);
  const indexed = getScriptureChapters(params.id).find((c) => c.id === chapterNumber);
  const chapterTitle = indexed?.title || `Chapter ${params.chapterId}`;
  return (
    <>
      {meta ? (
        <Breadcrumbs
          items={[
            { label: 'Library', href: '/scriptures/' },
            { label: meta.title, href: `/scripture/${meta.id}/` },
            { label: chapterTitle },
          ]}
        />
      ) : null}
      {chapterHasMeaning(params.id, chapterNumber) ? null : <OriginalOnlyNotice />}
      <ChapterView params={params} part={1} />
    </>
  );
}
