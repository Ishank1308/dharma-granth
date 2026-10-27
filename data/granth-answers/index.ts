import type { AnswerThemeId, GranthAnswer } from './types';
import { mindAnswers } from './mind';
import { crisisAnswers } from './crisis';
import { healthAnswers } from './health';
import { workAnswers } from './work';
import { livelihoodAnswers } from './livelihood';
import { relationsAnswers } from './relations';
import { familyAnswers } from './family';
import { homeAnswers } from './home';
import { spiritAnswers } from './spirit';
import { practiceAnswers } from './practice';
import { lifeAnswers } from './life';
import { selfAnswers } from './self';
import { seekerAnswers } from './seeker';
import { everydayAnswers } from './everyday';

export * from './types';

export const GRANTH_ANSWERS: GranthAnswer[] = [
  ...mindAnswers,
  ...crisisAnswers,
  ...healthAnswers,
  ...workAnswers,
  ...livelihoodAnswers,
  ...relationsAnswers,
  ...familyAnswers,
  ...homeAnswers,
  ...spiritAnswers,
  ...practiceAnswers,
  ...lifeAnswers,
  ...selfAnswers,
  ...seekerAnswers,
  ...everydayAnswers,
];

const BY_SLUG = new Map(GRANTH_ANSWERS.map((a) => [a.slug, a]));

export function getGranthAnswer(slug: string): GranthAnswer | undefined {
  return BY_SLUG.get(slug);
}

export function granthAnswersByTheme(theme: AnswerThemeId): GranthAnswer[] {
  return GRANTH_ANSWERS.filter((a) => a.theme === theme);
}

/** Answers that cite a verse, for the "this verse answers" links on its page. */
export function granthAnswersForVerse(scriptureId: string, chapter: number, verse: string | number): GranthAnswer[] {
  const v = String(verse);
  return GRANTH_ANSWERS.filter((a) => a.verses.some((x) => x.s === scriptureId && x.c === chapter && x.v === v));
}
