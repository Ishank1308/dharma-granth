'use client';

import { useEffect, useState } from 'react';
import { Check, Flame, Lock, Pause, Play, RotateCcw, Sparkles, Wind, X } from 'lucide-react';
import { localISODate } from './shared';

const STEPS = [
  { num: '01', hi: 'प्राण-स्थिरता', en: 'Calm Breath' },
  { num: '02', hi: 'सूक्ष्म जप (11)', en: '11-Bead Japa' },
  { num: '03', hi: 'मौन व संकल्प', en: 'Silence & Resolve' },
] as const;

const MANTRAS = [
  { id: 'om', sa: 'ॐ नमः शिवाय', iast: 'Oṁ Namaḥ Śivāya' },
  { id: 'vasudeva', sa: 'ॐ नमो भगवते वासुदेवाय', iast: 'Oṁ Namo Bhagavate Vāsudevāya' },
  { id: 'soham', sa: 'सोऽहम्', iast: 'So’ham (I am That)' },
  { id: 'rama', sa: 'श्रीराम जय राम जय जय राम', iast: 'Śrī Rāma Jaya Rāma' },
] as const;

const SANKALPA_KEY = 'dharma.practice.dailySankalpa';

export function GuidedSadhanaSessionWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // Step 1: 4s Inhale / 6s Exhale breath settle
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathSec, setBreathSec] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);

  // Step 2: 11-Bead Sukshma Japa
  const [mantraIdx, setMantraIdx] = useState(0);
  const [beads, setBeads] = useState(0);

  // Step 3: 60s Silent Sit & local Sankalpa
  const [sitRunning, setSitRunning] = useState(false);
  const [sitSec, setSitSec] = useState(60);
  const [sitCompleted, setSitCompleted] = useState(false);
  const [sankalpa, setSankalpa] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SANKALPA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { date?: string; text?: string };
        if (parsed.date === localISODate() && typeof parsed.text === 'string') {
          setSankalpa(parsed.text);
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  // Breath timer
  useEffect(() => {
    if (!breathRunning) return undefined;
    const id = window.setInterval(() => {
      setBreathSec((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('exhale');
            return 6;
          }
          setBreathPhase('inhale');
          setBreathCycles((c) => {
            const nextC = c + 1;
            try {
              const day = localISODate();
              const raw = window.localStorage.getItem('dharma.practice.pranayama');
              const existing = raw ? (JSON.parse(raw) as { date?: string; cyclesToday?: number }) : {};
              const base = existing.date === day ? Number(existing.cyclesToday) || 0 : 0;
              window.localStorage.setItem(
                'dharma.practice.pranayama',
                JSON.stringify({ ...existing, date: day, cyclesToday: base + 1 }),
              );
              window.dispatchEvent(new Event('storage'));
            } catch {}
            return nextC;
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [breathRunning, breathPhase]);

  // 60s Silent Sit timer
  useEffect(() => {
    if (!sitRunning) return undefined;
    const id = window.setInterval(() => {
      setSitSec((prev) => {
        if (prev <= 1) {
          setSitRunning(false);
          setSitCompleted(true);
          try {
            const day = localISODate();
            const raw = window.localStorage.getItem('dharma.practice.meditation');
            const existing = raw ? (JSON.parse(raw) as { history?: Record<string, number> }) : {};
            const history = { ...(existing.history ?? {}) };
            history[day] = (Number(history[day]) || 0) + 1;
            window.localStorage.setItem(
              'dharma.practice.meditation',
              JSON.stringify({ ...existing, history }),
            );
            window.dispatchEvent(new Event('storage'));
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [sitRunning]);

  const advanceBead = () => {
    if (beads >= 11) return;
    const next = beads + 1;
    setBeads(next);
    try {
      const day = localISODate();
      const raw = window.localStorage.getItem('dharma.practice.japa');
      const existing = raw ? (JSON.parse(raw) as { date?: string; count?: number; rounds?: number }) : {};
      const prevCount = existing.date === day ? Number(existing.count) || 0 : 0;
      const prevRounds = existing.date === day ? Number(existing.rounds) || 0 : 0;
      const sum = prevCount + 1;
      const nextRounds = prevRounds + Math.floor(sum / 108);
      const nextCount = sum % 108;
      window.localStorage.setItem(
        'dharma.practice.japa',
        JSON.stringify({ ...existing, date: day, count: nextCount, rounds: nextRounds }),
      );
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleSankalpaChange = (value: string) => {
    setSankalpa(value);
    try {
      if (value.trim()) {
        window.localStorage.setItem(
          SANKALPA_KEY,
          JSON.stringify({ date: localISODate(), text: value }),
        );
      } else {
        window.localStorage.removeItem(SANKALPA_KEY);
      }
    } catch {}
  };

  const activeMantra = MANTRAS[mantraIdx] ?? MANTRAS[0];

  if (!open) {
    return (
      <div className="apple-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border border-dharma-saffron/35 bg-gradient-to-r from-dharma-saffron/10 via-dharma-card to-dharma-card">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-1.5 text-caption font-semibold text-dharma-saffron">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span lang="hi" data-bi="hi" className="font-devanagari">निर्देशित दैनिक क्रम</span>
            <span data-bi="sep"> · </span>
            <span data-bi="en">Guided Daily Sequence</span>
          </p>
          <h2 className="text-title-3 font-semibold text-dharma-text">
            <span data-bi="en">5-Minute Guided Sadhana Flow</span>
            <span data-bi="sep"> · </span>
            <span lang="hi" data-bi="hi" className="font-devanagari">5-मिनट निर्देशित साधना सत्र</span>
          </h2>
          <p className="text-footnote text-dharma-muted">
            <span data-bi="en">3 calm breaths, 11 focused mantra beads, and a 60-second silent resolve — private on your device.</span>{' '}
            <span lang="hi" data-bi="hi" className="font-devanagari">प्राण-स्थिरता, 11 सूक्ष्म मन्त्र-मनके और 60-सेकंड का शांत संकल्प।</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-ring inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-dharma-saffron px-5 text-xs font-semibold text-dharma-bg transition hover:opacity-90"
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          <span lang="hi" data-bi="hi" className="font-devanagari">सत्र प्रारम्भ करें</span>
          <span data-bi="en-only">Begin 5-Min Flow</span>
        </button>
      </div>
    );
  }

  return (
    <section
      id="guided-sadhana-flow"
      aria-labelledby="guided-sadhana-heading"
      className="apple-card border border-dharma-saffron/40 p-5 sm:p-7 space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dharma-border pb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-saffron">
            <span lang="hi" data-bi="hi" className="font-devanagari normal-case">संपादकीय साधना सहायक · उपकरण पर निजी</span>
            <span data-bi="sep"> · </span>
            <span data-bi="en">Guided Practice Flow · Private on Device</span>
          </p>
          <h2 id="guided-sadhana-heading" className="mt-1 text-title-2 font-semibold text-dharma-text">
            <span data-bi="en">5-Minute Sadhana Studio</span>
            <span data-bi="sep"> · </span>
            <span lang="hi" data-bi="hi" className="font-devanagari">पञ्च-मिनट साधना स्टूडियो</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setBreathRunning(false);
            setSitRunning(false);
            setOpen(false);
          }}
          aria-label="साधना स्टूडियो बंद करें · Close Sadhana Studio"
          className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div role="group" aria-label="साधना चरण · Sadhana steps" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {STEPS.map((s, idx) => {
          const active = step === idx;
          return (
            <button
              key={s.num}
              type="button"
              aria-pressed={active}
              onClick={() => setStep(idx as 0 | 1 | 2)}
              className={`focus-ring flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-left text-xs font-semibold transition ${
                active
                  ? 'border-dharma-saffron bg-dharma-saffron/15 text-dharma-text'
                  : 'border-dharma-border bg-dharma-bg/60 text-dharma-muted hover:text-dharma-text'
              }`}
            >
              <span className="font-mono text-[11px] font-bold tabular-nums text-dharma-saffron">{s.num}</span>
              <span>
                <span lang="hi" data-bi="hi" className="font-devanagari">{s.hi}</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">{s.en}</span>
              </span>
            </button>
          );
        })}
      </div>

      {step === 0 && (
        <div className="grid gap-5 sm:grid-cols-12 items-center rounded-2xl border border-dharma-border bg-dharma-bg/65 p-5">
          <div className="sm:col-span-5 flex flex-col items-center gap-3 text-center">
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-dharma-saffron/50 bg-dharma-card shadow-2xs">
              <Wind className="h-4 w-4 text-dharma-saffron" aria-hidden="true" />
              <span lang="hi" className="mt-0.5 font-devanagari text-xs font-semibold text-dharma-text">
                {breathPhase === 'inhale' ? 'पूरक (In)' : 'रेचक (Out)'}
              </span>
              <span className="font-mono text-lg font-bold tabular-nums text-dharma-saffron">{breathSec}s</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBreathRunning((r) => !r)}
                className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-dharma-saffron px-4 text-xs font-semibold text-dharma-bg"
              >
                {breathRunning ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                <span lang="hi" className="font-devanagari">{breathRunning ? 'विराम' : 'श्वास प्रारम्भ'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBreathRunning(false);
                  setBreathPhase('inhale');
                  setBreathSec(4);
                }}
                aria-label="श्वास चक्र रीसेट करें · Reset breath pacer"
                className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-card text-dharma-text"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="sm:col-span-7 space-y-2">
            <p className="font-mono text-xs font-semibold tabular-nums text-dharma-saffron">
              पूर्ण चक्र · Cycles completed: {breathCycles} / 3
            </p>
            <p lang="hi" className="font-devanagari text-sm leading-loose text-dharma-text">
              नासिका से 4 सेकंड धीमी श्वास भीतर भरें (पूरक) और 6 सेकंड शांत भाव से बाहर छोड़ें (रेचक)। तीन चक्र पूर्ण होने पर मन स्वतः स्थिर होने लगता है।
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="focus-ring inline-flex min-h-[44px] items-center rounded-full border border-dharma-border bg-dharma-card px-4 text-xs font-semibold text-dharma-saffron hover:border-dharma-saffron"
            >
              <span lang="hi" className="font-devanagari">अगला चरण: 11-मनका जप ›</span>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 rounded-2xl border border-dharma-border bg-dharma-bg/65 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="मन्त्र चयन · Select mantra">
              {MANTRAS.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={idx === mantraIdx}
                  onClick={() => setMantraIdx(idx)}
                  className={`focus-ring min-h-[38px] rounded-full border px-3 text-xs font-semibold transition ${
                    idx === mantraIdx
                      ? 'border-dharma-saffron bg-dharma-saffron text-dharma-bg'
                      : 'border-dharma-border bg-dharma-card text-dharma-text'
                  }`}
                >
                  <span lang="sa" className="font-devanagari">{m.sa}</span>
                </button>
              ))}
            </div>
            <span className="font-mono text-xs font-bold tabular-nums text-dharma-saffron">
              {beads} / 11 मनके
            </span>
          </div>

          <div className="text-center py-3 space-y-2">
            <p lang="sa" className="font-devanagari text-xl sm:text-2xl font-semibold text-dharma-text">
              {activeMantra.sa}
            </p>
            <p className="font-serif italic text-xs text-dharma-muted">{activeMantra.iast}</p>

            {/* 11 Interactive Beads */}
            <div className="flex flex-wrap items-center justify-center gap-2 py-2" aria-hidden="true">
              {Array.from({ length: 11 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-3.5 w-3.5 rounded-full border transition-all ${
                    idx < beads
                      ? 'border-dharma-saffron bg-dharma-saffron scale-110'
                      : 'border-dharma-border bg-dharma-card'
                  }`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={beads >= 11}
                onClick={advanceBead}
                className="focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-full bg-dharma-saffron px-6 text-sm font-semibold text-dharma-bg transition hover:opacity-90 disabled:opacity-50"
              >
                {beads >= 11 ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                <span lang="hi" className="font-devanagari">
                  {beads >= 11 ? '11 मनके पूर्ण' : 'मनका आगे बढ़ाएँ (+1)'}
                </span>
              </button>
              {beads > 0 && (
                <button
                  type="button"
                  onClick={() => setBeads(0)}
                  className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-card px-3.5 text-xs font-semibold text-dharma-muted hover:text-dharma-text"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>0/11</span>
                </button>
              )}
              {beads >= 11 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="focus-ring inline-flex min-h-[44px] items-center rounded-full border border-dharma-saffron bg-dharma-card px-4 text-xs font-semibold text-dharma-saffron"
                >
                  <span lang="hi" className="font-devanagari">अंतिम चरण: मौन व संकल्प ›</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 rounded-2xl border border-dharma-border bg-dharma-bg/65 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-dharma-saffron">
                <span lang="hi" className="font-devanagari">60-सेकंड शांत ध्यान</span> · 1-Minute Silent Sit
              </p>
              <p lang="hi" className="font-devanagari text-sm text-dharma-muted">
                जप की ध्वनि को शांत मौन में विलीन होने दें। पूर्ण होने पर यह समय आपकी दैनिक साधना में स्वतः जुड़ जाएगा।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tabular-nums text-dharma-text">{sitSec}s</span>
              <button
                type="button"
                onClick={() => {
                  if (sitSec === 0) setSitSec(60);
                  setSitRunning((r) => !r);
                }}
                className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-dharma-saffron px-4 text-xs font-semibold text-dharma-bg"
              >
                {sitRunning ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                <span lang="hi" className="font-devanagari">{sitRunning ? 'विराम' : sitCompleted ? 'पुनः 60s' : '60s मौन'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-dharma-border">
            <label htmlFor="sadhana-daily-sankalpa" className="flex items-center justify-between text-xs font-semibold text-dharma-muted">
              <span>
                <Lock className="mr-1 inline h-3 w-3" aria-hidden="true" />
                <span lang="hi" className="font-devanagari">आज का एक सात्त्विक संकल्प (केवल आपके उपकरण पर)</span>
              </span>
              <span className="font-mono text-[11px]">LocalStorage</span>
            </label>
            <input
              id="sadhana-daily-sankalpa"
              type="text"
              value={sankalpa}
              onChange={(e) => handleSankalpaChange(e.target.value)}
              placeholder="उदाहरण: आज प्रत्येक संवाद में वाणी की सौम्यता और धैर्य रखूँगा/रखूँगी।"
              lang="hi"
              className="apple-field"
            />
          </div>
        </div>
      )}
    </section>
  );
}
