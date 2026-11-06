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
      onClick={() => openGlobalSearch()}
      className="mx-auto mt-10 flex h-[52px] w-full max-w-[560px] items-center gap-3 rounded-group border border-dharma-text/10 bg-dharma-card px-[18px] text-left text-body text-dharma-muted shadow-raised lift-hover hover:border-dharma-text/20"
      aria-label="Search scriptures: a verse, word or question"
    >
      <Search className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">Search a verse, word or question</span>
      <kbd className="kbd-hint shrink-0 rounded-md bg-dharma-text/[0.07] px-1.5 py-0.5 font-sans text-xs text-dharma-text-secondary">{shortcut}</kbd>
    </button>
  );
}
