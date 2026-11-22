/**
 * Local backup of everything the reader keeps on the phone: bookmarks, reading position, reading progress,
 * settings, and the journal with its verse collections.
 * Nothing is sent anywhere (zero-account privacy); the reader exports a JSON file and imports it back.
 */
import type { ReadingProgress } from '@/lib/progress';
import type { SanskritScript } from '@/lib/sanskrit-script';
import type { LineSpacing } from '@/theme/fonts';
import type { ThemeName } from '@/theme/themes';

// Kept in step with LANGUAGE_SETTINGS in @/i18n/language (inlined so the node tests need no path aliases).
type LanguageSetting = 'system' | 'en' | 'hi';
const LANGUAGES: LanguageSetting[] = ['system', 'en', 'hi'];

// Kept in step with SANSKRIT_SCRIPTS (@/lib/sanskrit-script) and LINE_SPACINGS (@/theme/fonts), inlined for the node tests.
const SCRIPTS: SanskritScript[] = ['deva', 'beng', 'gujr', 'orya', 'telu', 'knda', 'mlym'];
const SPACINGS: LineSpacing[] = ['compact', 'normal', 'relaxed'];

/** How much glass to draw. 'auto' picks 'light' on budget phones (see @/theme/effects). */
export type EffectsSetting = 'auto' | 'full' | 'light';
export const EFFECTS_SETTINGS: EffectsSetting[] = ['auto', 'full', 'light'];

export const BACKUP_FORMAT = 'dharma-granth-mobile-backup';
export const BACKUP_VERSION = 1;

export interface Bookmark {
  id: string;
  chapter: number;
  verse: string;
  savedAt: string;
}

export interface LastRead {
  id: string;
  chapter: number;
  /** The verse at the top of the screen when the reader left, so Continue lands on it. */
  verse?: string;
  at: string;
}

export interface Settings {
  theme: ThemeName;
  textScale: number;
  showTransliteration: boolean;
  showHindi: boolean;
  showEnglish: boolean;
  showNotes: boolean;
  /** The website's Hindi व्याख्या and जीवन सूत्र under each verse (src/content/vyakhya.ts). */
  showVyakhya: boolean;
  /** Interface language. 'system' follows the phone. Verse text is not affected. */
  language: LanguageSetting;
  /** Opt-in daily verse notification, scheduled on the phone (no server, no push token). */
  dailyReminder: boolean;
  reminderHour: number;
  reminderMinute: number;
  /** Which book the daily verse comes from: the Gita, or the book the reader last opened (Gita if not bundled). */
  reminderBook: ReminderBook;
  /** Weekdays the daily verse may arrive on, as Date.getDay() counts (0 is Sunday). Never empty. */
  reminderDays: number[];
  /** The short first-run welcome has been seen (or skipped). Readers from before it existed count as seen. */
  onboarded: boolean;
  /** Shadows and sheen on cards. 'light' keeps the colours but drops what makes long lists stutter. */
  effects: EffectsSetting;
  /** Sanskrit shown in another Indian script, letter for letter (src/lib/sanskrit-script.ts). */
  sanskritScript: SanskritScript;
  /** Line height of the reading text. */
  lineSpacing: LineSpacing;
  /** The gentle daily reading streak on the Library screen and in the daily verse notification. */
  showStreak: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'sunset',
  textScale: 1,
  showTransliteration: true,
  showHindi: true,
  showEnglish: true,
  showNotes: false,
  showVyakhya: true,
  language: 'system',
  dailyReminder: false,
  reminderHour: 7,
  reminderMinute: 0,
  reminderBook: 'gita',
  reminderDays: [0, 1, 2, 3, 4, 5, 6],
  onboarded: false,
  effects: 'auto',
  sanskritScript: 'deva',
  lineSpacing: 'normal',
  showStreak: true,
};

export const REMINDER_BOOKS = ['gita', 'reading'] as const;
export type ReminderBook = (typeof REMINDER_BOOKS)[number];

function weekdays(raw: unknown): number[] {
  if (!Array.isArray(raw)) return DEFAULT_SETTINGS.reminderDays;
  const days = [...new Set(raw.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6))].sort((a, b) => a - b);
  return days.length > 0 ? days : DEFAULT_SETTINGS.reminderDays;
}

export interface AppData {
  settings: Settings;
  bookmarks: Bookmark[];
  lastRead: LastRead | null;
  progress: ReadingProgress;
}

/**
 * What a backup file holds once read. Progress is passed on as found and cleaned up by normalizeProgress
 * in @/lib/progress when it is merged (kept out of here so this file needs no runtime imports).
 */
export interface ImportedData extends Omit<AppData, 'progress'> {
  progress: unknown;
}

export interface BackupFile extends AppData {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  /**
   * Journal entries and verse collections (@/lib/journal), added after version 1 shipped. Optional, so older
   * backups still read; an older app ignores it. Passed through here and normalised by the journal store.
   */
  journal?: unknown;
}

/** What a backup file holds: the app data, plus the raw sections that other stores normalise themselves. */
export interface ParsedBackup extends ImportedData {
  journal?: unknown;
}

/**
 * Theme names a saved setting or backup may hold. Day and Paper were removed (only Sunset and Dark are left),
 * so those light themes move to Sunset.
 */
const THEME_MIGRATION: Record<string, ThemeName> = { day: 'sunset', paper: 'sunset', sunset: 'sunset', dark: 'dark' };

/** The theme a saved name stands for today, or undefined when it names none. */
export function migrateTheme(raw: unknown): ThemeName | undefined {
  return typeof raw === 'string' && Object.hasOwn(THEME_MIGRATION, raw) ? THEME_MIGRATION[raw] : undefined;
}

