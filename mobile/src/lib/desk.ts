/**
 * The study desk, as on the website's /practice/desk and /practice/dashboard: a reading queue the reader
 * orders by hand, a weekly goal of reading days, and plain local stats built from reading progress.
 *
 * Everything stays on the phone (zero-account privacy) and travels in the JSON backup under `desk`. Pure
 * functions, with type-only imports, so `npm test` can load this file as it is.
 *
 * The stats describe what was read. They never judge, score or compare with anyone (as the website's
 * weekly summary).
 */
import type { ReadingProgress } from './progress';

/** A verse in the queue: the same three fields as a saved verse. */
export interface QueueItem {
  id: string;
  chapter: number;
  verse: string;
}

export interface DeskData {
  queue: QueueItem[];
  /** Days to read this week, 1 to 7, chosen by the reader. */
  goal: number;
}

export const MAX_QUEUE = 100;
export const DEFAULT_GOAL = 3;
export const EMPTY_DESK: DeskData = { queue: [], goal: DEFAULT_GOAL };

export function queueKey(q: QueueItem): string {
  return `${q.id}:${q.chapter}:${q.verse}`;
}

function cleanItem(raw: unknown): QueueItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<QueueItem>;
  const chapter = Number(r.chapter);
  if (typeof r.id !== 'string' || !/^[a-z0-9-]+$/.test(r.id) || !Number.isFinite(chapter) || r.verse == null || String(r.verse) === '') return null;
  return { id: r.id, chapter, verse: String(r.verse) };
}

export function normalizeDesk(raw: unknown): DeskData {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<DeskData>;
  const seen = new Set<string>();
  const queue: QueueItem[] = [];
  for (const item of Array.isArray(r.queue) ? r.queue : []) {
    const q = cleanItem(item);
    if (!q || seen.has(queueKey(q))) continue;
    seen.add(queueKey(q));
    queue.push(q);
    if (queue.length >= MAX_QUEUE) break;
  }
  const goal = Number.isInteger(r.goal) && (r.goal as number) >= 1 && (r.goal as number) <= 7 ? (r.goal as number) : DEFAULT_GOAL;
  return { queue, goal };
}

/** Adds verses to the end of the queue, skipping ones already in it. Returns how many were added. */
export function addToQueue(d: DeskData, items: QueueItem[]): { desk: DeskData; added: number } {
  const seen = new Set(d.queue.map(queueKey));
  const next = [...d.queue];
  for (const raw of items) {
    const q = cleanItem(raw);
    if (!q || seen.has(queueKey(q)) || next.length >= MAX_QUEUE) continue;
    seen.add(queueKey(q));
    next.push(q);
  }
  const added = next.length - d.queue.length;
  return { desk: added ? { ...d, queue: next } : d, added };
}

export function removeFromQueue(d: DeskData, item: QueueItem): DeskData {
  const key = queueKey(item);
  const queue = d.queue.filter((q) => queueKey(q) !== key);
  return queue.length === d.queue.length ? d : { ...d, queue };
}

/** Moves the item at `index` by `delta` places (−1 up, +1 down). Out of range: unchanged. */
export function moveInQueue(d: DeskData, index: number, delta: number): DeskData {
  const j = index + delta;
  if (index < 0 || index >= d.queue.length || j < 0 || j >= d.queue.length) return d;
  const queue = [...d.queue];
  [queue[index], queue[j]] = [queue[j], queue[index]];
  return { ...d, queue };
}

export function setGoal(d: DeskData, goal: number): DeskData {
  return Number.isInteger(goal) && goal >= 1 && goal <= 7 && goal !== d.goal ? { ...d, goal } : d;
}

/** A backup's desk: its queue is added after the phone's own; the phone's goal stays. */
export function mergeDesk(current: DeskData, incoming: unknown): DeskData {
  return addToQueue(current, normalizeDesk(incoming).queue).desk;
}

/** The local week, Monday first, as YYYY-MM-DD keys from Monday to `today`. */
export function weekSoFar(today: string): string[] {
  const [y, m, d] = today.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const back = (date.getUTCDay() + 6) % 7; // Monday 0 … Sunday 6
  const out: string[] = [];
  for (let i = back; i >= 0; i--) {
    const t = new Date(Date.UTC(y, m - 1, d - i));
    out.push(`${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`);
  }
  return out;
}

export interface BookStat {
  id: string;
  read: number;
  total: number;
}

export interface StudyStats {
  versesRead: number;
  chaptersTouched: number;
  booksStarted: number;
  /** Days with reading, all time (as far as the progress record reaches). */
  daysRead: number;
  /** Reading days in this local week (Monday to today). */
  daysThisWeek: number;
  /** Books with some reading, most read first (as a share of the book). */
  books: BookStat[];
}

/** Plain counts from reading progress. `sizes` gives each chapter's verse count, so nothing counts past a chapter's end. */
export function studyStats(
  p: Pick<ReadingProgress, 'verses' | 'days'>,
  today: string,
  sizes: (id: string) => { number: number; verseCount: number }[] | undefined,
): StudyStats {
  let versesRead = 0;
  let chaptersTouched = 0;
  const books: BookStat[] = [];
  for (const [id, chapters] of Object.entries(p.verses)) {
    const known = sizes(id);
    if (!known) continue;
    let read = 0;
    for (const [ch, list] of Object.entries(chapters)) {
      const size = known.find((c) => String(c.number) === ch)?.verseCount;
      if (size == null) continue;
      const n = Math.min(list.length, size);
      if (n > 0) chaptersTouched += 1;
      read += n;
    }
    if (read === 0) continue;
    versesRead += read;
    books.push({ id, read, total: known.reduce((n, c) => n + c.verseCount, 0) });
  }
  books.sort((a, b) => b.read / Math.max(1, b.total) - a.read / Math.max(1, a.total) || b.read - a.read);
  const week = new Set(weekSoFar(today));
  return {
    versesRead,
    chaptersTouched,
    booksStarted: books.length,
    daysRead: p.days.length,
    daysThisWeek: p.days.filter((d) => week.has(d)).length,
    books,
  };
}
