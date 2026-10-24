/**
 * Dharma Granth: Generate Hindi Commentary Drafts with Muse Spark 1.3
 * 
 * Generates verified, high-register tatsam Hindi व्याख्या with the 4-layer
 * modern context framework directly into the review queue (data/ai-commentary/).
 * 
 * Usage:
 *   npx tsx scripts/generate-commentary-musespark.ts --scripture bhagavadgita --chapter 2 --verses 1-5
 *   npx tsx scripts/generate-commentary-musespark.ts --scripture ishavasya --chapter 1 --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { MuseSparkClient } from '../lib/muse-spark';
import { scriptureCatalog } from '../data/scripture-meta';

function loadEnvLocal() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

loadEnvLocal();

interface QueuedCommentary {
  explanation: string;
  science: string;
  lifeLesson: string;
  confidence: 'high' | 'medium' | 'low';
  reviewNote: string;
  status: 'pending' | 'approved' | 'rejected';
  model: string;
  generatedAt: string;
  sanskrit: string;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i === -1 ? undefined : args[i + 1];
  };

  const scripture = get('--scripture');
  const chapter = Number(get('--chapter'));
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');

  if (!scripture || !Number.isInteger(chapter) || chapter < 1) {
    console.error('Usage: --scripture <id> --chapter <n> [--verses 1-5] [--dry-run] [--force]');
    process.exit(1);
  }

  let verses: Set<number> | null = null;
  const spec = get('--verses');
  if (spec) {
    verses = new Set();
    for (const part of spec.split(',')) {
      const [a, b] = part.split('-').map(Number);
      for (let n = a; n <= (b || a); n++) verses.add(n);
    }
  }

  return { scripture, chapter, verses, dryRun, force };
}

async function main() {
  const { scripture, chapter, verses, dryRun, force } = parseArgs();

  const meta = scriptureCatalog.find((s) => s.id === scripture);
  if (!meta) {
    console.error(`Unknown scripture: ${scripture}`);
    process.exit(1);
  }

  const client = new MuseSparkClient();
  if (!client.isConfigured && !dryRun) {
    console.error('❌ Muse Spark API key not found in .env.local (MUSE_SPARK_API_KEY).');
    process.exit(1);
  }

  const fullPath = path.resolve(`public/data/scriptures-full/${scripture}.json`);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    process.exit(1);
  }

  const fullData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const chapData = fullData.chapters?.find((c: any) => Number(c.number || c.id) === chapter);
  if (!chapData || !chapData.verses?.length) {
    console.error(`Chapter ${chapter} not found or empty in ${scripture}.json`);
    process.exit(1);
  }

  const queuePath = path.resolve(`data/ai-commentary/${scripture}.json`);
  let queue: Record<string, QueuedCommentary> = {};
  if (fs.existsSync(queuePath)) {
    try {
      queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    } catch {
      queue = {};
    }
  }

  console.log(`\n=== Drafting Commentary with Muse Spark 1.3 ===`);
  console.log(`Scripture: ${meta.title} (${scripture}) | Chapter: ${chapter}`);
  console.log(`Total verses in chapter: ${chapData.verses.length}`);
  if (dryRun) console.log(`[DRY RUN MODE: No API calls will be made]`);
  console.log('--------------------------------------------------\n');

  for (const v of chapData.verses) {
    const vNum = Number(v.number || v.verseNumber);
    if (verses && !verses.has(vNum)) continue;

    const key = `${chapter}:${vNum}`;
    if (queue[key] && !force) {
      console.log(`- Verse ${key} already exists in queue. Skipping (use --force to overwrite).`);
      continue;
    }

    console.log(`Generating draft for ${scripture} ${key}...`);

    if (dryRun) {
      console.log(`  Sanskrit: ${(v.sanskrit || '').slice(0, 60)}...`);
      console.log(`  Dry run complete for ${key}.`);
      break;
    }

    try {
      const draft = await client.draftVerseCommentary({
        scriptureName: meta.title,
        chapterNumber: chapter,
        verseNumber: vNum,
        sanskrit: v.sanskrit,
        hindi: v.hindi,
        translation: v.translation,
      });

      queue[key] = {
        explanation: draft.explanation,
        science: draft.science,
        lifeLesson: draft.lifeLesson,
        confidence: 'high',
        reviewNote: 'Generated via Muse Spark 1.3 Contributor (Gita Press dignified tatsam Hindi standard)',
        status: 'pending',
        model: 'muse-spark-1.3-contributor',
        generatedAt: new Date().toISOString(),
        sanskrit: v.sanskrit || '',
      };

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
      console.log(`  ✓ Saved ${key} to ${queuePath}`);
    } catch (err: any) {
      console.error(`  ❌ Failed to generate for ${key}:`, err?.message || err);
    }
  }

  console.log('\nProcess finished. Review drafts in data/ai-commentary/ and run:');
  console.log('  npm run publish:commentary\n');
}

main();
