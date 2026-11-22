'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Clock, Compass, Flame, GraduationCap, Library } from 'lucide-react';
import { Bento, BentoCell, Bi } from '@/app/components/bento/Bento';
import { learningPaths, type LearningPath, type LearningPathLesson } from '@/data/learning-paths';
import type { PathwayProgress } from '@/lib/useStudyProgress';

/**
 * The opening of /learn/: one large tile for the reader's next step beside the three ways to
 * study, then two quiet reference links.
 *
 * The lead tile is "Find your starting point" in the exported HTML and for a first visit. Once
 * saved progress has been read (this device only), it becomes the path the reader is on, with
 * the next lesson. Both states fit the tile's fixed height, so nothing below moves.
 */

const WAYS = [
  { tile: 'tall', href: '/learn/journeys/', en: 'Guided journeys', hi: 'स्वाध्याय यात्राएँ', sub: 'Daily lessons with a reflection', Icon: Flame, chip: '#b45309' },
  { tile: undefined, href: '/wisdom-pathways/', en: 'Wisdom pathways', hi: 'ज्ञान मार्ग', sub: 'Begin from fear, anger, grief or purpose', Icon: Compass, chip: '#15803d' },
  { tile: undefined, href: '/learn/plans/', en: 'Reading plans', hi: 'स्वाध्याय योजना', sub: 'Day-by-day schedules and study orders', Icon: Clock, chip: '#1f4e8c' },
] as const;

const REFERENCE = [
  { href: '/learn/faq/', en: 'Scripture FAQs', hi: 'जिज्ञासा समाधान', sub: 'Canon, schools of thought and ethics', Icon: GraduationCap, chip: '#6b3fa0' },
  { href: '/sources/', en: 'Sources and editions', hi: 'स्रोत पारदर्शिता', sub: 'Critical editions, recensions and method', Icon: Library, chip: '#57534e' },
];

interface NextStep {
  course: LearningPath;
  done: number;
  lesson: LearningPathLesson;
}

/** The unfinished path started most recently, with its first unread lesson. */
function pathInProgress(getPathwayProgress: (id: string) => PathwayProgress | undefined): NextStep | null {
  let found: NextStep | null = null;
  let latest = '';
  for (const course of learningPaths) {
    const saved = getPathwayProgress(course.id);
    const steps = saved?.completedSteps ?? [];
    const lesson = course.lessons.find((l) => !steps.includes(l.id));
    if (!saved || steps.length === 0 || !lesson) continue;
    const started = saved.startedAt ?? '';
    if (!found || started > latest) {
      found = { course, done: course.lessons.filter((l) => steps.includes(l.id)).length, lesson };
      latest = started;
    }
  }
  return found;
}

export function LearnOpening({
  getPathwayProgress,
}: {
  getPathwayProgress: (id: string) => PathwayProgress | undefined;
}) {
  const next = pathInProgress(getPathwayProgress);

  return (
    <section aria-labelledby="learn-start-heading" className="mx-auto max-w-content px-gutter pt-10">
      <h2 id="learn-start-heading" className="sr-only">Where to begin</h2>
      <Bento>
        <BentoCell tile="lead">
          <div
            className="apple-card bento-tile bento-lead"
            data-learn-lead={next ? 'continue' : 'start'}
            style={{ '--chip': '#c2410c', '--bento-lead-min': '19rem' } as CSSProperties}
          >
            {next ? (
              <>
                <p className="bento-kicker"><Bi en="Continue" hi="जारी रखें" /></p>
                <div className="min-w-0">
                  <span lang="sa" className="block text-subhead leading-snug text-dharma-saffron">{next.course.titleSanskrit}</span>
                  <h3 className="text-title-3 font-semibold leading-tight text-dharma-text [overflow-wrap:anywhere] sm:text-title-2">
                    <Link href={`/learn/${next.course.id}/`} className="bento-link">{next.course.title}</Link>
                  </h3>
                </div>
                <p className="text-subhead leading-snug text-dharma-muted">
                  <span className="tabular-nums">Lesson {next.lesson.order} of {next.course.lessons.length}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{next.lesson.title}</span>
                </p>
                <div
                  role="progressbar"
                  aria-label="Your progress on this path"
                  aria-valuemin={0}
                  aria-valuemax={next.course.lessons.length}
                  aria-valuenow={next.done}
                  aria-valuetext={`${next.done} of ${next.course.lessons.length} lessons read`}
                  className="h-1.5 max-w-xs overflow-hidden rounded-full bg-dharma-text/10"
                >
                  <span
                    className="block h-full origin-left rounded-full bg-dharma-saffron"
                    style={{ transform: `scaleX(${next.done / next.course.lessons.length})` }}
                  />
                </div>
                <div className="bento-actions">
                  <span className="apple-pill" aria-hidden="true">Continue</span>
                  <Link href="/learn/start/" className="bento-aside">
                    <span>Other ways to begin</span>&nbsp;<span aria-hidden="true">›</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="bento-kicker"><Bi en="Your next step" hi="अगला चरण" /></p>
                <h3 className="max-w-[16ch] text-title-2 font-semibold leading-tight text-dharma-text">
                  <Link href="/learn/start/" className="bento-link">
                    <span>Find your starting point</span>{' '}
                    <span lang="hi" className="mt-1 block font-devanagari text-title-3 font-normal text-dharma-muted">आरम्भ</span>
                  </Link>
                </h3>
                <p className="max-w-[34ch] text-subhead leading-snug text-dharma-muted">
                  Five short questions, one calm first step. Nothing to sign up for.
                </p>
                <div className="bento-actions">
                  <span className="apple-pill" aria-hidden="true">Begin</span>
                  <Link href="#courses" className="bento-aside">
                    <span>Browse all paths</span>&nbsp;<span aria-hidden="true">›</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </BentoCell>

        {WAYS.map(({ tile, href, en, hi, sub, Icon, chip }) => (
          <BentoCell key={href} tile={tile}>
            <Link href={href} style={{ '--chip': chip } as CSSProperties} className="apple-card bento-tile">
              <span className="apple-tint-chip" aria-hidden="true">
                <Icon className="h-4 w-4" />
              </span>
              <span className="mt-auto min-w-0 pt-2">
                <span className="block text-subhead font-semibold leading-snug tracking-[-0.02em] text-dharma-text sm:text-body">{en}</span>{' '}
                <span lang="hi" className="block font-devanagari text-footnote text-dharma-muted">{hi}</span>{' '}
                <span className={`mt-1 text-[14px] leading-snug text-dharma-muted ${tile === 'tall' ? 'block' : 'hidden sm:block'}`}>{sub}</span>
              </span>
            </Link>
          </BentoCell>
        ))}
      </Bento>

      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-4 md:gap-4">
        {REFERENCE.map(({ href, en, hi, sub, Icon, chip }) => (
          <li key={href}>
            <Link href={href} style={{ '--chip': chip } as CSSProperties} className="apple-card flex min-h-[60px] items-center gap-3 px-4 py-3">
              <span className="apple-tint-chip" aria-hidden="true">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-subhead font-semibold tracking-[-0.01em] text-dharma-text">{en}</span>{' '}
                <span lang="hi" className="block font-devanagari text-footnote text-dharma-muted">{hi}</span>{' '}
                <span className="mt-0.5 hidden text-footnote text-dharma-muted sm:block">{sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
