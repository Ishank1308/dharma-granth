import type { ReactNode } from 'react';

/**
 * One calm, direct message for empty, missing and error states (nothing saved yet, translation not available,
 * storage blocked, offline). Say what is true and what the reader can do; no exclamation marks, no apology theatre.
 * Use tone="problem" for something that failed; it is announced to screen readers.
 */
export function StateMessage({
  title,
  children,
  action,
  tone = 'empty',
  className = '',
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  tone?: 'empty' | 'problem';
  className?: string;
}) {
  const problem = tone === 'problem';
  return (
    <div
      role={problem ? 'alert' : 'status'}
      className={`rounded-2xl border p-5 ${problem ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' : 'border-dharma-border bg-dharma-card-soft'} ${className}`}
    >
      <p className="font-serif text-base font-bold text-dharma-text">{title}</p>
      {children ? <div className="mt-1.5 text-sm leading-relaxed text-dharma-muted">{children}</div> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
