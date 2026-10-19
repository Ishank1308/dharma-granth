'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Music,
  Wind,
  Bell,
  Waves,
  X,
  ChevronUp,
  ChevronDown,
  Repeat,
  Radio,
} from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

export type SoundscapeType = 'tanpura' | 'om' | 'flute' | 'temple_bell' | 'recitation';

interface SoundscapeTrack {
  id: SoundscapeType;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  baseFreq: number;
}

const SOUNDSCAPES: SoundscapeTrack[] = [
  {
    id: 'tanpura',
    title: 'Vedic Tanpura Drone',
    subtitle: 'Pure Sa-Pa Harmonics (432Hz)',
    icon: Music,
    baseFreq: 136.1, // Sacred Om frequency
  },
  {
    id: 'om',
    title: 'Pranava Om Resonance',
    subtitle: 'Deep Meditative Chanting',
    icon: Wind,
    baseFreq: 108.0,
  },
  {
    id: 'flute',
    title: 'Brindavan Flute Harmony',
    subtitle: 'Contemplative Bansuri Tones',
    icon: Waves,
    baseFreq: 216.0,
  },
  {
    id: 'temple_bell',
    title: 'Sacred Temple Bell',
    subtitle: 'Pure Tibetan & Indian Bell Chimes',
    icon: Bell,
    baseFreq: 432.0,
  },
  {
    id: 'recitation',
    title: 'Sanskrit Verse Audio',
    subtitle: 'Devanagari Chanted Cadence',
    icon: Sparkles,
    baseFreq: 160.0,
  },
];

interface SacredAudioPlayerProps {
  currentVerseSanskrit?: string;
  reference?: string;
}

