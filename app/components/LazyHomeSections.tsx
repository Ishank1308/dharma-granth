'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { retryImport } from '@/lib/retry-import';

/**
 * Home sections far below the fold. Each one's code is fetched when its placeholder is about to scroll into view,
 * not with the first page load. The placeholder holds the section's height so the page does not jump.
 * Search engines and the header/footer already reach /practice/ and /panchang/; the noscript links keep these
 * destinations in the HTML.
 */
function OnView({ minHeight, children, fallback }: { minHeight: number; children: () => React.ReactNode; fallback?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <div ref={ref} style={seen ? undefined : { minHeight }}>
      {seen ? children() : fallback}
    </div>
  );
}

const loadable = <P extends object>(load: () => Promise<ComponentType<P>>) =>
  dynamic(() => retryImport(load), { ssr: false });

const Sadhana = loadable(() => import('./SadhanaPreviewSection').then((m) => m.SadhanaPreviewSection));
const Panchang = loadable(() => import('./PanchangPreviewSection').then((m) => m.PanchangPreviewSection));
const Experience = loadable<{ gitaCountLabel: string }>(() => import('./Experience3DSection').then((m) => m.Experience3DSection));

export function LazySadhanaPreview() {
  return (
    <OnView
      minHeight={580}
      fallback={<noscript><a href="/practice/">साधना · Practice</a></noscript>}
    >
      {() => <Sadhana />}
    </OnView>
  );
}

export function LazyPanchangPreview() {
  return (
    <OnView
      minHeight={720}
      fallback={<noscript><a href="/panchang/">पंचांग · Panchang</a></noscript>}
    >
      {() => <Panchang />}
    </OnView>
  );
}

export function LazyExperience3D({ gitaCountLabel }: { gitaCountLabel: string }) {
  return <OnView minHeight={820}>{() => <Experience gitaCountLabel={gitaCountLabel} />}</OnView>;
}
