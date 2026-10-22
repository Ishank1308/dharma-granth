/**
 * Optional reminders as calendar events (.ics). The reader's own calendar app
 * delivers them, so Dharma Granth stores nothing on a server, sends no push
 * notifications and cannot nag. The wording is fixed, calm and free of
 * urgency, streaks or guilt.
 */

export type ReminderType = 'daily-verse' | 'journey' | 'saved-review' | 'sadhana' | 'festival';
export type Weekday = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
export type ReminderLanguage = 'en' | 'hi';

export const WEEKDAYS: Array<{ code: Weekday; en: string }> = [
  { code: 'MO', en: 'Monday' },
  { code: 'TU', en: 'Tuesday' },
  { code: 'WE', en: 'Wednesday' },
  { code: 'TH', en: 'Thursday' },
  { code: 'FR', en: 'Friday' },
  { code: 'SA', en: 'Saturday' },
  { code: 'SU', en: 'Sunday' },
];

export interface ReminderOptions {
  type: ReminderType;
  days: Weekday[];
  /** Local time, HH:MM. */
  time: string;
  /** 1 = every week, 2 = every second week. */
  everyWeeks: 1 | 2;
  language: ReminderLanguage;
  /** Local quiet hours, HH:MM. A reminder inside this window is refused. May cross midnight. */
  quietStart?: string;
  quietEnd?: string;
}

export const REMINDER_COPY: Record<ReminderType, { path: string; en: { title: string; label: string }; hi: { title: string; label: string } }> = {
  'daily-verse': { path: '/daily', en: { title: 'Dharma Granth: daily verse', label: 'Daily verse' }, hi: { title: 'धर्म ग्रंथ: दैनिक श्लोक', label: 'दैनिक श्लोक' } },
  journey: { path: '/learn/journeys/', en: { title: 'Dharma Granth: your reading journey', label: 'Active reading journey' }, hi: { title: 'धर्म ग्रंथ: आपकी पठन यात्रा', label: 'चालू पठन यात्रा' } },
  'saved-review': { path: '/practice/desk/', en: { title: 'Dharma Granth: saved verses', label: 'Saved verse review' }, hi: { title: 'धर्म ग्रंथ: सहेजे श्लोक', label: 'सहेजे श्लोकों की समीक्षा' } },
  sadhana: { path: '/practice', en: { title: 'Dharma Granth: Sadhana', label: 'Sadhana routine' }, hi: { title: 'धर्म ग्रंथ: साधना', label: 'साधना क्रम' } },
  festival: { path: '/festivals', en: { title: 'Dharma Granth: festival information', label: 'Festival information' }, hi: { title: 'धर्म ग्रंथ: उत्सव जानकारी', label: 'उत्सव जानकारी' } },
};

const BODY = {
  en: 'Your selected reading is ready whenever you are.',
  hi: 'आपका चुना हुआ पाठ आपकी सुविधा से तैयार है।',
};

/** Words that must never appear in a reminder. Checked by the tests. */
export const FORBIDDEN_WORDS = /missed|streak|falling behind|lose|lost|overdue|don'?t forget|hurry|last chance|\bnow\b!/i;

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

/** True when `time` falls inside the quiet window (which may cross midnight). */
export function inQuietHours(time: string, start?: string, end?: string): boolean {
  if (!start || !end || !HHMM.test(start) || !HHMM.test(end) || !HHMM.test(time)) return false;
  const t = minutes(time), s = minutes(start), e = minutes(end);
  if (s === e) return false;
  return s < e ? t >= s && t < e : t >= s || t < e;
}

export function validateReminder(o: ReminderOptions): string | null {
  if (!(o.type in REMINDER_COPY)) return 'Choose what the reminder is for.';
  if (o.days.length === 0) return 'Choose at least one day.';
  if (!HHMM.test(o.time)) return 'Choose a time.';
  if (inQuietHours(o.time, o.quietStart, o.quietEnd)) return 'That time falls inside your quiet hours. Choose another time.';
  return null;
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** RFC 5545 folding: lines of at most 75 octets, continued with a leading space. */
export function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > (out.length === 0 ? 75 : 74)) {
      out.push(cur);
      cur = '';
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

const stamp = (d: Date) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}T${String(d.getUTCHours()).padStart(2, '0')}${String(d.getUTCMinutes()).padStart(2, '0')}${String(d.getUTCSeconds()).padStart(2, '0')}Z`;
const local = (d: Date, time: string) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${time.slice(0, 2)}${time.slice(3)}00`;

const JS_DAY: Weekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

/** The first date, from today, that falls on one of the chosen weekdays, so the event starts on a day the rule includes. */
export function firstOccurrence(days: Weekday[], from: Date): Date {
  for (let i = 0; i < 7; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    if (days.includes(JS_DAY[d.getDay()])) return d;
  }
  return from;
}

/** A recurring event in the reader's own local time zone. Throws a readable message on invalid options. */
export function buildReminderIcs(o: ReminderOptions, baseUrl: string, now: Date = new Date(), uid: string = `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 10)}@dharmagranth`): string {
  const problem = validateReminder(o);
  if (problem) throw new Error(problem);
  const copy = REMINDER_COPY[o.type][o.language];
  const url = `${baseUrl.replace(/\/$/, '')}${REMINDER_COPY[o.type].path}`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dharma Granth//Reminder//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${local(firstOccurrence(o.days, now), o.time)}`,
    'DURATION:PT10M',
    `RRULE:FREQ=WEEKLY;INTERVAL=${o.everyWeeks};BYDAY=${o.days.join(',')}`,
    `SUMMARY:${esc(copy.title)}`,
    `DESCRIPTION:${esc(`${BODY[o.language]}\n${url}`)}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(BODY[o.language])}`,
    'TRIGGER:PT0S',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
