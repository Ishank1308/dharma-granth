import { getScenarios, SETTING_LABEL } from '@/data/modern-scenarios';

/** Editorial everyday illustrations of a verse. Renders nothing when none exist. */
export function ModernScenarios({ scriptureId, chapter, verse }: { scriptureId: string; chapter: number; verse: number | string }) {
  const set = getScenarios(scriptureId, chapter, verse);
  if (!set) return null;
  const reviewed = set.review === 'approved' && set.reviewer && set.reviewDate;
  return (
    <section aria-labelledby="scenarios-h" className="mt-8 rounded-2xl border border-sky-600/30 bg-sky-50/50 p-4 dark:border-sky-500/25 dark:bg-sky-950/20 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="scenarios-h" className="font-serif text-lg font-bold text-dharma-text">The teaching in everyday life</h2>
        <span className="rounded-full border border-sky-600/40 bg-sky-100 px-2 py-0.5 text-sm font-semibold text-sky-950 dark:bg-sky-900/40 dark:text-sky-100">Editorial content</span>
        <span className="rounded-full border border-dharma-border px-2 py-0.5 text-sm text-dharma-muted">{reviewed ? `Reviewed by ${set.reviewer}, ${set.reviewDate}` : 'Draft, not reviewed'}</span>
      </div>
      <p className="mt-2 text-sm text-dharma-muted">Illustrations written by the editors to help you think about the verse. They are not part of the scripture, and they are not the only way to read it.</p>
      {/* An approved teaching is shown as the मर्म line above the verse; repeat it only for drafts. */}
      {!reviewed && <p className="mt-2 text-sm text-dharma-text"><span className="font-semibold">Teaching illustrated:</span> {set.teaching}</p>}
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {set.scenarios.map((s) => (
          <div key={s.setting} className="rounded-xl border border-dharma-border bg-dharma-card p-3 text-sm">
            <dt className="font-semibold text-dharma-text">{SETTING_LABEL[s.setting]}</dt>
            <dd className="mt-1 text-dharma-muted">{s.situation}</dd>
            <dd className="mt-1 text-dharma-text">{s.reading}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
