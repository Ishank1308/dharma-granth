#!/usr/bin/env node
/**
 * Draws the chapter paintings: one small full-colour animated SVG per kind of
 * setting a chapter can have (Kurukshetra at dawn, a forest āśrama, Kailāsa under
 * the moon, the ocean, a yajña fire...). lib/chapter-paintings.ts picks one for
 * every adhyāya / kāṇḍa / khaṇḍa without a hand-drawn scene, and colour.css
 * paints it behind the verse cards and the chapter's opening.
 *
 * The motion lives inside each SVG (CSS keyframes), so the page loads no JS for
 * it. It stops under prefers-reduced-motion, and `url(scene.svg#still)` (used by
 * the quiet modes) freezes it through `:target`.
 *
 *   node scripts/build-scene-paintings.mjs   → app/styles/paintings/*.svg
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'app', 'styles', 'paintings');
const W = 1200;
const H = 400;

// ── helpers ────────────────────────────────────────────────────────────────
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;
const delay = (s) => `style="animation-delay:-${r1(s)}s"`;

function lin(id, stops, { x2 = 0, y2 = 1 } = {}) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`)
    .join('')}</linearGradient>`;
}
function rad(id, stops, { cx = 0.5, cy = 0.5, r = 0.5 } = {}) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`)
    .join('')}</radialGradient>`;
}
const sky = (id) => `<rect width="${W}" height="${H}" fill="url(#${id})"/>`;

/** A smooth ridge from x0 to x1 at base height y with random peaks. */
function ridge(seed, y, amp, { x0 = 0, x1 = W, step = 80, fill, cls = '' } = {}) {
  const r = rng(seed);
  const pts = [];
  for (let x = x0; x <= x1 + step; x += step) pts.push([x, y - r() * amp]);
  let d = `M${x0} ${H} L${pts[0][0]} ${r1(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, yy] = pts[i];
    d += ` Q${px + step / 2} ${r1(py)} ${r1((px + x) / 2)} ${r1((py + yy) / 2)}`;
  }
  d += ` L${x1 + step} ${H} Z`;
  return `<path ${cls ? `class="${cls}" ` : ''}d="${d}" fill="${fill}"/>`;
}

/** A ridge drawn twice side by side so it can drift without a seam. */
function driftRidge(seed, y, amp, fill, dur) {
  const one = ridge(seed, y, amp, { x0: 0, x1: W, fill });
  return `<g class="d" style="animation-duration:${dur}s">${one}<g transform="translate(${W} 0)">${one}</g></g>`;
}

function stars(seed, n, { y0 = 0, y1 = 220, color = '#fff8e1', rMax = 1.8 } = {}) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    s += `<circle class="t" cx="${r1(r() * W)}" cy="${r1(y0 + r() * (y1 - y0))}" r="${r1(0.5 + r() * rMax)}" fill="${color}" ${delay(r() * 4)}/>`;
  }
  return `<g>${s}</g>`;
}

function birds(seed, n, { y = 90, color = '#3b2416', spread = 260 } = {}) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * spread;
    const yy = y + r() * 50;
    const k = 0.6 + r() * 0.7;
    s += `<path class="flap" d="M${r1(x)} ${r1(yy)} q${r1(7 * k)} ${r1(-6 * k)} ${r1(14 * k)} 0 q${r1(7 * k)} ${r1(-6 * k)} ${r1(14 * k)} 0" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" ${delay(r())}/>`;
  }
  return `<g class="fly">${s}</g>`;
}

function cloud(x, y, s, fill, op = 0.8) {
  return `<g opacity="${op}" fill="${fill}" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="70" ry="16"/><ellipse cx="-26" cy="-10" rx="30" ry="18"/><ellipse cx="18" cy="-14" rx="36" ry="22"/></g>`;
}
function clouds(seed, n, { y0 = 40, y1 = 140, fill = '#fff', op = 0.7, dur = 120 } = {}) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) s += cloud(r1(r() * W), r1(y0 + r() * (y1 - y0)), r1(0.6 + r() * 0.9), fill, op);
  return `<g class="d" style="animation-duration:${dur}s">${s}<g transform="translate(${W} 0)">${s}</g></g>`;
}

/** Water: horizontal bands that slide past each other. */
function water(y, colors, { amp = 6, len = 60 } = {}) {
  let s = '';
  colors.forEach((c, i) => {
    const yy = y + i * ((H - y) / colors.length);
    let d = `M0 ${r1(yy)}`;
    for (let x = 0; x < W * 2; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
    d += ` V${H} H0 Z`;
    s += `<path class="${i % 2 ? 'wv2' : 'wv'}" d="${d}" fill="${c}" ${delay(i * 1.7)}/>`;
  });
  return s;
}
/** Short glints on water. */
function glints(seed, n, { y0, y1, color = '#fff6d5' }) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const w = 10 + r() * 30;
    s += `<rect class="t" x="${r1(r() * W)}" y="${r1(y0 + r() * (y1 - y0))}" width="${r1(w)}" height="2" rx="1" fill="${color}" ${delay(r() * 4)}/>`;
  }
  return s;
}

function flame(x, y, s, { id = 'fl', d = 0 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="f" ${delay(d)}><path d="M0 0 C-14 -10 -16 -30 -4 -52 C-2 -40 6 -36 8 -46 C18 -30 16 -8 0 0 Z" fill="url(#${id})"/><path d="M0 -2 C-6 -8 -6 -20 0 -30 C4 -20 6 -10 0 -2 Z" fill="#fff4c2" opacity=".9"/></g></g>`;
}
function glow(x, y, rr, id = 'gl', cls = 'b', d = 0) {
  return `<circle class="${cls}" cx="${x}" cy="${y}" r="${rr}" fill="url(#${id})" ${delay(d)}/>`;
}

function diya(x, y, s, d = 0) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-14" r="30" fill="url(#gl)" class="b" ${delay(d)}/><path d="M-18 0 Q0 12 18 0 L14 -6 Q0 -2 -14 -6 Z" fill="#8a3b12"/><path d="M-14 -6 Q0 -2 14 -6" stroke="#d97706" stroke-width="2" fill="none"/>${flame(0, -6, 0.32, { d })}</g>`;
}

function lotus(x, y, s, { petal = '#f9a8d4', deep = '#db2777', d = 0 } = {}) {
  const p = (rot, l, c) =>
    `<path d="M0 0 C-10 -${l * 0.4} -9 -${l * 0.8} 0 -${l} C9 -${l * 0.8} 10 -${l * 0.4} 0 0 Z" fill="${c}" transform="rotate(${rot})"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="s" ${delay(d)}>${p(-62, 30, deep)}${p(62, 30, deep)}${p(-34, 38, petal)}${p(34, 38, petal)}${p(0, 44, petal)}<ellipse cx="0" cy="2" rx="26" ry="5" fill="#166534" opacity=".8"/></g></g>`;
}
function lily(x, y, s, fill = '#15803d') {
  return `<path d="M${x} ${y} m${-24 * s} 0 a${24 * s} ${7 * s} 0 1 0 ${48 * s} 0 a${24 * s} ${7 * s} 0 1 0 ${-48 * s} 0 Z M${x} ${y} l${20 * s} ${-3 * s}" fill="${fill}"/>`;
}

function tree(x, y, s, fill, d = 0) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><rect x="-5" y="-60" width="10" height="60"/><g class="s" ${delay(d)}><circle cx="0" cy="-84" r="34"/><circle cx="-30" cy="-66" r="24"/><circle cx="30" cy="-68" r="26"/><circle cx="-14" cy="-110" r="22"/><circle cx="18" cy="-106" r="24"/></g></g>`;
}
function banyan(x, y, s, fill) {
  let roots = '';
  for (let i = -5; i <= 5; i++) if (i) roots += `<rect x="${i * 22 - 1.5}" y="-120" width="3" height="120" opacity=".8"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><path d="M-16 0 Q-10 -60 -6 -110 L6 -110 Q10 -60 16 0 Z"/>${roots}<g class="s" style="animation-duration:9s"><ellipse cx="0" cy="-140" rx="150" ry="46"/><ellipse cx="-80" cy="-160" rx="70" ry="34"/><ellipse cx="70" cy="-168" rx="80" ry="38"/><ellipse cx="0" cy="-186" rx="70" ry="30"/></g></g>`;
}
function pine(x, y, s, fill) {
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -90 L18 -50 L9 -50 L26 -18 L12 -18 L30 0 L-30 0 L-12 -18 L-26 -18 L-9 -50 L-18 -50 Z" fill="${fill}"/>`;
}
function palm(x, y, s, fill, d = 0) {
  const leaf = (rot) => `<path d="M0 0 Q40 -18 82 6 Q40 -6 0 6 Z" transform="rotate(${rot})"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><path d="M-4 0 Q4 -70 14 -150 L20 -150 Q12 -70 6 0 Z"/><g transform="translate(17 -150)"><g class="s" ${delay(d)}>${leaf(-20)}${leaf(20)}${leaf(160)}${leaf(200)}${leaf(-70)}${leaf(250)}</g></g></g>`;
}

