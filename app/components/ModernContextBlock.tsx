import React from 'react';

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

/** `**bold**` inside a line becomes <strong>; everything else stays plain text. */
function renderInline(line: string): React.ReactNode[] {
  return line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={i} className="font-semibold text-dharma-text">{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

/**
 * The commentary is written in light Markdown: "- " bullets and **bold** lead-ins.
 * Bullets become a real list and the asterisks go, so a phone shows the three
 * steps as steps instead of "- **विषाद को पहचानें**:".
 */
function LightMarkdown({ text, className = '' }: { text: string; className?: string }) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const isBullet = (l: string) => /^[-•*]\s+/.test(l);
  if (!lines.some(isBullet) && !text.includes('**')) {
    return <div className={`whitespace-pre-line ${className}`}>{text}</div>;
  }
  const blocks: React.ReactNode[] = [];
  let items: string[] = [];
  const flush = () => {
    if (items.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc space-y-1.5 pl-4 marker:text-dharma-muted">
        {items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
      </ul>,
    );
    items = [];
  };
  for (const line of lines) {
    if (isBullet(line)) {
      items.push(line.replace(/^[-•*]\s+/, ''));
    } else {
      flush();
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line)}</p>);
    }
  }
  flush();
  return <div className={`space-y-2 ${className}`}>{blocks}</div>;
}

/**
 * Modern Context alone (context + application, or the raw text when the lesson
 * is unstructured). Rendered inside the Modern Context step of the sacred
 * reading flow; the reflection question gets its own Reflection step.
 */
export function ModernContextBody({
  parsed,
  lang = 'hi',
  className = '',
  hideContextHeading = false,
}: {
  parsed: ParsedModernContext;
  lang?: string;
  className?: string;
  /** The caller's own heading already says आधुनिक संदर्भ; don't print it twice. */
  hideContextHeading?: boolean;
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
    <div className={`space-y-4 font-devanagari text-dharma-text ${className}`}>
      {/* 1. आधुनिक संदर्भ (Deep Modern Context) */}
      {parsed.contextText && (
        <section aria-label="आधुनिक संदर्भ" className="space-y-2">
          {!hideContextHeading && (
            <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
              आधुनिक संदर्भ · Modern Context
            </p>
          )}
          <LightMarkdown
            text={parsed.contextText}
            className="text-sm md:text-base leading-relaxed sm:leading-loose text-dharma-text/95"
          />
        </section>
      )}

      {/* 2. आज के जीवन में प्रयोग (Practical Application) */}
      {parsed.applicationText && (
        <section
          aria-label="आज के जीवन में प्रयोग"
          className="rounded-xl border border-dharma-border bg-dharma-card-soft p-3 sm:p-5"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dharma-muted">
            आज के जीवन में प्रयोग · Practical Application
          </p>
          <LightMarkdown
            text={parsed.applicationText}
            className="text-sm md:text-base leading-relaxed text-dharma-text/95"
          />
        </section>
      )}
    </div>
  );
}

/**
 * The चिंतन प्रश्न as its own calm Reflection step — dharma tokens only, no
 * gradient wash. Quoted so it reads as a question to sit with, not a label.
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
    <figure className={`border-l-2 border-saffron-500 pl-4 dark:border-saffron-400 ${className}`}>
      <blockquote
        lang={lang}
        className={`font-serif text-base font-semibold italic leading-relaxed text-dharma-text md:text-lg ${lang === 'hi' ? 'font-devanagari not-italic font-medium' : ''}`}
      >
        &ldquo;{question.trim()}&rdquo;
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
