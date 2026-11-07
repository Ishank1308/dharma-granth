import { ORIGINAL_ONLY_NOTICE_EN, ORIGINAL_ONLY_NOTICE_HI } from '@/lib/verse-meaning';

/** Above a chapter or part that has only the original text so far. */
export function OriginalOnlyNotice({ part = false }: { part?: boolean }) {
  const noticeHi = part
    ? 'मूल पाठ — इस भाग का हिन्दी/अंग्रेज़ी अर्थ अभी उपलब्ध नहीं है; शीघ्र जोड़ा जाएगा।'
    : ORIGINAL_ONLY_NOTICE_HI;
  const noticeEn = part
    ? 'Original text only: a Hindi or English meaning for this part has not been added yet.'
    : ORIGINAL_ONLY_NOTICE_EN;
  return (
    <div className="border-b border-dharma-border bg-dharma-card">
      <p className="mx-auto max-w-5xl px-5 py-2 text-xs text-dharma-muted sm:px-6 sm:text-sm" role="note">
        <span lang="hi" className="font-devanagari">{noticeHi}</span>{' '}
        <span lang="en">{noticeEn}</span>
      </p>
    </div>
  );
}
