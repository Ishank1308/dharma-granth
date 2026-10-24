/**
 * Dharma Granth: Daily Wisdom Sacred Rhythm Engine
 * 
 * Generates a date-deterministic daily contemplative bundle:
 * 1. Verse of the Day
 * 2. Reflection of the Day
 * 3. Question of the Day
 * 4. Wisdom Practice of the Day
 * 
 * Adheres strictly to non-extractive principles:
 * - No push notification spam
 * - No streak shame
 * - No engagement farming
 * - Sacred, quiet, intentional pacing
 */

import type { DailyWisdomBundle, CanonicalVerseRef } from './types';
import { CANONICAL_QUESTIONS } from './question-wisdom';
import { CORE_EMOTIONS } from './emotion-wisdom';

const DAILY_CURATED_VERSES: CanonicalVerseRef[] = [
  {
    scriptureId: 'bhagavadgita',
    scriptureName: 'Bhagavad Gita',
    scriptureNameHi: 'भगवद्गीता',
    chapterNumber: 2,
    verseNumber: 47,
    citation: 'Bhagavad Gita 2.47',
    citationHi: 'भगवद्गीता 2.47',
    sanskritDevanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    sanskritTransliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi ||',
    translationHi: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। कर्मफल के हेतु मत बनो और अकर्मण्यता में भी आसक्ति न हो।',
    translationEn: 'You have a right to action alone, never to its fruits. Let not the fruits of action be your motive, nor be attached to inaction.',
    readerHref: '/scripture/bhagavadgita/chapter/2/verse/47/',
  },
  {
    scriptureId: 'bhagavadgita',
    scriptureName: 'Bhagavad Gita',
    scriptureNameHi: 'भगवद्गीता',
    chapterNumber: 6,
    verseNumber: 5,
    citation: 'Bhagavad Gita 6.5',
    citationHi: 'भगवद्गीता 6.5',
    sanskritDevanagari: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    sanskritTransliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||',
    translationHi: 'मनुष्य को चाहिए कि वह अपने मन द्वारा अपना उद्धार करे, पतन न होने दे; क्योंकि मन ही अपना मित्र है और मन ही अपना शत्रु है।',
    translationEn: 'Elevate yourself through your own mind; do not degrade yourself. For the mind alone is one’s friend, and the mind alone is one’s enemy.',
    readerHref: '/scripture/bhagavadgita/chapter/6/verse/5/',
  },
  {
    scriptureId: 'bhagavadgita',
    scriptureName: 'Bhagavad Gita',
    scriptureNameHi: 'भगवद्गीता',
    chapterNumber: 2,
    verseNumber: 20,
    citation: 'Bhagavad Gita 2.20',
    citationHi: 'भगवद्गीता 2.20',
    sanskritDevanagari: 'न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे॥',
    sanskritTransliteration: 'na jāyate mriyate vā kadācin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ | ajo nityaḥ śāśvato \'yaṁ purāṇo na hanyate hanyamāne śarīre ||',
    translationHi: 'यह आत्मा न कभी जन्म लेता है और न कभी मरता है; यह अजन्मा, नित्य, शाश्वत और पुरातन है।',
    translationEn: 'The soul is never born, nor does it ever die. Unborn, eternal, ever-existing, and primeval, it is not slain when the body is slain.',
    readerHref: '/scripture/bhagavadgita/chapter/2/verse/20/',
  },
  {
    scriptureId: 'ishavasya',
    scriptureName: 'Isha Upanishad',
    scriptureNameHi: 'ईशावास्य उपनिषद्',
    chapterNumber: 1,
    verseNumber: 1,
    citation: 'Isha Upanishad 1',
    citationHi: 'ईशावास्य उपनिषद् 1',
    sanskritDevanagari: 'ईशा वास्यमिदँ सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥',
    sanskritTransliteration: 'īśā vāsyam idaṁ sarvaṁ yat kiñca jagatyāṁ jagat | tena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam ||',
    translationHi: 'इस परिवर्तनशील संसार में जो कुछ भी है, वह सब ईश्वर से व्याप्त है। त्यागपूर्वक उसका उपभोग करो; किसी के धन का लोभ मत करो।',
    translationEn: 'All this, whatsoever moves in this moving world, is enveloped by the Divine. Renouncing attachment, enjoy with contentment; do not covet anyone’s wealth.',
    readerHref: '/scripture/ishavasya/chapter/1/verse/1/',
  },
  {
    scriptureId: 'bhagavadgita',
    scriptureName: 'Bhagavad Gita',
    scriptureNameHi: 'भगवद्गीता',
    chapterNumber: 18,
    verseNumber: 66,
    citation: 'Bhagavad Gita 18.66',
    citationHi: 'भगवद्गीता 18.66',
    sanskritDevanagari: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    sanskritTransliteration: 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja | ahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
    translationHi: 'सब धर्मों को मुझमें समर्पित करके केवल मेरी शरण में आओ; मैं तुम्हें समस्त पापों से मुक्त कर दूँगा, शोक मत करो।',
    translationEn: 'Abandoning all varieties of duty, surrender unto Me alone. I shall liberate you from all negative consequences; do not grieve.',
    readerHref: '/scripture/bhagavadgita/chapter/18/verse/66/',
  },
];

export function getDailyWisdom(date = new Date()): DailyWisdomBundle {
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  // Deterministic daily hash
  const dayOfYear = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      (24 * 60 * 60 * 1000)
  );

  const verseIndex = dayOfYear % DAILY_CURATED_VERSES.length;
  const questionIndex = dayOfYear % CANONICAL_QUESTIONS.length;
  const emotionIndex = dayOfYear % CORE_EMOTIONS.length;

  const verse = DAILY_CURATED_VERSES[verseIndex]!;
  const q = CANONICAL_QUESTIONS[questionIndex]!;
  const e = CORE_EMOTIONS[emotionIndex]!;

  return {
    date: dateStr,
    verse,
    reflectionEn: `Today, reflect on the truth of ${verse.citation}. Whatever tasks emerge today, do them with pure presence rather than demanding applause or fearing failure.`,
    reflectionHi: `आज के दिन ${verse.citationHi} के भाव का मनन करें। जो भी कार्य सामने आए, उसे शांत चित्त से पूरा करें, फल की व्यग्रता छोड़ दें।`,
    questionOfTheDayEn: q.questionEn,
    questionOfTheDayHi: q.questionHi,
    practiceOfTheDayEn: e.practicalActions[0]?.actionEn || 'Pause for 60 seconds of silent diaphragmatic breath.',
    practiceOfTheDayHi: e.practicalActions[0]?.actionHi || '60 सेकेण्ड के लिए शांत होकर गहरी श्वास लें।',
    sacredNoteEn: 'Take this contemplation gently into your world. Leave this screen whenever you feel ready.',
    sacredNoteHi: 'इस विचार को शांति से अपने जीवन में उतारें। जब भी मन तृप्त हो, स्क्रीन बंद कर कार्य में लगें।',
  };
}
