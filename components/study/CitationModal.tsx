'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  BookOpen,
  Share2,
  FileText,
  Quote,
  MessageCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatCitation, type CitationFormat, type CitationParams } from '@/lib/study/citations';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  params: CitationParams;
}

export function CitationModal({ isOpen, onClose, params }: Props) {
  const [activeFormat, setActiveFormat] = useState<CitationFormat>('apa');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCitation = formatCitation(params, activeFormat);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCitation);
      setCopied(true);
      triggerTactileFeedback('success', 'softTap');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const formats: Array<{ id: CitationFormat; label: string; icon: React.ElementType; desc: string }> = [
    { id: 'apa', label: 'APA 7th', icon: FileText, desc: 'American Psychological Association standard' },
    { id: 'chicago', label: 'Chicago 17th', icon: BookOpen, desc: 'Humanities notes and bibliography standard' },
    { id: 'mla', label: 'MLA 9th', icon: Quote, desc: 'Modern Language Association scholarly citation' },
    { id: 'markdown', label: 'Markdown', icon: FileText, desc: 'Formatted blockquote for Obsidian, Logseq & GitHub' },
    { id: 'whatsapp', label: 'WhatsApp / Status', icon: MessageCircle, desc: 'Formatted with Devanagari, Hindi, and English' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 manuscript-surface z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-200/70 dark:border-stone-800/70">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-saffron-700 dark:text-saffron-400 font-bold">
                शास्त्रीय संदर्भ उद्धरण · Scholarly Citation
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {params.scriptureTitle} {params.chapterId}.{params.verseNum}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Tabs */}
          <div className="flex flex-wrap gap-1.5 py-4 border-b border-stone-200/60 dark:border-stone-800/60">
            {formats.map((f) => {
              const Icon = f.icon;
              const isSelected = activeFormat === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFormat(f.id);
                    triggerTactileFeedback('selection', 'softTap');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    isSelected
                      ? 'border-saffron-500 bg-saffron-500/15 text-saffron-900 dark:text-saffron-200'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Citation Preview Box */}
          <div className="my-5">
            <div className="relative rounded-2xl border border-stone-200 bg-stone-50/80 p-4 font-mono text-xs text-stone-800 leading-relaxed dark:border-stone-800 dark:bg-stone-950/80 dark:text-stone-200 max-h-56 overflow-y-auto whitespace-pre-wrap select-all">
              {currentCitation}
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 italic">
              {formats.find((f) => f.id === activeFormat)?.desc}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200/70 dark:border-stone-800/70">
            <span className="text-xs text-stone-500 dark:text-stone-400">
              100% प्रामाणिक संदर्भ URL सहित
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'कॉपी हो गया! (Copied)' : 'उद्धरण कॉपी करें (Copy Citation)'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
