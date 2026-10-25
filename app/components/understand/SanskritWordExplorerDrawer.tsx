'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight, BookOpen, CheckCircle, ExternalLink, HelpCircle, Layers, Sparkles } from 'lucide-react';
import { ReaderDialog } from '@/app/components/reader/ReaderDialog';
import type { SanskritLexiconEntry } from '@/data/sanskrit-lexicon';
import { readHref } from '@/lib/verse-paths';

interface Props {
  entry: SanskritLexiconEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SanskritWordExplorerDrawer({ entry, isOpen, onClose }: Props) {
  if (!entry) return null;

  return (
    <ReaderDialog
      open={isOpen}
      onClose={onClose}
      title={entry.termIast}
      titleHi={entry.termDevanagari}
      variant="modal"
    >
      <div className="space-y-5 text-sm">
        {/* Grammatical Analysis & Root */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <BookOpen className="h-4 w-4" />
            <span>Root (धातु) & Grammatical Analysis</span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="font-devanagari text-base font-semibold text-dharma-text">
              {entry.rootDhatu}
            </p>
            <p className="text-xs text-dharma-muted">
              {entry.rootMeaning} <span lang="hi" className="font-devanagari">({entry.rootMeaningHi})</span>
            </p>
            <p className="mt-2 font-mono text-xs text-amber-900/90 dark:text-amber-200/90">
              {entry.grammarCategory}
            </p>
          </div>
        </div>

        {/* Contextual Meaning */}
        <div className="rounded-xl border border-dharma-border bg-dharma-bg p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            Contextual Meaning · संदर्भानुसार अर्थ
          </h4>
          <p className="mt-2 font-serif text-sm leading-relaxed text-dharma-text">
            {entry.contextualMeaning}
          </p>
          <p lang="hi" className="mt-2 font-devanagari text-sm leading-relaxed text-dharma-muted">
            {entry.contextualMeaningHi}
          </p>
        </div>

        {/* Simple Definitions */}
        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-dharma-border bg-dharma-card p-3">
            <span className="font-bold uppercase tracking-wide text-dharma-muted">Simple English</span>
            <p className="mt-1 text-sm font-medium text-dharma-text">{entry.simpleEnglish}</p>
          </div>
          <div className="rounded-xl border border-dharma-border bg-dharma-card p-3">
            <span className="font-bold uppercase tracking-wide text-dharma-muted">सरल हिन्दी</span>
            <p lang="hi" className="mt-1 font-devanagari text-sm font-medium text-dharma-text">{entry.simpleHindi}</p>
          </div>
        </div>

        {/* Common Misunderstandings & Traps */}
        {entry.commonMisunderstandings && entry.commonMisunderstandings.length > 0 && (
          <div className="rounded-xl border border-rose-300/60 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-rose-800 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>Common Misunderstandings · सामान्य भ्रम व निवारण</span>
            </div>
            <div className="mt-3 space-y-3">
              {entry.commonMisunderstandings.map((m, idx) => (
                <div key={idx} className="rounded-lg bg-dharma-card/80 p-3 text-xs border border-rose-200/50 dark:border-rose-900/50">
                  <p className="text-rose-900 dark:text-rose-200 font-semibold">
                    <span className="line-through opacity-75">भ्रम: {m.myth}</span>
                  </p>
                  <p className="mt-1.5 text-dharma-text font-serif leading-relaxed">
                    <strong>Clarification:</strong> {m.correction}
                  </p>
                  <p lang="hi" className="mt-1 font-devanagari text-dharma-muted leading-relaxed">
                    <strong>स्पष्टीकरण:</strong> {m.correctionHi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Verses */}
        {entry.relatedVerses && entry.relatedVerses.length > 0 && (
          <div className="rounded-xl border border-dharma-border bg-dharma-card p-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-dharma-muted">
              Related Verses · संबंधित श्लोक
            </h4>
            <ul className="mt-2.5 space-y-2">
              {entry.relatedVerses.map((v, i) => (
                <li key={i} className="flex flex-wrap items-center justify-between gap-2 border-b border-dharma-border/60 pb-1.5 last:border-0 last:pb-0">
                  {v.snippet && !/(?:\.{3}|…)\s*$/.test(v.snippet.trim()) && (
                    <span lang="sa" className="font-devanagari text-xs text-dharma-text">
                      {v.snippet}
                    </span>
                  )}
                  <Link
                    href={readHref(v.scriptureId, v.chapter, v.verse)}
                    onClick={onClose}
                    className="focus-ring inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-saffron-500/40 bg-saffron-50 dark:bg-saffron-950/30 px-2.5 py-1 text-xs font-bold text-saffron-800 dark:text-saffron-300 hover:border-saffron-600 transition"
                  >
                    <span>श्लोक {v.chapter}.{v.verse}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concept Links & Integrity Footnote */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {entry.conceptId && (
            <Link
              href={`/concepts/${entry.conceptId}`}
              onClick={onClose}
              className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-saffron-600 px-4 py-2 text-xs font-semibold text-white hover:bg-saffron-700 transition"
            >
              <span>Explore &ldquo;{entry.conceptId}&rdquo; in Encyclopedia</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}

          <div className="flex items-center gap-1.5 text-xs text-dharma-muted">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Reviewed classical editorial entry · {entry.reviewStatus}</span>
          </div>
        </div>
      </div>
    </ReaderDialog>
  );
}
