'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function availableFocusTargets(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((node) =>
    node.getClientRects().length > 0 && !node.closest('[hidden], [inert], [aria-hidden="true"]'),
  );
}

/**
 * Keep keyboard navigation inside a custom modal, lock background scrolling,
 * and return focus to its opener. Shared across study collections and rituals.
 * For native <dialog> prefer showModal() and the browser's inert handling.
 */
export function useAccessibleModal(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const latestClose = useRef(onClose);
  useEffect(() => { latestClose.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const root = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = window.requestAnimationFrame(() => {
      const target = initialFocusRef?.current ?? availableFocusTargets(root)[0] ?? root;
      target.focus({ preventScroll: true });
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        latestClose.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const targets = availableFocusTargets(root);
      if (targets.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }
      const active = document.activeElement;
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (!root.contains(active) || (event.shiftKey && active === first)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
    // Reattach only when the modal opens/closes, not on form edits or dialog re-renders.
  }, [open, dialogRef, initialFocusRef]);
}
