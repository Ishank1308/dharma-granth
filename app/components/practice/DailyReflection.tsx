'use client';

import { useRef, useState } from 'react';
import {
  PenLine,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
} from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate, dayOfYear, offsetISODate, formatDisplayDate } from './shared';
import { triggerHaptic } from '@/lib/haptics';
import {
  entryText,
  readEntry,
  REFLECTION_TAGS,
  type ReflectionFields,
  type ReflectionStored,
} from './reflection-entry';

/** Rotating contemplative prompts for introspection throughout the year. */
const PROMPTS: { en: string; hi: string }[] = [
  { en: 'Where did I act without expecting a result today?', hi: 'आज मैंने कहाँ फल की चिंता किए बिना कर्म किया?' },
  { en: 'What am I holding on to that I could release?', hi: 'मैं किस वस्तु को पकड़े हुए हूँ जिसे छोड़ सकता/सकती हूँ?' },
  { en: 'Who tested my patience — and what did that teach me?', hi: 'किसने मेरे धैर्य की परीक्षा ली — और उससे क्या सीखा?' },
  { en: 'What did I read or hear today that felt true?', hi: 'आज क्या पढ़ा या सुना जो सत्य लगा?' },
  { en: 'Where was I generous today? Where could I have been?', hi: 'आज मैं कहाँ उदार रहा/रही? कहाँ हो सकता/सकती थी?' },
  { en: 'What fear shaped a decision today?', hi: 'आज किस भय ने मेरा कोई निर्णय प्रभावित किया?' },
  { en: 'When did I feel most still today?', hi: 'आज मैं सबसे अधिक शांत कब था/थी?' },
  { en: 'What duty am I avoiding, and why?', hi: 'मैं किस कर्तव्य से बच रहा/रही हूँ, और क्यों?' },
  { en: 'What would I do differently if no one were watching?', hi: 'अगर कोई न देख रहा होता तो मैं क्या अलग करता/करती?' },
  { en: 'What am I attached to that is changing?', hi: 'मैं किस परिवर्तनशील वस्तु से आसक्त हूँ?' },
  { en: 'Whose wisdom guided me today?', hi: 'आज किसके ज्ञान ने मेरा मार्गदर्शन किया?' },
  { en: 'What did anger cost me this week?', hi: 'इस सप्ताह क्रोध ने मुझसे क्या छीना?' },
  { en: 'Where did I see the same Self in another?', hi: 'मैंने दूसरे में वही आत्मा कहाँ देखी?' },
  { en: 'What small discipline improved my day?', hi: 'किस छोटे अनुशासन ने मेरा दिन बेहतर बनाया?' },
];

const QUESTIONS: { key: keyof ReflectionFields; hi: string; en: string }[] = [
  { key: 'learned', hi: 'आज क्या समझ आया?', en: 'What did you learn?' },
  { key: 'challenged', hi: 'क्या कठिन लगा?', en: 'What challenged you?' },
  { key: 'apply', hi: 'आज यह कैसे लागू होता है?', en: 'How does this apply today?' },
  { key: 'action', hi: 'अब कौन सा कदम लोगे?', en: 'What action will you take?' },
];

const FIELD_LABEL: Record<keyof ReflectionFields, string> = {
  note: 'टिप्पणी',
  learned: 'क्या समझ आया',
  challenged: 'क्या कठिन लगा',
  apply: 'आज कैसे लागू होता है',
  action: 'कौन सा कदम',
  tag: 'अवधारणा',
};

/**
 * Daily reflection on the practice page. Four questions, a searchable date list,
 * and one concept tag. Older entries that were a single string still open.
 */
