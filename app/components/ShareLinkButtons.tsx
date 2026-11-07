'use client';

import { useRef, useState } from 'react';
import { Check, MessageCircle, Share2 } from 'lucide-react';
import { whatsappShareUrl } from '@/lib/whatsapp';

/**
 * WhatsApp + native Share (copy-link fallback) for a page section that has its
 * own anchor, e.g. a reading path or plan. The URL is built from
 * window.location at click time, so server and client markup match.
 */
export function ShareLinkButtons({
  heading,
  lines = [],
  path,
  label,
  className = '',
}: {
  /** Bold first line of the message, e.g. the path's title. */
  heading: string;
  /** Further lines (description, duration). */
  lines?: string[];
  /** Site path with the anchor, e.g. "/learn/plans/#anxiety-overwhelm". */
  path: string;
  /** What is being shared, for assistive text: "Overcoming anxiety". */
  label: string;
  className?: string;
}) {
  const [note, setNote] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = (message: string) => {
    setNote(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(''), 2500);
  };
  const url = () => `${window.location.origin}${path}`;

  const onWhatsApp = () => {
    window.open(whatsappShareUrl({ heading: `${heading} · Dharma Granth`, body: lines, url: url() }), '_blank', 'noopener,noreferrer');
  };

  const onShare = async () => {
    const link = url();
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: `${heading} · Dharma Granth`, text: lines.join('\n'), url: link });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(link);
      say('Link copied');
    } catch {
      say('Could not copy the link');
    }
  };

  const btn =
    'focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg px-3.5 text-xs font-bold text-dharma-text transition hover:border-saffron-400 hover:text-saffron-800 dark:hover:text-saffron-300';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button type="button" onClick={onWhatsApp} aria-label={`Share ${label} on WhatsApp`} className={btn}>
        <MessageCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
        <span>WhatsApp</span>
      </button>
      <button type="button" onClick={onShare} aria-label={`Share ${label}`} className={btn}>
        {note === 'Link copied' ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Share2 className="h-4 w-4 text-dharma-muted" aria-hidden="true" />}
        <span>Share</span>
      </button>
      <span role="status" className="text-xs text-dharma-muted">{note}</span>
    </div>
  );
}
