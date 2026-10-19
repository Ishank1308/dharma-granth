'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useId, forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

function assignRef<T>(ref: React.ForwardedRef<T> | undefined, node: T | null) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref && 'current' in ref) {
    (ref as React.MutableRefObject<T | null>).current = node;
  }
}

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuId: string;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error('DropdownMenu subcomponents must be used inside <DropdownMenu>');
  return ctx;
}

export interface DropdownMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function DropdownMenu({ open: controlledOpen, onOpenChange, children }: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const handleOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen: handleOpen, triggerRef, menuId }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ className, children, onClick, ...props }, ref) {
    const { open, setOpen, triggerRef, menuId } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setOpen(!open);
    };

    return (
      <button
        ref={(node) => {
          (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          assignRef(ref, node);
        }}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={handleClick}
        className={cn('inline-flex items-center justify-center select-none', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export interface DropdownMenuContentProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { align = 'end', sideOffset = 6, className, children, ...props },
    ref
  ) {
    const { open, setOpen, triggerRef, menuId } = useDropdown();
    const contentRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();

    // Dismiss on outside click and Escape
    useEffect(() => {
      if (!open) return;

      const onPointerDown = (e: MouseEvent | TouchEvent) => {
        const target = e.target as Node;
        if (
          contentRef.current?.contains(target) ||
          triggerRef.current?.contains(target)
        ) {
          return;
        }
        setOpen(false);
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
      };

      document.addEventListener('mousedown', onPointerDown);
      document.addEventListener('touchstart', onPointerDown);
      document.addEventListener('keydown', onKeyDown);

      return () => {
        document.removeEventListener('mousedown', onPointerDown);
        document.removeEventListener('touchstart', onPointerDown);
        document.removeEventListener('keydown', onKeyDown);
      };
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    return (
      <AnimatePresence>
        <motion.div
          id={menuId}
          ref={(node) => {
            (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            assignRef(ref, node);
          }}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -4 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{ marginTop: sideOffset }}
          className={cn(
            'absolute z-50 min-w-[200px] sm:min-w-[240px] rounded-2xl border border-dharma-border bg-dharma-card p-1.5 shadow-xl backdrop-blur-md focus:outline-none',
            align === 'end' && 'right-0 origin-top-right',
            align === 'start' && 'left-0 origin-top-left',
            align === 'center' && 'left-1/2 -translate-x-1/2 origin-top',
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }
);

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  inset?: boolean;
}

export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, children, icon, inset, onClick, ...props }, ref) {
    const { setOpen, triggerRef } = useDropdown();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setOpen(false);
      triggerRef.current?.focus();
    };

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        onClick={handleClick}
        className={cn(
          'relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-dharma-text transition cursor-pointer select-none',
          'hover:bg-dharma-card-soft hover:text-saffron-700 dark:hover:text-saffron-300',
          'focus:bg-dharma-card-soft focus:text-saffron-700 dark:focus:text-saffron-300 focus:outline-none',
          'disabled:pointer-events-none disabled:opacity-40',
          inset && 'pl-8',
          className
        )}
        {...props}
      >
        {icon && <span className="h-4 w-4 shrink-0 opacity-80">{icon}</span>}
        <span className="flex-1 text-left">{children}</span>
      </button>
    );
  }
);

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn('-mx-1 my-1 h-px bg-dharma-border/60', className)} />;
}

export function DropdownMenuLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-dharma-muted',
        className
      )}
    >
      {children}
    </div>
  );
}
