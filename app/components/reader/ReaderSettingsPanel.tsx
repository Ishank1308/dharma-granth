'use client';

import { useId, type ReactNode } from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { THEME_NAMES, type Theme } from '@/app/components/ThemeProvider';
import type { ContrastPref, LineSpacing, NumberFormatPref, ReaderLanguagePref, ReaderSettings, ReadingWidth, SizeStep } from '@/lib/useReaderSettings';
import { triggerTactileFeedback } from '@/lib/haptics';
import { ReaderControlBar } from './ReaderControlBar';
import { ReaderDialog } from './ReaderDialog';

interface Choice<T extends string> {
  id: T;
  label: string;
  hint?: string;
}

/** A row of mutually exclusive options, as native radios so arrows, labels and announcements just work. */
function Segmented<T extends string>({
  legend,
  legendHi,
  value,
  options,
  onChange,
  columns,
}: {
  legend: string;
  legendHi: string;
  value: T;
  options: Array<Choice<T>>;
  onChange: (v: T) => void;
  columns: string;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-2 text-subhead font-semibold text-label-primary">
        {legend}
        <span lang="hi" className="ml-2 font-devanagari text-footnote font-normal text-label-secondary">
          {legendHi}
        </span>
      </legend>
      <div className={`grid gap-2 ${columns}`}>
        {options.map((o) => (
          <label key={o.id} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => {
                triggerTactileFeedback('selection', 'softTap');
                onChange(o.id);
              }}
              className="peer sr-only"
            />
            <span className="flex min-h-[44px] flex-col items-center justify-center rounded-xl border border-separator/80 bg-surface-raised px-2.5 py-1.5 text-center text-subhead font-semibold text-label-secondary transition-all peer-checked:border-separator peer-checked:bg-surface-elevated peer-checked:text-label-primary peer-checked:shadow-xs peer-checked:ring-1 peer-checked:ring-accent/40 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background hover:bg-fill-quaternary hover:text-label-primary">
              <span>{o.label}</span>
              {o.hint && <span className="text-caption-2 font-normal text-label-tertiary">{o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: ReactNode;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex min-h-[48px] cursor-pointer items-center justify-between gap-4 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-fill-quaternary/50">
      <span className="min-w-0">
        <span className="block text-subhead font-medium text-label-primary">{label}</span>
        {hint && <span className="block text-caption-1 text-label-secondary">{hint}</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          triggerTactileFeedback('selection', 'softTap');
          onChange(e.target.checked);
        }}
        className="h-5 w-5 shrink-0 rounded accent-accent"
      />
    </label>
  );
}

const NUMBERS: Array<Choice<NumberFormatPref>> = [
  { id: 'indian', label: '1,23,456', hint: 'Indian grouping' },
  { id: 'international', label: '123,456', hint: 'International grouping' },
];

const LANGUAGES_PREF: Array<Choice<ReaderLanguagePref>> = [
  { id: 'all', label: 'Bilingual', hint: 'द्विभाषी' },
  { id: 'hindi', label: 'हिन्दी', hint: 'Hindi' },
  { id: 'english', label: 'English', hint: 'English' },
];

const CONTRASTS: Array<Choice<ContrastPref>> = [
  { id: 'standard', label: 'Standard' },
  { id: 'high', label: 'High contrast' },
];

/** Sample sized exactly like the verse, so a change can be judged before closing the panel. */
const PREVIEW_SIZE: Record<SizeStep, string> = { sm: 'text-xl', md: 'text-2xl', lg: 'text-[1.75rem]', xl: 'text-3xl' };
const PREVIEW_LEADING: Record<LineSpacing, string> = { compact: 'leading-[1.7]', normal: 'leading-[1.85]', relaxed: 'leading-[2.05]', loose: 'leading-[2.35]' };

const SIZES: Array<Choice<SizeStep>> = [
  { id: 'sm', label: 'S' },
  { id: 'md', label: 'M' },
  { id: 'lg', label: 'L' },
  { id: 'xl', label: 'XL' },
];

const SPACINGS: Array<Choice<LineSpacing>> = [
  { id: 'compact', label: 'Tight' },
  { id: 'normal', label: 'Normal' },
  { id: 'relaxed', label: 'Roomy' },
  { id: 'loose', label: 'Airy' },
];

const WIDTHS: Array<Choice<ReadingWidth>> = [
  { id: 'narrow', label: 'Narrow' },
  { id: 'standard', label: 'Standard' },
  { id: 'wide', label: 'Wide' },
];

// Names come from THEME_NAMES so every picker shows the same Usha / Sandhyā / Rātri / Bhojpatra.
const THEMES: Array<{ id: Theme; label: string; hi: string; swatch: string; ring: string }> = [
  { id: 'day', label: THEME_NAMES.day.name, hi: THEME_NAMES.day.hi, swatch: '#fdfbf7', ring: '#e8e3db' },
  { id: 'sunset', label: THEME_NAMES.sunset.name, hi: THEME_NAMES.sunset.hi, swatch: '#fff4e5', ring: '#ecc9a7' },
  { id: 'night', label: THEME_NAMES.night.name, hi: THEME_NAMES.night.hi, swatch: '#090908', ring: '#4a4036' },
  { id: 'paper', label: THEME_NAMES.paper.name, hi: THEME_NAMES.paper.hi, swatch: '#f5ede0', ring: '#d9c9ae' },
];

export function ReaderSettingsPanel({
  open,
  onClose,
  settings,
  update,
  reset,
  reducedMotion,
  theme,
  setTheme,
  scope = 'verse',
  additionalControls,
}: {
  open: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  update: <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => void;
  reset: () => void;
  /** Effective value (the reader's choice, else the device preference). */
  reducedMotion: boolean;
  theme: Theme;
  setTheme: (t: Theme) => void;
  /** Hide controls that do not apply to chapter reading while keeping shared preferences. */
  scope?: 'verse' | 'chapter';
  additionalControls?: ReactNode;
}) {
  const themeName = useId();
  return (
    <ReaderDialog
      open={open}
      onClose={onClose}
      variant="side"
      title="Reader settings"
      titleHi="पठन व्यवस्था"
      icon={<SlidersHorizontal className="h-5 w-5 text-saffron-700" aria-hidden="true" />}
      footer={
        <button
          type="button"
          onClick={() => {
            triggerTactileFeedback('selection', 'softTap');
            reset();
          }}
          className="focus-ring inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-pill border border-separator/80 bg-surface-raised text-subhead font-semibold text-label-secondary transition hover:bg-fill-quaternary hover:text-label-primary shadow-xs"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset to defaults
        </button>
      }
    >
      <div className="space-y-6">
        <div aria-hidden="true" className="rounded-card border border-separator/80 bg-surface-raised p-4 text-center shadow-xs">
          <p className="mb-1 text-caption-2 font-semibold uppercase tracking-wider text-label-tertiary">Preview · पूर्वावलोकन</p>
          <p lang="sa" className={`font-devanagari text-label-primary ${PREVIEW_SIZE[settings.sanskritSize]} ${PREVIEW_LEADING[settings.lineSpacing]}`}>
            कर्मण्येवाधिकारस्ते<br />मा फलेषु कदाचन ।
          </p>
        </div>

        {scope === 'verse' && (
          <fieldset>
            <legend className="mb-2 text-subhead font-semibold text-label-primary">
              Reading level
              <span lang="hi" className="ml-2 font-devanagari text-footnote font-normal text-label-secondary">
                पठन स्तर व दृष्टि
              </span>
            </legend>
            <ReaderControlBar settings={settings} onChange={update} />
          </fieldset>
        )}

        <fieldset>
          <legend className="mb-2 text-subhead font-semibold text-label-primary">
            Theme
            <span lang="hi" className="ml-2 font-devanagari text-footnote font-normal text-label-secondary">
              रंग
            </span>
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((t) => (
              <label key={t.id} aria-label={`${t.label} theme`} className="relative cursor-pointer">
                <input
                  type="radio"
                  name={themeName}
                  checked={theme === t.id}
                  onChange={() => {
                    triggerTactileFeedback('selection', 'softTap');
                    setTheme(t.id);
                  }}
                  className="peer sr-only"
                />
                <span className="flex min-h-[52px] items-center gap-3 rounded-xl border border-separator/80 bg-surface-raised px-3 text-subhead font-semibold text-label-secondary transition-all peer-checked:border-separator peer-checked:bg-surface-elevated peer-checked:text-label-primary peer-checked:shadow-xs peer-checked:ring-1 peer-checked:ring-accent/40 peer-focus-visible:ring-2 peer-focus-visible:ring-accent hover:bg-fill-quaternary hover:text-label-primary">
                  <span aria-hidden="true" className="h-7 w-7 shrink-0 rounded-full border shadow-inner" style={{ backgroundColor: t.swatch, borderColor: t.ring }} />
                  <span>
                    {t.label}
                    <span lang="hi" className="block font-devanagari text-caption-2 font-normal text-label-tertiary">
                      {t.hi}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {scope === 'verse' && <Segmented legend="Preferred language" legendHi="भाषा प्राथमिकता" value={settings.preferredLanguage} options={LANGUAGES_PREF} onChange={(v) => update('preferredLanguage', v)} columns="grid-cols-3" />}
        {scope === 'verse' && <Segmented legend="Number format" legendHi="संख्या प्रारूप" value={settings.numberFormat} options={NUMBERS} onChange={(v) => update('numberFormat', v)} columns="grid-cols-2" />}
        <Segmented legend="Sanskrit size" legendHi="संस्कृत आकार" value={settings.sanskritSize} options={SIZES} onChange={(v) => update('sanskritSize', v)} columns="grid-cols-4" />
        <Segmented legend="Translation size" legendHi="अनुवाद आकार" value={settings.translationSize} options={SIZES} onChange={(v) => update('translationSize', v)} columns="grid-cols-4" />
        <Segmented legend="Line spacing" legendHi="पंक्ति अंतराल" value={settings.lineSpacing} options={SPACINGS} onChange={(v) => update('lineSpacing', v)} columns="grid-cols-4" />
        {scope === 'verse' && <Segmented legend="Reading width" legendHi="पठन चौड़ाई" value={settings.readingWidth} options={WIDTHS} onChange={(v) => update('readingWidth', v)} columns="grid-cols-3" />}
        {scope === 'verse' && <Segmented legend="Contrast" legendHi="विरोधाभास" value={settings.contrast} options={CONTRASTS} onChange={(v) => update('contrast', v)} columns="grid-cols-2" />}

        <fieldset className="rounded-card border border-separator/80 bg-surface-raised/80 p-3 shadow-2xs">
          <legend className="px-1 text-subhead font-semibold text-label-primary">{scope === 'chapter' ? 'Show reading layers' : 'Show elements'}</legend>
          <Toggle label="Roman transliteration" hint="IAST" checked={settings.showTransliteration} onChange={(v) => update('showTransliteration', v)} />
          <Toggle label={<>Hindi translation <span lang="hi" className="font-devanagari">हिन्दी</span></>} checked={settings.showHindi} onChange={(v) => update('showHindi', v)} />
          <Toggle label="English translation" checked={settings.showEnglish} onChange={(v) => update('showEnglish', v)} />
          <Toggle
            label="Show explanations and study layers"
            hint="Commentary, reflections, and related study material"
            checked={settings.showCommentary}
            onChange={(v) => update('showCommentary', v)}
          />
        </fieldset>

        {scope === 'chapter' && (
          <Toggle
            label="Highlight the verse in view"
            hint="एकाग्रता · Dim nearby verses while reading"
            checked={settings.spotlightMode}
            onChange={(v) => update('spotlightMode', v)}
          />
        )}

        {additionalControls}

        {scope === 'verse' && (
          <>
            <Toggle
              label="Reduce motion"
              hint={settings.reducedMotion === null ? 'Following your device setting' : undefined}
              checked={reducedMotion}
              onChange={(v) => update('reducedMotion', v)}
            />
            <Toggle label="Hide decorative elements" hint="Corner ornaments, card icons and entrance motion" checked={settings.hideDecor} onChange={(v) => update('hideDecor', v)} />
            <Toggle
              label={<>Reading Lite Mode <span lang="hi" className="font-devanagari text-xs text-dharma-muted">विशुद्ध पाठ</span></>}
              hint="Strips secondary panels and ornaments for pure text focus and high reading speed"
              checked={settings.liteMode}
              onChange={(v) => update('liteMode', v)}
            />
          </>
        )}
      </div>
    </ReaderDialog>
  );
}
