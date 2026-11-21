/**
 * A deliberately tiny i18n layer: two languages, typed string pairs in ./strings, no library.
 *
 *   const { t, lang } = useI18n();
 *   t(S.theme)            // "Theme" or "रंग-रूप"
 *   t(S.verseCount(47))   // "47 verses" or "47 श्लोक"
 *
 * The reader picks English, Hindi or "phone language" in Settings (settings.language). Phone language
 * follows the device locale (see ./language).
 */
import { useCallback } from 'react';

import { useAppState } from '@/state/app-state';
import type { Lang } from './language';
import type { Msg } from './strings';

export * from './language';
export { S, type Msg } from './strings';

export function useI18n(): { lang: Lang; t: (m: Msg) => string } {
  const { lang } = useAppState();
  const t = useCallback((m: Msg) => m[lang], [lang]);
  return { lang, t };
}
