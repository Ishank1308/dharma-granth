import type { ReactNode } from 'react';
import Link from 'next/link';
import { cleanVerseField, isLongPassage, meaningState, MEANING_COPY, verseLines, verseMarkNumber, formatVerseRef } from '@/lib/verse-format';

interface Props {
  verse: {
    number: number | string;
    sanskrit?: string;
    transliteration?: string;
    hindi?: string;
    hindiReviewRequired?: boolean;
    /** Hindi from a printed edition, published before it was proofread. */
    hindiUnproofread?: boolean;
    /** Hindi translating a range of verses together ("15-17"), stored on its first verse. */
    hindiRange?: string;
    /** This verse's Hindi is in the passage stored on that verse. */
    hindiSeeVerse?: number | string;
    translation?: string;
    /** English translating a range of verses together ("1.1-1.63", a whole hymn), stored on its first verse. */
    translationRange?: string;
    /** This verse's English is in the passage stored on that verse. */
    translationSeeVerse?: number | string;
  };
  chapterId: number;
  /** Decides how the verse reference is written (see formatVerseRef). */
  scriptureId?: string;
  /** Dedicated verse URL, when this scripture has verse pages. */
  href?: string;
  /** Bookmark and the rest. Chapter pages leave this empty. */
  actions?: ReactNode;
}

/**
 * A verse as plain, semantic HTML: the form every chapter page is exported
 * in, so crawlers, link previews and no-JS readers get the full text.
 * FullChapterVerses swaps each one for the interactive VerseCard right after
 * hydration. It mirrors the card's flat page layout, header and verse block
 * (same id, padding and line breaks) so the swap barely moves the layout, but carries
 * no toolbar, icons or animation: a rich card is ~13 KB of HTML per verse,
 * which would add ~2 GB across the 180k-verse export.
 * Styling lives in the short `.vt-*` classes in globals.css for the same
 * reason (repeated Tailwind lists cost ~1 KB per verse).
 */
export function VerseText({ verse: v, chapterId, scriptureId, href, actions }: Props) {
  const label = String(v.number);
  const sanskrit = cleanVerseField(v.sanskrit);
  const transliteration = cleanVerseField(v.transliteration).replace(/[\s|।॥0-9.]+$/, '');
  const hindi = cleanVerseField(v.hindi);
  const english = cleanVerseField(v.translation);
  const lines = sanskrit ? verseLines(sanskrit) : [];
  const state = meaningState(v);
  const title = `श्लोक ${label}`;
  const reference = (
    <>
      <span className="sr-only">श्लोक </span>
      {formatVerseRef(scriptureId, chapterId, label)}
    </>
  );
  return (
    <article id={`verse-${label}`} className="verse-card vt" aria-label={title}>
      <header className="vt-head">
        <h3 className="vt-title">
          {href ? <Link href={href}>{reference}</Link> : reference}
        </h3>
        {actions}
      </header>

      {lines.length > 0 && (
        <div className="vt-leaf verse-folio">
          <p lang="sa" className="vt-sa">
            {lines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
            <span className="vt-num" aria-hidden="true">॥ {verseMarkNumber(label)} ॥</span>
          </p>
          {transliteration && (
            <p lang="sa-Latn" className="vt-tr">
              {transliteration}
            </p>
          )}
        </div>
      )}

      {/* अर्थ: Hindi, then English, on every verse. A meaning not written yet says so in its place. */}
      {state.hi === 'pending' && state.en === 'pending' ? (
        <p className="vt-block vt-label vt-pending">
          <span lang="hi">{MEANING_COPY.bothPendingHi}</span> · <span lang="en">{MEANING_COPY.bothPendingEn}</span>
        </p>
      ) : (
        <>
          {state.hi === 'text' && (
            <Passage
              label={v.hindiRange ? MEANING_COPY.hiRange(v.hindiRange) : undefined}
              note={v.hindiUnproofread ? MEANING_COPY.hiUnproofread : undefined}
              lang="hi"
              className="vt-hi"
              text={hindi}
            />
          )}
          {state.hi === 'review' && (
            <p className="vt-block vt-label" lang="hi">
              {MEANING_COPY.hiReview}
            </p>
          )}
          {state.hi === 'with' && (
            <p className="vt-block vt-label" lang="hi">
              <a href={`#verse-${v.hindiSeeVerse}`}>{MEANING_COPY.hiWith(v.hindiSeeVerse!)}</a>
            </p>
          )}
          {state.hi === 'pending' && (
            <p className="vt-block vt-label vt-pending" lang="hi">
              {MEANING_COPY.hiPending}
            </p>
          )}
          {state.en === 'text' && (
            <Passage label={v.translationRange ? MEANING_COPY.enRange(v.translationRange) : undefined} lang="en" className="vt-en" text={english} />
          )}
          {state.en === 'with' && (
            <p className="vt-block vt-label" lang="en">
              <a href={`#verse-${v.translationSeeVerse}`}>{MEANING_COPY.enWith(v.translationSeeVerse!)}</a>
            </p>
          )}
          {state.en === 'pending' && (
            <p className="vt-block vt-label vt-pending" lang="en">
              {MEANING_COPY.enPending}
            </p>
          )}
        </>
      )}
    </article>
  );
}

/** One translation; a passage covering several verses carries its label, and a long one is folded under it. */
function Passage({ label, note, lang, className, text }: { label?: string; note?: string; lang: 'hi' | 'en'; className: string; text: string }) {
  if (label && isLongPassage(text)) {
    return (
      <details className="vt-block">
        <summary className="vt-label" lang={lang}>
          {label}
        </summary>
        {note && (
          <p className="vt-label" lang={lang}>
            {note}
          </p>
        )}
        <p lang={lang} className={`${className} vt-lines`}>
          {text}
        </p>
      </details>
    );
  }
  return (
    <div className="vt-block">
      {label && (
        <p className="vt-label" lang={lang}>
          {label}
        </p>
      )}
      {note && (
        <p className="vt-label" lang={lang}>
          {note}
        </p>
      )}
      <p lang={lang} className={className}>
        {text}
      </p>
    </div>
  );
}
