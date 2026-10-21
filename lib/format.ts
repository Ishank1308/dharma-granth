/**
 * Shared formatting: counts with correct singular and plural, Indian or
 * international digit grouping, local dates, and scripture and language
 * labels. Use these instead of writing `${n} verses` by hand.
 */

export type NumberSystem = 'indian' | 'international';
export type UiLanguage = 'en' | 'hi';

/** "1 verse", "2 verses", "0 verses". Hindi nouns here keep one form. */
export function plural(n: number, singular: string, pluralForm = `${singular}s`): string {
  return n === 1 ? singular : pluralForm;
}

const NOUNS = {
  chapter: { en: ['chapter', 'chapters'], hi: ['अध्याय', 'अध्याय'] },
  verse: { en: ['verse', 'verses'], hi: ['श्लोक', 'श्लोक'] },
  session: { en: ['session', 'sessions'], hi: ['सत्र', 'सत्र'] },
  day: { en: ['day', 'days'], hi: ['दिन', 'दिन'] },
  reading: { en: ['reading', 'readings'], hi: ['पाठ', 'पाठ'] },
  lesson: { en: ['lesson', 'lessons'], hi: ['पाठ', 'पाठ'] },
  minute: { en: ['minute', 'minutes'], hi: ['मिनट', 'मिनट'] },
} as const;

export type CountNoun = keyof typeof NOUNS;

const grouping = (system: NumberSystem) => (system === 'indian' ? 'en-IN' : 'en-US');

/** 1,23,456 (Indian) or 123,456 (international). Non-finite input gives an en dash. */
export function formatNumber(n: number, system: NumberSystem = 'international'): string {
  if (!Number.isFinite(n)) return '–';
  return new Intl.NumberFormat(grouping(system)).format(n);
}

/** Number plus noun with the right form: countLabel(1, 'verse') is "1 verse". */
export function countLabel(n: number, noun: CountNoun, lang: UiLanguage = 'en', system: NumberSystem = 'international'): string {
  const [one, many] = NOUNS[noun][lang];
  return `${formatNumber(n, system)} ${n === 1 ? one : many}`;
}

export const chapterCount = (n: number, lang: UiLanguage = 'en', system?: NumberSystem) => countLabel(n, 'chapter', lang, system);
export const verseCount = (n: number, lang: UiLanguage = 'en', system?: NumberSystem) => countLabel(n, 'verse', lang, system);
export const sessionCount = (n: number, lang: UiLanguage = 'en', system?: NumberSystem) => countLabel(n, 'session', lang, system);
export const dayCount = (n: number, lang: UiLanguage = 'en', system?: NumberSystem) => countLabel(n, 'day', lang, system);

/** A "YYYY-MM-DD" string is a calendar day in the reader's own time zone, never a UTC instant. */
export function parseLocalDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
}

/** Localised date. Pass `timeZone` to show a date for a specific place (for example a Panchang location). */
export function formatDate(
  value: string | Date,
  lang: UiLanguage = 'en',
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
  timeZone?: string,
): string {
  const d = parseLocalDate(value);
  if (Number.isNaN(d.getTime())) return '–';
  return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { ...options, numberingSystem: 'latn', ...(timeZone ? { timeZone } : {}) }).format(d);
}

/** "Last opened 3 days ago" style helper without false precision. */
export function daysAgo(value: string | Date, now: Date = new Date(), lang: UiLanguage = 'en'): string {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((start(now) - start(parseLocalDate(value))) / 86_400_000);
  if (days <= 0) return lang === 'hi' ? 'आज' : 'today';
  if (days === 1) return lang === 'hi' ? 'कल' : 'yesterday';
  return lang === 'hi' ? `${days} दिन पहले` : `${days} days ago`;
}

export interface TitledScripture {
  title?: string;
  titleSanskrit?: string;
  titleHindi?: string;
}

/** Scripture title in the chosen language, falling back to whatever exists. */
export function scriptureTitle(s: TitledScripture, lang: UiLanguage | 'both' = 'both'): string {
  const en = s.title ?? '';
  const sa = s.titleHindi ?? s.titleSanskrit ?? '';
  if (lang === 'en') return en || sa;
  if (lang === 'hi') return sa || en;
  return [en, sa].filter(Boolean).join(' · ');
}

const LANGUAGE_LABELS: Record<string, { en: string; hi: string }> = {
  sa: { en: 'Sanskrit', hi: 'संस्कृत' },
  'sa-Latn': { en: 'Sanskrit (Roman)', hi: 'संस्कृत (रोमन)' },
  hi: { en: 'Hindi', hi: 'हिन्दी' },
  en: { en: 'English', hi: 'अंग्रेज़ी' },
};

export function languageLabel(code: string, lang: UiLanguage = 'en'): string {
  return LANGUAGE_LABELS[code]?.[lang] ?? code;
}
