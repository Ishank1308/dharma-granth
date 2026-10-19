'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight, Check } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { toDevanagari } from '@/lib/verse-format';
import { cn } from '@/lib/utils';

export interface ChapterSummaryItem {
  id: number;
  title: string;
  titleSanskrit?: string;
  verseCount?: number;
}

export interface MobileContentsDrawerProps {
  open: boolean;
  onClose: () => void;
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  currentChapterId: number;
  chapters: ChapterSummaryItem[];
  onSelectChapter?: (chapterId: number) => void;
  totalVersesInCurrentChapter?: number;
  onJumpToVerse?: (verseNum: number | string) => void;
}

export function MobileContentsDrawer({
  open,
  onClose,
  scriptureId,
  scriptureTitle,
  scriptureTitleSanskrit,
  currentChapterId,
  chapters,
  onSelectChapter,
  totalVersesInCurrentChapter,
  onJumpToVerse,
}: MobileContentsDrawerProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [verseJumpInput, setVerseJumpInput] = useState('');

  const filteredChapters = useMemo(() => {
    if (!filterQuery.trim()) return chapters;
    const q = filterQuery.toLowerCase().trim();
    return chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.titleSanskrit && c.titleSanskrit.includes(q)) ||
        String(c.id).includes(q)
    );
  }, [chapters, filterQuery]);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = verseJumpInput.trim();
    if (!num) return;
    onJumpToVerse?.(num);
    onClose();
    setVerseJumpInput('');
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      position="bottom"
      title={`${scriptureTitleSanskrit || scriptureTitle} · अनुक्रमणिका`}
      description="अध्याय अथवा श्लोक का चयन करें (Table of Contents)"
      className="max-h-[88vh]"
    >
      <div className="space-y-4">
        {/* Quick Verse Jump Input if verses are known */}
        {totalVersesInCurrentChapter && totalVersesInCurrentChapter > 0 && onJumpToVerse && (
          <form
            onSubmit={handleJumpSubmit}
            className="flex items-center gap-2 rounded-2xl border border-dharma-border bg-dharma-panel-muted/70 p-2"
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder={`श्लोक संख्या (१-${totalVersesInCurrentChapter}) पर कूदें...`}
              value={verseJumpInput}
              onChange={(e) => setVerseJumpInput(e.target.value)}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-dharma-text placeholder:text-dharma-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={!verseJumpInput.trim()}
              className="rounded-xl bg-saffron-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-saffron-700 disabled:opacity-40 cursor-pointer"
            >
              जाएँ
            </button>
          </form>
        )}

        {/* Chapter Search Filter */}
        {chapters.length > 5 && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dharma-muted" />
            <input
              type="text"
              placeholder="अध्याय खोजें..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full rounded-xl border border-dharma-border/80 bg-dharma-card pl-9 pr-3 py-2 text-xs sm:text-sm text-dharma-text placeholder:text-dharma-muted focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
        )}

        {/* Chapter List */}
        <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredChapters.map((ch) => {
            const isCurrent = ch.id === currentChapterId;
            return (
              <Link
                key={ch.id}
                href={`/scripture/${scriptureId}/chapter/${ch.id}/`}
                onClick={() => {
                  onSelectChapter?.(ch.id);
                  onClose();
                }}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 transition text-left select-none',
                  isCurrent
                    ? 'bg-saffron-100/90 dark:bg-saffron-950/60 border border-saffron-300 dark:border-saffron-700 text-saffron-950 dark:text-saffron-100 font-bold'
                    : 'bg-dharma-card/60 hover:bg-dharma-card-soft border border-dharma-border/60 text-dharma-text'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-devanagari font-bold',
                      isCurrent
                        ? 'bg-saffron-600 text-white'
                        : 'bg-dharma-panel-muted text-dharma-muted'
                    )}
                  >
                    {toDevanagari(String(ch.id))}
                  </span>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-devanagari truncate">
                      {ch.titleSanskrit || ch.title}
                    </p>
                    {ch.verseCount !== undefined && (
                      <p className="text-[10px] text-dharma-muted">
                        {toDevanagari(String(ch.verseCount))} श्लोक
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-saffron-700 dark:text-saffron-400">
                      <Check className="h-3.5 w-3.5" />
                      वर्तमान
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-dharma-muted opacity-60" />
                  )}
                </div>
              </Link>
            );
          })}

          {filteredChapters.length === 0 && (
            <p className="py-6 text-center text-xs text-dharma-muted">
              कोई अध्याय नहीं मिला (No matching chapters found)
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
}
