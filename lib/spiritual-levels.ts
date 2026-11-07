/**
 * Spiritual Progress Levels (आत्मिक सोपान) Engine
 *
 * Implements the 6 classical stages of spiritual learning rooted in Vedic tradition:
 * 1. Seed (बीज · Bīja)
 * 2. Seeker (जिज्ञासु · Jijñāsu)
 * 3. Student (विद्यार्थी · Vidyārthī)
 * 4. Sadhaka (साधक · Sādhaka)
 * 5. Practitioner (अभ्यासी · Abhyāsī)
 * 6. Scholar / Seer (ज्ञानी / तत्त्वज्ञ · Jñānī)
 *
 * Designed with meditative dignity: NO childish gamification, NO arcade points.
 * Grounded in the Bhagavad Gita (7.16), Taittiriya Upanishad (1.11.1), and Brahma Sutras.
 */

export type SpiritualLevelId = 'seed' | 'seeker' | 'student' | 'sadhaka' | 'practitioner' | 'scholar';

export interface LevelMilestoneCriteria {
  versesRead: number;
  daysActive: number;
  notesAndReflections: number;
  pathwaysCompleted: number;
}

export interface SpiritualLevelDef {
  id: SpiritualLevelId;
  index: number;
  titleEn: string;
  titleHi: string;
  titleSanskrit: string;
  stageName: string;
  symbol: string;
  color: {
    badgeBg: string;
    badgeText: string;
    border: string;
    accent: string;
    gradient: string;
  };
  aphorism: {
    sanskrit: string;
    transliteration: string;
    translationHi: string;
    translationEn: string;
    source: string;
  };
  summaryEn: string;
  summaryHi: string;
  contemplationEn: string;
  contemplationHi: string;
  milestones: LevelMilestoneCriteria;
}

export interface UserSadhanaStats {
  versesReadCount: number;
  totalDaysRead: number;
  notesCount: number;
  highlightsCount: number;
  bookmarksCount: number;
  pathwaysCompleted: number;
}

export interface LevelProgressResult {
  currentLevel: SpiritualLevelDef;
  nextLevel: SpiritualLevelDef | null;
  overallProgressPct: number;
  remainingForNext: {
    verses: number;
    days: number;
    notes: number;
    pathways: number;
  } | null;
}

