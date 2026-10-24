// Flags Vivekchudamani verses whose printed Hindi may not belong to the verse: the Hindi uses tatsam words,
// so a matching meaning shares many 3-character Devanagari stems with the Sanskrit. Lists the lowest scores.
const fs = require('fs');
const j = JSON.parse(fs.readFileSync('public/data/scriptures-full/vivekchudamani.json', 'utf8'));
const vs = j.chapters[0].verses;
const grams = (s) => {
  const t = s.replace(/[^ऀ-ॿ]/g, ' ').replace(/[ािीुूृेैोौंःँ्]/g, '');
  const g = new Set();
  for (const w of t.split(/\s+/)) for (let i = 0; i + 3 <= w.length; i++) g.add(w.slice(i, i + 3));
  return g;
};
const rows = [];
for (const v of vs) {
  const a = grams(v.sanskrit), b = grams(v.hindi || '');
  let hit = 0;
  for (const x of a) if (b.has(x)) hit++;
  const score = a.size ? hit / a.size : 0;
  // Also: does the Hindi match a different verse's Sanskrit better?
  let best = { n: v.number, s: score };
  for (const w of vs) {
    if (w === v) continue;
    const c = grams(w.sanskrit);
    let h = 0;
    for (const x of c) if (b.has(x)) h++;
    const s = c.size ? h / c.size : 0;
    if (s > best.s + 0.1) best = { n: w.number, s };
  }
  rows.push({ n: v.number, score: +score.toFixed(2), better: best.n !== v.number ? `${best.n}(${best.s.toFixed(2)})` : '' });
}
const lim = +(process.argv[2] || 0.12);
for (const r of rows.filter((r) => r.score < lim || r.better).sort((a, b) => a.score - b.score)) console.log(r.n, r.score, r.better);
