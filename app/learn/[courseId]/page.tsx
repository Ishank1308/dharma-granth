import { clipDescription } from '@/lib/meta-text';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLearningPath, learningPaths } from '@/data/learning-paths';
import { JsonLd } from '@/app/components/JsonLd';
import { courseLd, pageLd } from '@/lib/jsonld';
import { CoursePageClient } from './CoursePageClient';

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export function generateStaticParams() {
  return learningPaths.map((path) => ({
    courseId: path.id,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const course = getLearningPath(params.courseId);
  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  return {
    title: `${course.title} — Learning Hub`,
    description: clipDescription(course.learningObjective),
    alternates: {
      canonical: `/learn/${course.id}/`,
    },
  };
}

export default async function CoursePage(props: PageProps) {
  const params = await props.params;
  const course = getLearningPath(params.courseId);

  if (!course) {
    notFound();
  }

  const path = `/learn/${course.id}`;
  return (
    <>
      <JsonLd
        data={pageLd(
          [
            { name: 'Learn', path: '/learn' },
            { name: course.title, path },
          ],
          courseLd({
            path,
            name: `${course.title} (${course.titleSanskrit})`,
            description: course.learningObjective,
            level: course.difficulty,
            minutes: course.estimatedMinutes,
            outcomes: course.overview.learningOutcomes,
            prerequisites: course.overview.prerequisites,
            lessons: course.lessons.map((l) => ({ title: l.title, description: l.description, minutes: l.estimatedMinutes })),
          }),
        )}
      />
      <CoursePageClient course={course} />
    </>
  );
}
