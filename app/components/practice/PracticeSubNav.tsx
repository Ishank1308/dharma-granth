'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Bookmark,
  FolderOpen,
  HardDriveDownload,
  NotebookPen,
  ScrollText,
  Sun,
} from 'lucide-react';

const PRACTICE_ITEMS = [
  { href: '/practice/', en: 'Today', hi: 'साधना', Icon: Sun },
  { href: '/practice/gita-sankalpa/', en: 'Gita Sankalpa', hi: 'गीता संकल्प', Icon: ScrollText },
  { href: '/practice/bookmarks/', en: 'Saved', hi: 'सुरक्षित', Icon: Bookmark },
  { href: '/practice/journal/', en: 'Journal', hi: 'डायरी', Icon: NotebookPen },
  { href: '/practice/desk/', en: 'Study Desk', hi: 'अध्ययन-पटल', Icon: FolderOpen },
  { href: '/practice/dashboard/', en: 'Progress', hi: 'प्रगति', Icon: BarChart3 },
  { href: '/practice/saved/', en: 'Offline', hi: 'ऑफ़लाइन', Icon: HardDriveDownload },
] as const;

/**
 * Shared sub-navigation strip across all 7 Practice / साधना views so readers can move
 * between daily tools, Gita Sankalpa, saved verses, journal, desk, progress, and offline library.
 */
export function PracticeSubNav({ className = '' }: { className?: string }) {
  const rawPathname = usePathname() || '/practice/';
  const pathname = rawPathname.endsWith('/') ? rawPathname : `${rawPathname}/`;

  return (
    <nav aria-label="Practice sections · साधना अनुभाग" className={className}>
      <div className="flex min-w-0 snap-x snap-proximity items-center gap-2 overflow-x-auto rounded-2xl border border-separator bg-dharma-card/85 p-1.5 shadow-2xs scrollbar-none">
        {PRACTICE_ITEMS.map(({ href, en, hi, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`focus-ring inline-flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                active
                  ? 'bg-saffron-700 text-white shadow-xs'
                  : 'border border-separator/70 bg-surface-raised text-label-secondary hover:border-saffron-500/50 hover:text-label-primary'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span lang="hi" data-bi="hi" className="font-devanagari">{hi}</span>
                <span data-bi="sep" aria-hidden="true"> · </span>
                <span data-bi="en">{en}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
