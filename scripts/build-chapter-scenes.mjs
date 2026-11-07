#!/usr/bin/env node
/**
 * Draws the chapter scene layers used behind the Sanskrit panel of a verse card
 * (app/styles/scenes.css, mapping in lib/chapter-scenes.ts).
 *
 * Every file is a one-colour silhouette or particle tile. The page uses them
 * as CSS masks over a theme-coloured gradient, so one drawing reads in Day,
 * Sunset, Paper and Night, and the motion is the mask drifting, not the SVG.
 * Alpha inside a drawing gives depth (far hills fainter than near ones).
 *
 * Usage: node scripts/build-chapter-scenes.mjs
 * Output: app/styles/scenes/*.svg (committed; rerun after changing a drawing).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'styles', 'scenes');
mkdirSync(OUT, { recursive: true });

const r1 = (n) => Math.round(n * 10) / 10;

/** Small seeded generator so a rerun draws the same scene. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>\n`;
}

function write(name, w, h, body) {
  writeFileSync(join(OUT, `${name}.svg`), svg(w, h, body));
}

/** A seamless ridge: a sum of sines whose periods divide the tile width. */
function ridge(w, h, base, waves, opacity = 1) {
  const pts = [];
  for (let x = 0; x <= w; x += 8) {
    let y = base;
    for (const [amp, k, phase] of waves) y += amp * Math.sin((2 * Math.PI * k * x) / w + phase);
    pts.push(`${x},${r1(y)}`);
  }
  return `<path fill-opacity="${opacity}" d="M0,${h} L${pts.join(' L')} L${w},${h} Z"/>`;
}

/** Jagged peaks, seamless: the first and last points share a height. */
function peaks(w, h, base, n, height, seed, opacity = 1) {
  const rand = rng(seed);
  const step = w / n;
  let d = `M0,${h} L0,${base}`;
  for (let i = 0; i < n; i++) {
    const x0 = i * step;
    const top = base - height * (0.45 + rand() * 0.55);
    const px = x0 + step * (0.35 + rand() * 0.3);
    d += ` L${r1(px)},${r1(top)} L${r1(x0 + step)},${base}`;
  }
  d += ` L${w},${h} Z`;
  return `<path fill-opacity="${opacity}" d="${d}"/>`;
}

/** Points scattered on a tile, kept clear of the edges so tiles never cut a shape. */
function scatter(w, h, n, seed, pad = 6) {
  const rand = rng(seed);
  return Array.from({ length: n }, () => [pad + rand() * (w - 2 * pad), pad + rand() * (h - 2 * pad), rand()]);
}

// ── Particle tiles (repeat in both directions; the page moves them) ──────────

// Battlefield dust: soft motes of different sizes.
write('dust', 260, 260, scatter(260, 260, 26, 11)
  .map(([x, y, t]) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(0.8 + t * 2.4)}" fill-opacity="${r1(0.25 + t * 0.5)}"/>`)
  .join(''));

// Sparks from a fire: short upright embers.
write('sparks', 220, 220, scatter(220, 220, 18, 23)
  .map(([x, y, t]) => `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(0.9 + t)}" ry="${r1(1.8 + t * 2.4)}" fill-opacity="${r1(0.4 + t * 0.6)}"/>`)
  .join(''));

// Falling petals: a petal drawn once, placed and turned.
const PETAL = 'M0,-6 C4,-4 4,3 0,6 C-4,3 -4,-4 0,-6 Z';
write('petals', 240, 240, scatter(240, 240, 14, 37, 12)
  .map(([x, y, t]) => `<path transform="translate(${r1(x)} ${r1(y)}) rotate(${Math.round(t * 360)}) scale(${r1(0.7 + t * 0.7)})" fill-opacity="${r1(0.45 + t * 0.5)}" d="${PETAL}"/>`)
  .join(''));