export const SPIRITUAL_LEVELS: SpiritualLevelDef[] = [
  {
    id: 'seed',
    index: 0,
    titleEn: 'Seed',
    titleHi: 'बीज',
    titleSanskrit: 'बीजावस्था',
    stageName: 'आरंभिक प्रेरणा',
    symbol: '🌱',
    color: {
      badgeBg: 'bg-amber-100 dark:bg-amber-950/40',
      badgeText: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300/60 dark:border-amber-800/40',
      accent: '#d97706',
      gradient: 'from-amber-500/20 to-yellow-500/10',
    },
    aphorism: {
      sanskrit: 'अथातो धर्मजिज्ञासा',
      transliteration: 'athāto dharmajijñāsā',
      translationHi: 'अब धर्म को जानने और समझने की पवित्र जिज्ञासा का आरंभ होता है।',
      translationEn: 'Now begins the sincere, sacred inquiry into Dharma.',
      source: 'मीमांसा सूत्र 1.1.1',
    },
    summaryEn: 'The initial spark of interest in eternal wisdom and scriptural truth.',
    summaryHi: 'सनातन ज्ञान व शास्त्रों के प्रति प्रथम जिज्ञासा व रुचि का बीजारोपण।',
    contemplationEn: 'Every great spiritual realization begins with a single moment of quiet curiosity.',
    contemplationHi: 'संसार का प्रत्येक महान बोध शांत मन की एक सहज जिज्ञासा से ही अंकुरित होता है।',
    milestones: {
      versesRead: 0,
      daysActive: 0,
      notesAndReflections: 0,
      pathwaysCompleted: 0,
    },
  },
  {
    id: 'seeker',
    index: 1,
    titleEn: 'Seeker',
    titleHi: 'जिज्ञासु',
    titleSanskrit: 'जिज्ञासु',
    stageName: 'सत्य की खोज',
    symbol: '🔍',
    color: {
      badgeBg: 'bg-orange-100 dark:bg-orange-950/40',
      badgeText: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-300/60 dark:border-orange-800/40',
      accent: '#ea580c',
      gradient: 'from-orange-500/20 to-amber-500/10',
    },
    aphorism: {
      sanskrit: 'अथातो ब्रह्मजिज्ञासा',
      transliteration: 'athāto brahmajijñāsā',
      translationHi: 'अब परमतत्त्व और आत्मज्ञान की जिज्ञासा का प्रशस्त मार्ग खुलता है।',
      translationEn: 'Now begins the deeper inquiry into the Ultimate Truth.',
      source: 'ब्रह्म सूत्र 1.1.1',
    },
    summaryEn: 'Actively exploring scriptures, asking fundamental questions, and seeking living guidance.',
    summaryHi: 'शास्त्रों का अनुशीलन, मूल प्रश्नों की खोज और जीवन-मार्गदर्शन की अभिलाषा।',
    contemplationEn: 'The seeker who questions with sincerity is already half-way to understanding.',
    contemplationHi: 'जो निष्कपट भाव से सत्य की खोज करता है, वह बोध के मार्ग पर अग्रसर हो चुका है।',
    milestones: {
      versesRead: 5,
      daysActive: 2,
      notesAndReflections: 0,
      pathwaysCompleted: 0,
    },
  },
  {
    id: 'student',
    index: 2,
    titleEn: 'Student',
    titleHi: 'विद्यार्थी',
    titleSanskrit: 'अन्तेवासी',
    stageName: 'नियमित स्वाध्याय',
    symbol: '📖',
    color: {
      badgeBg: 'bg-saffron-100 dark:bg-saffron-950/40',
      badgeText: 'text-saffron-800 dark:text-saffron-300',
      border: 'border-saffron-300/60 dark:border-saffron-800/40',
      accent: '#c2410c',
      gradient: 'from-saffron-500/20 to-orange-500/10',
    },
    aphorism: {
      sanskrit: 'स्वाध्यायान्मा प्रमदः',
      transliteration: 'svādhyāyānmā pramadaḥ',
      translationHi: 'शास्त्रों के नित्य स्वाध्याय में कभी प्रमाद (आलस्य) न करो।',
      translationEn: 'Never neglect regular, mindful self-study of the scriptures.',
      source: 'तैत्तिरीयोपनिषद् 1.11.1',
    },
    summaryEn: 'Building consistency through structured chapters, learning paths, and note-taking.',
    summaryHi: 'संरचित अध्याय पठन, विचार टिप्पणियाँ और निरंतर स्वाध्याय की साधना।',
    contemplationEn: 'Consistent study transforms casual curiosity into rooted knowledge.',
    contemplationHi: 'प्रतिदिन का थोड़ा सा भी स्वाध्याय मन को स्थिर और ज्ञान को दृढ़ करता है।',
    milestones: {
      versesRead: 25,
      daysActive: 5,
      notesAndReflections: 1,
      pathwaysCompleted: 0,
    },
  },
  {
    id: 'sadhaka',
    index: 3,
    titleEn: 'Sadhaka',
    titleHi: 'साधक',
    titleSanskrit: 'साधक',
    stageName: 'कर्म व चिंतन समन्वय',
    symbol: '🪔',
    color: {
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/40',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300/60 dark:border-emerald-800/40',
      accent: '#059669',
      gradient: 'from-emerald-500/20 to-teal-500/10',
    },
    aphorism: {
      sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय',
      transliteration: 'yogasthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya',
      translationHi: 'आसक्ति का त्याग कर और योग (समत्व) में स्थित होकर अपने कर्तव्य कर्म करो।',
      translationEn: 'Remain steadfast in Yoga, perform your duties, abandoning clinging attachments.',
      source: 'श्रीमद्भगवद्गीता 2.48',
    },
    summaryEn: 'Bridging intellectual reading into daily action, meditation, and inner reflection.',
    summaryHi: 'केवल श्लोक पढ़ने से आगे बढ़कर उन्हें दैनिक आचरण व चिंतन में ढालना।',
    contemplationEn: 'When knowledge guides your everyday actions, study matures into true Sadhana.',
    contemplationHi: 'जब पढ़ा हुआ ज्ञान दिनभर के आचरण में उतरने लगे, तब स्वाध्याय साधना बन जाता है।',
    milestones: {
      versesRead: 75,
      daysActive: 10,
      notesAndReflections: 3,
      pathwaysCompleted: 1,
    },
  },
  {
    id: 'practitioner',
    index: 4,
    titleEn: 'Practitioner',
    titleHi: 'अभ्यासी',
    titleSanskrit: 'अभ्यासनिष्ठ',
    stageName: 'गहन निष्ठा व वैराग्य',
    symbol: '🪷',
    color: {
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/40',
      badgeText: 'text-indigo-800 dark:text-indigo-300',
      border: 'border-indigo-300/60 dark:border-indigo-800/40',
      accent: '#4f46e5',
      gradient: 'from-indigo-500/20 to-purple-500/10',
    },
    aphorism: {
      sanskrit: 'अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते',
      transliteration: 'abhyāsena tu kaunteya vairāgyeṇa ca gṛhyate',
      translationHi: 'हे कौन्तेय! निरंतर अभ्यास और वैराग्य से ही यह चंचल मन वश में आता है।',
      translationEn: 'By steady disciplined practice and dispassion is the restless mind mastered.',
      source: 'श्रीमद्भगवद्गीता 6.35',
    },
    summaryEn: 'Deep immersion across multiple scriptures with steady habits and calm equanimity.',
    summaryHi: 'अनेकों शास्त्रों का सांगोपांग अनुशीलन, अटूट नियम और समतामय जीवन।',
    contemplationEn: 'Discipline is not a burden; it is the sacred vessel in which inner peace resides.',
    contemplationHi: 'अनुशासन कोई बंधन नहीं, बल्कि वह पवित्र पात्र है जिसमें आत्मशांति सुरक्षित रहती है।',
    milestones: {
      versesRead: 200,
      daysActive: 21,
      notesAndReflections: 8,
      pathwaysCompleted: 2,
    },
  },
  {
    id: 'scholar',
    index: 5,
    titleEn: 'Scholar / Seer',
    titleHi: 'ज्ञानी / तत्त्वज्ञ',
    titleSanskrit: 'तत्त्वज्ञ',
    stageName: 'आत्मबोध व प्रकाश',
    symbol: '☀️',
    color: {
      badgeBg: 'bg-amber-100 dark:bg-yellow-950/40',
      badgeText: 'text-amber-900 dark:text-amber-200',
      border: 'border-amber-400 dark:border-amber-600',
      accent: '#b45309',
      gradient: 'from-amber-500/25 via-saffron-500/20 to-yellow-500/15',
    },
    aphorism: {
      sanskrit: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते',
      transliteration: 'na hi jñānena sadṛśaṁ pavitramiha vidyate',
      translationHi: 'इस संसार में ज्ञान के समान पवित्र और पावन कुछ भी नहीं है।',
      translationEn: 'Certainly, there exists nothing in this universe as pure as spiritual knowledge.',
      source: 'श्रीमद्भगवद्गीता 4.38',
    },
    summaryEn: 'Holistic comprehension of the Vedic canon, lived wisdom, and spiritual clarity.',
    summaryHi: 'समस्त वैदिक परंपरा का समन्वय, जीवंत आत्मबोध और जीवन में ज्ञान का प्रकाश।',
    contemplationEn: 'The highest knowledge does not inflate the ego; it dissolves it into universal oneness.',
    contemplationHi: 'सर्वोच्च ज्ञान अहंकार को नहीं बढ़ाता, बल्कि उसे संपूर्ण चराचर के साथ एकाकार कर देता है।',
    milestones: {
      versesRead: 500,
      daysActive: 40,
      notesAndReflections: 15,
      pathwaysCompleted: 4,
    },
  },
];

