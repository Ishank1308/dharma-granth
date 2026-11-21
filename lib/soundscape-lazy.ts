'use client';

import type {
  SoundscapeTrackId,
  ParayanaCadenceMode,
  SoundscapeState,
} from './sacred-soundscape';

export type SoundscapeListener = (state: SoundscapeState) => void;

export type {
  SoundscapeTrackId,
  ParayanaCadenceMode,
  SoundscapeState,
};

type Soundscape = typeof import('./sacred-soundscape');

let mod: Soundscape | null = null;
let pending: Promise<Soundscape> | null = null;

const pendingListeners = new Set<SoundscapeListener>();
const activeUnsubs = new Map<SoundscapeListener, () => void>();
// Calls made before the engine arrived, in the order they were made.
const queued: Array<(m: Soundscape) => void> = [];

// Default fallback state when the engine is not yet loaded
const fallbackState: SoundscapeState = {
  isPlaying: false,
  activeTrack: 'tanpura',
  volume: 0.65,
  isMuted: false,
  bowlIntervalSeconds: 0,
  continuousParayana: false,
  parayanaCadenceMode: 'sanskrit_only',
  sleepTimerMinutes: 0,
  sleepTimerEndsAt: null,
  currentVerseSanskrit: undefined,
  currentVerseReference: undefined,
  currentVerseHindi: undefined,
  currentVerseEnglish: undefined,
};

// The engine's own key (STORAGE_PARAYANA_MODE in sacred-soundscape.ts). The engine reads it when it
// starts, so a choice saved here before the first play is the one it starts with.
const STORAGE_PARAYANA_MODE = 'dharma_parayana_mode';

// What the page set before the engine arrived. The engine starts from what it saved itself, so
// only these go across, and they go first: a play call queued behind the load then finds its verse.
let verseSetBeforeLoad = false;
let continuousSetBeforeLoad = false;
let cadenceSetBeforeLoad = false;

if (typeof window !== 'undefined') {
  try {
    const savedMode = localStorage.getItem(STORAGE_PARAYANA_MODE) as ParayanaCadenceMode | null;
    if (savedMode && ['sanskrit_only', 'sanskrit_hindi', 'sanskrit_english'].includes(savedMode)) {
      fallbackState.parayanaCadenceMode = savedMode;
    }
  } catch { }
}

export function loadSoundscape(): Promise<Soundscape> {
  if (!pending) {
    pending = import('./sacred-soundscape').then(
      (m) => {
        mod = m;
        if (continuousSetBeforeLoad) m.setContinuousParayana(fallbackState.continuousParayana);
        if (cadenceSetBeforeLoad) m.setParayanaCadenceMode(fallbackState.parayanaCadenceMode);
        if (verseSetBeforeLoad) {
          m.setCurrentVerseContext(
            fallbackState.currentVerseSanskrit,
            fallbackState.currentVerseReference,
            fallbackState.currentVerseHindi,
            fallbackState.currentVerseEnglish,
          );
        }
        // The queued calls run before the page's listeners join. A listener's first word from the
        // engine is then the state after the press that loaded it (playing), not the idle state
        // before it, which a page reads as "stopped".
        for (const fn of queued.splice(0)) {
          try {
            fn(m);
          } catch (error) {
            setTimeout(() => {
              throw error;
            });
          }
        }
        for (const listener of pendingListeners) {
          const unsub = m.subscribeSoundscape(listener);
          activeUnsubs.set(listener, unsub);
        }
        pendingListeners.clear();
        return m;
      },
      (error) => {
        // Offline with the engine not saved yet: forget this try so the next press asks again,
        // and drop the calls that waited on it so they do not play at some later moment.
        pending = null;
        queued.length = 0;
        throw error;
      },
    );
  }
  return pending;
}

export function withSoundscape(fn: (m: Soundscape) => void): void {
  if (mod) {
    fn(mod);
    return;
  }
  queued.push(fn);
  void loadSoundscape();
}

export function getSoundscapeState(): SoundscapeState {
  return mod ? mod.getSoundscapeState() : { ...fallbackState };
}

export function subscribeSoundscape(listener: SoundscapeListener): () => void {
  if (mod) {
    return mod.subscribeSoundscape(listener);
  }
  listener({ ...fallbackState });
  pendingListeners.add(listener);
  return () => {
    pendingListeners.delete(listener);
    const unsub = activeUnsubs.get(listener);
    if (unsub) {
      unsub();
      activeUnsubs.delete(listener);
    }
  };
}

export function startSoundscape(track?: SoundscapeTrackId): void {
  withSoundscape((m) => m.startSoundscape(track));
}

export function stopSoundscape(): void {
  if (mod) {
    mod.stopSoundscape();
  }
}

export function setCurrentVerseContext(
  sanskrit?: string,
  reference?: string,
  hindi?: string,
  english?: string,
): void {
  fallbackState.currentVerseSanskrit = sanskrit;
  fallbackState.currentVerseReference = reference;
  fallbackState.currentVerseHindi = hindi;
  fallbackState.currentVerseEnglish = english;
  if (mod) {
    mod.setCurrentVerseContext(sanskrit, reference, hindi, english);
  } else {
    verseSetBeforeLoad = true;
  }
}

export function setContinuousParayana(enabled: boolean): void {
  fallbackState.continuousParayana = enabled;
  if (mod) {
    mod.setContinuousParayana(enabled);
  } else {
    continuousSetBeforeLoad = true;
  }
}

export function setParayanaCadenceMode(mode: ParayanaCadenceMode): void {
  fallbackState.parayanaCadenceMode = mode;
  if (mod) {
    mod.setParayanaCadenceMode(mode);
    return;
  }
  // The engine loads on first play. Until then the choice is saved under the engine's own key and
  // the page is told, so the control shows what was chosen.
  cadenceSetBeforeLoad = true;
  try {
    localStorage.setItem(STORAGE_PARAYANA_MODE, mode);
  } catch { }
  for (const listener of pendingListeners) listener({ ...fallbackState });
}

export function strikeTempleBell(repeats?: number): void {
  withSoundscape((m) => m.strikeTempleBell(repeats));
}

export function speakSanskritTerm(pada: string, speed?: number): void {
  withSoundscape((m) => m.speakSanskritTerm(pada, speed));
}

export function startMeditationDrone(mode: 'tanpura' | 'om' | 'flute' | 'silent'): void {
  withSoundscape((m) => m.startMeditationDrone(mode));
}

export function stopMeditationDrone(): void {
  if (mod) {
    mod.stopMeditationDrone();
  }
}
