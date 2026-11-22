'use client';

import Link from 'next/link';
import { Bookmark, BookOpen, Home, Search, Sparkles } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

/**
 * Mobile Bottom Navigation Bar (Thumb Usability)
 * Strictly limited to the 5 primary destinations: Home, Search, Library, Sadhana, Saved.
 */
export function MobileBottomTabBar({
  isActive,
  bookmarkCount,
  onOpenSearch,
}: {
  isActive: (href: string) => boolean;
  bookmarkCount: number;
  onOpenSearch: () => void;
}) {
  return (
    <nav
      aria-label="Mobile quick navigation"
      className="apple-bar fixed bottom-0 inset-x-0 z-30 lg:hidden border-t"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="grid grid-cols-5 h-14">
        {/* 1. Home */}
        <Link
          href="/"
          onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
          aria-current={isActive('/') ? 'page' : undefined}
          className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
            isActive('/')
              ? 'text-dharma-saffron'
              : 'text-dharma-muted hover:text-dharma-text'
          }`}
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          <span data-mobile-nav-label className="min-w-0 max-w-full truncate px-0.5 text-center text-[clamp(11px,3vw,13px)] tracking-tight">Home</span>
        </Link>

        {/* 2. Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-dharma-muted transition active:scale-95 hover:text-dharma-text"
          aria-label="खोजें (Search)"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          <span data-mobile-nav-label className="min-w-0 max-w-full truncate px-0.5 text-center text-[clamp(11px,3vw,13px)] tracking-tight">Search</span>
        </button>

        {/* 3. Library */}
        <Link
          href="/scriptures/"
          onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
          aria-current={isActive('/scriptures/') ? 'page' : undefined}
          className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
            isActive('/scriptures/')
              ? 'text-dharma-saffron'
              : 'text-dharma-muted hover:text-dharma-text'
          }`}
        >
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          <span data-mobile-nav-label className="min-w-0 max-w-full truncate px-0.5 text-center text-[clamp(11px,3vw,13px)] tracking-tight">Library</span>
        </Link>

        {/* 4. Sadhana */}
        <Link
          href="/practice/"
          onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
          aria-current={isActive('/practice/') && !isActive('/practice/bookmarks/') ? 'page' : undefined}
          className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
            isActive('/practice/') && !isActive('/practice/bookmarks/')
              ? 'text-dharma-saffron'
              : 'text-dharma-muted hover:text-dharma-text'
          }`}
        >
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          <span data-mobile-nav-label className="min-w-0 max-w-full truncate px-0.5 text-center text-[clamp(11px,3vw,13px)] tracking-tight">Sadhana</span>
        </Link>

        {/* 5. Saved Verses */}
        <Link
          href="/practice/bookmarks/"
          onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
          aria-current={isActive('/practice/bookmarks/') ? 'page' : undefined}
          className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
            isActive('/practice/bookmarks/')
              ? 'text-dharma-saffron'
              : 'text-dharma-muted hover:text-dharma-text'
          }`}
        >
          <div className="relative">
            <Bookmark className="h-5 w-5" aria-hidden="true" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-dharma-saffron px-1 text-[9px] font-semibold text-dharma-bg">
                {bookmarkCount > 9 ? '9+' : bookmarkCount}
              </span>
            )}
          </div>
          <span data-mobile-nav-label className="min-w-0 max-w-full truncate px-0.5 text-center text-[clamp(11px,3vw,13px)] tracking-tight">Saved</span>
        </Link>
      </div>
    </nav>
  );
}
