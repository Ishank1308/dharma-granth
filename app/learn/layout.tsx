import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Learn Hindu Scriptures — Flashcards, Timelines & Mind Maps',
  description:
    'Study Hindu scriptures with flashcards, slide decks, mind maps, quizzes and timelines covering the Vedas, Upanishads, Bhagavad Gita and the epics.',
  alternates: { canonical: '/learn/' },
  openGraph: {
    title: 'Learn Hindu Scriptures — Flashcards, Timelines & Mind Maps',
    description:
      'Study Hindu scriptures with flashcards, slide decks, mind maps, quizzes and timelines covering the Vedas, Upanishads, Bhagavad Gita and the epics.',
    url: '/learn/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
