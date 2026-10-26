/**
 * The library's Agni Purana text files each printed page's footnotes (variant readings such as
 * "१ … इति ख॥ , ग॥ च … चिह्नितपुस्तकपाठः") in front of the next verse, joined to it by a page mark (":प् ३७४" in the
 * Sanskrit, ":p 374" in the transliteration). Publishing shows only the verse after the last page mark; the source
 * JSON keeps everything. A verse is cut only when it opens with a footnote number, the part cut away is plainly
 * editorial, and the Sanskrit and transliteration carry the same number of page marks, so a real verse is never cut.
 */

export const FOOTNOTE_SCRIPTURES: ReadonlySet<string> = new Set(['agnipuran']);

const OPENS_WITH_NOTE = /^\s*[०-९0-9]{1,2}\s/;
const PAGE_MARK_SA = /:\s*प्\s*[०-९0-9]+/g;
const PAGE_MARK_TR = /:\s*p\s*[0-9]+/g;
/** Manuscript sigla and editors' wording that never occur in verse text. */
const EDITORIAL = /चिह्नितपुस्तक|पुस्तकपाठ|पुस्तके नास्ति|पाठः|पाठो|इति साधुः|इति\s*[क-ञ]\s*[॥,]|[क-ञ]\s*॥\s*,\s*[क-ञ]\s*॥/;

const devanagariLetters = (s: string) => (s.match(/[अ-ह]/g) ?? []).length;
const latinLetters = (s: string) => (s.match(/[a-zāīūṛṝḷṅñṭḍṇśṣṃḥ]/gi) ?? []).length;

/** The published verse without its leading footnote block, or null when the verse is left as it is. */
export function stripPrintedFootnote(sanskrit: string, transliteration: string | undefined): { sanskrit: string; transliteration?: string } | null {
  if (!OPENS_WITH_NOTE.test(sanskrit)) return null;
  const marks = [...sanskrit.matchAll(PAGE_MARK_SA)];
  // One page mark only: with two, verse text could sit between them and would be cut.
  if (marks.length !== 1) return null;
  const last = marks[marks.length - 1];
  const cut = sanskrit.slice(0, last.index);
  const verse = sanskrit.slice(last.index! + last[0].length).trim();
  if (!EDITORIAL.test(cut) || devanagariLetters(verse) < 12) return null;

  if (transliteration === undefined) return { sanskrit: verse };
  const trMarks = [...transliteration.matchAll(PAGE_MARK_TR)];
  if (trMarks.length !== marks.length) return null;
  const trLast = trMarks[trMarks.length - 1];
  const trVerse = transliteration.slice(trLast.index! + trLast[0].length).trim();
  if (latinLetters(trVerse) < 8) return null;
  return { sanskrit: verse, transliteration: trVerse };
}
