'use client';

import { useMemo, useState } from 'react';
import { COMMENTARIES, REVIEW_LABEL, verseKey } from '@/data/study-content';
import { cleanVerseField } from '@/lib/verse-format';
import type { ReaderVerseText } from '@/lib/reader-actions';

/**
 * Original, literal translation, traditional commentary, simple explanation
 * and modern reflection, one under another (never narrow side-by-side columns).
 * The commentary panel lets readers filter reviewed commentaries by
 * commentator, tradition, language and detail. No commentary is ranked or
 * called better or more correct than another.
 */
export function CommentaryCompare({
  scriptureId,
  chapterId,
  verse,
}: {
  scriptureId: string;
  chapterId: number;
  verse: ReaderVerseText;
}) {
  const all = useMemo(() => COMMENTARIES[verseKey(scriptureId, chapterId, verse.number)] ?? [], [scriptureId, chapterId, verse.number]);
  const [commentator, setCommentator] = useState('');
  const [tradition, setTradition] = useState('');
  const [language, setLanguage] = useState('');
  const [detail, setDetail] = useState('');

  const options = (pick: (c: (typeof all)[number]) => string) => Array.from(new Set(all.map(pick)));
  const shown = useMemo(
    () => all.filter((c) => (!commentator || c.commentator === commentator) && (!tradition || c.tradition === tradition) && (!language || c.language === language) && (!detail || c.detail === detail)),
    [all, commentator, tradition, language, detail],
  );

  const filter = (label: string, value: string, set: (v: string) => void, opts: string[]) =>
    opts.length > 1 && (
      <label className="text-sm font-semibold text-dharma-muted">
        {label}
        <select value={value} onChange={(e) => set(e.target.value)} className="mt-1 block min-h-[44px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text">
          <option value="">All</option>
          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
    );

  const panel = (title: string, note: string, body?: string, lang = 'en') =>
    body ? (
      <div className="rounded-xl border border-dharma-border bg-dharma-card p-3">
        <h4 className="text-sm font-bold text-dharma-text">{title}</h4>
        <p className="mb-1 text-sm text-dharma-muted">{note}</p>
        <p lang={lang} className={`whitespace-pre-line text-dharma-text ${lang === 'hi' || lang === 'sa' ? 'font-devanagari leading-[2]' : 'font-serif leading-relaxed'}`}>{cleanVerseField(body)}</p>
      </div>
    ) : null;

  const lang = (s?: string) => (s && /[ऀ-ॿ]/.test(s) ? 'hi' : 'en');

  return (
    <section id="commentary-compare" aria-labelledby="cc-h" className="rounded-2xl border border-dharma-border bg-dharma-card/60 p-4 sm:p-5">
      <h3 id="cc-h" className="font-serif text-lg font-bold text-dharma-text">
        <span data-bi="en">Layers side by side</span> <span data-bi="sep" className="font-devanagari text-sm font-normal text-dharma-muted">· </span><span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-sm font-normal text-dharma-muted">परतों की तुलना</span>
      </h3>
      <p className="mt-1 text-sm text-dharma-muted">Each layer is labelled by what it is. None is presented as the correct or best reading.</p>

      <div className="mt-3 space-y-3">
        {panel('Original Sanskrit', 'Source scripture', verse.sanskrit, 'sa')}
        {panel('Literal translation', 'Translation of the source text', verse.translation)}

        <div className="rounded-xl border border-stone-400/50 border-l-4 border-l-stone-600 bg-stone-100/70 p-3 dark:bg-stone-900/40">
          <h4 className="text-sm font-bold text-dharma-text">Traditional commentary</h4>
          {all.length === 0 ? (
            <p className="mt-1 text-sm text-dharma-muted">
              No reviewed traditional commentary has been added for this verse yet, so there is nothing to compare. Commentaries will appear
              here only with their commentator, edition and review status.
            </p>
          ) : (
            <>
              <div className="mt-2 grid gap-2 sm:grid-cols-4">
                {filter('Commentator', commentator, setCommentator, options((c) => c.commentator))}
                {filter('Tradition', tradition, setTradition, options((c) => c.tradition))}
                {filter('Language', language, setLanguage, options((c) => c.language))}
                {filter('Detail level', detail, setDetail, options((c) => c.detail))}
              </div>
              <ul className="mt-3 space-y-3">
                {shown.map((c, i) => (
                  <li key={i} className="rounded-lg border border-dharma-border bg-dharma-card p-3">
                    <p className="font-semibold text-dharma-text">{c.commentator} <span className="font-normal text-dharma-muted">· {c.tradition} · {c.language} · {c.detail}</span></p>
                    <p lang={c.language === 'English' ? 'en' : c.language === 'Hindi' ? 'hi' : 'sa'} className="mt-1 whitespace-pre-line">{c.text}</p>
                    <dl className="mt-2 grid gap-x-4 text-sm text-dharma-muted sm:grid-cols-2">
                      <div><dt className="inline font-semibold">Edition: </dt><dd className="inline">{c.sourceEdition}</dd></div>
                      {c.translator && <div><dt className="inline font-semibold">Translator: </dt><dd className="inline">{c.translator}</dd></div>}
                      <div><dt className="inline font-semibold">Publication: </dt><dd className="inline">{c.publication}</dd></div>
                      <div><dt className="inline font-semibold">Review: </dt><dd className="inline">{REVIEW_LABEL[c.review]}</dd></div>
                    </dl>
                  </li>
                ))}
                {shown.length === 0 && <li className="text-sm text-dharma-muted">No commentary matches these filters.</li>}
              </ul>
            </>
          )}
        </div>

        {panel('Simple explanation', 'Editorial explanation, not scripture', verse.explanation, lang(verse.explanation))}
        {panel('Modern reflection', 'Editorial reflection, not scripture', verse.reflection, lang(verse.reflection))}
      </div>
    </section>
  );
}
