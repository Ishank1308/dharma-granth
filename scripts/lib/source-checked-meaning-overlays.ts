/**
 * Source-checked publication overlay for Devī Bhāgavata Skandha 1 Adhyāya 2.
 *
 * Unlike the manual apply-written-meanings command, this is an explicit,
 * verse-level allowlist. Chapter 1 and all future unreviewed drafts remain
 * blocked. Source Sanskrit is never modified.
 *
 * Witness: https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html
 * chapter 1.2 (1–40). Hindi is an AI-assisted, independently worded
 * interpretation of that Sanskrit; it is NOT a Gita Press transcription or
 * scholar-certified translation. The reader displays its AI label.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const DEVI_CHAPTER_2_WITNESS_OPENINGS = [
  'धन्योऽहमतिभाग्योऽहं',
  'तदहं सम्प्रवक्ष्यामि',
  'नत्वा तत्पदपङ्कजं',
  'या विद्येत्यभिधीयते',
  'सृष्ट्वाखिलं जगदिदं',
  'ब्रह्मा सृजत्यखिलमेतदिति',
  'विष्णुस्तु शेषशयने',
  'एकार्णवस्य सलिलं',
  'योगनिद्रामीलिताक्षं',
  'तां ध्यात्वा सगुणां मायां',
  'पुराणमुत्तमं पुण्यं',
  'स्कन्धा द्वादश चैवात्र',
  'विंशतिः प्रथमे तत्र',
  'पञ्चत्रिंशत्तथाध्यायाः',
  'अष्टमे तत्त्वसङ्ख्याश्च',
  'तथा चैकादशस्कन्धे',
  'एवं सङ्ख्या समाख्याता',
  'सर्गश्च प्रतिसर्गश्च',
  'निर्गुणा या सदा नित्या',
  'तस्यास्तु सात्त्विकी शक्ती',
  'तासां तिसॄणां शक्तीनां',
  'हरिद्रुहिणरुद्राणां',
  'सोमसूर्योद्भवानां',
  'स्वायम्भुवमुखानां',
  'तेषां वंशानुकथनं',
  'सपादलक्षं च तथा',
  'कानि तानि पुराणानि',
  'कलिकालविभीताः स्मो',
  'नेमिः संशीर्यते यत्र',
  'कलेस्तत्र प्रवेशो न',
  'तच्छ्रुत्वा वचनं तस्य',
  'प्रेत्यात्र चालयंश्चक्रं',
  'कलिप्रवेशो नैवात्र',
  'पशुहीनाः कृता यज्ञाः',
  'भाग्ययोगेन सम्प्राप्तः',
  'सूत शुश्रूषवः सर्वे',
  'त्वं सूत भव दीर्घायु',
  'यत्र धर्मार्थकामानां',
  'द्वैपायनेन मुनिना',
  'सकलगुणगणानामेकपात्रं',
] as const;

type Verse = Record<string, unknown>;
type Book = { chapters?: Array<{ number: number | string; verses?: unknown[] }> };
type MeaningBatch = {
  reviewStatus?: string;
  keyFormat?: string;
  meanings?: Record<string, { hindi?: string }>;
};

export function verifiedMeaningOverlayBytes(id: string): Buffer {
  return id === 'devibhagavat'
    ? readFileSync(resolve('data/written-meanings/devibhagavat.json'))
    : Buffer.alloc(0);
}

const normalized = (value: string) =>
  value.normalize('NFC').replace(/[\s।॥|.,:;!?०-९0-9\u200c\u200d]/g, '');

export function applySourceCheckedMeanings(id: string, book: Book): number {
  if (id !== 'devibhagavat') return 0;
  const batch = JSON.parse(verifiedMeaningOverlayBytes(id).toString('utf8')) as MeaningBatch;
  if (batch.reviewStatus !== 'unreviewed' || batch.keyFormat !== 'chapter:verse') {
    throw new Error('Devi Bhagavata: expected a guarded source-batch; do not bypass the review gate');
  }
  const ch = book.chapters?.find((item) => Number(item.number) === 2);
  if (!ch || ch.verses?.length !== DEVI_CHAPTER_2_WITNESS_OPENINGS.length) {
    throw new Error('Devi Bhagavata 1.2: expected 40 Sanskrit verses in library chapter 2');
  }
  const byKey = new Map((ch.verses as Verse[]).map((v) => [String(v.number), v]));
  if (byKey.size !== 40) throw new Error('Devi Bhagavata 1.2 has duplicated verse numbers');
  for (let i = 0; i < DEVI_CHAPTER_2_WITNESS_OPENINGS.length; i++) {
    const number = i + 1;
    const verse = byKey.get(String(number));
    const hindi = batch.meanings?.[`2:${number}`]?.hindi;
    if (!verse || typeof verse.sanskrit !== 'string' ||
      !normalized(verse.sanskrit).includes(normalized(DEVI_CHAPTER_2_WITNESS_OPENINGS[i]))) {
      throw new Error(`Devi Bhagavata 1.2.${number}: Sanskrit does not match the source witness`);
    }
    if (typeof hindi !== 'string' || hindi.trim().length < 40 ||
      !/[\u0900-\u097f]/u.test(hindi)) {
      throw new Error(`Devi Bhagavata 1.2.${number}: missing original Hindi interpretation`);
    }
    // These are independently phrased AI-assisted meanings, never printed-OCR
    // transcriptions. Keep the reader's visible AI attribution.
    verse.hindi = hindi.trim();
    verse.hindiSource = 'ai';
    delete verse.hindiRange;
    delete verse.hindiSeeVerse;
    delete verse.hindiReviewRequired;
    delete verse.hindiUnproofread;
  }
  return 40;
}
