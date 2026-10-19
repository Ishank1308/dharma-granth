'use client';

/**
 * Sacred Soundscape & Meditation Audio Engine (नादानुसन्धान)
 *
 * 100% Offline, Zero-Network Web Audio API Procedural Synthesizer:
 * - 432Hz Vedic Tanpura Drone (Sa-Pa Harmonics & Jawari Overtone Series)
 * - Pranava Om Resonance (108Hz Deep Meditative Binaural Beating)
 * - Brindavan Flute Harmony (Contemplative Bansuri Overtone Chords)
 * - Sacred Temple Bell / Tibetan Singing Bowl (Inharmonic Metallic Resonance)
 * - Periodic Contemplation Chime (Mindfulness bells every 1m / 3m / 5m)
 * - Sanskrit Verse Recitation (Phonetic Devanagari Cadence)
 *
 * State persists seamlessly in localStorage and stays active across
 * all page transitions in Dharma Granth.
 */

export type SoundscapeTrackId = 'tanpura' | 'om' | 'flute' | 'temple_bell' | 'recitation';

export interface SoundscapeTrackMeta {
  id: SoundscapeTrackId;
  title: string;
  hindiTitle: string;
  subtitle: string;
  baseFreq: number;
}

export const SOUNDSCAPE_TRACKS: SoundscapeTrackMeta[] = [
  {
    id: 'tanpura',
    title: 'Vedic Tanpura Drone',
    hindiTitle: 'वैदिक तन्पूरा नाद',
    subtitle: 'Pure Sa-Pa Harmonics · 432Hz',
    baseFreq: 136.1, // Sacred Om / Vedic Sa
  },
  {
    id: 'om',
    title: 'Pranava Om Resonance',
    hindiTitle: 'प्रणव ॐ ध्यान',
    subtitle: 'Deep Meditative Chanting & Binaural Wave',
    baseFreq: 108.0,
  },
  {
    id: 'flute',
    title: 'Brindavan Flute Harmony',
    hindiTitle: 'वेणु नाद',
    subtitle: 'Contemplative Bansuri Harmonics',
    baseFreq: 216.0,
  },
  {
    id: 'temple_bell',
    title: 'Sacred Temple Bell & Bowl',
    hindiTitle: 'मंदिर घंटा व तिब्बती पात्र',
    subtitle: 'Tibetan Singing Bowl & Temple Chimes',
    baseFreq: 432.0,
  },
  {
    id: 'recitation',
    title: 'Sanskrit Verse Recitation',
    hindiTitle: 'संस्कृत श्लोक उच्चारण',
    subtitle: 'Devanagari Chanted Cadence',
    baseFreq: 160.0,
  },
];

export interface SoundscapeState {
  isPlaying: boolean;
  activeTrack: SoundscapeTrackId;
  volume: number; // 0.0 - 1.0
  isMuted: boolean;
  bowlIntervalSeconds: number; // 0 (off), 60 (1m), 180 (3m), 300 (5m)
  currentVerseSanskrit?: string;
  currentVerseReference?: string;
}

type SoundscapeListener = (state: SoundscapeState) => void;

const STORAGE_ACTIVE = 'dharma_soundscape_active';
const STORAGE_TRACK = 'dharma_soundscape_track';
const STORAGE_VOLUME = 'dharma_soundscape_volume';
const STORAGE_BOWL_INTERVAL = 'dharma_soundscape_bowl_interval';

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeOscillators: OscillatorNode[] = [];
let bowlTimer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<SoundscapeListener>();

let state: SoundscapeState = {
  isPlaying: false,
  activeTrack: 'tanpura',
  volume: 0.65,
  isMuted: false,
  bowlIntervalSeconds: 0,
  currentVerseSanskrit: undefined,
  currentVerseReference: undefined,
};

