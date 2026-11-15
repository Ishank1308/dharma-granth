'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_THEME, THEME_IDS, THEME_NAMES, type Theme } from '@/lib/site-theme';

export { THEME_NAMES } from '@/lib/site-theme';
export type { Theme } from '@/lib/site-theme';
export const THEMES: Theme[] = [...THEME_IDS];

const STORAGE_KEY = 'dharma-theme';

/**
 * Computes sacred circadian theme based on Sandhyā kāla:
 * - 5:00 AM – 6:30 AM: Prātaḥ Sandhyā (Dawn twilight -> sunset palette)
 * - 6:30 AM – 4:45 PM: Dina (Daytime illumination -> day palette)
 * - 4:45 PM – 7:00 PM: Sāyaṁ Sandhyā (Golden twilight -> sunset palette)
 * - 7:00 PM – 5:00 AM: Niśā (Night contemplation -> night palette)
 */
export function getCircadianTheme(): 'day' | 'sunset' | 'night' {
  const now = new Date();
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  if (currentMinute >= 300 && currentMinute < 390) return 'sunset';
  if (currentMinute >= 390 && currentMinute < 1005) return 'day';
  if (currentMinute >= 1005 && currentMinute < 1140) return 'sunset';
  return 'night';
}

interface ThemeContextValue {
  theme: Theme;
  effectiveTheme: 'day' | 'sunset' | 'paper' | 'night';
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
    root.dataset.liteMode === 'true';
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
  const [effectiveTheme, setEffectiveTheme] = useState<'day' | 'sunset' | 'paper' | 'night'>(DEFAULT_THEME);

  useEffect(() => {
    let stored: Theme | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    } catch {
      stored = null;
    }
    const initialTheme: Theme = stored && THEMES.includes(stored) ? stored : DEFAULT_THEME;
    setThemeState(initialTheme);

    const applyTheme = (t: Theme) => {
      const eff = t === 'auto' ? getCircadianTheme() : t;
      setEffectiveTheme(eff);
      document.documentElement.setAttribute('data-theme', eff);
    };

    applyTheme(initialTheme);

    // If auto, periodically recompute circadian theme
    const interval = setInterval(() => {
      setThemeState((current) => {
        if (current === 'auto') {
          applyTheme('auto');
        }
        return current;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // The browser's own bar (theme-color) follows the reading theme instead of the fixed
  // light/dark pair in the page head, so Usha is ivory and Rātri is obsidian up there too.
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
    const eff = t === 'auto' ? getCircadianTheme() : t;
    setEffectiveTheme(eff);
    paintTheme(eff);
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
      theme: 'day',
      effectiveTheme: 'day',
      setTheme: () => {},
      cycleTheme: () => {},
    };
  }
  return ctx;
}
