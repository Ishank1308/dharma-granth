'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Download, StickyNote, Trash2, Upload } from 'lucide-react';
import { BOOKMARKS_KEY, readBookmarks, type SavedVerse } from '@/lib/reader-actions';
import {
  buildExport,
  collectionOf,
  createCollection,
  deleteCollection,
  dropVerse,
  filterSaved,
  loadState,
  moveVerse,
  parseExport,
  renameCollection,
  saveState,
  verseKey,
  type CollectionsState,
} from '@/lib/verse-collections';
import { verseCount } from '@/lib/format';
import { track } from '@/lib/analytics';

const NOTES_KEY = 'dharma.notes';
const MAX_BYTES = 2 * 1024 * 1024;

interface Note { scriptureId: string; chapterId: number; verseId: number | string; text: string; updatedAt: string }

const readNotes = (): Note[] => {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(NOTES_KEY) ?? '[]');
    return Array.isArray(v) ? (v as Note[]) : [];
  } catch {
    return [];
  }
};
const sameNote = (n: Note, v: SavedVerse) => n.scriptureId === v.scriptureId && n.chapterId === (v.chapterId ?? 1) && String(n.verseId) === String(v.verseId);

const btn =
  'focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg border border-dharma-border px-3 text-sm font-semibold text-dharma-text hover:border-saffron-400';
const field = 'mt-1 block min-h-[44px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text';

/**
 * Saved verses with collections: the five starting collections plus the
 * reader's own, search, a scripture filter, a private note per verse, and an
 * export that leaves notes out unless they are ticked.
 */
