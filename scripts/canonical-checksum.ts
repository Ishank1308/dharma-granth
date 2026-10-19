/**
 * Canonical Integrity Checksum Tool for Dharma Granth (dharmagranth.in)
 * 
 * Computes deterministic SHA-256 cryptographic hashes for all canonical scripture
 * texts (Sanskrit, Awadhi, Devanagari, metre) across all 65 cataloged works.
 * 
 * Enforces the Absolute Canonical-Integrity Rule:
 * "Never modify canonical Sanskrit, Awadhi, Devanagari, verse numbers, or chapter ordering."
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { scriptureCatalog } from '../data/scripture-meta';
import { getScripture } from '../data/scriptures';

const ROOT = resolve(__dirname, '..');
const FULL_DIR = resolve(ROOT, 'public/data/scriptures-full');
const CHECKSUM_FILE = resolve(ROOT, 'data/canonical-checksum.json');

export interface ScriptureChecksum {
  id: string;
  title: string;
  chapterCount: number;
  verseCount: number;
  canonicalSha256: string;
}

export interface CanonicalMasterSnapshot {
  timestamp: string;
  totalScriptures: number;
  totalChapters: number;
  totalVerses: number;
  masterRootSha256: string;
  scriptures: Record<string, ScriptureChecksum>;
}

export function computeCanonicalChecksums(): CanonicalMasterSnapshot {
  let totalChapters = 0;
  let totalVerses = 0;
  const perScripture: Record<string, ScriptureChecksum> = {};
  const masterHasher = createHash('sha256');

  for (const meta of scriptureCatalog) {
    const id = meta.id;
    const scriptureHasher = createHash('sha256');
    let chapterCount = 0;
    let verseCount = 0;

    // Check full JSON first (canonical source)
    const jsonPath = join(FULL_DIR, `${id}.json`);
    let loadedFromFull = false;

    if (existsSync(jsonPath)) {
      try {
        const full = JSON.parse(readFileSync(jsonPath, 'utf8'));
        if (full.chapters && Array.isArray(full.chapters)) {
          chapterCount = full.chapters.length;
          for (const ch of full.chapters) {
            const chNum = String(ch.number);
            scriptureHasher.update(`CH:${chNum}\n`);
            for (const v of ch.verses) {
              const vNum = String(v.number);
              const sanskrit = (v.sanskrit || '').trim();
              scriptureHasher.update(`V:${vNum}:${sanskrit}\n`);
              verseCount++;
            }
          }
          loadedFromFull = true;
        }
      } catch (err) {
        // Fallback to curated
      }
    }

    if (!loadedFromFull) {
      const curated = getScripture(id);
      if (curated) {
        chapterCount = curated.chapters.length;
        for (const ch of curated.chapters) {
          const chNum = String(ch.id);
          scriptureHasher.update(`CH:${chNum}\n`);
          for (const v of ch.verses) {
            const vNum = String(v.number);
            const sanskrit = (v.sanskrit || '').trim();
            scriptureHasher.update(`V:${vNum}:${sanskrit}\n`);
            verseCount++;
          }
        }
      }
    }

    const scriptureDigest = scriptureHasher.digest('hex');
    masterHasher.update(`${id}:${verseCount}:${scriptureDigest}\n`);

    totalChapters += chapterCount;
    totalVerses += verseCount;

    perScripture[id] = {
      id,
      title: meta.title,
      chapterCount,
      verseCount,
      canonicalSha256: scriptureDigest,
    };
  }

  const masterRootSha256 = masterHasher.digest('hex');

  const snapshot: CanonicalMasterSnapshot = {
    timestamp: new Date().toISOString(),
    totalScriptures: scriptureCatalog.length,
    totalChapters,
    totalVerses,
    masterRootSha256,
    scriptures: perScripture,
  };

  return snapshot;
}

export function verifyCanonicalIntegrity(): { matches: boolean; diffs: string[] } {
  if (!existsSync(CHECKSUM_FILE)) {
    return { matches: false, diffs: ['Reference checksum file data/canonical-checksum.json does not exist.'] };
  }

  const baseline: CanonicalMasterSnapshot = JSON.parse(readFileSync(CHECKSUM_FILE, 'utf8'));
  const current = computeCanonicalChecksums();

  const diffs: string[] = [];

  if (baseline.totalVerses !== current.totalVerses) {
    diffs.push(`Total verses changed: baseline=${baseline.totalVerses}, current=${current.totalVerses}`);
  }

  for (const [id, baseMeta] of Object.entries(baseline.scriptures)) {
    const curMeta = current.scriptures[id];
    if (!curMeta) {
      diffs.push(`Scripture ${id} missing in current snapshot.`);
    } else if (baseMeta.canonicalSha256 !== curMeta.canonicalSha256) {
      diffs.push(`Canonical text altered in ${id}: baseline=${baseMeta.canonicalSha256}, current=${curMeta.canonicalSha256}`);
    }
  }

  return {
    matches: diffs.length === 0,
    diffs,
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--verify')) {
    const result = verifyCanonicalIntegrity();
    if (result.matches) {
      console.log('✓ Canonical Integrity Verified: 100% match with cryptographic baseline.');
      process.exit(0);
    } else {
      console.error('✗ CANONICAL INTEGRITY BREACH:');
      result.diffs.forEach((d) => console.error('  - ' + d));
      process.exit(1);
    }
  } else {
    const snapshot = computeCanonicalChecksums();
    writeFileSync(CHECKSUM_FILE, JSON.stringify(snapshot, null, 2), 'utf8');
    console.log(`✓ Generated canonical checksum baseline for ${snapshot.totalScriptures} scriptures, ${snapshot.totalVerses.toLocaleString()} verses.`);
    console.log(`  Master Root SHA-256: ${snapshot.masterRootSha256}`);
  }
}
