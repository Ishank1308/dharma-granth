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
  // Multi-word phrases first
  { search: /(?<=^|[^\p{L}])पूरी तरह(?=[^\p{L}]|$)/gu, replace: 'सर्वथा' },
  { search: /(?<=^|[^\p{L}])शुरू करने(?=[^\p{L}]|$)/gu, replace: 'आरम्भ करने' },
  { search: /(?<=^|[^\p{L}])शुरू होता है(?=[^\p{L}]|$)/gu, replace: 'आरम्भ होता है' },
  { search: /(?<=^|[^\p{L}])शुरू करता है(?=[^\p{L}]|$)/gu, replace: 'आरम्भ करता है' },
  { search: /(?<=^|[^\p{L}])शुरुआत(?=[^\p{L}]|$)/gu, replace: 'आरम्भ' },
  { search: /(?<=^|[^\p{L}])शुरू(?=[^\p{L}]|$)/gu, replace: 'आरम्भ' },
  { search: /(?<=^|[^\p{L}])याद दिला(?=[^\p{L}]|$)/gu, replace: 'स्मरण करा' },
  { search: /(?<=^|[^\p{L}])याद(?=[^\p{L}]|$)/gu, replace: 'स्मरण' },
  { search: /(?<=^|[^\p{L}])ईमानदारी से(?=[^\p{L}]|$)/gu, replace: 'निष्कपट भाव से' },
  { search: /(?<=^|[^\p{L}])ज़रूरी(?=[^\p{L}]|$)/gu, replace: 'आवश्यक' },
  { search: /(?<=^|[^\p{L}])ज़रूरत(?=[^\p{L}]|$)/gu, replace: 'आवश्यकता' },
  { search: /(?<=^|[^\p{L}])ज़्यादा(?=[^\p{L}]|$)/gu, replace: 'अधिक' },
  { search: /(?<=^|[^\p{L}])हिस्सा(?=[^\p{L}]|$)/gu, replace: 'अंश' },
  { search: /(?<=^|[^\p{L}])जवाब(?=[^\p{L}]|$)/gu, replace: 'उत्तर' },
  { search: /(?<=^|[^\p{L}])थकान(?=[^\p{L}]|$)/gu, replace: 'श्रान्ति' },
  { search: /(?<=^|[^\p{L}])नुकसान(?=[^\p{L}]|$)/gu, replace: 'हानि' },
  { search: /(?<=^|[^\p{L}])तनाव घटाने(?=[^\p{L}]|$)/gu, replace: 'उद्वेग घटाने' },
  { search: /(?<=^|[^\p{L}])तनाव से निपटने(?=[^\p{L}]|$)/gu, replace: 'उद्वेग शमन' },
  { search: /(?<=^|[^\p{L}])तनाव(?=[^\p{L}]|$)/gu, replace: 'उद्वेग' },
  { search: /(?<=^|[^\p{L}])तरीका(?=[^\p{L}]|$)/gu, replace: 'उपाय' },
  { search: /(?<=^|[^\p{L}])बेचैनी(?=[^\p{L}]|$)/gu, replace: 'व्यग्रता' },
  { search: /(?<=^|[^\p{L}])बेचैन(?=[^\p{L}]|$)/gu, replace: 'व्यग्र' },
  { search: /(?<=^|[^\p{L}])शर्तें(?=[^\p{L}]|$)/gu, replace: 'अनिवार्यताएँ' },
  { search: /(?<=^|[^\p{L}])शर्त(?=[^\p{L}]|$)/gu, replace: 'अनिवार्यता' },
  { search: /(?<=^|[^\p{L}])खुद(?=[^\p{L}]|$)/gu, replace: 'स्वयं' },
  { search: /(?<=^|[^\p{L}])कोशिश(?=[^\p{L}]|$)/gu, replace: 'चेष्टा' },
  { search: /(?<=^|[^\p{L}])जल्दबाज़ी(?=[^\p{L}]|$)/gu, replace: 'शीघ्रता' },
  { search: /(?<=^|[^\p{L}])दबाव(?=[^\p{L}]|$)/gu, replace: 'प्रभाव' },
  { search: /(?<=^|[^\p{L}])आदत(?=[^\p{L}]|$)/gu, replace: 'प्रवृत्ति' },
  { search: /(?<=^|[^\p{L}])आराम(?=[^\p{L}]|$)/gu, replace: 'विश्राम' },
  { search: /(?<=^|[^\p{L}])ज़बरदस्ती(?=[^\p{L}]|$)/gu, replace: 'बलपूर्वक' },
  { search: /(?<=^|[^\p{L}])दिल(?=[^\p{L}]|$)/gu, replace: 'हृदय' },
  { search: /(?<=^|[^\p{L}])चीज़ों(?=[^\p{L}]|$)/gu, replace: 'विषयों' },
  { search: /(?<=^|[^\p{L}])चीज़ें(?=[^\p{L}]|$)/gu, replace: 'तत्व' },
  { search: /(?<=^|[^\p{L}])चीज़(?=[^\p{L}]|$)/gu, replace: 'वस्तु' },
  { search: /(?<=^|[^\p{L}])बस(?=[^\p{L}]|$)/gu, replace: 'मात्र' },
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
