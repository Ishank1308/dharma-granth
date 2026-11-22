'use client';

import { useState } from 'react';
import { Flame } from 'lucide-react';
import { PujaMode, type PujaModeProps } from './PujaMode';

/** The button that opens Puja mode, for server-rendered pages (festival pages). */
export function PujaModeLauncher(props: Omit<PujaModeProps, 'onClose'> & { className?: string }) {
  const { className = '', ...mode } = props;
  const [open, setOpen] = useState(false);
  if (mode.steps.length === 0) return null;
  return (
    <>
      <PujaModeButton count={mode.steps.length} onClick={() => setOpen(true)} className={className} />
      {open && <PujaMode {...mode} onClose={() => setOpen(false)} />}
    </>
  );
}

export function PujaModeButton({ count, onClick, className = '' }: { count: number; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring inline-flex min-h-[48px] items-center gap-3 rounded-full bg-dharma-saffron py-2 pl-3 pr-5 text-left text-dharma-bg shadow-raised transition-transform duration-fast active:scale-[0.98] ${className}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10" aria-hidden="true">
        <Flame className="h-4 w-4" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-subhead font-semibold">
          <span lang="hi" data-bi="hi" className="font-devanagari">पूजा मोड</span>
          <span data-bi="sep"> · </span>
          <span data-bi="en">Puja mode</span>
        </span>
        <span className="text-caption-1 opacity-85">
          <span lang="hi" data-bi="hi" className="font-devanagari">{count} चरण, एक-एक करके</span>
          <span data-bi="sep"> · </span>
          <span data-bi="en">{count} steps, one at a time</span>
        </span>
      </span>
    </button>
  );
}
