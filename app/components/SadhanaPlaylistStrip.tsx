'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Compass, Play, Pause, Sparkles, Clock, Music2 } from 'lucide-react';
import {
  SADHANA_PLAYLISTS,
  type SadhanaPlaylist,
} from '@/lib/sadhana-playlist';
import {
  subscribeSoundscape,
  playSadhanaPlaylist,
  toggleSoundscape,
  type SoundscapeState,
} from '@/lib/sacred-soundscape';
import { triggerTactileFeedback } from '@/lib/haptics';

export function SadhanaPlaylistStrip() {
  const [soundState, setSoundState] = useState<SoundscapeState | null>(null);

  useEffect(() => {
    return subscribeSoundscape((st) => setSoundState({ ...st }));
  }, []);

  const handlePlayPlaylist = (playlist: SadhanaPlaylist) => {
    triggerTactileFeedback('selection', 'softTap');
    if (soundState?.playlistId === playlist.id && soundState.isPlaying) {
      toggleSoundscape();
    } else {
      playSadhanaPlaylist(playlist.id, 0);
    }
  };

  return (
    <section
      aria-label="नित्य स्वाध्याय संकलन · Curated Sadhana Chanting Sessions"
      className="my-10 mx-auto max-w-6xl px-4 sm:px-6"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>नादानुसन्धान · 432Hz तन्पूरा सहित</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-dharma-text font-serif">
            नित्य स्वाध्याय एवं शांति संकलन
          </h2>
          <p className="text-sm text-dharma-muted mt-1">
            Curated continuous chanting journeys with 432Hz Tanpura resonance and neural Sanskrit recitations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {SADHANA_PLAYLISTS.map((playlist) => {
          const isCurrentPlaylist = soundState?.playlistId === playlist.id;
          const isPlaying = isCurrentPlaylist && soundState?.isPlaying;

          const IconComponent =
            playlist.icon === 'Sun' ? Sun : playlist.icon === 'Moon' ? Moon : Compass;

          return (
            <div
              key={playlist.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 flex flex-col justify-between p-5 ${
                isCurrentPlaylist
                  ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-amber-500/5 shadow-lg shadow-amber-500/10 dark:from-stone-900 dark:to-stone-950 ring-1 ring-amber-400/40'
                  : 'border-dharma-border/80 bg-dharma-card/80 hover:border-amber-500/30 hover:shadow-md'
              }`}
            >
              {/* Top Accent Pill */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      isCurrentPlaylist
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-dharma-bg text-amber-600 dark:text-amber-400 border border-dharma-border/60'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-dharma-muted font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{playlist.durationEst}</span>
                    <span>·</span>
                    <span>{playlist.items.length} श्लोक</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-dharma-text font-serif leading-snug">
                  {playlist.hindiTitle}
                </h3>
                <div className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2">
                  {playlist.title}
                </div>

                <p className="text-xs text-dharma-muted leading-relaxed mb-4">
                  {playlist.subtitle}
                </p>

                {/* Verses Preview List */}
                <div className="space-y-1.5 pt-2 border-t border-dharma-border/60 text-[11px] text-dharma-muted">
                  {playlist.items.slice(0, 4).map((it, idx) => (
                    <div key={idx} className="truncate flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{it.note || it.referenceHindi}</span>
                    </div>
                  ))}
                  {playlist.items.length > 4 && (
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 italic pl-2.5">
                      + {playlist.items.length - 4} और पावन श्लोक...
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-dharma-border/40">
                <button
                  type="button"
                  onClick={() => handlePlayPlaylist(playlist)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition active:scale-98 min-h-[44px] ${
                    isPlaying
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25 hover:bg-amber-400'
                      : 'bg-dharma-bg border border-dharma-border hover:border-amber-500/60 hover:text-amber-600 dark:hover:text-amber-400 text-dharma-text'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 fill-current" />
                      <span>विराम (Pause Sadhana)</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                      <span>
                        {isCurrentPlaylist ? 'पुनः आरम्भ (Resume)' : 'स्वाध्याय आरम्भ करें'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
