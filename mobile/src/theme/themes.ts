/**
 * The four reading themes, with the same colours as the website (app/globals.css):
 * Day (Usha), Sunset, Paper and Dark (Ratri).
 */
export type ThemeName = 'day' | 'sunset' | 'paper' | 'dark';

export interface Palette {
  name: ThemeName;
  label: string;
  labelHi: string;
  dark: boolean;
  bg: string;
  card: string;
  cardSoft: string;
  text: string;
  textSecondary: string;
  muted: string;
  border: string;
  accent: string;
  gold: string;
  /** Frosted glass surfaces, as on the website (--glass-surface, --glass-specular-*). */
  glass: string;
  glassStrong: string;
  /** Top bar and tab bar: a more opaque glass so text over it stays readable. */
  chrome: string;
  rim: string;
  rimTop: string;
  /** Aurora pools behind every screen (saffron, lotus, peacock, indigo, gold). */
  aurora: [string, string, string, string, string];
  /** Accent gradient for active chips and primary buttons. */
  accentGradient: [string, string];
  /** Text on the accent gradient. */
  onAccent: string;
  /**
   * Light effects (Settings → Visual effects, or a budget phone on Automatic): glass() and accentFill()
   * skip blurred shadows and gradients. Set by the app state on the palette it hands out, never in THEMES.
   */
  lite?: boolean;
}

export const THEMES: Record<ThemeName, Palette> = {
  day: {
    name: 'day',
    label: 'Day',
    labelHi: 'दिवस',
    dark: false,
    bg: '#f5f5f7',
    card: '#ffffff',
    cardSoft: '#fbfbfd',
    text: '#1d1d1f',
    textSecondary: '#424245',
    muted: '#6e6e73',
    border: '#d2d2d7',
    accent: '#c2410c',
    gold: '#c69234',
    glass: 'rgba(255, 255, 255, 0.62)',
    glassStrong: 'rgba(255, 255, 255, 0.8)',
    chrome: 'rgba(245, 245, 247, 0.86)',
    rim: 'rgba(255, 255, 255, 0.75)',
    rimTop: 'rgba(255, 255, 255, 0.95)',
    aurora: ['rgba(234, 88, 12, 0.30)', 'rgba(219, 39, 119, 0.22)', 'rgba(13, 148, 136, 0.22)', 'rgba(79, 70, 229, 0.20)', 'rgba(217, 119, 6, 0.20)'],
    accentGradient: ['#ea580c', '#c2410c'],
    onAccent: '#ffffff',
  },
  sunset: {
    name: 'sunset',
    label: 'Sunset',
    labelHi: 'संध्या',
    dark: false,
    bg: '#fff4e5',
    card: '#fffaf2',
    cardSoft: '#ffeed9',
    text: '#332016',
    textSecondary: '#5c3f2d',
    muted: '#7c5745',
    border: '#ecc9a7',
    accent: '#c2410c',
    gold: '#d97706',
    glass: 'rgba(255, 250, 242, 0.62)',
    glassStrong: 'rgba(255, 250, 242, 0.82)',
    chrome: 'rgba(255, 244, 229, 0.88)',
    rim: 'rgba(255, 252, 244, 0.75)',
    rimTop: 'rgba(255, 255, 255, 0.95)',
    aurora: ['rgba(234, 88, 12, 0.32)', 'rgba(219, 39, 119, 0.22)', 'rgba(13, 148, 136, 0.18)', 'rgba(79, 70, 229, 0.16)', 'rgba(217, 119, 6, 0.26)'],
    accentGradient: ['#ea580c', '#c2410c'],
    onAccent: '#ffffff',
  },
  paper: {
    name: 'paper',
    label: 'Paper',
    labelHi: 'पत्र',
    dark: false,
    bg: '#f5ede0',
    card: '#fdf8ee',
    cardSoft: '#f2e7d3',
    text: '#2c241c',
    textSecondary: '#4a3d31',
    muted: '#6f6252',
    border: '#ded1bd',
    accent: '#b45309',
    gold: '#b45309',
    glass: 'rgba(253, 248, 238, 0.68)',
    glassStrong: 'rgba(253, 248, 238, 0.86)',
    chrome: 'rgba(245, 237, 224, 0.9)',
    rim: 'rgba(255, 248, 232, 0.66)',
    rimTop: 'rgba(255, 252, 244, 0.9)',
    aurora: ['rgba(194, 65, 12, 0.22)', 'rgba(190, 24, 93, 0.14)', 'rgba(15, 118, 110, 0.14)', 'rgba(67, 56, 202, 0.12)', 'rgba(180, 83, 9, 0.2)'],
    accentGradient: ['#c2410c', '#9c4a0a'],
    onAccent: '#ffffff',
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    labelHi: 'रात्रि',
    dark: true,
    bg: '#000000',
    card: '#1c1c1e',
    cardSoft: '#2c2c2e',
    text: '#f5f5f7',
    textSecondary: 'rgba(245, 245, 247, 0.8)',
    muted: '#a1a1a6',
    border: '#38383a',
    accent: '#ff9f0a',
    gold: '#e5c158',
    glass: 'rgba(28, 28, 30, 0.58)',
    glassStrong: 'rgba(44, 44, 46, 0.74)',
    chrome: 'rgba(10, 10, 12, 0.82)',
    rim: 'rgba(255, 255, 255, 0.12)',
    rimTop: 'rgba(255, 255, 255, 0.24)',
    aurora: ['rgba(251, 146, 60, 0.30)', 'rgba(244, 114, 182, 0.22)', 'rgba(45, 212, 191, 0.2)', 'rgba(129, 140, 248, 0.24)', 'rgba(251, 191, 36, 0.16)'],
    accentGradient: ['#ffb340', '#ff8a00'],
    onAccent: '#1d1d1f',
  },
};

export const THEME_ORDER: ThemeName[] = ['day', 'sunset', 'paper', 'dark'];

/** Type scale from app/styles/tokens.css (caption 12 … title-1 26), multiplied by the reader's text size. */
export const TYPE = {
  caption: 12,
  footnote: 13,
  subhead: 15,
  callout: 16,
  body: 17,
  title3: 19,
  title2: 22,
  title1: 26,
} as const;

/**
 * Android's font size setting goes up to 200%, and the reader's own text size (up to 150%) multiplies
 * on top, which would make verse text 3× its size and break long Sanskrit compounds mid-word on a
 * phone. Text that follows the reader's text size passes `maxFontSizeMultiplier={fontCap(textScale)}`,
 * so the two together stop at MAX_TEXT_ZOOM. At the app's default size the system setting is honoured
 * in full up to that point.
 */
export const MAX_TEXT_ZOOM = 2.4;

export function fontCap(textScale: number): number {
  return Math.max(1, MAX_TEXT_ZOOM / textScale);
}

/** Large titles are already big; they follow the system font size only this far. */
export const TITLE_FONT_CAP = 1.5;

export const RADIUS ={ card: 22, row: 16, pill: 999, control: 14 } as const;
export const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
