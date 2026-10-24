/**
 * Dharma Granth: Contextual Wisdom Recommendation Engine
 * 
 * 100% Client-Side, Local-First, Zero-Surveillance Heuristic Engine.
 * Generates transparent, explainable wisdom suggestions based on the user's
 * active context without dark patterns or engagement traps.
 */

import type { WisdomContextInput, WisdomRecommendation, CanonicalVerseRef } from './types';
import { CANONICAL_QUESTIONS, getQuestionById } from './question-wisdom';
import { CORE_EMOTIONS, getEmotionById } from './emotion-wisdom';

export function generateWisdomRecommendations(context: WisdomContextInput): WisdomRecommendation[] {
  const recommendations: WisdomRecommendation[] = [];
  const seenIds = new Set<string>();

  // 1. Recommendations based on Explored Questions
  for (const qId of context.exploredQuestionIds.slice(-2)) {
    const q = getQuestionById(qId);
    if (!q) continue;

    for (const v of q.primaryVerses) {
      const recId = `rec:q:${q.id}:${v.scriptureId}:${v.chapterNumber}:${v.verseNumber}`;
      if (seenIds.has(recId)) continue;
      seenIds.add(recId);

      recommendations.push({
        id: recId,
        type: 'verse',
        titleEn: v.citation,
        titleHi: v.citationHi,
        subtitleEn: v.translationEn.slice(0, 110) + '...',
        subtitleHi: v.translationHi.slice(0, 110) + '...',
        href: v.readerHref,
        reasonEn: `Recommended because you explored the question: "${q.questionEn}"`,
        reasonHi: `अनुशंसा क्योंकि आपने प्रश्न का अध्ययन किया: "${q.questionHi}"`,
        verse: v,
      });
    }
  }

  // 2. Recommendations based on Explored Emotions
  for (const eId of context.exploredEmotionIds.slice(-2)) {
    const emo = getEmotionById(eId);
    if (!emo) continue;

    for (const v of emo.primaryVerses) {
      const recId = `rec:e:${emo.id}:${v.scriptureId}:${v.chapterNumber}:${v.verseNumber}`;
      if (seenIds.has(recId)) continue;
      seenIds.add(recId);

      recommendations.push({
        id: recId,
        type: 'verse',
        titleEn: v.citation,
        titleHi: v.citationHi,
        subtitleEn: v.translationEn.slice(0, 110) + '...',
        subtitleHi: v.translationHi.slice(0, 110) + '...',
        href: v.readerHref,
        reasonEn: `Suggested for reflection on: "${emo.emotionEn}" (${emo.sanskritTerm})`,
        reasonHi: `मनन के लिए सुझाव: "${emo.emotionHi}" (${emo.sanskritTerm})`,
        verse: v,
      });
    }
  }

  // 3. Fallback recommendations if user is in fresh state
  if (recommendations.length < 3) {
    const defaultQuestions = [CANONICAL_QUESTIONS[0], CANONICAL_QUESTIONS[5]]; // Who am I? & How should I deal with failure?
    for (const q of defaultQuestions) {
      if (!q) continue;
      const v = q.primaryVerses[0];
      if (!v) continue;
      const recId = `rec:default:${q.id}`;
      if (seenIds.has(recId)) continue;
      seenIds.add(recId);

      recommendations.push({
        id: recId,
        type: 'verse',
        titleEn: v.citation,
        titleHi: v.citationHi,
        subtitleEn: v.translationEn.slice(0, 110) + '...',
        subtitleHi: v.translationHi.slice(0, 110) + '...',
        href: v.readerHref,
        reasonEn: `Foundational inquiry: "${q.questionEn}"`,
        reasonHi: `शास्त्रीय मूल प्रश्न: "${q.questionHi}"`,
        verse: v,
      });
    }
  }

  return recommendations.slice(0, 4);
}
