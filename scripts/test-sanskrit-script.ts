/**
 * Sanskrit shown in another Indian script (lib/sanskrit-script-view.ts): known verses in each
 * script, and the rule that nothing is added, dropped or left half-converted.
 * Run: npm run test:sanskrit-script
 */
import assert from 'node:assert/strict';
import { toScript } from '../lib/sanskrit-script-view';

const GITA_2_47 = 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ ४७ ॥';

const EXPECTED = {
  beng: 'কর্মণ্যেবাধিকারস্তে মা ফলেষু কদাচন । মা কর্মফলহেতুর্ভূর্মা তে সঙ্গোঽস্ত্বকর্মণি ॥ ৪৭ ॥',
  gujr: 'કર્મણ્યેવાધિકારસ્તે મા ફલેષુ કદાચન । મા કર્મફલહેતુર્ભૂર્મા તે સઙ્ગોઽસ્ત્વકર્મણિ ॥ ૪૭ ॥',
  orya: 'କର୍ମଣ୍ଯେଵାଧିକାରସ୍ତେ ମା ଫଲେଷୁ କଦାଚନ । ମା କର୍ମଫଲହେତୁର୍ଭୂର୍ମା ତେ ସଙ୍ଗୋଽସ୍ତ୍ଵକର୍ମଣି ॥ ୪୭ ॥',
  telu: 'కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన । మా కర్మఫలహేతుర్భూర్మా తే సఙ్గోఽస్త్వకర్మణి ॥ 47 ॥',
  knda: 'ಕರ್ಮಣ್ಯೇವಾಧಿಕಾರಸ್ತೇ ಮಾ ಫಲೇಷು ಕದಾಚನ । ಮಾ ಕರ್ಮಫಲಹೇತುರ್ಭೂರ್ಮಾ ತೇ ಸಙ್ಗೋಽಸ್ತ್ವಕರ್ಮಣಿ ॥ ೪೭ ॥',
  mlym: 'കർമണ്യേവാധികാരസ്തേ മാ ഫലേഷു കദാചന । മാ കർമഫലഹേതുർഭൂർമാ തേ സങ്ഗോഽസ്ത്വകർമണി ॥ 47 ॥',
} as const;

type Target = keyof typeof EXPECTED;
const SCRIPTS = Object.keys(EXPECTED) as Target[];

for (const script of SCRIPTS) {
  assert.equal(toScript(GITA_2_47, script), EXPECTED[script], `Gita 2.47 in ${script}`);
}

// Each script's own conventions.
assert.equal(toScript('ॐ तत् सत्', 'beng'), 'ওঁ তৎ সৎ', 'Bengali: khanda ta at the end of a word');
assert.equal(toScript('देवः', 'beng'), 'দেবঃ', 'Bengali: va is written ব');
assert.equal(toScript('ॐ', 'gujr'), 'ૐ');
assert.equal(toScript('ॐ', 'telu'), 'ఓం');
assert.equal(toScript('तस्मिन् कार्यं सर्वान् पुनर् धर्मः', 'mlym'), 'തസ്മിൻ കാര്യം സർവാൻ പുനർ ധർമഃ', 'Malayalam: chillus, and ര്യ kept');
assert.equal(toScript('गौः', 'mlym'), 'ഗൗഃ', 'Malayalam: the modern au sign');
assert.equal(toScript('अन्तः', 'mlym'), 'അന്തഃ', 'Malayalam: a conjunct inside a word is not a chillu');
assert.equal(toScript('बड़े', 'knda'), 'ಬಡ಼ೇ', 'Kannada keeps the nukta of Awadhi ड़');
assert.equal(toScript('बड़े', 'telu'), 'బడే', 'Telugu has no nukta');

// Vedic accents, dandas and anything outside Devanagari pass through untouched.
assert.equal(toScript('अ॒ग्निमी॑ळे', 'telu'), 'అ॒గ్నిమీ॑ళే');
assert.equal(toScript('Gita 2.47 । ॥', 'knda'), 'Gita 2.47 । ॥');

// Nothing is dropped and nothing is left half-converted: one output character per input
// character (apart from the known one-to-two and two-to-one cases above), and no Devanagari
// letter or vowel sign survives in ordinary Sanskrit.
const PLAIN = 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥ ऋषिः पितॄन् कॢप्तः दुःखं गौः अँ ऽ';
for (const script of SCRIPTS) {
  const out = toScript(PLAIN, script);
  assert.doesNotMatch(out, /[ऀ-ॣ०-ॿ]/, `${script}: Devanagari left in the output`);
  assert.equal(out.split(/\s+/).length, PLAIN.split(/\s+/).length, `${script}: word count`);
  if (script !== 'mlym' && script !== 'beng') assert.equal([...out].length, [...PLAIN].length, `${script}: length`);
}

console.log(`Sanskrit script view: ${SCRIPTS.length} scripts pass.`);
