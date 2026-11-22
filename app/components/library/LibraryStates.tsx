'use client';

import { AlertTriangle, Compass, RotateCcw, SearchX, SlidersHorizontal, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatNumber, plural } from '@/lib/library';

/** Shared frame so every state has the same rhythm and a polite/assertive live role. */
function StateFrame({
  icon,
  title,
  titleHi,
  role,
  children,
}: {
  icon: ReactNode;
  title: string;
  titleHi?: string;
  role: 'status' | 'alert';
  children?: ReactNode;
}) {
  return (
    <section role={role} className="rounded-2xl border border-dharma-border bg-dharma-card px-6 py-12 text-center sm:px-10">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-saffron-100 text-saffron-700 dark:bg-saffron-900/40 dark:text-saffron-300">
        {icon}
      </div>
      <h2 className="font-serif text-2xl font-bold text-dharma-text">{title}</h2>
      {titleHi && (
        <p lang="hi" className="mt-1 font-devanagari text-lg leading-relaxed text-dharma-muted">
          {titleHi}
        </p>
      )}
      <div className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-dharma-muted">{children}</div>
    </section>
  );
}

const primaryButton =
  'focus-ring inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-saffron-700 px-5 text-sm font-semibold text-white transition hover:bg-saffron-800';
const secondaryButton =
  'focus-ring inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-dharma-border bg-dharma-bg px-5 text-sm font-semibold text-dharma-text transition hover:border-saffron-400';

/** Placeholder grid shown while the library route loads. */
export function LibrarySkeleton({ count = 6, detailed = false }: { count?: number; detailed?: boolean }) {
  return (
    <div role="status" aria-busy="true" aria-label="Loading the scripture library" className="animate-pulse">
      <span className="sr-only">Loading scriptures…</span>
      <ul className={`grid gap-4 ${detailed ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3'}`}>
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="rounded-2xl border border-dharma-border bg-dharma-card p-5" aria-hidden="true">
            <div className="h-3 w-24 rounded bg-dharma-border/80" />
            <div className="mt-4 h-6 w-3/5 rounded bg-dharma-border/80" />
            <div className="mt-2 h-4 w-2/5 rounded bg-dharma-border/60" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-dharma-border/50" />
              <div className="h-3 w-4/5 rounded bg-dharma-border/50" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-5 w-16 rounded-full bg-dharma-border/60" />
              <div className="h-5 w-14 rounded-full bg-dharma-border/60" />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="h-11 w-36 rounded-full bg-dharma-border/70" />
              <div className="h-11 w-11 rounded-full bg-dharma-border/50" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Nothing matched a search, and no filters are narrowing it. */
export function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <StateFrame icon={<SearchX className="h-6 w-6" aria-hidden="true" />} title="No texts match your search" titleHi="कोई ग्रंथ नहीं मिला" role="status">
      <p>
        We couldn’t find a text for <strong className="font-semibold text-dharma-text">“{query}”</strong> yet. You could try a title, a Sanskrit name,
        an author, or a topic such as <em>karma</em> or <em>bhakti</em>.
      </p>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={onClear} className={primaryButton}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear search
        </button>
      </div>
    </StateFrame>
  );
}

/** A near-miss spelling: offer the closest query that does return results. */
export function SearchCorrection({
  query,
  suggestion,
  onApply,
  onClear,
}: {
  query: string;
  suggestion: string;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <StateFrame icon={<Compass className="h-6 w-6" aria-hidden="true" />} title="Did you mean something else?" titleHi="क्या आप यह खोज रहे थे?" role="status">
      <p>
        No texts match <strong className="font-semibold text-dharma-text">“{query}”</strong>.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button type="button" onClick={onApply} className={primaryButton}>
          Search for “{suggestion}”
        </button>
        <button type="button" onClick={onClear} className={secondaryButton}>
          Clear search
        </button>
      </div>
    </StateFrame>
  );
}

export interface Relaxation {
  label: string;
  count: number;
  onApply: () => void;
}

/** Filters (with or without a query) leave nothing; show what to relax. */
export function FilteredEmpty({
  total,
  relaxations,
  onClearFilters,
  suggestion,
  onApplySuggestion,
}: {
  total: number;
  relaxations: Relaxation[];
  onClearFilters: () => void;
  /** A corrected spelling of the query that still has results under these filters. */
  suggestion?: string | null;
  onApplySuggestion?: () => void;
}) {
  return (
    <StateFrame icon={<SlidersHorizontal className="h-6 w-6" aria-hidden="true" />} title="No texts match these filters" titleHi="इन फ़िल्टरों से कोई ग्रंथ नहीं मिला" role="status">
      <p>
        None of the {formatNumber(total)} texts fits your search and all of these filters together. Removing one should bring some back.
      </p>
      {suggestion && onApplySuggestion && (
        <p className="mt-4">
          Did you mean{' '}
          <button type="button" onClick={onApplySuggestion} className="focus-ring rounded font-semibold text-saffron-800 underline underline-offset-4 dark:text-saffron-300">
            {suggestion}
          </button>
          ?
        </p>
      )}
      {relaxations.length > 0 && (
        <ul className="mt-5 flex flex-col items-stretch gap-2">
          {relaxations.map((r) => (
            <li key={r.label}>
              <button type="button" onClick={r.onApply} className={`${secondaryButton} w-full justify-between text-left`}>
                <span>Remove “{r.label}”</span>
                <span className="text-saffron-700 dark:text-saffron-300">{plural(r.count, 'text')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={onClearFilters} className={primaryButton}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear all filters
        </button>
      </div>
    </StateFrame>
  );
}

/** Slim banner: the library is bundled, so browsing still works offline. */
export function OfflineBanner() {
  return (
    <div role="status" className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      <WifiOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>
        <strong className="font-semibold">You are offline.</strong> Search and filters still work. Pages you have not opened before may not
        load until you reconnect.
      </p>
    </div>
  );
}

/** The catalogue could not be read at all. */
export function LoadFailure({ onRetry }: { onRetry: () => void }) {
  return (
    <StateFrame icon={<AlertTriangle className="h-6 w-6" aria-hidden="true" />} title="The library could not be loaded" titleHi="ग्रंथालय लोड नहीं हो सका" role="alert">
      <p>Sorry, the catalogue didn’t load this time. Please check your connection and try again.</p>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={onRetry} className={primaryButton}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reload
        </button>
      </div>
    </StateFrame>
  );
}
