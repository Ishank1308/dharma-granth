'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface ActionMenuItem {
  key: string;
  /** Visible text. Keep it a short verb phrase. */
  label: ReactNode;
  icon?: ReactNode;
  onSelect: () => void;
  /** Items that do not apply are left out entirely, not disabled. */
  hidden?: boolean;
}

/**
 * "More actions" menu. Native buttons, no library.
 *   - The trigger has aria-haspopup="menu" and aria-expanded.
 *   - Opening moves focus to the first item; ArrowUp/ArrowDown/Home/End move between items.
 *   - Escape closes and returns focus to the trigger; Tab and clicking outside close without stealing focus.
 *   - On phones the panel is a bottom sheet with a scrim; from the sm breakpoint it is a dropdown under the trigger.
 */
export function ActionMenu({ label, triggerClassName = '', items }: { label: string; triggerClassName?: string; items: ActionMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const visible = items.filter((i) => !i.hidden);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => rootRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(), 0);
    function outside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('mousedown', outside);
    };
  }, [open]);

  function onMenuKey(e: KeyboardEvent<HTMLDivElement>) {
    const nodes = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = nodes.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') {
      close(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nodes[(i + 1) % nodes.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nodes[(i - 1 + nodes.length) % nodes.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      nodes[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      nodes[nodes.length - 1]?.focus();
    }
  }

  if (visible.length === 0) return null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        title={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={triggerClassName}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30 sm:hidden" aria-hidden="true" onClick={() => close(false)} />
          <div
            id={menuId}
            role="menu"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={onMenuKey}
            className="z-40 rounded-2xl border border-dharma-border bg-dharma-card p-1.5 shadow-xl max-sm:fixed max-sm:inset-x-3 max-sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-64"
          >
            {visible.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  close(false);
                  item.onSelect();
                }}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-dharma-text transition hover:bg-saffron-50 focus-visible:bg-saffron-50 focus-visible:outline-none dark:hover:bg-saffron-950/30 dark:focus-visible:bg-saffron-950/30"
              >
                {item.icon ? <span className="shrink-0 text-dharma-muted" aria-hidden="true">{item.icon}</span> : null}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
