/**
 * Read-only canonical integrity baseline.
 *
 * Hashes only immutable identity/original-text fields and source citation
 * identity. Editorial fields (translation, commentary, science, applications,
 * review metadata) are deliberately excluded. Use --root to audit another
 * checkout without writing into it:
 *
 *   npx tsx scripts/canonical-snapshot.ts --root C:/path/to/repo
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

interface Verse {
  number?: number | string;
  sanskrit?: string;
  transliteration?: string;
}

interface ChapterFile {
  id?: string;
  chapter?: { number?: number | string; verses?: Verse[] };
  source?: { repo?: string; license?: string };
}

interface CanonicalVerse {
  scriptureId: string;
  chapterId: string;
  verseId: string;
  sanskrit: string;
  transliteration: string;
}

interface SnapshotFile {
  path: string;
  scriptureId: string;
  chapterId: string;
  verseCount: number;
  source: { repo: string; license: string };
  sha256: string;
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function hash(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function canonicalRecords(scriptureId: string, chapter: ChapterFile): CanonicalVerse[] {
  const chapterId = String(chapter.chapter?.number ?? '');
  return (chapter.chapter?.verses ?? []).map((verse) => ({
    scriptureId,
    chapterId,
    verseId: String(verse.number ?? ''),
    sanskrit: String(verse.sanskrit ?? ''),
    transliteration: String(verse.transliteration ?? ''),
  }));
}

function main(): void {
  const root = resolve(arg('--root') ?? process.cwd());
  const full = join(root, 'public', 'data', 'scriptures-full');
  if (!existsSync(full)) throw new Error(`Missing canonical data directory: ${full}`);

  const records: CanonicalVerse[] = [];
  const files: SnapshotFile[] = [];
  for (const scriptureId of readdirSync(full).sort()) {
    const scriptureDir = join(full, scriptureId);
    if (!statSync(scriptureDir).isDirectory()) continue;
    for (const name of readdirSync(scriptureDir).filter((x) => /^ch-\d+\.json$/.test(x)).sort()) {
      const file = join(scriptureDir, name);
      const parsed = JSON.parse(readFileSync(file, 'utf8')) as ChapterFile;
      const chapterRecords = canonicalRecords(scriptureId, parsed);
      records.push(...chapterRecords);
      const source = {
        repo: String(parsed.source?.repo ?? ''),
        license: String(parsed.source?.license ?? ''),
      };
      files.push({
        path: `public/data/scriptures-full/${scriptureId}/${name}`,
        scriptureId,
        chapterId: String(parsed.chapter?.number ?? ''),
        verseCount: chapterRecords.length,
        source,
        sha256: hash({ source, records: chapterRecords }),
      });
    }
  }

  records.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  files.sort((a, b) => a.path.localeCompare(b.path));
  const output = {
    format: 'dharma-granth-canonical-snapshot',
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceRoot: root,
    immutableFields: ['scriptureId', 'chapterId', 'verseId', 'sanskrit', 'transliteration', 'source.repo', 'source.license'],
    scriptureFiles: files.length,
    verses: records.length,
    sha256: hash({ files, records }),
    files,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main();
