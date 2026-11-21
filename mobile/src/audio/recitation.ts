// Verse recitation audio.
//
// The audio is not bundled: each verse is one small MP3 on dharmagranth.dev
// (public/audio/<scripture>/<chapter>/<verse>.mp3 in the website repo), listed in
// recitations.json so the app only offers a play button where a file exists.
// A verse streams the first time it is played and is saved to the app's cache
// folder, so it plays offline afterwards. Nothing is sent anywhere: the request is
// a plain GET for a public file, with no account, id or analytics.
import { Directory, File, Paths } from 'expo-file-system';

import manifest from './recitations.json';

interface Manifest {
  base: string;
  credit: string;
  books: Record<string, Record<string, string[]>>;
}

const M = manifest as Manifest;

export const RECITATION_CREDIT = M.credit;

/** Stable key for one verse: "<scripture>/<chapter>/<verse>". */
export function recitationKey(id: string, chapter: number, verse: number | string): string {
  return `${id}/${chapter}/${String(verse)}`;
}

/** Verse numbers in this chapter that have recitation audio, in reading order. */
export function recitedVerses(id: string, chapter: number): string[] {
  return M.books[id]?.[String(chapter)] ?? [];
}

function remoteUrl(key: string): string {
  return `${M.base}${key}.mp3`;
}

function cacheDir(): Directory {
  return new Directory(Paths.cache, 'recitations');
}

function cacheFile(key: string): File {
  return new File(cacheDir(), `${key.replace(/\//g, '_')}.mp3`);
}

const inFlight = new Set<string>();

/**
 * The URI to play for a verse: the cached file when it is there, otherwise the
 * remote URL. A missing file is fetched into the cache in the background so the
 * next play is offline.
 */
export function recitationSource(key: string): string {
  try {
    const file = cacheFile(key);
    if (file.exists && file.size > 0) return file.uri;
    if (!inFlight.has(key)) {
      inFlight.add(key);
      const dir = cacheDir();
      if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
      File.downloadFileAsync(remoteUrl(key), file, { idempotent: true })
        .catch(() => {
          // A half-written file would be played next time; drop it.
          try {
            if (file.exists) file.delete();
          } catch {}
        })
        .finally(() => inFlight.delete(key));
    }
  } catch {
    // Cache folder unavailable (for example on web): stream only.
  }
  return remoteUrl(key);
}
