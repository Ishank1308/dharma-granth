'use client';

/**
 * Pārāyaṇa Bookmark Persistence & Reading Plan Auto-Sync Engine
 *
 * Tracks in-progress chapter recitation bookmarks and synchronizes
 * chapter completions automatically with Sadhana Reading Plans on /practice.
 */

const STORAGE_PARAYANA_PROGRESS = 'dharma_parayana_progress';
const STORAGE_PARAYANA_BY_CHAPTER = 'dharma_parayana_by_chapter';
const STORAGE_PRACTICE_PLAN = 'dharma.practice.readingPlan';
const STORAGE_LEARN_PLANS = 'dharma.readingPlans.v1';

export interface ParayanaProgress {
  scriptureSlug: string;
  chapterNumber: number;
  verseNumber: number | string;
  timestamp: number;
}

/**
 * Get the last in-progress verse for a given chapter, if any.
 */
export function getParayanaChapterProgress(
  scriptureId: string,
  chapterId: number
): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_PARAYANA_BY_CHAPTER);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, { verseNumber: number | string; timestamp: number }>;
    const entry = map[`${scriptureId}_${chapterId}`];
    if (entry && entry.verseNumber) {
      const vNum = Number(entry.verseNumber);
      return !Number.isNaN(vNum) && vNum > 1 ? vNum : null;
    }
  } catch {}
  return null;
}

/**
 * Save in-progress recitation position for a chapter.
 */
export function saveParayanaChapterProgress(
  scriptureId: string,
  chapterId: number,
  verseNumber: number | string
): void {
  if (typeof window === 'undefined') return;
  try {
    const timestamp = Date.now();
    const progress: ParayanaProgress = {
      scriptureSlug: scriptureId,
      chapterNumber: chapterId,
      verseNumber,
      timestamp,
    };
    localStorage.setItem(STORAGE_PARAYANA_PROGRESS, JSON.stringify(progress));

    const chapterKey = `${scriptureId}_${chapterId}`;
    const raw = localStorage.getItem(STORAGE_PARAYANA_BY_CHAPTER);
    const map = raw ? JSON.parse(raw) : {};
    map[chapterKey] = { verseNumber, timestamp };
    localStorage.setItem(STORAGE_PARAYANA_BY_CHAPTER, JSON.stringify(map));

    window.dispatchEvent(new CustomEvent('dharma:parayana-progress-updated'));
  } catch {}
}

/**
 * Clear the in-progress bookmark when chapter recitation is complete.
 */
export function clearParayanaChapterProgress(
  scriptureId: string,
  chapterId: number
): void {
  if (typeof window === 'undefined') return;
  try {
    const chapterKey = `${scriptureId}_${chapterId}`;
    const raw = localStorage.getItem(STORAGE_PARAYANA_BY_CHAPTER);
    if (raw) {
      const map = JSON.parse(raw);
      delete map[chapterKey];
      localStorage.setItem(STORAGE_PARAYANA_BY_CHAPTER, JSON.stringify(map));
      window.dispatchEvent(new CustomEvent('dharma:parayana-progress-updated'));
    }
  } catch {}
}

/**
 * Automatically mark chapter/day complete in any active reading plan on /practice
 * or /learn/plans. Returns true if a plan was updated.
 */
export function markChapterCompleteInReadingPlan(
  scriptureId: string,
  chapterId: number
): boolean {
  if (typeof window === 'undefined') return false;
  let updated = false;

  // 1. Sync with /practice reading plan store
  try {
    const practiceRaw = localStorage.getItem(STORAGE_PRACTICE_PLAN);
    if (practiceRaw) {
      const planState = JSON.parse(practiceRaw) as {
        planId: string | null;
        completed: Record<string, number[]>;
      };

      if (planState.planId) {
        let isTarget = false;
        if (planState.planId === 'gita-18' && scriptureId === 'bhagavadgita') {
          isTarget = true;
        } else if (planState.planId === 'katha-6' && scriptureId === 'katha') {
          isTarget = true;
        }

        if (isTarget) {
          const done = planState.completed[planState.planId] ?? [];
          if (!done.includes(chapterId)) {
            planState.completed[planState.planId] = [...done, chapterId];
            localStorage.setItem(STORAGE_PRACTICE_PLAN, JSON.stringify(planState));
            updated = true;
          }
        }
      }
    }
  } catch {}

  // 2. Sync with /learn/plans store (READING_PLANS)
  try {
    const learnRaw = localStorage.getItem(STORAGE_LEARN_PLANS);
    if (learnRaw) {
      const learnMap = JSON.parse(learnRaw) as Record<string, number[]>;
      // Gita 18-day immersion
      if (scriptureId === 'bhagavadgita' && chapterId >= 1 && chapterId <= 18) {
        const key = 'gita-18-days';
        const done = learnMap[key] ?? [];
        if (!done.includes(chapterId)) {
          learnMap[key] = [...done, chapterId];
          localStorage.setItem(STORAGE_LEARN_PLANS, JSON.stringify(learnMap));
          updated = true;
        }
      }
    }
  } catch {}

  if (updated) {
    window.dispatchEvent(new CustomEvent('dharma:reading-plan-updated'));
  }

  return updated;
}
