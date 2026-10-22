'use client';

import { useEffect, useState } from 'react';
import { readActivity, weeklySummary } from '@/lib/activity-log';

const KEY = 'dharma.weeklyGoal';
const DAYS = [1, 2, 3, 4, 5, 6, 7];

/** A reader-set count of active days for this local week. No score and no streak warning. */
export function WeeklyGoal() {
  const [goal, setGoal] = useState(3);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(KEY));
      if (saved >= 1 && saved <= 7) setGoal(saved);
    } catch {
      /* this browser blocked storage */
    }
    setActive(weeklySummary(readActivity()).activeDays);
    setReady(true);
  }, []);

  function choose(next: number) {
    setGoal(next);
    try {
      window.localStorage.setItem(KEY, String(next));
    } catch {
      /* this browser blocked storage */
    }
  }

  if (!ready) return null;

  return (
    <section aria-labelledby="week-goal" className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
      <h2 id="week-goal" className="font-serif text-xl font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">इस सप्ताह का लक्ष्य</span>
      </h2>
      <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
        {active >= goal
          ? 'इस सप्ताह का लक्ष्य पूरा हुआ।'
          : `इस सप्ताह का लक्ष्य: ${goal} दिन। अभी ${active} दिन।`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Days to read this week">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => choose(day)}
            aria-pressed={day === goal}
            className={`min-h-[44px] min-w-[44px] rounded-xl border px-3 text-sm font-semibold ${
              day === goal
                ? 'border-saffron-600 bg-dharma-bg text-dharma-text'
                : 'border-dharma-border bg-dharma-card text-dharma-text-secondary'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </section>
  );
}
