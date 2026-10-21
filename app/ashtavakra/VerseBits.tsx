'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAshRead } from '@/lib/ashtavakra-progress';
import { useAsh } from './AshShell';
import { keepDanda } from '@/lib/ashtavakra';

/** Small marker beside a verse the reader has marked as read. */
export function ReadFlag({ id }: { id: string }) {
  const { isRead, ready } = useAshRead();
  if (!ready || !isRead(id)) return null;
  return (
    <span className="ash-chip" style={{ borderColor: 'var(--ash-gold)' }}>
      <span aria-hidden="true">●</span> पढ़ा गया
    </span>
  );
}

/** Mark or unmark a verse as read. Stored on this device only. */
export function ReadMark({ id }: { id: string }) {
  const { isRead, toggle, ready } = useAshRead();
  const [note, setNote] = useState('');
  const read = ready && isRead(id);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="ash-btn"
        aria-pressed={read}
        onClick={() => setNote(toggle(id) ? (read ? 'चिह्न हटाया गया।' : 'पढ़ा हुआ चिह्नित किया गया।') : 'ब्राउज़र ने भंडारण रोका, इसलिए यह चिह्न सहेजा नहीं गया।')}
      >
        <span aria-hidden="true">{read ? '●' : '○'}</span>
        {read ? 'पढ़ा गया (चिह्न हटाएँ)' : 'पढ़ा हुआ चिह्नित करें'}
      </button>
      <span role="status" aria-live="polite" className="ash-meta">{note}</span>
    </div>
  );
}

export interface DailyItem {
  id: string;
  href: string;
  sanskrit: string;
  hindi: string;
  summary: string;
}

/** Day-of-year rotation through the published verses. The method is stated openly. */
export function DailyVerse({ items }: { items: DailyItem[] }) {
  const [pick, setPick] = useState<DailyItem | null>(null);
  useEffect(() => {
    const now = new Date();
    const day = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
    setPick(items[day % items.length]);
  }, [items]);
  const v = pick ?? items[0];
  return (
    <section aria-labelledby="daily-h" className="ash-card">
      <h2 id="daily-h" className="ash-eyebrow">आज का श्लोक</h2>
      <p lang="sa" className="ash-sanskrit mt-2" style={{ whiteSpace: 'pre-line' }}>{keepDanda(v.sanskrit)}</p>
      <p lang="hi" className="ash-hindi mt-1">{v.hindi}</p>
      <p lang="hi" className="mt-2 font-bold">{v.summary}</p>
      <Link href={v.href} className="ash-btn mt-3">श्लोक {v.id} पूरा पढ़ें</Link>
      <p className="ash-meta mt-3">चयन-विधि: प्रकाशित श्लोकों में से तारीख के अनुसार क्रम से; यह किसी दैवी चयन का दावा नहीं है।</p>
    </section>
  );
}

/** Hero actions, including the visible "skip animation" control. */
export function SkipAnimation() {
  const { motion, skipAnimation, update } = useAsh();
  const off = motion === 'none';
  return (
    <button type="button" className="ash-btn ash-controls" onClick={() => (off ? update({ motion: 'full' }) : skipAnimation())} aria-pressed={off}>
      {off ? 'एनिमेशन फिर चालू करें' : 'एनिमेशन छोड़ें'}
    </button>
  );
}

/** "Continue reading": the first verse of the first published chapter not fully read. */
export function ContinueReading({ chapters }: { chapters: Array<{ number: number; title: string; ids: string[] }> }) {
  const { ids, ready } = useAshRead();
  const next = useMemo(() => {
    for (const c of chapters) {
      const first = c.ids.find((id) => !ids.includes(id));
      if (first) return { chapter: c, id: first, started: ids.some((x) => c.ids.includes(x)) };
    }
    return null;
  }, [chapters, ids]);
  if (!ready) return null;
  if (!next) {
    return <p className="ash-hindi">आपने उपलब्ध सभी श्लोक पढ़े हुए चिह्नित किए हैं। नए अध्याय जुड़ने पर यहाँ दिखेंगे।</p>;
  }
  const p = next.id.split('.');
  return (
    <p className="ash-hindi">
      {next.started ? 'जहाँ से छोड़ा था:' : 'यहाँ से आरम्भ करें:'}{' '}
      <Link href={`/ashtavakra/${p[0]}/${p[1]}/`} className="ash-link font-bold underline" style={{ color: 'var(--ash-accent)' }}>
        अध्याय {next.chapter.number}, श्लोक {next.id}
      </Link>
    </p>
  );
}
