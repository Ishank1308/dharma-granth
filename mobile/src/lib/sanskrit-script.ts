/**
 * Sanskrit in the reader's own script (Aa sheet, "Sanskrit script"), letter for letter.
 * Mirrors toScript in lib/sanskrit-script-view.ts at the repo root, so a verse reads the same as on the
 * website. Nothing is added, dropped or reordered; share and search keep using the Devanagari.
 */
export type SanskritScript = 'deva' | 'beng' | 'gujr' | 'orya' | 'telu' | 'knda' | 'mlym';
export const SANSKRIT_SCRIPTS: SanskritScript[] = ['deva', 'beng', 'gujr', 'orya', 'telu', 'knda', 'mlym'];

/** Each script's name in its own letters, so a reader finds theirs whatever the interface language. */
export const SCRIPT_NAMES: Record<SanskritScript, string> = {
  deva: 'देवनागरी',
  beng: 'বাংলা',
  gujr: 'ગુજરાતી',
  orya: 'ଓଡ଼ିଆ',
  telu: 'తెలుగు',
  knda: 'ಕನ್ನಡ',
  mlym: 'മലയാളം',
};

type Target = Exclude<SanskritScript, 'deva'>;

/** The Indic Unicode blocks share one layout (from ISCII), so a letter sits at the same offset in each. */
const BLOCK: Record<Target, number> = { beng: 0x980, gujr: 0xa80, orya: 0xb00, telu: 0xc00, knda: 0xc80, mlym: 0xd00 };

/** Letters and signs Sanskrit uses that every script above has at the shared offset. Dandas and Vedic accents pass through. */
const SHARED = /[ँ-ःअ-ऌएऐओ-नप-रलळव-ह़-ॄेैो-्ॐॠ-ॣ०-९]/g;

/** Where a script departs from the shared offset. */
const OWN: Record<Target, Record<string, string>> = {
  // Bengali has no separate va or ḷa; Sanskrit printed in Bengali writes ব and ল.
  beng: { 'व': 'ব', 'ळ': 'ল', 'ॐ': 'ওঁ' },
  gujr: { 'ॐ': 'ૐ' },
  orya: { 'ॐ': 'ଓଁ' },
  // The nukta of ड़ and ढ़ (Awadhi and Braj texts) has no sign in Telugu or Malayalam.
  telu: { 'ॐ': 'ఓం', '़': '' },
  knda: { 'ॐ': 'ಓಂ' },
  // Malayalam writes the au sign as ൗ; the letter at the shared offset is the archaic form.
  mlym: { 'ॐ': 'ഓം', 'ौ': 'ൗ', '़': '' },
};

/** Telugu and Malayalam print verse numbers in Western digits; the other scripts use their own. */
const WESTERN_DIGITS: Partial<Record<Target, true>> = { telu: true, mlym: true };

const MALAYALAM_CHILLU: Record<string, string> = { ന: 'ൻ', ണ: 'ൺ', ല: 'ൽ', ള: 'ൾ' };

/** One string of Devanagari Sanskrit in another script. Characters outside Devanagari pass through. */
export function toScript(text: string, script: SanskritScript): string {
  if (script === 'deva') return text;
  const shift = BLOCK[script] - 0x900;
  const own = OWN[script];
  let out = text.replace(SHARED, (ch) => {
    if (ch in own) return own[ch];
    const code = ch.charCodeAt(0);
    if (code >= 0x966 && WESTERN_DIGITS[script]) return String(code - 0x966);
    return String.fromCharCode(code + shift);
  });
  if (script === 'mlym') {
    // A repha is written with the chillu ർ (ധർമ), except before ya (കാര്യ); word-final n, ṇ, l, ḷ take their chillu.
    out = out.replace(/ര്(?!യ)/g, 'ർ').replace(/([നണലള])്(?![ഀ-ൿ‌‍])/g, (_, c: string) => MALAYALAM_CHILLU[c]);
  }
  if (script === 'beng') {
    // A word-final t is the khanda ta (তৎ).
    out = out.replace(/ত্(?![ঀ-৿‌‍])/g, 'ৎ');
  }
  return out;
}

export function isSanskritScript(value: unknown): value is SanskritScript {
  return SANSKRIT_SCRIPTS.includes(value as SanskritScript);
}
