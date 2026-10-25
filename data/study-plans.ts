/**
 * Short reading orders for /learn/plans/ (study orders section).
 * Each step opens a page that already exists. Notes name that page.
 * They are not a translation, a commentary, or a new teaching.
 * Progress is stored with the existing pathway ids in this browser.
 * Ids are prefixed so they do not collide with course ids in the same store.
 */

export type StudyStepKind = 'concept' | 'wisdom' | 'verse' | 'chapter';

export interface StudyPlanStep {
  id: string;
  kind: StudyStepKind;
  titleHi: string;
  titleEn: string;
  /** Which existing page this step opens. */
  noteHi: string;
  noteEn: string;
  href: string;
  /** Labeled estimate, not a measured time. */
  minutes: number;
}

export interface StudyPlan {
  id: string;
  titleHi: string;
  titleEn: string;
  blurbHi: string;
  blurbEn: string;
  /** Another order on the same page, shown after this one is complete. */
  nextPlanId?: string;
  steps: StudyPlanStep[];
}

export interface PlanProgressSnap {
  pathwayId: string;
  completedSteps: string[];
  startedAt: string;
  completedAt?: string;
}

export type TodayPick =
  | { kind: 'resume' | 'start' | 'next'; plan: StudyPlan; step: StudyPlanStep }
  | { kind: 'done' };

const MINUTES: Record<StudyStepKind, number> = {
  concept: 5,
  wisdom: 6,
  verse: 8,
  chapter: 12,
};

/** Suggested first order when nothing on this device is in progress. */
export const STARTER_PLAN_ID = 'plan-beginner-spirituality';

function step(
  planId: string,
  n: number,
  kind: StudyStepKind,
  titleHi: string,
  titleEn: string,
  noteHi: string,
  noteEn: string,
  href: string,
): StudyPlanStep {
  return {
    id: `${planId}-${n}`,
    kind,
    titleHi,
    titleEn,
    noteHi,
    noteEn,
    href,
    minutes: MINUTES[kind],
  };
}

function concept(planId: string, n: number, id: string, titleHi: string, titleEn: string): StudyPlanStep {
  return step(
    planId,
    n,
    'concept',
    titleHi,
    titleEn,
    `${titleHi} का अवधारणा पृष्ठ खोलता है।`,
    `Opens the ${titleEn} concept page.`,
    `/concepts/${id}`,
  );
}

function wisdom(planId: string, n: number, slug: string, titleHi: string, titleEn: string): StudyPlanStep {
  return step(
    planId,
    n,
    'wisdom',
    titleHi,
    titleEn,
    `जीवन-विषय «${titleHi}» खोलता है।`,
    `Opens the life topic ${titleEn}.`,
    `/wisdom-for-life/${slug}`,
  );
}

function verse(
  planId: string,
  n: number,
  scriptureId: string,
  chapter: number,
  verseNumber: number,
  titleHi: string,
  titleEn: string,
): StudyPlanStep {
  return step(
    planId,
    n,
    'verse',
    titleHi,
    titleEn,
    `${titleHi} का पुस्तकालय पृष्ठ खोलता है।`,
    `Opens the library page for ${titleEn}.`,
    `/scripture/${scriptureId}/chapter/${chapter}/verse/${verseNumber}`,
  );
}

