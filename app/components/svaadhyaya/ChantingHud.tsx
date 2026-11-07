'use client';

/**
 * Svaadhyaya Engine — Contemplative Player HUD.
 *
 * A floating, dockable bottom control bar (Framer Motion):
 *   - current verse & reciter label ("श्रीमद्भगवद्गीता — अध्याय २, श्लोक ४७")
 *   - Play / Pause / Replay with spring-loaded micro-interactions
 *   - speed selector 0.75x (अभ्यास) / 1.0x (मानक) / 1.25x (प्रवचन)
 *   - Kanthastha loop toggle — infinite repetition of the current verse
 *   - Tanpura drone toggle with a pulsating diya-flame animation while active
 *   - ambient drone volume slider and pitch preset, including 432 Hz tuning
 *     (both persist via the tanpura engine)
 *
 * The bar can be dragged horizontally within a small range.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Repeat, Flame, Volume2, Minus } from 'lucide-react';
import { useTanpuraDrone } from '@/lib/svaadhyaya/useTanpuraDrone';
import type { UseChantingPlayback } from '@/lib/svaadhyaya/useChantingPlayback';
import type { PlaybackSpeed, SvaadhyayaVerse } from '@/lib/svaadhyaya/types';
import { SPEED_LABELS } from '@/lib/svaadhyaya/types';
import type { TanpuraPitch } from '@/lib/tanpura-audio';

const SPRING = { type: 'spring', stiffness: 420, damping: 26 } as const;
const SPEEDS: PlaybackSpeed[] = [0.75, 1, 1.25];
const PITCHES: Array<{ id: TanpuraPitch; label: string }> = [
  { id: 'C#', label: 'C#' },
  { id: 'D', label: 'D' },
  { id: 'A#', label: 'A#' },
  { id: '432', label: '432 Hz' },
];

interface ChantingHudProps {
  scriptureTitleHi: string;
  chapterLabelHi?: string;
  verses: SvaadhyayaVerse[];
  playback: UseChantingPlayback;
}

function DiyaFlame({ active }: { active: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      animate={
        active
          ? { scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75], rotate: [-2, 2, -2] }
          : { scale: 1, opacity: 0.45, rotate: 0 }
      }
      transition={active ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      className="inline-flex"
    >
      <Flame className={`h-4 w-4 ${active ? 'text-amber-500' : 'text-dharma-muted'}`} />
    </motion.span>
  );
}

export function ChantingHud({ scriptureTitleHi, chapterLabelHi, verses, playback }: ChantingHudProps) {
  const drone = useTanpuraDrone();
  const { state, controls } = playback;

  const verse = verses[state.currentVerseIndex];
  const label = verse
    ? `${scriptureTitleHi}${chapterLabelHi ? ` — ${chapterLabelHi}` : ''}, श्लोक ${verse.number}`
    : `${scriptureTitleHi} — स्वाध्याय`;

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.15 }}
      drag="x"
      dragConstraints={{ left: -160, right: 160 }}
      dragElastic={0.2}
      dragMomentum={false}
      className="pointer-events-auto fixed inset-x-0 bottom-4 z-50 mx-auto w-[min(94vw,680px)]"
      role="region"
      aria-label="Chanting player"
    >
      <div className="rounded-3xl border border-dharma-border/80 bg-dharma-card/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-4">
        {/* Row 1: label + transport */}
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-devanagari text-sm font-bold text-dharma-text">{label}</p>
            <p className="truncate text-[10px] uppercase tracking-wider text-dharma-muted">
              {state.usingSpeech ? 'सरस्वती वाचन · Speech' : 'श्रुतिवाचन · Audio'}
              {state.loopVerse ? ' · कण्ठस्थ loop' : ''}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              type="button"
              whileTap={{ scale: 0.82 }}
              transition={SPRING}
              onClick={controls.previous}
              disabled={state.currentVerseIndex === 0}
              aria-label="Previous verse"
              className="rounded-full p-2 text-dharma-muted transition hover:text-dharma-text disabled:opacity-30 cursor-pointer"
            >
              <SkipBack className="h-4 w-4" aria-hidden="true" />
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.06 }}
              transition={SPRING}
              onClick={() => (state.isPlaying ? controls.pause() : controls.resume())}
              aria-label={state.isPlaying ? 'Pause chanting' : 'Play chanting'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron-600 text-white shadow-lg shadow-saffron-600/30 cursor-pointer"
            >
              {state.isPlaying ? (
                <Pause className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
              )}
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.82 }}
              transition={SPRING}
              onClick={controls.replay}
              aria-label="Replay verse"
              className="rounded-full p-2 text-dharma-muted transition hover:text-dharma-text cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.82 }}
              transition={SPRING}
              onClick={controls.next}
              disabled={state.currentVerseIndex >= verses.length - 1}
              aria-label="Next verse"
              className="rounded-full p-2 text-dharma-muted transition hover:text-dharma-text disabled:opacity-30 cursor-pointer"
            >
              <SkipForward className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>

        {/* Row 2: speed, loop, tanpura, drone volume */}
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-dharma-border/60 pt-2">
          <div className="flex items-center rounded-full border border-dharma-border bg-dharma-bg p-0.5" role="group" aria-label="Playback speed">
            {SPEEDS.map((s) => {
              const selected = state.speed === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => controls.setSpeed(s)}
                  aria-pressed={selected}
                  title={`${SPEED_LABELS[s].en} — ${SPEED_LABELS[s].hi}`}
                  className={`relative rounded-full px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    selected ? 'text-white' : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="speed-pill"
                      transition={SPRING}
                      className="absolute inset-0 rounded-full bg-saffron-600"
                    />
                  )}
                  <span className="relative">{s}x</span>
                </button>
              );
            })}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            transition={SPRING}
            onClick={controls.toggleLoop}
            aria-pressed={state.loopVerse}
            aria-label="Kanthastha — loop current verse"
            title="कण्ठस्थ · Loop verse for memorization"
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
              state.loopVerse
                ? 'border-saffron-500 bg-saffron-500/15 text-saffron-700 dark:text-saffron-300'
                : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" aria-hidden="true" />
            <span>कण्ठस्थ</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            transition={SPRING}
            onClick={drone.toggle}
            aria-pressed={drone.active}
            aria-label="Tanpura drone"
            title="तन्पूरा नाद · Procedural tanpura drone"
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
              drone.active
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <DiyaFlame active={drone.active} />
            <span>तन्पूरा</span>
          </motion.button>

          <AnimatePresence>
            {drone.active && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={SPRING}
                className="flex items-center gap-1.5 overflow-hidden"
              >
                <Volume2 className="h-3.5 w-3.5 shrink-0 text-dharma-muted" aria-hidden="true" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={drone.volume}
                  onChange={(e) => drone.setVolume(parseFloat(e.target.value))}
                  aria-label="Tanpura volume"
                  className="h-1 w-24 cursor-pointer accent-amber-600"
                />
                <select
                  value={drone.pitch}
                  onChange={(e) => drone.setPitch(e.target.value as TanpuraPitch)}
                  aria-label="Tanpura pitch"
                  title="स्वर · Sa pitch"
                  className="rounded-full border border-dharma-border bg-dharma-bg px-2 py-0.5 text-[11px] font-bold text-dharma-muted cursor-pointer"
                >
                  {PITCHES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verse progress */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-dharma-bg" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
            animate={{ width: `${Math.round(state.verseProgress * 100)}%` }}
            transition={{ ease: 'linear', duration: 0.12 }}
          />
        </div>
      </div>

      {/* Minimize handle (visual affordance for the draggable dock) */}
      <div className="mt-1.5 flex justify-center" aria-hidden="true">
        <Minus className="h-4 w-4 text-dharma-muted/50" />
      </div>
    </motion.div>
  );
}
