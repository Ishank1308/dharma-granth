'use client';

import { useCallback, useEffect, useState } from 'react';

export type SizeStep = 'sm' | 'md' | 'lg' | 'xl';
export type LineSpacing = 'compact' | 'normal' | 'relaxed' | 'loose';
export type ReadingWidth = 'narrow' | 'standard' | 'wide';
export type ReaderLanguagePref = 'all' | 'hindi' | 'english';
export type NumberFormatPref = 'indian' | 'international';
export type ReaderModeTier = 'quick' | 'simple' | 'deep' | 'traditional';
export type ContrastPref = 'standard' | 'high';
export type TonePref = 'default' | 'paper' | 'sepia' | 'night';
export type PerspectiveMode = 'beginner' | 'student' | 'practitioner' | 'researcher';

export interface ReaderSettings {
  sanskritSize: SizeStep;
  translationSize: SizeStep;
  lineSpacing: LineSpacing;
  readingWidth: ReadingWidth;
  showTransliteration: boolean;
  showHindi: boolean;
  showEnglish: boolean;
  showCommentary: boolean;
  /** Chapter reading spotlight follows the verse in view and dims nearby verses. */
  spotlightMode: boolean;
  preferredLanguage: ReaderLanguagePref;
  numberFormat: NumberFormatPref;
  readerMode: ReaderModeTier;
  contrast: ContrastPref;
  /** Hides ornament (corner details, card icons, entrance motion) around the text. */
  hideDecor: boolean;
  /** Explicit choice; `null` follows the device's reduced-motion setting. */
  reducedMotion: boolean | null;
  /** Focus mode: verse, translation, explanation and navigation only. */
  focusMode: boolean;
  /** Background tone while reading. */
  tone: TonePref;
  /** Learning and engagement perspective (does not hide original scripture). */
  perspective: PerspectiveMode;
  /** Pure text lite mode: strips secondary widgets for rapid, distraction-free reading. */
  liteMode: boolean;
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  sanskritSize: 'lg',
  translationSize: 'md',
  lineSpacing: 'relaxed',
  readingWidth: 'standard',
  // IAST is opt-in: off by default to keep the shloka uncluttered.
  showTransliteration: false,
  showHindi: true,
  showEnglish: true,
  showCommentary: true,
  spotlightMode: false,
  preferredLanguage: 'all',
  numberFormat: 'indian',
  readerMode: 'simple',
  contrast: 'standard',
  hideDecor: false,
  reducedMotion: null,
  focusMode: false,
  tone: 'default',
  perspective: 'beginner',
  liteMode: false,
};

const KEY = 'dharma.readerSettings';

const SIZES: SizeStep[] = ['sm', 'md', 'lg', 'xl'];
const SPACINGS: LineSpacing[] = ['compact', 'normal', 'relaxed', 'loose'];
const WIDTHS: ReadingWidth[] = ['narrow', 'standard', 'wide'];
const LANG_PREFS: ReaderLanguagePref[] = ['all', 'hindi', 'english'];
const NUMBER_PREFS: NumberFormatPref[] = ['indian', 'international'];
const MODE_TIERS: ReaderModeTier[] = ['quick', 'simple', 'deep', 'traditional'];
const CONTRASTS: ContrastPref[] = ['standard', 'high'];
const TONES: TonePref[] = ['default', 'paper', 'sepia', 'night'];
const PERSPECTIVES: PerspectiveMode[] = ['beginner', 'student', 'practitioner', 'researcher'];

/** Same-tab broadcast, so every component using the hook sees a change at once. */
const CHANGE_EVENT = 'dharma:reader-settings';

