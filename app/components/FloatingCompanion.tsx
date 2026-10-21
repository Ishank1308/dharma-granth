'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  useReducedMotion,
} from 'framer-motion';
import {
  Bell,
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  Search,
  ChevronUp,
  Flame,
  Check,
} from 'lucide-react';
import { useHaptics } from '@/lib/useHaptics';
import { triggerTactileFeedback } from '@/lib/haptics';
import { openGlobalSearch as openSearchModal } from '@/lib/search-events';
import { readActiveStreak } from '@/lib/reading-history';

export function FloatingCompanion() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const { soundOn, toggleSound, hapticsOn, toggleHaptics } = useHaptics();

  const [scrollPercent, setScrollPercent] = useState(0);
  const [chimeActive, setChimeActive] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  // Starts hidden: at the top of a page the dock sat over the hero buttons
  // and the reader controls, and the header already offers search.
  const [hidden, setHidden] = useState(true);
  const [streak, setStreak] = useState(0);
  const dockRef = useRef<HTMLElement>(null);

  // Track scroll progress percent
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  // Keep the dock out of the way above the fold, and tuck it away while
  // reading down (it would cover text and the chapter nav buttons); bring it
  // back on any upward scroll further down the page.
  const nearTop = (y: number) => y < window.innerHeight * 0.5;
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const delta = y - prev;
    if (dockRef.current?.contains(document.activeElement)) return; // keyboard users
    if (nearTop(y)) setHidden(true);
    else if (delta < -4) setHidden(false);
    else if (delta > 6) setHidden(true);
  });

  // A page restored mid-scroll (back button, #verse- link) shows it at once.
  useEffect(() => {
    setHidden(nearTop(window.scrollY));
  }, [pathname]);

  // Streak changes when a chapter is read; refresh on navigation and on the
  // completion celebration.
  useEffect(() => {
    const refresh = () => setStreak(readActiveStreak());
    refresh();
    window.addEventListener('dharma:streak-change', refresh);
    return () => window.removeEventListener('dharma:streak-change', refresh);
  }, [pathname]);

  // Mindfulness Temple Bell trigger
  const ringTempleBell = () => {
    setChimeActive(true);
    triggerTactileFeedback('celestial', 'templeChime');
    setShowNotification('शांति — Pause & Breathe');

    setTimeout(() => {
      setChimeActive(false);
    }, 1800);

    setTimeout(() => {
      setShowNotification(null);
    }, 3200);
  };

  const handleSoundToggle = () => {
    toggleSound();
    triggerTactileFeedback('medium', 'click');
  };

  const handleHapticsToggle = () => {
    toggleHaptics();
    triggerTactileFeedback('medium', 'softTap');
  };

  // Opens (never toggles) search; a synthetic Ctrl+K would close it if open.
  const openGlobalSearch = () => {
    triggerTactileFeedback('light', 'softTap');
    openSearchModal();
  };

  const scrollToTop = () => {
    triggerTactileFeedback('light', 'click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      ref={dockRef}
      aria-label="Interactive Companion"
      data-hide-during-chapter-reading
      onFocus={() => setHidden(false)}
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-5 left-1/2 -translate-x-1/2 z-40 select-none"
    >
      {/* Slide wrapper: the aside's own transform does the centring, so the
          hide/show motion lives on a child to avoid overwriting it. */}
      <motion.div
        animate={hidden ? { y: 96, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
        style={{ pointerEvents: hidden ? 'none' : 'auto' }}
      >
      {/* Floating Notification Pill */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            // x: '-50%' here: framer's transform replaces Tailwind's
            // -translate-x-1/2, which left the pill off-centre.
            initial={{ opacity: 0, x: '-50%', y: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: '-50%', y: -8, scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: -6, scale: 0.9 }}
            className="absolute -top-12 left-1/2 whitespace-nowrap rounded-full border border-amber-300/40 bg-stone-950/90 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dynamic Island Dock */}
      <motion.div
        className="flex items-center gap-1.5 p-1.5 rounded-full border border-white/20 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        style={{
          background: 'rgba(23, 21, 18, 0.85)',
          perspective: 1000,
        }}
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        {/* Reading streak: the daily habit loop, visible on every page */}
        {streak > 0 && (
          <Link
            href="/dashboard"
            className="flex h-11 items-center gap-1 rounded-full bg-gradient-to-r from-orange-500/25 to-amber-400/20 px-2.5 text-xs font-bold text-amber-200 ring-1 ring-amber-400/30"
            title={`${streak} दिन से लगातार पढ़ रहे हैं — reading streak`}
            aria-label={`Reading streak: ${streak} days`}
          >
            <Flame className="flame-flicker h-3.5 w-3.5 text-orange-400" aria-hidden="true" />
            {streak}
          </Link>
        )}

        {/* Temple Chime Bell Button */}
        <button
          type="button"
          onClick={ringTempleBell}
          className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            chimeActive
              ? 'bg-amber-400 text-stone-950 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
              : 'text-amber-200 hover:text-white hover:bg-white/10'
          }`}
          title="Mindful Bell — Tap to center yourself"
          aria-label="Temple mindfulness chime"
        >
          {chimeActive ? (
            <motion.div
              animate={{ rotate: [-15, 15, -10, 10, 0] }}
              transition={{ duration: 0.6 }}
            >
              <Bell className="w-4 h-4 fill-current" />
            </motion.div>
          ) : (
            <Bell className="w-4 h-4" />
          )}

          {chimeActive && (
            <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-75" />
          )}
        </button>

        {/* Separator */}
        <div className="w-px h-4 bg-white/15" />

        {/* Sound FX Toggle with soundwave animation */}
        <button
          type="button"
          onClick={handleSoundToggle}
          className={`flex items-center justify-center gap-1 px-2.5 h-11 min-w-[44px] rounded-full text-xs font-semibold transition-all ${
            soundOn
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title={soundOn ? 'Sound feedback ON' : 'Sound feedback OFF'}
          aria-label={soundOn ? 'Turn sound feedback off' : 'Turn sound feedback on'}
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-[11px] hidden sm:inline">{soundOn ? 'Audio ON' : 'Audio'}</span>
        </button>

        {/* Haptics Toggle */}
        <button
          type="button"
          onClick={handleHapticsToggle}
          className={`flex items-center justify-center gap-1 px-2.5 h-11 min-w-[44px] rounded-full text-xs font-semibold transition-all ${
            hapticsOn
              ? 'bg-saffron-500/20 text-saffron-300 border border-saffron-500/30'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title={hapticsOn ? 'Haptic feedback ON' : 'Haptic feedback OFF'}
          aria-label={hapticsOn ? 'Turn haptic feedback off' : 'Turn haptic feedback on'}
        >
          <Vibrate className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">{hapticsOn ? 'Haptics' : 'Haptics'}</span>
        </button>

        {/* Separator */}
        <div className="w-px h-4 bg-white/15" />

        {/* Quick Search Button */}
        <button
          type="button"
          onClick={openGlobalSearch}
          className="flex items-center gap-1.5 px-3 h-11 min-w-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-xs font-semibold transition-all"
          title="Search all scriptures (Ctrl+K)"
          aria-label="Search all scriptures"
        >
          <Search className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden md:inline">खोज</span>
        </button>

        {/* Scroll Progress Indicator & Scroll To Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="relative flex items-center justify-center w-11 h-11 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
          title={`Read progress: ${scrollPercent}% — Tap to scroll top`}
          aria-label="Scroll to top"
        >
          <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/15"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-amber-400 transition-all duration-150"
              strokeDasharray={`${scrollPercent}, 100`}
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <ChevronUp className="absolute w-3.5 h-3.5 text-amber-200" />
        </button>
      </motion.div>
      </motion.div>
    </aside>
  );
}
