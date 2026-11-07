/**
 * Adds drafted Hindi meanings (bhāvārtha) for the Brihadaranyaka to the review queue,
 * data/ai-commentary/brihadaranyaka.json, as status "pending". Nothing is published until a reviewer sets an
 * entry to "approved" (data/hi-commentary/_ai-queue.ts); each entry carries the mantra's Sanskrit, so a draft
 * whose mantra later changes is skipped as stale.
 *
 * The drafts replace the withdrawn Gita Press OCR Hindi (scripts/quarantine-brihadaranyaka-hindi.ts). They are
 * translated from the Sanskrit, checked against Max Müller's English (SBE 15), and name no ācārya.
 *
 *   npx tsx scripts/queue-brihadaranyaka-hindi.ts <drafts.json>   # {"1.1.1": "हिंदी भावार्थ…", …}
 *
 * Existing entries are never overwritten once a reviewer has approved or rejected them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { canonicalVerseId } from '../lib/canonical-verse-id';

const ROOT = process.cwd();
const FULL = path.join(ROOT, 'public/data/scriptures-full/brihadaranyaka.json');
const QUEUE = path.join(ROOT, 'data/ai-commentary/brihadaranyaka.json');
const input = process.argv[2];
if (!input) throw new Error('usage: queue-brihadaranyaka-hindi.ts <drafts.json>');

const drafts = JSON.parse(fs.readFileSync(input, 'utf8')) as Record<string, string>;
const book = JSON.parse(fs.readFileSync(FULL, 'utf8')) as {
  chapters: Array<{ number: number; verses: Array<{ number: string; sanskrit: string }> }>;
};
const byNumber = new Map<string, { key: string; sanskrit: string }>();
for (const ch of book.chapters) {
  for (const v of ch.verses) {
    byNumber.set(v.number, { key: `${ch.number}:${Number(canonicalVerseId(ch.number, v.number))}`, sanskrit: v.sanskrit });
  }
}

type Entry = { explanation: string; status: 'pending' | 'approved' | 'rejected'; sanskrit: string; mantra: string; basis: string };
const queue: Record<string, Entry> = fs.existsSync(QUEUE) ? JSON.parse(fs.readFileSync(QUEUE, 'utf8')) : {};
let added = 0;
let kept = 0;
for (const [mantra, text] of Object.entries(drafts)) {
  const target = byNumber.get(mantra);
  if (!target) throw new Error(`no mantra ${mantra} in the published text`);
  const hindi = text.replace(/\s+/g, ' ').trim();
  if (hindi.length < 20) throw new Error(`${mantra}: draft too short`);
  const prev = queue[target.key];
  if (prev && prev.status !== 'pending') {
    kept++;
    continue;
  }
  queue[target.key] = {
    explanation: hindi,
    status: 'pending',
    sanskrit: target.sanskrit,
    mantra,
    basis: 'Draft Hindi bhāvārtha from the Sanskrit, checked against Max Müller, SBE 15. Needs review.',
  };
  added++;
}
const sorted = Object.fromEntries(
  Object.entries(queue).sort(([a], [b]) => {
    const [ac, av] = a.split(':').map(Number);
    const [bc, bv] = b.split(':').map(Number);
    return ac - bc || av - bv;
  }),
);
fs.mkdirSync(path.dirname(QUEUE), { recursive: true });
fs.writeFileSync(QUEUE, JSON.stringify(sorted, null, 2) + '\n');
console.log(`queued ${added} pending draft(s); kept ${kept} reviewed; queue has ${Object.keys(sorted).length} of ${byNumber.size} mantras`);
