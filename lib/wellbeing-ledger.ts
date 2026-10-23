/**
 * Small, local-only record for a person's intentionally started study sessions.
 * It stores a day and duration only: no verse, query, mood, or route is captured.
 */

export const STUDY_SESSIONS_KEY = 'dharma.wellbeing.study-sessions.v1';
export const WELLBEING_UPDATED_EVENT = 'dharma-wellbeing-updated';
const MAX_STORED_SESSIONS = 400;
const WINDOW_DAYS = 28;

export interface StudySessionRecord {
  id: string;
  day: string;
  minutes: number;
}

export interface WellbeingSnapshot {
  windowDays: number;
  readingDays: number;
  reflectionDays: number;
  wisdomSessions: number;
  studyMinutes: number;
}

export type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function localDay(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function validDay(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
}

function validSession(value: unknown): value is StudySessionRecord {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' && /^[A-Za-z0-9-]{1,80}$/.test(value.id) &&
    validDay(value.day) &&
    typeof value.minutes === 'number' && Number.isInteger(value.minutes) &&
    value.minutes >= 1 && value.minutes <= 180
  );
}

function resolveStorage(store?: StoragePort): StoragePort | null {
  if (store) return store;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStudySessions(store?: StoragePort): StudySessionRecord[] {
  const target = resolveStorage(store);
  if (!target) return [];
  try {
    const parsed: unknown = JSON.parse(target.getItem(STUDY_SESSIONS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(validSession).slice(-MAX_STORED_SESSIONS) : [];
  } catch {
    return [];
  }
}

/** Save only the duration a user explicitly confirms at the end of a timer. */
export function recordStudySession(minutes: number, date = new Date(), store?: StoragePort): StudySessionRecord | null {
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) return null;
  const target = resolveStorage(store);
  if (!target) return null;
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${date.getTime()}-${Math.random().toString(36).slice(2, 10)}`;
  const session: StudySessionRecord = { id, day: localDay(date), minutes };
  try {
    target.setItem(STUDY_SESSIONS_KEY, JSON.stringify([...readStudySessions(target), session].slice(-MAX_STORED_SESSIONS)));
    return session;
  } catch {
    return null;
  }
}

function shiftLocalDay(date: Date, days: number): string {
  const shifted = new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  return localDay(shifted);
}

function isReflectionPresent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (!isRecord(value)) return false;
  return ['note', 'learned', 'challenged', 'apply', 'action'].some(
    (field) => typeof value[field] === 'string' && (value[field] as string).trim().length > 0,
  );
}

/**
 * Read a modest, rolling view of wellbeing practice from local browser data.
 * No per-action events are sent or written by this function.
 */
export function readWellbeingSnapshot(now = new Date(), store?: StoragePort): WellbeingSnapshot {
  const target = resolveStorage(store);
  const snapshot: WellbeingSnapshot = {
    windowDays: WINDOW_DAYS,
    readingDays: 0,
    reflectionDays: 0,
    wisdomSessions: 0,
    studyMinutes: 0,
  };
  if (!target) return snapshot;

  const inWindow = new Set(Array.from({ length: WINDOW_DAYS }, (_, index) => shiftLocalDay(now, -index)));

  try {
    const reading: unknown = JSON.parse(target.getItem('dharma.readingDays.v1') ?? '{}');
    if (isRecord(reading)) {
      snapshot.readingDays = Object.entries(reading).filter(([day, chapters]) =>
        validDay(day) && inWindow.has(day) && Array.isArray(chapters) && chapters.length > 0,
      ).length;
    }
  } catch {
    // Reading history can be malformed or unavailable; report no readings.
  }

  try {
    const reflections: unknown = JSON.parse(target.getItem('dharma.practice.reflections') ?? '{}');
    if (isRecord(reflections)) {
      snapshot.reflectionDays = Object.entries(reflections).filter(([day, entry]) =>
        validDay(day) && inWindow.has(day) && isReflectionPresent(entry),
      ).length;
    }
  } catch {
    // Reflection data is private and optional; never let it break the dashboard.
  }

  const sessions = readStudySessions(target).filter((session) => inWindow.has(session.day));
  snapshot.wisdomSessions = sessions.length;
  snapshot.studyMinutes = sessions.reduce((total, session) => total + session.minutes, 0);
  return snapshot;
}
