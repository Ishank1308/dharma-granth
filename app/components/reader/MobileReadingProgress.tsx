'use client';

import React from 'react';
import { toAsciiDigits } from '@/lib/verse-format';

interface MobileReadingProgressProps {
  currentVerseNumber: number | string;
  totalVerses: number;
  currentIndex: number;
  chapterTitle?: string;
}

export function MobileReadingProgress({
  currentVerseNumber,
  totalVerses,
  currentIndex,
  chapterTitle,
}: MobileReadingProgressProps) {
  const validPosition = Number.isInteger(totalVerses) && totalVerses > 0
    && Number.isInteger(currentIndex) && currentIndex >= 0 && currentIndex < totalVerses;
  const position = validPosition ? currentIndex + 1 : undefined;
  const percent = position === undefined ? undefined : Math.round((position / totalVerses) * 100);
  const verseLabel = toAsciiDigits(currentVerseNumber);

  return (
    <div
      className="sticky top-[52px] z-30 border-b border-separator/40 bg-surface-canvas/95 backdrop-blur-md sm:hidden"
      role="region"
      aria-label="अध्याय पठन प्रगति"
    >
      <div className="flex items-center justify-between gap-2 px-3.5 py-1 text-xs font-medium text-dharma-muted">
        <span className="min-w-0 flex-1 truncate">
          {chapterTitle ? <span lang="hi" className="font-devanagari">{chapterTitle}</span> : 'प्रगति'}
        </span>
        <span aria-hidden="true" className="flex min-w-0 flex-wrap items-center justify-end gap-x-1.5 text-xs font-semibold tabular-nums text-dharma-text">
          <span lang="hi" className="font-devanagari">श्लोक {verseLabel}</span>
          {position !== undefined && percent !== undefined && (
            <>
              <span className="opacity-40">·</span>
              <span lang="hi" className="font-devanagari">क्रम {position} / {totalVerses}</span>
              <span className="rounded-md border border-dharma-border px-1 text-xs font-semibold">{percent}%</span>
            </>
          )}
        </span>
      </div>

      <div
        className="h-0.5 w-full overflow-hidden bg-dharma-text/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="अध्याय पठन प्रगति · Chapter reading progress"
        aria-valuetext={position === undefined || percent === undefined
          ? 'प्रगति उपलब्ध नहीं · Progress unavailable'
          : `श्लोक ${verseLabel}, क्रम ${position} / ${totalVerses}, ${percent}% · Verse ${verseLabel}, position ${position} of ${totalVerses}`}
      >
        <div
          className="h-full origin-left bg-dharma-saffron transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${(percent ?? 0) / 100})` }}
        />
      </div>
    </div>
  );
}
