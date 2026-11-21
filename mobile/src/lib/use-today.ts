import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** The phone's local date as `YYYY-M-D`. */
export function localDayKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** The local date (at noon) that a day key names. */
export function dateFromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

/**
 * Today's local date key, which changes at midnight while the app stays open.
 *
 * A timer fires just after the next local midnight. Android pauses JavaScript timers while the app is
 * in the background, so the date is also re-read whenever the app comes back to the foreground: a
 * phone left on the Library screen overnight shows the new verse of the day when it is unlocked.
 */
export function useToday(): string {
  const [day, setDay] = useState(localDayKey);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      setDay(localDayKey());
      if (timer) clearTimeout(timer);
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      timer = setTimeout(refresh, Math.max(1000, nextMidnight.getTime() - now.getTime()));
    };
    refresh();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      if (timer) clearTimeout(timer);
      sub.remove();
    };
  }, []);

  return day;
}
