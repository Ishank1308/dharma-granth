import type { FlashCardData } from '@/app/components/FlashCard';
import type { SlideData } from '@/app/components/SlideDeck';
import type { MindMapNode } from '@/app/components/MindMap';
import type { TimelineEvent } from '@/app/components/Timeline';
import type { Quiz } from '@/data/quizzes';

export type LearningFormat = 'flashcards' | 'slides' | 'mindmap' | 'timeline' | 'quizzes';

export interface LearningPathLesson {
  id: string;
  order: number;
  title: string;
  titleSanskrit?: string;
  description: string;
  estimatedMinutes: number;
  primaryFormat: LearningFormat | 'reading';
  scriptureHref: string;
  keyVerse?: {
    sanskrit: string;
    transliteration: string;
    translation: string;
    reference: string;
  };
  conceptsCovered: string[];
}

export interface LearningConcept {
  id: string;
  term: string;
  sanskrit: string;
  transliteration: string;
  definition: string;
  philosophicalContext: string;
  scriptureAnchor: string;
  relatedConceptIds: string[];
}

export interface RelatedScripture {
  id: string;
  title: string;
  titleSanskrit: string;
  category: string;
  description: string;
  totalChapters: number;
  totalVerses: number;
  href: string;
  sampleVerse: {
    sanskrit: string;
    translation: string;
    reference: string;
  };
}

