'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  BookOpen,
  Bookmark,
  FileText,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import type { ChapterVisit } from '@/lib/reading-history';
import type { VerseNote, VerseHighlight } from '@/lib/useStudyProgress';

export type ActivityFilter = 'all' | 'read' | 'saved' | 'notes';

export interface MergedActivityItem {
  id: string;
  type: 'read' | 'saved' | 'note' | 'highlight';
  title: string;
  subtitle?: string;
  href: string;
  timestamp: string;
  dateStr: string;
  badge: {
    label: string;
    color: string;
  };
}

interface Props {
  recentChapters: ChapterVisit[];
  notes: VerseNote[];
  highlights: VerseHighlight[];
  titles: Record<string, string>;
}

function formatRelativeDay(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'आज (Today)';
    if (diffDays === 1) return 'कल (Yesterday)';
    if (diffDays < 7) return `${diffDays} दिन पूर्व`;
    return d.toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'पूर्व में';
  }
}

export function RecentActivityFeed({ recentChapters, notes, highlights, titles }: Props) {
  const [filter, setFilter] = useState<ActivityFilter>('all');

  // Merge and sort activities
  const allActivities = useMemo(() => {
    const items: MergedActivityItem[] = [];

    // 1. Chapter/Verse reads
    recentChapters.forEach((visit) => {
      const sTitle = titles[visit.scriptureId] || visit.scriptureTitle || visit.scriptureId;
      const versePart = visit.verseId ? ` · श्लोक ${visit.verseId}` : '';
      items.push({
        id: `read-${visit.scriptureId}-${visit.chapterId}-${visit.readAt}`,
        type: 'read',
        title: `${sTitle} · अध्याय ${visit.chapterId}${versePart}`,
        subtitle: visit.chapterTitle,
        href: `/scripture/${visit.scriptureId}/chapter/${visit.chapterId}${visit.verseId ? `/verse/${visit.verseId}` : ''}`,
        timestamp: visit.readAt,
        dateStr: formatRelativeDay(visit.readAt),
        badge: {
          label: 'पठन · Read',
          color: 'bg-saffron-500/10 text-saffron-800 dark:text-saffron-300 border-saffron-500/30',
        },
      });
    });

    // 2. Notes
    notes.forEach((n) => {
      const sTitle = titles[n.scriptureId] || n.scriptureId;
      items.push({
        id: `note-${n.scriptureId}-${n.chapterId}-${n.verseId}-${n.updatedAt}`,
        type: 'note',
        title: `${sTitle} ${n.chapterId}.${n.verseId} पर निजी विचार`,
        subtitle: n.text,
        href: `/scripture/${n.scriptureId}/chapter/${n.chapterId}/verse/${n.verseId}`,
        timestamp: n.updatedAt,
        dateStr: formatRelativeDay(n.updatedAt),
        badge: {
          label: 'टिप्पणी · Note',
          color: 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-500/30',
        },
      });
    });

    // 3. Highlights
    highlights.forEach((h) => {
      const sTitle = titles[h.scriptureId] || h.scriptureId;
      items.push({
        id: `hl-${h.scriptureId}-${h.chapterId}-${h.verseId}-${h.createdAt}`,
        type: 'highlight',
        title: `${sTitle} ${h.chapterId}.${h.verseId} रेखांकित`,
        subtitle: 'प्रिय श्लोकों का रेखांकन',
        href: `/scripture/${h.scriptureId}/chapter/${h.chapterId}/verse/${h.verseId}`,
        timestamp: h.createdAt,
        dateStr: formatRelativeDay(h.createdAt),
        badge: {
          label: 'हाइलाइट · Highlight',
          color: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30',
        },
      });
    });

    // Sort newest first
    return items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [recentChapters, notes, highlights, titles]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return allActivities;
    if (filter === 'read') return allActivities.filter((i) => i.type === 'read');
    if (filter === 'saved') return allActivities.filter((i) => i.type === 'highlight');
    if (filter === 'notes') return allActivities.filter((i) => i.type === 'note');
    return allActivities;
  }, [allActivities, filter]);

  return (
    <section aria-labelledby="recent-activity-heading" className="w-full">
      <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-sm space-y-5">
        {/* Header & Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-saffron-500/10 text-saffron-600 dark:text-saffron-400">
                <Clock className="w-4 h-4" />
              </span>
              <span className="text-2xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                स्वाध्याय क्रम · Activity Stream
              </span>
            </div>
            <h2 id="recent-activity-heading" className="text-2xl font-serif font-bold text-dharma-text">
              हाल की स्वाध्याय गतिविधियाँ
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dharma-panel/60 border border-dharma-border/60 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-saffron-600 text-white shadow-2xs'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
            >
              सभी ({allActivities.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('read')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === 'read'
                  ? 'bg-saffron-600 text-white shadow-2xs'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
            >
              पठन ({recentChapters.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('notes')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === 'notes'
                  ? 'bg-saffron-600 text-white shadow-2xs'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
            >
              टिप्पणियाँ ({notes.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('saved')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === 'saved'
                  ? 'bg-saffron-600 text-white shadow-2xs'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
            >
              हाइलाइट्स ({highlights.length})
            </button>
          </div>
        </div>

        {/* Activity Items List */}
        {filteredItems.length === 0 ? (
          <div className="py-10 text-center rounded-2xl border border-dashed border-dharma-border/80 bg-dharma-panel/30">
            <BookOpen className="w-8 h-8 text-dharma-muted mx-auto mb-2 opacity-60" />
            <h3 className="font-serif font-bold text-dharma-text text-base">
              अभी कोई गतिविधि दर्ज नहीं है
            </h3>
            <p className="text-xs text-dharma-muted mt-1 max-w-sm mx-auto">
              ग्रंथों और श्लोकों का स्वाध्याय आरंभ करें — आपकी दैनिक अध्ययन प्रगति यहाँ सुरक्षित रूप से दिखाई देगी।
            </p>
            <Link
              href="/scriptures"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 text-white text-xs font-semibold hover:bg-saffron-700 transition"
            >
              <span>स्वाध्याय आरंभ करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredItems.slice(0, 8).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-dharma-border/70 bg-dharma-panel/30 hover:bg-dharma-card hover:border-saffron-300 hover:shadow-sm transition"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="mt-0.5 sm:mt-0 p-2 rounded-xl bg-dharma-card border border-dharma-border/60 text-saffron-600 dark:text-saffron-400 shrink-0">
                    {item.type === 'read' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : item.type === 'note' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-serif font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition truncate">
                        {item.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-3xs font-bold border uppercase tracking-wider ${item.badge.color}`}>
                        {item.badge.label}
                      </span>
                    </div>

                    {item.subtitle && (
                      <p className="text-xs text-dharma-muted truncate mt-0.5 max-w-lg">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-2xs text-dharma-muted whitespace-nowrap hidden sm:inline">
                    {item.dateStr}
                  </span>
                  <div className="p-1 rounded-lg text-dharma-muted group-hover:text-saffron-600 transition group-hover:translate-x-0.5">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
