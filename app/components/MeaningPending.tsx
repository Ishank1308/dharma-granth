import React from 'react';
import { toAsciiDigits } from '@/lib/verse-format';
import type { NearbyMeaning } from '@/lib/verse-has-meaning';

/**
 * What a reader sees where a verse has no meaning yet. The notice states only what this component can establish,
 * keeps the verse readable, and points to the nearest verses that do have a meaning.
 */

const pill =
  'inline-flex min-h-11 items-center rounded-full border border-dharma-border bg-dharma-card px-3 text-xs font-semibold text-saffron-800 transition hover:border-saffron-300 dark:text-saffron-200';

const ref = (chapterId: number, verse: string) => `${toAsciiDigits(chapterId)}.${toAsciiDigits(verse)}`;

/** Once per chapter page, above the verses, when some of them have no meaning yet. */
export function MeaningPendingNotice({
  chapterId,
  pending,
  total,
  summary,
  withMeaning,
}: {
  chapterId: number;
  /** Verses on this page without a meaning. */
  pending: number;
  /** Verses on this page. */
  total: number;
  /** The chapter's own summary, when it has one. */
  summary?: string;
  /** The first few verses on this page that do have a meaning. */
  withMeaning: string[];
}) {
  const all = pending === total;
  const n = toAsciiDigits(pending);
  return (
    <section aria-labelledby="meaning-pending-title" className="mb-8 rounded-2xl border border-dashed border-dharma-border bg-dharma-bg/60 p-4 sm:p-5">
      <h2 id="meaning-pending-title" className="text-sm font-semibold text-dharma-text">
        <span lang="hi" className="font-devanagari">अर्थ अभी उपलब्ध नहीं है</span>{' '}
        <span aria-hidden="true">·</span> <span lang="en">Meanings not yet available</span>
      </h2>
      <p lang="hi" className="mt-2 font-devanagari text-sm leading-relaxed text-dharma-muted">
        {all ? `इस पृष्ठ के सभी ${n} श्लोकों` : `इस पृष्ठ के ${n} श्लोकों`} का अर्थ अभी उपलब्ध नहीं है। आप नीचे उपलब्ध मूल पाठ और लिप्यंतरण पढ़ सकते हैं।
      </p>
      <p lang="en" className="mt-1 text-sm leading-relaxed text-dharma-muted">
        Meaning is not yet available for {all ? `all ${n} verses` : `${n} verses`} on this page. You can read the original text and any available transliteration below.
      </p>
      {summary && (
        <div className="mt-4 border-t border-dharma-border/60 pt-3">
          <p className="text-xs font-semibold text-dharma-text">
            <span lang="hi" className="font-devanagari">अध्याय का सार</span> <span aria-hidden="true">·</span>{' '}
            <span lang="en">Chapter summary</span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-dharma-text">{summary}</p>
        </div>
      )}
      {withMeaning.length > 0 && (
        <nav aria-label="अर्थ सहित श्लोक · Verses with a meaning" className="mt-4">
          <p className="text-xs text-dharma-muted">
            <span lang="hi" className="font-devanagari">अर्थ सहित श्लोक</span> <span aria-hidden="true">·</span>{' '}
            <span lang="en">Verses with a meaning</span>
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {withMeaning.map((v) => (
              <li key={v}>
                <a href={`#verse-${v}`} className={pill}>
                  {ref(chapterId, v)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}

/** In a verse card without a meaning: the honest line, the transliteration when that layer is off, and the nearest verses with one. */
export function MeaningPendingNote({
  chapterId,
  transliteration,
  nearby,
  hasExplanation = false,
}: {
  chapterId: number;
  /** Shown here only when the reader has the transliteration layer turned off. */
  transliteration?: string;
  nearby?: NearbyMeaning;
  /** The card still shows a व्याख्या below, so only the literal translation is missing. */
  hasExplanation?: boolean;
}) {
  if (hasExplanation) {
    return (
      <div className="min-w-0 flex-1">
        <p lang="hi" className="font-devanagari text-sm text-dharma-muted">
          इस श्लोक का शब्दशः अनुवाद अभी नहीं जोड़ा गया है; नीचे दी गई व्याख्या इसका अर्थ समझाती है।
        </p>
        <p lang="en" className="mt-0.5 text-xs text-dharma-muted">
          A line-by-line translation is not added yet; the explanation below gives the meaning.
        </p>
      </div>
    );
  }
  return (
    <div className="min-w-0 flex-1">
      {transliteration && (
        <p lang="sa-Latn" className="mb-2 text-sm italic leading-relaxed text-dharma-muted">
          {transliteration.replace(/[\s|।॥0-9.]+$/, '')}
        </p>
      )}
      <p lang="hi" className="font-devanagari text-sm text-dharma-muted">
        इस श्लोक का अर्थ अभी उपलब्ध नहीं है।
      </p>
      <p lang="en" className="mt-0.5 text-xs text-dharma-muted">
        Meaning is not yet available for this verse.
      </p>
      {(nearby?.prev || nearby?.next) && (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-dharma-muted">
          <span>
            <span lang="hi" className="font-devanagari">पास के अर्थ सहित श्लोक</span> <span aria-hidden="true">·</span>{' '}
            <span lang="en">Nearest with a meaning</span>
          </span>
          {nearby.prev && (
            <a href={`#verse-${nearby.prev}`} aria-label={`पिछला अर्थ सहित श्लोक ${ref(chapterId, nearby.prev)} · Previous verse with meaning ${ref(chapterId, nearby.prev)}`} className={pill}>
              <span aria-hidden="true">←&nbsp;</span>
              {ref(chapterId, nearby.prev)}
            </a>
          )}
          {nearby.next && (
            <a href={`#verse-${nearby.next}`} aria-label={`अगला अर्थ सहित श्लोक ${ref(chapterId, nearby.next)} · Next verse with meaning ${ref(chapterId, nearby.next)}`} className={pill}>
              {ref(chapterId, nearby.next)}
              <span aria-hidden="true">&nbsp;→</span>
            </a>
          )}
        </p>
      )}
    </div>
  );
}
