'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Sparkles } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

/**
 * Persistent Dharma Copilot AI Guide.
 * The modal code & knowledge base are dynamically imported on first tap,
 * keeping initial page bundle minimal and fast.
 */
export function DharmaCopilot() {
  const [open, setOpen] = useState(false);
  const [Modal, setModal] = useState<ComponentType<{ isOpen: boolean; onClose: () => void }> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const toggle = async () => {
    triggerTactileFeedback('selection', 'softTap');
    if (open) {
      setOpen(false);
      return;
    }
    if (!Modal) {
      const loaded = await import('./copilot/DharmaCopilotModal');
      setModal(() => loaded.DharmaCopilotModal);
    }
    setOpen(true);
  };

  return (
    <div className="print:hidden" data-hide-during-chapter-reading>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => { void toggle(); }}
        className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-3 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-amber-400/40 bg-stone-900/90 px-4 py-2 text-xs sm:text-sm font-bold text-amber-200 shadow-xl backdrop-blur-xl transition-all hover:border-amber-300 hover:scale-105 active:scale-95 md:bottom-20 md:right-6"
        title="Dharma Copilot AI · धर्म सहायक"
        aria-label="Open Dharma Copilot AI"
      >
        <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
        <span lang="hi" className="font-devanagari">धर्म सहायक</span>
      </button>
      {open && Modal && <Modal isOpen={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