export interface RevisionRecommendation {
  cadence: string;
  recommendedReviewToday: string[];
  coreVersesToMemorize: Array<{
    sanskrit: string;
    transliteration: string;
    translation: string;
    reference: string;
    philosophicalKey: string;
  }>;
  contemplativeReflection: {
    title: string;
    sanskritFocus: string;
    prompt: string;
    practicalApplication: string;
  };
  activeRecallChecklist: string[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  titleSanskrit: string;
  subtitle: string;
  learningObjective: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultySanskrit: string;
  estimatedMinutes: number;
  estimatedTime: string;
  includedFormats: LearningFormat[];
  icon: string;
  gradient: string;
  accentColor: string;
  overview: {
    mangalCharan: {
      sanskrit: string;
      transliteration: string;
      meaning: string;
      source: string;
    };
    philosophicalPremise: string;
    scholarlyContext: string;
    prerequisites: string;
    studyMethodology: string;
    learningOutcomes: string[];
  };
  lessons: LearningPathLesson[];
  keyConcepts: LearningConcept[];
  relatedScriptures: RelatedScripture[];
  flashcards: FlashCardData[];
  slides: SlideData[];
  mindmap: MindMapNode;
  timeline: TimelineEvent[];
  quiz: Quiz;
  revisionRecommendations: RevisionRecommendation;
}

export const learningPaths: LearningPath[] = [
  /* ──────────────────────────────────────────────────────────────────────────
     1. COMPLETE BEGINNER
     ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'beginner',
    slug: 'beginner',
    title: 'Complete Beginner: Foundation of Sanatana Dharma',
    titleSanskrit: 'सनातन धर्म: प्रारम्भिक स्वाध्याय',
    subtitle: 'From core cosmic principles to daily contemplation',
    learningObjective:
      'Gain a lucid, grounded understanding of the foundational pillars of Hindu thought—including Shruti vs Smriti, the four Purusharthas (Dharma, Artha, Kama, Moksha), the law of Karma, and the eternal nature of the Self (Atman).',
    difficulty: 'beginner',
    difficultySanskrit: 'प्रारम्भिक (Beginner)',
    estimatedMinutes: 45,
    estimatedTime: '45 mins',
    includedFormats: ['flashcards', 'slides', 'mindmap', 'timeline', 'quizzes'],
    icon: '🌱',
    gradient: 'from-emerald-700 via-teal-800 to-amber-950',
    accentColor: '#059669',
    overview: {
      mangalCharan: {
        sanskrit: 'ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥',
        transliteration: 'oṁ asato mā sadgamaya | tamaso mā jyotirgamaya | mṛtyormā amṛtaṁ gamaya ||',
        meaning: 'Lead me from the unreal to the Real, from darkness to Light, from death to Immortality.',
        source: 'Brihadaranyaka Upanishad 1.3.28',
      },
      philosophicalPremise:
        'Sanatana Dharma is not a dogmatic creed or single-book doctrine, but an eternal quest for Truth (Satya) grounded in cosmic harmony (Rta). This pathway is designed as a gentle, welcoming threshold for newcomers, illuminating the philosophical architecture of Indian thought with zero corporate jargon.',
      scholarlyContext:
        'Rooted in the ancient Sanskrit canonical hierarchy: primary revelation (Śruti — that which was heard directly by the Rishis) and secondary remembered tradition (Smṛti — including the epics, ethics, and puranas).',
      prerequisites: 'None. An open, contemplative mind seeking clarity.',
      studyMethodology:
        'Step-by-step reading accompanied by verse chanting contemplation (Svādhyāya), concept mind maps, and reflective self-inquiry.',
      learningOutcomes: [
        'Distinguish clearly between Śruti (revelation) and Smṛti (tradition)',
        'Understand the four aims of human life (Puruṣārthas)',
        'Comprehend the doctrine of Karma beyond casual fatalism',
        'Recognize the non-dual spark of the Self (Ātman) in daily living',
        'Pronounce foundational Sanskrit terms accurately with their philosophical nuances',
      ],
    },
    lessons: [
      {
        id: 'beg-1',
        order: 1,
        title: 'What is Sanatana Dharma? The Eternal Law of Harmony',
        titleSanskrit: 'सनातन धर्म का मूल स्वरूप',
        description: 'Explore the meaning of "Dharma" as cosmic order, moral duty, and the sustaining principle of life.',
        estimatedMinutes: 8,
        primaryFormat: 'reading',
        scriptureHref: '/scripture/bhagavadgita/chapter/1',
        keyVerse: {
          sanskrit: 'धारणाद्धर्म इत्याहुर्धर्मो धारयते प्रजाः ।',
          transliteration: 'dhāraṇāddharma ityāhurdharmo dhārayate prajāḥ |',
          translation: 'Dharma is so called because it sustains; Dharma indeed upholds all living beings in cosmic equilibrium.',
          reference: 'Mahabharata, Karna Parva 69.58',
        },
        conceptsCovered: ['Dharma', 'Rta', 'Satya'],
      },
      {
        id: 'beg-2',
        order: 2,
        title: 'The Sacred Library: Shruti vs. Smriti',
        titleSanskrit: 'श्रुति और स्मृति परम्परा',
        description: 'Navigate the vast ocean of texts: Vedas, Upanishads, Itihasas (Ramayana & Mahabharata), and Puranas.',
        estimatedMinutes: 6,
        primaryFormat: 'timeline',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'श्रुतिस्तु वेदो विज्ञेयो धर्मशास्त्रं तु वै स्मृतिः ।',
          transliteration: 'śrutistu vedo vijñeyo dharmaśāstraṁ tu vai smṛtiḥ |',
          translation: 'By Shruti is known the Veda, and by Smriti the scriptures of sacred duty.',
          reference: 'Manusmriti 2.10',
        },
        conceptsCovered: ['Shruti', 'Smriti', 'Vedas'],
      },
      {
        id: 'beg-3',
        order: 3,
        title: 'The Four Aims of Human Life: Purusharthas',
        titleSanskrit: 'चतुर्विध पुरुषार्थ — जीवन के चार सोपान',
        description: 'Balancing Dharma (righteousness), Artha (prosperity), Kama (creative joy), and Moksha (spiritual freedom).',
        estimatedMinutes: 7,
        primaryFormat: 'mindmap',
        scriptureHref: '/scripture/bhagavadgita/chapter/2',
        conceptsCovered: ['Dharma', 'Artha', 'Kama', 'Moksha'],
      },
      {
        id: 'beg-4',
        order: 4,
        title: 'The Eternal Self: Who Am I? (Atman)',
        titleSanskrit: 'आत्मा — शाश्वत चेतना',
        description: 'Discover the distinction between the transient physical body and the imperishable, luminous Self.',
        estimatedMinutes: 8,
        primaryFormat: 'flashcards',
        scriptureHref: '/scripture/bhagavadgita/chapter/2',
        keyVerse: {
          sanskrit: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः ।',
          transliteration: 'na jāyate mriyate vā kadācinnāyaṁ bhūtvā bhavitā vā na bhūyaḥ |',
          translation: 'The Self is never born, nor does it ever die; having once existed, it never ceases to be.',
          reference: 'Bhagavad Gita 2.20',
        },
        conceptsCovered: ['Atman', 'Deha vs Dehi', 'Amritatva'],
      },
      {
        id: 'beg-5',
        order: 5,
        title: 'Karma and Freedom: Action Without Entanglement',
        titleSanskrit: 'कर्म सिद्धान्त एवं स्वातन्त्र्य',
        description: 'Deconstruct popular myths of karma. Learn how conscious action becomes a doorway to inner freedom.',
        estimatedMinutes: 8,
        primaryFormat: 'slides',
        scriptureHref: '/scripture/bhagavadgita/chapter/3',
        keyVerse: {
          sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।',
          transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana |',
          translation: 'To action alone thou hast a right, never to its fruits; let not the fruits of action be thy motive.',
          reference: 'Bhagavad Gita 2.47',
        },
        conceptsCovered: ['Karma', 'Nishkama Karma', 'Phala'],
      },
      {
        id: 'beg-6',
        order: 6,
        title: 'The Three Qualities of Nature: Triguna',
        titleSanskrit: 'त्रिगुण — सत्त्व, रजस्, तमस्',
        description: 'Understand the three operating forces of material reality: clarity (Sattva), agitation (Rajas), and inertia (Tamas).',
        estimatedMinutes: 8,
        primaryFormat: 'quizzes',
        scriptureHref: '/scripture/bhagavadgita/chapter/14',
        conceptsCovered: ['Sattva', 'Rajas', 'Tamas', 'Gunas'],
      },
    ],
    keyConcepts: [
      {
        id: 'concept-dharma',
        term: 'Dharma',
        sanskrit: 'धर्म',
        transliteration: 'Dharma',
        definition: 'That which sustains, upholds, and orders the cosmos; righteous duty in accordance with cosmic truth.',
        philosophicalContext: 'Rooted in the verb root dhṛ (to hold/sustain). In personal life it represents ethical integrity and svadharma.',
        scriptureAnchor: 'Mahabharata, Karna Parva 69.58',
        relatedConceptIds: ['concept-satya', 'concept-rta', 'concept-moksha'],
      },
      {
        id: 'concept-atman',
        term: 'Atman',
        sanskrit: 'आत्मा',
        transliteration: 'Ātman',
        definition: 'The pure, eternal conscious witness within each living being, untouched by birth, decay, or death.',
        philosophicalContext: 'Contrasted with the ego-personality (Ahamkara) and the physical body (Sharira). Non-different from Brahman in Vedanta.',
        scriptureAnchor: 'Bhagavad Gita 2.20; Katha Upanishad 1.2.18',
        relatedConceptIds: ['concept-brahman', 'concept-moksha'],
      },
      {
        id: 'concept-karma',
        term: 'Karma',
        sanskrit: 'कर्म',
        transliteration: 'Karma',
        definition: 'Intentional action and its natural moral causality; every cause ripples through subtle impression (Samskara).',
        philosophicalContext: 'Not fatalistic punishment, but dynamic personal responsibility. Transcended through Nishkama Karma (selfless action).',
        scriptureAnchor: 'Bhagavad Gita 2.47; Brihadaranyaka Upanishad 4.4.5',
        relatedConceptIds: ['concept-dharma', 'concept-samskara'],
      },
      {
        id: 'concept-moksha',
        term: 'Moksha',
        sanskrit: 'मोक्ष',
        transliteration: 'Mokṣa',
        definition: 'Liberation from cyclical existence (Samsara), ignorance (Avidya), and realization of innate infinite bliss.',
        philosophicalContext: 'The supreme summit of the Purusharthas. Can be realized while embodied (Jivanmukti).',
        scriptureAnchor: 'Mundaka Upanishad 3.2.9; Gita 18.66',
        relatedConceptIds: ['concept-atman', 'concept-dharma'],
      },
      {
        id: 'concept-gunas',
        term: 'Triguna',
        sanskrit: 'त्रिगुण',
        transliteration: 'Triguṇa',
        definition: 'The three constitutional threads of nature: Sattva (light/harmony), Rajas (energy/passion), and Tamas (darkness/inertia).',
        philosophicalContext: 'All psychological states and physical phenomena represent varying combinations of these three gunas.',
        scriptureAnchor: 'Bhagavad Gita Chapter 14; Sankhya Karika 12',
        relatedConceptIds: ['concept-prakriti', 'concept-karma'],
      },
    ],
    relatedScriptures: [
      {
        id: 'bhagavadgita',
        title: 'Bhagavad Gita',
        titleSanskrit: 'श्रीमद्भगवद्गीता',
        category: 'Itihasa / Smriti',
        description: 'The sublime dialogue on duty, meditation, devotion, and supreme knowledge spoken on Kurukshetra.',
        totalChapters: 18,
        totalVerses: 700,
        href: '/scripture/bhagavadgita/chapter/1',
        sampleVerse: {
          sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
          translation: 'Whenever righteousness wanes and unrighteousness prevails, I manifest Myself.',
          reference: 'Chapter 4, Verse 7',
        },
      },
      {
        id: 'ishavasya',
        title: 'Isha Upanishad',
        titleSanskrit: 'ईशावास्योपनिषद्',
        category: 'Upanishad / Shruti',
        description: 'The foundational 18-verse gem declaring that the Divine envelops all moving beings in existence.',
        totalChapters: 1,
        totalVerses: 18,
        href: '/scripture/ishavasya/chapter/1',
        sampleVerse: {
          sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
          translation: 'All this is enveloped by the Lord. Enjoy through renunciation; do not covet anyone’s wealth.',
          reference: 'Verse 1',
        },
      },
    ],
    flashcards: [
      {
        front: {
          sanskrit: 'धारणाद्धर्म इत्याहुः',
          transliteration: 'dhāraṇāddharma ityāhuḥ',
          question: 'What is the root meaning and essence of Dharma in Hindu philosophy?',
        },
        back: {
          hindi: 'धर्म शब्द ‘धृ’ धातु से बना है, जिसका अर्थ है धारण करना — जो सम्पूर्ण सृष्टि को संतुलित रखता है।',
          english: 'Dharma stems from the root "dhṛ" (to sustain). It is the cosmic and ethical law that maintains order and harmony in the universe.',
          explanation: 'Rather than dogmatic religion, Dharma is the inherent nature of a thing (like heat to fire) and righteous action.',
          keywords: ['Dharma', 'Dhri', 'Cosmic Order', 'Duty'],
        },
        difficulty: 'easy',
      },
      {
        front: {
          sanskrit: 'श्रुति vs स्मृति',
          transliteration: 'Śruti vs Smṛti',
          question: 'What is the essential distinction between Śruti and Smṛti texts?',
        },
        back: {
          hindi: 'श्रुति प्रत्यक्ष ईश्वरीय अनुभूति (वेद/उपनिषद्) है; स्मृति स्मरणीय परंपरा (रामायण, महाभारत, गीता, स्मृतियाँ) है।',
          english: 'Śruti ("that which was heard") refers to direct, eternal revelation (Vedas & Upanishads). Smṛti ("that which is remembered") is traditional commentary, epics, and ethical codes.',
          explanation: 'When interpretation diverges, Śruti holds primary authority as eternal realization.',
          keywords: ['Shruti', 'Smriti', 'Vedas', 'Epics'],
        },
        difficulty: 'medium',
      },
      {
        front: {
          sanskrit: 'चतुर्विध पुरुषार्थ',
          transliteration: 'Caturvidha Puruṣārtha',
          question: 'What are the four legitimate aims of human life according to Sanatana Dharma?',
        },
        back: {
          hindi: 'धर्म (सदाचार), अर्थ (समृद्धि), काम (आनंद), और मोक्ष (परम मुक्ति)।',
          english: 'Dharma (righteous living), Artha (honest material security), Kama (cultural & aesthetic joy), and Moksha (spiritual liberation).',
          explanation: 'The tradition recognizes the holistic validity of worldly fulfillment when guided by Dharma and aimed towards Moksha.',
          keywords: ['Purushartha', 'Dharma', 'Artha', 'Kama', 'Moksha'],
        },
        difficulty: 'easy',
      },
      {
        front: {
          sanskrit: 'अजो नित्यः शाश्वतोऽयं पुराणः',
          transliteration: 'ajo nityaḥ śāśvato\'yaṁ purāṇaḥ',
          question: 'How does the Bhagavad Gita describe the true nature of the Atman (Self)?',
        },
        back: {
          hindi: 'आत्मा अजन्मा, नित्य, सनातन और पुरातन है; शरीर के नष्ट होने पर भी यह नष्ट नहीं होती।',
          english: 'The Self is unborn, eternal, everlasting, and ancient. It is not slain when the body is slain.',
          explanation: 'Bhagavad Gita 2.20 establishes the foundational metaphysical truth: consciousness is eternal and independent of physical forms.',
          keywords: ['Atman', 'Immortality', 'Gita 2.20'],
        },
        difficulty: 'medium',
      },
    ],
    slides: [
      {
        id: 'beg-s1',
        sanskrit: 'सत्यं वद । धर्मं चर । स्वाध्यायान्मा प्रमदः ।',
        transliteration: 'satyaṁ vada | dharmaṁ cara | svādhyāyānmā pramadaḥ |',
        hindi: 'सत्य बोलो। धर्म का आचरण करो। स्वाध्याय में कभी प्रमाद न करो।',
        english: 'Speak the Truth. Practice Dharma. Never neglect your sacred self-study.',
        explanation: 'The timeless graduation exhortation from the Taittiriya Upanishad reminding seekers of lifelong inner discipline.',
        keywords: ['Satya', 'Dharma', 'Svadhyaya'],
        science: 'Cognitive psychology shows that daily deliberate reflective practice reinforces emotional self-regulation by over 35%.',
      },
      {
        id: 'beg-s2',
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
        transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana',
        hindi: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं।',
        english: 'Your privilege is only to perform your action, never to grasp onto its outcomes.',
        explanation: 'Focus wholly on the craft, integrity, and present-moment execution of duty. Relinquish obsessive outcome anxiety.',
        keywords: ['Karma Yoga', 'Presence', 'Equanimity'],
        science: 'Carol Dweck’s research on growth mindset confirms that outcome-obsessed individuals experience higher performance paralysis.',
      },
    ],
    mindmap: {
      id: 'root-beginner',
      label: 'Sanatana Dharma Foundations',
      labelSanskrit: 'सनातन धर्म के आधारस्तम्भ',
      description: 'The holistic architecture of Hindu philosophical thought',
      color: 'emerald',
      children: [
        {
          id: 'b-purusharthas',
          label: 'Four Aims (Purusharthas)',
          labelSanskrit: 'पुरुषार्थ चतुष्टय',
          description: 'Holistic human goals',
          color: 'saffron',
          children: [
            { id: 'b-p1', label: 'Dharma', description: 'Ethics, duty, sustaining law' },
            { id: 'b-p2', label: 'Artha', description: 'Ethical prosperity & sustenance' },
            { id: 'b-p3', label: 'Kama', description: 'Aesthetic joy & creative love' },
            { id: 'b-p4', label: 'Moksha', description: 'Self-realization & freedom' },
          ],
        },
        {
          id: 'b-texts',
          label: 'Sacred Canon',
          labelSanskrit: 'शास्त्र परम्परा',
          description: 'Shruti & Smriti hierarchy',
          color: 'indigo',
          children: [
            { id: 'b-t1', label: 'Shruti (Vedas & Upanishads)', description: 'Direct primordial revelation' },
            { id: 'b-t2', label: 'Smriti (Epics, Gita, Puranas)', description: 'Remembered practical wisdom' },
          ],
        },
        {
          id: 'b-metaphysics',
          label: 'Core Metaphysics',
          labelSanskrit: 'मूल तत्त्व',
          description: 'The Self, Nature, and Cosmos',
          color: 'rose',
          children: [
            { id: 'b-m1', label: 'Atman', description: 'The eternal conscious witness' },
            { id: 'b-m2', label: 'Karma', description: 'Dynamic moral causality' },
            { id: 'b-m3', label: 'Triguna', description: 'Sattva, Rajas, and Tamas' },
          ],
        },
      ],
    },
    timeline: [
      {
        id: 'beg-t1',
        year: 'c. 5000–1500 BCE',
        title: 'The Vedic Revelation (Shruti)',
        sanskrit: 'ऋग्वेद आदि संहिताएँ',
        description: 'The Rishis compose and preserve the oral hymns to Rta, Agni, and cosmic oneness.',
        category: 'traditional',
      },
      {
        id: 'beg-t2',
        year: 'c. 1000–500 BCE',
        title: 'The Upanishadic Dialogue',
        sanskrit: 'उपनिषद् काल — आत्मविद्या',
        description: 'Forest hermitages echo with profound inquiries into Atman and Brahman.',
        category: 'traditional',
      },
      {
        id: 'beg-t3',
        year: 'c. 3100 BCE (Trad.)',
        title: 'Kurukshetra and the Bhagavad Gita',
        sanskrit: 'महाभारत एवं भगवद्गीता',
        description: 'Lord Krishna synthesizes Vedic wisdom for householders and warriors amidst moral crisis.',
        category: 'narrative',
      },
    ],
    quiz: {
      id: 'quiz-beginner',
      title: 'Beginner Foundation Check',
      titleSanskrit: 'प्रारम्भिक बोध परीक्षण',
      description: 'Check your grasp of core concepts, texts, and Sanskrit principles.',
      category: 'Foundation',
      difficulty: 'beginner',
      questions: [
        {
          id: 'bq1',
          question: 'What is the literal verbal root and meaning of the Sanskrit word "Dharma"?',
          options: [
            'From "dhā" meaning to speak truth',
            'From "dhṛ" meaning to uphold, sustain, and support',
            'From "dhyai" meaning to sit in meditation',
            'From "dā" meaning to give charity',
          ],
          correctIndex: 1,
          explanation: 'Dharma derives from "dhṛ" (to uphold or support). It denotes that which holds cosmic and social reality together.',
        },
        {
          id: 'bq2',
          question: 'Which category of scripture is considered primary revelation (that which was directly heard)?',
          options: ['Smriti', 'Purana', 'Shruti (Vedas & Upanishads)', 'Itihasa'],
          correctIndex: 2,
          explanation: 'Śruti ("that which was heard") denotes the direct visionary realization of the Rishis, possessing primary authority.',
        },
        {
          id: 'bq3',
          question: 'According to Bhagavad Gita 2.47, what should be the primary attitude towards the fruits of action?',
          options: [
            'Avoid working so no fruits are produced',
            'Demand immediate return from the gods',
            'Act with dedicated excellence without attachment to results',
            'Only work when guaranteed success',
          ],
          correctIndex: 2,
          explanation: '"Karmany evadhikaras te ma phaleshu kadachana" teaches selfless focus on the action itself without anxiety over outcomes.',
        },
      ],
    },
    revisionRecommendations: {
      cadence: 'Daily 10-minute contemplation (Sandhya / Morning quiet)',
      recommendedReviewToday: ['The four Purusharthas balance', 'Atman vs Anatman distinction'],
      coreVersesToMemorize: [
        {
          sanskrit: 'ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥',
          transliteration: 'oṁ asato mā sadgamaya | tamaso mā jyotirgamaya | mṛtyormā amṛtaṁ gamaya ||',
          translation: 'Lead me from the unreal to the Real, from darkness to Light, from death to Immortality.',
          reference: 'Brihadaranyaka Upanishad 1.3.28',
          philosophicalKey: 'The primordial prayer for illumination and discernment.',
        },
      ],
      contemplativeReflection: {
        title: 'Observing the Witness Within',
        sanskritFocus: 'साक्षी चेता केवलो निर्गुणश्च',
        prompt: 'In moments of stress or anger today, pause for three breaths. Ask: "Who is observing this agitation? Am I the passing storm, or the silent sky that holds it?"',
        practicalApplication: 'Shift identity from the reactive ego to the serene witness (Sakshi).',
      },
      activeRecallChecklist: [
        'Can I name the four Purusharthas and their proper balance in my own life?',
        'Can I explain why Karma is not mere fatalism to a curious friend?',
        'What is the difference between Shruti and Smriti?',
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
     2. BHAGAVAD GITA
     ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'bhagavad-gita',
    slug: 'bhagavad-gita',
    title: 'Bhagavad Gita: The Yoga of Action & Wisdom',
    titleSanskrit: 'श्रीमद्भगवद्गीता स्वाध्याय',
    subtitle: 'The 18-chapter song of divine wisdom on the battlefield of life',
    learningObjective:
      'Master the transformative dialogue between Sri Krishna and Arjuna across the three great hexads (Shatkas): Karma Yoga (Ch 1-6), Bhakti Yoga (Ch 7-12), and Jnana Yoga (Ch 13-18), integrating ancient discernment into daily dilemmas.',
    difficulty: 'intermediate',
    difficultySanskrit: 'मध्यम (Intermediate)',
    estimatedMinutes: 75,
    estimatedTime: '1 hr 15 mins',
    includedFormats: ['flashcards', 'slides', 'mindmap', 'timeline', 'quizzes'],
    icon: '🔥',
    gradient: 'from-saffron-700 via-amber-800 to-red-950',
    accentColor: '#cf440a',
    overview: {
      mangalCharan: {
        sanskrit: 'ॐ पार्थाय प्रतिबोधितां भगवता नारायणेन स्वयं व्यासेन ग्रथितां पुराणमुनिना मध्येमहाभारतम् । अद्वैतामृतवर्षिणीं भगवतीमष्टादशाध्यायिनीमम्ब त्वामनुसन्दधामि भगवद्गीते भवद्वेषिणीम् ॥',
        transliteration: 'oṁ pārthāya pratibodhitāṁ bhagavatā nārāyaṇena svayaṁ vyāsena grathitāṁ purāṇamuninā madhyemahābhāratam | advaitāmṛtavarṣiṇīṁ bhagavatīmaṣṭādaśādhyāyinīmamba tvāmanusandadhāmi bhagavadgīte bhavadveṣiṇīm ||',
        meaning: 'Om, O Bhagavad Gita, with which Partha was enlightened by the Lord Himself, which Vyasa recorded in the midst of Mahabharata, mother of eighteen chapters showering the nectar of Advaita, upon thee I meditate.',
        source: 'Gita Dhyanam, Verse 1',
      },
      philosophicalPremise:
        'The Bhagavad Gita is not an invitation to violence, but an allegorical and practical manual on overcoming moral paralysis (Visada). Spoken at the knife-edge between two armies, it demonstrates how transcendental wisdom directly empowers decisive, compassionate duty in the world.',
      scholarlyContext:
        'Occurring in the Bhishma Parva of the Mahabharata. Classical commentators like Adi Shankara, Ramanuja, and Madhvacharya divided the 18 chapters into three hexads (Shatkas) corresponding to the Mahavakya "Tat Tvam Asi".',
      prerequisites: 'Basic familiarity with the Mahabharata narrative and Dharma.',
      studyMethodology:
        'Thematic progression through the four Yogas: Karma (Duty), Raja/Dhyana (Meditation), Bhakti (Devotion), and Jnana (Knowledge).',
      learningOutcomes: [
        'Analyze Arjuna’s psychological crisis (Visāda Yoga) and its universal human relevance',
        'Define Sthitaprajña (the person of steady wisdom) and develop equanimity',
        'Synthesize Nishkama Karma with devotion and philosophical inquiry',
        'Understand the Cosmic Form (Viśvarūpa Darśana) in Chapter 11',
        'Apply Chapter 18’s final instruction on absolute self-surrender (Śaraṇāgati)',
      ],
    },
    lessons: [
      {
        id: 'gita-1',
        order: 1,
        title: 'Arjuna’s Moral Crisis: The Universal Dilemma',
        titleSanskrit: 'अर्जुनविषादयोग — कर्त्तव्य का संशय',
        description: 'Examine Arjuna’s collapse on Kurukshetra: when duty conflicts with sentiment and attachment.',
        estimatedMinutes: 8,
        primaryFormat: 'reading',
        scriptureHref: '/scripture/bhagavadgita/chapter/1',
        keyVerse: {
          sanskrit: 'कार्पण्यदोषोपहतस्वभावः पृच्छामि त्वां धर्मसंमूढचेताः ।',
          transliteration: 'kārpaṇyadoṣopahatasvabhāvaḥ pṛcchāmi tvāṁ dharmasaṁmūḍhacetāḥ |',
          translation: 'My heart is overwhelmed by sorrow; my mind is bewildered about duty. Tell me clearly what is best for me.',
          reference: 'Bhagavad Gita 2.7',
        },
        conceptsCovered: ['Visada', 'Sharanagati', 'Moral Conflict'],
      },
      {
        id: 'gita-2',
        order: 2,
        title: 'Sankhya Yoga & The Eternal Soul',
        titleSanskrit: 'सांख्ययोग — आत्मा की अमरता',
        description: 'Krishna’s opening declaration of the immortal Atman and the introduction of selfless duty.',
        estimatedMinutes: 10,
        primaryFormat: 'flashcards',
        scriptureHref: '/scripture/bhagavadgita/chapter/2',
        keyVerse: {
          sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः ।',
          transliteration: 'nainaṁ chindanti śastrāṇi nainaṁ dahati pāvakaḥ |',
          translation: 'Weapons cleave it not, fire burns it not, waters wet it not, wind dries it not.',
          reference: 'Bhagavad Gita 2.23',
        },
        conceptsCovered: ['Atman', 'Sthitaprajna', 'Equanimity'],
      },
      {
        id: 'gita-3',
        order: 3,
        title: 'Karma Yoga: Transforming Action into Worship',
        titleSanskrit: 'कर्मयोग — निष्काम कर्म की साधना',
        description: 'Why total renunciation of work is impossible, and how dedicating every action dissolves selfish ego.',
        estimatedMinutes: 10,
        primaryFormat: 'slides',
        scriptureHref: '/scripture/bhagavadgita/chapter/3',
        keyVerse: {
          sanskrit: 'यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः ।',
          transliteration: 'yajñārthātkarmaṇo\'nyatra loko\'yaṁ karmabandhanaḥ |',
          translation: 'The world is bound by action unless performed as a selfless sacrifice (Yajna).',
          reference: 'Bhagavad Gita 3.9',
        },
        conceptsCovered: ['Yajna', 'Nishkama Karma', 'Lokasamgraha'],
      },
      {
        id: 'gita-4',
        order: 4,
        title: 'Dhyana Yoga: Stillness of Mind',
        titleSanskrit: 'ध्यानयोग — मन का संयम',
        description: 'The science of meditation, physical posture, pranayama, and bringing the restless mind under control.',
        estimatedMinutes: 10,
        primaryFormat: 'mindmap',
        scriptureHref: '/scripture/bhagavadgita/chapter/6',
        keyVerse: {
          sanskrit: 'चञ्चलं हि मनः कृष्ण प्रमाथि बलवद्दृढम् ।',
          transliteration: 'cañcalaṁ hi manaḥ kṛṣṇa pramāthi balavaddṛḍham |',
          translation: 'The mind is restless, turbulent, obstinate, and exceedingly strong, O Krishna.',
          reference: 'Bhagavad Gita 6.34',
        },
        conceptsCovered: ['Abhyasa', 'Vairagya', 'Samadhi'],
      },
      {
        id: 'gita-5',
        order: 5,
        title: 'Bhakti Yoga: Love, Devotion & Surrender',
        titleSanskrit: 'भक्तियोग — प्रेम और समर्पण',
        description: 'Krishna reveals the 35 supreme qualities of the beloved devotee in Chapter 12.',
        estimatedMinutes: 9,
        primaryFormat: 'reading',
        scriptureHref: '/scripture/bhagavadgita/chapter/12',
        keyVerse: {
          sanskrit: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।',
          transliteration: 'adveṣṭā sarvabhūtānāṁ maitraḥ karuṇa eva ca |',
          translation: 'He who hates no living creature, who is friendly and compassionate to all, is dear to Me.',
          reference: 'Bhagavad Gita 12.13',
        },
        conceptsCovered: ['Bhakti', 'Samatvam', 'Karuna'],
      },
      {
        id: 'gita-6',
        order: 6,
        title: 'The Cosmic Vision: Vishwarupa Darshana',
        titleSanskrit: 'विश्वरूप दर्शन — विराट् चेतना',
        description: 'The terrifying and awe-inspiring manifestation of infinite cosmic time, divinity, and destiny.',
        estimatedMinutes: 10,
        primaryFormat: 'timeline',
        scriptureHref: '/scripture/bhagavadgita/chapter/11',
        keyVerse: {
          sanskrit: 'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो लोकान्समाहर्तुमिह प्रवृत्तः ।',
          transliteration: 'kālo\'smi lokakṣayakṛtpravṛddho lokānsamāhartumiha pravṛttaḥ |',
          translation: 'I am all-powerful Time, the destroyer of worlds, here come forth to assimilate the worlds.',
          reference: 'Bhagavad Gita 11.32',
        },
        conceptsCovered: ['Kala', 'Vishwarupa', 'Divine Will'],
      },
      {
        id: 'gita-7',
        order: 7,
        title: 'Moksha Sannyasa: The Supreme Secret of Surrender',
        titleSanskrit: 'मोक्षसंन्यासयोग — चरम उपदेश',
        description: 'The culmination in Chapter 18: laying down all burdens at the feet of the Supreme Divine.',
        estimatedMinutes: 10,
        primaryFormat: 'quizzes',
        scriptureHref: '/scripture/bhagavadgita/chapter/18',
        keyVerse: {
          sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
          transliteration: 'sarvadharmānparityajya māmekaṁ śaraṇaṁ vraja | ahaṁ tvāṁ sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
          translation: 'Abandoning all notions of duty, take refuge in Me alone. I will liberate you from all sins; grieve not.',
          reference: 'Bhagavad Gita 18.66',
        },
        conceptsCovered: ['Sharanagati', 'Charama Shloka', 'Moksha'],
      },
    ],
    keyConcepts: [
      {
        id: 'concept-sthitaprajna',
        term: 'Sthitaprajna',
        sanskrit: 'स्थितप्रज्ञ',
        transliteration: 'Sthitaprajña',
        definition: 'One whose wisdom is firmly established in the Self; unmoved by delight or sorrow.',
        philosophicalContext: 'Described in Gita 2.54-72 as the ideal psychological exemplar of poise, free from craving and aversion.',
        scriptureAnchor: 'Bhagavad Gita 2.55',
        relatedConceptIds: ['concept-atman', 'concept-samatvam'],
      },
      {
        id: 'concept-nishkama-karma',
        term: 'Nishkama Karma',
        sanskrit: 'निष्काम कर्म',
        transliteration: 'Niṣkāma Karma',
        definition: 'Action undertaken selflessly as an offering, without thirst or anxiety for the resultant fruits.',
        philosophicalContext: 'The core prescription for transforming everyday work into a spiritual vehicle of purification (Citta Shuddhi).',
        scriptureAnchor: 'Bhagavad Gita 2.47; 3.19',
        relatedConceptIds: ['concept-yajna', 'concept-karma'],
      },
      {
        id: 'concept-sharanagati',
        term: 'Sharanagati',
        sanskrit: 'शरणागति',
        transliteration: 'Śaraṇāgati',
        definition: 'Total, unwavering self-surrender to the divine will with pure trust and dissolution of egoic pride.',
        philosophicalContext: 'The pinnacle of Bhakti Yoga; highlighted in the Gita’s Charama Shloka (18.66).',
        scriptureAnchor: 'Bhagavad Gita 18.66',
        relatedConceptIds: ['concept-bhakti', 'concept-moksha'],
      },
      {
        id: 'concept-lokasamgraha',
        term: 'Lokasamgraha',
        sanskrit: 'लोकसंग्रह',
        transliteration: 'Lokasaṁgraha',
        definition: 'Action performed for the welfare, coherence, and guidance of society and the world.',
        philosophicalContext: 'Krishna explains that even an enlightened sage must continue working to set a noble example for the collective.',
        scriptureAnchor: 'Bhagavad Gita 3.20',
        relatedConceptIds: ['concept-dharma', 'concept-nishkama-karma'],
      },
    ],
    relatedScriptures: [
      {
        id: 'bhagavadgita',
        title: 'Bhagavad Gita',
        titleSanskrit: 'श्रीमद्भगवद्गीता',
        category: 'Itihasa / Smriti',
        description: 'Complete 18 chapters with word-by-word Sanskrit, transliteration, and commentary.',
        totalChapters: 18,
        totalVerses: 700,
        href: '/scripture/bhagavadgita/chapter/1',
        sampleVerse: {
          sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय । सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
          translation: 'Perform your duty poised in yoga, abandoning attachment, remaining even-minded in success and failure. Equanimity is yoga.',
          reference: 'Chapter 2, Verse 48',
        },
      },
      {
        id: 'mahabharata',
        title: 'Mahabharata (Bhishma Parva)',
        titleSanskrit: 'महाभारतम् (भीष्मपर्व)',
        category: 'Itihasa',
        description: 'The monumental epic framework within which the Gita is spoken on the first day of war.',
        totalChapters: 18,
        totalVerses: 100000,
        href: '/scripture/mahabharata/chapter/1',
        sampleVerse: {
          sanskrit: 'यतो धर्मस्ततो जयः',
          translation: 'Where there is Dharma, there is Victory.',
          reference: 'Mahabharata',
        },
      },
    ],
    flashcards: [
      {
        front: {
          sanskrit: 'योगः कर्मसु कौशलम्',
          transliteration: 'yogaḥ karmasu kauśalam',
          question: 'What is Krishna’s definition of Yoga in Bhagavad Gita 2.50?',
        },
        back: {
          hindi: 'योग कर्मों में कुशलता और दक्षता है — निष्काम भाव से कर्म करना ही योग है।',
          english: 'Yoga is skillfulness and excellence in action.',
          explanation: 'True yoga is performing every duty with mastery, complete absorption, and freedom from egoic attachment.',
          keywords: ['Yoga', 'Kaushalam', 'Excellence', 'Gita 2.50'],
        },
        difficulty: 'easy',
      },
      {
        front: {
          sanskrit: 'समत्वं योग उच्यते',
          transliteration: 'samatvaṁ yoga ucyate',
          question: 'What is Samatvam according to Chapter 2, Verse 48?',
        },
        back: {
          hindi: 'सफलता और असफलता दोनों में मन की समता बनाए रखना ही योग कहलाता है।',
          english: 'Equanimity of mind in both success and failure is called Yoga.',
          explanation: 'Maintaining mental balance without sinking into depression during defeat or inflating into arrogance during triumph.',
          keywords: ['Samatvam', 'Equanimity', 'Mental Balance'],
        },
        difficulty: 'medium',
      },
      {
        front: {
          sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज',
          transliteration: 'sarvadharmānparityajya māmekaṁ śaraṇaṁ vraja',
          question: 'What is the significance of the "Charama Shloka" (18.66)?',
        },
        back: {
          hindi: 'यह गीता का अंतिम और सर्वोच्च उपदेश है — सभी अवलंब छोड़कर एकमात्र परमात्मा की शरण में जाना।',
          english: 'It is the crest-jewel verse of ultimate surrender: abandoning relative obligations to take absolute refuge in the Supreme Divine.',
          explanation: 'Krishna assures the seeker complete absolution from fear and bondage once full surrender is offered.',
          keywords: ['Charama Shloka', 'Sharanagati', 'Gita 18.66'],
        },
        difficulty: 'hard',
      },
    ],
    slides: [
      {
        id: 'gita-s1',
        sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् । आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥',
        transliteration: 'uddharedātmanātmānaṁ nātmānamavasādayet | ātmaiva hyātmano bandhurātmaiva ripurātmanaḥ ||',
        hindi: 'मनुष्य अपने द्वारा अपना उद्धार करे, अपने को नीचे न गिराए। क्योंकि अपना मन ही अपना मित्र है और मन ही अपना शत्रु है।',
        english: 'Elevate yourself through your own mind; do not degrade yourself. For the mind alone is your true friend, and the mind alone is your greatest enemy.',
        explanation: 'Bhagavad Gita 6.5 reminds us that self-mastery is the ultimate internal work. A disciplined mind liberates; an unruly mind imprisons.',
        keywords: ['Mind Master', 'Self-Reliance', 'Gita 6.5'],
        science: 'Neuroplasticity studies show that regular mental self-regulation directly alters prefrontal cortex pathways governing impulse control.',
      },
    ],
    mindmap: {
      id: 'root-gita',
      label: 'Bhagavad Gita Architecture',
      labelSanskrit: 'गीता के तीन षट्क',
      description: 'The 18 chapters structured around Tat Tvam Asi',
      color: 'saffron',
      children: [
        {
          id: 'g-shatka1',
          label: 'Prathama Shatka (Ch 1–6): Tvam',
          labelSanskrit: 'प्रथम षट्क — कर्मयोग',
          description: 'The Nature of the Individual (Jiva) and selfless duty',
          color: 'emerald',
          children: [
            { id: 'gs1-1', label: 'Arjuna Visada (Ch 1)', description: 'Moral dilemma' },
            { id: 'gs1-2', label: 'Sankhya Yoga (Ch 2)', description: 'Atman & Sthitaprajna' },
            { id: 'gs1-3', label: 'Karma Yoga (Ch 3)', description: 'Sacrifice & action' },
            { id: 'gs1-6', label: 'Dhyana Yoga (Ch 6)', description: 'Mind stillness' },
          ],
        },
        {
          id: 'g-shatka2',
          label: 'Madhyama Shatka (Ch 7–12): Tat',
          labelSanskrit: 'मध्यम षट्क — भक्तियोग',
          description: 'The Nature of the Supreme Reality (Ishvara)',
          color: 'indigo',
          children: [
            { id: 'gs2-9', label: 'Raja Vidya (Ch 9)', description: 'Sovereign secret' },
            { id: 'gs2-11', label: 'Vishwarupa (Ch 11)', description: 'Cosmic revelation' },
            { id: 'gs2-12', label: 'Bhakti Yoga (Ch 12)', description: 'Devotional love' },
          ],
        },
        {
          id: 'g-shatka3',
          label: 'Charama Shatka (Ch 13–18): Asi',
          labelSanskrit: 'चरम षट्क — ज्ञानयोग',
          description: 'The Identity of Jiva and Brahman & final liberation',
          color: 'rose',
          children: [
            { id: 'gs3-13', label: 'Kshetra & Kshetrajna (Ch 13)', description: 'Field and Knower' },
            { id: 'gs3-14', label: 'Gunatraya Vibhaga (Ch 14)', description: 'Three gunas' },
            { id: 'gs3-18', label: 'Moksha Sannyasa (Ch 18)', description: 'Surrender & freedom' },
          ],
        },
      ],
    },
    timeline: [
      {
        id: 'gita-t1',
        year: 'Day 1 of War',
        title: 'The Great Hesitation',
        sanskrit: 'रथोपस्थ उपाविशत्',
        description: 'Arjuna throws down his Gandiva bow between the two armies, weeping in existential anguish.',
        category: 'narrative',
      },
      {
        id: 'gita-t2',
        year: 'Mid-Morning',
        title: 'The Immortal Exposition',
        sanskrit: 'सांख्य एवं कर्म उपदेश',
        description: 'Sri Krishna smiles gently and expounds the immortality of Atman and the secret of action without attachment.',
        category: 'narrative',
      },
      {
        id: 'gita-t3',
        year: 'Noon',
        title: 'The Cosmic Epiphany',
        sanskrit: 'विश्वरूप दर्शन',
        description: 'Arjuna is granted the divine eye (Divya Chakshu) to witness the universe within Krishna’s form.',
        category: 'narrative',
      },
      {
        id: 'gita-t4',
        year: 'Pre-Battle Climax',
        title: 'The Resolution: "I Shall Act"',
        sanskrit: 'करिष्ये वचनं तव',
        description: 'Arjuna declares: "My delusion is destroyed; my memory is regained; I stand firm, ready to do Thy will."',
        category: 'narrative',
      },
    ],
    quiz: {
      id: 'quiz-gita',
      title: 'Bhagavad Gita Wisdom Check',
      titleSanskrit: 'भगवद्गीता ज्ञान परीक्षा',
      description: 'Evaluate your understanding of the core teachings of the Gita.',
      category: 'Bhagavad Gita',
      difficulty: 'intermediate',
      questions: [
        {
          id: 'gq1',
          question: 'What is the Sanskrit term for a person of steadfast, unshakable wisdom described in Chapter 2?',
          options: ['Sadhaka', 'Sthitaprajna', 'Brahmachari', 'Karmachari'],
          correctIndex: 1,
          explanation: 'Sthitaprajna (Gita 2.54-72) describes one whose intellect is unswerving and grounded in the Self.',
        },
        {
          id: 'gq2',
          question: 'In Chapter 11, what does Krishna grant Arjuna so he can perceive the Vishwarupa (Cosmic Form)?',
          options: ['Sudharshana Chakra', 'Divya Chakshu (Divine Eye)', 'Panchajanya conch', 'Gandiva bow'],
          correctIndex: 1,
          explanation: 'Krishna says: "You cannot see Me with your physical eyes; I grant you the divine eye (Divya Chakshu)."',
        },
        {
          id: 'gq3',
          question: 'What does "Lokasamgraha" (Gita 3.20) signify?',
          options: [
            'Collecting taxes for the royal treasury',
            'Action undertaken for the welfare and cohesion of the world',
            'Withdrawing into secluded forest caves',
            'Performing rituals solely for family progeny',
          ],
          correctIndex: 1,
          explanation: 'Lokasamgraha is the selfless protection, guidance, and upliftment of society by realized beings.',
        },
      ],
    },
    revisionRecommendations: {
      cadence: 'Daily 1-chapter reflection or 3-verse meditation',
      recommendedReviewToday: ['Chapter 2: Sthitaprajna lakshanas', 'Chapter 12: Bhakta lakshanas'],
      coreVersesToMemorize: [
        {
          sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
          transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana | mā karmaphalaheturbhūrmā te saṅgo\'stvakarmaṇi ||',
          translation: 'Your right is only to work, never to the fruits. Do not be motivated by the fruits, nor let attachment to inaction bind you.',
          reference: 'Bhagavad Gita 2.47',
          philosophicalKey: 'The definitive formula for mental freedom during complex responsibilities.',
        },
        {
          sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
          transliteration: 'sarvadharmānparityajya māmekaṁ śaraṇaṁ vraja | ahaṁ tvāṁ sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
          translation: 'Surrendering all duties, take refuge in Me alone. I will deliver you from all sorrow; do not grieve.',
          reference: 'Bhagavad Gita 18.66',
          philosophicalKey: 'The supreme promise of divine grace upon total surrender.',
        },
      ],
      contemplativeReflection: {
        title: 'The Mirror of Sthitaprajna',
        sanskritFocus: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः',
        prompt: 'Reflect upon today’s events. Did an insult sting? Did praise inflate your pride? Notice where the ego hooked into transient results, and gently rest back in the unmoving witness.',
        practicalApplication: 'Respond rather than react; preserve inner calm under external turbulence.',
      },
      activeRecallChecklist: [
        'How does Krishna reconcile action (Karma) with knowledge (Jnana)?',
        'What are the 3 qualities of nature (Sattva, Rajas, Tamas) and how do they bind?',
        'What was Arjuna’s final declaration before stringing his bow?',
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
     3. PRINCIPAL UPANISHADS
     ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'upanishads',
    slug: 'upanishads',
    title: 'The Principal Upanishads: Vedantic Inquiries',
    titleSanskrit: 'मुख्य उपनिषद् दर्शन',
    subtitle: 'The summit of direct spiritual realization and the Mahavakyas',
    learningObjective:
      'Immerse in the ten classical Mukhya Upanishads commented upon by Adi Shankara—exploring the supreme identity of Atman and Brahman, the four states of consciousness in the Mandukya, Nachiketa’s dialogue with Death in the Katha, and the timeless Mahavakyas.',
    difficulty: 'advanced',
    difficultySanskrit: 'उन्नत (Advanced)',
    estimatedMinutes: 90,
    estimatedTime: '1 hr 30 mins',
    includedFormats: ['flashcards', 'slides', 'mindmap', 'timeline', 'quizzes'],
    icon: '📖',
    gradient: 'from-indigo-800 via-purple-900 to-slate-950',
    accentColor: '#6366f1',
    overview: {
      mangalCharan: {
        sanskrit: 'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥ ॐ शान्तिः शान्तिः शान्तिः ॥',
        transliteration: 'oṁ pūrṇamadaḥ pūrṇamidaṁ pūrṇātpūrṇamudacyate | pūrṇasya pūrṇamādāya pūrṇamevāvaśiṣyate || oṁ śāntiḥ śāntiḥ śāntiḥ ||',
        meaning: 'Om, That is Whole; This is Whole; from the Whole emerges the Whole; taking the Whole from the Whole, the Whole alone remains. Om Peace, Peace, Peace.',
        source: 'Isha & Brihadaranyaka Upanishad Shanti Mantra',
      },
      philosophicalPremise:
        'The Upanishads (meaning "sitting near the teacher with reverent attention") represent Jnana Kanda—the philosophical crown of the Vedas. Here ritual yields to contemplative inquiry into the ultimate nature of Reality (Brahman), the Self (Atman), and the dissolution of existential duality.',
      scholarlyContext:
        'Of the 108 canonical Upanishads listed in the Muktika canon, 10 are revered as the primary (Mukhya) Upanishads: Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, and Brihadaranyaka.',
      prerequisites: 'Foundational grounding in Vedanta and Sanskrit terminology.',
      studyMethodology:
        'Meditative analysis of core dialogues (Nachiketa & Yama, Shvetaketu & Uddalaka, Yajnavalkya & Maitreyi) and reflection on the four Mahavakyas.',
      learningOutcomes: [
        'Comprehend the non-dual identity encapsulated in "Tat Tvam Asi" and "Aham Brahmasmi"',
        'Analyze the four states of consciousness (Avasthātraya) in Mandukya Upanishad',
        'Trace Nachiketa’s three boons and the choice between Shreyas and Preyas',
        'Examine Yajnavalkya’s "Neti, Neti" dialectic in the Brihadaranyaka',
        'Cultivate the fourfold qualifications of a spiritual aspirant (Sādhana Catuṣṭaya)',
      ],
    },
    lessons: [
      {
        id: 'up-1',
        order: 1,
        title: 'Isha Upanishad: The Divine Presence in All',
        titleSanskrit: 'ईशावास्योपनिषद् — सर्वं खल्विदं ब्रह्म',
        description: 'The sublime opening: living in the world with detachment because everything is enveloped by the Divine.',
        estimatedMinutes: 10,
        primaryFormat: 'reading',
        scriptureHref: '/scripture/ishavasya/chapter/1',
        keyVerse: {
          sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
          transliteration: 'īśā vāsyamidaṁ sarvaṁ yatkiñca jagatyāṁ jagat | tena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||',
          translation: 'All this is enveloped by the Lord. Enjoy by renouncing; do not covet anyone’s wealth.',
          reference: 'Isha Upanishad, Verse 1',
        },
        conceptsCovered: ['Isha', 'Tyaga', 'Non-covetousness'],
      },
      {
        id: 'up-2',
        order: 2,
        title: 'Katha Upanishad: Nachiketa and the Mystery of Death',
        titleSanskrit: 'कठोपनिषद् — नचिकेता और यम संवाद',
        description: 'Young Nachiketa rejects worldly pleasures and demands the highest knowledge of what lies beyond mortality.',
        estimatedMinutes: 12,
        primaryFormat: 'flashcards',
        scriptureHref: '/scripture/katha/chapter/1',
        keyVerse: {
          sanskrit: 'श्रेयश्च प्रेयश्च मनुष्यमेतस्तौ संपरीत्य विविनक्ति धीरः ।',
          transliteration: 'śreyaśca preyaśca manuṣyametastau saṁparītya vivinakti dhīraḥ |',
          translation: 'The Good (Shreyas) and the Pleasant (Preyas) approach man. The wise examine both and choose the Good.',
          reference: 'Katha Upanishad 1.2.2',
        },
        conceptsCovered: ['Shreyas vs Preyas', 'Chariot Metaphor', 'Atman'],
      },
      {
        id: 'up-3',
        order: 3,
        title: 'Kena Upanishad: The Eye of the Eye',
        titleSanskrit: 'केनोपनिषद् — केनेषितं पतति प्रेषितं मनः',
        description: '"By whom directed does the mind think?" Inquiry into the conscious light behind all sense faculties.',
        estimatedMinutes: 10,
        primaryFormat: 'slides',
        scriptureHref: '/scripture/kena/chapter/1',
        keyVerse: {
          sanskrit: 'श्रोत्रस्य श्रोत्रं मनसो मनो यद्वाचो ह वाचं स उ प्राणस्य प्राणः ।',
          transliteration: 'śrotrasya śrotraṁ manaso mano yadvāco ha vācaṁ sa u prāṇasya prāṇaḥ |',
          translation: 'It is the Ear of the ear, the Mind of the mind, the Speech of speech, the Life of life.',
          reference: 'Kena Upanishad 1.2',
        },
        conceptsCovered: ['Consciousness', 'Subtle Knower', 'Uma Haimavati'],
      },
      {
        id: 'up-4',
        order: 4,
        title: 'Mandukya Upanishad: The Four States of Consciousness & OM',
        titleSanskrit: 'माण्डूक्योपनिषद् — ॐकार एवं तुरीय',
        description: 'The shortest Upanishad analyzing Waking (Jagrat), Dream (Svapna), Deep Sleep (Sushupti), and Turiya.',
        estimatedMinutes: 14,
        primaryFormat: 'mindmap',
        scriptureHref: '/scripture/mandukya/chapter/1',
        keyVerse: {
          sanskrit: 'सर्वं ह्येतद्ब्रह्मायमात्मा ब्रह्म सोऽयमात्मा चतुष्पात् ।',
          transliteration: 'sarvaṁ hyetadbrahmāyamātmā brahma so\'yamātmā catuṣpāt |',
          translation: 'All this is indeed Brahman. This Self is Brahman. This Self has four quarters.',
          reference: 'Mandukya Upanishad, Verse 2',
        },
        conceptsCovered: ['Turiya', 'AUM', 'Avasthatraya'],
      },
      {
        id: 'up-5',
        order: 5,
        title: 'Chandogya Upanishad: "Tat Tvam Asi" (That Thou Art)',
        titleSanskrit: 'छान्दोग्योपनिषद् — तत्त्वमसि',
        description: 'Uddalaka teaches his son Shvetaketu through 9 metaphors: clay, rivers, and salt in water.',
        estimatedMinutes: 14,
        primaryFormat: 'timeline',
        scriptureHref: '/scripture/chandogya/chapter/6',
        keyVerse: {
          sanskrit: 'ऐतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो ।',
          transliteration: 'aitadātmyamidaṁ sarvaṁ tatsatyaṁ sa ātmā tattvamasi śvetaketo |',
          translation: 'All this has that Subtlest as its essence. That is the Truth. That is the Self. That Thou Art, O Shvetaketu.',
          reference: 'Chandogya Upanishad 6.8.7',
        },
        conceptsCovered: ['Tat Tvam Asi', 'Brahman', 'Mahavakya'],
      },
      {
        id: 'up-6',
        order: 6,
        title: 'Brihadaranyaka Upanishad: Neti, Neti & Infinite Consciousness',
        titleSanskrit: 'बृहदारण्यकोपनिषद् — नेति नेति',
        description: 'Sage Yajnavalkya’s dialogues with Gargi and Maitreyi on the transcendent, imperishable witness.',
        estimatedMinutes: 15,
        primaryFormat: 'quizzes',
        scriptureHref: '/scripture/brihadaranyaka/chapter/21',
        keyVerse: {
          sanskrit: 'स एष नेति नेत्यात्माऽगृह्यो न हि गृह्यते ।',
          transliteration: 'sa eṣa neti netyātmā\'gṛhyo na hi gṛhyate |',
          translation: 'That Self is described as "Not this, Not this". It is incomprehensible, for It cannot be grasped.',
          reference: 'Brihadaranyaka Upanishad 3.9.26',
        },
        conceptsCovered: ['Neti Neti', 'Yajnavalkya', 'Aham Brahmasmi'],
      },
    ],
    keyConcepts: [
      {
        id: 'concept-brahman',
        term: 'Brahman',
        sanskrit: 'ब्रह्म',
        transliteration: 'Brahman',
        definition: 'The infinite, omnipresent, non-dual substratum of all existence; pure Being-Consciousness-Bliss (Sat-Chit-Ananda).',
        philosophicalContext: 'Not a personified deity, but the ground of all being. Known through direct meditative intuition (Aparokshanubhuti).',
        scriptureAnchor: 'Taittiriya Upanishad 2.1.1; Mandukya Upanishad 2',
        relatedConceptIds: ['concept-atman', 'concept-turiya', 'concept-maya'],
      },
      {
        id: 'concept-turiya',
        term: 'Turiya',
        sanskrit: 'तुरीय',
        transliteration: 'Turīya',
        definition: 'The fourth state of consciousness: the silent, non-dual witness underlying waking, dreaming, and deep dreamless sleep.',
        philosophicalContext: 'Described in Mandukya Verse 7 as tranquil, auspicious, non-dual (Shantam Shivam Advaitam).',
        scriptureAnchor: 'Mandukya Upanishad, Verse 7',
        relatedConceptIds: ['concept-brahman', 'concept-atman'],
      },
      {
        id: 'concept-tat-tvam-asi',
        term: 'Tat Tvam Asi',
        sanskrit: 'तत्त्वमसि',
        transliteration: 'Tat Tvam Asi',
        definition: 'The Samaveda Mahavakya: "That (infinite Brahman) Thou (innermost Atman) Art."',
        philosophicalContext: 'Reveals the fundamental identity between the individual consciousness and cosmic consciousness upon removing limiting adjuncts (Upadhis).',
        scriptureAnchor: 'Chandogya Upanishad 6.8.7',
        relatedConceptIds: ['concept-atman', 'concept-brahman'],
      },
      {
        id: 'concept-shreyas-preyas',
        term: 'Shreyas & Preyas',
        sanskrit: 'श्रेयस् एवं प्रेयस्',
        transliteration: 'Śreyas & Preyas',
        definition: 'The eternal choice between the spiritually wholesome/good (Shreyas) and the immediately pleasant/gratifying (Preyas).',
        philosophicalContext: 'Yama tests Nachiketa with all sensual wealth; Nachiketa chooses Shreyas, opening the door to immortality.',
        scriptureAnchor: 'Katha Upanishad 1.2.1-2',
        relatedConceptIds: ['concept-viveka', 'concept-vairagya'],
      },
    ],
    relatedScriptures: [
      {
        id: 'ishavasya',
        title: 'Isha Upanishad',
        titleSanskrit: 'ईशावास्योपनिषद्',
        category: 'Upanishad',
        description: 'Complete text with Shukla Yajurveda Samhita background.',
        totalChapters: 1,
        totalVerses: 18,
        href: '/scripture/ishavasya/chapter/1',
        sampleVerse: {
          sanskrit: 'यस्तु सर्वाणि भूतान्यात्मन्येवानुपश्यति । सर्वभूतेषु चात्मानं ततो न विजुगुप्सते ॥',
          translation: 'He who sees all beings in the Self and the Self in all beings never feels hatred or repulsion.',
          reference: 'Verse 6',
        },
      },
      {
        id: 'katha',
        title: 'Katha Upanishad',
        titleSanskrit: 'कठोपनिषद्',
        category: 'Upanishad',
        description: 'Nachiketa’s immortal dialogue with Lord Yama across two chapters.',
        totalChapters: 2,
        totalVerses: 119,
        href: '/scripture/katha/chapter/1',
        sampleVerse: {
          sanskrit: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत । क्षुरस्य धारा निशिता दुरत्यया दुर्गं पथस्तत्कवयो वदन्ति ॥',
          translation: 'Arise, awake! Seek the wise and understand. Sharp like a razor’s edge, difficult to cross, is this path, say the seers.',
          reference: '1.3.14',
        },
      },
    ],
    flashcards: [
      {
        front: {
          sanskrit: 'तत्त्वमसि श्वेतकेतो',
          transliteration: 'tattvamasi śvetaketo',
          question: 'What is the literal meaning and significance of "Tat Tvam Asi"?',
        },
        back: {
          hindi: '“तुम वही (परम ब्रह्म) हो।” यह सामवेद का महावाक्य है जो जीव और ब्रह्म की अद्वैत एकता को दर्शाता है।',
          english: '"That Thou Art." This Mahavakya from the Chandogya Upanishad reveals the absolute oneness of the individual Self (Atman) with Supreme Reality (Brahman).',
          explanation: 'Taught by sage Uddalaka to his son Shvetaketu through 9 metaphors including salt dissolving invisibly into water.',
          keywords: ['Tat Tvam Asi', 'Chandogya', 'Mahavakya', 'Advaita'],
        },
        difficulty: 'medium',
      },
      {
        front: {
          sanskrit: 'शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते',
          transliteration: 'śāntaṁ śivamadvaitaṁ caturthaṁ manyante',
          question: 'How does the Mandukya Upanishad characterize Turiya (the Fourth State)?',
        },
        back: {
          hindi: 'तुरीय शांत, कल्याणकारी और अद्वैत है — जो जाग्रत, स्वप्न और सुषुप्ति तीनों का साक्षी है।',
          english: 'Turiya is serene (Shanta), auspicious (Shiva), and non-dual (Advaita). It is the pure witness conscious ground beyond the three passing states.',
          explanation: 'It is neither outward-turned nor inward-turned cognition, but Pure Awareness itself.',
          keywords: ['Turiya', 'Mandukya', 'Consciousness'],
        },
        difficulty: 'hard',
      },
      {
        front: {
          sanskrit: 'श्रेयश्च प्रेयश्च',
          transliteration: 'śreyaśca preyaśca',
          question: 'What is the distinction between Shreyas and Preyas in the Katha Upanishad?',
        },
        back: {
          hindi: 'श्रेयस् वह है जो परम कल्याणकारी और सत्य है; प्रेयस् वह है जो केवल क्षणिक प्रिय और आकर्षक लगता है।',
          english: 'Shreyas is the Good/Liberating path of wisdom; Preyas is the Pleasant/Sensory path of short-term indulgence.',
          explanation: 'The immature chase Preyas and fall into repetition; the discerning choose Shreyas and achieve freedom.',
          keywords: ['Shreyas', 'Preyas', 'Katha Upanishad', 'Viveka'],
        },
        difficulty: 'easy',
      },
    ],
    slides: [
      {
        id: 'up-s1',
        sanskrit: 'यतो वाचो निवर्तन्ते अप्राप्य मनसा सह । आनन्दं ब्रह्मणो विद्वान्न बिभेति कदाचनेति ॥',
        transliteration: 'yato vāco nivartante aprāpya manasā saha | ānandaṁ brahmaṇo vidvānna bibheti kadācaneti ||',
        hindi: 'जहाँ से वाणी मन सहित बिना पाए लौट आती है, उस ब्रह्म के परमानंद को जानने वाला कभी किसी से भयभीत नहीं होता।',
        english: 'From whence words return back along with the mind without comprehending—knowing the supreme bliss of that Brahman, one fears nothing ever.',
        explanation: 'Taittiriya Upanishad 2.9 declares that the Absolute transcends sensory description; direct experience dispels all existential dread.',
        keywords: ['Brahman', 'Ananda', 'Fearlessness'],
        science: 'Contemporary neurological studies on non-dual contemplative states show marked down-regulation in amygdala fear-circuitry.',
      },
    ],
    mindmap: {
      id: 'root-upanishads',
      label: 'The Four Great Declarations (Mahavakyas)',
      labelSanskrit: 'चत्वारि महावाक्यानि',
      description: 'The four cornerstones of the Vedas',
      color: 'indigo',
      children: [
        {
          id: 'mv-rig',
          label: 'Rigveda: Prajnanam Brahma',
          labelSanskrit: 'प्रज्ञानं ब्रह्म',
          description: 'Consciousness is Brahman (Aitareya Up.)',
          color: 'saffron',
        },
        {
          id: 'mv-sama',
          label: 'Samaveda: Tat Tvam Asi',
          labelSanskrit: 'तत्त्वमसि',
          description: 'That Thou Art (Chandogya Up.)',
          color: 'emerald',
        },
        {
          id: 'mv-yajur',
          label: 'Yajurveda: Aham Brahmasmi',
          labelSanskrit: 'अहं ब्रह्मास्मि',
          description: 'I am Brahman (Brihadaranyaka Up.)',
          color: 'rose',
        },
        {
          id: 'mv-atharva',
          label: 'Atharvaveda: Ayam Atma Brahma',
          labelSanskrit: 'अयमात्मा ब्रह्म',
          description: 'This Self is Brahman (Mandukya Up.)',
          color: 'indigo',
        },
      ],
    },
    timeline: [
      {
        id: 'up-t1',
        year: 'c. 900–800 BCE',
        title: 'Early Prose Upanishads',
        sanskrit: 'बृहदारण्यक एवं छान्दोग्य',
        description: 'Vast intellectual dialogues at the courts of King Janaka and in sacred forest hermitages.',
        category: 'academic',
      },
      {
        id: 'up-t2',
        year: 'c. 600–500 BCE',
        title: 'Metrical Verse Upanishads',
        sanskrit: 'कठ, ईश, श्वेताश्वतर',
        description: 'Lyrical poetic compositions celebrating the Chariot of the body and Nachiketa’s spiritual triumph.',
        category: 'academic',
      },
      {
        id: 'up-t3',
        year: 'c. 8th Century CE',
        title: 'Adi Shankaracharya’s Bhashyas',
        sanskrit: 'शाङ्करभाष्य परम्परा',
        description: 'Master commentaries codifying Advaita Vedanta across the 10 Principal Upanishads.',
        category: 'commentarial',
      },
    ],
    quiz: {
      id: 'quiz-upanishads',
      title: 'Upanishadic Philosophy Check',
      titleSanskrit: 'उपनिषद् तत्त्व परीक्षण',
      description: 'Test your understanding of the Upanishadic seers and dialogues.',
      category: 'Upanishads',
      difficulty: 'advanced',
      questions: [
        {
          id: 'uq1',
          question: 'Which Upanishad contains the allegory of the chariot, where the intellect (buddhi) is the charioteer and senses are the horses?',
          options: ['Isha Upanishad', 'Katha Upanishad', 'Kena Upanishad', 'Prashna Upanishad'],
          correctIndex: 1,
          explanation: 'Katha Upanishad 1.3.3-4 presents the famous chariot allegory: Atman is the lord of the chariot, body the chariot, buddhi the driver, manas the reins, senses the horses.',
        },
        {
          id: 'uq2',
          question: 'In the Mandukya Upanishad, which syllable of A-U-M corresponds to the Dream state (Taijasa)?',
          options: ['"A" (Akara)', '"U" (Ukara)', '"M" (Makara)', 'The silence after OM'],
          correctIndex: 1,
          explanation: '"A" is waking (Vaishvanara), "U" is dream (Taijasa), "M" is deep sleep (Prajna), and the silence (Amatra) is Turiya.',
        },
        {
          id: 'uq3',
          question: 'What is the Mahavakya found in the Brihadaranyaka Upanishad?',
          options: ['Tat Tvam Asi', 'Prajnanam Brahma', 'Aham Brahmasmi', 'Sarvam Khalvidam Brahma'],
          correctIndex: 2,
          explanation: '"Aham Brahmasmi" (I am Brahman) is the great declaration from Brihadaranyaka Upanishad 1.4.10.',
        },
      ],
    },
    revisionRecommendations: {
      cadence: 'Weekly deep contemplation on one Mahavakya',
      recommendedReviewToday: ['Mandukya 4 states diagram', 'The Chariot metaphor in Katha'],
      coreVersesToMemorize: [
        {
          sanskrit: 'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥',
          transliteration: 'oṁ pūrṇamadaḥ pūrṇamidaṁ pūrṇātpūrṇamudacyate | pūrṇasya pūrṇamādāya pūrṇamevāvaśiṣyate ||',
          translation: 'That is Whole; This is Whole; Whole emerges from Whole; taking Whole from Whole, Whole alone remains.',
          reference: 'Isha Upanishad Shanti Mantra',
          philosophicalKey: 'The holographic wholeness of consciousness where infinite creation never depletes the source.',
        },
      ],
      contemplativeReflection: {
        title: 'Neti, Neti (Not This, Not This)',
        sanskritFocus: 'नेति नेत्यात्माऽगृह्यो न हि गृह्यते',
        prompt: 'Sit silently. Notice your body: "I am aware of this body; therefore I am the observer, not merely the body." Notice your thoughts: "I am aware of this thought; therefore I am the witness, not the thought." Rest as the unobjectified Witness.',
        practicalApplication: 'Disentangle from chronic mental rumination by stepping into the silent space of awareness.',
      },
      activeRecallChecklist: [
        'Can I recite all 4 Mahavakyas and match them to their respective Vedas?',
        'What are the 4 quarters of A-U-M in Mandukya?',
        'Why did Nachiketa reject worldly longevity and kingdoms from Yama?',
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
     4. VEDAS OVERVIEW
     ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'vedas-overview',
    slug: 'vedas-overview',
    title: 'The Four Vedas: The Primordial Shruti',
    titleSanskrit: 'चतुर्वेद परिचय एवं संहिता दर्शन',
    subtitle: 'The foundational hymns, cosmic order (Rta), and sacred structure',
    learningObjective:
      'Gain a panoramic, structured appreciation of the four Vedas (Rig, Sama, Yajur, Atharva), their four internal layers (Samhita, Brahmana, Aranyaka, Upanishad), the Vedic concept of Rta (cosmic order), and foundational hymns such as the Nasadiya Sukta and Purusha Sukta.',
    difficulty: 'intermediate',
    difficultySanskrit: 'मध्यम (Intermediate)',
    estimatedMinutes: 60,
    estimatedTime: '1 hr',
    includedFormats: ['flashcards', 'slides', 'mindmap', 'timeline', 'quizzes'],
    icon: '⚡',
    gradient: 'from-amber-700 via-orange-800 to-stone-950',
    accentColor: '#d97706',
    overview: {
      mangalCharan: {
        sanskrit: 'ॐ अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥',
        transliteration: 'oṁ agnimīḷe purohitaṁ yajñasya devamṛtvijam | hotāraṁ ratnadhātamam ||',
        meaning: 'I praise Agni, the chosen priest, the divine minister of sacrifice, the invoker, the greatest bestower of treasures.',
        source: 'Rigveda Samhita 1.1.1 (The very first verse of the Vedas)',
      },
      philosophicalPremise:
        'The Vedas represent the oldest recorded spiritual wisdom of humankind. Rather than simplistic polytheism, Vedic vision perceives the one undivided Reality (Ekam Sat) celebrated by seers under many names (Vipra bahudha vadanti).',
      scholarlyContext:
        'Preserved for millennia through sophisticated oral mnemonic traditions (Pada, Krama, Jata, Ghana pathas) that preserved accentuation and phonetics without a single variant syllable.',
      prerequisites: 'Appreciation for sacred poetry, Vedic cosmology, and symbolism.',
      studyMethodology:
        'Textual stratification analysis (Samhita → Brahmana → Aranyaka → Upanishad) coupled with hymn recitations and cosmological contemplation.',
      learningOutcomes: [
        'Understand the specific focus of each of the four Vedas',
        'Analyze the fourfold textual architecture of each Veda',
        'Contemplate the Creation Hymn (Nāsadīya Sūkta, Rigveda 10.129)',
        'Grasp the profound principle of Ṛta (cosmic and moral rhythm)',
        'Appreciate the oral Vedic chanting heritage recognized by UNESCO',
      ],
    },
    lessons: [
      {
        id: 'ved-1',
        order: 1,
        title: 'Rigveda: The Ocean of Hymns & Divine Vision',
        titleSanskrit: 'ऋग्वेद संहिता — मन्त्रों का महासागर',
        description: '10 Mandalas and 1,028 Suktas praising cosmic divinities: Agni, Indra, Varuna, and Ushas.',
        estimatedMinutes: 10,
        primaryFormat: 'reading',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'एकं सद्विप्रा बहुधा वदन्त्यग्निं यमं मातरिश्वानमाहुः ।',
          transliteration: 'ekaṁ sadviprā bahudhā vadantyagniṁ yamaṁ mātariśvānamāhuḥ |',
          translation: 'Truth is One; the wise call It by manifold names—such as Agni, Yama, and Matarishvan.',
          reference: 'Rigveda 1.164.46',
        },
        conceptsCovered: ['Ekam Sat', 'Suktas', 'Mandalas'],
      },
      {
        id: 'ved-2',
        order: 2,
        title: 'Yajurveda & Samaveda: The Liturgy and Sacred Melodies',
        titleSanskrit: 'यजुर्वेद एवं सामवेद — गान और यज्ञ परम्परा',
        description: 'Shukla & Krishna Yajurveda prose rituals, and the celestial melodies of the Samaveda.',
        estimatedMinutes: 10,
        primaryFormat: 'slides',
        scriptureHref: '/scripture/yajurveda/chapter/1',
        keyVerse: {
          sanskrit: 'वेदानां सामवेदोऽस्मि',
          transliteration: 'vedānāṁ sāmavedo\'smi',
          translation: 'Of the Vedas, I am the Samaveda.',
          reference: 'Bhagavad Gita 10.22',
        },
        conceptsCovered: ['Saman', 'Yajna', 'Chhandas'],
      },
      {
        id: 'ved-3',
        order: 3,
        title: 'Atharvaveda: Everyday Life, Healing & Harmony',
        titleSanskrit: 'अथर्ववेद — जनजीवन, आयुर्वेद एवं शान्ति',
        description: 'Hymns for health, harmony, statecraft, the iconic Prithvi Sukta (Hymn to Earth), and spiritual protection.',
        estimatedMinutes: 10,
        primaryFormat: 'timeline',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'माता भूमिः पुत्रो अहं पृथिव्याः ।',
          transliteration: 'mātā bhūmiḥ putro ahaṁ pṛthivyāḥ |',
          translation: 'The Earth is my mother; I am a child of the Earth.',
          reference: 'Atharvaveda, Prithvi Sukta 12.1.12',
        },
        conceptsCovered: ['Prithvi Sukta', 'Ayurveda Root', 'Bhrigu-Angiras'],
      },
      {
        id: 'ved-4',
        order: 4,
        title: 'Nasadiya Sukta: The Hymn of Ultimate Creation',
        titleSanskrit: 'नासदीय सूक्त — सृष्टि की परिकल्पना',
        description: 'Awe-inspiring agnostic inquiry into the origin of reality before existence and non-existence arose.',
        estimatedMinutes: 10,
        primaryFormat: 'flashcards',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत् ।',
          transliteration: 'nāsadāsīnno sadāsīttadānīṁ nāsīdrajo no vyomā paro yat |',
          translation: 'Then was not non-existence nor existence; there was no realm of air, nor the sky beyond.',
          reference: 'Rigveda 10.129.1',
        },
        conceptsCovered: ['Nasadiya Sukta', 'Tamas', 'Creation Mystery'],
      },
      {
        id: 'ved-5',
        order: 5,
        title: 'The Four Textual Layers of Each Veda',
        titleSanskrit: 'संहिता, ब्राह्मण, आरण्यक एवं उपनिषद्',
        description: 'From poetic hymns (Samhita) to ritual commentaries (Brahmana), forest reflections (Aranyaka), and philosophy (Upanishad).',
        estimatedMinutes: 10,
        primaryFormat: 'mindmap',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Samhita', 'Brahmana', 'Aranyaka', 'Upanishad'],
      },
      {
        id: 'ved-6',
        order: 6,
        title: 'Rta: The Cosmic Rhythm & Moral Harmony',
        titleSanskrit: 'ऋत — ब्रह्माण्डीय व्यवस्था',
        description: 'The ancient Vedic ancestor of Dharma: the self-regulating balance of seasons, stars, and human virtue.',
        estimatedMinutes: 10,
        primaryFormat: 'quizzes',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Rta', 'Varuna', 'Cosmic Law'],
      },
    ],
    keyConcepts: [
      {
        id: 'concept-rta',
        term: 'Rta',
        sanskrit: 'ऋत',
        transliteration: 'Ṛta',
        definition: 'The fundamental cosmic and moral order that governs planets, seasons, sunrise, and truthfulness.',
        philosophicalContext: 'The progenitor concept to Dharma and Karma; overseen by deity Varuna.',
        scriptureAnchor: 'Rigveda 4.23.8-10',
        relatedConceptIds: ['concept-satya', 'concept-dharma'],
      },
      {
        id: 'concept-ekam-sat',
        term: 'Ekam Sat',
        sanskrit: 'एकं सत्',
        transliteration: 'Ekaṁ Sat',
        definition: '"Truth is One"—the foundational Vedic declaration that multiplicity of names points to one singular Reality.',
        philosophicalContext: 'Forms the bedrock of Hindu pluralism, tolerance, and metaphysical monism.',
        scriptureAnchor: 'Rigveda 1.164.46',
        relatedConceptIds: ['concept-brahman', 'concept-satya'],
      },
    ],
    relatedScriptures: [
      {
        id: 'yajurveda',
        title: 'Yajurveda',
        titleSanskrit: 'यजुर्वेद',
        category: 'Veda / Shruti',
        description: 'Sacred mantras and prose formulas for cosmic rituals and inner transformation.',
        totalChapters: 40,
        totalVerses: 1975,
        href: '/scripture/yajurveda/chapter/1',
        sampleVerse: {
          sanskrit: 'मित्रस्य मा चक्षुषा सर्वाणि भूतानि समीक्षन्ताम् । मित्रस्याहं चक्षुषा सर्वाणि भूतानि समीक्षे ॥',
          translation: 'May all beings look upon me with the eye of a friend! May I look upon all beings with the eye of a friend!',
          reference: 'Yajurveda 36.18',
        },
      },
    ],
    flashcards: [
      {
        front: {
          sanskrit: 'एकं सद्विप्रा बहुधा वदन्ति',
          transliteration: 'ekaṁ sadviprā bahudhā vadanti',
          question: 'What is the significance of Rigveda 1.164.46?',
        },
        back: {
          hindi: 'सत्य एक ही है, जिसे ज्ञानी जन भिन्न-भिन्न नामों से पुकारते हैं।',
          english: 'Truth is One, but the wise describe It in manifold ways.',
          explanation: 'This iconic verse expresses the Vedic core: diverse expressions of worship all honor the singular ultimate reality.',
          keywords: ['Ekam Sat', 'Rigveda', 'Pluralism'],
        },
        difficulty: 'easy',
      },
      {
        front: {
          sanskrit: 'चार वेद और उनके प्रमुख विषय',
          transliteration: 'Catvāro Vedāḥ',
          question: 'What are the four Vedas and their distinguishing characteristics?',
        },
        back: {
          hindi: 'ऋग्वेद (स्तुति-मन्त्र), सामवेद (संगीत-गान), यजुर्वेद (यज्ञ-कर्मकाण्ड), अथर्ववेद (दैनिक जीवन और विज्ञान)।',
          english: 'Rigveda (hymns of praise), Samaveda (melodic chants), Yajurveda (prose liturgies), Atharvaveda (daily life, healing, spells, ecology).',
          explanation: 'Together they constitute the Chaturveda, the root of all classical Indian spiritual systems.',
          keywords: ['Rigveda', 'Samaveda', 'Yajurveda', 'Atharvaveda'],
        },
        difficulty: 'medium',
      },
    ],
    slides: [
      {
        id: 'ved-s1',
        sanskrit: 'सङ्गच्छध्वं संवदध्वं सं वो मनांसि जानताम् । देवा भागं यथा पूर्वे सञ्जानाना उपासते ॥',
        transliteration: 'saṅgacchadhvaṁ saṁvadadhvaṁ saṁ vo manāṁsi jānatām | devā bhāgaṁ yathā pūrve sañjānānā upāsate ||',
        hindi: 'साथ चलो, एक स्वर में बोलो, तुम्हारे मन एक हों; जैसे प्राचीन काल में ज्ञानी देवता मिलकर अपना भाग ग्रहण करते थे।',
        english: 'Assemble together, speak with one voice, let your minds be in harmony; as the wise seers of old unanimously served the sacred.',
        explanation: 'The final blessing of the Rigveda (10.191.2), known as the Samjnana Sukta—the anthem of collective unity and consensus.',
        keywords: ['Unity', 'Samjnana', 'Harmonious Society'],
        science: 'Social psychology confirms collective coherence rituals enhance community resilience and social trust by up to 50%.',
      },
    ],
    mindmap: {
      id: 'root-vedas',
      label: 'Chaturveda Structure',
      labelSanskrit: 'वेद चतुष्टय एवं ग्रन्थ स्तर',
      description: 'The four Vedas and their fourfold layers',
      color: 'amber',
      children: [
        {
          id: 'v-layers',
          label: 'The Four Textual Layers',
          labelSanskrit: 'चार ग्रन्थ स्तर',
          description: 'Evolution of scripture',
          color: 'saffron',
          children: [
            { id: 'vl-samhita', label: '1. Samhitas (Hymns)', description: 'Metrical mantras' },
            { id: 'vl-brahmana', label: '2. Brahmanas (Prose rituals)', description: 'Ritual application' },
            { id: 'vl-aranyaka', label: '3. Aranyakas (Forest texts)', description: 'Interiorized ritual' },
            { id: 'vl-upanishad', label: '4. Upanishads (Philosophy)', description: 'Jnana Kanda' },
          ],
        },
        {
          id: 'v-four',
          label: 'The Four Collections',
          labelSanskrit: 'चतुर्वेद',
          description: 'Distinct functional orientations',
          color: 'indigo',
          children: [
            { id: 'vf-rig', label: 'Rigveda', description: 'Wisdom & poetry (Hotri priest)' },
            { id: 'vf-sama', label: 'Samaveda', description: 'Music & song (Udgatri priest)' },
            { id: 'vf-yajur', label: 'Yajurveda', description: 'Action & liturgy (Adhvaryu priest)' },
            { id: 'vf-atharva', label: 'Atharvaveda', description: 'Protection & harmony (Brahma priest)' },
          ],
        },
      ],
    },
    timeline: [
      {
        id: 'ved-t1',
        year: 'Immorial Origin (Apaurusheya)',
        title: 'Vedic Revelation to the Rishis',
        sanskrit: 'ऋषि-दृष्टि परम्परा',
        description: 'Veda Vyasa compiles the eternal sound (Sabda Brahman) into the four Samhitas.',
        category: 'traditional',
      },
      {
        id: 'ved-t2',
        year: 'c. 1500–1200 BCE (Acad.)',
        title: 'Composition of Rigvedic Samhita',
        sanskrit: 'ऋग्वेद संकलन',
        description: 'Earliest poetic hymns centered on the sacred rivers of the Saptasindhu.',
        category: 'academic',
      },
      {
        id: 'ved-t3',
        year: '2003 CE',
        title: 'UNESCO World Heritage Recognition',
        sanskrit: 'यूनेस्को अमूर्त सांस्कृतिक धरोहर',
        description: 'The oral chanting of the Vedas is recognized as a masterpiece of the Oral and Intangible Heritage of Humanity.',
        category: 'academic',
      },
    ],
    quiz: {
      id: 'quiz-vedas',
      title: 'Vedas Knowledge Check',
      titleSanskrit: 'वेद ज्ञान परीक्षा',
      description: 'Assess your foundational understanding of the four Vedas.',
      category: 'Vedas',
      difficulty: 'intermediate',
      questions: [
        {
          id: 'vq1',
          question: 'What is the very first word of the Rigveda Samhita (1.1.1)?',
          options: ['Om', 'Agni (Agnimīḷe)', 'Indra', 'Brahman'],
          correctIndex: 1,
          explanation: '"Agnim īḷe purohitaṁ" begins with Agni, the divine flame and mediator between earth and heaven.',
        },
        {
          id: 'vq2',
          question: 'Which celebrated Sukta from Rigveda 10.129 asks profound questions about creation before time began?',
          options: ['Purusha Sukta', 'Nasadiya Sukta', 'Gayatri Mantra', 'Sri Sukta'],
          correctIndex: 1,
          explanation: 'The Nasadiya Sukta (Creation Hymn) explores the mystery of origins prior to existence or non-existence.',
        },
        {
          id: 'vq3',
          question: 'The famous declaration "The Earth is my mother, I am her child" appears in which Veda?',
          options: ['Rigveda', 'Samaveda', 'Yajurveda', 'Atharvaveda (Prithvi Sukta)'],
          correctIndex: 3,
          explanation: 'Atharvaveda 12.1.12 contains this visionary declaration of environmental reverence in the Prithvi Sukta.',
        },
      ],
    },
    revisionRecommendations: {
      cadence: 'Fortnightly review of Vedic cosmology and chant cadence',
      recommendedReviewToday: ['The four layers of each Veda', 'Nasadiya Sukta opening verses'],
      coreVersesToMemorize: [
        {
          sanskrit: 'एकं सद्विप्रा बहुधा वदन्त्यग्निं यमं मातरिश्वानमाहुः ।',
          transliteration: 'ekaṁ sadviprā bahudhā vadantyagniṁ yamaṁ mātariśvānamāhuḥ |',
          translation: 'Truth is One; the wise call It by many names.',
          reference: 'Rigveda 1.164.46',
          philosophicalKey: 'The eternal charter of spiritual pluralism and universal harmony.',
        },
      ],
      contemplativeReflection: {
        title: 'Attuning to Rta (The Cosmic Rhythm)',
        sanskritFocus: 'ऋतस्य पन्थां नयतु प्रजानन्',
        prompt: 'Look at the rising of the sun or changing seasons. All of nature operates in quiet harmony with Rta without anxious straining. Where in your daily schedule have you fallen out of sync with natural rhythm?',
        practicalApplication: 'Align your sleep, diet, and reflection with natural diurnal rhythms.',
      },
      activeRecallChecklist: [
        'Can I list the 4 Vedas and their respective priests?',
        'What are the 4 textual layers from Samhita to Upanishad?',
        'What does Rta mean and how does it relate to Dharma?',
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
     5. RAMAYANA
     ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'ramayana',
    slug: 'ramayana',
    title: 'Ramayana: The Epic Path of Maryada & Dharma',
    titleSanskrit: 'वाल्मीकि रामायण: मर्यादा पुरुषोत्तम',
    subtitle: 'The 7 Kandas of Valmiki’s immortal Adi Kavya',
    learningObjective:
      'Walk alongside Maryada Purushottama Sri Rama through Valmiki’s seven Kandas—understanding the practical embodiment of Dharma across filial duty, marital loyalty, brotherhood, ethical warfare, and societal leadership.',
    difficulty: 'beginner',
    difficultySanskrit: 'प्रारम्भिक (Beginner)',
    estimatedMinutes: 65,
    estimatedTime: '1 hr 5 mins',
    includedFormats: ['flashcards', 'slides', 'mindmap', 'timeline', 'quizzes'],
    icon: '🏹',
    gradient: 'from-amber-700 via-yellow-800 to-stone-900',
    accentColor: '#b45309',
    overview: {
      mangalCharan: {
        sanskrit: 'कूजन्तं राम रामेति मधुरं मधुराक्षरम् । आरुह्य कविताशाखां वन्दे वाल्मीकिकोकिलम् ॥',
        transliteration: 'kūjantaṁ rāma rāmeti madhuraṁ madhurākṣaram | āruhya kavitāśākhāṁ vande vālmīkikokilam ||',
        meaning: 'Salutations to the cuckoo Valmiki, who perches on the bough of poetry, melodiously singing the sweet name of Rama, Rama.',
        source: 'Valmiki Ramayana Dhyana Shloka',
      },
      philosophicalPremise:
        'The Ramayana is celebrated as the Adi Kavya (first poetry). Where scriptures give philosophical precepts, the Ramayana demonstrates Dharma alive in flesh and blood through Sri Rama—facing agonizing choices with unwavering poise and truthfulness.',
      scholarlyContext:
        'Composed by Maharshi Valmiki in 24,000 verses across seven books (Kandas): Bala, Ayodhya, Aranya, Kishkindha, Sundara, Yuddha, and Uttara Kanda.',
      prerequisites: 'Appreciation of narrative epic poetry and Indian ethical ideals.',
      studyMethodology:
        'Chronological passage through the Kandas, examining ethical tests (Dharma-Sankata) confronted by Rama, Sita, Lakshmana, and Bharata.',
      learningOutcomes: [
        'Comprehend the title "Maryāda Puruṣottama" (the supreme exemplar of righteous boundaries)',
        'Trace the 7 Kandas and their key thematic turning points',
        'Analyze Sita’s strength, dignity, and devotion as the spiritual core of the epic',
        'Understand Hanuman as the personification of selfless devotion (Dasa Bhakti) and intelligence',
        'Learn the nuances of Vibhishana’s ethical choice vs Kumbhakarna’s blind loyalty',
      ],
    },
    lessons: [
      {
        id: 'ram-1',
        order: 1,
        title: 'Bala Kanda: The Birth of the Epic & Divine Advent',
        titleSanskrit: 'बालकाण्ड — आदि काव्य का प्राकट्य',
        description: 'Valmiki’s compassionate grief (Shoka turns to Shloka), Vishwamitra’s training, and Sita Swayamvara.',
        estimatedMinutes: 9,
        primaryFormat: 'reading',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'मा निषाद प्रतिष्ठां त्वमगमः शाश्वतीः समाः । यत्क्रौञ्चमिथुनादेकमवधीः काममोहितम् ॥',
          transliteration: 'mā niṣāda pratiṣṭhāṁ tvamagamaḥ śāśvatīḥ samāḥ | yatkrauñcamithunādekamavadhīḥ kāmamohitam ||',
          translation: 'May you find no peace for eternal years, O hunter, who killed one of the loving krauncha birds.',
          reference: 'Valmiki Ramayana 1.2.15',
        },
        conceptsCovered: ['Adi Kavya', 'Shoka to Shloka', 'Bala Kanda'],
      },
      {
        id: 'ram-2',
        order: 2,
        title: 'Ayodhya Kanda: The Trial of Exile & Filial Duty',
        titleSanskrit: 'अयोध्याकाण्ड — पितृआज्ञा और वनगमन',
        description: 'Kaikeyi’s boons, Dasharatha’s agony, and Rama’s serene departure without a trace of anger or resentment.',
        estimatedMinutes: 10,
        primaryFormat: 'flashcards',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः ।',
          transliteration: 'rāmo vigrahavān dharmaḥ sādhuḥ satyaparākramaḥ |',
          translation: 'Rama is Dharma personified; he is noble and heroic in truth.',
          reference: 'Aranya Kanda 37.13 (Spoken by Maricha)',
        },
        conceptsCovered: ['Maryada', 'Pitri Ajna', 'Bharata Paduka'],
      },
      {
        id: 'ram-3',
        order: 3,
        title: 'Aranya Kanda: Forest Trials & The Abduction of Sita',
        titleSanskrit: 'अरण्यकाण्ड — पञ्चवटी और सीता हरण',
        description: 'Panchavati hermitage, golden deer delusion, Jatayu’s sacrifice, and Ravana’s treacherous abduction.',
        estimatedMinutes: 9,
        primaryFormat: 'timeline',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Panchavati', 'Jatayu', 'Shabari'],
      },
      {
        id: 'ram-4',
        order: 4,
        title: 'Kishkindha Kanda: The Sacred Bond of Friendship',
        titleSanskrit: 'किष्किन्धाकाण्ड — सुग्रीव मित्रता एवं हनुमान परिचय',
        description: 'Rama’s alliance with Sugriva, the moral complexity of the Vali episode, and dispatching search parties.',
        estimatedMinutes: 9,
        primaryFormat: 'mindmap',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Sugriva Sakhyam', 'Vali Vadha', 'Hanuman'],
      },
      {
        id: 'ram-5',
        order: 5,
        title: 'Sundara Kanda: Hanuman’s Flight of Faith & Valor',
        titleSanskrit: 'सुन्दरकाण्ड — श्रद्धा और पराक्रम का उड्डयन',
        description: 'Hanuman leaps across the ocean to Lanka, discovers Sita in Ashoka Vatika, and burns the city of arrogance.',
        estimatedMinutes: 10,
        primaryFormat: 'slides',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् । वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥',
          transliteration: 'manojavaṁ mārutatulyavegaṁ jitendriyaṁ buddhimatāṁ variṣṭham | vātātmajaṁ vānarayūthamukhyaṁ śrīrāmadūtaṁ śaraṇaṁ prapadye ||',
          translation: 'Swift as the mind, swift as the wind, master of the senses, leader of the wise, son of the wind, messenger of Rama, I seek thy refuge.',
          reference: 'Sundara Kanda Dhyanam',
        },
        conceptsCovered: ['Sundara Kanda', 'Hanuman', 'Ashoka Vatika'],
      },
      {
        id: 'ram-6',
        order: 6,
        title: 'Yuddha Kanda: The Bridge, The War & Triumph of Righteousness',
        titleSanskrit: 'युद्धकाण्ड — सेतुबन्धन और अधर्म का विनाश',
        description: 'Building Ram Setu, Vibhishana’s surrender, epic battle against Ravana, and the victorious return to Ayodhya.',
        estimatedMinutes: 10,
        primaryFormat: 'quizzes',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'न धर्मो लभते स्थानं कुतो जयः पराक्रमे ।',
          transliteration: 'na dharmo labhate sthānaṁ kuto jayaḥ parākrame |',
          translation: 'Where Dharma finds no place, how can victory exist even with mighty prowess?',
          reference: 'Yuddha Kanda',
        },
        conceptsCovered: ['Ram Setu', 'Vibhishana Sharanagati', 'Ramrajya'],
      },
    ],
    keyConcepts: [
      {
        id: 'concept-maryada',
        term: 'Maryada',
        sanskrit: 'मर्यादा',
        transliteration: 'Maryādā',
        definition: 'Righteous restraint, boundaried conduct, and strict adherence to ethical and familial standards.',
        philosophicalContext: 'Why Rama is called "Maryada Purushottama"—unlike an unrestricted deity, he accepts all human suffering within righteous boundaries.',
        scriptureAnchor: 'Valmiki Ramayana, Ayodhya Kanda',
        relatedConceptIds: ['concept-dharma', 'concept-satya'],
      },
      {
        id: 'concept-ramrajya',
        term: 'Ramrajya',
        sanskrit: 'रामराज्य',
        transliteration: 'Rāmarājya',
        definition: 'The ideal sovereign state characterized by total justice, prosperity, freedom from fear, and moral leadership.',
        philosophicalContext: 'Celebrated by Mahatma Gandhi and classical thinkers as the vision of decentralized, ethical commonwealth.',
        scriptureAnchor: 'Yuddha Kanda & Uttara Kanda',
        relatedConceptIds: ['concept-dharma', 'concept-lokasamgraha'],
      },
    ],
    relatedScriptures: [
      {
        id: 'ramcharitmanas',
        title: 'Ramcharitmanas',
        titleSanskrit: 'श्रीरामचरितमानस',
        category: 'Itihasa / Bhakti',
        description: 'Goswami Tulsidas’s ecstatic Awadhi retelling of the Ramayana in Chaupais and Dohas.',
        totalChapters: 7,
        totalVerses: 10000,
        href: '/scriptures',
        sampleVerse: {
          sanskrit: 'सीय राम मय सब जग जानी । करहुँ प्रनाम जोरि जुग पानी ॥',
          translation: 'Knowing the entire cosmos to be imbued with Sita and Rama, I bow to all with folded hands.',
          reference: 'Balkand, Chaupai',
        },
      },
    ],
    flashcards: [
      {
        front: {
          sanskrit: 'रामो विग्रहवान् धर्मः',
          transliteration: 'rāmo vigrahavān dharmaḥ',
          question: 'Who said "Rama is Dharma personified" and in what context?',
        },
        back: {
          hindi: 'मारीच ने रावण को चेतावनी देते हुए कहा था कि राम साक्षात् धर्म के मूर्त रूप हैं।',
          english: 'Maricha said it to Ravana in Aranya Kanda, warning him that confronting Rama would bring ruin because Rama is Dharma embodied.',
          explanation: 'Even Rama’s adversaries acknowledged his unwavering alignment with truth and cosmic law.',
          keywords: ['Vigrahavan Dharma', 'Maricha', 'Ramayana'],
        },
        difficulty: 'medium',
      },
      {
        front: {
          sanskrit: 'सप्तकाण्ड क्रम',
          transliteration: 'Saptakāṇḍa Krama',
          question: 'What is the correct sequential order of the seven Kandas of Valmiki Ramayana?',
        },
        back: {
          hindi: 'बालकाण्ड, अयोध्याकाण्ड, अरण्यकाण्ड, किष्किन्धाकाण्ड, सुन्दरकाण्ड, युद्धकाण्ड (लंका), उत्तरकाण्ड।',
          english: '1. Bala, 2. Ayodhya, 3. Aranya, 4. Kishkindha, 5. Sundara, 6. Yuddha (Lanka), 7. Uttara.',
          explanation: 'The epic spans from divine birth to exile, quest, battle, and final rule in Ayodhya.',
          keywords: ['Kandas', 'Structure', 'Epic Narrative'],
        },
        difficulty: 'easy',
      },
    ],
    slides: [
      {
        id: 'ram-s1',
        sanskrit: 'अपि स्वर्णमयी लङ्का न मे लक्ष्मण रोचते । जननी जन्मभूमिश्च स्वर्गादपि गरीयसी ॥',
        transliteration: 'api svarṇamayī laṅkā na me lakṣmaṇa rocate | jananī janmabhūmiśca svargādapi garīyasī ||',
        hindi: 'हे लक्ष्मण! भले ही यह लंका सोने की है, मुझे नहीं भाती। माता और मातृभूमि स्वर्ग से भी बढ़कर हैं।',
        english: 'Even though this Lanka is made of pure gold, Lakshmana, it delights me not. Mother and motherland are more revered than heaven itself.',
        explanation: 'Rama’s celebrated words upon conquering Lanka, declining to rule a foreign kingdom and honoring natural belonging.',
        keywords: ['Motherland', 'Integrity', 'Detachment'],
        science: 'Identity psychology reinforces that deep attachment to place and origins anchors emotional well-being and moral clarity.',
      },
    ],
    mindmap: {
      id: 'root-ramayana',
      label: 'The Seven Kandas of Ramayana',
      labelSanskrit: 'वाल्मीकि रामायण के सात काण्ड',
      description: 'The narrative and spiritual arc',
      color: 'amber',
      children: [
        {
          id: 'rk-early',
          label: 'The Early Years & Ayodhya',
          labelSanskrit: 'बाल एवं अयोध्या',
          description: 'Birth, training, wedding, and exile',
          color: 'saffron',
          children: [
            { id: 'rk-1', label: 'Bala Kanda', description: 'Birth & Vishwamitra' },
            { id: 'rk-2', label: 'Ayodhya Kanda', description: 'Dasharatha’s oath & exile' },
          ],
        },
        {
          id: 'rk-forest',
          label: 'The Forest Search',
          labelSanskrit: 'अरण्य, किष्किन्धा एवं सुन्दर',
          description: 'Abduction, alliance, and Hanuman’s leap',
          color: 'emerald',
          children: [
            { id: 'rk-3', label: 'Aranya Kanda', description: 'Sita Harana & Jatayu' },
            { id: 'rk-4', label: 'Kishkindha Kanda', description: 'Sugriva & Vali' },
            { id: 'rk-5', label: 'Sundara Kanda', description: 'Hanuman in Lanka' },
          ],
        },
        {
          id: 'rk-climax',
          label: 'The War & Coronation',
          labelSanskrit: 'युद्ध एवं उत्तर',
          description: 'Victory and righteous kingship',
          color: 'rose',
          children: [
            { id: 'rk-6', label: 'Yuddha Kanda', description: 'Bridge & Ravana Vadha' },
            { id: 'rk-7', label: 'Uttara Kanda', description: 'Ramrajya & culmination' },
          ],
        },
      ],
    },
    timeline: [
      {
        id: 'ram-t1',
        year: 'Treta Yuga (Trad.)',
        title: 'Exile from Ayodhya',
        sanskrit: 'अयोध्या त्याग',
        description: 'Rama, Sita, and Lakshmana cross the sacred Ganga, commencing 14 years of ascetic forest life.',
        category: 'narrative',
      },
      {
        id: 'ram-t2',
        year: 'Year 13 of Exile',
        title: 'The Great Leap of Hanuman',
        sanskrit: 'समुद्र लङ्घन',
        description: 'Hanuman flies across the southern sea, proving that devotion renders the impossible effortless.',
        category: 'narrative',
      },
      {
        id: 'ram-t3',
        year: 'Year 14 of Exile',
        title: 'Vijayadashami & Diwali Return',
        sanskrit: 'लंका विजय एवं राज्याभिषेक',
        description: 'Ravana is vanquished; the divine trio returns to Ayodhya on the Pushpaka Vimana to light up the kingdom.',
        category: 'narrative',
      },
    ],
    quiz: {
      id: 'quiz-ramayana',
      title: 'Ramayana Understanding Check',
      titleSanskrit: 'रामायण ज्ञान परीक्षा',
      description: 'Test your grasp of the characters, kandas, and ethics in the Ramayana.',
      category: 'Ramayana',
      difficulty: 'beginner',
      questions: [
        {
          id: 'rq1',
          question: 'Which Kanda of the Ramayana centers primarily around Hanuman’s search for Sita in Lanka?',
          options: ['Aranya Kanda', 'Kishkindha Kanda', 'Sundara Kanda', 'Yuddha Kanda'],
          correctIndex: 2,
          explanation: 'The 5th book, Sundara Kanda, is dedicated to Hanuman’s valor, wisdom, and discovery of Sita in Ashoka Vatika.',
        },
        {
          id: 'rq2',
          question: 'What bird offered its life fighting Ravana to protect Sita during her abduction?',
          options: ['Garuda', 'Sampati', 'Jatayu', 'Krauncha'],
          correctIndex: 2,
          explanation: 'Jatayu bravely fought Ravana and held onto his life just long enough to inform Sri Rama of Sita’s direction.',
        },
        {
          id: 'rq3',
          question: 'Who accompanied Vishwamitra as a youth to protect his sacred fire sacrifices from demons?',
          options: ['Rama and Bharata', 'Rama and Lakshmana', 'Lakshmana and Shatrughna', 'Bharata and Shatrughna'],
          correctIndex: 1,
          explanation: 'Sage Vishwamitra took Rama and Lakshmana to the forest, initiating them into sacred astras.',
        },
      ],
    },
    revisionRecommendations: {
      cadence: 'Daily 1-sarga reflection or Sundara Kanda contemplation',
      recommendedReviewToday: ['The 7 Kandas sequence', 'Vibhishana Sharanagati principle'],
      coreVersesToMemorize: [
        {
          sanskrit: 'अपि स्वर्णमयी लङ्का न मे लक्ष्मण रोचते । जननी जन्मभूमिश्च स्वर्गादपि गरीयसी ॥',
          transliteration: 'api svarṇamayī laṅkā na me lakṣmaṇa rocate | jananī janmabhūmiśca svargādapi garīyasī ||',
          translation: 'Even though this Lanka is made of gold, it does not entice me, Lakshmana. Mother and motherland are greater than heaven.',
          reference: 'Valmiki Ramayana, Yuddha Kanda',
          philosophicalKey: 'The supreme commitment to unselfish duty and sacred reverence for roots.',
        },
      ],
      contemplativeReflection: {
        title: 'Duty Without Grievance (Maryada)',
        sanskritFocus: 'धर्मो रक्षति रक्षितः',
        prompt: 'When an unexpected disruption strikes your plans today, observe if you instinctively blame others or adopt Rama’s quiet dignity: accepting the terrain without losing ethical poise.',
        practicalApplication: 'Embrace setbacks as arenas for practicing unwavering patience and character.',
      },
      activeRecallChecklist: [
        'Can I name all 7 Kandas in chronological order?',
        'What was the ethical difference between Vibhishana and Kumbhakarna?',
        'Why did Rama renounce the golden city of Lanka after winning the war?',
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
     6. MAHABHARATA
     ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'mahabharata',
    slug: 'mahabharata',
    title: 'Mahabharata: The Web of Human Destiny & Dharma',
    titleSanskrit: 'महाभारत: सूक्ष्म धर्म एवं नीति',
    subtitle: 'The 18 Parvas of Sage Vyasa’s encyclopedia of human nature',
    learningObjective:
      'Navigate the complex, tragic, and profound ethical labyrinth of the Mahabharata—exploring Sukshma Dharma (subtle duty), moral dilemmas of the Pandavas and Kauravas, the dice game, the war at Kurukshetra, and Bhishma’s discourses on statecraft in the Shanti Parva.',
    difficulty: 'intermediate',
    difficultySanskrit: 'मध्यम (Intermediate)',
    estimatedMinutes: 80,
    estimatedTime: '1 hr 20 mins',
    includedFormats: ['flashcards', 'slides', 'mindmap', 'timeline', 'quizzes'],
    icon: '🛡️',
    gradient: 'from-stone-800 via-red-950 to-neutral-950',
    accentColor: '#991b1b',
    overview: {
      mangalCharan: {
        sanskrit: 'नारायणं नमस्कृत्य नरं चैव नरोत्तमम् । देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत् ॥',
        transliteration: 'nārāyaṇaṁ namaskṛtya naraṁ caiva narottamam | devīṁ sarasvatīṁ vyāsaṁ tato jayamudīrayet ||',
        meaning: 'Bowing down to Narayana, to Nara the foremost of men, to Goddess Saraswati, and to sage Vyasa, may the epic Jaya be chanted.',
        source: 'Mahabharata Opening Invocatory Verse',
      },
      philosophicalPremise:
        'The Mahabharata famously declares: "What is found here may be found elsewhere; what is not found here is found nowhere else." It is the grandest mirror of the human condition—where Dharma is rarely black and white, but subtle (Sūkṣma), tragic, and endlessly demanding of supreme discernment.',
      scholarlyContext:
        'Composed by Krishna Dvaipayana Vyasa, containing over 100,000 verses across 18 Parvas (Books), including the Bhagavad Gita, the Sanatsujatiya, and the Vishnu Sahasranama.',
      prerequisites: 'Familiarity with the Pandava-Kaurava genealogy and ethical concepts.',
      studyMethodology:
        'Parva-by-Parva inquiry focusing on critical moral crossroads (Dharma-Sankata): the dice game, exile, the 18 days of battle, and Bhishma’s deathbed teachings.',
      learningOutcomes: [
        'Understand why Dharma is described as "Sūkṣma" (subtle and enigmatic) in the epic',
        'Analyze Yudhishthira’s fidelity to truth alongside his tragic gamble',
        'Examine Karna’s complex tragedy of loyalty, pride, and generosity',
        'Study Draupadi’s fierce intellectual indictment of the Kuru elders',
        'Grasp Bhishma’s profound teachings on statecraft (Rājadharma) in Shanti Parva',
      ],
    },
    lessons: [
      {
        id: 'mb-1',
        order: 1,
        title: 'Adi & Sabha Parva: Dynastic Seeds & The Fatal Dice Game',
        titleSanskrit: 'आदि एवं सभापर्व — द्यूत क्रीड़ा और धर्म संकट',
        description: 'The birth of the cousins, the building of Indraprastha, and Shakuni’s rigged dice game.',
        estimatedMinutes: 10,
        primaryFormat: 'reading',
        scriptureHref: '/scripture/mahabharata/chapter/1',
        keyVerse: {
          sanskrit: 'यतो धर्मस्ततो जयः',
          transliteration: 'yato dharmastato jayaḥ',
          translation: 'Where there is Dharma, there is victory.',
          reference: 'Mahabharata, Universal Refrain',
        },
        conceptsCovered: ['Indraprastha', 'Dyuta Parva', 'Sukshma Dharma'],
      },
      {
        id: 'mb-2',
        order: 2,
        title: 'Vana & Virata Parva: Exile, Yaksha Prashna & Incognito',
        titleSanskrit: 'वन एवं विराटपर्व — यक्ष-युधिष्ठिर संवाद',
        description: '12 years in the wilderness, Yudhishthira’s answers to the Yaksha, and the 13th year in disguise at Virata.',
        estimatedMinutes: 10,
        primaryFormat: 'flashcards',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'अहन्यहनि भूतानि गच्छन्ति यममन्दिरम् । शेषाः स्थावरमिच्छन्ति किमाश्चर्यमतः परम् ॥',
          transliteration: 'ahanyahani bhūtāni gacchanti yamamandiram | śeṣāḥ sthāvaramicchanti kimāścaryamataḥ param ||',
          translation: 'Every day living beings depart to the house of Death; yet those who remain believe they will live forever. What can be more wondrous than this?',
          reference: 'Yaksha Prashna, Vana Parva',
        },
        conceptsCovered: ['Yaksha Prashna', 'Ajnatavasa', 'Wisdom in Exile'],
      },
      {
        id: 'mb-3',
        order: 3,
        title: 'Udyoga Parva: The Peace Embassy & War Preparations',
        titleSanskrit: 'उद्योगपर्व — कृष्ण की शान्ति दूत यात्रा',
        description: 'Krishna’s last-ditch peace mission to Hastinapur; Duryodhana’s refusal to yield even a needlepoint of land.',
        estimatedMinutes: 10,
        primaryFormat: 'timeline',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Peace Embassy', 'Vidura Niti', 'War Inevitability'],
      },
      {
        id: 'mb-4',
        order: 4,
        title: 'Bhishma & Drona Parva: The Fall of the Elders',
        titleSanskrit: 'भीष्म एवं द्रोणपर्व — कुरुक्षेत्र का भीषण संग्राम',
        description: 'The Gita is spoken; Bhishma falls on the bed of arrows; Abhimanyu’s valiant stand in the Chakravyuha.',
        estimatedMinutes: 10,
        primaryFormat: 'mindmap',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Bhishma Sharashayya', 'Chakravyuha', 'Abhimanyu'],
      },
      {
        id: 'mb-5',
        order: 5,
        title: 'Karna & Shalya Parva: The Duel of Destinies',
        titleSanskrit: 'कर्ण एवं शल्यपर्व — नियति का खेल',
        description: 'Karna’s curses bear fruit; the climactic duel between Arjuna and Karna; Duryodhana’s final stand in the lake.',
        estimatedMinutes: 10,
        primaryFormat: 'slides',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Karna Tragedy', 'Duryodhana Fall', 'War Aftermath'],
      },
      {
        id: 'mb-6',
        order: 6,
        title: 'Shanti & Anushasana Parva: Bhishma’s Deathbed Discourse',
        titleSanskrit: 'शान्ति एवं अनुशासनपर्व — राजधर्म और मोक्षधर्म',
        description: 'Lying on his bed of arrows, Bhishma expounds Rajadharma (kingship), ethics, and the Vishnu Sahasranama.',
        estimatedMinutes: 15,
        primaryFormat: 'quizzes',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'अहिंसा परमो धर्मस्तथाहिंसा परं तपः । अहिंसा परमं सत्यं यतो धर्मः प्रवर्तते ॥',
          transliteration: 'ahiṁsā paramo dharmastathāhiṁsā paraṁ tapaḥ | ahiṁsā paramaṁ satyaṁ yato dharmaḥ pravartate ||',
          translation: 'Non-violence is the supreme Dharma; non-violence is the supreme austerity; non-violence is the highest truth.',
          reference: 'Anushasana Parva 115.25',
        },
        conceptsCovered: ['Rajadharma', 'Vishnu Sahasranama', 'Ahimsa'],
      },
    ],
    keyConcepts: [
      {
        id: 'concept-sukshma-dharma',
        term: 'Sukshma Dharma',
        sanskrit: 'सूक्ष्म धर्म',
        transliteration: 'Sūkṣma Dharma',
        definition: 'Subtle Dharma: the profound realization that moral decisions in complex situations often pit competing duties against one another.',
        philosophicalContext: 'A central leitmotif of the Mahabharata: moral truth cannot be mechanically deduced by crude dogma.',
        scriptureAnchor: 'Mahabharata, Vana & Shanti Parva',
        relatedConceptIds: ['concept-dharma', 'concept-satya'],
      },
    ],
    relatedScriptures: [
      {
        id: 'mahabharata',
        title: 'Mahabharata',
        titleSanskrit: 'महाभारतम्',
        category: 'Itihasa',
        description: 'Sage Vyasa’s monumental epic of duty, diplomacy, and liberation.',
        totalChapters: 18,
        totalVerses: 100000,
        href: '/scripture/mahabharata/chapter/1',
        sampleVerse: {
          sanskrit: 'न जातु कामान्न भयान्न लोभाद्धर्मं त्यजेज्जीवितस्यापि हेतोः ।',
          translation: 'Never abandon Dharma out of desire, fear, or greed, nor even for the sake of preserving life.',
          reference: 'Svargarohana Parva 5.50 (Bharata Savitri)',
        },
      },
    ],
    flashcards: [
      {
        front: {
          sanskrit: 'यतो धर्मस्ततो जयः',
          transliteration: 'yato dharmastato jayaḥ',
          question: 'What is the signature refrain repeated across the Mahabharata?',
        },
        back: {
          hindi: 'जहाँ धर्म है, वहीं वास्तविक विजय है।',
          english: 'Where there is Dharma, there alone is Victory.',
          explanation: 'Gandhari repeated this to Duryodhana each morning of the war when he requested her blessing for victory, refusing to bless injustice.',
          keywords: ['Yato Dharmastato Jayah', 'Gandhari', 'Refrain'],
        },
        difficulty: 'easy',
      },
      {
        front: {
          sanskrit: 'यक्ष-युधिष्ठिर संवाद',
          transliteration: 'Yaksha Prashna',
          question: 'What was Yudhishthira’s answer to "What is the greatest wonder in the world?"',
        },
        back: {
          hindi: 'प्रतिदिन प्राणी मृत्यु को प्राप्त होते हैं, फिर भी जो जीवित हैं वे अमर रहने की इच्छा रखते हैं — यही सबसे बड़ा आश्चर्य है।',
          english: 'Every single day beings perish before our eyes, yet the living behave as though they will never die. This is the supreme wonder.',
          explanation: 'From the Yaksha Prashna in Vana Parva, testing Yudhishthira’s philosophical discernment.',
          keywords: ['Yaksha Prashna', 'Mortality', 'Wonder'],
        },
        difficulty: 'medium',
      },
    ],
    slides: [
      {
        id: 'mb-s1',
        sanskrit: 'ऊर्ध्वबाहुर्विरौम्येष न च कश्चिच्छृणोति मे । धर्मादर्थश्च कामश्च स किमर्थं न सेव्यते ॥',
        transliteration: 'ūrdhvabāhurviraumyeṣa na ca kaścicchṛṇoti me | dharmādarthaśca kāmaśca sa kimarthaṁ na sevyate ||',
        hindi: 'मैं दोनों भुजाएं उठाकर पुकार रहा हूँ, पर कोई मेरी नहीं सुनता! धर्म से ही अर्थ और काम दोनों सिद्ध होते हैं, फिर उस धर्म का सेवन क्यों नहीं किया जाता?',
        english: 'With uplifted arms I cry aloud, yet no one heeds my voice! From Dharma arise both prosperity and legitimate joy—why then is Dharma not followed?',
        explanation: 'The impassioned lament of Sage Vyasa in the concluding chapter of the Mahabharata (Bharata Savitri).',
        keywords: ['Vyasa Lament', 'Bharata Savitri', 'Dharma'],
        science: 'Longitudinal studies in social sociology consistently demonstrate that societies with high ethical trust outperform corrupt ones in lasting prosperity.',
      },
    ],
    mindmap: {
      id: 'root-mahabharata',
      label: 'The 18 Parvas of Mahabharata',
      labelSanskrit: 'अष्टादश पर्व संग्रह',
      description: 'The monumental canvas of the epic',
      color: 'rose',
      children: [
        {
          id: 'mbp-early',
          label: 'Pre-War (Parvas 1–5)',
          labelSanskrit: 'युद्ध-पूर्व पर्व',
          description: 'Adi, Sabha, Vana, Virata, Udyoga',
          color: 'saffron',
        },
        {
          id: 'mbp-war',
          label: 'The 18 Days War (Parvas 6–10)',
          labelSanskrit: 'कुरुक्षेत्र संग्राम पर्व',
          description: 'Bhishma, Drona, Karna, Shalya, Sauptika',
          color: 'rose',
        },
        {
          id: 'mbp-after',
          label: 'Teachings & Epilogue (Parvas 11–18)',
          labelSanskrit: 'उपदेश एवं महाप्रस्थान',
          description: 'Stri, Shanti, Anushasana, Ashvamedhika, etc.',
          color: 'indigo',
        },
      ],
    },
    timeline: [
      {
        id: 'mb-t1',
        year: 'Year 1 of Conflict',
        title: 'The Dice Game in the Assembly Hall',
        sanskrit: 'द्यूत सभा',
        description: 'Draupadi questions the elders on Dharma while Yudhishthira loses his kingdom and brothers.',
        category: 'narrative',
      },
      {
        id: 'mb-t2',
        year: '13 Years Later',
        title: 'Day 10 of Kurukshetra War',
        sanskrit: 'भीष्म शरशय्या',
        description: 'Grandfather Bhishma is pinned by countless arrows, choosing his time of departure at Uttarayana.',
        category: 'narrative',
      },
      {
        id: 'mb-t3',
        year: 'Post-War Period',
        title: 'Bhishma’s Shanti Parva Discourse',
        sanskrit: 'शान्तिपर्व उपदेश',
        description: 'The dying patriarch instructs Yudhishthira on righteous statecraft, ethics, and liberation.',
        category: 'narrative',
      },
    ],
    quiz: {
      id: 'quiz-mahabharata',
      title: 'Mahabharata Wisdom Check',
      titleSanskrit: 'महाभारत ज्ञान परीक्षा',
      description: 'Test your understanding of the characters and philosophical lessons of the Mahabharata.',
      category: 'Mahabharata',
      difficulty: 'intermediate',
      questions: [
        {
          id: 'mq1',
          question: 'In which Parva of the Mahabharata does the Bhagavad Gita appear?',
          options: ['Sabha Parva', 'Bhishma Parva', 'Drona Parva', 'Shanti Parva'],
          correctIndex: 1,
          explanation: 'The Bhagavad Gita is found in chapters 23 to 40 of the Bhishma Parva.',
        },
        {
          id: 'mq2',
          question: 'What is the name of the celebrated dialogue on ethics and statecraft between Vidura and Dhritarashtra?',
          options: ['Yaksha Prashna', 'Vidura Niti', 'Sanatsujatiya', 'Mokshadharma'],
          correctIndex: 1,
          explanation: 'Vidura Niti, occurring in Udyoga Parva, is Mahatma Vidura’s masterclass on wisdom and ethical governance.',
        },
        {
          id: 'mq3',
          question: 'Where is the Vishnu Sahasranama Stotram located in the Mahabharata?',
          options: ['Vana Parva', 'Virata Parva', 'Anushasana Parva', 'Ashvamedhika Parva'],
          correctIndex: 2,
          explanation: 'Bhishma chants the 1,000 names of Lord Vishnu to Yudhishthira in the Anushasana Parva (Chapter 149).',
        },
      ],
    },
    revisionRecommendations: {
      cadence: 'Bi-weekly study of Yaksha Prashna or Vidura Niti',
      recommendedReviewToday: ['Sukshma Dharma nuances', 'Bhishma’s Rajadharma pillars'],
      coreVersesToMemorize: [
        {
          sanskrit: 'अहिंसा परमो धर्मस्तथाहिंसा परं तपः । अहिंसा परमं सत्यं यतो धर्मः प्रवर्तते ॥',
          transliteration: 'ahiṁsā paramo dharmastathāhiṁsā paraṁ tapaḥ | ahiṁsā paramaṁ satyaṁ yato dharmaḥ pravartate ||',
          translation: 'Non-violence is the supreme Dharma, supreme austerity, and supreme truth from which all virtue flows.',
          reference: 'Mahabharata, Anushasana Parva 115.25',
          philosophicalKey: 'The pinnacle ethical imperative amidst a world prone to conflict.',
        },
      ],
      contemplativeReflection: {
        title: 'Navigating Gray Dilemmas (Sukshma Dharma)',
        sanskritFocus: 'सूक्ष्मा गतिर्हि धर्मस्य',
        prompt: 'Reflect on a situation where two legitimate obligations collided. Did you run away, or did you carefully weigh the higher public good (Lokasamgraha) over petty ego?',
        practicalApplication: 'Seek the guidance of conscience and selfless service when moral codes conflict.',
      },
      activeRecallChecklist: [
        'Why did Gandhari refuse to bless Duryodhana with victory?',
        'What are the core insights of the Yaksha Prashna?',
        'What makes Karna one of literature’s most enduring tragic figures?',
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
     7. BHAKTI TRADITIONS
     ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'bhakti-traditions',
    slug: 'bhakti-traditions',
    title: 'Bhakti Traditions: Pathways of Divine Love',
    titleSanskrit: 'भक्ति परम्परा: प्रेम और समर्पण',
    subtitle: 'From Narada Bhakti Sutras and Alvars to the Medieval Mystic Saints',
    learningObjective:
      'Immerse in the devotional renaissance of Sanatana Dharma—tracing the philosophy of Parama Prema (supreme love) in Narada & Sandilya Sutras, the ninefold devotion (Navadha Bhakti), and the egalitarian saint-poets like Mirabai, Kabir, Tulsidas, and Andal.',
    difficulty: 'beginner',
    difficultySanskrit: 'प्रारम्भिक (Beginner)',
    estimatedMinutes: 55,
    estimatedTime: '55 mins',
    includedFormats: ['flashcards', 'slides', 'mindmap', 'timeline', 'quizzes'],
    icon: '🪷',
    gradient: 'from-rose-700 via-pink-800 to-amber-950',
    accentColor: '#e11d48',
    overview: {
      mangalCharan: {
        sanskrit: 'ॐ सा त्वस्मिन् परमप्रेमरूपा । अमृतस्वरूपा च । यल्लब्ध्वा पुमान् सिद्धो भवति अमृतो भवति तृप्तो भवति ॥',
        transliteration: 'oṁ sā tvasmin paramapremarūpā | amṛtasvarūpā ca | yallabdhvā pumān siddho bhavati amṛto bhavati tṛpto bhavati ||',
        meaning: 'Bhakti is of the nature of supreme divine love. It is nectarous immortality itself; attaining which, a human being becomes perfected, immortal, and completely fulfilled.',
        source: 'Narada Bhakti Sutra 2-4',
      },
      philosophicalPremise:
        'Bhakti Yoga is often called the royal highway of the heart. Transcending rigid scholasticism without abandoning philosophical depth, it invites the seeker into an intimate, ecstatic relationship with the Divine in any chosen form (Ishta Devata).',
      scholarlyContext:
        'Originated in the Vedas and Gita, crystallized in the South Indian Alvar and Nayanar movements, and swept across India as a pan-indic socio-spiritual wave in the works of Ramananda, Chaitanya, Jnaneshwar, Mirabai, and Tulsidas.',
      prerequisites: 'A warm, receptive heart and appreciation of sacred poetry.',
      studyMethodology:
        'Thematic study of the 5 devotional moods (Bhavas), the 9 expressions of Bhakti (Navadha Bhakti), and poetic songs of realization.',
      learningOutcomes: [
        'Define Parama-Prema according to Sage Narada',
        'Analyze the nine expressions of devotion (Navadhā Bhakti) in Ramcharitmanas',
        'Understand the 5 primary devotional attitudes (Śānta, Dāsya, Sakhya, Vātsalya, Madhura)',
        'Trace the historical pan-Indian Bhakti movement and its egalitarian social impact',
        'Integrate heartfelt prayer and surrender (Śaraṇāgati) into daily living',
      ],
    },
    lessons: [
      {
        id: 'bh-1',
        order: 1,
        title: 'Narada Bhakti Sutras: The Science of Supreme Love',
        titleSanskrit: 'नारद भक्तिसूत्र — परम प्रेम का लक्षण',
        description: 'Sage Narada defines divine love: free from selfish bartering, ecstatic, and immortal.',
        estimatedMinutes: 9,
        primaryFormat: 'reading',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'सा न कामयमाना निरोधरूपत्वात् ।',
          transliteration: 'sā na kāmayamānā nirodharūpatvāt |',
          translation: 'Divine love does not seek selfish fulfillment, for it consists in the renunciation of petty desires.',
          reference: 'Narada Bhakti Sutra 7',
        },
        conceptsCovered: ['Parama Prema', 'Amrita', 'Nirodha'],
      },
      {
        id: 'bh-2',
        order: 2,
        title: 'Navadha Bhakti: The Nine Portals of Devotion',
        titleSanskrit: 'नवधा भक्ति — श्रीराम और शबरी संवाद',
        description: 'Sri Rama reveals the nine expressions of love to ascetic Shabari in the Aranya Kanda.',
        estimatedMinutes: 9,
        primaryFormat: 'flashcards',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'प्रथम भगति संतन्ह कर संगा । दूसरि रति मम कथा प्रसंगा ॥',
          transliteration: 'prathama bhagati saṁtanha kara saṁgā | dūsari rati mama kathā prasaṁgā ||',
          translation: 'The first devotion is association with holy souls; the second is deep love for sacred stories of the Divine.',
          reference: 'Ramcharitmanas, Aranya Kanda',
        },
        conceptsCovered: ['Navadha Bhakti', 'Shabari', 'Satsanga'],
      },
      {
        id: 'bh-3',
        order: 3,
        title: 'The Five Devotional Moods: Pancha Bhavas',
        titleSanskrit: 'पञ्च भाव — शान्त, दास्य, सख्य, वात्सल्य, मधुर',
        description: 'How seekers relate to God: as peace, servant, companion, parent, or ecstatic beloved.',
        estimatedMinutes: 9,
        primaryFormat: 'slides',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Bhavas', 'Madhura Bhava', 'Dasya'],
      },
      {
        id: 'bh-4',
        order: 4,
        title: 'The Alvar & Nayanar Seers of Tamil Nadu',
        titleSanskrit: 'आळ्वार एवं नयनार सन्त परम्परा',
        description: 'The ecstatic Tamil hymns of Divya Prabandham and Thevaram that birthed temple devotional poetry.',
        estimatedMinutes: 9,
        primaryFormat: 'timeline',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Alvars', 'Andal', 'Divya Prabandham'],
      },
      {
        id: 'bh-5',
        order: 5,
        title: 'The Pan-Indian Saint-Poets: Voices of Grace',
        titleSanskrit: 'मध्यकालीन सन्त — मीरा, कबीर, सूरदास, तुलसीदास',
        description: 'Breaking barriers of caste and gender: the songs of Mirabai, Kabir, Tukaram, and Guru Nanak.',
        estimatedMinutes: 10,
        primaryFormat: 'mindmap',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Mirabai', 'Kabir', 'Tukaram'],
      },
      {
        id: 'bh-6',
        order: 6,
        title: 'Kirtana & Nama Japa: The Power of the Holy Name',
        titleSanskrit: 'नाम संकीर्तन एवं स्मरण महिमा',
        description: 'Why musical chanting and constant remembrance (Smarana) quiet the restless ego.',
        estimatedMinutes: 9,
        primaryFormat: 'quizzes',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Nama Japa', 'Kirtana', 'Smarana'],
      },
    ],
    keyConcepts: [
      {
        id: 'concept-navadha-bhakti',
        term: 'Navadha Bhakti',
        sanskrit: 'नवधा भक्ति',
        transliteration: 'Navadhā Bhakti',
        definition: 'The nine sequential expressions of devotion taught by Sri Rama: Satsanga, listening, serving, singing, japa, restraint, seeing God in all, contentment, and simplicity.',
        philosophicalContext: 'A universally accessible ladder of love requiring no pedigree or wealth.',
        scriptureAnchor: 'Ramcharitmanas, Aranya Kanda 35',
        relatedConceptIds: ['concept-bhakti', 'concept-sharanagati'],
      },
    ],
    relatedScriptures: [
      {
        id: 'bhagavadgita',
        title: 'Bhagavad Gita (Chapter 12)',
        titleSanskrit: 'श्रीमद्भगवद्गीता (भक्तियोग)',
        category: 'Itihasa',
        description: 'Krishna’s 35 qualities of the cherished devotee.',
        totalChapters: 18,
        totalVerses: 700,
        href: '/scripture/bhagavadgita/chapter/12',
        sampleVerse: {
          sanskrit: 'मय्यावेश्य मनो ये मां नित्ययुक्ता उपासते । श्रद्धया परयोपेतास्ते मे युक्ततमा मताः ॥',
          translation: 'Those who, fixing their minds on Me, worship Me with steadfast devotion and supreme faith, are considered the most perfect yogis.',
          reference: 'Chapter 12, Verse 2',
        },
      },
    ],
    flashcards: [
      {
        front: {
          sanskrit: 'सा त्वस्मिन् परमप्रेमरूपा',
          transliteration: 'sā tvasmin paramapremarūpā',
          question: 'How does Sage Narada define Bhakti in Sutra 2?',
        },
        back: {
          hindi: 'भक्ति परमात्मा के प्रति परम प्रेमरूपा और अमृतस्वरूपा है।',
          english: 'Bhakti is of the nature of supreme divine love (Parama Prema) and is immortal nectar itself.',
          explanation: 'It is neither business transaction nor fear of punishment, but pure, unadulterated longing for union.',
          keywords: ['Parama Prema', 'Narada Bhakti Sutra', 'Immortal Love'],
        },
        difficulty: 'easy',
      },
      {
        front: {
          sanskrit: 'पञ्च भाव (Five Devotional Moods)',
          transliteration: 'Pañca Bhāva',
          question: 'What are the five classical Bhavas (attitudes) in Bhakti traditions?',
        },
        back: {
          hindi: 'शान्त (शांत निष्ठा), दास्य (सेवक भाव), सख्य (मित्र भाव), वात्सल्य (माता-पिता भाव), मधुर (प्रेमी भाव)।',
          english: '1. Shanta (peaceful contemplation), 2. Dasya (devoted servant), 3. Sakhya (intimate friend), 4. Vatsalya (parental tenderness), 5. Madhura (sweet lover).',
          explanation: 'These allow the human heart to direct every natural emotion toward the Divine.',
          keywords: ['Bhavas', 'Madhura', 'Dasya', 'Sakhya'],
        },
        difficulty: 'medium',
      },
    ],
    slides: [
      {
        id: 'bh-s1',
        sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज',
        transliteration: 'sarvadharmānparityajya māmekaṁ śaraṇaṁ vraja',
        hindi: 'सब धर्मों को मुझमें समर्पित करके केवल मेरी शरण में आ जाओ।',
        english: 'Relinquishing all self-made burdens, surrender yourself into My loving care alone.',
        explanation: 'The ultimate solace of Bhakti Yoga: divine grace effortlessly dissolves karmic bondages when sincere surrender is offered.',
        keywords: ['Grace', 'Surrender', 'Sharanagati'],
        science: 'Psychological studies on religious surrender show significant decreases in chronic anxiety and cortisol levels compared to control groups.',
      },
    ],
    mindmap: {
      id: 'root-bhakti',
      label: 'The Landscape of Bhakti',
      labelSanskrit: 'भक्ति आन्दोलन एवं स्वरूप',
      description: 'Pan-Indian devotion and practices',
      color: 'rose',
      children: [
        {
          id: 'bh-forms',
          label: 'The 9 Forms (Navadha)',
          labelSanskrit: 'नवधा भक्ति सोपान',
          description: 'Hearing, singing, remembering, serving...',
          color: 'saffron',
        },
        {
          id: 'bh-geography',
          label: 'Regional Saint Movements',
          labelSanskrit: 'क्षेत्रीय सन्त परम्परा',
          description: 'South, West, North, and East streams',
          color: 'emerald',
          children: [
            { id: 'bg-south', label: 'South: Alvars & Nayanars' },
            { id: 'bg-west', label: 'West: Jnaneshwar, Tukaram, Mirabai' },
            { id: 'bg-north', label: 'North: Ramananda, Kabir, Tulsidas' },
            { id: 'bg-east', label: 'East: Chaitanya Mahaprabhu' },
          ],
        },
      ],
    },
    timeline: [
      {
        id: 'bh-t1',
        year: 'c. 6th–9th Century CE',
        title: 'The Alvar & Nayanar Era',
        sanskrit: 'तमिलनाडु में भक्ति प्रभात',
        description: 'Saint-poets wander singing ecstatic hymns in temple corridors across the Tamil landscape.',
        category: 'historical',
      },
      {
        id: 'bh-t2',
        year: 'c. 12th–16th Century CE',
        title: 'The Pan-Indian Bhakti Resurgence',
        sanskrit: 'अखिल भारतीय सन्त लहर',
        description: 'Devotional poetry in local vernacular languages unites common people in love for God.',
        category: 'historical',
      },
    ],
    quiz: {
      id: 'quiz-bhakti',
      title: 'Bhakti Traditions Check',
      titleSanskrit: 'भक्ति परम्परा परीक्षा',
      description: 'Assess your grasp of the Bhakti movement and devotional literature.',
      category: 'Bhakti',
      difficulty: 'beginner',
      questions: [
        {
          id: 'bhq1',
          question: 'Who spoke the teachings on Navadha Bhakti (Ninefold Devotion) to Shabari?',
          options: ['Sage Vashistha', 'Lord Sri Rama', 'Sage Narada', 'Lakshmana'],
          correctIndex: 1,
          explanation: 'Sri Rama directly explains the nine steps of devotion to Shabari in the Aranya Kanda.',
        },
        {
          id: 'bhq2',
          question: 'What is the highest devotional mood (Bhava) characterized by intense, ecstatic love as seen in Mirabai and Andal?',
          options: ['Shanta Bhava', 'Dasya Bhava', 'Sakhya Bhava', 'Madhura Bhava'],
          correctIndex: 3,
          explanation: 'Madhura Bhava (sweet, conjugal love) treats the Divine as the sole supreme Beloved of the soul.',
        },
      ],
    },
    revisionRecommendations: {
      cadence: 'Daily morning or evening devotional chant / Japa practice',
      recommendedReviewToday: ['The 9 steps of Navadha Bhakti', 'Narada’s definition of love'],
      coreVersesToMemorize: [
        {
          sanskrit: 'ॐ सा त्वस्मिन् परमप्रेमरूपा । अमृतस्वरूपा च ॥',
          transliteration: 'oṁ sā tvasmin paramapremarūpā | amṛtasvarūpā ca ||',
          translation: 'Bhakti is of the nature of supreme divine love, and is immortal nectar itself.',
          reference: 'Narada Bhakti Sutra 2-3',
          philosophicalKey: 'The definitive philosophical description of love for God.',
        },
      ],
      contemplativeReflection: {
        title: 'Opening the Heart to Divine Presence',
        sanskritFocus: 'सर्वत्र समदर्शनम्',
        prompt: 'Notice someone you feel irritation toward today. Mentally whisper: "The same Divine that dwells in my heart dwells also in yours." Feel the softening of resentment.',
        practicalApplication: 'Transform ordinary interactions into acts of quiet reverence.',
      },
      activeRecallChecklist: [
        'Can I list at least 5 of the 9 steps in Navadha Bhakti?',
        'What are the 5 Bhavas in devotional philosophy?',
        'Why was the Bhakti movement historically liberating for marginalized communities?',
      ],
    },
  },

  /* ──────────────────────────────────────────────────────────────────────────
     8. VEDANTA FOUNDATIONS
     ────────────────────────────────────────────────────────────────────────── */
  {
    id: 'vedanta-foundations',
    slug: 'vedanta-foundations',
    title: 'Vedanta Foundations: Prasthanatrayi & Non-Duality',
    titleSanskrit: 'वेदान्त आधार: प्रस्थानत्रयी एवं अद्वैत',
    subtitle: 'The three scriptural pillars, Shankara’s Advaita, and Jivanmukti',
    learningObjective:
      'Grasp the crowning philosophical system of Hindu thought—exploring the three scriptural pillars of the Prasthanatrayi (Upanishads, Bhagavad Gita, Brahma Sutras), the doctrine of Maya and Adhyasa (superimposition), the qualifications for liberation (Sadhana Chatushtaya), and the state of living liberation (Jivanmukti).',
    difficulty: 'advanced',
    difficultySanskrit: 'उन्नत (Advanced)',
    estimatedMinutes: 85,
    estimatedTime: '1 hr 25 mins',
    includedFormats: ['flashcards', 'slides', 'mindmap', 'timeline', 'quizzes'],
    icon: '☀️',
    gradient: 'from-amber-600 via-yellow-700 to-stone-950',
    accentColor: '#ca8a04',
    overview: {
      mangalCharan: {
        sanskrit: 'अथातो ब्रह्मजिज्ञासा ॥ जन्माद्यस्य यतः ॥ शास्त्रयोनित्वात् ॥ तत्तु समन्वयात् ॥',
        transliteration: 'athāto brahmajijñāsā || janmādyasya yataḥ || śāstrayonitvāt || tattu samanvayāt ||',
        meaning: 'Now therefore the inquiry into Brahman. From which is the origin, sustenance, and dissolution of this universe. Because scripture is the source of its knowledge. But that Brahman is known by the harmonization of all Vedic texts.',
        source: 'Brahma Sutras 1.1.1–4 (Chatussutri)',
      },
      philosophicalPremise:
        'Vedanta ("the end/culmination of the Vedas") is the rigorous intellectual and experiential crown of Indian spirituality. It addresses the ultimate questions: What is real? Who am I? What is this world? Through uncompromising logic and contemplative discernment, it reveals the non-dual Truth.',
      scholarlyContext:
        'Built upon the three authoritative sources (Prasthānatrayī): Śruti Prasthāna (Upanishads), Smṛti Prasthāna (Bhagavad Gita), and Nyāya Prasthāna (Brahma Sutras). Interpreted by Adi Shankara (Advaita), Ramanuja (Vishishtadvaita), and Madhva (Dvaita).',
      prerequisites: 'Prior exposure to the Upanishads and Bhagavad Gita.',
      studyMethodology:
        'Dialectical analysis: Adhyāropa-Apavāda (superimposition and sublation), Drig-Drishya Viveka (seer vs seen), and Sadhana Chatushtaya.',
      learningOutcomes: [
        'Master the structure and purpose of the Prasthānatrayī',
        'Analyze the Adhyāsa Bhāṣya: how illusion arises through superimposition',
        'Distinguish the three orders of reality (Pāramārthika, Vyāvahārika, Prātibhāsika)',
        'Develop the fourfold qualifications of an aspirant (Sādhana Catuṣṭaya)',
        'Understand Jīvanmukti: freedom while still living in this physical body',
      ],
    },
    lessons: [
      {
        id: 'ved-f1',
        order: 1,
        title: 'The Triple Canon: Prasthanatrayi',
        titleSanskrit: 'प्रस्थानत्रयी — उपनिषद्, गीता, ब्रह्मसूत्र',
        description: 'The foundation of all Vedantic acharyas: revelation (Upanishads), application (Gita), and logic (Brahma Sutras).',
        estimatedMinutes: 12,
        primaryFormat: 'reading',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'अथातो ब्रह्मजिज्ञासा',
          transliteration: 'athāto brahmajijñāsā',
          translation: 'Now, therefore, the inquiry into the nature of Brahman.',
          reference: 'Brahma Sutra 1.1.1',
        },
        conceptsCovered: ['Prasthanatrayi', 'Brahma Sutras', 'Chatussutri'],
      },
      {
        id: 'ved-f2',
        order: 2,
        title: 'The Fourfold Qualifications: Sadhana Chatushtaya',
        titleSanskrit: 'साधन चतुष्टय — अधिकारी के लक्षण',
        description: 'Viveka (discernment), Vairagya (dispassion), Shatka-sampatti (six inner virtues), and Mumukshutva (longing for freedom).',
        estimatedMinutes: 12,
        primaryFormat: 'flashcards',
        scriptureHref: '/scriptures',
        keyVerse: {
          sanskrit: 'ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।',
          transliteration: 'brahma satyaṁ jaganmithyā jīvo brahmaiva nāparaḥ |',
          translation: 'Brahman is the sole Reality; the world is an appearance; the individual soul is none other than Brahman.',
          reference: 'Adi Shankara, Vivekachudamani',
        },
        conceptsCovered: ['Sadhana Chatushtaya', 'Viveka', 'Mumukshutva'],
      },
      {
        id: 'ved-f3',
        order: 3,
        title: 'Adhyasa: The Mechanics of Illusion & Superimposition',
        titleSanskrit: 'अध्यास — रज्जु-सर्प न्याय और माया',
        description: 'Shankara’s famous rope-and-snake analogy: how the mind superimposes the unreal upon the Real.',
        estimatedMinutes: 14,
        primaryFormat: 'slides',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Adhyasa', 'Rope and Snake', 'Maya'],
      },
      {
        id: 'ved-f4',
        order: 4,
        title: 'The Three Orders of Reality: Satta Traya',
        titleSanskrit: 'त्रिविध सत्ता — पारमार्थिक, व्यावहारिक, प्रातिभासिक',
        description: 'Resolving contradictions: absolute reality (Paramarthika), empirical everyday reality (Vyavaharika), and dream/illusion (Pratibhasika).',
        estimatedMinutes: 12,
        primaryFormat: 'mindmap',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Satta Traya', 'Paramarthika', 'Vyavaharika'],
      },
      {
        id: 'ved-f5',
        order: 5,
        title: 'Drig-Drishya Viveka: Discerning the Seer from the Seen',
        titleSanskrit: 'दृग्-दृश्य विवेक — द्रष्टा और दृश्य का भेद',
        description: 'Objects are seen by eyes; eyes are seen by mind; mind is witnessed by the Self. The Seer cannot be an object.',
        estimatedMinutes: 12,
        primaryFormat: 'timeline',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Drig Drishya', 'Witness Consciousness', 'Sakshi'],
      },
      {
        id: 'ved-f6',
        order: 6,
        title: 'Jivanmukti: Living Free in the World',
        titleSanskrit: 'जीवन्मुक्ति — देह में रहते हुए मोक्ष',
        description: 'The marks of the liberated sage who walks the earth with serene, unbroken joy, untouched by praise or blame.',
        estimatedMinutes: 13,
        primaryFormat: 'quizzes',
        scriptureHref: '/scriptures',
        conceptsCovered: ['Jivanmukti', 'Videhamukti', 'Prarabdha Karma'],
      },
    ],
    keyConcepts: [
      {
        id: 'concept-brahma-satyam',
        term: 'Brahma Satyam Jagan Mithya',
        sanskrit: 'ब्रह्म सत्यं जगन्मिथ्या',
        transliteration: 'Brahma Satyaṁ Jagan Mithyā',
        definition: 'Brahman is the changeless Reality; the world of forms is an empirical appearance (Mithya); the soul is non-different from Brahman.',
        philosophicalContext: 'The famous half-verse encapsulating Adi Shankara’s entire non-dual philosophy.',
        scriptureAnchor: 'Vivekachudamani',
        relatedConceptIds: ['concept-brahman', 'concept-atman', 'concept-maya'],
      },
    ],
    relatedScriptures: [
      {
        id: 'ishavasya',
        title: 'Isha Upanishad',
        titleSanskrit: 'ईशावास्योपनिषद्',
        category: 'Shruti Prasthana',
        description: 'The premier text of the Shruti canon in Vedanta.',
        totalChapters: 1,
        totalVerses: 18,
        href: '/scripture/ishavasya/chapter/1',
        sampleVerse: {
          sanskrit: 'तदेजति तन्नैजति तद्दूरे तद्वन्तिके । तदन्तरस्य सर्वस्य तदु सर्वस्यास्य बाह्यतः ॥',
          translation: 'That moves and That moves not; That is far and That is near; That is within all this and That is outside all this.',
          reference: 'Verse 5',
        },
      },
    ],
    flashcards: [
      {
        front: {
          sanskrit: 'ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः',
          transliteration: 'brahma satyaṁ jaganmithyā jīvo brahmaiva nāparaḥ',
          question: 'What is the precise philosophical meaning of "Mithya" in Advaita Vedanta?',
        },
        back: {
          hindi: 'मिथ्या का अर्थ ‘शून्य’ नहीं, अपितु वह है जो परिवर्तनशील और व्यावहारिक रूप से प्रतीत होता है, पर पारमार्थिक रूप से नित्य नहीं है।',
          english: '"Mithya" does not mean nonexistent void; it means that which has dependent existence (an appearance), subject to change, not absolutely real on its own.',
          explanation: 'Like a wave whose true substance is water: the wave exists empirically, but its fundamental reality is nothing other than water.',
          keywords: ['Mithya', 'Advaita', 'Shankara', 'Real vs Unreal'],
        },
        difficulty: 'hard',
      },
      {
        front: {
          sanskrit: 'प्रस्थानत्रयी क्या है?',
          transliteration: 'Prasthānatrayī',
          question: 'What are the three canonical pillars of the Prasthanatrayi?',
        },
        back: {
          hindi: '१. श्रुति प्रस्थान (उपनिषद्), २. स्मृति प्रस्थान (भगवद्गीता), ३. न्याय प्रस्थान (ब्रह्मसूत्र)।',
          english: '1. Śruti Prasthāna (Upanishads), 2. Smṛti Prasthāna (Bhagavad Gita), 3. Nyāya Prasthāna (Brahma Sūtras).',
          explanation: 'Any authentic school of Vedanta must provide comprehensive commentaries (Bhashyas) reconciling these three.',
          keywords: ['Prasthanatrayi', 'Upanishads', 'Gita', 'Brahma Sutras'],
        },
        difficulty: 'medium',
      },
    ],
    slides: [
      {
        id: 'vf-s1',
        sanskrit: 'सच्चिदानन्दरूपाय विश्वोत्पत्यादिहेतवे । तापत्रयविनाशाय श्रीकृष्णाय वयं नुमः ॥',
        transliteration: 'saccidānandarūpāya viśvotpatyādihetave | tāpatrayavināśāya śrīkṛṣṇāya vayaṁ numaḥ ||',
        hindi: 'सत्, चित् और आनन्द स्वरूप, संसार की उत्पत्ति आदि के कारण, और तीनों तापों का नाश करने वाले परमात्मा को हम प्रणाम करते हैं।',
        english: 'Unto That whose essential nature is Truth, Pure Consciousness, and Supreme Bliss, the source of creation and dispeller of all threefold sorrow, we bow.',
        explanation: 'The definition of Sat-Chit-Ananda: existence that never ceases, consciousness that never sleeps, bliss that never fades.',
        keywords: ['Sat-Chit-Ananda', 'Vedanta', 'Non-Duality'],
        science: 'Philosophers of mind describe non-dual consciousness as pure reflexivity devoid of subject-object tension.',
      },
    ],
    mindmap: {
      id: 'root-vedanta-f',
      label: 'The Architecture of Vedanta',
      labelSanskrit: 'वेदान्त दर्शन के आधारस्तम्भ',
      description: 'Prasthanatrayi and Epistemology',
      color: 'amber',
      children: [
        {
          id: 'vf-pillars',
          label: 'The Three Pillars',
          labelSanskrit: 'प्रस्थानत्रयी',
          description: 'Upanishads, Gita, Brahma Sutras',
          color: 'saffron',
        },
        {
          id: 'vf-schools',
          label: 'The Three Main Acharyas',
          labelSanskrit: 'प्रमुख वेदान्त मत',
          description: 'Advaita, Vishishtadvaita, Dvaita',
          color: 'emerald',
          children: [
            { id: 'vfs-shankara', label: 'Advaita (Adi Shankara)' },
            { id: 'vfs-ramanuja', label: 'Vishishtadvaita (Ramanuja)' },
            { id: 'vfs-madhva', label: 'Dvaita (Madhvacharya)' },
          ],
        },
      ],
    },
    timeline: [
      {
        id: 'vf-t1',
        year: 'c. 5th Century BCE',
        title: 'Brahma Sutras Composed by Badarayana',
        sanskrit: 'बादरायण ब्रह्मसूत्र रचना',
        description: '555 concise aphorisms systematically harmonizing and defending the Upanishadic teachings.',
        category: 'academic',
      },
      {
        id: 'vf-t2',
        year: 'c. 788–820 CE',
        title: 'Adi Shankaracharya’s All-India Digvijaya',
        sanskrit: 'आदि शङ्कराचार्य दिग्विजय',
        description: 'Revitalizes Sanatana Dharma, establishes four Amnaya Mathas at the four corners of India.',
        category: 'acharya',
      },
    ],
    quiz: {
      id: 'quiz-vedanta',
      title: 'Vedanta Foundations Check',
      titleSanskrit: 'वेदान्त दर्शन परीक्षा',
      description: 'Evaluate your understanding of classical non-dual metaphysics.',
      category: 'Vedanta',
      difficulty: 'advanced',
      questions: [
        {
          id: 'vfq1',
          question: 'What is the very first aphorism (sutra) of the Brahma Sutras?',
          options: ['Janmadyasya yatah', 'Athato brahmajijnasa', 'Shastrayonitvat', 'Tattu samanvayat'],
          correctIndex: 1,
          explanation: '"Athato brahmajijnasa" (Now therefore the inquiry into Brahman) is the celebrated opening sutra.',
        },
        {
          id: 'vfq2',
          question: 'In Advaita, which order of reality corresponds to everyday empirical experience in the world?',
          options: ['Paramarthika Satta', 'Vyavaharika Satta', 'Pratibhasika Satta', 'Turiya Satta'],
          correctIndex: 1,
          explanation: 'Vyavaharika Satta is the empirical, transactional reality of names and forms in daily life.',
        },
      ],
    },
    revisionRecommendations: {
      cadence: 'Daily Manana (rational reflection) on Seer vs Seen',
      recommendedReviewToday: ['Sadhana Chatushtaya 4 pillars', 'Brahma Sutra 1.1.1 meaning'],
      coreVersesToMemorize: [
        {
          sanskrit: 'ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ॥',
          transliteration: 'brahma satyaṁ jaganmithyā jīvo brahmaiva nāparaḥ ||',
          translation: 'Brahman is real, the universe is an appearance, and the soul is none other than Brahman.',
          reference: 'Vivekachudamani',
          philosophicalKey: 'The definitive summary formula of non-dual realization.',
        },
      ],
      contemplativeReflection: {
        title: 'Drig-Drishya Viveka (The Seer vs The Seen)',
        sanskritFocus: 'दृश्यं धीवृत्तयः साक्षी दृगेव न तु दृश्यते',
        prompt: 'Look around you. Sight is seen, eye is the seer. Close your eyes. Thoughts are seen, awareness is the seer. Can the ultimate Seer ever be turned into an object to look at? Rest as that pure, ungraspable Light.',
        practicalApplication: 'Stop objectifying yourself as your thoughts or emotions.',
      },
      activeRecallChecklist: [
        'What are the 3 texts comprising the Prasthanatrayi?',
        'What does Satta-Traya explain?',
        'What are the 4 qualifications of Sadhana Chatushtaya?',
      ],
    },
  },
];

export function getLearningPath(id: string): LearningPath | undefined {
  return learningPaths.find((p) => p.id === id || p.slug === id);
}

export function getAllLearningPaths(): LearningPath[] {
  return learningPaths;
}
