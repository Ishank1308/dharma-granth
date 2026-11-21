/**
 * जीवन सूत्र (the website's "For life" / Modern Context note) is written in light Markdown with up to three
 * sections. Mirrors parseModernContext in app/components/ModernContextBlock.tsx.
 */
export interface ModernContext {
  /** आधुनिक संदर्भ, or the whole text when it has no sections. */
  context: string;
  /** आज के जीवन में प्रयोग */
  application: string;
  /** चिंतन प्रश्न */
  question: string;
}

export function parseModernContext(text: string): ModernContext {
  const t = text.trim();
  if (!/###\s*(आधुनिक संदर्भ|आज के जीवन में प्रयोग|चिंतन प्रश्न)/.test(t)) return { context: t, application: '', question: '' };
  const context = t.match(/###\s*आधुनिक संदर्भ\s*([\s\S]*?)(?=###\s*आज के जीवन में प्रयोग|###\s*चिंतन प्रश्न|$)/)?.[1].trim() ?? '';
  const application = t.match(/###\s*आज के जीवन में प्रयोग\s*([\s\S]*?)(?=###\s*चिंतन प्रश्न|$)/)?.[1].trim() ?? '';
  const question = t.match(/###\s*चिंतन प्रश्न\s*([\s\S]*?)$/)?.[1].trim() ?? '';
  if (!context && !application && !question) return { context: t.replace(/^#+\s*/gm, ''), application: '', question: '' };
  return { context, application, question };
}

export type MarkdownBlock = { kind: 'p' | 'li'; parts: { text: string; bold: boolean }[] };

/** "- " bullets and **bold** lead-ins, so a phone shows steps as steps instead of "- **विषाद को पहचानें**:". */
export function lightMarkdown(text: string): MarkdownBlock[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const li = /^[-•*]\s+/.test(line);
      const body = li ? line.replace(/^[-•*]\s+/, '') : line.replace(/^#+\s*/, '');
      const parts = body
        .split(/(\*\*[^*]+\*\*)/g)
        .filter(Boolean)
        .map((p) => (p.startsWith('**') && p.endsWith('**') && p.length > 4 ? { text: p.slice(2, -2), bold: true } : { text: p, bold: false }));
      return { kind: li ? 'li' : 'p', parts };
    });
}
