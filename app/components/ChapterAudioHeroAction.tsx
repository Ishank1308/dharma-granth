'use client';

import { useState, useEffect } from 'react';
import { Volume2, Pause } from 'lucide-react';
import {
  subscribeSoundscape,
  stopSoundscape,
  type SoundscapeState,
} from '@/lib/sacred-soundscape';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  className?: string;
  chapterTitle?: string;
  firstVerseId?: number | string;
}

export function ChapterAudioHeroAction({
  className = '',
  chapterTitle: _chapterTitle,
  firstVerseId = 1,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = subscribeSoundscape((state: SoundscapeState) => {
      setIsPlaying(state.isPlaying && state.activeTrack === 'recitation');
    });
    return unsub;
  }, []);

  const handleClick = () => {
    triggerTactileFeedback('selection', 'click');
    if (isPlaying) {
      stopSoundscape();
    } else {
      // Scroll smoothly to first verse
      const target =
        document.getElementById(`verse-${firstVerseId}`) ||
        document.getElementById('verse-1');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Trigger continuous chapter recitation
      window.dispatchEvent(new CustomEvent('dharma:start-chapter-parayana'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        isPlaying
          ? 'अध्याय पाठ रोकें (Pause Chapter Recitation)'
          : 'सम्पूर्ण अध्याय उच्चारण सुनें (Listen to Chapter Recitation)'
      }
      className={className}
      title="सम्पूर्ण अध्याय का क्रमिक उच्चारण सुनें"
    >
      {isPlaying ? (
        <Pause className="w-3.5 h-3.5 text-amber-300 animate-pulse" aria-hidden="true" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
      )}
      <span>{isPlaying ? 'पारायण चालू · Pause' : 'अध्याय श्रवण · Listen'}</span>
    </button>
  );
}
