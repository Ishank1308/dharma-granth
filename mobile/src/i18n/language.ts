/** Which language the interface uses. No imports, so app state can use it without a cycle. */
export type Lang = 'en' | 'hi';
export type LanguageSetting = 'system' | Lang;

export const LANGUAGE_SETTINGS: LanguageSetting[] = ['system', 'en', 'hi'];

/**
 * The phone's language, as far as the interface cares: Hindi or English. Hermes answers Intl from the
 * Android system locale, so no native module is needed. Anything that is not Hindi falls back to English.
 */
export function deviceLanguage(): Lang {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    return locale.toLowerCase().startsWith('hi') ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function resolveLanguage(setting: LanguageSetting | undefined, device: Lang = deviceLanguage()): Lang {
  return setting === 'en' || setting === 'hi' ? setting : device;
}