export const STUDY_PLANS: StudyPlan[] = [
  {
    id: 'plan-beginner-spirituality',
    titleHi: 'आरंभिक आध्यात्मिकता',
    titleEn: 'Beginner Spirituality',
    blurbHi: 'धर्म, कर्म, कर्तव्य, गीता २.४७ और आत्मा के पृष्ठ, जो इस साइट पर पहले से हैं।',
    blurbEn: 'Opens the Dharma, Karma, duty, Gita 2.47, and Atman pages already on the site.',
    nextPlanId: 'plan-gita-essentials',
    steps: [
      concept('plan-beginner-spirituality', 1, 'dharma', 'धर्म', 'Dharma'),
      concept('plan-beginner-spirituality', 2, 'karma', 'कर्म', 'Karma'),
      wisdom('plan-beginner-spirituality', 3, 'duty-and-decision-making', 'कर्तव्य और निर्णय', 'Duty and Decision-Making'),
      verse('plan-beginner-spirituality', 4, 'bhagavadgita', 2, 47, 'भगवद्गीता २.४७', 'Bhagavad Gita 2.47'),
      concept('plan-beginner-spirituality', 5, 'atman', 'आत्मा', 'Atman'),
    ],
  },
  {
    id: 'plan-gita-essentials',
    titleHi: 'भगवद्गीता के मुख्य श्लोक',
    titleEn: 'Bhagavad Gita Essentials',
    blurbHi: 'छह श्लोक पृष्ठ: २.११, २.४७, २.४८, ३.१९, १२.१३ और १८.२६।',
    blurbEn: 'Six library verse pages: 2.11, 2.47, 2.48, 3.19, 12.13, and 18.26.',
    nextPlanId: 'plan-karma-yoga',
    steps: [
      verse('plan-gita-essentials', 1, 'bhagavadgita', 2, 11, 'भगवद्गीता २.११', 'Bhagavad Gita 2.11'),
      verse('plan-gita-essentials', 2, 'bhagavadgita', 2, 47, 'भगवद्गीता २.४७', 'Bhagavad Gita 2.47'),
      verse('plan-gita-essentials', 3, 'bhagavadgita', 2, 48, 'भगवद्गीता २.४८', 'Bhagavad Gita 2.48'),
      verse('plan-gita-essentials', 4, 'bhagavadgita', 3, 19, 'भगवद्गीता ३.१९', 'Bhagavad Gita 3.19'),
      verse('plan-gita-essentials', 5, 'bhagavadgita', 12, 13, 'भगवद्गीता १२.१३', 'Bhagavad Gita 12.13'),
      verse('plan-gita-essentials', 6, 'bhagavadgita', 18, 26, 'भगवद्गीता १८.२६', 'Bhagavad Gita 18.26'),
    ],
  },
  {
    id: 'plan-self-discovery',
    titleHi: 'आत्म-खोज',
    titleEn: 'Self Discovery',
    blurbHi: 'आत्मा, आत्मज्ञान, गीता २.२०, ब्रह्म, और अष्टावक्र गीता का पहला अध्याय।',
    blurbEn: 'Atman, the self-knowledge topic, Gita 2.20, Brahman, and Ashtavakra Gita chapter 1.',
    nextPlanId: 'plan-vedanta-foundations',
    steps: [
      concept('plan-self-discovery', 1, 'atman', 'आत्मा', 'Atman'),
      wisdom('plan-self-discovery', 2, 'self-knowledge', 'आत्मज्ञान और साक्षी भाव', 'Self-Knowledge and the Witness'),
      verse('plan-self-discovery', 3, 'bhagavadgita', 2, 20, 'भगवद्गीता २.२०', 'Bhagavad Gita 2.20'),
      concept('plan-self-discovery', 4, 'brahman', 'ब्रह्म', 'Brahman'),
      step(
        'plan-self-discovery',
        5,
        'chapter',
        'अष्टावक्र गीता, अध्याय १',
        'Ashtavakra Gita, chapter 1',
        'अष्टावक्र गीता के अध्याय १ का पृष्ठ खोलता है।',
        'Opens Ashtavakra Gita chapter 1.',
        '/ashtavakra/1',
      ),
    ],
  },
  {
    id: 'plan-karma-yoga',
    titleHi: 'कर्मयोग',
    titleEn: 'Karma Yoga',
    blurbHi: 'कर्म का पृष्ठ, गीता २.४७, २.४८ और ३.१९, कर्म में कुशलता, और कर्तव्य।',
    blurbEn: 'Opens Karma, Gita 2.47, 2.48, and 3.19, skill in work, and duty.',
    nextPlanId: 'plan-purpose-discovery',
    steps: [
      concept('plan-karma-yoga', 1, 'karma', 'कर्म', 'Karma'),
      verse('plan-karma-yoga', 2, 'bhagavadgita', 2, 47, 'भगवद्गीता २.४७', 'Bhagavad Gita 2.47'),
      verse('plan-karma-yoga', 3, 'bhagavadgita', 2, 48, 'भगवद्गीता २.४८', 'Bhagavad Gita 2.48'),
      verse('plan-karma-yoga', 4, 'bhagavadgita', 3, 19, 'भगवद्गीता ३.१९', 'Bhagavad Gita 3.19'),
      wisdom('plan-karma-yoga', 5, 'skill-in-work', 'कर्म में कुशलता', 'Skill in Work'),
      wisdom('plan-karma-yoga', 6, 'duty-and-decision-making', 'कर्तव्य और निर्णय', 'Duty and Decision-Making'),
    ],
  },
  {
    id: 'plan-bhakti-yoga',
    titleHi: 'भक्तियोग',
    titleEn: 'Bhakti Yoga',
    blurbHi: 'भक्ति का पृष्ठ, भक्ति और शरणागति, गीता १२.१३ और १२.१५।',
    blurbEn: 'Opens Bhakti, the devotion topic, and Gita 12.13 and 12.15.',
    nextPlanId: 'plan-self-discovery',
    steps: [
      concept('plan-bhakti-yoga', 1, 'bhakti', 'भक्ति', 'Bhakti'),
      wisdom('plan-bhakti-yoga', 2, 'devotion', 'भक्ति और शरणागति', 'Devotion and Surrender'),
      verse('plan-bhakti-yoga', 3, 'bhagavadgita', 12, 13, 'भगवद्गीता १२.१३', 'Bhagavad Gita 12.13'),
      verse('plan-bhakti-yoga', 4, 'bhagavadgita', 12, 15, 'भगवद्गीता १२.१५', 'Bhagavad Gita 12.15'),
    ],
  },
  {
    id: 'plan-vedanta-foundations',
    titleHi: 'वेदान्त की नींव',
    titleEn: 'Vedanta Foundations',
    blurbHi: 'ब्रह्म, आत्मा, माया, मोक्ष, ईशावास्य १.१, और आत्मज्ञान।',
    blurbEn: 'Opens Brahman, Atman, Maya, Moksha, Isha 1.1, and the self-knowledge topic.',
    nextPlanId: 'plan-meditation-journey',
    steps: [
      concept('plan-vedanta-foundations', 1, 'brahman', 'ब्रह्म', 'Brahman'),
      concept('plan-vedanta-foundations', 2, 'atman', 'आत्मा', 'Atman'),
      concept('plan-vedanta-foundations', 3, 'maya', 'माया', 'Maya'),
      concept('plan-vedanta-foundations', 4, 'moksha', 'मोक्ष', 'Moksha'),
      verse('plan-vedanta-foundations', 5, 'ishavasya', 1, 1, 'ईशावास्य १.१', 'Isha Upanishad 1.1'),
      wisdom('plan-vedanta-foundations', 6, 'self-knowledge', 'आत्मज्ञान और साक्षी भाव', 'Self-Knowledge and the Witness'),
    ],
  },
  {
    id: 'plan-student',
    titleHi: 'विद्यार्थी',
    titleEn: 'Student',
    blurbHi: 'एकाग्रता, अनुशासन, तनाव, गीता ६.३५, और आत्मसंयम।',
    blurbEn: 'Opens concentration, discipline, stress, Gita 6.35, and self-control.',
    nextPlanId: 'plan-meditation-journey',
    steps: [
      wisdom('plan-student', 1, 'concentration', 'एकाग्रता और ध्यान', 'Concentration and Mental Focus'),
      wisdom('plan-student', 2, 'discipline', 'अनुशासन और संयम', 'Discipline and Self-Mastery'),
      wisdom('plan-student', 3, 'stress-and-worry', 'तनाव और चिंता', 'Stress and Worry'),
      verse('plan-student', 4, 'bhagavadgita', 6, 35, 'भगवद्गीता ६.३५', 'Bhagavad Gita 6.35'),
      wisdom('plan-student', 5, 'self-control', 'आत्मसंयम', 'Self-Control'),
    ],
  },
  {
    id: 'plan-leadership',
    titleHi: 'नेतृत्व',
    titleEn: 'Leadership',
    blurbHi: 'नेतृत्व और लोकसंग्रह, गीता ३.२१, कर्तव्य, और धर्म।',
    blurbEn: 'Opens leadership, Gita 3.21, duty, and Dharma.',
    nextPlanId: 'plan-karma-yoga',
    steps: [
      wisdom('plan-leadership', 1, 'leadership', 'नेतृत्व और लोकसंग्रह', 'Leadership and Public Example'),
      verse('plan-leadership', 2, 'bhagavadgita', 3, 21, 'भगवद्गीता ३.२१', 'Bhagavad Gita 3.21'),
      wisdom('plan-leadership', 3, 'duty-and-decision-making', 'कर्तव्य और निर्णय', 'Duty and Decision-Making'),
      concept('plan-leadership', 4, 'dharma', 'धर्म', 'Dharma'),
    ],
  },
  {
    id: 'plan-stress-relief',
    titleHi: 'तनाव में पढ़ना',
    titleEn: 'Stress Relief',
    blurbHi: 'तनाव, भय, क्रोध, गीता २.१४, और संतोष।',
    blurbEn: 'Opens stress, fear, anger, Gita 2.14, and contentment.',
    nextPlanId: 'plan-meditation-journey',
    steps: [
      wisdom('plan-stress-relief', 1, 'stress-and-worry', 'तनाव और चिंता', 'Stress and Worry'),
      wisdom('plan-stress-relief', 2, 'fear-and-courage', 'भय और साहस', 'Fear and Courage'),
      wisdom('plan-stress-relief', 3, 'anger', 'क्रोध और आत्म-संयम', 'Anger and Composure'),
      verse('plan-stress-relief', 4, 'bhagavadgita', 2, 14, 'भगवद्गीता २.१४', 'Bhagavad Gita 2.14'),
      wisdom('plan-stress-relief', 5, 'contentment', 'संतोष', 'Contentment'),
    ],
  },
  {
    id: 'plan-purpose-discovery',
    titleHi: 'उद्देश्य',
    titleEn: 'Purpose Discovery',
    blurbHi: 'जीवन का अर्थ, धर्म, मोक्ष, कर्तव्य, और अनिश्चितता।',
    blurbEn: 'Opens meaning, Dharma, Moksha, duty, and uncertainty.',
    nextPlanId: 'plan-self-discovery',
    steps: [
      wisdom('plan-purpose-discovery', 1, 'meaning-of-life', 'जीवन का अर्थ और मोक्ष', 'Meaning of Life and Moksha'),
      concept('plan-purpose-discovery', 2, 'dharma', 'धर्म', 'Dharma'),
      concept('plan-purpose-discovery', 3, 'moksha', 'मोक्ष', 'Moksha'),
      wisdom('plan-purpose-discovery', 4, 'duty-and-decision-making', 'कर्तव्य और निर्णय', 'Duty and Decision-Making'),
      wisdom('plan-purpose-discovery', 5, 'uncertainty', 'अनिश्चितता', 'Uncertainty'),
    ],
  },
  {
    id: 'plan-meditation-journey',
    titleHi: 'ध्यान की दिशा',
    titleEn: 'Meditation Journey',
    blurbHi: 'योग का पृष्ठ, एकाग्रता, गीता ६.३५ और ६.५, और आत्मसंयम।',
    blurbEn: 'Opens Yoga, concentration, Gita 6.35 and 6.5, and self-control.',
    nextPlanId: 'plan-bhakti-yoga',
    steps: [
      concept('plan-meditation-journey', 1, 'yoga', 'योग', 'Yoga'),
      wisdom('plan-meditation-journey', 2, 'concentration', 'एकाग्रता और ध्यान', 'Concentration and Mental Focus'),
      verse('plan-meditation-journey', 3, 'bhagavadgita', 6, 35, 'भगवद्गीता ६.३५', 'Bhagavad Gita 6.35'),
      verse('plan-meditation-journey', 4, 'bhagavadgita', 6, 5, 'भगवद्गीता ६.५', 'Bhagavad Gita 6.5'),
      wisdom('plan-meditation-journey', 5, 'self-control', 'आत्मसंयम', 'Self-Control'),
    ],
  },
];

