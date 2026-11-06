import Link from 'next/link';
import { CONCEPT_DETAILS } from '@/data/concept-details';
import { RELATION_LABEL, relationsFor } from '@/data/concept-relations';
import { REVIEW_LABEL } from '@/data/study-content';
import { readHref } from '@/lib/verse-paths';
import { VerseHrefLink } from '@/app/components/VerseHrefLink';

/** The relationships of one concept as a list, each with its type, the supporting verse and its review status. */
export function ConceptRelations({ conceptId }: { conceptId: string }) {
  const list = relationsFor(conceptId);
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="rel-heading" className="space-y-3">
      <h2 id="rel-heading" className="text-xl font-serif font-bold text-dharma-text">Relationships</h2>
      <p className="text-sm text-dharma-muted">Each link names its type and the verse that supports it. They are study aids, and traditions may read the verses differently. <Link href="/concepts/relationships" className="underline underline-offset-2">See all relationships</Link>.</p>
      <ul className="space-y-2">
        {list.map((r) => {
          const other = r.from === conceptId ? r.to : r.from;
          const direction = `${CONCEPT_DETAILS[r.from]?.label} → ${CONCEPT_DETAILS[r.to]?.label}`;
          return (
            <li key={`${r.from}-${r.to}-${r.type}`} className="rounded-xl border border-dharma-border bg-dharma-card p-3 text-sm">
              <p className="font-semibold text-dharma-text">
                {RELATION_LABEL[r.type]}: <Link href={`/concepts/${other}`} className="inline-flex min-h-[44px] items-center text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{CONCEPT_DETAILS[other]?.label ?? other}</Link>
                <span className="ml-2 font-normal text-dharma-muted">({direction})</span>
              </p>
              <p className="text-dharma-muted">{r.note}</p>
              <p className="mt-1 text-dharma-muted">
                Source: <VerseHrefLink href={readHref(r.evidence.scriptureId, r.evidence.chapter, r.evidence.verse)} className="inline-flex min-h-[44px] items-center text-saffron-800 underline underline-offset-2 dark:text-saffron-300">Bhagavad Gita {r.evidence.chapter}.{r.evidence.verse}</VerseHrefLink> · {REVIEW_LABEL[r.review]}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
