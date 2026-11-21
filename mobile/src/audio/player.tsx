// One shared player for verse recitation, so only one verse sounds at a time and
// "Listen to chapter" can move from verse to verse.
//
// Playback is foreground only: the app declares no background-playback service and
// no extra permissions beyond what expo-audio needs to play.
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { recitationKey, recitationSource } from './recitation';

export type RecitationPhase = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface Queue {
  id: string;
  chapter: number;
  verses: string[];
  index: number;
}

interface RecitationState {
  /** Key of the verse that is loaded, or null. */
  currentKey: string | null;
  phase: RecitationPhase;
  /** True while a whole chapter is queued (the player moves on to the next verse). */
  continuous: boolean;
  /** Play one verse, or toggle pause when it is the current one. */
  toggleVerse: (id: string, chapter: number, verse: string) => void;
  /** Play the listed verses in order, starting at `from` (default: the first). */
  playChapter: (id: string, chapter: number, verses: string[], from?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

const Ctx = createContext<RecitationState | null>(null);

export function RecitationProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const [queue, setQueue] = useState<Queue | null>(null);
  const queueRef = useRef<Queue | null>(null);
  const [wanted, setWanted] = useState(false);
  const [failed, setFailed] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    // Respect the phone's silent switch on iOS; let other apps duck rather than stop.
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'duckOthers', allowsRecording: false }).catch(() => {});
  }, []);

  const currentKey = queue ? recitationKey(queue.id, queue.chapter, queue.verses[queue.index]) : null;

  const load = useCallback(
    (q: Queue) => {
      queueRef.current = q;
      setQueue(q);
      setFailed(false);
      setWanted(true);
      startedAt.current = Date.now();
      player.replace(recitationSource(recitationKey(q.id, q.chapter, q.verses[q.index])));
      player.play();
    },
    [player],
  );

  // Move on (or stop) when a verse ends. A listener, not an effect on status, so a
  // finished verse is handled exactly once.
  useEffect(() => {
    const sub = player.addListener('playbackStatusUpdate', (s) => {
      if (!s.didJustFinish) return;
      const q = queueRef.current;
      if (q && q.verses.length > 1 && q.index < q.verses.length - 1) {
        load({ ...q, index: q.index + 1 });
      } else {
        setWanted(false);
        player.pause();
        player.seekTo(0).catch(() => {});
      }
    });
    return () => sub.remove();
  }, [player, load]);

  // A source that never loads (offline and not cached, or the file is missing) is an error, not a spinner forever.
  useEffect(() => {
    if (!wanted || status.isLoaded) return;
    const t = setTimeout(() => {
      if (!player.isLoaded) {
        setFailed(true);
        setWanted(false);
      }
    }, 15000);
    return () => clearTimeout(t);
  }, [wanted, status.isLoaded, player, currentKey]);

  const toggleVerse = useCallback(
    (id: string, chapter: number, verse: string) => {
      const key = recitationKey(id, chapter, verse);
      if (key === currentKey && !failed) {
        if (player.playing) {
          setWanted(false);
          player.pause();
        } else {
          setWanted(true);
          player.play();
        }
        return;
      }
      load({ id, chapter, verses: [verse], index: 0 });
    },
    [currentKey, failed, player, load],
  );

  const playChapter = useCallback(
    (id: string, chapter: number, verses: string[], from?: string) => {
      if (verses.length === 0) return;
      const start = from ? Math.max(0, verses.indexOf(from)) : 0;
      load({ id, chapter, verses, index: start });
    },
    [load],
  );

  const pause = useCallback(() => {
    setWanted(false);
    player.pause();
  }, [player]);

  const resume = useCallback(() => {
    if (!queue) return;
    if (failed) {
      load(queue);
      return;
    }
    setWanted(true);
    player.play();
  }, [player, queue, failed, load]);

  const stop = useCallback(() => {
    setWanted(false);
    player.pause();
    queueRef.current = null;
    setQueue(null);
    setFailed(false);
  }, [player]);

  const phase: RecitationPhase = !queue
    ? 'idle'
    : failed
      ? 'error'
      : status.playing
        ? status.isBuffering
          ? 'loading'
          : 'playing'
        : wanted
          ? 'loading'
          : 'paused';

  const value = useMemo<RecitationState>(
    () => ({
      currentKey,
      phase,
      continuous: !!queue && queue.verses.length > 1,
      toggleVerse,
      playChapter,
      pause,
      resume,
      stop,
    }),
    [currentKey, phase, queue, toggleVerse, playChapter, pause, resume, stop],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRecitation(): RecitationState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useRecitation must be used inside RecitationProvider');
  return v;
}
