/**
 * Draft Hindi व्याख्या / विज्ञान / जीवन की सीख for verses with Claude, into a
 * REVIEW QUEUE — nothing here is published until a reviewer approves it.
 *
 *   npx tsx scripts/generate-verse-commentary.ts --scripture bhagavadgita --chapter 2
 *   npx tsx scripts/generate-verse-commentary.ts --scripture bhagavadgita --chapter 2 --verses 1-5 --dry-run
 *
 * Flags:
 *   --scripture <id>    required, e.g. bhagavadgita
 *   --chapter <n>       required
 *   --verses <a-b|a,b>  optional subset (default: whole chapter)
 *   --dry-run           print the prompt for the first verse; no API calls
 *   --force             regenerate verses already queued or hand-written
 *
 * Output: data/ai-commentary/<scripture>.json
 *   { "<chapter>:<verse>": { explanation, science, lifeLesson, confidence,
 *     reviewNote, status: "pending", model, generatedAt, sanskrit } }
 * Review by setting status to "approved" / "rejected" (or editing the text),
 * then `npm run publish:commentary` publishes approved entries only.
 *
 * Needs API credentials: ANTHROPIC_API_KEY (or ANTHROPIC_AUTH_TOKEN / an
 * `ant auth login` profile).
 */
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { scriptureCatalog } from '../data/scripture-meta';

const MODEL = 'claude-opus-5';
const FULL_DIR = path.resolve('public/data/scriptures-full');
const HUMAN_DIR = path.resolve('public/data/hi-commentary');
const QUEUE_DIR = path.resolve('data/ai-commentary');

// Canonical verse counts, used to refuse generating on a damaged chapter.
const CANONICAL_COUNTS: Record<string, number[]> = {
  bhagavadgita: [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78],
};

/* ── Types ─────────────────────────────────────────────────────────── */

interface Verse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
}
interface Chapter {
  number: number;
  title?: string;
  titleSanskrit?: string;
  verses: Verse[];
}
type HumanCommentary = Record<string, { explanation?: string; science?: string; lifeLesson?: string }>;

export interface QueuedCommentary {
  explanation: string;
  science: string;
  lifeLesson: string;
  confidence: 'high' | 'medium' | 'low';
  reviewNote: string;
  status: 'pending' | 'approved' | 'rejected';
  model: string;
  generatedAt: string;
  /** The Sanskrit the draft was written for; a mismatch later means the verse moved. */
  sanskrit: string;
}

const CommentarySchema = z.object({
  explanation: z.string(),
  science: z.string(),
  lifeLesson: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
  reviewNote: z.string(),
});

/* ── Args ──────────────────────────────────────────────────────────── */

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i === -1 ? undefined : args[i + 1];
  };
  const scripture = get('--scripture');
  const chapter = Number(get('--chapter'));
  if (!scripture || !/^[a-z0-9-]+$/.test(scripture) || !Number.isInteger(chapter) || chapter < 1) {
    console.error('Usage: --scripture <id> --chapter <n> [--verses 1-5] [--dry-run] [--force]');
    process.exit(1);
  }
  let verses: Set<number> | null = null;
  const spec = get('--verses');
  if (spec) {
    verses = new Set();
    for (const part of spec.split(',')) {
      const [a, b] = part.split('-').map(Number);
      for (let n = a; n <= (b || a); n++) verses.add(n);
    }
  }
  return { scripture, chapter, verses, dryRun: args.includes('--dry-run'), force: args.includes('--force') };
}

/* ── Data ──────────────────────────────────────────────────────────── */

function loadChapters(scripture: string): Chapter[] {
  const file = path.join(FULL_DIR, `${scripture}.json`);
  if (!fs.existsSync(file)) throw new Error(`No full text at ${file}`);
  return (JSON.parse(fs.readFileSync(file, 'utf8')) as { chapters: Chapter[] }).chapters;
}

const normSanskrit = (s = '') => s.replace(/[\s|।॥०-९\d.]/g, '');

/**
 * Refuse a chapter whose text is known-damaged: wrong verse count against
 * the canonical text, or verses whose Sanskrit also appears in another
 * chapter (the misplacement found in the Gita). Returns verse numbers to skip.
 */
function integrityCheck(scripture: string, chapters: Chapter[], target: Chapter): Set<number> {
  const canon = CANONICAL_COUNTS[scripture]?.[target.number - 1];
  if (canon !== undefined && target.verses.length !== canon) {
    throw new Error(
      `${scripture} ch ${target.number} has ${target.verses.length} verses; the canonical text has ${canon}. ` +
        'The source data looks damaged — repair it before generating commentary.',
    );
  }
  const elsewhere = new Set<string>();
  for (const c of chapters) {
    if (c.number === target.number) continue;
    for (const v of c.verses) {
      const k = normSanskrit(v.sanskrit).slice(0, 40);
      if (k.length >= 12) elsewhere.add(k);
    }
  }
  const suspect = new Set<number>();
  for (const v of target.verses) {
    if (elsewhere.has(normSanskrit(v.sanskrit).slice(0, 40))) suspect.add(Number(v.number));
  }
  return suspect;
}

