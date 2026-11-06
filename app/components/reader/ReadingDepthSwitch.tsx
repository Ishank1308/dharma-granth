'use client';

import { READING_DEPTHS, useReadingDepth } from '@/lib/reading-depth';

/** Read / Understand / Study: one control for how much explanation appears beside the scripture. */
export function ReadingDepthSwitch({ className = '' }: { className?: string }) {
  const [depth, setDepth] = useReadingDepth();

  return (
    <div role="radiogroup" aria-label="Reading depth · पठन गहराई" className={`inline-flex rounded-xl border border-dharma-border bg-dharma-bg p-0.5 ${className}`}>
      {READING_DEPTHS.map((d) => {
        const on = d.id === depth;
        return (
          <button
            key={d.id}
            type="button"
            role="radio"
            aria-checked={on}
            title={d.hint}
            onClick={() => setDepth(d.id)}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-track px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 sm:min-h-[32px] ${
              on ? 'bg-saffron-600 text-white shadow-sm' : 'text-dharma-text hover:bg-saffron-50 dark:hover:bg-saffron-950/30'
            }`}
          >
            <span lang="hi" className="font-devanagari">{d.hi}</span>
            {/* A flex gap separates the words on screen; this space separates them for screen readers and copy. */}
            <span className="sr-only">{'\u00a0'}</span>
            <span className="hidden sm:inline">{d.en}</span>
          </button>
        );
      })}
    </div>
  );
}
