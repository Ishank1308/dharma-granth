'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Filters } from '@/lib/library';

export interface FilterOption {
  id: string;
  label: string;
  hint?: string;
  count: number;
}

export type GroupKey = 'category' | 'tradition' | 'language' | 'length' | 'topic' | 'author';

export interface FilterGroup {
  key: GroupKey;
  title: string;
  titleHi: string;
  options: FilterOption[];
  /** Show only this many options until "Show all" is pressed. */
  collapsedCount?: number;
  defaultOpen?: boolean;
}

export interface ToggleOption {
  key: 'explained' | 'beginner';
  label: string;
  labelHi: string;
  count: number;
}

const row =
  'flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg px-2 text-sm text-dharma-text transition hover:bg-dharma-bg lg:min-h-[34px]';
const box = 'h-4 w-4 shrink-0 rounded border-dharma-border accent-[color:var(--dharma-saffron)]';

function Group({
  group,
  idPrefix,
  selected,
  onToggle,
}: {
  group: FilterGroup;
  idPrefix: string;
  selected: string[];
  onToggle: (key: GroupKey, id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const limit = group.collapsedCount ?? Infinity;
  // Selected options stay visible even when the list is collapsed.
  const visible = expanded ? group.options : group.options.filter((o, i) => i < limit || selected.indexOf(o.id) !== -1);
  const hidden = group.options.length - visible.length;

  return (
    <details open={group.defaultOpen ?? true} className="group/filter border-t border-dharma-text/10 py-1 first:border-t-0">
      <summary className="focus-ring flex min-h-[44px] cursor-pointer list-none items-center justify-between rounded-lg px-2 text-sm font-semibold text-dharma-text [&::-webkit-details-marker]:hidden">
        <span>
          {group.title}{' '}
          <span lang="hi" className="ml-1 font-devanagari text-[0.8rem] font-normal text-dharma-muted">
            {group.titleHi}
          </span>
          {selected.length > 0 && <span className="ml-2 rounded-full bg-dharma-saffron px-1.5 py-0.5 text-[11px] font-semibold text-dharma-bg">{selected.length}</span>}
        </span>
        <ChevronDown className="h-4 w-4 text-dharma-muted transition group-open/filter:rotate-180" aria-hidden="true" />
      </summary>
      <ul className="pb-2">
        {visible.map((o) => {
          const checked = selected.indexOf(o.id) !== -1;
          const unavailable = o.count === 0 && !checked;
          const id = `${idPrefix}-${group.key}-${o.id}`;
          return (
            <li key={o.id}>
              <label htmlFor={id} className={`${row} ${unavailable ? 'cursor-not-allowed opacity-45' : ''}`}>
                <input id={id} type="checkbox" className={box} checked={checked} disabled={unavailable} onChange={() => onToggle(group.key, o.id)} />
                <span className="min-w-0 flex-1">
                  {o.label}
                  {o.hint && <> <span className="ml-0.5 text-xs text-dharma-muted">{o.hint}</span></>}
                </span>
                <span className="text-xs tabular-nums text-dharma-muted" aria-label={`${o.count} results`}>
                  {o.count}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {(hidden > 0 || expanded) && group.options.length > limit && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="focus-ring mb-2 ml-2 min-h-[36px] rounded px-1 text-footnote text-dharma-saffron hover:underline">
          {expanded ? 'Show fewer' : `Show all ${group.options.length}`}
        </button>
      )}
    </details>
  );
}

export function FilterPanel({
  idPrefix,
  groups,
  toggles,
  filters,
  onToggleValue,
  onToggleFlag,
}: {
  idPrefix: string;
  groups: FilterGroup[];
  toggles: ToggleOption[];
  filters: Filters;
  onToggleValue: (key: GroupKey, id: string) => void;
  onToggleFlag: (key: 'explained' | 'beginner') => void;
}) {
  return (
    <div>
      <fieldset className="pb-2">
        <legend className="sr-only">Quick filters</legend>
        {toggles.map((t) => {
          const checked = filters[t.key];
          const unavailable = t.count === 0 && !checked;
          const id = `${idPrefix}-${t.key}`;
          return (
            <label key={t.key} htmlFor={id} className={`${row} ${unavailable ? 'cursor-not-allowed opacity-45' : ''}`}>
              <input id={id} type="checkbox" className={box} checked={checked} disabled={unavailable} onChange={() => onToggleFlag(t.key)} />
              <span className="min-w-0 flex-1">
                {t.label}{' '}
                <span lang="hi" className="ml-1 font-devanagari text-[0.8rem] text-dharma-muted">
                  {t.labelHi}
                </span>
              </span>
              <span className="text-xs tabular-nums text-dharma-muted" aria-label={`${t.count} results`}>
                {t.count}
              </span>
            </label>
          );
        })}
      </fieldset>
      {groups.map((g) => (
        <Group key={g.key} group={g} idPrefix={idPrefix} selected={filters[g.key]} onToggle={onToggleValue} />
      ))}
    </div>
  );
}
