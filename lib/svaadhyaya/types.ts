/**
 * Svaadhyaya Engine — shared types.
 *
 * The engine renders long scripture chapters (20 verses … 700 verses) through a
 * virtualized stream with synchronized word-level chanting. These types are
 * the contract between the data layer (seeded chapter JSON), the timing layer
 * (`timing.ts`), the playback hooks and the React components.
 */

/** One Sanskrit (transliterated) word with its recitation interval in ms. */
export interface TimedWord {
  word: string;
  startTimeMs: number;
  endTimeMs: number;
}

/** Presentation-ready verse consumed by the Svaadhyaya stream. */
export interface SvaadhyayaVerse {
  /** Verse number as shown in the seeded data (may be "3.3"). */
  number: number | string;
  /** Canonical Devanagari mūlapāṭha. */
  sanskrit: string;
  /** IAST transliteration — the source of the word timing grid. */
  transliteration?: string;
  /** Artha layer: direct Hindi meaning. */
  arthaHi?: string;
  /** Artha layer: direct English meaning. */
  arthaEn?: string;
  /** Vyākhyā layer: contextual exposition. */
  vyakhya?: string;
  /** Vijñāna layer: modern analytical perspective. */
  vigyana?: string;
}

/**
 * Optional pre-aligned per-verse recitation track. When the site gains real
 * studio-recorded chanting with force-aligned timestamps, pass them through
 * this prop and the engine will use them verbatim instead of the built-in
 * cadence estimator.
 */
export interface VerseTimingTrack {
  verseNumber: number | string;
  /** Total recitation duration for this verse (ms). */
  durationMs: number;
  words: TimedWord[];
}

/** Audio resolution — return a URL for a verse's recitation, or null/undefined to use speech synthesis. */
export type AudioUrlResolver = (verse: SvaadhyayaVerse, index: number) => string | null | undefined;

export type PlaybackSpeed = 0.75 | 1 | 1.25;

export const SPEED_LABELS: Record<PlaybackSpeed, { hi: string; en: string }> = {
  0.75: { hi: 'अभ्यास', en: 'Abhyasa' },
  1: { hi: 'मानक', en: 'Standard' },
  1.25: { hi: 'प्रवचन', en: 'Pravachan' },
};

/** Playback state snapshot exposed by `useChantingPlayback`. */
export interface ChantingState {
  isPlaying: boolean;
  /** Index of the verse currently loaded/playing. */
  currentVerseIndex: number;
  /** Index of the word currently recited inside the current verse (-1 = gap). */
  activeWordIndex: number;
  /** 0..1 progress within the current verse. */
  verseProgress: number;
  speed: PlaybackSpeed;
  /** Kanthastha — infinite repetition of the current verse. */
  loopVerse: boolean;
  /** True when falling back to speech synthesis (no recorded audio). */
  usingSpeech: boolean;
}

export interface ChantingControls {
  playVerse(index: number): void;
  pause(): void;
  resume(): void;
  replay(): void;
  stop(): void;
  next(): void;
  previous(): void;
  setSpeed(speed: PlaybackSpeed): void;
  toggleLoop(): void;
}
