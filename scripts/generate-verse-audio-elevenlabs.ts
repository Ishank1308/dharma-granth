/**
 * Dharma Granth: ElevenLabs Sacred Verse Audio & Timing Pipeline
 *
 * Generates high-fidelity neural recitation audio and force-aligned
 * word timing tracks (VerseTimingTrack) for scriptures using ElevenLabs
 * Multilingual v2 API.
 *
 * Supports:
 *   - Direct API key via ELEVENLABS_API_KEY in .env.local
 *   - Automatic OAuth credential authentication via authenticated ElevenLabs CLI
 *
 * Output:
 *   - Audio:  public/audio/verses/{scripture}/{chapter}/{verse}.mp3
 *   - Timing: public/audio/verses/{scripture}/{chapter}/{verse}.json
 *
 * Usage:
 *   npx tsx scripts/generate-verse-audio-elevenlabs.ts --scripture bhagavadgita --chapter 2 --verse 47 --dry-run
 *   npx tsx scripts/generate-verse-audio-elevenlabs.ts --scripture bhagavadgita --chapter 2 --verse 47
 */

import fs from 'node:fs';
import path from 'node:path';
import child_process from 'node:child_process';
import { scriptureCatalog } from '../data/scripture-meta';

// Standard voice profiles for sacred Sanskrit and Hindi recitation
export const ELEVENLABS_VOICE_PROFILES = {
  // George: Warm, Captivating Storyteller (fluent in Hindi with eleven_multilingual_v2)
  'sattvic-sage': {
    id: process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb',
    stability: 0.78,
    similarityBoost: 0.85,
    style: 0.2,
    speakerBoost: true,
  },
  // Sarah: Mature, Reassuring, Confident (fluent in Hindi)
  'sattvic-exposition': {
    id: process.env.ELEVENLABS_HINDI_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL',
    stability: 0.72,
    similarityBoost: 0.8,
    style: 0.15,
    speakerBoost: true,
  },
};

function loadEnvLocal() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

loadEnvLocal();

interface TimedWord {
  word: string;
  startTimeMs: number;
  endTimeMs: number;
}

interface VerseTimingTrack {
  verseNumber: number | string;
  durationMs: number;
  words: TimedWord[];
}

interface ElevenLabsAlignmentResponse {
  audio_base64: string;
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i === -1 ? undefined : args[i + 1];
  };

  const scripture = get('--scripture') || 'bhagavadgita';
  const chapter = Number(get('--chapter') || '2');
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const mode = (get('--mode') || 'sanskrit') as 'sanskrit' | 'hindi' | 'bilingual';
  const model = get('--model') || 'eleven_multilingual_v2';
  const voiceId = get('--voice-id') || ELEVENLABS_VOICE_PROFILES['sattvic-sage'].id;

  let verses: Set<string> | null = null;
  const spec = get('--verses') || get('--verse');
  if (spec) {
    verses = new Set();
    for (const part of spec.split(',')) {
      if (part.includes('-') && !part.includes('.')) {
        const [a, b] = part.split('-').map(Number);
        for (let n = a; n <= (b || a); n++) verses.add(String(n));
      } else {
        verses.add(part.trim());
      }
    }
  }

  return { scripture, chapter, verses, dryRun, force, mode, model, voiceId };
}

/**
 * Strips chapter/verse numbering artifacts (e.g. "।।2.47।।") while
 * preserving sacred dandas for contemplative meter pauses.
 */
