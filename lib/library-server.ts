import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { scriptureLastChanged } from '@/lib/content-dates';
import type { LibraryFacts } from '@/lib/library';

/** Build-time facts measured from the complete published chapter set. */
const DATA_DIR = join(process.cwd(), 'public', 'data');

const cache = new Map<string, LibraryFacts>();

function readJson<T>(path: string): T | undefined {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  } catch {
    return undefined;
  }
}

function firstShard(dir: string): string | undefined {
  if (!existsSync(dir)) return undefined;
  if (existsSync(join(dir, 'ch-1.json'))) return join(dir, 'ch-1.json');
  const shard = readdirSync(dir)
    .filter((f) => /^ch-\d+\.json$/.test(f))
    .sort((a, b) => parseInt(a.slice(3), 10) - parseInt(b.slice(3), 10))[0];
  return shard ? join(dir, shard) : undefined;
}

function hostOf(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

export function getLibraryFacts(id: string): LibraryFacts {
  const hit = cache.get(id);
  if (hit) return hit;

  const dir = join(DATA_DIR, 'scriptures-full', id);
  const manifest = readJson<{
    source?: { repo?: string; fetchedAt?: string };
    chapters?: Array<{ number?: number | string }>;
    languageCoverage?: { totalVerses?: number; sa?: number; hi?: number; en?: number };
  }>(join(dir, 'manifest.json'));

  type Verse = { sanskrit?: string; hindi?: string; translation?: string };
  const coverage = { totalVerses: 0, sa: 0, hi: 0, en: 0 };
  const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
  const savedCoverage = manifest?.languageCoverage;
  const validSavedCoverage =
    savedCoverage &&
    Number.isInteger(savedCoverage.totalVerses) && savedCoverage.totalVerses! >= 0 &&
    ['sa', 'hi', 'en'].every((key) => {
      const count = savedCoverage[key as 'sa' | 'hi' | 'en'];
      return Number.isInteger(count) && count! >= 0 && count! <= savedCoverage.totalVerses!;
    });

  if (validSavedCoverage) {
    coverage.totalVerses = savedCoverage.totalVerses!;
    coverage.sa = savedCoverage.sa!;
    coverage.hi = savedCoverage.hi!;
    coverage.en = savedCoverage.en!;
  } else {
    // Development checkouts may have manifests from before full coverage was
    // added. Measure the whole published text as a safe, cached fallback.
    const chapterNumbers = (manifest?.chapters ?? [])
      .map((chapter) => Number(chapter.number))
      .filter((chapter) => Number.isInteger(chapter) && chapter > 0);
    for (const chapterNumber of chapterNumbers) {
      const shard = readJson<{ chapter?: { verses?: Verse[] }; verses?: Verse[] }>(join(dir, `ch-${chapterNumber}.json`));
      const verses = shard?.chapter?.verses ?? shard?.verses ?? [];
      for (const verse of verses) {
        coverage.totalVerses += 1;
        if (hasText(verse.sanskrit)) coverage.sa += 1;
        if (hasText(verse.hindi)) coverage.hi += 1;
        if (hasText(verse.translation)) coverage.en += 1;
      }
    }
  }

  const updated = scriptureLastChanged(id);
  const facts: LibraryFacts = {
    languages: { sa: coverage.sa > 0, hi: coverage.hi > 0, en: coverage.en > 0 },
    languageCoverage: coverage,
    hindiCommentary: existsSync(join(DATA_DIR, 'hi-commentary', `${id}.json`)),
    sourceHost: hostOf(manifest?.source?.repo),
    sourceFetched: manifest?.source?.fetchedAt,
    lastUpdated: updated ? updated.toISOString() : undefined,
  };
  cache.set(id, facts);
  return facts;
}
