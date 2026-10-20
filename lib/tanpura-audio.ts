'use client';

/**
 * Procedural Sacred Tanpura & Om Drone Synthesizer (तन्पूरा नाद)
 *
 * Implements a pure Web Audio API ambient acoustic tanpura drone:
 * - Sa-Pa-Sa-Sa classical Indian tuning:
 *     1. Pancham (Pa): ~207.65 Hz (or Madhyam Ma)
 *     2. Tar Sa (High Sa): ~277.18 Hz
 *     3. Tar Sa (High Sa): ~277.18 Hz (slight acoustic chorus detuning)
 *     4. Kharaj Sa (Low Sa): ~138.59 Hz (deep resonant root)
 * - Rich harmonic overtone series simulating the curved bone bridge (Jivari / Jawari)
 * - Gentle cyclic plucking cadence (Pa -> Sa -> Sa -> Kharaj Sa every ~1.8 seconds)
 * - Warm low-pass acoustic filtering so it sits gently beneath speech recitation
 * - Smooth exponential fade-in and fade-out to prevent audio clicks
 * - Pitch presets: C# (Standard), D (High / Vedic), A# (Deep Meditative)
 * - Live volume control (0.0 to 1.0) with smooth real-time gain ramping
 * - Zero network overhead, zero external files, 100% offline capable.
 */

const STORAGE_KEY = 'dharma_tanpura_enabled';
const VOLUME_STORAGE_KEY = 'dharma_tanpura_volume';
const PITCH_STORAGE_KEY = 'dharma_tanpura_pitch';

export type TanpuraPitch = 'C#' | 'D' | 'A#' | '432';

export interface TanpuraSettings {
  volume: number;
  pitch: TanpuraPitch;
}

const PITCH_ROOTS: Record<TanpuraPitch, number> = {
  'C#': 138.59,
  'D': 146.83,
  'A#': 116.54,
  // 432 Hz tuning: Kharaj Sa 108 Hz so the tar Sa rings exactly at 432 Hz,
  // with Pancham (Pa) at 162 Hz — the Sa-Pa-Sa'-Sa' drone requested for svaadhyaya.
  '432': 108,
};

type Listener = (isPlaying: boolean) => void;
type SettingsListener = (settings: TanpuraSettings) => void;

const listeners = new Set<Listener>();
const settingsListeners = new Set<SettingsListener>();

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let disconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let isPlaying = false;
let sequenceTimer: ReturnType<typeof setInterval> | null = null;
let currentStep = 0;

let currentVolume = 0.45;
let currentPitch: TanpuraPitch = 'C#';

// Initialise settings from localStorage if available in browser
if (typeof window !== 'undefined') {
  try {
    const savedVol = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        currentVolume = parsed;
      }
    }
    const savedPitch = localStorage.getItem(PITCH_STORAGE_KEY) as TanpuraPitch | null;
    if (savedPitch && PITCH_ROOTS[savedPitch]) {
      currentPitch = savedPitch;
    }
  } catch {}
}

function getSaRoot(): number {
  return PITCH_ROOTS[currentPitch] || 138.59;
}

function getStringsConfig() {
  const sa = getSaRoot();
  return [
    { name: 'Pa', freq: sa * 1.5, detune: 0, gain: 0.05, duration: 4.5 },
    { name: 'Tar Sa 1', freq: sa * 2, detune: -2, gain: 0.045, duration: 4.2 },
    { name: 'Tar Sa 2', freq: sa * 2, detune: +2, gain: 0.045, duration: 4.2 },
    { name: 'Kharaj Sa', freq: sa, detune: 0, gain: 0.065, duration: 5.5 },
  ];
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx || audioCtx.state === 'closed') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(isPlaying);
    } catch {}
  });
}

function notifySettingsListeners() {
  const current = { volume: currentVolume, pitch: currentPitch };
  settingsListeners.forEach((fn) => {
    try {
      fn(current);
    } catch {}
  });
}

/**
 * Pluck a single tanpura string with authentic Jivari acoustic overtones
 */
