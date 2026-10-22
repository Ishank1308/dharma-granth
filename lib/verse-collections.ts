/**
 * Collections for saved verses. Saved verses themselves stay in
 * `dharma.bookmarkedVerses`; this module only records which collection each
 * one belongs to, so nothing about existing saves has to be migrated. A saved
 * verse with no assignment is in Read Later. Private notes are stored apart
 * (`dharma.notes`) and are never part of a collection export unless asked for.
 */

export const COLLECTIONS_KEY = 'dharma.verseCollections.v1';
export const COLLECTIONS_EXPORT_FORMAT = 'dharma-granth-saved-verses';

export interface VerseCollection {
  id: string;
  name: string;
  builtin: boolean;
}

export interface CollectionsState {
  version: 1;
  collections: VerseCollection[];
  /** "<scripture>:<chapter>:<verse>" -> collection id */
  assign: Record<string, string>;
}

export const DEFAULT_COLLECTIONS: VerseCollection[] = [
  { id: 'read-later', name: 'Read Later', builtin: true },
  { id: 'favourites', name: 'Favourites', builtin: true },
  { id: 'study-carefully', name: 'Study Carefully', builtin: true },
  { id: 'daily-reflection', name: 'Daily Reflection', builtin: true },
  { id: 'share-later', name: 'Share Later', builtin: true },
];

export const DEFAULT_COLLECTION_ID = 'read-later';
export const MAX_NAME = 40;

export interface VerseRef {
  scriptureId: string;
  chapterId?: number;
  verseId: number | string;
}

export const verseKey = (v: VerseRef): string => `${v.scriptureId}:${v.chapterId ?? 1}:${v.verseId}`;

export function emptyState(): CollectionsState {
  return { version: 1, collections: DEFAULT_COLLECTIONS.map((c) => ({ ...c })), assign: {} };
}

/** Accepts anything read from storage or a file and returns a well-formed state; built-ins are always present. */
export function sanitize(raw: unknown): CollectionsState {
  const base = emptyState();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as { collections?: unknown; assign?: unknown };
  const custom: VerseCollection[] = [];
  if (Array.isArray(o.collections)) {
    for (const c of o.collections) {
      if (!c || typeof c !== 'object') continue;
      const { id, name } = c as { id?: unknown; name?: unknown };
      if (typeof id !== 'string' || typeof name !== 'string' || !/^[a-z0-9-]{1,48}$/.test(id)) continue;
      const clean = name.trim().slice(0, MAX_NAME);
      if (!clean) continue;
      // The five built-ins are always present with fixed names, so a stored copy is ignored.
      if (!base.collections.some((b) => b.id === id) && !custom.some((x) => x.id === id)) custom.push({ id, name: clean, builtin: false });
    }
  }
  const collections = [...base.collections, ...custom];
  const assign: Record<string, string> = {};
  if (o.assign && typeof o.assign === 'object') {
    for (const [k, v] of Object.entries(o.assign as Record<string, unknown>)) {
      if (typeof v === 'string' && collections.some((c) => c.id === v) && /^[A-Za-z0-9-]+:\d+:[0-9A-Za-z.-]+$/.test(k)) assign[k] = v;
    }
  }
  return { version: 1, collections, assign };
}

export function collectionOf(state: CollectionsState, v: VerseRef): string {
  return state.assign[verseKey(v)] ?? DEFAULT_COLLECTION_ID;
}

const nameTaken = (state: CollectionsState, name: string, exceptId?: string) =>
  state.collections.some((c) => c.id !== exceptId && c.name.toLowerCase() === name.toLowerCase());

export function createCollection(state: CollectionsState, name: string): { state: CollectionsState; error?: string; id?: string } {
  const clean = name.trim().slice(0, MAX_NAME);
  if (!clean) return { state, error: 'Give the collection a name.' };
  if (nameTaken(state, clean)) return { state, error: 'A collection with that name already exists.' };
  const id = `${clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'collection'}-${Date.now().toString(36)}`;
  return { state: { ...state, collections: [...state.collections, { id, name: clean, builtin: false }] }, id };
}

export function renameCollection(state: CollectionsState, id: string, name: string): { state: CollectionsState; error?: string } {
  const target = state.collections.find((c) => c.id === id);
  if (!target) return { state, error: 'That collection no longer exists.' };
  if (target.builtin) return { state, error: 'The five starting collections keep their names.' };
  const clean = name.trim().slice(0, MAX_NAME);
  if (!clean) return { state, error: 'Give the collection a name.' };
  if (nameTaken(state, clean, id)) return { state, error: 'A collection with that name already exists.' };
  return { state: { ...state, collections: state.collections.map((c) => (c.id === id ? { ...c, name: clean } : c)) } };
}

/** Deleting a collection moves its verses to Read Later; no saved verse is lost. */
export function deleteCollection(state: CollectionsState, id: string): { state: CollectionsState; error?: string } {
  const target = state.collections.find((c) => c.id === id);
  if (!target) return { state };
  if (target.builtin) return { state, error: 'The five starting collections cannot be deleted.' };
  const assign: Record<string, string> = {};
  for (const [k, v] of Object.entries(state.assign)) if (v !== id) assign[k] = v;
  return { state: { ...state, collections: state.collections.filter((c) => c.id !== id), assign } };
}

export function moveVerse(state: CollectionsState, v: VerseRef, collectionId: string): CollectionsState {
  if (!state.collections.some((c) => c.id === collectionId)) return state;
  const assign = { ...state.assign };
  if (collectionId === DEFAULT_COLLECTION_ID) delete assign[verseKey(v)];
  else assign[verseKey(v)] = collectionId;
  return { ...state, assign };
}

