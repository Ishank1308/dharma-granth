import type { ReactNode } from 'react';
import Link from 'next/link';
import { cleanVerseField, toAsciiDigits, verseLines } from '@/lib/verse-format';

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
export function VerseText({ verse: v, chapterId, href, actions }: Props) {
  const label = String(v.number);
  const sanskrit = cleanVerseField(v.sanskrit);
  const transliteration = cleanVerseField(v.transliteration).replace(/[\s|।॥0-9.]+$/, '');
  const hindi = cleanVerseField(v.hindi);
  const english = cleanVerseField(v.translation);
  const lines = sanskrit ? verseLines(sanskrit) : [];
  const title = `श्लोक ${label}`;
  const reference = (
    <>
      <span className="sr-only">श्लोक </span>
      {toAsciiDigits(chapterId)}.{toAsciiDigits(label)}
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
            <span className="vt-num" aria-hidden="true">॥ {toAsciiDigits(label)} ॥</span>
          </p>
          {transliteration && (
            <p lang="sa-Latn" className="vt-tr">
              {transliteration}
            </p>
          )}
        </div>
      )}

      {hindi && (
        <div className="vt-block">
          {v.hindiRange && (
            <p className="vt-label" lang="hi">
              श्लोक {toAsciiDigits(v.hindiRange.replace('-', '–'))} का हिन्दी अर्थ
            </p>
          )}
          {v.hindiUnproofread && (
            <p className="vt-label" lang="hi">
              मुद्रित संस्करण से, प्रूफ़ जाँच शेष
            </p>
          )}
          <p lang="hi" className="vt-hi">
            {hindi}
          </p>
        </div>
      )}
      {!hindi && v.hindiReviewRequired && (
        <p className="vt-block vt-label" lang="hi">
          हिन्दी अर्थ स्रोत-संस्करण से सत्यापनाधीन है।
        </p>
      )}
      {!hindi && v.hindiSeeVerse != null && (
        <p className="vt-block vt-label" lang="hi">
          अर्थ श्लोक <a href={`#verse-${v.hindiSeeVerse}`}>{toAsciiDigits(String(v.hindiSeeVerse))}</a> के साथ
        </p>
      )}
      {english && !v.translationRange && (
        <div className="vt-block">
          <p lang="en" className="vt-en">
            {english}
          </p>
        </div>
      )}
      {english && v.translationRange && (
        <details className="vt-block">
          <summary className="vt-label" lang="en">
            English for verses {v.translationRange.replace('-', '–')}, translated together
          </summary>
          <p lang="en" className="vt-en vt-lines">
            {english}
          </p>
        </details>
      )}
      {!english && v.translationSeeVerse != null && (
        <p className="vt-block vt-label" lang="en">
          English with verse <a href={`#verse-${v.translationSeeVerse}`}>{String(v.translationSeeVerse)}</a>
        </p>
      )}
    </article>
  );
}
