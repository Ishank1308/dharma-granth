'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Headphones,
  SlidersHorizontal,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { speakSanskritShloka, stopSanskritSpeech, isSpeakingSanskrit } from '@/lib/sacred-audio';
import { triggerTactileFeedback } from '@/lib/haptics';
import { READING_DEPTHS, useReadingDepth } from '@/lib/reading-depth';

export interface MobileOneThumbControlBarProps {
  currentVerseNumber: number | string;
  totalVerses: number;
  currentVerseSanskrit?: string;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  activeLayers: {
    translit: boolean;
    hindi: boolean;
    english: boolean;
    commentary: boolean;
  };
  onToggleLayer: (layer: 'translit' | 'hindi' | 'english' | 'commentary') => void;
}

export function MobileOneThumbControlBar({
  currentVerseNumber,
  totalVerses,
  currentVerseSanskrit,
  onPrevVerse,
  onNextVerse,
  activeLayers,
  onToggleLayer,
}: MobileOneThumbControlBarProps) {
  const [depth, setDepth] = useReadingDepth();
  const [isVisible, setIsVisible] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide on fast downward scroll, reveal on upward scroll or pause
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;

      if (deltaY > 12 && currentScrollY > 100) {
        // Fast scroll down -> hide
        setIsVisible(false);
        setShowLevelMenu(false);
        setShowLangMenu(false);
      } else if (deltaY < -8) {
        // Scroll up -> reveal
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Reveal on scroll pause
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleToggleAudio = () => {
    triggerTactileFeedback('medium', 'softTap');
    if (isPlayingAudio || isSpeakingSanskrit()) {
      stopSanskritSpeech();
      setIsPlayingAudio(false);
    } else {
      if (!currentVerseSanskrit) return;
      const success = speakSanskritShloka(
        currentVerseSanskrit,
        0.82,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
      if (success) {
        setIsPlayingAudio(true);
      }
    }
  };

  const currentLevelLabel = READING_DEPTHS.find((d) => d.id === depth)?.hi ?? 'समझें';

  return (
    <div
      role="toolbar"
      aria-label="एक-अंगूठा पाठक नियंत्रण (One-Thumb Reader Controls)"
      className={`fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] left-3 right-3 sm:hidden z-30 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      {/* Popover Menu: Spiritual Level Selector */}
      {showLevelMenu && (
        <div className="absolute bottom-full mb-2 left-0 right-0 rounded-2xl border border-dharma-border bg-dharma-card p-3 shadow-2xl backdrop-blur-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted mb-2 px-1">
            पठन गहराई (Reading depth)
          </p>
          <div className="space-y-1">
            {READING_DEPTHS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  setDepth(lvl.id);
                  setShowLevelMenu(false);
                  triggerTactileFeedback('selection', 'softTap');
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${
                  depth === lvl.id
                    ? 'bg-saffron-50 text-saffron-800 font-bold border border-saffron-200 dark:bg-saffron-950/40 dark:text-saffron-300'
                    : 'text-dharma-text hover:bg-dharma-bg'
                }`}
              >
                <div>
                  <span className="font-semibold block">{lvl.hi} · {lvl.en}</span>
                  <span className="text-[10px] text-dharma-muted">{lvl.hint}</span>
                </div>
                {depth === lvl.id && (
                  <span className="h-2 w-2 rounded-full bg-saffron-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popover Menu: Language & Layers Selector */}
      {showLangMenu && (
        <div className="absolute bottom-full mb-2 left-0 right-0 rounded-2xl border border-dharma-border bg-dharma-card p-3 shadow-2xl backdrop-blur-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted mb-2 px-1">
            भाषा व सामग्री (Reader Layers)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                onToggleLayer('hindi');
                triggerTactileFeedback('selection', 'softTap');
              }}
              className={`p-2.5 rounded-xl border text-center font-medium transition ${
                activeLayers.hindi
                  ? 'border-saffron-300 bg-saffron-50 text-saffron-800 font-bold dark:bg-saffron-950/40 dark:text-saffron-300'
                  : 'border-dharma-border text-dharma-muted hover:bg-dharma-bg'
              }`}
            >
              हिन्दी अर्थ
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleLayer('english');
                triggerTactileFeedback('selection', 'softTap');
              }}
              className={`p-2.5 rounded-xl border text-center font-medium transition ${
                activeLayers.english
                  ? 'border-saffron-300 bg-saffron-50 text-saffron-800 font-bold dark:bg-saffron-950/40 dark:text-saffron-300'
                  : 'border-dharma-border text-dharma-muted hover:bg-dharma-bg'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleLayer('translit');
                triggerTactileFeedback('selection', 'softTap');
              }}
              className={`p-2.5 rounded-xl border text-center font-medium transition ${
                activeLayers.translit
                  ? 'border-saffron-300 bg-saffron-50 text-saffron-800 font-bold dark:bg-saffron-950/40 dark:text-saffron-300'
                  : 'border-dharma-border text-dharma-muted hover:bg-dharma-bg'
              }`}
            >
              लिप्यंतरण (IAST)
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleLayer('commentary');
                triggerTactileFeedback('selection', 'softTap');
              }}
              className={`p-2.5 rounded-xl border text-center font-medium transition ${
                activeLayers.commentary
                  ? 'border-saffron-300 bg-saffron-50 text-saffron-800 font-bold dark:bg-saffron-950/40 dark:text-saffron-300'
                  : 'border-dharma-border text-dharma-muted hover:bg-dharma-bg'
              }`}
            >
              विस्तृत व्याख्या
            </button>
          </div>
        </div>
      )}

      {/* The Floating Thumb Bar with >=44px touch targets */}
      <div className="flex items-center justify-between gap-1 p-1.5 rounded-2xl border border-dharma-border/90 bg-dharma-card/95 backdrop-blur-md shadow-2xl">
        {/* Previous Verse Button (>=44px) */}
        <button
          type="button"
          onClick={() => {
            onPrevVerse();
            triggerTactileFeedback('light', 'softTap');
          }}
          aria-label="पिछला श्लोक (Previous verse)"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-dharma-text hover:bg-dharma-bg transition active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Audio Recitation Button (>=44px) */}
        <button
          type="button"
          onClick={handleToggleAudio}
          aria-label={isPlayingAudio ? 'उच्चारण रोकें (Stop audio)' : 'पारायण / उच्चारण सुनें (Play shloka audio)'}
          className={`min-h-[44px] flex-1 flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-bold transition active:scale-95 ${
            isPlayingAudio
              ? 'bg-saffron-600 text-white shadow-md animate-pulse'
              : 'bg-saffron-50 text-saffron-800 border border-saffron-200/80 dark:bg-saffron-950/40 dark:text-saffron-300'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Square className="h-4 w-4 fill-white" />
              <span>विराम</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-saffron-600 dark:text-saffron-400" />
              <span className="truncate">पारायण</span>
            </>
          )}
        </button>

        {/* Next Verse Button (>=44px) */}
        <button
          type="button"
          onClick={() => {
            onNextVerse();
            triggerTactileFeedback('light', 'softTap');
          }}
          aria-label="अगला श्लोक (Next verse)"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-dharma-text hover:bg-dharma-bg transition active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-dharma-border my-auto" />

        {/* Depth / Spiritual Level Toggle (>=44px) */}
        <button
          type="button"
          onClick={() => {
            setShowLevelMenu((prev) => !prev);
            setShowLangMenu(false);
            triggerTactileFeedback('selection', 'softTap');
          }}
          aria-label="पठन गहराई चुनें (Reading depth)"
          aria-expanded={showLevelMenu}
          className={`min-h-[44px] px-2.5 flex items-center gap-1 rounded-xl text-xs font-semibold transition active:scale-95 ${
            showLevelMenu
              ? 'bg-dharma-bg text-saffron-700 font-bold'
              : 'text-dharma-text hover:bg-dharma-bg'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-saffron-600" />
          <span className="text-[11px] truncate max-w-[55px]">{currentLevelLabel}</span>
        </button>

        {/* Language & Layers Toggle (>=44px) */}
        <button
          type="button"
          onClick={() => {
            setShowLangMenu((prev) => !prev);
            setShowLevelMenu(false);
            triggerTactileFeedback('selection', 'softTap');
          }}
          aria-label="भाषा एवं दृश्य विकल्प"
          aria-expanded={showLangMenu}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition active:scale-95 ${
            showLangMenu
              ? 'bg-dharma-bg text-saffron-700'
              : 'text-dharma-text hover:bg-dharma-bg'
          }`}
        >
          <Globe className="h-4 w-4 text-saffron-600" />
        </button>
      </div>
    </div>
  );
}
