'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  STUDY_PLANS,
  completedStepIds,
  getStudyPlan,
  milestoneLabel,
  planMinutes,
  todayStep,
  type StudyPlan,
  type StudyPlanStep,
} from '@/data/study-plans';
import { useStudyProgress } from '@/lib/useStudyProgress';

const TODAY_LABEL = {
  resume: { hi: 'आज का चरण', en: "Today's step" },
  start: { hi: 'आरम्भिक चरण', en: 'A place to start' },
  next: { hi: 'अगला खुला क्रम', en: 'Next open order' },
} as const;

function formatCompleted(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function StudyPlans() {
  const progress = useStudyProgress();
  const { hydrated, streak, getPathwayProgress, togglePathwayStep, completePathway, recordReading } = progress;
  const today = hydrated ? todayStep(STUDY_PLANS, progress.pathwayProgress) : null;

  function markStep(plan: StudyPlan, stepId: string) {
    if (!hydrated) return;
    const row = getPathwayProgress(plan.id);
    const had = row?.completedSteps.includes(stepId) ?? false;
    // React runs these updaters in order, so completion sees the step just added.
    togglePathwayStep(plan.id, stepId);
    if (!had) {
      recordReading();
      const done = new Set(row?.completedSteps ?? []);
      done.add(stepId);
      if (plan.steps.every((item) => done.has(item.id))) completePathway(plan.id);
    }
  }

  return (
    <section id="study-orders" aria-labelledby="study-orders-title" className="mx-auto max-w-5xl px-5 sm:px-8 mt-10">
      <h2 id="study-orders-title" className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">पढ़ने के क्रम</span>
        <span className="font-normal text-dharma-text-secondary"> · Study orders</span>
      </h2>
      <p lang="hi" className="mt-2 max-w-2xl text-sm leading-relaxed text-dharma-text">
        ग्यारह छोटे क्रम। हर चरण इस साइट का एक मौजूदा पृष्ठ खोलता है। समय अनुमान है। प्रगति इसी ब्राउज़र में रहती है।
      </p>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dharma-text-secondary">
        Eleven short orders. Each step opens a page already on the site. Times are estimates. Progress stays in this browser.
      </p>

      <div className="mt-6 rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-6">
        {!hydrated || !today ? (
          <p lang="hi" className="text-sm text-dharma-text-secondary">इस ब्राउज़र का क्रम पढ़ा जा रहा है।</p>
        ) : today.kind === 'done' ? (
          <div>
            <p lang="hi" className="font-serif text-lg font-bold text-dharma-text">दर्ज क्रम पूरे हैं।</p>
            <p className="mt-1 text-sm text-dharma-text-secondary">Every order on this device is marked complete. Any page can be opened again.</p>
          </div>
        ) : (
          <TodayCard
            kind={today.kind}
            plan={today.plan}
            step={today.step}
            onMark={() => markStep(today.plan, today.step.id)}
          />
        )}

        {hydrated && (
          <div className="mt-4 border-t border-dharma-border pt-4">
            <p lang="hi" className="text-sm text-dharma-text">
              {streak.totalDaysRead === 0
                ? 'इस ब्राउज़र में अभी कोई दिन दर्ज नहीं।'
                : `${streak.totalDaysRead} दिन किसी चरण को पढ़ा हुआ चिह्नित किया गया।`}
              {streak.currentStreak >= 2 ? ` लगातार ${streak.currentStreak} दिन।` : ''}
            </p>
            <p lang="hi" className="mt-1 text-xs leading-relaxed text-dharma-text-secondary">
              यह गिनती इसी ब्राउज़र में रहती है। जो चरण चिह्नित हैं, वे बने रहते हैं। बीच का दिन लगातार वाली गिनती को एक पर लाता है।
            </p>
            <p className="mt-1 text-xs leading-relaxed text-dharma-text-secondary">
              Stored on this device. Steps already marked stay marked. A gap returns the running count to one.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-6">
        {STUDY_PLANS.map((plan) => {
          const row = hydrated ? getPathwayProgress(plan.id) : undefined;
          const doneIds = completedStepIds(plan, row?.completedSteps);
          const mark = hydrated ? milestoneLabel(doneIds.length, plan.steps.length) : null;
          const next = plan.nextPlanId ? getStudyPlan(plan.nextPlanId) : undefined;
          return (
            <article
              key={plan.id}
              id={plan.id}
              className="scroll-mt-24 rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-dharma-text">
                    <span lang="hi" className="font-devanagari">{plan.titleHi}</span>
                    <span className="font-normal text-dharma-text-secondary"> · {plan.titleEn}</span>
                  </h3>
                  <p lang="hi" className="mt-1 text-sm leading-relaxed text-dharma-text">{plan.blurbHi}</p>
                  <p className="mt-1 text-sm leading-relaxed text-dharma-text-secondary">{plan.blurbEn}</p>
                </div>
                <p className="rounded-full border border-dharma-border bg-dharma-bg px-3 py-1 text-xs text-dharma-text-secondary">
                  <span lang="hi">लगभग {planMinutes(plan)} मिनट</span>
                  <span> · estimate</span>
                </p>
              </div>

              <p className="mt-3 text-sm text-dharma-text">
                {hydrated ? (
                  <span lang="hi">{doneIds.length} / {plan.steps.length} चरण</span>
                ) : (
                  <span lang="hi" className="text-dharma-text-secondary">गिनती लोड हो रही है</span>
                )}
                {mark === 'half' && <span lang="hi" className="ml-2 text-dharma-text-secondary">· आधा क्रम</span>}
                {mark === 'complete' && <span lang="hi" className="ml-2">· यह मार्ग पूरा हुआ</span>}
                {mark === 'complete' && row?.completedAt && (
                  <span className="ml-2 text-dharma-text-secondary">{formatCompleted(row.completedAt)}</span>
                )}
              </p>

              <ol className="mt-4 space-y-3">
                {plan.steps.map((item, index) => (
                  <StepRow
                    key={item.id}
                    index={index}
                    step={item}
                    marked={doneIds.includes(item.id)}
                    ready={hydrated}
                    onMark={() => markStep(plan, item.id)}
                  />
                ))}
              </ol>

              {mark === 'complete' && next && (
                <p className="mt-4 text-sm">
                  <a href={`#${next.id}`} className="focus-ring inline-flex min-h-[44px] items-center gap-1 font-semibold text-dharma-text underline">
                    <span lang="hi">इसी पृष्ठ पर अगला क्रम: {next.titleHi}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TodayCard({
  kind,
  plan,
  step,
  onMark,
}: {
  kind: 'resume' | 'start' | 'next';
  plan: StudyPlan;
  step: StudyPlanStep;
  onMark: () => void;
}) {
  const label = TODAY_LABEL[kind];
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-dharma-text-secondary">
        <span lang="hi" className="normal-case tracking-normal">{label.hi}</span>
        <span> · {label.en}</span>
      </p>
      <p className="mt-2 font-serif text-lg font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">{plan.titleHi}</span>
        <span className="font-normal text-dharma-text-secondary"> · {step.titleHi}</span>
      </p>
      <p lang="hi" className="mt-1 text-sm text-dharma-text">{step.noteHi}</p>
      <p className="mt-1 text-sm text-dharma-text-secondary">{step.noteEn}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={step.href}
          className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-xl bg-saffron-600 px-4 text-sm font-semibold text-white"
        >
          <span lang="hi">पृष्ठ खोलें</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={onMark}
          className="focus-ring inline-flex min-h-[44px] items-center rounded-xl border border-dharma-border bg-dharma-bg px-4 text-sm font-semibold text-dharma-text"
        >
          <span lang="hi">पढ़ लिया</span>
        </button>
      </div>
    </div>
  );
}

function StepRow({
  index,
  step,
  marked,
  ready,
  onMark,
}: {
  index: number;
  step: StudyPlanStep;
  marked: boolean;
  ready: boolean;
  onMark: () => void;
}) {
  return (
    <li className="rounded-2xl border border-dharma-border bg-dharma-bg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-dharma-text">
            <span className="mr-2 text-dharma-text-secondary">{index + 1}.</span>
            <span lang="hi" className="font-devanagari">{step.titleHi}</span>
            <span className="font-normal text-dharma-text-secondary"> · {step.titleEn}</span>
          </p>
          <p lang="hi" className="mt-1 text-xs leading-relaxed text-dharma-text">{step.noteHi}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-dharma-text-secondary">
            {step.noteEn} <span lang="hi">लगभग {step.minutes} मिनट।</span>
          </p>
        </div>
        {marked && <CheckCircle2 className="h-4 w-4 shrink-0 text-dharma-text-secondary" aria-hidden="true" />}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={step.href}
          className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-dharma-border px-3 text-xs font-semibold text-dharma-text"
        >
          <span lang="hi">पृष्ठ खोलें</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          onClick={onMark}
          disabled={!ready}
          aria-pressed={marked}
          className="focus-ring inline-flex min-h-[44px] items-center rounded-lg border border-dharma-border px-3 text-xs font-semibold text-dharma-text disabled:text-dharma-text-secondary"
        >
          <span lang="hi">{marked ? 'चिह्न हटाएँ' : 'पढ़ लिया'}</span>
        </button>
      </div>
    </li>
  );
}
