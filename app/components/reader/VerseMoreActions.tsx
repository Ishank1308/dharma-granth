'use client';

import Link from 'next/link';
import { BookOpen, Code2, Download } from 'lucide-react';
import { LITE_COMPAT } from './verse-rail-styles';

const actionBtn =
  `focus-ring inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-full border border-stone-300/60 dark:border-stone-700/80 bg-dharma-card/90 px-4 text-subhead text-dharma-text transition hover:border-amber-600/50 hover:bg-stone-100/80 dark:hover:bg-stone-800/60 ${LITE_COMPAT}`;

export function VerseMoreActions({
  visible,
  chapterHref,
  verseNumber,
  onDownloadImage,
  onOpenEmbed,
  onDownload,
}: {
  visible: boolean;
  chapterHref: string;
  verseNumber: number | string;
  onDownloadImage: () => void;
  onOpenEmbed: () => void;
  onDownload: () => void;
}) {
  return (
    <div
      id="verse-more-actions"
      role="toolbar"
      aria-label="More verse actions"
      hidden={!visible}
      data-focus-hide
      className={`mt-2 flex-wrap gap-2 ${visible ? 'flex' : 'hidden'}`}
    >
      <Link href={`${chapterHref.endsWith('/') ? chapterHref : `${chapterHref}/`}#verse-${verseNumber}`} className={actionBtn}>
        <BookOpen className="h-4 w-4" aria-hidden="true" /> Full chapter context
      </Link>
      <button type="button" onClick={onDownloadImage} className={actionBtn} aria-label="Download Image">
        <Download className="h-4 w-4" aria-hidden="true" /> Download Image
      </button>
      <button type="button" onClick={onOpenEmbed} aria-haspopup="dialog" className={actionBtn}>
        <Code2 className="h-4 w-4" aria-hidden="true" /> Embed
      </button>
      <button type="button" onClick={onDownload} className={actionBtn}>
        <Download className="h-4 w-4" aria-hidden="true" /> Download
      </button>
    </div>
  );
}
