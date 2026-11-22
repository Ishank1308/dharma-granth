/**
 * The festival tiles' colours. The website writes them as Tailwind gradients (data/festivals.ts `gradient`,
 * e.g. "from-amber-500 to-orange-600"); this turns the first and last stops into colours React Native can use.
 */
const TAILWIND: Record<string, string> = {
  'amber-500': '#f59e0b',
  'amber-600': '#d97706',
  'amber-700': '#b45309',
  'orange-500': '#f97316',
  'orange-600': '#ea580c',
  'red-500': '#ef4444',
  'red-600': '#dc2626',
  'rose-500': '#f43f5e',
  'rose-600': '#e11d48',
  'pink-600': '#db2777',
  'blue-500': '#3b82f6',
  'indigo-600': '#4f46e5',
  'violet-500': '#8b5cf6',
  'purple-600': '#9333ea',
  'cyan-600': '#0891b2',
  'yellow-600': '#ca8a04',
  // Ritual tiles (data/rituals.ts). Saffron is the website's own scale; its 500 and 700 match Tailwind orange.
  'saffron-500': '#f97316',
  'emerald-500': '#10b981',
  'green-600': '#16a34a',
  'teal-500': '#14b8a6',
  'teal-600': '#0d9488',
  'indigo-500': '#6366f1',
  'blue-600': '#2563eb',
  'purple-500': '#a855f7',
  'violet-600': '#7c3aed',
  // Two steps deeper, behind white text on a festival's cover (keeps it above 4.5:1).
  'amber-800': '#92400e',
  'amber-900': '#78350f',
  'orange-700': '#c2410c',
  'orange-800': '#9a3412',
  'red-700': '#b91c1c',
  'red-800': '#991b1b',
  'rose-700': '#be123c',
  'rose-800': '#9f1239',
  'pink-800': '#9d174d',
  'blue-700': '#1d4ed8',
  'indigo-800': '#3730a3',
  'violet-700': '#6d28d9',
  'purple-800': '#6b21a8',
  'cyan-800': '#155e75',
  'yellow-800': '#854d0e',
  'saffron-700': '#c2410c',
  'emerald-700': '#047857',
  'green-800': '#166534',
  'teal-700': '#0f766e',
  'teal-800': '#115e59',
  'indigo-700': '#4338ca',
  'blue-800': '#1e40af',
  'purple-700': '#7e22ce',
  'violet-800': '#5b21b6',
};

const deeper = (stop: string) => stop.replace(/-(\d)00$/, (_m, d: string) => `-${Math.min(9, Number(d) + 2)}00`);

/** `deep` picks shades two steps darker, for a surface that carries white text. */
export function festivalColors(gradient: string, deep = false): [string, string] {
  let from = /from-([a-z]+-\d{3})/.exec(gradient)?.[1];
  let to = /to-([a-z]+-\d{3})/.exec(gradient)?.[1];
  if (deep) {
    from = from && deeper(from);
    to = to && deeper(to);
  }
  const a = (from && TAILWIND[from]) || '#ea580c';
  const b = (to && TAILWIND[to]) || '#c2410c';
  return [a, b];
}
