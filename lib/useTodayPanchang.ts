'use client';

import { useSyncExternalStore } from 'react';
import type { LocationConfig, SolarTimes } from './panchang';

/**
 * Today's panchang, worked out in the reader's browser.
 *
 * The site is a static export, so anything a page computes from `new Date()`
 * while it renders is frozen at the last deploy. Pages that mark "today" read
 * it from here instead: `null` in the pre-rendered HTML and until the browser
 * has computed it, then the live values.
 *
 * `lib/panchang.ts` is large, so it is loaded on demand and stays out of the
 * page's first JavaScript.
 */
export interface TodayPanchang {
  /** Civil date at the chosen place, YYYY-MM-DD. */
  isoDate: string;
  /** 0 = Sunday, the same numbering as `VARA_DATA[].index`. */
  weekdayIndex: number;
  tithiNumber: number;
  nakshatraIndex: number;
  yogaIndex: number;
  karanaName: string;
  solarTimes: SolarTimes;
}

/** Same key as `usePanchangLocation`, so the hubs follow the reader's saved city. */
const LOCATION_KEY = 'dharma.panchang.location';

let snapshot: TodayPanchang | null = null;
let snapshotKey = '';
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();

function chosenLocationId(): string | null {
  try {
    const linked = new URLSearchParams(window.location.search).get('city');
    if (linked) return linked;
    const raw = window.localStorage.getItem(LOCATION_KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<LocationConfig> | null) : null;
    return typeof saved?.id === 'string' ? saved.id : null;
  } catch {
    return null;
  }
}

async function compute(): Promise<void> {
  const { PRESET_LOCATIONS, calculateEducationalPanchang, todayForLocation } = await import('./panchang');
  const id = chosenLocationId();
  const location = PRESET_LOCATIONS.find((preset) => preset.id === id) ?? PRESET_LOCATIONS[0];
  const day = todayForLocation(location);
  const panchang = calculateEducationalPanchang(day, location);
  const key = `${location.id}:${panchang.isoDate}`;
  if (key === snapshotKey) return;
  snapshotKey = key;
  snapshot = {
    isoDate: panchang.isoDate,
    weekdayIndex: day.getDay(),
    tithiNumber: panchang.tithi.number,
    nakshatraIndex: panchang.nakshatra.index,
    yogaIndex: panchang.yoga.index,
    karanaName: panchang.karana.name,
    solarTimes: panchang.solarTimes,
  };
  listeners.forEach((listener) => listener());
}

function refresh(): void {
  if (pending) return;
  pending = compute()
    .catch(() => {
      // Leave the page unmarked if the calculation cannot load.
    })
    .finally(() => {
      pending = null;
    });
}

/** A tab left open overnight picks up the new day when the reader comes back to it. */
function onVisible(): void {
  if (document.visibilityState === 'visible') refresh();
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) document.addEventListener('visibilitychange', onVisible);
  listeners.add(listener);
  refresh();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) document.removeEventListener('visibilitychange', onVisible);
  };
}

const getSnapshot = (): TodayPanchang | null => snapshot;
const getServerSnapshot = (): TodayPanchang | null => null;

export function useTodayPanchang(): TodayPanchang | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
