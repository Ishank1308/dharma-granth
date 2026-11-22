'use client';

import { useCallback, useEffect, useState } from 'react';
import { READING_DEPTH_EVENT, depthForMode, modeForDepth, readStoredDepth, saveReadingDepth } from '@/lib/reading-depth';

export type SizeStep = 'sm' | 'md' | 'lg' | 'xl';
export type LineSpacing = 'compact' | 'normal' | 'relaxed' | 'loose';
export type ReadingWidth = 'narrow' | 'standard' | 'wide';
export type ReaderLanguagePref = 'all' | 'hindi' | 'english';
export type NumberFormatPref = 'indian' | 'international';
export type ReaderModeTier = 'quick' | 'simple' | 'deep' | 'traditional';
export type ContrastPref = 'standard' | 'high';
export type PerspectiveMode = 'beginner' | 'student' | 'practitioner' | 'researcher';
/** The script the Sanskrit is shown in (ISO 15924 codes, lower case). The text is stored in Devanagari. */
export type SanskritScript = 'deva' | 'beng' | 'gujr' | 'orya' | 'telu' | 'knda' | 'mlym';

export interface ReaderSettings {
  sanskritSize: SizeStep;
  /** Devanagari, or the same text shown letter for letter in another Indian script. */
  sanskritScript: SanskritScript;
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
  // A separate reading "tone" (paper / sepia / night) used to live here. It recoloured the text
  // but not the page, so three of its four choices left the verse unreadable in one theme or
  // the other. The site theme is the one colour choice now; a stored tone is dropped on read.
  /** Learning and engagement perspective (does not hide original scripture). */
  perspective: PerspectiveMode;
  /** Pure text lite mode: strips secondary widgets for rapid, distraction-free reading. */
  liteMode: boolean;
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  sanskritSize: 'lg',
  sanskritScript: 'deva',
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
const PERSPECTIVES: PerspectiveMode[] = ['beginner', 'student', 'practitioner', 'researcher'];
const SCRIPTS: SanskritScript[] = ['deva', 'beng', 'gujr', 'orya', 'telu', 'knda', 'mlym'];

/** Same-tab broadcast, so every component using the hook sees a change at once. */
const CHANGE_EVENT = 'dharma:reader-settings';

/** One depth choice serves chapter and verse pages (lib/reading-depth); once made, it sets the verse view. */
function withDepthChoice(settings: ReaderSettings): ReaderSettings {
  const depth = readStoredDepth();
  return depth ? { ...settings, readerMode: modeForDepth(depth, settings.readerMode) } : settings;
}

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

  const settings = withDepthChoice(sanitize(values));
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
    sanskritScript: pick(o.sanskritScript, SCRIPTS, d.sanskritScript),
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
    perspective: pick(o.perspective, PERSPECTIVES, d.perspective),
    liteMode: bool(o.liteMode, d.liteMode),
  };
}

/**
 * Sanskrit in another script is a view over the page (lib/sanskrit-script-view). Its code is
 * fetched only once a reader has picked a script, so Devanagari readers never load it.
 */
let scriptViewLoaded = false;
function showSanskritScript(script: SanskritScript) {
  if (script === 'deva' && !scriptViewLoaded) return;
  scriptViewLoaded = true;
  import('./sanskrit-script-view').then((m) => m.showSanskritIn(script)).catch(() => {
    // Offline or a failed fetch: the Devanagari stays.
  });
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
    window.addEventListener(READING_DEPTH_EVENT, resync);
    window.addEventListener('storage', resync);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setDeviceReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setDeviceReducedMotion(e.matches);
    query.addEventListener('change', onChange);
    return () => {
      query.removeEventListener('change', onChange);
      window.removeEventListener(CHANGE_EVENT, resync);
      window.removeEventListener(READING_DEPTH_EVENT, resync);
      window.removeEventListener('storage', resync);
    };
  }, []);

  // The defaults object itself means storage has not been read yet (the first render).
  const hydrated = settings !== DEFAULT_READER_SETTINGS;
  useEffect(() => {
    if (hydrated) showSanskritScript(settings.sanskritScript);
  }, [hydrated, settings.sanskritScript]);

  const update = useCallback(<K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
    setSettings((prev) => {
      let latest = prev;
      try {
        const stored = localStorage.getItem(KEY);
        if (stored) latest = withDepthChoice({ ...prev, ...sanitize(JSON.parse(stored)) });
      } catch {
        // Retain this component's state if storage is unavailable or malformed.
      }
      const next = { ...latest, [key]: value };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // The change still applies for this visit.
      }
      queueMicrotask(() => {
        // The verse page's view is the shared depth choice too, so a chapter opened next follows it.
        if (key === 'readerMode') saveReadingDepth(depthForMode(value as ReaderModeTier));
        window.dispatchEvent(new Event(CHANGE_EVENT));
      });
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
    // Forget the depth choice too, so chapter and verse pages each open as they do at first.
    saveReadingDepth(null);
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
