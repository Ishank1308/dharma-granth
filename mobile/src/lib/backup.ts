/**
 * Local backup of everything the reader keeps on the phone: bookmarks, reading position and settings.
 * Nothing is sent anywhere (zero-account privacy); the reader exports a JSON file and imports it back.
 */
import type { ThemeName } from '@/theme/themes';

// Kept in step with LANGUAGE_SETTINGS in @/i18n/language (inlined so the node tests need no path aliases).
type LanguageSetting = 'system' | 'en' | 'hi';
const LANGUAGES: LanguageSetting[] = ['system', 'en', 'hi'];

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
  at: string;
}

export interface Settings {
  theme: ThemeName;
  textScale: number;
  showTransliteration: boolean;
  showHindi: boolean;
  showEnglish: boolean;
  showNotes: boolean;
  /** Interface language. 'system' follows the phone. Verse text is not affected. */
  language: LanguageSetting;
  /** Opt-in daily verse notification, scheduled on the phone (no server, no push token). */
  dailyReminder: boolean;
  reminderHour: number;
  reminderMinute: number;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'day',
  textScale: 1,
  showTransliteration: true,
  showHindi: true,
  showEnglish: true,
  showNotes: false,
  language: 'system',
  dailyReminder: false,
  reminderHour: 7,
  reminderMinute: 0,
};

export interface AppData {
  settings: Settings;
  bookmarks: Bookmark[];
  lastRead: LastRead | null;
}

export interface BackupFile extends AppData {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
}

const THEMES: ThemeName[] = ['day', 'sunset', 'paper', 'dark'];

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
    theme: THEMES.includes(s.theme as ThemeName) ? (s.theme as ThemeName) : DEFAULT_SETTINGS.theme,
    textScale: Number.isFinite(scale) ? Math.min(1.6, Math.max(0.8, scale)) : DEFAULT_SETTINGS.textScale,
    showTransliteration: typeof s.showTransliteration === 'boolean' ? s.showTransliteration : DEFAULT_SETTINGS.showTransliteration,
    showHindi: typeof s.showHindi === 'boolean' ? s.showHindi : DEFAULT_SETTINGS.showHindi,
    showEnglish: typeof s.showEnglish === 'boolean' ? s.showEnglish : DEFAULT_SETTINGS.showEnglish,
    showNotes: typeof s.showNotes === 'boolean' ? s.showNotes : DEFAULT_SETTINGS.showNotes,
    language: LANGUAGES.includes(s.language as LanguageSetting) ? (s.language as LanguageSetting) : DEFAULT_SETTINGS.language,
    dailyReminder: typeof s.dailyReminder === 'boolean' ? s.dailyReminder : DEFAULT_SETTINGS.dailyReminder,
    reminderHour: wholeIn(s.reminderHour, 0, 23, DEFAULT_SETTINGS.reminderHour),
    reminderMinute: wholeIn(s.reminderMinute, 0, 59, DEFAULT_SETTINGS.reminderMinute),
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
  return { id: r.id, chapter, at: typeof r.at === 'string' ? r.at : new Date(0).toISOString() };
}

export function makeBackup(data: AppData, now = new Date()): BackupFile {
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now.toISOString(), ...data };
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
export function parseBackup(text: string): AppData {
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
  };
}

/** Bookmarks from a backup are added to the ones already on the phone; nothing already saved is lost. */
export function mergeBookmarks(current: Bookmark[], incoming: Bookmark[]): Bookmark[] {
  return normalizeBookmarks([...current, ...incoming]);
}
