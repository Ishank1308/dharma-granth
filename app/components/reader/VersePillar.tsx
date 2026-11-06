import type { ReactNode } from 'react';

/**
 * The three canonical pillars of a verse page (CLAUDE.md §4): भावार्थ, व्याख्या and
 * आधुनिक संदर्भ. Server-renderable markup only; the card styles are the shared
 * `.apple-pillar-*` classes in globals.css that the chapter reader and the home page use.
 * Pillar 1 carries the printed translation (labelled अनुवाद, never rewritten).
 */
export type PillarKind = 'bhavartha' | 'vyakhya' | 'modern';

const PILLARS: Record<PillarKind, { n: number; hi: string; en: string; card: string; chip: string; dot: string }> = {
  bhavartha: {
    n: 1,
    hi: 'भावार्थ',
    en: 'Heart essence',
    card: 'apple-pillar-bhavartha',
    chip: 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/30',
    dot: 'bg-amber-600 dark:bg-amber-400',
  },
  vyakhya: {
    n: 2,
    hi: 'व्याख्या',
    en: 'Exegesis',
    card: 'apple-pillar-vyakhya',
    chip: 'bg-orange-500/20 text-orange-900 dark:text-orange-200 border-orange-500/30',
    dot: 'bg-orange-600 dark:bg-orange-400',
  },
  modern: {
    n: 3,
    hi: 'आधुनिक संदर्भ',
    en: 'Modern life',
    card: 'apple-pillar-modern',
    chip: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/30',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
  },
};

/** The pillar group. Stacked: each pillar holds long-form text that needs a full reading column. */
export function VersePillars({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5" role="group" aria-label="त्रि-स्तम्भ टीका · Three-pillar commentary">
      {children}
    </div>
  );
}

export function VersePillar({
  kind,
  hint,
  idPrefix = '',
  children,
}: {
  kind: PillarKind;
  hint?: string;
  /** Needed where several verses share a page (topic pages), so ids stay unique. */
  idPrefix?: string;
  children: ReactNode;
}) {
  const p = PILLARS[kind];
  const titleId = `${idPrefix}pillar-${kind}-title`;
  return (
    <section id={`${idPrefix}pillar-${kind}`} aria-labelledby={titleId} className={`apple-pillar ${p.card} p-4 sm:p-6`}>
      <header className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wider ${p.chip}`}>
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
          <span lang="hi" className="font-devanagari">स्तम्भ {p.n}</span>
        </span>
        <h2 id={titleId} className="font-serif text-lg font-bold text-dharma-text sm:text-xl">
          <span lang="hi" className="font-devanagari">{p.hi}</span>{' '}
          <span className="text-sm font-normal text-dharma-muted">· {p.en}</span>
        </h2>
        {hint && (
          <p lang="hi" className="w-full font-devanagari text-xs text-dharma-muted">
            {hint}
          </p>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
