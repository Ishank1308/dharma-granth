/**
 * Finds per-verse meanings that do not belong to their verse, so publishing can leave them out.
 *
 * Several bulk texts (most Puranas, the Mahabharata) were filled from OCR of a printed translation laid over the
 * Sanskrit in reading order. The printed book does not break where the Sanskrit edition does, so the English and
 * Hindi drift onto other verses: Shiva Purana 21.26 (ganas striking heads) showed Upamanyu asking for milk, and one
 * Hindi line ("शिवको मेरा नमस्कार है") sat on 3,372 different verses. The explanation and research notes generated
 * from that Hindi inherit the drift.
 *
 * Alignment is measured, not assumed from the source label. A Hindi meaning of a verse shares words with it
 * (नारायण, देवताओं, यज्ञ…), and an English one carries its proper names (Shakuni, Vasishtha…). For each chapter we
 * count how often a verse's meaning shares a word with its own Sanskrit, and how often it shares one with the
 * Sanskrit of a verse half a chapter away. Aligned text scores far above that baseline (Gita Hindi: 89% against 12%);
 * drifted text scores the same as the baseline (Shiva Purana Hindi: 2% against 1%). A chapter too small to measure
 * takes its book's verdict. English made for one verse at a time (`translationSource: "ai"`) is not measured or
 * removed.
 *
 * Used when publishing, never on the source data. The reader then shows its "meaning not yet added" state, and
 * lib/verse-meaning.ts keeps those pages out of the sitemap.
 */
import { findTemplateFields } from './template-text';

/**
 * The stock sentences the bulk-generated explanation and research notes end with, exactly as generated. A note
 * that is "<a line>। <one of these>" says nothing about its own verse. Whole sentences, so a hand-written note
 * that happens to use a phrase such as "इस पंक्ति का बल" is not caught.
 */
export const STOCK_NOTE_FRAGMENTS = [
  'इस पंक्ति का बल इसी प्रसंग के नियम पर है, किसी अलग प्रसंग से लाई हुई सामान्य उक्ति पर नहीं',
  'इसे किसी एक घटना का संयोग न मानकर एक नियम की तरह पढ़ना इस पंक्ति का बल है',
  'जो विषय बार-बार मन में आता है, वही अगली क्रिया की दिशा बनता है। यह पंक्ति उसी मानसिक चयन को अपना विषय बनाती है',
  'श्रद्धा और सुरक्षित लगाव तनाव-प्रतिक्रिया को घटाते हैं। यह पंक्ति उसी आश्रय को अपना विषय बनाती है',
  'जो बार-बार किया जाता है, वह अगली प्रवृत्ति को मजबूत करता है। यह पंक्ति कर्म को उसी चक्र के रूप में देखती है',
  'दोहराया हुआ स्वर श्वास और अवधान को एक लय में लाता है। यहाँ शब्द केवल सूचना नहीं, साधना का साधन है',
  'देह के पदार्थ बदलते रहते हैं, पर जानने का बोध बना रहता है। यह पंक्ति उसी अंतर को कहती है',
  'आहार, निद्रा और इंद्रिय-भार शरीर की स्थिति को सीधे बदलते हैं। यह पंक्ति उस शारीरिक आधार को छोड़कर नहीं चलती',
  'प्रकाश, जल और ताप एक ही प्राकृतिक चक्र के रूप हैं। यह पंक्ति उन रूपों को एक व्यवस्था के अंग की तरह पढ़ती है',
  'धीमी श्वास वेगस तंत्रिका को सक्रिय कर भय-प्रतिक्रिया को शांत करती है। यह पंक्ति उसी श्वास और मन के संबंध को कहती है',
];

export const isStockNote = (t: unknown) => typeof t === 'string' && STOCK_NOTE_FRAGMENTS.some((f) => t.includes(f));

