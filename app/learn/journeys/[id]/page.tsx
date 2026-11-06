import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { READING_JOURNEYS, getJourney, isJourneyIndexable } from '@/data/reading-journeys';
import { readSeededChapter } from '@/lib/read-seeded-chapters';
import { getScriptureMeta } from '@/data/scriptures';
import { clipDescription } from '@/lib/meta-text';
import { JourneyClient, type LessonView } from './JourneyClient';
import { readHref } from '@/lib/verse-paths';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return READING_JOURNEYS.map((j) => ({ id: j.id }));
}

/** Short objectives make thin search snippets, so add what each lesson contains. */
function journeyDescription(objective: string, minutesPerLesson: number): string {
  if (Array.from(objective).length >= 100) return objective;
  return clipDescription(`${objective} About ${minutesPerLesson} minutes a lesson, with context, explanation and reflection.`);
}

export function generateMetadata({ params }: PageProps): Metadata {
  const j = getJourney(params.id);
  return j
    ? {
        title: `${j.title} · ${j.titleHi}`,
        description: journeyDescription(j.objective, j.minutesPerLesson),
        alternates: { canonical: `/learn/journeys/${j.id}/` },
        robots: { index: isJourneyIndexable(j), follow: true },
      }
    : { title: 'Journey not found' };
}

export default function JourneyPage({ params }: PageProps) {
  const journey = getJourney(params.id);
  if (!journey) notFound();

  const lessons: LessonView[] = journey.lessons.map((l) => {
    const chapter = readSeededChapter(l.scriptureId, l.chapter);
    const verses = (chapter?.chapter.verses ?? []) as Array<{ number: number | string; sanskrit?: string; translation?: string; translationSource?: string }>;
    const v = verses.find((x) => String(x.number) === String(l.verse));
    return {
      ...l,
      reference: `${getScriptureMeta(l.scriptureId)?.title ?? l.scriptureId} ${l.chapter}.${l.verse}`,
      href: readHref(l.scriptureId, l.chapter, l.verse),
      sanskrit: v?.sanskrit ?? '',
      translation: v?.translation ?? '',
      translationIsAi: v?.translationSource === 'ai',
    };
  });

  return <JourneyClient journey={journey} lessons={lessons} />;
}
