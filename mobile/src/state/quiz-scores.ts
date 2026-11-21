/**
 * Quiz results, kept on this phone only (zero-account privacy, like everything else in the app).
 * Stored under dg.quiz.v1 as { [quizId]: { best, total, last, at } }.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';

export const QUIZ_KEY = 'dg.quiz.v1';

export interface QuizResult {
  /** Best score so far, and the number of questions it was out of. */
  best: number;
  total: number;
  /** The most recent score. */
  last: number;
  /** When the most recent attempt finished (ISO date). */
  at: string;
}

type Results = Record<string, QuizResult>;

let results: Results = {};
let loaded = false;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Keeps only well-formed entries, so a damaged value never breaks the quiz screens. */
export function normalizeQuizResults(raw: unknown): Results {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: Results = {};
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    const r = v as Partial<QuizResult> | null;
    if (!r || typeof r.best !== 'number' || typeof r.total !== 'number' || r.total <= 0) continue;
    out[id] = {
      best: Math.max(0, Math.min(r.best, r.total)),
      total: r.total,
      last: typeof r.last === 'number' ? Math.max(0, Math.min(r.last, r.total)) : r.best,
      at: typeof r.at === 'string' ? r.at : '',
    };
  }
  return out;
}

function load() {
  if (loaded || loading) return;
  loading = AsyncStorage.getItem(QUIZ_KEY)
    .then((text) => {
      results = { ...normalizeQuizResults(text ? JSON.parse(text) : null), ...results };
    })
    .catch(() => {})
    .finally(() => {
      loaded = true;
      emit();
    });
}

export function recordQuizResult(id: string, score: number, total: number) {
  const prev = results[id];
  const best = prev && prev.total === total ? Math.max(prev.best, score) : score;
  results = { ...results, [id]: { best, total, last: score, at: new Date().toISOString() } };
  emit();
  AsyncStorage.setItem(QUIZ_KEY, JSON.stringify(results)).catch(() => {});
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => results;

/** Every quiz result on this phone; re-renders when one is recorded. */
export function useQuizResults(): Results {
  useEffect(load, []);
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
