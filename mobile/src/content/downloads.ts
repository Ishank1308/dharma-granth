/**
 * On-demand downloads of the large texts (epics, Puranas, Rig and Atharva Veda) that are too big to ship
 * inside the app. The website build publishes them as static JSON (scripts/build-app-data.mjs):
 *
 *   https://dharmagranth.dev/app-data/v1/index.json   which books can be downloaded, their parts and sizes
 *   https://dharmagranth.dev/app-data/v1/parts/…      slices of a book's chapters, whole verses only
 *
 * A downloaded book is stored one chapter per file under the app's document folder, so opening a chapter
 * parses only that chapter. Nothing is sent to the server but plain file requests: no account, no ids.
 */
import { Directory, File, Paths } from 'expo-file-system';
import { useEffect, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';

import { DownloadError, downloadErrorCode, RETRY_DELAYS_MS, RETRYABLE, type DownloadErrorCode } from './download-errors';
import { forgetSearchIndex, SEARCH_DIR, SearchIndexWriter } from './download-index';
import type { BookChapter } from './types';

export { DownloadError, downloadErrorCode, type DownloadErrorCode } from './download-errors';

export const APP_DATA = 'https://dharmagranth.dev/app-data/v1/';
/** The part layout this app understands. The site bumps it only for a layout older apps cannot read. */
const FORMAT = 1;

export interface RemotePart {
  file: string;
  /** JSON size on the phone. */
  bytes: number;
  /** About what is transferred: the server compresses JSON. */
  gz: number;
}

export interface RemoteBook {
  version: string;
  bytes: number;
  gz: number;
  chapters: number;
  parts: RemotePart[];
}

interface RemoteIndex {
  format: number;
  books: Record<string, RemoteBook>;
}

export interface Installed {
  version: string;
  bytes: number;
  savedAt: string;
}

export interface Job {
  received: number;
  total: number;
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

export interface DownloadsState {
  installed: Record<string, Installed>;
  jobs: Record<string, Job>;
  errors: Record<string, DownloadErrorCode>;
  index: RemoteIndex | null;
  indexStatus: 'idle' | 'loading' | 'ready' | 'error';
}

const root = () => new Directory(Paths.document, 'downloads');
const bookDir = (id: string) => new Directory(root(), id);
/** The folder a downloaded book lives in (its chapters, meta.json and search index). */
export const downloadedBookDir = bookDir;
const partialDir = (id: string) => new Directory(root(), `.${id}.partial`);

function scanInstalled(): Record<string, Installed> {
  const out: Record<string, Installed> = {};
  try {
    const dir = root();
    if (!dir.exists) return out;
    for (const item of dir.list()) {
      if (!(item instanceof Directory)) continue;
      if (item.name.startsWith('.')) {
        // A download the app was closed in the middle of. Start clean next time.
        item.delete();
        continue;
      }
      const meta = new File(item, 'meta.json');
      if (!meta.exists) continue;
      try {
        const m = JSON.parse(meta.textSync()) as Installed;
        if (typeof m.version === 'string' && typeof m.bytes === 'number') out[item.name] = m;
      } catch {
        // Unreadable meta: treat the book as not downloaded.
      }
    }
  } catch {
    // No document folder (web preview): nothing downloaded.
  }
  return out;
}

let state: DownloadsState = { installed: scanInstalled(), jobs: {}, errors: {}, index: null, indexStatus: 'idle' };
const listeners = new Set<() => void>();
const controllers = new Map<string, AbortController>();

function set(patch: Partial<DownloadsState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDownloads(): DownloadsState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/**
 * Loads the list of downloadable books once per app session, and again after a failure: on the next
 * screen that asks, or when the app comes back to the front (the reader may have turned data on).
 */
export function useRemoteIndex(): void {
  useEffect(() => {
    const retry = () => {
      if (state.indexStatus === 'idle' || state.indexStatus === 'error') fetchIndex().catch(() => {});
    };
    retry();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') retry();
    });
    return () => sub.remove();
  }, []);
}

export async function fetchIndex(): Promise<RemoteIndex> {
  if (state.index) return state.index;
  set({ indexStatus: 'loading' });
  try {
    let res: Response;
    try {
      res = await fetch(`${APP_DATA}index.json`, { headers: { 'Cache-Control': 'no-cache' } });
    } catch {
      throw new DownloadError('offline');
    }
    if (!res.ok) throw new DownloadError('server');
    let index: RemoteIndex;
    try {
      index = (await res.json()) as RemoteIndex;
    } catch {
      throw new DownloadError('damaged');
    }
    if (index.format !== FORMAT || !index.books) throw new DownloadError('update');
    set({ index, indexStatus: 'ready' });
    return index;
  } catch (e) {
    set({ indexStatus: 'error' });
    throw e;
  }
}

export function isDownloaded(id: string): boolean {
  return Boolean(state.installed[id]);
}

// The last few chapters read, so paging back and forth does not re-read the file.
const chapterCache = new Map<string, BookChapter>();

/** A chapter of a downloaded book, read from the phone. Undefined when the book is not downloaded. */
export function readDownloadedChapter(id: string, chapter: number): BookChapter | undefined {
  if (!state.installed[id]) return undefined;
  const key = `${id}:${chapter}`;
  const hit = chapterCache.get(key);
  if (hit) return hit;
  try {
    const file = new File(bookDir(id), `ch-${chapter}.json`);
    if (!file.exists) return undefined;
    const parsed = JSON.parse(file.textSync()) as BookChapter;
    chapterCache.set(key, parsed);
    if (chapterCache.size > 4) chapterCache.delete(chapterCache.keys().next().value!);
    return parsed;
  } catch {
    return undefined;
  }
}

function forget(id: string) {
  forgetSearchIndex(id);
  for (const key of [...chapterCache.keys()]) if (key.startsWith(`${id}:`)) chapterCache.delete(key);
}

function without<T>(record: Record<string, T>, id: string): Record<string, T> {
  const next = { ...record };
  delete next[id];
  return next;
}

/** Downloads (or updates) a book. Progress and errors show up in useDownloads(). */
export async function startDownload(id: string): Promise<void> {
  if (controllers.has(id)) return;
  const controller = new AbortController();
  controllers.set(id, controller);
  set({ errors: without(state.errors, id), jobs: { ...state.jobs, [id]: { received: 0, total: 0 } } });

  const tmp = partialDir(id);
  const partFiles: File[] = [];
  try {
    const index = await fetchIndex();
    const remote = index.books[id];
    if (!remote) throw new DownloadError('unavailable');
    const current = state.installed[id]?.bytes ?? 0;
    // The search index built alongside takes about a third as much again.
    const needed = Math.round(remote.bytes * 1.35);
    if (Paths.availableDiskSpace > 0 && Paths.availableDiskSpace < needed - current + 20 * 1024 * 1024) {
      throw new DownloadError('space');
    }
    set({ jobs: { ...state.jobs, [id]: { received: 0, total: remote.bytes } } });

    if (tmp.exists) tmp.delete();
    tmp.create({ intermediates: true });

    let done = 0;
    let lastEmit = 0;
    let written = 0;
    // A chapter split across parts is held here until its last piece arrives. Verses are never cut.
    let pending: BookChapter | null = null;
    // The verse search index is folded chapter by chapter as the book arrives (src/content/download-index.ts).
    const indexer = new SearchIndexWriter(new Directory(tmp, SEARCH_DIR));
    const writeChapter = async (ch: BookChapter) => {
      new File(tmp, `ch-${ch.number}.json`).write(JSON.stringify(ch));
      written++;
      await indexer.addChapter(ch);
    };

    for (let n = 0; n < remote.parts.length; n++) {
      const part = remote.parts[n];
      const target = new File(Paths.cache, `dl-${id}-${n}.json`);
      partFiles.push(target);
      // Each part is tried up to three times, so one dropped connection on mobile data does not throw
      // away the parts already saved. Parts are content-hashed, so a retry can never mix two editions.
      let slice: { id: string; chapters: BookChapter[] } | undefined;
      for (let attempt = 0; !slice; attempt++) {
        try {
          await File.downloadFileAsync(`${APP_DATA}${part.file}`, target, {
            idempotent: true,
            signal: controller.signal,
            onProgress: ({ bytesWritten }) => {
              const received = Math.min(remote.bytes, done + bytesWritten);
              if (received - lastEmit < remote.bytes / 200) return;
              lastEmit = received;
              set({ jobs: { ...state.jobs, [id]: { received, total: remote.bytes } } });
            },
          });
          if (controller.signal.aborted) throw new Error('Cancelled');
          let parsed: { id: string; chapters: BookChapter[] };
          try {
            parsed = JSON.parse(await target.text()) as { id: string; chapters: BookChapter[] };
          } catch {
            throw new DownloadError('damaged');
          }
          if (parsed.id !== id || !Array.isArray(parsed.chapters)) throw new DownloadError('damaged');
          slice = parsed;
        } catch (e) {
          if (controller.signal.aborted) throw e;
          const code = downloadErrorCode(e);
          if (!RETRYABLE.has(code) || attempt >= RETRY_DELAYS_MS.length) throw new DownloadError(code);
          try {
            if (target.exists) target.delete();
          } catch {}
          lastEmit = done;
          await wait(RETRY_DELAYS_MS[attempt], controller.signal);
          if (controller.signal.aborted) throw new Error('Cancelled');
        }
      }
      target.delete();
      for (const piece of slice.chapters) {
        if (pending && pending.number === piece.number) {
          pending.verses.push(...piece.verses);
          continue;
        }
        if (pending) await writeChapter(pending);
        if (controller.signal.aborted) throw new Error('Cancelled');
        pending = { number: piece.number, verses: [...piece.verses] };
      }
      done += part.bytes;
      lastEmit = done;
      set({ jobs: { ...state.jobs, [id]: { received: done, total: remote.bytes } } });
    }
    if (pending) await writeChapter(pending);
    if (controller.signal.aborted) throw new Error('Cancelled');
    if (written !== remote.chapters) throw new DownloadError('incomplete');
    const indexBytes = indexer.finish();

    const meta: Installed = { version: remote.version, bytes: remote.bytes + indexBytes, savedAt: new Date().toISOString() };
    new File(tmp, 'meta.json').write(JSON.stringify(meta));
    const final = bookDir(id);
    if (final.exists) final.delete();
    tmp.rename(id);
    forget(id);
    set({ installed: { ...state.installed, [id]: meta } });
  } catch (e) {
    const cancelled = controller.signal.aborted || (e instanceof Error && e.name === 'AbortError');
    if (!cancelled) set({ errors: { ...state.errors, [id]: downloadErrorCode(e) } });
  } finally {
    for (const f of partFiles) {
      try {
        if (f.exists) f.delete();
      } catch {}
    }
    try {
      if (tmp.exists) tmp.delete();
    } catch {}
    controllers.delete(id);
    set({ jobs: without(state.jobs, id) });
  }
}

export function cancelDownload(id: string): void {
  controllers.get(id)?.abort();
}

export function deleteDownload(id: string): void {
  cancelDownload(id);
  try {
    const dir = bookDir(id);
    if (dir.exists) dir.delete();
  } catch {}
  forget(id);
  set({ installed: without(state.installed, id), errors: without(state.errors, id) });
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  if (bytes >= 10 * 1024 * 1024) return `${Math.round(bytes / 1024 / 1024)} MB`;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
