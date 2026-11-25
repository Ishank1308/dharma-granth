'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { answerQuestion, COPILOT_EXAMPLES, type CopilotAnswer } from '@/lib/copilot';
import { matchQuestions, type QuestionMatch, type QuestionBankEntry } from '@/lib/granth-answers-match';
import { CREDENTIAL_KEYS } from '@/lib/backup';

interface AskSlashCommand {
  id: string;
  slash: string;
  labelHi: string;
  labelEn: string;
  detailHi: string;
}

interface AskScriptureLens {
  id: 'all' | 'gita' | 'upanishad' | 'ramayana';
  token: string;
  labelHi: string;
  labelEn: string;
  matchRef: (text: string, href?: string) => boolean;
}

const ASK_COMMANDS: AskSlashCommand[] = [
  {
    id: 'studio',
    slash: '/manana',
    labelHi: 'त्रि-सोपान मनन स्टूडियो खोलें',
    labelEn: 'Open 3-Step Manana Studio',
    detailHi: 'श्लोक-दर्पण, 30-सेकंड मौन विराम व दैनिक संकल्प',
  },
  {
    id: 'random',
    slash: '/random',
    labelHi: 'कोई एक जीवन-प्रश्न चुनें',
    labelEn: 'Pick a Contemplative Question',
    detailHi: 'पुस्तकालय के 50 प्रश्नों में से एक प्रेरक जिज्ञासा',
  },
  {
    id: 'journal',
    slash: '/journal',
    labelHi: 'स्वाध्याय डायरी खोलें',
    labelEn: 'Open Sadhana Journal',
    detailHi: 'निजी स्वाध्याय नोट्स पृष्ठ पर जाएँ',
  },
  {
    id: 'clear',
    slash: '/clear',
    labelHi: 'वर्तमान जिज्ञासा स्वच्छ करें',
    labelEn: 'Clear Current Question',
    detailHi: 'नया प्रश्न पूछने के लिए प्रपत्र रिक्त करें',
  },
];

const SCRIPTURE_LENSES: AskScriptureLens[] = [
  {
    id: 'all',
    token: '@all',
    labelHi: 'सभी शास्त्र',
    labelEn: 'All Scriptures',
    matchRef: () => true,
  },
  {
    id: 'gita',
    token: '@gita',
    labelHi: 'श्रीमद्भगवद्गीता',
    labelEn: 'Bhagavad Gita',
    matchRef: (t, h) => /गीता|gita/i.test(t) || Boolean(h?.includes('bhagavadgita')),
  },
  {
    id: 'upanishad',
    token: '@upanishad',
    labelHi: 'उपनिषद्',
    labelEn: 'Upanishads',
    matchRef: (t, h) =>
      /उपनिषद|upanishad|कठ|ईश|मुण्डक|माण्डूक्य|छान्दोग्य|बृहदारण्यक/i.test(t) ||
      Boolean(h && /(katha|ishavasya|mundaka|mandukya|chandogya|brihadaranyaka|taittiriya|prashna|shvetashvatara)/.test(h)),
  },
  {
    id: 'ramayana',
    token: '@manas',
    labelHi: 'रामायण व मानस',
    labelEn: 'Ramayana & Manas',
    matchRef: (t, h) =>
      /मानस|रामायण|ramcharitmanas|ramayana/i.test(t) ||
      Boolean(h && /(ramcharitmanas|ramayana)/.test(h)),
  },
];

const STUDIO_STAGES = [
  { num: '01', hi: 'शास्त्र-दर्पण', en: 'Scriptural Mirror' },
  { num: '02', hi: 'मौन व विवेक', en: 'Pause & Inquiry' },
  { num: '03', hi: 'आज का संकल्प', en: 'Daily Resolve' },
] as const;

const MANANA_STORAGE_KEY = 'dharma.ask.manana.v1';

interface StoredMananaState {
  checked: number[];
  note: string;
}

/**
 * Full-page library guide. Every answer is assembled on the device from the library's own verses and
 * answer pages; nothing the reader types leaves the browser.
 */
