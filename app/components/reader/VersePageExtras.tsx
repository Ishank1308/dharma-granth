'use client';

import { useEffect, useState } from 'react';

/** Sections of the verse page that the chapter card already shows, or that only work on the verse page itself. */
const DROP = [
  'section[aria-labelledby^="fb-"]', // "Was this explanation clear?" (needs the verse page's script)
  'section[aria-labelledby="rt-h"]', // related teachings: already in the chapter card
  'section[aria-label^="संबंधित ज्ञान"]', // related wisdom: already in the chapter card
  '#verse-graph', // the network graph draws itself on the verse page only
  'section[aria-labelledby="source-study-notes"]', // source & study notes removed per user preference
  '[role="tablist"]', // tab switches need the verse page's script; the default tab's text stays
  'button', // every other control on the verse page is wired there, not here
];

/**
 * Inside the chapter's Verse study, shows everything else the verse's own page
 * has (questions this verse answers, simple meaning, lesson, examples,
 * diagrams, sources), open in place so the reader never has to leave the
 * adhyay. Fetched from the static verse page only when Verse study opens, so
 * the chapter HTML stays the same size.
 */
export function VersePageExtras({ href }: { href: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(href)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        if (!alive) return;
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const parts: string[] = [];
        const answers = doc.querySelector('section[aria-labelledby="verse-answers"]');
        const study = doc.querySelector('#study-more > div');
        // The answers also live inside Study more on the verse page; extract them once.
        if (answers && study?.contains(answers)) answers.remove();
        study?.querySelectorAll(DROP.join(',')).forEach((el) => el.remove());
        // ids from the verse page could clash with the chapter's own: prefix them and the references to them.
        const prefix = `vx-${href.replace(/[^a-z0-9]+/gi, '-')}-`;
        for (const root of [answers, study]) {
          if (!root) continue;
          root.querySelectorAll('[id]').forEach((el) => el.setAttribute('id', prefix + el.id));
          [root, ...Array.from(root.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]'))].forEach((el) => {
            for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
              const value = el.getAttribute(attr);
              if (value) el.setAttribute(attr, value.split(/\s+/).map((id: string) => prefix + id).join(' '));
            }
          });
        }
        if (answers) parts.push(answers.outerHTML);
        if (study) parts.push(study.innerHTML);
        setHtml(parts.join(''));
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [href]);

  if (failed || html === '') return null;
  if (html === null) {
    return (
      <p className="mt-4 text-center text-xs text-dharma-muted" role="status">
        <span lang="hi" className="font-devanagari">पूर्ण अध्ययन लोड हो रहा है</span> · Loading the full study…
      </p>
    );
  }
  return (
    <div
      // inline-size containment: wide pieces (diagrams, flows) scroll inside instead of widening the chapter.
      style={{ contain: 'inline-size paint' }}
      className="verse-page-extras mt-6 min-w-0 max-w-full border-t border-dharma-border/50 pt-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
