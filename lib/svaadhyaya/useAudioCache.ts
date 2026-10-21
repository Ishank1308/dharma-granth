'use client';

/**
 * Svaadhyaya Engine — offline audio cache (IndexedDB via idb-keyval).
 *
 * Cache-first fetch for recitation audio:
 *   1. `getAudioBuffer(url)` returns the cached ArrayBuffer when present.
 *   2. On a miss it fetches the network resource once, stores the full
 *      `ArrayBuffer` under the URL key, and returns it — so revisits and
 *      offline sessions play instantly from the local blob.
 *
 * Store: `dharmagranth-audio-cache` (object store `audio`). Everything degrades
 * gracefully when IndexedDB is unavailable (private mode etc.) — callers still
 * get a working fetch, just without persistence.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createStore, get as idbGet, set as idbSet, del as idbDel, keys as idbKeys } from 'idb-keyval';

export const AUDIO_CACHE_DB = 'dharmagranth-audio-cache';
export const AUDIO_CACHE_STORE = 'audio';

const store = typeof window !== 'undefined' ? createStore(AUDIO_CACHE_DB, AUDIO_CACHE_STORE) : null;

/** In-flight request dedupe: two plays of the same verse share one network fetch. */
const inflight = new Map<string, Promise<ArrayBuffer>>();

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

export async function fetchAudioBuffer(url: string): Promise<ArrayBuffer> {
  if (store) {
    try {
      const cached = await idbGet<ArrayBuffer>(url, store);
      if (cached && cached.byteLength > 0) return cached;
    } catch {
      /* fall through to network */
    }
  }

  let request = inflight.get(url);
  if (!request) {
    request = (async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Audio fetch failed: HTTP ${res.status} for ${url}`);
      return res.arrayBuffer();
    })();
    inflight.set(url, request);
    try {
      const buffer = await request;
      if (store) {
        try {
          await idbSet(url, buffer, store);
        } catch {
          /* quota / private mode — playback still works from the buffer */
        }
      }
      return buffer;
    } finally {
      inflight.delete(url);
    }
  }
  return request;
}

/** True when a non-empty recitation buffer for `url` is already stored offline. */
export async function isAudioCached(url: string): Promise<boolean> {
  if (!store) return false;
  try {
    const cached = await idbGet<ArrayBuffer>(url, store);
    return Boolean(cached && cached.byteLength > 0);
  } catch {
    return false;
  }
}

/** Remove one cached entry (e.g. after a corrupted download). */
export async function evictAudio(url: string): Promise<void> {
  if (!store) return;
  try {
    await idbDel(url, store);
  } catch {}
}

export async function clearAudioCache(): Promise<number> {
  if (!store) return 0;
  try {
    const allKeys = await idbKeys(store);
    await Promise.all(allKeys.map((k) => idbDel(k, store)));
    return allKeys.length;
  } catch {
    return 0;
  }
}

export interface AudioCacheStats {
  entries: number;
  bytes: number;
}

export async function audioCacheStats(): Promise<AudioCacheStats> {
  const empty: AudioCacheStats = { entries: 0, bytes: 0 };
  if (!store) return empty;
  try {
    const allKeys = await idbKeys(store);
    let bytes = 0;
    for (const key of allKeys) {
      const buf = await idbGet<ArrayBuffer>(String(key), store);
      if (buf) bytes += buf.byteLength;
    }
    return { entries: allKeys.length, bytes };
  } catch {
    return empty;
  }
}

export interface UseAudioCache {
  /** Cache-first fetch of a recitation resource. */
  getBuffer(url: string): Promise<ArrayBuffer>;
  /** Object URL for a buffer — revoke with `releaseObjectUrl`. */
  toObjectUrl(buffer: ArrayBuffer): string;
  releaseObjectUrl(url: string): void;
  evict(url: string): Promise<void>;
  clear(): Promise<number>;
  stats(): Promise<AudioCacheStats>;
}

/** Hook form — same functions, plus a ready flag for UI badges ("offline-ready"). */
export function useAudioCache(): UseAudioCache & { supported: boolean } {
  const objectUrls = useRef(new Set<string>());
  const [supported] = useState(() => typeof window !== 'undefined' && 'indexedDB' in window);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const toObjectUrl = useCallback((buffer: ArrayBuffer): string => {
    const url = URL.createObjectURL(new Blob([buffer]));
    objectUrls.current.add(url);
    return url;
  }, []);

  const releaseObjectUrl = useCallback((url: string) => {
    if (objectUrls.current.delete(url)) URL.revokeObjectURL(url);
  }, []);

  return {
    supported,
    getBuffer: fetchAudioBuffer,
    toObjectUrl,
    releaseObjectUrl,
    evict: evictAudio,
    clear: clearAudioCache,
    stats: audioCacheStats,
  };
}
