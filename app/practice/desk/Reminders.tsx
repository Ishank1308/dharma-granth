'use client';

import { useEffect, useState } from 'react';
import { WEEKDAYS, REMINDER_COPY, buildReminderIcs, validateReminder, type ReminderOptions, type ReminderType, type Weekday } from '@/lib/reminders';

const KEY = 'dharma.reminders.v1';
const DEFAULTS: ReminderOptions = { type: 'daily-verse', days: ['MO', 'TU', 'WE', 'TH', 'FR'], time: '08:00', everyWeeks: 1, language: 'en', quietStart: '22:00', quietEnd: '07:00' };
const field = 'mt-1 block min-h-[44px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text';

/**
 * Optional reminders, made as calendar events the reader's own calendar app
 * delivers. Dharma Granth sends nothing and keeps only these form choices,
 * on this device, so the form is filled in next time.
 */
export function Reminders() {
  const [o, setO] = useState<ReminderOptions>(DEFAULTS);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<ReminderOptions> | null;
      if (saved && typeof saved === 'object') setO({ ...DEFAULTS, ...saved, days: Array.isArray(saved.days) ? saved.days : DEFAULTS.days });
    } catch { /* defaults */ }
  }, []);

  const set = <K extends keyof ReminderOptions>(k: K, v: ReminderOptions[K]) => setO((p) => ({ ...p, [k]: v }));
  const toggleDay = (d: Weekday) => set('days', o.days.includes(d) ? o.days.filter((x) => x !== d) : [...o.days, d]);
  const problem = validateReminder(o);

  const download = () => {
    try {
      const ics = buildReminderIcs(o, window.location.origin);
      try { localStorage.setItem(KEY, JSON.stringify(o)); } catch { /* choices not remembered */ }
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-granth-${o.type}-reminder.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMsg('Reminder file downloaded. Open it to add it to your calendar, and delete it there whenever you like.');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not create the reminder.');
    }
  };

  return (
    <div>
      <p className="text-dharma-muted">
        Reminders are optional. This makes a calendar event that your own calendar app shows. Dharma Granth sends no notifications and stores no reminder anywhere except the choices below, on this device.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-dharma-muted">Reminder for
          <select value={o.type} onChange={(e) => set('type', e.target.value as ReminderType)} className={field}>
            {(Object.keys(REMINDER_COPY) as ReminderType[]).map((t) => <option key={t} value={t}>{REMINDER_COPY[t].en.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-dharma-muted">Time
          <input type="time" value={o.time} onChange={(e) => set('time', e.target.value)} className={field} />
        </label>
        <label className="text-sm font-semibold text-dharma-muted">How often
          <select value={o.everyWeeks} onChange={(e) => set('everyWeeks', Number(e.target.value) === 2 ? 2 : 1)} className={field}>
            <option value={1}>Every week</option>
            <option value={2}>Every second week</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-dharma-muted">Language of the reminder
          <select value={o.language} onChange={(e) => set('language', e.target.value === 'hi' ? 'hi' : 'en')} className={field}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </label>
      </div>
      <fieldset className="mt-3">
        <legend className="text-sm font-semibold text-dharma-muted">Days</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {WEEKDAYS.map((d) => (
            <label key={d.code} className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-dharma-border px-3 text-sm text-dharma-text focus-within:ring-2 focus-within:ring-saffron-500">
              <input type="checkbox" checked={o.days.includes(d.code)} onChange={() => toggleDay(d.code)} className="h-5 w-5 accent-saffron-700" /> {d.en}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-dharma-muted">Quiet hours start
          <input type="time" value={o.quietStart ?? ''} onChange={(e) => set('quietStart', e.target.value)} className={field} />
        </label>
        <label className="text-sm font-semibold text-dharma-muted">Quiet hours end
          <input type="time" value={o.quietEnd ?? ''} onChange={(e) => set('quietEnd', e.target.value)} className={field} />
        </label>
      </div>
      <p className="mt-1 text-sm text-dharma-muted">A reminder will not be made for a time inside your quiet hours.</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={download} disabled={Boolean(problem)} className="focus-ring min-h-[44px] rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800 disabled:cursor-not-allowed disabled:opacity-50">
          Download calendar reminder
        </button>
        {problem && <span role="status" className="text-sm text-dharma-muted">{problem}</span>}
      </div>
      <p className="mt-2 text-sm text-dharma-muted">The reminder will read: “{o.language === 'hi' ? 'आपका चुना हुआ पाठ आपकी सुविधा से तैयार है।' : 'Your selected reading is ready whenever you are.'}”</p>
      <p role="status" aria-live="polite" className="mt-1 min-h-[1.25rem] text-sm text-dharma-muted">{msg}</p>
    </div>
  );
}
