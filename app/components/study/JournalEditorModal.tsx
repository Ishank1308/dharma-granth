'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  BookOpen,
  Sparkles,
  Tag,
  Smile,
  Trash2,
  Check,
  Quote,
  Bold,
  Italic,
  List,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { saveJournalEntry, deleteJournalEntry } from '@/lib/study/storage';
import type { JournalEntry, JournalMood, PersonalStudyReference } from '@/lib/study/types';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (entry: JournalEntry) => void;
  initialEntry?: JournalEntry | null;
  linkedReference?: PersonalStudyReference;
}

const MOODS: Array<{ id: JournalMood; labelEn: string; labelHi: string; emoji: string }> = [
  { id: 'peaceful', labelEn: 'Peaceful', labelHi: 'शांत', emoji: '🕊️' },
  { id: 'contemplative', labelEn: 'Contemplative', labelHi: 'मनन', emoji: '🧘' },
  { id: 'restless', labelEn: 'Restless', labelHi: 'अशांत', emoji: '🌊' },
  { id: 'seeking', labelEn: 'Seeking', labelHi: 'जिज्ञासु', emoji: '🌱' },
  { id: 'grateful', labelEn: 'Grateful', labelHi: 'कृतज्ञ', emoji: '🙏' },
  { id: 'grief', labelEn: 'Processing Loss', labelHi: 'शोक / स्वीकार', emoji: '🌧️' },
];

export function JournalEditorModal({
  isOpen,
  onClose,
  onSaved,
  initialEntry,
  linkedReference,
}: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<JournalMood>('contemplative');
  const [tagsInput, setTagsInput] = useState('');
  const [linkedRefs, setLinkedRefs] = useState<PersonalStudyReference[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title || '');
      setBody(initialEntry.body || '');
      setMood(initialEntry.moodTag || 'contemplative');
      setTagsInput(initialEntry.tags?.join(', ') || '');
      setLinkedRefs(initialEntry.linkedReferences || []);
    } else {
      setTitle('');
      setBody('');
      setMood('contemplative');
      setTagsInput('');
      setLinkedRefs(linkedReference ? [linkedReference] : []);
    }
  }, [initialEntry, linkedReference, isOpen]);

  if (!isOpen) return null;

  const handleInsertFormatting = (type: 'bold' | 'italic' | 'quote' | 'list') => {
    triggerTactileFeedback('light', 'softTap');
    switch (type) {
      case 'bold':
        setBody((prev) => `${prev} **महत्वपूर्ण विचार** `);
        break;
      case 'italic':
        setBody((prev) => `${prev} *आंतरिक चिंतन* `);
        break;
      case 'quote':
        setBody((prev) => `${prev}\n> "पवित्र श्लोक या वचन..."\n`);
        break;
      case 'list':
        setBody((prev) => `${prev}\n- पहला संकल्प:\n- दूसरा संकल्प:\n`);
        break;
    }
  };

  const handleSave = async () => {
    if (!body.trim()) return;
    setIsSaving(true);
    triggerTactileFeedback('success', 'softTap');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const entry: JournalEntry = {
      id: initialEntry?.id || `journal:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: title.trim() || (linkedRefs[0]?.canonicalReference ? `मनन चिंतन · ${linkedRefs[0].canonicalReference}` : 'स्वाध्याय चिंतन'),
      body: body.trim(),
      linkedReferences: linkedRefs,
      moodTag: mood,
      tags: tags.length > 0 ? tags : ['svadhyaya'],
      createdAt: initialEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };

    try {
      await saveJournalEntry(entry);
      onSaved?.(entry);
      onClose();
    } catch (err) {
      console.error('Failed to save journal entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialEntry) return;
    if (confirm('क्या आप सचमुच इस चिंतन को हटाना चाहते हैं? (Delete this journal reflection?)')) {
      triggerTactileFeedback('medium', 'softTap');
      await deleteJournalEntry(initialEntry.id);
      onClose();
    }
  };

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900 manuscript-surface z-10 flex flex-col my-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-200/70 dark:border-stone-800/70">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-saffron-700 dark:text-saffron-400 font-bold">
                व्यक्तिगत स्वाध्याय डायरी · Private Local Journal
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {initialEntry ? 'चिंतन संपादित करें (Edit Reflection)' : 'नया मनन एवं आत्म-चिंतन (New Entry)'}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              {initialEntry && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="हटाएं (Delete)"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Scroll Body */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
            {/* Linked Scripture Reference Banner */}
            {linkedRefs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>संलग्न श्लोक:</span>
                </span>
                {linkedRefs.map((ref, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-amber-300/60 dark:border-amber-700/60 font-medium text-stone-800 dark:text-stone-200"
                  >
                    <span>{ref.canonicalReference}</span>
                    <button
                      type="button"
                      onClick={() => setLinkedRefs((prev) => prev.filter((_, i) => i !== idx))}
                      className="hover:text-rose-500"
                      title="हटाएं"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Title Input */}
            <div>
              <label htmlFor="journal-title" className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                शीर्षक (Title):
              </label>
              <input
                id="journal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="आज किस विषय पर विचार कर रहे हैं? (e.g. कर्म और अनासक्ति)"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 p-3 text-sm text-stone-900 outline-none focus:border-saffron-500 focus:bg-white dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-100 dark:focus:bg-stone-950 font-serif font-medium"
              />
            </div>

            {/* Mood Pill Selector */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                चित्त की अवस्था (Mind State):
              </span>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => {
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMood(m.id);
                        triggerTactileFeedback('selection', 'softTap');
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                        isSelected
                          ? 'border-saffron-500 bg-saffron-500/15 text-saffron-900 dark:text-saffron-200 ring-1 ring-saffron-400'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.labelHi}</span>
                      <span className="opacity-70">({m.labelEn})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Markdown Body & Quick Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="journal-body" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  चिंतन एवं अनुभव (Reflection Notes · Markdown Supported):
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('bold')}
                    className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('italic')}
                    className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('quote')}
                    className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                    title="Quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('list')}
                    className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                id="journal-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder="यहाँ अपने हृदय के विचार, प्रश्नों का समाधान, या किसी श्लोक से मिली गहरी सीख को निःसंकोच लिखें... यह केवल आपके इस ब्राउज़र में सुरक्षित है।"
                className="w-full resize-y rounded-2xl border border-stone-200 bg-stone-50/70 p-4 text-sm leading-relaxed text-stone-900 outline-none focus:border-saffron-500 focus:bg-white dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-100 dark:focus:bg-stone-950 font-sans"
              />
              <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                <span>{wordCount} शब्द ({Math.max(1, Math.ceil(wordCount / 180))} min read)</span>
                <span>🔒 पूर्णतः स्थानीय · किसी सर्वर पर नहीं भेजा जाता</span>
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label htmlFor="journal-tags" className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>टैग्स (Tags, comma-separated):</span>
              </label>
              <input
                id="journal-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="karma, meditation, शांति, निर्णय"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 p-2.5 text-xs text-stone-900 outline-none focus:border-saffron-500 focus:bg-white dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-100 dark:focus:bg-stone-950"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-6 bg-stone-50/60 dark:bg-stone-950/60 border-t border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
            >
              रद्द करें (Cancel)
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!body.trim() || isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>सहेजें (Save Reflection)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
