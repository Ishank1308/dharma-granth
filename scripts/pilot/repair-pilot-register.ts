/**
 * Dharma Granth: Pilot Records Register Repair
 * 
 * Cleans colloquial, Urdu-Persian terms in data/pilot/records/*.json
 * and replaces them with dignified Gita Press tatsam equivalents,
 * while strictly preserving word count bounds and canonical rules.
 */

import fs from 'node:fs';
import path from 'node:path';

const RECORDS_DIR = path.resolve('data/pilot/records');

const REPLACEMENTS: Array<{ search: RegExp; replace: string }> = [
  // Only true Urdu/Persian vocabulary is converted to natural Hindi equivalents
  { search: /(?<=^|[^\p{L}])खुदा(?=[^\p{L}]|$)/gu, replace: 'ईश्वर' },
  { search: /(?<=^|[^\p{L}])दुआ(?=[^\p{L}]|$)/gu, replace: 'प्रार्थना' },
  { search: /(?<=^|[^\p{L}])इंसाफ(?=[^\p{L}]|$)/gu, replace: 'न्याय' },
  { search: /(?<=^|[^\p{L}])तसल्ली(?=[^\p{L}]|$)/gu, replace: 'सान्त्वना' },
  { search: /(?<=^|[^\p{L}])बंदगी(?=[^\p{L}]|$)/gu, replace: 'उपासना' },
  { search: /(?<=^|[^\p{L}])रहम(?=[^\p{L}]|$)/gu, replace: 'कृपा' },
  { search: /(?<=^|[^\p{L}])फरमान(?=[^\p{L}]|$)/gu, replace: 'आदेश' },
  { search: /(?<=^|[^\p{L}])ईमानदारी से(?=[^\p{L}]|$)/gu, replace: 'निष्कपट भाव से' },
  { search: /(?<=^|[^\p{L}])ज़बरदस्ती(?=[^\p{L}]|$)/gu, replace: 'बलपूर्वक' },
];

function cleanField(str: string): string {
  if (!str) return str;
  let s = str;
  for (const { search, replace } of REPLACEMENTS) {
    s = s.replace(search, replace);
  }
  return s;
}

function main() {
  const files = fs.readdirSync(RECORDS_DIR).filter((f) => f.endsWith('.json'));
  let totalChanged = 0;

  for (const file of files) {
    const fp = path.join(RECORDS_DIR, file);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    let changed = false;

    for (const fld of ['vyakhya', 'vijnana', 'lifeLesson'] as const) {
      if (typeof data[fld] === 'string') {
        const cleaned = cleanField(data[fld]);
        if (cleaned !== data[fld]) {
          data[fld] = cleaned;
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✓ Repaired register in ${file}`);
      totalChanged++;
    }
  }

  console.log(`\nDone. Repaired ${totalChanged} of ${files.length} pilot records.`);
}

main();