// Initialize persistent state from localStorage
if (typeof window !== 'undefined') {
  try {
    const savedTrack = localStorage.getItem(STORAGE_TRACK) as SoundscapeTrackId | null;
    if (savedTrack && SOUNDSCAPE_TRACKS.some((t) => t.id === savedTrack)) {
      state.activeTrack = savedTrack;
    }
    const savedVol = localStorage.getItem(STORAGE_VOLUME);
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        state.volume = parsed;
      }
    }
    const savedInterval = localStorage.getItem(STORAGE_BOWL_INTERVAL);
    if (savedInterval !== null) {
      const parsedInterval = parseInt(savedInterval, 10);
      if ([0, 60, 180, 300].includes(parsedInterval)) {
        state.bowlIntervalSeconds = parsedInterval;
      }
    }
  } catch {}
}

function notify() {
  const currentSnapshot = { ...state };
  listeners.forEach((fn) => {
    try {
      fn(currentSnapshot);
    } catch {}
  });
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return null;

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function stopSynthesizer() {
  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {}
  });
  activeOscillators = [];
}

/**
 * Ring a sacred Tibetan singing bowl / temple chime with exponential decay
 */
export function chimeSingingBowl(pitch: number = 432) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const chimeMaster = ctx.createGain();
    const effectiveVol = state.isMuted ? 0 : state.volume;
    chimeMaster.gain.setValueAtTime(effectiveVol * 0.35, now);
    chimeMaster.connect(ctx.destination);

    // Inharmonic Tibetan singing bowl frequency multipliers
    const partials = [
      { ratio: 1.0, gain: 1.0, decay: 4.5 },
      { ratio: 2.76, gain: 0.45, decay: 3.2 },
      { ratio: 5.4, gain: 0.22, decay: 2.2 },
      { ratio: 8.9, gain: 0.08, decay: 1.4 },
    ];

    partials.forEach(({ ratio, gain, decay }) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch * ratio, now);

      pGain.gain.setValueAtTime(gain, now);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(pGain);
      pGain.connect(chimeMaster);

      osc.start(now);
      osc.stop(now + decay);
    });

    setTimeout(() => {
      try {
        chimeMaster.disconnect();
      } catch {}
    }, 5000);
  } catch (err) {
    console.warn('[SacredSoundscape] Chime error:', err);
  }
}

function startPeriodicBowlTimer(seconds: number) {
  if (bowlTimer) {
    clearInterval(bowlTimer);
    bowlTimer = null;
  }
  if (seconds <= 0) return;

  bowlTimer = setInterval(() => {
    chimeSingingBowl(432);
  }, seconds * 1000);
}

function startSynthesizer(trackId: SoundscapeTrackId, vol: number) {
  stopSynthesizer();
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const mg = ctx.createGain();
    mg.gain.setValueAtTime(0.0001, now);
    mg.gain.linearRampToValueAtTime(vol * 0.22, now + 1.2);
    mg.connect(ctx.destination);
    masterGain = mg;

    const trackDef = SOUNDSCAPE_TRACKS.find((t) => t.id === trackId) || SOUNDSCAPE_TRACKS[0];
    const base = trackDef.baseFreq;

    const freqs =
      trackId === 'tanpura'
        ? [base, base * 1.5, base * 2.0, base * 0.5] // Sa, Pa, Tar Sa, Kharaj Sa
        : trackId === 'om'
          ? [base, base * 1.008, base * 0.5, base * 2.0] // Deep pulsating Om
          : trackId === 'flute'
            ? [base, base * 1.25, base * 1.5, base * 2.0] // Gandhar & Pancham chords
            : [base, base * 2.76, base * 5.4]; // Temple Bell cluster

    const oscs: OscillatorNode[] = [];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const oscGain = ctx.createGain();

      osc.type = trackId === 'om' ? 'sine' : trackId === 'tanpura' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, now);

      // Subtle warm LFO detune
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.04, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(trackId === 'om' ? 0.35 : 0.6, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime((1 / freqs.length) * (idx === 0 ? 1 : 0.65), now);

      if (panner) {
        panner.pan.setValueAtTime((idx % 2 === 0 ? -1 : 1) * 0.3, now);
        osc.connect(oscGain);
        oscGain.connect(panner);
        panner.connect(mg);
      } else {
        osc.connect(oscGain);
        oscGain.connect(mg);
      }

      osc.start();
      oscs.push(osc);
    });

    activeOscillators = oscs;
  } catch (err) {
    console.warn('[SacredSoundscape] Synthesizer error:', err);
  }
}

