'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight, ChevronLeft, Award } from 'lucide-react';
import type { Quiz } from '@/data/quizzes';

interface QuizRunnerProps {
  quiz: Quiz;
  onComplete?: (score: number, total: number) => void;
  bestScore?: { score: number; total: number };
}

export function QuizRunner({ quiz, onComplete, bestScore }: QuizRunnerProps) {
  const reduce = useReducedMotion();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const question = quiz.questions[currentIdx];
  const total = quiz.questions.length;
  const progress = ((currentIdx + (answered ? 1 : 0)) / total) * 100;

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered) return;
      setSelectedIdx(idx);
      setAnswered(true);
      const isCorrect = idx === question.correctIndex;
      if (isCorrect) setScore((s) => s + 1);
      setAnswers((prev) => [...prev, idx]);
    },
    [answered, question],
  );

  const handleNext = useCallback(() => {
    if (currentIdx < total - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedIdx(null);
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete?.(score, total);
    }
  }, [currentIdx, total, score, onComplete]);

  const handleRestart = useCallback(() => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }, []);

  if (finished) {
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 70;
    return (
      <motion.div
        initial={reduce ? {} : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${passed ? 'bg-gradient-to-br from-saffron-400 to-amber-500' : 'bg-gradient-to-br from-stone-300 to-stone-400 dark:from-stone-700 dark:to-stone-600'}`}>
          {passed ? <Trophy className="w-12 h-12 text-white" /> : <RotateCcw className="w-12 h-12 text-white" />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-dharma-text mb-2">
          {passed ? '🎉 Well Done!' : 'Keep Studying!'}
        </h3>
        <p className="text-lg text-dharma-muted mb-6">
          You scored <span className="font-bold text-saffron-700 dark:text-saffron-300">{score} / {total}</span> ({percentage}%)
        </p>

        {passed && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-saffron-100 to-amber-100 text-saffron-800 text-sm font-bold border border-saffron-200 dark:from-saffron-950/50 dark:to-amber-950/50 dark:text-saffron-200 dark:border-saffron-500/30 mb-6">
            <Award className="w-4 h-4" />
            Certificate eligible — visit the pathway page to claim it
          </div>
        )}

        {bestScore && (
          <p className="text-xs text-dharma-muted mb-6">
            Previous best: {bestScore.score} / {bestScore.total} ({Math.round((bestScore.score / bestScore.total) * 100)}%)
          </p>
        )}

        {/* Answer review */}
        <div className="text-left space-y-3 mb-8 max-w-xl mx-auto">
          {quiz.questions.map((q, i) => {
            const userAnswer = answers[i];
            const correct = userAnswer === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 ${correct ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/35 dark:bg-emerald-950/30' : 'border-rose-200 bg-rose-50/50 dark:border-rose-500/35 dark:bg-rose-950/30'}`}
              >
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-dharma-text mb-1">{q.question}</p>
                    <p className="text-xs text-dharma-muted">
                      Correct: <span className="font-medium text-emerald-700 dark:text-emerald-300">{q.options[q.correctIndex]}</span>
                    </p>
                    {!correct && userAnswer !== null && (
                      <p className="text-xs text-dharma-muted">
                        Your answer: <span className="font-medium text-rose-700 dark:text-rose-300">{q.options[userAnswer]}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 text-white font-bold hover:from-saffron-700 hover:to-amber-700 transition shadow-md hover:shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm text-dharma-muted">
          <span className="font-semibold">
            Question {currentIdx + 1} of {total}
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-saffron-500" />
            Score: {score}
          </span>
        </div>
        <div
          className="w-full h-2 bg-dharma-border rounded-full overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label={`Quiz progress: question ${currentIdx + 1} of ${total}`}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-saffron-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={reduce ? {} : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? {} : { opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Question */}
          <div className="mb-6">
            {question.questionSanskrit && (
              <p lang="sa" className="font-devanagari text-xl text-saffron-700 dark:text-saffron-300 mb-2">
                {question.questionSanskrit}
              </p>
            )}
            <h3 className="text-xl font-serif font-bold text-dharma-text">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              const isCorrect = idx === question.correctIndex;
              const showResult = answered;

              let className = 'border-dharma-border bg-dharma-card hover:border-saffron-300 hover:bg-saffron-500/[0.06]';
              if (showResult && isCorrect) {
                className = 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-500/40 dark:bg-emerald-950/35';
              } else if (showResult && isSelected && !isCorrect) {
                className = 'border-rose-300 bg-rose-50/50 dark:border-rose-500/40 dark:bg-rose-950/35';
              } else if (showResult) {
                className = 'border-dharma-border bg-dharma-card opacity-60';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${className} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm md:text-base text-dharma-text font-medium">
                      {option}
                    </span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={reduce ? {} : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden mb-6"
                aria-live="polite"
              >
                <div className="rounded-xl bg-saffron-50/50 border border-saffron-200 dark:bg-saffron-950/25 dark:border-saffron-500/30 p-4">
                  <p className="text-sm text-dharma-text leading-relaxed">
                    <span className="font-bold text-saffron-700 dark:text-saffron-300">Explanation: </span>
                    {question.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {answered && (
            <motion.div
              initial={reduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 text-white font-bold hover:from-saffron-700 hover:to-amber-700 transition shadow-md hover:shadow-lg"
              >
                {currentIdx < total - 1 ? 'Next Question' : 'See Results'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
