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
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

// ── Vālmīki Rāmāyaṇa ─────────────────────────────────────────────────────────

/** A tree: trunk plus a rounded or pointed crown, standing on y. */
function tree(x, y, h, kind, opacity = 1) {
  const trunk = `<rect x="${r1(x - h * 0.03)}" y="${r1(y - h * 0.45)}" width="${r1(h * 0.06)}" height="${r1(h * 0.45)}" fill-opacity="${opacity}"/>`;
  if (kind === 'palm') {
    let fronds = '';
    for (const a of [-70, -35, 0, 35, 70, -110, 110]) {
      const t = ((a - 90) * Math.PI) / 180;
      const ex = x + Math.cos(t) * h * 0.32;
      const ey = y - h + Math.sin(t) * h * 0.22 + h * 0.08;
      fronds += `<path fill-opacity="${opacity}" d="M${r1(x)},${r1(y - h)} Q${r1((x + ex) / 2)},${r1(y - h - h * 0.12)} ${r1(ex)},${r1(ey + h * 0.12)} Q${r1((x + ex) / 2)},${r1(y - h - h * 0.04)} ${r1(x)},${r1(y - h + 2)} Z"/>`;
    }
    return `<path fill-opacity="${opacity}" d="M${r1(x - h * 0.025)},${y} Q${r1(x + h * 0.06)},${r1(y - h / 2)} ${r1(x)},${r1(y - h)} L${r1(x + h * 0.02)},${r1(y - h)} Q${r1(x + h * 0.09)},${r1(y - h / 2)} ${r1(x + h * 0.025)},${y} Z"/>${fronds}`;
  }
  if (kind === 'pine') {
    return trunk + `<path fill-opacity="${opacity}" d="M${x},${r1(y - h)} L${r1(x + h * 0.22)},${r1(y - h * 0.3)} L${r1(x - h * 0.22)},${r1(y - h * 0.3)} Z"/>`;
  }
  return trunk
    + `<ellipse cx="${x}" cy="${r1(y - h * 0.62)}" rx="${r1(h * 0.3)}" ry="${r1(h * 0.26)}" fill-opacity="${opacity}"/>`
    + `<ellipse cx="${r1(x - h * 0.18)}" cy="${r1(y - h * 0.5)}" rx="${r1(h * 0.18)}" ry="${r1(h * 0.15)}" fill-opacity="${opacity}"/>`
    + `<ellipse cx="${r1(x + h * 0.18)}" cy="${r1(y - h * 0.5)}" rx="${r1(h * 0.18)}" ry="${r1(h * 0.15)}" fill-opacity="${opacity}"/>`;
}

// A forest edge (repeat-x): far trees faint, near trees full.
{
  const rand = rng(211);
  let body = ridge(800, 160, 140, [[4, 2, 0.2], [2, 5, 1]], 0.8);
  for (let x = 20; x < 790; x += 34 + rand() * 20) body += tree(r1(x), 142, 60 + rand() * 30, ['round', 'pine', 'round'][Math.floor(rand() * 3)], 0.4);
  for (let x = 40; x < 770; x += 70 + rand() * 50) body += tree(r1(x), 150, 80 + rand() * 40, ['round', 'palm', 'round', 'pine'][Math.floor(rand() * 4)], 0.9);
  write('forest', 800, 160, body);
}

