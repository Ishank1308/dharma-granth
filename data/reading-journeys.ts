/**
 * Theme-based reading journeys. Each lesson points to one verse in the
 * library; the verse text itself is read from the library at build time, never
 * copied here. Everything written in this file (context, explanation,
 * reflection, activity) is editorial, not scripture, and every journey carries
 * a review state. `expect` is a fragment of the Sanskrit that must appear in
 * the library's verse (checked by scripts/check-journeys.ts) so a numbering
 * change cannot silently point a lesson at the wrong verse.
 */

import type { ReviewStatus } from './study-content';

export interface JourneyLesson {
  id: string;
  scriptureId: string;
  chapter: number;
  /** The verse's stored number: usually a plain number; dotted in texts numbered by section (Brihadaranyaka "1.3.28"). */
  verse: number | string;
  expect: string;
  context: string;
  explanation: string;
  reflection: string;
  activity?: string;
}

export type JourneyCategory = 'foundations' | 'yoga' | 'life' | 'healing';

export interface ReadingJourney {
  id: string;
  title: string;
  titleHi: string;
  objective: string;
  audience: string;
  minutesPerLesson: number;
  curator: string;
  /** ISO date of the last editorial review, or null if never reviewed. */
  reviewedOn: string | null;
  review: ReviewStatus;
  category?: JourneyCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  icon?: string;
  lessons: JourneyLesson[];
  related: Array<{ label: string; href: string }>;
  sources: string[];
}

const GITA = 'bhagavadgita';
const CURATOR = 'Dharma Granth editorial team (draft)';
const SOURCES = [
  'Sanskrit text: as given in the Dharma Granth library edition (see each verse page, “Sources and edition”).',
  'Context, explanation, reflection and activity: editorial notes, not scripture.',
];

