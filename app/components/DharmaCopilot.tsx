'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Persistent library guide. The verse index loads only after the button is
 * opened, so the first page does not carry that data.
 */
export function DharmaCopilot() {
  const [open, setOpen] = useState(false);
  // On phones the chapter reader has its own control bar just above the bottom navigation; the guide button would sit on top of it.
  const pathname = usePathname();
  const onChapterPage = pathname?.startsWith('/scripture/') === true && pathname.includes('/chapter/');
  const [Panel, setPanel] = useState<ComponentType<{ onClose: () => void }> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (!Panel) {
      const loaded = await import('./copilot/CopilotPanel');
      setPanel(() => loaded.CopilotPanel);
    }
    setOpen(true);
  };

  return (
    <div className="print:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => { void toggle(); }}
        className={`${onChapterPage ? 'max-sm:hidden ' : ''}fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-3 z-40 inline-flex min-h-11 items-center rounded-full border border-dharma-border bg-dharma-card px-4 font-semibold text-dharma-text shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon md:bottom-5 md:right-5`}
      >
        <span lang="hi">धर्म सहायक</span>
      </button>
      {open && Panel && <Panel onClose={() => setOpen(false)} />}
    </div>
  );
}
