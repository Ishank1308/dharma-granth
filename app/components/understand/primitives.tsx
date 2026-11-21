'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Info,
  MessageCircle,
  ScrollText,
  Sun,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { EXAMPLE_CONTEXT_LABELS, type ContextStep, type UnderstandingExtras } from '@/data/understanding';

/* ── Content labels (spec §12) ───────────────────────────────────────────
 * Every block says what it is. Editorial and modern content never borrows
 * the amber "scripture" frame that the verse itself uses.
 */

export type LabelKind = 'simple' | 'modern' | 'practical' | 'traditional' | 'editorial';

const LABELS: Record<LabelKind, { en: string; hi: string; cls: string }> = {
  simple: { en: 'Simple explanation', hi: 'सरल व्याख्या', cls: 'border-indigo-500/40 bg-indigo-50 text-indigo-950 dark:bg-indigo-950/50 dark:text-indigo-100' },
  modern: { en: 'Modern example · not scripture', hi: 'आधुनिक उदाहरण', cls: 'border-sky-500/40 bg-sky-50 text-sky-950 dark:bg-sky-950/50 dark:text-sky-100' },
  practical: { en: 'Practical reflection · optional', hi: 'व्यावहारिक चिंतन', cls: 'border-emerald-500/40 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100' },
  traditional: { en: 'Traditional commentary', hi: 'परम्परागत भाष्य', cls: 'border-yellow-700/40 bg-yellow-50 text-yellow-950 dark:bg-yellow-950/40 dark:text-yellow-100' },
  editorial: { en: 'Editorial learning aid · not scripture', hi: 'संपादकीय अध्ययन-सहायक', cls: 'border-stone-500/40 bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100' },
};

