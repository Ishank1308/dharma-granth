'use client';

/**
 * The sacred soundscape engine (tanpura synthesis, recitation, speech) loads after the page is interactive
 * instead of in its first download. `loadSoundscape()` starts the fetch once; `withSoundscape(fn)` runs `fn`
 * at once when the engine is already loaded (so a tap keeps its user activation for audio) and otherwise as
 * soon as it arrives.
 */
type Soundscape = typeof import('./sacred-soundscape');

let mod: Soundscape | null = null;
let pending: Promise<Soundscape> | null = null;

export function loadSoundscape(): Promise<Soundscape> {
  if (!pending) pending = import('./sacred-soundscape').then((m) => (mod = m));
  return pending;
}

export function withSoundscape(fn: (m: Soundscape) => void): void {
  if (mod) fn(mod);
  else void loadSoundscape().then(fn);
}
