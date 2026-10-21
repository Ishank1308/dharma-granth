'use client';

/**
 * Svaadhyaya Engine — synchronized chanting playback.
 *
 * Drives verse recitation with 60 fps word tracking:
 *   - `requestAnimationFrame` loop synced to the HTMLAudioElement clock (or a
 *     monotonic clock for the speech-synthesis fallback)
 *   - per-verse `TimedWord[]` grids resolved from real aligned tracks when
 *     provided, else the built-in cadence estimator (`timing.ts`)
 *   - playback speed (0.75x / 1x / 1.25x), per-verse Kanthastha loop,
 *     auto-advance through the chapter
 *   - recitation audio is fetched through the IndexedDB cache
 *     (`useAudioCache`) so revisits/offline play instantly
 *
 * Exactly one source decides when a verse has finished, so a verse is never
 * advanced twice:
 *   - recorded audio → the `ended` event
 *   - speech synthesis → the utterance `onend`
 *   - silent cadence clock (no audio, no speech engine) → the rAF loop
 * Every verse start bumps a play token; callbacks from an older start
 * (a cancelled utterance, a slow fetch) are ignored.
 *
 * The hook never renders — it exposes state + controls and change callbacks
 * (`onVerseChange` powers auto-scroll in the virtualized stream).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { speakSanskritShloka, stopSanskritSpeech } from '@/lib/sacred-audio';
import { evictAudio, fetchAudioBuffer, isAudioCached } from './useAudioCache';
import { activeWordAt, resolveTrack } from './timing';
import type {
  AudioUrlResolver,
  ChantingControls,
  ChantingState,
  PlaybackSpeed,
  SvaadhyayaVerse,
  VerseTimingTrack,
} from './types';

export interface UseChantingPlaybackOptions {
  verses: SvaadhyayaVerse[];
  /** Pre-aligned studio tracks; when absent the cadence estimator is used. */
  tracks?: VerseTimingTrack[];
  /** Return a recitation URL per verse; omit to use speech synthesis. */
  audioResolver?: AudioUrlResolver;
  onVerseChange?(index: number): void;
  onWordChange?(verseIndex: number, wordIndex: number): void;
}

export interface UseChantingPlayback {
  state: ChantingState;
  controls: ChantingControls;
  /** Timing grid for a verse (for word-level rendering). */
  getTrack(index: number): VerseTimingTrack;
  /** True when recitation audio for a verse is already cached offline. */
  isCached(url: string): Promise<boolean>;
}

/** Which clock is driving the current verse. */
type ClockMode = 'audio' | 'speech' | 'silent';

const IDLE: ChantingState = {
  isPlaying: false,
  currentVerseIndex: 0,
  activeWordIndex: -1,
  verseProgress: 0,
  speed: 1,
  loopVerse: false,
  usingSpeech: false,
};

