'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';
import { openGlobalSearch } from '@/lib/search-events';
import { SriYantraSvg } from './SriYantraSvg';
import { RaatRani } from '@/app/components/vibe/RaatRani';
import { FOLLOW_SPRING, SPRING } from './motion';
import type { YantraPalette } from './SriYantraCanvas';

const SriYantraCanvas = dynamic(() => import('./SriYantraCanvas'), { ssr: false });

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function readPalette(): YantraPalette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return { ink: v('--yantra-ink', '#f2efe9'), accent: v('--yantra-accent', '#e5c158'), soft: v('--yantra-soft', '#8a7440') };
}

/**
 * Home hero: a Sri Yantra-inspired figure behind the title. The SVG figure is
 * server-rendered (complete without JavaScript and for crawlers); where WebGL
 * works and motion is allowed, the 3D figure fades in over it. Rotation speed
 * follows scroll velocity; the light follows the cursor.
 */
export function HeroSacredGeometry() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const [use3d, setUse3d] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  const [visible, setVisible] = useState(true);
  const [palette, setPalette] = useState<YantraPalette | null>(null);
  const [shortcut, setShortcut] = useState('Ctrl K');

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, FOLLOW_SPRING);
  const smoothY = useSpring(pointerY, FOLLOW_SPRING);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // SVG fallback: the figure turns with the page and sinks a little as the hero leaves.
  const svgRotate = useTransform(scrollY, [0, 900], [0, 48]);
  const svgY = useTransform(scrollY, [0, 900], [0, 120]);
  const tiltX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const tiltY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K');
    if (reduce || !webglAvailable()) return;
    setPalette(readPalette());
    setUse3d(true);
    const themeWatch = new MutationObserver(() => setPalette(readPalette()));
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => themeWatch.disconnect();
  }, [reduce]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!use3d) return;
    // Give the canvas a frame to paint before cross-fading from the SVG.
    const t = window.setTimeout(() => setReady3d(true), 350);
    return () => window.clearTimeout(t);
  }, [use3d]);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - r.left) / r.width - 0.5);
    pointerY.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      ref={section}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* The figure */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center [perspective:1200px]">
        <motion.div
          className="aspect-square w-[min(118vw,880px)] opacity-[0.42] sm:opacity-50"
          style={reduce ? undefined : { rotate: svgRotate, y: svgY, rotateX: tiltX, rotateY: tiltY }}
          animate={{ opacity: ready3d ? 0 : undefined }}
          transition={SPRING}
        >
          <SriYantraSvg className="h-full w-full" />
        </motion.div>
        {use3d && palette && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready3d ? 0.55 : 0 }}
            transition={{ duration: 1.2 }}
          >
            <SriYantraCanvas
              pointerX={smoothX}
              pointerY={smoothY}
              scrollVelocity={scrollVelocity}
              palette={palette}
              active={visible}
            />
          </motion.div>
        )}
        {/* Rāt-rānī opening at the corners as the page wakes */}
        <RaatRani variant="hero" />
        {/* A soft pool of canvas behind the words keeps the title and subtitle legible over the lines. */}
        <div className="absolute left-1/2 top-1/2 h-[70%] w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--dharma-bg)_35%,transparent)] opacity-90" />
        {/* Fade the figure into the page at the bottom edge. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-dharma-bg to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[78svh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center sm:min-h-[86svh] sm:py-28">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-dharma-muted">
          <span>Dharma Granth</span> <span aria-hidden="true">·</span>{' '}
          <span lang="hi" className="font-devanagari normal-case tracking-normal">धर्म ग्रंथ</span>
        </p>
        <h1 id="hero-title" className="mt-5 font-serif text-[2.6rem] font-medium leading-[1.05] tracking-tight text-dharma-text sm:text-6xl md:text-7xl">
          Sanātana Grantha Kośa
        </h1>
        <p lang="sa" className="shloka-text mt-3 text-2xl text-[color:var(--dharma-accent)] sm:text-3xl">
          सनातन ग्रन्थ कोश
        </p>
        <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-dharma-muted sm:text-xl">
          The Vedas, Upanishads, Gita, Itihāsas and Purāṇas in Sanskrit, with Hindi and English where the published text
          gives them. Free, quiet, and without ads.
        </p>

        <motion.button
          type="button"
          onClick={() => openGlobalSearch()}
          whileHover={reduce ? undefined : { scale: 1.03 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          transition={SPRING}
          className="liquid-glass relative mt-10 inline-flex min-h-[52px] w-full max-w-md items-center gap-3 rounded-full px-5 text-left text-sm text-dharma-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dharma-accent)]"
          aria-label="Search scriptures: jump to any shloka"
        >
          <Search className="h-4 w-4 shrink-0 text-dharma-text" aria-hidden="true" />
          <span className="flex-1">
            Press <kbd className="font-sans font-semibold text-dharma-text">{shortcut}</kbd> to jump to any Shloka…
          </span>
          <span aria-hidden="true" className="rounded-md border border-dharma-border/70 px-1.5 py-0.5 font-mono text-[11px] text-dharma-muted">
            BG 2.47
          </span>
        </motion.button>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <Link
            href="/scripture/bhagavadgita/"
            className="group inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-dharma-text"
          >
            Begin with the Bhagavad Gita
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link href="/scriptures/" className="inline-flex min-h-[44px] items-center text-dharma-muted transition hover:text-dharma-text">
            Browse the library
          </Link>
        </div>
      </div>
    </section>
  );
}
