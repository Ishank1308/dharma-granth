'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { openGlobalSearch } from '@/lib/search-events';

/** The hero's search field: a button that opens the ⌘K palette. */
export function HeroSearchButton() {
  const [shortcut, setShortcut] = useState('Ctrl K');

  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K');
  }, []);

  return (
    <div className="mx-auto w-full max-w-[580px]">
      <button
      type="button"
      onClick={(event) => openGlobalSearch(undefined, event.currentTarget)}
      aria-haspopup="dialog"
      className="focus-ring mx-auto mt-5 flex min-h-[54px] w-full max-w-[580px] items-center gap-2.5 rounded-2xl border border-dharma-border/80 bg-dharma-card/90 px-4 text-left text-body text-dharma-muted shadow-raised backdrop-blur-md lift-hover hover:border-dharma-saffron/40 hover:text-dharma-text sm:px-5"
      aria-label="Search scriptures: a verse, word or question / श्लोक या प्रश्न खोजें"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dharma-saffron/10 text-dharma-saffron">
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 py-2.5">
        <span lang="hi" className="font-devanagari text-sm font-medium text-dharma-text">
          श्लोक, शब्द या जीवन-प्रश्न खोजें
        </span>
        <span className="mx-1.5 hidden text-dharma-border sm:inline" aria-hidden="true">|</span>
        <span className="hidden text-xs text-dharma-muted sm:inline">
          Search verse or question
        </span>
      </span>
      <kbd className="kbd-hint hidden shrink-0 sm:inline-block rounded-md border border-dharma-border bg-dharma-bg/60 px-2 py-0.5 font-sans text-xs text-dharma-text-secondary">{shortcut}</kbd>
      </button>
      <div role="group" aria-label="Try a search" className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <span className="mr-0.5 text-xs font-medium text-dharma-muted">Try · खोजें</span>
        {[
          { label: 'गीता 2.47', query: 'Gita 2.47' },
          { label: 'कर्म', query: 'कर्म' },
          { label: 'अष्टावक्र', query: 'अष्टावक्र गीता' },
          { label: 'भय', query: 'भय' },
        ].map((example) => (
          <button
            key={example.query}
            type="button"
            onClick={(event) => openGlobalSearch(example.query, event.currentTarget)}
            aria-label={`Search example: ${example.label}`}
            className="focus-ring inline-flex min-h-[44px] items-center rounded-full border border-dharma-border/75 bg-dharma-card/70 px-3.5 font-devanagari text-xs font-semibold text-dharma-text transition-colors hover:border-dharma-saffron/60 hover:bg-dharma-saffron/10"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
