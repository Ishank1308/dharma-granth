'use client';

import { useRef, type PointerEvent } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';

export function Realistic3DGranth({
  className = '',
  compact = false,
  title = 'श्रीमद्भगवद्गीता',
  englishTitle,
  subTitle = 'The Divine Song of Wisdom',
  verseCount = 'श्लोक पुस्तकालय में',
}: {
  className?: string;
  compact?: boolean;
  title?: string;
  englishTitle?: string;
  subTitle?: string;
  verseCount?: string;
}) {
  const reduce = useReducedMotion();
  const bookRef = useRef<HTMLDivElement>(null);

  // Normalised pointer position (-0.5 to 0.5)
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 220, damping: 20, mass: 0.6 };
  const smoothX = useSpring(px, spring);
  const smoothY = useSpring(py, spring);

  // 3D rotations for the book
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);

  // Dynamic foil reflection angle
  const foilX = useTransform(smoothX, [-0.5, 0.5], ['-30%', '130%']);
  const foilY = useTransform(smoothY, [-0.5, 0.5], ['-30%', '130%']);
  const foilBackground = useTransform(
    [foilX, foilY],
    ([x, y]) =>
      `radial-gradient(circle 260px at ${x} ${y}, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 75%)`
  );

  // Cast shadow shifting opposite to light source
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [25, -25]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [35, 15]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = bookRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      className={`relative inline-block perspective-[1400px] select-none ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        ref={bookRef}
        style={
          reduce
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="group relative rounded-2xl"
        role="img"
        aria-label={`3D book cover for ${title}`}
        whileHover={{ scale: 1.03, y: -8 }}
      >
        {/* Dynamic Cast Shadow below book */}
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-8 left-6 right-6 h-12 rounded-full bg-black/45 blur-2xl transition-opacity duration-300 group-hover:bg-black/60"
          style={{ x: shadowX, y: shadowY }}
        />

        {/* 3D Book Object Container */}
        <div
          className={`relative ${compact ? 'h-[22.5rem] w-[15rem] rounded-r-2xl rounded-l-md' : 'h-84 w-64 rounded-r-2xl rounded-l-md sm:h-96 sm:w-72'} shadow-2xl transition-all duration-500`}
          style={{
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(135deg, #7c2d12 0%, #451a03 50%, #1c0a00 100%)',
            boxShadow: `
              inset 4px 0 10px rgba(0,0,0,0.8),
              inset 0 2px 4px rgba(251,191,36,0.3),
              12px 16px 40px rgba(0,0,0,0.6)
            `,
          }}
        >
          {/* Realistic Spine Ridges (Left edge) */}
          <div
            className={`absolute left-0 top-0 bottom-0 ${compact ? 'w-6' : 'w-6'} rounded-l-md`}
            style={{
              background: 'linear-gradient(90deg, #1c0a00 0%, #7c2d12 50%, #451a03 90%, rgba(0,0,0,0.4) 100%)',
              borderRight: '1px solid rgba(251, 191, 36, 0.2)',
            }}
          >
            {/* Spine Gold Embossed Bands */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-amber-400/60 shadow-sm" />
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-amber-200/50" />
            <div className="absolute bottom-10 left-0 right-0 h-1 bg-amber-400/60 shadow-sm" />
            <div className="absolute bottom-12 left-0 right-0 h-0.5 bg-amber-200/50" />
          </div>

          {/* Book Gilded Page Edges (Right, Top, Bottom Thickness) */}
          <div
            className="absolute right-0 top-2 bottom-2 w-3 rounded-r-sm"
            style={{
              background: 'repeating-linear-gradient(0deg, #fef3c7 0px, #d97706 1px, #fef3c7 2px)',
              boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.4)',
              transform: 'translateX(6px) translateZ(-6px) rotateY(45deg)',
            }}
          />

          {/* Saffron Silk Bookmark Ribbon */}
          <motion.div
            className={`absolute -top-3 ${compact ? 'left-16 h-28 w-5' : 'left-16 h-28 w-5'} bg-gradient-to-b from-saffron-600 via-amber-500 to-saffron-700 shadow-lg`}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)',
              transform: 'translateZ(18px)',
            }}
            animate={reduce ? undefined : { rotate: [0, 3, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Book Front Cover Plate */}
          <div
            className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-r-2xl ${compact ? 'py-4 pl-5 pr-3' : 'px-5 py-6 pl-8'}`}
            style={{
              transform: 'translateZ(12px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Golden Specular Foil Reflection that sweeps across on mouse move */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: foilBackground,
              }}
            />

            {/* Embossed Gold Border Pattern */}
            <div className={`pointer-events-none absolute rounded-xl border border-amber-400/40 p-1 ${compact ? 'inset-2' : 'inset-4'}`}>
              <div className="h-full w-full rounded-lg border border-amber-300/20" />
            </div>

            {/* Top Badge: OM & Sacred Aura */}
            <div className="relative z-10 flex items-center justify-between">
              <div className={`flex items-center rounded-full border border-amber-400/30 bg-black/40 font-bold text-amber-200 backdrop-blur-sm ${compact ? 'gap-1.5 px-2.5 py-1.5 text-xs' : 'gap-1.5 px-2.5 py-1 text-[11px]'}`}>
                <Sparkles className={`${compact ? 'h-3 w-3' : 'h-3 w-3'} text-amber-300`} />
                <span>पवित्र ग्रंथ</span>
              </div>
              <span lang="sa" className="font-devanagari text-2xl font-bold text-amber-300/80 drop-shadow">ॐ</span>
            </div>

            {/* Center: Embossed Sacred Title */}
            <div className={`relative z-10 my-auto text-center ${compact ? 'py-2' : 'py-4'}`}>
              <motion.div
                className="inline-block"
                style={{ transform: 'translateZ(24px)' }}
              >
                <div className={`mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-stone-950 shadow-lg ${compact ? 'mb-2 h-11 w-11' : 'mb-3 h-12 w-12'}`}>
                  <Flame className={`${compact ? 'h-6 w-6' : 'h-6 w-6'} text-stone-950`} />
                </div>
                <h3 lang="sa" className={`bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text font-devanagari font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] ${compact ? 'text-2xl leading-relaxed' : 'text-2xl sm:text-3xl'}`}>
                  {title}
                </h3>
                {englishTitle && (
                  <p lang="en" className={`mt-1 font-serif font-bold leading-tight text-amber-100 drop-shadow ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
                    {englishTitle}
                  </p>
                )}
                <p className={`font-serif italic tracking-wide text-amber-200/90 ${compact ? 'mt-1.5 text-xs' : 'mt-1.5 text-xs sm:text-sm'}`}>
                  {subTitle}
                </p>
                <div className={`mx-auto h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent ${compact ? 'mt-1.5 w-10' : 'mt-3 w-16'}`} />
              </motion.div>
            </div>

            {/* Bottom Meta & Action */}
            <div className={`relative z-10 flex items-center justify-center text-center text-amber-200/90 ${compact ? 'text-xs' : 'text-sm'}`}>
              <span lang="en" className="font-bold">{verseCount}</span>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
