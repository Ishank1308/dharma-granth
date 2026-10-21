import fs from 'node:fs';
import path from 'node:path';
import { scriptureCatalog } from '../data/scripture-meta';

interface ChapterInfo {
  id: number;
  title: string;
  titleSanskrit?: string;
  verseCount: number;
}

interface Stats {
  realVerseCount: number;
  realChapterCount: number;
  realScriptureCount: number;
}

const ROOT = path.resolve(process.cwd(), 'public', 'data', 'scriptures-full');
const OUT = path.resolve(process.cwd(), 'public', 'data');

function readBookChapters(id: string): ChapterInfo[] {
  const bookDir = path.join(ROOT, id);
  const manifestPath = path.join(bookDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
    chapters?: Array<{
      number?: number | string;
      title?: string;
      titleSanskrit?: string;
      verseCount?: number;
    }>;
  };
  return (manifest.chapters ?? []).flatMap((chapter) => {
    const chapterId = typeof chapter.number === 'number' ? chapter.number : Number(chapter.number);
    if (!Number.isInteger(chapterId) || chapterId < 1) return [];
    return [{
      id: chapterId,
      title: chapter.title || `अध्याय ${chapterId}`,
      titleSanskrit: chapter.titleSanskrit,
      verseCount: chapter.verseCount ?? 0,
    }];
  });
}

function main(): void {
  const chapters: Record<string, ChapterInfo[]> = {};
  const stats: Stats = { realVerseCount: 0, realChapterCount: 0, realScriptureCount: 0 };

  for (const scripture of scriptureCatalog) {
    const chapterRows = readBookChapters(scripture.id);
    chapters[scripture.id] = chapterRows;
    const verseCount = chapterRows.reduce((sum, chapter) => sum + chapter.verseCount, 0);
    const realChapterCount = chapterRows.filter((chapter) => chapter.verseCount > 0).length;
    stats.realVerseCount += verseCount;
    stats.realChapterCount += realChapterCount;
    if (realChapterCount > 0) stats.realScriptureCount += 1;
  }

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'chapters.json'), `${JSON.stringify(chapters, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT, 'stats.json'), `${JSON.stringify(stats)}\n`);
  console.log(`Wrote chapter index for ${Object.keys(chapters).length} catalogued scriptures from published manifests.`);
  console.log(`Published counts: ${JSON.stringify(stats)}`);
}

main();
