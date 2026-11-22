import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import * as J from '@/lib/journal';

/**
 * The Svadhyaya journal and verse collections, kept on the phone under one key (see @/lib/journal for the
 * rules). Separate from the app state so the reader does not re-render when a reflection is typed.
 */
export const JOURNAL_KEY = 'dg.journal.v1';

interface JournalState {
  ready: boolean;
  journal: J.JournalData;
  /** Returns the saved entry's id, or undefined when the draft was empty. */
  saveEntry: (draft: J.EntryDraft, id?: string) => string | undefined;
  deleteEntry: (id: string) => void;
  createCollection: (name: string) => { error?: J.CollectionError; id?: string };
  renameCollection: (id: string, name: string) => J.CollectionError | undefined;
  deleteCollection: (id: string) => void;
  moveVerse: (v: J.VerseLink, collectionId: string) => void;
  dropVerse: (v: J.VerseLink) => void;
  /** Adds a backup's journal to the one on the phone. Returns how many entries were new. */
  importJournal: (raw: unknown) => number;
}

const Ctx = createContext<JournalState | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [journal, setJournal] = useState<J.JournalData>(J.EMPTY_JOURNAL);
  // The latest data, for actions that must return a result straight away (save, create).
  const current = useRef(journal);
  const loaded = useRef(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(JOURNAL_KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        try {
          const data = J.normalizeJournal(JSON.parse(raw));
          current.current = data;
          setJournal(data);
        } catch {
          // A damaged value starts an empty journal rather than stopping the app.
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
    AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(journal)).catch(() => {
      // Storage full or unavailable: the journal keeps working for this session.
    });
  }, [journal]);

  const commit = useCallback((next: J.JournalData) => {
    if (next === current.current) return;
    current.current = next;
    setJournal(next);
  }, []);

  const saveEntry = useCallback(
    (draft: J.EntryDraft, id?: string) => {
      const res = J.saveEntry(current.current, draft, id);
      commit(res.data);
      return res.id;
    },
    [commit],
  );
  const deleteEntry = useCallback((id: string) => commit(J.deleteEntry(current.current, id)), [commit]);
  const createCollection = useCallback(
    (name: string) => {
      const res = J.createCollection(current.current, name);
      commit(res.data);
      return { error: res.error, id: res.id };
    },
    [commit],
  );
  const renameCollection = useCallback(
    (id: string, name: string) => {
      const res = J.renameCollection(current.current, id, name);
      commit(res.data);
      return res.error;
    },
    [commit],
  );
  const deleteCollection = useCallback((id: string) => commit(J.deleteCollection(current.current, id).data), [commit]);
  const moveVerse = useCallback((v: J.VerseLink, c: string) => commit(J.moveVerse(current.current, v, c)), [commit]);
  const dropVerse = useCallback((v: J.VerseLink) => commit(J.dropVerse(current.current, v)), [commit]);
  const importJournal = useCallback(
    (raw: unknown) => {
      const incoming = J.normalizeJournal(raw);
      const before = new Set(current.current.entries.map((e) => e.id));
      commit(J.mergeJournal(current.current, incoming));
      return incoming.entries.filter((e) => !before.has(e.id)).length;
    },
    [commit],
  );

  const value = useMemo<JournalState>(
    () => ({ ready, journal, saveEntry, deleteEntry, createCollection, renameCollection, deleteCollection, moveVerse, dropVerse, importJournal }),
    [ready, journal, saveEntry, deleteEntry, createCollection, renameCollection, deleteCollection, moveVerse, dropVerse, importJournal],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useJournal(): JournalState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useJournal must be used inside JournalProvider');
  return v;
}
