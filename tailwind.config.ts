import type { Config } from 'tailwindcss';
S
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
        // Semantic colours from app/styles/tokens.css, so text-label-secondary, bg-fill-tertiary,
        // border-separator and text-tint follow the theme without a dark: variant.
        label: {
          primary: 'var(--label-primary)',
          secondary: 'var(--label-secondary)',
          tertiary: 'var(--label-tertiary)',
          quaternary: 'var(--label-quaternary)',
        },
        fill: {
          primary: 'var(--fill-primary)',
          secondary: 'var(--fill-secondary)',
          tertiary: 'var(--fill-tertiary)',
          quaternary: 'var(--fill-quaternary)',
        },
        separator: {
          DEFAULT: 'var(--separator)',
          strong: 'var(--separator-strong)',
        },
        surface: {
          canvas: 'var(--surface-canvas)',
          raised: 'var(--surface-raised)',
          elevated: 'var(--surface-elevated)',
          sunken: 'var(--surface-sunken)',
        },
        tint: {
          DEFAULT: 'var(--tint)',
          fill: 'var(--tint-fill)',
        },
        accent: 'var(--tint)',
        'on-tint': 'var(--on-tint)',
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
          line: themeVar('--dharma-border'),
          'border-hover': themeVar('--dharma-gold'),
          'border-strong': 'var(--separator-strong)',
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
      // Design tokens (app/styles/tokens.css). Type roles carry their own leading and tracking.
      fontSize: {
        'caption-2': ['0.6875rem', { lineHeight: '1.3' }],
        'caption-1': ['var(--text-caption)', { lineHeight: '1.35' }],
        caption: ['var(--text-caption)', { lineHeight: '1.35' }],
        footnote: ['var(--text-footnote)', { lineHeight: '1.38' }],
        subhead: ['var(--text-subhead)', { lineHeight: '1.4' }],
        callout: ['var(--text-callout)', { lineHeight: '1.42' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-normal)', letterSpacing: 'var(--tracking-body)' }],
        'title-3': ['var(--text-title-3)', { lineHeight: '1.25', letterSpacing: 'var(--tracking-headline)' }],
        'title-2': ['var(--text-title-2)', { lineHeight: 'var(--leading-snug)', letterSpacing: 'var(--tracking-title)' }],
        'title-1': ['var(--text-title-1)', { lineHeight: '1.12', letterSpacing: 'var(--tracking-title)' }],
        'large-title': ['var(--text-large-title)', { lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-title)' }],
        display: ['var(--text-display)', { lineHeight: '1.04', letterSpacing: 'var(--tracking-display)' }],
      },
      spacing: {
        gutter: 'var(--space-gutter)',
        section: 'var(--space-section)',
        tap: 'var(--tap-target)',
      },
      maxWidth: {
        content: 'var(--width-content)',
        reading: 'var(--width-reading)',
        text: 'var(--width-text)',
      },
      borderRadius: {
        chip: 'var(--radius-chip)',
        control: 'var(--radius-control)',
        track: 'var(--radius-track)',
        field: 'var(--radius-field)',
        group: 'var(--radius-group)',
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        hairline: 'var(--shadow-hairline)',
        raised: 'var(--shadow-raised)',
        lifted: 'var(--shadow-lifted)',
        overlay: 'var(--shadow-overlay)',
      },
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        standard: 'var(--duration-standard)',
        base: 'var(--duration-base)',
        deliberate: 'var(--duration-deliberate)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        'out-soft': 'var(--ease-out)',
        'in-soft': 'var(--ease-in)',
        'in-out-soft': 'var(--ease-in-out)',
        spring: 'var(--motion-spring)',
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