function readJson<T>(file: string, fallback: T): T {
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as T) : fallback;
}

/* ── Prompt ────────────────────────────────────────────────────────── */

/**
 * Up to two strong hand-written entries from this scripture, as voice
 * references for व्याख्या and जीवन की सीख only. Their विज्ञान is deliberately
 * left out: existing entries name researchers and quote statistics
 * ("David Chalmers, 1995", "1.1 करोड़ बिट्स"), which the rules forbid, and
 * the model follows examples more closely than instructions.
 */
function pickExemplars(human: HumanCommentary): string {
  const deva = /[ऀ-ॿ]/;
  const good = Object.entries(human)
    .filter(([, e]) => e.explanation && e.lifeLesson && deva.test(e.explanation) && deva.test(e.lifeLesson))
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(0, 2);
  if (good.length === 0) return '';
  return good
    .map(
      ([key, e]) =>
        `<example verse="${key}">\n<explanation>${e.explanation}</explanation>\n<lifeLesson>${e.lifeLesson}</lifeLesson>\n</example>`,
    )
    .join('\n');
}

function systemPrompt(scriptureTitle: string, exemplars: string): string {
  return `You write Hindi commentary for Dharma Granth, a free site where general Hindi-speaking readers study ${scriptureTitle} verse by verse. Your drafts are reviewed by a human editor before anyone sees them.

For each verse, write in natural, respectful, clear Hindi (Devanagari), as a thoughtful teacher would explain it to an interested adult who is not a Sanskrit scholar. Keep important Sanskrit terms in Devanagari with a brief meaning the first time they appear.

Register and tone: this is a scripture library, so write the dignified, tatsam-leaning Hindi of a Gita Press commentary, never colloquial or conversational Hindi. Prefer Sanskrit-origin words over Urdu-Persian or English ones where a natural equivalent exists (वस्तु not चीज़, आवश्यकता not ज़रूरत, मूल्य not कीमत, उचित/अनुचित not सही/गलत, विश्वास not भरोसा, उत्पन्न not पैदा, स्मरण not याद), and use no English words or slang idioms. Speak of the divine and revered figures with honorifics and plural verbs (भगवान श्रीकृष्ण कहते हैं, संजय बताते हैं, ईश्वर विराजमान हैं, व्यास जी). Describe flawed conduct in the verse's own terms without insulting words, and never belittle any community, tradition or practice.

Depth and feeling: write as a profound, deeply experienced teacher who has lived with this text for a lifetime, not as a summariser. Open the inner world of the verse: the bhava of the speaker and the listener, the emotion carried by its key words, what the moment feels like within the story, and how that feeling resonates in a reader's own heart. Let the analysis be beautiful and unhurried, so the reader feels the verse and does not only understand it, while staying faithful to the text and never inventing events, quotations or sentiment the verse does not support. Every feeling must earn its place: no padding, no repeated sentiment, no ornament for its own sake, so that each paragraph either moves the reader or gives them something to carry into their life and the reading never feels like time spent for nothing.

explanation (व्याख्या), about 120–220 words: what the verse says and means, where it sits in the chapter's argument or story, and the key terms. Where major traditional commentators read it differently (for example Advaita vs. Vishishtadvaita), say so briefly. Do not invent quotations, commentator statements, or citations; describe positions in your own words.

science (वैज्ञानिक दृष्टिकोण), about 60–140 words, or an empty string: only when there is a genuine, well-established parallel in psychology, neuroscience, medicine, ecology, or another field. Frame it as a parallel or resonance, never as proof that the scripture is scientifically validated, and say plainly when evidence is mostly correlational. Do not name specific studies, researchers, statistics, or dates. No quantum mysticism or other pseudo-science. Many verses (narrative, ritual, genealogy, praise) have no honest parallel — return an empty string for those rather than forcing one; an empty field is better than a weak one.

lifeLesson (जीवन की सीख), 1–3 sentences: one practical, specific way a reader could apply the teaching today.

confidence and reviewNote: the Sanskrit you are given comes from digitised sources and may contain errors, or may not match its translation. If something looks wrong or you are unsure of the reading, set confidence to "low" or "medium" and explain in reviewNote (in English, for the editor). Otherwise confidence "high" and reviewNote "".
${exemplars ? `\nThese hand-written entries show the voice the editors want for explanation and lifeLesson (science is governed only by the rules above):\n${exemplars}` : ''}`;
}

