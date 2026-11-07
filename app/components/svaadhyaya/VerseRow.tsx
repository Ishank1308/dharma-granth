'use client';

/**
 * Svaadhyaya Engine — one verse row of the virtualized stream.
 *
 * Renders the canonical verse with the synchronized word grid: each IAST word
 * is a timed pill from the verse's `TimedWord[]` track; the active word
 * receives a gentle golden glow (#D97706) with a spring-soft transition as
 * pronunciation advances (driven by `useChantingPlayback` at 60 fps).
 *
 * Row height is dynamic: opening the अर्थ / व्याख्या / विज्ञान tabs expands
 * the card, and the parent virtualizer re-measures via `measureElement`.
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, BookOpen, Lightbulb, FlaskConical, ChevronDown } from 'lucide-react';
import type { SvaadhyayaVerse, VerseTimingTrack } from '@/lib/svaadhyaya/types';
import { splitWords } from '@/lib/svaadhyaya/timing';

export type VerseTab = 'artha' | 'vyakhya' | 'vigyana';

interface VerseRowProps {
  verse: SvaadhyayaVerse;
  track: VerseTimingTrack;
  /** Index of the currently playing verse in the chapter, -1 when idle. */
  playingVerseIndex: number;
  /** This row's index in the chapter. */
  rowIndex: number;
  /** Word currently recited within the playing verse. */
  activeWordIndex: number;
  /** 0..1 progress inside the playing verse. */
  verseProgress: number;
  isPaused: boolean;
  onPlayVerse(index: number): void;
}

const TABS: Array<{ id: VerseTab; labelHi: string; labelEn: string; icon: typeof BookOpen }> = [
  { id: 'artha', labelHi: 'अर्थ', labelEn: 'Artha', icon: BookOpen },
  { id: 'vyakhya', labelHi: 'व्याख्या', labelEn: 'Vyakhya', icon: Lightbulb },
  { id: 'vigyana', labelHi: 'विज्ञान', labelEn: 'Vigyana', icon: FlaskConical },
];

function tabContent(verse: SvaadhyayaVerse, tab: VerseTab): { hi?: string; en?: string } {
  switch (tab) {
    case 'artha':
      return { hi: verse.arthaHi, en: verse.arthaEn };
    case 'vyakhya':
      return { en: verse.vyakhya };
    case 'vigyana':
      return { en: verse.vigyana };
  }
}

export const VerseRow = React.forwardRef<HTMLElement, VerseRowProps>(function VerseRow(
  {
    verse,
    track,
    playingVerseIndex,
    rowIndex,
    activeWordIndex,
    verseProgress,
    isPaused,
    onPlayVerse,
  },
  ref,
) {
  const [openTab, setOpenTab] = useState<VerseTab | null>(null);
  const isPlayingThis = playingVerseIndex === rowIndex;

  const words = useMemo(
    // The timing track is the source of truth when present (real aligned
    // audio); otherwise derive the grid from the transliteration words.
    () =>
      track.words.length > 0
        ? track.words.map((t, i) => ({ text: t.word, index: i }))
        : splitWords(verse.transliteration).map((w, i) => ({ text: w, index: i })),
    [track.words, verse.transliteration],
  );

  const toggleTab = (tab: VerseTab) => setOpenTab((prev) => (prev === tab ? null : tab));

  return (
    <article
      ref={ref}
      data-index={rowIndex}
      className={`relative overflow-hidden rounded-3xl border p-5 transition-colors duration-300 sm:p-6 ${
        isPlayingThis
          ? 'border-saffron-400/70 bg-dharma-card shadow-lg shadow-saffron-500/5'
          : 'border-dharma-border bg-dharma-card/70'
      }`}
    >
      {/* Recitation progress ribbon */}
      {isPlayingThis && (
        <div
          className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400"
          style={{ transform: `scaleX(${verseProgress})`, transformOrigin: 'left' }}
        />
      )}

      <header className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-dharma-muted">
          श्लोक {verse.number}
        </span>
        <button
          type="button"
          onClick={() => onPlayVerse(rowIndex)}
          aria-label={isPlayingThis && !isPaused ? `Pause verse ${verse.number}` : `Play verse ${verse.number}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-saffron-300/50 bg-saffron-500/10 px-3 py-1 text-[11px] font-bold text-saffron-700 transition hover:bg-saffron-500/20 dark:text-saffron-300 cursor-pointer"
        >
          {isPlayingThis && !isPaused ? <Pause className="h-3 w-3" aria-hidden="true" /> : <Play className="h-3 w-3" aria-hidden="true" />}
          <span>{isPlayingThis ? 'वाचन' : 'सुनें'}</span>
        </button>
      </header>

      {/* Canonical Devanagari */}
      <p lang="sa" className="font-devanagari mt-3 whitespace-pre-line text-lg font-semibold leading-relaxed text-dharma-text sm:text-xl">
        {verse.sanskrit}
      </p>

      {/* Synchronized word grid (IAST, timed) */}
      <p className="mt-2 font-serif text-footnote italic leading-loose text-dharma-muted sm:text-sm" aria-label="Transliteration with word timing">
        {words.length === 0 ? (
          <span>{verse.transliteration}</span>
        ) : (
          words.map(({ text, index }) => {
            const active = isPlayingThis && index === activeWordIndex;
            return (
              <motion.span
                key={`${index}-${text}`}
                animate={
                  active
                    ? { scale: 1.12, color: '#D97706' }
                    : { scale: 1, color: 'var(--dharma-muted)' }
                }
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className={`inline-block rounded-md px-0.5 transition-shadow duration-300 ${
                  active
                    ? 'bg-amber-500/15 shadow-[0_0_14px_rgba(217,119,6,0.45)]'
                    : ''
                }`}
                style={{ marginRight: '0.3em' }}
              >
                {text}
              </motion.span>
            );
          })
        )}
      </p>

      {/* Meaning layers */}
      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-dharma-border/60 pt-3">
        {TABS.map(({ id, labelHi, labelEn, icon: Icon }) => {
          const hasContent = Boolean(tabContent(verse, id).hi || tabContent(verse, id).en);
          if (!hasContent) return null;
          const open = openTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleTab(id)}
              aria-expanded={open}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                open
                  ? 'bg-saffron-600 text-white'
                  : 'border border-dharma-border bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
              }`}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
              <span>{labelHi}</span>
              <span className="opacity-70">· {labelEn}</span>
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </motion.span>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {openTab && (
          <motion.div
            key={openTab}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 rounded-2xl border border-dharma-border/70 bg-dharma-bg/70 p-4">
              {tabContent(verse, openTab).hi && (
                <p className="font-devanagari text-sm leading-relaxed text-dharma-text">{tabContent(verse, openTab).hi}</p>
              )}
              {tabContent(verse, openTab).en && (
                <p className="text-xs leading-relaxed text-dharma-muted">{tabContent(verse, openTab).en}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
});