function speakCurrentVerse(text?: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hi-IN';
  utterance.rate = 0.85;
  utterance.pitch = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const sanskritVoice =
    voices.find((v) => v.lang.includes('hi') || v.lang.includes('sa')) ||
    voices.find((v) => v.lang.includes('IN'));
  if (sanskritVoice) utterance.voice = sanskritVoice;

  utterance.onend = () => {
    state.isPlaying = false;
    notify();
  };

  window.speechSynthesis.speak(utterance);
}

// Public API
export function getSoundscapeState(): SoundscapeState {
  return { ...state };
}

export function subscribeSoundscape(listener: SoundscapeListener): () => void {
  listeners.add(listener);
  listener({ ...state });
  return () => {
    listeners.delete(listener);
  };
}

export function startSoundscape(track?: SoundscapeTrackId) {
  const targetTrack = track || state.activeTrack;
  state.activeTrack = targetTrack;
  state.isPlaying = true;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_ACTIVE, 'true');
      localStorage.setItem(STORAGE_TRACK, targetTrack);
    } catch {}
  }

  if (targetTrack === 'recitation') {
    stopSynthesizer();
    if (state.currentVerseSanskrit) {
      speakCurrentVerse(state.currentVerseSanskrit);
    }
  } else {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    startSynthesizer(targetTrack, state.isMuted ? 0 : state.volume);
  }

  if (state.bowlIntervalSeconds > 0) {
    startPeriodicBowlTimer(state.bowlIntervalSeconds);
  }

  notify();
}

export function stopSoundscape() {
  state.isPlaying = false;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_ACTIVE, 'false');
    } catch {}
  }

  stopSynthesizer();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  if (bowlTimer) {
    clearInterval(bowlTimer);
    bowlTimer = null;
  }

  notify();
}

export function toggleSoundscape(track?: SoundscapeTrackId): boolean {
  if (state.isPlaying) {
    stopSoundscape();
    return false;
  } else {
    startSoundscape(track);
    return true;
  }
}

export function setSoundscapeTrack(track: SoundscapeTrackId) {
  state.activeTrack = track;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_TRACK, track);
    } catch {}
  }

  if (state.isPlaying) {
    if (track === 'recitation') {
      stopSynthesizer();
      if (state.currentVerseSanskrit) speakCurrentVerse(state.currentVerseSanskrit);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      startSynthesizer(track, state.isMuted ? 0 : state.volume);
    }
  }
  notify();
}

export function setSoundscapeVolume(vol: number) {
  const clamped = Math.max(0, Math.min(1, vol));
  state.volume = clamped;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_VOLUME, String(clamped));
    } catch {}
  }

  if (masterGain && audioCtx && state.isPlaying) {
    try {
      const now = audioCtx.currentTime;
      masterGain.gain.setValueAtTime(state.isMuted ? 0 : clamped * 0.22, now);
    } catch {}
  }
  notify();
}

export function toggleSoundscapeMute() {
  state.isMuted = !state.isMuted;
  if (masterGain && audioCtx && state.isPlaying) {
    try {
      const now = audioCtx.currentTime;
      masterGain.gain.setValueAtTime(state.isMuted ? 0 : state.volume * 0.22, now);
    } catch {}
  }
  notify();
}

export function setSoundscapeBowlInterval(seconds: number) {
  state.bowlIntervalSeconds = seconds;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_BOWL_INTERVAL, String(seconds));
    } catch {}
  }

  if (state.isPlaying && seconds > 0) {
    startPeriodicBowlTimer(seconds);
  } else if (bowlTimer) {
    clearInterval(bowlTimer);
    bowlTimer = null;
  }
  notify();
}

export function setCurrentVerseContext(sanskrit?: string, reference?: string) {
  state.currentVerseSanskrit = sanskrit;
  state.currentVerseReference = reference;
  notify();
}
