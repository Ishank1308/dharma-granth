'use client';

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Sun } from 'lucide-react';
import { THEME_NAMES, type Theme } from '../ThemeProvider';
import { THEME_IDS } from '@/lib/site-theme';
import { triggerTactileFeedback } from '@/lib/haptics';
import { THEME_ICONS } from './nav-data';

export function HeaderThemeMenu({
  theme,
  themeTouched,
  onSelectTheme,
}: {
  theme: Theme;
  themeTouched: boolean;
  onSelectTheme: (next: Theme) => void;
}) {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  // A menu must open on its selected item and allow one Tab to leave the popup.
  // Escape returns focus to the trigger; arrows are handled by the menu itself.
  useEffect(() => {
    if (!themeMenuOpen) return;
    const menu = themeMenuRef.current?.querySelector<HTMLElement>('[role="menu"]');
    const selected = menu?.querySelector<HTMLElement>('[role="menuitemradio"][aria-checked="true"]');
    (selected ?? menu?.querySelector<HTMLElement>('[role="menuitemradio"]'))?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setThemeMenuOpen(false);
      themeButtonRef.current?.focus();
    }
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!themeMenuRef.current?.contains(event.target as Node)) setThemeMenuOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [themeMenuOpen]);

  const handlePickTheme = (next: Theme) => {
    triggerTactileFeedback('medium', 'softTap');
    onSelectTheme(next);
    setThemeMenuOpen(false);
    themeButtonRef.current?.focus();
  };

  const ThemeIcon = THEME_ICONS[theme] || Sun;

  return (
    <div ref={themeMenuRef} className="relative min-[1800px]:hidden">
      <button
        ref={themeButtonRef}
        type="button"
        onClick={() => setThemeMenuOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={themeMenuOpen}
        className="apple-icon-button h-11 w-11 min-h-[44px] min-w-[44px] lg:h-9 lg:w-auto lg:min-h-0 lg:min-w-0 lg:px-2.5 lg:gap-1.5"
        aria-label={`थीम बदलें · Theme: ${THEME_NAMES[theme].name}`}
        title={`थीम: ${THEME_NAMES[theme].name} · ${THEME_NAMES[theme].hi}`}
      >
        <span
          key={theme}
          className={`flex items-center justify-center ${themeTouched ? 'chrome-icon-swap' : ''}`}
        >
          <ThemeIcon className="h-5 w-5 lg:h-4 lg:w-4" aria-hidden="true" />
        </span>{' '}
        <span lang="hi" className="hidden xl:inline font-devanagari text-xs font-medium text-dharma-text-secondary">
          {THEME_NAMES[theme].hi}
        </span>
      </button>
      {themeMenuOpen && (
        <div
          role="menu"
          tabIndex={-1}
          aria-label="Theme · थीम"
          onBlur={(event) => {
            if (!themeMenuRef.current?.contains(event.relatedTarget as Node | null)) {
              setThemeMenuOpen(false);
            }
          }}
          onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
            const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
            if (!items.length) return;
            const index = items.indexOf(document.activeElement as HTMLButtonElement);
            let next = index;
            if (event.key === 'ArrowDown') next = (index + 1) % items.length;
            else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = items.length - 1;
            else return;
            event.preventDefault();
            items[next]?.focus();
          }}
          className="material-thick liquid-glass absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-dharma-border/80 bg-dharma-card/85 p-1 shadow-xl backdrop-blur-2xl"
        >
          {THEME_IDS.map((id) => {
            const Icon = THEME_ICONS[id] || Sun;
            const active = id === theme;
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                tabIndex={-1}
                onClick={() => handlePickTheme(id)}
                title={THEME_NAMES[id].description}
                className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-semibold transition ${
                  active ? 'bg-saffron-500/15 text-dharma-text' : 'text-dharma-muted hover:bg-saffron-500/10 hover:text-dharma-text'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 text-saffron-600 dark:text-amber-400" aria-hidden="true" />
                <span>{THEME_NAMES[id].name}</span>{' '}
                <span lang="hi" className="ml-auto font-devanagari font-normal text-dharma-muted">{THEME_NAMES[id].hi}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
