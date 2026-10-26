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
      className="relative z-30 border-b border-dharma-border/60 bg-dharma-card/60 backdrop-blur-sm sm:hidden"
      role="region"
      aria-label="अध्याय पठन प्रगति"
    >
      <div className="flex items-center justify-between px-3.5 py-1 text-[11px] font-medium text-dharma-muted">
        <span className="truncate max-w-[60%]">
          {chapterTitle ? <span className="font-devanagari">{chapterTitle}</span> : 'प्रगति'}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
          <span className="font-devanagari">श्लोक {toAsciiDigits(currentVerseNumber)}</span>
          <span className="opacity-40">/</span>
          <span className="font-devanagari">{toAsciiDigits(totalVerses)}</span>
          <span className="rounded-md bg-saffron-500/10 px-1 py-0.2 text-[10px] font-bold text-saffron-700 dark:text-saffron-400">
            {percent}%
          </span>
        </span>
      </div>

      <div
        className="h-1 w-full overflow-hidden bg-dharma-border/40"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`अध्याय पठन प्रगति: ${percent}%`}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-saffron-500 to-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
