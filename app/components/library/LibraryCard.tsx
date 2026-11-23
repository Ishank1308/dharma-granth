'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookOpen, ListChecks, FileClock } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import {
  LANGUAGES,
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
import { getCoverEnglishTitle } from '@/lib/gita-press-titles';

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
  // Compact view on a phone: one short row per text (name, kind, size) that opens on a tap, so
  // 67 texts are a few screens of scrolling. The fuller card returns from 640px, and in Detailed.
  const row = (classes: string) => (detailed ? '' : ` ${classes}`);
  const headingId = `lib-${item.id}-title`;
  const level = readingLevelOf(item);
  const themes = themesOf(item).slice(0, 6);
  const updated = formatDate(item.facts.lastUpdated, true);
  const fetched = formatDate(item.facts.sourceFetched, false);
  const commentary: string[] = [];
  if (item.facts.hindiCommentary) commentary.push('Hindi verse-by-verse commentary');
  if (item.explanation) commentary.push('Book overview (English & Hindi)');
  const readingHref = item.id === 'ashtavakra' ? '/ashtavakra/' : `/scripture/${item.id}/`;
  const englishTitle = getCoverEnglishTitle(item.id, item.title);
  // A partial text says how much of the traditional whole the library holds.
  const ofAbout = item.canonicalTotalVerses != null && item.canonicalTotalVerses > item.totalVerses
    ? ` of about ${formatNumber(item.canonicalTotalVerses)}`
    : '';
  const countLabel = item.totalVerses > 0
    ? `${plural(item.totalChapters, 'chapter')} · ${formatNumber(item.totalVerses)}${ofAbout} ${item.totalVerses === 1 ? 'verse' : 'verses'}`
    : 'Catalogue entry';

  const [visitedChapter, setVisitedChapter] = useState<number | null>(null);
  // Library entries are catalog data, but the saved chapter comes from localStorage.
  // Restrict generated routes to known-safe slug characters and positive integers.
  const safeId = /^[a-z0-9-]+$/.test(item.id) ? item.id : null;
  const lastReadHref = safeId && visitedChapter !== null && Number.isSafeInteger(visitedChapter)
    ? safeId === 'ashtavakra'
      ? `/ashtavakra/${visitedChapter}/`
      : `/scripture/${encodeURIComponent(safeId)}/chapter/${visitedChapter}/`
    : null;

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dharma.recentChapters');
      if (!raw) return;
      const visits = JSON.parse(raw);
      if (!Array.isArray(visits)) return;
      const match = visits.find((v: { scriptureId?: string }) => v?.scriptureId === item.id);
      const rawChapter: unknown = match?.chapterId;
      // Rebuild the chapter number from digits only; never forward stored HTML
      // or free-form text into a rendered link.
      if (typeof rawChapter !== 'number' && typeof rawChapter !== 'string') return;
      const digits = String(rawChapter);
      if (!/^[1-9][0-9]{0,4}$/.test(digits)) return;
      const chapterNumber = Number(digits);
      if (Number.isSafeInteger(chapterNumber) && chapterNumber <= item.totalChapters) {
        setVisitedChapter(chapterNumber);
      }
    } catch {
      // ignore storage errors
    }
  }, [item.id, item.totalChapters]);

  return (
    <article
      aria-labelledby={headingId}
      data-tilt
      data-vt-source
      style={{ '--book': CATEGORY_COLOURS[item.category] ?? CATEGORY_COLOURS.other } as CSSProperties}
      className={`home-book card-sacred sheen-sweep group relative flex h-full flex-col overflow-hidden rounded-card bg-dharma-card p-4 pl-6 shadow-raised sm:p-6 sm:pl-8${row('max-sm:py-3')}`}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[color:var(--book-ink)]" />
      <header className={`flex items-start justify-between gap-3${row('max-sm:absolute max-sm:right-3 max-sm:top-3 max-sm:z-[2]')}`}>
        <p className={`text-xs text-dharma-muted${row('max-sm:hidden')}`}>{categoryLabel}</p>
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

      <h3 id={headingId} className={`mt-1${row('max-sm:mt-0 max-sm:pr-10')}`}>
        {item.titleSanskrit && (
          <span lang="sa" className={`shloka-text block text-[28px] leading-tight text-[color:var(--book-ink)] sm:text-[34px]${row('max-sm:text-title-3 max-sm:tracking-normal')}`}>
            {item.titleSanskrit}
          </span>
        )}{' '}
        <span lang="en" className={`mt-2 block text-title-3 font-semibold text-dharma-text${row('max-sm:mt-0.5 max-sm:text-callout')}`}>
          {englishTitle}
        </span>
        {detailed && item.titleIast && <span className="mt-0.5 block font-serif text-sm font-normal italic text-dharma-muted">{item.titleIast}</span>}
      </h3>
      <p className={`mt-1 text-footnote text-dharma-muted${row('max-sm:mt-0.5 max-sm:pr-6')}`}>
        {!detailed && <span className="sm:hidden">{categoryLabel} · </span>}
        {item.author ? <span className={row('max-sm:hidden')}>Attributed to {item.author} · </span> : null}
        <span>{countLabel}</span>
      </p>

      <p className={`mt-3 text-sm leading-relaxed text-dharma-muted ${detailed ? '' : 'line-clamp-3 max-sm:hidden'}`}>
        {detailed ? item.description : summaryOf(item.description)}
      </p>
      {detailed && item.explanation && (
        <p lang="hi" className="mt-3 font-devanagari text-[0.95rem] leading-[1.75] text-dharma-text/90">
          {item.explanation.overview.hi}
        </p>
      )}

      <div className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-2${row('max-sm:hidden')}`}>
        <LanguageChips item={item} />
        <StatusBadge item={item} />
      </div>
      {!detailed && <p className="mt-2 text-sm text-dharma-muted max-sm:hidden">Reading level: {level.label}</p>}

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

      {lastReadHref && (
        <div className={`mt-3 border-t border-dharma-border/60 pt-3${row('max-sm:mt-2 max-sm:flex max-sm:items-center max-sm:gap-3 max-sm:pt-1')}`}>
          <p className="font-devanagari text-xs text-dharma-muted">
            हाल में खोला · अध्याय {visitedChapter} / {item.totalChapters}
          </p>
          <Link
            href={lastReadHref}
            className={`focus-ring mt-1 inline-flex min-h-[44px] items-center text-xs font-semibold text-dharma-saffron hover:underline${row('max-sm:relative max-sm:z-[2] max-sm:mt-0')}`}
          >
            इस अध्याय को खोलें
          </Link>
        </div>
      )}

      <div className={`mt-auto flex flex-wrap items-center gap-2 pt-4${row('max-sm:pt-0')}`}>
        {/* On a phone row the link covers the row, so the whole row opens the text. */}
        <Link
          href={readingHref}
          data-vt="open"
          aria-label={`Start reading ${item.title}`}
          className={`inline-flex min-h-[44px] items-center text-body text-dharma-saffron hover:underline${row('max-sm:absolute max-sm:inset-0 max-sm:z-[1] max-sm:min-h-0 max-sm:rounded-card')}`}
        >
          <span className={row('max-sm:sr-only')}>
            Start reading <span aria-hidden="true">&nbsp;›</span>
          </span>
        </Link>
        {!detailed && (
          <span aria-hidden="true" className="absolute bottom-3 right-5 text-title-3 leading-none text-dharma-saffron sm:hidden">
            ›
          </span>
        )}
      </div>
    </article>
  );
}
