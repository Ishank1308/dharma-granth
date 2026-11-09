'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import type { LocationConfig } from '@/lib/panchang';
import { panchangDayHref } from '@/lib/usePanchangLocation';

export function SharePanchangDay({ date, location }: { date: string; location: LocationConfig }) {
  const [copied, setCopied] = useState(false);
  const [manualLink, setManualLink] = useState('');

  async function shareDay() {
    setCopied(false);
    setManualLink('');
    const { pathname, origin } = window.location;
    const url = new URL(panchangDayHref(pathname, location.id, date), origin).href;

    if (navigator.share) {
      try {
        await navigator.share({ title: `Dharma Granth · ${location.name} · ${date}`, url });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setManualLink(url);
    }
  }

  return (
    <div className="flex max-w-full flex-wrap items-center gap-2">
      <button type="button" onClick={shareDay} className="apple-pill focus-ring min-h-[44px] font-semibold">
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span lang="hi">दिन साझा करें</span> <span>Share this day</span>
      </button>
      <span role="status" className="text-xs text-label-secondary">
        {copied && <><span lang="hi">लिंक कॉपी हो गया</span> · Link copied</>}
        {manualLink && <><span lang="hi">लिंक तैयार है</span> · Link ready</>}
      </span>
      {manualLink && (
        <label className="block basis-full text-xs text-label-secondary">
          <span lang="hi">लिंक कॉपी करें</span> · Copy link
          <input
            readOnly
            value={manualLink}
            onFocus={(event) => event.currentTarget.select()}
            className="focus-ring mt-1 block w-full rounded-md border border-dharma-border bg-dharma-bg px-2 py-1 text-dharma-text"
          />
        </label>
      )}
    </div>
  );
}
