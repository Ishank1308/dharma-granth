'use client';

import React from 'react';
import { BookOpen, Sparkles, GraduationCap } from 'lucide-react';
import { useReadingDepth, type ReadingDepth, READING_DEPTH_CONFIG } from '@/lib/useReadingDepth';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface ReadingModeSelectorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  depth?: ReadingDepth;
  onDepthChange?: (depth: ReadingDepth) => void;
  showDescriptions?: boolean;
}

export function ReadingModeSelector({
  className,
  size = 'md',
  depth: controlledDepth,
  onDepthChange,
  showDescriptions = false,
}: ReadingModeSelectorProps) {
  const { depth: globalDepth, setReadingDepth: setGlobalDepth } = useReadingDepth();
  const currentDepth = controlledDepth ?? globalDepth;

  const handleChange = (val: string) => {
    const nextDepth = val as ReadingDepth;
    if (onDepthChange) {
      onDepthChange(nextDepth);
    } else {
      setGlobalDepth(nextDepth);
    }
    triggerTactileFeedback('selection', 'softTap');
  };

  const modes: Array<{
    key: ReadingDepth;
    title: string;
    sub: string;
    icon: typeof BookOpen;
    desc: string;
  }> = [
    {
      key: 'read',
      title: 'पाठ',
      sub: 'Read',
      icon: BookOpen,
      desc: 'केवल मूल श्लोक एवं संक्षिप्त अर्थ',
    },
    {
      key: 'understand',
      title: 'सरल अर्थ',
      sub: 'Understand',
      icon: Sparkles,
      desc: 'मर्म, सरल व्याख्या एवं जीवन प्रयोग',
    },
    {
      key: 'study',
      title: 'गहन अध्ययन',
      sub: 'Study',
      icon: GraduationCap,
      desc: 'भाष्य, पदच्छेद, शब्दार्थ एवं शास्त्रीय स्रोत',
    },
  ];

  return (
    <div className={cn('inline-flex flex-col', className)}>
      <Tabs
        value={currentDepth}
        onValueChange={handleChange}
        className="w-auto"
      >
        <TabsList
          className={cn(
            'flex flex-wrap sm:flex-nowrap items-center gap-1 rounded-2xl bg-dharma-panel-muted/90 p-1 border border-dharma-border/80 shadow-2xs',
            size === 'sm' && 'p-0.5 rounded-xl',
            size === 'lg' && 'p-1.5 rounded-2xl'
          )}
        >
          {modes.map(({ key, title, sub, icon: Icon }) => {
            const isSelected = currentDepth === key;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  'flex items-center gap-1.5 transition-all min-h-[38px] sm:min-h-[40px]',
                  size === 'sm' && 'px-2.5 py-1 text-xs min-h-[34px]',
                  size === 'md' && 'px-3 py-1.5 text-xs sm:text-sm min-h-[40px]',
                  size === 'lg' && 'px-4 py-2 text-sm sm:text-base min-h-[44px]',
                  isSelected
                    ? 'text-saffron-950 dark:text-saffron-100 font-bold'
                    : 'text-dharma-muted hover:text-dharma-text'
                )}
                title={READING_DEPTH_CONFIG[key].descriptionHi}
                aria-label={`${title} (${sub}) मोड: ${READING_DEPTH_CONFIG[key].descriptionHi}`}
              >
                <Icon
                  className={cn(
                    'shrink-0 transition-transform',
                    size === 'sm' && 'h-3 w-3',
                    size === 'md' && 'h-3.5 w-3.5',
                    size === 'lg' && 'h-4 w-4',
                    isSelected ? 'text-saffron-600 dark:text-saffron-400 scale-105' : 'text-dharma-muted'
                  )}
                  aria-hidden="true"
                />
                <span className="font-devanagari font-bold">{title}</span>
                <span className="text-[10px] sm:text-xs font-normal opacity-70">· {sub}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {showDescriptions && (
        <p className="mt-1.5 text-[11px] text-dharma-muted text-center font-devanagari">
          {READING_DEPTH_CONFIG[currentDepth].descriptionHi}
        </p>
      )}
    </div>
  );
}
