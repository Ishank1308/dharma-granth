'use client';

/**
 * Svaadhyaya Engine (स्वाध्याय यन्त्र) — virtualized scripture stream with
 * synchronized chanting.
 *
 * - `@tanstack/react-virtual` renders only the rows in (and just outside) the
 *   viewport, so DOM memory stays flat whether a chapter holds 20 verses
 *   (Īśā Upaniṣad) or 700 (Mahābhārata cantos): mounted nodes ≈ viewport rows,
 *   never chapter size.
 * - Dynamic row heights: verse cards expand/collapse their अर्थ / व्याख्या /
 *   विज्ञान tabs and the virtualizer re-measures each row via
 *   `measureElement` + `ResizeObserver`.
 * - While chanting plays, the stream auto-scrolls to keep the recited verse
 *   centered (`scrollToIndex`, smooth).
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useChantingPlayback } from '@/lib/svaadhyaya/useChantingPlayback';
import type {
  AudioUrlResolver,
  SvaadhyayaVerse,
  VerseTimingTrack,
} from '@/lib/svaadhyaya/types';
import { VerseRow } from './VerseRow';
import { ChantingHud } from './ChantingHud';

export interface SvaadhyayaEngineProps {
  /** e.g. "श्रीमद्भगवद्गीता" */
  scriptureTitleHi: string;
  scriptureTitleEn: string;
  /** e.g. "अध्याय २ · सांख्ययोग" */
  chapterLabelHi?: string;
  chapterLabelEn?: string;
  verses: SvaadhyayaVerse[];
  tracks?: VerseTimingTrack[];
  audioResolver?: AudioUrlResolver;
  className?: string;
}

const ESTIMATED_ROW_HEIGHT = 340;
const ROW_GAP_PX = 16;

export function SvaadhyayaEngine({
  scriptureTitleHi,
  scriptureTitleEn,
  chapterLabelHi,
  chapterLabelEn,
  verses,
  tracks,
  audioResolver,
  className = '',
}: SvaadhyayaEngineProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef(true);

  const virtualizer = useVirtualizer({
    count: verses.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 6,
    gap: ROW_GAP_PX,
    paddingStart: 8,
    paddingEnd: 140, // breathing room above the floating HUD
  });

  const playback = useChantingPlayback({
    verses,
    tracks,
    audioResolver,
    onVerseChange: useCallback(
      (index: number) => {
        // Keep the recited verse centered while playing; never fight the reader.
        if (autoScrollRef.current) {
          virtualizer.scrollToIndex(index, { align: 'center', behavior: 'smooth' });
        }
      },
      // scrollToIndex is a stable instance method of the virtualizer
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
  });

  // Pause auto-centering while the user is actively scrolling, resume on idle.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let idle: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      autoScrollRef.current = false;
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => {
        autoScrollRef.current = true;
      }, 2500);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (idle) clearTimeout(idle);
    };
  }, []);

  const items = virtualizer.getVirtualItems();

  return (
    <div className={`relative flex h-full flex-col ${className}`}>
      {/* Chapter masthead */}
      <header className="border-b border-dharma-border/70 bg-dharma-card/80 px-4 py-3 backdrop-blur sm:px-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
          Svaadhyaya · स्वाध्याय
        </p>
        <h1 className="font-devanagari text-lg font-bold text-dharma-text sm:text-xl">
          {scriptureTitleHi}
          {chapterLabelHi ? ` — ${chapterLabelHi}` : ''}
        </h1>
        <p className="text-[11px] text-dharma-muted">
          {scriptureTitleEn}
          {chapterLabelEn ? ` · ${chapterLabelEn}` : ''} · {verses.length} verses
        </p>
      </header>

      {/* Virtualized verse stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6"
        role="feed"
        aria-busy={false}
        aria-label={`${scriptureTitleEn} verse stream`}
      >
        <div
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize(), contain: 'strict' }}
        >
          {items.map((vi) => {
            const verse = verses[vi.index];
            return (
              <div
                key={vi.key}
                data-index={vi.index}
                ref={virtualizer.measureElement}
                className="absolute left-0 top-0 w-full"
                style={{ transform: `translateY(${vi.start}px)` }}
              >
                <VerseRow
                  verse={verse}
                  track={playback.getTrack(vi.index)}
                  playingVerseIndex={playback.state.currentVerseIndex}
                  rowIndex={vi.index}
                  activeWordIndex={
                    playback.state.currentVerseIndex === vi.index
                      ? playback.state.activeWordIndex
                      : -1
                  }
                  verseProgress={
                    playback.state.currentVerseIndex === vi.index ? playback.state.verseProgress : 0
                  }
                  isPaused={!playback.state.isPlaying}
                  onPlayVerse={(i) =>
                    playback.state.isPlaying && playback.state.currentVerseIndex === i
                      ? playback.controls.pause()
                      : playback.controls.playVerse(i)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <ChantingHud
        scriptureTitleHi={scriptureTitleHi}
        chapterLabelHi={chapterLabelHi}
        verses={verses}
        playback={playback}
      />
    </div>
  );
}
