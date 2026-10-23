'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  PenLine,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  Download,
  Upload,
  Trash2,
  Edit3,
  Filter,
  Lock,
  ArrowRight,
  Tag,
} from 'lucide-react';
import {
  getAllJournalEntries,
  deleteJournalEntry,
  restoreJournalEntries,
  clearJournalEntries,
  STUDY_UPDATE_CHANNEL,
  STUDY_UPDATE_STORAGE_KEY,
} from '@/lib/study/storage';
import { createJournalBackup, parseJournalBackup, type JournalRestoreMode } from '@/lib/study/journal-backup';
import { runStudyDataMigration } from '@/lib/study/migration';
import type { JournalEntry, JournalMood } from '@/lib/study/types';
import { JournalEditorModal } from '@/components/study/JournalEditorModal';
import { triggerTactileFeedback } from '@/lib/haptics';

const MOOD_FILTERS: Array<{ id: JournalMood | 'all'; labelEn: string; labelHi: string; emoji: string }> = [
  { id: 'all', labelEn: 'All Moods', labelHi: 'सभी', emoji: '✨' },
  { id: 'peaceful', labelEn: 'Peaceful', labelHi: 'शांत', emoji: '🕊️' },
  { id: 'contemplative', labelEn: 'Contemplative', labelHi: 'मनन', emoji: '🧘' },
  { id: 'restless', labelEn: 'Restless', labelHi: 'अशांत', emoji: '🌊' },
  { id: 'seeking', labelEn: 'Seeking', labelHi: 'जिज्ञासु', emoji: '🌱' },
  { id: 'grateful', labelEn: 'Grateful', labelHi: 'कृतज्ञ', emoji: '🙏' },
  { id: 'grief', labelEn: 'Loss / Healing', labelHi: 'शोक / स्वीकार', emoji: '🌧️' },
];

