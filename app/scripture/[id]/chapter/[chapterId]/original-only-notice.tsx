import { ORIGINAL_ONLY_NOTICE_EN, ORIGINAL_ONLY_NOTICE_HI } from '@/lib/verse-meaning';

/** Above a chapter that has only the original text so far (see chapterHasMeaning). */
export function OriginalOnlyNotice() {
  return (
    <div className="border-b border-dharma-border bg-dharma-card">
      <p className="mx-auto max-w-5xl px-5 py-2 text-xs text-dharma-muted sm:px-6 sm:text-sm" role="note">
        <span lang="hi" className="font-devanagari">{ORIGINAL_ONLY_NOTICE_HI}</span>{' '}
        <span lang="en">{ORIGINAL_ONLY_NOTICE_EN}</span>
      </p>
    </div>
  );
}
