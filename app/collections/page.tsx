'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FolderOpen, Plus, Trash2, BookOpen, ArrowRight, Highlighter, StickyNote, X, Copy, Check } from 'lucide-react';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { FadeUp, FadeUpOnView, Stagger, StaggerItem } from '@/app/components/motion/primitives';
import { chapterVerseHref, readHref } from '@/lib/verse-paths';
import { verseCount } from '@/lib/format';
import { STUDY_PLAYLISTS } from '@/data/study-playlists';
import { VerseHrefLink } from '@/app/components/VerseHrefLink';

export default function CollectionsPage() {
  const reduce = useReducedMotion();
  const progress = useStudyProgress();
  const [showCreate, setShowCreate] = useState(false);
  // Focus the name field when the dialog opens (instead of autoFocus).
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showCreate) nameInputRef.current?.focus();
  }, [showCreate]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // The header is static, so it renders (and is exported) straight away; only
  // the reader's collections below wait for localStorage.
  const header = (
    <section className="bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-14">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-saffron-200 mb-2">
            Personal Study
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            Study Collections
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Organize your saved verses into thematic collections. Track your highlights and personal notes across all scriptures.
          </p>
        </FadeUp>
      </div>
    </section>
  );

  // The reading lists are static too, so they are exported with the header.
  const playlists = (
    <section aria-labelledby="playlists-h" className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
      <h2 id="playlists-h" className="font-serif text-2xl font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">पढ़ने की सूचियाँ</span>
      </h2>
      <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
        ये सूचियाँ पहले से बने पृष्ठ खोलती हैं। खाता सर्वर नहीं है। दूसरी ब्राउज़र पर ले जाने के लिए साधना पृष्ठ की बैकअप फ़ाइल उपयोग करें।
      </p>
      <p className="mt-2 text-sm">
        <Link href="/practice" className="font-semibold text-saffron-800 underline underline-offset-2">साधना · backup file</Link>
      </p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {STUDY_PLAYLISTS.map((playlist) => (
          <li key={playlist.id} className="rounded-xl border border-dharma-border bg-dharma-bg p-4">
            <h3 className="font-serif text-lg font-bold text-dharma-text">
              <span lang="hi" className="font-devanagari">{playlist.titleHi}</span>
              <span className="font-normal text-dharma-text-secondary"> · {playlist.titleEn}</span>
            </h3>
            <p lang="hi" className="mt-1 text-sm text-dharma-text">{playlist.noteHi}</p>
            <ul className="mt-2 space-y-1">
              {playlist.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-semibold text-saffron-800 underline underline-offset-2">
                    <span lang="hi" className="font-devanagari">{link.titleHi}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );

  if (!progress.hydrated) {
    return (
      <main className="min-h-screen bg-dharma-bg">
        {header}
        <div className="max-w-6xl mx-auto px-6 pt-10">{playlists}</div>
        <div className="flex min-h-[300px] items-center justify-center" aria-busy="true">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-saffron-200 border-t-saffron-600" />
        </div>
      </main>
    );
  }

  const { collections, highlights, notes, createCollection, deleteCollection, removeFromCollection } = progress;

  function handleCreate() {
    if (newName.trim()) {
      createCollection(newName.trim(), newDesc.trim() || undefined);
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
    }
  }

  function handleExportCollection(col: typeof collections[0]) {
    const lines: string[] = [
      `# ${col.name}`,
      col.description ? `${col.description}\n` : '',
      ...col.verseRefs.map((r, i) => (
        `### ${i + 1}. ${r.scriptureTitle} — ${r.chapterTitle}, Verse ${r.verseId}\n> ${r.sanskrit}\n\n${r.translation}\n`
      )),
      '---\n*Exported from Dharma Granth (dharmagranth.dev)*',
    ];
    navigator.clipboard.writeText(lines.filter(Boolean).join('\n')).then(() => {
      setCopiedId(col.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  const highlightColors: Record<string, string> = {
    saffron: 'border-saffron-300 bg-saffron-50/50',
    amber: 'border-amber-300 bg-amber-50/50',
    rose: 'border-rose-300 bg-rose-50/50',
    emerald: 'border-emerald-300 bg-emerald-50/50',
    indigo: 'border-indigo-300 bg-indigo-50/50',
  };

  return (
    <main className="min-h-screen bg-dharma-bg">
      {header}

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* First, as in the exported HTML, so nothing above it moves on load. */}
        {playlists}

        {/* Stats row */}
        <FadeUpOnView>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-dharma-card border border-dharma-border p-5 text-center shadow-sm">
              <FolderOpen className="w-6 h-6 text-saffron-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-dharma-text">{collections.length}</p>
              <p className="text-xs text-dharma-muted">Collections</p>
            </div>
            <div className="rounded-2xl bg-dharma-card border border-dharma-border p-5 text-center shadow-sm">
              <Highlighter className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-dharma-text">{highlights.length}</p>
              <p className="text-xs text-dharma-muted">Highlights</p>
            </div>
            <div className="rounded-2xl bg-dharma-card border border-dharma-border p-5 text-center shadow-sm">
              <StickyNote className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-dharma-text">{notes.length}</p>
              <p className="text-xs text-dharma-muted">Notes</p>
            </div>
          </div>
        </FadeUpOnView>

        {/* Create collection button */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-dharma-text">Your Collections</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 text-white text-sm font-bold hover:from-saffron-700 hover:to-amber-700 transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>

        {/* Collections grid */}
        {collections.length === 0 ? (
          <FadeUpOnView>
            <div className="rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-12 text-center max-w-2xl mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-saffron-100 text-saffron-600 mb-4">
                <FolderOpen className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-serif font-bold text-dharma-text mb-2">
                No collections yet
              </h3>
              <p className="text-sm text-dharma-muted max-w-md mx-auto mb-4">
                Create your first collection to group saved verses by theme, topic, or personal interest.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-saffron-600 text-white text-sm font-semibold hover:bg-saffron-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Create your first collection
                </button>
                <Link
                  href="/scripture/bhagavadgita"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-dharma-border bg-dharma-card text-dharma-text text-sm font-semibold hover:bg-dharma-bg transition"
                >
                  <BookOpen className="w-4 h-4 text-saffron-600" />
                  Explore Bhagavad Gita
                </Link>
              </div>
            </div>
          </FadeUpOnView>
        ) : (
          <Stagger className="grid md:grid-cols-2 gap-4">
            {collections.map((col) => {
              const isExpanded = expandedId === col.id;
              return (
                <StaggerItem key={col.id}>
                  <div className="rounded-2xl border border-dharma-border bg-dharma-card overflow-hidden shadow-sm hover:shadow-md transition">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : col.id)}
                      className="w-full text-left p-5"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-100 to-amber-100 text-saffron-700 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-serif font-bold text-dharma-text">
                              {col.name}
                            </h3>
                            <p className="text-xs text-dharma-muted">
                              {verseCount(col.verseRefs.length)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {col.verseRefs.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExportCollection(col);
                              }}
                              className="p-2 rounded-lg text-dharma-muted hover:bg-saffron-500/10 hover:text-saffron-700 transition"
                              title="Copy collection notes as Markdown"
                              aria-label="Copy collection notes as Markdown"
                            >
                              {copiedId === col.id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCollection(col.id);
                            }}
                            className="p-2 rounded-lg text-dharma-muted hover:bg-rose-500/10 hover:text-rose-600 transition"
                            title="Delete collection"
                            aria-label="Delete collection"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {col.description && (
                        <p className="text-sm text-dharma-muted leading-relaxed">
                          {col.description}
                        </p>
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={reduce ? {} : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reduce ? {} : { height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-dharma-border"
                        >
                          <div className="p-4 space-y-3">
                            {col.verseRefs.length === 0 ? (
                              <p className="text-xs text-dharma-muted text-center py-4">
                                No verses in this collection yet. Add verses from any scripture chapter page.
                              </p>
                            ) : (
                              col.verseRefs.map((ref) => (
                                <div
                                  key={`${ref.scriptureId}-${ref.verseId}`}
                                  className="rounded-xl border border-dharma-border bg-dharma-bg/40 p-3"
                                >
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700">
                                        {ref.scriptureTitle}
                                      </span>
                                      <p className="text-xs font-semibold text-dharma-text">
                                        {ref.chapterTitle} • Verse {ref.verseId}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <VerseHrefLink
                                        href={readHref(ref.scriptureId, ref.chapterId, ref.verseId)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 transition"
                                      >
                                        <BookOpen className="w-3 h-3" />
                                        Open
                                        <ArrowRight className="w-3 h-3" />
                                      </VerseHrefLink>
                                      <button
                                        onClick={() => removeFromCollection(col.id, ref.scriptureId, ref.verseId)}
                                        className="p-1 rounded-md text-dharma-muted hover:bg-rose-500/10 hover:text-rose-600 transition"
                                        title="Remove verse from collection"
                                        aria-label="Remove verse from collection"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  <p lang="sa" className="font-devanagari text-sm text-dharma-text leading-relaxed line-clamp-2">
                                    {ref.sanskrit}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        {/* Highlights section */}
        {highlights.length > 0 && (
          <FadeUpOnView>
            <h2 className="text-2xl font-serif font-bold text-dharma-text mb-4">
              Highlighted Verses
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {highlights.map((h) => (
                <div
                  key={`${h.scriptureId}-${h.chapterId}-${h.verseId}`}
                  className={`rounded-xl border p-4 ${highlightColors[h.color] ?? highlightColors.saffron}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dharma-muted">
                      {h.scriptureId} • Ch {h.chapterId} • V {h.verseId}
                    </span>
                    <Highlighter className="w-3.5 h-3.5 text-dharma-muted" />
                  </div>
                  <Link
                    href={chapterVerseHref(h.scriptureId, h.chapterId, h.verseId)}
                    className="text-sm font-semibold text-dharma-text hover:text-saffron-700 transition"
                  >
                    View verse →
                  </Link>
                </div>
              ))}
            </div>
          </FadeUpOnView>
        )}

        {/* Notes section */}
        {notes.length > 0 && (
          <FadeUpOnView>
            <h2 className="text-2xl font-serif font-bold text-dharma-text mb-4">
              Personal Notes
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {notes.map((n) => (
                <div
                  key={`${n.scriptureId}-${n.chapterId}-${n.verseId}`}
                  className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      {n.scriptureId} • Ch {n.chapterId} • V {n.verseId}
                    </span>
                    <StickyNote className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <p className="text-sm text-dharma-text leading-relaxed">{n.text}</p>
                  <p className="text-[10px] text-dharma-muted mt-2">
                    {new Date(n.updatedAt).toLocaleDateString(undefined, { numberingSystem: 'latn', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </FadeUpOnView>
        )}
      </div>

      {/* Create collection modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={reduce ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? {} : { scale: 0.95, opacity: 0 }}
              className="bg-dharma-card border border-dharma-border rounded-2xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-bold text-dharma-text">
                  New Collection
                </h3>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-2 rounded-lg text-dharma-muted hover:bg-dharma-bg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="new-collection-name" className="block text-xs font-bold uppercase tracking-wider text-dharma-muted mb-1.5">
                    Name
                  </label>
                  <input
                    id="new-collection-name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Verses on Karma"
                    className="w-full px-4 py-2.5 rounded-xl border border-dharma-border bg-dharma-bg text-dharma-text text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    ref={nameInputRef}
                  />
                </div>
                <div>
                  <label htmlFor="new-collection-desc" className="block text-xs font-bold uppercase tracking-wider text-dharma-muted mb-1.5">
                    Description (optional)
                  </label>
                  <textarea
                    id="new-collection-desc"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What is this collection about?"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-dharma-border bg-dharma-bg text-dharma-text text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 text-white font-bold text-sm hover:from-saffron-700 hover:to-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Collection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
