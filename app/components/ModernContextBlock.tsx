import React from 'react';
import { Compass, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface ModernContextBlockProps {
  content: string;
  lang?: string;
  className?: string;
}

export interface ApplicationItem {
  title: string;
  description: string;
}

export interface ParsedModernContext {
  hasStructuredFormat: boolean;
  contextText: string;
  applicationText: string;
  applicationItems: ApplicationItem[];
  reflectionQuestion: string;
  rawText: string;
}

export function parseApplicationPoints(text: string): ApplicationItem[] {
  if (!text) return [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: ApplicationItem[] = [];

  for (const line of lines) {
    // Matches: - **शीर्षक**: विवरण or 1. **शीर्षक**: विवरण or • **शीर्षक**: विवरण
    const match = line.match(/^[-*•\d.]*\s*\*\*([^*]+)\*\*:\s*(.*)$/);
    if (match) {
      items.push({
        title: match[1].trim(),
        description: match[2].trim(),
      });
    } else if (items.length > 0 && line) {
      items[items.length - 1].description += ' ' + line;
    }
  }

  return items;
}

export function parseModernContext(text: string): ParsedModernContext {
  const trimmed = text.trim();
  const hasContext = trimmed.includes('### आधुनिक संदर्भ');
  const hasApplication = trimmed.includes('### आज के जीवन में प्रयोग');
  const hasQuestion = trimmed.includes('### चिंतन प्रश्न');

  if (!hasContext && !hasApplication && !hasQuestion) {
    return {
      hasStructuredFormat: false,
      contextText: '',
      applicationText: '',
      applicationItems: [],
      reflectionQuestion: '',
      rawText: trimmed,
    };
  }

  let contextText = '';
  let applicationText = '';
  let reflectionQuestion = '';

  // Extract sections using regex
  const contextMatch = trimmed.match(/###\s*आधुनिक संदर्भ\s*([\s\S]*?)(?=###\s*आज के जीवन में प्रयोग|###\s*चिंतन प्रश्न|$)/);
  if (contextMatch) {
    contextText = contextMatch[1].trim();
  }

  const appMatch = trimmed.match(/###\s*आज के जीवन में प्रयोग\s*([\s\S]*?)(?=###\s*चिंतन प्रश्न|$)/);
  if (appMatch) {
    applicationText = appMatch[1].trim();
  }

  const qMatch = trimmed.match(/###\s*चिंतन प्रश्न\s*([\s\S]*?)$/);
  if (qMatch) {
    reflectionQuestion = qMatch[1].trim();
  }

  // Fallback if parsing failed somehow
  if (!contextText && !applicationText && !reflectionQuestion) {
    return {
      hasStructuredFormat: false,
      contextText: '',
      applicationText: '',
      applicationItems: [],
      reflectionQuestion: '',
      rawText: trimmed,
    };
  }

  const applicationItems = parseApplicationPoints(applicationText);

  return {
    hasStructuredFormat: true,
    contextText,
    applicationText,
    applicationItems,
    reflectionQuestion,
    rawText: trimmed,
  };
}

/**
 * Modern Context body:
 * Inspired by Apple HIG & Samsung One UI grouped cards:
 * 1. Deep contemporary perspective narrative
 * 2. 3 tactile interactive application cards with index badges
 */
export function ModernContextBody({
  parsed,
  lang = 'hi',
  className = '',
}: {
  parsed: ParsedModernContext;
  lang?: string;
  className?: string;
}) {
  if (!parsed.hasStructuredFormat) {
    return (
      <div
        lang={lang}
        className={`whitespace-pre-line text-sm leading-relaxed text-dharma-text font-devanagari md:text-base ${className}`}
      >
        {parsed.rawText}
      </div>
    );
  }

  return (
    <div className={`space-y-4.5 font-devanagari text-dharma-text ${className}`}>
      {/* 1. आधुनिक संदर्भ (Deep Modern Context) */}
      {parsed.contextText && (
        <section
          aria-label="आधुनिक संदर्भ"
          className="rounded-[22px] border border-stone-200/80 bg-stone-50/50 p-4.5 sm:p-5 dark:border-stone-800/80 dark:bg-stone-900/30 shadow-2xs transition-all"
        >
          <div className="mb-2.5 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <Compass className="h-3 w-3" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              आधुनिक संदर्भ · Modern Context
            </p>
          </div>
          <div className="whitespace-pre-line text-sm md:text-base leading-relaxed sm:leading-loose text-dharma-text/95">
            {parsed.contextText}
          </div>
        </section>
      )}

      {/* 2. आज के जीवन में प्रयोग (Practical Application - Apple & One UI Grouped Cards) */}
      {parsed.applicationText && (
        <section aria-label="आज के जीवन में प्रयोग" className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
              <Sparkles className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
              आज के जीवन में प्रयोग · Practical Application
            </p>
            {parsed.applicationItems.length > 0 && (
              <span className="text-[10px] font-semibold text-dharma-muted">
                3 व्यावहारिक सूत्र
              </span>
            )}
          </div>

          {parsed.applicationItems.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-1">
              {parsed.applicationItems.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col gap-1.5 rounded-[18px] border border-stone-200/80 bg-white/80 p-3.5 sm:p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-saffron-400/50 hover:shadow-xs dark:border-stone-800/80 dark:bg-stone-900/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-saffron-100 text-[10px] font-bold text-saffron-800 dark:bg-saffron-950/60 dark:text-saffron-300">
                      0{idx + 1}
                    </span>
                    <h4 className="font-devanagari text-sm font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <p className="pl-7 font-devanagari text-xs sm:text-sm leading-relaxed text-dharma-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] border border-stone-200/80 bg-white/80 p-4 shadow-2xs dark:border-stone-800/80 dark:bg-stone-900/60 whitespace-pre-line text-sm md:text-base leading-relaxed text-dharma-text/95 font-medium">
              {parsed.applicationText}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/**
 * Apple VisionOS & Samsung One UI Serene Reflection Island
 * Quoted contemplation with tranquil styling to sit with quietly.
 */
export function ReflectionBody({
  question,
  lang = 'hi',
  className = '',
}: {
  question: string;
  lang?: string;
  className?: string;
}) {
  if (!question.trim()) return null;
  return (
    <figure
      className={`relative overflow-hidden rounded-[22px] border border-amber-300/60 bg-gradient-to-br from-amber-50/80 via-white/70 to-saffron-50/50 p-4.5 sm:p-5 shadow-xs transition-all duration-300 dark:border-amber-800/50 dark:from-amber-950/40 dark:via-stone-900/60 dark:to-stone-950/50 ${className}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 shadow-2xs dark:border-amber-700/60 dark:bg-amber-950/60 dark:text-amber-200">
          <HelpCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          चिंतन प्रश्न · Contemplation
        </span>
        <span className="text-[10px] font-medium text-amber-800/70 dark:text-amber-300/70 italic">
          शांत मन से मनन करें
        </span>
      </div>
      <blockquote
        lang={lang}
        className={`font-serif text-base font-semibold leading-relaxed text-amber-950 dark:text-amber-100 md:text-lg ${
          lang === 'hi' ? 'font-devanagari font-medium not-italic leading-relaxed sm:leading-loose' : 'italic'
        }`}
      >
        &ldquo;{question.trim().replace(/^["“]|["”]$/g, '')}&rdquo;
      </blockquote>
    </figure>
  );
}

export function ModernContextBlock({ content, lang = 'hi', className = '' }: ModernContextBlockProps) {
  const parsed = parseModernContext(content);

  if (!parsed.hasStructuredFormat) {
    return <ModernContextBody parsed={parsed} lang={lang} className={className} />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <ModernContextBody parsed={parsed} lang={lang} />
      {parsed.reflectionQuestion && (
        <ReflectionBody question={parsed.reflectionQuestion} lang={lang} />
      )}
    </div>
  );
}
