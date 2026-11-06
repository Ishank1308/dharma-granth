/**
 * Verse Audio Resolution & Timing Engine
 *
 * Supports high-fidelity ElevenLabs neural recitation assets with:
 * - Deterministic pathing: /audio/verses/{scriptureId}/{chapterId}/{verseNumber}.mp3
 * - Word-level force-aligned timing tracks: /audio/verses/{scriptureId}/{chapterId}/{verseNumber}.json
 * - Pre-registered static audio manifest for zero-latency lookups without 404 network waterfalls
 * - Integration with IndexedDB offline audio cache (dharmagranth-audio-cache)
 * - Graceful fallback to Web Speech Synthesis when audio files are not yet generated
 */

import type { VerseTimingTrack, TimedWord } from './svaadhyaya/types';

export interface VerseAudioMetadata {
  scriptureId: string;
  chapterId: number | string;
  verseNumber: number | string;
  audioUrl: string;
  timingUrl?: string;
  durationMs?: number;
  engine: 'elevenlabs' | 'studio' | 'synthetic';
  voiceId?: string;
  language?: 'sa' | 'hi' | 'en';
}

/** Pre-computed manifest of verses with available studio / ElevenLabs neural recitation */
export const VERSE_AUDIO_REGISTRY: Record<string, VerseAudioMetadata> = {
  'bhagavadgita/2/47': {
    scriptureId: 'bhagavadgita',
    chapterId: 2,
    verseNumber: 47,
    audioUrl: '/audio/verses/bhagavadgita/2/47.mp3',
    timingUrl: '/audio/verses/bhagavadgita/2/47.json',
    durationMs: 6873,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/2/62': {
    scriptureId: 'bhagavadgita',
    chapterId: 2,
    verseNumber: 62,
    audioUrl: '/audio/verses/bhagavadgita/2/62.mp3',
    timingUrl: '/audio/verses/bhagavadgita/2/62.json',
    durationMs: 6548,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/2/63': {
    scriptureId: 'bhagavadgita',
    chapterId: 2,
    verseNumber: 63,
    audioUrl: '/audio/verses/bhagavadgita/2/63.mp3',
    timingUrl: '/audio/verses/bhagavadgita/2/63.json',
    durationMs: 7523,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/4/7': {
    scriptureId: 'bhagavadgita',
    chapterId: 4,
    verseNumber: 7,
    audioUrl: '/audio/verses/bhagavadgita/4/7.mp3',
    timingUrl: '/audio/verses/bhagavadgita/4/7.json',
    durationMs: 6177,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/4/8': {
    scriptureId: 'bhagavadgita',
    chapterId: 4,
    verseNumber: 8,
    audioUrl: '/audio/verses/bhagavadgita/4/8.mp3',
    timingUrl: '/audio/verses/bhagavadgita/4/8.json',
    durationMs: 6594,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/18/66': {
    scriptureId: 'bhagavadgita',
    chapterId: 18,
    verseNumber: 66,
    audioUrl: '/audio/verses/bhagavadgita/18/66.mp3',
    timingUrl: '/audio/verses/bhagavadgita/18/66.json',
    durationMs: 7245,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/9/22': {
    scriptureId: 'bhagavadgita',
    chapterId: 9,
    verseNumber: 22,
    audioUrl: '/audio/verses/bhagavadgita/9/22.mp3',
    timingUrl: '/audio/verses/bhagavadgita/9/22.json',
    durationMs: 8638,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/12/15': {
    scriptureId: 'bhagavadgita',
    chapterId: 12,
    verseNumber: 15,
    audioUrl: '/audio/verses/bhagavadgita/12/15.mp3',
    timingUrl: '/audio/verses/bhagavadgita/12/15.json',
    durationMs: 8963,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'ishavasya/1/1': {
    scriptureId: 'ishavasya',
    chapterId: 1,
    verseNumber: 1,
    audioUrl: '/audio/verses/ishavasya/1/1.mp3',
    timingUrl: '/audio/verses/ishavasya/1/1.json',
    durationMs: 8963,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'yogasutra/1/1': {
    scriptureId: 'yogasutra',
    chapterId: 1,
    verseNumber: 1,
    audioUrl: '/audio/verses/yogasutra/1/1.mp3',
    timingUrl: '/audio/verses/yogasutra/1/1.json',
    durationMs: 1579,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'yogasutra/1/2': {
    scriptureId: 'yogasutra',
    chapterId: 1,
    verseNumber: 2,
    audioUrl: '/audio/verses/yogasutra/1/2.mp3',
    timingUrl: '/audio/verses/yogasutra/1/2.json',
    durationMs: 2322,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/2/20': {
    scriptureId: 'bhagavadgita',
    chapterId: 2,
    verseNumber: 20,
    audioUrl: '/audio/verses/bhagavadgita/2/20.mp3',
    timingUrl: '/audio/verses/bhagavadgita/2/20.json',
    durationMs: 10867,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'bhagavadgita/11/32': {
    scriptureId: 'bhagavadgita',
    chapterId: 11,
    verseNumber: 32,
    audioUrl: '/audio/verses/bhagavadgita/11/32.mp3',
    timingUrl: '/audio/verses/bhagavadgita/11/32.json',
    durationMs: 13653,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'katha/2/1': {
    scriptureId: 'katha',
    chapterId: 2,
    verseNumber: 1,
    audioUrl: '/audio/verses/katha/2/1.mp3',
    timingUrl: '/audio/verses/katha/2/1.json',
    durationMs: 13468,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'katha/2/2': {
    scriptureId: 'katha',
    chapterId: 2,
    verseNumber: 2,
    audioUrl: '/audio/verses/katha/2/2.mp3',
    timingUrl: '/audio/verses/katha/2/2.json',
    durationMs: 14303,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'mandukya/1/1': {
    scriptureId: 'mandukya',
    chapterId: 1,
    verseNumber: 1,
    audioUrl: '/audio/verses/mandukya/1/1.mp3',
    timingUrl: '/audio/verses/mandukya/1/1.json',
    durationMs: 11889,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'mandukya/1/2': {
    scriptureId: 'mandukya',
    chapterId: 1,
    verseNumber: 2,
    audioUrl: '/audio/verses/mandukya/1/2.mp3',
    timingUrl: '/audio/verses/mandukya/1/2.json',
    durationMs: 6687,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'naradabhaktisutra/1/1': {
    scriptureId: 'naradabhaktisutra',
    chapterId: 1,
    verseNumber: 1,
    audioUrl: '/audio/verses/naradabhaktisutra/1/1.mp3',
    timingUrl: '/audio/verses/naradabhaktisutra/1/1.json',
    durationMs: 2229,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'naradabhaktisutra/1/2': {
    scriptureId: 'naradabhaktisutra',
    chapterId: 1,
    verseNumber: 2,
    audioUrl: '/audio/verses/naradabhaktisutra/1/2.mp3',
    timingUrl: '/audio/verses/naradabhaktisutra/1/2.json',
    durationMs: 2043,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'naradabhaktisutra/1/3': {
    scriptureId: 'naradabhaktisutra',
    chapterId: 1,
    verseNumber: 3,
    audioUrl: '/audio/verses/naradabhaktisutra/1/3.mp3',
    timingUrl: '/audio/verses/naradabhaktisutra/1/3.json',
    durationMs: 1997,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
  'rigveda/10/129.1': {
    scriptureId: 'rigveda',
    chapterId: 10,
    verseNumber: '129.1',
    audioUrl: '/audio/verses/rigveda/10/129.1.mp3',
    timingUrl: '/audio/verses/rigveda/10/129.1.json',
    durationMs: 10728,
    engine: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    language: 'sa',
  },
};

/** Normalizes scripture, chapter, and verse keys for manifest lookups */
export function getVerseKey(
  scriptureId: string,
  chapterId: number | string,
  verseNumber: number | string
): string {
  return `${scriptureId.toLowerCase()}/${chapterId}/${verseNumber}`;
}

/** Standard URL path for a verse audio file */
export function getVerseAudioUrl(
  scriptureId: string,
  chapterId: number | string,
  verseNumber: number | string
): string {
  const key = getVerseKey(scriptureId, chapterId, verseNumber);
  const registered = VERSE_AUDIO_REGISTRY[key];
  if (registered) return registered.audioUrl;
  return `/audio/verses/${scriptureId.toLowerCase()}/${chapterId}/${verseNumber}.mp3`;
}

/** Standard URL path for a verse timing track JSON */
export function getVerseTimingUrl(
  scriptureId: string,
  chapterId: number | string,
  verseNumber: number | string
): string {
  const key = getVerseKey(scriptureId, chapterId, verseNumber);
  const registered = VERSE_AUDIO_REGISTRY[key];
  if (registered?.timingUrl) return registered.timingUrl;
  return `/audio/verses/${scriptureId.toLowerCase()}/${chapterId}/${verseNumber}.json`;
}

/**
 * Checks if high-fidelity recorded neural audio exists for this verse.
 * Checks in-memory registry first, and optionally allows runtime probing.
 */
export function hasRecordedVerseAudio(
  scriptureId?: string,
  chapterId?: number | string,
  verseNumber?: number | string
): boolean {
  if (!scriptureId || chapterId == null || verseNumber == null) return false;
  const key = getVerseKey(scriptureId, chapterId, verseNumber);
  return Boolean(VERSE_AUDIO_REGISTRY[key]);
}

export const DHARMA_AUDIO_CACHE_NAME = 'dharma-audio-cache-v1';

/**
 * Returns the CacheStorage instance if supported in the current environment.
 */
export async function getAudioCache(): Promise<Cache | null> {
  if (typeof window === 'undefined' || !('caches' in window)) return null;
  try {
    return await window.caches.open(DHARMA_AUDIO_CACHE_NAME);
  } catch {
    return null;
  }
}

/**
 * Checks if a specific verse audio file is already stored in the offline cache.
 */
export async function isVerseAudioCached(
  scriptureId: string,
  chapterId: number | string,
  verseNumber: number | string
): Promise<boolean> {
  const cache = await getAudioCache();
  if (!cache) return false;
  try {
    const audioUrl = getVerseAudioUrl(scriptureId, chapterId, verseNumber);
    const match = await cache.match(audioUrl);
    return Boolean(match);
  } catch {
    return false;
  }
}

/**
 * Prefetches and stores both audio (.mp3) and timing track (.json) in the offline cache.
 * Designed for gapless continuous parayana transitions and full offline capability.
 */
export async function prefetchVerseAudio(
  scriptureId: string,
  chapterId: number | string,
  verseNumber: number | string
): Promise<boolean> {
  const cache = await getAudioCache();
  if (!cache) return false;

  const audioUrl = getVerseAudioUrl(scriptureId, chapterId, verseNumber);
  const timingUrl = getVerseTimingUrl(scriptureId, chapterId, verseNumber);

  try {
    const [audioMatch, timingMatch] = await Promise.all([
      cache.match(audioUrl),
      cache.match(timingUrl),
    ]);

    const tasks: Promise<unknown>[] = [];

    if (!audioMatch) {
      tasks.push(
        fetch(audioUrl)
          .then((res) => {
            if (res.ok) return cache.put(audioUrl, res);
          })
          .catch(() => {})
      );
    }

    if (!timingMatch) {
      tasks.push(
        fetch(timingUrl)
          .then((res) => {
            if (res.ok) return cache.put(timingUrl, res);
          })
          .catch(() => {})
      );
    }

    if (tasks.length > 0) {
      await Promise.all(tasks);
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves a local offline blob URL for the verse audio if available in cache.
 */
export async function getOfflineVerseAudioUrl(
  scriptureId: string,
  chapterId: number | string,
  verseNumber: number | string
): Promise<string | null> {
  const cache = await getAudioCache();
  if (!cache) return null;

  try {
    const audioUrl = getVerseAudioUrl(scriptureId, chapterId, verseNumber);
    const match = await cache.match(audioUrl);
    if (!match) return null;
    const blob = await match.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

/**
 * Revokes a previously created offline blob URL to prevent memory leaks.
 */
export function revokeOfflineVerseAudioUrl(blobUrl: string): void {
  if (typeof window !== 'undefined' && blobUrl.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(blobUrl);
    } catch {}
  }
}

/**
 * Loads the word-level timing track for a verse (if available).
 * Resolves from offline CacheStorage first for zero latency.
 */
export async function loadVerseTimingTrack(
  scriptureId: string,
  chapterId: number | string,
  verseNumber: number | string
): Promise<VerseTimingTrack | null> {
  const timingUrl = getVerseTimingUrl(scriptureId, chapterId, verseNumber);
  const cache = await getAudioCache();

  try {
    let res: Response | undefined;
    if (cache) {
      const match = await cache.match(timingUrl);
      if (match) res = match;
    }

    if (!res) {
      res = await fetch(timingUrl, { cache: 'force-cache' });
      if (res.ok && cache) {
        cache.put(timingUrl, res.clone()).catch(() => {});
      }
    }

    if (!res || !res.ok) return null;
    const data = await res.json();
    if (data && Array.isArray(data.words)) {
      return data as VerseTimingTrack;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Registers an audio file into the local registry at runtime.
 */
export function registerVerseAudio(metadata: VerseAudioMetadata): void {
  const key = getVerseKey(metadata.scriptureId, metadata.chapterId, metadata.verseNumber);
  VERSE_AUDIO_REGISTRY[key] = metadata;
}