// Pipal leaves (Gita 15): heart-shaped with a drip tip.
const LEAF = 'M0,-9 C5,-9 8,-4 7,1 C6,5 2,7 0,12 C-2,7 -6,5 -7,1 C-8,-4 -5,-9 0,-9 Z';
write('leaves', 260, 260, scatter(260, 260, 10, 41, 14)
  .map(([x, y, t]) => `<path transform="translate(${r1(x)} ${r1(y)}) rotate(${Math.round(t * 300 - 150)}) scale(${r1(0.6 + t * 0.6)})" fill-opacity="${r1(0.5 + t * 0.45)}" d="${LEAF}"/>`)
  .join(''));

// Stars: points and a few four-rayed stars.
write('stars', 280, 280, scatter(280, 280, 34, 53)
  .map(([x, y, t], i) => (i % 9 === 0
    ? `<path transform="translate(${r1(x)} ${r1(y)}) scale(${r1(0.8 + t * 0.8)})" d="M0,-5 L1,-1 L5,0 L1,1 L0,5 L-1,1 L-5,0 L-1,-1 Z"/>`
    : `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(0.5 + t * 1.3)}" fill-opacity="${r1(0.3 + t * 0.7)}"/>`))
  .join(''));

// Birds in a loose line, for the open sky (repeat-x only).
const BIRD = 'M-7,0 Q-3.5,-4 0,0 Q3.5,-4 7,0 Q3.5,-2 0,1.2 Q-3.5,-2 -7,0 Z';
write('birds', 640, 90, [[90, 40, 1], [118, 30, 0.8], [140, 46, 0.9], [168, 36, 0.7], [400, 22, 0.8], [425, 30, 0.6]]
  .map(([x, y, s]) => `<path transform="translate(${x} ${y}) scale(${s})" d="${BIRD}"/>`)
  .join(''));

