'use client';

import React from 'react';

interface MoonPhaseGraphicProps {
  illuminationPercent: number;
  isWaxing: boolean;
  size?: number;
  className?: string;
}

/**
 * Minimalist, mathematically sound Moon Phase Vector Graphic.
 * Renders the lunar crescent/gibbous phase clearly without heavy animations
 * or distracting cosmic textures.
 */
export function MoonPhaseGraphic({
  illuminationPercent,
  isWaxing,
  size = 56,
  className = '',
}: MoonPhaseGraphicProps) {
  const r = size / 2 - 2;
  const center = size / 2;

  // Normalized phase: 0 = new moon, 0.5 = full moon, 1 = new moon
  // Illumination 0% to 100%
  const clampedIllum = Math.max(0, Math.min(100, illuminationPercent));
  
  // Calculate terminator offset curve
  // When illumination is 50%, terminator is a straight line down center (rx = 0)
  // When < 50%, crescent
  // When > 50%, gibbous
  const illumFraction = clampedIllum / 100;
  const rx = Math.abs(r * (2 * illumFraction - 1));

  // Determine SVG path for the illuminated portion
  let illuminatedPath = '';
  if (clampedIllum === 0) {
    // New Moon: virtually dark disk
    illuminatedPath = '';
  } else if (clampedIllum >= 98) {
    // Full Moon: full disk
    illuminatedPath = `M ${center} ${center - r} A ${r} ${r} 0 1 1 ${center} ${center + r} A ${r} ${r} 0 1 1 ${center} ${center - r} Z`;
  } else if (isWaxing) {
    // Waxing: light is on the right side
    if (clampedIllum < 50) {
      // Crescent: outer right semi-circle, inner crescent curve back
      illuminatedPath = `M ${center} ${center - r} A ${r} ${r} 0 0 1 ${center} ${center + r} A ${rx} ${r} 0 0 0 ${center} ${center - r} Z`;
    } else {
      // Gibbous: outer right semi-circle, inner curve bulging left
      illuminatedPath = `M ${center} ${center - r} A ${r} ${r} 0 0 1 ${center} ${center + r} A ${rx} ${r} 0 0 1 ${center} ${center - r} Z`;
    }
  } else {
    // Waning: light is on the left side
    if (clampedIllum < 50) {
      // Crescent: outer left semi-circle, inner crescent curve back
      illuminatedPath = `M ${center} ${center - r} A ${r} ${r} 0 0 0 ${center} ${center + r} A ${rx} ${r} 0 0 1 ${center} ${center - r} Z`;
    } else {
      // Gibbous: outer left semi-circle, inner curve bulging right
      illuminatedPath = `M ${center} ${center - r} A ${r} ${r} 0 0 0 ${center} ${center + r} A ${rx} ${r} 0 0 0 ${center} ${center - r} Z`;
    }
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Moon phase: ${clampedIllum}% illuminated (${isWaxing ? 'Waxing' : 'Waning'})`}
      role="img"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background dark unlit lunar disk */}
        <circle
          cx={center}
          cy={center}
          r={r}
          className="fill-slate-800/90 dark:fill-stone-900 stroke-dharma-border"
          strokeWidth="1.5"
        />

        {/* Subtle craters / maria silhouettes for tasteful lunar cue */}
        <circle cx={center - r * 0.28} cy={center - r * 0.2} r={r * 0.16} className="fill-slate-700/30" />
        <circle cx={center + r * 0.3} cy={center + r * 0.25} r={r * 0.22} className="fill-slate-700/30" />
        <circle cx={center - r * 0.1} cy={center + r * 0.35} r={r * 0.14} className="fill-slate-700/30" />

        {/* Illuminated portion */}
        {illuminatedPath && (
          <path
            d={illuminatedPath}
            className="fill-amber-100 dark:fill-amber-200 transition-all duration-300"
          />
        )}

        {/* Soft edge highlight */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          className="stroke-amber-400/30"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
