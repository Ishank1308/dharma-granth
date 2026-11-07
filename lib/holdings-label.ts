/**
 * Labels for how much of a scripture is actually in the library.
 * Catalogue figures are never presented as the text a reader can open.
 */

const numberFormat = new Intl.NumberFormat('en-IN');
const DEVANAGARI_DIGITS = '०१२३४५६७८९';

export function formatCount(n: number): string {
  return numberFormat.format(n);
}

/** Same grouping as {@link formatCount}, with Devanagari digits. */
export function formatCountDevanagari(n: number): string {
  return formatCount(n).replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[Number(digit)] ?? digit);
}

/** Second line when the catalogue figure is not the counted library figure. */
export function catalogueNote(
  inLibrary: number,
  catalogue: number | undefined,
  noun: 'verse' | 'chapter',
): string | undefined {
  if (catalogue == null || catalogue === inLibrary) return undefined;
  const word = noun === 'verse' ? (catalogue === 1 ? 'verse' : 'verses') : catalogue === 1 ? 'chapter' : 'chapters';
  return `Traditional count: ${formatCount(catalogue)} ${word}`;
}

export function hindiCatalogueNote(
  inLibrary: number,
  catalogue: number | undefined,
  noun: 'verse' | 'chapter',
): string | undefined {
  if (catalogue == null || catalogue === inLibrary) return undefined;
  const word = noun === 'verse' ? 'श्लोक' : 'अध्याय';
  return `परम्परागत गणना: ${formatCount(catalogue)} ${word}`;
}
