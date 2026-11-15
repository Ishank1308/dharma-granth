'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseStored } from '@/lib/safe-stored';

/* ── Types ─────────────────────────────────────────────────────────── */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string; // ISO yyyy-mm-dd
  totalDaysRead: number;
}

export interface VerseNote {
  scriptureId: string;
  chapterId: number;
  verseId: number | string;
  text: string;
  updatedAt: string;
}

export type HighlightThemeTag = 'contemplation' | 'duty' | 'devotion' | 'wisdom' | 'insight';

/** How the reader classifies a highlight. Private, stored on this device only. */
export type HighlightKind = 'important' | 'question' | 'study-again' | 'practical' | 'compare-commentary' | 'reflection';

export const HIGHLIGHT_KINDS: Array<{ id: HighlightKind; label: string }> = [
  { id: 'important', label: 'Important' },
  { id: 'question', label: 'Question' },
  { id: 'study-again', label: 'Study again' },
  { id: 'practical', label: 'Practical teaching' },
  { id: 'compare-commentary', label: 'Compare commentary' },
  { id: 'reflection', label: 'Personal reflection' },
];

export interface VerseHighlight {
  scriptureId: string;
  chapterId: number;
  verseId: number | string;
  color: 'saffron' | 'amber' | 'rose' | 'emerald' | 'indigo';
  tag?: HighlightThemeTag;
  kind?: HighlightKind;
  textSnippet?: string;
  createdAt: string;
}

export interface StudyCollection {
  id: string;
  name: string;
  description?: string;
  verseRefs: VerseRef[];
  createdAt: string;
}

export interface VerseRef {
  scriptureId: string;
  scriptureTitle: string;
  chapterId: number;
  chapterTitle: string;
  verseId: number | string;
  sanskrit: string;
  translation: string;
}

