/**
 * Svadhyaya journal and verse collections, as on the website (app/practice/journal, lib/verse-collections.ts).
 *
 * Everything stays on the phone (zero-account privacy) and travels in the same JSON backup file as saved
 * verses, under its own `journal` key. Pure functions only, with no imports, so the node tests can load this
 * file as it is.
 *
 * - A journal entry is a personal reflection, optionally linked to one or more verses, with a mood and tags.
 * - Collections sort saved verses (the bookmarks in @/lib/backup). A saved verse with no assignment is in
 *   Read Later, so nothing about existing saves had to be migrated.
 */

export type JournalMood = 'peaceful' | 'contemplative' | 'restless' | 'seeking' | 'grateful' | 'grief';

/** The website's six moods, in its order, with its emoji. Labels live in @/i18n/strings (S.mood). */
export const MOODS: { id: JournalMood; emoji: string }[] = [
  { id: 'peaceful', emoji: '🕊️' },
  { id: 'contemplative', emoji: '🧘' },
  { id: 'restless', emoji: '🌊' },
  { id: 'seeking', emoji: '🌱' },
  { id: 'grateful', emoji: '🙏' },
  { id: 'grief', emoji: '🌧️' },
];

export const DEFAULT_MOOD: JournalMood = 'contemplative';

