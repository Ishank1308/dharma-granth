const fs = require('fs');
const content = fs.readFileSync('data/scriptures/chandogya.ts', 'utf8');

// Let's check duplicates in chapters 1-7 vs chapters 8-154
const verseMatches = [...content.matchAll(/id:\s*(\d+),\s*\n\s*sanskrit:\s*['"]([^'"]+)['"]/g)];
console.log(`Total verses in chandogya.ts: ${verseMatches.length}`);

// Let's filter out the 1010x, 1020x, 1030x, 1040x, 1050x, 1060x, 1070x in chapters 1-7
// Let's check what IDs are in chapters 1-7
const badAppendedIds = new Set([
  10102, 10105, 10109,
  10202, 10203, 10205, 10209, 10210,
  10302, 10303, 10305, 10309, 10310,
  10402, 10403, 10405,
  10502, 10503, 10505,
  10601, 10602, 10603,
  10701, 10709
]);

const cleanedVerses = verseMatches.filter(m => !badAppendedIds.has(parseInt(m[1])));
console.log(`Verses after filtering bad appended IDs: ${cleanedVerses.length}`);

const seen = new Map();
const remainingDups = [];
for (const v of cleanedVerses) {
  const id = parseInt(v[1]);
  const s = v[2].trim().replace(/[\s\u200B-\u200D।॥]/g, '');
  if (seen.has(s)) {
    remainingDups.push({ firstId: seen.get(s), dupId: id, snippet: v[2].slice(0, 40) });
  } else {
    seen.set(s, id);
  }
}

console.log(`Remaining duplicates after removing appended blocks in ch 1-7: ${remainingDups.length}`);
remainingDups.forEach(d => {
  console.log(`  firstId: ${d.firstId} vs dupId: ${d.dupId}: ${d.snippet}`);
});
