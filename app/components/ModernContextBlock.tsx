import React from 'react';
import { Lightbulb, Compass, HelpCircle, Sparkles } from 'lucide-react';

interface ModernContextBlockProps {
  content: string;
  lang?: string;
  className?: string;
}

interface ParsedModernContext {
  hasStructuredFormat: boolean;
  contextText: string;
  applicationText: string;
  reflectionQuestion: string;
  rawText: string;
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
      reflectionQuestion: '',
      rawText: trimmed,
    };
  }

  return {
    hasStructuredFormat: true,
    contextText,
    applicationText,
    reflectionQuestion,
    rawText: trimmed,
  };
}

export function ModernContextBlock({ content, lang = 'hi', className = '' }: ModernContextBlockProps) {
  const parsed = parseModernContext(content);

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
    <div className={`space-y-4 font-devanagari text-dharma-text ${className}`}>
      {/* 1. आधुनिक संदर्भ (Deep Modern Context) */}
      {parsed.contextText && (
        <section aria-label="आधुनिक संदर्भ" className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <Lightbulb className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>आधुनिक संदर्भ · Modern Context</span>
          </div>
          <div className="whitespace-pre-line text-sm md:text-base leading-relaxed sm:leading-loose text-dharma-text/95">
            {parsed.contextText}
          </div>
        </section>
      )}

      {/* 2. आज के जीवन में प्रयोग (Practical Application) */}
      {parsed.applicationText && (
        <section
          aria-label="आज के जीवन में प्रयोग"
          className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 sm:p-5 transition-colors hover:border-amber-500/40"
        >
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <Compass className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>आज के जीवन में प्रयोग · Practical Application</span>
          </div>
          <div className="whitespace-pre-line text-sm md:text-base leading-relaxed text-dharma-text/95 font-medium">
            {parsed.applicationText}
          </div>
        </section>
      )}

      {/* 3. चिंतन प्रश्न (Contemplation Question) */}
      {parsed.reflectionQuestion && (
        <section
          aria-label="चिंतन प्रश्न"
          className="rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent p-4 sm:p-5"
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            <HelpCircle className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>चिंतन प्रश्न · Self-Reflection</span>
          </div>
          <p className="font-serif text-sm md:text-base font-semibold italic text-dharma-text leading-relaxed">
            &ldquo;{parsed.reflectionQuestion}&rdquo;
          </p>
        </section>
      )}
    </div>
  );
}
