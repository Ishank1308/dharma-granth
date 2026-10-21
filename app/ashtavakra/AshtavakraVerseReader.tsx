'use client';

import { useState, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Grid, Disc, Sparkles } from 'lucide-react';
import { toAsciiDigits } from '@/lib/verse-format';
import { triggerTactileFeedback } from '@/lib/haptics';
import { useSwipeGesture } from '@/lib/useSwipeGesture';
import { MobileSwipeIndicator } from '@/app/components/reader/MobileSwipeIndicator';
import { MobileReadingProgress } from '@/app/components/reader/MobileReadingProgress';
import { MobileVerseCarousel, type CarouselVerseItem } from '@/app/components/reader/MobileVerseCarousel';
import { MobileAudioPill } from '@/app/components/reader/MobileAudioPill';
import type { AshtavakraVerse } from '@/lib/ashtavakra';

interface AshtavakraVerseReaderProps {
  verse: AshtavakraVerse;
  chapterNumber: number;
  chapterTitle: string;
  bookTitle: string;
  totalVerses: number;
  currentIndex: number;
  allVerses: CarouselVerseItem[];
  prev?: { verseNumber: string; href: string; crossesChapter?: boolean };
  next?: { verseNumber: string; href: string; crossesChapter?: boolean };
  children: ReactNode;
}

export function AshtavakraVerseReader({
  verse,
  chapterNumber,
  chapterTitle,
  bookTitle,
  totalVerses,
  currentIndex,
  allVerses,
  prev,
  next,
  children,
}: AshtavakraVerseReaderProps) {
  const router = useRouter();
  const [carouselOpen, setCarouselOpen] = useState(false);

  const prevVerseNum = prev ? prev.verseNumber.split('.')[1] : undefined;
  const nextVerseNum = next ? next.verseNumber.split('.')[1] : undefined;
  const currentVerseNum = verse.verseNumber.split('.')[1];

  // Touch Swipe Gesture Engine
  const { gestureState, handlers } = useSwipeGesture({
    onSwipeNext: () => {
      if (next) router.push(next.href);
    },
    onSwipePrev: () => {
      if (prev) router.push(prev.href);
    },
    canNext: Boolean(next),
    canPrev: Boolean(prev),
    disabled: carouselOpen,
  });

  const handleNavClick = useCallback(
    (href: string) => {
      triggerTactileFeedback('selection', 'click');
      router.push(href);
    },
    [router],
  );

  return (
    <div className="relative min-h-screen" {...handlers}>
      {/* Mobile Reading Progress Bar */}
      <MobileReadingProgress
        currentVerseNumber={currentVerseNum}
        totalVerses={totalVerses}
        currentIndex={currentIndex}
        chapterTitle={`प्रकरण ${chapterNumber}: ${bookTitle}`}
      />

      {/* Tactile Edge Swipe Visual Cue */}
      <MobileSwipeIndicator
        gestureState={gestureState}
        prevNumber={prev?.crossesChapter ? prev.verseNumber : prevVerseNum}
        nextNumber={next?.crossesChapter ? next.verseNumber : nextVerseNum}
      />

      {/* Main Content */}
      <div className="pb-28 sm:pb-16">{children}</div>

      {/* Mobile: Sticky One-Handed Bottom Navigation Bar */}
      <nav
        aria-label="अष्टावक्र श्लोक नेविगेशन"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ash-line)] bg-[var(--ash-bg)]/95 backdrop-blur-lg sm:hidden"
      >
        <div className="flex items-center justify-between gap-2 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2">
          {prev ? (
            <button
              type="button"
              onClick={() => handleNavClick(prev.href)}
              aria-label={prev.crossesChapter ? `पिछला प्रकरण, श्लोक ${prev.verseNumber}` : `पिछला श्लोक ${prev.verseNumber}`}
              className="ash-btn flex min-h-[48px] items-center gap-1.5 px-3 font-semibold transition active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--ash-accent)]" />
              <span className="text-xs font-devanagari">
                {toAsciiDigits(prev.crossesChapter ? prev.verseNumber : (prevVerseNum ?? ''))}
              </span>
            </button>
          ) : (
            <span className="w-16" aria-hidden="true" />
          )}

          {/* Center Verse Picker Button */}
          <button
            type="button"
            onClick={() => {
              triggerTactileFeedback('selection', 'click');
              setCarouselOpen(true);
            }}
            aria-haspopup="dialog"
            aria-label="श्लोक माला खोलें"
            className="flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center rounded-2xl border border-[var(--ash-line)] bg-[var(--ash-card)] px-2.5 py-1 text-center shadow-sm transition active:scale-95"
          >
            <span lang="hi" className="font-devanagari text-sm font-bold text-[var(--ash-ink)]">
              श्लोक {toAsciiDigits(verse.verseNumber)}
            </span>
            <span className="text-[10px] font-semibold text-[var(--ash-accent)]">
              {currentIndex + 1} / {totalVerses} · माला खोलें
            </span>
          </button>

          {next ? (
            <button
              type="button"
              onClick={() => handleNavClick(next.href)}
              aria-label={next.crossesChapter ? `अगला प्रकरण, श्लोक ${next.verseNumber}` : `अगला श्लोक ${next.verseNumber}`}
              className="ash-btn flex min-h-[48px] items-center gap-1.5 px-3 font-semibold transition active:scale-95"
            >
              <span className="text-xs font-devanagari">
                {toAsciiDigits(next.crossesChapter ? next.verseNumber : (nextVerseNum ?? ''))}
              </span>
              <ArrowRight className="h-4 w-4 text-[var(--ash-accent)]" />
            </button>
          ) : (
            <span className="w-16" aria-hidden="true" />
          )}
        </div>
      </nav>

      {/* Mobile Verse Carousel Bottom Sheet */}
      <MobileVerseCarousel
        isOpen={carouselOpen}
        onClose={() => setCarouselOpen(false)}
        verses={allVerses}
        currentVerseNumber={verse.verseNumber.split('.')[1]}
        chapterTitle={`प्रकरण ${chapterNumber} · ${bookTitle}`}
        scriptureTitle="अष्टावक्र गीता"
      />

      <MobileAudioPill />
    </div>
  );
}