export function sanitizeRecitationText(text: string): string {
  return text
    .replace(/[\u0951\u0952\u0953\u0954\u1CD0-\u1CFF]/g, '') // Strip Vedic svara accent marks
    .replace(/[।॥]+\s*[\d०-९]+(?:\s*[.\-–—]\s*[\d०-९]+)?\s*[।॥]*\s*$/g, '॥')
    .replace(/[।॥]+\s*[\d०-९]+[.\-–—][\d०-९]+\s*[।॥]*/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reconstructs word-level timestamps from ElevenLabs character-level alignments.
 */
export function buildWordTimingTrack(
  verseNumber: number | string,
  alignment: ElevenLabsAlignmentResponse['alignment']
): VerseTimingTrack {
  const { characters, character_start_times_seconds, character_end_times_seconds } = alignment;
  const words: TimedWord[] = [];

  let currentWord = '';
  let wordStartSec: number | null = null;
  let wordEndSec = 0;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const start = character_start_times_seconds[i];
    const end = character_end_times_seconds[i];

    // Delimiters: spaces and punctuation
    const isDelimiter = /[\s|।॥,;.\-]/.test(char);

    if (isDelimiter) {
      if (currentWord.length > 0 && wordStartSec !== null) {
        words.push({
          word: currentWord,
          startTimeMs: Math.round(wordStartSec * 1000),
          endTimeMs: Math.round(wordEndSec * 1000),
        });
        currentWord = '';
        wordStartSec = null;
      }
    } else {
      if (wordStartSec === null) {
        wordStartSec = start;
      }
      currentWord += char;
      wordEndSec = end;
    }
  }

  if (currentWord.length > 0 && wordStartSec !== null) {
    words.push({
      word: currentWord,
      startTimeMs: Math.round(wordStartSec * 1000),
      endTimeMs: Math.round(wordEndSec * 1000),
    });
  }

  const lastEndSec = character_end_times_seconds[character_end_times_seconds.length - 1] || 0;
  const durationMs = Math.round(lastEndSec * 1000);

  return {
    verseNumber,
    durationMs,
    words,
  };
}

function findInstalledElevenLabsBinary(): string | null {
  const localCache = path.join(process.env.LOCALAPPDATA || '', 'npm-cache/_npx');
  if (fs.existsSync(localCache)) {
    const search = (dir: string): string | null => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          const full = path.join(dir, e.name);
          if (e.name === 'elevenlabs.exe' || e.name === 'elevenlabs') return full;
          if (e.isDirectory() && !e.name.startsWith('.')) {
            const found = search(full);
            if (found) return found;
          }
        }
      } catch {}
      return null;
    };
    const found = search(localCache);
    if (found) return found;
  }
  return null;
}

