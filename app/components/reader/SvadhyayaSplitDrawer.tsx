'use client';

import { useEffect, useRef, useState, useId, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Check,
  Compass,
  FileText,
  Flame,
  Layers,
  Lightbulb,
  Maximize2,
  ScrollText,
  Sparkles,
  Tag,
  X,
  Share2,
} from 'lucide-react';
import { saveMananaItem, type StoredMananaItem } from '@/lib/db/granth-indexeddb';
import { triggerTactileFeedback } from '@/lib/haptics';

export type SvadhyayaTab = 'concept' | 'parallel' | 'manana';

export interface ConceptConcordanceEntry {
  slug: string;
  titleSanskrit: string;
  titleIast: string;
  titleEn: string;
  etymology: string;
  briefDefinitionHi: string;
  briefDefinitionEn: string;
  categoryCounts: {
    veda: number;
    upanishad: number;
    itihasa: number;
    purana: number;
    smriti?: number;
    other?: number;
    total: number;
  };
  canonicalVerses: Array<{
    scriptureSlug: string;
    scriptureTitle: string;
    chapter: number;
    verseNum: string | number;
    sanskrit: string;
    transliteration?: string;
    hindi?: string;
    translation?: string;
    contextHi: string;
    contextEn: string;
  }>;
}

export interface ParallelVerseRef {
  scriptureSlug: string;
  scriptureTitle: string;
  chapter: number;
  verseNum: string | number;
  sanskrit: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  parallelTheme?: string;
  relationNoteHi?: string;
  relationNoteEn?: string;
}

export interface MananaVerseContext {
  scriptureSlug: string;
  scriptureTitle: string;
  chapter: number;
  verseNum: string | number;
  sanskrit?: string;
  initialNote?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SvadhyayaTab;
  onTabChange: (tab: SvadhyayaTab) => void;
  conceptSlug?: string | null;
  parallelVerse?: ParallelVerseRef | null;
  mananaContext?: MananaVerseContext | null;
  onJumpToVerse?: (scriptureSlug: string, chapter: number, verseNum: string | number) => void;
}

const MANANA_TAGS = ['#ज्ञान', '#साधना', '#कर्म', '#वैराग्य', '#ध्यान', '#संवाद', '#भक्ति'];

