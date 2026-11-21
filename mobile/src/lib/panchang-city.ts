import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { cityById, type LocationConfig } from '@/content/explore';

/** The Panchang city, kept on this phone only, as the website keeps it in localStorage. */
const KEY = 'dg.panchang.city.v1';

let cached: string | null = null;
const listeners = new Set<(id: string) => void>();

/** The chosen city (Varanasi until the reader picks one) and a setter shared by every screen. */
export function usePanchangCity(): [LocationConfig, (id: string) => void] {
  const [id, setId] = useState<string | null>(cached);

  useEffect(() => {
    listeners.add(setId);
    if (cached === null) {
      AsyncStorage.getItem(KEY)
        .then((saved) => {
          if (saved && cached === null) {
            cached = saved;
            listeners.forEach((l) => l(saved));
          }
        })
        .catch(() => {});
    }
    return () => {
      listeners.delete(setId);
    };
  }, []);

  const choose = useCallback((next: string) => {
    cached = next;
    listeners.forEach((l) => l(next));
    AsyncStorage.setItem(KEY, next).catch(() => {});
  }, []);

  return [cityById(id), choose];
}
