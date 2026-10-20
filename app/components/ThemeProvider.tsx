'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'day' | 'sunset' | 'paper' | 'night' | 'auto';
export const THEMES: Theme[] = ['day', 'sunset', 'paper', 'night', 'auto'];

/**
 * The one set of theme names for every picker. The ids stay day/sunset/paper/night (stored preferences and CSS
 * depend on them); readers see Usha, Sandhyā (the dawn and dusk palette the auto theme already uses), Bhojpatra
 * and Rātri. `name` and `hi` are rendered as separate elements, never joined into one string.
 */
export const THEME_NAMES: Record<Theme, { name: string; hi: string; description: string }> = {
  day: { name: 'Usha', hi: 'उषा', description: 'Warm ivory and saffron for daytime reading' },
  sunset: { name: 'Sandhyā', hi: 'संध्या', description: 'Soft amber for dawn and dusk' },
  paper: { name: 'Bhojpatra', hi: 'भोजपत्र', description: 'Sepia birch-bark parchment' },
  night: { name: 'Rātri', hi: 'रात्रि', description: 'Low-glare obsidian and copper for night reading' },
  auto: { name: 'Auto', hi: 'सौर चक्र', description: 'Follows the sun: Usha by day, Sandhyā at dawn and dusk, Rātri at night' },
};

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

/**
 * Reads the persisted theme from localStorage and applies it to the
 * <html> element. The pre-hydration <script> in layout.tsx already
 * did this synchronously to avoid flash; this provider keeps React
 * state in sync and exposes setters.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('day');
  const [effectiveTheme, setEffectiveTheme] = useState<'day' | 'sunset' | 'paper' | 'night'>('day');

  useEffect(() => {
    let stored: Theme | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    } catch {
      stored = null;
    }
    const initialTheme: Theme = stored && THEMES.includes(stored) ? stored : 'day';
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

  const setTheme = (t: Theme) => {
    setThemeState(t);
    const eff = t === 'auto' ? getCircadianTheme() : t;
    setEffectiveTheme(eff);
    document.documentElement.setAttribute('data-theme', eff);
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
