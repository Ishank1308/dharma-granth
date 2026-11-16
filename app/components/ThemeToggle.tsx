'use client';

import { Sun, Moon } from 'lucide-react';
import type { ReactNode } from 'react';
import { triggerTactileFeedback } from '@/lib/haptics';
import { THEMES, THEME_NAMES, useTheme, type Theme } from './ThemeProvider';

const ICONS: Record<Theme, ReactNode> = {
  sunset: <Sun className="w-4 h-4" />,
  night: <Moon className="w-4 h-4" />,
};


/**
 * Two-option segmented theme picker: warm sunset Light or low-glare Dark.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-dharma-border bg-dharma-card/90 p-1 text-dharma-text shadow-sm backdrop-blur-sm ${className}`}
      role="radiogroup"
      aria-label="Color theme"
    >
      {THEMES.map((option) => {
        const active = option === theme;

        return (
          <button
            key={option}
            type="button"
            onClick={() => {
              setTheme(option);
              triggerTactileFeedback('light', 'softTap');
            }}
            role="radio"
            aria-checked={active}
            aria-label={`${THEME_NAMES[option].name} theme`}
            title={THEME_NAMES[option].description}
            className={`relative inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors ${
              active
                ? 'text-white'
                : 'text-dharma-muted hover:bg-saffron-500/10 hover:text-dharma-text'
            }`}
          >
            {active && (
              <span
                aria-hidden="true"
                className="chrome-fade absolute inset-0 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 shadow-sm"
              />
            )}
            <span className="relative inline-flex">{ICONS[option]}</span>
            {' '}
            <span className="relative hidden min-[2200px]:inline">{THEME_NAMES[option].name}</span>
          </button>
        );
      })}
    </div>
  );
}
