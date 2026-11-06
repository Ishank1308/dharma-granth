'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import {
  type LanguagePreference,
  useLanguagePreference,
} from '@/lib/useLanguagePreference';
import { usePresence } from '@/app/components/motion/usePresence';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { preference, setPreference, currentOption, options } =
    useLanguagePreference();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menu = usePresence(open, 140);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          triggerTactileFeedback('light', 'softTap');
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`भाषा प्राथमिकता: ${currentOption.label}`}
        title={`भाषा प्राथमिकता: ${currentOption.label}`}
        className="apple-icon-button h-9 gap-1.5 px-2.5 text-footnote"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="max-w-[70px] truncate sm:max-w-none">
          {currentOption.shortLabel}
        </span>
      </button>

      {menu.mounted && (
          <div
            role="listbox"
            aria-label="भाषा प्राथमिकता चुनें"
            data-closing={menu.closing || undefined}
            className="chrome-pop absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-2xl border border-dharma-border bg-dharma-card p-2 shadow-2xl backdrop-blur-xl"
          >
            <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
              भाषा प्राथमिकता (Language)
            </div>
            <div className="space-y-1">
              {options.map((option) => {
                const isSelected = option.id === preference;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setPreference(option.id as LanguagePreference);
                      setOpen(false);
                      triggerTactileFeedback('light', 'softTap');
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition ${
                      isSelected
                        ? 'bg-saffron-500/10 font-bold text-saffron-700 dark:text-saffron-300'
                        : 'text-dharma-text hover:bg-dharma-bg hover:text-saffron-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-[10px] text-dharma-muted">
                        {option.sub}
                      </div>
                    </div>
                    {isSelected && (
                      <Check
                        className="h-4 w-4 shrink-0 text-saffron-600"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}
