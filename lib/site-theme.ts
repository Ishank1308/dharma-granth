/**
 * Two public color choices. The Light choice deliberately uses the existing
 * Sandhyā / sunset palette, not the former Usha / day palette.
 *
 * Keep the underlying data-theme values so existing stylesheet rules remain
 * intact across the site (including verse cards and Panchang).
 */
export const THEME_IDS = ['sunset', 'night'] as const;

export type Theme = (typeof THEME_IDS)[number];

export const THEME_NAMES: Record<Theme, { name: string; hi: string; description: string }> = {
  sunset: { name: 'Light', hi: 'प्रकाश', description: 'Warm Sandhyā amber for comfortable daytime reading' },
  night: { name: 'Dark', hi: 'रात्रि', description: 'Low-glare obsidian and copper for night reading' },
};

/** Keep the existing first-visit default; readers may choose Light at any time. */
export const DEFAULT_THEME: Theme = 'night';
export const FIXED_THEME_IDS = THEME_IDS;

/**
 * Migrate legacy five-way preferences without a first-paint flash.
 * The former Auto preference makes one selection from the device setting,
 * then becomes an ordinary explicit choice (no time-of-day color changes).
 */
export function normalizeStoredTheme(value: string | null, prefersDark = false): Theme {
  if (value === 'night' || value === 'dark') return 'night';
  if (value === 'day' || value === 'paper' || value === 'sunset' || value === 'light') return 'sunset';
  if (value === 'auto') return prefersDark ? 'night' : 'sunset';
  return DEFAULT_THEME;
}