// Clouds: soft blurred puffs (repeat-x).
write('clouds', 720, 120, `<defs><filter id="b" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7"/></filter></defs><g filter="url(#b)" fill-opacity="0.55">`
  + [[110, 60, 70, 18], [160, 50, 46, 20], [70, 66, 40, 13], [460, 46, 80, 16], [520, 40, 44, 18], [610, 58, 50, 12]]
    .map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`).join('')
  + '</g>');

// Water glints: short broken lines on the surface (repeat-x).
write('ripples', 400, 60, scatter(400, 60, 22, 67, 14)
  .map(([x, y, t]) => `<rect x="${r1(x - 6 - t * 10)}" y="${r1(y)}" width="${r1(12 + t * 20)}" height="1.6" rx="0.8" fill-opacity="${r1(0.35 + t * 0.5)}"/>`)
  .join(''));

// ── Horizon bands (repeat-x, seamless, anchored to the panel's bottom) ───────

write('hills', 800, 160, ridge(800, 160, 92, [[18, 1, 0.4], [9, 3, 1.3], [4, 7, 2.1]], 0.28)
  + ridge(800, 160, 122, [[12, 2, 2.2], [6, 5, 0.3]], 0.5));

write('mountains', 800, 170,
  peaks(800, 170, 120, 5, 95, 7, 0.28)
  + peaks(800, 170, 150, 7, 70, 19, 0.55));

// Two armies on the horizon: a band of helmets, spears and pennants.
{
  const rand = rng(97);
  let body = ridge(800, 150, 126, [[3, 2, 0.5], [2, 5, 1.1]], 0.9);
  for (let x = 6; x < 800; x += 9 + Math.round(rand() * 5)) {
    const top = 112 - rand() * 6;
    body += `<circle cx="${x}" cy="${r1(top + 6)}" r="${r1(3.5 + rand() * 1.5)}" fill-opacity="0.8"/>`;
    if (rand() < 0.55) {
      const tip = top - 30 - rand() * 28;
      body += `<rect x="${x - 0.6}" y="${r1(tip)}" width="1.2" height="${r1(top - tip + 6)}" fill-opacity="0.8"/>`;
      body += `<path fill-opacity="0.9" d="M${x - 2},${r1(tip + 4)} L${x},${r1(tip - 3)} L${x + 2},${r1(tip + 4)} Z"/>`;
    }
    if (rand() < 0.16 && x > 30 && x < 770) {
      const p = top - 58 - rand() * 12;
      body += `<rect x="${x - 0.9}" y="${r1(p)}" width="1.8" height="${r1(top - p + 6)}"/>`;
      body += `<path d="M${x + 1},${r1(p)} C${x + 12},${r1(p - 3)} ${x + 18},${r1(p + 5)} ${x + 30},${r1(p + 3)} C${x + 20},${r1(p + 9)} ${x + 12},${r1(p + 7)} ${x + 1},${r1(p + 14)} Z"/>`;
    }
  }
  write('armies', 800, 150, body);
}

// Lotus pond: pads and flowers on still water.
{
  const LOTUS = 'M0,0 C-14,-2 -22,-12 -24,-22 C-14,-18 -8,-12 -6,-6 C-8,-18 -4,-30 0,-36 C4,-30 8,-18 6,-6 C8,-12 14,-18 24,-22 C22,-12 14,-2 0,0 Z';
  let body = '<rect y="128" width="800" height="32" fill-opacity="0.35"/>';
  for (const [x, rx] of [[60, 38], [210, 30], [330, 44], [520, 34], [660, 40], [770, 26]]) {
    body += `<path fill-opacity="0.75" d="M${x - rx},132 A${rx},9 0 1 0 ${x + rx},132 L${x + 4},128 L${x},134 Z"/>`;
  }
  for (const [x, s, o] of [[120, 1, 0.95], [420, 1.25, 1], [600, 0.85, 0.85]]) {
    body += `<rect x="${x - 1}" y="${r1(128 - 4)}" width="2" height="12" fill-opacity="0.7"/>`;
    body += `<path transform="translate(${x} 126) scale(${s})" fill-opacity="${o}" d="${LOTUS}"/>`;
  }
  body += `<path transform="translate(270 126)" fill-opacity="0.7" d="M0,0 C-5,-6 -5,-16 0,-24 C5,-16 5,-6 0,0 Z"/>`;
  write('lotus', 800, 160, body);
}

// River: a band of water across the bottom.
write('river', 800, 60, '<path fill-opacity="0.35" d="M0,18 C200,10 400,26 600,16 C700,11 760,14 800,18 L800,60 L0,60 Z"/>');

// Crop field: furrows and stalks of grain.
{
  const rand = rng(131);
  let body = '';
  for (let x = 4; x < 800; x += 7) {
    const h = 26 + rand() * 18;
    const lean = (rand() - 0.5) * 6;
    body += `<path fill-opacity="${r1(0.55 + rand() * 0.4)}" d="M${x},140 Q${r1(x + lean / 2)},${r1(140 - h / 2)} ${r1(x + lean)},${r1(140 - h)} L${r1(x + lean + 1.4)},${r1(140 - h)} Q${r1(x + 1.4 + lean / 2)},${r1(140 - h / 2)} ${x + 1.4},140 Z"/>`;
    if (rand() < 0.6) body += `<ellipse cx="${r1(x + lean + 0.7)}" cy="${r1(140 - h - 5)}" rx="1.8" ry="5" fill-opacity="0.8"/>`;
  }
  body += '<rect y="140" width="800" height="20" fill-opacity="0.8"/>';
  for (let i = 0; i < 4; i++) body += `<rect y="${144 + i * 4}" width="800" height="1.2" fill-opacity="0.4"/>`;
  write('field', 800, 160, body);
}

// Three strands of the guṇas, braided (Gita 14): sattva, rajas, tamas.
{
  let body = '';
  [[0, 0.45], [(2 * Math.PI) / 3, 0.7], [(4 * Math.PI) / 3, 0.95]].forEach(([phase, o]) => {
    const top = [];
    const bot = [];
    for (let x = 0; x <= 800; x += 8) {
      const y = 96 + 26 * Math.sin((2 * Math.PI * 2 * x) / 800 + phase);
      top.push(`${x},${r1(y - 4.5)}`);
      bot.unshift(`${x},${r1(y + 4.5)}`);
    }
    body += `<path fill-opacity="${o}" d="M${top.join(' L')} L${bot.join(' L')} Z"/>`;
  });
  write('gunas', 800, 160, body);
}

// Pearls on a thread (Gita 7.7, "all this is strung on me, as pearls on a thread").
{
  let body = '';
  [[70, 34, 0.9], [40, 22, 0.5]].forEach(([y0, sag, o]) => {
    const pts = [];
    for (let x = 0; x <= 800; x += 4) pts.push([x, y0 + sag * Math.sin((Math.PI * 2 * x) / 400) ** 2]);
    body += `<path fill="none" stroke="#000" stroke-opacity="${o * 0.6}" stroke-width="1" d="M${pts.map(([x, y]) => `${x},${r1(y)}`).join(' L')}"/>`;
    for (let x = 10; x < 800; x += 20) {
      const y = y0 + sag * Math.sin((Math.PI * 2 * x) / 400) ** 2;
      body += `<circle cx="${x}" cy="${r1(y)}" r="${x % 100 === 50 ? 5 : 3.2}" fill-opacity="${o}"/>`;
    }
  });
  write('pearls', 800, 120, body);
}

// Diyas floating on water (Gita 12, the devotee's lamp).
{
  const DIYA = 'M-16,0 C-14,8 14,8 16,0 C10,-2 -10,-2 -16,0 Z M-2,-3 C-6,-8 -2,-14 0,-20 C2,-14 6,-8 2,-3 Z';
  let body = '<rect y="132" width="800" height="28" fill-opacity="0.3"/>';
  for (const [x, s] of [[80, 1], [250, 0.8], [400, 1.1], [560, 0.9], [720, 1]]) {
    body += `<path transform="translate(${x} 132) scale(${s})" d="${DIYA}"/>`;
    body += `<ellipse cx="${x}" cy="${r1(132 - 14 * s)}" rx="${r1(10 * s)}" ry="${r1(12 * s)}" fill-opacity="0.15"/>`;
  }
  write('diyas', 800, 160, body);
}

// ── Single pieces (no repeat): the subject of a chapter's scene ──────────────

// Krishna and Arjuna's chariot with four horses and the kapidhvaja.
{
  const HORSE = 'M0,0 L2,-14 C2,-22 8,-28 18,-28 L30,-28 C34,-34 36,-42 42,-46 L44,-52 L47,-46 C53,-46 56,-42 58,-38 L52,-36 C48,-38 46,-34 44,-30 C42,-24 42,-18 40,-12 L42,0 L38,0 L35,-12 C30,-14 22,-14 16,-12 L10,0 L6,0 L8,-12 C6,-12 5,-6 4,0 Z';
  let body = '';
  [[148, 0.5], [164, 0.65], [180, 0.8], [196, 1]].forEach(([x, o]) => {
    body += `<path transform="translate(${x} 150)" fill-opacity="${o}" d="${HORSE}"/>`;
  });
  // Body, canopy, the flag of Hanuman.
  body += '<path d="M40,138 L140,138 L148,118 L60,118 Z"/>';
  body += '<path fill-opacity="0.9" d="M58,118 L64,84 L70,84 L66,118 Z M134,118 L130,84 L136,84 L142,118 Z"/>';
  body += '<path d="M52,86 C80,70 120,70 148,86 L140,90 C116,80 84,80 60,90 Z"/>';
  body += '<rect x="99" y="22" width="2.4" height="52"/>';
  body += '<path d="M101.5,24 C114,20 124,30 138,26 C130,34 120,30 101.5,40 Z"/>';
  body += '<path d="M138,138 L176,128" stroke="#000" stroke-width="3"/>';
  // Wheel with spokes.
  body += '<circle cx="78" cy="138" r="22" fill="none" stroke="#000" stroke-width="5"/>';
  for (let a = 0; a < 8; a++) {
    const t = (a * Math.PI) / 4;
    body += `<line x1="78" y1="138" x2="${r1(78 + 20 * Math.cos(t))}" y2="${r1(138 + 20 * Math.sin(t))}" stroke="#000" stroke-width="2"/>`;
  }
  body += '<circle cx="78" cy="138" r="4"/>';
  // Two figures: the charioteer (front) and Arjuna with his bow.
  body += '<circle cx="124" cy="100" r="5"/><path d="M118,118 L120,106 L128,106 L130,118 Z"/>';
  body += '<circle cx="84" cy="98" r="5.5"/><path d="M77,118 L79,104 L89,104 L91,118 Z"/>';
  body += '<path fill="none" stroke="#000" stroke-width="2" d="M70,82 C62,96 62,112 70,124"/>';
  write('chariot', 270, 160, body);
}

// Yajña: a stepped fire altar with its flames.
{
  let body = '<path d="M30,150 L190,150 L180,138 L40,138 Z M44,138 L176,138 L168,126 L52,126 Z" fill-opacity="0.85"/>';
  const FLAME = (x, h, w, o) => `<path fill-opacity="${o}" d="M${x},126 C${x - w},${126 - h * 0.35} ${x - w * 0.4},${126 - h * 0.7} ${x},${126 - h} C${x + w * 0.4},${126 - h * 0.7} ${x + w},${126 - h * 0.35} ${x},126 Z"/>`;
  body += FLAME(110, 92, 30, 0.55) + FLAME(90, 62, 18, 0.8) + FLAME(130, 70, 18, 0.8) + FLAME(110, 50, 12, 1);
  // Ladle (sruva) offering ghee.
  body += '<path d="M190,70 L150,104" stroke="#000" stroke-width="3" stroke-linecap="round"/><ellipse cx="148" cy="106" rx="7" ry="4"/>';
  write('yajna', 220, 160, body);
}

// The sun on the horizon with its rays (Gita 4.1, taught first to Vivasvān).
{
  let body = '<path d="M60,150 A70,70 0 0 1 200,150 Z"/>';
  for (let i = 0; i <= 12; i++) {
    const t = Math.PI + (i * Math.PI) / 12;
    const a = [130 + 80 * Math.cos(t - 0.035), 150 + 80 * Math.sin(t - 0.035)];
    const b = [130 + 80 * Math.cos(t + 0.035), 150 + 80 * Math.sin(t + 0.035)];
    const c = [130 + 128 * Math.cos(t), 150 + 128 * Math.sin(t)];
    body += `<path fill-opacity="0.55" d="M${r1(a[0])},${r1(a[1])} L${r1(c[0])},${r1(c[1])} L${r1(b[0])},${r1(b[1])} Z"/>`;
  }
  write('sun', 260, 160, body);
}

// A yogī seated in meditation beside a lamp in a windless place (Gita 6.19).
{
  let body = '<circle cx="100" cy="62" r="11"/>';
  body += '<path d="M100,52 C96,48 98,42 100,38 C102,42 104,48 100,52 Z" fill-opacity="0.7"/>';
  body += '<path d="M86,76 C90,72 110,72 114,76 L124,118 C112,114 88,114 76,118 Z"/>';
  body += '<path d="M56,132 C64,114 136,114 144,132 C128,138 72,138 56,132 Z"/>';
  body += '<path d="M78,108 C88,118 112,118 122,108 L120,114 C110,122 90,122 80,114 Z" fill-opacity="0.6"/>';
  // Halo.
  body += '<circle cx="100" cy="62" r="26" fill="none" stroke="#000" stroke-opacity="0.45" stroke-width="1.5"/>';
  // Still lamp.
  body += '<path d="M168,132 C170,138 186,138 188,132 C184,130 172,130 168,132 Z M176,129 C173,124 176,118 178,112 C180,118 183,124 180,129 Z"/>';
  body += '<rect x="30" y="134" width="170" height="4" rx="2" fill-opacity="0.7"/>';
  write('yogi', 220, 150, body);
}

// Sun and moon with the two paths (Gita 8.24–26, the bright and dark ways).
{
  let body = '<circle cx="50" cy="50" r="20"/>';
  body += '<path fill-opacity="0.85" d="M250,30 A22,22 0 1 0 270,62 A17,17 0 1 1 250,30 Z"/>';
  const arc = (y0, o) => {
    let d = '';
    for (let x = 50; x <= 260; x += 14) {
      const y = y0 - 70 * Math.sin((Math.PI * (x - 50)) / 210);
      d += `<circle cx="${x}" cy="${r1(y)}" r="1.8" fill-opacity="${o}"/>`;
    }
    return d;
  };
  body += arc(140, 0.8) + arc(150, 0.4);
  write('sun-moon', 300, 160, body);
}

// Patraṁ puṣpaṁ phalaṁ toyam (Gita 9.26): a leaf, a flower, a fruit and water.
{
  let body = '<ellipse cx="130" cy="146" rx="96" ry="8" fill-opacity="0.8"/>';
  body += `<path transform="translate(70 128) rotate(-30) scale(2.2)" d="${LEAF}"/>`;
  body += '<path transform="translate(116 132) scale(1.1)" d="M0,0 C-14,-2 -22,-12 -24,-22 C-14,-18 -8,-12 -6,-6 C-8,-18 -4,-30 0,-36 C4,-30 8,-18 6,-6 C8,-12 14,-18 24,-22 C22,-12 14,-2 0,0 Z"/>';
  body += '<circle cx="156" cy="128" r="12"/><path d="M156,116 C158,110 164,108 168,110 C164,112 160,114 157,117 Z" fill-opacity="0.8"/>';
  // Kalasha with water.
  body += '<path d="M190,140 C176,136 176,112 186,104 L184,96 L204,96 L202,104 C212,112 212,136 198,140 Z"/>';
  body += '<path d="M182,96 C186,86 202,86 206,96 Z" fill-opacity="0.7"/>';
  write('offering', 260, 160, body);
}

// The cosmic form (Gita 11.12): a radiance like a thousand suns rising at once.
{
  let body = '';
  for (let i = 0; i < 36; i++) {
    const t = (i * Math.PI) / 18;
    const len = i % 2 ? 110 : 150;
    body += `<path fill-opacity="${i % 2 ? 0.35 : 0.55}" d="M150,150 L${r1(150 + len * Math.cos(t - 0.025))},${r1(150 + len * Math.sin(t - 0.025))} L${r1(150 + len * Math.cos(t + 0.025))},${r1(150 + len * Math.sin(t + 0.025))} Z"/>`;
  }
  for (const [r, o] of [[28, 1], [48, 0.5], [70, 0.3]]) body += `<circle cx="150" cy="150" r="${r}" fill-opacity="${o}"/>`;
  write('radiance', 300, 300, body);
}

// The aśvattha with roots above and branches below (Gita 15.1).
{
  const rand = rng(151);
  let body = '';
  // Roots fan out at the top.
  for (let i = 0; i < 9; i++) {
    const x = 40 + i * 25;
    body += `<path fill="none" stroke="#000" stroke-width="${r1(2.5 - Math.abs(i - 4) * 0.3)}" stroke-linecap="round" d="M140,62 C${r1(140 + (x - 140) * 0.3)},40 ${x},${r1(26 + rand() * 6)} ${r1(x + (x - 140) * 0.1)},${r1(10 + rand() * 6)}"/>`;
  }
  body += '<path d="M132,62 L148,62 L152,104 L128,104 Z"/>';
  // Canopy below.
  for (const [cx, cy, rx, ry, o] of [[140, 124, 92, 26, 0.55], [100, 128, 46, 20, 0.85], [180, 128, 46, 20, 0.85], [140, 112, 40, 18, 1]]) {
    body += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill-opacity="${o}"/>`;
  }
  write('ashvattha', 280, 160, body);
}

console.log(`Wrote chapter scene layers to ${OUT}`);
