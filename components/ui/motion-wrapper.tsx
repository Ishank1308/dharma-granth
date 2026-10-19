'use client';

import React, { forwardRef } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(function FadeIn(
  { delay = 0, duration = 0.25, className, children, ...props },
  ref
) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div ref={ref} className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export interface SlideUpProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
}

export const SlideUp = forwardRef<HTMLDivElement, SlideUpProps>(function SlideUp(
  { delay = 0, duration = 0.25, distance = 8, className, children, ...props },
  ref
) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div ref={ref} className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: distance }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export interface StaggerGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number;
  children: React.ReactNode;
}

export const StaggerGroup = forwardRef<HTMLDivElement, StaggerGroupProps>(function StaggerGroup(
  { staggerDelay = 0.06, className, children, ...props },
  ref
) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...(props as HTMLMotionProps<'div'>)}
    >
      {children}
    </motion.div>
  );
});

export interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(function StaggerItem(
  { className, children, ...props },
  ref
) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div ref={ref} className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children as React.ReactNode}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 6 },
        show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
