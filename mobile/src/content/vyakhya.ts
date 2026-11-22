/**
 * The website's Hindi व्याख्या, research notes and जीवन सूत्र for each verse.
 *
 * Together they are about 64 MB for the books the app bundles, too much to ship inside the app, so each
 * book's notes are fetched once from the website the first time one of its chapters is opened
 * (https://dharmagranth.dev/app-data/v1/parts/<id>.vyakhya.<hash>.json, listed in index.json; built by
 * scripts/build-app-data.mjs) and kept on the phone one chapter per file. After that they work offline.
 * The Gita's notes are about 0.6 MB to download. A newer version on the site replaces the copy quietly.
 * Nothing is sent but plain file requests: no account, no ids.
 */
import { Directory, File, Paths } from 'expo-file-system';
import { useEffect, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

import { APP_DATA, fetchIndex } from './downloads';

/** One verse's notes. `vd`, `rd`, `ld` mark a reviewed AI draft, labelled as on the website. */
export interface VyakhyaEntry {
  /** व्याख्या */
  v?: string;
  /** Research note (शोध टिप्पणी) */
  r?: string;
  /** जीवन सूत्र */
  l?: string;
  vd?: true;
  rd?: true;
  ld?: true;
}

export type ChapterVyakhya = Record<string, VyakhyaEntry>;

const root = () => new Directory(Paths.document, 'vyakhya');
const bookDir = (id: string) => new Directory(root(), id);

function scanInstalled(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const dir = root();
    if (!dir.exists) return out;
    for (const item of dir.list()) {
      if (!(item instanceof Directory)) continue;
      if (item.name.startsWith('.')) {
        item.delete();
        continue;
      }
      const meta = new File(item, 'meta.json');
      if (!meta.exists) continue;
      try {
        const m = JSON.parse(meta.textSync()) as { version?: unknown };
        if (typeof m.version === 'string') out[item.name] = m.version;
      } catch {}
    }
  } catch {
    // No document folder (web preview): nothing saved.
  }
  return out;
}

/** Book id → version on the phone. Changes when a book's notes arrive, so cards re-render. */
let installed: Record<string, string> = scanInstalled();
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
/** Books checked against the site this session, so a chapter change does not ask again. */
const checked = new Set<string>();
const inFlight = new Map<string, Promise<void>>();

const cache = new Map<string, ChapterVyakhya | null>();
/** The web preview has no document folder, so it keeps a fetched book in memory for the session. */
const memory = new Map<string, Record<string, ChapterVyakhya>>();

function read(id: string, chapter: number): ChapterVyakhya | null {
  if (!installed[id]) return null;
  const held = memory.get(id);
  if (held) return held[String(chapter)] ?? null;
  const key = `${id}:${chapter}`;
  if (cache.has(key)) return cache.get(key)!;
  let value: ChapterVyakhya | null = null;
  try {
    const file = new File(bookDir(id), `ch-${chapter}.json`);
    if (file.exists) value = JSON.parse(file.textSync()) as ChapterVyakhya;
  } catch {
    value = null;
  }
  cache.set(key, value);
  if (cache.size > 6) cache.delete(cache.keys().next().value!);
  return value;
}

async function update(id: string): Promise<void> {
  const index = await fetchIndex();
  const remote = index.commentary?.[id];
  if (!remote || installed[id] === remote.version) return;
  if (Platform.OS === 'web') {
    const res = await fetch(`${APP_DATA}${remote.file}`);
    const data = (await res.json()) as { id?: string; chapters?: Record<string, ChapterVyakhya> };
    if (data.id !== id || !data.chapters) return;
    memory.set(id, data.chapters);
    installed = { ...installed, [id]: remote.version };
    listeners.forEach((l) => l());
    return;
  }
  if (Paths.availableDiskSpace > 0 && Paths.availableDiskSpace < remote.bytes * 2 + 20 * 1024 * 1024) return;

  const target = new File(Paths.cache, `vyakhya-${id}.json`);
  const tmp = new Directory(root(), `.${id}.partial`);
  // rename() repoints `tmp` at the finished folder, so the clean-up below must not touch it once it is in place.
  let saved = false;
  try {
    await File.downloadFileAsync(`${APP_DATA}${remote.file}`, target, { idempotent: true });
    const data = JSON.parse(await target.text()) as { id?: string; chapters?: Record<string, ChapterVyakhya> };
    if (data.id !== id || !data.chapters) return;
    if (tmp.exists) tmp.delete();
    tmp.create({ intermediates: true });
    for (const [chapter, notes] of Object.entries(data.chapters)) {
      new File(tmp, `ch-${chapter}.json`).write(JSON.stringify(notes));
    }
    new File(tmp, 'meta.json').write(JSON.stringify({ version: remote.version, savedAt: new Date().toISOString() }));
    const final = bookDir(id);
    if (final.exists) final.delete();
    tmp.rename(id);
    saved = true;
    // Count the notes as on the phone only when they can really be read from their folder.
    if (!new File(bookDir(id), 'meta.json').exists) return;
    for (const key of [...cache.keys()]) if (key.startsWith(`${id}:`)) cache.delete(key);
    installed = { ...installed, [id]: remote.version };
    listeners.forEach((l) => l());
  } finally {
    try {
      if (target.exists) target.delete();
    } catch {}
    try {
      if (!saved && tmp.exists) tmp.delete();
    } catch {}
  }
}

/** Fetches (or refreshes) a book's notes in the background, at most once per app session. Offline is fine. */
export function ensureVyakhya(id: string): void {
  if (checked.has(id) || inFlight.has(id)) return;
  const job = update(id)
    .then(() => {
      checked.add(id);
    })
    .catch(() => {
      // Offline or the site is unreachable: try again the next time a chapter of this book opens.
    })
    .finally(() => inFlight.delete(id));
  inFlight.set(id, job);
}

/**
 * One chapter's notes, keyed by verse number as the reader shows it. Null until the book's notes are on
 * the phone (or when it has none). Asks the site for them the first time.
 */
export function useChapterVyakhya(id: string, chapter: number): ChapterVyakhya | null {
  const version = useSyncExternalStore(subscribe, () => installed[id], () => installed[id]);
  useEffect(() => {
    ensureVyakhya(id);
  }, [id]);
  return version ? read(id, chapter) : null;
}
