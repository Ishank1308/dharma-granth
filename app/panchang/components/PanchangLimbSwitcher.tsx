'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Compass, Sparkles, Moon, Sun, Clock } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

export type PanchangLimbId = 'tithis' | 'varas' | 'nakshatras' | 'yogas' | 'karanas' | 'muhurta';

interface LimbItem {
  id: PanchangLimbId;
  label: string;
  labelHi: string;
  href: string;
  count: string;
  icon: typeof Calendar;
}

const LIMBS: LimbItem[] = [
  { id: 'tithis', label: 'Tithi', labelHi: '1. तिथि', href: '/panchang/tithis/', count: '30', icon: Moon },
  { id: 'varas', label: 'Vara', labelHi: '2. वार', href: '/panchang/varas/', count: '7', icon: Sun },
  { id: 'nakshatras', label: 'Nakshatra', labelHi: '3. नक्षत्र', href: '/panchang/nakshatras/', count: '27', icon: Sparkles },
  { id: 'yogas', label: 'Yoga', labelHi: '4. योग', href: '/panchang/yogas/', count: '27', icon: Compass },
  { id: 'karanas', label: 'Karana', labelHi: '5. करण', href: '/panchang/karanas/', count: '11', icon: Calendar },
  { id: 'muhurta', label: 'Muhurta', labelHi: '✦ मुहूर्त', href: '/panchang/muhurta/', count: 'निर्णय', icon: Clock },
];

export function PanchangLimbSwitcher({ activeLimb }: { activeLimb?: PanchangLimbId }) {
  return (
    <nav
      aria-label="पंचांग के पांच अंग व मुहूर्त"
      className="sticky top-[52px] z-20 border-b border-dharma-border/80 bg-dharma-bg/95 backdrop-blur-md transition-colors"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
          <span className="hidden sm:inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-dharma-muted mr-1.5 shrink-0">
            पंचांग अंग:
          </span>
          {LIMBS.map((limb) => {
            const isActive = limb.id === activeLimb;
            const Icon = limb.icon;

            return (
              <Link
                key={limb.id}
                href={limb.href}
                onClick={() => triggerTactileFeedback('light', 'softTap')}
                aria-current={isActive ? 'page' : undefined}
                data-limb={limb.id}
                className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  isActive
                    ? 'border border-saffron-500/60 bg-saffron-500/15 text-saffron-800 dark:text-saffron-200 shadow-xs'
                    : 'border border-dharma-border/70 bg-dharma-card text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? 'text-saffron-600 dark:text-amber-400' : 'text-dharma-muted group-hover:text-dharma-text'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-devanagari">{limb.labelHi}</span>
                <span className="text-[10px] font-normal">({limb.count})</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
