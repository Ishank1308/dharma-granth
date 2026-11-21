'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export interface ExplorerConcept {
  id: string;
  label: string;
  sanskrit: string;
  transliteration: string;
  definition: string;
  practiceHref?: string;
  practiceLabel?: string;
}
export interface ExplorerRelation { from: string; to: string; typeLabel: string; note: string; source: string; href: string; status: string }

const fold = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

/**
 * Twelve concepts with their typed relationships. The list is the primary
 * view and carries every fact; the circular diagram on wide screens repeats
 * the same links for those who find it useful and is hidden from assistive
 * technology. Search filters concepts by name, Sanskrit, transliteration or definition.
 */
export function RelationshipExplorer({ concepts, relations }: { concepts: ExplorerConcept[]; relations: ExplorerRelation[] }) {
  const [q, setQ] = useState('');
  const [scale, setScale] = useState(1);
  const shown = useMemo(() => {
    const needle = fold(q.trim());
    return needle ? concepts.filter((c) => fold(`${c.label} ${c.sanskrit} ${c.transliteration} ${c.definition}`).includes(needle)) : concepts;
  }, [q, concepts]);
  const shownIds = new Set(shown.map((c) => c.id));
  const label = (id: string) => concepts.find((c) => c.id === id)?.label ?? id;

  const R = 190;
  const pos = (i: number) => {
    const a = (i / concepts.length) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * R, y: Math.sin(a) * R };
  };
  const at = (id: string) => pos(Math.max(0, concepts.findIndex((c) => c.id === id)));

  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-dharma-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/concepts" className="inline-flex min-h-[44px] items-center underline underline-offset-2">Concepts</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-dharma-text">Relationships</li>
        </ol>
      </nav>
      <h1 className="font-serif text-3xl font-bold text-dharma-text"><span data-bi="en">Concept relationships</span> <span data-bi="sep" className="font-devanagari text-xl font-normal text-dharma-muted">· </span><span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-xl font-normal text-dharma-muted">अवधारणाओं के संबंध</span></h1>
      <p className="mt-2 text-sm text-dharma-muted">
        Each link has a type and the verse that supports it. They are study aids and are drafts until an editor reviews them. Where traditions read a verse differently, the note says so.
      </p>

      <label className="mt-4 block text-sm font-semibold text-dharma-muted">Search concepts
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="For example karma, कर्म or knowledge" className="mt-1 block min-h-[44px] w-full max-w-md rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text" />
      </label>
      <p role="status" aria-live="polite" className="mt-1 text-sm text-dharma-muted">{shown.length} of {concepts.length} concepts shown.</p>

      <div className="mx-auto mt-4 hidden max-w-xl lg:block">
        <div className="mb-2 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setScale((value) => Math.max(0.75, Math.round((value - 0.25) * 100) / 100))}
            disabled={scale <= 0.75}
            className="min-h-[44px] rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-semibold text-dharma-text disabled:cursor-not-allowed disabled:text-dharma-text-secondary"
          >
            छोटा
          </button>
          <button
            type="button"
            onClick={() => setScale((value) => Math.min(2, Math.round((value + 0.25) * 100) / 100))}
            disabled={scale >= 2}
            className="min-h-[44px] rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-semibold text-dharma-text disabled:cursor-not-allowed disabled:text-dharma-text-secondary"
          >
            बड़ा
          </button>
        </div>
        <div className="overflow-auto">
        <div style={{ width: `${scale * 100}%`, margin: '0 auto' }}>
        <svg viewBox="-280 -250 560 500" aria-hidden="true" className="h-auto w-full">
        {relations.map((r) => {
          const a = at(r.from), b = at(r.to);
          const on = shownIds.has(r.from) && shownIds.has(r.to);
          return <line key={`${r.from}-${r.to}-${r.typeLabel}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" strokeWidth={1.5} className="text-dharma-muted" opacity={on ? 0.55 : 0.12} />;
        })}
        {concepts.map((c, i) => {
          const p = pos(i);
          return (
            <g key={c.id} opacity={shownIds.has(c.id) ? 1 : 0.25}>
              <circle cx={p.x} cy={p.y} r={5} className="fill-saffron-700" />
              <text x={p.x * 1.17} y={p.y * 1.17 + 5} textAnchor="middle" fontSize="14" className="fill-dharma-text">{c.label}</text>
            </g>
          );
        })}
        </svg>
        </div>
        </div>
        <p className="mt-1 text-center text-sm text-dharma-muted">The diagram repeats the list below. The list has every detail.</p>
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-dharma-border p-4 text-sm text-dharma-muted">No concept matches “{q}”. Clear the search to see all twelve.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {shown.map((c) => {
            const mine = relations.filter((r) => r.from === c.id || r.to === c.id);
            return (
              <li key={c.id} className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
                <h2 className="font-serif text-xl font-bold text-dharma-text">
                  <Link href={`/concepts/${c.id}`} className="underline-offset-2 hover:underline">{c.label}</Link>{' '}
                  <span lang="sa" className="font-devanagari text-lg font-normal text-dharma-muted">{c.sanskrit}</span>{' '}
                  <span className="text-base font-normal italic text-dharma-muted">{c.transliteration}</span>
                </h2>
                <p className="mt-1 text-sm text-dharma-muted">{c.definition}</p>
                {c.practiceHref && c.practiceLabel && (
                  <p className="mt-2 text-sm">
                    <Link href={c.practiceHref} className="font-semibold text-saffron-600 underline underline-offset-2">{c.practiceLabel}</Link>
                  </p>
                )}
                {mine.length === 0 ? (
                  <p className="mt-2 text-sm text-dharma-muted">No relationship has been recorded for this concept yet.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {mine.map((r) => (
                      <li key={`${r.from}-${r.to}-${r.typeLabel}`} className="rounded-xl bg-dharma-bg p-3 text-sm">
                        <p className="font-semibold text-dharma-text">{r.typeLabel}: {label(r.from)} → {label(r.to)}</p>
                        <p className="text-dharma-muted">{r.note}</p>
                        <p className="mt-1 text-dharma-muted">Source: <Link href={r.href} className="inline-flex min-h-[44px] items-center text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{r.source}</Link> · {r.status}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <section aria-labelledby="vedanta-gap" className="mt-8 rounded-2xl border border-dharma-border bg-dharma-card p-4">
        <h2 id="vedanta-gap" className="font-serif text-xl font-bold text-dharma-text">
          <span lang="hi" className="font-devanagari">वेदान्त</span>
        </h2>
        <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
          वेदान्त का अलग लेख यहाँ नहीं है। ये पृष्ठ ब्रह्म, आत्मा, माया और मोक्ष खोलते हैं।
        </p>
        <ul className="mt-3 flex flex-wrap gap-3 text-sm">
          <li><Link href="/concepts/brahman" className="font-semibold text-saffron-600 underline underline-offset-2">ब्रह्म</Link></li>
          <li><Link href="/concepts/atman" className="font-semibold text-saffron-600 underline underline-offset-2">आत्मा</Link></li>
          <li><Link href="/concepts/maya" className="font-semibold text-saffron-600 underline underline-offset-2">माया</Link></li>
          <li><Link href="/concepts/moksha" className="font-semibold text-saffron-600 underline underline-offset-2">मोक्ष</Link></li>
        </ul>
      </section>
    </main>
  );
}