export function SavedCollections({ onChange, onQueue }: { onChange: () => void; onQueue: (item: { href: string; label: string }) => void }) {
  const [saved, setSaved] = useState<SavedVerse[]>([]);
  const [state, setState] = useState<CollectionsState | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [active, setActive] = useState<string>('');
  const [query, setQuery] = useState('');
  const [scripture, setScripture] = useState('');
  const [newName, setNewName] = useState('');
  const [renameTo, setRenameTo] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [withNotes, setWithNotes] = useState(false);
  const [msg, setMsg] = useState('');
  const file = useRef<HTMLInputElement>(null);

  const reload = useCallback(() => {
    setSaved(readBookmarks());
    setState(loadState());
    setNotes(readNotes());
  }, []);
  useEffect(reload, [reload]);

  const commit = (next: CollectionsState, message?: string) => {
    setState(next);
    if (!saveState(next)) setMsg('Your browser blocked storage, so this change lasts only for this visit.');
    else if (message) setMsg(message);
    onChange();
  };

  const noteFor = useCallback((v: SavedVerse) => notes.find((n) => sameNote(n, v))?.text, [notes]);
  const shown = useMemo(
    () => (state ? filterSaved(saved, state, { collectionId: active || undefined, scriptureId: scripture || undefined, query }, noteFor) : []),
    [saved, state, active, scripture, query, noteFor],
  );
  const scriptures = useMemo(() => Array.from(new Map(saved.map((v) => [v.scriptureId, v.scriptureTitle])).entries()), [saved]);

  if (!state) return <p role="status" className="text-sm text-dharma-muted">Loading your saved verses…</p>;
  const current = state.collections.find((c) => c.id === active);
  const count = (id: string) => saved.filter((v) => collectionOf(state, v) === id).length;
  const href = (v: SavedVerse) => `/scripture/${v.scriptureId}/chapter/${v.chapterId ?? 1}/verse/${v.verseId}`;

  const remove = (v: SavedVerse) => {
    const next = saved.filter((b) => verseKey(b) !== verseKey(v));
    try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next)); } catch { /* shown below */ }
    setSaved(next);
    commit(dropVerse(state, v), 'Verse removed. Its note, if any, is kept under Personal notes.');
  };

  const saveNote = (v: SavedVerse) => {
    const text = draft.trim();
    const rest = readNotes().filter((n) => !sameNote(n, v));
    const next = text ? [...rest, { scriptureId: v.scriptureId, chapterId: v.chapterId ?? 1, verseId: v.verseId, text, updatedAt: new Date().toISOString() }] : rest;
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(next)); setMsg(text ? 'Note saved on this device.' : 'Note deleted.'); } catch { setMsg('Your browser blocked storage; the note was not saved.'); }
    setNotes(next);
    setEditing(null);
    onChange();
  };

  const download = () => {
    try {
      const body = buildExport(saved, state, withNotes ? readNotes().filter((n) => saved.some((v) => sameNote(n, v))) : undefined);
      const url = URL.createObjectURL(new Blob([body], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-granth-saved-verses-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMsg(withNotes ? 'Exported with your private notes.' : 'Exported. Private notes were left out.');
    } catch {
      setMsg('Could not export: browser storage may be blocked.');
    }
  };

  const upload = async (f: File | undefined) => {
    if (!f) return;
    const reset = () => { if (file.current) file.current.value = ''; };
    if (f.size > MAX_BYTES) { setMsg('That file is too large to be a saved-verses export.'); reset(); return; }
    if (!window.confirm('Add the verses and collections in this file to this browser? Your current saved verses are kept.')) { reset(); return; }
    try {
      const parsed = parseExport(await f.text());
      const have = new Set(readBookmarks().map(verseKey));
      const fresh = parsed.saved.filter((v) => !have.has(verseKey(v))) as SavedVerse[];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...readBookmarks(), ...fresh]));
      const merged: CollectionsState = {
        ...state,
        collections: [...state.collections, ...parsed.state.collections.filter((c) => !state.collections.some((x) => x.id === c.id))],
        assign: { ...parsed.state.assign, ...state.assign },
      };
      saveState(merged);
      if (parsed.notes.length) {
        const existing = readNotes();
        localStorage.setItem(NOTES_KEY, JSON.stringify([...existing, ...parsed.notes.filter((n) => !existing.some((e) => e.scriptureId === n.scriptureId && e.chapterId === n.chapterId && String(e.verseId) === String(n.verseId)))]));
      }
      reload();
      onChange();
      setMsg(`${verseCount(fresh.length)} added.`);
    } catch {
      setMsg('That is not a valid saved-verses file.');
    }
    reset();
  };

  const chip = (on: boolean) => `focus-ring min-h-[44px] rounded-full border px-3 text-sm font-semibold ${on ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'}`;

  return (
    <div>
      <div role="group" aria-label="Collections" className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={active === ''} onClick={() => setActive('')} className={chip(active === '')}>All ({saved.length})</button>
        {state.collections.map((c) => (
          <button key={c.id} type="button" aria-pressed={active === c.id} onClick={() => { setActive(c.id); setRenameTo(c.name); }} className={chip(active === c.id)}>
            {c.name} ({count(c.id)})
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="text-sm font-semibold text-dharma-muted">Search saved verses
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Words from the verse, translation or your note" className={field} />
        </label>
        <label className="text-sm font-semibold text-dharma-muted">Scripture
          <select value={scripture} onChange={(e) => setScripture(e.target.value)} className={field}>
            <option value="">All scriptures</option>
            {scriptures.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
          </select>
        </label>
      </div>

      <p role="status" aria-live="polite" className="mt-2 text-sm text-dharma-muted">
        {shown.length === saved.length ? `${verseCount(saved.length)} saved.` : `${shown.length} of ${verseCount(saved.length)} shown.`}
      </p>

      {saved.length === 0 ? (
        <p className="mt-2 text-sm text-dharma-muted">No saved verses yet. Use Save on any verse and it will appear here in Read Later.</p>
      ) : shown.length === 0 ? (
        <p className="mt-2 text-sm text-dharma-muted">Nothing matches. Clear the search or choose another collection.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {shown.map((v) => {
            const key = verseKey(v);
            const note = noteFor(v);
            return (
              <li key={key} className="rounded-xl border border-dharma-border p-3 text-sm">
                <div className="flex flex-wrap items-start gap-2">
                  <Link href={href(v)} className="min-w-0 flex-1">
                    <span className="font-semibold text-dharma-text">{v.scriptureTitle} {v.chapterId}.{v.verseId}</span>
                    <span lang="sa" className="block truncate font-devanagari text-dharma-muted">{v.sanskrit.split('\n')[0]}</span>
                  </Link>
                  <label className="text-sm text-dharma-muted">
                    <span className="sr-only">Move {v.scriptureTitle} {v.chapterId}.{v.verseId} to</span>
                    <select value={collectionOf(state, v)} onChange={(e) => commit(moveVerse(state, v, e.target.value), 'Moved.')} className="min-h-[44px] rounded-lg border border-dharma-border bg-dharma-bg px-2 text-sm text-dharma-text">
                      {state.collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </label>
                  <button type="button" className={btn} onClick={() => { setEditing(editing === key ? null : key); setDraft(note ?? ''); }} aria-expanded={editing === key}>
                    <StickyNote className="h-4 w-4" aria-hidden="true" /> {note ? 'Edit note' : 'Add note'}
                  </button>
                  <button type="button" className={btn} onClick={() => { onQueue({ href: href(v), label: `${v.scriptureTitle} ${v.chapterId}.${v.verseId}` }); setMsg('Added to reading queue.'); }}>Queue</button>
                  <button type="button" className={btn} onClick={() => remove(v)} aria-label={`Remove ${v.scriptureTitle} ${v.chapterId}.${v.verseId}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                </div>
                {note && editing !== key && <p className="mt-2 whitespace-pre-line border-l-4 border-dharma-border pl-3 text-dharma-text"><span className="text-sm font-semibold text-dharma-muted">Private note · </span>{note}</p>}
                {editing === key && (
                  <div className="mt-2">
                    <label className="text-sm font-semibold text-dharma-muted">Private note (stays on this device)
                      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} maxLength={2000} className={`${field} min-h-[88px]`} />
                    </label>
                    <div className="mt-2 flex gap-2">
                      <button type="button" className={`${btn} !border-saffron-700 !bg-saffron-700 !text-white`} onClick={() => saveNote(v)}>Save note</button>
                      <button type="button" className={btn} onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 rounded-xl border border-dharma-border bg-dharma-bg p-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-dharma-muted">Manage collections</h3>
        <form className="mt-2 flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); const r = createCollection(state, newName); if (r.error) setMsg(r.error); else { commit(r.state, `Collection “${newName.trim()}” created.`); setNewName(''); track('collection_created'); } }}>
          <label className="min-w-[10rem] flex-1 text-sm font-semibold text-dharma-muted">New collection
            <input value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={40} className={field} />
          </label>
          <button type="submit" className={btn}>Create</button>
        </form>
        {current && !current.builtin && (
          <form className="mt-2 flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); const r = renameCollection(state, current.id, renameTo); if (r.error) setMsg(r.error); else commit(r.state, 'Renamed.'); }}>
            <label className="min-w-[10rem] flex-1 text-sm font-semibold text-dharma-muted">Rename “{current.name}”
              <input value={renameTo} onChange={(e) => setRenameTo(e.target.value)} maxLength={40} className={field} />
            </label>
            <button type="submit" className={btn}>Rename</button>
            <button type="button" className={btn} onClick={() => { if (window.confirm(`Delete the collection “${current.name}”? Its verses move to Read Later; no saved verse is lost.`)) { const r = deleteCollection(state, current.id); setActive(''); commit(r.state, 'Collection deleted.'); } }}>Delete collection</button>
          </form>
        )}
        {current?.builtin && <p className="mt-2 text-sm text-dharma-muted">The five starting collections keep their names and cannot be deleted.</p>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-dharma-text">
          <input type="checkbox" checked={withNotes} onChange={(e) => setWithNotes(e.target.checked)} className="h-5 w-5 accent-saffron-700" /> Include my private notes in the export
        </label>
        <button type="button" className={btn} onClick={download}><Download className="h-4 w-4" aria-hidden="true" /> Export saved verses</button>
        <button type="button" className={btn} onClick={() => file.current?.click()}><Upload className="h-4 w-4" aria-hidden="true" /> Import</button>
        <input ref={file} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => void upload(e.target.files?.[0])} />
      </div>
      <p role="status" aria-live="polite" className="mt-1 min-h-[1.25rem] text-sm text-dharma-muted">{msg}</p>
    </div>
  );
}
