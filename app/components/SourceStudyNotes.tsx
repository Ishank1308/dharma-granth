import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { SCRIPTURE_PRIMARY_LINE } from '@/lib/editorial-terminology';
import { buildSourceRecord } from '@/lib/source-record';
import { buildLineageChain } from '@/lib/lineage-chain';

/**
 * Source & Study Notes (Phase 4): the verse page's compact trust block.
 * Mounted after Modern Context. Scripture-primary line first, then five
 * quiet rows; every row states only what the data records. Presentational
 * and client-safe, so verse pages (server) can render it directly.
 */
export function SourceStudyNotes({
  scriptureId,
  scriptureTitle,
  scriptureTitleSanskrit,
  verseRef,
  sourceHost,
  hindiIsAi,
  englishIsAi,
  commentaryIsAi,
  translationReview,
  className = '',
}: {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  verseRef: string;
  sourceHost?: string;
  hindiIsAi: boolean;
  englishIsAi: boolean;
  commentaryIsAi: boolean;
  translationReview?: string;
  className?: string;
}) {
  const record = buildSourceRecord(scriptureId, scriptureTitle, scriptureTitleSanskrit, {
    hindiIsAi,
    englishIsAi,
    commentaryIsAi,
    translationReview,
  });
  const lineage = buildLineageChain({ verseRef, scriptureId, scriptureTitle, scriptureTitleSanskrit });
  const translationAid =
    hindiIsAi || englishIsAi ? 'Study translation · review pending' : 'Translation as recorded';
  const studyAid = commentaryIsAi ? 'Study notes · editorial draft' : 'Study notes';

  const rows: { term: string; detail: string }[] = [
    {
      term: 'Original Sanskrit',
      detail: `${record.original.edition} · ${sourceHost ?? record.original.archive}.`,
    },
    {
      term: 'Traditional interpretive traditions',
      detail:
        lineage.commentator ??
        'No traditional commentator is recorded for this text; classical bhashya appear where reviewed.',
    },
    {
      term: 'Comparative references',
      detail: `${translationAid} · ${studyAid} · ${record.translations.review}.`,
    },
    {
      term: 'Cross-scriptural study',
      detail:
        lineage.acharyas.length + lineage.saints.length > 0
          ? `Taught through ${[...lineage.acharyas, ...lineage.saints].map((m) => m.nameEn).join(', ')}.`
          : 'Related verses and concepts are listed where recorded.',
    },
    {
      term: 'Research & review',
      detail:
        /not (recorded|yet)/i.test(record.editorialNotes.reviewer)
          ? 'No independent human review is recorded yet.'
          : `Reviewed by ${record.editorialNotes.reviewer} · ${record.editorialNotes.dateReviewed}.`,
    },
  ];

  return (
    <section aria-labelledby="source-study-notes" className={`rounded-2xl border border-dharma-border bg-dharma-card px-4 py-4 sm:px-5 ${className}`}>
      <h2 id="source-study-notes" className="flex items-center gap-2 text-sm font-bold text-dharma-text">
        <BookOpen className="h-4 w-4 text-saffron-700 dark:text-saffron-400" aria-hidden="true" />
        Source &amp; Study Notes
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-dharma-muted">{SCRIPTURE_PRIMARY_LINE}</p>
      <dl className="mt-3 space-y-2 border-t border-dharma-border/60 pt-3">
        {rows.map((row) => (
          <div key={row.term} className="grid gap-0.5 text-sm sm:grid-cols-[12rem_1fr] sm:gap-3">
            <dt className="font-semibold text-dharma-text">{row.term}</dt>
            <dd className="leading-relaxed text-dharma-muted">{row.detail}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-sm">
        <Link href="/how-dharma-granth-works/" className="font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300">
          What each layer is — and is not →
        </Link>
      </p>
    </section>
  );
}
