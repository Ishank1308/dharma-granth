'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Filter, MessageSquare, Volume2, X } from 'lucide-react';
import { GITA_SPEAKERS, getGitaDialogueTurn, type GitaSpeakerId } from '@/data/gita-dialogue';
import { cleanVerseField, toAsciiDigits } from '@/lib/verse-format';
import { readHref } from '@/lib/verse-paths';

interface VerseItem {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  explanation?: string;
}

interface Props {
  scriptureId: string;
  chapterId: number;
  verses: VerseItem[];
  onExitConversationMode?: () => void;
}

export function ConversationModeView({
  scriptureId,
  chapterId,
  verses,
  onExitConversationMode,
}: Props) {
  const [selectedSpeaker, setSelectedSpeaker] = useState<'all' | GitaSpeakerId>('all');

  const filteredVerses = verses.filter((v) => {
    if (selectedSpeaker === 'all') return true;
    const vNum = typeof v.number === 'number' ? v.number : parseInt(String(v.number), 10) || 1;
    const turn = getGitaDialogueTurn(chapterId, vNum);
    return turn.speaker.id === selectedSpeaker;
  });

  return (
    <section
      aria-label="Conversation Mode"
      className="mt-6 rounded-3xl border border-dharma-border bg-dharma-card p-4 sm:p-7 shadow-sm transition-all"
    >
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-dharma-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron-500/15 text-saffron-800 dark:text-saffron-300">
              <MessageSquare className="h-4 w-4" />
            </span>
            <h3 className="font-serif text-lg font-bold text-dharma-text">
              Conversation Mode <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· संवाद स्वरूप</span>
            </h3>
          </div>
          <p className="mt-1 text-xs text-dharma-muted">
            Reading as a living dialogue between speaker and seeker while preserving exact scripture sequence.
          </p>
        </div>

        {onExitConversationMode && (
          <button
            type="button"
            onClick={onExitConversationMode}
            className="focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-bg px-3 text-xs font-semibold text-dharma-muted hover:border-saffron-400 hover:text-dharma-text transition"
          >
            <X className="h-3.5 w-3.5" />
            <span>Standard Verse View</span>
          </button>
        )}
      </div>

      {/* Speaker Perspective Filter Tabs */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-dharma-muted uppercase tracking-wider flex items-center gap-1">
          <Filter className="h-3 w-3" />
          <span>Perspective:</span>
        </span>

        <button
          type="button"
          onClick={() => setSelectedSpeaker('all')}
          className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition ${
            selectedSpeaker === 'all'
              ? 'bg-saffron-600 text-white shadow-2xs'
              : 'border border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
          }`}
        >
          All Dialogue (सम्पूर्ण)
        </button>

        {Object.values(GITA_SPEAKERS).map((spk) => (
          <button
            key={spk.id}
            type="button"
            onClick={() => setSelectedSpeaker(spk.id)}
            className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition flex items-center gap-1.5 ${
              selectedSpeaker === spk.id
                ? 'bg-saffron-600 text-white shadow-2xs'
                : 'border border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <span>{spk.badgeIcon}</span>
            <span>{spk.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Dialogue Stream */}
      <ol className="mt-6 space-y-6">
        {filteredVerses.map((verse) => {
          const vNum = typeof verse.number === 'number' ? verse.number : parseInt(String(verse.number), 10) || 1;
          const turn = getGitaDialogueTurn(chapterId, vNum);
          const spk = turn.speaker;
          const lis = turn.listener;

          return (
            <li
              key={vNum}
              className={`rounded-2xl border p-5 sm:p-6 shadow-2xs transition ${spk.cardBorder} ${spk.bgTint}`}
            >
              {/* Speaker Metadata Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dharma-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dharma-card border border-dharma-border text-lg shadow-2xs">
                    {spk.badgeIcon}
                  </span>
                  <div>
                    <h4 className="font-serif text-base font-bold text-dharma-text leading-tight">
                      {spk.nameEn} <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">({spk.nameHi})</span>
                    </h4>
                    <p className="text-[11px] text-dharma-muted">
                      Addressing: <strong>{lis.nameEn}</strong> ({lis.roleEn})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-dharma-card border border-dharma-border px-2.5 py-0.5 text-xs font-bold text-dharma-muted">
                    श्लोक {chapterId}.{vNum}
                  </span>
                  <Link
                    href={readHref(scriptureId, chapterId, vNum)}
                    className="focus-ring inline-flex min-h-[32px] items-center gap-1 rounded-lg border border-dharma-border bg-dharma-card px-2.5 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-300 hover:border-saffron-500 transition"
                  >
                    <span>Full Study</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {turn.contextNote && (
                <p className="mt-2.5 text-xs italic text-dharma-muted">
                  Context: {turn.contextNote}
                </p>
              )}

              {/* Sanskrit Text */}
              {verse.sanskrit && (
                <blockquote className="mt-3.5 rounded-xl border border-amber-600/20 bg-dharma-card/80 p-3.5 text-center">
                  <p lang="sa" className="font-devanagari text-base sm:text-lg font-semibold leading-relaxed text-dharma-text">
                    {cleanVerseField(verse.sanskrit)}
                  </p>
                  <footer className="mt-1 text-xs text-amber-800 dark:text-amber-300 font-bold">
                    ॥ {toAsciiDigits(chapterId)}.{toAsciiDigits(vNum)} ॥
                  </footer>
                </blockquote>
              )}

              {/* Hindi Translation */}
              {verse.hindi && (
                <div className="mt-3 text-xs sm:text-sm leading-relaxed text-dharma-text">
                  <span className="font-semibold text-dharma-muted block text-[11px] uppercase tracking-wide">
                    हिन्दी भावार्थ:
                  </span>
                  <p lang="hi" className="font-devanagari mt-0.5">
                    {cleanVerseField(verse.hindi)}
                  </p>
                </div>
              )}

              {/* English Translation */}
              {verse.translation && (
                <div className="mt-2 text-xs sm:text-sm leading-relaxed text-dharma-text/90">
                  <span className="font-semibold text-dharma-muted block text-[11px] uppercase tracking-wide">
                    English Translation:
                  </span>
                  <p className="font-serif mt-0.5">
                    {cleanVerseField(verse.translation)}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
