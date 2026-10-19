// Portable sadhana and lesson progress. A restore that fails validation
// writes nothing, so a bad file cannot replace a journal.

export const SADHANA_FORMAT = 'dharma-granth-sadhana';
export const SADHANA_VERSION = 1;

export interface SadhanaBackupFile {
  format: typeof SADHANA_FORMAT;
  version: typeof SADHANA_VERSION;
  exportedAt: string;
  data: Record<string, string>;
}

type Shape = 'object' | 'array' | 'boolean' | 'json';

/** Keys for the japa counter, meditation timer, journals, and /learn progress. */
const SHAPE: Record<string, Shape> = {
  'dharma.practice.japa': 'object',
  'dharma.practice.japa.sound': 'boolean',
  'dharma.practice.japa.vibration': 'boolean',
  'dharma.practice.meditation': 'object',
  'dharma.practice.meditation.sound': 'boolean',
  'dharma.practice.meditation.reduced_motion': 'boolean',
  'dharma.practice.pranayama': 'object',
  'dharma.practice.pranayama.vibration': 'boolean',
  'dharma.practice.reflections': 'object',
  'dharma.practice.gratitude': 'object',
  'dharma.practice.sankalpa': 'array',
  'dharma.pathways': 'array',
  'dharma.quizzes': 'array',
  'dharma.streak': 'object',
  'dharma.readingPlans.v1': 'object',
};

function allowed(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(SHAPE, key) || key.startsWith('dharma.certificate.');
}

function shapeOf(key: string): Shape {
  return SHAPE[key] ?? 'json';
}

function checkShape(shape: Shape, body: unknown): boolean {
  if (shape === 'object') return Boolean(body) && typeof body === 'object' && !Array.isArray(body);
  if (shape === 'array') return Array.isArray(body);
  if (shape === 'boolean') return typeof body === 'boolean';
  return body !== undefined;
}

export function createSadhanaBackup(storage: Storage = window.localStorage): SadhanaBackupFile {
  const data: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key || !allowed(key)) continue;
    const value = storage.getItem(key);
    if (value !== null) data[key] = value;
  }
  return { format: SADHANA_FORMAT, version: SADHANA_VERSION, exportedAt: new Date().toISOString(), data };
}

/**
 * Validates every key before the first write. Throws on a foreign file or a
 * value that is not the shape that tool stores. Returns how many keys were written.
 */
export function restoreSadhanaBackup(raw: string, storage: Storage = window.localStorage): number {
  const parsed: unknown = JSON.parse(raw);
  const file = parsed as Partial<SadhanaBackupFile> | null;
  if (!file || file.format !== SADHANA_FORMAT || file.version !== SADHANA_VERSION || !file.data || typeof file.data !== 'object' || Array.isArray(file.data)) {
    throw new Error('Not a Dharma Granth sadhana backup');
  }
  const entries: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(file.data)) {
    if (!allowed(key) || typeof value !== 'string') throw new Error('Invalid sadhana backup');
    let body: unknown;
    try {
      body = JSON.parse(value);
    } catch {
      throw new Error('Invalid sadhana backup');
    }
    if (!checkShape(shapeOf(key), body)) throw new Error('Invalid sadhana backup');
    entries.push([key, value]);
  }
  for (const [key, value] of entries) storage.setItem(key, value);
  return entries.length;
}
