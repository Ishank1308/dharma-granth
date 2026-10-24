'use client';

import { useState } from 'react';

/**
 * Reflection Experience (Phase 4) + Digital Wellbeing (Phase 5).
 * No feed, no autoplay, no streaks. A pause, a question, a breath, one action.
 */
export function ReflectionBlock({
  questions,
  prompts,
}: {
  questions: Array<{ en: string; hi: string }>;
  prompts: Array<{ en: string; hi: string }>;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-label="Pause and reflect" className="rounded-2xl border border-dharma-line bg-dharma-card p-5 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">Pause and reflect</p>
      <h2 className="mt-1 font-serif text-xl text-dharma-text">Contemplation, not consumption</h2>
      <p className="mt-2 text-sm leading-relaxed text-dharma-muted">
        Read slowly. There is no feed here. Sit with one question, take three slow breaths, and choose one small action for today.
      </p>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        className="mt-4 rounded-full border border-dharma-line px-4 py-2 text-sm font-semibold text-dharma-text"
      >
        {paused ? 'Resume reading' : 'Pause for a minute'}
      </button>
      {paused && (
        <p className="mt-3 text-sm text-dharma-muted">Breathe in… breathe out… let the verse settle before continuing.</p>
      )}
      <div className="mt-5 space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="rounded-xl bg-dharma-bg p-4">
            <p className="text-sm font-semibold text-dharma-text">{q.en}</p>
            <p lang="hi" className="mt-1 text-sm text-dharma-muted">{q.hi}</p>
          </div>
        ))}
        {prompts.map((q, i) => (
          <div key={`p-${i}`} className="rounded-xl bg-dharma-bg p-4">
            <p className="text-sm text-dharma-text">{q.en}</p>
            <p lang="hi" className="mt-1 text-sm text-dharma-muted">{q.hi}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