export const READING_JOURNEYS: ReadingJourney[] = [
  // ─── 1. BEGINNER SPIRITUALITY ──────────────────────────────────────────────
  {
    id: 'beginner-spirituality',
    title: 'Beginner Spirituality',
    titleHi: 'अध्यात्म प्रवेश',
    objective: 'A gentle 6-day doorway into sacred wisdom: understanding duty, inner calm, and universal consciousness without dogma.',
    audience: 'First-time seekers looking for an authentic, grounded starting point.',
    minutesPerLesson: 6,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'foundations',
    difficulty: 'beginner',
    icon: '🌱',
    lessons: [
      {
        id: 'bs1', scriptureId: GITA, chapter: 2, verse: 7, expect: 'शिष्यस्तेऽहं',
        context: 'Arjuna sits in moral confusion and turns to Krishna with humble openness. The entire Gita begins here.',
        explanation: 'Wisdom begins the moment we release false certainty and admit we do not know everything.',
        reflection: 'What is one question or uncertainty in your life you are ready to explore with an open mind?',
        activity: 'Sit quietly for 3 minutes without seeking answers—just resting in honest awareness.',
      },
      {
        id: 'bs2', scriptureId: GITA, chapter: 2, verse: 13, expect: 'देहिनोऽस्मिन्',
        context: 'Krishna explains the continuity of the witnessing self through childhood, youth, old age, and beyond.',
        explanation: 'Your body and emotions constantly shift, but the silent observer within remains unchanging and tranquil.',
        reflection: 'What part of you has remained the constant observer through every phase of your life?',
      },
      {
        id: 'bs3', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Krishna lays down the core principle of Karma Yoga: focused action free from outcome obsession.',
        explanation: 'You hold authority over your effort, never over external outcomes. Do the work wholeheartedly, then let go.',
        reflection: 'Where are you currently wasting mental energy worrying about an outcome beyond your direct control?',
        activity: 'Dedicate 15 uninterrupted minutes to a meaningful task without checking your progress or metrics.',
      },
      {
        id: 'bs4', scriptureId: GITA, chapter: 6, verse: 5, expect: 'उद्धरेदात्मनाऽऽत्मानं',
        context: 'In the chapter on Dhyana, Krishna reveals how the human mind can be either your greatest ally or bitterest obstacle.',
        explanation: 'No one outside can elevate your consciousness for you. Your own disciplined awareness is your quiet redeemer.',
        reflection: 'How has your inner self-dialogue spoken to you today—as an encouraging friend or a harsh critic?',
      },
      {
        id: 'bs5', scriptureId: 'ishavasya', chapter: 1, verse: 1, expect: 'ईशा वास्यमिदं',
        context: 'The ancient Isha Upanishad opens with the fundamental truth of divine immanence throughout creation.',
        explanation: 'All changing phenomena are pervaded by the sacred. Enjoy life through conscious contentment, without greed.',
        reflection: 'How would your interactions change today if you recognized the same sacred awareness in everyone you meet?',
      },
      {
        id: 'bs6', scriptureId: GITA, chapter: 12, verse: 13, expect: 'अद्वेष्टा सर्वभूतानां',
        context: 'Krishna describes the hallmark qualities of a true spiritual devotee.',
        explanation: 'Freedom from malice, active friendliness, compassion, and absence of possessiveness define true spiritual maturity.',
        reflection: 'Which relationship in your life right now would benefit from an extra measure of gentle patience?',
      },
    ],
    related: [
      { label: 'Bhagavad Gita Foundations', href: '/learn/journeys/bhagavad-gita-foundations' },
      { label: 'Concept: Atman', href: '/concepts/atman' },
    ],
    sources: SOURCES,
  },

  // ─── 2. BHAGAVAD GITA FOUNDATIONS ──────────────────────────────────────────
  {
    id: 'bhagavad-gita-foundations',
    title: 'Bhagavad Gita Foundations',
    titleHi: 'गीता मूल सिद्धांत',
    objective: 'Explore the 6 foundational pillars that form the philosophical spine of the Bhagavad Gita.',
    audience: 'Readers who want a structured synthesis of the Gita’s essential teachings.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'foundations',
    difficulty: 'beginner',
    icon: '📜',
    lessons: [
      {
        id: 'bgf1', scriptureId: GITA, chapter: 1, verse: 1, expect: 'धर्मक्षेत्रे',
        context: 'Dhritarashtra inquires about the battle on the field of Dharma (Kurukshetra).',
        explanation: 'The setting is both historical and allegorical: every human life is an inner battlefield where duty confronts dilemma.',
        reflection: 'What is the primary moral or practical dilemma calling for your courage right now?',
      },
      {
        id: 'bgf2', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Krishna turns Arjuna from despair to decisive, detached action.',
        explanation: 'Karma Yoga: Focus 100% on right action, zero on anxiety over results. Never let passivity become an excuse.',
        reflection: 'Can you work with absolute excellence today simply for the craft itself, free from craving praise?',
      },
      {
        id: 'bgf3', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Krishna defines Yoga in five words: Samatvam Yoga Uchyate (Equanimity is Yoga).',
        explanation: 'Poise in success and failure alike is true Yoga. When inner balance is unshakeable, outer storms lose their grip.',
        reflection: 'Recall a recent win or loss—did it disturb your inner stillness, or could you hold it with quiet equanimity?',
      },
      {
        id: 'bgf4', scriptureId: GITA, chapter: 3, verse: 35, expect: 'श्रेयान्स्वधर्मो',
        context: 'Arjuna asks if an easier, foreign path is preferable to his demanding duty.',
        explanation: 'It is vastly better to live your own authentic calling imperfectly than to mimic someone else’s life with perfection.',
        reflection: 'Where in your life are you currently tempted to copy others instead of walking your true lane?',
      },
      {
        id: 'bgf5', scriptureId: GITA, chapter: 4, verse: 7, expect: 'यदा यदा हि धर्मस्य',
        context: 'Krishna explains the cosmic law of moral equilibrium and the descent of divine order.',
        explanation: 'Whenever righteousness wanes and chaos mounts, universal consciousness intervenes to protect the good and restore truth.',
        reflection: 'How can you be a small instrument of truth, justice, or healing in your everyday circle today?',
      },
      {
        id: 'bgf6', scriptureId: GITA, chapter: 18, verse: 66, expect: 'सर्वधर्मान्परित्यज्य',
        context: 'The culminating teaching: Krishna bids Arjuna to surrender all conditioned identities and take refuge in the Divine.',
        explanation: 'Lay down the heavy burden of doership, anxiety, and guilt. Trust in the supreme presence and grieve no more.',
        reflection: 'What heavy mental weight are you ready to surrender to the higher power today?',
      },
    ],
    related: [
      { label: 'Gita in 18 Lessons', href: '/learn/journeys/gita-in-18-lessons' },
      { label: 'Concept: Dharma', href: '/concepts/dharma' },
    ],
    sources: SOURCES,
  },

  // ─── 3. SELF DISCOVERY ─────────────────────────────────────────────────────
  {
    id: 'self-discovery',
    title: 'Self Discovery',
    titleHi: 'आत्म साक्षात्कार',
    objective: 'Journey into the mystery of who you truly are beyond the transient body, mind, and social roles.',
    audience: 'Seekers pondering identity, mortality, and the eternal witness consciousness.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'intermediate',
    icon: '🪞',
    lessons: [
      {
        id: 'sd1', scriptureId: GITA, chapter: 2, verse: 13, expect: 'देहिनोऽस्मिन्',
        context: 'Krishna introduces the dehi—the embodied witness that passes through childhood, youth, and age.',
        explanation: 'You are not the aging body; you are the radiant awareness that experiences the journey of the body.',
        reflection: 'Take a breath and feel the silent observer listening right now. Has that observer ever aged a single second?',
      },
      {
        id: 'sd2', scriptureId: GITA, chapter: 2, verse: 20, expect: 'न जायते म्रियते',
        context: 'A sublime declaration on the birthless, deathless nature of the Atman.',
        explanation: 'The Self is never born, nor does it ever die. When the transient physical form ends, consciousness remains untainted.',
        reflection: 'How does knowing you are fundamentally indestructible dissolve everyday fear and insecurity?',
      },
      {
        id: 'sd3', scriptureId: GITA, chapter: 2, verse: 22, expect: 'वासांसि जीर्णानि',
        context: 'The famous metaphor of casting off worn-out garments.',
        explanation: 'Just as a person discards tattered clothes for fresh attire, consciousness casts off bodies across time without loss.',
        reflection: 'What outdated habit, role, or identity are you ready to gently shed today like an old garment?',
      },
      {
        id: 'sd4', scriptureId: GITA, chapter: 2, verse: 23, expect: 'नैनं छिन्दन्ति',
        context: 'Weapons cannot pierce the Self, fire cannot burn it, water cannot wet it, wind cannot dry it.',
        explanation: 'Your essential core cannot be damaged by criticism, circumstance, emotional hurt, or physical hardship.',
        reflection: 'Rest in that deep untouchable sanctuary within you right now.',
      },
      {
        id: 'sd5', scriptureId: 'katha', chapter: 3, verse: 14, expect: 'उत्तिष्ठत जाग्रत',
        context: 'Yama’s clarion call in the Katha Upanishad: Arise! Awake! Approach the wise and realize the Self.',
        explanation: 'The spiritual path requires fierce alertness, sharp as a razor’s edge, calling us out of spiritual slumber.',
        reflection: 'In what area of your life have you been sleepwalking, and how can you wake up to your higher potential?',
      },
      {
        id: 'sd6', scriptureId: GITA, chapter: 15, verse: 15, expect: 'सर्वस्य चाहं हृदि',
        context: 'The divine seated in the heart of all beings as the source of intuition, memory, and discernment.',
        explanation: 'The eternal light is not hidden in a distant heaven—it is pulsing within your own heart at this very moment.',
        reflection: 'Place your hand over your heart. Breathe gently and acknowledge the divine presence within.',
      },
    ],
    related: [
      { label: 'Concept: Atman', href: '/concepts/atman' },
      { label: 'Wisdom for Life: Self-knowledge', href: '/wisdom-for-life/self-knowledge' },
    ],
    sources: SOURCES,
  },

  // ─── 4. KARMA YOGA ─────────────────────────────────────────────────────────
  {
    id: 'karma-yoga',
    title: 'Karma Yoga',
    titleHi: 'कर्मयोग साधना',
    objective: 'Master the art of action: transforming daily work into joyful, stress-free spiritual meditation.',
    audience: 'Professionals, students, and creators navigating modern workplace stress and ambition.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'beginner',
    icon: '⚡',
    lessons: [
      {
        id: 'ky1', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'The foundational equation: work belongs to you, the fruit belongs to the cosmos.',
        explanation: 'Detachment from outcome is not indifference; it is total absorption in the quality of the process.',
        reflection: 'What one task can you execute today with 100% craftsmanship and 0% anxiety over credit?',
      },
      {
        id: 'ky2', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Krishna instructs Arjuna to act established in equanimity (Yogasthah kuru karmani).',
        explanation: 'When your equilibrium does not depend on applause or condemnation, your capacity for sustained work skyrockets.',
        reflection: 'How can you protect your mental calm during challenging conversations today?',
      },
      {
        id: 'ky3', scriptureId: GITA, chapter: 3, verse: 9, expect: 'यज्ञार्थात्कर्मणो',
        context: 'Action done as an offering (Yajna) liberates; action done solely for selfish consumption binds.',
        explanation: 'When your work serves the larger whole, it sheds stress and transforms into a sacred flow state.',
        reflection: 'How does your daily work benefit someone beyond your immediate self?',
      },
      {
        id: 'ky4', scriptureId: GITA, chapter: 3, verse: 19, expect: 'तस्मादसक्तः सततं',
        context: 'Perform obligatory duty without attachment to reach the highest state of consciousness.',
        explanation: 'Enlightenment is not found by abandoning the world, but by acting cleanly within it without sticky grasping.',
        reflection: 'Notice where you feel an urge to control people or things around you—can you soften that grip?',
      },
      {
        id: 'ky5', scriptureId: GITA, chapter: 4, verse: 18, expect: 'कर्मण्यकर्म',
        context: 'Seeing inaction in action and action in inaction: the pinnacle of practical wisdom.',
        explanation: 'The true sage maintains deep inner stillness even during whirlwind activity, and stays fully aware even in rest.',
        reflection: 'Can you touch an anchor of silent stillness inside yourself right now in the middle of your busy day?',
      },
      {
        id: 'ky6', scriptureId: GITA, chapter: 5, verse: 10, expect: 'ब्रह्मण्याधाय',
        context: 'Surrendering actions to the Divine, living untainted as a lotus leaf in water.',
        explanation: 'Though the lotus root sits in muddy waters, its leaf remains untouched and pristine. Live in the world with that same purity.',
        reflection: 'Visualise yourself moving through today like a lotus leaf—fully engaged, yet completely untouched by toxicity.',
      },
    ],
    related: [
      { label: 'Concept: Karma', href: '/concepts/karma' },
      { label: 'Wisdom for Life: Duty and decision-making', href: '/wisdom-for-life/duty-and-decision-making' },
    ],
    sources: SOURCES,
  },

  // ─── 5. BHAKTI YOGA ────────────────────────────────────────────────────────
  {
    id: 'bhakti-yoga',
    title: 'Bhakti Yoga',
    titleHi: 'भक्तियोग व समर्पण',
    objective: 'Open the heart through selfless devotion, reverence, and loving surrender to the Supreme.',
    audience: 'Seekers wanting to cultivate deep emotional sweetness, gratitude, and divine connection.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'beginner',
    icon: '🌸',
    lessons: [
      {
        id: 'by1', scriptureId: GITA, chapter: 9, verse: 26, expect: 'पत्रं पुष्पं फलं तोयं',
        context: 'Krishna declares that the smallest offering—a leaf, flower, fruit, or water—is cherished when given with love.',
        explanation: 'The Divine values the purity of your devotion, not the grandeur or expense of the gift.',
        reflection: 'What small, sincere act of gratitude can you offer to the universe or to someone today?',
        activity: 'Offer a single flower or a quiet prayer of thanks with a completely open heart.',
      },
      {
        id: 'by2', scriptureId: GITA, chapter: 9, verse: 34, expect: 'मन्मना भव मद्भक्तो',
        context: 'Fix your mind on the Divine, be devoted, worship, and bow: the total alignment of being.',
        explanation: 'When thoughts, emotions, and daily actions all point toward the sacred, life becomes an unbroken prayer.',
        reflection: 'What thought pattern routinely pulls your heart away from love and gratitude?',
      },
      {
        id: 'by3', scriptureId: GITA, chapter: 12, verse: 8, expect: 'मय्येव मन आधत्स्व',
        context: 'Krishna invites Arjuna to place both the emotional mind and the analytical intellect in the Divine.',
        explanation: 'Devotion is not blind emotionalism; it is the harmonious union of loving emotion and clear intellectual surrender.',
        reflection: 'Where does your mind naturally drift when you have a moment of silence?',
      },
      {
        id: 'by4', scriptureId: GITA, chapter: 12, verse: 13, expect: 'अद्वेष्टा सर्वभूतानां',
        context: 'The marks of the true bhakta: compassion, patience, freedom from ego and possessiveness.',
        explanation: 'Real devotion shows in how you treat other beings, not in external ritualistic displays.',
        reflection: 'Can you show unconditional kindness to someone today without expecting anything in return?',
      },
      {
        id: 'by5', scriptureId: GITA, chapter: 18, verse: 55, expect: 'भक्त्या मामभिजानाति',
        context: 'Through authentic devotion one comes to know the Divine in truth, and knowing truth, enters into it.',
        explanation: 'Love and wisdom are not opposites; highest love leads directly to highest realization.',
        reflection: 'How does loving something deeply help you perceive its hidden beauty?',
      },
    ],
    related: [
      { label: 'Introduction to Bhakti', href: '/learn/journeys/introduction-to-bhakti' },
      { label: 'Wisdom for Life: Devotion', href: '/wisdom-for-life/devotion' },
    ],
    sources: SOURCES,
  },

  // ─── 6. JNANA YOGA ─────────────────────────────────────────────────────────
  {
    id: 'jnana-yoga',
    title: 'Jnana Yoga',
    titleHi: 'ज्ञानयोग व विवेक',
    objective: 'Sharpen the intellect through discernment (Viveka), self-inquiry, and realization of the non-dual truth.',
    audience: 'Seekers drawn to philosophical clarity, deep questioning, and Vedantic insight.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'advanced',
    icon: '💡',
    lessons: [
      {
        id: 'jy1', scriptureId: GITA, chapter: 4, verse: 34, expect: 'तद्विद्धि प्रणिपातेन',
        context: 'Krishna explains how higher wisdom is approached: through reverence, inquiry, and selfless service.',
        explanation: 'True knowledge requires a combination of humble receptivity and vigorous critical questioning.',
        reflection: 'What fundamental question about your existence have you been postponing exploring?',
      },
      {
        id: 'jy2', scriptureId: GITA, chapter: 4, verse: 38, expect: 'न हि ज्ञानेन सदृशं',
        context: 'Nothing on earth purifies consciousness like spiritual wisdom, discovered within through time.',
        explanation: 'Knowledge dissolves the deepest psychological knots and burning anxieties far more permanently than temporary fixes.',
        reflection: 'Recall a past misconception you outgrew—how did that insight immediately bring peace?',
      },
      {
        id: 'jy3', scriptureId: GITA, chapter: 5, verse: 18, expect: 'विद्याविनयसंपन्ने',
        context: 'The sage endowed with wisdom looks with an equal eye (sama-darshina) upon all forms of life.',
        explanation: 'Jnana sees the identical divine spark in all beings, regardless of their social rank, background, or species.',
        reflection: 'Who is someone you tend to judge unfairly? Can you look past their surface personality to their core awareness?',
      },
      {
        id: 'jy4', scriptureId: GITA, chapter: 13, verse: 29, expect: 'समं पश्यन्हि',
        context: 'Seeing the same Lord equally established in all beings, one does not destroy oneself by oneself.',
        explanation: 'When you recognize that harm done to another is harm done to your own self, compassion becomes effortless and universal.',
        reflection: 'How does universal non-duality change how you handle conflict or competitive envy?',
      },
      {
        id: 'jy5', scriptureId: 'mundaka', chapter: 5, verse: 6, expect: 'सत्यमेव जयते',
        context: 'The immortal decree of the Mundaka Upanishad: Truth alone triumphs, never falsehood.',
        explanation: 'Falsehood may claim quick, superficial wins, but the cosmic order inexorably bends toward ultimate truth.',
        reflection: 'Where is speaking or living the truth hardest for you right now, and what courage does it ask?',
      },
    ],
    related: [
      { label: 'Introduction to the Upanishads', href: '/learn/journeys/introduction-to-the-upanishads' },
      { label: 'Concept: Brahman', href: '/concepts/brahman' },
    ],
    sources: SOURCES,
  },

  // ─── 7. MEDITATION JOURNEY ─────────────────────────────────────────────────
  {
    id: 'meditation-journey',
    title: 'Meditation Journey',
    titleHi: 'ध्यान व समाधि',
    objective: 'Step-by-step guidance on steadying the restless mind, cultivating stillness, and accessing inner peace.',
    audience: 'Anyone struggling with mental turbulence, wandering attention, and seeking daily meditative discipline.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'intermediate',
    icon: '🧘',
    lessons: [
      {
        id: 'mj1', scriptureId: GITA, chapter: 6, verse: 5, expect: 'उद्धरेदात्मनाऽऽत्मानं',
        context: 'Krishna begins the science of meditation by addressing the seeker’s relationship with their own mind.',
        explanation: 'Meditation is not fighting the mind; it is training the mind to become a reliable, trustworthy partner.',
        reflection: 'When your mind wanders off, do you scold yourself, or can you treat it with gentle authority?',
      },
      {
        id: 'mj2', scriptureId: GITA, chapter: 6, verse: 17, expect: 'युक्ताहारविहारस्य',
        context: 'The practical prerequisite: moderation in food, recreation, work, and sleep.',
        explanation: 'Extreme asceticism or extreme indulgence both wreck meditation. Balance is the quiet foundation of a calm nervous system.',
        reflection: 'Which daily habit—screen time, diet, sleep, or schedule—most disturbs your mental calm?',
        activity: 'Take a 10-minute digital fast before sleeping tonight.',
      },
      {
        id: 'mj3', scriptureId: GITA, chapter: 6, verse: 26, expect: 'यतो यतो निश्चरति',
        context: 'The universal instruction for meditation: from wherever the restless mind wanders, gently lead it back.',
        explanation: 'Meditation is not the absence of drifting thoughts—it is the gentle, continuous act of returning home.',
        reflection: 'Sit quietly for 3 minutes. Each time a thought pulls you away, silently note it and return to the breath.',
      },
      {
        id: 'mj4', scriptureId: GITA, chapter: 6, verse: 35, expect: 'अभ्यासेन तु कौन्तेय',
        context: 'Arjuna complains the mind is wild as the wind. Krishna validates his struggle and gives the dual remedy: Abhyasa and Vairagya.',
        explanation: 'Steady, patient practice (Abhyasa) paired with conscious release of cravings (Vairagya) will tame the wildest mind.',
        reflection: 'What small meditation practice can you commit to doing every single morning for 5 minutes?',
      },
      {
        id: 'mj5', scriptureId: GITA, chapter: 2, verse: 70, expect: 'आपूर्यमाणमचलप्रतिष्ठं',
        context: 'The sublime metaphor of the vast ocean remaining full and unmoved despite rivers of experience rushing into it.',
        explanation: 'Desires and thoughts will enter your awareness like rivers, but like the deep ocean, you remain undisturbed at your core.',
        reflection: 'Rest as the ocean of consciousness. Let passing thoughts be ripples on the surface.',
      },
    ],
    related: [
      { label: 'Seven Days of Focus', href: '/learn/journeys/seven-days-of-focus' },
      { label: 'Wisdom for Life: Meditation', href: '/wisdom-for-life/meditation' },
    ],
    sources: SOURCES,
  },

  // ─── 8. STUDENT SUCCESS ───────────────────────────────────────────────────
  {
    id: 'student-success',
    title: 'Student Success',
    titleHi: 'विद्यार्थी जीवन व एकाग्रता',
    objective: 'Scriptural principles for deep focus, overcoming exam panic, mastering procrastination, and purposeful learning.',
    audience: 'Students, competitive exam aspirants, and lifelong learners.',
    minutesPerLesson: 6,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'life',
    difficulty: 'beginner',
    icon: '🎓',
    lessons: [
      {
        id: 'ss1', scriptureId: GITA, chapter: 2, verse: 41, expect: 'व्यवसायात्मिका',
        context: 'Krishna contrasts single-pointed focused intellect (vyavasayatmika buddhi) with scattered, multi-branching distractions.',
        explanation: 'Mastery comes from choosing one clear priority and saying a resolute "no" to fifty fleeting impulses.',
        reflection: 'What is the single most important topic or project you need to focus on today?',
        activity: 'Write down your #1 study objective for today and eliminate phone notifications during that block.',
      },
      {
        id: 'ss2', scriptureId: GITA, chapter: 4, verse: 34, expect: 'तद्विद्धि प्रणिपातेन',
        context: 'Approaching mentors and knowledge with curiosity, respect, and fearless inquiry.',
        explanation: 'Learning accelerates when you stop pretending you understand and ask genuine, clarifying questions.',
        reflection: 'What concept or problem in your studies currently confuses you? Who can you ask for help?',
      },
      {
        id: 'ss3', scriptureId: GITA, chapter: 4, verse: 38, expect: 'न हि ज्ञानेन सदृशं',
        context: 'Nothing purifies the mind and builds authentic confidence like genuine mastery of knowledge.',
        explanation: 'Shortcuts and cramming create fragile confidence. True peace comes from patient, deep understanding.',
        reflection: 'Are you studying merely for marks, or for the joy and empowerment of real mastery?',
      },
      {
        id: 'ss4', scriptureId: GITA, chapter: 6, verse: 17, expect: 'युक्ताहारविहारस्य',
        context: 'The role of sleep, nutrition, and recreation in supporting high cognitive stamina.',
        explanation: 'Burnout is not a badge of honor. A well-rested brain assimilates concepts twice as fast as an exhausted one.',
        reflection: 'How many hours of sleep did you get last night, and how did it directly impact your focus?',
      },
      {
        id: 'ss5', scriptureId: GITA, chapter: 6, verse: 35, expect: 'अभ्यासेन तु कौन्तेय',
        context: 'Overcoming mental fatigue through patient, iterative repetition (Abhyasa).',
        explanation: 'Difficulty with a subject does not mean you lack intelligence; it simply means your neurons need more reps.',
        reflection: 'Give yourself permission to struggle with a difficult concept today without getting disheartened.',
      },
    ],
    related: [
      { label: 'Wisdom for Students', href: '/learn/journeys/wisdom-for-students' },
      { label: 'Wisdom for Life: Concentration', href: '/wisdom-for-life/concentration' },
    ],
    sources: SOURCES,
  },

  // ─── 9. LEADERSHIP THROUGH DHARMA ──────────────────────────────────────────
  {
    id: 'leadership-through-dharma',
    title: 'Leadership Through Dharma',
    titleHi: 'धर्मयुक्त नेतृत्व',
    objective: 'Timeless principles for ethical decision-making, leading by personal standard, and inspiring collective purpose.',
    audience: 'Managers, founders, team leaders, and community organizers.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'life',
    difficulty: 'intermediate',
    icon: '👑',
    lessons: [
      {
        id: 'ltd1', scriptureId: GITA, chapter: 3, verse: 21, expect: 'यद्यदाचरति',
        context: 'Krishna explains: whatever standard a leader sets in conduct, the world naturally mirrors.',
        explanation: 'People follow your actual behavior, not your speeches. True authority is rooted in personal integrity.',
        reflection: 'What unspoken standard are your daily actions currently communicating to those around you?',
      },
      {
        id: 'ltd2', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Leading from a center of equanimity in the face of market swings, wins, and crises.',
        explanation: 'A reactive leader spreads panic; a centered leader absorbs volatility and transmits calm clarity.',
        reflection: 'In high-pressure situations, do you amplify anxiety or project grounded confidence?',
      },
      {
        id: 'ltd3', scriptureId: GITA, chapter: 17, verse: 15, expect: 'अनुद्वेगकरं वाक्यं',
        context: 'The discipline of truthful, beneficial, non-distressing speech (Anudvega-karam vakyam).',
        explanation: 'Speak truth with constructive empathy. Avoid demeaning or panic-inducing communication.',
        reflection: 'Think of feedback you must deliver soon—how can you make it completely truthful yet deeply empowering?',
      },
      {
        id: 'ltd4', scriptureId: GITA, chapter: 12, verse: 13, expect: 'अद्वेष्टा सर्वभूतानां',
        context: 'Leading with genuine goodwill, without jealousy or petty rivalries.',
        explanation: 'Great leaders rejoice in the brilliance and growth of their team members rather than feeling threatened.',
        reflection: 'Whose growth or contribution in your team can you celebrate and champion today?',
      },
      {
        id: 'ltd5', scriptureId: GITA, chapter: 3, verse: 25, expect: 'सक्ताः कर्मण्य',
        context: 'Just as unreflective people act with selfish attachment, the wise leader acts with equal energy for the common good.',
        explanation: 'Bring top-tier drive, excellence, and stamina, but dedicated to the welfare of the organization and society (Lokasamgraha).',
        reflection: 'What is the higher mission of your current organization or team beyond mere quarterly metrics?',
      },
    ],
    related: [
      { label: 'Wisdom for Life: Leadership', href: '/wisdom-for-life/leadership' },
      { label: 'Understanding Karma Yoga', href: '/learn/journeys/understanding-karma-yoga' },
    ],
    sources: SOURCES,
  },

  // ─── 10. RESTLESS MIND: GITA STUDY ────────────────────────────────────────
  {
    id: 'stress-and-anxiety-relief',
    title: 'The Restless Mind: A Gita Study',
    titleHi: 'चंचल मन पर गीता-मनन',
    objective: 'A short study of Gita passages on change, action, the wandering mind, and refuge.',
    audience: 'Readers who want to study these themes in the Bhagavad Gita.',
    minutesPerLesson: 6,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'healing',
    difficulty: 'beginner',
    icon: '🌿',
    lessons: [
      {
        id: 'sar1', scriptureId: GITA, chapter: 2, verse: 14, expect: 'मात्रास्पर्शास्तु',
        context: 'Krishna describes contact with sensory experience as changeable and advises Arjuna to meet it with forbearance.',
        explanation: 'The verse places pleasure and pain within changing experience. It invites study of patience; it does not promise that difficult feelings will pass on a fixed schedule.',
        reflection: 'What is changing in this situation, and what still deserves your care and attention?',
        activity: 'Pause and name the matter that needs attention. Choose one practical action, or let the reading end here.',
      },
      {
        id: 'sar2', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Krishna distinguishes engagement in action from attachment to its fruits, while also cautioning against attachment to inaction.',
        explanation: 'Read the verse with its full four-part teaching: attend to action, examine attachment to outcomes, and do not turn the teaching into a reason to avoid responsibility.',
        reflection: 'Which part of this situation can you act on, and which outcome cannot be guaranteed by your effort alone?',
      },
      {
        id: 'sar3', scriptureId: GITA, chapter: 2, verse: 70, expect: 'आपूर्यमाणमचलप्रतिष्ठं',
        context: 'The ocean image describes the steadiness of the person of settled wisdom amid the arrival of desires.',
        explanation: 'The image belongs to the Gita’s description of a sage. Study what it says about desire and steadiness without treating it as a demand to suppress grief or ordinary feeling.',
        reflection: 'What desire or expectation is present, and what does it ask you to do?',
      },
      {
        id: 'sar4', scriptureId: GITA, chapter: 6, verse: 26, expect: 'यतो यतो निश्चरति',
        context: 'Krishna instructs Arjuna to bring the mind back to the Self whenever it wanders.',
        explanation: 'The verse describes returning the wandering mind; it does not require that attention never wander.',
        reflection: 'When attention wanders, what gentle cue could help you return to this reading or task?',
      },
      {
        id: 'sar5', scriptureId: GITA, chapter: 18, verse: 66, expect: 'सर्वधर्मान्परित्यज्य',
        context: 'Krishna’s instruction on taking refuge is spoken within the dialogue’s wider teaching on action, discernment, and devotion.',
        explanation: 'Read this verse within the whole dialogue and its traditions. It should not be used to dismiss practical duties, grief, or the need for support.',
        reflection: 'What question remains open for you, and who or what could offer sound support as you consider it?',
      },
    ],
    related: [
      { label: 'Seven Days of Focus', href: '/learn/journeys/seven-days-of-focus' },
      { label: 'Wisdom for Life: Fear and courage', href: '/wisdom-for-life/fear-and-courage' },
    ],
    sources: SOURCES,
  },

  // ─── 11. PURPOSE AND MEANING ───────────────────────────────────────────────
  {
    id: 'purpose-and-meaning',
    title: 'Purpose and Meaning',
    titleHi: 'जीवन का परम उद्देश्य',
    objective: 'Discover your unique path, align with your natural calling (Swadharma), and touch timeless purpose.',
    audience: 'Seekers questioning their life direction, career transition, or longing for deeper significance.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'life',
    difficulty: 'intermediate',
    icon: '🧭',
    lessons: [
      {
        id: 'pm1', scriptureId: GITA, chapter: 2, verse: 7, expect: 'शिष्यस्तेऽहं',
        context: 'Arjuna realizes worldly victory without inner meaning is empty, and asks for authentic direction.',
        explanation: 'Meaning begins when worldly success no longer satisfies the hunger of your soul.',
        reflection: 'What matters more to you than external status or social approval?',
      },
      {
        id: 'pm2', scriptureId: GITA, chapter: 3, verse: 35, expect: 'श्रेयान्स्वधर्मो',
        context: 'Your own natural calling (Swadharma) brings peace; imitating another’s hype brings fear.',
        explanation: 'Your true purpose is not a job title; it is the natural expression of your unique gifts in service of life.',
        reflection: 'What activities make you lose track of time and feel deeply alive and authentic?',
      },
      {
        id: 'pm3', scriptureId: GITA, chapter: 10, verse: 8, expect: 'अहं सर्वस्य प्रभवो',
        context: 'Everything springs from one cosmic source, held together in an interconnected tapestry.',
        explanation: 'You are not an isolated accident in the cosmos; you are an essential expression of the whole.',
        reflection: 'How does feeling part of a larger divine design shift your daily priorities?',
      },
      {
        id: 'pm4', scriptureId: GITA, chapter: 15, verse: 15, expect: 'सर्वस्य चाहं हृदि',
        context: 'The indwelling guide in the heart as the source of clarity, memory, and purpose.',
        explanation: 'Quiet the external noise long enough to listen to the whisper of your inner conscience.',
        reflection: 'What is your inner intuition telling you right now that you have been ignoring?',
      },
      {
        id: 'pm5', scriptureId: 'brihadaranyaka', chapter: 3, verse: '1.3.28', expect: 'असतो मा सद्गमय',
        context: 'The immortal Upanishadic prayer: From untruth lead me to truth; from darkness to light; from death to immortality.',
        explanation: 'Life’s highest purpose is the progressive journey from illusion into radiant spiritual reality.',
        reflection: 'What is one step you can take today toward living with greater truth and light?',
      },
    ],
    related: [
      { label: 'Self Discovery', href: '/learn/journeys/self-discovery' },
      { label: 'Wisdom for Life: Meaning of life', href: '/wisdom-for-life/meaning-of-life/' },
    ],
    sources: SOURCES,
  },

  // ─── 12. MINDFULNESS AND DETACHMENT ────────────────────────────────────────
  {
    id: 'mindfulness-and-detachment',
    title: 'Mindfulness and Detachment',
    titleHi: 'साक्षी भाव व अनासक्ति',
    objective: 'Cultivate witnessing awareness (Sakshi Bhava), freedom from reactive impulses, and deep equanimity.',
    audience: 'Practitioners wanting to liberate themselves from emotional over-reactivity and mental grasping.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'healing',
    difficulty: 'intermediate',
    icon: '🌊',
    lessons: [
      {
        id: 'md1', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Equanimity toward success and failure as the ultimate expression of mindfulness.',
        explanation: 'Mindfulness is not blanking out; it is maintaining quiet poise while life moves around you.',
        reflection: 'When something unexpected occurs today, can you pause for two seconds before reacting?',
      },
      {
        id: 'md2', scriptureId: GITA, chapter: 5, verse: 10, expect: 'ब्रह्मण्याधाय',
        context: 'The lotus leaf untouched by the mud and water in which it flourishes.',
        explanation: 'Detachment is not cold detachment from love; it is freedom from toxic possessiveness.',
        reflection: 'Can you love and care for someone today without needing to control their reactions?',
      },
      {
        id: 'md3', scriptureId: GITA, chapter: 6, verse: 26, expect: 'यतो यतो निश्चरति',
        context: 'Mindfully noticing where attention drifts and gently returning to presence.',
        explanation: 'The moment you notice your mind has wandered, you are already mindful. Celebrate the return.',
        reflection: 'Notice where your thoughts go during routine chores like washing dishes or walking.',
      },
      {
        id: 'md4', scriptureId: GITA, chapter: 14, verse: 5, expect: 'सत्त्वं रजस्तम',
        context: 'Observing the three gunas (Sattva: clarity, Rajas: agitation, Tamas: inertia) without identifying with them.',
        explanation: 'Moods and energy levels fluctuate through the gunas, but you remain the serene witness of them all.',
        reflection: 'Which guna is predominant in your body and mind right now—clarity, restlessness, or heaviness?',
      },
      {
        id: 'md5', scriptureId: 'ishavasya', chapter: 1, verse: 1, expect: 'ईशा वास्यमिदं',
        context: 'Tena tyaktena bhunjitha—enjoy through renunciation and mindful non-possessiveness.',
        explanation: 'The only things you can truly enjoy in this life are those you hold with open hands without clinging.',
        reflection: 'What are you holding onto too tightly? Can you open your palm and let it breathe?',
      },
    ],
    related: [
      { label: 'Seven Days of Focus', href: '/learn/journeys/seven-days-of-focus' },
      { label: 'Meditation Journey', href: '/learn/journeys/meditation-journey' },
    ],
    sources: SOURCES,
  },

  // ─── LEGACY & EXTENDED JOURNEYS (PRESERVED) ────────────────────────────────
  {
    id: 'seven-days-of-focus',
    title: 'Seven Days of Focus',
    titleHi: 'एकाग्रता के सात दिन',
    objective: 'Read seven verses from the Gita on a steady, gathered mind, one a day.',
    audience: 'Anyone who finds their attention scattered and wants a calm place to start.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'beginner',
    icon: '🎯',
    lessons: [
      {
        id: 'f1', scriptureId: GITA, chapter: 2, verse: 41, expect: 'व्यवसायात्मिका',
        context: 'Krishna contrasts a resolved mind with a scattered one.',
        explanation: 'A mind with one clear resolve is steady. A mind pulled in many directions has little rest.',
        reflection: 'What is one aim you could name today so your attention has somewhere to settle?',
        activity: 'Write one sentence naming the single thing you most want to finish today.',
      },
      {
        id: 'f2', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Krishna tells Arjuna where his responsibility lies.',
        explanation: 'The verse points the mind at the action in front of you, away from worry over results.',
        reflection: 'Where does your attention go while you work: to the task, or to how it will turn out?',
        activity: 'Give 15 minutes to the next useful step of one task, without checking how it is going.',
      },
      {
        id: 'f3', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Equanimity in action.',
        explanation: 'Acting from steadiness, not clinging, lets success and failure be received with equal calm.',
        reflection: 'How does your work feel when you are not gripping the outcome?',
      },
      {
        id: 'f4', scriptureId: GITA, chapter: 6, verse: 5, expect: 'उद्धरेदात्मनाऽऽत्मानं',
        context: 'The mind as friend and obstacle.',
        explanation: 'One’s own mind can lift a person up or pull them down.',
        reflection: 'In what ways has your own mind been a friend to you this week?',
      },
      {
        id: 'f5', scriptureId: GITA, chapter: 6, verse: 26, expect: 'यतो यतो निश्चरति',
        context: 'Restlessness and returning.',
        explanation: 'Whenever the mind wanders, bring it back gently.',
        reflection: 'What usually pulls your attention away, and what could help you return?',
        activity: 'Sit for three minutes. Each time you notice you have drifted, return to your breath.',
      },
      {
        id: 'f6', scriptureId: GITA, chapter: 6, verse: 35, expect: 'अभ्यासेन तु कौन्तेय',
        context: 'The two supports for taming the mind.',
        explanation: 'Steady practice and loosening of grasping make it possible to steady the mind over time.',
        reflection: 'Which small practice could you repeat daily, even for a few minutes?',
      },
      {
        id: 'f7', scriptureId: GITA, chapter: 2, verse: 70, expect: 'आपूर्यमाणमचलप्रतिष्ठं',
        context: 'The sea as an image of the steady mind.',
        explanation: 'Waters flow into a full, unmoving ocean without disturbing it. A steady mind receives experiences in the same way.',
        reflection: 'What would it feel like to let today’s demands arrive without being carried off by them?',
      },
    ],
    related: [
      { label: 'Wisdom for Life: Concentration', href: '/wisdom-for-life/concentration' },
      { label: 'Wisdom for Life: Discipline', href: '/wisdom-for-life/discipline' },
    ],
    sources: SOURCES,
  },
  {
    id: 'gita-in-18-lessons',
    title: 'Gita in 18 Lessons',
    titleHi: 'अठारह पाठों में गीता',
    objective: 'Read one verse from each of the Gita’s eighteen chapters, in order, to follow the shape of the whole teaching.',
    audience: 'New readers who want a map of the Gita before reading it in full.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'foundations',
    difficulty: 'intermediate',
    icon: '📖',
    lessons: [
      {
        id: 'g1', scriptureId: GITA, chapter: 1, verse: 1, expect: 'धर्मक्षेत्रे',
        context: 'A blind king asks his narrator what is happening on the battlefield of Dharma.',
        explanation: 'The question names the field a field of dharma. Everything answers a human crisis.',
        reflection: 'What is a situation in your own life that is practical and moral at the same time?',
      },
      {
        id: 'g2', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Krishna speaks about action.',
        explanation: 'Your responsibility is the action itself; warn against being ruled by outcome.',
        reflection: 'Which of your efforts today could you do well whatever the result?',
        activity: 'Give 15 minutes to the next useful step of one task.',
      },
      {
        id: 'g3', scriptureId: GITA, chapter: 3, verse: 35, expect: 'श्रेयान्स्वधर्मो',
        context: 'Why one should act, and whether another path might be easier.',
        explanation: 'Better to do one’s own duty imperfectly than another’s duty well.',
        reflection: 'What does doing your own part ask of you at the moment?',
      },
      {
        id: 'g4', scriptureId: GITA, chapter: 4, verse: 7, expect: 'यदा यदा हि धर्मस्य',
        context: 'Krishna speaks about the renewal of moral order.',
        explanation: 'Whenever dharma declines, divine order manifests to protect truth.',
        reflection: 'Where have you seen order restored after a time of confusion?',
      },
      {
        id: 'g5', scriptureId: GITA, chapter: 5, verse: 18, expect: 'विद्याविनयसंपन्ने',
        context: 'The equal eye of the wise.',
        explanation: 'The wise look on all beings with an equal eye.',
        reflection: 'Whom do you find it hardest to look at with an even mind?',
      },
      {
        id: 'g6', scriptureId: GITA, chapter: 6, verse: 17, expect: 'युक्ताहारविहारस्य',
        context: 'Moderation as the foundation of yoga.',
        explanation: 'Moderation in food, work, and sleep makes yoga a remover of sorrow.',
        reflection: 'Which daily habit would feel steadier with gentle moderation?',
        activity: 'Choose one habit to adjust gently this week.',
      },
      {
        id: 'g7', scriptureId: GITA, chapter: 7, verse: 7, expect: 'मत्तः परतरं नान्यत्',
        context: 'All is strung on the supreme like gems on a thread.',
        explanation: 'One thread holds all different things together.',
        reflection: 'What is something that holds the different parts of your life together?',
      },
      {
        id: 'g8', scriptureId: GITA, chapter: 8, verse: 7, expect: 'तस्मात्सर्वेषु कालेषु',
        context: 'Steady remembrance combined with ordinary action.',
        explanation: 'Remember at all times and still do the work in front of you.',
        reflection: 'How can what matters most stay present while you do everyday tasks?',
      },
      {
        id: 'g9', scriptureId: GITA, chapter: 9, verse: 22, expect: 'अनन्याश्चिन्तयन्तो',
        context: 'Devotion and trust.',
        explanation: 'For those who think with undivided mind, what they lack is provided and what they have is protected.',
        reflection: 'Where in your life do you want trust and not control?',
      },
      {
        id: 'g10', scriptureId: GITA, chapter: 10, verse: 8, expect: 'अहं सर्वस्य प्रभवो',
        context: 'The cosmic source.',
        explanation: 'Everything arises from the supreme source.',
        reflection: 'What changes in how you treat people if everything shares one source?',
      },
      {
        id: 'g11', scriptureId: GITA, chapter: 11, verse: 32, expect: 'कालोऽस्मि',
        context: 'Krishna as Time.',
        explanation: 'Time is the force that brings all manifested things to their transformation.',
        reflection: 'How do you respond to the passing of time?',
      },
      {
        id: 'g12', scriptureId: GITA, chapter: 12, verse: 13, expect: 'अद्वेष्टा सर्वभूतानां',
        context: 'Character of the devotee.',
        explanation: 'Without hatred, friendly, compassionate, free from ego.',
        reflection: 'Which of these qualities do you most want to grow?',
      },
      {
        id: 'g13', scriptureId: GITA, chapter: 13, verse: 29, expect: 'समं पश्यन्हि',
        context: 'Non-harm and insight.',
        explanation: 'Seeing the same Lord in all, one does not harm oneself by oneself.',
        reflection: 'How does seeing others as part of one whole change how you act?',
      },
      {
        id: 'g14', scriptureId: GITA, chapter: 14, verse: 5, expect: 'सत्त्वं रजस्तम',
        context: 'The three qualities of nature.',
        explanation: 'Sattva, rajas, and tamas bind consciousness to embodied experience.',
        reflection: 'Which quality do you notice most in your typical day?',
      },
      {
        id: 'g15', scriptureId: GITA, chapter: 15, verse: 15, expect: 'सर्वस्य चाहं हृदि',
        context: 'The source within.',
        explanation: 'Memory, knowledge, and intuition arise from the presence in the heart.',
        reflection: 'When has an understanding arrived in you without being taught?',
      },
      {
        id: 'g16', scriptureId: GITA, chapter: 16, verse: 21, expect: 'त्रिविधं नरकस्येदं',
        context: 'Desire, anger, and greed.',
        explanation: 'The three gates to ruin; letting go of them protects mental clarity.',
        reflection: 'Which of the three comes up most for you, and what sets it off?',
      },
      {
        id: 'g17', scriptureId: GITA, chapter: 17, verse: 15, expect: 'अनुद्वेगकरं वाक्यं',
        context: 'Austerity of speech.',
        explanation: 'Truthful, pleasant, beneficial speech that does not distress.',
        reflection: 'What is one conversation where gentler speech was possible?',
        activity: 'Notice your words in one conversation today.',
      },
      {
        id: 'g18', scriptureId: GITA, chapter: 18, verse: 66, expect: 'सर्वधर्मान्परित्यज्य',
        context: 'Closing instruction of the Gita.',
        explanation: 'Relinquish all conditioned identities and take refuge in truth; grieve no more.',
        reflection: 'What would it mean for you to put down something you have been carrying?',
      },
    ],
    related: [
      { label: 'Bhagavad Gita learning path', href: '/learn/bhagavad-gita' },
      { label: 'Wisdom for Life: Duty and decision-making', href: '/wisdom-for-life/duty-and-decision-making' },
    ],
    sources: SOURCES,
  },
  {
    id: 'introduction-to-the-upanishads',
    title: 'Introduction to the Upanishads',
    titleHi: 'उपनिषद् परिचय',
    objective: 'Read five famous verses from the Isha, Katha, Mundaka, and Brihadaranyaka Upanishads.',
    audience: 'Readers new to Vedantic inquiry and the principal Upanishads.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'foundations',
    difficulty: 'intermediate',
    icon: '✨',
    lessons: [
      {
        id: 'u1', scriptureId: 'ishavasya', chapter: 1, verse: 1, expect: 'ईशा वास्यमिदं',
        context: 'The Isha Upanishad opens with divine immanence.',
        explanation: 'All is pervaded by the Lord; enjoy through non-grasping.',
        reflection: 'What would you treat differently if you saw it as pervaded by the sacred?',
      },
      {
        id: 'u2', scriptureId: 'katha', chapter: 2, verse: 2, expect: 'श्रेयश्च प्रेयश्च',
        context: 'Nachiketa’s choice between the good (Shreya) and the pleasant (Preya).',
        explanation: 'The wise discern between what is fleetingly pleasant and what is genuinely good.',
        reflection: 'Where do you feel a gap between what is pleasant and what is good?',
      },
      {
        id: 'u3', scriptureId: 'katha', chapter: 3, verse: 14, expect: 'उत्तिष्ठत जाग्रत',
        context: 'The call to awaken on the razor’s edge path.',
        explanation: 'Arise, awake, and learn from the wise; the path demands resolute courage.',
        reflection: 'What is one thing you have been putting off that you could begin today?',
      },
      {
        id: 'u4', scriptureId: 'mundaka', chapter: 5, verse: 6, expect: 'सत्यमेव जयते',
        context: 'Truth alone prevails.',
        explanation: 'Truth alone prevails, not falsehood; the highest way is paved with truth.',
        reflection: 'Where is telling the truth hardest for you, and why?',
      },
      {
        id: 'u5', scriptureId: 'brihadaranyaka', chapter: 3, verse: '1.3.28', expect: 'असतो मा सद्गमय',
        context: 'From untruth to truth, darkness to light, death to immortality.',
        explanation: 'A universal prayer seeking transformation of consciousness.',
        reflection: 'Which of the three requests feels closest to what you need now?',
      },
    ],
    related: [
      { label: 'Upanishads learning path', href: '/learn/upanishads' },
      { label: 'Concept: Atman', href: '/concepts/atman' },
    ],
    sources: SOURCES,
  },
  {
    id: 'understanding-karma-yoga',
    title: 'Understanding Karma Yoga',
    titleHi: 'कर्मयोग को समझें',
    objective: 'Follow the Gita’s teaching on acting without being bound by results, across six verses.',
    audience: 'New readers of the Gita, and students of work, duty and effort.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'beginner',
    icon: '⚡',
    lessons: [
      {
        id: 'k1', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Your responsibility is the action itself; warn against being ruled by outcome.',
        explanation: 'Focus on the task in front of you, not on anxiety over praise.',
        reflection: 'Which of your efforts today could you do well whatever the result?',
      },
      {
        id: 'k2', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Equanimity toward success and failure is called yoga.',
        explanation: 'Acting from poise lets success and failure be received with equal calm.',
        reflection: 'When did you last act well and stay level about how it went?',
      },
      {
        id: 'k3', scriptureId: GITA, chapter: 3, verse: 9, expect: 'यज्ञार्थात्कर्मणो',
        context: 'Action done as an offering.',
        explanation: 'Action done for the larger whole does not bind.',
        reflection: 'Who beyond you benefits from your work?',
      },
      {
        id: 'k4', scriptureId: GITA, chapter: 3, verse: 19, expect: 'तस्मादसक्तः सततं',
        context: 'Action without attachment.',
        explanation: 'Do what has to be done without attachment to reach the highest.',
        reflection: 'What would change if you did one task today without needing credit?',
      },
      {
        id: 'k5', scriptureId: GITA, chapter: 4, verse: 18, expect: 'कर्मण्यकर्म',
        context: 'Inaction within action.',
        explanation: 'The wise see stillness within activity.',
        reflection: 'Where might stillness exist inside your busiest moments?',
      },
      {
        id: 'k6', scriptureId: GITA, chapter: 5, verse: 10, expect: 'ब्रह्मण्याधाय',
        context: 'Like a lotus leaf in water.',
        explanation: 'Offering action without attachment leaves you untouched by negativity.',
        reflection: 'What would it mean to stay unmarked by what you do?',
      },
    ],
    related: [
      { label: 'Concept: Karma', href: '/concepts/karma' },
      { label: 'Wisdom for Life: Duty and decision-making', href: '/wisdom-for-life/duty-and-decision-making' },
    ],
    sources: SOURCES,
  },
  {
    id: 'understanding-the-self',
    title: 'Understanding the Self',
    titleHi: 'आत्मा को समझें',
    objective: 'Read four verses from the Gita’s second chapter on the Self (Atman).',
    audience: 'Readers curious about what the Gita says about the self and change.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'intermediate',
    icon: '🪞',
    lessons: [
      {
        id: 's1', scriptureId: GITA, chapter: 2, verse: 13, expect: 'देहिनोऽस्मिन्',
        context: 'The embodied self passing through childhood, youth and age.',
        explanation: 'The steady person is not shaken by bodily change.',
        reflection: 'What in you has stayed the same while everything else changed?',
      },
      {
        id: 's2', scriptureId: GITA, chapter: 2, verse: 20, expect: 'न जायते म्रियते',
        context: 'The Self as never born and never dying.',
        explanation: 'The Self is not ended when the body ends.',
        reflection: 'How does this view change what you hold on to?',
      },
      {
        id: 's3', scriptureId: GITA, chapter: 2, verse: 22, expect: 'वासांसि जीर्णानि',
        context: 'Changing clothes as an image of taking new bodies.',
        explanation: 'As old garments are set aside, the embodied self takes new forms.',
        reflection: 'What image helps you think about change without fear?',
      },
      {
        id: 's4', scriptureId: GITA, chapter: 2, verse: 23, expect: 'नैनं छिन्दन्ति',
        context: 'What cannot be cut or burned.',
        explanation: 'Weapons cannot cut consciousness; it cannot be harmed.',
        reflection: 'What feels unharmed in you even on hard days?',
      },
    ],
    related: [
      { label: 'Concept: Atman', href: '/concepts/atman' },
      { label: 'Wisdom for Life: Self-knowledge', href: '/wisdom-for-life/self-knowledge' },
    ],
    sources: SOURCES,
  },
  {
    id: 'introduction-to-bhakti',
    title: 'Introduction to Bhakti',
    titleHi: 'भक्ति का परिचय',
    objective: 'Read five verses in which the Gita speaks about devotion, to see how it presents bhakti.',
    audience: 'Readers new to the idea of bhakti, as the Gita describes it.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'yoga',
    difficulty: 'beginner',
    icon: '🌸',
    lessons: [
      {
        id: 'b1', scriptureId: GITA, chapter: 9, verse: 26, expect: 'पत्रं पुष्पं फलं तोयं',
        context: 'A leaf, a flower, a fruit or water offered with devotion is accepted.',
        explanation: 'The spirit of the offering is what matters, not its size.',
        reflection: 'What small thing could you offer with full attention today?',
      },
      {
        id: 'b2', scriptureId: GITA, chapter: 12, verse: 8, expect: 'मय्येव मन आधत्स्व',
        context: 'Fixing mind and intellect on the divine.',
        explanation: 'Devotion as a steady turning of attention.',
        reflection: 'Where does your attention settle when it is free?',
      },
      {
        id: 'b3', scriptureId: GITA, chapter: 11, verse: 54, expect: 'भक्त्या त्वनन्यया',
        context: 'By undivided devotion truth is known and entered.',
        explanation: 'Devotion is a way of knowing as well as feeling.',
        reflection: 'How is loving something different from only knowing about it?',
      },
      {
        id: 'b4', scriptureId: GITA, chapter: 18, verse: 55, expect: 'भक्त्या मामभिजानाति',
        context: 'Through devotion one comes to know the truth.',
        explanation: 'Devotion joins with clear understanding.',
        reflection: 'What do you understand better because you care about it?',
      },
      {
        id: 'b5', scriptureId: GITA, chapter: 9, verse: 34, expect: 'मन्मना भव मद्भक्तो',
        context: 'Fix mind, be devoted, worship, bow.',
        explanation: 'Devotion gathered into simple, daily remembrance.',
        reflection: 'Which one simple act expresses what matters most to you?',
      },
    ],
    related: [
      { label: 'Bhakti traditions learning path', href: '/learn/bhakti-traditions' },
      { label: 'Wisdom for Life: Devotion', href: '/wisdom-for-life/devotion' },
    ],
    sources: SOURCES,
  },
  {
    id: 'gita-for-beginners',
    title: 'Bhagavad Gita for Beginners',
    titleHi: 'गीता: आरंभिक पाठ',
    objective: 'Read six short verses that introduce the Gita’s main ideas, in the order a first-time reader meets them.',
    audience: 'Someone opening the Gita for the first time.',
    minutesPerLesson: 6,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'foundations',
    difficulty: 'beginner',
    icon: '🌱',
    lessons: [
      {
        id: 'n1', scriptureId: GITA, chapter: 2, verse: 7, expect: 'शिष्यस्तेऽहं',
        context: 'Arjuna asks to be taught as a student.',
        explanation: 'The teaching starts when he admits he does not know.',
        reflection: 'When has saying “I am not sure” helped you learn?',
      },
      {
        id: 'n2', scriptureId: GITA, chapter: 2, verse: 13, expect: 'देहिनोऽस्मिन्',
        context: 'The witnessing self across life stages.',
        explanation: 'The steady person is not shaken by physical change.',
        reflection: 'What in you has stayed the same while everything else changed?',
      },
      {
        id: 'n3', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Action itself is your domain.',
        explanation: 'Do the work without being ruled by the outcome.',
        reflection: 'Which of your efforts today could you do well whatever the result?',
        activity: 'Give 15 minutes to the next useful step of one task.',
      },
      {
        id: 'n4', scriptureId: GITA, chapter: 3, verse: 19, expect: 'तस्मादसक्तः सततं',
        context: 'Action without attachment.',
        explanation: 'Do what has to be done without attachment as a path in itself.',
        reflection: 'What would change if you did one task today without needing credit?',
      },
      {
        id: 'n5', scriptureId: GITA, chapter: 6, verse: 5, expect: 'उद्धरेदात्मनाऽऽत्मानं',
        context: 'The mind as friend and obstacle.',
        explanation: 'One’s own mind lifts or pulls down; steadiness begins with it.',
        reflection: 'In what ways has your mind been a friend to you this week?',
      },
      {
        id: 'n6', scriptureId: GITA, chapter: 12, verse: 13, expect: 'अद्वेष्टा सर्वभूतानां',
        context: 'Friendly, compassionate, free from possessiveness.',
        explanation: 'Describes character rather than ritual.',
        reflection: 'Which of these qualities do you most want to grow?',
      },
    ],
    related: [
      { label: 'Gita in 18 Lessons', href: '/learn/journeys/gita-in-18-lessons' },
      { label: 'Bhagavad Gita learning path', href: '/learn/bhagavad-gita' },
    ],
    sources: SOURCES,
  },
  {
    id: 'wisdom-for-students',
    title: 'Wisdom for Students',
    titleHi: 'विद्यार्थियों के लिए',
    objective: 'Read five verses from the Gita about learning, steadiness and effort.',
    audience: 'Students, and anyone learning something new.',
    minutesPerLesson: 6,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    category: 'life',
    difficulty: 'beginner',
    icon: '🎓',
    lessons: [
      {
        id: 's1', scriptureId: GITA, chapter: 4, verse: 34, expect: 'तद्विद्धि प्रणिपातेन',
        context: 'Humble respect, asking questions, and serving.',
        explanation: 'A manner of learning, not a mere method of study.',
        reflection: 'Whom could you ask a real question this week?',
        activity: 'Write down one question you have been holding back.',
      },
      {
        id: 's2', scriptureId: GITA, chapter: 4, verse: 38, expect: 'न हि ज्ञानेन सदृशं',
        context: 'Nothing purifies like knowledge.',
        explanation: 'Insight arrives in time with patient application.',
        reflection: 'What is something you understand now that once confused you?',
      },
      {
        id: 's3', scriptureId: GITA, chapter: 6, verse: 17, expect: 'युक्ताहारविहारस्य',
        context: 'Moderation in food, recreation, effort, and sleep.',
        explanation: 'Balance removes sorrow and supports mental sharpness.',
        reflection: 'Which study habit would feel steadier with moderation?',
        activity: 'Adjust one habit, such as sleep or breaks, for a week.',
      },
      {
        id: 's4', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Evenness toward success and failure.',
        explanation: 'Working well and receiving results calmly.',
        reflection: 'How do you feel after a result that did not match your effort?',
      },
      {
        id: 's5', scriptureId: GITA, chapter: 6, verse: 35, expect: 'अभ्यासेन तु कौन्तेय',
        context: 'Steady practice and patient repetition.',
        explanation: 'Repeated practice makes it possible to steady the mind.',
        reflection: 'Which small practice could you repeat daily?',
      },
    ],
    related: [
      { label: 'Wisdom for Life: Concentration', href: '/wisdom-for-life/concentration' },
      { label: 'Wisdom for Life: Discipline', href: '/wisdom-for-life/discipline' },
    ],
    sources: SOURCES,
  },
];

export const getJourney = (id: string) => READING_JOURNEYS.find((j) => j.id === id);

/** Journeys only enter search indexes after editorial approval. */
export const isJourneyIndexable = (journey: Pick<ReadingJourney, 'review'>): boolean =>
  journey.review === 'approved';