export function SvadhyayaSplitDrawer({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  conceptSlug,
  parallelVerse,
  mananaContext,
  onJumpToVerse,
}: Props) {
  const reduce = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Concept concordance data
  const [concordance, setConcordance] = useState<ConceptConcordanceEntry[]>([]);
  const [loadingConcordance, setLoadingConcordance] = useState(false);
  const [selectedConceptSlug, setSelectedConceptSlug] = useState<string | null>(conceptSlug ?? null);

  // Manana state
  const [noteContent, setNoteContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (conceptSlug) {
      setSelectedConceptSlug(conceptSlug);
    }
  }, [conceptSlug]);

  useEffect(() => {
    if (mananaContext?.initialNote !== undefined) {
      setNoteContent(mananaContext.initialNote);
    }
  }, [mananaContext]);

  // Load concordance index once
  useEffect(() => {
    if (concordance.length === 0 && !loadingConcordance) {
      setLoadingConcordance(true);
      fetch('/data/concordance-index.json')
        .then((res) => (res.ok ? res.json() : []))
        .then((data: ConceptConcordanceEntry[]) => {
          setConcordance(data);
          if (!selectedConceptSlug && data.length > 0) {
            setSelectedConceptSlug(data[0].slug);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingConcordance(false));
    }
  }, [concordance.length, loadingConcordance, selectedConceptSlug]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeConceptData = concordance.find(
    (c) => c.slug.toLowerCase() === (selectedConceptSlug || '').toLowerCase()
  ) || concordance[0];

  const handleSaveNote = async () => {
    if (!mananaContext) return;
    const now = Date.now();
    const id = `note:${mananaContext.scriptureSlug}:${mananaContext.chapter}:${mananaContext.verseNum}`;

    const record: StoredMananaItem = {
      id,
      type: 'note',
      scriptureSlug: mananaContext.scriptureSlug,
      chapter: mananaContext.chapter,
      verseNum: mananaContext.verseNum,
      content: noteContent.trim(),
      tags: selectedTags,
      createdAt: now,
      updatedAt: now,
    };

    // Save to IndexedDB
    try {
      await saveMananaItem(record);
    } catch {}

    // Save to localStorage for parity
    try {
      const stored = localStorage.getItem('dharma_study_notes');
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[`${mananaContext.scriptureSlug}:${mananaContext.chapter}:${mananaContext.verseNum}`] = {
        text: noteContent.trim(),
        tags: selectedTags,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('dharma_study_notes', JSON.stringify(parsed));
    } catch {}

    triggerTactileFeedback('success', 'success');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Container: Fixed Right Pane on Desktop, Bottom Sheet on Mobile */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="स्वाध्याय एवं संदर्भ पट्टिका (Svadhyaya Study Workbench)"
        className="fixed z-50 transition-all duration-300
          inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t border-dharma-border bg-dharma-card shadow-2xl flex flex-col
          lg:inset-y-0 lg:right-0 lg:left-auto lg:h-screen lg:max-h-none lg:w-[380px] xl:w-[420px] lg:rounded-none lg:border-l lg:border-t-0"
      >
        {/* Mobile Swipe Handle */}
        <div className="lg:hidden pt-3 pb-1 flex justify-center">
          <div className="h-1.5 w-12 rounded-full bg-dharma-border" />
        </div>

        {/* Workbench Header */}
        <div className="border-b border-dharma-border/80 px-4 py-3 flex items-center justify-between bg-dharma-card/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron-100 text-saffron-700 dark:bg-saffron-950/60 dark:text-saffron-400">
              <ScrollText className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-dharma-text leading-tight">स्वाध्याय संदंशिका</h2>
              <p className="text-[10px] text-dharma-muted">Svādhyāya Deep Study Workbench</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="संदंशिका बंद करें (Close drawer)"
            className="rounded-full p-1.5 text-dharma-muted hover:bg-dharma-bg hover:text-dharma-text transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex border-b border-dharma-border/70 bg-dharma-bg/50 px-2 py-1.5 gap-1">
          <button
            type="button"
            onClick={() => onTabChange('concept')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'concept'
                ? 'bg-dharma-card text-saffron-700 shadow-2xs dark:text-saffron-400'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>संकल्पना</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('parallel')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'parallel'
                ? 'bg-dharma-card text-saffron-700 shadow-2xs dark:text-saffron-400'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>समानांतर</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('manana')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'manana'
                ? 'bg-dharma-card text-saffron-700 shadow-2xs dark:text-saffron-400'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>मनन टिप्पणी</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: PHILOSOPHICAL CONCEPTS */}
          {activeTab === 'concept' && (
            <div className="space-y-4">
              {/* Concept Selector Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {concordance.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setSelectedConceptSlug(c.slug)}
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                      selectedConceptSlug === c.slug
                        ? 'bg-saffron-600 text-white font-bold'
                        : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-300'
                    }`}
                  >
                    {c.titleSanskrit}
                  </button>
                ))}
              </div>

              {activeConceptData ? (
                <div className="space-y-4">
                  {/* Concept Card Header */}
                  <div className="rounded-2xl border border-saffron-200/80 bg-saffron-50/50 p-4 dark:border-saffron-900/40 dark:bg-saffron-950/20">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-devanagari text-xl font-bold text-saffron-900 dark:text-saffron-200">
                        {activeConceptData.titleSanskrit}
                      </h3>
                      <span className="text-xs italic text-dharma-muted">
                        {activeConceptData.titleIast}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-saffron-800/90 dark:text-saffron-300 mb-2">
                      {activeConceptData.titleEn}
                    </p>
                    <div className="rounded-lg bg-dharma-card/70 p-2.5 border border-saffron-100 dark:border-saffron-900/30 text-xs space-y-1.5">
                      <p className="text-dharma-text font-serif italic text-[11px] text-dharma-muted">
                        व्युत्पत्ति: {activeConceptData.etymology}
                      </p>
                      <p className="text-dharma-text leading-relaxed font-devanagari">
                        {activeConceptData.briefDefinitionHi}
                      </p>
                      <p className="text-dharma-muted leading-relaxed text-[11px]">
                        {activeConceptData.briefDefinitionEn}
                      </p>
                    </div>

                    {/* Category Distribution Pills */}
                    <div className="mt-3 pt-2 border-t border-saffron-200/50 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="rounded-md bg-amber-100/80 px-2 py-0.5 font-semibold text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                        वेद: {activeConceptData.categoryCounts.veda}
                      </span>
                      <span className="rounded-md bg-rose-100/80 px-2 py-0.5 font-semibold text-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
                        उपनिषद्: {activeConceptData.categoryCounts.upanishad}
                      </span>
                      <span className="rounded-md bg-blue-100/80 px-2 py-0.5 font-semibold text-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
                        गीता/इतिहास: {activeConceptData.categoryCounts.itihasa}
                      </span>
                      <span className="rounded-md bg-emerald-100/80 px-2 py-0.5 font-semibold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                        पुराण: {activeConceptData.categoryCounts.purana}
                      </span>
                      <span className="rounded-md bg-purple-100/80 px-2 py-0.5 font-semibold text-purple-900 dark:bg-purple-950/50 dark:text-purple-200">
                        कुल: {activeConceptData.categoryCounts.total}
                      </span>
                    </div>
                  </div>

                  {/* Canonical Defining Verses */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dharma-muted mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
                      प्रामाणिक संदर्भ श्लोक (Canonical Verses)
                    </h4>
                    <div className="space-y-3">
                      {activeConceptData.canonicalVerses.map((cv, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-dharma-border bg-dharma-bg/60 p-3 hover:border-saffron-300 transition"
                        >
                          <div className="flex items-center justify-between mb-1.5 text-xs">
                            <span className="font-bold text-saffron-800 dark:text-saffron-300">
                              {cv.scriptureTitle} ({cv.chapter}.{cv.verseNum})
                            </span>
                            {onJumpToVerse && (
                              <button
                                type="button"
                                onClick={() => onJumpToVerse(cv.scriptureSlug, cv.chapter, cv.verseNum)}
                                className="text-[11px] text-saffron-600 hover:underline font-semibold"
                              >
                                पढ़ें →
                              </button>
                            )}
                          </div>
                          <p className="font-devanagari text-xs text-dharma-text leading-relaxed whitespace-pre-line mb-1.5 font-semibold">
                            {cv.sanskrit}
                          </p>
                          {cv.hindi && (
                            <p className="font-devanagari text-[11px] text-dharma-muted leading-relaxed mb-1">
                              {cv.hindi}
                            </p>
                          )}
                          <p className="text-[10px] text-saffron-700/90 dark:text-saffron-400 font-medium italic">
                            संदर्भ: {cv.contextHi}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-dharma-muted">
                  संकल्पना विवरण लोड हो रहा है...
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PARALLEL VERSES */}
          {activeTab === 'parallel' && (
            <div className="space-y-4">
              {parallelVerse ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        समानांतर शास्त्र संदर्भ
                      </span>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200">
                        {parallelVerse.scriptureTitle} {parallelVerse.chapter}.{parallelVerse.verseNum}
                      </span>
                    </div>

                    <p className="font-devanagari text-sm font-semibold text-dharma-text leading-relaxed whitespace-pre-line mb-2">
                      {parallelVerse.sanskrit}
                    </p>

                    {parallelVerse.transliteration && (
                      <p className="text-xs italic text-dharma-muted mb-2 font-serif">
                        {parallelVerse.transliteration}
                      </p>
                    )}

                    {parallelVerse.hindi && (
                      <div className="rounded-lg bg-dharma-card/80 p-2.5 border border-emerald-200/50 dark:border-emerald-900/30 text-xs text-dharma-text leading-relaxed mb-2 font-devanagari">
                        <strong className="text-emerald-900 dark:text-emerald-300 block mb-0.5">भावार्थ:</strong>
                        {parallelVerse.hindi}
                      </div>
                    )}

                    {parallelVerse.relationNoteHi && (
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 italic">
                        साम्य: {parallelVerse.relationNoteHi}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-dharma-border p-8 text-center text-xs text-dharma-muted space-y-2">
                  <BookOpen className="h-6 w-6 mx-auto text-dharma-muted/60" />
                  <p className="font-semibold text-dharma-text">कोई विशिष्ट समानांतर श्लोक चयनित नहीं है</p>
                  <p className="text-[11px]">
                    किसी भी श्लोक के समानांतर लिंक पर क्लिक करें ताकि उपनिषदों, गीता और वेदों के बीच दार्शनिक समानता की तुलना यहाँ की जा सके।
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANANA NOTES (मनन टिप्पणी) */}
          {activeTab === 'manana' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 mb-1">
                  <FileText className="h-3.5 w-3.5" />
                  मनन एवं स्वाध्याय टिप्पणी
                </p>
                <p className="text-[11px] text-dharma-muted">
                  {mananaContext ? (
                    <>
                      श्लोक: <span className="font-semibold text-indigo-700 dark:text-indigo-300">{mananaContext.scriptureTitle} {mananaContext.chapter}.{mananaContext.verseNum}</span>
                    </>
                  ) : (
                    'वर्तमान श्लोक पर चिंतन'
                  )}
                </p>
              </div>

              {/* Tag Selector */}
              <div>
                <div className="text-[11px] font-semibold text-dharma-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Tag className="h-3 w-3" /> अध्ययन टैग चुनें:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MANANA_TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                        selectedTags.includes(t)
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-indigo-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Editor Textarea */}
              <div className="space-y-2">
                <label htmlFor="manana-note-editor" className="sr-only">
                  मनन टिप्पणी (Personal Note)
                </label>
                <textarea
                  id="manana-note-editor"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={5}
                  placeholder="इस श्लोक पर आपका मनन, आत्म-चिंतन या अभ्यास विचार..."
                  className="w-full rounded-xl border border-dharma-border bg-dharma-bg p-3 text-xs leading-relaxed text-dharma-text outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-dharma-muted">
                    {noteContent.length} वर्ण · IndexedDB व स्थानीय रूप से सुरक्षित
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    disabled={!noteContent.trim() && selectedTags.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> सुरक्षित!
                      </>
                    ) : (
                      'टिप्पणी सहेजें'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
