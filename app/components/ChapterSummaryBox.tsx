import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { GitaChapterSummary } from '@/data/gita-chapter-summaries';

/** "अध्याय सार" box at the top of a Gita chapter. Server-rendered, no client JS. */
export function ChapterSummaryBox({ summary, allHref }: { summary: GitaChapterSummary; allHref: string }) {
  return (
    <section
      aria-labelledby="chapter-summary-heading"
      className="mb-8 rounded-3xl border border-amber-200/90 bg-dharma-card p-6 shadow-sm dark:border-amber-900/60 sm:p-8"
    >
      <h2 id="chapter-summary-heading" className="font-serif text-xl font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">अध्याय सार</span>
        <span className="text-dharma-muted"> · Chapter summary</span>
      </h2>
      <p lang="hi" className="mt-3 font-devanagari text-lg leading-loose text-dharma-text">
        {summary.summaryHi}
      </p>
      <p lang="en" className="mt-3 leading-relaxed text-dharma-muted">
        {summary.summaryEn}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {summary.review !== 'approved' && (
          <p className="text-xs text-dharma-muted">Editorial summary, not scripture. Status: draft, awaiting editorial review.</p>
        )}
        <Link
          href={allHref}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-400"
        >
          <span lang="hi" className="font-devanagari">सभी 18 अध्यायों का सार</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
