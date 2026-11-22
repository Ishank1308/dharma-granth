'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { usePresence } from '@/app/components/motion/usePresence';
import {
  desktopDiscoveryItems,
  desktopPersonalItems,
  discoveryGroups,
} from './nav-data';

export function DesktopExploreMenu({
  pathname,
  isActive,
}: {
  pathname: string | null;
  isActive: (href: string) => boolean;
}) {
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const discoverRef = useRef<HTMLDivElement>(null);
  const discoverButtonRef = useRef<HTMLButtonElement>(null);
  const discoverMenu = usePresence(discoverOpen, 140);

  const discoveryIsActive = desktopDiscoveryItems.some((item) => isActive(item.href));

  useEffect(() => {
    setDiscoverOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!discoverOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setDiscoverOpen(false);
      discoverButtonRef.current?.focus();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [discoverOpen]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!discoverRef.current?.contains(event.target as Node)) {
        setDiscoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={discoverRef}>
      <button
        ref={discoverButtonRef}
        type="button"
        onClick={() => setDiscoverOpen((open) => !open)}
        className={`flex items-center gap-1 rounded-full px-2.5 2xl:px-3.5 py-1.5 text-footnote transition-all ${
          discoveryIsActive || discoverOpen
            ? 'bg-dharma-saffron/15 font-semibold text-dharma-saffron shadow-[inset_0_1px_0_var(--glass-specular-top)] ring-1 ring-dharma-saffron/30'
            : 'text-dharma-text/85 hover:bg-white/50 hover:text-dharma-text dark:hover:bg-white/10'
        }`}
        aria-expanded={discoverOpen}
        aria-controls="desktop-discovery-menu"
        aria-haspopup="true"
      >
        <span data-bi="en">Explore</span>{' '}
        <span lang="hi" data-bi="hi" data-bi-lead className="hidden font-devanagari text-[12.5px] text-dharma-muted xl:inline">
          अन्वेषण
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${discoverOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {discoverMenu.mounted && (
        <div
          id="desktop-discovery-menu"
          data-closing={discoverMenu.closing || undefined}
          className="chrome-pop material-thick liquid-glass absolute right-0 top-[calc(100%+0.75rem)] w-[46rem] max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-4.5rem)] overflow-y-auto rounded-2xl border border-dharma-border/80 bg-dharma-card/85 p-4 shadow-2xl backdrop-blur-2xl z-50 divide-y divide-dharma-border/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pb-3">
            {discoveryGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div key={group.name} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                    <GroupIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{group.name}</span>
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-start gap-2.5 rounded-xl px-2.5 py-1.5 transition-all ${
                            isActive(item.href)
                              ? 'bg-saffron-500/15 text-saffron-800 shadow-[inset_0_1px_0_var(--glass-specular-top)] dark:bg-saffron-950/50 dark:text-saffron-300'
                              : 'hover:bg-dharma-bg/65 hover:shadow-[inset_0_1px_0_var(--glass-specular-top)]'
                          }`}
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-dharma-muted group-hover:text-saffron-600">
                            <ItemIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-dharma-text">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-dharma-muted line-clamp-1">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-2.5 flex flex-wrap items-center justify-between gap-1.5 px-1">
            <div className="flex flex-wrap gap-1.5">
              {desktopPersonalItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-[32px] items-center rounded-lg px-2.5 py-1 text-xs font-semibold text-dharma-muted transition hover:bg-dharma-bg hover:text-saffron-700 dark:hover:text-saffron-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/about/funding/"
              className="text-[11px] font-medium text-dharma-muted hover:text-dharma-text underline-offset-2 hover:underline"
            >
              वित्तीय पारदर्शिता
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
