import type { AnswerThemeId, GranthAnswer } from './types';
import { mindAnswers } from './mind';
import { workAnswers } from './work';
import { relationsAnswers } from './relations';
import { spiritAnswers } from './spirit';
import { lifeAnswers } from './life';

export * from './types';

export const GRANTH_ANSWERS: GranthAnswer[] = [
  ...mindAnswers,
  ...workAnswers,
  ...relationsAnswers,
  ...spiritAnswers,
  ...lifeAnswers,
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
