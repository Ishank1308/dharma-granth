'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import { REASON_IDS } from '@/lib/feedback-protocol';

type Rating = 'yes' | 'partly' | 'no';

const REASONS = [
  'Language was difficult',
  'Example was unclear',
  'Explanation was too long',
  'Context was missing',
  'Source was unclear',
  'Vocabulary was not explained',
  'I have a source concern',
  'Possible textual error',
  'Other',
] as const;

export const SHARE_KEY = 'dharma.feedback.share';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export interface FeedbackRecord {
  refKey: string;
  rating: Rating;
  reasons: string[];
  at: string;
}

export const FEEDBACK_KEY = 'dharma.feedback.v1';

function readAll(): Record<string, FeedbackRecord> {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? (JSON.parse(raw) as Record<string, FeedbackRecord>) : {};
  } catch {
    return {};
  }
}

/**
 * "Was this explanation clear?" A small, optional prompt under a simplified
 * explanation. It stores a rating and fixed reasons only (no free text, no
 * identity) in this browser. It is not a channel for textual corrections.
 */
export function ExplanationFeedback({ refKey, reference }: { refKey: string; reference: string }) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [share, setShare] = useState(false);
  const [dnt, setDnt] = useState(false);
  const [shared, setShared] = useState<'no' | 'sent' | 'unavailable'>('no');

  useEffect(() => {
    const prior = readAll()[refKey];
    setRating(prior?.rating ?? null);
    setReasons(prior?.reasons ?? []);
    setSent(Boolean(prior));
    setShared('no');
    try { setShare(localStorage.getItem(SHARE_KEY) === '1'); } catch { /* off */ }
    setDnt(navigator.doNotTrack === '1');
  }, [refKey]);

  function toggleShare(on: boolean) {
    setShare(on);
    try {
      if (on) localStorage.setItem(SHARE_KEY, '1');
      else localStorage.removeItem(SHARE_KEY);
    } catch { /* the choice lasts for this visit */ }
  }

  function save(nextRating: Rating, nextReasons: string[]) {
    const record: FeedbackRecord = { refKey, rating: nextRating, reasons: nextReasons, at: new Date().toISOString() };
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ ...readAll(), [refKey]: record }));
      setStorageOk(true);
    } catch {
      setStorageOk(false);
    }
    setSent(true);
    track('feedback_submitted', { rating: nextRating });
    if (share && !dnt) {
      // Only a verse reference, the rating and fixed reason ids are sent: no text, no identity.
      const reasonIds = nextReasons.map((r) => REASON_IDS[r]).filter(Boolean);
      fetch(`${BASE}/api/feedback`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refKey, rating: nextRating, reasons: reasonIds }), keepalive: true })
        .then((r) => setShared(r.ok ? 'sent' : 'unavailable'))
        .catch(() => setShared('unavailable'));
    }
  }

  function choose(r: Rating) {
    setRating(r);
    if (r === 'yes') {
      setReasons([]);
      save(r, []);
    } else {
      setSent(false);
    }
  }

  function toggleReason(reason: string) {
    setReasons((prev) => (prev.includes(reason) ? prev.filter((x) => x !== reason) : [...prev, reason]));
  }

  const options: Array<{ id: Rating; label: string }> = [
    { id: 'yes', label: 'Yes' },
    { id: 'partly', label: 'Partly' },
    { id: 'no', label: 'No' },
  ];

  return (
    <section aria-labelledby={`fb-${refKey}`} className="rounded-2xl border border-dharma-border/70 bg-dharma-card/50 p-4 text-sm">
      <h3 id={`fb-${refKey}`} className="font-semibold text-dharma-text">
        Was this explanation clear? <span lang="hi" className="font-devanagari font-normal text-dharma-muted">· क्या यह स्पष्ट था?</span>
      </h3>
      <div role="radiogroup" aria-labelledby={`fb-${refKey}`} className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={rating === o.id}
            onClick={() => choose(o.id)}
            className={`focus-ring min-h-[44px] min-w-[72px] rounded-xl border px-4 font-semibold transition ${
              rating === o.id ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {(rating === 'partly' || rating === 'no') && !sent && (
        <fieldset className="mt-3">
          <legend className="text-sm font-semibold text-dharma-muted">What could be better? (optional)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <label key={r} className="focus-within:ring-2 flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm">
                <input type="checkbox" checked={reasons.includes(r)} onChange={() => toggleReason(r)} className="h-4 w-4 accent-saffron-700" />
                {r}
              </label>
            ))}
          </div>
          <button type="button" onClick={() => save(rating, reasons)} className="focus-ring mt-3 min-h-[44px] rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800">
            Send feedback
          </button>
          {reasons.includes('Possible textual error') && (
            <p className="mt-2 text-sm text-dharma-muted">
              Clarity feedback is about how the explanation reads. It does not start a correction to the verse or translation.
            </p>
          )}
        </fieldset>
      )}

      <label className="mt-2 flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-dharma-muted">
        <input type="checkbox" checked={share && !dnt} disabled={dnt} onChange={(e) => toggleShare(e.target.checked)} className="mt-1 h-5 w-5 accent-saffron-700" />
        <span>
          Also share my answers anonymously with the editors, so unclear explanations can be improved. Only the verse, the rating and the reasons you tick are sent: no text, no account, no address.
          {dnt && ' Your browser sends Do Not Track, so sharing is off.'}
        </span>
      </label>
      <p role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-sm text-dharma-muted">
        {sent && storageOk && shared === 'no' && `Thank you. Your answer for ${reference} is saved on this device only; no account or personal details are used.`}
        {sent && storageOk && shared === 'sent' && `Thank you. Your answer for ${reference} is saved on this device and was shared anonymously with the editors.`}
        {sent && storageOk && shared === 'unavailable' && `Thank you. Your answer for ${reference} is saved on this device. Sharing with the editors is not available right now, so nothing was sent.`}
        {sent && !storageOk && 'Thank you. Your browser blocked storage, so this answer was not saved.'}
      </p>
    </section>
  );
}
