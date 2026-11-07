/**
 * The home hero's halo: a kāla-chakra lying back in perspective behind the headline. Three rings, each
 * its own layer so the CSS can turn them on the compositor: 108 beads (a mālā), the 27 nakṣatras, and an
 * eight-petalled lotus. Decorative and server-rendered; styles and motion are in app/motion.css.
 */

const BEADS = Array.from({ length: 108 }, (_, i) => (i / 108) * Math.PI * 2);
const NAKSHATRAS = Array.from({ length: 27 }, (_, i) => (i / 27) * Math.PI * 2);
const PETALS = Array.from({ length: 8 }, (_, i) => i * 45);

const r2 = (n: number) => Math.round(n * 100) / 100;

export function HeroHalo() {
  return (
    <div className="hero-halo" aria-hidden="true" data-decorative>
      <div className="hero-halo-plane">
        {/* 108 beads on a fine circle; every ninth bead is larger. */}
        <svg className="hero-halo-ring" data-ring="mala" viewBox="-100 -100 200 200" focusable="false">
          <circle r="96" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.3" />
          {BEADS.map((a, i) => (
            <circle
              key={i}
              cx={r2(Math.cos(a) * 96)}
              cy={r2(Math.sin(a) * 96)}
              r={i % 9 === 0 ? 1.1 : 0.5}
              fill="currentColor"
              fillOpacity={i % 9 === 0 ? 0.7 : 0.4}
            />
          ))}
        </svg>

        {/* The 27 nakṣatras: a double circle with a tick for each lunar mansion. */}
        <svg className="hero-halo-ring" data-ring="nakshatra" viewBox="-100 -100 200 200" focusable="false">
          <circle r="96" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.35" />
          <circle r="84" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.3" />
          {NAKSHATRAS.map((a, i) => (
            <line
              key={i}
              x1={r2(Math.cos(a) * 84)}
              y1={r2(Math.sin(a) * 84)}
              x2={r2(Math.cos(a) * 96)}
              y2={r2(Math.sin(a) * 96)}
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="0.4"
            />
          ))}
        </svg>

        {/* An eight-petalled lotus around the bindu. */}
        <svg className="hero-halo-ring" data-ring="lotus" viewBox="-100 -100 200 200" focusable="false">
          <g fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.6">
            {PETALS.map((deg) => (
              <path key={deg} transform={`rotate(${deg})`} d="M0 -14 C 18 -34, 16 -70, 0 -92 C -16 -70, -18 -34, 0 -14 Z" />
            ))}
            <circle r="14" strokeOpacity="0.5" />
          </g>
          <circle r="2.2" fill="currentColor" fillOpacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
