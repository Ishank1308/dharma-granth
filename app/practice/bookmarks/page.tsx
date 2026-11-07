'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  Compass,
  Copy,
  FileText,
  Highlighter,
  Lock,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { readHref } from '@/lib/verse-paths';
import { migrateLegacyBookmarks } from '@/lib/reader-actions';
import { SavedScriptures } from '@/app/components/SavedScriptures';
import {
  useStudyProgress,
  type HighlightThemeTag,
  type HighlightKind,
  HIGHLIGHT_KINDS,
  type VerseHighlight,
  type VerseNote,
} from '@/lib/useStudyProgress';

interface BookmarkedVerse {
  scriptureId: string;
  scriptureTitle: string;
  chapterId?: number;
  chapterTitle: string;
  verseId: number | string;
  sanskrit: string;
  translation: string;
  hindi?: string;
  timestamp: string;
}

type ActiveTab = 'bookmarks' | 'highlights' | 'notes' | 'privacy';

const THEME_TAG_CONFIG: Record<
  HighlightThemeTag,
  { label: string; labelHi: string; bgClass: string; textClass: string; borderClass: string }
> = {
  contemplation: {
    label: 'Contemplation',
    labelHi: 'साधना',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-800 dark:text-amber-300',
    borderClass: 'border-amber-500/30',
  },
  duty: {
    label: 'Duty & Action',
    labelHi: 'कर्म',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-800 dark:text-orange-300',
    borderClass: 'border-orange-500/30',
  },
  devotion: {
    label: 'Devotion',
    labelHi: 'भक्ति',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-800 dark:text-rose-300',
    borderClass: 'border-rose-500/30',
  },
  wisdom: {
    label: 'Wisdom',
    labelHi: 'ज्ञान',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-800 dark:text-emerald-300',
    borderClass: 'border-emerald-500/30',
  },
  insight: {
    label: 'Discernment',
    labelHi: 'विवेक',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-800 dark:text-indigo-300',
    borderClass: 'border-indigo-500/30',
  },
};

export default function BookmarksAndAnnotationsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<'all' | HighlightThemeTag>('all');

  const [kindFilter, setKindFilter] = useState<'all' | HighlightKind>('all');

  const { highlights, notes, toggleHighlight, setHighlightKind, setNote } = useStudyProgress();

  useEffect(() => {
    function loadBookmarks() {
      try {
        migrateLegacyBookmarks();
        const saved = localStorage.getItem('dharma.bookmarkedVerses');
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setBookmarks(
              parsed.filter(
                (b): b is BookmarkedVerse =>
                  Boolean(b) && typeof b === 'object' && typeof (b as BookmarkedVerse).scriptureId === 'string',
              ),
            );
            return;
          }
        }
        setBookmarks([]);
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      } finally {
        setIsLoaded(true);
      }
    }

    loadBookmarks();

    function onStorage(e: StorageEvent) {
      if (e.key === 'dharma.bookmarkedVerses') {
        loadBookmarks();
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function removeBookmark(scriptureId: string, verseId: number | string) {
    const updated = bookmarks.filter(
      (b) => !(b.scriptureId === scriptureId && b.verseId === verseId),
    );
    setBookmarks(updated);
    try {
      localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }

  const handleCopy = async (b: BookmarkedVerse) => {
    try {
      const parts = [
        b.sanskrit,
        b.hindi ? `हिन्दी: ${b.hindi}` : null,
        b.translation ? `English: ${b.translation}` : null,
        `— ${b.scriptureTitle}, ${b.chapterTitle}, Verse ${b.verseId}`,
      ].filter(Boolean);

      await navigator.clipboard.writeText(parts.join('\n\n'));
      const key = `${b.scriptureId}-${b.verseId}`;
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredBookmarks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return bookmarks;
    return bookmarks.filter((b) => {
      const haystack = `${b.scriptureTitle} ${b.chapterTitle} ${b.sanskrit} ${b.translation} ${b.hindi || ''} ${b.verseId}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [bookmarks, searchQuery]);

  const filteredHighlights = useMemo(() => {
    return highlights.filter((h) => (selectedTagFilter === 'all' || h.tag === selectedTagFilter) && (kindFilter === 'all' || h.kind === kindFilter));
  }, [highlights, selectedTagFilter, kindFilter]);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Sanctuary Header */}
      <header className="mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-control bg-tint-fill text-tint">
              <Lock className="h-4 w-4" />
            </span>
            <span className="text-footnote font-semibold uppercase tracking-wider text-tint">
              Personal Sanctuary · व्यक्तिगत स्वाध्याय
            </span>
          </div>
          <h1 className="mt-1 text-title-1 sm:text-large-title font-bold text-label-primary tracking-tight">
            Saved Verses, Highlights & Notes
          </h1>
          <p className="mt-2 text-subhead text-label-secondary max-w-2xl leading-relaxed">
            Your private, client-side repository of scripture reflections. All data is saved strictly to this device&rsquo;s LocalStorage and is never uploaded without explicit consent.
          </p>
        </div>
      </header>

      {/* Sanctuary Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Sanctuary sections"
        className="flex flex-wrap gap-2 border-b border-separator pb-3 mb-8"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'bookmarks'}
          onClick={() => setActiveTab('bookmarks')}
          className={`focus-ring min-h-[40px] px-4 py-2 rounded-pill text-footnote font-semibold transition ${
            activeTab === 'bookmarks'
              ? 'bg-tint text-on-tint shadow-xs'
              : 'border border-separator bg-surface-raised text-label-secondary hover:text-label-primary hover:bg-fill-quaternary'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Bookmark className="h-4 w-4" />
            <span>Saved Verses ({bookmarks.length})</span>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'highlights'}
          onClick={() => setActiveTab('highlights')}
          className={`focus-ring min-h-[40px] px-4 py-2 rounded-pill text-footnote font-semibold transition ${
            activeTab === 'highlights'
              ? 'bg-tint text-on-tint shadow-xs'
              : 'border border-separator bg-surface-raised text-label-secondary hover:text-label-primary hover:bg-fill-quaternary'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Highlighter className="h-4 w-4" />
            <span>Highlights & Tags ({highlights.length})</span>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'notes'}
          onClick={() => setActiveTab('notes')}
          className={`focus-ring min-h-[40px] px-4 py-2 rounded-pill text-footnote font-semibold transition ${
            activeTab === 'notes'
              ? 'bg-tint text-on-tint shadow-xs'
              : 'border border-separator bg-surface-raised text-label-secondary hover:text-label-primary hover:bg-fill-quaternary'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>Private Notes ({notes.length})</span>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'privacy'}
          onClick={() => setActiveTab('privacy')}
          className={`focus-ring min-h-[40px] px-4 py-2 rounded-pill text-footnote font-semibold transition ${
            activeTab === 'privacy'
              ? 'bg-tint text-on-tint shadow-xs'
              : 'border border-separator bg-surface-raised text-label-secondary hover:text-label-primary hover:bg-fill-quaternary'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Privacy Guarantee</span>
          </span>
        </button>
      </div>

      {/* Tab 1: Bookmarked Verses */}
      {activeTab === 'bookmarks' && (
        <section aria-label="Bookmarked verses">
          <SavedScriptures />

          {bookmarks.length > 0 && (
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-label-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved verses..."
                  className="w-full rounded-field border border-separator bg-surface-raised pl-10 pr-9 py-2.5 text-footnote text-label-primary placeholder:text-label-tertiary outline-none focus:border-tint/60 focus:ring-2 focus:ring-tint/20 transition shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-label-tertiary hover:text-label-primary transition"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {!isLoaded ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-tint/20 border-t-tint" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="rounded-panel border border-separator bg-surface-raised p-12 text-center shadow-xs max-w-2xl mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tint-fill text-tint mb-6">
                <Bookmark className="h-7 w-7" />
              </div>
              <h2 className="text-title-2 font-bold text-label-primary">Your sanctuary is empty</h2>
              <p className="mt-2 text-subhead text-label-secondary max-w-md mx-auto leading-relaxed">
                Explore the scriptures, open any chapter, and tap the bookmark icon next to any verse to preserve it here.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link
                  href="/scriptures"
                  className="apple-pill min-h-[44px] px-6 text-subhead font-semibold"
                >
                  <Compass className="h-4 w-4" />
                  <span>Browse Scriptures</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <AnimatePresence>
                {filteredBookmarks.map((bookmark) => {
                  const chapterParam =
                    bookmark.chapterId ??
                    bookmark.chapterTitle.trim().toLowerCase().replace(/\s+/g, '-');
                  const targetUrl =
                    typeof bookmark.chapterId === 'number'
                      ? readHref(bookmark.scriptureId, bookmark.chapterId, bookmark.verseId)
                      : `/scripture/${bookmark.scriptureId}/chapter/${chapterParam}?verse=${bookmark.verseId}#verse-${bookmark.verseId}`;
                  const key = `${bookmark.scriptureId}-${bookmark.verseId}`;

                  return (
                    <motion.article
                      key={key}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group relative rounded-card border border-separator bg-surface-raised p-6 shadow-xs hover:border-tint/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <span className="text-caption font-bold uppercase tracking-wider text-tint">
                              {bookmark.scriptureTitle}
                            </span>
                            <h3 className="text-title-3 font-bold text-label-primary leading-tight mt-0.5">
                              {bookmark.chapterTitle} • Verse {bookmark.verseId}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopy(bookmark)}
                              className="focus-ring p-2 rounded-control text-label-tertiary hover:bg-fill-quaternary hover:text-label-primary transition"
                              title="Copy verse"
                              aria-label="Copy verse"
                            >
                              {copiedId === key ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBookmark(bookmark.scriptureId, bookmark.verseId)}
                              className="focus-ring p-2 rounded-control text-label-tertiary hover:bg-rose-500/10 hover:text-rose-600 transition"
                              title="Remove bookmark"
                              aria-label="Remove bookmark"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="rounded-card bg-surface-canvas/60 p-4 border border-separator/80 mb-4">
                          <p lang="sa" className="font-devanagari text-lg leading-relaxed text-label-primary whitespace-pre-line">
                            {bookmark.sanskrit}
                          </p>
                          <div className="w-8 h-0.5 rounded-pill bg-tint/40 my-3" />
                          {bookmark.hindi && (
                            <p lang="hi" className="text-footnote leading-relaxed text-label-primary font-devanagari mb-2">
                              <strong>हिन्दी: </strong>
                              {bookmark.hindi}
                            </p>
                          )}
                          {bookmark.translation && (
                            <p className="text-footnote leading-relaxed text-label-secondary italic line-clamp-3">
                              {bookmark.translation}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-separator">
                        <span className="text-caption text-label-tertiary">
                          Saved {new Date(bookmark.timestamp).toLocaleDateString(undefined, { numberingSystem: 'latn', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>

                        <Link
                          href={targetUrl}
                          className="focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-pill bg-tint-fill text-tint px-3.5 py-1.5 text-footnote font-semibold hover:bg-tint hover:text-on-tint transition"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Study Verse</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Highlights by Theme Tag */}
      {activeTab === 'highlights' && (
        <section aria-label="Highlighted verses">
          {/* Theme Tag Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-caption font-bold text-label-secondary uppercase tracking-wider flex items-center gap-1 mr-1">
              <Tag className="h-3.5 w-3.5 text-tint" />
              <span>Theme Tag:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedTagFilter('all')}
              className={`min-h-[36px] rounded-pill px-3.5 text-footnote font-semibold transition ${
                selectedTagFilter === 'all'
                  ? 'bg-tint text-on-tint shadow-xs'
                  : 'border border-separator bg-surface-raised text-label-secondary hover:text-label-primary hover:bg-fill-quaternary'
              }`}
            >
              All Highlights ({highlights.length})
            </button>

            {(Object.keys(THEME_TAG_CONFIG) as HighlightThemeTag[]).map((tagKey) => {
              const cfg = THEME_TAG_CONFIG[tagKey];
              const isSelected = selectedTagFilter === tagKey;
              const count = highlights.filter((h) => h.tag === tagKey).length;
              return (
                <button
                  key={tagKey}
                  type="button"
                  onClick={() => setSelectedTagFilter(tagKey)}
                  className={`min-h-[36px] rounded-pill px-3.5 text-footnote font-semibold transition border ${
                    isSelected
                      ? 'border-tint bg-tint text-on-tint shadow-xs'
                      : `${cfg.borderClass} ${cfg.bgClass} ${cfg.textClass}`
                  }`}
                >
                  <span lang="hi" className="font-devanagari mr-1">{cfg.labelHi}</span>
                  <span>({cfg.label}: {count})</span>
                </button>
              );
            })}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter highlights by your classification">
            <span className="mr-1 text-caption font-bold uppercase tracking-wider text-label-secondary">Your label:</span>
            {([{ id: 'all', label: 'All' }, ...HIGHLIGHT_KINDS] as Array<{ id: 'all' | HighlightKind; label: string }>).map((k) => (
              <button
                key={k.id}
                type="button"
                aria-pressed={kindFilter === k.id}
                onClick={() => setKindFilter(k.id)}
                className={`min-h-[36px] rounded-pill border px-3.5 text-footnote font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint/20 ${kindFilter === k.id ? 'border-tint bg-tint text-on-tint' : 'border-separator bg-surface-raised text-label-secondary hover:text-label-primary hover:bg-fill-quaternary'}`}
              >
                {k.label}{k.id !== 'all' ? ` (${highlights.filter((h) => h.kind === k.id).length})` : ''}
              </button>
            ))}
          </div>

          {filteredHighlights.length === 0 ? (
            <div className="rounded-panel border border-separator bg-surface-raised p-12 text-center shadow-xs max-w-xl mx-auto">
              <Highlighter className="mx-auto h-8 w-8 text-tint mb-3" />
              <h2 className="text-title-3 font-bold text-label-primary">No highlights found</h2>
              <p className="mt-1 text-caption text-label-secondary">
                Highlight verses with thematic colors while reading in chapters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHighlights.map((hl, i) => {
                const tagInfo = hl.tag ? THEME_TAG_CONFIG[hl.tag] : THEME_TAG_CONFIG.contemplation;
                return (
                  <article
                    key={`${hl.scriptureId}-${hl.chapterId}-${hl.verseId}-${i}`}
                    className={`rounded-card border p-5 bg-surface-raised shadow-xs transition ${tagInfo.borderClass}`}
                  >
                    <div className="flex items-center justify-between border-b border-separator pb-2">
                      <span className={`rounded-pill px-2.5 py-0.5 text-caption font-bold ${tagInfo.bgClass} ${tagInfo.textClass}`}>
                        {tagInfo.labelHi} · {tagInfo.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleHighlight(hl.scriptureId, hl.chapterId, hl.verseId, hl.color)}
                        className="text-label-tertiary hover:text-rose-600 p-1 transition"
                        title="Remove highlight"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h3 className="mt-3 font-serif font-bold text-subhead text-label-primary">
                      {hl.scriptureId.toUpperCase()} • Ch {hl.chapterId}, Verse {hl.verseId}
                    </h3>

                    {hl.textSnippet && (
                      <blockquote className="mt-2 text-footnote italic text-label-secondary line-clamp-3">
                        &ldquo;{hl.textSnippet}&rdquo;
                      </blockquote>
                    )}

                    <label className="mt-3 block text-footnote text-label-secondary">
                      <span className="font-semibold text-label-primary">Your label</span>
                      <select
                        value={hl.kind ?? ''}
                        onChange={(e) => setHighlightKind(hl.scriptureId, hl.chapterId, hl.verseId, (e.target.value || undefined) as HighlightKind | undefined)}
                        className="mt-1 block min-h-[40px] w-full rounded-field border border-separator bg-surface-canvas/60 px-2.5 text-footnote text-label-primary outline-none focus:border-tint/60"
                      >
                        <option value="">Not labelled</option>
                        {HIGHLIGHT_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
                      </select>
                    </label>

                    <div className="mt-4 pt-2 border-t border-separator flex items-center justify-between text-caption text-label-tertiary">
                      <span>
                        {new Date(hl.createdAt).toLocaleDateString(undefined, { numberingSystem: 'latn' })}
                      </span>
                      <Link
                        href={readHref(hl.scriptureId, hl.chapterId, hl.verseId)}
                        className="font-semibold text-tint hover:underline underline-offset-2"
                      >
                        Read Verse
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Private Notes & Annotations */}
      {activeTab === 'notes' && (
        <section aria-label="Private notes">
          {notes.length === 0 ? (
            <div className="rounded-panel border border-separator bg-surface-raised p-12 text-center shadow-xs max-w-xl mx-auto">
              <FileText className="mx-auto h-8 w-8 text-tint mb-3" />
              <h2 className="text-title-3 font-bold text-label-primary">No private notes yet</h2>
              <p className="mt-1 text-caption text-label-secondary">
                While reading any verse, type in your private notes box. Your thoughts remain strictly confidential on this device.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {notes.map((note) => (
                <article
                  key={`${note.scriptureId}-${note.chapterId}-${note.verseId}`}
                  className="rounded-card border border-separator bg-surface-raised p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-separator pb-2">
                      <span className="text-caption font-bold uppercase tracking-wider text-tint">
                        {note.scriptureId} · Ch {note.chapterId}, v. {note.verseId}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNote(note.scriptureId, note.chapterId, note.verseId, '')}
                        className="text-label-tertiary hover:text-rose-600 p-1 transition"
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="mt-3 whitespace-pre-line text-body text-label-primary leading-relaxed">
                      {note.text}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-separator flex items-center justify-between text-caption text-label-tertiary">
                    <span>Updated {new Date(note.updatedAt).toLocaleDateString(undefined, { numberingSystem: 'latn' })}</span>
                    <Link
                      href={readHref(note.scriptureId, note.chapterId, note.verseId)}
                      className="font-semibold text-tint hover:underline underline-offset-2"
                    >
                      Open in Scripture
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 4: Privacy & Data Sovereign Hub */}
      {activeTab === 'privacy' && (
        <section aria-label="Privacy guarantee" className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-card border border-emerald-500/30 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-950/20 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h2 className="text-title-2 font-bold">100% Client-Side Privacy Guarantee</h2>
            </div>
            <p className="mt-3 text-body leading-relaxed text-label-primary">
              Dharma Granth respects the sacredness of your inner contemplative life. Your highlights, annotations, reading plans, and bookmarks are stored strictly within your browser&rsquo;s LocalStorage.
            </p>
            <ul className="mt-4 space-y-2 text-footnote text-label-secondary list-disc list-inside">
              <li><strong>Zero Cloud Sync:</strong> No personal reflections are ever transmitted to any remote database.</li>
              <li><strong>Zero AI Scraping:</strong> Your notes are never ingested by language models or advertising algorithms.</li>
              <li><strong>Full Data Sovereignty:</strong> Your data remains stored completely on your local device.</li>
              <li><strong>Offline Capable:</strong> Your personal sanctuary works completely offline without internet connectivity.</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