export function SacredAudioPlayer({ currentVerseSanskrit, reference }: SacredAudioPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SoundscapeType>('tanpura');
  const [volume, setVolume] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [tempo, setTempo] = useState<1 | 0.85 | 1.25>(1);

  // Web Audio Context synthesizer for 100% offline, zero-network, sublime ambient harmonic soundscapes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const isPlayingRef = useRef(false);

  const stopSynthesizer = useCallback(() => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    oscillatorsRef.current = [];
    isPlayingRef.current = false;
  }, []);

  const startSynthesizer = useCallback(
    (trackId: SoundscapeType, vol: number) => {
      stopSynthesizer();
      if (typeof window === 'undefined') return;

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        const trackDef = SOUNDSCAPES.find((t) => t.id === trackId) || SOUNDSCAPES[0];
        const base = trackDef.baseFreq;

        // Generate sacred chord clusters (Fundamental, 5th, Octave, Sub-harmonic)
        const freqs =
          trackId === 'tanpura'
            ? [base, base * 1.5, base * 2, base * 0.5] // Sa, Pa, High Sa, Low Sa
            : trackId === 'om'
              ? [base, base * 1.01, base * 0.5, base * 3] // Deep undulating Om beat frequencies
              : trackId === 'flute'
                ? [base * 2, base * 2.5, base * 3]
                : [base, base * 2.76, base * 5.4];

        const oscs: OscillatorNode[] = [];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          const oscGain = ctx.createGain();

          osc.type = trackId === 'om' ? 'sine' : trackId === 'tanpura' ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          // Subtle LFO vibrato / beating
          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(0.4, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          oscGain.gain.setValueAtTime((1 / freqs.length) * (idx === 0 ? 1 : 0.6), ctx.currentTime);

          if (panner) {
            panner.pan.setValueAtTime((idx % 2 === 0 ? -1 : 1) * 0.35, ctx.currentTime);
            osc.connect(oscGain);
            oscGain.connect(panner);
            panner.connect(masterGain);
          } else {
            osc.connect(oscGain);
            oscGain.connect(masterGain);
          }

          osc.start();
          oscs.push(osc);
        });

        oscillatorsRef.current = oscs;
        isPlayingRef.current = true;
      } catch (err) {
        console.warn('[SacredAudioPlayer] Web Audio API playback error:', err);
      }
    },
    [stopSynthesizer]
  );

  const speakSanskritVerse = useCallback((sanskritText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sanskritText);
    utterance.lang = 'hi-IN'; // Closest native phonetic synthesis for Devanagari
    utterance.rate = 0.85; // Serene recitation tempo
    utterance.pitch = 0.95;

    // Pick best Hindi / Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const sanskritVoice =
      voices.find((v) => v.lang.includes('hi') || v.lang.includes('sa')) ||
      voices.find((v) => v.lang.includes('IN'));
    if (sanskritVoice) utterance.voice = sanskritVoice;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const togglePlay = () => {
    triggerTactileFeedback('selection', 'click');
    if (isPlaying) {
      if (selectedTrack === 'recitation' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        stopSynthesizer();
      }
      setIsPlaying(false);
    } else {
      if (selectedTrack === 'recitation' && currentVerseSanskrit) {
        speakSanskritVerse(currentVerseSanskrit);
        setIsPlaying(true);
      } else {
        startSynthesizer(selectedTrack, isMuted ? 0 : volume);
        setIsPlaying(true);
      }
    }
  };

  const handleTrackChange = (track: SoundscapeType) => {
    triggerTactileFeedback('selection', 'softTap');
    setSelectedTrack(track);
    if (isPlaying) {
      if (track === 'recitation') {
        stopSynthesizer();
        if (currentVerseSanskrit) speakSanskritVerse(currentVerseSanskrit);
      } else {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        startSynthesizer(track, isMuted ? 0 : volume);
      }
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : newVol * 0.25, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopSynthesizer();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopSynthesizer]);

  return (
    <>
      {/* Floating Sacred Audio Pill (Spotify/Headspace style) */}
      <aside aria-label="Sacred audio contemplation player" className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-3 w-80 sm:w-96 rounded-3xl border border-amber-300/40 bg-stone-900/95 p-5 shadow-2xl backdrop-blur-2xl text-stone-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-500/20 text-saffron-300">
                    <Radio className="h-4 w-4 animate-pulse" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-amber-100">नादानुसन्धान · Sacred Sound</h3>
                    <p className="text-xs text-stone-400">Meditative Drone & Chanting</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition"
                  aria-label="Close sound panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Soundscape Selector List */}
              <div className="my-4 space-y-1.5">
                {SOUNDSCAPES.map((item) => {
                  const Icon = item.icon;
                  const isCur = selectedTrack === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTrackChange(item.id)}
                      className={`flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition ${
                        isCur
                          ? 'border border-amber-400/50 bg-amber-500/15 text-amber-200 shadow-inner'
                          : 'border border-transparent hover:bg-stone-800/60 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${isCur ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-800 text-stone-400'}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold">{item.title}</p>
                          <p className="text-2xs text-stone-400">{item.subtitle}</p>
                        </div>
                      </div>
                      {isCur && isPlaying && (
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

              {/* Volume Slider & Controls */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-950/60 p-3 border border-stone-800/80">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-stone-400 hover:text-stone-200 transition"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-amber-400 bg-stone-800 rounded-lg"
                  aria-label="Volume slider"
                />
                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-1 transition ${isLooping ? 'text-amber-400' : 'text-stone-500'}`}
                  title={isLooping ? 'Continuous loop active' : 'Play once'}
                >
                  <Repeat className="h-3.5 w-3.5" />
                </button>
              </div>

              {reference && (
                <p className="mt-3 text-center text-2xs text-stone-400 truncate">
                  Now playing with {reference}
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
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-md transition hover:brightness-110 active:scale-95"
            aria-label={isPlaying ? 'Pause sacred sound' : 'Play sacred sound'}
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>

          {/* Track Info & Popout Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-left"
          >
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-amber-100 leading-tight">
                {SOUNDSCAPES.find((s) => s.id === selectedTrack)?.title || 'Vedic Tanpura'}
              </p>
              <p className="text-2xs text-stone-400">
                {isPlaying ? '432Hz Drone Active' : 'Tap to open sound'}
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
