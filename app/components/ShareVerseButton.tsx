'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEverTrue } from '@/lib/use-ever-true';

// Loaded the first time it opens, so the dialog stays out of the page's first-load JS.
const PatrikaShareStudioModal = dynamic(
  () => import('@/app/components/share/PatrikaShareStudioModal').then((m) => m.PatrikaShareStudioModal),
  { ssr: false },
);
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  scriptureTitle: string;
  chapterTitle?: string;
  verseLabel: string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  coreShift?: string;
  compact?: boolean;
  verseUrl?: string;
}

/**
 * Universal Verse Share Button & Aesthetic Patrikā Quote Studio trigger.
 * Provides 9:16 Story/Wallpaper, 4:5 Portrait, and 1:1 Square Retina exports,
 * with 4 editorial templates and full layer toggles.
 */
export function ShareVerseButton(props: Props) {
  const {
    scriptureTitle,
    chapterTitle,
    verseLabel,
    sanskrit = '',
    transliteration,
    hindi,
    translation,
    coreShift,
    compact = false,
    verseUrl,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const studioLoaded = useEverTrue(isOpen);

  const currentUrl =
    verseUrl ||
    (typeof window !== 'undefined'
      ? window.location.href.split('#')[0]
      : 'https://dharmagranth.dev');

  const handleOpen = () => {
    triggerTactileFeedback('selection', 'softTap');
    setIsOpen(true);
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={handleOpen}
          className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border/70 bg-dharma-bg px-3.5 py-2 text-xs font-medium text-dharma-text-secondary transition hover:border-dharma-saffron/60 hover:bg-saffron-500/10 hover:text-saffron-800 dark:hover:text-saffron-300 cursor-pointer"
          aria-label="पत्रिका साझा करें (Share Quote Card)"
          title="पत्रिका कोट स्टूडियो (9:16, 4:5, 1:1)"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span lang="hi" className="font-devanagari">साझा करें</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="focus-ring inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border/70 bg-dharma-card/85 text-dharma-text-secondary backdrop-blur transition hover:border-dharma-saffron/60 hover:text-saffron-800 dark:hover:text-saffron-300 shadow-2xs cursor-pointer"
          aria-label="पत्रिका साझा करें (Share Quote Card)"
          title="पत्रिका कोट स्टूडियो (9:16, 4:5, 1:1)"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      {studioLoaded && (
      <PatrikaShareStudioModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={{
          scriptureTitle,
          chapterTitle,
          reference: chapterTitle ? `${chapterTitle} · श्लोक ${verseLabel}` : `श्लोक ${verseLabel}`,
          sanskrit,
          transliteration,
          hindi,
          translation,
          coreShift,
          url: currentUrl,
        }}
      />
      )}
    </>
  );
}
