'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { readBookmarks } from '@/lib/reader-actions';
import { READING_JOURNEYS } from '@/data/reading-journeys';
import { cleanVerseField, verseLines } from '@/lib/verse-format';
import { parseWordMeanings } from '@/lib/word-gloss';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface Item { scriptureId: string; chapter: number; verse: string; label: string; journeyLesson?: { id: string; journeyId: string } }
interface Loaded {
  item: Item;
  sanskrit: string;
  transliteration: string;
  hindi: string;
  english: string;
  words: Array<{ pada: string; meaning: string }>;
  hindiAi: boolean;
  englishAi: boolean;
  source: string;
  license: string;
}

const OPTIONS = [
  ['verse', 'Original verse'],
  ['translit', 'Transliteration'],
  ['hindi', 'Hindi translation'],
  ['english', 'English translation'],
  ['explain', 'Simple explanation (journey verses)'],
  ['vocab', 'Vocabulary'],
  ['reflect', 'Reflection questions (journey verses)'],
  ['commentary', 'Commentary'],
  ['sources', 'Sources'],
  ['notes', 'My private notes'],
] as const;
type Opt = (typeof OPTIONS)[number][0];

const key = (i: Item) => `${i.scriptureId}:${i.chapter}:${i.verse}`;

export function PackClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [opts, setOpts] = useState<Record<Opt, boolean>>({ verse: true, translit: true, hindi: true, english: true, explain: true, vocab: true, reflect: true, commentary: false, sources: true, notes: false });
  const [saved, setSaved] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState<Loaded[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [manual, setManual] = useState({ s: 'bhagavadgita', c: '2', v: '47' });
  const [notes, setNotes] = useState<Array<{ scriptureId: string; chapterId: number; verseId: number | string; text: string }>>([]);
  const [title, setTitle] = useState('My study pack');

  useEffect(() => {
    setSaved(readBookmarks().map((b) => ({ scriptureId: b.scriptureId, chapter: b.chapterId ?? 1, verse: String(b.verseId), label: `${b.scriptureTitle} ${b.chapterId}.${b.verseId}` })));
    try { setNotes(JSON.parse(localStorage.getItem('dharma.notes') ?? '[]')); } catch { setNotes([]); }
  }, []);

  const add = (list: Item[]) => setItems((prev) => [...prev, ...list.filter((n) => !prev.some((p) => key(p) === key(n)))]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (items.length === 0) { setLoaded([]); return; }
      setBusy(true); setError('');
      const cache = new Map<string, unknown>();
      const out: Loaded[] = [];
      for (const it of items) {
        const ck = `${it.scriptureId}:${it.chapter}`;
        if (!cache.has(ck)) {
          try {
            const r = await fetch(`${BASE}/data/scriptures-full/${it.scriptureId}/ch-${it.chapter}.json`);
            cache.set(ck, r.ok ? await r.json() : null);
          } catch { cache.set(ck, null); }
        }
        const d = cache.get(ck) as { source?: { repo?: string; license?: string }; chapter?: { verses?: Array<Record<string, string | number>> } } | null;
        const v = d?.chapter?.verses?.find((x) => String(x.number) === it.verse);
        if (!v) { setError(`Could not load ${it.label}. It stays out of the pack.`); continue; }
        out.push({
          item: it,
          sanskrit: cleanVerseField(String(v.sanskrit ?? '')),
          transliteration: cleanVerseField(String(v.transliteration ?? '')),
          hindi: cleanVerseField(String(v.hindi ?? '')),
          english: cleanVerseField(String(v.translation ?? '')),
          words: parseWordMeanings(String(v.wordMeaning ?? '')),
          hindiAi: v.hindiSource === 'ai',
          englishAi: v.translationSource === 'ai',
          source: d?.source?.repo ?? 'Not recorded',
          license: d?.source?.license ?? '',
        });
      }
      if (!cancelled) { setLoaded(out); setBusy(false); }
    })();
    return () => { cancelled = true; };
  }, [items]);

  const lessonFor = (it: Item) => {
    const j = READING_JOURNEYS.find((x) => x.lessons.some((l) => l.scriptureId === it.scriptureId && l.chapter === it.chapter && String(l.verse) === it.verse));
    return j?.lessons.find((l) => l.scriptureId === it.scriptureId && l.chapter === it.chapter && String(l.verse) === it.verse);
  };

  const sourceList = useMemo(() => Array.from(new Set(loaded.map((l) => l.source))), [loaded]);
  const set = (o: Opt, on: boolean) => setOpts((p) => ({ ...p, [o]: on }));
  const btn = 'focus-ring min-h-[44px] rounded-xl border border-dharma-border bg-dharma-card px-4 text-sm font-semibold text-dharma-text hover:border-saffron-400';

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <style>{`
        @page { margin: 18mm 16mm 20mm; @bottom-center { content: "Dharma Granth · page " counter(page); font-size: 9pt; } }
        @media print {
          body * { visibility: hidden; }
          #pack-print, #pack-print * { visibility: visible; }
          #pack-print { position: absolute; left: 0; top: 0; width: 100%; color: #000; background: #fff; }
          .pack-verse { break-inside: avoid; page-break-inside: avoid; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print">
        <h1 className="font-serif text-3xl font-bold text-dharma-text">Study Pack <span lang="hi" className="font-devanagari text-xl font-normal text-dharma-muted">· अध्ययन-पत्र</span></h1>
        <p className="mt-2 text-sm text-dharma-muted">Choose verses and layers, then print or save as PDF from your browser’s print dialog. Everything is prepared on your device. Your private notes are included only if you tick that box.</p>

        <section aria-labelledby="pk-add" className="mt-5 rounded-2xl border border-dharma-border bg-dharma-card p-4">
          <h2 id="pk-add" className="font-semibold text-dharma-text">1. Add verses</h2>
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <button type="button" className={btn} disabled={saved.length === 0} onClick={() => add(saved)}>All saved verses ({saved.length})</button>
            {READING_JOURNEYS.map((j) => (
              <button key={j.id} type="button" className={btn} onClick={() => add(j.lessons.map((l) => ({ scriptureId: l.scriptureId, chapter: l.chapter, verse: String(l.verse), label: `${l.scriptureId === 'bhagavadgita' ? 'Bhagavad Gita' : l.scriptureId.charAt(0).toUpperCase() + l.scriptureId.slice(1)} ${l.chapter}.${l.verse}` })))}>Journey: {j.title}</button>
            ))}
          </div>
          <form className="mt-3 flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); const c = Number(manual.c); if (!/^[a-z0-9-]+$/.test(manual.s) || !c || !manual.v) return; add([{ scriptureId: manual.s, chapter: c, verse: manual.v, label: `${manual.s} ${c}.${manual.v}` }]); }}>
            <label className="text-sm font-semibold text-dharma-muted">Scripture id<input value={manual.s} onChange={(e) => setManual({ ...manual, s: e.target.value.toLowerCase() })} className="mt-1 block min-h-[44px] w-40 rounded-xl border border-dharma-border bg-dharma-bg px-3 text-dharma-text" /></label>
            <label className="text-sm font-semibold text-dharma-muted">Chapter<input value={manual.c} inputMode="numeric" onChange={(e) => setManual({ ...manual, c: e.target.value })} className="mt-1 block min-h-[44px] w-20 rounded-xl border border-dharma-border bg-dharma-bg px-3 text-dharma-text" /></label>
            <label className="text-sm font-semibold text-dharma-muted">Verse<input value={manual.v} onChange={(e) => setManual({ ...manual, v: e.target.value })} className="mt-1 block min-h-[44px] w-20 rounded-xl border border-dharma-border bg-dharma-bg px-3 text-dharma-text" /></label>
            <button type="submit" className={btn}>Add verse</button>
          </form>
          {items.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {items.map((i) => (
                <li key={key(i)}><button type="button" onClick={() => setItems(items.filter((x) => key(x) !== key(i)))} aria-label={`Remove ${i.label}`} className="focus-ring min-h-[44px] rounded-full border border-dharma-border px-3 text-sm">{i.label} ✕</button></li>
              ))}
            </ul>
          )}
        </section>

        <fieldset className="mt-4 rounded-2xl border border-dharma-border bg-dharma-card p-4">
          <legend className="px-1 font-semibold text-dharma-text">2. Choose what to include</legend>
          <div className="mt-1 grid gap-1 sm:grid-cols-2">
            {OPTIONS.map(([id, label]) => (
              <label key={id} className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-dharma-text">
                <input type="checkbox" checked={opts[id]} onChange={(e) => set(id, e.target.checked)} className="h-5 w-5 accent-saffron-700" /> {label}
              </label>
            ))}
          </div>
          {opts.commentary && <p className="mt-1 text-sm text-dharma-muted">No reviewed traditional commentary exists yet, so none can be printed. The sheet will say so.</p>}
          <label className="mt-3 block text-sm font-semibold text-dharma-muted">Title for the sheet<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} className="mt-1 block min-h-[44px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text" /></label>
        </fieldset>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => window.print()} disabled={loaded.length === 0} className="focus-ring min-h-[48px] rounded-xl bg-saffron-700 px-6 text-sm font-semibold text-white hover:bg-saffron-800 disabled:opacity-50">Print or save as PDF</button>
          <span role="status" className="text-sm text-dharma-muted">{busy ? 'Preparing…' : loaded.length === 0 ? 'Add at least one verse to see a preview.' : `${loaded.length} verse${loaded.length === 1 ? '' : 's'} ready.`}</span>
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        <p className="mt-2 text-sm text-dharma-muted"><Link href="/desk" className="underline underline-offset-2">Back to my study desk</Link></p>
      </div>

      {loaded.length > 0 && (
        <article id="pack-print" aria-label="Study pack preview" className="mt-6 rounded-2xl border border-dharma-border bg-white p-6 text-black">
          <h2 className="font-serif text-2xl font-bold">{title}</h2>
          <p className="text-sm text-neutral-600">Prepared from Dharma Granth · {new Date().toLocaleDateString(undefined, { numberingSystem: 'latn' })} · Editorial notes are labelled and are not scripture.</p>

          {loaded.map((l) => {
            const lesson = lessonFor(l.item);
            const note = notes.find((n) => n.scriptureId === l.item.scriptureId && n.chapterId === l.item.chapter && String(n.verseId) === l.item.verse);
            return (
              <section key={key(l.item)} className="pack-verse mt-6 border-t border-neutral-300 pt-4">
                <h3 className="font-serif text-lg font-bold">{l.item.label}</h3>
                {opts.verse && l.sanskrit && (
                  <p lang="sa" className="mt-2 font-devanagari text-xl leading-[2]">{verseLines(l.sanskrit).map((x, i) => <span key={i} className="block">{x}</span>)}</p>
                )}
                {opts.translit && l.transliteration && <p className="mt-1 italic">{l.transliteration.split('\n').map((x, i) => <span key={i} className="block">{x}</span>)}</p>}
                {opts.hindi && l.hindi && <p lang="hi" className="mt-2 font-devanagari leading-[1.9]"><strong>हिन्दी{l.hindiAi ? ' (AI अनुवाद)' : ''}: </strong>{l.hindi}</p>}
                {opts.english && l.english && <p lang="en" className="mt-2"><strong>English{l.englishAi ? ' (AI translation, not a scholarly edition)' : ''}: </strong>{l.english}</p>}
                {opts.explain && lesson && <p className="mt-2"><strong>Simple explanation (editorial, not scripture): </strong>{lesson.explanation}</p>}
                {opts.explain && !lesson && <p className="mt-2 text-sm text-neutral-600">No reviewed simple explanation is available for this verse.</p>}
                {opts.vocab && l.words.length > 1 && (
                  <div className="mt-2"><strong>Vocabulary: </strong><ul className="ml-5 list-disc">{l.words.map((w, i) => <li key={i}><em>{w.pada}</em>: {w.meaning}</li>)}</ul></div>
                )}
                {opts.reflect && lesson && <p className="mt-2"><strong>Reflection: </strong>{lesson.reflection}</p>}
                {opts.commentary && <p className="mt-2 text-sm text-neutral-600">Traditional commentary: none reviewed yet for this verse.</p>}
                {opts.notes && note && <p className="mt-2 border-l-4 border-neutral-400 pl-3"><strong>My note: </strong>{note.text}</p>}
              </section>
            );
          })}

          {opts.sources && (
            <footer className="mt-8 border-t border-neutral-300 pt-3 text-sm text-neutral-700">
              <p className="font-semibold">Sources</p>
              <ul className="ml-5 list-disc">{sourceList.map((s) => <li key={s}>Sanskrit text: {s}</li>)}</ul>
              <p className="mt-1">Translations marked “AI” are machine translations. Editorial explanations and reflections are not part of the scripture. Dharma Granth · dharmagranth.in</p>
            </footer>
          )}
        </article>
      )}
    </main>
  );
}
