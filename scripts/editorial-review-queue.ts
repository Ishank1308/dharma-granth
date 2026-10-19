/** Build a read-only, evidence-linked editorial review queue. */
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { ReviewQueueItem, ReviewReason } from '../lib/editorial-audit/types';

type Row = Record<string, unknown>;
type CommentaryMap = Record<string, Row>;

const arg = (name: string) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : undefined; };
const text = (v: unknown) => typeof v === 'string' ? v.trim() : '';
const has = (r: Row | undefined, keys: string[]) => !!r && keys.some((k) => text(r[k]).length > 0);
const load = (p: string): any => JSON.parse(readFileSync(p, 'utf8'));

function add(items: ReviewQueueItem[], row: Row, c: Row | undefined, reason: ReviewReason, priority: ReviewQueueItem['priority'], evidence: string, layer: ReviewQueueItem['layer'] = 'vyakhya'): void {
  const id = text(row.verseId) || `${text(row.scriptureId)}:${text(row.chapterId)}:${text(row.number)}`;
  if (!id) return;
  items.push({
    id: `review-${reason}-${id}`,
    canonicalRef: { scriptureId: text(row.scriptureId), chapterId: text(row.chapterId), verseId: id },
    layer, reason, priority, status: 'open', evidence, createdOn: new Date().toISOString(),
  });
}

function main(): void {
  const root = resolve(arg('--root') ?? process.cwd());
  const out = arg('--out');
  const full = join(root, 'public', 'data', 'scriptures-full');
  const hi = join(root, 'public', 'data', 'hi-commentary');
  const items: ReviewQueueItem[] = [];
  for (const scriptureId of readdirSync(full).sort()) {
    const dir = join(full, scriptureId);
    if (!statSync(dir).isDirectory()) continue;
    const commentary: CommentaryMap = existsSync(join(hi, `${scriptureId}.json`)) ? load(join(hi, `${scriptureId}.json`)) : {};
    for (const name of readdirSync(dir).filter((x) => /^ch-\d+\.json$/.test(x)).sort()) {
      const file = load(join(dir, name));
      for (const verse of (file.chapter?.verses ?? []) as Row[]) {
        const row = { ...verse, scriptureId, chapterId: `${scriptureId}:${file.chapter?.number ?? ''}` };
        const c = commentary[`${file.chapter?.number ?? ''}:${verse.number ?? ''}`];
        if (!has(row, ['lifeLesson']) && !has(c, ['lifeLesson'])) add(items, row, c, 'missing-layer', 'low', 'Modern application is not present.');
        if (!has(row, ['misreading', 'commonMisreading', 'misreadingGuard']) && !has(c, ['misreading', 'commonMisreading', 'misreadingGuard'])) add(items, row, c, 'missing-layer', 'medium', 'Misreading guard is not present.');
        const commentaryText = text(c?.commentary) || text(c?.explanation);
        const translation = text(verse.translation) || text(verse.english);
        if (commentaryText && /^sense\s*:/i.test(commentaryText)) add(items, row, c, 'possible-boilerplate', 'medium', 'Commentary begins with the repeated “Sense:” pattern.');
        if (commentaryText && translation && commentaryText === translation) add(items, row, c, 'possible-translation-copy', 'high', 'Commentary exactly matches the translation field.');
        if (!has(row, ['review', 'reviewedOn']) && !has(c, ['review', 'reviewedOn'])) add(items, row, c, 'source-missing', 'low', 'No explicit verse-level review metadata is recorded.');
      }
    }
  }
  const counts = Object.fromEntries([...new Set(items.map((x) => x.reason))].map((reason) => [reason, items.filter((x) => x.reason === reason).length]));
  const output = { format: 'dharma-granth-editorial-review-queue', version: 1, generatedAt: new Date().toISOString(), sourceRoot: root, counts, total: items.length, items, limitations: ['Queue entries are evidence-linked candidates for human review, not editorial decisions.', 'No canonical or editorial content is modified by this command.'] };
  const serialized = JSON.stringify(output, null, 2);
  if (out) writeFileSync(resolve(out), `${serialized}\n`, 'utf8'); else process.stdout.write(`${serialized}\n`);
}
main();
