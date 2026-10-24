/**
 * Dharma Granth: Ethical Wisdom Analytics Engine
 * 
 * Computes non-gamified, non-addictive self-knowledge metrics:
 * - Hours & Minutes of Study (strictly user-confirmed timer sessions)
 * - Topics Explored
 * - Reflections Written
 * - Questions Explored
 * - Scriptures Studied
 * - Wisdom Sessions Completed
 * 
 * Zero streaks, zero dopamine loops, zero leaderboards, zero shame.
 */

import type { EthicalWisdomAnalytics } from './types';
import { readStudySessions } from '../wellbeing-ledger';
import { readReflections } from './reflection-engine';

export const WOS_EXPLORED_QUESTIONS_KEY = 'dharma.wos.explored-questions.v1';
export const WOS_EXPLORED_EMOTIONS_KEY = 'dharma.wos.explored-emotions.v1';
export const WOS_STUDIED_SCRIPTURES_KEY = 'dharma.wos.studied-scriptures.v1';

function setToArray<T>(set: Set<T>): T[] {
  const result: T[] = [];
  set.forEach((item) => result.push(item));
  return result;
}

export function recordExploredQuestion(questionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = new Set<string>(JSON.parse(window.localStorage.getItem(WOS_EXPLORED_QUESTIONS_KEY) || '[]'));
    existing.add(questionId);
    window.localStorage.setItem(WOS_EXPLORED_QUESTIONS_KEY, JSON.stringify(setToArray(existing)));
  } catch {
    // Ignore quota issues
  }
}

export function recordExploredEmotion(emotionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = new Set<string>(JSON.parse(window.localStorage.getItem(WOS_EXPLORED_EMOTIONS_KEY) || '[]'));
    existing.add(emotionId);
    window.localStorage.setItem(WOS_EXPLORED_EMOTIONS_KEY, JSON.stringify(setToArray(existing)));
  } catch {
    // Ignore quota issues
  }
}

export function recordStudiedScripture(scriptureId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = new Set<string>(JSON.parse(window.localStorage.getItem(WOS_STUDIED_SCRIPTURES_KEY) || '[]'));
    existing.add(scriptureId);
    window.localStorage.setItem(WOS_STUDIED_SCRIPTURES_KEY, JSON.stringify(setToArray(existing)));
  } catch {
    // Ignore quota issues
  }
}

export function computeEthicalAnalytics(windowDays = 28): EthicalWisdomAnalytics {
  if (typeof window === 'undefined') {
    return {
      windowDays,
      studyHoursTotal: 0,
      studyMinutesTotal: 0,
      activeReadingDaysCount: 0,
      reflectionsWrittenCount: 0,
      questionsExploredCount: 0,
      emotionsExploredCount: 0,
      scripturesStudiedCount: 0,
      wisdomSessionsCompletedCount: 0,
    };
  }

  // 1. Study Sessions & Minutes (from local ledger)
  const sessions = readStudySessions();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const windowSessions = sessions.filter((s) => s.day >= cutoffStr);
  const totalMinutes = windowSessions.reduce((acc, s) => acc + s.minutes, 0);
  const uniqueDays = new Set(windowSessions.map((s) => s.day));

  // 2. Reflections Written
  const reflections = readReflections();
  const windowReflections = reflections.filter((r) => r.createdAt.slice(0, 10) >= cutoffStr);

  // 3. Explored Counts
  let questionsCount = 0;
  let emotionsCount = 0;
  let scripturesCount = 0;

  try {
    const qList: string[] = JSON.parse(window.localStorage.getItem(WOS_EXPLORED_QUESTIONS_KEY) || '[]');
    questionsCount = qList.length;
    const eList: string[] = JSON.parse(window.localStorage.getItem(WOS_EXPLORED_EMOTIONS_KEY) || '[]');
    emotionsCount = eList.length;
    const sList: string[] = JSON.parse(window.localStorage.getItem(WOS_STUDIED_SCRIPTURES_KEY) || '[]');
    scripturesCount = sList.length;
  } catch {
    // Graceful fallback
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    windowDays,
    studyHoursTotal: hours,
    studyMinutesTotal: minutes,
    activeReadingDaysCount: uniqueDays.size,
    reflectionsWrittenCount: windowReflections.length,
    questionsExploredCount: questionsCount,
    emotionsExploredCount: emotionsCount,
    scripturesStudiedCount: scripturesCount || (windowSessions.length > 0 ? 1 : 0),
    wisdomSessionsCompletedCount: windowSessions.length,
    lastStudyDate: windowSessions[windowSessions.length - 1]?.day,
  };
}