function versePrompt(chapter: Chapter, v: Verse, neighbours: Verse[]): string {
  const context = neighbours
    .map((n) => `  ${chapter.number}.${n.number}: ${n.translation ?? n.hindi ?? ''}`.trimEnd())
    .join('\n');
  return [
    `Chapter ${chapter.number}${chapter.title ? ` — ${chapter.title}` : ''}${chapter.titleSanskrit ? ` (${chapter.titleSanskrit})` : ''}`,
    `Verse ${chapter.number}.${v.number}`,
    `Sanskrit:\n${v.sanskrit ?? '(missing)'}`,
    v.transliteration ? `Transliteration:\n${v.transliteration}` : '',
    v.hindi ? `Existing Hindi meaning:\n${v.hindi}` : '',
    v.translation ? `Existing English translation:\n${v.translation}` : '',
    context ? `Neighbouring verses (for context only):\n${context}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

/* ── Main ──────────────────────────────────────────────────────────── */

async function main(): Promise<void> {
  const { scripture, chapter: chapterNo, verses: only, dryRun, force } = parseArgs();
  const meta = scriptureCatalog.find((s) => s.id === scripture);
  if (!meta) throw new Error(`Unknown scripture: ${scripture}`);

  const chapters = loadChapters(scripture);
  const chapter = chapters.find((c) => Number(c.number) === chapterNo);
  if (!chapter) throw new Error(`${scripture} has no chapter ${chapterNo}`);

  const suspect = integrityCheck(scripture, chapters, chapter);
  const human = readJson<HumanCommentary>(path.join(HUMAN_DIR, `${scripture}.json`), {});
  const queueFile = path.join(QUEUE_DIR, `${scripture}.json`);
  const queue = readJson<Record<string, QueuedCommentary>>(queueFile, {});

  const todo = chapter.verses.filter((v) => {
    const n = Number(v.number);
    const key = `${chapterNo}:${n}`;
    if (only && !only.has(n)) return false;
    if (suspect.has(n)) {
      console.warn(`skip ${key}: its Sanskrit also appears in another chapter (misplaced verse?)`);
      return false;
    }
    if (!v.sanskrit?.trim()) {
      console.warn(`skip ${key}: no Sanskrit text`);
      return false;
    }
    if (!force && human[key]?.explanation) return false; // hand-written already
    if (!force && queue[key]) return false; // already drafted
    return true;
  });

  const system = systemPrompt(meta.title, pickExemplars(human));
  console.log(`${scripture} ch ${chapterNo}: ${todo.length} verse(s) to draft (${suspect.size} suspect skipped)`);

  if (dryRun) {
    const v = todo[0];
    if (v) {
      const i = chapter.verses.indexOf(v);
      console.log('\n=== SYSTEM ===\n' + system);
      console.log('\n=== USER ===\n' + versePrompt(chapter, v, chapter.verses.slice(Math.max(0, i - 2), i)));
    }
    return;
  }

  const client = new Anthropic();
  fs.mkdirSync(QUEUE_DIR, { recursive: true });
  let inTok = 0;
  let outTok = 0;
  let cacheRead = 0;

  for (const v of todo) {
    const key = `${chapterNo}:${Number(v.number)}`;
    const i = chapter.verses.indexOf(v);
    try {
      const response = await client.beta.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high', format: betaZodOutputFormat(CommentarySchema) },
        // If the primary model declines, the API retries on a fallback model in the same call.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        // The system prompt is identical for every verse, so cache it.
        system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
        messages: [
          { role: 'user', content: versePrompt(chapter, v, chapter.verses.slice(Math.max(0, i - 2), i)) },
        ],
      });

      inTok += response.usage.input_tokens;
      outTok += response.usage.output_tokens;
      cacheRead += response.usage.cache_read_input_tokens ?? 0;

      if (response.stop_reason === 'refusal') {
        console.error(`✗ ${key}: declined (${response.stop_details?.category ?? 'no category'})`);
        continue;
      }
      if (response.stop_reason === 'max_tokens' || !response.parsed_output) {
        console.error(`✗ ${key}: no complete structured output (stop_reason ${response.stop_reason})`);
        continue;
      }

      queue[key] = {
        ...response.parsed_output,
        status: 'pending',
        model: response.model,
        generatedAt: new Date().toISOString(),
        sanskrit: v.sanskrit ?? '',
      };
      // Write after every verse so an interrupted run keeps its progress.
      const sorted = Object.fromEntries(
        Object.entries(queue).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })),
      );
      fs.writeFileSync(queueFile, JSON.stringify(sorted, null, 2) + '\n');
      console.log(`✓ ${key} (${response.parsed_output.confidence}${response.parsed_output.science ? ', +विज्ञान' : ''})`);
    } catch (err) {
      if (err instanceof Anthropic.AuthenticationError) {
        console.error('No valid API credentials. Set ANTHROPIC_API_KEY and re-run.');
        process.exit(1);
      } else if (err instanceof Anthropic.APIError) {
        console.error(`✗ ${key}: API error ${err.status}: ${err.message}`);
      } else {
        throw err;
      }
    }
  }

  console.log(`\nTokens — input ${inTok}, cached input read ${cacheRead}, output ${outTok}`);
  console.log(`Review: ${path.relative(process.cwd(), queueFile)} (set "status": "approved" to publish)`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
