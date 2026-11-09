'use client';

import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { coerceStored } from '@/lib/safe-stored';

/**
 * Generic localStorage-backed state hook.
 *
 * - Reads the initial value from localStorage on mount (SSR-safe: returns
 *   `initial` during SSR, then syncs after hydration).
 * - Writes to localStorage on every change via a debounced effect.
 * - Cross-tab sync: listens to the `storage` event so multiple tabs stay
 *   in sync.
 *
 * @param key   localStorage key
 * @param initial  fallback value when nothing is stored yet
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(initial);
  // Callers routinely pass a literal (`[]`, `{}`) as the fallback, which is a
  // new object every render. Keeping it in a ref, and out of the effect
  // dependencies, stops the hydrate effect from re-running (and setting new
  // state) after every render, an endless update loop.
  const initialRef = useRef(initial);
  initialRef.current = initial;
  // Gates the persist effect until the hydrated value has actually rendered.
  // A state flag (not a ref) is deliberate: within the mount commit the
  // persist effect runs right after the hydrate effect, and with a ref it
  // would immediately write `initial` over the stored value — which, under
  // StrictMode's double-effect pass in dev, the second hydrate then reads
  // back, silently wiping stored data. With state, persist stays skipped
  // until the post-hydration re-render, so it can only ever write values
  // the user has genuinely seen.
  const [hydrated, setHydrated] = useState(false);
  // Hydrate from localStorage after mount or when key changes. As a transition, so React
  // finishes hydrating the page first: an urgent update here reaches lazy (next/dynamic)
  // children before their chunks arrive, React switches them to client rendering, and they
  // blank out for a moment (a large layout shift on /practice/).
  useEffect(() => {
    startTransition(() => {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) {
          setValue(coerceStored<T>(JSON.parse(raw), initialRef.current));
        } else {
          setValue(initialRef.current);
        }
      } catch {
        // ignore parse / access errors
      }
      setHydrated(true);
    });
  }, [key]);

  // Persist on change (only after hydration, so the initial value can never
  // overwrite previously stored data).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / access errors
    }
  }, [value, hydrated, key]);

  // Cross-tab sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key || e.newValue === null) return;
      try {
        setValue(coerceStored<T>(JSON.parse(e.newValue), initialRef.current));
      } catch {
        // ignore
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) =>
        typeof next === 'function' ? (next as (p: T) => T)(prev) : next,
      );
    },
    [],
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setValue(initialRef.current);
  }, [key]);

  return [value, update, remove];
}