function flag(x, y, h, color, d = 0, pole = '#3a2414') {
  return `<g transform="translate(${x} ${y})"><rect x="-1.5" y="${-h}" width="3" height="${h}" fill="${pole}"/><path class="flag" d="M1.5 ${-h} L${h * 0.42} ${-h + h * 0.13} L1.5 ${-h + h * 0.26} Z" fill="${color}" ${delay(d)}/></g>`;
}

function temple(x, y, s, fill, { kalash = '#f6c768', flagColor = '#f97316', d = 0 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g fill="${fill}"><rect x="-70" y="-60" width="140" height="60"/><path d="M-52 -60 C-50 -130 -24 -190 0 -214 C24 -190 50 -130 52 -60 Z"/><path d="M-70 -60 L-90 -60 L-90 -96 C-90 -112 -70 -120 -70 -120 Z"/><path d="M70 -60 L90 -60 L90 -96 C90 -112 70 -120 70 -120 Z"/><rect x="-14" y="-40" width="28" height="40" rx="14" fill="#000" opacity=".35"/></g><ellipse cx="0" cy="-220" rx="9" ry="7" fill="${kalash}"/>${flag(0, -226, 48, flagColor, d)}</g>`;
}

function mountain(x, y, w, h, fill, snow) {
  const sx = w * 0.18;
  return `<g><path d="M${x - w / 2} ${y} L${x - w * 0.08} ${y - h} Q${x} ${y - h - 12} ${x + w * 0.08} ${y - h} L${x + w / 2} ${y} Z" fill="${fill}"/>${
    snow
      ? `<path d="M${x - sx} ${y - h + h * 0.34} L${x - w * 0.08} ${y - h} Q${x} ${y - h - 12} ${x + w * 0.08} ${y - h} L${x + sx} ${y - h + h * 0.34} L${x + sx * 0.4} ${y - h + h * 0.26} L${x} ${y - h + h * 0.36} L${x - sx * 0.5} ${y - h + h * 0.25} Z" fill="${snow}"/>`
      : ''
  }</g>`;
}

function crescent(x, y, rr, fill = '#fff7d6') {
  return `<g class="b" style="animation-duration:8s"><circle cx="${x}" cy="${y}" r="${rr * 2.4}" fill="url(#moonglow)"/></g><path d="M${x} ${y - rr} A${rr} ${rr} 0 1 0 ${x} ${y + rr} A${rr * 1.3} ${rr * 1.3} 0 0 1 ${x} ${y - rr} Z" fill="${fill}" transform="rotate(-25 ${x} ${y})"/>`;
}

function sunDisk(x, y, rr, id, { rays = false, rayColor = '#fde68a' } = {}) {
  let rs = '';
  if (rays) {
    for (let i = 0; i < 24; i++) rs += `<rect x="-2" y="${-rr * 3.2}" width="4" height="${rr * 1.5}" rx="2" transform="rotate(${i * 15})" fill="${rayColor}" opacity=".35"/>`;
    rs = `<g transform="translate(${x} ${y})"><g class="r">${rs}</g></g>`;
  }
  return `${rs}<circle class="b" cx="${x}" cy="${y}" r="${rr * 2.6}" fill="url(#sunglow)" style="animation-duration:7s"/><circle cx="${x}" cy="${y}" r="${rr}" fill="url(#${id})"/>`;
}

function rising(seed, n, { x0, x1, y, color = '#fde68a', rMax = 2.5, dur = 6 }) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    s += `<circle class="u" cx="${r1(x0 + r() * (x1 - x0))}" cy="${r1(y - r() * 10)}" r="${r1(0.8 + r() * rMax)}" fill="${color}" style="animation-delay:-${r1(r() * dur)}s;animation-duration:${r1(dur * (0.7 + r() * 0.6))}s"/>`;
  }
  return s;
}

function smoke(x, y, { color = '#e7e5e4', n = 3, dur = 9 } = {}) {
  let s = '';
  for (let i = 0; i < n; i++)
    s += `<ellipse class="smoke" cx="${x}" cy="${y}" rx="14" ry="10" fill="${color}" style="animation-delay:-${r1((dur / n) * i)}s;animation-duration:${dur}s"/>`;
  return s;
}

function hut(x, y, s, fill, roof) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-34" width="68" height="34" fill="${fill}"/><path d="M-50 -30 Q0 -84 50 -30 Z" fill="${roof}"/><rect x="-8" y="-24" width="16" height="24" fill="#000" opacity=".35"/></g>`;
}

function deer(x, y, s, fill, flip = false) {
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" fill="${fill}"><path d="M-30 -30 Q-10 -40 20 -32 L28 -48 L24 -62 L30 -50 L34 -64 L34 -48 L30 -38 L36 -36 L30 -30 L24 -24 L22 0 L18 0 L16 -20 L-14 -20 L-18 0 L-22 0 L-24 -22 Q-34 -24 -30 -30 Z"/></g>`;
}

function yogi(x, y, s, fill) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><circle cx="0" cy="-92" r="13"/><path d="M0 -106 q-6 -10 0 -18 q6 8 0 18 Z"/><path d="M-10 -78 Q-22 -60 -26 -36 L-36 -34 Q-60 -26 -64 -10 Q-40 2 0 2 Q40 2 64 -10 Q60 -26 36 -34 L26 -36 Q22 -60 10 -78 Z"/><path d="M-26 -36 Q-40 -22 -46 -16 L-36 -14 Z M26 -36 Q40 -22 46 -16 L36 -14 Z"/></g>`;
}

function wheel(x, y, rr, stroke, cls = 'r') {
  let sp = '';
  for (let i = 0; i < 12; i++) sp += `<line x1="0" y1="0" x2="0" y2="${-rr}" transform="rotate(${i * 30})"/>`;
  return `<g transform="translate(${x} ${y})"><g class="${cls}" stroke="${stroke}" fill="none" stroke-width="${rr / 14}">${sp}<circle r="${rr}" stroke-width="${rr / 7}"/><circle r="${rr * 0.16}" fill="${stroke}"/></g></g>`;
}

function trishula(x, y, s, fill) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><rect x="-3" y="-150" width="6" height="150"/><path d="M0 -200 L8 -170 L4 -150 L-4 -150 L-8 -170 Z"/><path d="M-4 -150 Q-38 -150 -40 -190 L-32 -176 Q-28 -160 -4 -158 Z"/><path d="M4 -150 Q38 -150 40 -190 L32 -176 Q28 -160 4 -158 Z"/><rect x="-12" y="-136" width="24" height="10" rx="5"/></g>`;
}