export function useChantingPlayback(options: UseChantingPlaybackOptions): UseChantingPlayback {
  const { verses, tracks, audioResolver, onVerseChange, onWordChange } = options;
  const [state, setState] = useState<ChantingState>(IDLE);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  /** Wall-clock run: verse time = elapsedBefore + (now - runStart) while playing. */
  const elapsedBeforeRef = useRef(0);
  const runStartRef = useRef(0);
  /** Live playback facts read by the rAF loop and async callbacks. */
  const liveRef = useRef({
    index: 0,
    playing: false,
    started: false,
    loop: false,
    mode: 'silent' as ClockMode,
    token: 0,
    speed: 1 as PlaybackSpeed,
  });

  // Latest props for callbacks that outlive a render.
  const propsRef = useRef({ verses, tracks, audioResolver, onVerseChange, onWordChange });
  propsRef.current = { verses, tracks, audioResolver, onVerseChange, onWordChange };

  const patchState = useCallback((patch: Partial<ChantingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  /**
   * Recorded audio runs on media time, so its estimated grid is unscaled
   * (playbackRate stretches it); wall-clock modes scale the grid by speed.
   */
  const trackFor = (index: number, mode: ClockMode, speed: PlaybackSpeed): VerseTimingTrack => {
    const { verses: vs, tracks: ts } = propsRef.current;
    return resolveTrack(vs[index], ts, mode === 'audio' ? 1 : speed);
  };

  const getTrack = useCallback(
    (index: number) => resolveTrack(verses[index], tracks, 1),
    [verses, tracks],
  );

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const releaseObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const clockMs = (): number => {
    const live = liveRef.current;
    if (live.mode === 'audio') return (audioRef.current?.currentTime ?? 0) * 1000;
    return elapsedBeforeRef.current + (live.playing ? performance.now() - runStartRef.current : 0);
  };

  /** Called once per verse by whichever clock owns it. */
  const finishVerse = (token: number) => {
    const live = liveRef.current;
    if (token !== live.token || !live.playing) return;
    if (live.loop) {
      // Kanthastha — begin the same verse again
      startVerse(live.index);
      return;
    }
    if (live.index < propsRef.current.verses.length - 1) {
      startVerse(live.index + 1);
    } else {
      stopRaf();
      liveRef.current = { ...live, playing: false, started: false };
      patchState({ isPlaying: false, activeWordIndex: -1, verseProgress: 1 });
    }
  };

  /** Word-tracking loop — 60 fps, state updates only on actual changes. */
  const tick = () => {
    const live = liveRef.current;
    if (!live.playing || !propsRef.current.verses[live.index]) return;
    const track = trackFor(live.index, live.mode, live.speed);
    const tMs = clockMs();

    if (live.mode === 'silent' && tMs >= track.durationMs) {
      finishVerse(live.token);
      return;
    }

    const clamped = Math.min(tMs, track.durationMs);
    const wordIdx = activeWordAt(track.words, clamped);
    const progress = Math.min(1, clamped / track.durationMs);
    setState((prev) => {
      if (prev.activeWordIndex === wordIdx && Math.abs(prev.verseProgress - progress) < 0.002) {
        return prev;
      }
      return { ...prev, activeWordIndex: wordIdx, verseProgress: progress };
    });
    if (wordIdx >= 0) propsRef.current.onWordChange?.(live.index, wordIdx);

    rafRef.current = requestAnimationFrame(tickRef.current);
  };
  const tickRef = useRef(tick);
  tickRef.current = tick;

  const startRaf = useCallback(() => {
    stopRaf();
    rafRef.current = requestAnimationFrame(tickRef.current);
  }, [stopRaf]);

  const beginWallClock = (verse: SvaadhyayaVerse, token: number) => {
    elapsedBeforeRef.current = 0;
    runStartRef.current = performance.now();
    const spoke = speakSanskritShloka(
      verse.sanskrit,
      0.8 * liveRef.current.speed,
      () => finishVerse(token),
      () => {
        // Engine refused mid-way — keep the silent clock running so the
        // highlighting still completes and the chapter advances.
        if (token === liveRef.current.token) liveRef.current.mode = 'silent';
      },
    );
    liveRef.current.mode = spoke ? 'speech' : 'silent';
    patchState({ usingSpeech: true });
    startRaf();
  };

  const startVerse = (index: number) => {
    const { verses: vs, audioResolver: resolver, onVerseChange: onChange } = propsRef.current;
    const verse = vs[index];
    if (!verse) return;
    stopRaf();
    stopSanskritSpeech();
    audioRef.current?.pause();
    releaseObjectUrl();

    const token = liveRef.current.token + 1;
    liveRef.current = { ...liveRef.current, index, playing: true, started: true, mode: 'silent', token };
    patchState({ isPlaying: true, currentVerseIndex: index, activeWordIndex: -1, verseProgress: 0 });
    onChange?.(index);

    const url = resolver?.(verse, index);
    if (!url) {
      beginWallClock(verse, token);
      return;
    }

    void (async () => {
      try {
        const buffer = await fetchAudioBuffer(url);
        // The reader may have moved on while the fetch was in flight.
        if (token !== liveRef.current.token || !liveRef.current.playing) return;
        const objectUrl = URL.createObjectURL(new Blob([buffer]));
        objectUrlRef.current = objectUrl;
        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.src = objectUrl;
        audio.playbackRate = liveRef.current.speed;
        audio.onended = () => finishVerse(token);
        audio.onerror = () => {
          if (token !== liveRef.current.token) return;
          // Corrupt cache entry — evict and fall back to speech
          void evictAudio(url);
          beginWallClock(verse, token);
        };
        liveRef.current.mode = 'audio';
        await audio.play();
        patchState({ usingSpeech: false });
        startRaf();
        // Warm the cache for the next verse while this one plays
        const next = vs[index + 1];
        const nextUrl = next ? resolver?.(next, index + 1) : null;
        if (nextUrl) void fetchAudioBuffer(nextUrl).catch(() => {});
      } catch {
        if (token === liveRef.current.token && liveRef.current.playing) beginWallClock(verse, token);
      }
    })();
  };
  const startVerseRef = useRef(startVerse);
  startVerseRef.current = startVerse;

  const pause = useCallback(() => {
    const live = liveRef.current;
    if (!live.playing) return;
    if (live.mode === 'audio') audioRef.current?.pause();
    else {
      elapsedBeforeRef.current += performance.now() - runStartRef.current;
      if (live.mode === 'speech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    }
    liveRef.current = { ...live, playing: false };
    stopRaf();
    patchState({ isPlaying: false });
  }, [patchState, stopRaf]);

  const resume = useCallback(() => {
    const live = liveRef.current;
    if (live.playing) return;
    if (!live.started) {
      // Nothing loaded yet (fresh mount or after stop) — start the current verse.
      startVerseRef.current(live.index);
      return;
    }
    liveRef.current = { ...live, playing: true };
    if (live.mode === 'audio') void audioRef.current?.play().catch(() => {});
    else {
      runStartRef.current = performance.now();
      if (live.mode === 'speech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
    }
    patchState({ isPlaying: true });
    startRaf();
  }, [patchState, startRaf]);

  const stop = useCallback(() => {
    liveRef.current = { ...liveRef.current, playing: false, started: false, token: liveRef.current.token + 1 };
    stopRaf();
    stopSanskritSpeech();
    audioRef.current?.pause();
    releaseObjectUrl();
    patchState({ isPlaying: false, activeWordIndex: -1, verseProgress: 0 });
  }, [patchState, stopRaf, releaseObjectUrl]);

  const controls: ChantingControls = useMemo(
    () => ({
      playVerse: (index: number) => startVerseRef.current(index),
      pause,
      resume,
      replay: () => startVerseRef.current(liveRef.current.index),
      stop,
      next: () => {
        const { index } = liveRef.current;
        if (index < propsRef.current.verses.length - 1) startVerseRef.current(index + 1);
      },
      previous: () => {
        const { index } = liveRef.current;
        if (index > 0) startVerseRef.current(index - 1);
      },
      setSpeed: (speed: PlaybackSpeed) => {
        const live = liveRef.current;
        liveRef.current = { ...live, speed };
        patchState({ speed });
        if (live.mode === 'audio') {
          if (audioRef.current) audioRef.current.playbackRate = speed;
        } else if (live.playing) {
          // Speech rate cannot be changed mid-utterance portably — restart the verse
          startVerseRef.current(live.index);
        }
      },
      toggleLoop: () => {
        const loop = !liveRef.current.loop;
        liveRef.current = { ...liveRef.current, loop };
        patchState({ loopVerse: loop });
      },
    }),
    [pause, resume, stop, patchState],
  );

  useEffect(() => {
    // Reset when the chapter changes
    stop();
    liveRef.current.index = 0;
    patchState({ currentVerseIndex: 0 });
  }, [verses, stop, patchState]);

  useEffect(
    () => () => {
      liveRef.current.token += 1;
      stopRaf();
      stopSanskritSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }
      releaseObjectUrl();
    },
    [stopRaf, releaseObjectUrl],
  );

  return { state, controls, getTrack, isCached: isAudioCached };
}
