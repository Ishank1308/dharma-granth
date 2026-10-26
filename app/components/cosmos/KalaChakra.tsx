'use client';

import { motion, useReducedMotion } from 'motion/react';
import { NAKSHATRA_DATA } from '@/lib/panchang';
import { SPRING } from '@/app/components/liquid/motion';

const C = 260; // viewBox centre
const NAK_OUTER = 246;
const NAK_INNER = 206;
const TITHI_OUTER = 196;
const TITHI_INNER = 182;
const LIMB_R = 128;

export interface ChakraState {
  /** 0–26 */
  nakshatraIndex: number;
  /** 1–4 */
  pada: number;
  /** 1–30 across the lunar month (Śukla 1–15, Kṛṣṇa 16–30). */
  tithiOfMonth: number;
  tithiProgress: number;
  illumination: number;
  waxing: boolean;
}

function polar(r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  // Rounded: server and browser trig differ in the last digits, which would break hydration.
  return [Math.round((C + r * Math.cos(a)) * 100) / 100, Math.round((C + r * Math.sin(a)) * 100) / 100];
}

function arc(r1: number, r2: number, a1: number, a2: number): string {
  const [x1, y1] = polar(r2, a1);
  const [x2, y2] = polar(r2, a2);
  const [x3, y3] = polar(r1, a2);
  const [x4, y4] = polar(r1, a1);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M${x1} ${y1} A${r2} ${r2} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${r1} ${r1} 0 ${large} 0 ${x4} ${y4} Z`;
}

/** The lit part of the moon as one path: a semicircle plus a terminator ellipse. */
function moonPath(r: number, illumination: number, waxing: boolean): string {
  const k = Math.max(0, Math.min(1, illumination / 100));
  const rx = Math.abs(1 - 2 * k) * r;
  const top = `${C} ${C - r}`;
  const bottom = `${C} ${C + r}`;
  // Waxing: the right limb is lit. The terminator bulges outward past half.
  const limbSweep = waxing ? 1 : 0;
  const termSweep = k > 0.5 ? (waxing ? 1 : 0) : waxing ? 0 : 1;
  return `M${top} A${r} ${r} 0 0 ${limbSweep} ${bottom} A${rx} ${r} 0 0 ${termSweep} ${top} Z`;
}

const LIMBS = [
  { sa: 'तिथि', en: 'Tithi' },
  { sa: 'वार', en: 'Vāra' },
  { sa: 'नक्षत्र', en: 'Nakṣatra' },
  { sa: 'योग', en: 'Yoga' },
  { sa: 'करण', en: 'Karaṇa' },
];

/**
 * Kāla-chakra: the 27 nakshatras round the rim, the 30 tithis inside them,
 * the moon placed in today's nakshatra and pada, the sun the tithi's
 * elongation behind it, the true phase at the centre, and the five limbs
 * (pañca-aṅga) joined as a star. The sky turns slowly; the current
 * nakshatra comes to rest at the top.
 */
export function KalaChakra({ state }: { state: ChakraState | null }) {
  const reduce = useReducedMotion();
  const nakSpan = 360 / 27;
  const moonDeg = state ? (state.nakshatraIndex + (state.pada - 0.5) / 4) * nakSpan : 0;
  const elongation = state ? (state.tithiOfMonth - 1 + state.tithiProgress / 100) * 12 : 0;
  const sunDeg = moonDeg - elongation;
  // Bring today's nakshatra to the top of the wheel.
  const rest = state ? -moonDeg : 0;

  const star = [0, 2, 4, 1, 3, 0].map((i) => polar(LIMB_R, i * 72));

  return (
    <svg viewBox="0 0 520 520" className="h-full w-full overflow-visible" role="img" aria-label="काल चक्र: नक्षत्र और तिथि · The wheel of nakshatras and tithis">
      <defs>
        <radialGradient id="cosmos-moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdf6e3" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fdf6e3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cosmos-moon-lit" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="100%" stopColor="#e9dfc6" />
        </radialGradient>
        <filter id="cosmos-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <motion.g
        initial={{ rotate: rest - 40 }}
        animate={{ rotate: rest }}
        transition={reduce ? { duration: 0 } : { ...SPRING, stiffness: 40, damping: 18 }}
      >
        <g className={reduce ? undefined : 'cosmos-turn'} style={{ transformOrigin: '260px 260px' }}>
          {/* Nakshatra ring */}
          {NAKSHATRA_DATA.map((n, i) => {
            const a1 = i * nakSpan + 0.6;
            const a2 = (i + 1) * nakSpan - 0.6;
            const current = state?.nakshatraIndex === i;
            const mid = (a1 + a2) / 2;
            const [tx, ty] = polar((NAK_OUTER + NAK_INNER) / 2, mid);
            // Names on the lower half of the resting wheel turn round so none read upside down.
            const seen = (((mid + rest) % 360) + 360) % 360;
            const flip = seen > 90 && seen < 270 ? 180 : 0;
            return (
              <g key={n.name}>
                <path d={arc(NAK_INNER, NAK_OUTER, a1, a2)} className={current ? 'cosmos-nak is-current' : 'cosmos-nak'} />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${mid + flip} ${tx} ${ty})`}
                  className={current ? 'cosmos-nak-label is-current' : 'cosmos-nak-label'}
                  lang="sa"
                >
                  {n.nameHi}
                </text>
              </g>
            );
          })}

          {/* Tithi ring: 30 marks, Śukla brighter than Kṛṣṇa */}
          {Array.from({ length: 30 }, (_, i) => {
            const a1 = i * 12 + 0.8;
            const a2 = (i + 1) * 12 - 0.8;
            const current = state?.tithiOfMonth === i + 1;
            return (
              <path
                key={i}
                d={arc(TITHI_INNER, TITHI_OUTER, sunDeg + a1, sunDeg + a2)}
                className={`cosmos-tithi ${i < 15 ? 'is-shukla' : 'is-krishna'} ${current ? 'is-current' : ''}`}
              />
            );
          })}

          {/* Sun and moon on the ecliptic */}
          {state && (
            <>
              <g transform={`translate(${polar(NAK_INNER - 6, sunDeg).join(' ')})`}>
                <circle r="14" fill="#f59e0b" opacity="0.35" filter="url(#cosmos-soft)" />
                <circle r="6" fill="#fbbf24" />
              </g>
              <g transform={`translate(${polar(NAK_INNER - 6, moonDeg).join(' ')})`}>
                <circle r="13" fill="#fdf6e3" opacity="0.4" filter="url(#cosmos-soft)" />
                <circle r="5" fill="#fdf6e3" />
              </g>
            </>
          )}
        </g>
      </motion.g>

      {/* The five limbs, joined as a pentagram (does not turn) */}
      <motion.path
        d={star.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')}
        className="cosmos-star"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      />
      {LIMBS.map((l, i) => {
        const [x, y] = polar(LIMB_R, i * 72);
        const [lx, ly] = polar(LIMB_R + 22, i * 72);
        return (
          <g key={l.en}>
            <circle cx={x} cy={y} r="4" className="cosmos-limb-node" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" className="cosmos-limb-label" lang="sa">
              {l.sa}
            </text>
          </g>
        );
      })}

      {/* The moon tonight */}
      <circle cx={C} cy={C} r="74" fill="url(#cosmos-moon-glow)" />
      <circle cx={C} cy={C} r="44" fill="#1b1d2b" stroke="rgba(253,246,227,0.14)" />
      {state && <path d={moonPath(44, state.illumination, state.waxing)} fill="url(#cosmos-moon-lit)" />}
    </svg>
  );
}
