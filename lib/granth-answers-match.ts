/**
 * Match a reader's own words to the Granth se Poochhiye question bank.
 * Client safe and model free: plain word matching over each answer's search
 * terms and question, tolerant of Hindi spelling variants (nukta, chandrabindu,
 * anusvara) and Hinglish.
 */

export interface QuestionBankEntry {
  slug: string;
  questionHi: string;
  questionEn: string;
  sarHi: string;
  terms: string[];
}

export interface QuestionMatch {
  entry: QuestionBankEntry;
  score: number;
}

/** Lowercase, drop nukta, fold candrabindu into anusvara, keep Latin and Devanagari letters only. */
export function normalizeQuery(text: string): string {
  return ` ${text
    .normalize('NFC')
    .toLowerCase()
    .replace(/़/g, '')
    .replace(/ँ/g, 'ं')
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

// Question words carry no topic, so they never decide a match on their own.
const STOP = new Set(
  'how what why who where when do i my me to the a an is am are of in on and or can should does with when it be from kya kaise kyon kyu kyun main mera meri mujhe hai hain se ko ka ki ke mein me karu karun karoon kare क्या कैसे क्यों कौन कहाँ मैं मेरा मेरी मुझे है हैं से को का की के में करूं करें और या भी तो'
    .split(' '),
);

function termScore(query: string, words: string[], term: string): number {
  const t = normalizeQuery(term).trim();
  if (!t || STOP.has(t)) return 0;
  // Phrases match as a whole; single words match a whole word or a word's start (क्रोध → क्रोधी).
  if (t.includes(' ')) return query.includes(` ${t} `) ? 3 + t.split(' ').length : 0;
  if (words.includes(t)) return 3;
  if (t.length >= 4 && words.some((w) => w.startsWith(t))) return 2;
  return 0;
}

export function matchQuestions(text: string, bank: QuestionBankEntry[], limit = 3): QuestionMatch[] {
  const query = normalizeQuery(text);
  const words = query.trim().split(' ').filter(Boolean);
  if (!words.length) return [];
  const content = words.filter((w) => !STOP.has(w) && w.length > 1);
  const scored = bank.map((entry) => {
    let score = 0;
    for (const term of entry.terms) score += termScore(query, words, term);
    // Words shared with the question itself, for phrasings no term covers.
    const qWords = new Set(normalizeQuery(`${entry.questionHi} ${entry.questionEn}`).trim().split(' '));
    for (const w of content) if (w.length > 2 && qWords.has(w)) score += 1;
    return { entry, score };
  });
  return scored
    .filter((m) => m.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
