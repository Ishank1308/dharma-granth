'use client';

import { useRef, type KeyboardEvent } from 'react';
import { READING_DEPTHS, useReadingDepth } from '@/lib/reading-depth';

/** Read / Understand / Study: one keyboard-operable radio group for the chapter's reading depth. */
export function ReadingDepthSwitch({ className = '' }: { className?: string }) {
  const [depth, setDepth] = useReadingDepth();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const onRadioKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = READING_DEPTHS.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (index + 1) % READING_DEPTHS.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (index + last) % READING_DEPTHS.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }
    // Chapter-level arrow shortcuts must not navigate away while this radio group has focus.
    event.preventDefault();
    event.stopPropagation();
    setDepth(READING_DEPTHS[next].id);
    buttons.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Reading depth · पठन गहराई" className={`inline-flex rounded-xl border border-dharma-border bg-dharma-bg p-0.5 ${className}`}>
      {READING_DEPTHS.map((d, index) => {
        const on = d.id === depth;
        return (
          <button
            key={d.id}
            ref={(el) => { buttons.current[index] = el; }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            title={d.hint}
            onClick={() => setDepth(d.id)}
            onKeyDown={(event) => onRadioKeyDown(event, index)}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-track px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 on ? 'bg-saffron-600 text-white shadow-sm' : 'text-dharma-text hover:bg-saffron-50 dark:hover:bg-saffron-950/30'`}
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
