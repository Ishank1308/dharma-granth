'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Target, BookOpen, Flame, Award, Sparkles } from 'lucide-react';

export interface ProgressStat {
  label: string;
  value: number;
  max: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface CircularProgressInfographicProps {
  stats: ProgressStat[];
  className?: string;
}

export function CircularProgressInfographic({ stats, className = '' }: CircularProgressInfographicProps) {
  const reduce = useReducedMotion();

  return (
    <div className={`circular-progress-infographic ${className} relative`}>
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={reduce ? {} : { scale: 0.8, opacity: 0 }}
          animate={reduce ? {} : { scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-700 bg-gradient-to-r from-saffron-100 to-amber-100 border border-saffron-200 px-5 py-2 rounded-full shadow-sm mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Target className="w-3.5 h-3.5" />
          </motion.div>
          Learning Progress
        </motion.div>
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: -20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold text-dharma-text mb-4"
        >
          Your Journey
        </motion.h2>
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          animate={reduce ? {} : { opacity: 1 }}
          transition={reduce ? {} : { delay: 0.2 }}
          className="text-dharma-muted text-lg"
        >
          Track your spiritual learning progress
        </motion.p>
      </div>

      {/* Progress Circles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const percentage = (stat.value / stat.max) * 100;
          const circumference = 2 * Math.PI * 60; // radius = 60
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <motion.div
              key={index}
              initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
              animate={reduce ? {} : { opacity: 1, scale: 1 }}
              transition={reduce ? {} : { delay: index * 0.15 }}
              className="flex flex-col items-center"
            >
              {/* Circular Progress */}
              <div className="relative w-40 h-40">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    className={stat.color}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, delay: index * 0.2 + 0.3, ease: "easeOut" }}
                    style={{
                      strokeDasharray: circumference,
                    }}
                  />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={reduce ? {} : { scale: 0 }}
                    animate={reduce ? {} : { scale: 1 }}
                    transition={reduce ? {} : { delay: index * 0.2 + 0.8, type: "spring", stiffness: 200 }}
                    className="text-3xl mb-1"
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.span
                    initial={reduce ? {} : { opacity: 0 }}
                    animate={reduce ? {} : { opacity: 1 }}
                    transition={reduce ? {} : { delay: index * 0.2 + 1 }}
                    className="text-2xl font-bold text-dharma-text"
                  >
                    {Math.round(percentage)}%
                  </motion.span>
                </div>

                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-full blur-xl opacity-20 ${stat.color.replace('text-', 'bg-')}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                />
              </div>

              {/* Label */}
              <motion.div
                initial={reduce ? {} : { opacity: 0, y: 10 }}
                animate={reduce ? {} : { opacity: 1, y: 0 }}
                transition={reduce ? {} : { delay: index * 0.2 + 1.2 }}
                className="mt-4 text-center"
              >
                <h3 className="text-lg font-bold text-dharma-text mb-1">
                  {stat.label}
                </h3>
                <p className="text-sm text-dharma-muted">
                  {stat.value} / {stat.max}
                </p>
                {stat.description && (
                  <p className="text-xs text-dharma-muted mt-2 max-w-[150px]">
                    {stat.description}
                  </p>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 30 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={reduce ? {} : { delay: stats.length * 0.15 + 0.5 }}
        className="mt-12 bg-gradient-to-br from-saffron-600 via-amber-600 to-orange-700 rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6 mx-auto"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Award className="w-8 h-8" />
          </motion.div>
          
          <h3 className="text-2xl font-serif font-bold mb-3">
            Overall Progress
          </h3>
          
          {/* Large progress circle */}
          <div className="flex justify-center my-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="16"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="white"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 80 * (1 - stats.reduce((acc, s) => acc + (s.value / s.max), 0) / stats.length)
                  }}
                  transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                  style={{ strokeDasharray: 2 * Math.PI * 80 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={reduce ? {} : { opacity: 0, scale: 0.5 }}
                  animate={reduce ? {} : { opacity: 1, scale: 1 }}
                  transition={reduce ? {} : { delay: 1.5, type: "spring", stiffness: 200 }}
                  className="text-5xl font-bold"
                >
                  {Math.round(stats.reduce((acc, s) => acc + (s.value / s.max), 0) / stats.length * 100)}%
                </motion.span>
              </div>
            </div>
          </div>

          <p className="opacity-90 max-w-2xl mx-auto">
            Keep up the great work! You&rsquo;re making excellent progress on your spiritual journey.
          </p>
          
          <motion.div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {stats.reduce((acc, s) => acc + s.value, 0).toLocaleString(undefined, { numberingSystem: 'latn' })} total achievements
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