export function AskDharmaClient({ questionBank = [] }: { questionBank?: QuestionBankEntry[] }) {
  const router = useRouter();
  const baseId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const studioTriggerRef = useRef<HTMLButtonElement>(null);
  const studioSectionRef = useRef<HTMLElement>(null);
  const stageTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [queryInput, setQueryInput] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState<CopilotAnswer | null>(null);
  const [matches, setMatches] = useState<QuestionMatch[] | null>(null);
  const [activeLens, setActiveLens] = useState<AskScriptureLens['id']>('all');
  const [popoverIndex, setPopoverIndex] = useState(-1);

  // Interactive 3-Step Dharma Manana Studio state
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioStage, setStudioStage] = useState<0 | 1 | 2>(0);
  const [pauseSeconds, setPauseSeconds] = useState(30);
  const [pauseRunning, setPauseRunning] = useState(false);
  const [timerStatus, setTimerStatus] = useState('');
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [privateNote, setPrivateNote] = useState('');

  // This page once had an AI helper that kept the reader's own API key in the browser. Forget it.
  useEffect(() => {
    try {
      for (const key of CREDENTIAL_KEYS) window.localStorage.removeItem(key);
    } catch {
      // Storage can be unavailable (private mode); there is nothing to remove then.
    }
  }, []);

  // Load local-only Manana checklist & private reflection note
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MANANA_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<StoredMananaState>;
      if (Array.isArray(parsed.checked)) {
        setCheckedSteps(parsed.checked.filter((n): n is number => typeof n === 'number'));
      }
      if (typeof parsed.note === 'string') {
        setPrivateNote(parsed.note);
      }
    } catch {
      // Ignore private-mode storage restrictions
    }
  }, []);

  // 30-second calm contemplation timer
  useEffect(() => {
    if (!pauseRunning) return undefined;
    const id = window.setInterval(() => {
      setPauseSeconds((prev) => {
        if (prev <= 1) {
          setPauseRunning(false);
          setTimerStatus('30 सेकंड मौन विराम पूर्ण हुआ · 30s contemplation complete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [pauseRunning]);

  const persistManana = (nextChecked: number[], nextNote: string) => {
    try {
      if (nextChecked.length === 0 && !nextNote.trim()) {
        window.localStorage.removeItem(MANANA_STORAGE_KEY);
      } else {
        window.localStorage.setItem(
          MANANA_STORAGE_KEY,
          JSON.stringify({ checked: nextChecked, note: nextNote }),
        );
      }
    } catch {
      // Keep session state when storage is unavailable
    }
  };

  const toggleMananaCheck = (idx: number) => {
    const next = checkedSteps.includes(idx)
      ? checkedSteps.filter((i) => i !== idx)
      : [...checkedSteps, idx].sort((a, b) => a - b);
    setCheckedSteps(next);
    persistManana(next, privateNote);
  };

  const handleNoteChange = (val: string) => {
    setPrivateNote(val);
    persistManana(checkedSteps, val);
  };

  const extractLensFromQuery = (raw: string): { cleanText: string; lensId: AskScriptureLens['id'] | null } => {
    const m = raw.trim().match(/^@(all|gita|bg|गीता|upanishads?|उपनिषद्?|manas|ramayana|मानस|रामायण)(?=\s|$)\s*(.*)$/i);
    if (!m) return { cleanText: raw.trim(), lensId: null };
    const tag = m[1].toLowerCase();
    const rest = m[2].trim();
    if (tag === 'gita' || tag === 'bg' || tag === 'गीता') return { cleanText: rest, lensId: 'gita' };
    if (tag.startsWith('upanishad') || tag.startsWith('उपनिषद')) return { cleanText: rest, lensId: 'upanishad' };
    if (tag === 'manas' || tag === 'ramayana' || tag === 'मानस' || tag === 'रामायण') {
      return { cleanText: rest, lensId: 'ramayana' };
    }
    return { cleanText: rest, lensId: 'all' };
  };

  const closeStudio = () => {
    setStudioOpen(false);
    requestAnimationFrame(() => studioTriggerRef.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    if (!studioOpen) return undefined;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (!studioSectionRef.current?.contains(document.activeElement)) return;
      e.preventDefault();
      closeStudio();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [studioOpen]);

  const runSlashCommand = (cmdId: string) => {
    if (cmdId === 'studio') {
      setStudioOpen(true);
      setStudioStage(0);
      setQueryInput('');
      setPopoverIndex(-1);
      return;
    }
    if (cmdId === 'random') {
      const pool = questionBank.length > 0 ? questionBank.map((q) => q.questionHi) : COPILOT_EXAMPLES.map((e) => e.hi);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) ask(pick);
      return;
    }
    if (cmdId === 'journal') {
      router.push('/practice/journal/');
      return;
    }
    if (cmdId === 'clear') {
      setQueryInput('');
      setAsked('');
      setAnswer(null);
      setMatches(null);
      setPopoverIndex(-1);
    }
  };

  const ask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('/')) {
      const q = trimmed.slice(1).toLowerCase();
      const matchedCmd = ASK_COMMANDS.find(
        (c) => c.slash.slice(1).startsWith(q) || c.id.startsWith(q),
      );
      if (matchedCmd) {
        runSlashCommand(matchedCmd.id);
        return;
      }
    }

    const { cleanText, lensId } = extractLensFromQuery(trimmed);
    if (lensId) {
      setActiveLens(lensId);
      if (!cleanText) {
        setQueryInput('');
        setPopoverIndex(-1);
        inputRef.current?.focus();
        return;
      }
    }
    const effective = cleanText || COPILOT_EXAMPLES[0]?.hi || 'कर्मयोग क्या है?';
    setQueryInput(effective);
    setAsked(effective);
    setPopoverIndex(-1);
    setMatches(matchQuestions(effective, questionBank));
    setAnswer(answerQuestion(effective));
  };

  const trimmedInput = queryInput.trim();
  const isSlashMode = trimmedInput.startsWith('/');
  const slashFilter = isSlashMode ? trimmedInput.slice(1).toLowerCase() : '';
  const visibleCommands = useMemo(() => {
    if (!isSlashMode) return [];
    if (!slashFilter) return ASK_COMMANDS;
    return ASK_COMMANDS.filter(
      (c) =>
        c.slash.toLowerCase().includes(slashFilter) ||
        c.labelHi.includes(slashFilter) ||
        c.labelEn.toLowerCase().includes(slashFilter),
    );
  }, [isSlashMode, slashFilter]);

  const isMentionMode = trimmedInput.startsWith('@') && !trimmedInput.includes(' ');
  const mentionFilter = isMentionMode ? trimmedInput.slice(1).toLowerCase() : '';
  const visibleLenses = useMemo(() => {
    if (!isMentionMode) return [];
    if (!mentionFilter) return SCRIPTURE_LENSES;
    return SCRIPTURE_LENSES.filter(
      (l) =>
        l.token.toLowerCase().includes(mentionFilter) ||
        l.id.includes(mentionFilter) ||
        l.labelEn.toLowerCase().includes(mentionFilter) ||
        l.labelHi.includes(mentionFilter),
    );
  }, [isMentionMode, mentionFilter]);

  const activePopover = isSlashMode && visibleCommands.length > 0
    ? 'slash'
    : isMentionMode && visibleLenses.length > 0
      ? 'mention'
      : null;
  const slashListId = `${baseId}-slash-list`;
  const mentionListId = `${baseId}-mention-list`;

  useEffect(() => {
    setPopoverIndex(-1);
  }, [queryInput]);

  const selectLensFromPopover = (lens: AskScriptureLens) => {
    setActiveLens(lens.id);
    setQueryInput('');
    setPopoverIndex(-1);
    inputRef.current?.focus();
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (!activePopover) return;
    const count = activePopover === 'slash' ? visibleCommands.length : visibleLenses.length;
    if (count === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setPopoverIndex((i) => (i + 1) % count);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setPopoverIndex((i) => (i < 0 ? count - 1 : (i - 1 + count) % count));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQueryInput('');
      setPopoverIndex(-1);
    } else if (e.key === 'Tab' && !e.shiftKey && activePopover === 'mention') {
      e.preventDefault();
      const chosen = visibleLenses[popoverIndex >= 0 ? popoverIndex % count : 0];
      if (chosen) selectLensFromPopover(chosen);
    } else if (e.key === 'Enter') {
      if (activePopover === 'slash') {
        e.preventDefault();
        const chosen = visibleCommands[popoverIndex >= 0 ? popoverIndex % count : 0];
        if (chosen) runSlashCommand(chosen.id);
      } else if (activePopover === 'mention') {
        e.preventDefault();
        const chosen = visibleLenses[popoverIndex >= 0 ? popoverIndex % count : 0];
        if (chosen) selectLensFromPopover(chosen);
      }
    }
  };

  const handleStageKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = STUDIO_STAGES.length - 1;
    let next: number;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setStudioStage(next as 0 | 1 | 2);
    stageTabRefs.current[next]?.focus();
  };
  const currentLensObj = SCRIPTURE_LENSES.find((l) => l.id === activeLens) ?? SCRIPTURE_LENSES[0];

  const scopedVerses = useMemo(() => {
    if (!answer?.verses) return [];
    if (activeLens === 'all') return answer.verses;
    const filtered = answer.verses.filter((v) =>
      currentLensObj.matchRef(`${v.refHi} ${v.refEn}`, v.href),
    );
    return filtered.length > 0 ? filtered : answer.verses;
  }, [answer, activeLens, currentLensObj]);

  const topMatch = matches && matches.length > 0 ? matches[0].entry : null;
  const studioResolves = useMemo(() => {
    const items: string[] = [];
    if (answer?.dailyHi) items.push(answer.dailyHi);
    items.push('प्रतिक्रिया देने से पूर्व 3 शांत श्वास लेकर अपने साक्षी भाव में ठहरें।');
    items.push('आज के एक कर्तव्य को फल की आसक्ति से मुक्त होकर पूर्ण निष्ठा से निभाएँ।');
    return items.slice(0, 3);
  }, [answer?.dailyHi]);

  const pauseRingR = 30;
  const pauseRingC = 2 * Math.PI * pauseRingR;
  const pauseDashOffset = pauseRingC * (pauseSeconds / 30);

  return (
    <div className="grid gap-8">
      <form
        className="apple-card grid grid-cols-1 gap-4 p-5 sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          ask(queryInput);
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="ask-dharma-q" className="text-subhead font-semibold">
            <span lang="hi" data-bi="hi" className="font-devanagari">अपना प्रश्न लिखें</span>
            <span data-bi="sep"> · </span>
            <span data-bi="en">Write your question</span>
          </label>
          <span className="text-caption text-dharma-muted font-mono">
            <kbd className="rounded border border-dharma-border bg-dharma-bg px-1.5 py-0.5 text-[11px]">/</kbd>{' '}
            <span lang="hi" className="font-sans">क्रियाएँ</span> ·{' '}
            <kbd className="rounded border border-dharma-border bg-dharma-bg px-1.5 py-0.5 text-[11px]">@</kbd>{' '}
            <span lang="hi" className="font-sans">शास्त्र-चयन</span>
          </span>
        </div>

        {/* @ Scripture Lens Selector Strip */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="शास्त्र परिप्रेक्ष्य · Scripture scope">
          <span className="mr-1 text-caption font-semibold text-dharma-muted">
            <Compass className="mr-1 inline h-3.5 w-3.5 text-dharma-saffron" aria-hidden="true" />
            <span lang="hi" data-bi="hi" className="font-devanagari">शास्त्र दृष्टि:</span>
            <span data-bi="en-only">Scope:</span>
          </span>
          {SCRIPTURE_LENSES.map((lens) => {
            const selected = activeLens === lens.id;
            return (
              <button
                key={lens.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveLens(lens.id)}
                className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 text-caption font-semibold transition ${
                  selected
                    ? 'border-dharma-saffron bg-dharma-saffron text-white shadow-2xs dark:text-black'
                    : 'border-dharma-border bg-dharma-bg/70 text-dharma-text hover:border-dharma-saffron/50'
                }`}
              >
                <span className="font-mono text-[11px] opacity-80">{lens.token}</span>
                <span lang="hi" data-bi="hi" className="font-devanagari">{lens.labelHi}</span>
                <span data-bi="en-only">{lens.labelEn}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            id="ask-dharma-q"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="उदाहरण: क्रोध कैसे संभालें? · /manana · @gita कर्तव्य"
            lang="hi"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={activePopover !== null}
            aria-controls={
              activePopover === 'slash'
                ? slashListId
                : activePopover === 'mention'
                  ? mentionListId
                  : undefined
            }
            aria-activedescendant={
              popoverIndex >= 0 && activePopover
                ? `ask-${activePopover}-opt-${popoverIndex}`
                : undefined
            }
            className="apple-field"
          />
          <button type="submit" className="apple-pill shrink-0 min-h-[44px]">
            <span lang="hi" data-bi="hi">उत्तर देखें</span>
            <span data-bi="en-only">See answer</span>
          </button>
        </div>

        {/* Inline Slash Command Menu (Antigravity '/' UX) */}
        {isSlashMode && visibleCommands.length > 0 && (
          <div
            role="region"
            aria-label="त्वरित निर्देश · Quick commands"
            className="rounded-2xl border border-dharma-border bg-dharma-bg/85 p-2.5 space-y-1.5"
          >
            <div className="flex items-center justify-between px-2 text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
              <span>
                <span lang="hi" data-bi="hi" className="font-devanagari">त्वरित निर्देश</span>
                <span data-bi="sep" aria-hidden="true"> · </span>
                <span data-bi="en" className="uppercase tracking-wider">Slash Commands</span>
              </span>
              <span className="font-mono text-dharma-muted">↑↓ · Enter</span>
            </div>
            <div id={slashListId} role="listbox" aria-label="Slash commands" className="grid gap-1.5 sm:grid-cols-2">
              {visibleCommands.map((cmd, idx) => {
                const highlighted = popoverIndex >= 0 && idx === popoverIndex % visibleCommands.length;
                return (
                <button
                  key={cmd.id}
                  id={`ask-slash-opt-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={highlighted}
                  onClick={() => runSlashCommand(cmd.id)}
                  onMouseMove={() => {
                    if (popoverIndex !== idx) setPopoverIndex(idx);
                  }}
                  className={`focus-ring flex min-h-[44px] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition ${
                    highlighted
                      ? 'border-dharma-saffron bg-dharma-saffron/12 ring-1 ring-dharma-saffron/30'
                      : 'border-dharma-border/80 bg-dharma-card hover:border-dharma-saffron/60'
                  }`}
                >
                  <span className="min-w-0">
                    <span lang="hi" className="block truncate font-devanagari text-xs font-semibold text-dharma-text">
                      {cmd.labelHi}
                    </span>
                    <span lang="hi" className="block truncate font-devanagari text-[11px] text-dharma-muted">
                      {cmd.detailHi}
                    </span>
                  </span>
                  <code className="shrink-0 rounded border border-dharma-border bg-dharma-bg px-2 py-0.5 font-mono text-xs text-saffron-800 dark:text-saffron-300">
                    {cmd.slash}
                  </code>
                </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Inline '@' Scripture Mention Autocomplete */}
        {isMentionMode && (
          <div
            role="region"
            aria-label="शास्त्र चुनें · Select scripture lens"
            className="rounded-2xl border border-dharma-border bg-dharma-bg/85 p-2.5 space-y-2"
          >
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-dharma-muted">
              <span lang="hi" className="font-devanagari">शास्त्र चुनें:</span>
              <span className="font-mono text-[11px]">↑↓ · Tab / Enter</span>
            </div>
            {visibleLenses.length === 0 ? (
              <p className="px-1 text-xs text-dharma-muted">
                <span lang="hi" className="font-devanagari">कोई मेल नहीं — </span>
                <code className="text-saffron-800 dark:text-saffron-300">@gita</code>,{' '}
                <code className="text-saffron-800 dark:text-saffron-300">@upanishad</code>,{' '}
                <code className="text-saffron-800 dark:text-saffron-300">@manas</code>
              </p>
            ) : (
              <div id={mentionListId} role="listbox" aria-label="Scripture scope options" className="flex flex-wrap items-center gap-2">
                {visibleLenses.map((lens, idx) => {
                  const highlighted = popoverIndex >= 0 && idx === popoverIndex % visibleLenses.length;
                  return (
                  <button
                    key={lens.id}
                    id={`ask-mention-opt-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={highlighted}
                    onClick={() => selectLensFromPopover(lens)}
                    onMouseMove={() => {
                      if (popoverIndex !== idx) setPopoverIndex(idx);
                    }}
                    className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold text-dharma-text transition ${
                      highlighted
                        ? 'border-dharma-saffron bg-dharma-saffron/12 ring-1 ring-dharma-saffron/30'
                        : 'border-dharma-border bg-dharma-card hover:border-dharma-saffron'
                    }`}
                  >
                    <span className="font-mono text-saffron-800 dark:text-saffron-300">{lens.token}</span>
                    <span lang="hi" data-bi="hi" className="font-devanagari">{lens.labelHi}</span>
                    <span data-bi="en-only">{lens.labelEn}</span>
                  </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-2">
            {COPILOT_EXAMPLES.map((example) => (
              <button
                key={example.en}
                type="button"
                onClick={() => ask(example.hi)}
                className="min-h-[44px] rounded-full bg-dharma-text/[0.06] px-3.5 text-left text-[14px] text-dharma-text transition hover:bg-dharma-text/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-saffron"
              >
                <span lang="hi">{example.hi}</span>
              </button>
            ))}
          </div>

          <button
            ref={studioTriggerRef}
            type="button"
            aria-expanded={studioOpen}
            aria-controls={studioOpen ? 'ask-manana-studio' : undefined}
            onClick={() => setStudioOpen((v) => !v)}
            className="focus-ring inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-dharma-saffron/45 bg-dharma-saffron/12 px-4 text-xs font-semibold text-dharma-text transition hover:bg-dharma-saffron/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-dharma-saffron" aria-hidden="true" />
            <span lang="hi" data-bi="hi" className="font-devanagari">मनन स्टूडियो</span>
            <span data-bi="sep"> · </span>
            <span data-bi="en">3-Step Studio</span>
          </button>
        </div>
      </form>

      {/* Interactive 3-Step Dharma Manana Studio */}
      {studioOpen && (
        <section
          ref={studioSectionRef}
          id="ask-manana-studio"
          aria-labelledby="ask-manana-heading"
          className="apple-card overflow-hidden border border-dharma-saffron/35 p-5 sm:p-7 space-y-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dharma-border pb-4">
            <div>
              <p className="text-[11px] font-bold text-saffron-800 dark:text-saffron-300">
                <span lang="hi" data-bi="hi" className="font-devanagari">संपादकीय अभ्यास · मूल शास्त्र नहीं</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en" className="uppercase tracking-wider">Editorial Application · Not Scripture</span>
              </p>
              <h2 id="ask-manana-heading" className="mt-1 text-title-3 font-semibold text-dharma-text">
                <span lang="hi" data-bi="hi" className="font-devanagari">त्रि-सोपान धर्म मनन स्टूडियो</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">3-Step Dharma Reflection Studio</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={closeStudio}
              aria-label="मनन स्टूडियो बंद करें · Close Reflection Studio"
              className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div role="tablist" aria-label="मनन चरण · Studio stages" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {STUDIO_STAGES.map((s, idx) => {
              const active = studioStage === idx;
              return (
                <button
                  key={s.num}
                  ref={(el) => {
                    stageTabRefs.current[idx] = el;
                  }}
                  id={`${baseId}-stage-tab-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${baseId}-stage-panel`}
                  tabIndex={active ? 0 : -1}
                  onKeyDown={(e) => handleStageKeyDown(e, idx)}
                  onClick={() => setStudioStage(idx as 0 | 1 | 2)}
                  className={`focus-ring flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-left text-xs font-semibold transition ${
                    active
                      ? 'border-dharma-saffron bg-dharma-saffron/15 text-dharma-text'
                      : 'border-dharma-border bg-dharma-bg/60 text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold tabular-nums text-saffron-800 dark:text-saffron-300">{s.num}</span>
                  <span>
                    <span lang="hi" data-bi="hi" className="font-devanagari">{s.hi}</span>
                    <span data-bi="sep"> · </span>
                    <span data-bi="en">{s.en}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-stage-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-stage-tab-${studioStage}`}
          >

          {studioStage === 0 && (
            <div className="space-y-4">
              {topMatch ? (
                <div className="rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4 sm:p-5 space-y-2">
                  <p className="text-xs font-semibold text-dharma-saffron">
                    <span lang="hi" className="font-devanagari">चयनित प्रश्न-सार</span> · Matched Guidance
                  </p>
                  <p lang="hi" className="font-devanagari text-lg font-semibold text-dharma-text">
                    {topMatch.questionHi}
                  </p>
                  <p lang="hi" className="font-devanagari text-base leading-relaxed text-dharma-text">
                    {topMatch.sarHi}
                  </p>
                  <Link
                    href={`/ask/${topMatch.slug}/`}
                    className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-dharma-saffron hover:underline"
                  >
                    <span lang="hi" className="font-devanagari">पूर्ण श्लोक-उत्तर खोलें</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : scopedVerses[0] ? (
                <div className="rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4 sm:p-5 space-y-2.5">
                  <p className="text-xs font-semibold text-dharma-saffron">{scopedVerses[0].refHi}</p>
                  <p lang="sa" className="whitespace-pre-line font-devanagari text-lg font-semibold leading-loose text-dharma-text">
                    {scopedVerses[0].sanskrit}
                  </p>
                  <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-text">
                    {scopedVerses[0].hindi}
                  </p>
                  <Link
                    href={scopedVerses[0].href}
                    className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-dharma-saffron hover:underline"
                  >
                    <span lang="hi" className="font-devanagari">ग्रन्थालय में श्लोक पढ़ें</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4 sm:p-5 space-y-2">
                  <p lang="sa" className="font-devanagari text-lg font-semibold leading-loose text-dharma-text">
                    कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ॥ (श्रीमद्भगवद्गीता 2.47)
                  </p>
                  <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-muted">
                    ऊपर कोई भी जीवन-प्रश्न पूछें — उससे जुड़े प्रमाणित श्लोक यहाँ मनन के लिए स्वतः आ जाएँगे।
                  </p>
                </div>
              )}
            </div>
          )}

          {studioStage === 1 && (
            <div className="grid gap-4 sm:grid-cols-12 items-center rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4 sm:p-5">
              <div className="sm:col-span-5 flex flex-col items-center gap-3">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 76 76" aria-hidden="true">
                    <circle
                      cx="38"
                      cy="38"
                      r={pauseRingR}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      className="text-dharma-border"
                    />
                    <circle
                      cx="38"
                      cy="38"
                      r={pauseRingR}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeDasharray={pauseRingC}
                      strokeDashoffset={pauseDashOffset}
                      strokeLinecap="round"
                      className="text-dharma-saffron transition-[stroke-dashoffset] duration-300"
                    />
                  </svg>
                  <span className="absolute font-mono text-lg font-bold tabular-nums text-dharma-text">
                    {pauseSeconds}s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (pauseSeconds === 0) setPauseSeconds(30);
                      setTimerStatus(pauseRunning ? '' : '30 सेकंड मौन विराम प्रारंभ · Contemplation timer started');
                      setPauseRunning((r) => !r);
                    }}
                    className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-dharma-saffron px-4 text-xs font-semibold text-white dark:text-black"
                  >
                    {pauseRunning ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                    <span lang="hi" className="font-devanagari">{pauseRunning ? 'विराम' : '30s मौन'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPauseRunning(false);
                      setPauseSeconds(30);
                      setTimerStatus('');
                    }}
                    aria-label="समय पुनः 30 सेकंड करें · Reset 30s timer"
                    className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-card text-dharma-text"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p role="status" aria-live="polite" className="sr-only">
                  {timerStatus}
                </p>
              </div>
              <div className="sm:col-span-7 space-y-2">
                <p className="text-xs font-semibold text-saffron-800 dark:text-saffron-300">
                  <span lang="hi" data-bi="hi" className="font-devanagari">आत्म-विवेक प्रश्न</span>
                  <span data-bi="sep" aria-hidden="true"> · </span>
                  <span data-bi="en" className="uppercase tracking-wider">Self-Inquiry</span>
                </p>
                <p lang="hi" className="font-devanagari text-base leading-relaxed text-dharma-text">
                  {asked
                    ? `“${asked}” — इस परिस्थिति में कौन-सा भाग आपके प्रत्यक्ष कर्तव्य में है, और कौन-सी अनावश्यक चिन्ता आप शांत भाव से छोड़ सकते हैं?`
                    : 'आज की परिस्थिति में कौन-सा एक कर्तव्य आपके हाथ में है जिसे आप शांत और स्थिर मन से पूर्ण कर सकते हैं?'}
                </p>
                <p className="text-xs text-dharma-muted">
                  Take 30 quiet seconds to separate your present duty from anxious attachment to outcomes.
                </p>
              </div>
            </div>
          )}

          {studioStage === 2 && (
            <div className="space-y-4">
              <ul className="space-y-2">
                {studioResolves.map((stepText, idx) => {
                  const done = checkedSteps.includes(idx);
                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        aria-pressed={done}
                        onClick={() => toggleMananaCheck(idx)}
                        className={`focus-ring flex min-h-[48px] w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          done
                            ? 'border-emerald-600/45 bg-emerald-500/10 text-dharma-text'
                            : 'border-dharma-border bg-dharma-bg/65 text-dharma-text hover:border-dharma-saffron/50'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            done ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-dharma-border bg-dharma-card'
                          }`}
                        >
                          {done && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span lang="hi" className="font-devanagari text-sm leading-relaxed">
                          {stepText}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-1.5">
                <label htmlFor="ask-private-note" className="flex items-center justify-between text-xs font-semibold text-dharma-muted">
                  <span>
                    <Lock className="mr-1 inline h-3 w-3" aria-hidden="true" />
                    <span lang="hi" className="font-devanagari">निजी संकल्प नोट (केवल आपके उपकरण पर सुरक्षित)</span>
                  </span>
                  <span className="font-mono text-[11px]">Local-only</span>
                </label>
                <textarea
                  id="ask-private-note"
                  rows={2}
                  value={privateNote}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="आज का एक शांत संकल्प लिखें..."
                  lang="hi"
                  className="apple-field min-h-[68px] py-2.5 text-sm"
                />
              </div>
            </div>
          )}
          </div>
        </section>
      )}

      {matches && matches.length > 0 && (
        <section className="grid gap-4" aria-labelledby="granth-matches">
          <Link
            href={`/ask/${matches[0].entry.slug}/`}
            className="apple-card grid gap-2 p-5 transition hover:-translate-y-0.5 sm:p-7"
          >
            <span id="granth-matches" className="text-footnote font-semibold text-dharma-saffron">
              <span lang="hi" data-bi="hi" className="font-devanagari">आपका उत्तर</span>
              <span data-bi="sep" aria-hidden="true"> · </span>
              <span data-bi="en">Your answer</span>
            </span>
            <span lang="hi" className="font-devanagari text-2xl font-semibold">{matches[0].entry.questionHi}</span>
            <span className="text-dharma-text-secondary">{matches[0].entry.questionEn}</span>
            <span lang="hi" className="font-devanagari text-lg leading-relaxed">{matches[0].entry.sarHi}</span>
            <span className="mt-1 inline-flex items-center gap-1.5 text-dharma-saffron">
              <span lang="hi" data-bi="hi" className="font-devanagari">पूरा उत्तर पढ़ें</span>
              <span data-bi="sep" aria-hidden="true"> · </span>
              <span data-bi="en">Read the answer</span> <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
          {matches.length > 1 && (
            <p className="px-1 text-sm text-dharma-text-secondary">
              <span lang="hi" data-bi="hi" className="font-devanagari">मिलते‑जुलते प्रश्न:</span>
              <span data-bi="sep" aria-hidden="true"> </span>
              <span data-bi="en">Close questions:</span>{' '}
              {matches.slice(1, 3).map(({ entry }, i) => (
                <span key={entry.slug}>
                  {i > 0 && ' · '}
                  <Link href={`/ask/${entry.slug}/`} lang="hi" className="font-devanagari text-dharma-saffron hover:underline">
                    {entry.questionHi}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </section>
      )}

      {matches && matches.length === 0 && !answer && (
        <p className="apple-card p-5 text-subhead text-dharma-text-secondary">
          <span lang="hi">इस प्रश्न का उत्तर‑पृष्ठ अभी नहीं बना। नीचे की सूची में मिलता‑जुलता प्रश्न देखें।</span>{' '}
          <span>No answer page for this yet. Look for a close question in the list below.</span>
        </p>
      )}

      {answer && !(matches && matches.length > 0) && (
        <article className="apple-card grid gap-6 p-5 sm:p-8" lang="hi">
          <header className="grid gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-dharma-text-secondary">{asked}</p>
              {activeLens !== 'all' && (
                <span className="rounded-full border border-dharma-saffron/40 bg-dharma-saffron/10 px-2.5 py-0.5 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
                  {currentLensObj.token} · {currentLensObj.labelHi}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-semibold sm:text-3xl">{answer.titleHi}</h2>
            {answer.titleEn !== answer.titleHi && <p className="text-dharma-text-secondary">{answer.titleEn}</p>}
            <p className="flex items-start gap-2 text-sm text-dharma-text-secondary">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>यह उत्तर पुस्तकालय के श्लोकों और विषय-पृष्ठों से जोड़ा गया है। नई टीका नहीं लिखी जाती। यह दैवीय आदेश नहीं है।</span>
            </p>
          </header>

          {scopedVerses.length > 0 && (
            <section className="grid gap-4">
              <h3 className="flex items-center gap-2 font-bold"><BookOpen className="h-4 w-4" aria-hidden="true" /> संबंधित श्लोक</h3>
              {scopedVerses.map((verse) => (
                <div key={verse.href + verse.refEn} className="grid gap-2 rounded-group bg-dharma-text/[0.04] p-4">
                  <p className="text-sm font-semibold">{verse.refHi}</p>
                  <p lang="sa" className="whitespace-pre-line text-lg leading-relaxed">{verse.sanskrit}</p>
                  <p>{verse.hindi}</p>
                  <p className="text-sm text-dharma-text-secondary" lang="en">{verse.english}</p>
                  {verse.noteHi && <p className="text-sm">{verse.noteHi}</p>}
                  <Link href={verse.href} className="inline-flex min-h-11 items-center font-semibold text-dharma-saffron hover:underline">
                    श्लोक पृष्ठ खोलें
                  </Link>
                </div>
              ))}
            </section>
          )}

          {answer.simpleHi && (
            <section>
              <h3 className="font-bold">सरल अर्थ</h3>
              <p className="mt-1">{answer.simpleHi}</p>
            </section>
          )}
          {answer.contextHi && (
            <section>
              <h3 className="font-bold">पुस्तकालय में दर्ज संदर्भ</h3>
              <p className="mt-1">{answer.contextHi}</p>
            </section>
          )}
          {answer.applicationHi && (
            <section>
              <h3 className="font-bold">आज के जीवन में</h3>
              <p className="mt-1">{answer.applicationHi}</p>
            </section>
          )}
          {answer.dailyHi && (
            <section>
              <h3 className="font-bold">आज का एक कदम</h3>
              <p className="mt-1">{answer.dailyHi}</p>
            </section>
          )}
          {answer.related.length > 0 && (
            <section>
              <h3 className="font-bold">आगे पढ़ें</h3>
              <ul className="mt-1 grid gap-1">
                {answer.related.map((link) => (
                  <li key={link.href + link.labelEn}>
                    <Link href={link.href} className="inline-flex min-h-11 items-center font-semibold text-dharma-saffron hover:underline">
                      {link.labelHi}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {answer.disclaimerHi && <p className="text-sm text-dharma-text-secondary">{answer.disclaimerHi}</p>}
        </article>
      )}
    </div>
  );
}
