// Colour contrast of the four themes against WCAG 2.1 AA, run with `npm test`.
//
// Glass is translucent, so a colour is checked against the worst thing it can sit on: the theme's
// background under each aurora pool at its strongest (the pool's centre), with the glass laid over it.
// Reads src/theme/themes.ts directly (Node 22.18+ strips the types).
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { THEMES, huesFor, switchOffTrack } = await import('../src/theme/themes.ts');

function parse(css) {
  if (css.startsWith('#')) {
    const h = css.slice(1);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  const [r, g, b, a = 1] = css.match(/[\d.]+/g).map(Number);
  return [r, g, b, a];
}
const over = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3])).concat(1);
function luminance([r, g, b]) {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
const worst = (fg, surfaces) => Math.min(...surfaces.map((s) => ratio(fg[3] < 1 ? over(fg, s) : fg, s)));

/** Small text needs 4.5:1; large text, icons and control outlines 3:1. */
const TEXT = 4.5;
const LARGE = 3;

for (const palette of Object.values(THEMES)) {
  const bg = parse(palette.bg);
  const backdrop = [bg, ...palette.aurora.map((pool) => over(parse(pool), bg))];
  const glass = backdrop.map((s) => over(parse(palette.glass), s));
  const strong = backdrop.map((s) => over(parse(palette.glassStrong), s));
  const hues = huesFor(palette);

  test(`${palette.name}: interface text on glass`, () => {
    for (const key of ['text', 'textSecondary', 'muted', 'accent', 'gold']) {
      const r = worst(parse(palette[key]), glass);
      assert.ok(r >= TEXT, `${key} ${palette[key]} on glass is ${r.toFixed(2)}:1`);
    }
  });

  test(`${palette.name}: text straight on the backdrop`, () => {
    // Notes, subtitles and section counts sit on the aurora with no card behind them.
    for (const key of ['text', 'textSecondary', 'muted']) {
      const r = worst(parse(palette[key]), backdrop);
      assert.ok(r >= TEXT, `${key} ${palette[key]} on the backdrop is ${r.toFixed(2)}:1`);
    }
    // The accent appears there only as large or bold text and icons.
    const r = worst(parse(palette.accent), backdrop);
    assert.ok(r >= LARGE, `accent on the backdrop is ${r.toFixed(2)}:1`);
  });

  test(`${palette.name}: study-layer labels on verse cards`, () => {
    for (const key of ['peacock', 'indigo', 'saffron']) {
      const r = worst(parse(hues[key]), strong);
      assert.ok(r >= TEXT, `${key} ${hues[key]} on a verse card is ${r.toFixed(2)}:1`);
    }
  });

  test(`${palette.name}: labels on the accent gradient`, () => {
    for (const stop of palette.accentGradient) {
      const r = ratio(parse(palette.onAccent), parse(stop));
      assert.ok(r >= TEXT, `${palette.onAccent} on ${stop} is ${r.toFixed(2)}:1`);
    }
  });

  test(`${palette.name}: the switch's off track`, () => {
    const r = worst(parse(switchOffTrack(palette)), strong);
    assert.ok(r >= LARGE, `switch off track on a grouped card is ${r.toFixed(2)}:1`);
  });
}
