'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(function BentoGrid(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  titleSanskrit?: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  href?: string;
  ctaText?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  gradient?: string;
  headerGraphic?: React.ReactNode;
}

export const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(function BentoCard(
  {
    title,
    titleSanskrit,
    description,
    icon,
    badge,
    href,
    ctaText = 'अन्वेषण करें',
    colSpan = 1,
    rowSpan = 1,
    gradient,
    headerGraphic,
    className,
    children,
    ...props
  },
  ref
) {
  const colSpanClasses = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-2 lg:col-span-3',
    4: 'col-span-full',
  };

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'md:row-span-2',
  };

  const cardContent = (
    <div
      ref={ref}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-dharma-border/80 bg-dharma-card p-6 sm:p-7 shadow-sm transition-all duration-300',
        'hover:border-saffron-300 hover:shadow-md dark:hover:border-saffron-800',
        'focus-within:ring-2 focus-within:ring-saffron-500 focus-within:ring-offset-2',
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className
      )}
      {...props}
    >
      {/* Background Graphic or Subtle Gradient */}
      {headerGraphic && (
        <div className="absolute -right-4 -top-4 opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none">
          {headerGraphic}
        </div>
      )}

      {gradient && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-70',
            gradient
          )}
        />
      )}

      {/* Card Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          {icon && (
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-dharma-border/80 bg-dharma-card-soft text-saffron-700 dark:text-saffron-300 shadow-2xs group-hover:scale-105 transition-transform duration-200">
              {icon}
            </div>
          )}

          {badge && (
            <span className="inline-flex items-center rounded-full border border-saffron-200/80 bg-saffron-50 px-2.5 py-1 text-[11px] font-bold text-saffron-900 dark:border-saffron-800 dark:bg-saffron-950/60 dark:text-saffron-200">
              {badge}
            </span>
          )}
        </div>

        {titleSanskrit && (
          <span className="text-xs font-devanagari font-bold text-saffron-700 dark:text-saffron-400 block mb-1">
            {titleSanskrit}
          </span>
        )}

        <h3 className="font-serif text-lg sm:text-xl font-bold text-dharma-text tracking-tight group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition-colors">
          {title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-dharma-muted leading-relaxed line-clamp-3">
          {description}
        </p>

        {children}
      </div>

      {/* Card Footer / CTA */}
      {href && (
        <div className="relative z-10 mt-6 pt-3 border-t border-dharma-border/50 flex items-center justify-between text-xs sm:text-sm font-semibold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition-colors">
          <span className="font-devanagari">{ctaText}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
});
