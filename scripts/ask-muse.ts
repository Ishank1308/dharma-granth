/**
 * Dharma Granth: Muse Spark CLI Chat
 *
 * Interactive multi-turn chat (or one-shot query) with Meta Muse Spark.
 * Default: muse-spark-1.3-contributor with reasoning_effort 'max'.
 *
 * Usage:
 *   npx tsx scripts/ask-muse.ts                         # interactive chat
 *   npx tsx scripts/ask-muse.ts "धर्म क्या है?"          # one-shot answer
 *   npx tsx scripts/ask-muse.ts --model muse-spark-1.3 --effort low "प्रश्न"
 *
 * Chat commands: /model <id>, /effort <level>, /clear, /history, /help, /exit
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { MuseSparkClient, type ChatMessage } from '../lib/muse-spark';

type Effort = 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
const EFFORTS: Effort[] = ['minimal', 'low', 'medium', 'high', 'xhigh', 'max'];

const DEFAULT_MODEL = 'muse-spark-1.3-contributor';
const DEFAULT_EFFORT: Effort = 'max';

// Reasoning tokens count against max_tokens. 'max' effort can spend thousands of
// reasoning tokens, so give it a large budget to avoid empty (finish_reason: length) answers.
const TOKEN_BUDGET: Record<Effort, number> = {
  minimal: 4096,
  low: 4096,
  medium: 8192,
  high: 16000,
  xhigh: 24000,
  max: 32000,
};

function loadEnvLocal() {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const k = trimmed.slice(0, idx).trim();
      if (!process.env[k]) process.env[k] = trimmed.slice(idx + 1).trim();
    }
  }
}

import { execSync } from 'node:child_process';

// Ensure UTF-8 output on Windows console (fixes garbled Devanagari characters / Mojibake)
if (process.platform === 'win32') {
  try {
    execSync('chcp 65001', { stdio: 'ignore' });
  } catch {}
}

loadEnvLocal();

// ---- Argument parsing ----
const args = process.argv.slice(2);
let query = '';
let customKey = '';
let model = process.env.MUSE_CLI_MODEL || DEFAULT_MODEL;
let effort: Effort = (process.env.MUSE_CLI_EFFORT as Effort) || DEFAULT_EFFORT;
let lang: 'hi' | 'en' = 'hi';

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--query' && args[i + 1]) {
    query = args[++i];
  } else if (a === '--key' && args[i + 1]) {
    customKey = args[++i];
  } else if (a === '--model' && args[i + 1]) {
    model = args[++i];
  } else if (a === '--effort' && args[i + 1]) {
    effort = args[++i] as Effort;
  } else if (a === '--lang' && args[i + 1]) {
    lang = args[++i] === 'en' ? 'en' : 'hi';
  } else if (a === '--en' || a === '--english') {
    lang = 'en';
  } else if (a === '--hi' || a === '--hindi') {
    lang = 'hi';
  } else if (a === '--help' || a === '-h') {
    printUsage();
    process.exit(0);
  } else if (!a.startsWith('-') && !query) {
    query = args.slice(i).join(' ');
    break;
  }
}

if (!EFFORTS.includes(effort)) {
  console.error(`❌ अमान्य --effort "${effort}". मान्य: ${EFFORTS.join(', ')}`);
  process.exit(1);
}

const apiKey =
  customKey || process.env.MUSE_SPARK_API_KEY || process.env.NEXT_PUBLIC_MUSE_SPARK_API_KEY;

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
   - 1 विचारशील चिंतन प्रश्न।`;

const SYSTEM_PROMPT_EN = `You are 'Dharma Sarathi' (Dharma Granth AI Guide) — an authoritative, compassionate, and wise philosophical counselor in Sanatana Dharma, the Upanishads, Bhagavad Gita, and Vedanta.
Operating Model: Meta Muse Spark 1.3 Contributor (extended contemplative reasoning).

Rules:
1. Tone: Dignified, compassionate, accessible, and philosophically precise.
2. Structure:
   - Clear, profound philosophical guidance addressing the user's situation.
   - At least 1 authentic Sanskrit verse citation (with Roman transliteration) and English meaning.
   - 1-2 practical, actionable daily life protocols.
   - 1 introspective reflection question.
3. Digits: ASCII digits 0-9 only.`;

function getSystemPrompt() {
  return lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_HI;
}

function printUsage() {
  console.log(`Muse Spark CLI Chat

उपयोग (Usage):
  npm run chat:muse                                  इंटरैक्टिव चैट (Interactive Hindi)
  npm run chat:muse -- --en                           Interactive English chat
  npm run ask:muse -- "आपका प्रश्न"                   एक प्रश्न, एक उत्तर (Hindi)
  npm run ask:muse -- --en "What is Nishkama Karma?" English response
  npm run ask:muse -- --model muse-spark-1.3 --effort low "प्रश्न"

विकल्प (Options):
  --en, --lang en  English responses with Romanized Sanskrit
  --hi, --lang hi  Dignified Hindi responses (Default)
  --model <id>     डिफ़ॉल्ट: ${DEFAULT_MODEL}
  --effort <lvl>   ${EFFORTS.join(' | ')} (डिफ़ॉल्ट: ${DEFAULT_EFFORT})
  --key <key>      API कुंजी (डिफ़ॉल्ट: .env.local का MUSE_SPARK_API_KEY)

Windows Encoding Note:
  If Hindi characters appear garbled, run: chcp 65001
  And ensure your terminal uses a Unicode font like 'Cascadia Code' or 'Segoe UI'.`);
}

function makeClient() {
  return new MuseSparkClient({
    apiKey,
    baseUrl: process.env.MUSE_SPARK_BASE_URL || 'https://api.meta.ai/v1',
    model,
  });
}

/** Shows an elapsed-seconds spinner on stderr while the model is thinking. */
function startSpinner(label: string) {
  if (!process.stderr.isTTY) return () => {};
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const start = Date.now();
  let i = 0;
  const timer = setInterval(() => {
    const secs = ((Date.now() - start) / 1000).toFixed(0);
    process.stderr.write(`\r${frames[i++ % frames.length]} ${label} (${secs}s)   `);
  }, 100);
  return () => {
    clearInterval(timer);
    process.stderr.write('\r\x1b[K');
  };
}

