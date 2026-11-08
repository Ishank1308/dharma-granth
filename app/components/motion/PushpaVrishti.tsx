'use client';

import { useEffect, useRef } from 'react';

/**
 * पुष्पवृष्टि: a gentle shower of flowers from above, as the scriptures
 * describe the gods doing at an auspicious moment. Marigold, rose and jasmine
 * petals drift down slowly from the top edge, sway and fade. It replaces an
 * upward confetti-style burst, which read as a party popper.
 *
 * Pure canvas with no dependencies. Calls onDone when finished. Callers skip it
 * under prefers-reduced-motion.
 */

// Marigold (two shades), deep rose, pale rose, jasmine white, and the odd tulsi leaf.
const PETALS = ['#f59e0b', '#f97316', '#be123c', '#fda4af', '#fffbeb'];
const LEAF = '#4d7c0f';
const COUNT = 44;
const DURATION_MS = 5200;
const FADE_MS = 1100;

interface Petal {
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  leaf: boolean;
  sway: number;
  swayHz: number;
  phase: number;
  delay: number;
}

/** A petal: rounded at the tip, narrowing to the base (a teardrop). */
function drawPetal(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(s * 0.9, s * 0.35, s * 0.7, -s * 0.85, 0, -s);
  ctx.bezierCurveTo(-s * 0.7, -s * 0.85, -s * 0.9, s * 0.35, 0, s);
  ctx.closePath();
}

/** A tulsi leaf: a pointed oval with a midrib. */
function drawLeaf(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.quadraticCurveTo(s * 0.62, 0, 0, -s);
  ctx.quadraticCurveTo(-s * 0.62, 0, 0, s);
  ctx.closePath();
}

export function PushpaVrishti({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const petals: Petal[] = Array.from({ length: COUNT }, (_, i) => {
      const leaf = i % 9 === 0;
      return {
        x: Math.random() * W,
        y: -20 - Math.random() * H * 0.35,
        // Slow, unhurried fall: they float down, they don't fly.
        vy: (0.9 + Math.random() * 0.9) * Math.max(0.8, H / 800),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.04,
        size: leaf ? 6 + Math.random() * 3 : 5 + Math.random() * 4,
        color: leaf ? LEAF : PETALS[Math.floor(Math.random() * PETALS.length)],
        leaf,
        sway: 0.4 + Math.random() * 0.8,
        swayHz: 1 / (900 + Math.random() * 700),
        phase: Math.random() * Math.PI * 2,
        delay: Math.random() * 900,
      };
    });

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      const fade = t > DURATION_MS - FADE_MS ? Math.max(0, (DURATION_MS - t) / FADE_MS) : 1;

      for (const p of petals) {
        if (t < p.delay) continue;
        p.y += p.vy;
        p.x += Math.sin(t * p.swayHz * Math.PI * 2 + p.phase) * p.sway;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // Squash as it turns, so the petal seems to tumble in the air.
        ctx.scale(1, Math.abs(Math.cos(p.rot * 1.3)) * 0.65 + 0.35);
        ctx.globalAlpha = fade * 0.92;
        ctx.fillStyle = p.color;
        if (p.leaf) drawLeaf(ctx, p.size);
        else drawPetal(ctx, p.size);
        ctx.fill();
        // A faint vein gives each petal some body.
        ctx.globalAlpha = fade * 0.25;
        ctx.strokeStyle = p.leaf ? '#365314' : '#7c2d12';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, p.size * 0.8);
        ctx.lineTo(0, -p.size * 0.6);
        ctx.stroke();
        ctx.restore();
      }

      if (t < DURATION_MS) raf = requestAnimationFrame(frame);
      else onDoneRef.current?.();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
