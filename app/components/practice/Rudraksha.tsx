/*
 * A rudraksha seed drawn in SVG: an oblate, knobbly body in warm reddish to dark brown, deep mukhi grooves
 * running pole to pole along the thread, the thread hole at each pole and a soft sheen. No images.
 *
 * <RudrakshaDefs id="…" /> holds the shared gradients and the bark filters; render it once per strand and give
 * every <RudrakshaBead> the same `defs` id. Pure SVG with no hooks, so it renders the same on the server.
 */

import '@/app/styles/sadhana-objects.css';

const MUKHI = 5;
const RX = 18;
const RY = 16.6;
/** Bark filters with different noise seeds, so neighbouring beads never share a surface. */
const SEEDS = [3, 11, 23, 37];

export function RudrakshaDefs({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="74%">
          <stop offset="0" stopColor="#b2643a" />
          <stop offset="0.3" stopColor="#843a1b" />
          <stop offset="0.66" stopColor="#55200c" />
          <stop offset="1" stopColor="#1f0904" />
        </radialGradient>
        <radialGradient id={`${id}-sheen`} cx="34%" cy="27%" r="38%">
          <stop offset="0" stopColor="#ffe6c7" stopOpacity="0.62" />
          <stop offset="0.45" stopColor="#ffd2a3" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffd2a3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-bounce`} cx="70%" cy="82%" r="40%">
          <stop offset="0" stopColor="#e0864f" stopOpacity="0.32" />
          <stop offset="1" stopColor="#e0864f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-limb`} cx="50%" cy="50%" r="50%">
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        {SEEDS.map((seed) => (
          <filter key={seed} id={`${id}-bark-${seed}`} x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
            {/* Lumps: low-frequency noise lit from the upper left, then multiplied into the body. */}
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed={seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.3" xChannelSelector="R" yChannelSelector="G" result="lumpy" />
            <feDiffuseLighting in="noise" surfaceScale="2.3" diffuseConstant="1.2" lightingColor="#ffffff" result="lit">
              <feDistantLight azimuth="225" elevation="56" />
            </feDiffuseLighting>
            <feComposite in="lit" in2="lumpy" operator="arithmetic" k1="0.7" k2="0" k3="0.42" k4="0" result="bark" />
            <feComposite in="bark" in2="lumpy" operator="in" />
          </filter>
        ))}
      </defs>
    </svg>
  );
}

/** One meridian groove as a half ellipse from pole to pole, seen at longitude `lon` (radians, 0 = facing us). */
function meridian(lon: number, offset = 0) {
  const x = RX * Math.sin(lon) + offset;
  const rx = Math.max(0.01, Math.abs(x));
  const sweep = x >= 0 ? 1 : 0;
  return `M0 ${-RY} A${rx.toFixed(2)} ${RY} 0 0 ${sweep} 0 ${RY}`;
}

/**
 * A single bead. `index` turns the seed a little and picks its bark, so each bead on the strand differs.
 * The thread runs top to bottom through the poles.
 */
