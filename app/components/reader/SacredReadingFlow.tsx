import type { ReactNode } from 'react';
import {
  SACRED_SECTION_LABEL,
  type SacredReadingSection,
} from '@/lib/sacred-reading-order';

/**
 * One section of the sacred reading order. Quiet bilingual eyebrow, generous
 * rhythm, dharma tokens only — the interface disappears and the wisdom remains.
 * Rendered server-side with no client JS of its own.
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
  const label = SACRED_SECTION_LABEL[section];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="sacred-section">
      <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <h3 id={`${id}-title`} className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <span lang="hi" className="font-devanagari text-[15px] font-bold text-dharma-text">
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
