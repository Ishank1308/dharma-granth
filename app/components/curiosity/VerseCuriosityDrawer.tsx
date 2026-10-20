'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Lightbulb, ArrowRight } from 'lucide-react';
import { getInquiriesForVerse, type InquiryItem } from '@/data/curiosity-inquiry';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface VerseCuriosityDrawerProps {
  scriptureId: string;
  chapter: number;
  verse: string | number;
  className?: string;
}

export function VerseCuriosityDrawer({
  scriptureId,
  chapter,
  verse,
  className = '',
}: VerseCuriosityDrawerProps) {
  const inquiries = getInquiriesForVerse(scriptureId, chapter, verse);
  const [isOpen, setIsOpen] = useState(false);

  if (inquiries.length === 0) return null;

  const toggle = () => {
    setIsOpen((prev) => !prev);
    triggerTactileFeedback('selection', 'softTap');
  };

  return (
    <div className={`mt-3 border-t border-dharma-border/60 pt-3 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-xl border border-amber-300/40 bg-amber-500/10 px-3.5 py-2 text-left text-xs font-semibold text-amber-900 transition hover:bg-amber-500/15 dark:border-amber-400/20 dark:text-amber-200"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-devanagari font-bold">
            जिज्ञासा: बाल व किशोर मन के प्रश्न ({inquiries.length})
          </span>
          <span className="hidden sm:inline text-dharma-muted">· Curious Minds Ask</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-saffron-700 dark:text-saffron-400">
          <span>{isOpen ? 'छिपाएं' : 'पढ़ें'}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-3 rounded-2xl border border-dharma-border bg-dharma-card/90 p-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="space-y-2 border-b border-dharma-border/60 pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                <Lightbulb className="h-3 w-3" />
                <span>
                  {inq.audience === 'child' ? '🧒 बाल प्रश्न' : inq.audience === 'teen' ? '🧑 किशोर प्रश्न' : inq.audience === 'parent' ? '👨‍👩‍👧 अभिभावक संवाद' : '🌿 आरंभिक प्रश्न'}
                </span>
                <span className="text-dharma-muted">· {inq.categoryLabelEn}</span>
              </div>

              <h4 className="font-serif text-sm font-bold text-dharma-text">
                {inq.questionHi}
              </h4>
              <p className="text-xs text-dharma-muted">
                {inq.questionEn}
              </p>

              <p className="font-devanagari text-xs leading-relaxed text-stone-800 dark:text-stone-200">
                {inq.simpleAnswerHi}
              </p>

              <div className="rounded-xl bg-dharma-bg p-2.5 text-xs text-dharma-muted">
                <strong className="text-saffron-800 dark:text-saffron-300">स्वयं चिंतन: </strong>
                <span>{inq.thinkingPromptHi}</span>
              </div>

              <div className="pt-1">
                <Link
                  href={`/curiosity/#inquiry-${inq.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
                >
                  <span>संपूर्ण ७-चरणीय जिज्ञासा चक्र देखें (Full Inquiry Cycle)</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