// Ayodhyā on the Sarayū (repeat-x): walls, palace domes, temple śikharas, flags.
{
  const rand = rng(223);
  let body = '<rect y="128" width="800" height="16" fill-opacity="0.9"/>';
  for (let x = 6; x < 800; x += 24) body += `<rect x="${x}" y="122" width="12" height="8" fill-opacity="0.9"/>`;
  for (let x = 30; x < 780; x += 60 + rand() * 40) {
    const kind = rand();
    const w = 30 + rand() * 24;
    if (kind < 0.4) {
      // Śikhara: a curved spire with an āmalaka and a flag.
      const h = 60 + rand() * 30;
      body += `<path d="M${r1(x - w / 2)},128 C${r1(x - w / 2)},${r1(128 - h * 0.6)} ${r1(x - w * 0.12)},${r1(128 - h * 0.9)} ${r1(x)},${r1(128 - h)} C${r1(x + w * 0.12)},${r1(128 - h * 0.9)} ${r1(x + w / 2)},${r1(128 - h * 0.6)} ${r1(x + w / 2)},128 Z"/>`;
      body += `<ellipse cx="${r1(x)}" cy="${r1(128 - h - 3)}" rx="5" ry="3"/>`;
      body += `<rect x="${r1(x - 0.6)}" y="${r1(128 - h - 26)}" width="1.2" height="24"/><path d="M${r1(x + 0.6)},${r1(128 - h - 26)} L${r1(x + 14)},${r1(128 - h - 21)} L${r1(x + 0.6)},${r1(128 - h - 16)} Z"/>`;
    } else if (kind < 0.75) {
      // Palace: a block with a dome and two chhatris.
      const h = 30 + rand() * 18;
      body += `<rect x="${r1(x - w / 2)}" y="${r1(128 - h)}" width="${r1(w)}" height="${r1(h)}" fill-opacity="0.85"/>`;
      body += `<path d="M${r1(x - w * 0.3)},${r1(128 - h)} C${r1(x - w * 0.3)},${r1(128 - h - w * 0.5)} ${r1(x + w * 0.3)},${r1(128 - h - w * 0.5)} ${r1(x + w * 0.3)},${r1(128 - h)} Z"/>`;
      body += `<rect x="${r1(x - 0.6)}" y="${r1(128 - h - w * 0.5)}" width="1.2" height="8"/>`;
      for (const s of [-1, 1]) body += `<path d="M${r1(x + s * w * 0.5 - 5)},${r1(128 - h)} C${r1(x + s * w * 0.5 - 5)},${r1(128 - h - 9)} ${r1(x + s * w * 0.5 + 5)},${r1(128 - h - 9)} ${r1(x + s * w * 0.5 + 5)},${r1(128 - h)} Z"/>`;
      for (let wx = x - w / 2 + 5; wx < x + w / 2 - 4; wx += 8) body += `<rect x="${r1(wx)}" y="${r1(128 - h + 8)}" width="3" height="6" fill="#fff" fill-opacity="0"/>`;
    } else {
      body += tree(r1(x), 128, 46 + rand() * 16, 'palm', 0.75);
    }
  }
  write('city', 800, 144, body);
}

// Waves (repeat-x): crests rolling on open sea.
{
  let body = '';
  for (const [y, amp, k, o, ph] of [[16, 5, 10, 0.45, 0], [30, 6, 8, 0.7, 1.4], [44, 7, 6, 0.95, 2.6]]) {
    const pts = [];
    for (let x = 0; x <= 800; x += 4) pts.push(`${x},${r1(y + amp * Math.sin((2 * Math.PI * k * x) / 800 + ph) - amp * 0.6 * Math.abs(Math.sin((2 * Math.PI * k * x) / 1600 + ph)))}`);
    body += `<path fill-opacity="${o}" d="M0,70 L${pts.join(' L')} L800,70 Z"/>`;
  }
  write('waves', 800, 70, body);
}

/** A standing figure facing right, walking; `bow` adds a strung bow on the back. */
function walker(x, y, s, { bow = false, sari = false, opacity = 1 } = {}) {
  let d = `<g transform="translate(${x} ${y}) scale(${s})" fill-opacity="${opacity}">`;
  d += '<circle cx="0" cy="-46" r="5"/>';
  d += sari
    ? '<path d="M-5,-40 L5,-40 L9,-14 L12,0 L-8,0 L-6,-14 Z"/><path d="M-5,-40 C-10,-36 -12,-26 -10,-18 L-6,-20 Z" fill-opacity="0.7"/>'
    : '<path d="M-4,-40 L5,-40 L6,-22 L2,-22 Z M-4,-40 L-3,-22 L2,-22 Z"/><path d="M-1,-22 L-6,0 L-3,0 L1,-16 L5,0 L8,0 L4,-22 Z"/>';
  d += '<path d="M4,-38 L10,-26 L8,-25 L2,-34 Z"/>';
  if (bow) d += '<path fill="none" stroke="#000" stroke-width="1.4" d="M-6,-58 C-16,-44 -16,-24 -6,-10"/><line x1="-6" y1="-58" x2="-6" y2="-10" stroke="#000" stroke-width="0.5"/><path d="M-1,-40 L-5,-58 L-3,-58 L1,-41 Z" fill-opacity="0.8"/>';
  return d + '</g>';
}

// Into exile (Ayodhyā Kāṇḍa): Rāma, Sītā and Lakṣmaṇa on the road to the forest.
{
  let body = '<path fill-opacity="0.5" d="M0,150 C60,146 120,140 180,138 L280,138 C230,142 140,148 110,150 Z"/>';
  body += walker(190, 138, 0.82, { bow: true, opacity: 0.95 });
  body += walker(170, 138, 0.72, { sari: true, opacity: 0.85 });
  body += walker(146, 139, 0.8, { bow: true, opacity: 0.75 });
  write('exile', 280, 150, body);
}

