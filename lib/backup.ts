/** Keys that hold the reader's own data (progress, bookmarks, notes, settings). */
const EXTRA_KEYS = ['verse-bookmarks', 'bookmarkedSections', 'darkMode'];

export const BACKUP_FORMAT = 'dharma-granth-backup';
export const BACKUP_SCHEMA_VERSION = 1;
const MAX_BACKUP_KEYS = 20_000;
const MAX_BACKUP_VALUE_LENGTH = 5 * 1024 * 1024;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  /** Current format marker. `version` remains for compatibility with earlier exports. */
  schemaVersion: typeof BACKUP_SCHEMA_VERSION;
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
}

export type BackupRestoreMode = 'merge' | 'replace';

/**
 * The saved shape of keys that pages read during render. A backup value of another
 * shape (a hand-edited file, a cut-off export) is refused before anything is written,
 * so a restore can never leave a page that fails to load.
 */
const VALUE_SHAPES: Record<string, 'array' | 'object'> = {
  'dharma.bookmarkedVerses': 'array',
  'dharma.notes': 'array',
  'dharma.recentChapters': 'array',
  'dharma.pathways': 'array',
  'dharma.quizzes': 'array',
  'dharma.practice.sankalpa': 'array',
  'dharma-gita-journey-studied': 'array',
  'dharma.streak': 'object',
  'dharma.readingPlans.v1': 'object',
  'dharma.panchang.location': 'object',
  'dharma.practice.japa': 'object',
  'dharma.practice.meditation': 'object',
  'dharma.practice.pranayama': 'object',
  'dharma.practice.reflections': 'object',
  'dharma.gita.sankalpa.v1': 'object',
};

function hasSavedShape(key: string, value: string): boolean {
  const shape = VALUE_SHAPES[key];
  if (!shape) return true;
  let body: unknown;
  try {
    body = JSON.parse(value);
  } catch {
    return false;
  }
  if (shape === 'array') return Array.isArray(body) && body.every((item) => item !== null && item !== undefined);
  return Boolean(body) && typeof body === 'object' && !Array.isArray(body);
}

const isOwnKey = (key: string) =>
  key.startsWith('dharma.') ||
  key.startsWith('dharma_') ||
  key.startsWith('dharma-') ||
  key.startsWith('dharmagranth_') ||
  EXTRA_KEYS.includes(key);

function readOwnData(storage: Storage): Record<string, string> {
  const data: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    const value = key ? storage.getItem(key) : null;
    if (key && value !== null && isOwnKey(key)) data[key] = value;
  }
  return data;
}

export function createBackup(storage: Storage = window.localStorage): BackupFile {
  return {
    format: BACKUP_FORMAT,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    version: 1,
    exportedAt: new Date().toISOString(),
    data: readOwnData(storage),
  };
}

function validateBackup(raw: string): Record<string, string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Backup file is not valid JSON');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Not a Dharma Granth backup file');
  }
  const file = parsed as Partial<BackupFile>;
  const legacyVersion = file.schemaVersion === undefined && file.version === 1;
  if (
    file.format !== BACKUP_FORMAT ||
    (file.schemaVersion !== BACKUP_SCHEMA_VERSION && !legacyVersion) ||
    typeof file.exportedAt !== 'string' ||
    Number.isNaN(Date.parse(file.exportedAt)) ||
    !file.data || typeof file.data !== 'object' || Array.isArray(file.data)
  ) {
    throw new Error('Not a supported Dharma Granth backup file');
  }

  const entries = Object.entries(file.data);
  if (entries.length > MAX_BACKUP_KEYS) throw new Error('Backup contains too many storage keys');

  const data: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (!isOwnKey(key) || key.length > 256 || typeof value !== 'string' || value.length > MAX_BACKUP_VALUE_LENGTH) {
      throw new Error('Backup contains an unsupported or invalid storage entry');
    }
    if (!hasSavedShape(key, value)) {
      throw new Error(`Backup entry "${key}" is damaged, so nothing was restored`);
    }
    data[key] = value;
  }
  return data;
}

/**
 * Restores a validated backup. Merge overwrites matching keys while retaining
 * other local keys; replace clears all app-owned keys before applying the file.
 * Storage is rolled back best-effort if a write fails, such as on quota limits.
 */
export function restoreBackup(
  raw: string,
  mode: BackupRestoreMode = 'merge',
  storage: Storage = window.localStorage,
): number {
  const data = validateBackup(raw);
  const before = readOwnData(storage);
  const changedKeys = Array.from(new Set([...Object.keys(before), ...Object.keys(data)]));

  try {
    if (mode === 'replace') clearOwnData(storage);
    for (const [key, value] of Object.entries(data)) storage.setItem(key, value);
    return Object.keys(data).length;
  } catch (error) {
    try {
      for (const key of changedKeys) storage.removeItem(key);
      for (const [key, value] of Object.entries(before)) storage.setItem(key, value);
    } catch {
      // Preserve the original write error; browser storage may remain unavailable.
    }
    throw error;
  }
}

/** Removes every key this site stores in the browser. Returns how many were removed. */
export function clearOwnData(storage: Storage = window.localStorage): number {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && isOwnKey(key)) keys.push(key);
  }
  keys.forEach((key) => storage.removeItem(key));
  return keys.length;
}