function pluckString(stringIdx: number) {
  const ctx = getAudioContext();
  if (!ctx || !isPlaying || !masterGain) return;

  const strings = getStringsConfig();
  const str = strings[stringIdx % strings.length];
  const now = ctx.currentTime;

  // Rich jawari harmonic series
  const harmonics = [
    { mult: 1, amp: 1.0, type: 'sawtooth' as OscillatorType },
    { mult: 2, amp: 0.6, type: 'sine' as OscillatorType },
    { mult: 3, amp: 0.35, type: 'sine' as OscillatorType },
    { mult: 4, amp: 0.18, type: 'triangle' as OscillatorType },
  ];

  // String envelope gain
  const stringGain = ctx.createGain();
  stringGain.gain.setValueAtTime(0.0001, now);
  stringGain.gain.linearRampToValueAtTime(str.gain, now + 0.08);
  stringGain.gain.exponentialRampToValueAtTime(0.0001, now + str.duration);

  // Warm acoustic wood body filter (Tumba gourd resonance)
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(950, now);
  filter.Q.setValueAtTime(2.0, now);

  harmonics.forEach(({ mult, amp, type }) => {
    const osc = ctx.createOscillator();
    const hGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(str.freq * mult, now);
    osc.detune.setValueAtTime(str.detune, now);

    hGain.gain.setValueAtTime(amp, now);

    osc.connect(hGain);
    hGain.connect(filter);

    osc.start(now);
    osc.stop(now + str.duration);
  });

  filter.connect(stringGain);
  stringGain.connect(masterGain);
}

export function isTanpuraPlaying(): boolean {
  return isPlaying;
}

export function getTanpuraEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setTanpuraEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {}
}

export function getTanpuraVolume(): number {
  return currentVolume;
}

export function setTanpuraVolume(volume: number): void {
  const clamped = Math.min(1.0, Math.max(0.0, volume));
  currentVolume = clamped;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
    } catch {}
  }
  if (masterGain && audioCtx && isPlaying) {
    try {
      const now = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.linearRampToValueAtTime(clamped, now + 0.15);
    } catch {}
  }
  notifySettingsListeners();
}

export function getTanpuraPitch(): TanpuraPitch {
  return currentPitch;
}

export function setTanpuraPitch(pitch: TanpuraPitch): void {
  if (!PITCH_ROOTS[pitch]) return;
  currentPitch = pitch;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PITCH_STORAGE_KEY, pitch);
    } catch {}
  }
  notifySettingsListeners();
}

export function startTanpura(): void {
  if (isPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (disconnectTimeout) {
    clearTimeout(disconnectTimeout);
    disconnectTimeout = null;
  }

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    // Smooth fade in to currentVolume
    masterGain.gain.linearRampToValueAtTime(Math.max(0.05, currentVolume), ctx.currentTime + 1.2);
    masterGain.connect(ctx.destination);

    isPlaying = true;
    currentStep = 0;

    // Pluck first string immediately
    pluckString(0);
    currentStep = 1;

    // Pluck subsequent strings in sequence every 1.8 seconds (Pa -> Sa -> Sa -> Low Sa)
    sequenceTimer = setInterval(() => {
      pluckString(currentStep);
      currentStep = (currentStep + 1) % 4;
    }, 1800);

    notifyListeners();
  } catch (err) {
    console.error('Failed to start tanpura drone:', err);
    isPlaying = false;
  }
}

export function stopTanpura(): void {
  if (!isPlaying) return;

  if (sequenceTimer) {
    clearInterval(sequenceTimer);
    sequenceTimer = null;
  }

  if (masterGain && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      // Smooth fade-out over 0.7s
      masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.7);
      const targetGain = masterGain;
      disconnectTimeout = setTimeout(() => {
        try {
          targetGain.disconnect();
        } catch {}
        disconnectTimeout = null;
      }, 750);
    } catch {}
    masterGain = null;
  }

  isPlaying = false;
  notifyListeners();
}

export function toggleTanpura(): boolean {
  if (isPlaying) {
    stopTanpura();
    setTanpuraEnabled(false);
    return false;
  } else {
    startTanpura();
    setTanpuraEnabled(true);
    return true;
  }
}

export function subscribeTanpura(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function subscribeTanpuraSettings(listener: SettingsListener): () => void {
  settingsListeners.add(listener);
  return () => {
    settingsListeners.delete(listener);
  };
}
