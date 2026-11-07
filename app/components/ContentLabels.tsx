'use client';

import { CONTENT_LABELS, type ContentLabelKey } from '@/lib/content-labels';

/**
 * A small pill naming what kind of content a section is (original text,
 * explanation, modern reflection…), so readers can tell scripture apart from
 * editorial commentary. The hover text carries the full definition.
 */
export function ContentLabelBadge({ kind, className = '' }: { kind: ContentLabelKey; className?: string }) {
  const label = CONTENT_LABELS[kind];
  return (
    <span
      data-content-label={kind}
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight ${label.visualBadgeClass} ${className}`}
      title={`${label.labelEn} — ${label.authorityLevel}`}
    >
      <span lang="hi" className="font-devanagari">
        {label.labelHi}
      </span>
      <span aria-hidden="true" className="mx-1 opacity-50">
        ·
      </span>
      <span lang="en">{label.labelEn}</span>
    </span>
  );
}
