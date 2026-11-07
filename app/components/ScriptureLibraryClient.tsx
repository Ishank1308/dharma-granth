'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutGrid, LayoutList, Search, SlidersHorizontal, X } from 'lucide-react';
import type { ScriptureCategory } from '@/data/types';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { triggerTactileFeedback } from '@/lib/haptics';
import { useConnectivity } from '@/lib/useConnectivity';
import {
  EMPTY_FILTERS,
  LANGUAGES,
  LENGTHS,
  SORT_OPTIONS,
  TOPICS,
  TRADITIONS,
  activeFilterCount,
  applyFilters,
  buildSearchable,
  facetCounts,
  formatNumber,
  plural,
  sortItems,
  suggestCorrection,
  type FacetKey,
  type Filters,
  type LibraryItem,
  type SortMode,
  type ViewMode,
} from '@/lib/library';
import { LibraryCard } from '@/app/components/library/LibraryCard';
import { FilterPanel, type FilterGroup, type GroupKey, type ToggleOption } from '@/app/components/library/FilterPanel';
import { FilterSheet } from '@/app/components/library/FilterSheet';
import { FilteredEmpty, LoadFailure, NoResults, OfflineBanner, SearchCorrection, type Relaxation } from '@/app/components/library/LibraryStates';

type CategoryOption = { id: ScriptureCategory; label: string; description: string };

/** A library entry as the page passes it; `facts` may be missing if measuring the data files failed. */
type IncomingItem = Omit<LibraryItem, 'facts'> & { facts?: LibraryItem['facts'] };

const SAVED_KEY = 'dharma.saved_scriptures';
const NO_SAVED: string[] = [];

/** Older shared links used `lang=sanskrit|hindi|english`. */
const LEGACY_LANGUAGE: Record<string, string> = { sanskrit: 'sa', hindi: 'hi', english: 'en' };

const SORT_IDS = SORT_OPTIONS.map((o) => o.id as string);

function withFacts(item: IncomingItem): LibraryItem {
  return (
    item.facts
      ? (item as LibraryItem)
      : { ...item, facts: { languages: { sa: true, hi: item.hasData, en: item.hasData }, hindiCommentary: false } }
  );
}

interface UrlState {
  filters: Filters;
  sort: SortMode;
  view: ViewMode;
}

function readUrl(search: string, validCategories: string[]): UrlState {
  const p = new URLSearchParams(search);
  const only = (key: string, valid?: string[]) =>
    p.getAll(key).filter((v) => !valid || valid.indexOf(v) !== -1);
  const sort = p.get('sort') ?? '';
  const view = p.get('view');
  return {
    filters: {
      q: p.get('q') ?? '',
      category: only('category', validCategories),
      tradition: only('tradition', TRADITIONS.map((t) => t.id)),
      language: p
        .getAll('lang')
        .map((v) => LEGACY_LANGUAGE[v] ?? v)
        .filter((v) => LANGUAGES.some((l) => l.id === v)),
      topic: only('topic', TOPICS.map((t) => t.id)),
      author: only('author'),
      length: only('length', LENGTHS.map((l) => l.id)),
      explained: p.get('explained') === '1',
      beginner: p.get('beginner') === '1',
    },
    sort: SORT_IDS.indexOf(sort) !== -1 ? (sort as SortMode) : 'featured',
    view: view === 'detailed' ? 'detailed' : 'compact',
  };
}

function writeUrl(f: Filters, sort: SortMode, view: ViewMode): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  f.category.forEach((v) => p.append('category', v));
  f.tradition.forEach((v) => p.append('tradition', v));
  f.language.forEach((v) => p.append('lang', v));
  f.topic.forEach((v) => p.append('topic', v));
  f.author.forEach((v) => p.append('author', v));
  f.length.forEach((v) => p.append('length', v));
  if (f.explained) p.set('explained', '1');
  if (f.beginner) p.set('beginner', '1');
  if (sort !== 'featured') p.set('sort', sort);
  if (view !== 'compact') p.set('view', view);
  const qs = p.toString();
  return qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
}

