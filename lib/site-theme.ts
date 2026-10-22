export const THEME_IDS = ['day', 'sunset', 'paper', 'night', 'auto'] as const;

export type Theme = (typeof THEME_IDS)[number];

export const THEME_NAMES: Record<Theme, { name: string; hi: string; description: string }> = {
  day: { name: 'Usha', hi: 'उषा', description: 'Warm ivory and saffron for daytime reading' },
  sunset: { name: 'Sandhyā', hi: 'संध्या', description: 'Soft amber for dawn and dusk' },
  paper: { name: 'Bhojpatra', hi: 'भोजपत्र', description: 'Sepia birch-bark parchment' },
  night: { name: 'Rātri', hi: 'रात्रि', description: 'Low-glare obsidian and copper for night reading' },
  auto: { name: 'Auto', hi: 'सौर चक्र', description: 'Follows the sun: Usha by day, Sandhyā at dawn and dusk, Rātri at night' },
};

export const FIXED_THEME_IDS = THEME_IDS.filter((theme): theme is Exclude<Theme, 'auto'> => theme !== 'auto');
