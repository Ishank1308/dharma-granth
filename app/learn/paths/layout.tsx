import type { Metadata } from 'next';
import { JsonLd } from '@/app/components/JsonLd';
import { GUIDED_READING_PATHS } from '@/data/guided-reading-paths';
import { STUDY_PLANS, planMinutes } from '@/data/study-plans';
import { pageLd, readingListLd } from '@/lib/jsonld';

const TITLE = 'Guided Reading Paths · स्वाध्याय मार्ग';
const DESCRIPTION =
  'Eleven study orders of pages already on the site, then structured readings by life question, theme, and dilemma. Progress stays in this browser.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/learn/paths/' },
};

const PATHS_JSON_LD = pageLd(
  [
    { name: 'Learn', path: '/learn' },
    { name: 'Reading Paths', path: '/learn/paths' },
  ],
  readingListLd({
    path: '/learn/paths',
    name: 'Study orders and guided readings',
    description: DESCRIPTION,
    items: [
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

export default function GuidedPathsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={PATHS_JSON_LD} />
      {children}
    </>
  );
}
