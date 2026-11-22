import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibilityInfo, Appearance, AppState as RNAppState } from 'react-native';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  bookmarkKey,
  DEFAULT_SETTINGS,
  mergeBookmarks,
  normalizeBookmarks,
  normalizeLastRead,
  normalizeSettings,
  type AppData,
  type Bookmark,
  type ImportedData,
  type LastRead,
  type Settings,
} from '@/lib/backup';
import { resolveLanguage, type Lang } from '@/i18n/language';
import { dayKey, EMPTY_PROGRESS, markVersesRead, mergeProgress, normalizeProgress, type ReadingProgress } from '@/lib/progress';
import { isBudgetPhone, resolveLightEffects } from '@/theme/effects';
import { THEMES, type Palette } from '@/theme/themes';

/** Everything stays on the device, under these keys. */
const KEYS = {
  settings: 'dg.settings.v1',
  bookmarks: 'dg.bookmarks.v1',
  lastRead: 'dg.lastRead.v1',
  progress: 'dg.progress.v1',
} as const;

/** The settings key, for code that runs without React (the home-screen widget's headless task). */
export const SETTINGS_KEY = KEYS.settings;

interface AppState {
  ready: boolean;
  settings: Settings;
  palette: Palette;
  /** The interface language in effect: the reader's choice, or the phone's language. */
  lang: Lang;
  /** Light effects in use (the reader's choice, or Automatic on a budget phone). Also on palette.lite. */
  lightEffects: boolean;
  /** Android's "Remove animations" (or the platform's reduce-motion switch) is on: sheets and screens appear without sliding. */
  reduceMotion: boolean;
  bookmarks: Bookmark[];
  lastRead: LastRead | null;
  /** Verses read and the days read on, for progress bars and the reading streak. */
  progress: ReadingProgress;
  updateSettings: (patch: Partial<Settings>) => void;
  isBookmarked: (id: string, chapter: number, verse: string) => boolean;
  toggleBookmark: (id: string, chapter: number, verse: string) => void;
  removeBookmark: (b: Bookmark) => void;
  /** Where the reader is. Without a verse, keeps the verse already saved for that same chapter. */
  setLastRead: (id: string, chapter: number, verse?: string) => void;
  /** Marks verses of one chapter as read today. Does nothing (and re-renders nothing) when none are new. */
  markRead: (id: string, chapter: number, verses: string[]) => void;
  clearProgress: () => void;
  exportData: () => AppData;
  importData: (data: ImportedData) => void;
}

const Ctx = createContext<AppState | null>(null);

/**
 * The slice of the app state that only changes when the reader changes a setting: theme, text size,
 * language, effects. Leaf components (cards, rows, chips, art) read this through usePrefs() or
 * usePalette(), so saving a verse or opening a chapter (which changes bookmarks and lastRead) no
 * longer re-renders every card on screen. On a budget phone that was most of the work after a tap.
 */
export type Prefs = Pick<AppState, 'ready' | 'settings' | 'palette' | 'lang' | 'lightEffects' | 'reduceMotion' | 'updateSettings'>;

const PrefsCtx = createContext<Prefs | null>(null);

