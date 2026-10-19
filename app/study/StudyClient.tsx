'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Bookmark,
  Compass,
  Download,
  FileText,
  FolderOpen,
  FolderPlus,
  Heart,
  History,
  Lock,
  Package,
  Plus,
  Quote,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Trash2,
  Unlock,
  Upload,
  ArrowRight,
  ExternalLink,
  Check,
  Clock,
  Layers,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllJournalEntries,
  getAllAnnotations,
  getAllSavedVerses,
  getAllCollections,
  getAllReadingPositions,
  getAllReadingHistory,
  getAllOfflinePacks,
  exportUniversalBackup,
  restoreUniversalBackup,
  wipeAllPersonalStudyData,
  saveCollection,
  deleteCollection,
  DEFAULT_STUDY_COLLECTIONS,
} from '@/lib/study/storage';
import type {
  JournalEntry,
  PersonalAnnotation,
  SavedVerse,
  PersonalCollection,
  ReadingPosition,
  ReadingHistoryEntry,
  OfflineReadingPack,
  DharmaStudyBackupV2,
} from '@/lib/study/types';
import { JournalEditorModal } from '@/components/study/JournalEditorModal';
import { OfflinePacksModal } from '@/components/study/OfflinePacksModal';
import { PrivacyLockModal, isPinProtected } from '@/components/study/PrivacyLock';
import { triggerTactileFeedback } from '@/lib/haptics';
import { toDevanagari } from '@/lib/verse-format';

interface Props {
  titles: Record<string, string>;
}

// 6 Core Dharmic Concepts for Cross-Scripture Exploration
const CROSS_CONCEPTS = [
  {
    id: 'dharma',
    name: 'Dharma',
    nameHi: 'धर्म · कर्तव्य व धारण',
    scriptures: ['भगवद्गीता', 'महाभारत', 'मनुस्मृति', 'रामायण'],
    description: 'The cosmic order, righteous duty, and moral constitution that upholds all existence.',
    colour: 'from-amber-500 to-orange-600',
    slug: 'dharma',
  },
  {
    id: 'karma',
    name: 'Nishkama Karma',
    nameHi: 'निष्काम कर्म · अनासक्त कर्मयोग',
    scriptures: ['भगवद्गीता (अध्याय २, ३)', 'ईशावास्योपनिषद्', 'योगसूत्र'],
    description: 'Dedicated action without attachment to fruits, transmuting duty into sacred offering.',
    colour: 'from-emerald-500 to-teal-600',
    slug: 'karma',
  },
  {
    id: 'moksha',
    name: 'Moksha & Advaita',
    nameHi: 'मोक्ष व अद्वैत · परम मुक्ति',
    scriptures: ['माण्डूक्योपनिषद्', 'अष्टावक्र गीता', 'विवेकचूड़ामणि'],
    description: 'The dissolution of separation and direct realization of the non-dual Self (Brahman).',
    colour: 'from-indigo-500 to-purple-600',
    slug: 'moksha',
  },
  {
    id: 'bhakti',
    name: 'Bhakti',
    nameHi: 'भक्ति · अनन्य प्रेम व शरणागति',
    scriptures: ['श्रीमद्भागवत पुराण', 'नारद भक्ति सूत्र', 'रामचरितमानस'],
    description: 'Total self-surrender, unwavering love, and divine communion through devotion.',
    colour: 'from-rose-500 to-pink-600',
    slug: 'bhakti',
  },
  {
    id: 'yoga',
    name: 'Chitta-Vritti Nirodha',
    nameHi: 'चित्त-वृत्ति निरोध · अष्टांग योग',
    scriptures: ['पातंजल योगसूत्र', 'कठोपनिषद्', 'श्वेताश्वतरोपनिषद्'],
    description: 'The stilling of mental fluctuations and resting in the pure radiance of the Seer.',
    colour: 'from-cyan-500 to-blue-600',
    slug: 'yoga',
  },
  {
    id: 'vairagya',
    name: 'Vairagya & Viveka',
    nameHi: 'वैराग्य व विवेक · नित्य-अनित्य दृष्टि',
    scriptures: ['वैराग्य शतकम्', 'विवेकचूड़ामणि', 'अवधूत गीता'],
    description: 'Lucid discernment between the transient world and the eternal consciousness.',
    colour: 'from-saffron-500 to-amber-600',
    slug: 'vairagya',
  },
];

