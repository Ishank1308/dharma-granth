/**
 * Canonical-text integrity guard.
 *
 *   npx tsx scripts/check-canonical-integrity.ts            # verify against data/canonical-manifest.json
 *   npx tsx scripts/check-canonical-integrity.ts --update   # re-baseline after a REVIEWED canonical change
 *
 * Every chapter of every scripture in public/data/scriptures-full/<id>.json gets a SHA-256 over its canonical
 * fields only: each verse's number, Sanskrit and IAST transliteration, in order. Editorial fields (explanations,
 * life lessons, keywords, translations, commentary) are deliberately excluded, so adding or rewriting editorial
 * material never trips the guard, while any edit to a verse's Sanskrit, transliteration, number or position does.
 *
 * On a mismatch the script says which scripture, chapter and verse changed, and prints the previous and current
 * values by reading the baseline commit named in the manifest (git show <ref>:<file>). It never restores anything:
 * a human decides whether the new text is a correction (then run with --update) or damage (then revert it).
 *
 * Deliberate rebuilds of a scripture (a new edition, a fixed numbering) will fail this check until the manifest is
 * regenerated with --update in the same commit, which puts the change in front of a reviewer.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
// CANON_DATA_DIR lets the check run against another checkout's scripture files (for example a working tree under audit).
const DIR = process.env.CANON_DATA_DIR ? path.resolve(process.env.CANON_DATA_DIR) : path.join(ROOT, 'public/data/scriptures-full');
const MANIFEST = path.join(ROOT, 'data/canonical-manifest.json');

interface Verse {
  number?: number | string;
  sanskrit?: string;
  transliteration?: string;
}
interface Scripture {
  chapters?: { number: number; verses?: Verse[] }[];
}
interface Manifest {
  note: string;
  baselineRef: string;
  createdAt: string;
  /** scriptureId -> chapter number -> { sha, verses } */
  scriptures: Record<string, Record<string, { sha: string; verses: number }>>;
}

const norm = (s: unknown) => String(s ?? '').normalize('NFC');

function chapterHash(verses: Verse[]): string {
  const h = createHash('sha256');
  for (const v of verses) h.update(`${norm(v.number)}\u0001${norm(v.sanskrit)}\u0001${norm(v.transliteration)}\u0002`);
  return h.digest('hex');
}

function snapshot(): Manifest['scriptures'] {
  const out: Manifest['scriptures'] = {};
  for (const f of fs.readdirSync(DIR).sort()) {
    if (!f.endsWith('.json')) continue;
    const id = f.replace(/\.json$/, '');
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as Scripture;
    const chapters: Manifest['scriptures'][string] = {};
    for (const c of j.chapters ?? []) {
      const verses = c.verses ?? [];
      chapters[String(c.number)] = { sha: chapterHash(verses), verses: verses.length };
    }
    out[id] = chapters;
  }
  return out;
}

function gitShow(ref: string, file: string): Scripture | null {
  try {
    return JSON.parse(execSync(`git show ${ref}:${file}`, { cwd: ROOT, maxBuffer: 1 << 30, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })) as Scripture;
  } catch {
    return null;
  }
}

function currentRef(): string {
  return execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
}

function main() {
  const update = process.argv.includes('--update');
  const now = snapshot();

  if (update) {
    const manifest: Manifest = {
      note: 'SHA-256 of canonical fields (verse number, Sanskrit, IAST) per chapter. Regenerate only after a reviewed canonical change: npx tsx scripts/check-canonical-integrity.ts --update',
      baselineRef: currentRef(),
      createdAt: new Date().toISOString(),
      scriptures: now,
    };
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest));
    const chapters = Object.values(now).reduce((a, s) => a + Object.keys(s).length, 0);
    console.log(`wrote data/canonical-manifest.json: ${Object.keys(now).length} scriptures, ${chapters} chapters (baseline ${manifest.baselineRef.slice(0, 8)})`);
    return;
  }

  if (!fs.existsSync(MANIFEST)) {
    console.error('data/canonical-manifest.json is missing. Create it with: npx tsx scripts/check-canonical-integrity.ts --update');
    process.exit(1);
  }
  const base = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as Manifest;
  const problems: string[] = [];
  const baselineCache = new Map<string, Scripture | null>();

  const describe = (id: string, chapter: string): string[] => {
    const file = `public/data/scriptures-full/${id}.json`;
    if (!baselineCache.has(id)) baselineCache.set(id, gitShow(base.baselineRef, file));
    const before = baselineCache.get(id);
    const after = JSON.parse(fs.readFileSync(path.join(DIR, `${id}.json`), 'utf8')) as Scripture;
    const bv = before?.chapters?.find((c) => String(c.number) === chapter)?.verses ?? [];
    const av = after.chapters?.find((c) => String(c.number) === chapter)?.verses ?? [];
    const lines: string[] = [];
    const n = Math.max(bv.length, av.length);
    for (let i = 0; i < n && lines.length < 6; i++) {
      const b = bv[i];
      const a = av[i];
      if (!b || !a) {
        lines.push(`    position ${i + 1}: ${!b ? 'verse added' : 'verse removed'}`);
      } else if (norm(b.number) !== norm(a.number) || norm(b.sanskrit) !== norm(a.sanskrit) || norm(b.transliteration) !== norm(a.transliteration)) {
        const field = norm(b.number) !== norm(a.number) ? 'number' : norm(b.sanskrit) !== norm(a.sanskrit) ? 'sanskrit' : 'transliteration';
        lines.push(`    verse ${norm(a.number)} (${field})`);
        lines.push(`      was: ${norm(field === 'number' ? b.number : field === 'sanskrit' ? b.sanskrit : b.transliteration).slice(0, 110)}`);
        lines.push(`      now: ${norm(field === 'number' ? a.number : field === 'sanskrit' ? a.sanskrit : a.transliteration).slice(0, 110)}`);
      }
    }
    return lines.length ? lines : ['    (baseline commit not available locally; compare against the manifest checksum)'];
  };

  for (const [id, chapters] of Object.entries(base.scriptures)) {
    const cur = now[id];
    if (!cur) {
      problems.push(`${id}: scripture file is missing`);
      continue;
    }
    for (const [ch, want] of Object.entries(chapters)) {
      const got = cur[ch];
      if (!got) problems.push(`${id} chapter ${ch}: missing (was ${want.verses} verses)`);
      else if (got.sha !== want.sha) problems.push([`${id} chapter ${ch}: canonical text changed (${want.verses} -> ${got.verses} verses)`, ...describe(id, ch)].join('\n'));
    }
    for (const ch of Object.keys(cur)) if (!chapters[ch]) problems.push(`${id} chapter ${ch}: new chapter not in the manifest (run --update after review)`);
  }
  for (const id of Object.keys(now)) if (!base.scriptures[id]) problems.push(`${id}: new scripture not in the manifest (run --update after review)`);

  if (problems.length) {
    console.error(`Canonical integrity check FAILED (${problems.length} problem(s)), baseline ${base.baselineRef.slice(0, 8)}:\n`);
    for (const p of problems.slice(0, 40)) console.error(`  ${p}`);
    if (problems.length > 40) console.error(`  ... and ${problems.length - 40} more`);
    console.error('\nIf the change is a reviewed correction, re-baseline with --update in the same commit. Otherwise revert it.');
    process.exit(1);
  }
  const total = Object.values(base.scriptures).reduce((a, s) => a + Object.keys(s).length, 0);
  console.log(`✓ Canonical integrity check passed (${Object.keys(base.scriptures).length} scriptures, ${total} chapters match baseline ${base.baselineRef.slice(0, 8)})`);
}

main();
