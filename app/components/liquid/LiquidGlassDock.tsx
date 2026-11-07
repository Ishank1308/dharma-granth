'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Command, Languages, MessageSquareQuote, Volume2 } from 'lucide-react';
import { openGlobalSearch } from '@/lib/search-events';
import { SPRING } from './motion';
import type { ReaderMode } from './SpatialShloka';

interface Props {
  mode: ReaderMode;
  onModeChange: (mode: ReaderMode) => void;
  listening: boolean;
  onToggleListening: () => void;
  /** Keep the dock up regardless of scroll direction (a verse is lifted). */
  pinned?: boolean;
}

/** Four bars that breathe while the chapter is being chanted. */
function Waveform({ playing }: { playing: boolean }) {
  return (
    <span aria-hidden="true" className={`dock-wave ${playing ? 'is-playing' : ''}`}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function DockButton({
  active,
  pressed,
  label,
  touchLabel,
  sublabel,
  onClick,
  children,
}: {
  active?: boolean;
  pressed?: boolean;
  label: string;
  /** Shown instead of `label` on touch screens, where a keyboard shortcut means nothing. */
  touchLabel?: string;
  sublabel: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed ?? active}
      title={`${label} · ${sublabel}`}
      className={`relative flex min-h-[52px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dharma-accent)] sm:min-w-[64px] sm:px-3 ${
        active || pressed ? 'text-dharma-text' : 'text-dharma-muted hover:text-dharma-text'
      }`}
    >
      {active && (
        // The indicator flows between buttons like mercury: one shared layout element.
        <motion.span layoutId="liquid-dock-pill" transition={SPRING} className="dock-pill absolute inset-0 rounded-full" />
      )}
      <span className="relative flex h-5 items-center">{children}</span>
      <span className="relative leading-none">
        {touchLabel ? (
          <>
            <span className="kbd-hint">{label}</span>
            <span className="touch-only">{touchLabel}</span>
          </>
        ) : (
          label
        )}
      </span>
      <span className="sr-only"> · {sublabel}</span>
    </button>
  );
}

/**
 * The reader's floating dock: Saṁhitā (plain reading), Anvaya (word by
 * word), Śravaṇa (chanting), Bhāṣya (commentary) and ⌘K. On phones it
 * is a full-width bar in the bottom navigation's place (the header menu still
 * reaches every page), so the chapter has one bar, not two stacked over the
 * text; on larger screens it floats 24px from the bottom. Hides while scrolling down through the text and returns on the
 * way back up, like Safari's toolbar; stays up while a verse is lifted or
 * the chapter is being chanted.
 */
export function LiquidGlassDock({ mode, onModeChange, listening, onToggleListening, pinned = false }: Props) {
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [shortcut, setShortcut] = useState('Ctrl K');

  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K');
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 12) return;
      setHidden(y > last && y > 400);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      aria-label="पठन नियंत्रण · Reader dock"
      initial={reduce ? false : { y: 40 }}
      animate={{ y: hidden && !listening && !pinned ? 120 : 0, opacity: hidden && !listening && !pinned ? 0 : 1 }}
      transition={SPRING}
      className="liquid-dock fixed inset-x-0 z-40 flex justify-center lg:mx-auto lg:w-fit lg:max-w-[calc(100vw-1.5rem)]"
    >
      <div className="liquid-glass relative flex items-center gap-0.5 p-1.5 max-lg:w-full max-lg:justify-around max-lg:rounded-none max-lg:pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] lg:rounded-full">
        <DockButton active={mode === 'samhita'} label="Saṁhitā" sublabel="संहिता · Read" onClick={() => onModeChange('samhita')}>
          <BookOpen className="h-[18px] w-[18px]" aria-hidden="true" />
        </DockButton>
        <DockButton active={mode === 'anvaya'} label="Anvaya" sublabel="अन्वय · Word by word" onClick={() => onModeChange('anvaya')}>
          <Languages className="h-[18px] w-[18px]" aria-hidden="true" />
        </DockButton>
        <DockButton pressed={listening} label="Śravaṇa" sublabel={listening ? 'श्रवण · Pause chanting' : 'श्रवण · Listen'} onClick={onToggleListening}>
          {listening ? <Waveform playing={!reduce} /> : <Volume2 className="h-[18px] w-[18px]" aria-hidden="true" />}
        </DockButton>
        <DockButton active={mode === 'bhashya'} label="Bhāṣya" sublabel="भाष्य · Commentary" onClick={() => onModeChange('bhashya')}>
          <MessageSquareQuote className="h-[18px] w-[18px]" aria-hidden="true" />
        </DockButton>
        <span aria-hidden="true" className="mx-1 h-7 w-px bg-white/15 max-lg:hidden" />
        <DockButton label={shortcut} touchLabel="Search" sublabel="खोज · Jump to any shloka" onClick={() => openGlobalSearch()}>
          <Command className="h-[18px] w-[18px]" aria-hidden="true" />
        </DockButton>
      </div>
    </motion.nav>
  );
}
