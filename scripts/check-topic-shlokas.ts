/** Fails if a topic verse (data/topics.ts) quotes only part of a shloka: it must end in a danda. */
import { topics } from '../data/topics';

// Known, unresolved: these stored lines are paraphrases or sit under the wrong reference, and the library has no
// matching text to restore from. They need a scholar's check, not an automatic fix. Do not add to this list casually.
const KNOWN = new Set<string>();
const problems: string[] = [];
const known: string[] = [];
for (const t of topics) {
  for (const v of t.verses) {
    const s = v.sanskrit.trim();
    if (/[ऀ-ॿ]/.test(s) && !/[।॥]\s*[०-९0-9. ]*[।॥]?\s*$/.test(s)) (KNOWN.has(`${t.id} · ${v.reference}`) ? known : problems).push(`${t.id} · ${v.reference}: Sanskrit does not end in a danda (${s.slice(-24)})`);
  }
}
if (problems.length) {
  console.error('✗ Topic shloka check failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}
if (known.length) console.warn('! ' + known.length + " known topic verses still need a scholar's check: " + known.join('; '));
console.log(`✓ Topic shloka check passed (${topics.reduce((n, t) => n + t.verses.length, 0)} verses end in a danda).`);
