'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { STATUS_LABEL, type AshtavakraChapterMeta } from '@/data/ashtavakra/chapters-meta';
import { useAshRead } from '@/lib/ashtavakra-progress';

export interface PathChapter extends AshtavakraChapterMeta {
  /** Verse ids of a published chapter. Empty otherwise. */
  ids: string[];
}

/**
 * Use the same responsive chapter-card language as the scripture catalogue.
 * Preserve the Ashtavakra-specific published/verification/read markers without
 * the former connected timeline, which looked unrelated to other scriptures.
 */
export function ChapterPath({ chapters }: { chapters: PathChapter[] }) {
  const { ids: read, ready } = useAshRead();
  const readIds = new Set(read);

  return (
    <ol className="reveal-grid grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="अष्टावक्र गीता के प्रकरण। प्रकाशित प्रकरण खुलते हैं। शेष स्थल पर नहीं हैं।">
      {chapters.map((chapter) => {
        const published = chapter.status === 'published';
        const done = ready ? chapter.ids.filter((id) => readIds.has(id)).length : 0;
        const body = (
          <>
            <span className="vibe-num flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-500/10 font-serif text-lg font-bold text-saffron-700 dark:text-saffron-300" aria-hidden="true">
              {chapter.number}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2 text-xs font-semibold text-dharma-muted">
                <span>{chapter.bookTitle}</span>
                <span className="rounded-full border border-dharma-border px-2 py-0.5">{STATUS_LABEL[chapter.status]}</span>
              </span>
              <span className="mt-1 block break-words font-serif text-lg font-bold text-dharma-text">{chapter.title}</span>
              <span lang="hi" className="mt-1 block font-devanagari text-sm leading-relaxed text-dharma-muted">{chapter.essence}</span>
              <span className="mt-2 block text-xs text-dharma-muted">
                {chapter.verifiedVerseCount ? `${chapter.verifiedVerseCount} श्लोक` : 'श्लोक-संख्या अभी सत्यापित नहीं'}
                {published && ready ? ` · पढ़ा गया ${done} / ${chapter.ids.length}` : ''}
              </span>
            </span>
            {published ? <ChevronRight className="h-5 w-5 shrink-0 text-saffron-700 dark:text-saffron-300" aria-hidden="true" /> : <BookOpen className="h-5 w-5 shrink-0 text-dharma-muted/60" aria-hidden="true" />}
          </>
        );
        const common = 'vibe-card group relative flex min-h-[104px] items-center gap-4 rounded-2xl border bg-dharma-card p-4';
        return (
          <li key={chapter.number}>
            {published ? (
              <Link
                href={`/ashtavakra/${chapter.number}/`}
                className={`${common} border-dharma-border hover:border-saffron-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2`}
                aria-label={`${chapter.bookTitle}: ${chapter.title}`}
              >
                {body}
              </Link>
            ) : (
              <div className={`${common} border-dharma-border/60 opacity-70`} aria-label={`${chapter.bookTitle}: अभी प्रकाशित नहीं`}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
