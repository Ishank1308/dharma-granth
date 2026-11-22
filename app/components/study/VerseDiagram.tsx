import { ArrowDown, ArrowRight } from 'lucide-react';
import { getVerseDiagrams, type DiagramKind, type VerseDiagramData } from '@/data/verse-diagrams';
import { REVIEW_LABEL } from '@/data/study-content';

type Layout = 'sequence' | 'chain' | 'columns';

const LAYOUT: Record<DiagramKind, Layout> = {
  'control-vs-uncertainty': 'sequence',
  'cause-and-consequence': 'chain',
  'step-by-step': 'chain',
  comparison: 'columns',
  'before-after': 'sequence',
  'concept-relationship': 'columns',
  'narrative-sequence': 'chain',
};

const KIND_LABEL: Record<DiagramKind, string> = {
  'control-vs-uncertainty': 'Control and uncertainty',
  'cause-and-consequence': 'Cause and consequence',
  'step-by-step': 'Step by step',
  comparison: 'Comparison',
  'before-after': 'Before and after understanding',
  'concept-relationship': 'Concept relationship',
  'narrative-sequence': 'Narrative sequence',
};

function Arrow() {
  return (
    <>
      <ArrowDown className="mx-auto h-5 w-5 shrink-0 text-dharma-muted lg:hidden" aria-hidden="true" />
      <ArrowRight className="hidden h-5 w-5 shrink-0 self-center text-dharma-muted lg:block" aria-hidden="true" />
    </>
  );
}

function Diagram({ d }: { d: VerseDiagramData }) {
  const layout = LAYOUT[d.kind];
  const box = 'rounded-xl border border-sky-600/30 bg-sky-50/60 p-3 dark:border-sky-500/25 dark:bg-sky-950/20';
  return (
    <figure aria-labelledby={`${d.id}-t`} className="rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5">
      <figcaption>
        <div className="flex flex-wrap items-center gap-2">
          <h3 id={`${d.id}-t`} className="font-serif text-lg font-bold text-dharma-text">{d.title}</h3>
          <span className="rounded-full border border-sky-600/40 bg-sky-100 px-2 py-0.5 text-sm font-semibold text-sky-950 dark:bg-sky-900/40 dark:text-sky-100">Editorial diagram · not scripture</span>
        </div>
        <p className="mt-1 text-sm text-dharma-muted">{d.summary}</p>
      </figcaption>

      {/* The drawing is decoration for sighted readers; the words below carry the full meaning. */}
      <div aria-hidden="true" className="mt-4">
        {layout === 'chain' && (
          <ol className="flex flex-col items-stretch gap-1 lg:flex-row lg:flex-wrap lg:items-stretch">
            {d.groups[0].items.map((item, i, all) => (
              <li key={item} className="flex flex-col items-stretch gap-1 lg:flex-row">
                <span className={`${box} flex min-h-[44px] items-center justify-center text-center text-sm font-semibold text-dharma-text`}>{item}</span>
                {i < all.length - 1 && <Arrow />}
              </li>
            ))}
          </ol>
        )}
        {layout === 'sequence' && (
          <div className="flex flex-col gap-1 lg:flex-row lg:items-stretch">
            {d.groups.map((g, i) => (
              <div key={g.heading} className="flex flex-1 flex-col gap-1 lg:flex-row">
                <div className={`${box} flex-1`}>
                  <p className="text-sm font-bold uppercase tracking-wide text-dharma-muted">{g.heading}</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-dharma-text">{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
                {i < d.groups.length - 1 && <Arrow />}
              </div>
            ))}
          </div>
        )}
        {layout === 'columns' && (
          <div className="grid gap-3 md:grid-cols-2">
            {d.groups.map((g) => (
              <div key={g.heading} className={box}>
                <p className="text-sm font-bold uppercase tracking-wide text-dharma-muted">{g.heading}</p>
                <ul className="mt-1 space-y-0.5 text-sm text-dharma-text">{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-dharma-bg p-3">
        <h4 className="text-sm font-bold text-dharma-text">In words</h4>
        <p className="mt-1 text-sm text-dharma-text">{d.textAlternative}</p>
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm text-dharma-muted sm:grid-cols-2">
        <div><dt className="inline font-semibold">Kind: </dt><dd className="inline">{KIND_LABEL[d.kind]}</dd></div>
        <div><dt className="inline font-semibold">Based on: </dt><dd className="inline">{d.sourceVerses.map((s) => `Bhagavad Gita ${s.chapter}.${s.verse}`).join(', ')}</dd></div>
        <div><dt className="inline font-semibold">Review: </dt><dd className="inline">{REVIEW_LABEL[d.review]}</dd></div>
        <div><dt className="inline font-semibold">Motion: </dt><dd className="inline">none; the diagram is static</dd></div>
      </dl>
    </figure>
  );
}

/**
 * Visual demonstrations for a verse. Renders nothing when none exists. It is
 * a server component and sends no script: the layout switches from vertical
 * to horizontal with CSS only, and nothing moves.
 */
export function VerseDiagrams({ scriptureId, chapter, verse }: { scriptureId: string; chapter: number; verse: number | string }) {
  const list = getVerseDiagrams(scriptureId, chapter, verse);
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="vd-h" className="mt-8">
      <h2 id="vd-h" className="font-serif text-xl font-bold text-dharma-text"><span data-bi="en">Visual demonstration</span> <span data-bi="sep" className="font-devanagari text-base font-normal text-dharma-muted">· </span><span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-base font-normal text-dharma-muted">चित्र द्वारा समझें</span></h2>
      <div className="mt-3 space-y-4">{list.map((d) => <Diagram key={d.id} d={d} />)}</div>
    </section>
  );
}
