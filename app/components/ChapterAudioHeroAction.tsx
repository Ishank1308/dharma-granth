'use client';

import { useState, useEffect, useCallback } from 'react';
import { Volume2, Pause, Play } from 'lucide-react';
import {
  subscribeSoundscape,
  stopSoundscape,
  type SoundscapeState,
} from '@/lib/sacred-soundscape';
import { triggerTactileFeedback } from '@/lib/haptics';
import { getParayanaChapterProgress } from '@/lib/reading-plan-sync';
import { toAsciiDigits } from '@/lib/verse-format';

interface Props {
  className?: string;
  scriptureId?: string;
  chapterId?: number;
  chapterTitle?: string;
  firstVerseId?: number | string;
  totalVerses?: number;
  /** 'hero' sits on the saffron hero; 'quiet' on the page background. */
  tone?: 'hero' | 'quiet';
}

export function ChapterAudioHeroAction({
  className = '',
  scriptureId,
  chapterId,
  chapterTitle: _chapterTitle,
  firstVerseId = 1,
  totalVerses,
  tone = 'hero',
}: Props) {
  const icon = tone === 'quiet' ? 'text-saffron-600 dark:text-amber-300' : 'text-amber-300';
  const resumeTone =
    tone === 'quiet'
      ? '!bg-amber-500/10 !text-amber-800 dark:!text-amber-200'
      : '!bg-amber-400/25 !text-amber-100 hover:!bg-amber-400/35 border border-amber-300/40';
  const [isPlaying, setIsPlaying] = useState(false);
  const [resumeVerse, setResumeVerse] = useState<number | null>(null);

  const checkResumeProgress = useCallback(() => {
    if (scriptureId && chapterId) {
      const v = getParayanaChapterProgress(scriptureId, chapterId);
      if (v && v > 1 && (!totalVerses || v <= totalVerses)) {
        setResumeVerse(v);
        return;
      }
    }
    setResumeVerse(null);
  }, [scriptureId, chapterId, totalVerses]);

  useEffect(() => {
    const unsub = subscribeSoundscape((state: SoundscapeState) => {
      setIsPlaying(state.isPlaying && state.activeTrack === 'recitation');
    });
    checkResumeProgress();

    window.addEventListener('dharma:parayana-progress-updated', checkResumeProgress);
    return () => {
      unsub();
      window.removeEventListener('dharma:parayana-progress-updated', checkResumeProgress);
    };
  }, [checkResumeProgress]);

  const handleStartFromFirst = () => {
    triggerTactileFeedback('selection', 'click');
    if (isPlaying) {
      stopSoundscape();
    } else {
      const target =
        document.getElementById(`verse-${firstVerseId}`) ||
        document.getElementById('verse-1');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      window.dispatchEvent(
        new CustomEvent('dharma:start-chapter-parayana', {
          detail: { startVerse: firstVerseId },
        })
      );
    }
  };

  const handleResume = () => {
    if (!resumeVerse) return;
    triggerTactileFeedback('selection', 'click');
    const target =
      document.getElementById(`verse-${resumeVerse}`) ||
      document.getElementById('verse-1');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.dispatchEvent(
      new CustomEvent('dharma:start-chapter-parayana', {
        detail: { startVerse: resumeVerse },
      })
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        onClick={handleStartFromFirst}
        aria-label={
          isPlaying
            ? 'अध्याय पाठ रोकें (Pause Chapter Recitation)'
            : 'सम्पूर्ण अध्याय उच्चारण सुनें (Listen to Chapter Recitation)'
        }
        className={className}
        title="सम्पूर्ण अध्याय का क्रमिक उच्चारण सुनें"
      >
        {isPlaying ? (
          <Pause className={`w-3.5 h-3.5 animate-pulse ${icon}`} aria-hidden="true" />
        ) : (
          <Volume2 className={`w-3.5 h-3.5 ${icon}`} aria-hidden="true" />
        )}
        <span>{isPlaying ? 'पारायण चालू · Pause' : 'अध्याय श्रवण · Listen'}</span>
      </button>

      {resumeVerse && !isPlaying && (
        <button
          type="button"
          onClick={handleResume}
          aria-label={`श्लोक ${resumeVerse} से आगे सुनें (Resume Chapter Recitation from verse ${resumeVerse})`}
          className={`${className} ${resumeTone}`}
          title={`श्लोक ${resumeVerse} से पारायण जारी रखें`}
        >
          <Play className={`w-3.5 h-3.5 fill-current ${icon}`} aria-hidden="true" />
          <span>श्लोक {toAsciiDigits(resumeVerse)} से आगे · Resume #{resumeVerse}</span>
        </button>
      )}
    </div>
  );
}
