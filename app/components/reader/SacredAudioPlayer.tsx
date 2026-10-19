'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  Wind,
  Bell,
  Waves,
  X,
  ChevronUp,
  ChevronDown,
  Radio,
  Timer,
} from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import {
  SOUNDSCAPE_TRACKS,
  type SoundscapeTrackId,
  type SoundscapeState,
  subscribeSoundscape,
  toggleSoundscape,
  setSoundscapeTrack,
  setSoundscapeVolume,
  toggleSoundscapeMute,
  setSoundscapeBowlInterval,
  chimeSingingBowl,
  setCurrentVerseContext,
  getSoundscapeState,
} from '@/lib/sacred-soundscape';

const TRACK_ICONS: Record<SoundscapeTrackId, React.ComponentType<{ className?: string }>> = {
  tanpura: Music,
  om: Wind,
  flute: Waves,
  temple_bell: Bell,
  recitation: Sparkles,
};

const INTERVAL_OPTIONS = [
  { label: 'बंद', seconds: 0 },
  { label: '1 मि.', seconds: 60 },
  { label: '3 मि.', seconds: 180 },
  { label: '5 मि.', seconds: 300 },
];

interface SacredAudioPlayerProps {
  currentVerseSanskrit?: string;
  reference?: string;
}

export function SacredAudioPlayer({ currentVerseSanskrit, reference }: SacredAudioPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundState, setSoundState] = useState<SoundscapeState>(getSoundscapeState);

  // Sync with persistent soundscape engine singleton
  useEffect(() => {
    const unsubscribe = subscribeSoundscape((newState) => {
      setSoundState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Update current verse context if passed
  useEffect(() => {
    if (currentVerseSanskrit || reference) {
      setCurrentVerseContext(currentVerseSanskrit, reference);
    }
  }, [currentVerseSanskrit, reference]);

  const handleTogglePlay = () => {
    triggerTactileFeedback('selection', 'click');
    toggleSoundscape();
  };

  const handleTrackSelect = (trackId: SoundscapeTrackId) => {
    triggerTactileFeedback('selection', 'softTap');
    setSoundscapeTrack(trackId);
  };

  const handleVolumeChange = (newVol: number) => {
    setSoundscapeVolume(newVol);
  };

  const handleMuteToggle = () => {
    triggerTactileFeedback('selection', 'softTap');
    toggleSoundscapeMute();
  };

  const handleIntervalSelect = (seconds: number) => {
    triggerTactileFeedback('selection', 'softTap');
    setSoundscapeBowlInterval(seconds);
  };

  const handleManualChime = () => {
    triggerTactileFeedback('celestial', 'templeChime');
    chimeSingingBowl(432);
  };

  const currentTrackMeta =
    SOUNDSCAPE_TRACKS.find((t) => t.id === soundState.activeTrack) || SOUNDSCAPE_TRACKS[0];

  return (
    <>
      {/* Floating Sacred Audio Pill & Modal */}
      <aside aria-label="Sacred audio contemplation player" className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="mb-3 w-80 sm:w-96 rounded-3xl border border-amber-300/40 bg-stone-900/95 p-5 shadow-2xl backdrop-blur-2xl text-stone-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-500/20 text-saffron-300">
                    <Radio className="h-4 w-4 animate-pulse" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-amber-100">नादानुसन्धान · Sacred Sound</h3>
                    <p className="text-2xs text-stone-400">432Hz Drone & Mindfulness Bells</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition"
                  aria-label="Close sound panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Soundscape Selector List */}
              <div className="my-3 space-y-1.5">
                {SOUNDSCAPE_TRACKS.map((item) => {
                  const Icon = TRACK_ICONS[item.id] || Music;
                  const isCur = soundState.activeTrack === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTrackSelect(item.id)}
                      className={`flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition ${
                        isCur
                          ? 'border border-amber-400/50 bg-amber-500/15 text-amber-200 shadow-inner'
                          : 'border border-transparent hover:bg-stone-800/60 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${
                            isCur
                              ? 'bg-amber-400 text-stone-950 font-bold'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold">
                            {item.hindiTitle} <span className="opacity-75">· {item.title}</span>
                          </p>
                          <p className="text-2xs text-stone-400">{item.subtitle}</p>
                        </div>
                      </div>
                      {isCur && soundState.isPlaying && (
                        <span className="flex items-center gap-0.5">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ scaleY: [0.3, 1.2, 0.3] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              className="h-3.5 w-1 rounded-full bg-amber-400"
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Periodic Singing Bowl / Mindfulness Bell Selector */}
              <div className="my-3 rounded-2xl bg-stone-950/50 p-3 border border-stone-800/70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-semibold text-stone-300">
                      ध्यान घंटा (Mindfulness Bell)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualChime}
                    className="flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 transition"
                    title="घंटे की ध्वनि बजाएँ"
                  >
                    <Bell className="h-3 w-3" />
                    बजाएँ
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {INTERVAL_OPTIONS.map((opt) => {
                    const isSel = soundState.bowlIntervalSeconds === opt.seconds;
                    return (
                      <button
                        key={opt.seconds}
                        type="button"
                        onClick={() => handleIntervalSelect(opt.seconds)}
                        className={`py-1 rounded-xl text-2xs font-semibold transition ${
                          isSel
                            ? 'bg-amber-400 text-stone-950 shadow-sm'
                            : 'bg-stone-800/70 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume Slider & Controls */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-950/60 p-3 border border-stone-800/80">
                <button
                  type="button"
                  onClick={handleMuteToggle}
                  className="text-stone-400 hover:text-stone-200 transition"
                  aria-label={soundState.isMuted ? 'Unmute' : 'Mute'}
                >
                  {soundState.isMuted || soundState.volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-amber-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundState.isMuted ? 0 : soundState.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-amber-400 bg-stone-800 rounded-lg"
                  aria-label="Volume slider"
                />
                <span className="text-2xs font-mono text-stone-400 w-8 text-right">
                  {Math.round((soundState.isMuted ? 0 : soundState.volume) * 100)}%
                </span>
              </div>

              {(reference || soundState.currentVerseReference) && (
                <p className="mt-3 text-center text-2xs text-stone-400 truncate">
                  Now playing with {reference || soundState.currentVerseReference}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Docked Bar */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-3 rounded-full border border-amber-300/40 bg-stone-900/90 py-2 px-3 shadow-2xl backdrop-blur-xl transition hover:border-amber-300"
        >
          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-md transition hover:brightness-110 active:scale-95"
            aria-label={soundState.isPlaying ? 'Pause sacred sound' : 'Play sacred sound'}
          >
            {soundState.isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Track Info & Popout Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-left"
          >
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-amber-100 leading-tight">
                {currentTrackMeta.hindiTitle}
              </p>
              <p className="text-2xs text-stone-400">
                {soundState.isPlaying ? '432Hz Drone Active' : 'Tap to open sound'}
              </p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 hover:text-stone-200">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </div>
          </button>
        </motion.div>
      </aside>
    </>
  );
}
