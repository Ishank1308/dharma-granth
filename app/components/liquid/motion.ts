/**
 * The one spring every interactive layout shift in the liquid UI uses
 * (dock indicator, shloka focus, palette, bento tilt). Never linear or
 * ease-in-out for layout: Apple-grade spring physics only.
 */
export const SPRING = { type: 'spring', stiffness: 280, damping: 26 } as const;

/** Softer follow for cursor-driven values (tilt, glare), so they trail the pointer like liquid. */
export const FOLLOW_SPRING = { stiffness: 180, damping: 22, mass: 0.6 } as const;
