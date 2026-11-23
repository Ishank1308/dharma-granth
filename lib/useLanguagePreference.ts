'use client';

import { useEffect, useRef } from 'react';
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

/**
 * The choice is mirrored on <html data-ui-lang>, where one rule in components.css shows a
 * two-language label (`data-bi="en"` / `data-bi="hi"` / `data-bi="sep"`) in the chosen language
 * only. Both halves stay in the markup, so the pre-rendered page and crawlers are unchanged.
 * app/layout.tsx sets the same attribute before first paint.
 *
 * One owner: SiteNav calls this once and hands the value to the header menu (LanguageToggle)
 * and the phone drawer, so the two never disagree.
 */
export function useLanguagePreference() {
  const [preference, setPreference] = useLocalStorage<LanguagePreference>(
    'dharma.language_preference',
    'bilingual',
  );

  // Every change after the first render goes to <html>: a choice made here, the stored choice once
  // it has loaded, and a change made in another tab (useLocalStorage follows `storage` events).
  // The first render is left alone: `preference` is still the default then, and the inline script
  // has already set the stored choice. "bilingual" matches no rule, the same as no attribute.
  // Kept short on purpose: this runs on every page, and the home page's script budget is tight.
  const applied = useRef(preference);
  useEffect(() => {
    if (applied.current === preference) return;
    applied.current = preference;
    document.documentElement.dataset.uiLang = preference;
    document.documentElement.lang =
      preference === 'english' ? 'en' : preference === 'sanskrit' ? 'sa' : 'hi';
  }, [preference]);

  return { preference, setPreference };
}
