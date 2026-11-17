'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_THEME, THEME_IDS, normalizeStoredTheme, type Theme } from '@/lib/site-theme';

export { THEME_NAMES } from '@/lib/site-theme';
export type { Theme } from '@/lib/site-theme';
export const THEMES: Theme[] = [...THEME_IDS];

const STORAGE_KEY = 'dharma-theme';

interface ThemeContextValue {
  theme: Theme;
  effectiveTheme: Theme;
  setTheme: (t: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Where the reader last pressed, so a theme change can grow out of the control they used. */
let lastPress: { x: number; y: number } | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointerdown',
    (e) => {
      lastPress = { x: e.clientX, y: e.clientY };
    },
    { capture: true, passive: true },
  );
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

/**
 * Applies a theme to <html>. Where the browser has view transitions (and motion is welcome), the new
 * theme grows as a circle from the last press (app/motion.css, section 8); otherwise it switches at once.
 */
function paintTheme(eff: string) {
  const root = document.documentElement;
  if (root.getAttribute('data-theme') === eff) return;
  const doc = document as ViewTransitionDocument;
  const calm =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    root.dataset.lowPower === 'true' ||
    root.dataset.dataSaver === 'true' ||
    root.dataset.liteMode === 'true' ||
    root.dataset.readingLite === 'true';
  if (!doc.startViewTransition || calm) {
    root.setAttribute('data-theme', eff);
    return;
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const { x, y } = lastPress ?? { x: w / 2, y: 0 };
  root.style.setProperty('--vt-x', `${Math.round(x)}px`);
  root.style.setProperty('--vt-y', `${Math.round(y)}px`);
  root.style.setProperty('--vt-r', `${Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y)))}px`);
  root.setAttribute('data-theme-vt', '');
  try {
    const transition = doc.startViewTransition(() => root.setAttribute('data-theme', eff));
    transition.finished.finally(() => root.removeAttribute('data-theme-vt'));
  } catch {
    root.removeAttribute('data-theme-vt');
    root.setAttribute('data-theme', eff);
  }
}

/**
 * Reads the persisted theme from localStorage and applies it to the
 * <html> element. The pre-hydration <script> in layout.tsx already
 * did this synchronously to avoid flash; this provider keeps React
 * state in sync and exposes setters.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [effectiveTheme, setEffectiveTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage may be blocked in private contexts.
    }
    const initialTheme = normalizeStoredTheme(
      stored,
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    );
    setThemeState(initialTheme);
    setEffectiveTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Replace obsolete day/paper/auto choices with one of the two supported
    // values so subsequent loads and reader sessions stay consistent.
    if (stored !== initialTheme) {
      try {
        window.localStorage.setItem(STORAGE_KEY, initialTheme);
      } catch {
        // Storage is optional.
      }
    }
  }, []);

  // The browser's own bar (theme-color) follows the reading theme instead of the fixed
  // light/dark pair in the page head, so Light is Sandhyā amber and Dark is Rātri obsidian.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--dharma-bg').trim();
      if (!bg) return;
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute('content', bg);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [effectiveTheme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    setEffectiveTheme(t);
    paintTheme(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // quota or private mode
    }
  };

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme);
    setTheme(THEMES[(idx + 1) % THEMES.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Outside a provider — fall back to a no-op so component still
    // renders. This shouldn't happen in production.
    return {
      theme: DEFAULT_THEME,
      effectiveTheme: DEFAULT_THEME,
      setTheme: () => {},
      cycleTheme: () => {},
    };
  }
  return ctx;
}
