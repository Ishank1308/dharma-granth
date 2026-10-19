import { Metadata } from 'next';
import { scriptureCatalog } from '@/data/scripture-meta';
import { StudyClient } from './StudyClient';

export const metadata: Metadata = {
  title: 'स्वाध्याय केंद्र · Personal Study Sanctuary | Dharma Granth',
  description:
    'Your 100% private, local-first personal study dashboard. Offline reading packs, reflections journal, saved verses, smart collections, and data sovereignty.',
  alternates: {
    canonical: 'https://dharmagranth.in/study',
  },
};

const titles = Object.fromEntries(
  scriptureCatalog.map((scripture) => [scripture.id, scripture.title])
);

export default function StudyPage() {
  return <StudyClient titles={titles} />;
}
