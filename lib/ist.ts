// Indian Standard Time helpers. IST has no daylight saving, so a fixed +5:30 offset is exact.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export interface IstDate {
  year: number;
  month: number; // 1-12
  day: number;
  iso: string; // YYYY-MM-DD
  dayOfYear: number; // 1-366
}

export function istDate(date: Date = new Date()): IstDate {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();
  const dayOfYear = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86_400_000);
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { year, month, day, iso, dayOfYear };
}

export const formatIstLong = (date: Date = new Date(), locale = 'en-IN'): string =>
  date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' });
