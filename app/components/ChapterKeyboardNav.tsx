'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  prevHref?: string;
  nextHref?: string;
}

function shouldIgnore(e: KeyboardEvent): boolean {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return true;
  const target = e.target;
  if (
    target instanceof HTMLElement &&
    (target.isContentEditable || Boolean(target.closest('input, textarea, select, button, a, summary, [role="combobox"], [role="listbox"], [role="menu"], [role="slider"], [contenteditable="true"]')))
  ) {
    return true;
  }
  // Interactive controls use arrow keys for their own navigation.
  // Search modal, mobile menu, share sheets… own the arrow keys while open.
  return document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
}

/** ← / → move between chapters. Renders nothing. */
export function ChapterKeyboardNav({ prevHref, nextHref }: Props) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (shouldIgnore(e)) return;
      const href = e.key === 'ArrowLeft' ? prevHref : e.key === 'ArrowRight' ? nextHref : undefined;
      if (!href) return;
      e.preventDefault();
      router.push(href);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prevHref, nextHref, router]);

  return null;
}
