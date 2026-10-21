'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, Link2 } from 'lucide-react';

interface Parallel {
  targetVerseId: string;
  scriptureName: string;
  reference: string;
  sanskritSnippet: string;
  relationshipType: 'direct_quote' | 'thematic_echo';
}

type ParallelMap = Record<string, Parallel[]>;

const URL_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/data/samvada-parallels.json`;
// One fetch per page load, shared by every verse card on the page.
let cache: Promise<ParallelMap> | null = null;
function loadParallels(): Promise<ParallelMap> {
  if (!cache) {
    cache = fetch(URL_PATH)
      .then((r) => (r.ok ? (r.json() as Promise<ParallelMap>) : {}))
      .catch(() => ({}));
  }
  return cache;
}

const isTruncated = (snippet: string) => /(…|\.\.\.)\s*$/.test(snippet);

function hrefFor(targetVerseId: string): string {
  const [scriptureId, chapter, verse] = targetVerseId.split(':');
  return `/scripture/${scriptureId}/chapter/${chapter}/#verse-${verse}`;
}

const KIND_LABEL: Record<Parallel['relationshipType'], { en: string; hi: string }> = {
  direct_quote: { en: 'Shared wording', hi: 'समान पाठ' },
  thematic_echo: { en: 'Thematic echo', hi: 'भावगत साम्य' },
};

/**
 * "Samvada": verses in other scriptures that quote or echo this one (public/data/samvada-parallels.json, built by
 * scripts/build-samvada-links.ts). Renders nothing when the verse has no parallels. Collapsed by default.
 */
export function SamvadaStrip({ scriptureId, chapterId, verseNumber }: { scriptureId: string; chapterId: number; verseNumber: number | string }) {
  const [items, setItems] = useState<Parallel[]>([]);
  const [open, setOpen] = useState(false);
  const key = `${scriptureId}:${chapterId}:${verseNumber}`;

  useEffect(() => {
    let live = true;
    loadParallels().then((map) => {
      if (live) setItems(map[key] ?? []);
    });
    return () => {
      live = false;
    };
  }, [key]);

  if (items.length === 0) return null;
  const panelId = `samvada-${key.replace(/[^a-z0-9]+/gi, '-')}`;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dharma-border/80 bg-dharma-card px-4 py-1.5 text-xs font-semibold text-dharma-text transition hover:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
      >
        <Link2 className="h-3.5 w-3.5 text-saffron-600" aria-hidden="true" />
        <span lang="hi" className="font-devanagari">संवादी श्लोक</span>
        <span aria-hidden="true">·</span>
        <span>
          {items.length} cross-scripture {items.length === 1 ? 'parallel' : 'parallels'}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <ul id={panelId} className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {items.map((p) => (
            <li key={p.targetVerseId} className="rounded-2xl border border-dharma-border/70 bg-dharma-card/70 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                {KIND_LABEL[p.relationshipType].en} · <span lang="hi" className="font-devanagari normal-case">{KIND_LABEL[p.relationshipType].hi}</span>
              </p>
              {/* Most stored snippets stop mid-shloka ("…"); quote only complete ones (CLAUDE.md rule 4). */}
              {!isTruncated(p.sanskritSnippet) && (
                <p lang="sa" className="mt-1.5 font-devanagari text-sm leading-relaxed text-dharma-text">
                  {p.sanskritSnippet}
                </p>
              )}
              <Link
                href={hrefFor(p.targetVerseId)}
                className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-saffron-800 hover:underline dark:text-saffron-300"
              >
                {p.reference} →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
