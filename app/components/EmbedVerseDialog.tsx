'use client';

import { useMemo, useRef, useState } from 'react';
import { Code2, Copy } from 'lucide-react';
import { ReaderDialog } from '@/app/components/reader/ReaderDialog';
import { verseEmbedHtml, type EmbedMeaning } from '@/lib/embed';

/**
 * "Embed this verse": pick the meaning, preview, and copy the HTML quote
 * (lib/embed.ts). Shared by the verse reader and the Verse of the Day.
 */
export function EmbedVerseDialog({
  open,
  onClose,
  label,
  url,
  sanskrit,
  hindi,
  english,
  onNotice,
}: {
  open: boolean;
  onClose: () => void;
  /** "Bhagavad Gita 2.47" */
  label: string;
  /** Absolute URL of the verse page, used for the credit link. */
  url: string;
  sanskrit?: string;
  hindi?: string;
  english?: string;
  /** Shows a short message (e.g. a toast) after copying. */
  onNotice?: (message: string) => void;
}) {
  const [meaning, setMeaning] = useState<EmbedMeaning>(hindi ? 'hindi' : english ? 'english' : 'none');
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const html = useMemo(
    () => verseEmbedHtml({ reference: label, sanskrit, hindi, english, url, meaning }),
    [label, sanskrit, hindi, english, url, meaning],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      onNotice?.('Embed code copied');
    } catch {
      codeRef.current?.select();
      onNotice?.('Press Ctrl+C (or Cmd+C) to copy the selected code.');
    }
  };

  return (
    <ReaderDialog
      open={open}
      onClose={onClose}
      title="Embed this verse"
      titleHi="श्लोक एम्बेड करें"
      icon={<Code2 className="h-5 w-5 text-saffron-700 dark:text-saffron-300" aria-hidden="true" />}
    >
      <p className="mb-4 text-sm text-dharma-muted">
        Paste this into your website or blog. It is plain HTML with a link back to {label} on Dharma Granth, with no script and no tracking.
      </p>
      <label htmlFor="embed-meaning" className="mb-1 block text-sm font-semibold text-dharma-text">Meaning to include</label>
      <select
        id="embed-meaning"
        value={meaning}
        onChange={(e) => setMeaning(e.target.value as EmbedMeaning)}
        className="mb-4 min-h-[48px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-base text-dharma-text"
      >
        <option value="hindi" disabled={!hindi}>Hindi</option>
        <option value="english" disabled={!english}>English</option>
        <option value="none">Sanskrit only</option>
      </select>
      <p className="mb-1 text-sm font-semibold text-dharma-text">Preview</p>
      <div
        className="mb-4 overflow-x-auto rounded-xl border border-dharma-border bg-white p-2 text-stone-900"
        // The embed HTML escapes all verse text (lib/embed.ts), so this renders data, not markup.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <label htmlFor="embed-code" className="mb-1 block text-sm font-semibold text-dharma-text">HTML code</label>
      <textarea
        id="embed-code"
        ref={codeRef}
        readOnly
        value={html}
        rows={6}
        onFocus={(e) => e.currentTarget.select()}
        className="mb-4 w-full resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 font-mono text-xs text-dharma-text"
      />
      <button
        type="button"
        onClick={copy}
        className="focus-ring inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800"
      >
        <Copy className="h-4 w-4" aria-hidden="true" /> Copy embed code
      </button>
    </ReaderDialog>
  );
}
