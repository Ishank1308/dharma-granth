import Link from 'next/link';
import { getLineageMaster } from '@/data/wisdom-lineage';

/** Wisdom Lineage Layer strip (Phase 3). */
export function LineageStrip({ ids, noteEn, noteHi }: { ids: string[]; noteEn: string; noteHi: string }) {
  const masters = ids
    .map((id) => getLineageMaster(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  if (masters.length === 0) return null;
  return (
    <section aria-label="Wisdom lineage" className="apple-card rounded-card border border-dharma-border bg-dharma-card p-5 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">Wisdom lineage</p>
      <h2 className="mt-1 font-serif text-xl text-dharma-text">Transmitted across generations</h2>
      <p className="mt-2 text-sm leading-relaxed text-dharma-text">{noteEn}</p>
      <p lang="hi" className="mt-1 text-sm leading-relaxed text-dharma-muted">{noteHi}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {masters.map((m) => (
          <li key={m.id} className="rounded-xl bg-dharma-bg p-4">
            <p className="text-sm font-semibold text-dharma-text">
              {m.nameEn} <span lang="hi" className="text-dharma-muted">• {m.nameHi}</span>
            </p>
            <p className="mt-0.5 text-xs text-dharma-muted">
              {m.kindLabelEn} • {m.traditionEn} • {m.eraEn}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-dharma-text">{m.teachingEn}</p>
            <p lang="hi" className="mt-1 text-sm leading-relaxed text-dharma-muted">{m.teachingHi}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-dharma-muted">
        The scripture remains the authority; masters show how it was understood. See also{' '}
        <Link href="/wisdom-pathways/" className="underline">all pathways</Link>.
      </p>
    </section>
  );
}
