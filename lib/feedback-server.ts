/**
 * The clarity-feedback collector, written against standard Request and
 * Response and a tiny key-value interface so it runs as a Cloudflare Pages
 * Function (functions/api/feedback.ts) and in tests. It stores one counter
 * per verse, rating and reason. It never stores or reads the caller's address,
 * headers (apart from the editor token on reads), cookies or any text.
 *
 * Because it will not look at who is calling, it cannot limit one caller. It
 * keeps two shared daily budgets instead (see DAILY_* below), so a script
 * cannot run up the store or bury real answers under invented verses. Limiting
 * a single caller is Cloudflare's job: see docs/feedback-collection.md.
 */
import { REASON_LABELS, parseSubmission, type VerseFeedback } from './feedback-protocol';

export interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  list(options: { prefix?: string; cursor?: string }): Promise<{ keys: Array<{ name: string }>; list_complete: boolean; cursor?: string }>;
}

export interface Env {
  FEEDBACK?: KV;
  EDITORIAL_TOKEN?: string;
}

const MAX_BODY = 1024;
const MAX_KEYS = 2000;

/** Answers accepted per UTC day, across all readers and verses. */
export const DAILY_SUBMISSION_LIMIT = 300;
/** Of those, how many may start a counter that did not exist before (a new verse, or a new rating on one). */
export const DAILY_NEW_COUNTER_LIMIT = 50;
/** Budget counters delete themselves after two days. */
const BUDGET_TTL_SECONDS = 2 * 24 * 60 * 60;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/** Compares without stopping at the first difference. */
export function sameToken(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

async function bump(kv: KV, key: string): Promise<void> {
  const n = Number((await kv.get(key)) ?? '0');
  await kv.put(key, String((Number.isFinite(n) ? n : 0) + 1));
}

/**
 * Takes one unit from a shared budget and says whether there was one left.
 * The store has no atomic increment, so a burst of simultaneous requests can
 * overshoot a little; this is a ceiling on sustained abuse, not an exact count.
 */
async function spend(kv: KV, key: string, limit: number): Promise<boolean> {
  const used = Number((await kv.get(key)) ?? '0') || 0;
  if (used >= limit) return false;
  await kv.put(key, String(used + 1), { expirationTtl: BUDGET_TTL_SECONDS });
  return true;
}

function pausedUntilTomorrow(now: Date): Response {
  const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return new Response(JSON.stringify({ error: 'Feedback sharing is paused until tomorrow. Nothing was sent.' }), {
    status: 429,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      'retry-after': String(Math.max(1, Math.ceil((tomorrow - now.getTime()) / 1000))),
    },
  });
}

export async function handleFeedback(req: Request, env: Env, now: Date = new Date()): Promise<Response> {
  if (req.method === 'POST') {
    if (!env.FEEDBACK) return json({ error: 'Feedback collection is not configured.' }, 503);
    const text = await req.text();
    if (text.length > MAX_BODY) return json({ error: 'Too large.' }, 413);
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: 'Invalid JSON.' }, 400);
    }
    const sub = parseSubmission(body);
    if (!sub) return json({ error: 'Invalid submission.' }, 400);

    // Both budgets are checked before the answer is counted, so a refused answer adds nothing to any verse.
    const day = now.toISOString().slice(0, 10);
    const ratingKey = `fb:${sub.refKey}:r:${sub.rating}`;
    if (!(await spend(env.FEEDBACK, `rl:day:${day}`, DAILY_SUBMISSION_LIMIT))) return pausedUntilTomorrow(now);
    const startsCounter = (await env.FEEDBACK.get(ratingKey)) === null;
    if (startsCounter && !(await spend(env.FEEDBACK, `rl:new:${day}`, DAILY_NEW_COUNTER_LIMIT))) return pausedUntilTomorrow(now);

    await bump(env.FEEDBACK, ratingKey);
    for (const reason of sub.reasons) await bump(env.FEEDBACK, `fb:${sub.refKey}:w:${reason}`);
    return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  }

  if (req.method === 'GET') {
    // Reading is for editors. Without a configured token the endpoint does not exist.
    if (!env.EDITORIAL_TOKEN || !env.FEEDBACK) return json({ error: 'Not found.' }, 404);
    const given = req.headers.get('x-editorial-token') ?? '';
    if (!sameToken(given, env.EDITORIAL_TOKEN)) return json({ error: 'Unauthorized.' }, 401);
    const byRef = new Map<string, VerseFeedback>();
    let cursor: string | undefined;
    let seen = 0;
    do {
      const page = await env.FEEDBACK.list({ prefix: 'fb:', cursor });
      for (const { name } of page.keys) {
        if (++seen > MAX_KEYS) break;
        // Reason ids may contain a hyphen (source-concern).
        const m = /^fb:(.+):(r|w):([a-z-]+)$/.exec(name);
        if (!m) continue;
        const [, refKey, kind, what] = m;
        const n = Number((await env.FEEDBACK.get(name)) ?? '0') || 0;
        const row = byRef.get(refKey) ?? { refKey, yes: 0, partly: 0, no: 0, reasons: {} };
        if (kind === 'r' && (what === 'yes' || what === 'partly' || what === 'no')) row[what] = n;
        else if (kind === 'w' && REASON_LABELS[what]) row.reasons[what] = n;
        byRef.set(refKey, row);
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor && seen <= MAX_KEYS);
    return json({ verses: Array.from(byRef.values()), truncated: seen > MAX_KEYS });
  }

  return new Response(null, { status: 405, headers: { allow: 'GET, POST' } });
}
