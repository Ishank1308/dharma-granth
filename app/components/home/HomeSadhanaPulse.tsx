'use client';

import { useEffect, useState } from 'react';

interface PulseItem { hi: string; en: string; active: boolean; statHi: string; statEn: string }

const BASE: PulseItem[] = [
  { hi: 'जप', en: 'Japa', active: false, statHi: '0 माला', statEn: '0 mala' },
  { hi: 'ध्यान', en: 'Dhyana', active: false, statHi: '0 मि.', statEn: '0 min' },
  { hi: 'प्राणायाम', en: 'Pranayama', active: false, statHi: '0 चक्र', statEn: '0 rounds' },
  { hi: 'श्लोक संग्रह', en: 'Saved', active: false, statHi: '0 श्लोक', statEn: '0 saved' },
];

function readPulse(): PulseItem[] {
  let day = new Date().toISOString().slice(0, 10);
  try {
    day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  } catch { /* fallback ISO date */ }
  const parse = <T,>(k: string, fb: T): T => {
    try { const raw = window.localStorage.getItem(k); return raw ? (JSON.parse(raw) as T) : fb; } catch { return fb; }
  };
  const japa = parse<{ date?: string; count?: number; rounds?: number }>('dharma.practice.japa', {});
  const med = parse<{ history?: Record<string, number> }>('dharma.practice.meditation', {});
  const prana = parse<{ date?: string; cyclesToday?: number }>('dharma.practice.pranayama', {});
  const saved = parse<unknown[]>('dharma.bookmarkedVerses', []);
  const malas = japa?.date === day ? Number(japa.rounds) || 0 : 0;
  const beads = japa?.date === day ? Number(japa.count) || 0 : 0;
  const mins = Number(med?.history?.[day]) || 0;
  const cycles = prana?.date === day ? Number(prana.cyclesToday) || 0 : 0;
  const marks = Array.isArray(saved) ? saved.length : 0;
  return [
    { hi: 'जप', en: 'Japa', active: malas > 0 || beads > 0, statHi: malas > 0 ? `${malas} माला` : `${beads}/108`, statEn: malas > 0 ? `${malas} mala` : `${beads}/108` },
    { hi: 'ध्यान', en: 'Dhyana', active: mins > 0, statHi: `${mins} मि.`, statEn: `${mins} min` },
    { hi: 'प्राणायाम', en: 'Pranayama', active: cycles > 0, statHi: `${cycles} चक्र`, statEn: `${cycles} rounds` },
    { hi: 'श्लोक संग्रह', en: 'Saved', active: marks > 0, statHi: `${marks} श्लोक`, statEn: `${marks} saved` },
  ];
}

export function HomeSadhanaPulse() {
  const [items, setItems] = useState<PulseItem[]>(BASE);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const sync = () => setItems(readPulse());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const doneCount = items.filter((i) => i.active).length;
  const picked = selected !== null ? items[selected] : null;
  return (
    <div className="mt-3 flex min-h-[28px] flex-wrap items-center justify-between gap-1.5" role="group" aria-label="आज की साधना स्थिति · Today's sadhana pulse">
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => (
          <button key={item.en} type="button" aria-pressed={selected === idx} onClick={() => setSelected(selected === idx ? null : idx)} className={`tap-halo focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selected === idx ? 'border-dharma-saffron/60 bg-dharma-saffron/15 text-dharma-text' : 'border-dharma-border/75 bg-dharma-bg/65 text-dharma-muted hover:border-dharma-saffron/45 hover:text-dharma-text'}`}>
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${item.active ? 'bg-dharma-gold shadow-[0_0_6px_var(--hue-gold)]' : 'bg-dharma-muted/40'}`} />
            <span lang="hi" data-bi="hi" className="font-devanagari">{item.hi}</span>{' '}<span data-bi="en-only">{item.en}</span>
          </button>
        ))}
      </div>
      <span className="tabular-nums text-xs font-semibold text-dharma-saffron">
        {picked ? <><span lang="hi" data-bi="hi" className="font-devanagari">{picked.hi}: {picked.statHi}</span>{' '}<span data-bi="en-only">{picked.en}: {picked.statEn}</span></> : <><span lang="hi" data-bi="hi" className="font-devanagari">आज {doneCount}/4</span>{' '}<span data-bi="en-only">{doneCount}/4 today</span></>}
      </span>
    </div>
  );
}
