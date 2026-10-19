'use client';

import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Single-level disclosure for explanation sections. A real button controls a region; the open state is exposed with
 * aria-expanded. The panel is not rendered while closed, so closed sections cost nothing. Never wrap the canonical
 * passage in this: scripture stays visible. No height animation (nothing moves behind reading text).
 */
export function Collapsible({
  title,
  defaultOpen = false,
  className = '',
  children,
}: {
  title: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-dharma-border/70 bg-dharma-card/60 px-3.5 text-left text-sm font-semibold text-dharma-text transition hover:border-saffron-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-dharma-muted transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open ? (
        <div id={panelId} role="region" className="mt-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}
