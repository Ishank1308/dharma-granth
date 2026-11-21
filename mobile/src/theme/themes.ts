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

export const RADIUS = { card: 16, pill: 999, control: 10 } as const;
export const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
