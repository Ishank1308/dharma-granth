import { splitPadas } from '@/lib/pada-split';

/**
 * One printed line of a shloka. Each pada is an inline-block, so when the
 * line is too wide for the screen it wraps at the caesura, never inside a pada.
 * On wide screens the padas sit side by side and the line reads as printed.
 */
export function PadaLine({ line }: { line: string }) {
  const padas = splitPadas(line);
  if (padas.length < 2) return <>{line}</>;
  return (
    <>
      {padas.map((pada, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span className="inline-block">{pada}</span>
        </span>
      ))}
    </>
  );
}
