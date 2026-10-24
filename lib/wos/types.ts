/**
 * Dharma Granth: Wisdom Operating System (WOS) Type Definitions
 * 
 * Strict local-first, privacy-sovereign, non-gamified data contracts
 * supporting cognitive transformation: Information -> Reflection -> Understanding -> Action.
 */

// ─── 1. Question-First Architecture Types ─────────────────────────────────────

export interface CanonicalVerseRef {
  scriptureId: string;
  scriptureName: string;
  scriptureNameHi: string;
  chapterNumber: number;
  verseNumber: number | string;
  citation: string;
  citationHi: string;
  sanskritDevanagari: string;
  sanskritTransliteration: string;
  translationHi: string;
  translationEn: string;
  readerHref: string;
  commentarySnippet?: string;
  commentarySnippetHi?: string;
}

export interface QuestionWisdomRecord {
  id: string; // e.g., 'who-am-i'
  questionEn: string;
  questionHi: string;
  sanskritInquiry: string; // e.g. "कोऽहम्? (Koham?)"
  category: 'identity' | 'emotion-control' | 'suffering' | 'purpose' | 'fear' | 'failure' | 'attachment' | 'dharma' | 'karma' | 'success';
  philosophicalPivotEn: string;
  philosophicalPivotHi: string;
  keyTeachings: Array<{
    titleEn: string;
    titleHi: string;
    explanationEn: string;
    explanationHi: string;
  }>;
  primaryVerses: CanonicalVerseRef[];
  reflectionPrompts: string[];
  contemplativeActionEn: string;
  contemplativeActionHi: string;
}

// ─── 2. Emotion-First Architecture Types ──────────────────────────────────────

export interface EmotionWisdomRecord {
  id: string; // e.g., 'anxious', 'angry'
  emotionEn: string;
  emotionHi: string;
  sanskritTerm: string; // e.g. "उद्विग्न (Udveg / Chitta-Vikshepa)"
  intensityBadgeEn: string;
  intensityBadgeHi: string;
  rootInsightEn: string;
  rootInsightHi: string;
  pauseExercise: {
    durationSeconds: number;
    titleEn: string;
    titleHi: string;
    instructionsEn: string;
    instructionsHi: string;
  };
  primaryVerses: CanonicalVerseRef[];
  reflectionQuestions: Array<{
    questionEn: string;
    questionHi: string;
    hintEn?: string;
    hintHi?: string;
  }>;
  practicalActions: Array<{
    actionEn: string;
    actionHi: string;
    timeframe: 'immediate' | 'today' | 'evening';
  }>;
}

// ─── 3. Contextual Wisdom Engine Types ────────────────────────────────────────

export interface WisdomContextInput {
  currentVerse?: CanonicalVerseRef;
  recentVerseIds: string[];
  bookmarkedVerseIds: string[];
  exploredQuestionIds: string[];
  exploredEmotionIds: string[];
  viewedTopicSlugs: string[];
}

export interface WisdomRecommendation {
  id: string;
  type: 'verse' | 'question' | 'pathway' | 'pause';
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  href: string;
  reasonEn: string;
  reasonHi: string;
  verse?: CanonicalVerseRef;
}

// ─── 4. Guided Reflection System Types ────────────────────────────────────────

export type ReflectionPromptType = 'insight' | 'resonance' | 'action' | 'challenge' | 'freeform';

export interface GuidedReflectionPrompt {
  type: ReflectionPromptType;
  labelEn: string;
  labelHi: string;
  questionEn: string;
  questionHi: string;
  guidanceEn: string;
  guidanceHi: string;
}

export interface StoredReflection {
  id: string; // "refl:uuid"
  verseReference: {
    scriptureId: string;
    chapterNumber: number;
    verseNumber: number | string;
    citation: string;
    sanskritSnippet?: string;
  };
  promptType: ReflectionPromptType;
  promptQuestion: string;
  response: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
  appliedAction?: {
    actionText: string;
    isCompleted: boolean;
    completedAt?: string;
  };
}

// ─── 5. Wisdom Journeys Types ─────────────────────────────────────────────────

export interface JourneyStepPedagogy {
  dayNumber: number;
  titleEn: string;
  titleHi: string;
  // 1. Read
  verse: CanonicalVerseRef;
  // 2. Reflect
  reflectionInsightEn: string;
  reflectionInsightHi: string;
  reflectionPromptEn: string;
  reflectionPromptHi: string;
  // 3. Practice
  contemplativePracticeEn: string;
  contemplativePracticeHi: string;
  practiceDurationSeconds: number;
  // 4. Apply
  dailyMicroActionEn: string;
  dailyMicroActionHi: string;
  // 5. Review
  eveningCheckInPromptEn: string;
  eveningCheckInPromptHi: string;
}

export interface WisdomJourneyPathway {
  id: string; // e.g. '7-days-inner-calm'
  slug: string;
  titleEn: string;
  titleHi: string;
  sanskritName: string;
  objectiveEn: string;
  objectiveHi: string;
  totalDays: number;
  category: 'calm' | 'transformation' | 'courage' | 'purpose' | 'mastery' | 'karma' | 'balance' | 'detachment';
  estimatedMinutesPerDay: number;
  steps: JourneyStepPedagogy[];
}

// ─── 6. Daily Wisdom System Types ─────────────────────────────────────────────

export interface DailyWisdomBundle {
  date: string; // YYYY-MM-DD
  verse: CanonicalVerseRef;
  reflectionEn: string;
  reflectionHi: string;
  questionOfTheDayEn: string;
  questionOfTheDayHi: string;
  practiceOfTheDayEn: string;
  practiceOfTheDayHi: string;
  sacredNoteEn: string;
  sacredNoteHi: string;
}

// ─── 7. Digital Wellbeing Modes Types ─────────────────────────────────────────

export type AttentionalMode = 
  | 'standard'
  | 'focus'
  | 'deep-reading'
  | 'reflection'
  | 'silent'
  | 'study-session'
  | 'digital-detox'
  | 'reading-retreat';

export interface AttentionalModeConfig {
  mode: AttentionalMode;
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  hideNavigation: boolean;
  hideChrome: boolean;
  disableAudio: boolean;
  enableTimer: boolean;
  defaultTimerMinutes?: number;
  encourageScreenClose: boolean;
}

// ─── 8. Ethical Wisdom Analytics Types ────────────────────────────────────────

export interface EthicalWisdomAnalytics {
  windowDays: number; // e.g. 28 days
  studyHoursTotal: number;
  studyMinutesTotal: number;
  activeReadingDaysCount: number;
  reflectionsWrittenCount: number;
  questionsExploredCount: number;
  emotionsExploredCount: number;
  scripturesStudiedCount: number;
  wisdomSessionsCompletedCount: number;
  lastStudyDate?: string;
}

// ─── 9. SEO Knowledge Universe Types ──────────────────────────────────────────

export interface SEOWisdomCluster {
  slug: string;
  titleEn: string;
  titleHi: string;
  metaDescriptionEn: string;
  metaDescriptionHi: string;
  primaryScripture: string;
  keyVerseCitation: string;
  faqList: Array<{
    questionEn: string;
    questionHi: string;
    answerEn: string;
    answerHi: string;
  }>;
}