export function LabelChip({ kind }: { kind: LabelKind }) {
  const l = LABELS[kind];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${l.cls}`}>
      {l.en}
      <span aria-hidden="true" className="mx-1 opacity-50">·</span>
      <span lang="hi" className="font-devanagari normal-case tracking-normal">{l.hi}</span>
    </span>
  );
}

/* ── Explanation card (spec §3) ─────────────────────────────────────────
 * Icons are supporting cues: every card keeps a visible text heading.
 */

export type CardKind = 'oneLine' | 'simple' | 'why' | 'example' | 'notMean' | 'try' | 'reflect' | 'commentary';

const CARDS: Record<CardKind, { Icon: LucideIcon; frame: string; icon: string }> = {
  oneLine: { Icon: Zap, frame: 'border-saffron-500/40 bg-saffron-50/70 dark:bg-saffron-950/25', icon: 'text-saffron-700 dark:text-saffron-300' },
  simple: { Icon: BookOpen, frame: 'border-indigo-500/30 bg-indigo-50/60 dark:bg-indigo-950/20', icon: 'text-indigo-700 dark:text-indigo-300' },
  why: { Icon: Compass, frame: 'border-teal-600/30 bg-teal-50/60 dark:bg-teal-950/20', icon: 'text-teal-700 dark:text-teal-300' },
  example: { Icon: Sun, frame: 'border-sky-500/30 bg-sky-50/60 dark:bg-sky-950/20', icon: 'text-sky-700 dark:text-sky-300' },
  notMean: { Icon: Info, frame: 'border-amber-600/30 bg-amber-50/60 dark:bg-amber-950/20', icon: 'text-amber-800 dark:text-amber-300' },
  try: { Icon: CheckCircle2, frame: 'border-green-700/30 bg-green-50/60 dark:bg-green-950/20', icon: 'text-green-800 dark:text-green-300' },
  reflect: { Icon: MessageCircle, frame: 'border-violet-500/30 bg-violet-50/60 dark:bg-violet-950/20', icon: 'text-violet-700 dark:text-violet-300' },
  commentary: { Icon: ScrollText, frame: 'border-yellow-700/35 bg-yellow-50/60 dark:bg-yellow-950/20', icon: 'text-yellow-800 dark:text-yellow-300' },
};

export function ExplainCard({
  kind,
  title,
  titleHi,
  label,
  children,
}: {
  kind: CardKind;
  title: string;
  titleHi?: string;
  label?: LabelKind;
  children: ReactNode;
}) {
  const c = CARDS[kind];
  const id = useId();
  return (
    <section aria-labelledby={id} className={`understand-fade rounded-2xl border p-4 sm:p-5 ${c.frame}`}>
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 id={id} className="flex items-center gap-2 font-serif text-base font-bold text-dharma-text">
          <c.Icon className={`h-4 w-4 shrink-0 ${c.icon}`} aria-hidden="true" />
          {title}
          {titleHi && (
            <span lang="hi" className="font-devanagari text-sm font-semibold text-dharma-muted">
              {titleHi}
            </span>
          )}
        </h3>
        {label && <LabelChip kind={label} />}
      </div>
      <div className="space-y-2 text-[0.95rem] leading-relaxed text-dharma-text">{children}</div>
    </section>
  );
}

/* ── Teaching flow (spec §4) ────────────────────────────────────────────
 * The visual is decorative (aria-hidden). The plain-text version is a real
 * ordered list that screen readers always get, and sighted readers can pick
 * it with "Show as text".
 */

export function TeachingFlow({ steps }: { steps: NonNullable<UnderstandingExtras['teachingFlow']> }) {
  const [asText, setAsText] = useState(false);
  const sentence = steps.map((s) => `${s.label} ${s.detail}`).join(' Then: ');
  return (
    <section aria-label="Teaching flow" className="understand-fade rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-base font-bold text-dharma-text"><span data-bi="en">Teaching flow</span> <span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-sm font-semibold text-dharma-muted">शिक्षा का क्रम</span></h3>
        <button
          type="button"
          onClick={() => setAsText((v) => !v)}
          aria-pressed={asText}
          className="focus-ring min-h-[44px] rounded-lg px-3 text-sm font-semibold text-saffron-800 hover:underline dark:text-saffron-300"
        >
          {asText ? 'Show as diagram' : 'Show as text'}
        </button>
      </div>

      {asText ? (
        <ol className="list-decimal space-y-2 pl-5 text-[0.95rem] text-dharma-text">
          {steps.map((s) => (
            <li key={s.label}>
              <strong>{s.label}</strong> {s.detail}
            </li>
          ))}
        </ol>
      ) : (
        <>
          <div aria-hidden="true" className="flex flex-col items-stretch gap-1 lg:flex-row lg:items-stretch lg:gap-2">
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-col items-stretch gap-1 lg:flex-1 lg:flex-row lg:gap-2">
                <div className="flex-1 rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2.5">
                  <p className="text-sm font-bold text-dharma-text">{s.label}</p>
                  <p className="mt-0.5 text-sm text-dharma-muted">{s.detail}</p>
                </div>
                {i < steps.length - 1 && (
                  <>
                    <ArrowDown className="mx-auto h-4 w-4 shrink-0 self-center text-saffron-700 lg:hidden" />
                    <ArrowRight className="hidden h-4 w-4 shrink-0 self-center text-saffron-700 lg:block" />
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="sr-only">{`Teaching flow in order. ${sentence}`}</p>
        </>
      )}
    </section>
  );
}

/* ── Before and after (spec §5) ─────────────────────────────────────────
 * Neutral framing: the "before" is an understandable thought, not a flaw.
 */

export function BeforeAfter({ before, after }: { before: string; after: string }) {
  return (
    <section aria-label="Before and after understanding" className="understand-fade rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="font-serif text-base font-bold text-dharma-text">A shift in understanding</h3>
        <LabelChip kind="editorial" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="rounded-xl border border-dharma-border bg-dharma-bg p-3.5">
          <figcaption className="mb-1 text-xs font-semibold uppercase tracking-wide text-dharma-muted">A common first thought</figcaption>
          <blockquote className="text-[0.95rem] italic text-dharma-text">“{before}”</blockquote>
        </figure>
        <figure className="rounded-xl border border-teal-600/30 bg-teal-50/60 p-3.5 dark:bg-teal-950/20">
          <figcaption className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">With this teaching</figcaption>
          <blockquote className="text-[0.95rem] text-dharma-text">“{after}”</blockquote>
        </figure>
      </div>
    </section>
  );
}

/* ── Common misunderstanding (spec §8) ───────────────────────────────────
 * Neutral blue/amber, no alarm colours, respectful wording.
 */

export function Misunderstanding({ claim, better }: { claim: string; better: string }) {
  return (
    <section aria-label="Common misunderstanding" className="understand-fade rounded-2xl border border-amber-600/30 bg-amber-50/60 p-4 dark:bg-amber-950/20 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold text-dharma-text">
          <Info className="h-4 w-4 text-amber-800 dark:text-amber-300" aria-hidden="true" />
          <span data-bi="en">Common misunderstanding</span>
          <span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-sm font-semibold text-dharma-muted">आम भ्रांति</span>
        </h3>
        <LabelChip kind="editorial" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-dharma-muted">Some readers take it to mean</p>
      <p className="mb-3 mt-0.5 text-[0.95rem] italic text-dharma-text">“{claim}”</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-300">A fuller reading</p>
      <p className="mt-0.5 text-[0.95rem] text-dharma-text">{better}</p>
    </section>
  );
}

/* ── Context timeline (spec §7) ─────────────────────────────────────── */

export function ContextTimeline({
  steps,
  previousHref,
  passageHref,
  nextHref,
  dialogue,
}: {
  steps: ContextStep[];
  dialogue?: { speaker: string; listener: string; situation: string; question: string };
  previousHref?: string;
  passageHref?: string;
  nextHref?: string;
}) {
  const link = 'focus-ring inline-flex min-h-[44px] items-center rounded-xl border border-dharma-border bg-dharma-card px-3.5 text-sm font-semibold text-dharma-text transition hover:border-saffron-400';
  return (
    <section aria-label="Where this verse sits" className="understand-fade rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="font-serif text-base font-bold text-dharma-text">
          <span data-bi="en">Where this verse sits</span> <span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-sm font-semibold text-dharma-muted">प्रसंग</span>
        </h3>
        <LabelChip kind="editorial" />
      </div>
      {dialogue && (
        <dl className="mb-4 grid gap-x-4 gap-y-1.5 rounded-xl border border-dharma-border bg-dharma-bg p-3.5 text-sm sm:grid-cols-[8rem_1fr]">
          {(
            [
              ['Who is speaking?', dialogue.speaker],
              ['Who is listening?', dialogue.listener],
              ['What is happening?', dialogue.situation],
              ['What is being answered?', dialogue.question],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-semibold text-dharma-muted">{k}</dt>
              <dd className="text-dharma-text">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {(() => {
        const at = steps.findIndex((s) => s.current);
        const groups: Array<[string, ContextStep[]]> =
          at < 0
            ? [['', steps]]
            : [
                ['Before this verse', steps.slice(0, at)],
                ['This verse', [steps[at]]],
                ['After this verse', steps.slice(at + 1)],
              ];
        return groups
          .filter(([, g]) => g.length > 0)
          .map(([title, g]) => (
            <div key={title || 'all'} className="mb-3 last:mb-0">
              {title && <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-dharma-muted">{title}</h4>}
              <ol className="relative space-y-3 border-l-2 border-dharma-border pl-5">
                {g.map((s, i) => (
                  <li key={i} aria-current={s.current ? 'step' : undefined} className="relative text-[0.95rem] text-dharma-text">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full border-2 ${s.current ? 'border-saffron-700 bg-saffron-600' : 'border-dharma-border bg-dharma-bg'}`}
                    />
                    {s.text}
                  </li>
                ))}
              </ol>
            </div>
          ));
      })()}
      <div className="mt-4 flex flex-wrap gap-2">
        {previousHref && <Link href={previousHref} className={link}>Read previous verse</Link>}
        {passageHref && <Link href={passageHref} className={link}>Read full passage</Link>}
        {nextHref && <Link href={nextHref} className={link}>Continue the conversation</Link>}
      </div>
    </section>
  );
}

