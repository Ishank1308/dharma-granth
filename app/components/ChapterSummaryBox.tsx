import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { ChapterSummary } from '@/data/chapter-summaries';

/** "अध्याय सार" box at the top of a chapter that has a summary. Server-rendered, no client JS. */
export function ChapterSummaryBox({
  summary,
  unitHi,
  allHref,
  allLinkHi,
}: {
  summary: ChapterSummary;
  unitHi: string;
  allHref: string;
  allLinkHi: string;
}) {
  return (
    <section
      aria-labelledby="chapter-summary-heading"
      className="rounded-card border border-separator/80 bg-surface-raised p-5 sm:p-6 shadow-xs"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-fill-tertiary text-accent">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
        </div>
        <h2 id="chapter-summary-heading" className="text-subhead font-bold text-label-primary">
          <span lang="hi" className="font-devanagari">{unitHi} सार</span>
          <span className="font-normal text-label-secondary"> · Chapter Summary</span>
        </h2>
      </div>
      <p lang="hi" className="mt-3.5 font-devanagari text-body leading-relaxed text-label-primary sm:text-lg">
        {summary.summaryHi}
      </p>
      {summary.summaryEn && (
        <p lang="en" className="mt-2.5 font-serif text-subhead leading-relaxed text-label-secondary">
          {summary.summaryEn}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-separator/40 pt-3">
        {summary.review !== 'approved' && (
          <p className="text-caption-2 text-label-tertiary">Editorial summary, not scripture. Status: draft, awaiting editorial review.</p>
        )}
        <Link
          href={allHref}
          className="focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-pill border border-separator/80 bg-surface-elevated px-3 py-1 text-caption-1 font-semibold text-accent transition hover:bg-fill-quaternary shadow-xs"
        >
          <span lang="hi" className="font-devanagari">{allLinkHi}</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
