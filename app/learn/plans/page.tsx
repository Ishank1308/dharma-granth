'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Compass,
  GraduationCap,
  HeartHandshake,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { READING_PLANS, type ReadingPlan, type ReadingPlanDay } from '@/data/reading-plans';
import { triggerTactileFeedback } from '@/lib/haptics';
import { ShareLinkButtons } from '@/app/components/ShareLinkButtons';

const STORAGE_KEY = 'dharma.readingPlans.v1';

type PlanProgressMap = Record<string, number[]>; // planId -> completed dayNumbers

export default function ReadingPlansPage() {
  const [activePlanId, setActivePlanId] = useState<string>(READING_PLANS[0].id);
  const [progress, setProgress] = useState<PlanProgressMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors in private mode
    }
    // A shared link ends in #<plan id>; open that plan.
    const shared = window.location.hash.slice(1);
    if (READING_PLANS.some((p) => p.id === shared)) setActivePlanId(shared);
    setIsLoaded(true);
  }, []);

  const saveProgress = useCallback((newMap: PlanProgressMap) => {
    setProgress(newMap);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMap));
    } catch {
      // Ignore storage quota or disabled storage
    }
  }, []);

  const activePlan = useMemo(() => {
    return READING_PLANS.find((p) => p.id === activePlanId) || READING_PLANS[0];
  }, [activePlanId]);

  const completedDays = useMemo(() => {
    return progress[activePlan.id] || [];
  }, [progress, activePlan.id]);

  const toggleDayCompletion = (dayNumber: number) => {
    const isCompleted = completedDays.includes(dayNumber);
    const updated = isCompleted
      ? completedDays.filter((d) => d !== dayNumber)
      : [...completedDays, dayNumber];

    const nextMap = {
      ...progress,
      [activePlan.id]: updated,
    };
    saveProgress(nextMap);
    triggerTactileFeedback('light', 'softTap');
  };

  const resetActivePlanProgress = () => {
    if (typeof window !== 'undefined' && !window.confirm('Reset progress for this reading plan?')) {
      return;
    }
    const nextMap = {
      ...progress,
      [activePlan.id]: [],
    };
    saveProgress(nextMap);
  };

  const completionPercent = Math.round((completedDays.length / Math.max(1, activePlan.totalDays)) * 100);

  // Find first uncompleted day
  const nextUpDay = useMemo(() => {
    return activePlan.days.find((d) => !completedDays.includes(d.dayNumber)) || activePlan.days[0];
  }, [activePlan, completedDays]);

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      {/* ── Header Banner ─────────────────────────────────────── */}
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg dark:from-amber-950/20 py-12 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/learn"
            className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Learning Hub · अध्ययन केंद्र</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-800 dark:text-saffron-300">
              <Calendar className="h-4.5 w-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
              Calm Schedules · स्वाध्याय योजना
            </span>
          </div>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-dharma-text">
            Scripture Reading Plans
          </h1>
          <p className="mt-1 font-devanagari text-xl text-dharma-muted">
            सहज, शांत एवं संरचित अध्ययन समय-सारिणी
          </p>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-dharma-muted max-w-2xl">
            Gentle, structured reading schedules crafted for thoughtful reflection. Take as much time as you need. There are no streaks to lose and zero penalties for missed days.
          </p>

          {/* Privacy & Non-punitive ethos note */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-3.5 py-2 text-xs text-emerald-950 dark:text-emerald-200">
            <HeartHandshake className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Non-punitive design:</strong> Progress is stored solely on your device. Missed days are welcome — resume anytime with a calm mind.
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Content Area ─────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 space-y-8">
        {/* Plan Selector Tabs */}
        <section aria-label="Available reading plans">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {READING_PLANS.map((plan) => {
              const isActive = plan.id === activePlanId;
              const count = (progress[plan.id] || []).length;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setActivePlanId(plan.id)}
                  aria-pressed={isActive}
                  className={`focus-ring relative flex flex-col items-start rounded-2xl border p-5 text-left transition ${
                    isActive
                      ? 'border-saffron-600 bg-dharma-card shadow-md ring-2 ring-saffron-600/20'
                      : 'border-dharma-border bg-dharma-card/60 hover:border-saffron-400 hover:bg-dharma-card'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/30 bg-saffron-50/70 dark:bg-saffron-950/40 px-2.5 py-0.5 text-[11px] font-bold text-saffron-800 dark:text-saffron-300">
                      <Clock className="h-3 w-3" />
                      <span>{plan.dailyMinutes} min/day</span>
                    </span>
                    <span className="text-xs font-semibold text-dharma-muted">
                      {plan.totalDays} Days
                    </span>
                  </div>

                  <h2 className="mt-2.5 font-serif text-lg font-bold text-dharma-text">
                    {plan.title}
                  </h2>
                  <p lang="hi" className="font-devanagari text-sm text-dharma-muted">
                    {plan.titleHi}
                  </p>

                  <p className="mt-2 text-xs text-dharma-muted line-clamp-2 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mt-4 flex w-full items-center justify-between text-xs border-t border-dharma-border/60 pt-3">
                    <span className="text-dharma-muted">
                      {isLoaded ? `${count} of ${plan.totalDays} completed` : 'Loading...'}
                    </span>
                    <span className="font-semibold text-saffron-700 dark:text-saffron-400">
                      {isActive ? 'Current Plan' : 'Select Plan'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Plan Details & Progress Card */}
        <section
          aria-label="Active plan summary"
          className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-xs"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  Active Reading Plan
                </span>
                <span className="text-dharma-muted">·</span>
                <span className="text-xs text-dharma-muted">
                  {activePlan.dailyMinutes} mins daily contemplation
                </span>
              </div>
              <h2 className="mt-1 font-serif text-2xl font-bold text-dharma-text">
                {activePlan.title}
              </h2>
              <p lang="hi" className="font-devanagari text-base text-dharma-muted">
                {activePlan.titleHi}
              </p>
            </div>

            {/* Quick action: jump to next reading */}
            {completedDays.length < activePlan.totalDays && (
              <Link
                href={nextUpDay.href}
                className="focus-ring inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-saffron-800"
              >
                <span>Continue Day {nextUpDay.dayNumber}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-dharma-text/90">
            {activePlan.description}
          </p>

          <ShareLinkButtons
            className="mt-3"
            heading={activePlan.title}
            lines={[activePlan.description, `${activePlan.totalDays} days, about ${activePlan.dailyMinutes} min a day`]}
            path={`/learn/plans/#${activePlan.id}`}
            label={activePlan.title}
          />

          {/* Progress bar */}
          <div className="mt-6 rounded-xl border border-dharma-border/60 bg-dharma-bg/60 p-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-dharma-text">
                Your Progress: {completedDays.length} of {activePlan.totalDays} Days Contemplated
              </span>
              <span className="text-saffron-700 dark:text-saffron-400">
                {completionPercent}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completionPercent}
              className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-dharma-border/70"
            >
              <div
                className="h-full rounded-full bg-saffron-600 transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            {completedDays.length > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={resetActivePlanProgress}
                  className="focus-ring inline-flex items-center gap-1 text-xs font-medium text-dharma-muted hover:text-dharma-text"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset plan progress</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Day-by-Day Reading Schedule */}
        <section aria-label="Reading schedule breakdown">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-dharma-text">
                Day-by-Day Reading Schedule
              </h3>
              <p className="text-xs text-dharma-muted">
                Tap the circle when you have finished reflecting on the day&apos;s chapter or verse.
              </p>
            </div>
            <span className="text-xs text-dharma-muted font-mono">
              {activePlan.days.length} entries
            </span>
          </div>

          <ol className="space-y-3">
            {activePlan.days.map((day) => {
              const isDone = completedDays.includes(day.dayNumber);
              return (
                <li
                  key={day.dayNumber}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition ${
                    isDone
                      ? 'border-emerald-600/30 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-dharma-border bg-dharma-card hover:border-saffron-400/80'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Completion button */}
                    <button
                      type="button"
                      onClick={() => toggleDayCompletion(day.dayNumber)}
                      aria-label={
                        isDone
                          ? `Mark Day ${day.dayNumber} as uncompleted`
                          : `Mark Day ${day.dayNumber} as completed`
                      }
                      className="focus-ring mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-dharma-muted hover:text-saffron-700 transition"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-dharma-muted/60 hover:text-saffron-600" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-dharma-bg px-2 py-0.5 font-mono text-[11px] font-bold text-dharma-muted border border-dharma-border/60">
                          Day {day.dayNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-dharma-muted">
                          <Clock className="h-3 w-3" />
                          <span>~{day.estimatedMinutes} min</span>
                        </span>
                      </div>

                      <div className="mt-1">
                        <span className="font-serif text-base font-bold text-dharma-text">
                          {day.title}
                        </span>
                        <span lang="hi" className="ml-2 font-devanagari text-sm text-dharma-muted">
                          {day.titleHi}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-dharma-muted leading-relaxed">
                        {day.focusTheme}
                        <span lang="hi" className="block sm:inline sm:ml-1 font-devanagari text-dharma-muted/80">
                          ({day.focusThemeHi})
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Link to read scripture */}
                  <div className="flex items-center justify-end sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dharma-border/40">
                    <Link
                      href={day.href}
                      className="focus-ring inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-bg px-3.5 text-xs font-semibold text-dharma-text hover:border-saffron-500 hover:text-saffron-800 dark:hover:text-saffron-300 transition"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-saffron-600" />
                      <span>Read Scripture</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Cross-navigation links */}
        <section
          aria-label="Related scripture resources"
          className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3"
        >
          <Link
            href="/learn/paths"
            className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-saffron-400 hover:shadow-sm transition"
          >
            <Compass className="h-5 w-5 text-saffron-700 dark:text-saffron-300" />
            <h4 className="mt-2 font-serif text-base font-bold text-dharma-text group-hover:text-saffron-800 dark:group-hover:text-saffron-300">
              Guided Reading Paths
            </h4>
            <p className="mt-1 text-xs text-dharma-muted">
              Explore curated sequences across life questions, philosophy, and decision dilemmas.
            </p>
          </Link>

          <Link
            href="/learn/faq"
            className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-saffron-400 hover:shadow-sm transition"
          >
            <GraduationCap className="h-5 w-5 text-saffron-700 dark:text-saffron-300" />
            <h4 className="mt-2 font-serif text-base font-bold text-dharma-text group-hover:text-saffron-800 dark:group-hover:text-saffron-300">
              Scripture FAQs
            </h4>
            <p className="mt-1 text-xs text-dharma-muted">
              Authoritative, sourced clarification on canons, ethics, and philosophical traditions.
            </p>
          </Link>

          <Link
            href="/bookmarks"
            className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-saffron-400 hover:shadow-sm transition"
          >
            <BookOpen className="h-5 w-5 text-saffron-700 dark:text-saffron-300" />
            <h4 className="mt-2 font-serif text-base font-bold text-dharma-text group-hover:text-saffron-800 dark:group-hover:text-saffron-300">
              Personal Sanctuary
            </h4>
            <p className="mt-1 text-xs text-dharma-muted">
              Review your private verse notes, colored theme highlights, and dual JSON/Markdown export.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
