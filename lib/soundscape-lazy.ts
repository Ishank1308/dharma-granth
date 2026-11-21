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

if (typeof window !== 'undefined') {
  try {
    const savedMode = localStorage.getItem('dharma:parayana-mode') as ParayanaCadenceMode | null;
    if (savedMode && ['sanskrit_only', 'sanskrit_hindi', 'sanskrit_english'].includes(savedMode)) {
      fallbackState.parayanaCadenceMode = savedMode;
    }
  } catch { }
}

export function loadSoundscape(): Promise<Soundscape> {
  if (!pending) {
    pending = import('./sacred-soundscape').then((m) => {
      mod = m;
      for (const listener of pendingListeners) {
        const unsub = m.subscribeSoundscape(listener);
        activeUnsubs.set(listener, unsub);
      }
      pendingListeners.clear();
      return m;
    });
  }
  return pending;
}

export function withSoundscape(fn: (m: Soundscape) => void): void {
  if (mod) {
    fn(mod);
  } else {
    void loadSoundscape().then(fn);
  }
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
  }
}

export function setContinuousParayana(enabled: boolean): void {
  fallbackState.continuousParayana = enabled;
  if (mod) {
    mod.setContinuousParayana(enabled);
  }
}

export function setParayanaCadenceMode(mode: ParayanaCadenceMode): void {
  fallbackState.parayanaCadenceMode = mode;
  if (mod) {
    mod.setParayanaCadenceMode(mode);
    return;
  }
  // The engine loads on first play. Until then the choice is kept here, where the engine reads
  // it when it starts, and the page is told, so the control shows what was chosen.
  try {
    localStorage.setItem('dharma:parayana-mode', mode);
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