export function DailyReflection() {
  const [entries, setEntries] = useLocalStorage<Record<string, ReflectionStored>>(
    'dharma.practice.reflections',
    {},
  );
  const [currentDate, setCurrentDate] = useState(localISODate());
  const [query, setQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = localISODate();
  const dateInfo = formatDisplayDate(currentDate);
  const [year, month, day] = currentDate.split('-').map(Number);
  const prompt = PROMPTS[dayOfYear(new Date(year, month - 1, day)) % PROMPTS.length];
  const fields = readEntry(entries[currentDate]);
  const written = entryText(fields).length > 0;
  const daysWritten = Object.keys(entries).filter((key) => entryText(readEntry(entries[key])).length > 0).length;
  const needle = query.trim().toLowerCase();
  const dates = Object.keys(entries)
    .filter((key) => {
      const text = entryText(readEntry(entries[key]));
      if (!text) return false;
      if (!needle) return true;
      return `${key} ${text}`.toLowerCase().includes(needle);
    })
    .sort()
    .reverse();

  function markSaving() {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  }

  function writeFields(next: ReflectionFields) {
    markSaving();
    setEntries({ ...entries, [currentDate]: next });
  }

  function writeField(key: keyof ReflectionFields, value: string) {
    writeFields({ ...fields, [key]: value });
  }

  function goPrevDay() {
    triggerHaptic('light');
    setCurrentDate((value) => offsetISODate(value, -1));
    setConfirmDelete(false);
  }

  function goNextDay() {
    triggerHaptic('light');
    if (currentDate < today) {
      setCurrentDate((value) => offsetISODate(value, 1));
      setConfirmDelete(false);
    }
  }

  function goToday() {
    triggerHaptic('light');
    setCurrentDate(today);
    setConfirmDelete(false);
  }

  function openDate(date: string) {
    triggerHaptic('light');
    setCurrentDate(date);
    setConfirmDelete(false);
  }

  function handleDeleteCurrent() {
    triggerHaptic('medium');
    const updated = { ...entries };
    delete updated[currentDate];
    setEntries(updated);
    setConfirmDelete(false);
  }

  function handleExport() {
    try {
      const lines = ['# Dharma Granth — Daily Spiritual Reflections (दैनिक चिंतन)\n'];
      for (const key of Object.keys(entries).sort()) {
        const entry = readEntry(entries[key]);
        if (!entryText(entry)) continue;
        lines.push(`## ${key}`);
        (Object.keys(FIELD_LABEL) as (keyof ReflectionFields)[]).forEach((field) => {
          const value = entry[field].trim();
          if (value) lines.push(`${FIELD_LABEL[field]}: ${value}`);
        });
        lines.push('');
      }
      const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-reflections-${today}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      /* export is optional */
    }
  }

  return (
    <ToolCard
      icon={<PenLine className="w-5 h-5 text-rose-600" />}
      title="Daily Reflection"
      titleHindi="दैनिक चिंतन"
      accent="rose"
    >
      <div className="flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between px-2 py-1.5 bg-dharma-panel-muted rounded-xl border border-dharma-border text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrevDay}
              className="p-1 rounded-lg text-dharma-muted hover:text-dharma-text"
              title="पिछला दिन · Previous day"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={goToday}
              className={`px-2 py-0.5 rounded-md font-semibold ${
                dateInfo.isToday ? 'bg-dharma-bg text-dharma-text' : 'text-dharma-text'
              }`}
              title="आज पर जाएं · Jump to today"
            >
              <span>{dateInfo.hi}</span>
              <span className="hidden sm:inline text-dharma-muted font-normal ml-1">({dateInfo.en})</span>
            </button>

            <button
              type="button"
              onClick={goNextDay}
              disabled={currentDate >= today}
              className="p-1 rounded-lg text-dharma-muted hover:text-dharma-text disabled:cursor-not-allowed disabled:text-dharma-text-secondary"
              title="अगला दिन · Next day"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {written && (
              <button
                type="button"
                onClick={() => setConfirmDelete(!confirmDelete)}
                className="p-1.5 rounded-lg text-dharma-muted hover:text-dharma-text"
                title="इस दिन का चिंतन हटाएं · Delete entry for this date"
                aria-label="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleExport}
              className="p-1.5 rounded-lg text-dharma-muted hover:text-dharma-text"
              title="चिंतन एक्सपोर्ट करें · Export reflections"
              aria-label="Export reflections as markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {confirmDelete && (
          <div className="p-2.5 rounded-xl border border-dharma-border bg-dharma-bg text-xs flex items-center justify-between gap-2">
            <span className="text-dharma-text font-medium">
              क्या आप {dateInfo.hi} का चिंतन हटाना चाहते हैं?
            </span>
            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-0.5 rounded border border-dharma-border bg-dharma-card text-dharma-text"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleDeleteCurrent}
                className="px-2 py-0.5 rounded bg-dharma-card border border-dharma-border text-dharma-text font-bold"
              >
                हटाएं
              </button>
            </div>
          </div>
        )}

        <blockquote className="border-l-4 border-dharma-border pl-3">
          <p lang="hi" className="font-devanagari text-sm font-semibold text-dharma-text">{prompt.hi}</p>
          <p className="text-xs text-dharma-text-secondary mt-0.5">{prompt.en}</p>
        </blockquote>

        <textarea
          value={fields.note}
          onChange={(event) => writeField('note', event.target.value)}
          placeholder="यहाँ अपने विचार लिखें — यह आपके उपकरण पर ही सुरक्षित रहता है..."
          rows={4}
          className="w-full text-sm bg-dharma-bg rounded-xl border border-dharma-border p-3.5 text-dharma-text placeholder:text-dharma-muted resize-y font-devanagari leading-relaxed"
          aria-label={`Reflection for ${dateInfo.en}`}
        />

        {QUESTIONS.map((question) => (
          <label key={question.key} className="block text-sm text-dharma-text">
            <span lang="hi" className="font-devanagari font-semibold">{question.hi}</span>
            <span className="mt-0.5 block text-xs text-dharma-text-secondary">{question.en}</span>
            <textarea
              value={fields[question.key]}
              onChange={(event) => writeField(question.key, event.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm text-dharma-text font-devanagari leading-relaxed"
            />
          </label>
        ))}

        <label className="block text-sm text-dharma-text">
          <span lang="hi" className="font-devanagari font-semibold">अवधारणा</span>
          <select
            value={fields.tag}
            onChange={(event) => writeField('tag', event.target.value)}
            className="mt-1 block min-h-[44px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text"
          >
            <option value="">कोई नहीं</option>
            {REFLECTION_TAGS.map((tag) => (
              <option key={tag.id} value={tag.id}>{tag.hi}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-dharma-text">
          <span lang="hi" className="font-devanagari font-semibold">पुराने चिंतन खोजें</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-1 block min-h-[44px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text"
          />
        </label>
        {dates.length === 0 ? (
          <p lang="hi" className="text-sm text-dharma-text-secondary">कोई चिंतन नहीं मिला।</p>
        ) : (
          <ul className="max-h-40 space-y-1 overflow-y-auto" aria-label="चिंतन की तिथियाँ">
            {dates.map((date) => (
              <li key={date}>
                <button
                  type="button"
                  onClick={() => openDate(date)}
                  className="min-h-[44px] w-full rounded-xl px-3 text-left text-sm text-dharma-text hover:bg-dharma-bg"
                >
                  {formatDisplayDate(date).hi}
                  <span className="ml-2 text-dharma-text-secondary">{date}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between text-xs text-dharma-muted">
          <span className="inline-flex items-center gap-1.5 font-medium">
            {saveStatus === 'saving' ? (
              <span>सहेजा जा रहा है... · Saving</span>
            ) : saveStatus === 'saved' || written ? (
              <>
                <Check className="w-3.5 h-3.5 text-dharma-text-secondary" />
                <span>सहेजा गया · Saved on device</span>
              </>
            ) : (
              <span>लिखते ही स्वतः सहेजता है · Autosaves</span>
            )}
          </span>
          <span>{daysWritten} दिन लिखे गए</span>
        </div>
      </div>
    </ToolCard>
  );
}