/**
 * Calculates current spiritual level and progress toward the next stage
 */
export function calculateSpiritualLevel(stats: UserSadhanaStats): LevelProgressResult {
  const notesTotal = stats.notesCount + stats.highlightsCount;

  // Determine current level from top down
  let currentLevel = SPIRITUAL_LEVELS[0];

  for (let i = SPIRITUAL_LEVELS.length - 1; i >= 0; i--) {
    const lvl = SPIRITUAL_LEVELS[i];
    const m = lvl.milestones;

    const meetsVerses = stats.versesReadCount >= m.versesRead;
    const meetsDays = stats.totalDaysRead >= m.daysActive;
    const meetsNotes = notesTotal >= m.notesAndReflections;
    const meetsPathways = stats.pathwaysCompleted >= m.pathwaysCompleted;

    // A user reaches level i if they meet at least 3 of 4 criteria, or verses+days.
    const criteriaCount = [meetsVerses, meetsDays, meetsNotes, meetsPathways].filter(Boolean).length;
    if (criteriaCount >= 3 || (meetsVerses && meetsDays)) {
      currentLevel = lvl;
      break;
    }
  }

  const nextIndex = currentLevel.index + 1;
  const nextLevel = nextIndex < SPIRITUAL_LEVELS.length ? SPIRITUAL_LEVELS[nextIndex] : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      overallProgressPct: 100,
      remainingForNext: null,
    };
  }

  // Calculate percentage toward next level
  const currM = currentLevel.milestones;
  const nextM = nextLevel.milestones;

  const vDiff = Math.max(1, nextM.versesRead - currM.versesRead);
  const vProgress = Math.min(1, Math.max(0, (stats.versesReadCount - currM.versesRead) / vDiff));

  const dDiff = Math.max(1, nextM.daysActive - currM.daysActive);
  const dProgress = Math.min(1, Math.max(0, (stats.totalDaysRead - currM.daysActive) / dDiff));

  const nDiff = Math.max(1, nextM.notesAndReflections - currM.notesAndReflections);
  const nProgress = Math.min(1, Math.max(0, (notesTotal - currM.notesAndReflections) / nDiff));

  const pDiff = Math.max(1, nextM.pathwaysCompleted - currM.pathwaysCompleted);
  const pProgress = Math.min(1, Math.max(0, (stats.pathwaysCompleted - currM.pathwaysCompleted) / pDiff));

  const weightedPct = Math.round(
    (vProgress * 0.4 + dProgress * 0.3 + nProgress * 0.15 + pProgress * 0.15) * 100
  );

  const remainingForNext = {
    verses: Math.max(0, nextM.versesRead - stats.versesReadCount),
    days: Math.max(0, nextM.daysActive - stats.totalDaysRead),
    notes: Math.max(0, nextM.notesAndReflections - notesTotal),
    pathways: Math.max(0, nextM.pathwaysCompleted - stats.pathwaysCompleted),
  };

  return {
    currentLevel,
    nextLevel,
    overallProgressPct: Math.min(99, Math.max(5, weightedPct)),
    remainingForNext,
  };
}
