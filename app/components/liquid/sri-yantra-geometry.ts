/**
 * Sri Yantra-inspired geometry, shared by the WebGL hero (SriYantraCanvas) and
 * its server-rendered SVG fallback (SriYantraSvg), so both draw the same figure.
 *
 * Not a ritual-accurate construction: the nine interlocking triangles (four
 * Śiva, apex up; five Śakti, apex down) use proportions close to the classic
 * figure, ringed by the eight- and sixteen-petal lotuses, three circles
 * (trivṛtta) and the gated square (bhūpura). Units: the triangle circle has
 * radius 1. `depth` is each layer's z-offset for the 3D scene.
 */
export type Point = [number, number];

export interface YantraLayer {
  id: string;
  kind: 'shiva' | 'shakti' | 'petal' | 'circle' | 'bhupura';
  paths: Point[][];
  depth: number;
}

function triangle(baseY: number, apexY: number, halfWidth: number): Point[] {
  return [
    [-halfWidth, baseY],
    [halfWidth, baseY],
    [0, apexY],
    [-halfWidth, baseY],
  ];
}

/** Half-width of a triangle whose base touches the unit circle, or a proportional one inside it. */
function halfWidthFor(baseY: number, apexY: number): number {
  const onCircle = Math.sqrt(Math.max(0, 1 - baseY * baseY));
  const proportional = Math.abs(baseY - apexY) * 0.6;
  return Math.min(onCircle, Math.max(proportional, 0.18));
}

function circle(r: number, segments = 96): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

/** One lotus petal: a pointed arch from the inner ring out to its tip, centred on `angle`. */
function petal(angle: number, inner: number, outer: number, spread: number): Point[] {
  const steps = 12;
  const edge = (side: -1 | 1) =>
    Array.from({ length: steps + 1 }, (_, i): Point => {
      const t = i / steps;
      // Wide at the base, narrowing to a point: a convex, flame-like edge.
      const a = angle + side * spread * Math.pow(1 - t, 0.6);
      const r = inner + (outer - inner) * t;
      return [Math.cos(a) * r, Math.sin(a) * r];
    });
  const left = edge(-1);
  const right = edge(1).reverse();
  return [...left, ...right.slice(1)];
}

function lotus(count: number, inner: number, outer: number): Point[][] {
  const spread = Math.PI / count;
  return Array.from({ length: count }, (_, i) => petal((i / count) * Math.PI * 2 + Math.PI / 2, inner, outer, spread * 0.92));
}

/** The square enclosure with a T-shaped gate on each side. */
function bhupura(half: number, gate: number, notch: number): Point[] {
  const h = half;
  const g = gate;
  const n = notch;
  const side: Point[] = [
    [-h, -h],
    [-g, -h],
    [-g, -h - n],
    [g, -h - n],
    [g, -h],
    [h, -h],
  ];
  const rotate = ([x, y]: Point, quarter: number): Point => {
    const a = (quarter * Math.PI) / 2;
    return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  };
  const out: Point[] = [];
  for (let q = 0; q < 4; q++) side.forEach((p, i) => (i < side.length - 1 || q === 3 ? out.push(rotate(p, q)) : null));
  out.push(out[0]);
  return out;
}

const SHIVA: Array<[number, number]> = [
  [-0.78, 1.0],
  [-0.56, 0.66],
  [-0.36, 0.42],
  [-0.2, 0.22],
];
const SHAKTI: Array<[number, number]> = [
  [0.8, -1.0],
  [0.6, -0.12],
  [0.48, -0.72],
  [0.3, -0.44],
  [0.12, -0.3],
];

export const SRI_YANTRA_LAYERS: YantraLayer[] = [
  {
    id: 'bhupura',
    kind: 'bhupura',
    paths: [bhupura(2.05, 0.42, 0.24), bhupura(1.96, 0.36, 0.2)],
    depth: -0.45,
  },
  { id: 'trivrtta', kind: 'circle', paths: [circle(1.78), circle(1.72), circle(1.66)], depth: -0.3 },
  { id: 'lotus-16', kind: 'petal', paths: lotus(16, 1.36, 1.64), depth: -0.2 },
  { id: 'lotus-8', kind: 'petal', paths: lotus(8, 1.06, 1.34), depth: -0.1 },
  { id: 'circle-inner', kind: 'circle', paths: [circle(1.02)], depth: -0.05 },
  ...SHAKTI.map(([b, a], i) => ({
    id: `shakti-${i}`,
    kind: 'shakti' as const,
    paths: [triangle(b, a, halfWidthFor(b, a))],
    depth: 0.06 + i * 0.07,
  })),
  ...SHIVA.map(([b, a], i) => ({
    id: `shiva-${i}`,
    kind: 'shiva' as const,
    paths: [triangle(b, a, halfWidthFor(b, a))],
    depth: 0.1 + i * 0.08,
  })),
];

/** SVG path data for one polyline, scaled into a viewBox centred on 0,0 (y flipped). */
export function toSvgPath(points: Point[], scale: number): string {
  return points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${(x * scale).toFixed(2)} ${(-y * scale).toFixed(2)}`)
    .join(' ');
}