const compact = (s: string) => s.replace(/^Sense:\s*/, '').replace(/[\s\-–—|।॥०-९0-9.,;:!?()'"]/g, '');

/** `text` opens with `source` (the commentary "Sense: <translation>" pattern, or a note opening with the Hindi). */
export const echoes = (text: unknown, source: unknown) => {
  if (typeof text !== 'string' || typeof source !== 'string') return false;
  const lead = compact(source).slice(0, 40);
  return lead.length >= 12 && compact(text).startsWith(lead);
};

type Verse = Record<string, unknown>;
type Words = Set<string>;

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const fold = (s: string) => s.normalize('NFKD').replace(/[^\x00-\x7F]/g, '').toLowerCase();
/** Capitalised words that are sentence openers, not names. */
const NOT_NAMES = new Set(['thus', 'then', 'there', 'they', 'this', 'when', 'what', 'with', 'from', 'havin', 'that', 'those', 'these', 'salut', 'where', 'whose', 'which', 'being', 'after', 'again', 'other']);

/** Devanagari words of four or more letters, cut to four letters so inflected forms still meet. */
const devanagariStems = (s: string): Words => new Set((s.match(/[ऀ-ॿ]{4,}/g) ?? []).map((w) => w.slice(0, 4)));
const englishNames = (s: string): Words =>
  new Set((s.match(/\b[A-Z][a-zA-Zāīūṛṣṇṭḍśñ]{3,}/g) ?? []).map((w) => fold(w).slice(0, 5)).filter((w) => !NOT_NAMES.has(w)));
const romanStems = (s: string): Words => new Set((s.match(/[A-Za-zāīūṛṣṇṭḍśñ]{4,}/g) ?? []).map((w) => fold(w).slice(0, 5)));

/** Fewer measurable verses than this and a chapter takes its book's verdict. */
export const MIN_MEASURED = 30;

/**
 * True when the meanings match their own verses clearly better than they match other verses; null when there are
 * too few verses to tell. "Clearly" is at least twice the baseline and at least 10 points above it.
 */
export function isAligned(pairs: Array<[Words, Words]>): boolean | null {
  const usable = pairs.filter(([a, b]) => a.size > 0 && b.size > 0);
  const n = usable.length;
  if (n < MIN_MEASURED) return null;
  const meets = (a: Words, b: Words) => [...a].some((w) => b.has(w));
  const own = usable.filter(([a, b]) => meets(a, b)).length / n;
  const shift = Math.floor(n / 2);
  const baseline = usable.filter(([a], i) => meets(a, usable[(i + shift) % n][1])).length / n;
  return own >= 2 * baseline && own - baseline >= 0.1;
}

const MEASURES = {
  hindi: {
    applies: (v: Verse) => str(v.hindi).trim().length > 0,
    pair: (v: Verse): [Words, Words] => [devanagariStems(str(v.hindi)), devanagariStems(str(v.sanskrit))],
  },
  translation: {
    applies: (v: Verse) => str(v.translation).trim().length > 0 && v.translationSource !== 'ai',
    pair: (v: Verse): [Words, Words] => [englishNames(str(v.translation)), romanStems(str(v.transliteration))],
  },
} as const;

type Field = keyof typeof MEASURES;

export interface AlignmentCounts {
  translation: number;
  hindi: number;
  notes: number;
}

export interface AlignmentOptions {
  /**
   * Leaves a verse's Hindi and English alone: verses in the Hindi review registry (a later step withholds their Hindi
   * and keeps their English as it is), or pilot verses whose meaning an editor has already replaced. A kept verse is
   * neither changed nor counted in the repeat test or the alignment measurement, so the shard step and the build
   * check judge the same text. `field` lets a verse keep only one of them (refilled Hindi under review, see
   * lib/ocr-hindi-review.ts isReviewKept).
   */
  keepVerse?: (chapter: number | string, verse: string, field: 'hindi' | 'translation') => boolean;
  /**
   * Judge only chapters with enough verses to measure, never by their book's verdict. The build check uses this, so
   * it reports what is measurably wrong in the published data rather than re-deciding the small chapters.
   */
  measuredOnly?: boolean;
  /** Fields this book is exempt from (see ALIGNMENT_EXEMPT): neither removed nor counted. */
  skipFields?: readonly Field[];
}

/**
 * Books whose meanings were checked by eye and are aligned, but which the word test cannot measure (2026-10-26 audit).
 * Their Sanskrit runs whole sentences together without spaces (Maitri, Chandogya, Mundaka), or their English is a
 * close Vedic translation with few proper names (Griffith's Yajurveda), so a verse shares no stem with its own meaning.
 * The Yoga Sutra, Bhakti Sutra, Yoga Rasayanam, Shiva Swarodaya and Shiva Samhita English is written one sutra at a time from the Sanskrit (data/written-meanings/) and names almost
 * no one, so the name test has nothing to measure. The same holds for the Taittiriya and Kaushitaki passages written there
 * (2026-11-10): their passages are long prose, so any verse shares words with any meaning (Hindi baseline 0.81 and 0.56) and the
 * word test cannot tell its own meaning from another's, though each matches its own verse (1.00).
 * Two only trip the repeat test: the Samaveda repeats a mantra with variant spelling under the same Hindi, and the
 * Durga Saptashati's printed Hindi spans groups of verses (its 27 repeated lines are listed for editorial review).
 */
export const ALIGNMENT_EXEMPT: Record<Field, ReadonlySet<string>> = {
  hindi: new Set(['maitri', 'chandogya', 'mundaka', 'samaveda', 'durgasaptashati', 'taittiriya', 'kaushitaki']),
  translation: new Set(['maitri', 'chandogya', 'mundaka', 'yajurveda', 'yogasutra', 'naradabhaktisutra', 'shandilyabhaktisutra', 'taittiriya', 'kaushitaki', 'yogarasayanam', 'shivaswarodaya', 'shivasamhita']),
};

/** The fields `scriptureId` is exempt from, for AlignmentOptions.skipFields. */
export const exemptFields = (scriptureId: string): Field[] =>
  (Object.keys(ALIGNMENT_EXEMPT) as Field[]).filter((f) => ALIGNMENT_EXEMPT[f].has(scriptureId));

const NOTE_FIELDS = ['explanation', 'commentary', 'science', 'lifeLesson', 'wordMeaning'] as const;

/** Removes unaligned meanings from a parsed book in place and returns how many fields were removed. */
export function hideUnalignedMeanings(
  book: { chapters?: Array<{ number: number | string; verses?: unknown[] }> },
  { keepVerse = () => false, measuredOnly = false, skipFields = [] }: AlignmentOptions = {},
): AlignmentCounts {
  const counts: AlignmentCounts = { translation: 0, hindi: 0, notes: 0 };
  const chapters = (book.chapters ?? []).map((ch) => ({ ch, verses: (ch.verses ?? []) as Verse[] }));
  /** The field is present, judged by this measure, not exempt for this book, and its verse is not kept. */
  const judged = (chNumber: number | string, v: Verse, field: Field) =>
    !skipFields.includes(field) && MEASURES[field].applies(v) && !keepVerse(chNumber, String(v.number), field);

  /** Removes a meaning and the notes generated from it. */
  const drop = (v: Verse, field: Field) => {
    const value = v[field];
    delete v[field];
    if (field === 'translation') delete v.translationSource;
    counts[field]++;
    for (const f of NOTE_FIELDS) {
      if (echoes(v[f], value)) {
        delete v[f];
        counts.notes++;
      }
    }
  };

  // 1. A Hindi or English value repeated on several verses whose Sanskrit differs is a stray line, wherever it came
  //    from; a note ending in a stock sentence says nothing about its verse. Both go before alignment is measured, so
  //    the measurement sees the same text a second run would.
  const repeated = findTemplateFields(
    chapters.flatMap(({ ch, verses }) =>
      verses.map((v, i) => ({
        key: `${ch.number}:${i}`,
        sanskrit: str(v.sanskrit),
        fields: {
          hindi: judged(ch.number, v, 'hindi') ? str(v.hindi) : undefined,
          translation: judged(ch.number, v, 'translation') ? str(v.translation) : undefined,
        },
      })),
    ),
    { minLength: 12 },
  );
  for (const { ch, verses } of chapters) {
    verses.forEach((v, i) => {
      for (const field of ['hindi', 'translation'] as const) {
        if (judged(ch.number, v, field) && repeated.has(`${ch.number}:${i}|${field}`)) drop(v, field);
      }
      for (const f of NOTE_FIELDS) {
        if (isStockNote(v[f])) {
          delete v[f];
          counts.notes++;
        }
      }
    });
  }

  // 2. Meanings in a chapter that match their own verses no better than other verses belong to other verses.
  const judgedIn = (field: Field, chs: typeof chapters) => chs.flatMap(({ ch, verses }) => verses.filter((v) => judged(ch.number, v, field)));
  const measure = (field: Field, verses: Verse[]) => isAligned(verses.map(MEASURES[field].pair));
  const bookVerdict = { hindi: measure('hindi', judgedIn('hindi', chapters)), translation: measure('translation', judgedIn('translation', chapters)) };
  for (const c of chapters) {
    for (const field of ['hindi', 'translation'] as const) {
      const verses = judgedIn(field, [c]);
      const verdict = measure(field, verses) ?? (measuredOnly ? null : bookVerdict[field]);
      if (verdict !== false) continue;
      for (const v of verses) drop(v, field);
    }
  }
  return counts;
}