export function getStudyPlan(id: string): StudyPlan | undefined {
  return STUDY_PLANS.find((plan) => plan.id === id);
}

export function planMinutes(plan: StudyPlan): number {
  return plan.steps.reduce((sum, item) => sum + item.minutes, 0);
}

export function completedStepIds(plan: StudyPlan, completed: readonly string[] | undefined): string[] {
  const have = new Set(completed ?? []);
  return plan.steps.map((item) => item.id).filter((id) => have.has(id));
}

/** Plain milestone. A count of steps, with no rank. */
export function milestoneLabel(done: number, total: number): 'half' | 'complete' | null {
  if (done <= 0 || total <= 0) return null;
  if (done >= total) return 'complete';
  if (done * 2 >= total) return 'half';
  return null;
}

/**
 * Today's step is the first unmarked step of the order already in progress.
 * If none is in progress, it is the first unmarked step of the starter order.
 */
export function todayStep(plans: readonly StudyPlan[], rows: readonly PlanProgressSnap[]): TodayPick {
  const rowFor = (id: string) => rows.find((row) => row.pathwayId === id);
  const open = plans.flatMap((plan) => {
    const row = rowFor(plan.id);
    if (!row) return [];
    const done = completedStepIds(plan, row.completedSteps);
    if (done.length === 0 || done.length >= plan.steps.length) return [];
    return [{ plan, startedAt: row.startedAt, done }];
  });
  open.sort((a, b) => (a.startedAt < b.startedAt ? 1 : a.startedAt > b.startedAt ? -1 : 0));
  const current = open[0];
  if (current) {
    const next = current.plan.steps.find((item) => !current.done.includes(item.id));
    if (next) return { kind: 'resume', plan: current.plan, step: next };
  }

  const starter = plans.find((plan) => plan.id === STARTER_PLAN_ID) ?? plans[0];
  if (starter) {
    const done = completedStepIds(starter, rowFor(starter.id)?.completedSteps);
    if (done.length < starter.steps.length) {
      const next = starter.steps.find((item) => !done.includes(item.id));
      if (next) return { kind: 'start', plan: starter, step: next };
    }
  }

  for (const plan of plans) {
    const done = completedStepIds(plan, rowFor(plan.id)?.completedSteps);
    if (done.length < plan.steps.length) {
      const next = plan.steps.find((item) => !done.includes(item.id));
      if (next) return { kind: 'next', plan, step: next };
    }
  }
  return { kind: 'done' };
}
