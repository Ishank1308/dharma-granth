'use client';

import React from 'react';

/** Rounded so the server and the browser print identical numbers (avoids a hydration mismatch). */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function StaticDharmachakra({
  size = 380,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  const radius = 160;
  const center = 200;
  const spokeCount = 24;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ maxWidth: size, width: '100%', aspectRatio: '1/1' }}
      role="img"
      aria-label="24 अरों वाला धर्मचक्र (24-spoke Dharmachakra sacred emblem)"
    >
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full drop-shadow-[0_8px_24px_rgba(217,119,6,0.18)]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="chakraGoldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#d97706" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="chakraGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="45%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Ambient aura glow */}
        <circle cx={center} cy={center} r={190} fill="url(#chakraGoldGlow)" />

        {/* Outer Rim (नेमि) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#chakraGoldGrad)"
          strokeWidth="10"
        />
        <circle
          cx={center}
          cy={center}
          r={radius - 9}
          fill="none"
          stroke="url(#chakraGoldGrad)"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.8"
        />

        {/* Outer decorative pearl beads (60 beads) */}
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / 48;
          const bx = r3(center + (radius + 12) * Math.cos(angle));
          const by = r3(center + (radius + 12) * Math.sin(angle));
          return (
            <circle
              key={`bead-${i}`}
              cx={bx}
              cy={by}
              r={2}
              fill="#d97706"
              opacity="0.6"
            />
          );
        })}

        {/* 24 Spokes (अरा) */}
        {Array.from({ length: spokeCount }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / spokeCount;
          const x1 = r3(center + 38 * Math.cos(angle));
          const y1 = r3(center + 38 * Math.sin(angle));
          const x2 = r3(center + (radius - 10) * Math.cos(angle));
          const y2 = r3(center + (radius - 10) * Math.sin(angle));

          // Diamond spoke tip ornament
          const tipX = r3(center + (radius - 18) * Math.cos(angle));
          const tipY = r3(center + (radius - 18) * Math.sin(angle));

          return (
            <g key={`spoke-${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#chakraGoldGrad)"
                strokeWidth={i % 2 === 0 ? '3.5' : '2.5'}
                strokeLinecap="round"
              />
              <circle cx={tipX} cy={tipY} r={3} fill="#f59e0b" opacity="0.9" />
            </g>
          );
        })}

        {/* Inner Hub (नाभि) */}
        <circle
          cx={center}
          cy={center}
          r={38}
          fill="none"
          stroke="url(#chakraGoldGrad)"
          strokeWidth="4"
        />
        <circle cx={center} cy={center} r={28} fill="url(#hubGrad)" />
        <circle cx={center} cy={center} r={14} fill="#78350f" opacity="0.85" />
        <circle cx={center} cy={center} r={6} fill="#fef3c7" />
      </svg>
    </div>
  );
}
