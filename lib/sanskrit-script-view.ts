/**
 * Sanskrit shown in the reader's own script (Aa sheet, "Sanskrit script").
 *
 * The text is stored and rendered in Devanagari. A reader who picks another script gets a view
 * over the page: every text node inside a `lang="sa"` element is rewritten letter for letter, and
 * the Devanagari is kept so the choice can be undone. Nothing is added, dropped or reordered,
 * and copy, share and search keep working on the Devanagari text they read from data.
 *
 * This file is loaded only after a reader picks a script (see useReaderSettings), so it costs
 * the default page nothing.
 */
import type { SanskritScript } from './useReaderSettings';

type Target = Exclude<SanskritScript, 'deva'>;

/**
 * Where each script's Unicode block starts. The Indic blocks share one layout (it comes from
 * ISCII), so a Devanagari letter and its counterpart sit at the same offset in their blocks.
 */
const BLOCK: Record<Target, number> = { beng: 0x980, gujr: 0xa80, orya: 0xb00, telu: 0xc00, knda: 0xc80, mlym: 0xd00 };

/**
 * The letters and signs Sanskrit uses that every script above has at the shared offset:
 * candrabindu, anusvara, visarga, the vowels and their signs, the consonants, nukta, avagraha,
 * virama and the digits. Anything else (dandas, Vedic accents, a stray Hindi letter) is left as it is.
 */
const SHARED = /[ँ-ःअ-ऌएऐओ-नप-रलळव-ह़-ॄेैो-्ॐॠ-ॣ०-९]/g;

/** Where a script departs from the shared offset. */
const OWN: Record<Target, Record<string, string>> = {
  // Bengali has no separate va or ḷa; Sanskrit printed in Bengali writes ব and ল.
  beng: { 'व': 'ব', 'ळ': 'ল', 'ॐ': 'ওঁ' },
  gujr: { 'ॐ': 'ૐ' },
  orya: { 'ॐ': 'ଓଁ' },
  // The nukta of ड़ and ढ़ (Ramcharitmanas and Vinaya Patrika are in Awadhi and Braj, not
  // Sanskrit) has no sign in Telugu or Malayalam, which write those words with the plain letter.
  telu: { 'ॐ': 'ఓం', '़': '' },
  knda: { 'ॐ': 'ಓಂ' },
  // Malayalam writes the au sign as ൗ; the letter at the shared offset is the archaic form.
  mlym: { 'ॐ': 'ഓം', 'ौ': 'ൗ', '़': '' },
};

/** Telugu and Malayalam print verse numbers in Western digits; the other scripts use their own. */
const WESTERN_DIGITS: Partial<Record<Target, true>> = { telu: true, mlym: true };

const MALAYALAM_CHILLU: Record<string, string> = { ന: 'ൻ', ണ: 'ൺ', ല: 'ൽ', ള: 'ൾ' };

/** One string of Devanagari Sanskrit in another script. Characters outside Devanagari pass through. */
export function toScript(text: string, script: Target): string {
  const shift = BLOCK[script] - 0x900;
  const own = OWN[script];
  let out = text.replace(SHARED, (ch) => {
    if (ch in own) return own[ch];
    const code = ch.charCodeAt(0);
    if (code >= 0x966 && WESTERN_DIGITS[script]) return String(code - 0x966);
    return String.fromCharCode(code + shift);
  });
  if (script === 'mlym') {
    // A repha is written with the chillu ർ (ധർമ), except before ya (കാര്യ). The other chillus
    // are used where a word ends in that consonant (തസ്മിൻ).
    out = out
      .replace(/ര്(?!യ)/g, 'ർ')
      .replace(/([നണലള])്(?![ഀ-ൿ‌‍])/g, (_, c: string) => MALAYALAM_CHILLU[c]);
  }
  if (script === 'beng') {
    // A word-final t is the khanda ta (তৎ).
    out = out.replace(/ত্(?![ঀ-৿‌‍])/g, 'ৎ');
  }
  return out;
}

/* ── The view over the page ── */

const SANSKRIT = '[lang="sa"]';
const DEVANAGARI = /[ऀ-ॿ]/;

/** What each rewritten text node held, and what it was rewritten to. */
const shown = new WeakMap<Text, { from: string; to: string; script: Target }>();
let current: Target | null = null;
let observer: MutationObserver | null = null;

function paint(node: Text) {
  // Hindi or English nested inside a Sanskrit element (a label, a gloss) is not Sanskrit.
  if (node.parentElement?.closest('[lang]')?.getAttribute('lang') !== 'sa') return;
  const value = node.nodeValue ?? '';
  const known = shown.get(node);
  // React writing a new verse into the node replaces our text, so what we kept no longer applies.
  const ours = known && known.to === value ? known : undefined;
  if (ours && ours.script === current) return;
  const from = ours ? ours.from : value;
  if (!current) {
    if (ours) node.nodeValue = from;
    shown.delete(node);
    return;
  }
  if (!DEVANAGARI.test(from)) return;
  const to = toScript(from, current);
  shown.set(node, { from, to, script: current });
  if (to !== value) node.nodeValue = to;
}

function paintWithin(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    paint(root as Text);
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) paint(node as Text);
}

function scan(root: Node) {
  const el = root.nodeType === Node.ELEMENT_NODE ? (root as Element) : root.parentElement;
  if (!el) return;
  if (el.closest(SANSKRIT)) {
    paintWithin(root);
  } else if (root === el) {
    el.querySelectorAll(SANSKRIT).forEach(paintWithin);
  }
}

/** Show every Sanskrit passage on the page in `script`, and keep doing so as the page changes. */
export function showSanskritIn(script: SanskritScript) {
  current = script === 'deva' ? null : script;
  if (current) document.documentElement.dataset.saScript = current;
  else delete document.documentElement.dataset.saScript;
  scan(document.body);
  if (!current) {
    observer?.disconnect();
    observer = null;
    return;
  }
  if (observer) return;
  // Verses arrive after the first paint (chapter pages upgrade them as they near the screen, the
  // focus reader swaps one verse for the next), so the view follows the page.
  observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'characterData') scan(record.target);
      else record.addedNodes.forEach(scan);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true });
}