/* ── Verse in 30 seconds (spec §11) ─────────────────────────────────── */

export function Verse30({ data }: { data: UnderstandingExtras['thirtySeconds'] }) {
  const rows: Array<[string, string]> = [
    ['Situation', data.situation],
    ['Teaching', data.teaching],
    ['Clarification', data.clarification],
    ['Try', data.tryThis],
  ];
  return (
    <section aria-labelledby="v30-h" className="understand-fade rounded-2xl border border-saffron-500/40 bg-saffron-50/70 p-4 dark:bg-saffron-950/25 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 id="v30-h" className="font-serif text-base font-bold uppercase tracking-wide text-dharma-text">Verse in 30 seconds</h3>
        <LabelChip kind="editorial" />
      </div>
      <p className="-mt-1 mb-3 text-xs text-dharma-muted">Simplified editorial explanation · not a translation and not part of the scripture.</p>
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[7rem_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-sm font-bold text-saffron-900 dark:text-saffron-200">{k}</dt>
            <dd className="text-[0.95rem] text-dharma-text">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Modern example tabs (spec §9) ──────────────────────────────────────
 * Roving tabindex, arrow keys, only the contexts the verse really supports.
 */

export function ExampleTabs({ examples }: { examples: NonNullable<UnderstandingExtras['examples']> }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const move = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % examples.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + examples.length) % examples.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = examples.length - 1;
    else return;
    e.preventDefault();
    setActive(n);
    refs.current[n]?.focus();
  };
  const cur = examples[active];
  return (
    <ExplainCard kind="example" title="Modern example" titleHi="आधुनिक उदाहरण" label="modern">
      <div role="tablist" aria-label="Choose a context" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {examples.map((ex, i) => {
          const l = EXAMPLE_CONTEXT_LABELS[ex.context];
          const sel = i === active;
          return (
            <button
              key={ex.context}
              ref={(el) => { refs.current[i] = el; }}
              role="tab"
              id={`${base}-t${i}`}
              aria-selected={sel}
              aria-controls={`${base}-p`}
              tabIndex={sel ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => move(e, i)}
              className={`focus-ring min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-semibold transition ${sel ? 'border-sky-700 bg-sky-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-sky-500'}`}
            >
              {l.en} <span lang="hi" className="font-devanagari text-xs opacity-80">{l.hi}</span>
            </button>
          );
        })}
      </div>
      <p role="tabpanel" id={`${base}-p`} aria-labelledby={`${base}-t${active}`} className="pt-1">
        {cur.text}
      </p>
      <p className="text-xs text-dharma-muted">An illustration written to explain the teaching. No outcome is promised.</p>
    </ExplainCard>
  );
}
