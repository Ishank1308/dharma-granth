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
