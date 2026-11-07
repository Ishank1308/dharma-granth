'use client';

import { useEffect, useState } from 'react';

export interface ChapterVisit {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  chapterId: number;
  chapterTitle: string;
  totalChapters: number;
  readAt: string; // ISO timestamp
  /** Verse last on screen, for resuming at it ("7", or "1.1" in some texts). */
  verseId?: string;
}

const KEY = 'dharma.recentChapters';
const MAX_VISITS = 6;
/** Same-tab listeners; the `storage` event only fires in other tabs. */
const CHANGE_EVENT = 'dharma:recent-chapters';
const PAUSE_KEY = 'dharma.history.paused';
export const HISTORY_EXPORT_FORMAT = 'dharma-granth-reading-history';

function isVisit(value: unknown): value is ChapterVisit {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<ChapterVisit>;
  return (
    typeof v.scriptureId === 'string' &&
    /^[a-z0-9-]+$/i.test(v.scriptureId) &&
    typeof v.scriptureTitle === 'string' &&
    typeof v.chapterId === 'number' &&
    Number.isInteger(v.chapterId) &&
    v.chapterId > 0 &&
    typeof v.chapterTitle === 'string' &&
    typeof v.readAt === 'string' &&
    // Used in a URL fragment, so keep it to verse-number characters.
    (v.verseId === undefined || (typeof v.verseId === 'string' && VERSE_ID.test(v.verseId)))
  );
}

const VERSE_ID = /^[0-9A-Za-z.-]{1,20}$/;

/** While paused, nothing new is recorded; what is already stored stays until the reader removes it. */
export function isHistoryPaused(): boolean {
  try {
    return window.localStorage.getItem(PAUSE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setHistoryPaused(paused: boolean): void {
  try {
    if (paused) window.localStorage.setItem(PAUSE_KEY, '1');
    else window.localStorage.removeItem(PAUSE_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage unavailable: nothing is being recorded anyway.
  }
}

export function readRecentChapters(): ChapterVisit[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isVisit) : [];
  } catch {
    return [];
  }
}

/**
 * Remember the chapter just opened. One entry per scripture (its latest
 * chapter), newest first, so "continue reading" resumes each book.
 */
export function recordChapterVisit(visit: Omit<ChapterVisit, 'readAt' | 'verseId'>): void {
  if (isHistoryPaused()) return;
  try {
    const existing = readRecentChapters();
    const previous = existing.find((v) => v.scriptureId === visit.scriptureId);
    // Reopening the same chapter keeps the saved verse; a new chapter starts fresh.
    const verseId = previous?.chapterId === visit.chapterId ? previous.verseId : undefined;
    const next = [
      { ...visit, verseId, readAt: new Date().toISOString() },
      ...existing.filter((v) => v.scriptureId !== visit.scriptureId),
    ].slice(0, MAX_VISITS);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    logReadingDay(visit.scriptureId, visit.chapterId);
  } catch {
    // Storage unavailable (private mode, quota): history is a nicety.
  }
}

/* ── Reading days: which chapters were opened on which local date, for the yearly summary ── */

const DAYS_KEY = 'dharma.readingDays.v1';
const MAX_DAYS = 400;

/** Local calendar date, YYYY-MM-DD. */
const today = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Date → chapters opened that day ("bhagavadgita:2"). Stays in this browser. */
export function readReadingDays(): Record<string, string[]> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(DAYS_KEY) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, string[]> = {};
    for (const [day, list] of Object.entries(parsed as Record<string, unknown>)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Array.isArray(list)) out[day] = list.filter((x): x is string => typeof x === 'string');
    }
    return out;
  } catch {
    return {};
  }
}

function logReadingDay(scriptureId: string, chapterId: number): void {
  const days = readReadingDays();
  const day = today();
  const key = `${scriptureId}:${chapterId}`;
  if (days[day]?.includes(key)) return;
  days[day] = [...(days[day] ?? []), key];
  const kept = Object.keys(days).sort().slice(-MAX_DAYS);
  window.localStorage.setItem(DAYS_KEY, JSON.stringify(Object.fromEntries(kept.map((d) => [d, days[d]]))));
}

