import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import * as L from '@/lib/learn-progress';

/**
 * Learn progress (@/lib/learn-progress), kept on the phone under one key. A small module store rather than
 * a provider: only the Learn screens read it, so nothing else re-renders when a lesson is ticked.
 */
export const LEARN_KEY = 'dg.learn.v1';

let state: L.LearnProgress = L.EMPTY_LEARN;
let loaded = false;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function load() {
  if (loaded || loading) return loading;
  loading = AsyncStorage.getItem(LEARN_KEY)
    .then((raw) => {
      if (!raw) return;
      try {
        // Anything ticked before the stored value arrived is kept as well.
        state = L.mergeLearn(state, JSON.parse(raw));
      } catch {
        // A damaged value starts empty rather than stopping the app.
      }
    })
    .catch(() => {})
    .finally(() => {
      loaded = true;
      emit();
    });
  return loading;
}

function commit(next: L.LearnProgress) {
  if (next === state) return;
  state = next;
  emit();
  AsyncStorage.setItem(LEARN_KEY, JSON.stringify(state)).catch(() => {
    // Storage full or unavailable: progress keeps working for this session.
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  void load();
  return () => listeners.delete(listener);
}

const snapshot = () => state;

export function useLearn() {
  const progress = useSyncExternalStore(subscribe, snapshot, snapshot);
  return {
    progress,
    setLesson: (kind: 'courses' | 'journeys', id: string, lesson: string, done: boolean) => commit(L.setLesson(state, kind, id, lesson, done)),
    setGita: (chapter: number, done: boolean) => commit(L.setGita(state, chapter, done)),
    setDiscover: (answers: Record<string, string> | null) => commit({ ...state, discover: answers }),
  };
}

/** For the backup in Settings: what to export, read after the stored value has loaded. */
export async function learnForBackup(): Promise<L.LearnProgress> {
  await load();
  return state;
}

/** Adds a backup's Learn progress to the phone's. */
export async function importLearn(raw: unknown): Promise<void> {
  await load();
  commit(L.mergeLearn(state, raw));
}
