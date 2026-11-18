'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { STATUS_LABEL, type AshtavakraChapterMeta } from '@/data/ashtavakra/chapters-meta';
import { useAshRead } from '@/lib/ashtavakra-progress';

export interface PathChapter extends AshtavakraChapterMeta {
  /** Published verse IDs; an empty array indicates an unpublished chapter. */
  ids: string[];
}

/**
 * The same two-column, accessible chapter-card pattern as ScriptureContents.
 * Keep the Ashtavakra-specific editorial labels, verified verse counts and
 * local reading history, but not the separate animated vertical timeline.
 */
export function ChapterPath({ chapters }: { chapters: PathChapter[] }) {
  const { ids: read, ready } = useAshRead();
  const readIds = new Set(read);
  const firstOpen = chapters.find(
    (chapter) => chapter.status === 'published' && chapter.ids.some((id) => !readIds.has(id)),
  )?.number;

  return (
    <ol
      className="reveal-grid grid grid-cols-1 gap-3 sm:grid-cols-2"
      aria-label="अष्टावक्र गीता के प्रकरण। प्रकाशित प्रकरण खुलते हैं। शेष स्थल पर नहीं हैं।"
    >
      {chapters.map((chapter) => {
        const published = chapter.status === 'published';
        const readCount = ready ? chapter.ids.filter((id) => readIds.has(id)).length : 0;
        const allRead = published && ready && chapter.ids.length > 0 && readCount === chapter.ids.length;
        const partiallyRead = published && ready && readCount > 0 && !allRead;
        const contents = (
          <>
            <span className="vibe-num flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dharma-saffron/10 font-serif text-lg font-bold text-dharma-saffron" aria-hidden="true">
              {chapter.number}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-dharma-muted">{chapter.bookTitle}</span>
                <span className="rounded-full border border-dharma-border bg-dharma-bg/70 px-2 py-0.5 text-[11px] font-semibold text-dharma-muted">
                  {STATUS_LABEL[chapter.status]}
                </span>
                {allRead && (
                  <span className="rounded-full border border-dharma-saffron/30 bg-dharma-saffron/10 px-2 py-0.5 text-[11px] font-semibold text-dharma-saffron">
                    पढ़ा हुआ
                  </span>
                )}
              </span>
              <span lang="hi" className="mt-1 block break-words font-devanagari text-lg font-semibold leading-relaxed text-dharma-text">
                {chapter.title}
              </span>
              <span lang="hi" className="mt-1 block font-devanagari text-sm leading-relaxed text-dharma-muted">
                {chapter.essence}
              </span>
              <span className="mt-2 block text-xs text-dharma-muted">
                {chapter.verifiedVerseCount
                  ? `${chapter.verifiedVerseCount} श्लोक`
                  : 'श्लोक-संख्या अभी सत्यापित नहीं'}
                {published && ready && ` · पढ़े गए ${readCount} / ${chapter.ids.length}`}
              </span>
              {published && (
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-dharma-saffron">
                  {partiallyRead ? 'पढ़ना जारी रखें' : 'प्रकरण खोलें'}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              )}
            </span>
          </>
        );
        return (
          <li key={chapter.number} className="min-w-0">
            {published ? (
              <Link
                href={`/ashtavakra/${chapter.number}/`}
                data-ready="true"
                data-read={allRead || readCount > 0 ? 'true' : 'false'}
                aria-label={`${chapter.bookTitle}: ${chapter.title}`}
                className={`vibe-card focus-ring group flex h-full min-h-[146px] items-start gap-3 rounded-2xl border bg-dharma-card p-4 transition-colors hover:border-dharma-saffron hover:shadow-raised sm:gap-4 sm:p-5 ${chapter.number === firstOpen ? 'border-dharma-saffron/50' : 'border-dharma-border'}`}
              >
                {contents}
              </Link>
            ) : (
              <div data-ready="false" className="flex h-full min-h-[146px] items-start gap-3 rounded-2xl border border-dharma-border bg-dharma-card-soft/70 p-4 opacity-80 sm:gap-4 sm:p-5">
                {contents}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
