import { SRI_YANTRA_LAYERS, toSvgPath } from './sri-yantra-geometry';

const SCALE = 100;

const STROKE: Record<string, string> = {
  shiva: 'var(--yantra-ink)',
  shakti: 'var(--yantra-accent)',
  petal: 'var(--yantra-soft)',
  circle: 'var(--yantra-soft)',
  bhupura: 'var(--yantra-soft)',
};

/**
 * The yantra as plain SVG: server-rendered, so the hero is complete without
 * JavaScript. Colours come from --yantra-* (globals.css).
 */
export function SriYantraSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="-230 -230 460 460"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <defs>
        <radialGradient id="yantra-bindu" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--yantra-accent)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--yantra-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {SRI_YANTRA_LAYERS.map((layer) => (
        <g key={layer.id} stroke={STROKE[layer.kind]} strokeWidth={layer.kind === 'shiva' || layer.kind === 'shakti' ? 1.4 : 0.9}>
          {layer.paths.map((path, i) => (
            <path key={i} d={toSvgPath(path, SCALE)} />
          ))}
        </g>
      ))}
      <circle r="14" fill="url(#yantra-bindu)" opacity="0.55" />
      <circle r="3.2" fill="var(--yantra-accent)" />
    </svg>
  );
}
