'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunset, Moon, BookOpen, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { triggerTactileFeedback } from '@/lib/haptics';
import { THEMES, THEME_NAMES, useTheme, type Theme } from './ThemeProvider';

const ICONS: Record<Theme, ReactNode> = {
  auto: <Sparkles className="w-4 h-4 text-amber-400" />,
  day: <Sun className="w-4 h-4" />,
  sunset: <Sunset className="w-4 h-4" />,
  paper: <BookOpen className="w-4 h-4" />,
  night: <Moon className="w-4 h-4" />,
};


/**
 * Compact 3-way segmented theme picker. Explicit choices are easier
 * than cycling when users are comparing day, sunset, and dark modes.
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
              <motion.span
                layoutId="theme-toggle-active-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 shadow-sm"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <AnimatePresence mode="wait">
              <motion.span
                key={`${option}-${active}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="relative inline-flex"
              >
                {ICONS[option]}
              </motion.span>
            </AnimatePresence>
            <span className="relative hidden min-[2200px]:inline">{THEME_NAMES[option].name}</span>
          </button>
        );
      })}
    </div>
  );
}
