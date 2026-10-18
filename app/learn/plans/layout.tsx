import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { READING_PLANS } from '@/data/reading-plans';
import { pageLd, readingListLd } from '@/lib/jsonld';

const TITLE = 'Scripture Reading Plans · स्वाध्याय योजनाएँ';
const DESCRIPTION =
  'Calm, structured, non-punitive scripture reading schedules. Explore the 18-Day Bhagavad Gita Immersion and 7-Day Sanatana Foundation at your own natural pace.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/learn/plans/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/learn/plans/',
    images: [DEFAULT_OG_IMAGE],
  },
};

const PLANS_JSON_LD = pageLd(
  [
    { name: 'Learn', path: '/learn' },
    { name: 'Reading Plans', path: '/learn/plans' },
  ],
  readingListLd({
    path: '/learn/plans',
    name: 'Scripture Reading Plans',
    description: DESCRIPTION,
    items: READING_PLANS.map((p) => ({
      id: p.id,
      name: p.title,
      nameHi: p.titleHi,
      description: p.description,
      minutes: p.totalDays * p.dailyMinutes,
      parts: p.days.map((d) => ({ name: `Day ${d.dayNumber}: ${d.title}`, description: d.focusTheme })),
    })),
  }),
);

export default function ReadingPlansLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={PLANS_JSON_LD} />
      {children}
    </>
  );
}
