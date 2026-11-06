import type { ReactNode } from 'react';
import {
  SACRED_SECTION_LABEL,
  type SacredReadingSection,
} from '@/lib/sacred-reading-order';

/**
 * The three canonical pillars (CLAUDE.md §4) that every verse follows, wherever it is
 * rendered: the meaning section is भावार्थ (pillar 1), then व्याख्या (2) and आधुनिक संदर्भ (3).
 * The same numbering and names as the verse pages' VersePillar cards.
 */
const PILLAR: Partial<Record<SacredReadingSection, { n: number; hi: string; en: string; chip: string; dot: string }>> = {
  arth: { n: 1, hi: 'भावार्थ', en: 'Heart essence', chip: 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/30', dot: 'bg-amber-600 dark:bg-amber-400' },
  vyakhya: { n: 2, hi: 'व्याख्या', en: 'Exegesis', chip: 'bg-orange-500/20 text-orange-900 dark:text-orange-200 border-orange-500/30', dot: 'bg-orange-600 dark:bg-orange-400' },
  modern: { n: 3, hi: 'आधुनिक संदर्भ', en: 'Modern life', chip: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/30', dot: 'bg-emerald-600 dark:bg-emerald-400' },
};

/**
 * One section of the sacred reading order. Quiet bilingual eyebrow, generous
 * rhythm, dharma tokens only — the interface disappears and the wisdom remains.
 * The three pillar sections carry their "स्तम्भ N" chip. Rendered server-side
 * with no client JS of its own.
 */
export function SacredSection({
  id,
  section,
  badge,
  children,
}: {
  id: string;
  section: SacredReadingSection;
  badge?: ReactNode;
  children: ReactNode;
}) {
  const pillar = PILLAR[section];
  const label = pillar ?? SACRED_SECTION_LABEL[section];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="sacred-section">
      <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {pillar && (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wider ${pillar.chip}`}>
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${pillar.dot}`} />
            <span lang="hi" className="font-devanagari">स्तम्भ {pillar.n}</span>
          </span>
        )}
        <h3 id={`${id}-title`} className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <span lang="hi" className={`font-devanagari font-bold text-dharma-text ${pillar ? 'text-lg' : 'text-[15px]'}`}>
            {label.hi}
          </span>
          <span lang="en" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dharma-muted">
            {label.en}
          </span>
        </h3>
        {badge}
      </div>
      <div className="min-w-0 space-y-3">{children}</div>
    </section>
  );
}

/**
 * Vyakhya → Modern Context → Reflection as one connected reading flow: a single
 * calm rail joins the sections (see `.sacred-flow` in globals.css) so "what it
 * means" visibly flows into "how it appears in life today" with no tabs.
 */
export function ConnectedFlow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div role="group" aria-label={label} className="sacred-flow">
      {children}
    </div>
  );
}
