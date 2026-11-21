'use client';

import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type LanguagePreference = 'bilingual' | 'hindi' | 'english' | 'sanskrit';

export interface LanguageOption {
  id: LanguagePreference;
  label: string;
  shortLabel: string;
  sub: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'bilingual', label: 'द्विभाषी (Bilingual)', shortLabel: 'द्विभाषी', sub: 'हिन्दी + English' },
  { id: 'hindi', label: 'हिन्दी (Hindi)', shortLabel: 'हिन्दी', sub: 'प्राथमिक हिन्दी' },
  { id: 'english', label: 'English', shortLabel: 'English', sub: 'English focus' },
  { id: 'sanskrit', label: 'संस्कृत (Sanskrit)', shortLabel: 'संस्कृत', sub: 'मूल संहिता व पाठ' },
];

export const LANGUAGE_PREFERENCE_KEY = 'dharma.language_preference';

/**
 * The choice is mirrored on <html data-ui-lang>, where one rule in components.css shows a
 * two-language label (`data-bi="en"` / `data-bi="hi"` / `data-bi="sep"`) in the chosen language
 * only. Both halves stay in the markup, so the pre-rendered page and crawlers are unchanged.
 * app/layout.tsx sets the same attribute before first paint.
 */
export function applyUiLanguage(preference: LanguagePreference) {
  if (typeof document === 'undefined') return;
  if (preference === 'bilingual') document.documentElement.removeAttribute('data-ui-lang');
  else document.documentElement.setAttribute('data-ui-lang', preference);
}

function isPreference(value: unknown): value is LanguagePreference {
  return LANGUAGE_OPTIONS.some((opt) => opt.id === value);
}

export function useLanguagePreference() {
  const [preference, setStored] = useLocalStorage<LanguagePreference>(LANGUAGE_PREFERENCE_KEY, 'bilingual');

  const setPreference = useCallback(
    (next: LanguagePreference) => {
      setStored(next);
      applyUiLanguage(next);
      // The header menu and the phone drawer each hold this hook; the `storage` event only reaches
      // other tabs, so tell the other copy on this page too.
      try {
        window.dispatchEvent(new StorageEvent('storage', { key: LANGUAGE_PREFERENCE_KEY, newValue: JSON.stringify(next) }));
      } catch {
        // StorageEvent cannot be constructed in a few old browsers; the choice is still saved and applied.
      }
    },
    [setStored],
  );

  // A change made in another tab.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== LANGUAGE_PREFERENCE_KEY || e.newValue === null) return;
      try {
        const next: unknown = JSON.parse(e.newValue);
        if (isPreference(next)) applyUiLanguage(next);
      } catch {
        // ignore a malformed value
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return {
    preference,
    setPreference,
    currentOption:
      LANGUAGE_OPTIONS.find((opt) => opt.id === preference) ?? LANGUAGE_OPTIONS[0],
    options: LANGUAGE_OPTIONS,
  };
}
