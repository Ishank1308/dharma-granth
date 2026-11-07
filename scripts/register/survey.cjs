// Site-wide survey of the Hindi register, using the same word list as scripts/check-hindi-register.mjs.
// Areas: (1) UI source strings in app/ and lib/, (2) published commentary fields, (3) printed Hindi meanings.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync('scripts/check-hindi-register.mjs', 'utf8');
const WORDS = JSON.parse('[' + src.match(/const WORDS = \[([\s\S]*?)\];/)[1].replace(/,\s*$/, '') + ']');
const DEV = 'ऀ-ॿ';
const re = new RegExp(`(^|[^${DEV}])(${WORDS.join('|')})(ें|ों|ी|े|ा)?(?=$|[^${DEV}])`, 'gu');
const hits = (t) => [...(t || '').matchAll(re)].map((m) => m[2]);
const walk = (d, ext, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!/node_modules|\.next|dist/.test(e.name)) walk(p, ext, out); }
    else if (ext.test(e.name)) out.push(p);
  }
  return out;
};
// 1. UI
const ui = { files: 0, lines: 0, words: {} };
const uiFiles = [];
for (const f of [...walk('app', /\.(tsx?|jsx?)$/), ...walk('lib', /\.(tsx?|jsx?)$/)]) {
  const t = fs.readFileSync(f, 'utf8');
  let n = 0;
  for (const line of t.split('\n')) {
    const h = hits(line);
    if (h.length) { n++; for (const w of h) ui.words[w] = (ui.words[w] || 0) + 1; }
  }
  if (n) { ui.files++; ui.lines += n; uiFiles.push([f, n]); }
}
console.log('UI: files', ui.files, 'lines', ui.lines);
console.log('  top files', uiFiles.sort((a, b) => b[1] - a[1]).slice(0, 15).map((x) => x.join(':')).join('  '));
console.log('  top words', Object.entries(ui.words).sort((a, b) => b[1] - a[1]).slice(0, 25).map((x) => x.join(':')).join(' '));
// 2. Published commentary
const com = {};
for (const f of fs.readdirSync('public/data/hi-commentary')) {
  const d = JSON.parse(fs.readFileSync('public/data/hi-commentary/' + f, 'utf8'));
  const id = f.replace('.json', '');
  const c = (com[id] = { entries: Object.keys(d).length, explanation: 0, science: 0, lifeLesson: 0, aiExpl: 0 });
  for (const e of Object.values(d)) {
    if (e.explanationAi || e.ai) c.aiExpl++;
    for (const x of ['explanation', 'science', 'lifeLesson']) if (hits(e[x]).length) c[x]++;
  }
}
const tot = Object.values(com).reduce((a, c) => ({ e: a.e + c.entries, ex: a.ex + c.explanation, sc: a.sc + c.science, ll: a.ll + c.lifeLesson }), { e: 0, ex: 0, sc: 0, ll: 0 });
console.log('COMMENTARY: entries', tot.e, 'flagged explanation', tot.ex, 'science', tot.sc, 'lifeLesson', tot.ll);
console.log('  by scripture (explanation flagged / entries)', Object.entries(com).filter(([, c]) => c.explanation + c.lifeLesson + c.science).sort((a, b) => (b[1].explanation + b[1].lifeLesson) - (a[1].explanation + a[1].lifeLesson)).slice(0, 20).map(([id, c]) => `${id}:${c.explanation}/${c.lifeLesson}/${c.science}of${c.entries}`).join(' '));
// 3. Printed Hindi meanings
const pr = [];
for (const f of fs.readdirSync('public/data/scriptures-full').filter((x) => x.endsWith('.json'))) {
  let j;
  try { j = JSON.parse(fs.readFileSync('public/data/scriptures-full/' + f, 'utf8')); } catch { continue; }
  let n = 0, flagged = 0, latin = 0, src = '';
  for (const c of j.chapters || []) for (const v of c.verses || []) {
    if (!v.hindi) continue;
    n++;
    if (hits(v.hindi).length) flagged++;
    if (/[A-Za-z]{4,}/.test(v.hindi)) latin++;
  }
  if (n) pr.push([f.replace('.json', ''), n, flagged, latin]);
}
const pt = pr.reduce((a, r) => [a[0] + r[1], a[1] + r[2], a[2] + r[3]], [0, 0, 0]);
console.log('PRINTED HINDI: verses', pt[0], 'register-flagged', pt[1], 'latin', pt[2]);
console.log('  by scripture (flagged/total)', pr.sort((a, b) => b[2] - a[2]).slice(0, 20).map((r) => `${r[0]}:${r[2]}/${r[1]}`).join(' '));
