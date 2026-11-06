'use client';

import { useMemo } from 'react';
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
  const percent = useMemo(() => {
    if (totalVerses <= 0) return 0;
    return Math.min(100, Math.round(((currentIndex + 1) / totalVerses) * 100));
  }, [currentIndex, totalVerses]);

  return (
    <div
      className="relative z-30 sm:hidden"
      role="region"
      aria-label="अध्याय पठन प्रगति"
    >
      <div className="flex items-center justify-between px-3.5 py-1 text-[11px] font-medium text-dharma-muted">
        <span className="truncate max-w-[60%]">
          {chapterTitle ? <span className="font-devanagari">{chapterTitle}</span> : 'प्रगति'}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-dharma-saffron">
          <span className="font-devanagari">श्लोक {toAsciiDigits(currentVerseNumber)}</span>
          <span className="opacity-40">/</span>
          <span className="font-devanagari">{toAsciiDigits(totalVerses)}</span>
          <span className="rounded-md bg-dharma-saffron/10 px-1 text-[10px] font-semibold">
            {percent}%
          </span>
        </span>
      </div>

      <div
        className="h-0.5 w-full overflow-hidden bg-dharma-text/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`अध्याय पठन प्रगति: ${percent}%`}
      >
        <div
          className="h-full bg-dharma-saffron transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
