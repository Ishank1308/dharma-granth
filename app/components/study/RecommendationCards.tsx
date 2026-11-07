'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readRecentChapters } from '@/lib/reading-history';
import { READING_JOURNEYS } from '@/data/reading-journeys';
import { CONNECTIONS, verseKey } from '@/data/study-content';
import { readRecPrefs, writeRecPrefs, type RecPrefs } from '@/lib/recommendation-prefs';
import { readHref } from '@/lib/verse-paths';

const JOURNEYS_KEY = 'dharma.journeys.v1';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface Card { id: string; basis: string; title: string; href: string; reason: string }

/**
 * Suggestions that always say why. They are built only from what this
 * browser already knows (the last chapter opened, journey progress) and
 * from reviewed links. Nothing is sent anywhere, and nothing about the
 * reader's beliefs or identity is guessed.
 */
export function RecommendationCards() {
  const [prefs, setPrefs] = useState<RecPrefs>({ off: false, hidden: [] });
  const [cards, setCards] = useState<Card[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const save = (next: RecPrefs) => {
    setPrefs(next);
    if (!writeRecPrefs(next)) setNote('Your browser blocked storage, so this choice lasts only for this visit.');
  };

  useEffect(() => {
    const p = readRecPrefs();
    setPrefs(p);
    if (p.off) { setCards([]); return; }
    let cancelled = false;
    (async () => {
      const out: Card[] = [];
      const last = readRecentChapters()[0];
      if (last) {
        const here = `${last.scriptureTitle} ${last.chapterId}`;
        let nextHref = `/scripture/${last.scriptureId}/chapter/${last.chapterId}`;
        let nextLabel = `Return to ${here}`;
        let reason = `You last opened this chapter on ${new Date(last.readAt).toLocaleDateString(undefined, { numberingSystem: 'latn' })}.`;
        const basis = `The last chapter you opened on this device: ${here}.`;
        if (last.verseId) {
          try {
            const res = await fetch(`${BASE}/data/scriptures-full/${last.scriptureId}/ch-${last.chapterId}.json`);
            const data = res.ok ? await res.json() : null;
            const list: Array<{ number: number | string }> = data?.chapter?.verses ?? [];
            const i = list.findIndex((v) => String(v.number) === String(last.verseId));
            const nxt = i >= 0 ? list[i + 1] : undefined;
            if (nxt) {
              nextHref = readHref(last.scriptureId, last.chapterId, nxt.number);
              nextLabel = `Continue with ${last.scriptureTitle} ${last.chapterId}.${nxt.number}`;
              const linked = CONNECTIONS[verseKey(last.scriptureId, last.chapterId, last.verseId)]?.find((c) => c.href === nextHref);
              reason = linked ? linked.reason : 'It is the next verse in the same chapter.';
            }
          } catch { /* fall back to the chapter link */ }
        }
        if (!cancelled) out.push({ id: `continue:${last.scriptureId}:${last.chapterId}:${last.verseId ?? ''}`, basis, title: nextLabel, href: nextHref, reason });
      }
      try {
        const progress = JSON.parse(localStorage.getItem(JOURNEYS_KEY) ?? '{}') as Record<string, string[]>;
        for (const j of READING_JOURNEYS) {
          const done = progress[j.id] ?? [];
          const next = j.lessons.find((l) => !done.includes(l.id));
          if (done.length > 0 && next) {
            out.push({
              id: `journey:${j.id}:${next.id}`,
              basis: `Your progress in “${j.title}” on this device.`,
              title: `${j.title}: reading ${done.length + 1} of ${j.lessons.length}`,
              href: `/learn/journeys/${j.id}#${next.id}`,
              reason: `You have completed ${done.length} of ${j.lessons.length} readings.`,
            });
          }
        }
      } catch { /* no journey progress */ }
      if (!cancelled) setCards(out);
    })();
    return () => { cancelled = true; };
  }, []);

  const hide = (id: string) => { save({ ...prefs, hidden: [...prefs.hidden, id] }); setNote('Hidden. You can reset hidden suggestions below.'); };
  const visible = (cards ?? []).filter((c) => !prefs.hidden.includes(c.id));
  const btn = 'focus-ring min-h-[44px] rounded-xl border border-dharma-border px-3 text-sm font-semibold text-dharma-text hover:border-saffron-400';

  return (
    <section aria-labelledby="rec-h" className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
      <h2 id="rec-h" className="font-serif text-xl font-bold text-dharma-text">Suggested next <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· आगे क्या पढ़ें</span></h2>

      {prefs.off ? (
        <p className="mt-2 text-sm text-dharma-muted">Suggestions are turned off. Nothing is being used to suggest anything.</p>
      ) : cards === null ? (
        <p role="status" className="mt-2 text-sm text-dharma-muted">Looking at what you have read…</p>
      ) : visible.length === 0 ? (
        <p className="mt-2 text-sm text-dharma-muted">No suggestions yet. Read a verse or start a journey and they will appear here with the reason for each.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {visible.map((c) => (
            <li key={c.id} className="rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm">
              <p className="text-sm text-dharma-muted">Recommended because: {c.basis}</p>
              <p className="mt-1 font-semibold"><Link href={c.href} className="text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{c.title}</Link></p>
              <p className="mt-1 text-dharma-muted"><span className="font-semibold text-dharma-text">Reason:</span> {c.reason}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" aria-expanded={open === c.id} onClick={() => setOpen(open === c.id ? null : c.id)} className={btn}>Why am I seeing this?</button>
                <button type="button" onClick={() => hide(c.id)} className={btn}>Hide</button>
              </div>
              {open === c.id && <p className="mt-2 rounded-lg bg-sky-50 p-2 text-sm text-sky-950 dark:bg-sky-950/30 dark:text-sky-100">This uses only data stored in this browser: {c.basis} It does not use your location, identity or beliefs, and nothing leaves your device.</p>}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => { save({ ...prefs, off: !prefs.off }); setCards(null); setNote(prefs.off ? 'Suggestions turned on.' : 'Suggestions turned off.'); if (prefs.off) window.location.reload(); }} className={btn}>
          {prefs.off ? 'Turn suggestions on' : 'Turn suggestions off'}
        </button>
        <button type="button" onClick={() => { save({ off: prefs.off, hidden: [] }); setNote('Hidden suggestions restored.'); }} className={btn}>Reset hidden suggestions</button>
        <button type="button" onClick={() => { try { localStorage.removeItem('dharma.recentChapters'); } catch { /* ignore */ } setCards([]); setNote('Reading history forgotten on this device.'); }} className={btn}>Forget reading history</button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-sm text-dharma-muted">{note}</p>
    </section>
  );
}
