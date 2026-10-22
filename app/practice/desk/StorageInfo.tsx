'use client';

import { useEffect, useState } from 'react';

interface Row { key: string; bytes: number }

const label = (key: string): string => {
  if (key.startsWith('dharma.practice')) return 'Sadhana';
  if (key.includes('bookmark') || key.includes('verseCollections') || key.includes('savedConcepts')) return 'Saved verses, collections and concepts';
  if (key.includes('notes')) return 'Private notes';
  if (key.includes('recentChapters') || key.includes('history') || key.includes('activity')) return 'Reading history and weekly summary';
  if (key.includes('journey') || key.includes('starthere')) return 'Journeys and Start Here answers';
  if (key.includes('feedback')) return 'Clarity feedback';
  if (key.includes('readerSettings') || key.startsWith('dharma_')) return 'Reader settings';
  return 'Other';
};

const kb = (n: number) => (n < 1024 ? `${n} bytes` : `${(n / 1024).toFixed(1)} KB`);

/**
 * What this site keeps in the browser, by kind, and how much room the
 * browser reports. Counts only; the content of notes and entries is never read
 * out or sent.
 */
export function StorageInfo() {
  const [rows, setRows] = useState<Array<[string, number]> | null>(null);
  const [quota, setQuota] = useState<{ usage: number; quota: number } | null>(null);

  useEffect(() => {
    try {
      const by = new Map<string, number>();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !(key.startsWith('dharma.') || key.startsWith('dharma_') || key.startsWith('dharma-'))) continue;
        const bytes = (key.length + (localStorage.getItem(key) ?? '').length) * 2;
        by.set(label(key), (by.get(label(key)) ?? 0) + bytes);
      }
      setRows(Array.from(by.entries()).sort((a, b) => b[1] - a[1]));
    } catch {
      setRows([]);
    }
    navigator.storage?.estimate?.().then((e) => e.quota && setQuota({ usage: e.usage ?? 0, quota: e.quota })).catch(() => undefined);
  }, []);

  if (rows === null) return null;
  const total = rows.reduce((n, r) => n + r[1], 0);
  return (
    <div>
      <p className="text-dharma-muted">Everything below is stored only in this browser. The sizes are approximate, and no content is read out or sent anywhere.</p>
      {rows.length === 0 ? (
        <p className="mt-2 text-dharma-muted">Nothing is stored yet.</p>
      ) : (
        <table className="mt-2 w-full text-left text-sm">
          <caption className="sr-only">What this site stores in this browser, by kind</caption>
          <thead><tr className="border-b border-dharma-border text-dharma-muted"><th scope="col" className="py-1 pr-3">Kind</th><th scope="col" className="py-1">Approximate size</th></tr></thead>
          <tbody>
            {rows.map(([k, n]) => <tr key={k} className="border-b border-dharma-border/60"><td className="py-1 pr-3 text-dharma-text">{k}</td><td className="py-1 text-dharma-muted">{kb(n)}</td></tr>)}
            <tr><td className="py-1 pr-3 font-semibold text-dharma-text">Total</td><td className="py-1 font-semibold text-dharma-text">{kb(total)}</td></tr>
          </tbody>
        </table>
      )}
      {quota && <p className="mt-2 text-dharma-muted">Your browser reports using about {(quota.usage / 1048576).toFixed(1)} MB of roughly {Math.round(quota.quota / 1048576).toLocaleString(undefined, { numberingSystem: 'latn' })} MB available to this site.</p>}
    </div>
  );
}
