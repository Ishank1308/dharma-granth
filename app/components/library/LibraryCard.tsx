'use client';

import Link from 'next/link';
import { ArrowRight, Bookmark, BookOpen, Check, ListChecks, FileClock } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  LANGUAGES,
  countLabel,
  isBeginnerFriendly,
  plural,
  readingLevelOf,
  summaryOf,
  themesOf,
  verificationOf,
  formatNumber,
  type LibraryItem,
  type ViewMode,
} from '@/lib/library';

const NOT_RECORDED = 'Not yet recorded';

function formatDate(iso: string | undefined, withDay: boolean): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-IN', withDay ? { day: 'numeric', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' }).format(d);
}

function StatusBadge({ item }: { item: LibraryItem }) {
  const status = verificationOf(item);
  const Icon = status.id === 'published' ? BookOpen : status.id === 'curated' || status.id === 'partial' ? ListChecks : FileClock;
  const tone =
    status.id === 'published'
      ? 'text-dharma-text'
      : status.id === 'curated' || status.id === 'partial'
        ? 'text-amber-800 dark:text-amber-300'
        : 'text-dharma-muted';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${tone}`} title={status.hint}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status.label}
    </span>
  );
}

function LanguageChips({ item }: { item: LibraryItem }) {
  const available = LANGUAGES.filter((l) => item.facts.languages[l.id]);
  return (
    <ul aria-label="Languages available" className="flex flex-wrap gap-1.5">
      {available.map((l) => (
        <li
          key={l.id}
          className="rounded-md border border-dharma-border bg-dharma-bg px-2 py-0.5 text-xs font-medium text-dharma-text"
          lang={l.id === 'en' ? 'en' : l.id}
          title={l.label}
        >
          <span className={l.id === 'en' ? '' : 'font-devanagari'}>{l.native}</span>
        </li>
      ))}
    </ul>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">{label}</dt>
      <dd className="mt-0.5 text-sm leading-snug text-dharma-text">{children}</dd>
    </div>
  );
}

const missing = <span className="text-dharma-muted">{NOT_RECORDED}</span>;

export function LibraryCard({
  item,
  categoryLabel,
  view,
  saved,
  onToggleSave,
}: {
  item: LibraryItem;
  categoryLabel: string;
  view: ViewMode;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const counts = countLabel(item);
  const detailed = view === 'detailed';
  const headingId = `lib-${item.id}-title`;
  // Indexed chapters and canonical verse totals are different measures; never show them as one count.
  const hasCanonical = item.canonicalTotalVerses != null && item.canonicalTotalVerses !== item.totalVerses;
  const chapterLabel = hasCanonical ? `${plural(item.totalChapters, 'chapter')} indexed` : counts.chapters;
  const verses = item.isCurated && item.canonicalTotalVerses
    ? `${plural(item.totalVerses, 'verse')} selected · ${formatNumber(item.canonicalTotalVerses)} canonical verses`
    : hasCanonical
      ? `${formatNumber(item.canonicalTotalVerses as number)} canonical verses`
      : counts.verses;
  const verseCatalogue = item.isCurated || !hasCanonical
    ? undefined
    : `${plural(item.totalVerses, 'verse')} readable in this library`;
  const level = readingLevelOf(item);
  const themes = themesOf(item).slice(0, 6);
  const updated = formatDate(item.facts.lastUpdated, true);
  const fetched = formatDate(item.facts.sourceFetched, false);
  const commentary: string[] = [];
  if (item.facts.hindiCommentary) commentary.push('Hindi verse-by-verse commentary');
  if (item.explanation) commentary.push('Book overview (English & Hindi)');

  return (
    <article
      aria-labelledby={headingId}
      className="group flex h-full flex-col rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm transition hover:border-saffron-300 hover:shadow-md sm:p-6"
    >
      <header className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-saffron-800 dark:text-saffron-300">{categoryLabel}</p>
        <div className="-mr-2 -mt-2 flex items-center gap-1.5">
          {saved && <span className="inline-flex items-center gap-1 rounded-full bg-saffron-100 px-2 py-1 text-[10px] font-bold text-saffron-800 dark:bg-saffron-900/40 dark:text-saffron-200"><Check className="h-3 w-3" aria-hidden="true" /> Saved</span>}
          <button
            type="button"
            onClick={() => onToggleSave(item.id)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
            className={`focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
              saved ? 'text-saffron-700 dark:text-saffron-300' : 'text-dharma-muted hover:text-saffron-700'
            }`}
          >
            <Bookmark className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        </div>
      </header>

      <h3 id={headingId} className="mt-1">
        <span lang="sa" className="block font-devanagari text-[1.375rem] font-semibold leading-[1.6] text-dharma-text">
          {item.titleSanskrit}
        </span>
        <span className="mt-0.5 block font-serif text-lg font-bold leading-snug text-dharma-text">{item.title}</span>
        {detailed && item.titleIast && <span className="mt-0.5 block font-serif text-sm italic text-dharma-muted">{item.titleIast}</span>}
      </h3>

      <p className={`mt-3 text-sm leading-relaxed text-dharma-muted ${detailed ? '' : 'line-clamp-3'}`}>
        {detailed ? item.description : summaryOf(item.description)}
      </p>
      {detailed && item.explanation && (
        <p lang="hi" className="mt-3 font-devanagari text-[0.95rem] leading-[1.75] text-dharma-text/90">
          {item.explanation.overview.hi}
        </p>
      )}

      <p className="mt-4 text-sm font-medium text-dharma-text">
        {chapterLabel} <span aria-hidden="true">·</span> {verses}
        {verseCatalogue && (
          <span className="mt-1 block text-xs font-normal text-dharma-muted">{verseCatalogue}</span>
        )}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <LanguageChips item={item} />
        <StatusBadge item={item} />
      </div>
      {!detailed && <p className="mt-2 text-sm text-dharma-muted">Reading level: {level.label}</p>}

      {detailed && (
        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-dharma-border/70 pt-5 sm:grid-cols-2">
          <Detail label="Author">{item.author ?? missing}</Detail>
          <Detail label="Estimated reading level">
            {level.label}
            {isBeginnerFriendly(item) && <span className="ml-2 rounded bg-saffron-100 px-1.5 py-0.5 text-[11px] font-semibold text-saffron-900 dark:bg-saffron-900/40 dark:text-saffron-200">Beginner friendly</span>}
          </Detail>
          <Detail label="Major themes">
            {themes.length > 0 ? themes.join(' · ') : missing}
          </Detail>
          <Detail label="Source edition">
            {item.facts.sourceHost ? (
              <>
                {item.facts.sourceHost}
                {fetched && <span className="text-dharma-muted"> · fetched {fetched}</span>}
              </>
            ) : (
              missing
            )}
          </Detail>
          <Detail label="Available commentary">{commentary.length > 0 ? commentary.join('; ') : missing}</Detail>
          <Detail label="Last updated">{updated ?? missing}</Detail>
        </dl>
      )}

      <div className="mt-auto pt-5">
        <Link
          href={`/scripture/${item.id}`}
          aria-label={`Start reading ${item.title}`}
          className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-full bg-saffron-700 px-5 text-sm font-semibold text-white transition hover:bg-saffron-800 group-hover:shadow-md"
        >
          Start reading
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