function save(key: string, value: unknown) {
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {
    // Storage full or unavailable: the app keeps working for this session.
  });
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [lastRead, setLastReadState] = useState<LastRead | null>(null);
  const [progress, setProgress] = useState<ReadingProgress>(EMPTY_PROGRESS);
  const loaded = useRef(false);
  const [budgetPhone] = useState(isBudgetPhone);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((on) => {
        if (alive) setReduceMotion(on);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    AsyncStorage.multiGet([KEYS.settings, KEYS.bookmarks, KEYS.lastRead, KEYS.progress])
      .then((pairs) => {
        if (!alive) return;
        const map = Object.fromEntries(pairs);
        const parse = (raw: string | null | undefined) => {
          try {
            return raw ? (JSON.parse(raw) as unknown) : undefined;
          } catch {
            return undefined;
          }
        };
        const saved = parse(map[KEYS.settings]);
        // First launch: match the phone's dark mode (the splash screen already does) instead of a bright Day theme.
        // Someone who already has a place in a book or saved verses is not new, whatever the settings key says:
        // they do not get the first-run welcome.
        const hasHistory = Boolean(map[KEYS.lastRead] || map[KEYS.bookmarks] || map[KEYS.progress]);
        setSettings(
          saved === undefined
            ? {
                ...DEFAULT_SETTINGS,
                theme: Appearance.getColorScheme() === 'dark' ? 'dark' : DEFAULT_SETTINGS.theme,
                onboarded: hasHistory,
              }
            : normalizeSettings(saved),
        );
        setBookmarks(normalizeBookmarks(parse(map[KEYS.bookmarks])));
        setLastReadState(normalizeLastRead(parse(map[KEYS.lastRead])));
        setProgress(normalizeProgress(parse(map[KEYS.progress])));
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (loaded.current) save(KEYS.settings, settings);
  }, [settings]);
  useEffect(() => {
    if (loaded.current) save(KEYS.bookmarks, bookmarks);
  }, [bookmarks]);
  useEffect(() => {
    if (loaded.current && lastRead) save(KEYS.lastRead, lastRead);
  }, [lastRead]);
  // Progress changes every few seconds while reading; write it at most once every two seconds.
  useEffect(() => {
    if (!loaded.current) return;
    const timer = setTimeout(() => save(KEYS.progress, progress), 2000);
    return () => clearTimeout(timer);
  }, [progress]);
  // ...and right away when the app goes to the background, so a swipe-away never loses the last verses.
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (state) => {
      if (state !== 'active' && loaded.current) save(KEYS.progress, progressRef.current);
    });
    return () => sub.remove();
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => normalizeSettings({ ...s, ...patch }));
  }, []);

  const bookmarkSet = useMemo(() => new Set(bookmarks.map(bookmarkKey)), [bookmarks]);

  const isBookmarked = useCallback(
    (id: string, chapter: number, verse: string) => bookmarkSet.has(bookmarkKey({ id, chapter, verse })),
    [bookmarkSet],
  );

  const toggleBookmark = useCallback((id: string, chapter: number, verse: string) => {
    setBookmarks((list) => {
      const key = bookmarkKey({ id, chapter, verse });
      if (list.some((b) => bookmarkKey(b) === key)) return list.filter((b) => bookmarkKey(b) !== key);
      return [{ id, chapter, verse, savedAt: new Date().toISOString() }, ...list];
    });
  }, []);

  const removeBookmark = useCallback((b: Bookmark) => {
    const key = bookmarkKey(b);
    setBookmarks((list) => list.filter((x) => bookmarkKey(x) !== key));
  }, []);

  const setLastRead = useCallback((id: string, chapter: number, verse?: string) => {
    setLastReadState((prev) => {
      const keep = verse ?? (prev && prev.id === id && prev.chapter === chapter ? prev.verse : undefined);
      if (prev && prev.id === id && prev.chapter === chapter && prev.verse === keep && verse !== undefined) return prev;
      const at = new Date().toISOString();
      return keep ? { id, chapter, verse: keep, at } : { id, chapter, at };
    });
  }, []);

  const markRead = useCallback((id: string, chapter: number, verses: string[]) => {
    if (verses.length === 0) return;
    const today = dayKey();
    setProgress((p) => markVersesRead(p, id, chapter, verses, today));
  }, []);

  const clearProgress = useCallback(() => setProgress(EMPTY_PROGRESS), []);

  const exportData = useCallback(
    (): AppData => ({ settings, bookmarks, lastRead, progress }),
    [settings, bookmarks, lastRead, progress],
  );

  const importData = useCallback((data: ImportedData) => {
    setSettings(data.settings);
    setBookmarks((list) => mergeBookmarks(list, data.bookmarks));
    if (data.lastRead) setLastReadState(data.lastRead);
    setProgress((p) => mergeProgress(p, normalizeProgress(data.progress)));
  }, []);

  const lightEffects = resolveLightEffects(settings.effects, budgetPhone, reduceMotion);
  const palette = useMemo<Palette>(
    () => (lightEffects ? { ...THEMES[settings.theme], lite: true } : THEMES[settings.theme]),
    [settings.theme, lightEffects],
  );

  const value = useMemo<AppState>(
    () => ({
      ready,
      settings,
      palette,
      lightEffects,
      reduceMotion,
      lang: resolveLanguage(settings.language),
      bookmarks,
      lastRead,
      progress,
      updateSettings,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      setLastRead,
      markRead,
      clearProgress,
      exportData,
      importData,
    }),
    [
      ready,
      settings,
      palette,
      lightEffects,
      reduceMotion,
      bookmarks,
      lastRead,
      progress,
      updateSettings,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      setLastRead,
      markRead,
      clearProgress,
      exportData,
      importData,
    ],
  );

  const lang = value.lang;
  const prefs = useMemo<Prefs>(
    () => ({ ready, settings, palette, lang, lightEffects, reduceMotion, updateSettings }),
    [ready, settings, palette, lang, lightEffects, reduceMotion, updateSettings],
  );

  return (
    <PrefsCtx.Provider value={prefs}>
      <Ctx.Provider value={value}>{children}</Ctx.Provider>
    </PrefsCtx.Provider>
  );
}

/** Settings, palette and language only: re-renders when a setting changes, not when bookmarks or progress do. */
export function usePrefs(): Prefs {
  const v = useContext(PrefsCtx);
  if (!v) throw new Error('usePrefs must be used inside AppStateProvider');
  return v;
}

export function useAppState(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState must be used inside AppStateProvider');
  return v;
}

export function usePalette(): Palette {
  return usePrefs().palette;
}
