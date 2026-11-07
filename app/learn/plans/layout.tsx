import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { READING_PLANS } from '@/data/reading-plans';
import { GUIDED_READING_PATHS } from '@/data/guided-reading-paths';
import { STUDY_PLANS, planMinutes } from '@/data/study-plans';
import { pageLd, readingListLd } from '@/lib/jsonld';

const TITLE = 'Scripture Reading Plans · स्वाध्याय योजनाएँ';
// /learn/paths/ (study orders and guided readings) was merged into this page.
const DESCRIPTION =
  'Calm scripture reading plans: the 18-Day Bhagavad Gita Immersion and 7-Day Sanatana Foundation, eleven short study orders, and guided readings by life question, theme and dilemma. Progress stays in this browser.';

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
    items: [
      ...READING_PLANS.map((p) => ({
        id: p.id,
        name: p.title,
        nameHi: p.titleHi,
        description: p.description,
        minutes: p.totalDays * p.dailyMinutes,
        parts: p.days.map((d) => ({ name: `Day ${d.dayNumber}: ${d.title}`, description: d.focusTheme })),
      })),
      ...STUDY_PLANS.map((plan) => ({
        id: plan.id,
        name: plan.titleEn,
        nameHi: plan.titleHi,
        description: plan.blurbEn,
        minutes: planMinutes(plan),
        parts: plan.steps.map((step) => ({ name: step.titleEn, description: step.noteEn })),
      })),
      ...GUIDED_READING_PATHS.map((p) => ({
        id: p.id,
        name: p.title,
        nameHi: p.titleHi,
        description: p.purpose,
        minutes: p.estimatedMinutes,
        teaches: p.coreInsight,
        prerequisites: p.prerequisites,
        parts: p.verses.map((v) => ({ name: `${v.title} (${v.scriptureId} ${v.chapter}.${v.verse})`, description: v.takeaway })),
      })),
    ],
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