export interface PathwayProgress {
  pathwayId: string;
  completedSteps: string[];
  startedAt: string;
  completedAt?: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  takenAt: string;
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    return parseStored(window.localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/* ── Keys ──────────────────────────────────────────────────────────── */

const KEYS = {
  streak: 'dharma.streak',
  notes: 'dharma.notes',
  highlights: 'dharma.highlights',
  collections: 'dharma.collections',
  pathways: 'dharma.pathways',
  quizzes: 'dharma.quizzes',
} as const;

const EMPTY_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: '',
  totalDaysRead: 0,
};

/* ── Hook ──────────────────────────────────────────────────────────── */

export function useStudyProgress() {
  const [streak, setStreak] = useState<StreakData>(EMPTY_STREAK);
  const [notes, setNotes] = useState<VerseNote[]>([]);
  const [highlights, setHighlights] = useState<VerseHighlight[]>([]);
  const [collections, setCollections] = useState<StudyCollection[]>([]);
  const [pathwayProgress, setPathwayProgress] = useState<PathwayProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount & sync across open tabs.
  useEffect(() => {
    function syncAll() {
      setStreak(load(KEYS.streak, EMPTY_STREAK));
      setNotes(load(KEYS.notes, []));
      setHighlights(load(KEYS.highlights, []));
      setCollections(load(KEYS.collections, []));
      setPathwayProgress(load(KEYS.pathways, []));
      setQuizResults(load(KEYS.quizzes, []));
      setHydrated(true);
    }
    syncAll();

    function onStorage(e: StorageEvent) {
      if (!e.key) return;
      if (e.key === KEYS.streak) setStreak(load(KEYS.streak, EMPTY_STREAK));
      else if (e.key === KEYS.notes) setNotes(load(KEYS.notes, []));
      else if (e.key === KEYS.highlights) setHighlights(load(KEYS.highlights, []));
      else if (e.key === KEYS.collections) setCollections(load(KEYS.collections, []));
      else if (e.key === KEYS.pathways) setPathwayProgress(load(KEYS.pathways, []));
      else if (e.key === KEYS.quizzes) setQuizResults(load(KEYS.quizzes, []));
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /* ── Streak ──────────────────────────────────────────────────────── */

  const recordReading = useCallback(() => {
    const today = todayISO();
    setStreak((prev) => {
      if (prev.lastReadDate === today) return prev;
      const gap = prev.lastReadDate ? daysBetween(prev.lastReadDate, today) : 999;
      const newCurrent = gap === 1 ? prev.currentStreak + 1 : 1;
      const next: StreakData = {
        currentStreak: newCurrent,
        longestStreak: Math.max(prev.longestStreak, newCurrent),
        lastReadDate: today,
        totalDaysRead: prev.totalDaysRead + 1,
      };
      save(KEYS.streak, next);
      return next;
    });
  }, []);

  /* ── Notes ───────────────────────────────────────────────────────── */

  const getNote = useCallback(
    (scriptureId: string, chapterId: number, verseId: number | string) =>
      notes.find(
        (n) =>
          n.scriptureId === scriptureId &&
          n.chapterId === chapterId &&
          String(n.verseId) === String(verseId),
      ),
    [notes],
  );

  const setNote = useCallback(
    (scriptureId: string, chapterId: number, verseId: number | string, text: string) => {
      setNotes((prev) => {
        const filtered = prev.filter(
          (n) =>
            !(
              n.scriptureId === scriptureId &&
              n.chapterId === chapterId &&
              String(n.verseId) === String(verseId)
            ),
        );
        const next =
          text.trim() === ''
            ? filtered
            : [
                ...filtered,
                {
                  scriptureId,
                  chapterId,
                  verseId,
                  text: text.trim(),
                  updatedAt: new Date().toISOString(),
                },
              ];
        save(KEYS.notes, next);
        return next;
      });
    },
    [],
  );

  /* ── Highlights ──────────────────────────────────────────────────── */

  const getHighlight = useCallback(
    (scriptureId: string, chapterId: number, verseId: number | string) =>
      highlights.find(
        (h) =>
          h.scriptureId === scriptureId &&
          h.chapterId === chapterId &&
          String(h.verseId) === String(verseId),
      ),
    [highlights],
  );

  const setHighlightKind = useCallback(
    (scriptureId: string, chapterId: number, verseId: number | string, kind: HighlightKind | undefined) => {
      setHighlights((prev) => {
        const next = prev.map((h) =>
          h.scriptureId === scriptureId && h.chapterId === chapterId && String(h.verseId) === String(verseId) ? { ...h, kind } : h,
        );
        save(KEYS.highlights, next);
        return next;
      });
    },
    [],
  );

  const toggleHighlight = useCallback(
    (
      scriptureId: string,
      chapterId: number,
      verseId: number | string,
      color: VerseHighlight['color'] = 'saffron',
      tag?: HighlightThemeTag,
      textSnippet?: string,
    ) => {
      const defaultTag: HighlightThemeTag =
        color === 'saffron'
          ? 'contemplation'
          : color === 'amber'
          ? 'duty'
          : color === 'rose'
          ? 'devotion'
          : color === 'emerald'
          ? 'wisdom'
          : 'insight';

      setHighlights((prev) => {
        const existing = prev.find(
          (h) =>
            h.scriptureId === scriptureId &&
            h.chapterId === chapterId &&
            String(h.verseId) === String(verseId),
        );
        let next: VerseHighlight[];
        if (existing && existing.color === color) {
          next = prev.filter((h) => h !== existing);
        } else if (existing) {
          next = prev.map((h) =>
            h === existing
              ? { ...h, color, tag: tag ?? h.tag ?? defaultTag, textSnippet: textSnippet ?? h.textSnippet }
              : h,
          );
        } else {
          next = [
            ...prev,
            {
              scriptureId,
              chapterId,
              verseId,
              color,
              tag: tag ?? defaultTag,
              textSnippet,
              createdAt: new Date().toISOString(),
            },
          ];
        }
        save(KEYS.highlights, next);
        return next;
      });
    },
    [],
  );

  /* ── Collections ─────────────────────────────────────────────────── */

  const createCollection = useCallback(
    (name: string, description?: string) => {
      const col: StudyCollection = {
        id: `col-${Date.now()}`,
        name,
        description,
        verseRefs: [],
        createdAt: new Date().toISOString(),
      };
      setCollections((prev) => {
        const next = [...prev, col];
        save(KEYS.collections, next);
        return next;
      });
      return col.id;
    },
    [],
  );

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => {
      const next = prev.filter((c) => c.id !== id);
      save(KEYS.collections, next);
      return next;
    });
  }, []);

  const addToCollection = useCallback(
    (collectionId: string, ref: VerseRef) => {
      setCollections((prev) => {
        const next = prev.map((c) => {
          if (c.id !== collectionId) return c;
          const exists = c.verseRefs.some(
            (v) =>
              v.scriptureId === ref.scriptureId &&
              v.chapterId === ref.chapterId &&
              String(v.verseId) === String(ref.verseId),
          );
          if (exists) return c;
          return { ...c, verseRefs: [...c.verseRefs, ref] };
        });
        save(KEYS.collections, next);
        return next;
      });
    },
    [],
  );

  const removeFromCollection = useCallback(
    (collectionId: string, scriptureId: string, verseId: number | string) => {
      setCollections((prev) => {
        const next = prev.map((c) => {
          if (c.id !== collectionId) return c;
          return {
            ...c,
            verseRefs: c.verseRefs.filter(
              (v) =>
                !(
                  v.scriptureId === scriptureId &&
                  String(v.verseId) === String(verseId)
                ),
            ),
          };
        });
        save(KEYS.collections, next);
        return next;
      });
    },
    [],
  );

  /* ── Pathway Progress ────────────────────────────────────────────── */

  const getPathwayProgress = useCallback(
    (pathwayId: string) =>
      pathwayProgress.find((p) => p.pathwayId === pathwayId),
    [pathwayProgress],
  );

  const togglePathwayStep = useCallback(
    (pathwayId: string, stepId: string) => {
      setPathwayProgress((prev) => {
        const existing = prev.find((p) => p.pathwayId === pathwayId);
        let next: PathwayProgress[];
        if (!existing) {
          next = [
            ...prev,
            {
              pathwayId,
              completedSteps: [stepId],
              startedAt: new Date().toISOString(),
            },
          ];
        } else {
          const has = existing.completedSteps.includes(stepId);
          const completedSteps = has
            ? existing.completedSteps.filter((s) => s !== stepId)
            : [...existing.completedSteps, stepId];
          next = prev.map((p) =>
            p.pathwayId === pathwayId
              ? {
                  ...p,
                  completedSteps,
                  completedAt: undefined, // will be set by completePathway
                }
              : p,
          );
        }
        save(KEYS.pathways, next);
        return next;
      });
    },
    [],
  );

  const completePathway = useCallback((pathwayId: string) => {
    setPathwayProgress((prev) => {
      const existing = prev.find((p) => p.pathwayId === pathwayId);
      if (!existing) return prev;
      const next = prev.map((p) =>
        p.pathwayId === pathwayId
          ? { ...p, completedAt: new Date().toISOString() }
          : p,
      );
      save(KEYS.pathways, next);
      return next;
    });
  }, []);

  /* ── Quiz Results ────────────────────────────────────────────────── */

  const recordQuizResult = useCallback(
    (quizId: string, score: number, total: number) => {
      setQuizResults((prev) => {
        const next = [
          ...prev.filter((r) => !(r.quizId === quizId && r.score === score && r.total === total)),
          { quizId, score, total, takenAt: new Date().toISOString() },
        ];
        save(KEYS.quizzes, next);
        return next;
      });
    },
    [],
  );

  const getBestQuizScore = useCallback(
    (quizId: string) => {
      const results = quizResults.filter((r) => r.quizId === quizId);
      if (results.length === 0) return undefined;
      return results.reduce((best, r) =>
        r.score / r.total > best.score / best.total ? r : best,
      );
    },
    [quizResults],
  );

  return {
    hydrated,
    streak,
    recordReading,
    notes,
    getNote,
    setNote,
    highlights,
    getHighlight,
    toggleHighlight,
    setHighlightKind,
    collections,
    createCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    pathwayProgress,
    getPathwayProgress,
    togglePathwayStep,
    completePathway,
    quizResults,
    recordQuizResult,
    getBestQuizScore,
  };
}