function peacockFeather(x, y, s, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><g class="s" style="animation-duration:5s"><path d="M0 0 Q2 -60 0 -120" stroke="#a3a35b" stroke-width="2" fill="none"/><ellipse cx="0" cy="-130" rx="22" ry="30" fill="#15803d" opacity=".85"/><ellipse cx="0" cy="-128" rx="14" ry="19" fill="#0e7490"/><ellipse cx="0" cy="-126" rx="8" ry="11" fill="#1e3a8a"/><ellipse cx="0" cy="-124" rx="4" ry="5" fill="#f6c768"/></g></g>`;
}

function notes(seed, n, { x0, x1, y, color }) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = r1(x0 + r() * (x1 - x0));
    s += `<g class="u" style="animation-delay:-${r1(r() * 8)}s;animation-duration:${r1(7 + r() * 4)}s"><path d="M${x} ${y} v-18 l10 -4 v16" stroke="${color}" stroke-width="2" fill="none"/><ellipse cx="${x - 3}" cy="${y}" rx="4" ry="3" fill="${color}"/></g>`;
  }
  return s;
}

function chhatri(x, y, s, fill) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><rect x="-30" y="-50" width="6" height="50"/><rect x="24" y="-50" width="6" height="50"/><rect x="-36" y="-56" width="72" height="8"/><path d="M-30 -56 Q0 -100 30 -56 Z"/><rect x="-2" y="-110" width="4" height="14"/></g>`;
}

function palace(x, y, s, fill, flagColor) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g fill="${fill}"><rect x="-200" y="-90" width="400" height="90"/><rect x="-140" y="-150" width="280" height="64"/><path d="M-60 -150 Q0 -240 60 -150 Z"/><rect x="-4" y="-250" width="8" height="22"/>${[-170, 170]
    .map((cx) => `<rect x="${cx - 26}" y="-150" width="52" height="64"/><path d="M${cx - 26} -150 Q${cx} -200 ${cx + 26} -150 Z"/>`)
    .join('')}</g>${[-160, -100, -40, 20, 80, 140]
    .map((ax) => `<path d="M${ax} 0 V-46 Q${ax + 20} -70 ${ax + 40} -46 V0 Z" fill="#000" opacity=".28"/>`)
    .join('')}${[-90, -30, 30, 90].map((wx) => `<rect x="${wx - 8}" y="-134" width="16" height="26" rx="8" fill="#fcd34d" class="t" opacity=".8"/>`).join('')}${flag(0, -248, 56, flagColor, 0)}${flag(-170, -196, 40, flagColor, 1)}${flag(170, -196, 40, flagColor, 2)}</g>`;
}

function rays(x, y, n, len, color, { op = 0.25, width = 18, cls = 'r' } = {}) {
  let s = '';
  for (let i = 0; i < n; i++)
    s += `<path d="M0 0 L${-width / 2} ${-len} L${width / 2} ${-len} Z" transform="rotate(${(360 / n) * i})" fill="${color}" opacity="${op}"/>`;
  return `<g transform="translate(${x} ${y})"><g class="${cls}">${s}</g></g>`;
}

const STYLE = `
.d{animation:d 90s linear infinite}@keyframes d{to{transform:translateX(-${W}px)}}
.s{transform-box:fill-box;transform-origin:50% 100%;animation:s 6s ease-in-out infinite alternate}@keyframes s{from{transform:rotate(-2.2deg)}to{transform:rotate(2.2deg)}}
.f{transform-box:fill-box;transform-origin:50% 100%;animation:f 1.4s ease-in-out infinite alternate}@keyframes f{0%{transform:scale(1,1) skewX(0)}35%{transform:scale(.9,1.1) skewX(3deg)}70%{transform:scale(1.06,.94) skewX(-2deg)}100%{transform:scale(.96,1.05) skewX(1deg)}}
.t{animation:t 3.2s ease-in-out infinite alternate}@keyframes t{from{opacity:.15}to{opacity:1}}
.r{transform-box:fill-box;transform-origin:center;animation:r 140s linear infinite}@keyframes r{to{transform:rotate(360deg)}}
.rr{transform-box:fill-box;transform-origin:center;animation:r 220s linear infinite reverse}
.u{animation:u 7s linear infinite}@keyframes u{from{transform:translateY(0);opacity:0}15%{opacity:.9}to{transform:translateY(-170px);opacity:0}}
.b{transform-box:fill-box;transform-origin:center;animation:b 5s ease-in-out infinite}@keyframes b{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.07);opacity:1}}
.wv{animation:wv 11s linear infinite}@keyframes wv{to{transform:translateX(-120px)}}
.wv2{animation:wv2 15s linear infinite}@keyframes wv2{from{transform:translateX(-120px)}to{transform:translateX(0)}}
.flag{transform-box:fill-box;transform-origin:0 50%;animation:flag 1.8s ease-in-out infinite alternate}@keyframes flag{from{transform:skewY(-6deg) scaleX(.92)}to{transform:skewY(6deg) scaleX(1.04)}}
.fly{animation:fly 60s linear infinite}@keyframes fly{from{transform:translateX(-300px)}to{transform:translateX(${W + 40}px)}}
.flap{transform-box:fill-box;transform-origin:center;animation:flap .9s ease-in-out infinite alternate}@keyframes flap{to{transform:scaleY(.4)}}
.smoke{transform-box:fill-box;transform-origin:center;animation:smoke 9s ease-out infinite}@keyframes smoke{from{transform:translate(0,0) scale(.5);opacity:0}15%{opacity:.32}to{transform:translate(40px,-190px) scale(3.2);opacity:0}}
.ripple{transform-box:fill-box;transform-origin:center;animation:ripple 6s ease-out infinite}@keyframes ripple{from{transform:scale(.3);opacity:.8}to{transform:scale(2.4);opacity:0}}
.float{animation:float 26s linear infinite}@keyframes float{from{transform:translateX(0)}to{transform:translateX(-${W}px)}}
.bob{animation:bob 4s ease-in-out infinite alternate}@keyframes bob{to{transform:translateY(5px)}}
.bolt{animation:bolt 7s steps(1) infinite}@keyframes bolt{0%,88%,92%,100%{opacity:0}89%,91%{opacity:1}}
.flash{animation:flash 7s ease-out infinite}@keyframes flash{0%,88%{opacity:0}89%{opacity:.5}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
#still:target~*,#still:target~* *{animation:none!important}
`.replace(/\n/g, '');

const COMMON_DEFS = [
  lin('fl', [[0, '#fff1a8'], [0.45, '#fb923c'], [1, '#dc2626']], { y2: 0 }),
  rad('gl', [[0, '#ffd27a', 0.75], [1, '#ffb347', 0]]),
  rad('sunglow', [[0, '#ffe7a3', 0.85], [1, '#ffb347', 0]]),
  rad('moonglow', [[0, '#fff7d6', 0.5], [1, '#fff7d6', 0]]),
].join('');

function svg(title, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice"><title>${title}</title><style>${STYLE}</style><defs>${COMMON_DEFS}${defs}</defs><g id="still"/><g>${body}</g></svg>\n`;
}

