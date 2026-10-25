import Link from 'next/link';
import { ArrowDown, ArrowRight, Clock, HelpCircle, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { getChapterOrientation } from '@/data/chapter-orientation';
import { CONCEPT_DETAILS } from '@/data/concept-details';
import { verseCount as fmtVerses } from '@/lib/format';
import { readHref } from '@/lib/verse-paths';
import { InteractiveChapterMap } from '@/app/components/InteractiveChapterMap';

interface Props {
  scriptureId: string;
  chapterId: number;
  verseCount: number;
}

/** About one minute per verse to read with the translation; study takes longer. */
function readingMinutes(verseCount: number): number {
  return Math.max(2, Math.round(verseCount * 0.75));
}

/**
 * Optional orientation beside the verses. Facts about the chapter come from the library;
 * the narrative panel appears only where an editorial entry exists, and says so.
 */
export function ChapterOrientation({ scriptureId, chapterId, verseCount }: Props) {
  const o = getChapterOrientation(scriptureId, chapterId);
  if (!o) return null; // no invented introductions: only reviewed-or-draft editorial entries render
  const minutes = verseCount > 0 ? readingMinutes(verseCount) : null;

  return (
    <section aria-labelledby="orientation-h" className="mb-10 rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            Chapter Orientation · मूल पृष्ठभूमि
          </span>
          <h2 id="orientation-h" className="font-serif text-2xl font-bold text-dharma-text mt-0.5">
            {o.nameEn} <span lang="hi" className="font-devanagari text-xl font-normal text-dharma-muted">· {o.nameHi}</span>
          </h2>
        </div>

        {verseCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-1 text-xs text-dharma-muted">
            <Clock className="h-3.5 w-3.5 text-saffron-600" aria-hidden="true" />
            <span>{fmtVerses(verseCount)} · about {minutes} min study</span>
          </div>
        )}
      </div>

      {/* Narrative Context & Central Conflict Banner */}
      {o.narrativeContext && (
        <div className="mt-5 rounded-2xl border border-amber-300/80 bg-amber-50/50 p-4 sm:p-5 dark:border-amber-900/60 dark:bg-amber-950/20 text-xs sm:text-sm">
          <p className="font-serif leading-relaxed text-dharma-text">
            <strong>Narrative Context:</strong> {o.narrativeContext}
          </p>
          {o.centralConflict && (
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-dharma-text/90 flex items-start gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Central Conflict:</strong> {o.centralConflict}</span>
            </p>
          )}
        </div>
      )}

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-dharma-muted">
            <UserCheck className="h-3.5 w-3.5 text-saffron-600" />
            <span>Dialogue Participants</span>
          </dt>
          <dd className="mt-1 text-dharma-text">
            <strong>Speaker:</strong> {o.speakers}
          </dd>
          <dd className="mt-0.5 text-dharma-muted">
            <strong>Listener:</strong> {o.listeners}
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-dharma-muted">
            <HelpCircle className="h-3.5 w-3.5 text-saffron-600" />
            <span>Central questions</span>
          </dt>
          <dd className="mt-1 italic font-serif text-dharma-text">
            &ldquo;{o.centralQuestion}&rdquo;
          </dd>
          {o.mainQuestions && o.mainQuestions.length > 0 && (
            <dd className="mt-2">
              <ul className="list-disc space-y-1 pl-5 text-dharma-muted">
                {o.mainQuestions.map((q) => <li key={q}>{q}</li>)}
              </ul>
            </dd>
          )}
        </div>

        <div>
          <dt className="font-bold text-xs uppercase tracking-wider text-dharma-muted">Recommended Background</dt>
          <dd className="mt-1 text-dharma-muted">{o.background}</dd>
        </div>

        {o.prerequisiteConcepts.length > 0 && (
          <div>
            <dt className="font-bold text-xs uppercase tracking-wider text-dharma-muted">Concepts to Know First</dt>
            <dd className="mt-1 flex flex-wrap gap-2 text-dharma-muted">
              {o.prerequisiteConcepts.map((c) =>
                CONCEPT_DETAILS[c.toLowerCase()] ? (
                  <Link
                    key={c}
                    href={`/concepts/${c.toLowerCase()}`}
                    className="inline-flex min-h-[36px] items-center rounded-lg border border-saffron-500/30 bg-saffron-50/70 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-semibold text-saffron-800 dark:text-amber-100 hover:border-saffron-500 transition"
                  >
                    {c}
                  </Link>
                ) : (
                  <span key={c} className="inline-flex min-h-[36px] items-center rounded-lg border border-dharma-border px-2.5 py-0.5 text-xs">
                    {c}
                  </span>
                ),
              )}
            </dd>
          </div>
        )}
      </dl>

      {o ? (
        <>
          <div className="mt-5">
            <h3 className="text-sm font-bold text-dharma-text">How the chapter unfolds</h3>
            {/* One ordered list serves as the diagram and the text alternative. */}
            <ol className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-1">
              {o.sequence.map((s, i) => (
                <li key={s.label} className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center">
                  <div className="flex-1 rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm">
                    <p className="font-semibold text-dharma-text">
                      {s.label} <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">· {s.labelHi}</span>
                    </p>
                    <p className="mt-1 text-dharma-muted">{s.text}</p>
                  </div>
                  {i < o.sequence.length - 1 && (
                    <>
                      <ArrowDown className="mx-auto my-0.5 h-4 w-4 text-dharma-muted lg:hidden" aria-hidden="true" />
                      <ArrowRight className="mx-0.5 hidden h-4 w-4 shrink-0 text-dharma-muted lg:block" aria-hidden="true" />
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {o.flow && o.flow.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-dharma-text">Chapter flow</h3>
              <p className="mt-1 text-sm text-dharma-muted">Each step opens the verse where it is best seen. These links are editorial drafts, not yet reviewed.</p>
              <ol className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {o.flow.map((f, i) => (
                  <li key={f.label}>
                    <Link href={readHref(scriptureId, chapterId, f.verse)} className="focus-ring flex min-h-[44px] flex-col rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm hover:border-saffron-400">
                      <span className="font-semibold text-dharma-text">{i + 1}. {f.label} <span lang="hi" className="font-devanagari font-normal text-dharma-muted">· {f.labelHi}</span></span>
                      <span className="text-dharma-muted">Verses {f.range}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Interactive Chapter Map */}
          {o.mapNodes && o.mapNodes.length > 0 && (
            <InteractiveChapterMap
              scriptureId={scriptureId}
              chapterId={chapterId}
              nodes={o.mapNodes}
              chapterConclusion={o.chapterConclusion}
            />
          )}

          <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <h3 className="font-bold text-dharma-text">Main concepts</h3>
              <ul className="mt-1 flex flex-wrap gap-2">
                {o.concepts.map((c) => <li key={c} className="rounded-full border border-dharma-border px-3 py-1 text-dharma-muted">{c}</li>)}
              </ul>
              <h3 className="mt-4 font-bold text-dharma-text">Chapter structure</h3>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-dharma-muted">
                {o.structure.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-dharma-text">Important verses</h3>
              <ul className="mt-1 space-y-1">
                {o.importantVerses.map((v) => (
                  <li key={v.verse}>
                    <Link href={readHref(scriptureId, chapterId, v.verse)} className="font-semibold text-saffron-800 underline underline-offset-2 hover:text-saffron-900 dark:text-saffron-300">
                      {chapterId}.{v.verse}
                    </Link>{' '}
                    <span className="text-dharma-muted">{v.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-dharma-bg px-3 py-2 text-sm text-dharma-muted">
            Editorial introduction, not scripture. Status: {o.review === 'approved' ? 'approved' : 'draft, awaiting editorial review'}.
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-dharma-muted">A reviewed narrative introduction for this chapter has not been prepared yet.</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/learn/paths`} className="focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-5 text-sm font-semibold text-dharma-text hover:border-saffron-400">
          Guided Learning Paths
        </Link>
      </div>
    </section>
  );
}