export function StudyClient({ titles }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Core Data Stores
  const [readingPositions, setReadingPositions] = useState<ReadingPosition[]>([]);
  const [collections, setCollections] = useState<PersonalCollection[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [annotations, setAnnotations] = useState<PersonalAnnotation[]>([]);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);
  const [offlinePacks, setOfflinePacks] = useState<OfflineReadingPack[]>([]);

  // Modals
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'unlock' | 'set' | 'remove'>('unlock');
  const [isWiping, setIsWiping] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadAllData = async () => {
    try {
      const [pos, cols, jrn, ann, svd, hst, pks] = await Promise.all([
        getAllReadingPositions(),
        getAllCollections(),
        getAllJournalEntries(),
        getAllAnnotations(),
        getAllSavedVerses(),
        getAllReadingHistory(30),
        getAllOfflinePacks(),
      ]);
      setReadingPositions(pos);
      setCollections(cols);
      setJournalEntries(jrn);
      setAnnotations(ann);
      setSavedVerses(svd);
      setHistory(hst);
      setOfflinePacks(pks);
    } catch (err) {
      console.error('Failed to load study data:', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    const pinActive = isPinProtected();
    setIsLocked(pinActive);
    loadAllData();

    const onUpdate = () => {
      loadAllData();
    };
    const onPinChange = () => {
      setIsLocked(isPinProtected());
    };

    window.addEventListener('dharma-study-updated', onUpdate);
    window.addEventListener('dharma-privacy-pin-changed', onPinChange);
    return () => {
      window.removeEventListener('dharma-study-updated', onUpdate);
      window.removeEventListener('dharma-privacy-pin-changed', onPinChange);
    };
  }, []);

  // Compute verses per collection count
  const collectionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const sv of savedVerses) {
      for (const cId of sv.collectionIds) {
        map[cId] = (map[cId] || 0) + 1;
      }
    }
    return map;
  }, [savedVerses]);

  // Handle Export .dharma backup
  const handleExportBackup = async () => {
    try {
      const backup = await exportUniversalBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `dharma-study-backup-${dateStr}.dharma`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerTactileFeedback('success', 'softTap');
      showToast('यूनिवर्सल बैकअप (.dharma) सफलतापूर्वक डाउनलोड हो गया!');
    } catch {
      showToast('बैकअप निर्यात में त्रुटि हुई');
    }
  };

  // Handle Markdown Export
  const handleExportMarkdown = async () => {
    try {
      let md = `# Dharma Granth · व्यक्तिगत स्वाध्याय संचयन (Personal Study)\n\n`;
      md += `*निर्यात तिथि (Export Date): ${new Date().toLocaleDateString('hi-IN', { dateStyle: 'full' })}*\n\n`;
      md += `> यह दस्तावेज 100% स्थानीय स्वाध्याय का व्यक्तिगत संग्रह है।\n\n---\n\n`;

      md += `## 1. स्वाध्याय डायरी व मनन (Reflections Journal)\n\n`;
      if (journalEntries.length === 0) {
        md += `*कोई डायरी प्रविष्टि नहीं।*\n\n`;
      } else {
        for (const entry of journalEntries) {
          md += `### ${entry.title || 'मनन प्रविष्टि'}\n`;
          md += `**दिनांक**: ${new Date(entry.createdAt).toLocaleDateString()} | **भाव**: ${entry.moodTag || 'शांत'}\n\n`;
          md += `${entry.body}\n\n`;
          if (entry.linkedReferences.length > 0) {
            md += `*संबद्ध श्लोक*: ${entry.linkedReferences.map((r) => r.canonicalReference).join(', ')}\n\n`;
          }
          md += `---\n\n`;
        }
      }

      md += `## 2. श्लोक टिप्पणियाँ (Verse Annotations)\n\n`;
      if (annotations.length === 0) {
        md += `*कोई श्लोक टिप्पणी नहीं।*\n\n`;
      } else {
        for (const ann of annotations) {
          md += `### ${ann.reference.canonicalReference}\n`;
          md += `*दिनांक*: ${new Date(ann.createdAt).toLocaleDateString()}\n\n`;
          md += `> ${ann.note}\n\n`;
        }
      }

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `dharma-svadhyaya-notes-${dateStr}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerTactileFeedback('success', 'softTap');
      showToast('मार्कडाउन (.md) फ़ाइल डाउनलोड हो गई!');
    } catch {
      showToast('मार्कडाउन निर्यात में त्रुटि');
    }
  };

  // Handle Import
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text) as DharmaStudyBackupV2;
      if (backup.version !== 2) {
        showToast('अमान्य बैकअप फ़ाइल (.dharma v2 JSON प्रारूप आवश्यक है)');
        return;
      }

      await restoreUniversalBackup(backup);
      triggerTactileFeedback('success', 'softTap');
      showToast('डेटा सफलतापूर्वक पुनर्स्थापित हो गया!');
      await loadAllData();
    } catch {
      showToast('फ़ाइल पढ़ने या पुनर्स्थापित करने में त्रुटि');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Wipe
  const handleWipeData = async () => {
    setIsWiping(true);
    try {
      await wipeAllPersonalStudyData();
      triggerTactileFeedback('medium', 'softTap');
      showToast('सभी स्थानीय स्वाध्याय डेटा मिटा दिया गया।');
      setShowWipeConfirm(false);
      await loadAllData();
    } catch {
      showToast('डेटा मिटाने में त्रुटि');
    } finally {
      setIsWiping(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-saffron-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dharma-bg text-dharma-text pb-20 selection:bg-saffron-500/20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-stone-900/90 text-white px-5 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md border border-stone-700/60 flex items-center gap-2"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-saffron-500/5 to-transparent pt-12 pb-14 border-b border-dharma-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-400/40 bg-saffron-500/10 px-3 py-1 text-xs font-bold text-saffron-800 dark:text-saffron-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
                  १००% स्थानीय व गोपनीय · Zero-Cloud
                </span>
                {isPinProtected() && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <Lock className="h-3 w-3" />
                    पिन सुरक्षित
                  </span>
                )}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-dharma-text">
                स्वाध्याय केंद्र · Personal Study Sanctuary
              </h1>
              <p className="mt-2.5 max-w-2xl text-base text-dharma-muted leading-relaxed">
                आपका एकांत, शांत और निजी स्वाध्याय कक्ष। सभी चिंतन, रेखांकन और अध्ययन नोट्स केवल आपके ब्राउज़र में सुरक्षित हैं।
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setJournalModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-saffron-500/20 transition hover:from-saffron-700 hover:to-amber-700 active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>नया मनन लिखें</span>
              </button>

              <button
                type="button"
                onClick={() => setOfflineModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-dharma-border/80 bg-dharma-card px-3.5 py-2.5 text-sm font-semibold text-dharma-text transition hover:border-saffron-400 hover:bg-saffron-50/50 dark:hover:bg-saffron-950/30 cursor-pointer shadow-2xs"
              >
                <Package className="h-4 w-4 text-saffron-600 dark:text-saffron-400" />
                <span>ऑफ़लाइन ग्रंथ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isPinProtected()) {
                    setPinModalMode('remove');
                  } else {
                    setPinModalMode('set');
                  }
                  setPinModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-dharma-border/80 bg-dharma-card px-3 py-2.5 text-sm font-semibold text-dharma-text transition hover:border-saffron-400 hover:bg-saffron-50/50 dark:hover:bg-saffron-950/30 cursor-pointer shadow-2xs"
                title={isPinProtected() ? 'पिन लॉक हटाएं' : 'गोपनीयता पिन सेट करें'}
              >
                {isPinProtected() ? (
                  <Unlock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Lock className="h-4 w-4 text-dharma-muted" />
                )}
                <span className="hidden sm:inline">{isPinProtected() ? 'पिन बदलें' : 'पिन लॉक'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-12">
        {/* SECTION 1: CONTINUE READING */}
        <section aria-labelledby="continue-reading-heading">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-saffron-500/10 text-saffron-600 dark:text-saffron-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <h2 id="continue-reading-heading" className="font-serif text-2xl font-bold text-dharma-text">
                पठन निरंतरता · Continue Reading
              </h2>
            </div>
            {readingPositions.length > 0 && (
              <span className="text-xs font-semibold text-dharma-muted">
                {readingPositions.length} सक्रिय ग्रंथ
              </span>
            )}
          </div>

          {readingPositions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-dharma-border p-8 text-center bg-dharma-card/40">
              <Compass className="mx-auto h-10 w-10 text-saffron-500/60 mb-2" />
              <h3 className="font-serif text-base font-bold text-dharma-text">अभी कोई पठन स्थिति सुरक्षित नहीं है</h3>
              <p className="mt-1 text-xs text-dharma-muted max-w-md mx-auto">
                जब आप किसी ग्रंथ का अध्ययन करते हैं, तो आपकी अंतिम स्थिति और प्रगति स्वतः यहाँ जुड़ जाती है।
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href="/scripture/bhagavadgita"
                  className="rounded-xl bg-saffron-500/10 border border-saffron-400/40 px-3.5 py-1.5 text-xs font-semibold text-saffron-800 dark:text-saffron-300 hover:bg-saffron-500/20 transition"
                >
                  श्रीमद्भगवद्गीता प्रारंभ करें →
                </Link>
                <Link
                  href="/ashtavakra"
                  className="rounded-xl border border-dharma-border px-3.5 py-1.5 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition"
                >
                  अष्टावक्र गीता →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readingPositions.slice(0, 6).map((pos) => {
                const title = titles[pos.scriptureId] || pos.scriptureId;
                const chapterNum = pos.chapterId || 1;
                const verseNum = pos.verseId || '1';
                const resumeHref = `/scripture/${pos.scriptureId}/${chapterNum}#verse-${verseNum}`;

                return (
                  <Link
                    key={pos.scriptureId}
                    href={resumeHref}
                    className="group relative flex flex-col justify-between rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-2xs transition hover:border-saffron-400/80 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-dharma-muted mb-2">
                        <span className="font-semibold text-saffron-700 dark:text-saffron-400">
                          अध्याय {toDevanagari(chapterNum)} · श्लोक {toDevanagari(verseNum)}
                        </span>
                        {pos.percentage !== undefined && (
                          <span className="font-bold text-stone-700 dark:text-stone-300">
                            {pos.percentage}%
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-400 transition-colors">
                        {title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dharma-border/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-dharma-muted">
                        {new Date(pos.updatedAt).toLocaleDateString()} को अध्ययन किया
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-saffron-700 dark:text-saffron-300 group-hover:translate-x-0.5 transition-transform">
                        आगे पढ़ें <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 2: SMART COLLECTIONS */}
        <section aria-labelledby="smart-collections-heading">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FolderOpen className="h-4 w-4" />
              </div>
              <h2 id="smart-collections-heading" className="font-serif text-2xl font-bold text-dharma-text">
                स्मार्ट संग्रह · Thematic Collections
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-xs font-bold text-saffron-700 dark:text-saffron-300 hover:underline flex items-center gap-1"
            >
              सभी संग्रह देखें <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {collections.map((col) => {
              const count = collectionCounts[col.id] || 0;
              return (
                <Link
                  key={col.id}
                  href={`/collections#${col.id}`}
                  className="group relative rounded-2xl border border-dharma-border bg-dharma-card p-4 shadow-2xs transition hover:border-saffron-400 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`h-2.5 w-8 rounded-full bg-gradient-to-r ${col.colourToken || 'from-saffron-500 to-amber-500'} mb-3`}
                    />
                    <h3 className="font-serif text-sm font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 line-clamp-1">
                      {col.nameHi || col.name}
                    </h3>
                    {col.nameHi && (
                      <p className="text-[11px] text-dharma-muted line-clamp-1">{col.name}</p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-dharma-border/60 text-xs">
                    <span className="font-semibold text-dharma-muted">{count} श्लोक</span>
                    <ChevronRight className="h-3.5 w-3.5 text-dharma-muted group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: RECENT JOURNAL REFLECTIONS */}
        <section aria-labelledby="journal-heading">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <FileText className="h-4 w-4" />
              </div>
              <h2 id="journal-heading" className="font-serif text-2xl font-bold text-dharma-text">
                स्वाध्याय डायरी · Private Reflections
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setJournalModalOpen(true)}
                className="text-xs font-bold text-saffron-700 dark:text-saffron-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                + नया मनन
              </button>
              <Link
                href="/journal"
                className="text-xs font-bold text-dharma-muted hover:text-dharma-text flex items-center gap-1"
              >
                पूरी डायरी <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {journalEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-dharma-border p-8 text-center bg-dharma-card/40">
              <StickyNote className="mx-auto h-9 w-9 text-rose-500/60 mb-2" />
              <h3 className="font-serif text-base font-bold text-dharma-text">डायरी अभी रिक्त है</h3>
              <p className="mt-1 text-xs text-dharma-muted max-w-sm mx-auto">
                शास्त्र अध्ययन करते समय उठे विचार, जिज्ञासा या आंतरिक शांति को यहाँ दर्ज करें। यह डायरी केवल आपके लिए है।
              </p>
              <button
                type="button"
                onClick={() => setJournalModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-saffron-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-saffron-700 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> पहला मनन लिखें
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {journalEntries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-saffron-700 dark:text-saffron-400">
                        {entry.moodTag ? `भाव: ${entry.moodTag}` : 'स्वाध्याय मनन'}
                      </span>
                      <span className="text-[11px] text-dharma-muted">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {entry.title && (
                      <h3 className="font-serif text-base font-bold text-dharma-text mb-1 line-clamp-1">
                        {entry.title}
                      </h3>
                    )}
                    <p className="text-xs text-dharma-muted line-clamp-4 leading-relaxed whitespace-pre-wrap">
                      {entry.body}
                    </p>
                  </div>

                  {entry.linkedReferences.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-dharma-border/60">
                      <span className="text-[10px] uppercase font-bold text-dharma-muted">संबद्ध श्लोक:</span>
                      <p className="text-xs font-semibold text-saffron-700 dark:text-saffron-300 truncate">
                        {entry.linkedReferences[0].canonicalReference}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 4: CROSS-SCRIPTURE CONCEPT MATRIX */}
        <section aria-labelledby="cross-concepts-heading">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 id="cross-concepts-heading" className="font-serif text-2xl font-bold text-dharma-text">
                ज्ञान संबंध व दर्शन · Cross-Scripture Exploration
              </h2>
            </div>
            <Link
              href="/concepts"
              className="text-xs font-bold text-saffron-700 dark:text-saffron-300 hover:underline flex items-center gap-1"
            >
              सभी अवधारणाएँ <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CROSS_CONCEPTS.map((concept) => (
              <Link
                key={concept.id}
                href={`/concepts/${concept.slug}`}
                className="group relative rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-2xs transition hover:border-saffron-400 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${concept.colour} mb-3`} />
                  <h3 className="font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition-colors">
                    {concept.nameHi}
                  </h3>
                  <p className="mt-1.5 text-xs text-dharma-muted line-clamp-2 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dharma-border/60">
                  <span className="text-[10px] uppercase font-bold text-dharma-muted block mb-1">
                    प्रमुख स्रोत:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {concept.scriptures.map((scrip, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-md bg-dharma-bg border border-dharma-border/80 px-2 py-0.5 text-[10px] font-semibold text-stone-700 dark:text-stone-300"
                      >
                        {scrip}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 5: DATA SOVEREIGNTY, PRIVACY & BACKUP HUB */}
        <section aria-labelledby="data-sovereignty-heading" className="rounded-3xl border border-saffron-500/20 bg-gradient-to-b from-amber-500/5 to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-2">
            <Shield className="h-6 w-6 text-saffron-600 dark:text-saffron-400" />
            <h2 id="data-sovereignty-heading" className="font-serif text-2xl font-bold text-dharma-text">
              डेटा संप्रभुता व बैकअप हब · Data Sovereignty Hub
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-dharma-muted max-w-2xl leading-relaxed mb-6">
            Dharma Granth में कोई खाता, क्लाउड सर्वर या ट्रैकिंग नहीं है। आपका सारा अध्ययन डेटा आपके ब्राउज़र के IndexedDB में सुरक्षित रहता है। डिवाइस बदलने या सुरक्षित रखने के लिए समय-समय पर बैकअप अवश्य डाउनलोड करें।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Universal .dharma Backup Export */}
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-4 text-left transition hover:border-saffron-400 hover:shadow-md cursor-pointer group shadow-2xs"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-saffron-500/10 text-saffron-700 dark:text-saffron-400 group-hover:scale-110 transition-transform">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-dharma-text">बैकअप डाउनलोड (.dharma)</h3>
                <p className="text-[11px] text-dharma-muted">सभी नोट्स, संग्रह व इतिहास</p>
              </div>
            </button>

            {/* Universal .dharma Backup Restore */}
            <label className="flex items-center gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-4 text-left transition hover:border-saffron-400 hover:shadow-md cursor-pointer group shadow-2xs">
              <input
                ref={fileInputRef}
                type="file"
                accept=".dharma,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-dharma-text">बैकअप पुनर्स्थापित करें</h3>
                <p className="text-[11px] text-dharma-muted">.dharma फ़ाइल चुनें</p>
              </div>
            </label>

            {/* Markdown Export */}
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="flex items-center gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-4 text-left transition hover:border-saffron-400 hover:shadow-md cursor-pointer group shadow-2xs"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-dharma-text">मार्कडाउन निर्यात (.md)</h3>
                <p className="text-[11px] text-dharma-muted">Obsidian व Logseq के लिए</p>
              </div>
            </button>

            {/* Emergency Data Wipe */}
            <button
              type="button"
              onClick={() => setShowWipeConfirm(true)}
              className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 text-left transition hover:border-rose-500 hover:bg-rose-500/10 cursor-pointer group shadow-2xs"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-rose-700 dark:text-rose-400">डेटा मिटाएं (Wipe)</h3>
                <p className="text-[11px] text-dharma-muted">स्थानीय कैश व नोट्स हटाएं</p>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* MODALS */}
      <JournalEditorModal
        isOpen={journalModalOpen}
        onClose={() => setJournalModalOpen(false)}
        onSaved={() => {
          showToast('मनन डायरी में सुरक्षित हो गया!');
          loadAllData();
        }}
      />

      <OfflinePacksModal
        isOpen={offlineModalOpen}
        onClose={() => {
          setOfflineModalOpen(false);
          loadAllData();
        }}
      />

      <PrivacyLockModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={() => {
          setIsLocked(isPinProtected());
          showToast('पिन सेटिंग्स अद्यतित हुई!');
        }}
        mode={pinModalMode}
      />

      {/* Wipe Confirmation Modal */}
      <AnimatePresence>
        {showWipeConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWipeConfirm(false)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-rose-500/40 bg-dharma-card p-6 shadow-2xl z-10"
            >
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <Trash2 className="h-6 w-6" />
                <h3 className="font-serif text-lg font-bold text-dharma-text">क्या आप सारा अध्ययन डेटा मिटाना चाहते हैं?</h3>
              </div>
              <p className="text-xs text-dharma-muted leading-relaxed">
                यह क्रिया आपके ब्राउज़र से सभी डायरी प्रविष्टियाँ, श्लोक टिप्पणियाँ, बुकमार्क और संग्रह स्थायी रूप से मिटा देगी। यह पूर्ववत नहीं किया जा सकता।
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowWipeConfirm(false)}
                  className="rounded-xl border border-dharma-border px-4 py-2 text-xs font-semibold text-dharma-text hover:bg-dharma-bg transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  disabled={isWiping}
                  onClick={handleWipeData}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isWiping ? 'मिटाया जा रहा है...' : 'हाँ, सारा डेटा मिटाएं'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
