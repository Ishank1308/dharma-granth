// No imports, so scripts/explore.test.mjs can load it in Node.
/**
 * A mantra's full text as display lines: its own line breaks when it has them, otherwise a break after each
 * daṇḍa (। or ॥), which stays in the text. Nothing is dropped or shortened.
 */
export function mantraLines(text: string): string[] {
  const byNewline = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  const lines: string[] = [];
  let current = '';
  const chars = Array.from(text.trim());
  chars.forEach((ch, i) => {
    current += ch;
    // Keep a run of dandas and their verse number (॥ १ ॥) together on the line they close.
    const nextCh = chars[i + 1] ?? '';
    if ((ch === '।' || ch === '॥') && !/[।॥]/.test(nextCh) && !/^\s*[०-९0-9]+\s*॥/.test(chars.slice(i + 1).join(''))) {
      if (current.trim()) lines.push(current.trim());
      current = '';
    }
  });
  if (current.trim()) lines.push(current.trim());
  return lines;
}