async function complete(history: ChatMessage[]): Promise<{ text: string; secs: string }> {
  const label = lang === 'en' ? `${model} (${effort}) is contemplating...` : `${model} · effort ${effort} चिंतन कर रहा है...`;
  const stop = startSpinner(label);
  const start = Date.now();
  try {
    const text = await makeClient().chat([{ role: 'system', content: getSystemPrompt() }, ...history], {
      temperature: 0.2,
      maxTokens: TOKEN_BUDGET[effort],
      reasoningEffort: effort,
    });
    return { text, secs: ((Date.now() - start) / 1000).toFixed(1) };
  } finally {
    stop();
  }
}

async function runOneShot(q: string) {
  try {
    const { text, secs } = await complete([{ role: 'user', content: q.trim() }]);
    console.log(`=== ${model} · effort ${effort} (${secs}s) ===\n`);
    console.log(text);
  } catch (err: any) {
    console.error(`❌ Error / त्रुटि: ${err.message}`);
    process.exit(1);
  }
}

async function runChat() {
  const history: ChatMessage[] = [];
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('✨ Muse Spark CLI Chat');
  console.log(`   Model / मॉडल: ${model} · effort: ${effort} · language: ${lang}`);
  console.log('   Commands: /lang <en|hi>  /model <id>  /effort <level>  /clear  /history  /help  /exit\n');

  let closed = false;
  rl.on('close', () => {
    closed = true;
  });
  const updatePrompt = () => {
    rl.setPrompt(lang === 'en' ? 'You › ' : 'आप › ');
  };
  const prompt = () => {
    if (!closed) {
      updatePrompt();
      rl.prompt();
    }
  };

  prompt();

  // Lines are handled one at a time; buffered input waits until the current answer
  // finishes, so closing stdin mid-request no longer drops the pending question.
  for await (const line of rl) {
    const input = line.trim();
    if (!input) {
      prompt();
      continue;
    }

    if (input.startsWith('/')) {
      const [cmd, ...rest] = input.split(/\s+/);
      const arg = rest.join(' ');
      if (cmd === '/exit' || cmd === '/quit') break;
      switch (cmd) {
        case '/lang':
          if (arg === 'en' || arg === 'hi') {
            lang = arg;
            console.log(`Language set to: ${lang === 'en' ? 'English (with Romanized Sanskrit)' : 'Dignified Tatsam Hindi'}\n`);
          } else {
            console.log('Usage: /lang en  or  /lang hi\n');
          }
          break;
        case '/clear':
          history.length = 0;
          console.log(lang === 'en' ? '↺ Conversation history cleared.\n' : '↺ वार्तालाप इतिहास साफ़ किया गया।\n');
          break;
        case '/model':
          if (arg) model = arg;
          console.log(`Model: ${model}\n`);
          break;
        case '/effort':
          if (arg && !EFFORTS.includes(arg as Effort)) {
            console.log(`Invalid effort. Valid: ${EFFORTS.join(', ')}\n`);
          } else {
            if (arg) effort = arg as Effort;
            console.log(`effort: ${effort} (max_tokens ${TOKEN_BUDGET[effort]})\n`);
          }
          break;
        case '/history':
          console.log(`History contains ${history.length} messages.\n`);
          break;
        case '/help':
          console.log('/lang <en|hi>  /model <id>  /effort <level>  /clear  /history  /exit\n');
          break;
        default:
          console.log(`Unknown command: ${cmd}\n`);
      }
      prompt();
      continue;
    }

    history.push({ role: 'user', content: input });
    try {
      const { text, secs } = await complete(history);
      history.push({ role: 'assistant', content: text });
      console.log(`\nMuse › (${model} · ${effort} · ${secs}s)\n${text}\n`);
    } catch (err: any) {
      history.pop(); // drop the unanswered question so the user can retry
      console.error(`\n❌ त्रुटि (Error): ${err.message}\n`);
    }
    prompt();
  }

  if (!closed) rl.close();
  console.log('\nॐ शान्तिः।');
}

if (!apiKey || apiKey.length <= 5) {
  console.error('❌ Muse Spark API Key अनुपलब्ध है।');
  console.error('कृपया .env.local में MUSE_SPARK_API_KEY सेट करें या --key विकल्प का उपयोग करें।');
  process.exit(1);
}

if (query.trim()) {
  runOneShot(query);
} else {
  runChat();
}