export function ScriptureLibraryClient({
  scriptures,
  categories,
  loadError = false,
}: {
  scriptures: IncomingItem[];
  categories: CategoryOption[];
  /** The page could not read the catalogue. */
  loadError?: boolean;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortMode, setSortMode] = useState<SortMode>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const online = useConnectivity();
  const [saved, setSaved] = useLocalStorage<string[]>(SAVED_KEY, NO_SAVED);

  const items = useMemo(() => (Array.isArray(scriptures) ? scriptures.map(withFacts) : []), [scriptures]);
  const searchable = useMemo(() => buildSearchable(items), [items]);
  const categoryIds = useMemo(() => categories.map((c) => c.id as string), [categories]);

  // Read the URL once on mount. The writer below waits for the render that
  // follows (state flag, not a ref), otherwise it would erase ?q=… first.
  useEffect(() => {
    const url = readUrl(window.location.search, categoryIds);
    setFilters(url.filters);
    setSortMode(url.sort);
    setViewMode(url.view);
    setHydrated(true);
  }, [categoryIds]);

  useEffect(() => {
    if (!hydrated) return;
    window.history.replaceState(null, '', writeUrl(filters, sortMode, viewMode));
  }, [hydrated, filters, sortMode, viewMode]);

  const results = useMemo(() => sortItems(applyFilters(searchable, filters), sortMode), [searchable, filters, sortMode]);
  const activeCount = activeFilterCount(filters);
  const hasQuery = filters.q.trim().length > 0;

  /* ── Filter model ─────────────────────────────────────────────── */

  const groups = useMemo<FilterGroup[]>(() => {
    const build = (key: FacetKey, options: Array<{ id: string; label: string; hint?: string }>) => {
      const counts = facetCounts(searchable, filters, key, options.map((o) => o.id));
      return options.map((o) => ({ ...o, count: counts[o.id] ?? 0 }));
    };
    const authors = Array.from(new Set(items.map((i) => i.author).filter((a): a is string => !!a))).sort();
    const list: FilterGroup[] = [
      {
        key: 'category',
        title: 'Category',
        titleHi: 'श्रेणी',
        options: build('category', categories.filter((c) => items.some((i) => i.category === c.id)).map((c) => ({ id: c.id, label: c.label }))),
      },
      {
        key: 'tradition',
        title: 'Tradition',
        titleHi: 'परंपरा',
        options: build('tradition', TRADITIONS.map((t) => ({ id: t.id, label: t.label }))),
      },
      {
        key: 'language',
        title: 'Language',
        titleHi: 'भाषा',
        options: build('language', LANGUAGES.map((l) => ({ id: l.id, label: l.label, hint: l.id === 'en' ? undefined : l.native }))),
      },
      {
        key: 'length',
        title: 'Length',
        titleHi: 'लंबाई',
        options: build('length', LENGTHS.map((l) => ({ id: l.id, label: l.label, hint: l.hint }))),
        defaultOpen: false,
      },
      {
        key: 'topic',
        title: 'Topic',
        titleHi: 'विषय',
        options: build('topic', TOPICS.map((t) => ({ id: t.id, label: t.label }))),
        defaultOpen: false,
      },
    ];
    // Only a handful of texts record an author, so the group appears only when some do.
    if (authors.length > 0) {
      list.push({
        key: 'author',
        title: 'Author',
        titleHi: 'रचयिता',
        options: build('author', authors.map((a) => ({ id: a, label: a }))),
        defaultOpen: false,
      });
    }
    return list;
  }, [searchable, filters, items, categories]);

  const toggles = useMemo<ToggleOption[]>(
    () => [
      { key: 'explained', label: 'Text in the library', labelHi: 'श्लोक पुस्तकालय में', count: facetCounts(searchable, filters, 'explained', ['on']).on },
      { key: 'beginner', label: 'Beginner friendly', labelHi: 'नए पाठकों के लिए', count: facetCounts(searchable, filters, 'beginner', ['on']).on },
    ],
    [searchable, filters],
  );

  const toggleValue = useCallback((key: GroupKey, id: string) => {
    setFilters((f) => ({ ...f, [key]: f[key].indexOf(id) === -1 ? [...f[key], id] : f[key].filter((v) => v !== id) }));
  }, []);
  const toggleFlag = useCallback((key: 'explained' | 'beginner') => setFilters((f) => ({ ...f, [key]: !f[key] })), []);
  const clearFilters = useCallback(() => setFilters((f) => ({ ...EMPTY_FILTERS, q: f.q })), []);
  const clearAll = useCallback(() => setFilters(EMPTY_FILTERS), []);
  const setQuery = (q: string) => setFilters((f) => ({ ...f, q }));

  const toggleSave = useCallback(
    (id: string) => {
      triggerTactileFeedback('light', 'softTap');
      setSaved((prev) => (prev.indexOf(id) === -1 ? [...prev, id] : prev.filter((s) => s !== id)));
    },
    [setSaved],
  );

  /* ── Active chips and "what to relax" ─────────────────────────── */

  const labelFor = useCallback(
    (key: GroupKey, id: string) => groups.find((g) => g.key === key)?.options.find((o) => o.id === id)?.label ?? id,
    [groups],
  );

  const chips = useMemo(() => {
    const out: Array<{ id: string; label: string; clear: () => void; facet: FacetKey }> = [];
    (['category', 'tradition', 'language', 'length', 'topic', 'author'] as GroupKey[]).forEach((key) => {
      filters[key].forEach((id) => {
        out.push({ id: `${key}:${id}`, label: labelFor(key, id), facet: key, clear: () => toggleValue(key, id) });
      });
    });
    if (filters.explained) out.push({ id: 'explained', label: 'Text in the library', facet: 'explained', clear: () => toggleFlag('explained') });
    if (filters.beginner) out.push({ id: 'beginner', label: 'Beginner friendly', facet: 'beginner', clear: () => toggleFlag('beginner') });
    return out;
  }, [filters, labelFor, toggleValue, toggleFlag]);

  const relaxations = useMemo<Relaxation[]>(() => {
    if (results.length > 0) return [];
    const seen: Record<string, boolean> = {};
    const out: Relaxation[] = [];
    chips.forEach((chip) => {
      if (seen[chip.facet]) return;
      seen[chip.facet] = true;
      const without: Filters = { ...filters, [chip.facet]: Array.isArray(filters[chip.facet as GroupKey]) ? [] : false };
      const count = applyFilters(searchable, without).length;
      if (count > 0) {
        const label = chips.filter((c) => c.facet === chip.facet).map((c) => c.label).join(', ');
        out.push({ label, count, onApply: () => setFilters(without) });
      }
    });
    // The search text itself can be the thing ruling everything out.
    if (filters.q.trim()) {
      const count = applyFilters(searchable, { ...filters, q: '' }).length;
      if (count > 0) out.push({ label: `search: ${filters.q.trim()}`, count, onApply: () => setFilters((f) => ({ ...f, q: '' })) });
    }
    return out.sort((a, b) => b.count - a.count).slice(0, 3);
  }, [results.length, chips, filters, searchable]);

  const suggestion = useMemo(() => {
    if (results.length > 0 || !hasQuery) return null;
    const fixed = suggestCorrection(searchable, filters.q);
    return fixed && applyFilters(searchable, { ...filters, q: fixed }).length > 0 ? fixed : null;
  }, [results.length, hasQuery, searchable, filters]);

  /* ── Render ───────────────────────────────────────────────────── */

  if (loadError || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-gutter py-12">
        <LoadFailure onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const panel = (idPrefix: string) => (
    <FilterPanel idPrefix={idPrefix} groups={groups} toggles={toggles} filters={filters} onToggleValue={toggleValue} onToggleFlag={toggleFlag} />
  );

  const viewButton = (mode: ViewMode, label: string, Icon: typeof LayoutGrid) => (
    <button
      type="button"
      onClick={() => setViewMode(mode)}
      aria-pressed={viewMode === mode}
      className={`focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-[7px] px-3 text-footnote transition sm:min-h-[32px] ${
        viewMode === mode ? 'bg-dharma-card font-semibold text-dharma-text shadow-[0_1px_3px_rgba(0,0,0,0.12)]' : 'text-dharma-muted hover:text-dharma-text'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {/* Icon-only on phones so the sort menu and both view buttons fit one row. */}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-gutter pb-20">
      {online === false && (
        <div className="pt-5">
          <OfflineBanner />
        </div>
      )}

      {/* Sticky search: always in reach while scrolling a long list. */}
      <div className="apple-bar sticky top-[52px] z-30 -mx-5 border-b px-5 py-3 sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <label className="relative block flex-1">
            <span className="sr-only">Search scriptures</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dharma-muted" aria-hidden="true" />
            <input
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              value={filters.q}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, Sanskrit name, author, topic…"
              className="min-h-[44px] w-full rounded-field border-0 bg-dharma-text/[0.06] py-2.5 pl-11 pr-4 text-body text-dharma-text outline-none transition placeholder:text-dharma-muted focus:ring-2 focus:ring-dharma-saffron/40"
            />
          </label>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            className="focus-ring relative inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-field bg-dharma-text/[0.06] px-4 text-subhead text-dharma-text transition lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-dharma-saffron px-1 text-[11px] font-semibold text-dharma-bg" aria-label={`${activeCount} active`}>
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Category & Tradition Pills */}
        <div className="mx-auto mt-2.5 flex max-w-7xl items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: 'all', label: `सभी ${items.length}` },
            { id: 'vedanta', label: 'वेदान्त व गीता', matchCat: ['vedanta', 'gita'] },
            { id: 'upanishad', label: 'उपनिषद्', matchCat: ['upanishad'] },
            { id: 'veda', label: 'वेद', matchCat: ['veda'] },
            { id: 'itihasa', label: 'इतिहास', matchCat: ['itihasa'] },
            { id: 'purana', label: 'पुराण', matchCat: ['purana'] },
          ].map((pill) => {
            const isAll = pill.id === 'all';
            const isActive = isAll
              ? filters.category.length === 0
              : pill.matchCat?.some((c) => filters.category.includes(c));

            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  triggerTactileFeedback('light', 'softTap');
                  if (isAll) {
                    setFilters((f) => ({ ...f, category: [] }));
                  } else {
                    setFilters((f) => ({
                      ...f,
                      category: isActive
                        ? f.category.filter((c) => !pill.matchCat?.includes(c))
                        : [...new Set([...f.category, ...(pill.matchCat || [])])],
                    }));
                  }
                }}
                className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold transition active:scale-95 ${
                  isActive
                    ? 'bg-saffron-700 text-white shadow-xs font-bold'
                    : 'bg-dharma-text/[0.06] text-dharma-muted hover:bg-dharma-text/[0.1] hover:text-dharma-text'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-10">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-[136px] max-h-[calc(100dvh-160px)] overflow-y-auto rounded-[18px] bg-dharma-card p-3">
            <div className="flex items-center justify-between px-2 pb-2">
              <h2 className="text-body font-semibold text-dharma-text">
                Filters <span lang="hi" className="ml-1 font-devanagari text-sm font-normal text-dharma-muted">फ़िल्टर</span>
              </h2>
              {activeCount > 0 && (
                <button type="button" onClick={clearFilters} className="focus-ring min-h-[36px] rounded px-2 text-footnote text-dharma-saffron hover:underline">
                  Clear all
                </button>
              )}
            </div>
            {panel('side')}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="status" aria-live="polite" className="text-sm text-dharma-muted">
              <span className="font-semibold text-dharma-text">{formatNumber(results.length)}</span> of {plural(items.length, 'text')}
              <span lang="hi" className="ml-2 font-devanagari">परिणाम</span>
              {hasQuery && (
                <>
                  {' '}
                  for <span className="font-semibold text-dharma-text">“{filters.q.trim()}”</span>
                </>
              )}
            </p>
            <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
              <label className="inline-flex min-h-[36px] min-w-0 items-center gap-2 rounded-[9px] bg-dharma-text/[0.06] pl-3 text-footnote text-dharma-muted">
                Sort
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="min-h-[36px] cursor-pointer rounded-[9px] bg-transparent py-1.5 pl-1 pr-3 font-semibold text-dharma-text outline-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id} className="bg-dharma-card text-dharma-text">
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <div role="group" aria-label="Card view" className="inline-flex rounded-[9px] bg-dharma-text/[0.06] p-0.5">
                {viewButton('compact', 'Compact', LayoutGrid)}
                {viewButton('detailed', 'Detailed', LayoutList)}
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <ul aria-label="Active filters" className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <li key={chip.id}>
                  <button
                    type="button"
                    onClick={chip.clear}
                    aria-label={`Remove filter: ${chip.label}`}
                    className="focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-dharma-saffron/10 pl-3.5 pr-2.5 text-sm text-dharma-saffron transition hover:bg-dharma-saffron/15"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clearFilters} className="focus-ring min-h-[36px] rounded-full px-3 text-sm font-semibold text-dharma-muted underline-offset-4 hover:text-dharma-text hover:underline">
                  Clear filters
                </button>
              </li>
            </ul>
          )}

          <div className="mt-6">
            {/* Parent heading for the cards' h3s (the visible Filters h2 is desktop-only). */}
            <h2 className="sr-only">ग्रंथ · Texts</h2>
            {results.length === 0 ? (
              activeCount > 0 ? (
                <FilteredEmpty
                  total={items.length}
                  relaxations={relaxations}
                  onClearFilters={clearFilters}
                  suggestion={suggestion}
                  onApplySuggestion={() => suggestion && setQuery(suggestion)}
                />
              ) : suggestion ? (
                <SearchCorrection query={filters.q.trim()} suggestion={suggestion} onApply={() => setQuery(suggestion)} onClear={() => setQuery('')} />
              ) : (
                <NoResults query={filters.q.trim()} onClear={() => setQuery('')} />
              )
            ) : (
              <ul className={`reveal-grid grid gap-4 ${viewMode === 'detailed' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
                {results.map((item) => (
                  <li key={item.id} className="min-w-0">
                    <LibraryCard
                      item={item}
                      categoryLabel={categories.find((c) => c.id === item.category)?.label ?? item.category}
                      view={viewMode}
                      saved={saved.indexOf(item.id) !== -1}
                      onToggleSave={toggleSave}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} resultCount={results.length} activeCount={activeCount} onClear={clearAll}>
        {panel('sheet')}
      </FilterSheet>
    </div>
  );
}
