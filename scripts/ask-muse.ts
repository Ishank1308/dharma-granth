/**
 * Dharma Granth: Muse Spark CLI Chat
 *
 * Interactive multi-turn chat (or one-shot query) with Meta Muse Spark.
 * Default: muse-spark-1.3-contributor with reasoning_effort 'max'.
 *
 * Enhancements:
 *   - Prompt Presets: /preset <philosophical|commentary|vyakarana|dialectic|raw>
 *   - Scripture Ground Truth Injection: /verse <scripture> <chapter.verse> [question]
 *   - Session Save & Markdown Export: /save [filename], /load <filename>
 *   - Multi-line Input Mode: start & end with """
 *   - Prompt Engineering Controls: /prompt [text|reset], --prompt "<text>"
 *   - Session Diagnostics: /stats
 *
 * Usage:
 *   npm run chat:muse                                   Interactive chat (Default: English)
 *   npm run chat:muse -- --hi                           इंटरैक्टिव चैट (Hindi)
 *   npm run chat:muse -- --preset commentary            Chat with 3-pillar commentary preset
 *   npm run chat:muse -- --prompt "Custom prompt..."    Chat with custom system prompt
 *   npm run ask:muse -- "What is Nishkama Karma?"       One-shot answer (Default: English)
 *   npm run ask:muse -- --hi "धर्म क्या है?"            एक प्रश्न, एक उत्तर (Hindi)
 *   npm run ask:muse -- --model muse-spark-1.3 --effort low "Query"
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { execSync } from 'node:child_process';
import { MuseSparkClient, type ChatMessage } from '../lib/muse-spark';

// Ensure UTF-8 output on Windows console (fixes garbled Devanagari characters / Mojibake)
if (process.platform === 'win32') {
  try {
    execSync('chcp 65001', { stdio: 'ignore' });
  } catch {}
}

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

loadEnvLocal();

// ============================================================================
// SYSTEM PROMPTS & PRESETS
// ============================================================================

const SYSTEM_PROMPT_PHILOSOPHICAL_HI = `आप 'धर्म सारथी' (Dharma Granth AI Guide) हैं — सनातन धर्म, उपनिषद्, भगवद्गीता और वेदान्त के प्रामाणिक, संवेदनशील एवं समझदार मार्गदर्शक।
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

const SYSTEM_PROMPT_PHILOSOPHICAL_EN = `You are 'Dharma Sarathi' (Dharma Granth AI Guide) — an authoritative, compassionate, and wise philosophical counselor in Sanatana Dharma, the Upanishads, Bhagavad Gita, and Vedanta.
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

const SYSTEM_PROMPT_COMMENTARY_HI = `आप 'धर्म ग्रन्थ भाष्यकार' हैं — सनातन शास्त्रों (गीता, उपनिषद्, रामायण) के प्रामाणिक 3-स्तम्भ भाष्यकार।
संचालित मॉडल: Meta Muse Spark 1.3 Contributor (विस्तृत चिन्तन एवं गीता प्रेस मानक)।

संरचना (3 अनिवार्य स्तम्भ):
1. भावार्थ (Bhavartha):
   - मूल संस्कृत श्लोक का विशुद्ध, सरल और गरिमामय हिन्दी अनुवाद।
2. व्याख्या (Vyakhya):
   - विस्तृत दार्शनिक एवं आध्यात्मिक विवेचन।
   - वेदान्त, सांख्य और लोकसंग्रह के सन्दर्भ में तत्त्व-विश्लेषण।
3. आधुनिक संदर्भ (Modern Application):
   - समकालीन जीवन, तनाव, कर्मयोग एवं मानसिक शान्ति में व्यावहारिक उपयोगिता।
   - 3 बुलेट बिन्दु (दैनिक साधना/व्यवहार)।
   - 1 गहन आत्म-निरीक्षण प्रश्न।

मानक:
- सरल सुगम हिन्दी, उर्दू/फारसी शब्द वर्जित।
- ASCII 0-9 संख्याएँ। पाठक को 'आप' सम्बोधन।`;

const SYSTEM_PROMPT_COMMENTARY_EN = `You are the Dharma Granth Canonical Commentator — drafting authoritative 3-pillar scripture commentaries (Gita Press standard).
Operating Model: Meta Muse Spark 1.3 Contributor (extended contemplative theological reasoning).

Required 3-Pillar Structure:
1. Bhavartha (Literal Translation):
   - Faithful, lucid English translation honoring classical Sanskrit phrasing.
2. Vyakhya (Philosophical Exposition):
   - Deep metaphysical and psychological exposition grounded in Vedanta, Samkhya, and Lokasamgraha.
   - Synthesizing classical insights with uncompromising theological rigor.
3. Modern Application:
   - Contemporary relevance for ethical action, stress transcendence, and mindful living.
   - Exactly 3 actionable daily protocols.
   - 1 introspective self-inquiry question.

Digits: ASCII 0-9 only. Dignified, scholarly, and inspiring tone.`;

const SYSTEM_PROMPT_VYAKARANA = `You are an expert Sanskrit Philologist and Vyakarana (Paninian Grammar) Master for the Dharma Granth library.
Operating Model: Meta Muse Spark 1.3 Contributor.

When analyzing any Sanskrit verse or phrase, provide a rigorous morphological and grammatical breakdown:
1. मूल श्लोक / Shloka (in Devanagari and Roman Transliteration).
2. पदच्छेद (Padachheda): Complete word-by-word separation with Sandhi split.
3. अन्वय (Anvaya): Natural prose word-order for clarity.
4. शब्दार्थ एवं व्याकरण (Grammatical Dissection):
   - For key terms: Dhatu (verbal root) / Pratipadika, Pratyaya (affix), Vibhakti (case) & Vachana (number), Lakara/Tense, and Samasa (compound type with Vigraha Vakya).
5. दार्शनिक गूढार्थ (Etymological & Philosophical Significance):
   - How the etymology enriches the philosophical insight.`;

const SYSTEM_PROMPT_DIALECTIC = `You are a Master of Classical Indian Philosophical Debate (Vada / Tarka / Vedanta Dialectic).
Operating Model: Meta Muse Spark 1.3 Contributor.

Structure philosophical inquiries using the classical Indian dialectical framework:
1. विषय (Vishaya): Formulation of the central philosophical premise or doubt.
2. संशय (Samshaya): The exact dilemma or ambiguity.
3. पूर्वपक्ष (Purvapaksha): The strongest possible formulation of the opposing/skeptical thesis, along with its supporting logic (Yukti).
4. प्रमाण एवं युक्ति परीक्षा (Epistemic Scrutiny): Analysis via Sruti (Scripture), Yukti (Logical deduction), and Anubhuti (Direct intuitive experience).
5. खण्डन (Khandana): Rigorous refutation of the flaws and fallacies in the Purvapaksha.
6. उत्तर / सिद्धान्त (Siddhanta): The immutable established conclusion grounded in Vedanta, Non-duality, and Lokasamgraha.`;

const SYSTEM_PROMPT_RAW = `You are Meta Muse Spark 1.3 Contributor, an advanced artificial intelligence specialized in deep contemplative reasoning, philosophical inquiries, and rigorous scriptural analysis. Reason extensively and answer thoroughly.`;

export type PresetKey = 'philosophical' | 'commentary' | 'vyakarana' | 'dialectic' | 'raw';

export interface PresetInfo {
  key: PresetKey;
  name: string;
  description: string;
  getPrompt: (lang: 'en' | 'hi') => string;
}

export const PRESETS: Record<PresetKey, PresetInfo> = {
  philosophical: {
    key: 'philosophical',
    name: 'Philosophical Counselor (Dharma Sarathi)',
    description: 'Empathetic ethical dilemma resolution anchored in Lokasamgraha, authentic Sanskrit shlokas, and daily practical protocols.',
    getPrompt: (l) => (l === 'hi' ? SYSTEM_PROMPT_PHILOSOPHICAL_HI : SYSTEM_PROMPT_PHILOSOPHICAL_EN),
  },
  commentary: {
    key: 'commentary',
    name: 'Canonical 3-Pillar Commentary',
    description: '3-tier commentary adhering strictly to Gita Press & Dharma Granth standards (1. भावार्थ, 2. व्याख्या, 3. आधुनिक संदर्भ).',
    getPrompt: (l) => (l === 'hi' ? SYSTEM_PROMPT_COMMENTARY_HI : SYSTEM_PROMPT_COMMENTARY_EN),
  },
  vyakarana: {
    key: 'vyakarana',
    name: 'Sanskrit Grammarian & Etymology (व्याकरण)',
    description: 'Rigorous philological dissection: Padachheda (पदच्छेद), Anvaya (अन्वय), Dhatu roots, Sandhi, Samasa, and philosophical nuances.',
    getPrompt: () => SYSTEM_PROMPT_VYAKARANA,
  },
  dialectic: {
    key: 'dialectic',
    name: 'Vedantic Dialectic (पूर्वपक्ष-सिद्धान्त)',
    description: 'Classical Indian philosophical debate: Purvapaksha (opponent view), Yukti/Pramana scrutiny, Khandana, and Uttara Siddhanta.',
    getPrompt: () => SYSTEM_PROMPT_DIALECTIC,
  },
  raw: {
    key: 'raw',
    name: 'Unconstrained Reasoner (Raw Muse)',
    description: 'Minimal system prompt giving maximum freedom to Muse Spark 1.3 Contributor extended reasoning.',
    getPrompt: () => SYSTEM_PROMPT_RAW,
  },
};

// ============================================================================
// SCRIPTURE GROUND TRUTH LOADER
// ============================================================================

const SCRIPTURE_ALIASES: Record<string, string> = {
  gita: 'bhagavadgita',
  bg: 'bhagavadgita',
  bhagavadgita: 'bhagavadgita',
  katha: 'katha',
  isha: 'ishavasya',
  ishavasya: 'ishavasya',
  kena: 'kena',
  mundaka: 'mundaka',
  mandukya: 'mandukya',
  prashna: 'prashna',
  taittiriya: 'taittiriya',
  aitareya: 'aitareya',
  chandogya: 'chandogya',
  brihadaranyaka: 'brihadaranyaka',
  ramcharitmanas: 'ramcharitmanas',
  rcm: 'ramcharitmanas',
  manusmriti: 'manusmriti',
  yogasutra: 'yogasutra',
  vivekchudamani: 'vivekchudamani',
  mahabharata: 'mahabharata',
  rigveda: 'rigveda',
  samaveda: 'samaveda',
  yajurveda: 'yajurveda',
  atharvaveda: 'atharvaveda',
  shvetashvatara: 'shvetashvatara',
  durgasaptashati: 'durgasaptashati',
  viduraniti: 'viduraniti',
  vishnupurana: 'vishnupurana',
  shivpurana: 'shivpurana',
  garudpurana: 'garudpurana',
  harivanshpuran: 'harivanshpuran',
};

export interface LoadedVerse {
  scriptureId: string;
  scriptureTitle: string;
  chapterNumber: number;
  verseNumber: number | string;
  sanskrit: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  wordMeaning?: string;
}

export function findVerseInRepo(input: string): { verse: LoadedVerse; remainingQuery: string } | null {
  const tokens = input.trim().split(/\s+/);
  if (tokens.length < 2) return null;

  const rawBook = tokens[0].toLowerCase().replace(/[^a-z]/g, '');
  const bookId = SCRIPTURE_ALIASES[rawBook] || rawBook;
  const filePath = path.resolve('public/data/scriptures-full', `${bookId}.json`);
  if (!fs.existsSync(filePath)) return null;

  let chapterNum = 1;
  let verseNum = 1;
  let tokensConsumed = 2;

  const secondToken = tokens[1];
  if (secondToken.includes('.') || secondToken.includes(':')) {
    const parts = secondToken.split(/[.:]/).map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      chapterNum = parts[0];
      verseNum = parts[1];
    } else if (parts.length === 1 && !isNaN(parts[0])) {
      chapterNum = 1;
      verseNum = parts[0];
    }
  } else if (!isNaN(Number(secondToken))) {
    if (tokens.length > 2 && !isNaN(Number(tokens[2]))) {
      chapterNum = Number(secondToken);
      verseNum = Number(tokens[2]);
      tokensConsumed = 3;
    } else {
      chapterNum = 1;
      verseNum = Number(secondToken);
    }
  } else {
    return null;
  }

  const remainingQuery = tokens.slice(tokensConsumed).join(' ');

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const ch =
      data.chapters?.find((c: any) => c.number === chapterNum) ||
      data.chapters?.[chapterNum - 1];
    if (!ch) return null;
    const v = ch.verses?.find(
      (item: any) => item.number === verseNum || String(item.number) === String(verseNum)
    );
    if (!v) return null;

    return {
      verse: {
        scriptureId: data.id || bookId,
        scriptureTitle: data.title || bookId,
        chapterNumber: ch.number,
        verseNumber: v.number,
        sanskrit: (v.sanskrit || '').trim(),
        transliteration: (v.transliteration || '').trim(),
        hindi: (v.hindi || '').trim(),
        translation: (v.translation || '').trim(),
        wordMeaning: (v.wordMeaning || '').trim(),
      },
      remainingQuery,
    };
  } catch {
    return null;
  }
}

function formatVerseForContext(v: LoadedVerse): string {
  let text = `[Canonical Scripture Ground Truth: ${v.scriptureTitle} Chapter ${v.chapterNumber}, Verse ${v.verseNumber}]\n`;
  if (v.sanskrit) text += `Sanskrit:\n${v.sanskrit}\n\n`;
  if (v.transliteration) text += `Transliteration:\n${v.transliteration}\n\n`;
  if (v.wordMeaning) text += `Word-by-word (पदच्छेद/पद-अर्थ):\n${v.wordMeaning}\n\n`;
  if (v.hindi) text += `Hindi Meaning:\n${v.hindi}\n\n`;
  if (v.translation) text += `English Translation:\n${v.translation}\n`;
  return text.trim();
}

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================

const args = process.argv.slice(2);
let query = '';
let customKey = '';
let customSystemPrompt: string | null = null;
let activePreset: PresetKey = 'philosophical';
let model = process.env.MUSE_CLI_MODEL || DEFAULT_MODEL;
let effort: Effort = (process.env.MUSE_CLI_EFFORT as Effort) || DEFAULT_EFFORT;
let lang: 'hi' | 'en' = (process.env.MUSE_CLI_LANG as 'hi' | 'en') || 'en';

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
  } else if ((a === '--prompt' || a === '--system') && args[i + 1]) {
    customSystemPrompt = args[++i];
  } else if (a === '--preset' && args[i + 1]) {
    const candidate = args[++i].toLowerCase() as PresetKey;
    if (PRESETS[candidate]) activePreset = candidate;
  } else if (a === '--lang' && args[i + 1]) {
    lang = args[++i] === 'hi' ? 'hi' : 'en';
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
  console.error(`❌ Invalid effort "${effort}". Valid: ${EFFORTS.join(', ')}`);
  process.exit(1);
}

const apiKey =
  customKey || process.env.MUSE_SPARK_API_KEY || process.env.NEXT_PUBLIC_MUSE_SPARK_API_KEY;

function getSystemPrompt(): string {
  if (customSystemPrompt) return customSystemPrompt;
  const p = PRESETS[activePreset] || PRESETS.philosophical;
  return p.getPrompt(lang);
}

function printUsage() {
  console.log(`✨ Meta Muse Spark 1.3 Contributor CLI Chat

Usage / उपयोग:
  npm run chat:muse                                   Interactive chat (Default: English)
  npm run chat:muse -- --hi                           इंटरैक्टिव चैट (Hindi)
  npm run chat:muse -- --preset commentary            3-Pillar commentary drafting mode
  npm run chat:muse -- --preset vyakarana             Sanskrit grammar & etymology mode
  npm run chat:muse -- --prompt "Custom prompt..."    Chat with custom system prompt
  npm run ask:muse -- "What is Nishkama Karma?"       One-shot answer (Default: English)
  npm run ask:muse -- --hi "धर्म क्या है?"            एक प्रश्न, एक उत्तर (Hindi)
  npm run ask:muse -- --model muse-spark-1.3 --effort low "Query"

Options / विकल्प:
  --en, --lang en    English responses with Romanized Sanskrit (Default)
  --hi, --lang hi    Dignified accessible Hindi responses
  --preset <name>    Preset: philosophical | commentary | vyakarana | dialectic | raw
  --prompt <text>    Custom system prompt override (work with any prompt)
  --system <text>    Alias for --prompt
  --model <id>       Default: ${DEFAULT_MODEL}
  --effort <lvl>     ${EFFORTS.join(' | ')} (Default: ${DEFAULT_EFFORT})
  --key <key>        API key override (Default: MUSE_SPARK_API_KEY in .env.local)

Chat commands inside interactive session:
  /preset [name]     Switch preset mode (commentary, vyakarana, dialectic, raw, etc.)
  /verse <ref> [q]   Inject authentic scripture from repo (e.g. /verse gita 2.47)
  /prompt [text]     View or set custom system prompt on the fly
  /prompt reset      Reset system prompt back to the active preset default
  /save [name]       Export current session to docs/muse-sessions/<name>.md
  /load <file>       Load conversation history from a markdown session file
  /stats             View session metrics (elapsed time, query count, token budget)
  /multiline         Toggle multi-line input mode (or surround text with """)
  /lang <en|hi>      Switch language (en = English, hi = Hindi)
  /model <id>        Switch active model
  /effort <level>    Switch reasoning effort
  /clear             Reset conversation history
  /history           View message count
  /exit              Quit chat
`);
}

function makeClient() {
  return new MuseSparkClient({
    apiKey,
    baseUrl: process.env.MUSE_SPARK_BASE_URL || 'https://api.meta.ai/v1',
    model,
  });
}

/** Shows an elapsed-seconds spinner on stderr while the model is contemplating. */
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
  const label =
    lang === 'en'
      ? `${model} (${effort}) is contemplating...`
      : `${model} · effort ${effort} चिंतन कर रहा है...`;
  const stop = startSpinner(label);
  const start = Date.now();
  try {
    const text = await makeClient().chat(
      [{ role: 'system', content: getSystemPrompt() }, ...history],
      {
        temperature: 0.2,
        maxTokens: TOKEN_BUDGET[effort],
        reasoningEffort: effort,
      }
    );
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

// ============================================================================
// INTERACTIVE MULTI-TURN CHAT
// ============================================================================

function saveSession(history: ChatMessage[], filename?: string): string {
  const dir = path.resolve('docs/muse-sessions');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const safeName = (filename || `session-${dateStr}`).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filePath = path.join(dir, `${safeName}.md`);

  let md = `# Meta Muse Spark 1.3 Contributor Session: ${safeName}\n\n`;
  md += `- **Date**: ${new Date().toLocaleString()}\n`;
  md += `- **Model**: ${model}\n`;
  md += `- **Reasoning Effort**: ${effort}\n`;
  md += `- **Language**: ${lang}\n`;
  md += `- **Preset**: ${activePreset} (${PRESETS[activePreset]?.name || 'Custom'})\n\n`;
  md += `## System Prompt\n\`\`\`\n${getSystemPrompt()}\n\`\`\`\n\n`;
  md += `---\n\n## Dialogue\n\n`;

  for (const m of history) {
    if (m.role === 'user') {
      md += `### 👤 User\n\n${m.content}\n\n`;
    } else if (m.role === 'assistant') {
      md += `### ✨ Muse Spark (${model})\n\n${m.content}\n\n---\n\n`;
    }
  }

  fs.writeFileSync(filePath, md, 'utf8');
  return filePath;
}

function loadSession(nameOrPath: string, history: ChatMessage[]): number {
  let targetPath = nameOrPath;
  if (!fs.existsSync(targetPath)) {
    targetPath = path.resolve('docs/muse-sessions', `${nameOrPath.replace(/\.md$/, '')}.md`);
  }
  if (!fs.existsSync(targetPath)) {
    throw new Error(`File not found: ${nameOrPath} or ${targetPath}`);
  }

  const raw = fs.readFileSync(targetPath, 'utf8');
  const userMatches = [...raw.matchAll(/### 👤 User\s*\n\n([\s\S]*?)(?=\n\n### ✨ Muse Spark|\n\n---|$)/g)];
  const museMatches = [...raw.matchAll(/### ✨ Muse Spark[^\n]*\s*\n\n([\s\S]*?)(?=\n\n### 👤 User|\n\n---|$)/g)];

  history.length = 0;
  const count = Math.min(userMatches.length, museMatches.length);
  for (let i = 0; i < count; i++) {
    history.push({ role: 'user', content: userMatches[i][1].trim() });
    history.push({ role: 'assistant', content: museMatches[i][1].trim() });
  }
  return history.length;
}

async function runChat() {
  const history: ChatMessage[] = [];
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  let totalQueries = 0;
  let totalContemplationSecs = 0;
  let multiLineBuffer: string[] | null = null;

  console.log('✨ Muse Spark CLI Chat (Dharma Granth)');
  console.log(`   Model: ${model} · effort: ${effort} · lang: ${lang} · preset: ${activePreset}`);
  if (customSystemPrompt) {
    console.log('   [Custom System Prompt is currently active]');
  }
  console.log('   Commands: /preset <name>  /verse <ref>  /prompt [text|reset]  /save [name]  /stats  /help  /exit\n');

  let closed = false;
  rl.on('close', () => {
    closed = true;
  });

  const updatePrompt = () => {
    if (multiLineBuffer !== null) {
      rl.setPrompt('... ');
    } else {
      rl.setPrompt(lang === 'en' ? 'You › ' : 'आप › ');
    }
  };

  const prompt = () => {
    if (!closed) {
      updatePrompt();
      rl.prompt();
    }
  };

  prompt();

  for await (const rawLine of rl) {
    // ---- Multi-line handling ----
    if (multiLineBuffer !== null) {
      if (rawLine.trim() === '"""' || rawLine.trim() === 'EOF') {
        const fullInput = multiLineBuffer.join('\n').trim();
        multiLineBuffer = null;
        if (!fullInput) {
          prompt();
          continue;
        }
        await handleUserInput(fullInput);
        prompt();
        continue;
      }
      multiLineBuffer.push(rawLine);
      prompt();
      continue;
    }

    const trimmed = rawLine.trim();

    // Check if user initiated multi-line with """
    if (trimmed.startsWith('"""')) {
      const restOfLine = trimmed.slice(3).trim();
      multiLineBuffer = restOfLine ? [restOfLine] : [];
      console.log('📝 Multi-line mode enabled. Type your text. Type """ on a new line to submit.\n');
      prompt();
      continue;
    }

    if (!trimmed) {
      prompt();
      continue;
    }

    // ---- Slash Command Dispatcher ----
    if (trimmed.startsWith('/')) {
      const [cmd, ...rest] = trimmed.split(/\s+/);
      const arg = rest.join(' ').trim();
      if (cmd === '/exit' || cmd === '/quit') break;

      switch (cmd) {
        case '/preset':
        case '/mode': {
          if (!arg) {
            console.log(`\nActive Preset: ${activePreset} (${PRESETS[activePreset]?.name || 'Custom'})`);
            console.log('\nAvailable Presets:');
            for (const p of Object.values(PRESETS)) {
              const currentTag = p.key === activePreset && !customSystemPrompt ? ' [ACTIVE]' : '';
              console.log(`  • /preset ${p.key.padEnd(14)} - ${p.name}${currentTag}`);
              console.log(`    ${p.description}`);
            }
            console.log('');
          } else {
            const key = arg.toLowerCase() as PresetKey;
            if (PRESETS[key]) {
              activePreset = key;
              customSystemPrompt = null; // Clear manual override when changing preset
              console.log(`\n✓ Switched to preset: ${PRESETS[key].name}`);
              console.log(`  ${PRESETS[key].description}\n`);
            } else {
              console.log(`❌ Unknown preset "${arg}". Valid: ${Object.keys(PRESETS).join(', ')}\n`);
            }
          }
          break;
        }

        case '/verse':
        case '/shloka': {
          if (!arg) {
            console.log('Usage: /verse <scripture> <chapter.verse> [optional question]');
            console.log('Examples:');
            console.log('  /verse gita 2.47');
            console.log('  /verse katha 1.3.3 What does the chariot metaphor mean?');
            console.log('  /verse isha 1');
            console.log('  /verse ramcharitmanas 1.1\n');
            break;
          }

          const lookup = findVerseInRepo(arg);
          if (!lookup) {
            console.log(`❌ Could not locate verse for "${arg}". Check scripture name and chapter.verse number.\n`);
            break;
          }

          const { verse, remainingQuery } = lookup;
          const formattedContext = formatVerseForContext(verse);

          console.log(`\n📜 Loaded Authentic Scripture Ground Truth:`);
          console.log(`--------------------------------------------------`);
          console.log(`${verse.scriptureTitle} Chapter ${verse.chapterNumber}, Verse ${verse.verseNumber}`);
          if (verse.sanskrit) console.log(`\n${verse.sanskrit}`);
          if (verse.transliteration) console.log(`\n${verse.transliteration}`);
          if (verse.wordMeaning) console.log(`\nपद-अर्थ: ${verse.wordMeaning}`);
          if (verse.hindi) console.log(`\nहिन्दी: ${verse.hindi}`);
          if (verse.translation) console.log(`\nEnglish: ${verse.translation}`);
          console.log(`--------------------------------------------------\n`);

          const queryToSend = remainingQuery
            ? `${formattedContext}\n\nInquiry: ${remainingQuery}`
            : `${formattedContext}\n\nPlease contemplate and explain this authentic verse adhering to your active role.`;

          await handleUserInput(queryToSend);
          break;
        }

        case '/prompt':
        case '/system': {
          if (!arg) {
            console.log(
              `\n--- Active System Prompt (${customSystemPrompt ? 'Custom Override' : `Preset: ${activePreset}`}) ---`
            );
            console.log(getSystemPrompt());
            console.log('--------------------------------------------------');
            console.log('• To set a new prompt: /prompt <your prompt text>');
            console.log('• To reset to preset default: /prompt reset\n');
          } else if (arg.toLowerCase() === 'reset') {
            customSystemPrompt = null;
            console.log(`\n↺ System prompt reset to preset: ${PRESETS[activePreset].name}\n`);
          } else {
            customSystemPrompt = arg;
            console.log(`\n✓ Active system prompt updated to:\n"${customSystemPrompt}"\n`);
          }
          break;
        }

        case '/save':
        case '/export': {
          try {
            const savedPath = saveSession(history, arg);
            console.log(`\n💾 Session exported successfully to:\n   ${savedPath}\n`);
          } catch (err: any) {
            console.error(`\n❌ Failed to save session: ${err.message}\n`);
          }
          break;
        }

        case '/load': {
          if (!arg) {
            console.log('Usage: /load <filename-or-path>\n');
            break;
          }
          try {
            const count = loadSession(arg, history);
            console.log(`\n📂 Loaded session with ${count} messages.\n`);
          } catch (err: any) {
            console.error(`\n❌ Failed to load session: ${err.message}\n`);
          }
          break;
        }

        case '/stats': {
          console.log('\n📊 Muse Spark Session Statistics:');
          console.log(`  • Model: ${model}`);
          console.log(`  • Reasoning Effort: ${effort} (Token budget: ${TOKEN_BUDGET[effort]})`);
          console.log(`  • Language: ${lang.toUpperCase()}`);
          console.log(`  • Preset: ${activePreset} (${PRESETS[activePreset]?.name})`);
          console.log(`  • Custom Prompt Override: ${customSystemPrompt ? 'Yes' : 'No'}`);
          console.log(`  • Exchanges in History: ${Math.floor(history.length / 2)}`);
          console.log(`  • Total Inquiries this session: ${totalQueries}`);
          console.log(`  • Cumulative Contemplation Time: ${totalContemplationSecs.toFixed(1)}s\n`);
          break;
        }

        case '/multiline':
        case '/paste': {
          multiLineBuffer = [];
          console.log('📝 Multi-line mode enabled. Type your text. Type """ on a new line to submit.\n');
          break;
        }

        case '/lang': {
          if (arg === 'en' || arg === 'hi') {
            lang = arg;
            console.log(`Language set to: ${lang === 'en' ? 'English (Default)' : 'Accessible Dignified Hindi'}\n`);
          } else {
            console.log('Usage: /lang en  or  /lang hi\n');
          }
          break;
        }

        case '/clear': {
          history.length = 0;
          console.log(lang === 'en' ? '↺ Conversation history cleared.\n' : '↺ वार्तालाप इतिहास साफ़ किया गया।\n');
          break;
        }

        case '/model': {
          if (arg) model = arg;
          console.log(`Model: ${model}\n`);
          break;
        }

        case '/effort': {
          if (arg && !EFFORTS.includes(arg as Effort)) {
            console.log(`Invalid effort. Valid: ${EFFORTS.join(', ')}\n`);
          } else {
            if (arg) effort = arg as Effort;
            console.log(`effort: ${effort} (max_tokens ${TOKEN_BUDGET[effort]})\n`);
          }
          break;
        }

        case '/history': {
          console.log(`History contains ${history.length} messages.\n`);
          break;
        }

        case '/help': {
          console.log(`Available Commands:
  /preset [name]     List or switch presets (philosophical, commentary, vyakarana, dialectic, raw)
  /verse <ref> [q]   Inject verified scripture verse (e.g. /verse gita 2.47)
  /prompt [text]     View or set custom system prompt
  /prompt reset      Reset system prompt back to preset default
  /save [filename]   Save conversation to docs/muse-sessions/<name>.md
  /load <file>       Load conversation history from session markdown
  /stats             Show session metrics & contemplation duration
  /multiline         Toggle multi-line input mode (or surround with """)
  /lang <en|hi>      Switch between English and Hindi
  /model <id>        Switch active model
  /effort <level>    Switch reasoning effort (minimal, low, medium, high, xhigh, max)
  /clear             Clear conversation history
  /history           Show message count
  /exit              Quit chat\n`);
          break;
        }

        default:
          console.log(`Unknown command: ${cmd}. Type /help for a list of commands.\n`);
      }
      prompt();
      continue;
    }

    // Normal message handling
    await handleUserInput(trimmed);
    prompt();
  }

  if (!closed) rl.close();
  console.log('\nॐ शान्तिः।');

  async function handleUserInput(input: string) {
    history.push({ role: 'user', content: input });
    totalQueries++;
    try {
      const { text, secs } = await complete(history);
      totalContemplationSecs += parseFloat(secs) || 0;
      history.push({ role: 'assistant', content: text });
      console.log(`\nMuse › (${model} · ${effort} · ${secs}s)\n${text}\n`);
    } catch (err: any) {
      history.pop(); // drop unanswered question so user can retry
      console.error(`\n❌ Error / त्रुटि: ${err.message}\n`);
    }
  }
}

if (!apiKey || apiKey.length <= 5) {
  console.error('❌ Muse Spark API Key is missing.');
  console.error('Please configure MUSE_SPARK_API_KEY in .env.local or use the --key option.');
  process.exit(1);
}

if (query.trim()) {
  runOneShot(query);
} else {
  runChat();
}
