import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllScriptures } from '@/data/scriptures';
import { readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { chapterParts } from '@/lib/chapter-parts';
import { ChapterView, chapterMetadata, type ChapterParams } from '../../chapter-view';

interface PageProps {
  params: Promise<ChapterParams & { part: string }>;
}

/** Parts 2…N of chapters too large for one page (lib/chapter-parts). */
export function generateStaticParams() {
  const params: Array<ChapterParams & { part: string }> = [];
  for (const meta of getAllScriptures()) {
    for (const n of readSeededChapterNumbers(meta.id)) {
      const parts = chapterParts(meta.id, n);
      for (const p of parts?.slice(1) ?? []) {
        params.push({ id: meta.id, chapterId: String(n), part: String(p.part) });
      }
    }
  }
  return params;
}

function partNumber(value: string): number | null {
  const n = Number.parseInt(value, 10);
  return String(n) === value && n >= 2 ? n : null;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const n = partNumber(params.part);
  return n ? chapterMetadata(params, n) : {};
}

export default async function ChapterPartPage(props: PageProps) {
  const params = await props.params;
  const n = partNumber(params.part);
  if (!n) return notFound();
  return <ChapterView params={params} part={n} />;
}
