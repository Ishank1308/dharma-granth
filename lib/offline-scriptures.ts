/**
 * Per-scripture offline copies, kept on the reader's own device.
 *
 * A saved scripture is its chapter shards (public/data/scriptures-full/<id>/ch-N.json) plus the exported chapter
 * pages, stored in CacheStorage under OFFLINE_CACHE. The service worker (public/sw.js) reads that cache when the
 * network is down. A small manifest in localStorage lists what is saved and how large it is.
 * Nothing is sent anywhere; removing a copy deletes its entries from the cache.
 */
export const OFFLINE_CACHE = 'dharma-offline-scriptures-v1';
export const OFFLINE_MANIFEST_KEY = 'dharma_offline_manifest';
/** Larger scriptures (epics, Puranas) would fill a phone's storage; they are not offered. */
export const MAX_OFFLINE_CHAPTERS = 80;

export interface OfflineEntry {
  title: string;
  savedAt: string;
  bytes: number;
  chapters: number;
}
export type OfflineManifest = Record<string, OfflineEntry>;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function offlineSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window;
}

export function readManifest(): OfflineManifest {
  try {
    const raw = localStorage.getItem(OFFLINE_MANIFEST_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};
    return parsed && typeof parsed === 'object' ? (parsed as OfflineManifest) : {};
  } catch {
    return {};
  }
}

function writeManifest(m: OfflineManifest) {
  try {
    localStorage.setItem(OFFLINE_MANIFEST_KEY, JSON.stringify(m));
    window.dispatchEvent(new Event('dharma-offline-changed'));
  } catch {
    // Storage blocked: the cache copy still works, the list just will not show it.
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function totalBytes(m: OfflineManifest): number {
  return Object.values(m).reduce((a, e) => a + e.bytes, 0);
}

/** Saves a scripture. Throws a readable Error when it is too large or the network fails part-way (nothing half-saved stays listed). */
export async function saveScripture(id: string, title: string, onProgress?: (done: number, total: number) => void): Promise<OfflineEntry> {
  if (!offlineSupported()) throw new Error('This browser cannot store offline copies.');
  const mres = await fetch(`${BASE}/data/scriptures-full/${id}/manifest.json`);
  if (!mres.ok) throw new Error('This text has no chapter files to save.');
  const manifest = (await mres.json()) as { chapters?: { number: number }[] };
  const chapters = (manifest.chapters ?? []).map((c) => c.number);
  if (chapters.length === 0) throw new Error('This text has no chapter files to save.');
  if (chapters.length > MAX_OFFLINE_CHAPTERS) {
    throw new Error(`This text has ${chapters.length} chapters; offline copies are limited to ${MAX_OFFLINE_CHAPTERS}.`);
  }

  const urls = [
    `${BASE}/data/scriptures-full/${id}/manifest.json`,
    `${BASE}/scripture/${id}/`,
    ...chapters.flatMap((n) => [`${BASE}/data/scriptures-full/${id}/ch-${n}.json`, `${BASE}/scripture/${id}/chapter/${n}/`]),
  ];
  const cache = await caches.open(OFFLINE_CACHE);
  let bytes = 0;
  let done = 0;
  const queue = [...urls];
  async function worker() {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const res = await fetch(url);
      // A chapter that was split into parts has no single page; its shard is what matters, so a missing page is fine.
      if (res.ok) {
        bytes += (await res.clone().blob()).size;
        await cache.put(url, res);
      } else if (!url.includes('/scripture/')) {
        throw new Error(`Could not fetch ${url} (${res.status}).`);
      }
      done++;
      onProgress?.(done, urls.length);
    }
  }
  try {
    await Promise.all([worker(), worker(), worker(), worker()]);
  } catch (error) {
    await Promise.all(urls.map((u) => cache.delete(u)));
    throw error instanceof Error ? error : new Error('Saving failed.');
  }

  const entry: OfflineEntry = { title, savedAt: new Date().toISOString(), bytes, chapters: chapters.length };
  writeManifest({ ...readManifest(), [id]: entry });
  return entry;
}

export async function removeScripture(id: string): Promise<void> {
  if (offlineSupported()) {
    const cache = await caches.open(OFFLINE_CACHE);
    for (const req of await cache.keys()) {
      const p = new URL(req.url).pathname;
      if (p.startsWith(`${BASE}/data/scriptures-full/${id}/`) || p.startsWith(`${BASE}/scripture/${id}/`)) await cache.delete(req);
    }
  }
  const m = readManifest();
  delete m[id];
  writeManifest(m);
}
