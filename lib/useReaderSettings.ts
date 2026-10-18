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
  showTransliteration: true,
  showHindi: true,
  showEnglish: true,
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
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setSettings(sanitize(JSON.parse(stored)));
    } catch {
      // Unreadable or blocked storage: keep the defaults.
    }
    const resync = () => {
      try {
        const stored = localStorage.getItem(KEY);
        setSettings(stored ? sanitize(JSON.parse(stored)) : DEFAULT_READER_SETTINGS);
      } catch {
        // Keep what is on screen.
      }
    };
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
      const next = { ...prev, [key]: value };
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