export function RudrakshaBead({
  defs,
  index = 0,
  size,
  className,
}: {
  defs: string;
  index?: number;
  size: number;
  className?: string;
}) {
  // Seen with two grooves well in front and the rest turned toward the edges, give or take 15 degrees.
  const turn = (36 + ((index * 29) % 31) - 15) * (Math.PI / 180);
  const seed = SEEDS[index % SEEDS.length];
  // Every number is rounded: the server and the browser can differ in the last digit of a cosine, and an
  // unrounded attribute would then fail hydration.
  const grooves: Array<{ d: string; ridge: string; w: number }> = [];
  for (let k = 0; k < MUKHI; k++) {
    let lon = turn + (k * 2 * Math.PI) / MUKHI;
    lon = Math.atan2(Math.sin(lon), Math.cos(lon));
    if (Math.abs(lon) > Math.PI / 2 - 0.12) continue;
    const facing = Math.cos(lon);
    grooves.push({ d: meridian(lon), ridge: meridian(lon, 1.3 * facing), w: +(0.9 + 1.7 * facing).toFixed(2) });
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="-20 -20 40 40"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Contact shadow */}
      <ellipse cx="1.6" cy="3.4" rx={RX} ry={RY} fill="#000" opacity="0.38" />
      <g filter={`url(#${defs}-bark-${seed})`}>
        <ellipse rx={RX} ry={RY} fill={`url(#${defs}-body)`} />
        {grooves.map((g, i) => (
          <g key={i} fill="none" strokeLinecap="round">
            {/* The valley either side of the groove, then its dark floor and a lit far wall */}
            <path d={g.d} stroke="#1a0603" strokeOpacity="0.32" strokeWidth={+(g.w * 3.2).toFixed(2)} />
            <path d={g.d} stroke="#120401" strokeOpacity="0.95" strokeWidth={g.w} />
            <path d={g.ridge} stroke="#e0a070" strokeOpacity="0.3" strokeWidth={0.8} />
          </g>
        ))}
      </g>
      <ellipse rx={RX} ry={RY} fill={`url(#${defs}-limb)`} />
      <ellipse rx={RX} ry={RY} fill={`url(#${defs}-bounce)`} />
      <ellipse rx={RX} ry={RY} fill={`url(#${defs}-sheen)`} />
      {/* Thread holes at the poles */}
      <ellipse cy={-RY + 0.9} rx="2.8" ry="1.2" fill="#120401" />
      <ellipse cy={RY - 0.9} rx="2.8" ry="1.2" fill="#120401" opacity="0.7" />
    </svg>
  );
}

/** The Sumeru's silk tassel and its gilt binding, hanging from the knot at the top of the box. */
export function SilkTassel({ id, className }: { id: string; className?: string }) {
  const strands: string[] = [];
  const n = 19;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1) - 0.5;
    const end = 13 + u * 26 + Math.sin(i * 2.3) * 1.4;
    const len = 52 + Math.cos(i * 1.7) * 3;
    strands.push(`M${(13 + u * 6).toFixed(2)} 14 C ${(13 + u * 9).toFixed(2)} 30, ${end.toFixed(2)} 40, ${end.toFixed(2)} ${len.toFixed(2)}`);
  }
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 26 60" width="26" height="60" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${id}-silk`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7d0f1c" />
          <stop offset="0.32" stopColor="#c81e32" />
          <stop offset="0.44" stopColor="#ff8a73" />
          <stop offset="0.56" stopColor="#d4283a" />
          <stop offset="1" stopColor="#6e0c18" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0.7" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
        <mask id={`${id}-tips`}>
          <rect x="-10" y="0" width="46" height="62" fill={`url(#${id}-fade)`} />
        </mask>
        <linearGradient id={`${id}-gilt`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8a5a14" />
          <stop offset="0.4" stopColor="#f4cf7a" />
          <stop offset="1" stopColor="#7a4a0e" />
        </linearGradient>
      </defs>
      <g mask={`url(#${id}-tips)`} fill="none" stroke={`url(#${id}-silk)`} strokeLinecap="round">
        {strands.map((d, i) => (
          <path key={i} d={d} strokeWidth={i % 3 === 0 ? 1.6 : 1.15} strokeOpacity={i % 2 ? 0.95 : 0.8} />
        ))}
      </g>
      {/* Head of the tassel, wound in silk, and a gilt binding */}
      <path d="M8 2 Q13 -1 18 2 L19 13 Q13 16 7 13 Z" fill={`url(#${id}-silk)`} />
      <rect x="6.6" y="9.4" width="12.8" height="3.2" rx="1.2" fill={`url(#${id}-gilt)`} />
      <rect x="7.4" y="4.4" width="11.2" height="1.6" rx="0.8" fill={`url(#${id}-gilt)`} opacity="0.85" />
    </svg>
  );
}
