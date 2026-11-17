import { splitPadas } from '@/lib/pada-split';

/**
 * One printed line of a shloka. Each pada is an inline-block, so when the
 * line is too wide it wraps first at the caesura; exceptionally long padas
 * can wrap inside their text rather than overflowing a narrow phone screen.
 * On wide screens the padas still sit side by side as printed.
 */
export function PadaLine({ line }: { line: string }) {
  const padas = splitPadas(line);
  if (padas.length < 2) return <>{line}</>;
  return (
    <>
      {padas.map((pada, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span className="inline-block max-w-full whitespace-normal [overflow-wrap:anywhere]">{pada}</span>
        </span>
      ))}
    </>
  );
}
