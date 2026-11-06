'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  ChevronUp,
  ChevronDown,
  X,
  Radio,
  LocateFixed,
  Sparkles,
} from 'lucide-react';
import {
  subscribeSoundscape,
  toggleSoundscape,
  setSoundscapeVolume,
  toggleSoundscapeMute,
  setContinuousParayana,
  setRecitationSpeed,
  playSadhanaPlaylist,
  SOUNDSCAPE_TRACKS,
  type SoundscapeState,
} from '@/lib/sacred-soundscape';
import { triggerTactileFeedback } from '@/lib/haptics';

export function SacredAudioDock() {
  const [soundState, setSoundState] = useState<SoundscapeState | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasScrolledToVerse, setHasScrolledToVerse] = useState(false);
  const [hasMatchingVerseOnPage, setHasMatchingVerseOnPage] = useState(false);

  // Subscribe to central sacred soundscape state
  useEffect(() => {
    const unsub = subscribeSoundscape((st) => {
      setSoundState({ ...st });
      if (st.isPlaying) {
        setIsDismissed(false);
      }
    });
    return unsub;
  }, []);

  // Listen to live word recitation events
  useEffect(() => {
    const handleWord = (e: Event) => {
      const customEvent = e as CustomEvent<{ word?: string }>;
      if (customEvent.detail?.word) {
        setActiveWord(customEvent.detail.word);
      }
    };

    const handleChunk = (e: Event) => {
      const customEvent = e as CustomEvent<{ chunkIndex?: number | null }>;
      if (customEvent.detail?.chunkIndex === null) {
        setActiveWord(null);
      }
    };

    const handleEnd = () => {
      setActiveWord(null);
    };

    window.addEventListener('dharma:recitation-word', handleWord);
    window.addEventListener('dharma:recitation-chunk', handleChunk);
    window.addEventListener('dharma:recitation-ended', handleEnd);

    return () => {
      window.removeEventListener('dharma:recitation-word', handleWord);
      window.removeEventListener('dharma:recitation-chunk', handleChunk);
      window.removeEventListener('dharma:recitation-ended', handleEnd);
    };
  }, []);

  // Check if current verse exists in the DOM on current page
  useEffect(() => {
    if (!soundState?.currentVerseNumber) {
      setHasMatchingVerseOnPage(false);
      return;
    }
    const verseNum = String(soundState.currentVerseNumber);
    const el =
      document.getElementById(`verse-${verseNum}`) ||
      document.querySelector(`[data-verse-number="${verseNum}"]`);
    setHasMatchingVerseOnPage(Boolean(el));
    setHasScrolledToVerse(false);
  }, [soundState?.currentVerseNumber]);

  const handleTogglePlay = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    toggleSoundscape();
  }, []);

  const handlePrev = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    if (soundState?.playlistId && soundState.playlistIndex != null && soundState.playlistIndex > 0) {
      playSadhanaPlaylist(soundState.playlistId, soundState.playlistIndex - 1);
    } else {
      window.dispatchEvent(new CustomEvent('dharma:verse-prev'));
    }
  }, [soundState]);

  const handleNext = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    if (
      soundState?.playlistId &&
      soundState.playlistIndex != null &&
      soundState.playlistTotal != null &&
      soundState.playlistIndex + 1 < soundState.playlistTotal
    ) {
      playSadhanaPlaylist(soundState.playlistId, soundState.playlistIndex + 1);
    } else {
      window.dispatchEvent(new CustomEvent('dharma:verse-next'));
    }
  }, [soundState]);

  const handleToggleContinuous = useCallback(() => {
    if (!soundState) return;
    const nextVal = !soundState.continuousParayana;
    triggerTactileFeedback('selection', 'softTap');
    setContinuousParayana(nextVal);
  }, [soundState]);

  const handleToggleMute = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    toggleSoundscapeMute();
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSoundscapeVolume(val);
  }, []);

  const handleScrollToCurrentVerse = useCallback(() => {
    if (!soundState?.currentVerseNumber) return;
    const verseNum = String(soundState.currentVerseNumber);
    const el =
      document.getElementById(`verse-${verseNum}`) ||
      document.querySelector(`[data-verse-number="${verseNum}"]`);
    if (el) {
      triggerTactileFeedback('selection', 'softTap');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHasScrolledToVerse(true);
      el.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2');
      }, 2400);
    }
  }, [soundState?.currentVerseNumber]);

  const handleSpeedSelect = useCallback((speed: number) => {
    triggerTactileFeedback('selection', 'softTap');
    setRecitationSpeed(speed);
  }, []);

  const handleDismiss = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    setIsDismissed(true);
  }, []);

  if (!soundState || isDismissed) return null;

  // Show dock when playing, or when recitation context is active
  const shouldShow = soundState.isPlaying || Boolean(soundState.currentVerseSanskrit);
  if (!shouldShow) return null;

  const trackDef = SOUNDSCAPE_TRACKS.find((t) => t.id === soundState.activeTrack);
  const isRecitation = soundState.activeTrack === 'recitation' || Boolean(soundState.currentVerseReference);
  const title = soundState.currentVerseReference || trackDef?.hindiTitle || 'वैदिक नाद';
  const subtitle = isRecitation ? trackDef?.hindiTitle || 'संस्कृत पाठ' : trackDef?.subtitle || '432Hz Drone';
  const isStudioAudio = soundState.audioSource === 'neural';

  return (
    <AnimatePresence>
      <motion.aside
        role="region"
        aria-label="Sacred Audio Player Dock"
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl select-none"
      >
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-stone-950/85 dark:bg-stone-900/90 text-stone-100 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(217,119,6,0.15)] transition-all">
          {/* Subtle golden ambient glow line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

          {/* Main Control Strip */}
          <div className="flex items-center justify-between gap-2 p-3 sm:p-3.5">
            {/* Left: Track Info & Studio Badge */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                  soundState.isPlaying
                    ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 shadow-md shadow-amber-500/25'
                    : 'bg-stone-800 text-amber-400'
                }`}
              >
                {soundState.isPlaying ? (
                  <Radio className="h-5 w-5 animate-pulse" />
                ) : (
                  <span className="font-serif text-lg font-bold">ॐ</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="truncate text-xs sm:text-sm font-semibold tracking-wide text-stone-100">
                    {title}
                  </span>
                  {soundState.playlistId && soundState.playlistTotal && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/25 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-400/50">
                      स्वाध्याय {(soundState.playlistIndex || 0) + 1}/{soundState.playlistTotal}
                    </span>
                  )}
                  {isStudioAudio && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/25 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 ring-1 ring-amber-400/50">
                      <Sparkles className="h-2.5 w-2.5" />
                      Studio
                    </span>
                  )}
                </div>

                <div className="truncate text-[11px] text-stone-400">
                  {activeWord ? (
                    <span className="font-semibold text-amber-300 transition-colors animate-pulse">
                      {activeWord}
                    </span>
                  ) : (
                    <span>{subtitle}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Audio Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Jump to Verse on current page */}
              {hasMatchingVerseOnPage && (
                <button
                  type="button"
                  onClick={handleScrollToCurrentVerse}
                  title="वर्तमान श्लोक पर जाएँ (Jump to Verse)"
                  aria-label="Scroll to active verse on page"
                  className={`hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-xl text-stone-300 hover:bg-stone-800 hover:text-amber-300 active:scale-95 transition ${
                    hasScrolledToVerse ? 'text-amber-400 bg-amber-500/20' : ''
                  }`}
                >
                  <LocateFixed className="h-4 w-4" />
                </button>
              )}

              {/* Prev Verse */}
              {isRecitation && (
                <button
                  type="button"
                  onClick={handlePrev}
                  title="पिछला श्लोक (Previous Verse)"
                  aria-label="Previous verse"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-300 hover:bg-stone-800 hover:text-amber-300 active:scale-95 transition"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
              )}

              {/* Central Play/Pause Button */}
              <button
                type="button"
                onClick={handleTogglePlay}
                title={soundState.isPlaying ? 'विराम (Pause)' : 'आरम्भ (Play)'}
                aria-label={soundState.isPlaying ? 'Pause recitation' : 'Play recitation'}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition"
              >
                {soundState.isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Next Verse */}
              {isRecitation && (
                <button
                  type="button"
                  onClick={handleNext}
                  title="अगला श्लोक (Next Verse)"
                  aria-label="Next verse"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-300 hover:bg-stone-800 hover:text-amber-300 active:scale-95 transition"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              )}

              {/* Continuous Parayana Auto-Advance Toggle */}
              <button
                type="button"
                onClick={handleToggleContinuous}
                title={`निरंतर पाठ (Continuous Pārāyaṇa): ${soundState.continuousParayana ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}`}
                aria-label="Toggle continuous recitation"
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition active:scale-95 ${
                  soundState.continuousParayana
                    ? 'bg-amber-500/25 text-amber-300 ring-1 ring-amber-400/60'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <Repeat className="h-4 w-4" />
              </button>

              {/* Expand / Collapse Options */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'कम विकल्प' : 'अधिक विकल्प (Volume & Speed)'}
                aria-label="Toggle audio settings drawer"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-800 hover:text-stone-200 active:scale-95 transition"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>

              {/* Dismiss Dock */}
              <button
                type="button"
                onClick={handleDismiss}
                title="बंद करें (Dismiss Dock)"
                aria-label="Dismiss audio dock"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Expanded Drawer (Volume & Speed Controls) */}
          {isExpanded && (
            <div className="border-t border-stone-800 bg-stone-900/90 p-3 pt-2.5 space-y-3 text-xs">
              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  title={soundState.isMuted ? 'ध्वनि चालू करें (Unmute)' : 'ध्वनि बंद करें (Mute)'}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-stone-300 hover:text-amber-300 transition"
                >
                  {soundState.isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>

                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundState.isMuted ? 0 : soundState.volume}
                    onChange={handleVolumeChange}
                    aria-label="Audio Volume Slider"
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
                  />
                  <span className="w-8 text-right font-mono text-[11px] text-stone-400">
                    {Math.round((soundState.isMuted ? 0 : soundState.volume) * 100)}%
                  </span>
                </div>
              </div>

              {/* Cadence Speed Selectors */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-800/80">
                <span className="text-stone-400 font-medium">पाठ गति (Recitation Speed):</span>
                <div className="flex items-center gap-1.5">
                  {[0.8, 1.0, 1.2].map((spd) => {
                    const currentRate = soundState.audioPlaybackRate || 1.0;
                    const isSelected = Math.abs(currentRate - spd) < 0.05;
                    return (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => handleSpeedSelect(spd)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold shadow'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        {spd.toFixed(1)}x
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