// The parṇaśālā at Pañcavaṭī with the golden deer at the edge of the clearing (Araṇya Kāṇḍa).
{
  let body = '<ellipse cx="150" cy="148" rx="140" ry="6" fill-opacity="0.7"/>';
  // Leaf hut: thatched roof, posts, doorway.
  body += '<path d="M40,96 C70,70 120,70 150,96 L142,98 L48,98 Z"/>';
  body += '<path d="M54,98 L136,98 L136,146 L54,146 Z" fill-opacity="0.7"/><path d="M84,146 L84,116 C84,108 106,108 106,116 L106,146 Z" fill-opacity="0.5"/>';
  for (let x = 46; x < 146; x += 7) body += `<line x1="${x}" y1="${r1(96 - 18 * Math.sin(((x - 40) / 110) * Math.PI))}" x2="${x - 3}" y2="100" stroke="#000" stroke-opacity="0.5" stroke-width="1"/>`;
  // The deer, looking back.
  body += '<g transform="translate(232 146)"><path d="M-22,-18 C-24,-26 -16,-30 -4,-30 L10,-30 C14,-32 16,-38 18,-44 L22,-48 L26,-44 L30,-42 L24,-38 C22,-34 20,-28 16,-24 L14,-18 L15,0 L12,0 L10,-16 L-4,-16 L-8,0 L-11,0 L-10,-16 C-14,-16 -18,-14 -18,0 L-21,0 Z"/>'
    + '<path fill="none" stroke="#000" stroke-width="1.4" d="M21,-47 L18,-58 L14,-62 M18,-58 L22,-63 M24,-45 L28,-56 L26,-61 M28,-56 L32,-58"/>'
    + '<g fill="#000" fill-opacity="0.35"><circle cx="-12" cy="-24" r="1.6"/><circle cx="-4" cy="-26" r="1.6"/><circle cx="4" cy="-23" r="1.6"/><circle cx="-8" cy="-19" r="1.4"/></g></g>';
  write('hermitage', 280, 150, body);
}

// Laṅkā across the sea (Sundara Kāṇḍa): the golden fortress on Trikūṭa.
{
  let body = '<path fill-opacity="0.6" d="M0,150 C20,120 50,96 90,90 C120,70 160,64 200,84 C230,96 250,120 270,150 Z"/>';
  for (const [x, w, h] of [[96, 16, 38], [118, 22, 58], [140, 18, 70], [162, 22, 54], [184, 14, 36]]) {
    body += `<rect x="${x - w / 2}" y="${90 - h + 20}" width="${w}" height="${h}"/>`;
    body += `<path d="M${x - w / 2 - 2},${90 - h + 20} C${x - w / 2},${90 - h + 6} ${x + w / 2},${90 - h + 6} ${x + w / 2 + 2},${90 - h + 20} Z"/>`;
    body += `<rect x="${x - 0.6}" y="${90 - h - 2}" width="1.2" height="10"/>`;
  }
  body += '<rect x="84" y="100" width="112" height="10" fill-opacity="0.9"/>';
  for (let x = 86; x < 196; x += 8) body += `<rect x="${x}" y="95" width="4" height="6" fill-opacity="0.9"/>`;
  write('lanka', 270, 150, body);
}

// Hanumān's leap over the ocean (Sundara Kāṇḍa 1).
{
  const body = '<g transform="translate(70 60) rotate(-14)">'
    + '<circle cx="34" cy="-6" r="7"/>'
    + '<path d="M26,0 C18,-2 2,0 -10,4 C-18,6 -26,8 -34,6 L-34,10 C-24,12 -14,12 -6,10 L-20,24 L-16,26 L0,12 C8,10 16,8 24,6 Z"/>'
    + '<path d="M28,-2 L52,-14 L53,-11 L30,2 Z"/>'
    + '<path d="M50,-16 L56,-22 L60,-18 L54,-12 Z"/>'
    + '<path d="M-6,8 L-30,24 L-27,27 L-2,12 Z"/>'
    + '<path fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" d="M-30,6 C-46,2 -56,-10 -52,-22 C-50,-28 -44,-30 -40,-26"/>'
    + '</g>'
    + '<path fill-opacity="0.35" d="M0,98 C40,86 70,80 110,82" stroke="#000" stroke-opacity="0.3" fill="none" stroke-width="1" stroke-dasharray="3 5"/>';
  write('leap', 140, 110, body);
}

// The setu: stones laid across the sea (Yuddha Kāṇḍa, repeat-x).
{
  const rand = rng(239);
  let body = '<rect y="22" width="800" height="6" fill-opacity="0.9"/>';
  for (let x = 2; x < 800; x += 14 + Math.round(rand() * 6)) {
    const w = 10 + rand() * 8;
    body += `<rect x="${r1(x)}" y="${r1(12 + rand() * 4)}" width="${r1(w)}" height="${r1(10 + rand() * 4)}" rx="3" fill-opacity="${r1(0.7 + rand() * 0.3)}"/>`;
  }
  for (let x = 30; x < 800; x += 100) body += `<rect x="${x}" y="26" width="8" height="24" fill-opacity="0.6"/>`;
  write('setu', 800, 50, body);
}

