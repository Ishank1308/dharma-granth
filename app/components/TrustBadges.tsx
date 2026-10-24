import Link from 'next/link';
import { Archive, FileWarning, Languages, Lightbulb, Sparkles } from 'lucide-react';
import type { Badge } from '@/lib/review-badges';
import { EDITORIAL_DRAFT_LABEL, STUDY_TRANSLATION_LABEL } from '@/lib/editorial-terminology';

/**
 * Status of what a verse page shows, computed from flags the data really
 * carries. A "reviewed" or "verified" badge is deliberately not offered: the
 * project records no human review yet, so claiming one would be false. When a
 * review process exists, add the badge here and drive it from recorded data.
 */
export function TrustBadges({
  sourceHost,
  translationIsAi,
  commentaryIsAi,
  hasEditorial,
  badges,
  className = '',
}: {
  sourceHost?: string;
  translationIsAi: boolean;
  commentaryIsAi: boolean;
  hasEditorial: boolean;
  /** Badges computed from recorded reviews (lib/review-badges.ts). */
  badges?: Badge[];
  className?: string;
}) {
  const stillDraft = badges ? badges.some((b) => b.id === 'draft') : true;
  const earned = (badges ?? []).filter((b) => b.id === 'source-verified' || b.id === 'translation-reviewed' || b.id === 'commentary-reviewed' || b.id === 'correction-pending');
  const anyReview = earned.some((b) => b.id !== 'correction-pending') || (hasEditorial && !stillDraft);
  const chip = 'inline-flex min-h-[28px] items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold';
  return (
    <section aria-label="Status of this page's content" className={className}>
      <h2 className="sr-only">Content status</h2>
      <ul className="flex flex-wrap gap-2">
        <li className={`${chip} border-dharma-border bg-dharma-card text-dharma-text`}>
          <Archive className="h-3.5 w-3.5" aria-hidden="true" />
          Original text
        </li>
        <li
          className={`${chip} ${translationIsAi ? 'border-violet-500/40 bg-violet-50 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100' : 'border-dharma-border bg-dharma-card text-dharma-text'}`}
          title={translationIsAi ? STUDY_TRANSLATION_LABEL.detail : undefined}
        >
          {translationIsAi ? <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> : <Languages className="h-3.5 w-3.5" aria-hidden="true" />}
          {translationIsAi ? `Translation · ${STUDY_TRANSLATION_LABEL.en}` : 'Translation · from the source archive'}
        </li>
        {commentaryIsAi && (
          <li
            className={`${chip} border-violet-500/40 bg-violet-50 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100`}
            title={EDITORIAL_DRAFT_LABEL.detail}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Study notes · {EDITORIAL_DRAFT_LABEL.en}
          </li>
        )}
        {hasEditorial && (
          <li className={`${chip} border-stone-500/40 bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100`}>
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            {stillDraft ? 'Editorial explanation · draft, awaiting scholarly review' : 'Editorial explanation · reviewed'}
          </li>
        )}
        {earned.map((b) => (
          <li key={b.id} className={`${chip} ${b.id === 'correction-pending' ? 'border-amber-500/50 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100' : 'border-emerald-600/40 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100'}`}>
            {b.label}{b.detail ? ` · ${b.detail}` : ''}
          </li>
        ))}
      </ul>
      <p className="mt-2 flex items-start gap-2 text-sm text-dharma-muted">
        <FileWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {anyReview ? 'Reviews recorded for this verse are listed above.' : 'No independent human review is recorded for this verse yet.'}{' '}
          <Link href="/methodology" className="font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300">
            How this site is made
          </Link>
          .
        </span>
      </p>
    </section>
  );
}