/** Record the verse on screen for this chapter's history entry (if it exists). */
export function updateLastVerse(scriptureId: string, chapterId: number, verseId: string): void {
  if (!VERSE_ID.test(verseId) || isHistoryPaused()) return;
  try {
    const all = readRecentChapters();
    const entry = all.find((v) => v.scriptureId === scriptureId && v.chapterId === chapterId);
    if (!entry || entry.verseId === verseId) return;
    entry.verseId = verseId;
    window.localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export function forgetScripture(scriptureId: string): void {
  try {
    const next = readRecentChapters().filter((v) => v.scriptureId !== scriptureId);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

/** Removes the whole reading history. Returns how many entries were removed. */
export function clearHistory(): number {
  try {
    const n = readRecentChapters().length;
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(DAYS_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return n;
  } catch {
    return 0;
  }
}

/** The history as a file the reader can keep. Contains only chapters and positions, never notes. */
export function exportHistory(): string {
  return JSON.stringify({ format: HISTORY_EXPORT_FORMAT, version: 1, exportedAt: new Date().toISOString(), visits: readRecentChapters() }, null, 2);
}

/**
 * Merges an exported history into the stored one (newest first, one per
 * scripture, capped). Throws on a foreign file; silently drops malformed
 * entries. Returns how many entries were kept from the file.
 */
export function importHistory(raw: string): number {
  const parsed = JSON.parse(raw) as { format?: string; version?: number; visits?: unknown };
  if (!parsed || parsed.format !== HISTORY_EXPORT_FORMAT || parsed.version !== 1 || !Array.isArray(parsed.visits)) {
    throw new Error('Not a Dharma Granth reading history file');
  }
  const incoming = parsed.visits.filter(isVisit);
  const byScripture = new Map<string, ChapterVisit>();
  for (const v of [...readRecentChapters(), ...incoming]) {
    const prev = byScripture.get(v.scriptureId);
    if (!prev || prev.readAt < v.readAt) byScripture.set(v.scriptureId, v);
  }
  const merged = Array.from(byScripture.values()).sort((a, b) => (a.readAt < b.readAt ? 1 : -1)).slice(0, MAX_VISITS);
  window.localStorage.setItem(KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return incoming.length;
}

/* ── Streak (written by useStudyProgress under 'dharma.streak') ───── */

function localISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Current streak, or 0 if it has lapsed (last read before yesterday).
 * useStudyProgress only updates the stored number on the next read, so a
 * broken streak would otherwise keep showing its old count.
 */
export function readActiveStreak(): number {
  try {
    const raw = JSON.parse(window.localStorage.getItem('dharma.streak') ?? 'null') as {
      currentStreak?: unknown;
      lastReadDate?: unknown;
    } | null;
    if (!raw || typeof raw.currentStreak !== 'number' || typeof raw.lastReadDate !== 'string') {
      return 0;
    }
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    // useStudyProgress stores UTC dates (toISOString), so accept either
    // calendar to avoid a false "lapsed" around midnight.
    const recent = new Set([
      localISODate(now),
      localISODate(yesterday),
      now.toISOString().slice(0, 10),
      yesterday.toISOString().slice(0, 10),
    ]);
    return recent.has(raw.lastReadDate) ? Math.max(0, Math.floor(raw.currentStreak)) : 0;
  } catch {
    return 0;
  }
}

/* ── Chapter completion ─────────────────────────────────────────────── */

const COMPLETED_KEY = 'dharma.completedChapters';
const MAX_COMPLETED = 2000;

function completedKey(scriptureId: string, chapterId: number): string {
  return `${scriptureId}:${chapterId}`;
}

export function readCompletedChapters(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(COMPLETED_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : [];
  } catch {
    return [];
  }
}

export function isChapterCompleted(scriptureId: string, chapterId: number): boolean {
  return readCompletedChapters().includes(completedKey(scriptureId, chapterId));
}

/** Marks a chapter finished; returns how many chapters of that book are done. */
export function markChapterCompleted(scriptureId: string, chapterId: number): number {
  const key = completedKey(scriptureId, chapterId);
  const all = readCompletedChapters();
  const next = all.includes(key) ? all : [...all, key].slice(-MAX_COMPLETED);
  try {
    window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next.filter((k) => k.startsWith(`${scriptureId}:`)).length;
}

/** Recent chapter visits; `null` until read after mount (SSR-safe). */
export function useRecentChapters(): ChapterVisit[] | null {
  const [visits, setVisits] = useState<ChapterVisit[] | null>(null);

  useEffect(() => {
    const sync = () => setVisits(readRecentChapters());
    sync();
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) sync();
    };
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return visits;
}
