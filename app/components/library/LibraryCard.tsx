'use client';

import Link from 'next/link';
import { Bookmark, BookOpen, ListChecks, FileClock } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import {
  LANGUAGES,
  isBeginnerFriendly,
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
    <ul aria-label="Languages represented in the published verses" className="flex flex-wrap gap-1.5">
      {available.map((l) => {
        const coverage = item.facts.languageCoverage;
        const count = coverage?.[l.id];
        const percent = coverage && coverage.totalVerses > 0 && count !== undefined
          ? (count / coverage.totalVerses) * 100
          : undefined;
        const percentLabel = percent === undefined
          ? undefined
          : percent > 0 && percent < 1 ? '<1%' : `${Math.round(percent)}%`;
        const coverageText = percentLabel === undefined
          ? l.label
          : `${l.label} text in ${percentLabel} of published verses (${count} of ${coverage!.totalVerses})`;
        return (
          <li
            key={l.id}
            aria-label={coverageText}
            className="rounded-md bg-dharma-text/[0.06] px-2 py-0.5 text-xs text-dharma-text"
            lang={l.id === 'en' ? 'en' : l.id}
            title={coverageText}
          >
            <span className={l.id === 'en' ? '' : 'font-devanagari'}>{l.native}</span>
            {percentLabel !== undefined && <span className="ml-1 text-[10px] text-dharma-text-secondary">{percentLabel}</span>}
          </li>
        );
      })}
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

// English cover names follow the local Gita Press editions when that title is
// present in the source collection; all other scriptures use the catalogue name.
const GITA_PRESS_COVER_TITLES: Readonly<Record<string, string>> = {
  ashtavakra: 'Ashtavakra Gita',
  bhagavadgita: 'Shrimad Bhagavad Gita',
  ishavasya: 'Ishavashya Upanishad',
  kena: 'Keno Upanishad',
  mundaka: 'Mundako Upanishad',
  chandogya: 'Chandogyo Upanishad',
  brihadaranyaka: 'Brihadaranyak Upanishad',
  shvetashvatara: 'Shwetashwatara Upanishad',
  taittiriya: 'Taitiriya Upanishad',
  prashna: 'Prashnopanishad',
  mahabharata: 'Mahabharat',
  garudpurana: 'Garuda Puran',
  harivanshpuran: 'Harivansh Puran',
  naradapuran: 'Narad Puran',
  padmapuran: 'Padma Puran',
  brahmasutra: 'Vedant Darshan (Brahma Sutra)',
  vivekchudamani: 'Vivek Chudamani',
  viduraniti: 'Vidura Niti',
  vinayapatrika: 'Vinaya Patrika',
};

// Spine colour per tradition, shared with the home page's book tiles (lifted on dark themes by .home-book).
const CATEGORY_COLOURS: Readonly<Record<string, string>> = {
  veda: '#2f6f5e',
  upanishad: '#8a6a3c',
  vedanta: '#4f46e5',
  sutra: '#a16207',
  shakta: '#be123c',
  purana: '#6b3fa0',
  itihasa: '#1f4e8c',
  smriti: '#7e22ce',
  tantra: '#9d174d',
  stotra: '#c2410c',
  other: '#047857',
};

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
  const detailed = view === 'detailed';
  const headingId = `lib-${item.id}-title`;
  const level = readingLevelOf(item);
  const themes = themesOf(item).slice(0, 6);
  const updated = formatDate(item.facts.lastUpdated, true);
  const fetched = formatDate(item.facts.sourceFetched, false);
  const commentary: string[] = [];
  if (item.facts.hindiCommentary) commentary.push('Hindi verse-by-verse commentary');
  if (item.explanation) commentary.push('Book overview (English & Hindi)');
  const readingHref = item.id === 'ashtavakra' ? '/ashtavakra/' : `/scripture/${item.id}`;
  const englishTitle = GITA_PRESS_COVER_TITLES[item.id] ?? item.title;
  // A partial text says how much of the traditional whole the library holds.
  const ofAbout = item.canonicalTotalVerses != null && item.canonicalTotalVerses > item.totalVerses
    ? ` of about ${formatNumber(item.canonicalTotalVerses)}`
    : '';
  const countLabel = item.totalVerses > 0
    ? `${formatNumber(item.totalChapters)} chapters · ${formatNumber(item.totalVerses)}${ofAbout} verses`
    : 'Catalogue entry';

  return (
    <article
      aria-labelledby={headingId}
      data-tilt
      style={{ '--book': CATEGORY_COLOURS[item.category] ?? CATEGORY_COLOURS.other } as CSSProperties}
      className="home-book group relative flex h-full flex-col overflow-hidden rounded-card bg-dharma-card p-5 pl-7 shadow-raised sm:p-6 sm:pl-8"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[color:var(--book-ink)]" />
      <header className="flex items-start justify-between gap-3">
        <p className="text-xs text-dharma-muted">{categoryLabel}</p>
        <button
          type="button"
          onClick={() => onToggleSave(item.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
          className={`apple-icon-button -mr-2 -mt-2 h-11 w-11 shrink-0 ${saved ? 'text-dharma-saffron' : 'text-dharma-muted'}`}
        >
          <Bookmark className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </header>

      <h3 id={headingId} className="mt-1">
        {item.titleSanskrit && (
          <span lang="sa" className="shloka-text block text-[28px] leading-tight text-[color:var(--book-ink)] sm:text-[34px]">
            {item.titleSanskrit}
          </span>
        )}{' '}
        <span lang="en" className="mt-2 block text-title-3 font-semibold text-dharma-text">
          {englishTitle}
        </span>
        {detailed && item.titleIast && <span className="mt-0.5 block font-serif text-sm font-normal italic text-dharma-muted">{item.titleIast}</span>}
      </h3>
      <p className="mt-1 text-footnote text-dharma-muted">
        {item.author ? <span>Attributed to {item.author} · </span> : null}
        {countLabel}
      </p>

      <p className={`mt-3 text-sm leading-relaxed text-dharma-muted ${detailed ? '' : 'line-clamp-3'}`}>
        {detailed ? item.description : summaryOf(item.description)}
      </p>
      {detailed && item.explanation && (
        <p lang="hi" className="mt-3 font-devanagari text-[0.95rem] leading-[1.75] text-dharma-text/90">
          {item.explanation.overview.hi}
        </p>
      )}

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
          <Detail label="Available commentary">{commentary.length > 0 ? commentary.join('; ') : missing}</Detail>
          <Detail label="Last updated">{updated ?? missing}</Detail>
        </dl>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <Link
          href={readingHref}
          aria-label={`Start reading ${item.title}`}
          className="inline-flex min-h-[44px] items-center text-body text-dharma-saffron hover:underline"
        >
          Start reading <span aria-hidden="true">&nbsp;›</span>
        </Link>
      </div>
    </article>
  );
}
