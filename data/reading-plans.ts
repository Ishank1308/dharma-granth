/**
 * Structured Reading Plans Database
 * Non-punitive, calm schedules for scripture immersion:
 * - 18-Day Gita Immersion
 * - 7-Day Foundation
 * - 30-Day Principal Upanishads Inquiry
 * - 5-Minute Morning Contemplation
 */

export interface ReadingPlanDay {
  dayNumber: number;
  title: string;
  titleHi: string;
  scriptureId: string;
  chapterId: number;
  verseRange?: string;
  href: string;
  estimatedMinutes: number;
  focusTheme: string;
  focusThemeHi: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  titleHi: string;
  category: 'beginner' | 'immersive' | 'contemplative' | 'deep-dive';
  totalDays: number;
  dailyMinutes: number;
  description: string;
  descriptionHi: string;
  days: ReadingPlanDay[];
}

export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'gita-18-days',
    title: '18-Day Bhagavad Gita Immersion',
    titleHi: '18 दिवसीय भगवद्गीता स्वाध्याय',
    category: 'immersive',
    totalDays: 18,
    dailyMinutes: 15,
    description: 'Read and reflect on one chapter of the Gita each day. Designed for calm pacing with no guilt if you miss a day.',
    descriptionHi: 'प्रतिदिन एक अध्याय का अध्ययन व मनन। बिना किसी तनाव या जल्दबाजी के अपनी गति से पूरा करें।',
    days: [
      {
        dayNumber: 1,
        title: 'Chapter 1: Arjuna Vishada Yoga',
        titleHi: 'अध्याय 1: अर्जुनविषादयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 1,
        href: '/scripture/bhagavadgita/chapter/1',
        estimatedMinutes: 15,
        focusTheme: 'Observing the battlefield and confronting existential grief',
        focusThemeHi: 'धर्म-संकट और मानसिक अवसाद का सामना',
      },
      {
        dayNumber: 2,
        title: 'Chapter 2: Sankhya Yoga',
        titleHi: 'अध्याय 2: सांख्ययोग',
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        href: '/scripture/bhagavadgita/chapter/2',
        estimatedMinutes: 20,
        focusTheme: 'The immortal Self, Karma Yoga, and steady wisdom (Sthitaprajna)',
        focusThemeHi: 'आत्मा की अमरता, निष्काम कर्म और स्थितप्रज्ञ के लक्षण',
      },
      {
        dayNumber: 3,
        title: 'Chapter 3: Karma Yoga',
        titleHi: 'अध्याय 3: कर्मयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 3,
        href: '/scripture/bhagavadgita/chapter/3',
        estimatedMinutes: 15,
        focusTheme: 'Duty without entitlement and the cosmic wheel of sacrifice',
        focusThemeHi: 'कर्तव्य पालन और स्वार्थ-रहित यज्ञ भावना',
      },
      {
        dayNumber: 4,
        title: 'Chapter 4: Jnana Karma Sannyasa Yoga',
        titleHi: 'अध्याय 4: ज्ञानकर्मसंन्यासयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 4,
        href: '/scripture/bhagavadgita/chapter/4',
        estimatedMinutes: 15,
        focusTheme: 'Lineage of wisdom, divine descent, and the fire of knowledge',
        focusThemeHi: 'ज्ञान की अग्नि में कर्म-फल का भस्म होना',
      },
      {
        dayNumber: 5,
        title: 'Chapter 5: Karma Sannyasa Yoga',
        titleHi: 'अध्याय 5: कर्मसंन्यासयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 5,
        href: '/scripture/bhagavadgita/chapter/5',
        estimatedMinutes: 12,
        focusTheme: 'Outer engagement with inner renunciation of ego',
        focusThemeHi: 'कर्म करते हुए भी आंतरिक अलिप्तता',
      },
      {
        dayNumber: 6,
        title: 'Chapter 6: Dhyana Yoga',
        titleHi: 'अध्याय 6: ध्यानयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 6,
        href: '/scripture/bhagavadgita/chapter/6',
        estimatedMinutes: 15,
        focusTheme: 'Meditation, breath discipline, and cultivating a friendly mind',
        focusThemeHi: 'मन को मित्र बनाना और ध्यान की विधि',
      },
      {
        dayNumber: 7,
        title: 'Chapter 7: Jnana Vijnana Yoga',
        titleHi: 'अध्याय 7: ज्ञानविज्ञानयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 7,
        href: '/scripture/bhagavadgita/chapter/7',
        estimatedMinutes: 14,
        focusTheme: 'Higher and lower nature, and four types of seekers',
        focusThemeHi: 'परा-अपरा प्रकृति और चार प्रकार के भक्त',
      },
      {
        dayNumber: 8,
        title: 'Chapter 8: Akshara Brahma Yoga',
        titleHi: 'अध्याय 8: अक्षरब्रह्मयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 8,
        href: '/scripture/bhagavadgita/chapter/8',
        estimatedMinutes: 14,
        focusTheme: 'The eternal imperishable truth and conscious departure',
        focusThemeHi: 'अविनाशी ब्रह्म और अंतकाल का स्मरण',
      },
      {
        dayNumber: 9,
        title: 'Chapter 9: Raja Vidya Raja Guhya Yoga',
        titleHi: 'अध्याय 9: राजविद्याराजगुह्ययोग',
        scriptureId: 'bhagavadgita',
        chapterId: 9,
        href: '/scripture/bhagavadgita/chapter/9',
        estimatedMinutes: 15,
        focusTheme: 'The royal secret: universal love, divine shelter, and simple devotion',
        focusThemeHi: 'परम गोपनीय ज्ञान और पत्र-पुष्प का समर्पण',
      },
      {
        dayNumber: 10,
        title: 'Chapter 10: Vibhuti Yoga',
        titleHi: 'अध्याय 10: विभूतियोग',
        scriptureId: 'bhagavadgita',
        chapterId: 10,
        href: '/scripture/bhagavadgita/chapter/10',
        estimatedMinutes: 15,
        focusTheme: 'Divine glory manifesting across all created wonders',
        focusThemeHi: 'सृष्टि के समस्त वैभव में परमात्मा का दर्शन',
      },
      {
        dayNumber: 11,
        title: 'Chapter 11: Vishvarupa Darshana Yoga',
        titleHi: 'अध्याय 11: विश्वरूपदर्शनयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 11,
        href: '/scripture/bhagavadgita/chapter/11',
        estimatedMinutes: 20,
        focusTheme: 'The awe-inspiring cosmic vision and surrender of finite perspective',
        focusThemeHi: 'विराट् रूप का दर्शन और काल का सत्य',
      },
      {
        dayNumber: 12,
        title: 'Chapter 12: Bhakti Yoga',
        titleHi: 'अध्याय 12: भक्तियोग',
        scriptureId: 'bhagavadgita',
        chapterId: 12,
        href: '/scripture/bhagavadgita/chapter/12',
        estimatedMinutes: 12,
        focusTheme: 'Qualities of the beloved devotee: kindness, patience, and equality',
        focusThemeHi: 'प्रिय भक्त के बारह लक्षण',
      },
      {
        dayNumber: 13,
        title: 'Chapter 13: Kshetra Kshetrajna Vibhaga Yoga',
        titleHi: 'अध्याय 13: क्षेत्रक्षेत्रज्ञविभागयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 13,
        href: '/scripture/bhagavadgita/chapter/13',
        estimatedMinutes: 15,
        focusTheme: 'The field of body-mind and the conscious knower within',
        focusThemeHi: 'शरीर रूपी क्षेत्र और आत्मा रूपी क्षेत्रज्ञ का भेद',
      },
      {
        dayNumber: 14,
        title: 'Chapter 14: Gunatraya Vibhaga Yoga',
        titleHi: 'अध्याय 14: गुणत्रयविभागयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 14,
        href: '/scripture/bhagavadgita/chapter/14',
        estimatedMinutes: 14,
        focusTheme: 'Sattva, Rajas, and Tamas: understanding psychological energies',
        focusThemeHi: 'सत्त्व, रज और तम — तीनों गुणों का प्रभाव और गुणातीत होना',
      },
      {
        dayNumber: 15,
        title: 'Chapter 15: Purushottama Yoga',
        titleHi: 'अध्याय 15: पुरुषोत्तमयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 15,
        href: '/scripture/bhagavadgita/chapter/15',
        estimatedMinutes: 12,
        focusTheme: 'The upside-down cosmic tree (Ashvattha) and the supreme spirit',
        focusThemeHi: 'संसार रूपी अश्वत्थ वृक्ष और पुरुषोत्तम तत्त्व',
      },
      {
        dayNumber: 16,
        title: 'Chapter 16: Daivasura Sampad Vibhaga Yoga',
        titleHi: 'अध्याय 16: दैवासुरसम्पद्विभागयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 16,
        href: '/scripture/bhagavadgita/chapter/16',
        estimatedMinutes: 12,
        focusTheme: 'Luminous virtues vs destructive egoic habits',
        focusThemeHi: 'दैवी और आसुरी प्रवृत्तियों की पहचान',
      },
      {
        dayNumber: 17,
        title: 'Chapter 17: Shraddhatraya Vibhaga Yoga',
        titleHi: 'अध्याय 17: श्रद्धात्रयविभागयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 17,
        href: '/scripture/bhagavadgita/chapter/17',
        estimatedMinutes: 14,
        focusTheme: 'Threefold faith, food, sacrifice, austerity, and OM TAT SAT',
        focusThemeHi: 'श्रद्धा, आहार और तप का त्रिगुणात्मक स्वरूप',
      },
      {
        dayNumber: 18,
        title: 'Chapter 18: Moksha Sannyasa Yoga',
        titleHi: 'अध्याय 18: मोक्षसंन्यासयोग',
        scriptureId: 'bhagavadgita',
        chapterId: 18,
        href: '/scripture/bhagavadgita/chapter/18',
        estimatedMinutes: 25,
        focusTheme: 'The grand synthesis: authentic duty, detachment, and final refuge',
        focusThemeHi: 'समस्त उपदेशों का सार, शरणागति और संशय-मुक्ति',
      },
    ],
  },

  {
    id: 'foundation-7-days',
    title: '7-Day Sanatana Foundation',
    titleHi: '7 दिवसीय सनातन धर्म आधार',
    category: 'beginner',
    totalDays: 7,
    dailyMinutes: 10,
    description: 'A gentle weekly introduction to key concepts: Dharma, Karma, Atman, Yoga, and Peace.',
    descriptionHi: 'धर्म, कर्म, आत्मा, योग और शांति — एक सप्ताह में सनातन धर्म के मूल सिद्धांतों का सरल परिचय।',
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: What is Dharma?',
        titleHi: 'पहला दिन: धर्म क्या है?',
        scriptureId: 'bhagavadgita',
        chapterId: 1,
        href: '/scripture/bhagavadgita/chapter/1/verse/1',
        estimatedMinutes: 10,
        focusTheme: 'Dharmakshetre: the battlefield of life and foundational ethics',
        focusThemeHi: 'जीवन रूपी धर्मक्षेत्र और सदाचार का आधार',
      },
      {
        dayNumber: 2,
        title: 'Day 2: Who am I? (The Atman)',
        titleHi: 'दूसरा दिन: मैं कौन हूँ? (आत्मा का स्वरूप)',
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        href: '/scripture/bhagavadgita/chapter/2/verse/20',
        estimatedMinutes: 10,
        focusTheme: 'The eternal witness untouched by death or decay',
        focusThemeHi: 'अविनाशी चेतन साक्षी जो कभी नष्ट नहीं होता',
      },
      {
        dayNumber: 3,
        title: 'Day 3: The Law of Action (Karma)',
        titleHi: 'तीसरा दिन: कर्म का नियम',
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        href: '/scripture/bhagavadgita/chapter/2/verse/47',
        estimatedMinutes: 10,
        focusTheme: 'Effort belongs to you; outcomes belong to collective reality',
        focusThemeHi: 'पुरुषार्थ आपके वश में है, परिणाम नहीं',
      },
      {
        dayNumber: 4,
        title: 'Day 4: Skill and Equanimity (Yoga)',
        titleHi: 'चौथा दिन: समत्व और कुशलता',
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        href: '/scripture/bhagavadgita/chapter/2/verse/48',
        estimatedMinutes: 10,
        focusTheme: 'Yoga as balance in victory and defeat',
        focusThemeHi: 'सुख-दुःख में समभाव रखना ही योग है',
      },
      {
        dayNumber: 5,
        title: 'Day 5: Friendship with Your Mind',
        titleHi: 'पाँचवाँ दिन: मन से मित्रता',
        scriptureId: 'bhagavadgita',
        chapterId: 6,
        href: '/scripture/bhagavadgita/chapter/6/verse/5',
        estimatedMinutes: 10,
        focusTheme: 'Lifting yourself by your own disciplined consciousness',
        focusThemeHi: 'अपने ही मन को अपना मित्र बनाना',
      },
      {
        dayNumber: 6,
        title: 'Day 6: Unity of Creation (Brahman in All)',
        titleHi: 'छठा दिन: समस्त सृष्टि में एक परमात्मा',
        scriptureId: 'ishavasya',
        chapterId: 1,
        href: '/scripture/ishavasya/chapter/1/verse/1',
        estimatedMinutes: 10,
        focusTheme: 'Isha Vasyam Idam Sarvam: everything is pervaded by the Divine',
        focusThemeHi: 'ईशावास्यमिदं सर्वम् — सब कुछ परमात्मा से व्याप्त है',
      },
      {
        dayNumber: 7,
        title: 'Day 7: Universal Peace (Shanti)',
        titleHi: 'सातवाँ दिन: विश्व शांति का संकल्प',
        scriptureId: 'taittiriya',
        chapterId: 1,
        href: '/scripture/taittiriya/chapter/1/verse/1',
        estimatedMinutes: 10,
        focusTheme: 'Om Shanti Shanti Shanti: harmony in cosmos, nature, and self',
        focusThemeHi: 'आधिभौतिक, आधिदैविक और आध्यात्मिक शांति',
      },
    ],
  },
];

export function getReadingPlan(id: string): ReadingPlan | undefined {
  return READING_PLANS.find((p) => p.id === id);
}
