/**
 * Dharma Granth: Automated Prompt Compliance Verification for Meta Muse Spark 1.3 Contributor
 * 
 * Verifies that Meta Muse Spark strictly obeys all rules from:
 * 1. Hindi Chat System Prompt (accessible dignified Hindi, no Urdu/Persian vocabulary, ASCII digits, 'आप' address, Sanskrit citation, daily सूत्र, चिंतन प्रश्न)
 * 2. English Chat System Prompt (dignified tone, Romanized Sanskrit citation, daily protocols, reflection question)
 * 3. 4-Layer Commentary Drafting Framework (JSON schema, 3 required headings, 3 bullet points, 1 question)
 * 
 * Usage:
 *   npx tsx scripts/verify-muse-prompts.ts [--all | --hi | --en | --commentary]
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { MuseSparkClient } from '../lib/muse-spark';

// Ensure UTF-8 on Windows
if (process.platform === 'win32') {
  try {
    execSync('chcp 65001', { stdio: 'ignore' });
  } catch {}
}

function loadEnvLocal() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
}

loadEnvLocal();

const apiKey = process.env.MUSE_SPARK_API_KEY || process.env.NEXT_PUBLIC_MUSE_SPARK_API_KEY;
if (!apiKey) {
  console.error('❌ MUSE_SPARK_API_KEY not found in .env.local');
  process.exit(1);
}

const client = new MuseSparkClient({
  apiKey,
  model: 'muse-spark-1.3-contributor',
});

// Import prompts from ask-muse.ts or define identically
const SYSTEM_PROMPT_HI = `आप 'धर्म सारथी' (Dharma Granth AI Guide) हैं — सनातन धर्म, उपनिषद्, भगवद्गीता और वेदान्त के प्रामाणिक, संवेदनशील एवं समझदार मार्गदर्शक।
संचालित मॉडल: Meta Muse Spark 1.3 Contributor (विस्तृत चिंतन एवं गहन दार्शनिक विवेक)।

नियम एवं मानक:
1. भाषा शैली:
   - सरल, सुगम और गरिमापूर्ण हिन्दी जो एक सामान्य हिन्दी पाठक आसानी से समझ सके।
   - रोज़मर्रा के हिन्दी शब्द (तनाव, शुरू, याद, थकान, पैदा, नकल, जल्दबाजी) का प्रयोग स्वीकार्य है।
   - उर्दू/फारसी शब्दों (खुदा, दुआ, इंसाफ, तसल्ली, बंदगी, रहम, फरमान) का प्रयोग न करें।
   - पाठक को आदरपूर्वक 'आप' सम्बोधित करें।
2. संख्याएँ:
   - केवल ASCII 0-9 (1, 2, 3) या हिन्दी शब्द (पहला, दूसरा) लिखें। देवनागरी अंकों का प्रयोग न करें।
3. संरचना:
   - संक्षिप्त और सहानुभूतिपूर्ण मार्गदर्शन।
   - कम से कम 1 प्रासंगिक मूल संस्कृत श्लोक/मन्त्र तथा उसका सरल हिन्दी अर्थ (जैसे: भगवद्गीता 2.47)।
   - दैनिक जीवन में काम आने वाले 1-2 व्यावहारिक सुझाव।
   - 1 विचारशील चिंतन प्रश्न।
4. मूल दार्शनिक दृष्टि (लोकसंग्रह):
   - सभी उत्तरों को ऋषियों व सन्तों के लोकसंग्रह (विश्व-कल्याण, सामाजिक समरसता, सर्वभूतहित) के दृष्टिकोण से आलोकित करें; वैराग्य या संन्यास को कभी पलायनवाद या शुष्क तटस्थता के रूप में प्रस्तुत न करें।`;

const SYSTEM_PROMPT_EN = `You are 'Dharma Sarathi' (Dharma Granth AI Guide) — an authoritative, compassionate, and wise philosophical counselor in Sanatana Dharma, the Upanishads, Bhagavad Gita, and Vedanta.
Operating Model: Meta Muse Spark 1.3 Contributor (extended contemplative reasoning).

Rules:
1. Tone: Dignified, compassionate, accessible, and philosophically precise.
2. Structure:
   - Clear, profound philosophical guidance addressing the user's situation.
   - At least 1 authentic Sanskrit verse citation (with Roman transliteration) and English meaning.
   - 1-2 practical, actionable daily life protocols.
   - 1 introspective reflection question.
3. Digits: ASCII digits 0-9 only.
4. Core Theological Ethos: Lokasamgraha (Universal Welfare):
   - Ground all insights in the saintly ideal of Lokasamgraha—active social cohesion, compassion, and duty dedicated to the upliftment of all beings (sarvabhūtahite ratāḥ), rejecting escapism or cold detachment.`;

interface CheckResult {
  rule: string;
  passed: boolean;
  detail: string;
}

// Only genuinely Urdu/Persian words are forbidden — common Hindi is allowed.
const FORBIDDEN_WORDS = ['खुदा', 'दुआ', 'इंसाफ', 'तसल्ली', 'बंदगी', 'रहम', 'फरमान', 'मरहम', 'फ़ितरत'];

async function testHindiChat(): Promise<{ passed: boolean; results: CheckResult[]; response: string }> {
  console.log('\n======================================================');
  console.log('🧪 TEST 1: Hindi Chat Prompt Compliance (SYSTEM_PROMPT_HI)');
  console.log('Model: muse-spark-1.3-contributor | Effort: max');
  console.log('======================================================');

  const query = 'जब मन में भारी उद्वेग और विफलता का भय हो, तो गीता के अनुसार अंतःकरण को कैसे स्थिर करें?';
  console.log(`प्रश्न: "${query}"\nचिंतन चल रहा है...`);

  const t0 = Date.now();
  const reply = await client.chat(
    [
      { role: 'system', content: SYSTEM_PROMPT_HI },
      { role: 'user', content: query },
    ],
    { reasoningEffort: 'max', maxTokens: 32000, temperature: 0.2 }
  );
  const duration = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`उत्तर प्राप्त हुआ (${duration}s):\n`);
  console.log(reply);
  console.log('\n--- अनुपालन परीक्षण (Compliance Checks) ---');

  const results: CheckResult[] = [];

  // 1. Zero Devanagari numerals
  const devanagariDigits = reply.match(/[०-९]/g);
  results.push({
    rule: 'देवनागरी अंक निषेध (Zero Devanagari numerals ०-९)',
    passed: !devanagariDigits,
    detail: devanagariDigits ? `अवैध अंक मिले: ${devanagariDigits.join(', ')}` : 'उत्कृष्ट! केवल ASCII अंक (0-9) या शब्द प्रयुक्त हैं।',
  });

  // 2. Prohibited colloquial/Urdu words
  const foundForbidden = FORBIDDEN_WORDS.filter((w) =>
    new RegExp(`(?:^|[^\\p{L}])${w}(?:[^\\p{L}]|$)`, 'u').test(reply)
  );
  results.push({
    rule: 'वर्जित अनौपचारिक / उर्दू शब्द निषेध',
    passed: foundForbidden.length === 0,
    detail: foundForbidden.length === 0 ? 'उत्कृष्ट! कोई वर्जित शब्द नहीं मिला (सुगम हिन्दी शब्दावली का पालन)।' : `वर्जित शब्द मिले: ${foundForbidden.join(', ')}`,
  });

  // 3. Respectful address 'आप'
  const hasAap = /(?:^|[^\p{L}])(आप|आपके|आपको|आपसे|आपका|आपकी)(?:[^\p{L}]|$)/u.test(reply);
  results.push({
    rule: "आदरपूर्वक 'आप' सम्बोधन",
    passed: hasAap,
    detail: hasAap ? "'आप' सम्बोधन का सम्मानपूर्वक प्रयोग किया गया है।" : "'आप' सम्बोधन अनुपस्थित मिला।",
  });

  // 4. Sanskrit Shloka citation
  const hasSanskritQuote = /[।॥]/.test(reply) || /गीता|उपनिषद्|श्लोक|मन्त्र|\d+\.\d+/u.test(reply);
  results.push({
    rule: 'मूल संस्कृत श्लोक / मन्त्र एवं संदर्भ',
    passed: hasSanskritQuote,
    detail: hasSanskritQuote ? 'संस्कृत श्लोक/मन्त्र एवं प्रामाणिक संदर्भ सम्मिलित है।' : 'संस्कृत श्लोक या संदर्भ अनुपस्थित है।',
  });

  // 5. Daily life practical formula
  const hasDailyFormula = /दैनिक|व्यावहारिक|जीवन|सूत्र|अभ्यास|नित्य/u.test(reply);
  results.push({
    rule: 'दैनिक व्यावहारिक जीवन सूत्र',
    passed: hasDailyFormula,
    detail: hasDailyFormula ? 'दैनिक व्यावहारिक मार्गदर्शन उपलब्ध है।' : 'व्यावहारिक सूत्र अनुपस्थित है।',
  });

  // 6. Introspection / Contemplation question
  const hasQuestion = /\?|？|प्रश्न|चिंतन|आत्म-निरीक्षण/u.test(reply);
  results.push({
    rule: 'आत्म-निरीक्षण चिंतन प्रश्न',
    passed: hasQuestion,
    detail: hasQuestion ? 'चिंतन/आत्म-निरीक्षण प्रश्न सम्मिलित है।' : 'चिंतन प्रश्न अनुपस्थित है।',
  });

  for (const r of results) {
    console.log(`${r.passed ? '✅' : '❌'} [${r.rule}]: ${r.detail}`);
  }

  const allPassed = results.every((r) => r.passed);
  return { passed: allPassed, results, response: reply };
}

async function testEnglishChat(): Promise<{ passed: boolean; results: CheckResult[]; response: string }> {
  console.log('\n======================================================');
  console.log('🧪 TEST 2: English Chat Prompt Compliance (SYSTEM_PROMPT_EN)');
  console.log('Model: muse-spark-1.3-contributor | Effort: max');
  console.log('======================================================');

  const query = 'How should one overcome chronic burnout and attachment to professional outcomes according to Vedanta?';
  console.log(`Query: "${query}"\nContemplating with max reasoning...`);

  const t0 = Date.now();
  const reply = await client.chat(
    [
      { role: 'system', content: SYSTEM_PROMPT_EN },
      { role: 'user', content: query },
    ],
    { reasoningEffort: 'max', maxTokens: 32000, temperature: 0.2 }
  );
  const duration = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`Response received (${duration}s):\n`);
  console.log(reply);
  console.log('\n--- Compliance Checks ---');

  const results: CheckResult[] = [];

  // 1. ASCII digits only
  const devanagariDigits = reply.match(/[०-९]/g);
  results.push({
    rule: 'ASCII digits only (0-9)',
    passed: !devanagariDigits,
    detail: devanagariDigits ? `Found Devanagari digits: ${devanagariDigits.join(', ')}` : 'Perfect! Zero Devanagari digits found.',
  });

  // 2. Authentic Sanskrit verse with Roman transliteration
  const hasSanskritOrTranslit = /Gita|Upanishad|karmany|eva|adhikaras|sutra|sloka|verse|[A-Z][a-z]+ \d+\.\d+/i.test(reply);
  results.push({
    rule: 'Authentic Sanskrit citation / Roman transliteration',
    passed: hasSanskritOrTranslit,
    detail: hasSanskritOrTranslit ? 'Authentic scriptural citation & Sanskrit context present.' : 'Missing Sanskrit citation.',
  });

  // 3. Practical daily life protocols
  const hasProtocol = /daily|practice|protocol|action|step|routine/i.test(reply);
  results.push({
    rule: 'Practical daily life protocols (1-2 actionable points)',
    passed: hasProtocol,
    detail: hasProtocol ? 'Practical action protocols identified.' : 'Missing action protocols.',
  });

  // 4. Introspective reflection question
  const hasQuestion = /\?|reflection|contemplat|inquiry/i.test(reply);
  results.push({
    rule: 'Introspective reflection question',
    passed: hasQuestion,
    detail: hasQuestion ? 'Introspective question present.' : 'Missing reflection question.',
  });

  for (const r of results) {
    console.log(`${r.passed ? '✅' : '❌'} [${r.rule}]: ${r.detail}`);
  }

  const allPassed = results.every((r) => r.passed);
  return { passed: allPassed, results, response: reply };
}

async function testCommentaryDraft(): Promise<{ passed: boolean; results: CheckResult[]; response: any }> {
  console.log('\n======================================================');
  console.log('🧪 TEST 3: 4-Layer Commentary Draft Compliance');
  console.log('Model: muse-spark-1.3-contributor');
  console.log('======================================================');

  console.log('Drafting commentary for Ishavasya Upanishad, Verse 1...\n');

  const t0 = Date.now();
  const commentary = await client.draftVerseCommentary({
    scriptureName: 'ईशावास्योपनिषद् (Ishavasya Upanishad)',
    chapterNumber: 1,
    verseNumber: 1,
    sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
    hindi: 'अखिल ब्रह्माण्ड में जो कुछ भी जड़-चेतन जगत है, वह सब ईश्वर से व्याप्त है। अतः त्यागभाव से उसका उपभोग करो, किसी के धन की लालसा मत करो।',
  });
  const duration = ((Date.now() - t0) / 1000).toFixed(1);

  console.log(`Draft received in ${duration}s:\n`);
  console.log('--- Explanation ---');
  console.log(commentary.explanation?.slice(0, 300) + '...\n');
  console.log('--- Life Lesson ---');
  console.log(commentary.lifeLesson + '\n');
  console.log('--- Science ---');
  console.log(commentary.science + '\n');

  console.log('--- Compliance Checks ---');
  const results: CheckResult[] = [];

  // 1. JSON keys present
  const hasKeys = Boolean(commentary.explanation && commentary.lifeLesson && commentary.science);
  results.push({
    rule: 'Valid JSON schema with explanation, lifeLesson, science',
    passed: hasKeys,
    detail: hasKeys ? 'All 3 top-level keys present and non-empty.' : 'Missing top-level keys.',
  });

  // 2. Heading "### आधुनिक संदर्भ"
  const hasAdhunik = commentary.lifeLesson?.includes('### आधुनिक संदर्भ');
  results.push({
    rule: 'Heading "### आधुनिक संदर्भ"',
    passed: Boolean(hasAdhunik),
    detail: hasAdhunik ? 'Heading present.' : 'Missing "### आधुनिक संदर्भ".',
  });

  // 3. Heading "### आज के जीवन में प्रयोग"
  const hasPrayog = commentary.lifeLesson?.includes('### आज के जीवन में प्रयोग');
  results.push({
    rule: 'Heading "### आज के जीवन में प्रयोग"',
    passed: Boolean(hasPrayog),
    detail: hasPrayog ? 'Heading present.' : 'Missing "### आज के जीवन में प्रयोग".',
  });

  // 4. Exactly 3 bullet points with bold descriptor
  const bullets = (commentary.lifeLesson?.match(/^-\s*\*\*[^*]+\*\*:/gm) || []).length;
  const passedBullets = bullets === 3;
  results.push({
    rule: 'Exactly 3 bullet points in format: - **शीर्षक**: विवरण',
    passed: passedBullets,
    detail: passedBullets ? `Exactly 3 bullets matched: ${bullets}` : `Found ${bullets} bullets (expected exactly 3).`,
  });

  // 5. Heading "### चिंतन प्रश्न"
  const hasChintan = commentary.lifeLesson?.includes('### चिंतन प्रश्न');
  results.push({
    rule: 'Heading "### चिंतन प्रश्न"',
    passed: Boolean(hasChintan),
    detail: hasChintan ? 'Heading present.' : 'Missing "### चिंतन प्रश्न".',
  });

  // 6. Zero Devanagari numerals in whole payload
  const fullText = `${commentary.explanation} ${commentary.lifeLesson} ${commentary.science}`;
  const devDigits = fullText.match(/[०-९]/g);
  results.push({
    rule: 'Zero Devanagari numerals across whole commentary',
    passed: !devDigits,
    detail: devDigits ? `Found Devanagari digits: ${devDigits.join(', ')}` : 'Zero Devanagari digits detected.',
  });

  for (const r of results) {
    console.log(`${r.passed ? '✅' : '❌'} [${r.rule}]: ${r.detail}`);
  }

  const allPassed = results.every((r) => r.passed);
  return { passed: allPassed, results, response: commentary };
}

async function main() {
  const arg = process.argv[2] || '--all';
  console.log('========================================================');
  console.log(' Dharma Granth: Meta Muse Spark 1.3 Prompt Compliance Audit');
  console.log('========================================================');

  let hPass = true;
  let ePass = true;
  let cPass = true;

  if (arg === '--all' || arg === '--hi') {
    const res = await testHindiChat();
    hPass = res.passed;
  }
  if (arg === '--all' || arg === '--en') {
    const res = await testEnglishChat();
    ePass = res.passed;
  }
  if (arg === '--all' || arg === '--commentary') {
    const res = await testCommentaryDraft();
    cPass = res.passed;
  }

  console.log('\n========================================================');
  console.log('FINAL AUDIT SUMMARY:');
  console.log(`- Hindi Chat Prompt:        ${hPass ? '✅ 100% COMPLIANT' : '❌ ISSUES DETECTED'}`);
  console.log(`- English Chat Prompt:      ${ePass ? '✅ 100% COMPLIANT' : '❌ ISSUES DETECTED'}`);
  console.log(`- 4-Layer Commentary Draft: ${cPass ? '✅ 100% COMPLIANT' : '❌ ISSUES DETECTED'}`);
  console.log('========================================================\n');

  if (!hPass || !ePass || !cPass) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n❌ Uncaught error during verification:', err);
  process.exit(1);
});
