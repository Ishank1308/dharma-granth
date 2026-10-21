import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { FeedbackPatterns } from './FeedbackPatterns';
import { NEXT_STATUS, STATUS_LABEL, type ContentItem } from '@/data/content-status';

export const metadata: Metadata = {
  title: 'Editorial quality · संपादकीय गुणवत्ता',
  robots: { index: false, follow: false },
};

interface Finding { label: string; count: number; detail: string[]; note?: string }
interface Report {
  generatedAt: string;
  verseTotal: number;
  findings: Record<string, Finding>;
  notMeasured: string[];
  items: ContentItem[];
}

function loadReport(): Report | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'quality-report.json'), 'utf8')) as Report;
  } catch {
    return null;
  }
}

export default function EditorialPage() {
  const report = loadReport();
  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-dharma-text">Editorial quality</h1>
      <p className="mt-2 text-sm text-dharma-muted">
        An internal view for editors. It is not linked from the site and is not indexed. It is a snapshot taken when the site was built.
      </p>

      {!report ? (
        <p role="status" className="mt-6 rounded-xl border border-amber-500/40 bg-amber-50/70 p-4 text-sm dark:bg-amber-950/20">
          No report has been generated yet. Run <code>npm run report:quality</code>, then rebuild.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-dharma-muted">Generated {new Date(report.generatedAt).toLocaleString(undefined, { numberingSystem: 'latn' })} · {report.verseTotal.toLocaleString(undefined, { numberingSystem: 'latn' })} verses scanned.</p>

          <section aria-labelledby="ed-checks" className="mt-6">
            <h2 id="ed-checks" className="font-serif text-xl font-bold text-dharma-text">Checks</h2>
            <ul className="mt-3 space-y-2">
              {Object.entries(report.findings).map(([key, f]) => (
                <li key={key} className="rounded-xl border border-dharma-border bg-dharma-card p-3 text-sm">
                  <details>
                    <summary className="flex min-h-[44px] cursor-pointer items-center gap-3">
                      <span className={`inline-flex min-w-[3rem] justify-center rounded-full px-2 py-0.5 text-sm font-bold ${f.count === 0 ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100' : 'bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100'}`}>{f.count}</span>
                      <span className="font-semibold text-dharma-text">{f.label}</span>
                    </summary>
                    {f.note && <p className="mt-2 text-sm text-dharma-muted">{f.note}</p>}
                    {f.detail.length > 0 ? (
                      <ul className="mt-2 list-disc pl-5 text-dharma-muted">{f.detail.map((d) => <li key={d}>{d}</li>)}{f.count > f.detail.length && <li>…and {f.count - f.detail.length} more</li>}</ul>
                    ) : (
                      <p className="mt-2 text-dharma-muted">Nothing found.</p>
                    )}
                  </details>
                </li>
              ))}
            </ul>
            <h3 className="mt-5 text-sm font-bold text-dharma-text">Not measured here</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-dharma-muted">{report.notMeasured.map((n) => <li key={n}>{n}</li>)}</ul>
          </section>

          <section aria-labelledby="ed-items" className="mt-8">
            <h2 id="ed-items" className="font-serif text-xl font-bold text-dharma-text">Study content and its status</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Study content, its type, status, last review and history</caption>
                <thead><tr className="border-b border-dharma-border text-sm uppercase text-dharma-muted"><th scope="col" className="py-2 pr-3">Item</th><th scope="col" className="py-2 pr-3">Type</th><th scope="col" className="py-2 pr-3">Status</th><th scope="col" className="py-2">History</th></tr></thead>
                <tbody>
                  {report.items.map((i) => (
                    <tr key={i.id} className="border-b border-dharma-border/60 align-top">
                      <td className="py-2 pr-3 font-medium text-dharma-text">{i.title}</td>
                      <td className="py-2 pr-3 text-dharma-muted">{i.kind}</td>
                      <td className="py-2 pr-3">{STATUS_LABEL[i.status]}{i.reviewedOn ? ` · reviewed ${i.reviewedOn}` : ' · never reviewed'}</td>
                      <td className="py-2 text-sm text-dharma-muted">{i.history.map((h) => `${h.date}: ${h.note}`).join(' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <FeedbackPatterns />

      <section aria-labelledby="ed-flow" className="mt-8 rounded-xl border border-dharma-border bg-dharma-card/60 p-4 text-sm">
        <h2 id="ed-flow" className="font-serif text-lg font-bold text-dharma-text">Workflow</h2>
        <p className="mt-1 text-dharma-muted">An item may only move to the statuses listed next to its current one, so a review cannot be skipped.</p>
        <ul className="mt-2 space-y-1">
          {(Object.keys(NEXT_STATUS) as Array<keyof typeof NEXT_STATUS>).map((s) => (
            <li key={s}><span className="font-semibold text-dharma-text">{STATUS_LABEL[s]}</span> <span className="text-dharma-muted">→ {NEXT_STATUS[s].map((n) => STATUS_LABEL[n]).join(', ')}</span></li>
          ))}
        </ul>
      </section>
    </main>
  );
}
