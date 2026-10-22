/**
 * Named reading lists. Each item opens a page already on the site.
 * Favorite verses stay empty until the reader saves one.
 */

export interface PlaylistLink {
  titleHi: string;
  titleEn: string;
  href: string;
}

export interface StudyPlaylist {
  id: string;
  titleHi: string;
  titleEn: string;
  noteHi: string;
  noteEn: string;
  links: PlaylistLink[];
}

export const STUDY_PLAYLISTS: StudyPlaylist[] = [
  {
    id: 'leadership',
    titleHi: 'नेतृत्व',
    titleEn: 'Leadership',
    noteHi: 'नेतृत्व का विषय, गीता ३.२१, और धर्म।',
    noteEn: 'Leadership topic, Gita 3.21, and Dharma.',
    links: [
      { titleHi: 'नेतृत्व और लोकसंग्रह', titleEn: 'Leadership', href: '/wisdom-for-life/leadership' },
      { titleHi: 'भगवद्गीता ३.२१', titleEn: 'Gita 3.21', href: '/scripture/bhagavadgita/chapter/3/verse/21' },
      { titleHi: 'धर्म', titleEn: 'Dharma', href: '/concepts/dharma' },
    ],
  },
  {
    id: 'meditation',
    titleHi: 'ध्यान',
    titleEn: 'Meditation',
    noteHi: 'योग, एकाग्रता, और ध्यान का पढ़ने का क्रम।',
    noteEn: 'Yoga, concentration, and the meditation reading order.',
    links: [
      { titleHi: 'योग', titleEn: 'Yoga', href: '/concepts/yoga' },
      { titleHi: 'एकाग्रता और ध्यान', titleEn: 'Concentration', href: '/wisdom-for-life/concentration' },
      { titleHi: 'ध्यान की दिशा', titleEn: 'Meditation order', href: '/learn/paths/#plan-meditation-journey' },
    ],
  },
  {
    id: 'relationships',
    titleHi: 'संबंध',
    titleEn: 'Relationships',
    noteHi: 'संबंध और परिवार के जीवन-विषय।',
    noteEn: 'The relationship and family topics.',
    links: [
      { titleHi: 'सम्बन्ध', titleEn: 'Relationships', href: '/wisdom-for-life/relationships' },
      { titleHi: 'परिवार', titleEn: 'Family', href: '/wisdom-for-life/family-responsibilities' },
    ],
  },
  {
    id: 'inner-peace',
    titleHi: 'भीतरी शांति',
    titleEn: 'Inner Peace',
    noteHi: 'तनाव, संतोष, और गीता २.१४।',
    noteEn: 'Stress, contentment, and Gita 2.14.',
    links: [
      { titleHi: 'तनाव और चिंता', titleEn: 'Stress', href: '/wisdom-for-life/stress-and-worry' },
      { titleHi: 'संतोष', titleEn: 'Contentment', href: '/wisdom-for-life/contentment' },
      { titleHi: 'भगवद्गीता २.१४', titleEn: 'Gita 2.14', href: '/scripture/bhagavadgita/chapter/2/verse/14' },
    ],
  },
  {
    id: 'favorite-verses',
    titleHi: 'चुने हुए श्लोक',
    titleEn: 'Favorite Verses',
    noteHi: 'यह सूची आपके सहेजे श्लोक हैं।',
    noteEn: 'This list is the verses you save.',
    links: [
      { titleHi: 'सहेजे पृष्ठ', titleEn: 'Saved pages', href: '/practice/bookmarks/' },
    ],
  },
  {
    id: 'daily-wisdom',
    titleHi: 'दैनिक वाणी',
    titleEn: 'Daily Wisdom',
    noteHi: 'आज का श्लोक और साधना।',
    noteEn: 'Today’s verse and the practice page.',
    links: [
      { titleHi: 'दैनिक पृष्ठ', titleEn: 'Daily page', href: '/daily' },
      { titleHi: 'साधना', titleEn: 'Practice', href: '/practice' },
    ],
  },
];
