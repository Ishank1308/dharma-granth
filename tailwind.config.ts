import type { Config } from 'tailwindcss';

// Theme colours are CSS variables holding hex values, which Tailwind cannot
// split into channels, so opacity modifiers (`bg-dharma-card/95`) were silently
// dropped. color-mix lets `<alpha-value>` apply to any variable colour.
const themeVar = (name: string) =>
  `color-mix(in srgb, var(${name}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  // Follow the site's own theme switcher (ThemeProvider sets data-theme on
  // <html>), not the OS colour scheme, so `dark:` matches what users picked.
  darkMode: ['selector', '[data-theme="night"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#ffefd6',
          200: '#ffdbac',
          300: '#ffc178',
          400: '#ff9f3d',
          500: '#f97316',
          600: '#cf440a',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        dharma: {
          bg: themeVar('--dharma-bg'),
          dark: '#1a1814',
          text: themeVar('--dharma-text'),
          'text-secondary': themeVar('--dharma-text-secondary'),
          muted: themeVar('--dharma-muted'),
          border: themeVar('--dharma-border'),
          card: themeVar('--dharma-card'),
          'card-soft': themeVar('--dharma-card-soft'),
          panel: themeVar('--dharma-panel'),
          'panel-muted': themeVar('--dharma-panel-muted'),
          reading: themeVar('--dharma-reading-surface'),
          gold: themeVar('--dharma-gold'),
          saffron: themeVar('--dharma-saffron'),
          maroon: themeVar('--dharma-maroon'),
          success: themeVar('--dharma-success'),
          warning: themeVar('--dharma-warning'),
          error: themeVar('--dharma-error'),
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        devanagari: ['var(--font-noto-devanagari)', 'sans-serif'],
        sanskrit: ['var(--font-sanskrit)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
