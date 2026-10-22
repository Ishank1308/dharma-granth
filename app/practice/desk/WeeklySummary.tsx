'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { READING_JOURNEYS } from '@/data/reading-journeys';
import { clearActivity, readActivity, setSummaryEnabled, summaryEnabled, weeklySummary, type WeeklySummary as Summary } from '@/lib/activity-log';
import { formatDate, plural } from '@/lib/format';

const JOURNEYS_KEY = 'dharma.journeys.v1';
const btn =
  'focus-ring inline-flex min-h-[44px] items-center rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-semibold text-dharma-text hover:border-saffron-400';
const label = (id: string) => id.replace(/[-_]/g, ' ').replace(/^./, (c) => c.toUpperCase());

/**
 * "Your week in Dharma Granth": counts from this device's own log, for the
 * last seven days. It describes what was read. It never judges, scores or
 * compares, and it can be switched off or cleared.
 */
export function WeeklySummary({ onChange }: { onChange?: () => void }) {
  const [on, setOn] = useState(true);
  const [sum, setSum] = useState<Summary | null>(null);
  const [journeyHref, setJourneyHref] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setOn(summaryEnabled());
    setSum(weeklySummary(readActivity()));
    try {
      const progress = JSON.parse(localStorage.getItem(JOURNEYS_KEY) ?? '{}') as Record<string, string[]>;
      for (const j of READING_JOURNEYS) {
        const done = progress[j.id] ?? [];
        const next = j.lessons.find((l) => !done.includes(l.id));
        if (done.length > 0 && next) { setJourneyHref(`/learn/journeys/${j.id}#${next.id}`); return; }
      }
    } catch { /* no journey in progress */ }
    setJourneyHref(null);
  }, []);
  useEffect(load, [load]);

  if (!sum) return null;

  const lines = [
    `${sum.teachingsExplored} ${plural(sum.teachingsExplored, 'teaching')} explored`,
    `${sum.versesSaved} ${plural(sum.versesSaved, 'verse')} saved`,
    `${sum.journeysContinued} learning ${plural(sum.journeysContinued, 'journey', 'journeys')} continued`,
  ];
  const empty = sum.teachingsExplored + sum.versesSaved + sum.journeysContinued === 0;

  const exportText = () => {
    const body = [
      'Your week in Dharma Granth',
      `${formatDate(sum.from)} to ${formatDate(sum.to)}`,
      '',
      ...lines.map((l) => `- ${l}`),
      sum.conceptsExplored.length ? `\nConcepts explored: ${sum.conceptsExplored.map(label).join(' · ')}` : '',
      '',
      'Kept on this device only.',
    ].join('\n');
    try {
      const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-granth-week-${sum.to}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMsg('Summary exported.');
    } catch {
      setMsg('Could not export the summary in this browser.');
    }
  };

  return (
    <section aria-labelledby="ws-h" className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
      <h2 id="ws-h" className="font-serif text-xl font-bold text-dharma-text">Your week in Dharma Granth <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· आपका सप्ताह</span></h2>
      {!on ? (
        <>
          <p className="mt-2 text-sm text-dharma-muted">The weekly summary is off, so nothing is being recorded for it.</p>
          <button type="button" className={`${btn} mt-2`} onClick={() => { setSummaryEnabled(true); load(); setMsg('Weekly summary turned on.'); }}>Turn summary on</button>
        </>
      ) : empty ? (
        <p className="mt-2 text-sm text-dharma-muted">Nothing has been recorded in the last seven days. There is nothing to catch up on.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-dharma-muted">{formatDate(sum.from, 'en', { day: 'numeric', month: 'short' })} to {formatDate(sum.to, 'en', { day: 'numeric', month: 'short' })}</p>
          <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-dharma-text">{lines.map((l) => <li key={l}>{l}</li>)}</ul>
          {sum.conceptsExplored.length > 0 && (
            <p className="mt-2 text-sm text-dharma-text"><span className="font-semibold">Concepts explored:</span> {sum.conceptsExplored.map(label).join(' · ')}</p>
          )}
        </>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {journeyHref && <Link href={journeyHref} className={btn}>Continue journey</Link>}
        <a href="#saved-h" className={btn}>Review saved verses</a>
        {on && !empty && <button type="button" className={btn} onClick={exportText}>Export summary</button>}
        {on && <button type="button" className={btn} onClick={() => { setSummaryEnabled(false); load(); setMsg('Weekly summary turned off.'); }}>Disable summary</button>}
        <button type="button" className={btn} onClick={() => { if (window.confirm('Clear the activity this summary is built from? Saved verses, notes and reading history are not affected.')) { const n = clearActivity(); load(); onChange?.(); setMsg(`${n} ${n === 1 ? 'entry' : 'entries'} cleared.`); } }}>Clear summary history</button>
      </div>
      <p className="mt-2 text-sm text-dharma-muted">Built only from this browser. It does not judge your reading and is never compared with anyone else.</p>
      <p role="status" aria-live="polite" className="mt-1 min-h-[1.25rem] text-sm text-dharma-muted">{msg}</p>
    </section>
  );
}
