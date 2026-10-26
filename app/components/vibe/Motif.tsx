import type { MotifId } from '@/lib/scripture-vibes';

/** Each scripture's emblem, drawn in one weight so it can be foil-stamped on a cover or watermarked behind a title. */
export function Motif({ id, className = '' }: { id: MotifId; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {id === 'flame' && (
        <>
          {/* Agni: the sacrificial fire */}
          <path d="M50 92C28 88 21 66 33 49c4 10 10 12 12 8-6-15-2-32 13-46-2 18 8 26 12 40 4-6 4-12 2-18 13 15 11 49-22 59Z" />
          <path d="M50 84c-10-2-14-12-9-21 3 5 6 6 7 4-2-8 1-15 7-21 0 9 5 13 6 20 2-3 2-6 1-9 7 9 4 26-12 27Z" />
          <path d="M30 96h40" />
        </>
      )}
      {id === 'leaf' && (
        <>
          {/* Aśvattha: the sacred fig of the Upanishads */}
          <path d="M50 6c-3 11-10 16-20 24C14 43 13 67 29 80c8 6 16 8 21 14 5-6 13-8 21-14 16-13 15-37-1-50C60 22 53 17 50 6Z" />
          <path d="M50 12v84" />
          <path d="M50 36 34 28M50 36l16-8M50 50 28 42M50 50l22-8M50 64 30 58M50 64l20-6M50 76l-14-4M50 76l14-4" strokeWidth="1.4" />
        </>
      )}
      {id === 'feather' && (
        <>
          {/* Mor-paṅkha: the peacock feather in Krishna's crown */}
          <path d="M50 8c19 12 25 37 12 56-3 5-8 9-12 11-4-2-9-6-12-11C25 45 31 20 50 8Z" />
          <ellipse cx="50" cy="35" rx="11" ry="14" />
          <ellipse cx="50" cy="36" rx="6" ry="8" />
          <circle cx="50" cy="37" r="2.4" fill="currentColor" />
          <path d="M50 75c0 8-2 14-7 21" />
          <path d="M40 62 30 70M60 62l10 8M37 52l-12 4M63 52l12 4" strokeWidth="1.4" />
        </>
      )}
      {id === 'bow' && (
        <>
          {/* Kodaṇḍa: Rama's bow, with the arrow */}
          <path d="M32 8c40 22 40 62 0 84" />
          <path d="M32 8v84" strokeWidth="1.3" />
          <path d="M12 50h78M80 43l11 7-11 7" />
          <path d="M12 50l-4-6M12 50l-4 6M18 50l-4-6M18 50l-4 6" strokeWidth="1.4" />
        </>
      )}
      {id === 'lotus' && (
        <>
          {/* Padma */}
          <path d="M50 20c11 15 11 36 0 52-11-16-11-37 0-52Z" />
          <path d="M50 72c-16-6-26-20-28-36 12 4 22 14 28 36ZM50 72c16-6 26-20 28-36-12 4-22 14-28 36Z" />
          <path d="M50 72c-20 2-36-6-42-16 14-2 30 4 42 16ZM50 72c20 2 36-6 42-16-14-2-30 4-42 16Z" />
          <path d="M20 84c10-4 20 4 30 0s20-4 30 0" strokeWidth="1.4" />
        </>
      )}
      {id === 'trishula' && (
        <>
          {/* Triśūla */}
          <path d="M50 30v66" />
          <path d="M50 5l-6 17 6 8 6-8-6-17Z" />
          <path d="M50 40c-14 0-22-10-22-28 6 8 10 14 18 16M50 40c14 0 22-10 22-28-6 8-10 14-18 16" />
          <path d="M42 46h16" />
          <circle cx="50" cy="56" r="4" />
        </>
      )}
      {id === 'om' && (
        <text x="50" y="58" textAnchor="middle" dominantBaseline="middle" fill="currentColor" stroke="none" fontSize="70" fontFamily="var(--font-sanskrit)">
          ॐ
        </text>
      )}
      {id === 'sutra' && (
        <>
          {/* A bundle of palm-leaf folios on a cord */}
          <rect x="8" y="30" width="84" height="12" rx="6" />
          <rect x="11" y="44" width="78" height="12" rx="6" />
          <rect x="14" y="58" width="72" height="12" rx="6" />
          <circle cx="32" cy="50" r="1.6" fill="currentColor" />
          <circle cx="68" cy="50" r="1.6" fill="currentColor" />
          <path d="M32 22v56M68 22v56" strokeWidth="1.2" />
          <path d="M26 82c6 4 12 4 18 0M62 82c6 4 12 4 18 0" strokeWidth="1.4" />
        </>
      )}
    </svg>
  );
}
