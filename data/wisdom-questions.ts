/**
 * Wisdom Discovery sample questions (Phase 4).
 * Each question maps to wisdom concepts, anchor verses, teachings and
 * scriptures. All links are editorial; unknown slugs are skipped at
 * resolution time, never rendered as broken links.
 */
import type { WisdomConceptVerseRef } from './wisdom-concepts';

export interface WisdomQuestionVerseRef extends WisdomConceptVerseRef {}

export interface WisdomQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  /** wisdom-concept slugs (data/wisdom-concepts.ts). */
  conceptSlugs: string[];
  /** Anchor verses that answer the question. */
  verses: WisdomQuestionVerseRef[];
  /** wisdom-for-life topic slugs that explore the question. */
  topicSlugs: string[];
  /** Scripture ids where the answer is developed. */
  scriptureIds: string[];
  searchKeywords: string[];
}

const gita = (chapter: number, verse: number, reference: string): WisdomQuestionVerseRef => ({
  scriptureId: 'bhagavadgita',
  chapter,
  verse,
  reference,
});

export const wisdomQuestions: WisdomQuestion[] = [
  {
    id: 'how-to-act-without-anxiety-about-results',
    questionEn: 'How can I act without anxiety about results?',
    questionHi: 'फल की चिंता किए बिना कर्म कैसे करूँ?',
    conceptSlugs: ['karma', 'detachment', 'equanimity'],
    verses: [gita(2, 47, 'Bhagavad Gita 2.47'), gita(2, 48, 'Bhagavad Gita 2.48')],
    topicSlugs: ['skill-in-work', 'stress-and-worry'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['anxiety', 'results', 'nishkama karma', 'worry', 'फल', 'चिंता', 'action'],
  },
  {
    id: 'how-to-overcome-fear',
    questionEn: 'How do I overcome fear?',
    questionHi: 'भय पर विजय कैसे पाऊँ?',
    conceptSlugs: ['fear', 'faith', 'mind'],
    verses: [gita(2, 3, 'Bhagavad Gita 2.3'), gita(16, 1, 'Bhagavad Gita 16.1')],
    topicSlugs: ['stress-and-worry'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['fear', 'courage', 'भय', 'डर', 'afraid', 'bravery'],
  },
  {
    id: 'how-to-control-anger',
    questionEn: 'How can I control anger before it controls me?',
    questionHi: 'क्रोध मुझ पर हावी होने से पहले उसे कैसे रोकूँ?',
    conceptSlugs: ['anger', 'attachment', 'patience'],
    verses: [gita(2, 62, 'Bhagavad Gita 2.62'), gita(2, 63, 'Bhagavad Gita 2.63')],
    topicSlugs: ['anger'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['anger', 'rage', 'क्रोध', 'गुस्सा', 'temper'],
  },
  {
    id: 'what-is-my-duty-in-difficult-situations',
    questionEn: 'What is my duty when every choice feels wrong?',
    questionHi: 'जब हर विकल्प गलत लगे तब मेरा कर्तव्य क्या है?',
    conceptSlugs: ['duty', 'dharma', 'wisdom'],
    verses: [gita(2, 31, 'Bhagavad Gita 2.31'), gita(3, 35, 'Bhagavad Gita 3.35')],
    topicSlugs: ['duty-and-decision-making'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['duty', 'dilemma', 'decision', 'कर्तव्य', 'धर्म', 'choice', 'confused'],
  },
  {
    id: 'how-to-calm-a-restless-mind',
    questionEn: 'How do I calm a restless mind?',
    questionHi: 'चंचल मन को शांत कैसे करूँ?',
    conceptSlugs: ['mind', 'meditation', 'concentration'],
    verses: [gita(6, 5, 'Bhagavad Gita 6.5'), gita(6, 35, 'Bhagavad Gita 6.35')],
    topicSlugs: ['stress-and-worry', 'discipline'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['mind', 'restless', 'मन', 'चंचल', 'overthinking', 'calm', 'meditation'],
  },
  {
    id: 'how-to-build-discipline-that-lasts',
    questionEn: 'How do I build discipline that lasts?',
    questionHi: 'टिकने वाला संयम कैसे बनाऊँ?',
    conceptSlugs: ['discipline', 'self-control', 'patience'],
    verses: [gita(6, 35, 'Bhagavad Gita 6.35'), gita(2, 64, 'Bhagavad Gita 2.64')],
    topicSlugs: ['discipline', 'self-control'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['discipline', 'habit', 'संयम', 'आदत', 'consistency', 'practice', 'abhyasa'],
  },
  {
    id: 'how-to-let-go-of-attachment',
    questionEn: 'How do I let go of unhealthy attachment?',
    questionHi: 'अस्वस्थ आसक्ति को कैसे छोड़ूँ?',
    conceptSlugs: ['attachment', 'detachment', 'equanimity'],
    verses: [gita(2, 62, 'Bhagavad Gita 2.62'), gita(5, 10, 'Bhagavad Gita 5.10')],
    topicSlugs: ['stress-and-worry', 'contentment'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['attachment', 'letting go', 'आसक्ति', 'मोह', 'cling', 'detach'],
  },
  {
    id: 'how-to-find-purpose-in-work',
    questionEn: 'How do I find purpose in ordinary work?',
    questionHi: 'साधारण कार्य में उद्देश्य कैसे पाऊँ?',
    conceptSlugs: ['purpose', 'karma', 'service'],
    verses: [gita(3, 19, 'Bhagavad Gita 3.19'), gita(18, 46, 'Bhagavad Gita 18.46')],
    topicSlugs: ['skill-in-work', 'duty-and-decision-making'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['purpose', 'meaning', 'उद्देश्य', 'work', 'career', 'yajna'],
  },
  {
    id: 'how-to-lead-without-ego',
    questionEn: 'How do I lead others without ego?',
    questionHi: 'अहंकार के बिना नेतृत्व कैसे करूँ?',
    conceptSlugs: ['leadership', 'service', 'dharma'],
    verses: [gita(3, 21, 'Bhagavad Gita 3.21'), gita(3, 25, 'Bhagavad Gita 3.25')],
    topicSlugs: ['leadership'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['leadership', 'leader', 'नेतृत्व', 'ego', 'example', 'team'],
  },
  {
    id: 'how-to-practice-devotion-daily',
    questionEn: 'How can devotion become part of daily life?',
    questionHi: 'भक्ति दैनिक जीवन का अंग कैसे बने?',
    conceptSlugs: ['bhakti', 'faith', 'service'],
    verses: [gita(9, 26, 'Bhagavad Gita 9.26'), gita(12, 13, 'Bhagavad Gita 12.13')],
    topicSlugs: ['relationships'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['devotion', 'bhakti', 'भक्ति', 'love', 'devotee', 'worship'],
  },
  {
    id: 'how-to-face-grief-and-loss',
    questionEn: 'How do the wise face grief and loss?',
    questionHi: 'ज्ञानी शोक और हानि का सामना कैसे करते हैं?',
    conceptSlugs: ['wisdom', 'jnana', 'inner-peace'],
    verses: [gita(2, 20, 'Bhagavad Gita 2.20'), gita(2, 27, 'Bhagavad Gita 2.27')],
    topicSlugs: ['grief-and-loss'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['grief', 'loss', 'death', 'शोक', 'हानि', 'मृत्यु', 'sorrow'],
  },
  {
    id: 'how-to-stay-steady-in-success-and-failure',
    questionEn: 'How do I stay steady in success and failure?',
    questionHi: 'सफलता और असफलता में स्थिर कैसे रहूँ?',
    conceptSlugs: ['equanimity', 'detachment', 'inner-peace'],
    verses: [gita(2, 48, 'Bhagavad Gita 2.48'), gita(2, 70, 'Bhagavad Gita 2.70')],
    topicSlugs: ['stress-and-worry', 'contentment'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['balance', 'success', 'failure', 'समता', 'steady', 'samatva', 'सफलता'],
  },
  {
    id: 'how-to-serve-without-burning-out',
    questionEn: 'How do I serve others without burning out?',
    questionHi: 'बिना थके दूसरों की सेवा कैसे करूँ?',
    conceptSlugs: ['service', 'compassion', 'karma'],
    verses: [gita(3, 19, 'Bhagavad Gita 3.19'), gita(5, 25, 'Bhagavad Gita 5.25')],
    topicSlugs: ['skill-in-work', 'relationships'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['service', 'burnout', 'सेवा', 'help', 'seva', 'tired', 'compassion'],
  },
  {
    id: 'how-to-find-inner-peace-amid-noise',
    questionEn: 'How do I find inner peace amid constant noise?',
    questionHi: 'निरंतर शोर के बीच आंतरिक शांति कैसे पाऊँ?',
    conceptSlugs: ['inner-peace', 'meditation', 'mind'],
    verses: [gita(2, 70, 'Bhagavad Gita 2.70'), gita(6, 27, 'Bhagavad Gita 6.27')],
    topicSlugs: ['stress-and-worry'],
    scriptureIds: ['bhagavadgita'],
    searchKeywords: ['peace', 'noise', 'शांति', 'quiet', 'stillness', 'rest'],
  },
];

export function getAllWisdomQuestions(): WisdomQuestion[] {
  return wisdomQuestions;
}

export function getWisdomQuestion(id: string): WisdomQuestion | undefined {
  return wisdomQuestions.find((q) => q.id === id.trim().toLowerCase());
}

export function questionsForConcept(conceptSlug: string): WisdomQuestion[] {
  const needle = conceptSlug.trim().toLowerCase();
  return wisdomQuestions.filter((q) => q.conceptSlugs.some((c) => c.toLowerCase() === needle));
}

export function questionsForVerse(
  scriptureId: string,
  chapter: number,
  verse: number | string,
): WisdomQuestion[] {
  const v = String(verse);
  return wisdomQuestions.filter((q) =>
    q.verses.some(
      (ref) =>
        ref.scriptureId === scriptureId && ref.chapter === chapter && String(ref.verse) === v,
    ),
  );
}
