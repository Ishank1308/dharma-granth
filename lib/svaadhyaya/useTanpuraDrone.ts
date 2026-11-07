'use client';

/**
 * Svaadhyaya Engine — Tanpura drone hook.
 *
 * A self-contained React binding over the procedural Web Audio tanpura engine
 * in `lib/tanpura-audio.ts` (Sa–Pa–Sa'–Sa' plucked-string synthesis with
 * Jivari overtones, warm low-pass filtering and click-free fades — zero
 * external audio assets). The hook adds:
 *   - React state mirroring of the singleton engine (safe across mounts)
 *   - a continuous background mode: the drone keeps playing across verse
 *     switches and even while the chanting player is stopped
 *   - volume control persisted via the engine (localStorage)
 *   - a 432 Hz (Sa' = 432 Hz) tuning preset alongside the classic pitch set
 *
 * Usage:
 *   const drone = useTanpuraDrone();
 *   drone.toggle();            // start/stop
 *   drone.setVolume(0.3);      // ambient level
 *   drone.setPitch('432');     // 432 Hz Sa' tuning
 */

import { useCallback, useEffect, useState } from 'react';
import {
  getTanpuraPitch,
  getTanpuraVolume,
  isTanpuraPlaying,
  setTanpuraPitch,
  setTanpuraVolume,
  startTanpura,
  stopTanpura,
  subscribeTanpura,
  subscribeTanpuraSettings,
  type TanpuraPitch,
} from '@/lib/tanpura-audio';

export interface TanpuraDrone {
  /** Drone currently sounding. */
  active: boolean;
  volume: number;
  pitch: TanpuraPitch;
  toggle(): void;
  start(): void;
  stop(): void;
  setVolume(volume: number): void;
  setPitch(pitch: TanpuraPitch): void;
}

export function useTanpuraDrone(): TanpuraDrone {
  const [active, setActive] = useState<boolean>(() => isTanpuraPlaying());
  const [volume, setVolume] = useState<number>(() => getTanpuraVolume());
  const [pitch, setPitch] = useState<TanpuraPitch>(() => getTanpuraPitch());

  useEffect(() => {
    const unsubPlaying = subscribeTanpura(setActive);
    const unsubSettings = subscribeTanpuraSettings((s) => {
      setVolume(s.volume);
      setPitch(s.pitch);
    });
    return () => {
      unsubPlaying();
      unsubSettings();
    };
  }, []);

  const start = useCallback(() => startTanpura(), []);
  const stop = useCallback(() => stopTanpura(), []);
  const toggle = useCallback(() => {
    if (isTanpuraPlaying()) stopTanpura();
    else startTanpura();
  }, []);
  const changeVolume = useCallback((v: number) => setTanpuraVolume(v), []);
  const changePitch = useCallback((p: TanpuraPitch) => setTanpuraPitch(p), []);

  return { active, volume, pitch, toggle, start, stop, setVolume: changeVolume, setPitch: changePitch };
}