/** Import the chapter reader's older controls once, without replacing any newer setting. */
function readStoredSettings(): ReaderSettings {
  const values: Record<string, unknown> = {};
  let migrationNeeded = false;

  try {
    const legacySize = localStorage.getItem('dharma_reader_fontsize');
    migrationNeeded ||= legacySize !== null;
    if (legacySize === 'normal') values.sanskritSize = 'md';
    if (legacySize === 'large') values.sanskritSize = 'lg';
    if (legacySize === 'xl') values.sanskritSize = 'xl';

    const legacyLayers = localStorage.getItem('dharma_reader_layers');
    migrationNeeded ||= legacyLayers !== null;
    if (legacyLayers) {
      const parsed: unknown = JSON.parse(legacyLayers);
      if (parsed && typeof parsed === 'object') {
        const layers = parsed as Record<string, unknown>;
        if (typeof layers.translit === 'boolean') values.showTransliteration = layers.translit;
        if (typeof layers.hindi === 'boolean') values.showHindi = layers.hindi;
        if (typeof layers.english === 'boolean') values.showEnglish = layers.english;
        if (typeof layers.commentary === 'boolean') values.showCommentary = layers.commentary;
      }
    }
    const legacySpotlight = localStorage.getItem('dharma_ekagrata_mode');
    migrationNeeded ||= legacySpotlight !== null;
    if (legacySpotlight) {
      const parsed: unknown = JSON.parse(legacySpotlight);
      if (typeof parsed === 'boolean') values.spotlightMode = parsed;
    }
  } catch {
    // Keep defaults if a legacy preference is malformed or storage is blocked.
  }

  try {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Current preferences take precedence; the legacy values fill only gaps.
        Object.assign(values, parsed);
      }
    } else {
      migrationNeeded = true;
    }
  } catch {
    // The legacy values above can still be used if the current record is invalid.
  }

  const settings = sanitize(values);
  if (migrationNeeded) {
    try {
      // Persist the migration before removing its source so a reset cannot
      // accidentally resurrect old chapter-reader preferences.
      localStorage.setItem(KEY, JSON.stringify(settings));
      localStorage.removeItem('dharma_reader_fontsize');
      localStorage.removeItem('dharma_reader_layers');
      localStorage.removeItem('dharma_ekagrata_mode');
    } catch {
      // Keep the in-memory values when storage is unavailable.
    }
  }
  return settings;
}

/** Keep only well-formed values from storage; anything else falls back to the default. */
function sanitize(raw: unknown): ReaderSettings {
  const d = DEFAULT_READER_SETTINGS;
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const pick = <T extends string>(v: unknown, allowed: T[], fallback: T): T =>
    typeof v === 'string' && (allowed as string[]).indexOf(v) !== -1 ? (v as T) : fallback;
  const bool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
  return {
    sanskritSize: pick(o.sanskritSize, SIZES, d.sanskritSize),
    translationSize: pick(o.translationSize, SIZES, d.translationSize),
    lineSpacing: pick(o.lineSpacing, SPACINGS, d.lineSpacing),
    readingWidth: pick(o.readingWidth, WIDTHS, d.readingWidth),
    showTransliteration: bool(o.showTransliteration, d.showTransliteration),
    showHindi: bool(o.showHindi, d.showHindi),
    showEnglish: bool(o.showEnglish, d.showEnglish),
    showCommentary: bool(o.showCommentary, d.showCommentary),
    spotlightMode: bool(o.spotlightMode, d.spotlightMode),
    preferredLanguage: pick(o.preferredLanguage, LANG_PREFS, d.preferredLanguage),
    numberFormat: pick(o.numberFormat, NUMBER_PREFS, d.numberFormat),
    readerMode: pick(o.readerMode, MODE_TIERS, d.readerMode),
    contrast: pick(o.contrast, CONTRASTS, d.contrast),
    hideDecor: bool(o.hideDecor, d.hideDecor),
    reducedMotion: typeof o.reducedMotion === 'boolean' ? o.reducedMotion : null,
    focusMode: bool(o.focusMode, d.focusMode),
    tone: pick(o.tone, TONES, d.tone),
    perspective: pick(o.perspective, PERSPECTIVES, d.perspective),
    liteMode: bool(o.liteMode, d.liteMode),
  };
}

/**
 * Reader preferences. The first render always uses the defaults, so the
 * server-rendered HTML and the first client render match; stored values are
 * applied right after mount. Storage failures (private mode) are ignored.
 */
export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_READER_SETTINGS);
  const [deviceReducedMotion, setDeviceReducedMotion] = useState(false);

  useEffect(() => {
    setSettings(readStoredSettings());
    const resync = () => setSettings(readStoredSettings());
    window.addEventListener(CHANGE_EVENT, resync);
    window.addEventListener('storage', resync);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setDeviceReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setDeviceReducedMotion(e.matches);
    query.addEventListener('change', onChange);
    return () => {
      query.removeEventListener('change', onChange);
      window.removeEventListener(CHANGE_EVENT, resync);
      window.removeEventListener('storage', resync);
    };
  }, []);

  const update = useCallback(<K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
    setSettings((prev) => {
      let latest = prev;
      try {
        const stored = localStorage.getItem(KEY);
        if (stored) latest = { ...prev, ...sanitize(JSON.parse(stored)) };
      } catch {
        // Retain this component's state if storage is unavailable or malformed.
      }
      const next = { ...latest, [key]: value };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // The change still applies for this visit.
      }
      queueMicrotask(() => window.dispatchEvent(new Event(CHANGE_EVENT)));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_READER_SETTINGS);
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem('dharma_reader_fontsize');
      localStorage.removeItem('dharma_reader_layers');
      localStorage.removeItem('dharma_ekagrata_mode');
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return {
    settings,
    update,
    reset,
    /** The effective value: the reader's choice, else the device preference. */
    reducedMotion: settings.reducedMotion ?? deviceReducedMotion,
  };
}
