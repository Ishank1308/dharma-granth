/**
 * Dharma Granth: Clean Latin OCR remnants in printed Hindi meanings
 * 
 * Removes stray Latin OCR strings from `v.hindi` across the 9 affected scriptures in
 * public/data/scriptures-full/ while strictly preserving canonical Sanskrit fields.
 */

const fs = require('fs');
const path = require('path');

const DIR = path.resolve('public/data/scriptures-full');

function main() {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
  let totalFixedVerses = 0;
  let totalFixedFiles = 0;

  for (const f of files) {
    const fp = path.join(DIR, f);
    const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
    let fileChanged = false;

    for (const c of j.chapters || []) {
      for (const v of c.verses || []) {
        if (v.hindi && /[A-Za-z]{4,}/.test(v.hindi)) {
          v.hindi = v.hindi
            .replace(/[A-Za-z]+/g, '')
            .replace(/[ \t]{2,}/g, ' ')
            .replace(/\s+([,।॥?!])/g, '$1')
            .trim();
          fileChanged = true;
          totalFixedVerses++;
        }
      }
    }

    if (fileChanged) {
      fs.writeFileSync(fp, JSON.stringify(j), 'utf8');
      console.log(`✓ Cleaned Latin OCR artifacts in ${f}`);
      totalFixedFiles++;
    }
  }

  console.log(`\nDone. Cleaned ${totalFixedVerses} verses across ${totalFixedFiles} files.`);
}

main();
