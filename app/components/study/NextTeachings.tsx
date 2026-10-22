'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { READING_JOURNEYS } from '@/data/reading-journeys';
import { readRecPrefs, writeRecPrefs, type RecPrefs } from '@/lib/recommendation-prefs';
import { isBookmarked, toggleBookmark, type ReaderRef, type ReaderVerseText } from '@/lib/reader-actions';
import { track } from '@/lib/analytics';

export interface NextCandidate {
  id: string;
  kind: 'next' | 'complementary' | 'concept' | 'journey';
  title: string;
  href: string;
  reason: string;
  /** What the suggestion is built from, shown under "Why am I seeing this?". */
  basis: string;
  /** Present when the suggested verse can be saved from here. */
  save?: { ref: ReaderRef; verse: ReaderVerseText };
}

type Card = NextCandidate;

const JOURNEYS_KEY = 'dharma.journeys.v1';
const MAX = 3;

const KIND_HI: Record<NextCandidate['kind'], string> = {
  next: 'अगला श्लोक',
  complementary: 'समीक्षित संबंध',
  concept: 'अवधारणा',
  journey: 'जारी अध्ययन',
};

/**
 * "आगे क्या" after a verse: at most three options, each with a reason,
 * built from the verse's own links and the reader's active journey.
 * The first paint uses the server candidates only, so the page has a next
 * step without JavaScript. Device prefs and the journey card apply after load.
 * The reader can continue, save, hide, ask why, or turn suggestions off; those
 * choices are shared with the suggestions on the study desk.
 */
export function NextTeachings({ candidates, verseId }: { candidates: NextCandidate[]; verseId: string }) {
  const [prefs, setPrefs] = useState<RecPrefs>({ off: false, hidden: [] });
  const [journey, setJourney] = useState<Card | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    setPrefs(readRecPrefs());
    let nextJourney: Card | null = null;
    try {
      const progress = JSON.parse(localStorage.getItem(JOURNEYS_KEY) ?? '{}') as Record<string, string[]>;
      for (const j of READING_JOURNEYS) {
        const done = progress[j.id] ?? [];
        const nextLesson = j.lessons.find((l) => !done.includes(l.id));
        if (done.length > 0 && nextLesson) {
          nextJourney = {
            id: `journey:${j.id}:${nextLesson.id}`,
            kind: 'journey',
            title: `${j.title}: reading ${done.length + 1} of ${j.lessons.length}`,
            href: `/learn/journeys/${j.id}#${nextLesson.id}`,
            reason: `You have completed ${done.length} of ${j.lessons.length} readings.`,
            basis: `Your progress in “${j.title}” on this device.`,
          };
          break;
        }
      }
    } catch { /* no journey progress */ }
    setJourney(nextJourney);
    setSavedIds(candidates.filter((c) => c.save && isBookmarked(c.save.ref, c.save.verse)).map((c) => c.id));
  }, [candidates, verseId]);

  const update = (next: RecPrefs, message: string) => {
    setPrefs(next);
    setNote(writeRecPrefs(next) ? message : 'Your browser blocked storage, so this choice lasts only for this visit.');
  };

  if (prefs.off) {
    return (
      <section aria-labelledby="nt-h" className="mt-8 rounded-2xl border border-dharma-border bg-dharma-card/60 p-5 text-sm">
        <h2 id="nt-h" className="font-serif text-lg font-bold text-dharma-text"><span lang="hi" className="font-devanagari">आगे क्या</span> <span className="text-sm font-normal text-dharma-muted">· What next</span></h2>
        <p className="mt-1 text-dharma-muted">Suggestions are turned off. Use the previous and next buttons to keep reading.</p>
        <button type="button" onClick={() => update({ ...prefs, off: false }, 'Suggestions turned on.')} className="focus-ring mt-2 min-h-[44px] rounded-xl border border-dharma-border px-4 text-sm font-semibold text-dharma-text hover:border-saffron-400">Turn suggestions on</button>
        <p role="status" aria-live="polite" className="mt-1 text-sm text-dharma-muted">{note}</p>
      </section>
    );
  }

  const cards: Card[] = [...candidates.slice(0, 1), ...(journey ? [journey] : []), ...candidates.slice(1)]
    .filter((c) => !prefs.hidden.includes(c.id))
    .slice(0, MAX);
  if (cards.length === 0 && prefs.hidden.length === 0) return null;
  const btn = 'focus-ring min-h-[44px] rounded-xl border border-dharma-border px-3 text-sm font-semibold text-dharma-text hover:border-saffron-400';

  const save = (c: NextCandidate) => {
    if (!c.save) return;
    const state = toggleBookmark(c.save.ref, c.save.verse);
    if (state === null) return setNote('Your browser blocked storage, so the verse was not saved.');
    setSavedIds((ids) => (state ? [...ids, c.id] : ids.filter((x) => x !== c.id)));
    setNote(state ? 'Saved to Read Later.' : 'Removed from saved verses.');
  };

  return (
    <section aria-labelledby="nt-h" className="mt-8 rounded-2xl border border-dharma-border bg-dharma-card/60 p-5">
      <h2 id="nt-h" className="font-serif text-lg font-bold text-dharma-text"><span lang="hi" className="font-devanagari">आगे क्या</span> <span className="text-sm font-normal text-dharma-muted">· What next</span></h2>
      {cards.length === 0 ? (
        <p className="mt-2 text-sm text-dharma-muted">You have hidden every suggestion for this verse.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {cards.map((c) => (
            <li key={c.id} className="rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm">
              <p lang="hi" className="font-devanagari text-xs font-semibold text-dharma-muted">{KIND_HI[c.kind]}</p>
              <p className="font-semibold">
                <Link href={c.href} className="text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{c.title}</Link>
              </p>
              <p className="mt-1 text-dharma-muted"><span className="font-semibold text-dharma-text">Reason:</span> {c.reason}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href={c.href} className={`${btn} inline-flex items-center`}>Continue</Link>
                {c.save && (
                  <button type="button" onClick={() => save(c)} aria-pressed={savedIds.includes(c.id)} className={`${btn} inline-flex items-center gap-1`}>
                    {savedIds.includes(c.id) ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
                    {savedIds.includes(c.id) ? 'Saved' : 'Save'}
                  </button>
                )}
                <button type="button" aria-expanded={open === c.id} onClick={() => setOpen(open === c.id ? null : c.id)} className={btn}>Why am I seeing this?</button>
                <button type="button" onClick={() => { track('recommendation_hidden', { kind: c.kind }); update({ ...prefs, hidden: [...prefs.hidden, c.id] }, 'Hidden. You can restore hidden suggestions from your study desk.'); }} className={btn}>Hide</button>
              </div>
              {open === c.id && <p className="mt-2 rounded-lg bg-sky-50 p-2 text-sm text-sky-950 dark:bg-sky-950/30 dark:text-sky-100">{c.basis} This uses only the verse you are reading, reviewed links and data stored in this browser. It does not use your location, identity or beliefs.</p>}
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={() => update({ ...prefs, off: true }, 'Suggestions turned off.')} className={`${btn} mt-3`}>Turn suggestions off</button>
      <p role="status" aria-live="polite" className="mt-1 min-h-[1.25rem] text-sm text-dharma-muted">{note}</p>
    </section>
  );
}
