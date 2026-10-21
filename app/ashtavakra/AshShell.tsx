'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type VisualMode = 'immersive' | 'balanced' | 'reading';
export type MotionMode = 'full' | 'reduced' | 'none';
export type Scheme = 'light' | 'dark';

export interface AshSettings {
  visual: VisualMode;
  motion: MotionMode;
  scheme: Scheme;
}

export const ASH_KEY = 'dharma.ash.settings.v1';
export const ASH_ID = 'ash-root';
const DEFAULTS: AshSettings = { visual: 'balanced', motion: 'full', scheme: 'light' };

const VISUALS: VisualMode[] = ['immersive', 'balanced', 'reading'];
const MOTIONS: MotionMode[] = ['full', 'reduced', 'none'];
const SCHEMES: Scheme[] = ['light', 'dark'];

function parse(raw: string | null): AshSettings {
  try {
    const o = raw ? (JSON.parse(raw) as Partial<AshSettings>) : {};
    return {
      visual: VISUALS.includes(o.visual as VisualMode) ? (o.visual as VisualMode) : DEFAULTS.visual,
      motion: MOTIONS.includes(o.motion as MotionMode) ? (o.motion as MotionMode) : DEFAULTS.motion,
      scheme: SCHEMES.includes(o.scheme as Scheme) ? (o.scheme as Scheme) : DEFAULTS.scheme,
    };
  } catch {
    return DEFAULTS;
  }
}

/** Runs before paint so a saved mode does not flash the default one. */
export const ASH_INIT_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem('${ASH_KEY}')||'{}');var e=document.getElementById('${ASH_ID}');if(!e)return;
if(['immersive','balanced','reading'].indexOf(s.visual)>-1)e.setAttribute('data-visual',s.visual);
if(['full','reduced','none'].indexOf(s.motion)>-1)e.setAttribute('data-motion',s.motion);
if(['light','dark'].indexOf(s.scheme)>-1)e.setAttribute('data-scheme',s.scheme);}catch(x){}})();`;

interface Ctx extends AshSettings {
  update: (patch: Partial<AshSettings>) => void;
  /** Stop all decorative motion right now (the "skip animation" control). */
  skipAnimation: () => void;
}

const AshContext = createContext<Ctx>({ ...DEFAULTS, update: () => {}, skipAnimation: () => {} });
export const useAsh = () => useContext(AshContext);

export function AshShell({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AshSettings>(DEFAULTS);

  useEffect(() => {
    try {
      setS(parse(localStorage.getItem(ASH_KEY)));
    } catch {
      /* storage blocked: defaults apply */
    }
  }, []);

  const update = useCallback((patch: Partial<AshSettings>) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(ASH_KEY, JSON.stringify(next));
      } catch {
        /* the choice still applies for this visit */
      }
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(() => ({ ...s, update, skipAnimation: () => update({ motion: 'none' }) }), [s, update]);

  return (
    <AshContext.Provider value={value}>
      <div id={ASH_ID} className="ash min-h-screen" data-visual={s.visual} data-motion={s.motion} data-scheme={s.scheme} suppressHydrationWarning>
        {children}
      </div>
    </AshContext.Provider>
  );
}

function Group<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ id: T; text: string }>; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="ash-meta">{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className="ash-chip focus-ring min-h-[44px] cursor-pointer px-4 font-semibold"
          style={value === o.id ? { background: 'var(--ash-accent-fill)', color: '#1d1408', borderColor: 'var(--ash-accent-fill)' } : undefined}
        >
          {value === o.id && <span aria-hidden="true">✓</span>}
          {o.text}
        </button>
      ))}
    </div>
  );
}

/** Visual mode, motion and theme. Always reachable, never required. */
export function ModeControls() {
  const { visual, motion, scheme, update } = useAsh();
  return (
    <details className="ash-controls ash-card" style={{ padding: '0.5rem 1rem' }}>
      <summary className="flex min-h-[44px] cursor-pointer items-center font-semibold">
        दृश्य, गति और थीम की सेटिंग
        <span className="ash-meta ml-3">(इस डिवाइस पर सहेजी जाती हैं)</span>
      </summary>
      <div className="grid gap-4 pb-3 pt-2">
        <Group
          label="दृश्य मोड"
          value={visual}
          onChange={(v) => update({ visual: v })}
          options={[
            { id: 'immersive', text: 'पूर्ण अनुभव' },
            { id: 'balanced', text: 'संतुलित' },
            { id: 'reading', text: 'केवल पाठ' },
          ]}
        />
        <Group
          label="गति"
          value={motion}
          onChange={(v) => update({ motion: v })}
          options={[
            { id: 'full', text: 'पूर्ण गति' },
            { id: 'reduced', text: 'कम गति' },
            { id: 'none', text: 'सजावटी गति बंद' },
          ]}
        />
        <Group
          label="थीम"
          value={scheme}
          onChange={(v) => update({ scheme: v })}
          options={[
            { id: 'light', text: 'पार्चमेंट (हल्का)' },
            { id: 'dark', text: 'चिंतन (गहरा नील)' },
          ]}
        />
        <p className="ash-meta">
          आपके डिवाइस की “कम गति” सेटिंग सदा मानी जाती है। “केवल पाठ” मोड में कोई सजावटी चित्र या गति नहीं रहती।
        </p>
      </div>
    </details>
  );
}
