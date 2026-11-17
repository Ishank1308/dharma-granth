/**
 * Source-checked publication overlays for Devī Bhāgavata Skandha 1 Adhyāyas 1 and 2, plus chapter 3 verses 1–25.
 *
 * Unlike the manual apply-written-meanings command, this is an explicit,
 * verse-level allowlist. All other unreviewed drafts remain
 * blocked. Source Sanskrit is never modified.
 *
 * Witness: https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html
 * chapters 1.1 (1–25), 1.2 (1–40) and 1.3 (1–25). Hindi is an AI-assisted, independently worded
 * interpretation of that Sanskrit; it is NOT a Gita Press transcription or
 * scholar-certified translation. The reader displays an editorial study-translation label and provides truthful AI-assistance provenance.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const DEVI_CHAPTER_1_WITNESS_OPENINGS = [
  'ॐ सर्वचैतन्यरूपां तां',
  'सूत सूत महाभाग',
  'अष्टादश पुराणानि',
  'पञ्चलक्षणयुक्तानि',
  'अस्माकं पुण्ययोगेन',
  'समाजोऽयं मुनीनां हि',
  'दीर्घायुर्भव सर्वज्ञ',
  'श्रोत्रेन्द्रिययुताः सूत',
  'यथा जिह्वेन्द्रियाह्लादः',
  'अश्रोत्राः फणिनः कामं',
  'अतः सर्वे द्विजाः सौम्य',
  'येन केनाप्युपायेन',
  'शास्त्राण्यपि विचित्राणि',
  'सात्त्विकं तत्र वेदान्तं',
  'तथैव च पुराणानि',
  'तत्र भागवतं पुण्यं',
  'उद्देशमात्रेण तदा',
  'विस्तरेण तदाख्याहि',
  'त्वं तु जानासि धर्मज्ञ',
  'श्रुतान्यन्यानि सर्वज्ञ',
  'धिक्सुधां पिबतां सूत',
  'सुधापाननिमित्तं यत्',
  'मखानां हि फलं स्वर्गः',
  'विना ज्ञानेन सर्वज्ञ',
  'अतः सर्वरसोपेतं',
] as const;

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

export const DEVI_CHAPTER_3_WITNESS_OPENINGS = [
  'सम्प्रवक्ष्यामि पुराणानि',
  'मद्वयं भद्वयं चैव',
  'चतुर्दशसहस्रं च',
  'चतुर्दशसहस्राणि',
  'अष्टादशसहस्रं वै',
  'द्वादशैव सहस्राणि',
  'अयुतं वामनाख्यं च',
  'त्रयोविंशतिसाहस्रं',
  'षोडशैव सहस्राणि',
  'पञ्चपञ्चाशत्साहस्रं',
  'एकोनविंशत्साहस्रं',
  'एकाशीतिसहस्राणि',
  'तथैवोपपुराणानि',
  'नारदीयं शिवं चैव',
  'वारुणं कालिकाख्यं च',
  'माहेश्वरं भागवतं',
  'अष्टादश पुराणानि कृत्वा',
  'मन्वन्तरेषु सर्वेषु',
  'द्वापरे द्वापरे विष्ण्णुर्व्यासरूपेण',
  'अल्पायुषोऽल्पबुद्धींश्च',
  'स्त्रीशूद्रद्विजबन्धूनां',
  'मन्वन्तरे सप्तमेऽत्र',
  'व्यासः सत्यवतीसूनुर्गुरुर्मे',
  'अतीतास्तु तथा व्यासाः',
  'ब्रूहि सूत महाभाग',
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
  let published = 0;
  const chapters: ReadonlyArray<readonly [number, number, readonly string[]]> = [
    [1, 25, DEVI_CHAPTER_1_WITNESS_OPENINGS],
    [2, 40, DEVI_CHAPTER_2_WITNESS_OPENINGS],
    [3, 43, DEVI_CHAPTER_3_WITNESS_OPENINGS],
  ];
  for (const [chapterNumber, expectedVerseCount, openings] of chapters) {
    const ch = book.chapters?.find((item) => Number(item.number) === chapterNumber);
    if (!ch || ch.verses?.length !== expectedVerseCount) {
      throw new Error(`Devi Bhagavata Skandha 1 chapter ${chapterNumber}: expected ${expectedVerseCount} Sanskrit verses`);
    }
    const byKey = new Map((ch.verses as Verse[]).map((v) => [String(v.number), v]));
    if (byKey.size !== expectedVerseCount) throw new Error(`Devi Bhagavata ${chapterNumber}: duplicate verse keys`);
    for (let i = 0; i < openings.length; i++) {
      const number = i + 1;
      const key = `${chapterNumber}:${number}`;
      const verse = byKey.get(String(number));
      const hindi = batch.meanings?.[key]?.hindi;
      if (!verse || typeof verse.sanskrit !== 'string' ||
          !normalized(verse.sanskrit).includes(normalized(openings[i]))) {
        throw new Error(`Devi Bhagavata ${key}: Sanskrit does not match numbered witness`);
      }
      if (typeof hindi !== 'string' || hindi.trim().length < 40 ||
          !/[\u0900-\u097f]/u.test(hindi)) {
        throw new Error(`Devi Bhagavata ${key}: independently drafted Hindi missing`);
      }
      verse.hindi = hindi.trim();
      verse.hindiSource = 'ai';
      delete verse.hindiRange;
      delete verse.hindiSeeVerse;
      delete verse.hindiReviewRequired;
      delete verse.hindiUnproofread;
      published++;
    }
  }
  return published;
}