// ── Kaṭha Upaniṣad and Durgā Saptaśatī ───────────────────────────────────────

// Naciketā seated at Yama's door, three nights waiting (Kaṭha 1.1.9).
{
  let body = '<rect x="120" y="22" width="12" height="126"/><rect x="216" y="22" width="12" height="126"/>';
  body += '<path d="M108,24 L240,24 L232,10 L116,10 Z"/><path d="M150,10 C160,-2 188,-2 198,10 Z" fill-opacity="0.8"/>';
  body += '<rect x="132" y="30" width="84" height="118" fill-opacity="0.35"/>';
  body += '<path d="M132,30 L172,40 L172,148 L132,148 Z" fill-opacity="0.6"/>';
  // The boy, seated, facing the door.
  body += '<circle cx="72" cy="112" r="7"/><path d="M64,120 C66,116 78,116 80,120 L84,138 C76,136 64,136 58,138 Z"/><path d="M50,146 C54,134 90,134 94,146 Z"/>';
  body += '<rect x="20" y="146" width="240" height="4" rx="2" fill-opacity="0.7"/>';
  write('yama-door', 260, 150, body);
}

// Viṣṇu's serpent bed on the causal ocean, a lotus rising (Saptaśatī 1.49–1.67).
{
  let body = '';
  for (const [cx, rx, ry, o] of [[150, 110, 16, 0.55], [150, 92, 13, 0.8], [150, 74, 10, 1]]) body += `<ellipse cx="${cx}" cy="${132 - (110 - rx) * 0.35}" rx="${rx}" ry="${ry}" fill-opacity="${o}"/>`;
  // Hood of many heads.
  for (let i = -3; i <= 3; i++) {
    const a = (i * Math.PI) / 9;
    const x = 238 + Math.sin(a) * 26;
    const y = 74 - Math.cos(a) * 26;
    body += `<path d="M238,118 Q${r1(238 + Math.sin(a) * 10)},${r1(96 - Math.cos(a) * 6)} ${r1(x)},${r1(y)}" stroke="#000" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    body += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="6" ry="4.5" transform="rotate(${Math.round(i * 20)} ${r1(x)} ${r1(y)})"/>`;
  }
  // Lotus on a stalk from the navel, Brahmā's seat.
  body += '<path d="M146,112 C140,80 130,56 118,40" stroke="#000" stroke-width="2" fill="none" stroke-opacity="0.8"/>';
  body += '<path transform="translate(118 40) scale(0.9)" d="M0,0 C-14,-2 -22,-12 -24,-22 C-14,-18 -8,-12 -6,-6 C-8,-18 -4,-30 0,-36 C4,-30 8,-18 6,-6 C8,-12 14,-18 24,-22 C22,-12 14,-2 0,0 Z"/>';
  write('shesha', 280, 150, body);
}

// The Devī's triśūla, blazing (Saptaśatī 2.19 and throughout).
{
  let body = '<rect x="97" y="40" width="6" height="110"/>';
  body += '<path d="M100,4 C106,18 108,30 104,46 L96,46 C92,30 94,18 100,4 Z"/>';
  body += '<path d="M72,20 C72,36 80,48 96,50 L96,44 C86,42 80,34 80,22 Z"/><path d="M128,20 C128,36 120,48 104,50 L104,44 C114,42 120,34 120,22 Z"/>';
  body += '<path d="M66,22 L74,8 L82,22 Z M118,22 L126,8 L134,22 Z"/>';
  body += '<rect x="90" y="52" width="20" height="5" rx="2"/><path d="M104,58 C116,62 118,72 110,78 C114,70 108,66 104,66 Z" fill-opacity="0.7"/>';
  for (let i = 0; i < 18; i++) {
    const t = (i * Math.PI * 2) / 18;
    body += `<path fill-opacity="0.35" d="M100,30 L${r1(100 + 62 * Math.cos(t - 0.04))},${r1(30 + 62 * Math.sin(t - 0.04))} L${r1(100 + 62 * Math.cos(t + 0.04))},${r1(30 + 62 * Math.sin(t + 0.04))} Z"/>`;
  }
  write('trishula', 200, 190, `<g transform="translate(0 38)">${body}</g>`);
}

// Faint copies of a band, to stand behind a scene's subject (masks are one colour, so depth is alpha).
for (const [from, to, o] of [['forest', 'forest-far', 0.4], ['city', 'city-far', 0.45]]) {
  const src = readFileSync(join(OUT, `${from}.svg`), 'utf8');
  writeFileSync(join(OUT, `${to}.svg`), src.replace(/(<svg[^>]*>)/, `$1<g opacity="${o}">`).replace('</svg>', '</g></svg>'));
}

console.log(`Wrote chapter scene layers to ${OUT}`);
