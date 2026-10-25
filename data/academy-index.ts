/**
 * Academy doors. Course ids match data/learning-paths.ts.
 * Karma Yoga and Meditation are reading orders, because those courses are not separate.
 */

export interface AcademyCourse {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  titleHi: string;
  titleEn: string;
}

export const ACADEMY_LEVELS = [
  { id: 'beginner', hi: 'आरंभ', en: 'Beginner' },
  { id: 'intermediate', hi: 'मध्य', en: 'Intermediate' },
  { id: 'advanced', hi: 'आगे', en: 'Advanced' },
] as const;

export const ACADEMY_COURSES: AcademyCourse[] = [
  { id: 'beginner', level: 'beginner', titleHi: 'आरंभिक पाठ्यक्रम', titleEn: 'Beginner course' },
  { id: 'ramayana', level: 'beginner', titleHi: 'रामायण', titleEn: 'Ramayana' },
  { id: 'bhakti-traditions', level: 'beginner', titleHi: 'भक्ति पथ', titleEn: 'Bhakti Path' },
  { id: 'bhagavad-gita', level: 'intermediate', titleHi: 'गीता अध्ययन', titleEn: 'Gita Mastery' },
  { id: 'vedas-overview', level: 'intermediate', titleHi: 'वेद परिचय', titleEn: 'Vedas overview' },
  { id: 'mahabharata', level: 'intermediate', titleHi: 'महाभारत', titleEn: 'Mahabharata' },
  { id: 'upanishads', level: 'advanced', titleHi: 'उपनिषद्', titleEn: 'Upanishads' },
  { id: 'vedanta-foundations', level: 'advanced', titleHi: 'वेदान्त आधार', titleEn: 'Vedanta Foundations' },
];

export const ACADEMY_ORDERS = [
  { href: '/learn/plans/#plan-karma-yoga', titleHi: 'कर्मयोग', titleEn: 'Karma Yoga' },
  { href: '/learn/plans/#plan-meditation-journey', titleHi: 'ध्यान', titleEn: 'Meditation' },
];