/** A verse a reflection is about. The same three fields as a saved verse. */
export interface VerseLink {
  id: string;
  chapter: number;
  verse: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood?: JournalMood;
  refs: VerseLink[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VerseCollection {
  id: string;
  /** Empty for the five built-ins, whose names come from the interface language. */
  name: string;
  builtin: boolean;
}

export interface JournalData {
  entries: JournalEntry[];
  /** Custom collections only; the five built-ins are always there and are not stored. */
  collections: VerseCollection[];
  /** "<book>:<chapter>:<verse>" -> collection id. Verses in Read Later have no entry. */
  assign: Record<string, string>;
}

export const BUILTIN_COLLECTIONS = ['read-later', 'favourites', 'study-carefully', 'daily-reflection', 'share-later'] as const;
export type BuiltinCollection = (typeof BUILTIN_COLLECTIONS)[number];
export const DEFAULT_COLLECTION_ID: BuiltinCollection = 'read-later';

export const MAX_TITLE = 120;
export const MAX_BODY = 20000;
export const MAX_TAGS = 12;
export const MAX_TAG = 32;
export const MAX_COLLECTION_NAME = 40;
export const MAX_REFS = 12;

export const EMPTY_JOURNAL: JournalData = { entries: [], collections: [], assign: {} };

export function linkKey(v: VerseLink): string {
  return `${v.id}:${v.chapter}:${v.verse}`;
}

export function isBuiltin(id: string): id is BuiltinCollection {
  return (BUILTIN_COLLECTIONS as readonly string[]).includes(id);
}

/** Every collection, built-ins first. */
export function allCollections(data: JournalData): VerseCollection[] {
  return [...BUILTIN_COLLECTIONS.map((id) => ({ id, name: '', builtin: true })), ...data.collections];
}

const isMood = (m: unknown): m is JournalMood => MOODS.some((x) => x.id === m);
const iso = (raw: unknown, fallback: string) => (typeof raw === 'string' && !Number.isNaN(Date.parse(raw)) ? raw : fallback);

function cleanLinks(raw: unknown): VerseLink[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: VerseLink[] = [];
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue;
    const { id, chapter, verse } = r as Partial<VerseLink>;
    const ch = Number(chapter);
    if (typeof id !== 'string' || !id || !Number.isFinite(ch) || verse == null || verse === '') continue;
    const link = { id, chapter: ch, verse: String(verse) };
    if (seen.has(linkKey(link))) continue;
    seen.add(linkKey(link));
    out.push(link);
    if (out.length >= MAX_REFS) break;
  }
  return out;
}

/** Tags without the leading #, trimmed, de-duplicated (ignoring case). */
export function cleanTags(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(/[,#\n]/) : [];
  const out: string[] = [];
  for (const t of list) {
    if (typeof t !== 'string') continue;
    const tag = t.replace(/^#+/, '').trim().slice(0, MAX_TAG);
    if (tag && !out.some((x) => x.toLowerCase() === tag.toLowerCase())) out.push(tag);
    if (out.length >= MAX_TAGS) break;
  }
  return out;
}

export function normalizeEntry(raw: unknown): JournalEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const e = raw as Partial<JournalEntry>;
  if (typeof e.id !== 'string' || !e.id) return null;
  const title = typeof e.title === 'string' ? e.title.trim().slice(0, MAX_TITLE) : '';
  const body = typeof e.body === 'string' ? e.body.slice(0, MAX_BODY) : '';
  if (!title && !body.trim()) return null;
  const epoch = new Date(0).toISOString();
  const createdAt = iso(e.createdAt, epoch);
  return {
    id: e.id,
    title,
    body,
    mood: isMood(e.mood) ? e.mood : undefined,
    refs: cleanLinks(e.refs),
    tags: cleanTags(e.tags),
    createdAt,
    updatedAt: iso(e.updatedAt, createdAt),
  };
}

const KEY_RE = /^[A-Za-z0-9_-]+:\d+:[0-9A-Za-z._-]+$/;

/** Accepts anything read from storage or a backup and returns well-formed data. */
export function normalizeJournal(raw: unknown): JournalData {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_JOURNAL, assign: {} };
  const o = raw as Partial<Record<keyof JournalData, unknown>>;
  const entries: JournalEntry[] = [];
  const ids = new Set<string>();
  if (Array.isArray(o.entries)) {
    for (const r of o.entries) {
      const e = normalizeEntry(r);
      if (e && !ids.has(e.id)) {
        ids.add(e.id);
        entries.push(e);
      }
    }
  }
  entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const collections: VerseCollection[] = [];
  if (Array.isArray(o.collections)) {
    for (const c of o.collections) {
      if (!c || typeof c !== 'object') continue;
      const { id, name } = c as { id?: unknown; name?: unknown };
      if (typeof id !== 'string' || typeof name !== 'string' || !/^[a-z0-9-]{1,48}$/.test(id) || isBuiltin(id)) continue;
      const clean = name.trim().slice(0, MAX_COLLECTION_NAME);
      if (clean && !collections.some((x) => x.id === id)) collections.push({ id, name: clean, builtin: false });
    }
  }

  const known = new Set<string>([...BUILTIN_COLLECTIONS, ...collections.map((c) => c.id)]);
  const assign: Record<string, string> = {};
  if (o.assign && typeof o.assign === 'object') {
    for (const [k, v] of Object.entries(o.assign as Record<string, unknown>)) {
      if (typeof v === 'string' && v !== DEFAULT_COLLECTION_ID && known.has(v) && KEY_RE.test(k)) assign[k] = v;
    }
  }
  return { entries, collections, assign };
}

/**
 * Restoring a backup adds to what is on the phone and loses nothing: entries are matched by id and the
 * more recently edited copy wins; collections are joined; a verse already sorted on this phone stays where it is.
 */
export function mergeJournal(current: JournalData, incoming: JournalData): JournalData {
  const byId = new Map(current.entries.map((e) => [e.id, e]));
  for (const e of incoming.entries) {
    const mine = byId.get(e.id);
    if (!mine || e.updatedAt > mine.updatedAt) byId.set(e.id, e);
  }
  const collections = [...current.collections];
  const rename = new Map<string, string>();
  for (const c of incoming.collections) {
    if (collections.some((x) => x.id === c.id)) continue;
    // Same name, different id (made separately on two phones): fold into the one already here.
    const same = collections.find((x) => x.name.toLowerCase() === c.name.toLowerCase());
    if (same) rename.set(c.id, same.id);
    else collections.push(c);
  }
  const assign = { ...current.assign };
  for (const [k, v] of Object.entries(incoming.assign)) {
    if (!(k in assign)) assign[k] = rename.get(v) ?? v;
  }
  return normalizeJournal({ entries: [...byId.values()], collections, assign });
}

export function newId(prefix: string, now = Date.now()): string {
  return `${prefix}-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface EntryDraft {
  title: string;
  body: string;
  mood?: JournalMood;
  refs: VerseLink[];
  tags: string[] | string;
}

/** Adds a new entry or replaces the one with the same id. Returns the data unchanged for an empty draft. */
export function saveEntry(data: JournalData, draft: EntryDraft, id?: string, now = new Date()): { data: JournalData; id?: string } {
  const stamp = now.toISOString();
  const existing = id ? data.entries.find((e) => e.id === id) : undefined;
  const entry = normalizeEntry({
    id: existing?.id ?? newId('journal', now.getTime()),
    title: draft.title,
    body: draft.body,
    mood: draft.mood,
    refs: draft.refs,
    tags: draft.tags,
    createdAt: existing?.createdAt ?? stamp,
    updatedAt: stamp,
  });
  if (!entry) return { data };
  const entries = existing ? data.entries.map((e) => (e.id === entry.id ? entry : e)) : [entry, ...data.entries];
  return { data: { ...data, entries }, id: entry.id };
}

export function deleteEntry(data: JournalData, id: string): JournalData {
  return { ...data, entries: data.entries.filter((e) => e.id !== id) };
}

export function entriesForVerse(data: JournalData, v: VerseLink): JournalEntry[] {
  const key = linkKey(v);
  return data.entries.filter((e) => e.refs.some((r) => linkKey(r) === key));
}

export interface EntryFilter {
  query?: string;
  mood?: JournalMood;
  tag?: string;
}

const fold = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

export function filterEntries(entries: JournalEntry[], f: EntryFilter): JournalEntry[] {
  const q = fold((f.query ?? '').trim());
  const tag = f.tag?.toLowerCase();
  return entries.filter((e) => {
    if (f.mood && e.mood !== f.mood) return false;
    if (tag && !e.tags.some((t) => t.toLowerCase() === tag)) return false;
    if (!q) return true;
    return fold(`${e.title}\n${e.body}\n${e.tags.join(' ')}`).includes(q);
  });
}

/** Every tag in use, most used first. */
export function allTags(entries: JournalEntry[]): string[] {
  const counts = new Map<string, { tag: string; n: number }>();
  for (const e of entries) {
    for (const t of e.tags) {
      const k = t.toLowerCase();
      const c = counts.get(k);
      if (c) c.n += 1;
      else counts.set(k, { tag: t, n: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.n - a.n || a.tag.localeCompare(b.tag)).map((c) => c.tag);
}

// Collections

export function collectionOf(data: JournalData, v: VerseLink): string {
  return data.assign[linkKey(v)] ?? DEFAULT_COLLECTION_ID;
}

export type CollectionError = 'empty' | 'taken' | 'builtin' | 'missing';

/**
 * Names of the built-ins in both languages, so a new collection cannot take one of them. Kept here, not only
 * in strings.ts, so the rule works in tests.
 */
const BUILTIN_NAMES = [
  'read later', 'favourites', 'favorites', 'study carefully', 'daily reflection', 'share later',
  'बाद में पढ़ें', 'पसंदीदा', 'ध्यान से पढ़ें', 'रोज़ का चिन्तन', 'बाद में शेयर करें',
];

function nameTaken(data: JournalData, name: string, exceptId?: string): boolean {
  const n = name.toLowerCase();
  return BUILTIN_NAMES.includes(n) || data.collections.some((c) => c.id !== exceptId && c.name.toLowerCase() === n);
}

export function createCollection(data: JournalData, name: string, now = Date.now()): { data: JournalData; error?: CollectionError; id?: string } {
  const clean = name.trim().slice(0, MAX_COLLECTION_NAME);
  if (!clean) return { data, error: 'empty' };
  if (nameTaken(data, clean)) return { data, error: 'taken' };
  const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'collection';
  const id = `${slug}-${now.toString(36)}`;
  return { data: { ...data, collections: [...data.collections, { id, name: clean, builtin: false }] }, id };
}

export function renameCollection(data: JournalData, id: string, name: string): { data: JournalData; error?: CollectionError } {
  if (isBuiltin(id)) return { data, error: 'builtin' };
  if (!data.collections.some((c) => c.id === id)) return { data, error: 'missing' };
  const clean = name.trim().slice(0, MAX_COLLECTION_NAME);
  if (!clean) return { data, error: 'empty' };
  if (nameTaken(data, clean, id)) return { data, error: 'taken' };
  return { data: { ...data, collections: data.collections.map((c) => (c.id === id ? { ...c, name: clean } : c)) } };
}

/** Deleting a collection moves its verses back to Read Later; no saved verse is lost. */
export function deleteCollection(data: JournalData, id: string): { data: JournalData; error?: CollectionError } {
  if (isBuiltin(id)) return { data, error: 'builtin' };
  const assign: Record<string, string> = {};
  for (const [k, v] of Object.entries(data.assign)) if (v !== id) assign[k] = v;
  return { data: { ...data, collections: data.collections.filter((c) => c.id !== id), assign } };
}

export function moveVerse(data: JournalData, v: VerseLink, collectionId: string): JournalData {
  if (!isBuiltin(collectionId) && !data.collections.some((c) => c.id === collectionId)) return data;
  const assign = { ...data.assign };
  if (collectionId === DEFAULT_COLLECTION_ID) delete assign[linkKey(v)];
  else assign[linkKey(v)] = collectionId;
  return { ...data, assign };
}

/** Forget where a verse was sorted once it is no longer saved. */
export function dropVerse(data: JournalData, v: VerseLink): JournalData {
  const key = linkKey(v);
  if (!(key in data.assign)) return data;
  const assign = { ...data.assign };
  delete assign[key];
  return { ...data, assign };
}

/** How many of the given saved verses are in each collection. */
export function collectionCounts(data: JournalData, saved: VerseLink[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of saved) {
    const c = collectionOf(data, v);
    out[c] = (out[c] ?? 0) + 1;
  }
  return out;
}

/** "21 Nov 2026" or "21 नव॰ 2026", with Western digits as everywhere in the app. */
export function formatDay(iso: string, lang: 'en' | 'hi'): string {
  try {
    return new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      numberingSystem: 'latn',
    });
  } catch {
    return iso.slice(0, 10);
  }
}
