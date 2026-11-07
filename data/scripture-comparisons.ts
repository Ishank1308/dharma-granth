/**
 * Doors between pages that already exist.
 * Each note names the page. This file does not decide a school or retell a plot.
 */

export interface ComparisonLink {
  titleHi: string;
  titleEn: string;
  href: string;
  noteHi: string;
  noteEn: string;
}

export interface ScriptureComparison {
  id: string;
  titleHi: string;
  titleEn: string;
  blurbHi: string;
  blurbEn: string;
  links: ComparisonLink[];
}

export const SCRIPTURE_COMPARISONS: ScriptureComparison[] = [
  {
    id: 'gita-and-upanishad',
    titleHi: 'गीता और उपनिषद्',
    titleEn: 'Gita and an Upanishad',
    blurbHi: 'दो पुस्तकालय पृष्ठ। गीता 2.20 और ईशावास्य 1.1।',
    blurbEn: 'Two library pages: Bhagavad Gita 2.20 and Isha Upanishad 1.1.',
    links: [
      {
        titleHi: 'भगवद्गीता 2.20',
        titleEn: 'Bhagavad Gita 2.20',
        href: '/scripture/bhagavadgita/chapter/2/verse/20',
        noteHi: 'गीता का यह श्लोक पृष्ठ खोलता है।',
        noteEn: 'Opens this Gita verse page.',
      },
      {
        titleHi: 'ईशावास्य 1.1',
        titleEn: 'Isha Upanishad 1.1',
        href: '/scripture/ishavasya/chapter/1/verse/1',
        noteHi: 'ईशावास्य का यह मंत्र पृष्ठ खोलता है।',
        noteEn: 'Opens this Isha verse page.',
      },
    ],
  },
  {
    id: 'bhakti-and-knowledge',
    titleHi: 'भक्ति और आत्मज्ञान',
    titleEn: 'Bhakti and self-knowledge',
    blurbHi: 'भक्ति के पृष्ठ और आत्मज्ञान के पृष्ठ। दोनों को एक मत में नहीं मिलाया गया।',
    blurbEn: 'The bhakti pages and the self-knowledge pages. They are listed side by side.',
    links: [
      {
        titleHi: 'भक्ति',
        titleEn: 'Bhakti',
        href: '/concepts/bhakti',
        noteHi: 'भक्ति का अवधारणा पृष्ठ।',
        noteEn: 'Opens the Bhakti concept page.',
      },
      {
        titleHi: 'भक्ति और शरणागति',
        titleEn: 'Devotion and Surrender',
        href: '/wisdom-for-life/devotion',
        noteHi: 'भक्ति का जीवन-विषय।',
        noteEn: 'Opens the devotion topic.',
      },
      {
        titleHi: 'भगवद्गीता 12.13',
        titleEn: 'Bhagavad Gita 12.13',
        href: '/scripture/bhagavadgita/chapter/12/verse/13',
        noteHi: 'गीता के बारहवें अध्याय का श्लोक पृष्ठ।',
        noteEn: 'Opens Gita 12.13.',
      },
      {
        titleHi: 'आत्मज्ञान और साक्षी भाव',
        titleEn: 'Self-Knowledge and the Witness',
        href: '/wisdom-for-life/self-knowledge',
        noteHi: 'आत्मज्ञान का जीवन-विषय।',
        noteEn: 'Opens the self-knowledge topic.',
      },
      {
        titleHi: 'भगवद्गीता 2.20',
        titleEn: 'Bhagavad Gita 2.20',
        href: '/scripture/bhagavadgita/chapter/2/verse/20',
        noteHi: 'गीता 2.20 का श्लोक पृष्ठ।',
        noteEn: 'Opens Gita 2.20.',
      },
    ],
  },
  {
    id: 'yoga-paths',
    titleHi: 'योग के पढ़ने के क्रम',
    titleEn: 'Yoga reading orders',
    blurbHi: 'कर्म, भक्ति और योग के पृष्ठ, और तीन पढ़ने के क्रम।',
    blurbEn: 'Karma, Bhakti, and Yoga pages, plus three reading orders.',
    links: [
      {
        titleHi: 'कर्म',
        titleEn: 'Karma',
        href: '/concepts/karma',
        noteHi: 'कर्म का अवधारणा पृष्ठ।',
        noteEn: 'Opens the Karma concept page.',
      },
      {
        titleHi: 'भक्ति',
        titleEn: 'Bhakti',
        href: '/concepts/bhakti',
        noteHi: 'भक्ति का अवधारणा पृष्ठ।',
        noteEn: 'Opens the Bhakti concept page.',
      },
      {
        titleHi: 'योग',
        titleEn: 'Yoga',
        href: '/concepts/yoga',
        noteHi: 'योग का अवधारणा पृष्ठ।',
        noteEn: 'Opens the Yoga concept page.',
      },
      {
        titleHi: 'कर्मयोग का क्रम',
        titleEn: 'Karma Yoga order',
        href: '/learn/plans/#plan-karma-yoga',
        noteHi: 'पढ़ने के क्रम पर कर्मयोग।',
        noteEn: 'Opens the Karma Yoga study order.',
      },
      {
        titleHi: 'भक्तियोग का क्रम',
        titleEn: 'Bhakti Yoga order',
        href: '/learn/plans/#plan-bhakti-yoga',
        noteHi: 'पढ़ने के क्रम पर भक्तियोग।',
        noteEn: 'Opens the Bhakti Yoga study order.',
      },
      {
        titleHi: 'ध्यान का क्रम',
        titleEn: 'Meditation order',
        href: '/learn/plans/#plan-meditation-journey',
        noteHi: 'पढ़ने के क्रम पर ध्यान की दिशा।',
        noteEn: 'Opens the meditation study order.',
      },
    ],
  },
  {
    id: 'vedanta-doors',
    titleHi: 'वेदान्त के पृष्ठ और गीता अध्याय 2',
    titleEn: 'Vedanta pages and Gita chapter 2',
    blurbHi: 'ब्रह्म, आत्मा, माया और मोक्ष के पृष्ठ। गीता के दूसरे अध्याय का पुस्तकालय शीर्षक सांख्ययोग है।',
    blurbEn: 'Brahman, Atman, Maya, and Moksha. The library title of Gita chapter 2 is Sankhya Yoga.',
    links: [
      {
        titleHi: 'ब्रह्म',
        titleEn: 'Brahman',
        href: '/concepts/brahman',
        noteHi: 'ब्रह्म का अवधारणा पृष्ठ।',
        noteEn: 'Opens the Brahman concept page.',
      },
      {
        titleHi: 'आत्मा',
        titleEn: 'Atman',
        href: '/concepts/atman',
        noteHi: 'आत्मा का अवधारणा पृष्ठ।',
        noteEn: 'Opens the Atman concept page.',
      },
      {
        titleHi: 'माया',
        titleEn: 'Maya',
        href: '/concepts/maya',
        noteHi: 'माया का अवधारणा पृष्ठ।',
        noteEn: 'Opens the Maya concept page.',
      },
      {
        titleHi: 'मोक्ष',
        titleEn: 'Moksha',
        href: '/concepts/moksha',
        noteHi: 'मोक्ष का अवधारणा पृष्ठ।',
        noteEn: 'Opens the Moksha concept page.',
      },
      {
        titleHi: 'गीता अध्याय 2',
        titleEn: 'Gita chapter 2',
        href: '/scripture/bhagavadgita/chapter/2',
        noteHi: 'अध्याय पृष्ठ। पुस्तकालय में शीर्षक सांख्ययोग है।',
        noteEn: 'Opens the chapter page titled Sankhya Yoga in this library.',
      },
    ],
  },
  {
    id: 'ramayana-and-mahabharata',
    titleHi: 'रामायण और महाभारत',
    titleEn: 'Ramayana and Mahabharata',
    blurbHi: 'दोनों ग्रंथों के पृष्ठ और उनकी कथा-कालरेखा। कथा-क्रम ऐतिहासिक दिनांक नहीं है।',
    blurbEn: 'Both scripture pages and their narrative timelines. A narrative order is not a historical date.',
    links: [
      {
        titleHi: 'रामायण',
        titleEn: 'Ramayana',
        href: '/scripture/ramayana',
        noteHi: 'रामायण का ग्रंथ पृष्ठ।',
        noteEn: 'Opens the Ramayana.',
      },
      {
        titleHi: 'रामायण कथा-क्रम',
        titleEn: 'Ramayana narrative',
        href: '/timelines/#ramayana-narrative',
        noteHi: 'कालरेखा पर कथा-क्रम।',
        noteEn: 'Opens the narrative timeline.',
      },
      {
        titleHi: 'महाभारत',
        titleEn: 'Mahabharata',
        href: '/scripture/mahabharata',
        noteHi: 'महाभारत का ग्रंथ पृष्ठ।',
        noteEn: 'Opens the Mahabharata.',
      },
      {
        titleHi: 'महाभारत कथा-क्रम',
        titleEn: 'Mahabharata narrative',
        href: '/timelines/#mahabharata-narrative',
        noteHi: 'कालरेखा पर कथा-क्रम।',
        noteEn: 'Opens the narrative timeline.',
      },
      {
        titleHi: 'भगवद्गीता',
        titleEn: 'Bhagavad Gita',
        href: '/scripture/bhagavadgita',
        noteHi: 'महाभारत के भीतर की गीता का ग्रंथ पृष्ठ।',
        noteEn: 'Opens the Bhagavad Gita.',
      },
    ],
  },
];
