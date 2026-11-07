'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react';
import { toAsciiDigits } from '@/lib/verse-format';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface CarouselVerseItem {
  number: number | string;
  href: string;
  preview?: string;
  isBookmarked?: boolean;
}

interface MobileVerseCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  verses: CarouselVerseItem[];
  currentVerseNumber: number | string;
  chapterTitle?: string;
  scriptureTitle?: string;
}

export function MobileVerseCarousel({
  isOpen,
  onClose,
  verses,
  currentVerseNumber,
  chapterTitle,
  scriptureTitle,
}: MobileVerseCarouselProps) {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLAnchorElement | null>(null);
  const [filterText, setFilterText] = useState('');

  // Auto-scroll active verse pill to center when drawer opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (activeBtnRef.current) {
          activeBtnRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentVerseNumber]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectVerse = useCallback(
    (href: string) => {
      triggerTactileFeedback('selection', 'click');
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const filteredVerses = filterText.trim()
    ? verses.filter((v) => String(v.number).includes(filterText.trim()))
    : verses;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-carousel-title"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity sm:hidden"
    >
      {/* Backdrop button to dismiss */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="पटल बंद करें"
        className="absolute inset-0 -z-10 h-full w-full cursor-default bg-transparent outline-none"
        onClick={onClose}
      />

      {/* Bottom Sheet Drawer */}
      <div
        className="relative max-h-[85vh] w-full rounded-t-3xl border-t border-dharma-border/80 bg-dharma-card p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform"
      >
        {/* Grab Handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-dharma-border/80" aria-hidden="true" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dharma-border/60">
          <div>
            <h3 id="mobile-carousel-title" className="font-serif text-base font-bold text-dharma-text">
              <span className="font-devanagari">श्लोक अन्वेषक</span>
            </h3>
            <p className="text-xs text-dharma-muted">
              {scriptureTitle ? `${scriptureTitle} · ` : ''}
              {chapterTitle ?? 'अध्याय'} ({verses.length} श्लोक)
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerTactileFeedback('light', 'softTap');
              onClose();
            }}
            aria-label="बंद करें"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-dharma-border/80 bg-dharma-bg text-dharma-muted transition hover:text-dharma-text"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Quick Search & Jump */}
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-dharma-muted" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="श्लोक संख्या खोजें..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="h-9 w-full rounded-xl border border-dharma-border bg-dharma-bg pl-9 pr-3 text-sm text-dharma-text outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20"
            />
          </div>
          {filterText && (
            <button
              type="button"
              onClick={() => setFilterText('')}
              className="px-2.5 py-1 text-xs font-semibold text-dharma-muted"
            >
              हटाएं
            </button>
          )}
        </div>

        {/* Rapid Jump Shortcuts */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-dharma-muted">
          {verses[0] && (
            <button
              type="button"
              onClick={() => handleSelectVerse(verses[0].href)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 font-devanagari font-semibold text-saffron-700 hover:bg-saffron-500/10 dark:text-saffron-300"
            >
              <ChevronLeft className="h-3 w-3" /> प्रथम श्लोक ({toAsciiDigits(verses[0].number)})
            </button>
          )}
          {verses[verses.length - 1] && (
            <button
              type="button"
              onClick={() => handleSelectVerse(verses[verses.length - 1].href)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 font-devanagari font-semibold text-saffron-700 hover:bg-saffron-500/10 dark:text-saffron-300"
            >
              अंतिम श्लोक ({toAsciiDigits(verses[verses.length - 1].number)}) <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Horizontal Tactile Verse Carousel */}
        <div className="mt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dharma-muted">
            <span className="font-devanagari">त्वरित माला (क्षैतिज स्क्रॉल)</span>
          </p>
          <div
            ref={listRef}
            className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {verses.map((v) => {
              const isCurrent = String(v.number) === String(currentVerseNumber);
              return (
                <Link
                  key={String(v.number)}
                  ref={isCurrent ? activeBtnRef : undefined}
                  href={v.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectVerse(v.href);
                  }}
                  className={`group relative flex h-14 min-w-[54px] shrink-0 snap-center flex-col items-center justify-center rounded-2xl border transition-all ${
                    isCurrent
                      ? 'scale-105 border-saffron-500 bg-gradient-to-b from-saffron-600 to-amber-700 text-white shadow-lg ring-4 ring-saffron-500/20'
                      : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400/80 hover:bg-dharma-card'
                  }`}
                >
                  <span className="font-devanagari text-xs font-bold leading-tight">
                    {toAsciiDigits(v.number)}
                  </span>
                  <span className={`text-[10px] font-mono leading-none ${isCurrent ? 'text-amber-100' : 'text-dharma-muted'}`}>
                    v{v.number}
                  </span>
                  {isCurrent && (
                    <span className="absolute -top-1.5 flex h-3 w-3 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Complete Verse Grid for larger jumps */}
        <div className="mt-2 max-h-48 overflow-y-auto border-t border-dharma-border/50 pt-2.5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-dharma-muted">
            <span className="font-devanagari">सभी श्लोक तालिका</span>
          </p>
          <div className="grid grid-cols-6 gap-1.5">
            {filteredVerses.map((v) => {
              const isCurrent = String(v.number) === String(currentVerseNumber);
              return (
                <button
                  key={`grid-${v.number}`}
                  type="button"
                  onClick={() => handleSelectVerse(v.href)}
                  className={`flex h-10 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                    isCurrent
                      ? 'border-saffron-500 bg-saffron-600 font-extrabold text-white shadow-md'
                      : 'border-dharma-border/70 bg-dharma-bg text-dharma-text hover:border-saffron-400'
                  }`}
                >
                  <span className="font-devanagari">{toAsciiDigits(v.number)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
