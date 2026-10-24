// Finds gender-agreement slips left by word swaps (दुनिया→संसार, नुकसान→हानि, याद→स्मरण, वजह→कारण,
// कोशिश→प्रयास, कीमत→मूल्य, शुरुआत→आरम्भ, बस→केवल). usage: node agree.cjs [--json out.json]
const fs = require('fs');
const D = 'ऀ-ॿ';
const B = (s) => new RegExp(`(?<![${D}])(?:${s})(?![${D}])`, 'gu');
const FEM = 'की|पूरी|सारी|इसकी|उसकी|अपनी|बड़ी|छोटी|नई|असली|सच्ची|गहरी|पहली|भारी|कोई बड़ी|सबसे बड़ी';
const R = [
  ['fem+masc', B(`(?:${FEM}) (?:संसार|स्मरण|कारण|मूल्य|आरम्भ|प्रयास)`)],
  ['masc+हानि', B('(?:का|बड़ा|छोटा|भारी|पूरा|इसका|उसका|अपना|कोई बड़ा|सबसे बड़ा) हानि')],
  ['हानि+mverb', B('हानि (?:होता|हुआ|पहुँचा|पहुंचा|उठाया|हो गया)')],
  ['स्मरण+fverb', B('स्मरण (?:आती|आई|आए|आ जाती|दिलाती|रहती|रखनी)')],
  ['प्रयास+fverb', B('प्रयास (?:की[।,]|करनी|की जाती|की गई|की थी)')],
  ['मूल्य+fverb', B('मूल्य (?:चुकानी|चुकाई|पड़ती|लगती)')],
  ['कारण+fverb', B('कारण (?:बनती|होती है जो)')],
  ['केवल-वश', B('केवल में|केवल से बाहर|केवल चलता')],
  ['dots', /केवल\.\.\./gu],
];
const hits = [];
for (const f of fs.readdirSync('public/data/hi-commentary')) {
  const d = JSON.parse(fs.readFileSync('public/data/hi-commentary/' + f, 'utf8'));
  for (const [k, e] of Object.entries(d))
    for (const x of ['explanation', 'science', 'lifeLesson']) {
      const t = e[x];
      if (!t) continue;
      for (const [n, re] of R)
        for (const m of t.matchAll(re)) {
          hits.push({ id: f.replace('.json', ''), k, x, rule: n, match: m[0] });
          console.log(n, f.replace('.json', ''), k, x, '|', t.slice(Math.max(0, m.index - 30), m.index + m[0].length + 20).replace(/\n/g, ' '));
        }
    }
}
console.log('total', hits.length);
if (process.argv[2] === '--json') fs.writeFileSync(process.argv[3], JSON.stringify(hits, null, 2));
