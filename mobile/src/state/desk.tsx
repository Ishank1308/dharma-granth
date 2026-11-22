import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import * as D from '@/lib/desk';

/**
 * The study desk's reading queue and weekly goal (see @/lib/desk), kept on the phone under one key and in
 * the backup under `desk`. Its own store, so the reader does not re-render when the queue changes.
 */
export const DESK_KEY = 'dg.desk.v1';

interface DeskState {
  ready: boolean;
  desk: D.DeskData;
  /** Returns how many verses were new to the queue. */
  enqueue: (items: D.QueueItem[]) => number;
  dequeue: (item: D.QueueItem) => void;
  move: (index: number, delta: number) => void;
  setGoal: (goal: number) => void;
  /** Adds a backup's queue to the phone's. */
  importDesk: (raw: unknown) => void;
}

const Ctx = createContext<DeskState | null>(null);

export function DeskProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [desk, setDesk] = useState<D.DeskData>(D.EMPTY_DESK);
  const current = useRef(desk);
  const loaded = useRef(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(DESK_KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        try {
          const data = D.normalizeDesk(JSON.parse(raw));
          current.current = data;
          setDesk(data);
        } catch {
          // A damaged value starts an empty desk rather than stopping the app.
        }
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(DESK_KEY, JSON.stringify(desk)).catch(() => {
      // Storage full or unavailable: the desk keeps working for this session.
    });
  }, [desk]);

  const commit = useCallback((next: D.DeskData) => {
    if (next === current.current) return;
    current.current = next;
    setDesk(next);
  }, []);

  const enqueue = useCallback(
    (items: D.QueueItem[]) => {
      const res = D.addToQueue(current.current, items);
      commit(res.desk);
      return res.added;
    },
    [commit],
  );
  const dequeue = useCallback((item: D.QueueItem) => commit(D.removeFromQueue(current.current, item)), [commit]);
  const move = useCallback((index: number, delta: number) => commit(D.moveInQueue(current.current, index, delta)), [commit]);
  const setGoal = useCallback((goal: number) => commit(D.setGoal(current.current, goal)), [commit]);
  const importDesk = useCallback((raw: unknown) => commit(D.mergeDesk(current.current, raw)), [commit]);

  const value = useMemo<DeskState>(
    () => ({ ready, desk, enqueue, dequeue, move, setGoal, importDesk }),
    [ready, desk, enqueue, dequeue, move, setGoal, importDesk],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDesk(): DeskState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDesk must be used inside DeskProvider');
  return v;
}