async function synthesizeWithElevenLabs(
  text: string,
  apiKey: string | undefined,
  voiceId: string,
  model: string
): Promise<ElevenLabsAlignmentResponse> {
  // Option A: Direct API key
  if (apiKey) {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`;
    const payload = {
      text,
      model_id: model,
      voice_settings: {
        stability: 0.78,
        similarity_boost: 0.85,
        style: 0.2,
        use_speaker_boost: true,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`ElevenLabs API failed with HTTP ${res.status}: ${errorBody}`);
    }

    return (await res.json()) as ElevenLabsAlignmentResponse;
  }

  // Option B: Authenticated CLI with Windows Credential Manager OAuth session
  const binary = findInstalledElevenLabsBinary() || 'elevenlabs';
  const proc = child_process.spawnSync(
    binary,
    [
      'text-to-speech',
      'convert_with_timestamps',
      '--text',
      text,
      '--voice-id',
      voiceId,
      '--model-id',
      model,
      '--format',
      'json',
    ],
    {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      windowsHide: true,
    }
  );

  if (proc.status !== 0) {
    throw new Error(`CLI synthesis error: ${proc.stderr || proc.stdout}`);
  }

  return JSON.parse(proc.stdout) as ElevenLabsAlignmentResponse;
}

async function main() {
  const { scripture, chapter, verses, dryRun, force, mode, model, voiceId } = parseArgs();

  const meta = scriptureCatalog.find((s) => s.id === scripture);
  if (!meta) {
    console.error(`❌ Unknown scripture: ${scripture}`);
    process.exit(1);
  }

  const fullPath = path.resolve(`public/data/scriptures-full/${scripture}.json`);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Scripture dataset not found: ${fullPath}`);
    process.exit(1);
  }

  const fullData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const chapData = fullData.chapters?.find((c: any) => Number(c.number || c.id) === chapter);
  if (!chapData || !chapData.verses?.length) {
    console.error(`❌ Chapter ${chapter} not found or empty in ${scripture}.json`);
    process.exit(1);
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;

  const targetVerses = chapData.verses.filter((v: any) => {
    if (!verses) return true;
    return verses.has(String(v.number));
  });

  console.log(`\n======================================================`);
  console.log(`   Dharma Granth · ElevenLabs Verse Audio Generator   `);
  console.log(`======================================================`);
  console.log(`Scripture : ${meta.title} (${scripture})`);
  console.log(`Chapter   : ${chapter}`);
  console.log(`Verses    : ${targetVerses.length} verse(s) selected`);
  console.log(`Mode      : ${mode}`);
  console.log(`Model     : ${model}`);
  console.log(`Voice ID  : ${voiceId}`);
  console.log(`Auth      : ${apiKey ? 'ELEVENLABS_API_KEY (.env.local)' : 'Authenticated CLI (Windows Credential Manager)'}`);
  console.log(`Dry Run   : ${dryRun ? 'YES (No API requests)' : 'NO (Live Generation)'}\n`);

  const outDir = path.resolve(`public/audio/verses/${scripture}/${chapter}`);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const v of targetVerses) {
    const verseNum = v.number;
    const mp3Path = path.join(outDir, `${verseNum}.mp3`);
    const jsonPath = path.join(outDir, `${verseNum}.json`);

    if (fs.existsSync(mp3Path) && !force && !dryRun) {
      console.log(`⏭️  Skipping verse ${verseNum} (already exists; use --force to overwrite)`);
      continue;
    }

    let textToSpeak = '';
    if (mode === 'sanskrit') {
      textToSpeak = sanitizeRecitationText(v.sanskrit || '');
    } else if (mode === 'hindi') {
      textToSpeak = sanitizeRecitationText(v.hindi || '');
    } else if (mode === 'bilingual') {
      const shloka = sanitizeRecitationText(v.sanskrit || '');
      const artha = sanitizeRecitationText(v.hindi || '');
      textToSpeak = `${shloka} । भावार्थ: ${artha}`;
    }

    if (!textToSpeak) {
      console.warn(`⚠️  No text found for verse ${verseNum}; skipping`);
      continue;
    }

    console.log(`▶ Processing verse ${verseNum} (${textToSpeak.length} characters)...`);
    console.log(`   Text: "${textToSpeak.slice(0, 70)}${textToSpeak.length > 70 ? '...' : ''}"`);

    if (dryRun) {
      console.log(`   [Dry Run] Would synthesize ${textToSpeak.length} chars to ${mp3Path}`);
      continue;
    }

    try {
      const result = await synthesizeWithElevenLabs(textToSpeak, apiKey, voiceId, model);
      const audioBuffer = Buffer.from(result.audio_base64, 'base64');
      fs.writeFileSync(mp3Path, audioBuffer);

      const timingTrack = buildWordTimingTrack(verseNum, result.alignment);
      fs.writeFileSync(jsonPath, JSON.stringify(timingTrack, null, 2), 'utf8');

      console.log(`   ✅ Saved: ${mp3Path} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);
      console.log(`   ✅ Saved: ${jsonPath} (${timingTrack.words.length} timed words, ${timingTrack.durationMs}ms)`);
    } catch (err) {
      console.error(`   ❌ Failed verse ${verseNum}:`, err);
    }
  }

  console.log(`\n✨ Generation batch finished.\n`);
}

if (process.argv[1] && process.argv[1].includes('generate-verse-audio-elevenlabs')) {
  main().catch((err) => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  });
}
