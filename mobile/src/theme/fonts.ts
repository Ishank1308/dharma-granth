import type { TextStyle } from 'react-native';

import type { SanskritScript } from '@/lib/sanskrit-script';

/**
 * Tiro Devanagari Sanskrit, the website's shloka face (public/fonts/tiro-devanagari-sanskrit-400.woff2).
 * Embedded in the Android build by the expo-font config plugin (app.json), where a font's family is its
 * file name; the web preview loads it with useFonts in the root layout. SIL Open Font License
 * (assets/fonts/TiroDevanagariSanskrit-OFL.txt).
 */
export const SANSKRIT_FONT = 'TiroDevanagariSanskrit';

/** The shloka face for Devanagari. Other scripts keep the phone's own Noto fonts, which cover them well. */
export function sanskritFont(script: SanskritScript): TextStyle {
  return script === 'deva' ? { fontFamily: SANSKRIT_FONT } : {};
}

export type LineSpacing = 'compact' | 'normal' | 'relaxed';
export const LINE_SPACINGS: LineSpacing[] = ['compact', 'normal', 'relaxed'];

/** Multiplies every reading line height (verse, अर्थ, व्याख्या), as the website's line-spacing choice. */
export const LINE_FACTOR: Record<LineSpacing, number> = { compact: 0.88, normal: 1, relaxed: 1.15 };
