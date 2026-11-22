/**
 * Practice state (साधना): the Gita Sankalpa and reading-plan progress. Kept on the phone under one key and
 * included in the JSON backup (zero-account privacy, CLAUDE.md rule 5). A small external store, so the
 * screens that use it re-render without touching the app-wide state.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';

import {
  dayKey,
  keepToday,
  mergePractice,
  normalizePractice,
  takeSankalpa,
  toggleChapter,
  type PracticeData,
  type SankalpaMode,
} from '@/lib/sankalpa';

const KEY = 'dg.practice.v1';

let data: PracticeData = normalizePractice(undefined);
let loaded = false;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: PracticeData) {
  data = next;
  listeners.forEach((l) => l());
  AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {
    // Storage full or unavailable: keep working for this session.
  });
}

function load(): Promise<void> {
  if (loaded) return Promise.resolve();
  loading ??= AsyncStorage.getItem(KEY)
    .then((raw) => {
      if (raw) data = normalizePractice(JSON.parse(raw));
    })
    .catch(() => {})
    .finally(() => {
      loaded = true;
      // A new object, so useSyncExternalStore sees a change even when nothing was saved yet.
      data = { ...data };
      listeners.forEach((l) => l());
    });
  return loading;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** The practice data, loaded from the phone on first use. `ready` is false for the first frame. */
export function usePractice(): PracticeData & { ready: boolean } {
  useEffect(() => {
    load();
  }, []);
  const snap = useSyncExternalStore(subscribe, () => data, () => data);
  return { ...snap, ready: loaded };
}

export const practice = {
  takeSankalpa(mode: SankalpaMode, chapter: number) {
    emit({ ...data, sankalpa: takeSankalpa(data.sankalpa, mode, chapter, dayKey()) });
  },
  pauseSankalpa() {
    emit({ ...data, sankalpa: { ...data.sankalpa, isActive: false } });
  },
  keepToday() {
    emit({ ...data, sankalpa: keepToday(data.sankalpa, dayKey()) });
  },
  toggleChapter(chapter: number) {
    emit({ ...data, sankalpa: toggleChapter(data.sankalpa, chapter, dayKey()) });
  },
  startPlan(id: string) {
    if (data.plans[id]) return;
    emit({ ...data, plans: { ...data.plans, [id]: { startedAt: new Date().toISOString(), done: [] } } });
  },
  toggleDay(id: string, day: number) {
    const p = data.plans[id] ?? { startedAt: new Date().toISOString(), done: [] };
    const done = p.done.includes(day) ? p.done.filter((d) => d !== day) : [...p.done, day].sort((a, b) => a - b);
    emit({ ...data, plans: { ...data.plans, [id]: { ...p, done } } });
  },
  resetPlan(id: string) {
    const plans = { ...data.plans };
    delete plans[id];
    emit({ ...data, plans });
  },
};

/** For the JSON backup. */
export async function exportPractice(): Promise<PracticeData> {
  await load();
  return data;
}

/** Restores from a backup, merged with what is already on the phone. */
export async function importPractice(raw: unknown): Promise<void> {
  if (raw == null) return;
  await load();
  emit(mergePractice(data, normalizePractice(raw)));
}
