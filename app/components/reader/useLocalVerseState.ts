'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type NoteSaveStatus = 'idle' | 'saving' | 'saved' | 'unavailable';

export interface UseLocalVerseStateOptions {
  scriptureId: string;
  chapterId: number | string;
  verseId: number | string;
  debounceMs?: number;
}

export interface LocalVerseState {
  hydrated: boolean;
  note: string;
  setNote: (value: string) => void;
  saveStatus: NoteSaveStatus;
  practiceDone: boolean;
  togglePractice: () => void;
  noteStorageKey: string;
}

function localTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * SSR/hydration-safe hook syncing private verse reflections and daily contemplation
 * practice checkmarks to localStorage on-device (zero-account privacy).
 */
export function useLocalVerseState({
  scriptureId,
  chapterId,
  verseId,
  debounceMs = 450,
}: UseLocalVerseStateOptions): LocalVerseState {
  const noteStorageKey = `dharmagranth:note:${scriptureId}:${chapterId}:${verseId}`;
  const practiceStorageKey = `dharmagranth:practice:${scriptureId}:${chapterId}:${verseId}`;

  const [hydrated, setHydrated] = useState(false);
  const [note, setNoteState] = useState('');
  const [saveStatus, setSaveStatus] = useState<NoteSaveStatus>('idle');
  const [practiceDone, setPracticeDone] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingNoteRef = useRef<{ key: string; value: string } | null>(null);

  const flushPending = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const pending = pendingNoteRef.current;
    if (!pending) return;
    pendingNoteRef.current = null;
    try {
      const trimmed = pending.value.trim();
      if (trimmed.length > 0) {
        localStorage.setItem(pending.key, pending.value);
      } else {
        localStorage.removeItem(pending.key);
      }
    } catch {
      // Storage blocked in private browsing; in-memory state remains intact.
    }
  }, []);

  // Hydrate stored reflection and today's practice state after mount (never during SSR).
  useEffect(() => {
    const readFromStorage = () => {
      try {
        const savedNote = localStorage.getItem(noteStorageKey) ?? '';
        setNoteState(savedNote);
        setSaveStatus(savedNote.trim().length > 0 ? 'saved' : 'idle');

        const rawPractice = localStorage.getItem(practiceStorageKey);
        if (rawPractice) {
          const parsed: unknown = JSON.parse(rawPractice);
          const date =
            parsed && typeof parsed === 'object' && 'completedDate' in parsed
              ? String((parsed as { completedDate?: unknown }).completedDate ?? '')
              : '';
          setPracticeDone(date === localTodayIso());
        } else {
          setPracticeDone(false);
        }
      } catch {
        setNoteState('');
        setPracticeDone(false);
        setSaveStatus('unavailable');
      }
      setHydrated(true);
    };

    readFromStorage();

    const onStorage = (event: StorageEvent) => {
      if (event.key === noteStorageKey || event.key === practiceStorageKey || event.key === null) {
        readFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      flushPending();
      window.removeEventListener('storage', onStorage);
    };
  }, [noteStorageKey, practiceStorageKey, flushPending]);

  const setNote = useCallback(
    (value: string) => {
      setNoteState(value);
      setSaveStatus('saving');
      pendingNoteRef.current = { key: noteStorageKey, value };

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        pendingNoteRef.current = null;
        try {
          if (value.trim().length > 0) {
            localStorage.setItem(noteStorageKey, value);
            setSaveStatus('saved');
          } else {
            localStorage.removeItem(noteStorageKey);
            setSaveStatus('idle');
          }
        } catch {
          setSaveStatus('unavailable');
        }
      }, debounceMs);
    },
    [noteStorageKey, debounceMs],
  );

  const togglePractice = useCallback(() => {
    setPracticeDone((prev) => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem(practiceStorageKey, JSON.stringify({ completedDate: localTodayIso() }));
        } else {
          localStorage.removeItem(practiceStorageKey);
        }
      } catch {
        // Keep session state even if storage is unavailable.
      }
      return next;
    });
  }, [practiceStorageKey]);

  return {
    hydrated,
    note,
    setNote,
    saveStatus,
    practiceDone,
    togglePractice,
    noteStorageKey,
  };
}
