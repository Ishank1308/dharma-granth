'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { openGlobalSearch } from '@/lib/search-events';

type SearchScopeId = 'all' | 'scripture' | 'topic' | 'mantra';

const SCOPES: ReadonlyArray<{
  id: SearchScopeId;
  label: string;
  placeholderHi: string;
  placeholderEn: string;
  examples: ReadonlyArray<{ label: string; query: string }>;
}> = [
  {
    id: 'all',
    label: 'All',
    placeholderHi: 'श्लोक, शब्द या जीवन-प्रश्न खोजें',
    placeholderEn: 'Search verse, concept, or question...',
    examples: [
      { label: 'गीता 2.47', query: 'Gita 2.47' },
      { label: 'ईशावास्योपनिषद्', query: 'ईशावास्योपनिषद्' },
      { label: 'तनाव और चिन्ता', query: 'तनाव' },
      { label: 'महामृत्युंजय', query: 'महामृत्युंजय' },
    ],
  },
  {
    id: 'scripture',
    label: 'By Scripture',
    placeholderHi: 'ग्रन्थ या अध्याय खोजें',
    placeholderEn: 'Gita, Upanishad, Veda, Purana...',
    examples: [
      { label: 'गीता 2.47', query: 'Gita 2.47' },
      { label: 'कठोपनिषद्', query: 'कठोपनिषद्' },
      { label: 'ऋग्वेद', query: 'ऋग्वेद' },
      { label: 'योगसूत्र', query: 'योगसूत्र' },
    ],
  },
  {
    id: 'topic',
    label: 'By Life Topic',
    placeholderHi: 'जीवन-विषय या भाव खोजें',
    placeholderEn: 'Peace, duty, fear, clarity...',
    examples: [
      { label: 'गीता 2.47', query: 'Gita 2.47' },
      { label: 'तनाव और चिन्ता', query: 'तनाव' },
      { label: 'कर्म', query: 'कर्म' },
      { label: 'भय', query: 'भय' },
    ],
  },
  {
    id: 'mantra',
    label: 'By Mantra',
    placeholderHi: 'वैदिक मन्त्र या स्तोत्र खोजें',
    placeholderEn: 'Gayatri, Shanti, Chalisa...',
    examples: [
      { label: 'महामृत्युंजय', query: 'महामृत्युंजय' },
      { label: 'गायत्री मन्त्र', query: 'गायत्री' },
      { label: 'शान्ति पाठ', query: 'शान्ति' },
      { label: 'गीता 2.47', query: 'Gita 2.47' },
    ],
  },
];

/** The hero's elevated search panel: scope pills, ⌘K search trigger, and quick bilingual examples. */
export function HeroSearchButton() {
  const [shortcut, setShortcut] = useState('Ctrl K');
  const [scopeId, setScopeId] = useState<SearchScopeId>('all');

  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K');
  }, []);

  const activeScope = SCOPES.find((s) => s.id === scopeId) ?? SCOPES[0];

  return (
    <div className="w-full max-w-[600px] rounded-2xl border border-dharma-border/80 bg-dharma-card/95 p-3.5 shadow-[0_14px_38px_-18px_rgba(32,22,12,0.22)] backdrop-blur-xl sm:p-4">
      {/* Scope Pills */}
      <div
        role="group"
        aria-label="Search scope"
        className="flex flex-wrap items-center gap-1.5"
      >
        {SCOPES.map((scope) => {
          const active = scope.id === scopeId;
          return (
            <button
              key={scope.id}
              type="button"
              aria-pressed={active}
              onClick={() => setScopeId(scope.id)}
              className={`focus-ring inline-flex min-h-[32px] items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                active
                  ? 'bg-dharma-text text-dharma-bg shadow-xs'
                  : 'bg-dharma-bg/80 text-dharma-muted hover:bg-dharma-saffron/10 hover:text-dharma-text'
              }`}
            >
              {scope.label}
            </button>
          );
        })}
      </div>

      {/* Main Search Input Trigger */}
      <button
        type="button"
        onClick={(event) => openGlobalSearch(undefined, event.currentTarget)}
        aria-haspopup="dialog"
        className="focus-ring mt-3 flex min-h-[48px] w-full items-center gap-2.5 rounded-xl border border-dharma-border/80 bg-dharma-bg/80 px-3.5 text-left text-dharma-muted transition-colors hover:border-dharma-saffron/55 hover:text-dharma-text"
        aria-label="Search scriptures: a verse, word or question / श्लोक या प्रश्न खोजें"
      >
        <Search className="h-4 w-4 shrink-0 text-dharma-saffron" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate py-2 text-xs sm:text-sm">
          <span lang="hi" className="font-devanagari font-medium text-dharma-text/90">
            {activeScope.placeholderHi}
          </span>
          <span className="mx-1.5 hidden text-dharma-muted sm:inline" aria-hidden="true">·</span>
          <span className="hidden text-xs text-dharma-muted sm:inline">
            {activeScope.placeholderEn}
          </span>
        </span>
        <kbd className="kbd-hint hidden shrink-0 rounded-md border border-dharma-border/80 bg-dharma-card px-2 py-0.5 font-sans text-[11px] font-semibold text-dharma-text-secondary sm:inline-block">
          {shortcut}
        </kbd>
      </button>

      {/* Quick Bilingual Suggestions */}
      <div
        role="group"
        aria-label="Try a search"
        className="mt-3 flex flex-wrap items-center gap-1.5"
      >
        <span className="mr-1 text-xs font-medium text-dharma-muted">Try · खोजें:</span>
        {activeScope.examples.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={(event) => openGlobalSearch(example.query, event.currentTarget)}
            aria-label={`Search example: ${example.label}`}
            className="focus-ring inline-flex min-h-[36px] items-center rounded-lg border border-dharma-border/75 bg-dharma-bg/75 px-2.5 py-1 font-devanagari text-xs font-semibold text-dharma-text transition-colors hover:border-dharma-saffron/60 hover:bg-dharma-saffron/10"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
