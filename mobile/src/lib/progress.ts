/**
 * Reading progress and the daily reading streak. Pure logic, no React or native code, so `npm test` can
 * run it. Everything is kept on the phone (zero-account privacy) and goes into the local JSON backup.
 *
 * A verse counts as read once it has stayed on screen for a moment (see the reader), not when it merely
 * flew past in a fling. A day counts towards the streak once at least one verse was read on it.
 */

export interface ReadingProgress {
  /** Verse numbers read, by book id, then chapter number (as a string key). */
  verses: Record<string, Record<string, string[]>>;
  /** Local days (YYYY-MM-DD) with at least one verse read, oldest first, capped at MAX_DAYS. */
  days: string[];
  /** The longest run of days ever, kept on its own so trimming old days never lowers it. */
  best: number;
}

export const EMPTY_PROGRESS: ReadingProgress = { verses: {}, days: [], best: 0 };

/** About two years of days: enough for the week strip and any streak, small enough to save often. */
export const MAX_DAYS = 800;

/** How long a verse has to stay on screen before it counts as read. */
export const READ_DWELL_MS = 1500;

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** The phone's local date as YYYY-MM-DD (sortable as text). */
export function dayKey(date = new Date()): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** The day `delta` days after (or before) a YYYY-MM-DD key. Calendar arithmetic, so DST cannot skip a day. */
export function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + delta));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`;
}

/** Longest run of consecutive days in a sorted, de-duplicated list. */
function longestRun(days: string[]): number {
  let best = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && addDays(days[i - 1], 1) === days[i] ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

/** Consecutive read days ending exactly on `end` (0 if `end` itself was not a read day). */
export function runEndingOn(days: string[], end: string): number {
  const set = new Set(days);
  let n = 0;
  let day = end;
  while (set.has(day)) {
    n += 1;
    day = addDays(day, -1);
  }
  return n;
}

export function normalizeProgress(raw: unknown): ReadingProgress {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_PROGRESS, verses: {}, days: [] };
  const r = raw as Partial<ReadingProgress>;
  const verses: ReadingProgress['verses'] = {};
  if (r.verses && typeof r.verses === 'object') {
    for (const [id, chapters] of Object.entries(r.verses)) {
      if (!id || !chapters || typeof chapters !== 'object') continue;
      const clean: Record<string, string[]> = {};
      for (const [ch, list] of Object.entries(chapters as Record<string, unknown>)) {
        if (!Number.isFinite(Number(ch)) || !Array.isArray(list)) continue;
        const nums = [...new Set(list.filter((v) => v != null && v !== '').map(String))];
        if (nums.length) clean[String(Number(ch))] = nums;
      }
      if (Object.keys(clean).length) verses[id] = clean;
    }
  }
  const days = [...new Set(Array.isArray(r.days) ? r.days.filter((d): d is string => typeof d === 'string' && DAY_RE.test(d)) : [])]
    .sort()
    .slice(-MAX_DAYS);
  const best = Math.max(Number.isInteger(r.best) && (r.best as number) > 0 ? (r.best as number) : 0, longestRun(days));
  return { verses, days, best };
}

/**
 * Records verses as read on `day`. Returns the same object when nothing is new, so a React state update
 * with it is skipped and nothing re-renders.
 */
export function markVersesRead(p: ReadingProgress, id: string, chapter: number, verses: string[], day: string): ReadingProgress {
  const ch = String(chapter);
  const had = p.verses[id]?.[ch] ?? [];
  const seen = new Set(had);
  const added: string[] = [];
  for (const v of verses.map(String)) {
    if (v === '' || seen.has(v)) continue;
    seen.add(v);
    added.push(v);
  }
  const newDay = verses.length > 0 && !p.days.includes(day);
  if (added.length === 0 && !newDay) return p;
  const next: ReadingProgress = { ...p };
  if (added.length) next.verses = { ...p.verses, [id]: { ...p.verses[id], [ch]: [...had, ...added] } };
  if (newDay) {
    const days = [...p.days, day].sort().slice(-MAX_DAYS);
    next.days = days;
    next.best = Math.max(p.best, runEndingOn(days, day));
  }
  return next;
}

/** A backup's progress is added to what is already on the phone; nothing already read is lost. */
export function mergeProgress(current: ReadingProgress, incoming: ReadingProgress): ReadingProgress {
  const verses: ReadingProgress['verses'] = {};
  for (const id of new Set([...Object.keys(current.verses), ...Object.keys(incoming.verses)])) {
    const a = current.verses[id] ?? {};
    const b = incoming.verses[id] ?? {};
    verses[id] = {};
    for (const ch of new Set([...Object.keys(a), ...Object.keys(b)])) {
      verses[id][ch] = [...new Set([...(a[ch] ?? []), ...(b[ch] ?? [])])];
    }
  }
  const merged = normalizeProgress({ verses, days: [...current.days, ...incoming.days], best: Math.max(current.best, incoming.best) });
  return merged;
}

/** Verses read in one chapter, never more than the chapter holds. */
export function chapterReadCount(p: ReadingProgress, id: string, chapter: number, verseCount?: number): number {
  const n = p.verses[id]?.[String(chapter)]?.length ?? 0;
  return verseCount != null && verseCount > 0 ? Math.min(n, verseCount) : n;
}

export function isVerseRead(p: ReadingProgress, id: string, chapter: number, verse: string | number): boolean {
  return p.verses[id]?.[String(chapter)]?.includes(String(verse)) ?? false;
}

/** Verses read across a book, counted against each chapter's own size. */
export function bookReadCount(p: ReadingProgress, id: string, chapters: { number: number; verseCount: number }[]): number {
  const book = p.verses[id];
  if (!book) return 0;
  let n = 0;
  for (const c of chapters) n += chapterReadCount(p, id, c.number, c.verseCount);
  return n;
}

/** Whole percent read, with any reading at all showing at least 1% and only a finished book showing 100%. */
export function percentRead(read: number, total: number): number {
  if (total <= 0 || read <= 0) return 0;
  if (read >= total) return 100;
  return Math.min(99, Math.max(1, Math.floor((read / total) * 100)));
}

export interface StreakInfo {
  /** Days in a row, counting today if read, else ending yesterday (the streak is still alive until tonight). */
  current: number;
  best: number;
  readToday: boolean;
  /** The last seven days, oldest first, ending today. */
  week: { day: string; read: boolean }[];
}

export function streakInfo(p: Pick<ReadingProgress, 'days' | 'best'>, today: string): StreakInfo {
  const set = new Set(p.days);
  const readToday = set.has(today);
  const current = runEndingOn(p.days, readToday ? today : addDays(today, -1));
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(today, i - 6);
    return { day, read: set.has(day) };
  });
  return { current, best: Math.max(p.best, current), readToday, week };
}

/**
 * The streak a daily verse notification on `day` can mention: the run of days up to the day before, as
 * long as that is already known (it ends today or earlier) and the reader has not read on `day` yet.
 * Notifications further ahead stay plain, since nobody knows yet whether the reader keeps going.
 */
export function streakForNotification(days: string[], today: string, day: string): number {
  const before = addDays(day, -1);
  if (before > today || days.includes(day)) return 0;
  const run = runEndingOn(days, before);
  return run >= 2 ? run : 0;
}