// ── scenes ─────────────────────────────────────────────────────────────────
const SCENES = {
  // Gītā 1–2, the war parvas: dawn over the field, banners and a chariot wheel in the dust.
  kurukshetra: () =>
    svg(
      'Kurukshetra at dawn',
      lin('k-sky', [[0, '#7c2d12'], [0.45, '#ea580c'], [0.75, '#fbbf24'], [1, '#fde68a']]) +
        rad('k-sun', [[0, '#fff7d6'], [1, '#fcd34d']]) +
        lin('k-dust', [[0, '#fde68a', 0], [1, '#b45309', 0.55]]),
      sky('k-sky') +
        sunDisk(600, 250, 52, 'k-sun', { rays: true, rayColor: '#fff1c1' }) +
        birds(3, 7, { y: 70, color: '#431407' }) +
        ridge(11, 300, 30, { fill: '#9a3412', step: 120 }) +
        Array.from({ length: 22 }, (_, i) => flag(30 + i * 55 + (i % 3) * 6, 318 - (i % 2) * 8, 70 + (i % 4) * 14, i % 2 ? '#fde047' : '#dc2626', i * 0.37, '#431407')).join('') +
        `<rect y="300" width="${W}" height="100" fill="url(#k-dust)"/>` +
        ridge(12, 360, 16, { fill: '#431407', step: 140 }) +
        wheel(960, 330, 64, '#2a0f05', 'r') +
        flag(880, 360, 190, '#f97316', 0.4, '#2a0f05') +
        rising(14, 26, { x0: 0, x1: W, y: 390, color: '#fde68a', rMax: 2, dur: 9 }),
    ),

  // Gītā 11, Virāṭ forms: a thousand suns.
  vishvarupa: () =>
    svg(
      'The cosmic form',
      rad('v-sky', [[0, '#4c1d95'], [0.55, '#1e1b4b'], [1, '#05040f']], { cy: 0.62, r: 0.75 }) +
        rad('v-core', [[0, '#fffbeb'], [0.35, '#fde68a'], [1, '#f59e0b', 0]]),
      sky('v-sky') +
        stars(5, 160, { y0: 0, y1: H, rMax: 1.6 }) +
        rays(600, 240, 36, 420, '#fde68a', { op: 0.16, width: 26, cls: 'r' }) +
        rays(600, 240, 24, 300, '#f472b6', { op: 0.14, width: 18, cls: 'rr' }) +
        Array.from({ length: 5 }, (_, i) => `<circle class="ripple" cx="600" cy="240" r="90" fill="none" stroke="#fde68a" stroke-width="2" style="animation-delay:-${i * 1.2}s"/>`).join('') +
        `<circle class="b" cx="600" cy="240" r="140" fill="url(#v-core)"/>` +
        Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return `<circle class="t" cx="${r1(600 + Math.cos(a) * 250)}" cy="${r1(240 + Math.sin(a) * 150)}" r="7" fill="#fff7d6" ${delay(i * 0.4)}/>`;
        }).join('') +
        ridge(21, 380, 18, { fill: '#05040f', step: 150 }),
    ),

  // Dhyāna, yoga, svara: a yogī under the crescent, breath rings rising.
  yogi: () =>
    svg(
      'A yogi in meditation',
      lin('y-sky', [[0, '#0f172a'], [0.55, '#312e81'], [1, '#7c3aed']]) + rad('y-aura', [[0, '#c4b5fd', 0.55], [1, '#c4b5fd', 0]]),
      sky('y-sky') +
        stars(7, 90, { y0: 0, y1: 240 }) +
        crescent(930, 90, 26) +
        mountain(260, 330, 520, 190, '#1e1b4b', '#c7d2fe') +
        mountain(820, 340, 700, 150, '#27235f', '#a5b4fc') +
        ridge(31, 340, 18, { fill: '#1e1b4b', step: 120 }) +
        Array.from({ length: 4 }, (_, i) => `<circle class="ripple" cx="600" cy="300" r="60" fill="none" stroke="#ddd6fe" stroke-width="1.5" style="animation-delay:-${i * 1.5}s"/>`).join('') +
        `<circle class="b" cx="600" cy="300" r="110" fill="url(#y-aura)"/>` +
        `<rect y="352" width="${W}" height="48" fill="#120f35"/>` +
        yogi(600, 356, 0.95, '#0b0a24') +
        rising(32, 14, { x0: 480, x1: 720, y: 330, color: '#e9d5ff', rMax: 1.6, dur: 8 }),
    ),

  // Upaniṣads, sūtras, Naimiṣāraṇya: a forest āśrama at first light.
  ashram: () =>
    svg(
      'A forest ashram',
      lin('a-sky', [[0, '#fef3c7'], [0.6, '#fde68a'], [1, '#bbf7d0']]) + rad('a-sun', [[0, '#fffbeb'], [1, '#fcd34d']]) + lin('a-ground', [[0, '#4d7c0f'], [1, '#365314']]),
      sky('a-sky') +
        sunDisk(820, 170, 40, 'a-sun') +
        rays(820, 170, 18, 520, '#fff7d6', { op: 0.35, width: 40, cls: 'r' }) +
        clouds(41, 5, { fill: '#fffbeb', op: 0.7, dur: 160 }) +
        birds(42, 5, { y: 80, color: '#57534e' }) +
        ridge(43, 290, 40, { fill: '#86b36b', step: 140 }) +
        ridge(44, 320, 30, { fill: '#5d8f3e', step: 110 }) +
        `<rect y="340" width="${W}" height="60" fill="url(#a-ground)"/>` +
        banyan(260, 352, 1.05, '#2f4f1d') +
        hut(640, 354, 1, '#a16207', '#78350f') +
        flame(720, 352, 0.45) +
        smoke(720, 330, { color: '#f5f5f4' }) +
        tree(1040, 356, 1, '#3f6b25', 1) +
        tree(1130, 360, 0.7, '#2f4f1d', 2) +
        deer(500, 360, 0.7, '#5c3a1e') +
        deer(880, 366, 0.55, '#6b4423', true),
    ),

  // Yajña: the fire altar, flames and sparks.
  yajna: () =>
    svg(
      'The sacred fire',
      lin('j-sky', [[0, '#451a03'], [0.6, '#9a3412'], [1, '#f59e0b']]) + rad('j-glow', [[0, '#fde68a', 0.9], [0.5, '#f97316', 0.4], [1, '#f97316', 0]]),
      sky('j-sky') +
        stars(51, 40, { y0: 0, y1: 160, color: '#fde68a' }) +
        `<circle class="b" cx="600" cy="300" r="260" fill="url(#j-glow)"/>` +
        smoke(560, 220, { color: '#fed7aa', n: 4, dur: 10 }) +
        smoke(650, 230, { color: '#fde68a', n: 3, dur: 12 }) +
        flame(600, 312, 2.6, { d: 0 }) +
        flame(548, 316, 1.6, { d: 0.5 }) +
        flame(652, 316, 1.7, { d: 0.9 }) +
        flame(574, 318, 1.2, { d: 0.3 }) +
        flame(628, 318, 1.3, { d: 1.1 }) +
        rising(52, 34, { x0: 520, x1: 680, y: 300, color: '#fde68a', rMax: 2.4, dur: 5 }) +
        `<path d="M440 320 H760 L740 344 H460 Z" fill="#7c2d12"/><path d="M460 344 H740 L720 372 H480 Z" fill="#5a1f0b"/><path d="M480 372 H720 L700 400 H500 Z" fill="#431407"/>` +
        `<rect y="380" width="${W}" height="20" fill="#2a0f05"/>` +
        diya(330, 384, 1.2, 0.3) +
        diya(870, 384, 1.2, 1.2) +
        `<g fill="#2a0f05"><path d="M250 400 q8 -40 -4 -80 l10 0 q10 40 4 80 Z"/><path d="M944 400 q-8 -40 4 -80 l-10 0 q-10 40 -4 80 Z"/></g>`,
    ),

  // Ṛgveda, Sāmaveda, sandhyā: Uṣas, the dawn, over the river.
  dawn: () =>
    svg(
      'Dawn over the river',
      lin('u-sky', [[0, '#1e3a8a'], [0.35, '#be185d'], [0.65, '#fb923c'], [1, '#fde68a']]) + rad('u-sun', [[0, '#fffbeb'], [1, '#fbbf24']]),
      sky('u-sky') +
        stars(61, 30, { y0: 0, y1: 90 }) +
        rays(600, 300, 28, 520, '#fff1c1', { op: 0.18, width: 30, cls: 'r' }) +
        sunDisk(600, 300, 58, 'u-sun') +
        clouds(62, 6, { y0: 90, y1: 200, fill: '#fecdd3', op: 0.55, dur: 140 }) +
        birds(63, 6, { y: 120, color: '#3b0764' }) +
        ridge(64, 300, 26, { fill: '#7c2d12', step: 140 }) +
        `<rect y="300" width="${W}" height="100" fill="#f59e0b" opacity=".55"/>` +
        water(300, ['#fbbf24', '#f97316', '#c2410c', '#9a3412'], { amp: 4, len: 80 }) +
        `<rect x="560" y="304" width="80" height="96" fill="#fff7d6" opacity=".35"/>` +
        glints(65, 26, { y0: 310, y1: 395 }) +
        palm(120, 312, 0.9, '#3b0d0c') +
        palm(1090, 316, 1.05, '#3b0d0c', 1.3),
    ),

  // Gaṅgā and the tīrthas: ghāṭs, temples and lamps drifting on the river.
  ganga: () =>
    svg(
      'The sacred river',
      lin('g-sky', [[0, '#0c4a6e'], [0.5, '#7c3aed'], [0.85, '#f472b6'], [1, '#fdba74']]),
      sky('g-sky') +
        stars(71, 40, { y0: 0, y1: 120 }) +
        crescent(1020, 70, 18) +
        `<g fill="#2e1065">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${i * 180 - 10}" y="${210 + (i % 3) * 10}" width="170" height="${70 - (i % 3) * 10}"/>`).join('')}</g>` +
        temple(200, 230, 0.55, '#3b0764', { d: 0 }) +
        temple(560, 222, 0.7, '#3b0764', { d: 0.7 }) +
        temple(930, 228, 0.6, '#3b0764', { d: 1.4 }) +
        `<g fill="#4c1d95">${[0, 1, 2, 3, 4].map((i) => `<rect y="${280 + i * 6}" width="${W}" height="3" opacity=".7"/>`).join('')}</g>` +
        `<rect y="290" width="${W}" height="110" fill="#1e1b4b"/>` +
        water(296, ['#312e81', '#3730a3', '#4338ca'], { amp: 3, len: 90 }) +
        glints(72, 30, { y0: 300, y1: 395, color: '#fcd34d' }) +
        `<g class="float">${[0, 1].map((k) => Array.from({ length: 9 }, (_, i) => `<g class="bob" ${delay(i * 0.7)}>${diya(k * W + 60 + i * 135, 330 + (i % 3) * 22, 0.8, i * 0.4)}</g>`).join('')).join('')}</g>`,
    ),

  // Śiva: Kailāsa under the crescent moon.
  kailash: () =>
    svg(
      'Mount Kailash',
      lin('s-sky', [[0, '#020617'], [0.6, '#1e293b'], [1, '#334155']]) + lin('s-peak', [[0, '#e2e8f0'], [1, '#64748b']]),
      sky('s-sky') +
        stars(81, 140, { y0: 0, y1: 260 }) +
        crescent(760, 80, 30) +
        mountain(600, 360, 640, 290, 'url(#s-peak)', '#f8fafc') +
        mountain(240, 370, 520, 170, '#334155', '#cbd5e1') +
        mountain(980, 370, 560, 190, '#334155', '#cbd5e1') +
        clouds(82, 5, { y0: 230, y1: 300, fill: '#e2e8f0', op: 0.35, dur: 110 }) +
        ridge(83, 360, 16, { fill: '#0f172a', step: 120 }) +
        trishula(240, 400, 0.9, '#0b1120') +
        `<g transform="translate(240 230)"><circle r="10" fill="none" stroke="#0b1120" stroke-width="3"/></g>` +
        rising(84, 18, { x0: 0, x1: W, y: 380, color: '#e0f2fe', rMax: 1.4, dur: 10 }),
    ),

  // The ocean: Sundara's leap, Matsya, Varāha, the churning.
  ocean: () =>
    svg(
      'The ocean',
      lin('o-sky', [[0, '#082f49'], [0.55, '#0e7490'], [1, '#67e8f9']]) + lin('o-sea', [[0, '#0e7490'], [1, '#082f49']]),
      sky('o-sky') +
        stars(91, 50, { y0: 0, y1: 150 }) +
        sunDisk(860, 150, 38, 'o-moon') +
        `<defs>${rad('o-moon', [[0, '#ffffff'], [1, '#e0f2fe']])}</defs>` +
        clouds(92, 5, { y0: 60, y1: 170, fill: '#cffafe', op: 0.35, dur: 130 }) +
        birds(93, 4, { y: 90, color: '#083344' }) +
        `<rect y="230" width="${W}" height="170" fill="url(#o-sea)"/>` +
        water(232, ['#0891b2', '#0e7490', '#155e75', '#164e63', '#083344'], { amp: 7, len: 100 }) +
        glints(94, 40, { y0: 236, y1: 395, color: '#ecfeff' }) +
        `<rect x="830" y="236" width="60" height="164" fill="#ecfeff" opacity=".18"/>` +
        `<g class="bob"><path d="M150 300 Q190 240 230 300 Q190 286 150 300 Z" fill="#0f172a" opacity=".7"/></g>`,
    ),

  // Araṇya, vana: the deep forest, fireflies and deer.
  forest: () =>
    svg(
      'The deep forest',
      lin('f-sky', [[0, '#052e16'], [0.6, '#14532d'], [1, '#4d7c0f']]) + rad('f-light', [[0, '#fef9c3', 0.6], [1, '#fef9c3', 0]]),
      sky('f-sky') +
        `<circle class="b" cx="620" cy="120" r="240" fill="url(#f-light)"/>` +
        rays(620, -40, 14, 460, '#fef9c3', { op: 0.12, width: 60, cls: 'r' }) +
        Array.from({ length: 13 }, (_, i) => pine(40 + i * 95, 300 + (i % 2) * 14, 1.5 + (i % 3) * 0.3, '#14532d')).join('') +
        Array.from({ length: 9 }, (_, i) => tree(70 + i * 140, 350, 1.1 + (i % 2) * 0.4, '#052e16', i * 0.6)).join('') +
        `<rect y="350" width="${W}" height="50" fill="#022c12"/>` +
        deer(560, 372, 0.95, '#011a0b') +
        deer(700, 376, 0.7, '#011a0b', true) +
        stars(101, 40, { y0: 220, y1: 380, color: '#fef08a', rMax: 2.2 }),
    ),

  // Ayodhyā, the courts: a palace at golden hour, flags flying.
  palace: () =>
    svg(
      'A royal palace',
      lin('p-sky', [[0, '#1e3a8a'], [0.5, '#c2410c'], [0.85, '#fbbf24'], [1, '#fde68a']]) + rad('p-sun', [[0, '#fffbeb'], [1, '#fbbf24']]),
      sky('p-sky') +
        sunDisk(960, 200, 44, 'p-sun') +
        clouds(111, 5, { y0: 60, y1: 170, fill: '#fed7aa', op: 0.6, dur: 150 }) +
        birds(112, 6, { y: 90, color: '#431407' }) +
        palace(600, 344, 1.05, '#5b1d0e', '#facc15') +
        chhatri(220, 344, 1.2, '#6b2410') +
        chhatri(980, 344, 1.2, '#6b2410') +
        `<rect y="340" width="${W}" height="60" fill="#3b1208"/>` +
        palm(90, 352, 0.9, '#2a0d05') +
        palm(1120, 352, 0.95, '#2a0d05', 1),
    ),

  // Laṅkā, Yuddha: the city ablaze at night.
  lanka: () =>
    svg(
      'Lanka ablaze',
      lin('l-sky', [[0, '#0c0a09'], [0.5, '#450a0a'], [1, '#dc2626']]) + rad('l-glow', [[0, '#fb923c', 0.8], [1, '#fb923c', 0]]),
      sky('l-sky') +
        stars(121, 40, { y0: 0, y1: 140, color: '#fecaca' }) +
        `<circle class="b" cx="600" cy="330" r="380" fill="url(#l-glow)"/>` +
        `<g fill="#1c0a05">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const x = i * 125; const top = 250 - (i % 3) * 30; return `<rect x="${x}" y="${top}" width="110" height="${400 - top}"/><rect x="${x + 40}" y="${top - 46}" width="30" height="50"/><path d="M${x + 34} ${top - 44} Q${x + 55} ${top - 86} ${x + 76} ${top - 44} Z"/><path d="M${x - 4} ${top} Q${x + 18} ${top - 30} ${x + 40} ${top} Z M${x + 70} ${top} Q${x + 92} ${top - 30} ${x + 114} ${top} Z"/>`; }).join('')}</g>` +
        `<g fill="#fb923c">${Array.from({ length: 30 }, (_, i) => `<rect class="t" x="${(i % 10) * 125 + 18 + ((i * 37) % 60)}" y="${290 + Math.floor(i / 10) * 30}" width="10" height="14" rx="5" ${delay(i * 0.27)}/>`).join('')}</g>` +
        Array.from({ length: 12 }, (_, i) => flame(60 + i * 100, 260 - (i % 3) * 30, 1.4 + (i % 2) * 0.6, { d: i * 0.31 })).join('') +
        rising(122, 40, { x0: 0, x1: W, y: 250, color: '#fdba74', rMax: 2.6, dur: 6 }) +
        smoke(300, 200, { color: '#57534e', n: 3, dur: 12 }) +
        smoke(820, 190, { color: '#57534e', n: 3, dur: 14 }) +
        `<rect y="370" width="${W}" height="30" fill="#0c0a09"/>` +
        `<g stroke="#fde68a" stroke-width="2" opacity=".7">${[0, 1, 2].map((i) => `<line class="fly" x1="${i * 80}" y1="${120 + i * 30}" x2="${i * 80 + 40}" y2="${110 + i * 30}" style="animation-duration:${4 + i}s;animation-delay:-${i * 1.3}s"/>`).join('')}</g>`,
    ),

  // Kṛṣṇa: Vṛndāvana by the Yamunā, a kadamba, a feather and a flute's notes.
  vrindavan: () =>
    svg(
      'Vrindavan by the Yamuna',
      lin('vr-sky', [[0, '#1e1b4b'], [0.5, '#1e40af'], [1, '#60a5fa']]) + lin('vr-river', [[0, '#1d4ed8'], [1, '#172554']]),
      sky('vr-sky') +
        stars(131, 70, { y0: 0, y1: 200 }) +
        sunDisk(220, 110, 34, 'vr-moon') +
        `<defs>${rad('vr-moon', [[0, '#ffffff'], [1, '#dbeafe']])}</defs>` +
        ridge(132, 290, 34, { fill: '#14532d', step: 130 }) +
        `<rect y="300" width="${W}" height="100" fill="url(#vr-river)"/>` +
        water(304, ['#2563eb', '#1d4ed8', '#1e3a8a'], { amp: 4, len: 90 }) +
        glints(133, 26, { y0: 310, y1: 392, color: '#dbeafe' }) +
        `<path d="M0 298 Q300 284 600 300 T1200 296 L1200 310 Q900 318 600 314 T0 330 Z" fill="#166534"/>` +
        `<g transform="translate(860 300)"><path d="M-12 0 Q-8 -90 -2 -140 L8 -140 Q12 -90 16 0 Z" fill="#052e16"/><g class="s" style="animation-duration:8s">${[[-70, -170, 70], [40, -190, 80], [0, -230, 66], [-110, -130, 48], [100, -140, 54]]
          .map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="#14532d"/>`)
          .join('')}${Array.from({ length: 18 }, (_, i) => `<circle class="t" cx="${-120 + ((i * 47) % 240)}" cy="${-260 + ((i * 31) % 150)}" r="5" fill="#fde047" ${delay(i * 0.3)}/>`).join('')}</g></g>` +
        peacockFeather(380, 300, 0.9, -12) +
        `<g transform="translate(470 250) rotate(-18)"><rect x="0" y="-5" width="170" height="10" rx="5" fill="#a16207"/>${[30, 55, 80, 105, 130].map((x) => `<circle cx="${x}" cy="0" r="2.4" fill="#422006"/>`).join('')}<rect x="10" y="-6" width="12" height="12" fill="#dc2626"/></g>` +
        notes(134, 7, { x0: 520, x1: 760, y: 220, color: '#fde68a' }),
    ),

  // Devī: the red sun, the śrī-yantra turning, a trident and lotuses.
  devi: () =>
    svg(
      'The Goddess',
      lin('dv-sky', [[0, '#3f0816'], [0.55, '#9f1239'], [1, '#f97316']]) + rad('dv-sun', [[0, '#fff7d6'], [0.5, '#fb7185'], [1, '#be123c']]),
      sky('dv-sky') +
        stars(141, 30, { y0: 0, y1: 120, color: '#fecdd3' }) +
        `<circle class="b" cx="600" cy="200" r="190" fill="url(#sunglow)"/>` +
        `<circle cx="600" cy="200" r="110" fill="url(#dv-sun)" opacity=".9"/>` +
        `<g transform="translate(600 200)"><g class="r" fill="none" stroke="#fde68a" stroke-width="2.4" opacity=".85">${[0, 1, 2, 3, 4]
          .map((i) => `<path d="M0 ${-100 + i * 10} L${86 - i * 9} ${50 - i * 5} L${-86 + i * 9} ${50 - i * 5} Z"/>`)
          .join('')}${[0, 1, 2, 3]
          .map((i) => `<path d="M0 ${100 - i * 12} L${86 - i * 10} ${-50 + i * 6} L${-86 + i * 10} ${-50 + i * 6} Z"/>`)
          .join('')}<circle r="112"/><circle r="122"/>${Array.from({ length: 16 }, (_, i) => `<path d="M0 -122 Q10 -138 0 -150 Q-10 -138 0 -122 Z" transform="rotate(${i * 22.5})"/>`).join('')}</g></g>` +
        ridge(142, 330, 30, { fill: '#4c0519', step: 120 }) +
        `<rect y="340" width="${W}" height="60" fill="#3f0816"/>` +
        trishula(170, 380, 1.15, '#1f0309') +
        trishula(1030, 380, 1.15, '#1f0309') +
        lotus(420, 372, 1, { petal: '#fda4af', deep: '#e11d48' }) +
        lotus(780, 372, 1, { petal: '#fda4af', deep: '#e11d48', d: 1.2 }) +
        rising(143, 20, { x0: 300, x1: 900, y: 360, color: '#fde68a', rMax: 2, dur: 8 }),
    ),

  // Sṛṣṭi: the golden egg on the dark waters, nebulae turning.
  cosmos: () =>
    svg(
      'Creation: the golden egg',
      rad('c-sky', [[0, '#312e81'], [0.6, '#0f0a2e'], [1, '#020010']], { cy: 0.6, r: 0.8 }) +
        rad('c-egg', [[0, '#fffbeb'], [0.5, '#fcd34d'], [1, '#b45309']], { cx: 0.4, cy: 0.35 }) +
        rad('c-neb', [[0, '#f472b6', 0.45], [1, '#f472b6', 0]]) +
        rad('c-neb2', [[0, '#22d3ee', 0.35], [1, '#22d3ee', 0]]),
      sky('c-sky') +
        `<g transform="translate(600 200)"><g class="r"><ellipse cx="-260" cy="-40" rx="260" ry="90" fill="url(#c-neb)"/><ellipse cx="260" cy="40" rx="240" ry="80" fill="url(#c-neb2)"/></g></g>` +
        stars(151, 200, { y0: 0, y1: 300, rMax: 1.6 }) +
        `<circle class="b" cx="600" cy="220" r="160" fill="url(#sunglow)"/>` +
        `<ellipse cx="600" cy="220" rx="58" ry="74" fill="url(#c-egg)"/>` +
        `<rect y="300" width="${W}" height="100" fill="#0b0726"/>` +
        water(302, ['#1e1b4b', '#17134a', '#0b0726'], { amp: 3, len: 110 }) +
        `<rect x="560" y="304" width="80" height="96" fill="#fcd34d" opacity=".18"/>` +
        glints(152, 22, { y0: 306, y1: 396, color: '#fde68a' }) +
        Array.from({ length: 3 }, (_, i) => `<ellipse class="ripple" cx="600" cy="320" rx="80" ry="12" fill="none" stroke="#fde68a" stroke-width="1.5" style="animation-delay:-${i * 2}s"/>`).join(''),
    ),

  // Bhakti: a lotus pond, lotuses swaying, ripples.
  lotus: () =>
    svg(
      'A lotus pond',
      lin('lt-sky', [[0, '#fdf2f8'], [0.6, '#fbcfe8'], [1, '#fde68a']]) + lin('lt-pond', [[0, '#5eead4'], [1, '#0f766e']]) + rad('lt-sun', [[0, '#fffbeb'], [1, '#fde68a']]),
      sky('lt-sky') +
        sunDisk(300, 120, 40, 'lt-sun') +
        clouds(161, 5, { y0: 40, y1: 160, fill: '#ffffff', op: 0.75, dur: 150 }) +
        birds(162, 5, { y: 70, color: '#9d174d' }) +
        ridge(163, 230, 26, { fill: '#99f6e4', step: 140 }) +
        `<rect y="230" width="${W}" height="170" fill="url(#lt-pond)"/>` +
        water(232, ['#5eead4', '#2dd4bf', '#14b8a6', '#0d9488'], { amp: 3, len: 120 }) +
        glints(164, 30, { y0: 240, y1: 395, color: '#ffffff' }) +
        [[150, 300], [330, 340], [520, 290], [700, 350], [880, 300], [1060, 345]].map(([x, y], i) => lily(x + 40, y + 10, 1.2) + lotus(x, y, 1 + (i % 2) * 0.3, { d: i * 0.8 })).join('') +
        [[260, 280], [620, 330], [980, 280]].map(([x, y], i) => `<ellipse class="ripple" cx="${x}" cy="${y}" rx="40" ry="8" fill="none" stroke="#f0fdfa" stroke-width="1.5" style="animation-delay:-${i * 2}s"/>`).join(''),
    ),

  // Stotra, pūjā: a temple at dusk, the āratī lamps alive.
  temple: () =>
    svg(
      'A temple at dusk',
      lin('t-sky', [[0, '#1e1b4b'], [0.5, '#9d174d'], [1, '#fb923c']]),
      sky('t-sky') +
        stars(171, 50, { y0: 0, y1: 150 }) +
        crescent(1000, 80, 20) +
        birds(172, 5, { y: 100, color: '#1e1b4b' }) +
        ridge(173, 320, 24, { fill: '#4a044e', step: 130 }) +
        temple(600, 350, 1.25, '#2e0a2c', { d: 0 }) +
        temple(300, 352, 0.7, '#3b0d38', { d: 0.8 }) +
        temple(900, 352, 0.7, '#3b0d38', { d: 1.6 }) +
        `<rect y="348" width="${W}" height="52" fill="#1f0520"/>` +
        Array.from({ length: 11 }, (_, i) => diya(90 + i * 102, 380, 1.05, i * 0.35)).join('') +
        `<g fill="#f6c768">${[520, 680].map((x, i) => `<g class="s" style="transform-origin:50% 0;animation-duration:3s;animation-delay:-${i}s"><rect x="${x - 1}" y="236" width="2" height="30"/><path d="M${x - 10} 278 Q${x} 256 ${x + 10} 278 Z"/></g>`).join('')}</g>`,
    ),

  // Preta-kalpa, Yama, the crossing: a lamp boat on the dusk river.
  dusk: () =>
    svg(
      'The river at dusk',
      lin('du-sky', [[0, '#0f172a'], [0.55, '#475569'], [0.85, '#c2410c'], [1, '#f59e0b']]) + lin('du-river', [[0, '#334155'], [1, '#020617']]),
      sky('du-sky') +
        stars(181, 40, { y0: 0, y1: 140 }) +
        sunDisk(780, 260, 36, 'du-sun') +
        `<defs>${rad('du-sun', [[0, '#fde68a'], [1, '#ea580c']])}</defs>` +
        clouds(182, 5, { y0: 120, y1: 220, fill: '#94a3b8', op: 0.35, dur: 160 }) +
        ridge(183, 270, 24, { fill: '#1e293b', step: 150 }) +
        `<rect y="276" width="${W}" height="124" fill="url(#du-river)"/>` +
        water(278, ['#475569', '#334155', '#1e293b', '#0f172a'], { amp: 3, len: 120 }) +
        `<rect x="760" y="280" width="40" height="120" fill="#f59e0b" opacity=".22"/>` +
        glints(184, 24, { y0: 284, y1: 396, color: '#fde68a' }) +
        `<g class="float" style="animation-duration:70s"><g class="bob">${[0, W].map((dx) => `<g transform="translate(${dx + 700} 330)"><path d="M-60 0 Q0 24 60 0 L50 -6 Q0 8 -50 -6 Z" fill="#0b1120"/>${diya(0, -6, 1.1)}</g>`).join('')}</g></g>` +
        `<g fill="#020617">${[0, 1, 2].map((i) => `<path d="M${40 + i * 30} 400 q6 -50 -2 -110 l6 0 q8 60 2 110 Z"/>`).join('')}</g>` +
        birds(185, 3, { y: 160, color: '#020617' }),
    ),

  // Kali-yuga, pralaya, Kalki: storm clouds, lightning, a sword of light on the horizon.
  storm: () =>
    svg(
      'The storm of the age',
      lin('st-sky', [[0, '#020617'], [0.6, '#1e293b'], [1, '#64748b']]),
      sky('st-sky') +
        `<rect class="flash" width="${W}" height="${H}" fill="#e0f2fe"/>` +
        clouds(191, 9, { y0: 30, y1: 180, fill: '#334155', op: 0.9, dur: 70 }) +
        clouds(192, 7, { y0: 60, y1: 200, fill: '#475569', op: 0.7, dur: 50 }) +
        `<path class="bolt" d="M720 40 L690 150 L716 150 L680 270 L760 130 L732 130 L760 40 Z" fill="#f0f9ff"/>` +
        `<path class="bolt" d="M300 60 L284 130 L300 130 L280 210 L326 116 L308 116 L324 60 Z" fill="#f0f9ff" style="animation-delay:-3s"/>` +
        ridge(193, 330, 40, { fill: '#0f172a', step: 120 }) +
        `<rect y="370" width="${W}" height="30" fill="#020617"/>` +
        `<rect x="0" y="328" width="${W}" height="3" fill="#fde68a" opacity=".5" class="t"/>` +
        Array.from({ length: 60 }, (_, i) => `<line x1="${(i * 97) % W}" y1="${(i * 53) % 300}" x2="${((i * 97) % W) - 8}" y2="${((i * 53) % 300) + 22}" stroke="#94a3b8" stroke-width="1" opacity=".5" class="u" style="animation-duration:1.4s;animation-delay:-${r1((i % 10) * 0.14)}s"/>`).join(''),
    ),

  // Dhruva, kāla-cakra, jyotiṣa: the pole star and the turning sky.
  stars: () =>
    svg(
      'The pole star',
      lin('sr-sky', [[0, '#020617'], [0.7, '#172554'], [1, '#1e3a8a']]),
      sky('sr-sky') +
        `<g transform="translate(600 110)"><g class="r" style="animation-duration:90s">${Array.from({ length: 9 }, (_, i) => `<circle r="${60 + i * 52}" fill="none" stroke="#bfdbfe" stroke-width="1" stroke-dasharray="${2 + i} ${10 + i * 3}" opacity="${0.5 - i * 0.04}"/>`).join('')}${(() => {
          const r = rng(201);
          let s = '';
          for (let i = 0; i < 120; i++) {
            const a = r() * Math.PI * 2;
            const d = 40 + r() * 560;
            s += `<circle cx="${r1(Math.cos(a) * d)}" cy="${r1(Math.sin(a) * d)}" r="${r1(0.6 + r() * 1.5)}" fill="#e0f2fe"/>`;
          }
          return s;
        })()}</g></g>` +
        `<circle class="b" cx="600" cy="110" r="40" fill="url(#moonglow)"/><path d="M600 96 L604 106 L614 110 L604 114 L600 124 L596 114 L586 110 L596 106 Z" fill="#fffbeb"/>` +
        ridge(202, 330, 50, { fill: '#0b1530', step: 140 }) +
        ridge(203, 360, 24, { fill: '#050b1c', step: 110 }) +
        `<g transform="translate(600 362) scale(.7)">${yogi(0, 0, 1, '#02050f')}</g>`,
    ),

  // Narasiṃha, Prahlāda: twilight at the threshold, light bursting from the pillar.
  pillar: () =>
    svg(
      'The pillar at twilight',
      lin('pl-sky', [[0, '#1c1917'], [0.5, '#7c2d12'], [1, '#f59e0b']]) + lin('pl-col', [[0, '#57534e'], [0.5, '#a8a29e'], [1, '#57534e']], { x2: 1, y2: 0 }) + rad('pl-burst', [[0, '#fff7d6', 0.95], [0.4, '#fbbf24', 0.6], [1, '#f97316', 0]]),
      sky('pl-sky') +
        stars(211, 30, { y0: 0, y1: 120, color: '#fde68a' }) +
        `<rect x="0" y="300" width="${W}" height="100" fill="#292524"/>` +
        `<path d="M0 300 L1200 300 L1200 316 L0 316 Z" fill="#44403c"/>` +
        rays(600, 210, 30, 520, '#fde68a', { op: 0.2, width: 22, cls: 'r' }) +
        `<circle class="b" cx="600" cy="210" r="200" fill="url(#pl-burst)"/>` +
        `<rect x="560" y="40" width="80" height="262" fill="url(#pl-col)"/><rect x="546" y="30" width="108" height="18" fill="#78716c"/><rect x="546" y="292" width="108" height="14" fill="#78716c"/>` +
        `<path class="t" d="M600 80 L590 130 L606 160 L588 210 L604 250 L596 300" stroke="#fff7d6" stroke-width="5" fill="none" stroke-linejoin="round"/>` +
        `<rect x="180" y="60" width="60" height="242" fill="#3f3a36"/><rect x="960" y="60" width="60" height="242" fill="#3f3a36"/>` +
        diya(320, 300, 1.3, 0.3) +
        diya(880, 300, 1.3, 1) +
        rising(212, 26, { x0: 520, x1: 680, y: 300, color: '#fde68a', rMax: 2.2, dur: 6 }),
    ),

  // Darśana, smṛti, nīti: palm-leaf manuscripts by an oil lamp.
  manuscript: () =>
    svg(
      'Manuscripts by lamplight',
      rad('m-sky', [[0, '#78350f'], [0.6, '#3b1d0a'], [1, '#1c0d04']], { cx: 0.62, cy: 0.7, r: 0.8 }) + lin('m-leaf', [[0, '#f5deb3'], [1, '#d6a35a']]),
      sky('m-sky') +
        `<circle class="b" cx="760" cy="250" r="260" fill="url(#gl)"/>` +
        `<rect y="320" width="${W}" height="80" fill="#2a1406"/><rect y="318" width="${W}" height="4" fill="#4a2a10"/>` +
        [0, 1, 2, 3, 4].map((i) => `<rect x="${240 + i * 4}" y="${300 - i * 9}" width="${420 - i * 8}" height="8" rx="4" fill="url(#m-leaf)" stroke="#8b5a2b" stroke-width="1"/>`).join('') +
        `<rect x="260" y="250" width="380" height="11" rx="5" fill="#7c2d12"/><rect x="260" y="314" width="380" height="8" rx="4" fill="#7c2d12"/>` +
        `<circle cx="330" cy="285" r="3" fill="#7c2d12"/><circle cx="570" cy="285" r="3" fill="#7c2d12"/>` +
        `<g transform="translate(240 230) rotate(-6)"><rect width="300" height="9" rx="4" fill="url(#m-leaf)"/><g fill="#5b3a17" opacity=".7">${Array.from({ length: 14 }, (_, i) => `<rect x="${20 + i * 19}" y="3" width="12" height="2"/>`).join('')}</g></g>` +
        `<g transform="translate(760 318)"><path d="M-46 0 Q0 22 46 0 L38 -12 Q0 -4 -38 -12 Z" fill="#9a3412"/><path d="M-38 -12 Q0 -4 38 -12" stroke="#f59e0b" stroke-width="3" fill="none"/>${flame(0, -12, 1.1)}</g>` +
        smoke(760, 230, { color: '#fde68a', n: 2, dur: 12 }) +
        rising(221, 10, { x0: 730, x1: 790, y: 270, color: '#fde68a', rMax: 1.2, dur: 6 }),
    ),
};

mkdirSync(OUT, { recursive: true });
for (const [id, make] of Object.entries(SCENES)) {
  const s = make();
  writeFileSync(join(OUT, `${id}.svg`), s);
  console.log(`${id}.svg ${(s.length / 1024).toFixed(1)} KB`);
}
