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

  // ARIA radio groups have a single Tab stop; arrow keys move focus and selection.
  // Keep the behaviour scoped to this instance: nav and mobile drawer each have a picker.
  const handleRadioKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const current = THEMES.indexOf(theme);
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (current + THEMES.length - 1) % THEMES.length;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        next = (current + 1) % THEMES.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = THEMES.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const group = event.currentTarget.closest('[role="radiogroup"]');
    const options = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    setTheme(THEMES[next]);
    options?.[next]?.focus();
  };

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
            tabIndex={active ? 0 : -1}
            onKeyDown={handleRadioKeyDown}
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
