import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import Link from 'next/link';
import { timelines } from '@/data/timelines';
import { StoryClient } from './StoryClient';

const STORY_HOMES: Record<string, { href: string; hi: string }> = {
  'ramayana-narrative': { href: '/scripture/ramayana', hi: 'रामायण' },
  'mahabharata-narrative': { href: '/scripture/mahabharata', hi: 'महाभारत' },
};

export const metadata: Metadata = {
  title: 'Visual Story Mode · कथा-दर्शन',
  description: 'Follow the Ramayana and Mahabharata through characters, relationships, events, dialogue and decision points, each labelled by what it is.',
  alternates: { canonical: '/story/' },
  openGraph: {
    title: 'Visual Story Mode · कथा-दर्शन',
    description:
      'Follow the Ramayana and Mahabharata through characters, relationships, events, dialogue and decision points, each labelled by what it is.',
    url: '/story/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function StoryPage() {
  const narratives = timelines.filter((timeline) => timeline.type === 'narrative');
  return (
    <>
      <section aria-labelledby="katha-kram" className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <h2 id="katha-kram" className="font-serif text-2xl font-bold text-dharma-text">
          <span lang="hi" className="font-devanagari">कथा-क्रम</span>
        </h2>
        <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
          ये वही कालरेखाएँ हैं जो पहले से दर्ज हैं। नया प्रसंग नहीं जोड़ा गया। आधुनिक अर्थ अलग से नहीं लिखा गया।
        </p>
        <ul className="mt-3 space-y-2">
          {narratives.map((timeline) => {
            const home = STORY_HOMES[timeline.id];
            return (
              <li key={timeline.id} className="text-sm">
                <Link href={`/timelines/#${timeline.id}`} className="font-semibold text-saffron-600 underline underline-offset-2">
                  {timeline.title}
                </Link>
                {home && (
                  <>
                    <span className="text-dharma-text-secondary"> · </span>
                    <Link href={home.href} className="font-semibold text-saffron-600 underline underline-offset-2">{home.hi}</Link>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <StoryClient />
    </>
  );
}
