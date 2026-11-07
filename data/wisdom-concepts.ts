/**
 * Wisdom Discovery concept taxonomy (Phase 1).
 *
 * 25 life-oriented concepts for discovery ("I feel afraid" -> fear -> verses).
 * This is a discovery layer, not a second philosophy taxonomy: where a concept
 * matches an entry in `data/concepts.ts`, `libraryConceptId` points at it and
 * the philosophical definition stays there. Nothing here duplicates that file.
 */

export type WisdomConceptCategory =
  | 'duty-action'
  | 'mind-emotion'
  | 'devotion-love'
  | 'knowledge-purpose'
  | 'discipline-practice';

export const WISDOM_CONCEPT_CATEGORIES: Array<{
  key: WisdomConceptCategory;
  labelEn: string;
  labelHi: string;
}> = [
  { key: 'duty-action', labelEn: 'Duty & Action', labelHi: 'कर्तव्य और कर्म' },
  { key: 'mind-emotion', labelEn: 'Mind & Emotion', labelHi: 'मन और भाव' },
  { key: 'devotion-love', labelEn: 'Devotion & Love', labelHi: 'भक्ति और प्रेम' },
  { key: 'knowledge-purpose', labelEn: 'Knowledge & Purpose', labelHi: 'ज्ञान और उद्देश्य' },
  { key: 'discipline-practice', labelEn: 'Discipline & Practice', labelHi: 'संयम और साधना' },
];

export interface WisdomConceptVerseRef {
  scriptureId: string;
  chapter: number;
  verse: number | string;
  /** Human citation, e.g. "Bhagavad Gita 2.47". */
  reference: string;
}

export interface WisdomConcept {
  /** URL slug, also used under /knowledge/[slug]. */
  id: string;
  labelEn: string;
  labelHi: string;
  sanskrit: string;
  transliteration: string;
  category: WisdomConceptCategory;
  summaryEn: string;
  summaryHi: string;
  /** Matching id in data/concepts.ts, when one exists. Definition lives there. */
  libraryConceptId?: string;
  /** Other wisdom-concept ids a reader may explore next. */
  relatedConcepts: string[];
  /** Anchor verses that teach this concept. Editorial, not inferred. */
  keyVerses: WisdomConceptVerseRef[];
  /** wisdom-for-life topic slugs that explore this concept. */
  topicSlugs: string[];
}

/** JSON-serializable storage shape for one concept (API / export friendly). */
export type WisdomConceptRecord = WisdomConcept;

export function toStorageRecord(concept: WisdomConcept): WisdomConceptRecord {
  return JSON.parse(JSON.stringify(concept)) as WisdomConceptRecord;
}

