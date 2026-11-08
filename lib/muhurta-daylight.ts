import { getStandardRahuKalam } from '../data/muhurta-data';
import type { SolarTimes } from './panchang';

export function parseMuhurtaDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  if (year < 1900 || year > 2100) return null;
  const date = new Date(year, month, day, 12);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
}

export function getMuhurtaDaylight(solarTimes: SolarTimes, weekday: number) {
  const daylight = solarTimes.daylight;
  if (!solarTimes.isReliable || !daylight) return null;

  const { sunriseMinute, sunsetMinute } = daylight;
  const duration = sunsetMinute - sunriseMinute;
  const rahuPart = getStandardRahuKalam(weekday).part;
  const window = (start: number, end: number) => ({
    start: sunriseMinute + duration * start,
    end: sunriseMinute + duration * end,
    offsetPercent: start * 100,
    widthPercent: (end - start) * 100,
  });

  return {
    rahu: window((rahuPart - 1) / 8, rahuPart / 8),
    abhijit: weekday === 3 ? null : window(7 / 15, 8 / 15),
  };
}