export function bookmarkKey(b: Pick<Bookmark, 'id' | 'chapter' | 'verse'>): string {
  return `${b.id}:${b.chapter}:${b.verse}`;
}

function wholeIn(raw: unknown, min: number, max: number, fallback: number): number {
  const n = typeof raw === 'number' ? raw : Number.NaN;
  return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
}

export function normalizeSettings(raw: unknown): Settings {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<Settings>;
  const scale = Number(s.textScale);
  return {
    theme: migrateTheme(s.theme) ?? DEFAULT_SETTINGS.theme,
    textScale: Number.isFinite(scale) ? Math.min(1.6, Math.max(0.8, scale)) : DEFAULT_SETTINGS.textScale,
    showTransliteration: typeof s.showTransliteration === 'boolean' ? s.showTransliteration : DEFAULT_SETTINGS.showTransliteration,
    showHindi: typeof s.showHindi === 'boolean' ? s.showHindi : DEFAULT_SETTINGS.showHindi,
    showEnglish: typeof s.showEnglish === 'boolean' ? s.showEnglish : DEFAULT_SETTINGS.showEnglish,
    showNotes: typeof s.showNotes === 'boolean' ? s.showNotes : DEFAULT_SETTINGS.showNotes,
    showVyakhya: typeof s.showVyakhya === 'boolean' ? s.showVyakhya : DEFAULT_SETTINGS.showVyakhya,
    language: LANGUAGES.includes(s.language as LanguageSetting) ? (s.language as LanguageSetting) : DEFAULT_SETTINGS.language,
    dailyReminder: typeof s.dailyReminder === 'boolean' ? s.dailyReminder : DEFAULT_SETTINGS.dailyReminder,
    reminderHour: wholeIn(s.reminderHour, 0, 23, DEFAULT_SETTINGS.reminderHour),
    reminderMinute: wholeIn(s.reminderMinute, 0, 59, DEFAULT_SETTINGS.reminderMinute),
    reminderBook: REMINDER_BOOKS.includes(s.reminderBook as ReminderBook) ? (s.reminderBook as ReminderBook) : DEFAULT_SETTINGS.reminderBook,
    reminderDays: weekdays(s.reminderDays),
    // Saved settings from before the welcome existed belong to someone who already knows the app.
    onboarded: typeof s.onboarded === 'boolean' ? s.onboarded : raw != null,
    effects: EFFECTS_SETTINGS.includes(s.effects as EffectsSetting) ? (s.effects as EffectsSetting) : DEFAULT_SETTINGS.effects,
    sanskritScript: SCRIPTS.includes(s.sanskritScript as SanskritScript) ? (s.sanskritScript as SanskritScript) : DEFAULT_SETTINGS.sanskritScript,
    lineSpacing: SPACINGS.includes(s.lineSpacing as LineSpacing) ? (s.lineSpacing as LineSpacing) : DEFAULT_SETTINGS.lineSpacing,
    showStreak: typeof s.showStreak === 'boolean' ? s.showStreak : DEFAULT_SETTINGS.showStreak,
  };
}

export function normalizeBookmarks(raw: unknown): Bookmark[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: Bookmark[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const b = item as Partial<Bookmark>;
    const chapter = Number(b.chapter);
    if (typeof b.id !== 'string' || !b.id || !Number.isFinite(chapter) || b.verse == null) continue;
    const clean: Bookmark = {
      id: b.id,
      chapter,
      verse: String(b.verse),
      savedAt: typeof b.savedAt === 'string' ? b.savedAt : new Date(0).toISOString(),
    };
    const key = bookmarkKey(clean);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out;
}

export function normalizeLastRead(raw: unknown): LastRead | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<LastRead>;
  const chapter = Number(r.chapter);
  if (typeof r.id !== 'string' || !r.id || !Number.isFinite(chapter)) return null;
  const at = typeof r.at === 'string' ? r.at : new Date(0).toISOString();
  return r.verse != null && r.verse !== '' ? { id: r.id, chapter, verse: String(r.verse), at } : { id: r.id, chapter, at };
}

export function makeBackup(data: AppData, now = new Date(), extra: { journal?: unknown } = {}): BackupFile {
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now.toISOString(), ...data, ...extra };
}

/** Why a backup could not be read. The message is English; the code lets the UI show it in the reader's language. */
export class BackupError extends Error {
  readonly code: 'not-json' | 'wrong-file' | 'too-new';
  constructor(code: BackupError['code'], message: string) {
    super(message);
    this.name = 'BackupError';
    this.code = code;
  }
}

/** Reads a backup file's text. Throws a BackupError when it is not one of ours. */
export function parseBackup(text: string): ParsedBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new BackupError('not-json', 'This file is not valid JSON.');
  }
  if (!parsed || typeof parsed !== 'object' || (parsed as BackupFile).format !== BACKUP_FORMAT) {
    throw new BackupError('wrong-file', 'This is not a Dharma Granth backup file.');
  }
  const b = parsed as BackupFile;
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) {
    throw new BackupError('too-new', 'This backup was made by a newer version of the app.');
  }
  return {
    settings: normalizeSettings(b.settings),
    bookmarks: normalizeBookmarks(b.bookmarks),
    lastRead: normalizeLastRead(b.lastRead),
    ...(b.journal !== undefined ? { journal: b.journal } : {}),
    progress: b.progress,
  };
}

/** Bookmarks from a backup are added to the ones already on the phone; nothing already saved is lost. */
export function mergeBookmarks(current: Bookmark[], incoming: Bookmark[]): Bookmark[] {
  return normalizeBookmarks([...current, ...incoming]);
}