export function fromStorageRecord(record: WisdomConceptRecord): WisdomConcept {
  assertValidWisdomConcept(record);
  return record;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function assertValidWisdomConcept(value: unknown): asserts value is WisdomConcept {
  const v = value as Partial<WisdomConcept>;
  if (!v || typeof v !== 'object') throw new Error('WisdomConcept must be an object');
  if (!isNonEmptyString(v.id)) throw new Error('WisdomConcept.id must be a non-empty string');
  if (!isNonEmptyString(v.labelEn)) throw new Error(`WisdomConcept ${v.id}: labelEn required`);
  if (!isNonEmptyString(v.labelHi)) throw new Error(`WisdomConcept ${v.id}: labelHi required`);
  if (!isNonEmptyString(v.sanskrit)) throw new Error(`WisdomConcept ${v.id}: sanskrit required`);
  if (!WISDOM_CONCEPT_CATEGORIES.some((c) => c.key === v.category)) {
    throw new Error(`WisdomConcept ${v.id}: unknown category ${String(v.category)}`);
  }
  if (!isNonEmptyString(v.summaryEn) || !isNonEmptyString(v.summaryHi)) {
    throw new Error(`WisdomConcept ${v.id}: summaryEn and summaryHi required`);
  }
  if (!Array.isArray(v.relatedConcepts) || !Array.isArray(v.keyVerses) || !Array.isArray(v.topicSlugs)) {
    throw new Error(`WisdomConcept ${v.id}: relatedConcepts, keyVerses and topicSlugs must be arrays`);
  }
  for (const ref of v.keyVerses) {
    if (!isNonEmptyString(ref.scriptureId) || !isNonEmptyString(ref.reference)) {
      throw new Error(`WisdomConcept ${v.id}: keyVerses entries need scriptureId and reference`);
    }
  }
}

/** Throws on duplicate ids or dangling relatedConcept links. Call at build/test time. */
export function validateWisdomConcepts(list: WisdomConcept[]): void {
  const ids = new Set<string>();
  for (const c of list) {
    assertValidWisdomConcept(c);
    if (ids.has(c.id)) throw new Error(`Duplicate WisdomConcept id: ${c.id}`);
    ids.add(c.id);
  }
  for (const c of list) {
    for (const next of c.relatedConcepts) {
      if (!ids.has(next)) throw new Error(`WisdomConcept ${c.id}: unknown relatedConcept ${next}`);
    }
  }
}

const gita = (chapter: number, verse: number, reference: string): WisdomConceptVerseRef => ({
  scriptureId: 'bhagavadgita',
  chapter,
  verse,
  reference,
});

export const wisdomConcepts: WisdomConcept[] = [
  {
    id: 'dharma',
    labelEn: 'Dharma',
    labelHi: 'धर्म',
    sanskrit: 'धर्म',
    transliteration: 'dharma',
    category: 'duty-action',
    summaryEn: 'The order that holds life together: duty done rightly, without evasion.',
    summaryHi: 'जीवन को धारण करने वाला नियम: कर्तव्य का निष्ठापूर्वक पालन।',
    libraryConceptId: 'dharma',
    relatedConcepts: ['duty', 'karma', 'truth', 'leadership', 'purpose'],
    keyVerses: [gita(2, 31, 'Bhagavad Gita 2.31'), gita(3, 35, 'Bhagavad Gita 3.35'), gita(18, 47, 'Bhagavad Gita 18.47')],
    topicSlugs: ['duty-and-decision-making', 'leadership'],
  },
  {
    id: 'karma',
    labelEn: 'Karma',
    labelHi: 'कर्म',
    sanskrit: 'कर्म',
    transliteration: 'karma',
    category: 'duty-action',
    summaryEn: 'Every act shapes the future. Act with care, and let go of the fruit.',
    summaryHi: 'प्रत्येक कर्म भविष्य गढ़ता है। यत्नपूर्वक कर्म करें, फल की आसक्ति छोड़ें।',
    libraryConceptId: 'karma',
    relatedConcepts: ['duty', 'detachment', 'discipline', 'service', 'purpose'],
    keyVerses: [gita(2, 47, 'Bhagavad Gita 2.47'), gita(3, 19, 'Bhagavad Gita 3.19'), gita(4, 17, 'Bhagavad Gita 4.17')],
    topicSlugs: ['skill-in-work', 'duty-and-decision-making'],
  },
  {
    id: 'bhakti',
    labelEn: 'Bhakti',
    labelHi: 'भक्ति',
    sanskrit: 'भक्ति',
    transliteration: 'bhakti',
    category: 'devotion-love',
    summaryEn: 'Love directed at the highest: devotion that steadies fear and grief.',
    summaryHi: 'परम की ओर उन्मुख प्रेम: भय और शोक को स्थिर करने वाली भक्ति।',
    libraryConceptId: 'bhakti',
    relatedConcepts: ['faith', 'compassion', 'service', 'inner-peace'],
    keyVerses: [gita(9, 26, 'Bhagavad Gita 9.26'), gita(10, 10, 'Bhagavad Gita 10.10'), gita(12, 13, 'Bhagavad Gita 12.13')],
    topicSlugs: ['relationships', 'grief-and-loss'],
  },
  {
    id: 'jnana',
    labelEn: 'Jnana',
    labelHi: 'ज्ञान',
    sanskrit: 'ज्ञान',
    transliteration: 'jñāna',
    category: 'knowledge-purpose',
    summaryEn: 'Discriminating knowledge: seeing what is permanent beneath what changes.',
    summaryHi: 'विवेकपूर्ण ज्ञान: परिवर्तन के पीछे जो नित्य है उसे देखना।',
    libraryConceptId: 'jnana',
    relatedConcepts: ['wisdom', 'truth', 'purpose', 'detachment', 'inner-peace'],
    keyVerses: [gita(2, 20, 'Bhagavad Gita 2.20'), gita(4, 38, 'Bhagavad Gita 4.38'), gita(10, 11, 'Bhagavad Gita 10.11')],
    topicSlugs: ['stress-and-worry'],
  },
  {
    id: 'moksha',
    labelEn: 'Moksha',
    labelHi: 'मोक्ष',
    sanskrit: 'मोक्ष',
    transliteration: 'mokṣa',
    category: 'knowledge-purpose',
    summaryEn: 'Freedom from the cycle of craving and fear: the final aim of life.',
    summaryHi: 'तृष्णा और भय के चक्र से मुक्ति: जीवन का परम लक्ष्य।',
    libraryConceptId: 'moksha',
    relatedConcepts: ['detachment', 'wisdom', 'inner-peace', 'purpose', 'meditation'],
    keyVerses: [gita(2, 71, 'Bhagavad Gita 2.71'), gita(5, 26, 'Bhagavad Gita 5.26'), gita(18, 66, 'Bhagavad Gita 18.66')],
    topicSlugs: ['grief-and-loss'],
  },
  {
    id: 'mind',
    labelEn: 'Mind',
    labelHi: 'मन',
    sanskrit: 'मनस्',
    transliteration: 'manas',
    category: 'mind-emotion',
    summaryEn: 'The mind can be friend or foe. It is trained, not obeyed.',
    summaryHi: 'मन मित्र भी हो सकता है, शत्रु भी। इसे साधा जाता है, इसका अनुसरण नहीं किया जाता।',
    libraryConceptId: 'manas',
    relatedConcepts: ['meditation', 'concentration', 'self-control', 'fear', 'anger'],
    keyVerses: [gita(6, 5, 'Bhagavad Gita 6.5'), gita(6, 6, 'Bhagavad Gita 6.6'), gita(6, 26, 'Bhagavad Gita 6.26')],
    topicSlugs: ['stress-and-worry', 'discipline', 'self-control'],
  },
  {
    id: 'discipline',
    labelEn: 'Discipline',
    labelHi: 'संयम',
    sanskrit: 'अभ्यास',
    transliteration: 'abhyāsa',
    category: 'discipline-practice',
    summaryEn: 'Steady practice over time: small vows kept daily reshape the mind.',
    summaryHi: 'समय के साथ स्थिर अभ्यास: प्रतिदिन निभाए गए छोटे संकल्प मन को बदल देते हैं।',
    relatedConcepts: ['concentration', 'self-control', 'meditation', 'patience', 'duty'],
    keyVerses: [gita(6, 35, 'Bhagavad Gita 6.35'), gita(2, 64, 'Bhagavad Gita 2.64'), gita(18, 37, 'Bhagavad Gita 18.37')],
    topicSlugs: ['discipline', 'self-control'],
  },
  {
    id: 'concentration',
    labelEn: 'Concentration',
    labelHi: 'एकाग्रता',
    sanskrit: 'धारणा',
    transliteration: 'dhāraṇā',
    category: 'discipline-practice',
    summaryEn: 'Gathering the scattered mind to one point before acting.',
    summaryHi: 'कर्म से पहले बिखरे मन को एक बिंदु पर समेटना।',
    libraryConceptId: 'dhyana',
    relatedConcepts: ['meditation', 'mind', 'discipline', 'wisdom', 'inner-peace'],
    keyVerses: [gita(2, 61, 'Bhagavad Gita 2.61'), gita(6, 12, 'Bhagavad Gita 6.12'), gita(8, 8, 'Bhagavad Gita 8.8')],
    topicSlugs: ['discipline'],
  },
  {
    id: 'fear',
    labelEn: 'Fear',
    labelHi: 'भय',
    sanskrit: 'भय',
    transliteration: 'bhaya',
    category: 'mind-emotion',
    summaryEn: 'Fear shrinks the world. Courage is built by facing duty, not by waiting.',
    summaryHi: 'भय संसार को सिकोड़ देता है। साहस कर्तव्य का सामना करने से बनता है, प्रतीक्षा से नहीं।',
    relatedConcepts: ['mind', 'faith', 'anger', 'inner-peace'],
    keyVerses: [gita(2, 3, 'Bhagavad Gita 2.3'), gita(2, 56, 'Bhagavad Gita 2.56'), gita(16, 1, 'Bhagavad Gita 16.1')],
    topicSlugs: ['stress-and-worry'],
  },
  {
    id: 'anger',
    labelEn: 'Anger',
    labelHi: 'क्रोध',
    sanskrit: 'क्रोध',
    transliteration: 'krodha',
    category: 'mind-emotion',
    summaryEn: 'Anger begins in frustrated desire and ends in confusion. Interrupt the chain early.',
    summaryHi: 'क्रोध अतृप्त कामना से जन्मता है और मोह में समाप्त होता है। शृंखला को आरंभ में ही तोड़ें।',
    relatedConcepts: ['attachment', 'mind', 'patience', 'compassion', 'self-control'],
    keyVerses: [gita(2, 62, 'Bhagavad Gita 2.62'), gita(2, 63, 'Bhagavad Gita 2.63'), gita(16, 21, 'Bhagavad Gita 16.21')],
    topicSlugs: ['anger'],
  },
  {
    id: 'compassion',
    labelEn: 'Compassion',
    labelHi: 'करुणा',
    sanskrit: 'करुणा',
    transliteration: 'karuṇā',
    category: 'devotion-love',
    summaryEn: 'Friendship toward all beings, without envy: strength expressed as kindness.',
    summaryHi: 'सभी प्राणियों के प्रति मैत्री, ईर्ष्या रहित: करुणा के रूप में प्रकट शक्ति।',
    relatedConcepts: ['bhakti', 'service', 'anger', 'inner-peace'],
    keyVerses: [gita(12, 13, 'Bhagavad Gita 12.13'), gita(12, 14, 'Bhagavad Gita 12.14'), gita(5, 25, 'Bhagavad Gita 5.25')],
    topicSlugs: ['relationships', 'grief-and-loss'],
  },
  {
    id: 'detachment',
    labelEn: 'Detachment',
    labelHi: 'वैराग्य',
    sanskrit: 'वैराग्य',
    transliteration: 'vairāgya',
    category: 'discipline-practice',
    summaryEn: 'Holding the world lightly: engaged in action, untouched by outcomes.',
    summaryHi: 'संसार को हल्के से थामना: कर्म में लगे रहना, फल से अलिप्त रहना।',
    relatedConcepts: ['attachment', 'karma', 'equanimity', 'meditation', 'moksha'],
    keyVerses: [gita(2, 48, 'Bhagavad Gita 2.48'), gita(5, 10, 'Bhagavad Gita 5.10'), gita(6, 35, 'Bhagavad Gita 6.35')],
    topicSlugs: ['stress-and-worry', 'contentment'],
  },
  {
    id: 'attachment',
    labelEn: 'Attachment',
    labelHi: 'आसक्ति',
    sanskrit: 'आसक्ति',
    transliteration: 'āsakti',
    category: 'mind-emotion',
    summaryEn: 'Clinging turns preference into bondage. Notice where desire hardens into demand.',
    summaryHi: 'पकड़ पसंद को बंधन बना देती है। देखें कि इच्छा कब माँग में बदलती है।',
    relatedConcepts: ['detachment', 'anger', 'fear', 'equanimity'],
    keyVerses: [gita(2, 62, 'Bhagavad Gita 2.62'), gita(3, 34, 'Bhagavad Gita 3.34'), gita(7, 11, 'Bhagavad Gita 7.11')],
    topicSlugs: ['stress-and-worry', 'contentment'],
  },
  {
    id: 'leadership',
    labelEn: 'Leadership',
    labelHi: 'नेतृत्व',
    sanskrit: 'नायकत्व',
    transliteration: 'nāyakatva',
    category: 'duty-action',
    summaryEn: 'People follow what leaders embody. Set the standard by living it first.',
    summaryHi: 'लोग उसी का अनुसरण करते हैं जो नेता जीता है। पहले स्वयं जिएँ, फिर मानक स्थापित करें।',
    relatedConcepts: ['dharma', 'duty', 'service', 'truth'],
    keyVerses: [gita(3, 21, 'Bhagavad Gita 3.21'), gita(3, 25, 'Bhagavad Gita 3.25'), gita(18, 43, 'Bhagavad Gita 18.43')],
    topicSlugs: ['leadership', 'duty-and-decision-making'],
  },
  {
    id: 'purpose',
    labelEn: 'Purpose',
    labelHi: 'उद्देश्य',
    sanskrit: 'प्रयोजन',
    transliteration: 'prayojana',
    category: 'knowledge-purpose',
    summaryEn: 'A life aimed at something larger than comfort does not drift.',
    summaryHi: 'सुख से बड़े लक्ष्य की ओर उन्मुख जीवन भटकता नहीं।',
    libraryConceptId: 'dharma',
    relatedConcepts: ['dharma', 'duty', 'karma', 'wisdom', 'service'],
    keyVerses: [gita(2, 31, 'Bhagavad Gita 2.31'), gita(3, 8, 'Bhagavad Gita 3.8'), gita(18, 46, 'Bhagavad Gita 18.46')],
    topicSlugs: ['duty-and-decision-making', 'skill-in-work'],
  },
  {
    id: 'duty',
    labelEn: 'Duty',
    labelHi: 'कर्तव्य',
    sanskrit: 'कर्तव्य',
    transliteration: 'kartavya',
    category: 'duty-action',
    summaryEn: 'Do what your role asks, whether or not it pleases you. That is duty.',
    summaryHi: 'आपकी भूमिका जो माँगे वही करें, चाहे रुचिकर हो या नहीं। यही कर्तव्य है।',
    libraryConceptId: 'dharma',
    relatedConcepts: ['dharma', 'karma', 'discipline', 'service', 'purpose'],
    keyVerses: [gita(2, 31, 'Bhagavad Gita 2.31'), gita(3, 35, 'Bhagavad Gita 3.35'), gita(18, 45, 'Bhagavad Gita 18.45')],
    topicSlugs: ['duty-and-decision-making', 'family-responsibilities'],
  },
  {
    id: 'service',
    labelEn: 'Service',
    labelHi: 'सेवा',
    sanskrit: 'सेवा',
    transliteration: 'sevā',
    category: 'duty-action',
    summaryEn: 'Work offered for others purifies the worker. Serve without keeping score.',
    summaryHi: 'दूसरों के लिए अर्पित कर्म कर्ता को शुद्ध करता है। हिसाब रखे बिना सेवा करें।',
    libraryConceptId: 'karma-yoga',
    relatedConcepts: ['karma', 'bhakti', 'compassion', 'duty', 'leadership'],
    keyVerses: [gita(3, 19, 'Bhagavad Gita 3.19'), gita(3, 25, 'Bhagavad Gita 3.25'), gita(12, 20, 'Bhagavad Gita 12.20')],
    topicSlugs: ['skill-in-work', 'relationships'],
  },
  {
    id: 'faith',
    labelEn: 'Faith',
    labelHi: 'श्रद्धा',
    sanskrit: 'श्रद्धा',
    transliteration: 'śraddhā',
    category: 'devotion-love',
    summaryEn: 'Trust that steadies effort: faith in the teaching, the path, and your capacity.',
    summaryHi: 'प्रयास को स्थिर करने वाला विश्वास: उपदेश, मार्ग और अपनी क्षमता में श्रद्धा।',
    libraryConceptId: 'bhakti',
    relatedConcepts: ['bhakti', 'patience', 'fear', 'purpose', 'inner-peace'],
    keyVerses: [gita(4, 39, 'Bhagavad Gita 4.39'), gita(9, 3, 'Bhagavad Gita 9.3'), gita(18, 66, 'Bhagavad Gita 18.66')],
    topicSlugs: ['stress-and-worry', 'grief-and-loss'],
  },
  {
    id: 'truth',
    labelEn: 'Truth',
    labelHi: 'सत्य',
    sanskrit: 'सत्य',
    transliteration: 'satya',
    category: 'knowledge-purpose',
    summaryEn: 'Truthfulness in speech and honesty in seeing: the foundation of all vows.',
    summaryHi: 'वाणी में सत्य और देखने में ईमानदारी: सभी व्रतों की नींव।',
    relatedConcepts: ['dharma', 'wisdom', 'jnana', 'leadership', 'inner-peace'],
    keyVerses: [gita(10, 5, 'Bhagavad Gita 10.5'), gita(16, 2, 'Bhagavad Gita 16.2'), gita(17, 15, 'Bhagavad Gita 17.15')],
    topicSlugs: ['duty-and-decision-making'],
  },
  {
    id: 'patience',
    labelEn: 'Patience',
    labelHi: 'धैर्य',
    sanskrit: 'धैर्य',
    transliteration: 'dhairya',
    category: 'discipline-practice',
    summaryEn: 'Enduring difficulty without breaking: patience is courage over time.',
    summaryHi: 'कठिनाई को बिना टूटे सहना: धैर्य समय के साथ टिका साहस है।',
    relatedConcepts: ['discipline', 'anger', 'faith', 'equanimity'],
    keyVerses: [gita(2, 14, 'Bhagavad Gita 2.14'), gita(2, 15, 'Bhagavad Gita 2.15'), gita(6, 25, 'Bhagavad Gita 6.25')],
    topicSlugs: ['stress-and-worry', 'discipline'],
  },
  {
    id: 'meditation',
    labelEn: 'Meditation',
    labelHi: 'ध्यान',
    sanskrit: 'ध्यान',
    transliteration: 'dhyāna',
    category: 'discipline-practice',
    summaryEn: 'Sitting with the mind until it settles: the daily practice behind all steadiness.',
    summaryHi: 'मन के स्थिर होने तक उसके साथ बैठना: समस्त स्थिरता के पीछे दैनिक अभ्यास।',
    libraryConceptId: 'dhyana',
    relatedConcepts: ['mind', 'concentration', 'discipline', 'inner-peace', 'detachment'],
    keyVerses: [gita(6, 11, 'Bhagavad Gita 6.11'), gita(6, 19, 'Bhagavad Gita 6.19'), gita(6, 27, 'Bhagavad Gita 6.27')],
    topicSlugs: ['discipline', 'stress-and-worry'],
  },
  {
    id: 'equanimity',
    labelEn: 'Equanimity',
    labelHi: 'समता',
    sanskrit: 'समता',
    transliteration: 'samatā',
    category: 'discipline-practice',
    summaryEn: 'Evenness in success and failure, praise and blame: yoga itself.',
    summaryHi: 'सफलता-असफलता, प्रशंसा-निंदा में समभाव: यही योग है।',
    libraryConceptId: 'yoga',
    relatedConcepts: ['detachment', 'karma', 'patience', 'inner-peace', 'wisdom'],
    keyVerses: [gita(2, 48, 'Bhagavad Gita 2.48'), gita(2, 15, 'Bhagavad Gita 2.15'), gita(12, 18, 'Bhagavad Gita 12.18')],
    topicSlugs: ['stress-and-worry', 'contentment'],
  },
  {
    id: 'wisdom',
    labelEn: 'Wisdom',
    labelHi: 'विवेक',
    sanskrit: 'विवेक',
    transliteration: 'viveka',
    category: 'knowledge-purpose',
    summaryEn: 'Discrimination between the passing and the permanent, applied to daily choice.',
    summaryHi: 'क्षणिक और नित्य के बीच भेद, दैनिक निर्णयों में प्रयुक्त।',
    libraryConceptId: 'jnana',
    relatedConcepts: ['jnana', 'truth', 'purpose', 'detachment', 'equanimity'],
    keyVerses: [gita(2, 16, 'Bhagavad Gita 2.16'), gita(2, 50, 'Bhagavad Gita 2.50'), gita(18, 20, 'Bhagavad Gita 18.20')],
    topicSlugs: ['duty-and-decision-making', 'stress-and-worry'],
  },
  {
    id: 'self-control',
    labelEn: 'Self-Control',
    labelHi: 'आत्मसंयम',
    sanskrit: 'आत्मसंयम',
    transliteration: 'ātmasaṃyama',
    category: 'discipline-practice',
    summaryEn: 'Mastery over senses and impulses: the senses obey a trained resolve.',
    summaryHi: 'इंद्रियों और आवेगों पर स्वामित्व: प्रशिक्षित संकल्प का इंद्रियाँ पालन करती हैं।',
    relatedConcepts: ['mind', 'discipline', 'meditation', 'anger', 'concentration'],
    keyVerses: [gita(2, 64, 'Bhagavad Gita 2.64'), gita(2, 68, 'Bhagavad Gita 2.68'), gita(5, 23, 'Bhagavad Gita 5.23')],
    topicSlugs: ['self-control', 'discipline'],
  },
  {
    id: 'inner-peace',
    labelEn: 'Inner Peace',
    labelHi: 'आंतरिक शांति',
    sanskrit: 'शान्ति',
    transliteration: 'śānti',
    category: 'mind-emotion',
    summaryEn: 'Stillness that remains when craving ends: peace is the fruit, not the pursuit.',
    summaryHi: 'तृष्णा के समाप्त होने पर शेष स्थिरता: शांति फल है, पीछा नहीं।',
    relatedConcepts: ['meditation', 'equanimity', 'detachment', 'faith', 'mind'],
    keyVerses: [gita(2, 70, 'Bhagavad Gita 2.70'), gita(2, 71, 'Bhagavad Gita 2.71'), gita(5, 29, 'Bhagavad Gita 5.29')],
    topicSlugs: ['stress-and-worry', 'grief-and-loss'],
  },
];

export function getAllWisdomConcepts(): WisdomConcept[] {
  return wisdomConcepts;
}

export function getWisdomConcept(idOrSlug: string): WisdomConcept | undefined {
  const needle = idOrSlug.trim().toLowerCase();
  return wisdomConcepts.find((c) => c.id === needle);
}

/** Display href for a wisdom concept: its knowledge hub. */
export function wisdomConceptHref(id: string): string {
  return `/knowledge/${id}/`;
}

