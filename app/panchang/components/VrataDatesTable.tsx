'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, Download, Check, Sparkles } from 'lucide-react';

export interface VrataDateItem {
  name: string;
  month: string;
  date: string;
  dateEn: string;
  highlight?: boolean;
  paksha?: string;
  tithiTime?: string;
}

interface VrataDatesTableProps {
  dates: VrataDateItem[];
  title: string;
  subtitle: string;
  vrataType: 'amavasya' | 'purnima' | 'ekadashi';
}

function getIstTodayIso(): string {
  const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, '0');
  const d = String(ist.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateIcs(dates: VrataDateItem[], calendarName: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dharma Granth//Vrata Calendar//HI',
    `X-WR-CALNAME:${calendarName}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  dates.forEach((item, idx) => {
    // dateEn is YYYY-MM-DD
    const dateClean = item.dateEn.replace(/-/g, '');
    const uid = `vrata-${dateClean}-${idx}@dharmagranth.dev`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dateClean}T000000Z`,
      `DTSTART;VALUE=DATE:${dateClean}`,
      `SUMMARY:${item.name}`,
      `DESCRIPTION:${item.month} मास - धर्म ग्रंथ वैदिक पंचांग (https://dharmagranth.dev/panchang/)`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function VrataDatesTable({ dates, title, subtitle, vrataType }: VrataDatesTableProps) {
  const todayIso = getIstTodayIso();
  const currentYear = todayIso.slice(0, 4);

  // Extract available years from dates list
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    dates.forEach((d) => {
      const y = d.dateEn.slice(0, 4);
      if (y) years.add(y);
    });
    return Array.from(years).sort();
  }, [dates]);

  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const filteredDates = useMemo(() => {
    if (selectedYear === 'all') return dates;
    return dates.filter((d) => d.dateEn.startsWith(selectedYear));
  }, [dates, selectedYear]);

  const nextUpcomingDateEn = useMemo(() => {
    return dates.find((d) => d.dateEn >= todayIso)?.dateEn;
  }, [dates, todayIso]);

  const handleDownloadIcs = () => {
    const icsContent = generateIcs(filteredDates, title);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${vrataType}-dates-${selectedYear}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section
      aria-labelledby="dates-heading"
      className="card-sacred relative rounded-3xl border border-separator/80 bg-surface-elevated/85 backdrop-blur-xl overflow-hidden shadow-soft transition-all"
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-separator/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="dates-heading" className="font-serif text-xl sm:text-2xl font-bold text-label-primary">
              {title}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-tint-fill/15 border border-tint/30 px-2.5 py-0.5 text-2xs font-semibold text-tint">
              <Sparkles className="size-3" aria-hidden="true" />
              <span>{filteredDates.length} पर्व</span>
            </span>
          </div>
          <p className="text-xs sm:text-subhead text-label-secondary mt-1">
            {subtitle}
          </p>
        </div>

        {/* Filter & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Year Segmented Switcher */}
          <div
            role="tablist"
            aria-label="Filter by Year"
            className="inline-flex rounded-full bg-fill-tertiary/70 p-1 border border-separator/60"
          >
            <button
              role="tab"
              aria-selected={selectedYear === 'all'}
              onClick={() => setSelectedYear('all')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedYear === 'all'
                  ? 'bg-surface-raised text-label-primary shadow-xs'
                  : 'text-label-secondary hover:text-label-primary'
              }`}
            >
              सभी (All)
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                role="tab"
                aria-selected={selectedYear === yr}
                onClick={() => setSelectedYear(yr)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  selectedYear === yr
                    ? 'bg-surface-raised text-label-primary shadow-xs'
                    : 'text-label-secondary hover:text-label-primary'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* iCal Download Button */}
          <button
            onClick={handleDownloadIcs}
            title="Download iCalendar (.ics) to sync with Apple, Google, or Outlook Calendar"
            className="liquid-pill inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-separator/80 bg-surface-raised hover:bg-fill-tertiary px-3.5 py-1.5 text-xs font-semibold text-label-primary shadow-xs transition-all active:scale-[0.98]"
          >
            {downloaded ? (
              <>
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-700 dark:text-emerald-300">कैलेंडर डाउनलोड हो गया</span>
              </>
            ) : (
              <>
                <Calendar className="size-3.5 text-tint" aria-hidden="true" />
                <span>कैलेंडर में जोड़ें (.ics)</span>
                <Download className="size-3 text-label-tertiary" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dates Rows */}
      <div className="divide-y divide-separator/60">
        {filteredDates.length === 0 ? (
          <div className="p-8 text-center text-sm text-label-secondary">
            चुने गए वर्ष के लिए कोई तिथि उपलब्ध नहीं है।
          </div>
        ) : (
          filteredDates.map((item) => {
            const isNextUpcoming = item.dateEn === nextUpcomingDateEn;
            return (
              <div
                key={item.dateEn}
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition duration-150 hover:bg-fill-tertiary/40 ${
                  isNextUpcoming
                    ? 'border-l-4 border-l-saffron-500 bg-saffron-500/[0.08] dark:bg-saffron-500/[0.14]'
                    : item.highlight
                      ? 'bg-fill-quaternary/40'
                      : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif font-bold text-sm sm:text-base text-label-primary">
                      {item.name}
                    </span>
                    {isNextUpcoming && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500/15 border border-saffron-500/40 px-2.5 py-0.5 text-2xs font-bold text-saffron-800 dark:text-saffron-200 shadow-xs">
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-400 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-saffron-500" />
                        </span>
                        आगामी व्रत · Next Upcoming
                      </span>
                    )}
                    {item.highlight && !isNextUpcoming && (
                      <span className="rounded-full bg-tint-fill/15 border border-tint/30 px-2 py-0.5 text-2xs font-bold text-tint">
                        प्रमुख पर्व
                      </span>
                    )}
                    {item.paksha && (
                      <span className="rounded-full bg-fill-tertiary border border-separator/60 px-2 py-0.5 text-2xs font-medium text-label-secondary">
                        {item.paksha}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-label-secondary">
                    {item.month} मास {vrataType === 'amavasya' ? 'अमावस्या' : vrataType === 'purnima' ? 'पूर्णिमा' : 'एकादशी'}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="font-mono text-sm sm:text-base font-semibold text-label-primary block">
                    {item.date}
                  </span>
                  <span className="font-mono text-2xs text-label-tertiary">
                    {item.dateEn}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