export function JournalClient() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalMood | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [restoreMode, setRestoreMode] = useState<JournalRestoreMode>('merge');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [backupBusy, setBackupBusy] = useState(false);
  const backupFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    const refreshEntries = async () => {
      const list = await getAllJournalEntries();
      if (active) {
        setEntries(list);
        setLoading(false);
      }
    };
    const relevantStore = (store?: string) => store === 'journal_entries' || store === 'all';
    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ store?: string }>).detail;
      if (!detail?.store || relevantStore(detail.store)) void refreshEntries();
    };
    const handleMigration = () => void refreshEntries();
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STUDY_UPDATE_STORAGE_KEY || !event.newValue) return;
      try {
        const signal = JSON.parse(event.newValue) as { store?: string };
        if (relevantStore(signal.store)) void refreshEntries();
      } catch {
        // Ignore malformed cross-tab signals; the journal remains local and intact.
      }
    };

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(STUDY_UPDATE_CHANNEL);
        channel.onmessage = (event: MessageEvent<{ store?: string }>) => {
          if (relevantStore(event.data?.store)) void refreshEntries();
        };
      }
    } catch {
      channel = null;
    }

    window.addEventListener('dharma-study-updated', handleUpdate);
    window.addEventListener('dharma-study-migrated', handleMigration);
    window.addEventListener('storage', handleStorage);
    void runStudyDataMigration().catch(() => undefined).finally(refreshEntries);
    return () => {
      active = false;
      channel?.close();
      window.removeEventListener('dharma-study-updated', handleUpdate);
      window.removeEventListener('dharma-study-migrated', handleMigration);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleOpenNew = () => {
    triggerTactileFeedback('selection', 'softTap');
    setEditingEntry(null);
    setEditorOpen(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    triggerTactileFeedback('selection', 'softTap');
    setEditingEntry(entry);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('क्या आप इस प्रविष्टि को हटाना चाहते हैं? (Delete this journal entry?)')) {
      triggerTactileFeedback('medium', 'softTap');
      await deleteJournalEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const exportMarkdownVault = () => {
    triggerTactileFeedback('selection', 'softTap');
    const combined = entries
      .map(
        (e) =>
          `# ${e.title}\n\n*दिनांक: ${new Date(e.createdAt).toLocaleDateString(undefined, { numberingSystem: 'latn' })} | भाव: ${e.moodTag || 'स्वाध्याय'} | टैग्स: ${e.tags.join(', ')}*\n\n${
            e.linkedReferences.length > 0
              ? `**संलग्न श्लोक:** ${e.linkedReferences.map((r) => r.canonicalReference).join(', ')}\n\n`
              : ''
          }${e.body}\n\n---\n`
      )
      .join('\n');

    const blob = new Blob([combined], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dharmagranth-journal-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSONBackup = () => {
    try {
      const backup = createJournalBackup(entries);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-granth-journal-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setBackupStatus('JSON backup downloaded · बैकअप डाउनलोड हो गया। The file is not encrypted · यह फ़ाइल कूटबद्ध नहीं है।');
    } catch (error) {
      setBackupStatus(error instanceof Error ? error.message : 'Journal backup could not be created.');
    }
  };

  const importJSONBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setBackupStatus('The backup file exceeds 10 MB · बैकअप फ़ाइल 10 MB से बड़ी है।');
      return;
    }

    setBackupBusy(true);
    setBackupStatus(null);
    try {
      const importedEntries = parseJournalBackup(await file.text());
      if (restoreMode === 'replace' && !confirm(`Replace this browser's journal with ${importedEntries.length} entries? Existing journal entries will be removed.\n\nक्या इस ब्राउज़र की वर्तमान डायरी हटाकर बैकअप की ${importedEntries.length} प्रविष्टियाँ रखी जाएँ?`)) {
        return;
      }
      await restoreJournalEntries(importedEntries, restoreMode);
      setEntries(await getAllJournalEntries());
      setBackupStatus(`${importedEntries.length} journal ${importedEntries.length === 1 ? 'entry' : 'entries'} imported (${restoreMode}) · ${importedEntries.length} प्रविष्टियाँ आयातित।`);
    } catch (error) {
      setBackupStatus(error instanceof Error ? error.message : 'The journal backup could not be imported.');
    } finally {
      setBackupBusy(false);
    }
  };

  const clearJournal = async () => {
    if (!confirm('Clear every journal entry stored in this browser? This will not clear bookmarks or reading notes.\n\nक्या इस ब्राउज़र की सभी डायरी प्रविष्टियाँ मिटाएँ? बुकमार्क और पठन-टिप्पणियाँ सुरक्षित रहेंगी।')) return;
    setBackupBusy(true);
    try {
      await clearJournalEntries();
      setEntries([]);
      setBackupStatus('Journal cleared from this browser · इस ब्राउज़र की डायरी मिटा दी गई।');
    } catch (error) {
      setBackupStatus(error instanceof Error ? error.message : 'The journal could not be cleared · डायरी नहीं मिटाई जा सकी।');
    } finally {
      setBackupBusy(false);
    }
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (selectedMood !== 'all' && e.moodTag !== selectedMood) return false;
      if (selectedTag && !e.tags?.includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = e.title.toLowerCase().includes(q);
        const inBody = e.body.toLowerCase().includes(q);
        const inTags = e.tags?.some((t) => t.toLowerCase().includes(q));
        const inRef = e.linkedReferences?.some((r) => r.canonicalReference.toLowerCase().includes(q));
        if (!inTitle && !inBody && !inTags && !inRef) return false;
      }
      return true;
    });
  }, [entries, selectedMood, selectedTag, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950/50 pb-24">
      {/* Editorial Header */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-white/80 py-10 sm:py-16 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-900/80 manuscript-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-800 dark:text-saffron-300 font-mono text-[11px] uppercase tracking-widest font-bold">
                <PenLine className="w-3.5 h-3.5" />
                <span>स्वाध्याय डायरी · Private Local Journal</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
                आंतरिक मनन एवं चिंतन
              </h1>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
                यह आपका एकांत आध्यात्मिक स्थान है। यहाँ दर्ज किया गया प्रत्येक विचार, प्रश्न या आत्म-समीक्षा केवल आपके इसी ब्राउज़र में सुरक्षित रहती है।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <input
                ref={backupFileInput}
                type="file"
                accept="application/json,.json"
                onChange={importJSONBackup}
                className="sr-only"
                aria-label="Choose a Dharma Granth journal JSON backup"
              />
              {entries.length > 0 && (
                <>
                  <button type="button" onClick={exportJSONBackup} disabled={backupBusy} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:border-stone-400 transition disabled:opacity-50" title="Export a portable JSON journal backup">
                    <Download className="w-3.5 h-3.5" /><span>JSON बैकअप</span>
                  </button>
                  <button type="button" onClick={exportMarkdownVault} disabled={backupBusy} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:border-stone-400 transition disabled:opacity-50" title="Export all entries to Markdown">
                    <Download className="w-3.5 h-3.5" /><span>Markdown निर्यात</span>
                  </button>
                  <button type="button" onClick={clearJournal} disabled={backupBusy} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border border-rose-200 dark:border-rose-900 bg-white dark:bg-stone-800 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition disabled:opacity-50" title="Clear only journal entries">
                    <Trash2 className="w-3.5 h-3.5" /><span>डायरी मिटाएँ</span>
                  </button>
                </>
              )}
              <label className="sr-only" htmlFor="journal-restore-mode">Import behavior</label>
              <select id="journal-restore-mode" value={restoreMode} onChange={(event) => setRestoreMode(event.target.value as JournalRestoreMode)} disabled={backupBusy} className="min-h-[40px] rounded-full border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                <option value="merge">प्रविष्टियाँ मिलाएँ · Merge</option>
                <option value="replace">डायरी बदलें · Replace</option>
              </select>
              <button type="button" onClick={() => backupFileInput.current?.click()} disabled={backupBusy} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:border-stone-400 transition disabled:opacity-50">
                <Upload className="w-3.5 h-3.5" /><span>{backupBusy ? 'आयात हो रहा है…' : 'JSON आयात'}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                <span>नया चिंतन लिखें</span>
              </button>
            </div>
          </div>
          {backupStatus && <p role="status" aria-live="polite" className="mt-3 text-xs text-stone-600 dark:text-stone-300">{backupStatus}</p>}
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-stone-500 dark:text-stone-400">
            Journal backups stay on your device until you choose a file. JSON files contain readable, unencrypted reflections · निजी डायरी का JSON बैकअप कूटबद्ध नहीं होता।
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 mt-8">
        {/* Search & Mood Filter Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="डायरी में खोजें... (शीर्षक, विचार, श्लोक या टैग)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 outline-none focus:border-saffron-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 shrink-0">
              <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{filteredEntries.length}</span>
              <span>चिंतन प्रविष्टियाँ</span>
            </div>
          </div>

          {/* Mood Pills Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MOOD_FILTERS.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedMood(m.id);
                    triggerTactileFeedback('selection', 'softTap');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                    isSelected
                      ? 'border-saffron-500 bg-saffron-500/15 text-saffron-900 dark:text-saffron-200 ring-1 ring-saffron-400'
                      : 'border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.labelHi}</span>
                </button>
              );
            })}
          </div>

          {/* Tag Filter Strip */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> टैग:
              </span>
              {selectedTag && (
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="editorial-meta-pill bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300 cursor-pointer"
                >
                  सभी टैग देखें ✕
                </button>
              )}
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                  className={`editorial-meta-pill cursor-pointer transition ${
                    selectedTag === t
                      ? 'bg-saffron-500/20 border-saffron-500 text-saffron-900 dark:text-saffron-200 font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entries List or Empty State */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-3xl bg-stone-200/60 dark:bg-stone-800/60" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white/70 p-10 sm:p-14 text-center dark:border-stone-800 dark:bg-stone-900/50 manuscript-surface">
            <div className="w-14 h-14 rounded-full bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center mx-auto text-saffron-600 dark:text-saffron-400 mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {searchQuery || selectedMood !== 'all' || selectedTag
                ? 'कोई मेल खाती प्रविष्टि नहीं मिली'
                : 'आपकी स्वाध्याय डायरी अभी रिक्त है'}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto mb-6 leading-relaxed">
              {searchQuery || selectedMood !== 'all' || selectedTag
                ? 'कृपया अपने खोज शब्दों या फ़िल्टर को बदलकर देखें।'
                : 'किसी भी श्लोक के मनन, दैनिक संकल्प या आध्यात्मिक प्रश्न से अपनी डायरी का आरम्भ करें। यह पूर्णतः निजी है।'}
            </p>
            <button
              type="button"
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <PenLine className="w-4 h-4" />
              <span>पहला चिंतन दर्ज करें</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredEntries.map((entry) => {
              const moodInfo = MOOD_FILTERS.find((m) => m.id === entry.moodTag);
              const dateStr = new Date(entry.createdAt).toLocaleDateString('hi-IN', { numberingSystem: 'latn',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md dark:border-stone-800 dark:bg-stone-900 transition-all manuscript-surface"
                >
                  {/* Card Top Metadata Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-200/60 dark:border-stone-800/60">
                    <div className="flex items-center gap-2">
                      {moodInfo && moodInfo.id !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                          <span>{moodInfo.emoji}</span>
                          <span>{moodInfo.labelHi}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono text-[11px] text-stone-400">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(entry)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                        title="संपादित करें (Edit)"
                        aria-label="Edit entry"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="हटाएं (Delete)"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                    {entry.title}
                  </h2>

                  {/* Body Content */}
                  <div className="text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed font-sans whitespace-pre-wrap mb-4">
                    {entry.body}
                  </div>

                  {/* Linked Scripture Verses */}
                  {entry.linkedReferences && entry.linkedReferences.length > 0 && (
                    <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-wrap items-center gap-2 mb-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-saffron-700 dark:text-saffron-400 font-bold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>संलग्न श्लोक:</span>
                      </span>
                      {entry.linkedReferences.map((ref, idx) => (
                        <Link
                          key={idx}
                          href={`/scripture/${ref.scriptureId}/chapter/${ref.chapterId}/verse/${ref.verseId}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-semibold text-saffron-900 dark:text-saffron-200 hover:bg-saffron-500/20 transition"
                        >
                          <span>{ref.canonicalReference}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="editorial-meta-pill bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      <JournalEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        initialEntry={editingEntry}
      />
    </div>
  );
}
