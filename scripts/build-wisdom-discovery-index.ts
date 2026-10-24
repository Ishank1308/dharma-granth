/**
 * Regenerate the Wisdom Discovery static search artifact:
 *   npx tsx scripts/build-wisdom-discovery-index.ts
 * Reads data/*.ts (no network, no deps) and writes
 * public/wisdom-discovery-index.json (cache-friendly, long-lived).
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { wisdomSearchIndexJson, getWisdomSearchIndex } from '../lib/wisdom-discovery/search-index';

const out = join(process.cwd(), 'public', 'wisdom-discovery-index.json');
writeFileSync(out, `${wisdomSearchIndexJson()}\n`, 'utf8');
console.log(`wisdom-discovery: wrote ${getWisdomSearchIndex().length} entries to ${out}`);
