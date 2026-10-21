'use client';

import { useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, Download, Calendar } from 'lucide-react';
import { FadeUp } from '@/app/components/motion/primitives';

interface CertificateProps {
  pathwayTitle: string;
  pathwayTitleSanskrit?: string;
  studentName: string;
  completedDate: string;
  certificateId: string;
}

export function Certificate({
  pathwayTitle,
  pathwayTitleSanskrit,
  studentName,
  completedDate,
  certificateId,
}: CertificateProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const formattedDate = useMemo(
    () => new Date(completedDate).toLocaleDateString(undefined, { numberingSystem: 'latn',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    [completedDate],
  );

  return (
    <FadeUp>
      <div ref={ref} className="relative max-w-3xl mx-auto">
        {/* Decorative border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-saffron-300 via-amber-300 to-saffron-300 rounded-3xl opacity-30 blur-sm" />

        <div className="relative bg-white rounded-3xl border-4 border-double border-saffron-300 p-8 md:p-12 shadow-2xl overflow-hidden">
          {/* Corner ornaments */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-saffron-200 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-saffron-200 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-saffron-200 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-saffron-200 rounded-br-xl" />

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span lang="sa" className="font-devanagari text-[200px] text-saffron-50 select-none">ॐ</span>
          </div>

          <div className="relative text-center">
            {/* Header */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-saffron-400 to-amber-500 mb-4 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-saffron-600 mb-2">
              Dharma Granth
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dharma-text mb-1">
              Certificate of Completion
            </h2>
            <p className="text-sm text-dharma-muted mb-8">
              This certifies that
            </p>

            {/* Student name */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-2xl md:text-3xl font-serif font-bold text-saffron-800 border-b-2 border-saffron-200 inline-block px-8 pb-2">
                {studentName || 'Student'}
              </p>
            </motion.div>

            <p className="text-sm text-dharma-muted mb-2">
              has successfully completed the learning pathway
            </p>

            {/* Pathway title */}
            <h3 className="text-xl md:text-2xl font-serif font-bold text-dharma-text mb-1">
              {pathwayTitle}
            </h3>
            {pathwayTitleSanskrit && (
              <p lang="sa" className="font-devanagari text-lg text-saffron-600 mb-6">
                {pathwayTitleSanskrit}
              </p>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-dharma-muted italic max-w-lg mx-auto mb-8 leading-relaxed">
              This certificate acknowledges personal study and reflection.
              It does not confer any religious authority, ordination, or
              institutional credential.
            </p>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-around gap-6 pt-6 border-t border-saffron-100">
              <div className="text-center">
                <p className="text-xs text-dharma-muted mb-1 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date
                </p>
                <p className="text-sm font-semibold text-dharma-text">{formattedDate}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-dharma-muted mb-1">Certificate ID</p>
                <p className="text-sm font-mono text-dharma-text">{certificateId}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-dharma-muted mb-1">Platform</p>
                <p className="text-sm font-semibold text-saffron-700">Dharma Granth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}
