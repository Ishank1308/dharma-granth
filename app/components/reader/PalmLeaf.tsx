import type { ReactNode } from 'react';
import { STUDY_GROUPS, type StudyGroup, type StudyPhrase, type VerseStudy } from '@/data/verse-study';
import './palm-leaf.css';

/* ── The leaf: frame only. The shloka inside is the published text, unchanged. ── */

export function PalmLeaf({ children }: { children: ReactNode }) {
  return (
    <div className="palm-leaf">
      <span aria-hidden="true" className="palm-leaf__hole palm-leaf__hole--start" />
      <span aria-hidden="true" className="palm-leaf__hole palm-leaf__hole--end" />
      <p aria-hidden="true" className="palm-leaf__mangala font-manuscript">॥ श्रीः ॥</p>
      {children}
    </div>
  );
}

/** Renders a line with its daṇḍas in red ink. The text content is identical to `text`. */
export function Rubricated({ text }: { text: string }) {
  return (
    <>
      {text.split(/([।॥|]+)/).map((part, i) =>
        /^[।॥|]+$/.test(part) ? <span key={i} className="rubric">{part}</span> : part,
      )}
    </>
  );
}

/* ── Marking phrases without changing the text ─────────────────────── */

type Mark = { text: string; kind: 'highlight' } | { text: string; kind: 'term'; group: StudyGroup };

/** Wraps every occurrence of each phrase, earliest and then longest first; overlaps are skipped. */
export function markPhrases(text: string, marks: Mark[]): ReactNode[] {
  const out: ReactNode[] = [];
  let at = 0;
  while (at < text.length) {
    let best: { index: number; mark: Mark } | null = null;
    for (const mark of marks) {
      if (!mark.text) continue;
      const index = text.indexOf(mark.text, at);
      if (index < 0) continue;
      if (!best || index < best.index || (index === best.index && mark.text.length > best.mark.text.length)) {
        best = { index, mark };
      }
    }
    if (!best) break;
    if (best.index > at) out.push(text.slice(at, best.index));
    const key = `${best.index}-${best.mark.kind}`;
    out.push(
      best.mark.kind === 'highlight'
        ? <mark key={key} className="study-highlight">{best.mark.text}</mark>
        : <span key={key} data-study-group={best.mark.group}>{best.mark.text}</span>,
    );
    at = best.index + best.mark.text.length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}

export const termMarks = (phrases: StudyPhrase[]): Mark[] =>
  phrases.map((p) => ({ text: p.text, kind: 'term' as const, group: p.group }));

/* ── Study key: one tap lights a group across every layer ──────────── */

export function StudyKey({ active, onChange }: { active: StudyGroup | null; onChange: (group: StudyGroup | null) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dharma-border/70 bg-dharma-card/60 px-3.5 py-2.5 text-xs text-dharma-muted">
      <span lang="hi" className="font-devanagari font-semibold text-dharma-text">अध्ययन कुंजी</span>
      <span>Study key</span>
      <span aria-hidden="true">·</span>
      {(Object.keys(STUDY_GROUPS) as StudyGroup[]).map((group) => (
        <button
          key={group}
          type="button"
          aria-pressed={active === group}
          onClick={() => onChange(active === group ? null : group)}
          className={`study-swatch--${group} focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 font-semibold ring-offset-2 aria-pressed:ring-2 aria-pressed:ring-current`}
        >
          <span lang="hi" className="font-devanagari">{STUDY_GROUPS[group].hi}</span>
          <span>{STUDY_GROUPS[group].en}</span>
        </button>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <mark className="study-highlight">Key idea</mark>
        <span lang="hi" className="font-devanagari">मुख्य भाव</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="rubric font-manuscript text-sm" aria-hidden="true">॥</span>
        <span>Scribe’s marks</span>
      </span>
    </div>
  );
}

/* ── The व्याख्या with highlights, readings side by side and margin notes ── */

export function StudyVyakhya({ text, study, className }: { text: string; study: VerseStudy; className: string }) {
  const marks: Mark[] = [...study.highlights.map((h) => ({ text: h, kind: 'highlight' as const })), ...termMarks(study.explanationTerms)];
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_11rem]">
      <div className="space-y-4">
        <p lang="hi" className={className}>{markPhrases(text, marks)}</p>
        {study.readings && (
          <section aria-label={`${study.readings.term}: two readings`}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-dharma-muted">
              <span lang="hi" className="font-devanagari normal-case tracking-normal">दो पाठ · {study.readings.term}</span>
              <span aria-hidden="true"> · </span>
              <span>Two readings</span>
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {study.readings.items.map((item, i) => (
                <div key={i} className="study-reading rounded-xl px-3.5 py-3 font-devanagari text-sm leading-relaxed" lang="hi">
                  <span className="mb-1 block text-xs font-bold">पाठ {i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
            <p lang="hi" className="mt-2 font-devanagari text-xs leading-relaxed text-dharma-muted">{study.readings.note}</p>
          </section>
        )}
      </div>
      <aside aria-label="Margin notes" className="space-y-4 border-t border-dharma-border/60 pt-4 text-xs leading-relaxed text-dharma-muted sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
        <p className="font-bold uppercase tracking-[0.14em]">
          <span lang="hi" className="font-devanagari normal-case tracking-normal">टिप्पणी</span> · Margin notes
        </p>
        {study.marginNotes.map((note) => (
          <div key={note.title}>
            <p lang="hi" className="font-manuscript text-sm text-dharma-text">
              {note.href ? <a href={note.href} className="underline decoration-dotted underline-offset-4 hover:text-saffron-700 dark:hover:text-saffron-300">{note.title}</a> : note.title}
            </p>
            <p lang="hi" className="mt-1 font-devanagari">{note.body}</p>
          </div>
        ))}
        <a href="#layer-sources" className="inline-block font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
          Sources and edition ↓
        </a>
      </aside>
    </div>
  );
}
