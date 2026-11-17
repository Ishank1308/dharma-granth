/** True when a passage translation points to another verse in the same chapter. */
export function hasPassageReference(value) {
  return (typeof value === 'number' && Number.isFinite(value))
    || (typeof value === 'string' && value.trim().length > 0);
}
