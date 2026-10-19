/** Read-only coverage matrix for verse-level editorial layers. */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

type RawVerse = Record<string, unknown>;
type RawCommentary = Record<string, Record<string, unknown>>;

interface Counts {
  verses: number;
  artha: number;
  vyakhya: number;
  vigyana: number;
  application: number;
  misreadingGuard: number;
  wordMeaning: number;
  source: number;
  review: number;
  aiFlag: number;
}

const fields = {
  artha: ['meaning', 'translation', 'hindi'],
  vyakhya: ['explanation', 'commentary'],
  vigyana: ['science'],
  application: ['lifeLesson'],
  misreadingGuard: ['misreading', 'commonMisreading', 'misreadingGuard'],
  wordMeaning: ['wordMeaning'],
};

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function present(value: unknown): boolean {
  return typeof value === 'string' ? value.trim().length > 0 : value != null;
}

function hasAny(row: RawVerse, names: string[]): boolean {
  return names.some((name) => present(row[name]));
}

function loadJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

function empty(): Counts {
  return { verses: 0, artha: 0, vyakhya: 0, vigyana: 0, application: 0, misreadingGuard: 0, wordMeaning: 0, source: 0, review: 0, aiFlag: 0 };
}

function add(counts: Counts, row: RawVerse, sourcePresent: boolean, commentary?: RawVerse): void {
  counts.verses++;
  for (const [key, names] of Object.entries(fields)) {
    if (hasAny(row, names) || (commentary && hasAny(commentary, names))) counts[key as keyof Counts]++;
  }
  if (sourcePresent) counts.source++;
  if (present(row.review) || present(row.reviewedOn) || (commentary && (present(commentary.review) || present(commentary.reviewedOn)))) counts.review++;
  if (present(row.aiGenerated) || present(row.aiAssisted) || present(row.translationSource) || present(row.hindiSource) || (commentary && (present(commentary.aiGenerated) || present(commentary.aiAssisted)))) counts.aiFlag++;
}

function main(): void {
  const root = resolve(arg('--root') ?? process.cwd());
  const full = join(root, 'public', 'data', 'scriptures-full');
  const hi = join(root, 'public', 'data', 'hi-commentary');
  const byScripture = new Map<string, Counts>();
  const totals = empty();
  for (const scriptureId of readdirSync(full).sort()) {
    const dir = join(full, scriptureId);
    if (!statSync(dir).isDirectory()) continue;
    const commentaryPath = join(hi, `${scriptureId}.json`);
    const commentary = existsSync(commentaryPath) ? loadJson(commentaryPath) as RawCommentary : {};
    const counts = empty();
    for (const name of readdirSync(dir).filter((x) => /^ch-\d+\.json$/.test(x)).sort()) {
      const file = loadJson(join(dir, name)) as { chapter?: { number?: number | string; verses?: RawVerse[] }; source?: unknown };
      const sourcePresent = present((file.source as Record<string, unknown> | undefined)?.repo);
      for (const verse of file.chapter?.verses ?? []) {
        const key = `${file.chapter?.number ?? ''}:${verse.number ?? ''}`;
        add(counts, verse, sourcePresent, commentary[key]);
        add(totals, verse, sourcePresent, commentary[key]);
      }
    }
    byScripture.set(scriptureId, counts);
  }
  const percentage = (n: number, d: number) => d ? Number((n * 100 / d).toFixed(2)) : 0;
  const coverage = (c: Counts) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, { count: v, percent: percentage(v as number, c.verses) }]));
  const output = {
    format: 'dharma-granth-editorial-coverage',
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceRoot: root,
    fieldPolicy: fields,
    totals: { counts: totals, coverage: coverage(totals) },
    scriptures: Object.fromEntries([...byScripture.entries()].map(([id, c]) => [id, { counts: c, coverage: coverage(c) }])),
    limitations: [
      'Field presence is not a quality judgment.',
      'Traditional commentary is registered at scripture level, not counted as verse-level coverage.',
      'Modern application and misreading fields are absent unless a record explicitly carries one of the recognized keys.',
      'Review coverage counts explicit review/reviewedOn metadata only.',
    ],
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main();
