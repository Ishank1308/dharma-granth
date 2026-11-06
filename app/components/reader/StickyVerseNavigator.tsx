'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Hash, Search } from 'lucide-react';
import { toAsciiDigits } from '@/lib/verse-format';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  verses: Array<{ number: number | string }>;
  activeVerseIndex: number;
  onSelectVerse: (verseNumber: number | string) => void;
  className?: string;
}

export function StickyVerseNavigator({
  verses,
  activeVerseIndex,
  onSelectVerse,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 4;
    setCanScrollLeft((prev) => (prev !== left ? left : prev));
    setCanScrollRight((prev) => (prev !== right ? right : prev));
  }, []);

  // Update scroll buttons state on scroll and resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, verses.length]);

  // Keep the active verse pill centered in the horizontal navigator
  useEffect(() => {
    if (activePillRef.current && containerRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeVerseIndex]);

  const scrollBy = (offset: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!verses || verses.length <= 1) return null;

  const currentVerse = verses[activeVerseIndex] || verses[0];

  return (
    <div
      aria-label="श्लोक नेविगेटर · Verse Navigator"
      className={`sticky top-14 sm:top-16 lg:top-[72px] z-20 w-full border-y border-stone-200/80 dark:border-stone-800/80 bg-white/98 dark:bg-[#151413]/98 shadow-xs transition-colors duration-200 ${className}`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-2 py-2 sm:px-4">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => {
            triggerTactileFeedback('selection', 'softTap');
            scrollBy(-200);
          }}
          disabled={!canScrollLeft}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200/70 bg-stone-100/70 text-dharma-muted shadow-2xs transition-all duration-150 hover:border-saffron-400 hover:bg-white hover:text-dharma-text active:scale-90 disabled:opacity-25 disabled:pointer-events-none dark:border-stone-800/70 dark:bg-stone-900/60 dark:hover:bg-stone-800"
          aria-label="Previous verses in bar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Horizontal Scrolling Pill Container with gradient mask */}
        <div
          ref={containerRef}
          className="flex flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth"
        >
          {verses.map((v, idx) => {
            const isActive = idx === activeVerseIndex;
            return (
              <button
                key={String(v.number)}
                ref={isActive ? activePillRef : null}
                type="button"
                onClick={() => {
                  triggerTactileFeedback('selection', 'softTap');
                  onSelectVerse(v.number);
                }}
                aria-current={isActive ? 'true' : undefined}
                className={`inline-flex min-h-[34px] min-w-[36px] shrink-0 items-center justify-center rounded-xl px-2.5 text-xs font-semibold transition-all duration-200 active:scale-90 ${
                  isActive
                    ? 'bg-gradient-to-r from-saffron-600 via-amber-600 to-orange-600 text-white shadow-sm ring-2 ring-saffron-400/50 font-bold scale-105'
                    : 'border border-stone-200/70 bg-stone-50/70 text-dharma-muted hover:border-saffron-400/60 hover:bg-white hover:text-dharma-text dark:border-stone-800/70 dark:bg-stone-900/40 dark:hover:bg-stone-850'
                }`}
                title={`श्लोक ${toAsciiDigits(v.number)}`}
              >
                {toAsciiDigits(v.number)}
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => {
            triggerTactileFeedback('selection', 'softTap');
            scrollBy(200);
          }}
          disabled={!canScrollRight}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200/70 bg-stone-100/70 text-dharma-muted shadow-2xs transition-all duration-150 hover:border-saffron-400 hover:bg-white hover:text-dharma-text active:scale-90 disabled:opacity-25 disabled:pointer-events-none dark:border-stone-800/70 dark:bg-stone-900/60 dark:hover:bg-stone-800"
          aria-label="Next verses in bar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Current Position Badge */}
        <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-saffron-200/80 bg-saffron-50/90 px-3 py-1 text-[11px] font-bold text-saffron-800 shadow-2xs dark:border-saffron-900/60 dark:bg-saffron-950/50 dark:text-saffron-200 sm:flex">
          <Hash className="h-3 w-3 text-saffron-600 dark:text-saffron-400" />
          <span>
            {toAsciiDigits(currentVerse.number)} / {verses.length}
          </span>
        </div>
      </div>
    </div>
  );
}
