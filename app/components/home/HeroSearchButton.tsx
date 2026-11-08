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
    <button
      type="button"
      onClick={(event) => openGlobalSearch(undefined, event.currentTarget)}
      aria-haspopup="dialog"
      className="focus-ring mx-auto mt-8 flex h-[54px] min-h-[44px] w-full max-w-[580px] items-center gap-3 rounded-2xl border border-dharma-border/80 bg-dharma-card/90 px-4 text-left text-body text-dharma-muted shadow-raised backdrop-blur-md lift-hover hover:border-dharma-saffron/40 hover:text-dharma-text sm:px-5"
      aria-label="Search scriptures: a verse, word or question / श्लोक या प्रश्न खोजें"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dharma-saffron/10 text-dharma-saffron">
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 truncate">
        <span lang="hi" className="font-devanagari text-sm font-medium text-dharma-text">
          श्लोक, शब्द या जीवन-प्रश्न खोजें
        </span>
        <span className="mx-1.5 hidden text-dharma-border sm:inline" aria-hidden="true">|</span>
        <span className="hidden text-xs text-dharma-muted sm:inline">
          Search verse or question
        </span>
      </div>
      <kbd className="kbd-hint shrink-0 rounded-md border border-dharma-border bg-dharma-bg/60 px-2 py-0.5 font-sans text-xs text-dharma-text-secondary">{shortcut}</kbd>
    </button>
  );
}
