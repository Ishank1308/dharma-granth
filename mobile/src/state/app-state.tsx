import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibilityInfo, Appearance } from 'react-native';
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
  type LastRead,
  type Settings,
} from '@/lib/backup';
import { resolveLanguage, type Lang } from '@/i18n/language';
import { isBudgetPhone, resolveLightEffects } from '@/theme/effects';
import { THEMES, type Palette } from '@/theme/themes';

/** Everything stays on the device, under these keys. */
const KEYS = {
  settings: 'dg.settings.v1',
  bookmarks: 'dg.bookmarks.v1',
  lastRead: 'dg.lastRead.v1',
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
  bookmarks: Bookmark[];
  lastRead: LastRead | null;
  updateSettings: (patch: Partial<Settings>) => void;
  isBookmarked: (id: string, chapter: number, verse: string) => boolean;
  toggleBookmark: (id: string, chapter: number, verse: string) => void;
  removeBookmark: (b: Bookmark) => void;
  setLastRead: (id: string, chapter: number) => void;
  exportData: () => AppData;
  importData: (data: AppData) => void;
}

const Ctx = createContext<AppState | null>(null);

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
    AsyncStorage.multiGet([KEYS.settings, KEYS.bookmarks, KEYS.lastRead])
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
        setSettings(
          saved === undefined
            ? { ...DEFAULT_SETTINGS, theme: Appearance.getColorScheme() === 'dark' ? 'dark' : DEFAULT_SETTINGS.theme }
            : normalizeSettings(saved),
        );
        setBookmarks(normalizeBookmarks(parse(map[KEYS.bookmarks])));
        setLastReadState(normalizeLastRead(parse(map[KEYS.lastRead])));
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

  const setLastRead = useCallback((id: string, chapter: number) => {
    setLastReadState({ id, chapter, at: new Date().toISOString() });
  }, []);

  const exportData = useCallback((): AppData => ({ settings, bookmarks, lastRead }), [settings, bookmarks, lastRead]);

  const importData = useCallback((data: AppData) => {
    setSettings(data.settings);
    setBookmarks((list) => mergeBookmarks(list, data.bookmarks));
    if (data.lastRead) setLastReadState(data.lastRead);
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
      lang: resolveLanguage(settings.language),
      bookmarks,
      lastRead,
      updateSettings,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      setLastRead,
      exportData,
      importData,
    }),
    [ready, settings, palette, lightEffects, bookmarks, lastRead, updateSettings, isBookmarked, toggleBookmark, removeBookmark, setLastRead, exportData, importData],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState must be used inside AppStateProvider');
  return v;
}

export function usePalette(): Palette {
  return useAppState().palette;
}