/** Forget the assignment of a verse that is no longer saved. */
export function dropVerse(state: CollectionsState, v: VerseRef): CollectionsState {
  const assign = { ...state.assign };
  delete assign[verseKey(v)];
  return { ...state, assign };
}

export interface SavedLike extends VerseRef {
  scriptureTitle?: string;
  chapterTitle?: string;
  sanskrit?: string;
  translation?: string;
  hindi?: string;
}

export interface SavedFilter {
  collectionId?: string;
  scriptureId?: string;
  query?: string;
}

const fold = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

/** Filters saved verses by collection, scripture and a text search over title, verse text, translation and the private note. */
export function filterSaved<T extends SavedLike>(
  saved: T[],
  state: CollectionsState,
  filter: SavedFilter,
  noteFor: (v: T) => string | undefined = () => undefined,
): T[] {
  const q = fold((filter.query ?? '').trim());
  return saved.filter((v) => {
    if (filter.collectionId && collectionOf(state, v) !== filter.collectionId) return false;
    if (filter.scriptureId && v.scriptureId !== filter.scriptureId) return false;
    if (!q) return true;
    const hay = fold([v.scriptureTitle, v.chapterTitle, `${v.chapterId}.${v.verseId}`, v.sanskrit, v.translation, v.hindi, noteFor(v)].filter(Boolean).join(' '));
    return hay.includes(q);
  });
}

export function loadState(storage: Pick<Storage, 'getItem'> = window.localStorage): CollectionsState {
  try {
    return sanitize(JSON.parse(storage.getItem(COLLECTIONS_KEY) ?? 'null'));
  } catch {
    return emptyState();
  }
}

export function saveState(state: CollectionsState, storage: Pick<Storage, 'setItem'> = window.localStorage): boolean {
  try {
    storage.setItem(COLLECTIONS_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/**
 * Export of saved verses and their collections. Private notes are left out
 * unless `notes` is passed, which the caller does only when the reader ticks
 * the box.
 */
export function buildExport(saved: unknown[], state: CollectionsState, notes?: unknown[]): string {
  return JSON.stringify(
    { format: COLLECTIONS_EXPORT_FORMAT, version: 1, exportedAt: new Date().toISOString(), saved, collections: state, ...(notes ? { notes } : {}) },
    null,
    2,
  );
}

export interface ParsedExport {
  saved: SavedLike[];
  state: CollectionsState;
  notes: Array<{ scriptureId: string; chapterId: number; verseId: number | string; text: string; updatedAt: string }>;
}

/** Validates an export. Throws on a foreign file; drops malformed entries. */
export function parseExport(raw: string): ParsedExport {
  const o = JSON.parse(raw) as { format?: string; version?: number; saved?: unknown; collections?: unknown; notes?: unknown };
  if (!o || o.format !== COLLECTIONS_EXPORT_FORMAT || o.version !== 1) throw new Error('Not a Dharma Granth saved-verses file');
  const saved = (Array.isArray(o.saved) ? o.saved : []).filter((v): v is SavedLike => {
    const s = v as Partial<SavedLike> | null;
    return Boolean(s) && typeof s!.scriptureId === 'string' && /^[a-z0-9-]+$/i.test(s!.scriptureId) && (typeof s!.verseId === 'string' || typeof s!.verseId === 'number');
  });
  const notes = (Array.isArray(o.notes) ? o.notes : []).filter((n): n is ParsedExport['notes'][number] => {
    const x = n as Partial<ParsedExport['notes'][number]> | null;
    return Boolean(x) && typeof x!.scriptureId === 'string' && typeof x!.chapterId === 'number' && typeof x!.text === 'string';
  });
  return { saved, state: sanitize(o.collections), notes };
}

/* ── Share links ──────────────────────────────────────────────────────────
 * A shared list travels in the URL and nowhere else: verse references and an
 * optional list name. Notes, highlights and dates are never part of a link.
 */

export const SHARE_PATH = '/practice/shared/';
export const SHARE_MAX = 100;
const SHARE_REF = /^([a-z0-9-]{1,48}):(\d{1,4}):([0-9A-Za-z.]{1,16})$/;

export interface SharedList {
  name: string;
  refs: Array<Required<VerseRef> & { chapterId: number }>;
}

/** Path and query for a share link, e.g. /practice/shared/?n=Morning&v=bhagavadgita:2:47,katha:2:18 */
export function buildSharePath(name: string, refs: VerseRef[]): string {
  const v = refs.slice(0, SHARE_MAX).map((r) => `${r.scriptureId}:${r.chapterId ?? 1}:${r.verseId}`).join(',');
  const params = new URLSearchParams();
  const clean = name.trim().slice(0, MAX_NAME);
  if (clean) params.set('n', clean);
  params.set('v', v);
  return `${SHARE_PATH}?${params.toString()}`;
}

/** Reads a share link's query. Anything malformed is dropped, never guessed. */
export function parseSharePath(search: string): SharedList {
  const params = new URLSearchParams(search);
  const seen = new Set<string>();
  const refs: SharedList['refs'] = [];
  for (const part of (params.get('v') ?? '').split(',')) {
    const m = SHARE_REF.exec(part.trim());
    if (!m || seen.has(m[0]) || refs.length >= SHARE_MAX) continue;
    seen.add(m[0]);
    refs.push({ scriptureId: m[1], chapterId: Number(m[2]), verseId: /^\d+$/.test(m[3]) ? Number(m[3]) : m[3] });
  }
  return { name: (params.get('n') ?? '').trim().slice(0, MAX_NAME), refs };
}
