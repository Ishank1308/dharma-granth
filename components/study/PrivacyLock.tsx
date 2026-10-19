'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Shield, X, Delete, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'unlock' | 'set' | 'remove';
  title?: string;
  subtitle?: string;
}

const PIN_STORAGE_KEY = 'dharma.privacyPinHash';

export async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`dharma_salt_${pin}_svadhyaya`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function isPinProtected(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(PIN_STORAGE_KEY));
}

export function PrivacyLockModal({ isOpen, onClose, onSuccess, mode, title, subtitle }: Props) {
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'initial' | 'confirm'>('initial');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setConfirmPin('');
      setStep('initial');
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  const verifyUnlock = async (enteredPin: string) => {
    try {
      const storedHash = localStorage.getItem(PIN_STORAGE_KEY);
      if (!storedHash) {
        onSuccess();
        onClose();
        return;
      }
      const hashed = await hashPin(enteredPin);
      if (hashed === storedHash) {
        triggerTactileFeedback('success', 'softTap');
        setSuccessMsg(mode === 'remove' ? 'पिन हटा दिया गया' : 'अनलॉक सफल');
        if (mode === 'remove') {
          localStorage.removeItem(PIN_STORAGE_KEY);
          window.dispatchEvent(new Event('dharma-privacy-pin-changed'));
        }
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 500);
      } else {
        triggerTactileFeedback('medium', 'softTap');
        setError('गलत पिन (Incorrect PIN). पुनः प्रयास करें।');
        setPin('');
      }
    } catch {
      setError('पिन सत्यापन में त्रुटि हुई');
      setPin('');
    }
  };

  const verifyAndSave = async (firstPin: string, secondPin: string) => {
    if (firstPin !== secondPin) {
      triggerTactileFeedback('medium', 'softTap');
      setError('पिन मेल नहीं खाया (PINs do not match). पुनः दर्ज करें।');
      setConfirmPin('');
      setStep('initial');
      setPin('');
      return;
    }

    try {
      const hashed = await hashPin(firstPin);
      localStorage.setItem(PIN_STORAGE_KEY, hashed);
      window.dispatchEvent(new Event('dharma-privacy-pin-changed'));
      triggerTactileFeedback('success', 'softTap');
      setSuccessMsg('सुरक्षा पिन सफलतापूर्वक सेट हो गया!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 600);
    } catch {
      setError('पिन सुरक्षित करने में त्रुटि');
    }
  };

  const handleDigit = useCallback(
    (digit: string) => {
      setError(null);
      triggerTactileFeedback('selection', 'softTap');

      if (mode === 'set' && step === 'confirm') {
        if (confirmPin.length < 4) {
          const next = confirmPin + digit;
          setConfirmPin(next);
          if (next.length === 4) {
            verifyAndSave(pin, next);
          }
        }
      } else {
        if (pin.length < 4) {
          const next = pin + digit;
          setPin(next);
          if (next.length === 4) {
            if (mode === 'set') {
              setStep('confirm');
            } else {
              verifyUnlock(next);
            }
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pin, confirmPin, step, mode]
  );

  const handleDelete = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    setError(null);
    if (mode === 'set' && step === 'confirm') {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  }, [mode, step]);

  // Physical keyboard support
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleDigit, handleDelete, onClose]);

  if (!isOpen) return null;

  const currentPin = mode === 'set' && step === 'confirm' ? confirmPin : pin;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-sm rounded-3xl border border-saffron-500/30 bg-dharma-card p-6 shadow-2xl z-10"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-dharma-muted hover:bg-dharma-border/60 hover:text-dharma-text transition cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-saffron-600 text-white shadow-lg">
              {mode === 'unlock' ? <Lock className="h-7 w-7" /> : <Shield className="h-7 w-7" />}
            </div>
            <h3 className="font-serif text-xl font-bold text-dharma-text">
              {title || (mode === 'set' ? (step === 'confirm' ? 'पिन की पुष्टि करें' : 'नया पिन बनाएं') : mode === 'remove' ? 'पिन हटाएं' : 'गोपनीयता अनलॉक')}
            </h3>
            <p className="mt-1 text-xs text-dharma-muted">
              {subtitle || (mode === 'set' ? (step === 'confirm' ? 'वही 4-अंकीय पिन दोबारा दर्ज करें' : '4-अंकीय व्यक्तिगत सुरक्षा पिन चुनें') : 'अपना 4-अंकीय पिन दर्ज करें')}
            </p>
          </div>

          {/* Golden Digits Indicator */}
          <div className="flex justify-center gap-3 mb-6" aria-label={`Entered ${currentPin.length} of 4 digits`}>
            {[0, 1, 2, 3].map((idx) => {
              const filled = idx < currentPin.length;
              return (
                <div
                  key={idx}
                  className={`h-4 w-4 rounded-full transition-all duration-200 ${
                    filled
                      ? 'bg-gradient-to-tr from-saffron-500 to-amber-400 scale-125 shadow-md shadow-saffron-500/50'
                      : 'border-2 border-dharma-border bg-dharma-bg'
                  }`}
                />
              );
            })}
          </div>

          {/* Status Message */}
          {error && (
            <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-center text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
              <Check className="h-4 w-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sacred Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                className="flex h-14 w-full items-center justify-center rounded-2xl border border-dharma-border/80 bg-dharma-card text-xl font-bold text-dharma-text transition hover:border-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-950/40 active:scale-95 cursor-pointer shadow-2xs"
              >
                {digit}
              </button>
            ))}
            <div className="flex items-center justify-center">
              {mode === 'set' && step === 'confirm' ? (
                <button
                  type="button"
                  onClick={() => {
                    setStep('initial');
                    setPin('');
                    setConfirmPin('');
                  }}
                  className="text-xs font-semibold text-dharma-muted hover:text-dharma-text"
                >
                  पुनः
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="flex h-14 w-full items-center justify-center rounded-2xl border border-dharma-border/80 bg-dharma-card text-xl font-bold text-dharma-text transition hover:border-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-950/40 active:scale-95 cursor-pointer shadow-2xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-14 w-full items-center justify-center rounded-2xl border border-dharma-border/80 bg-dharma-card text-dharma-muted transition hover:border-rose-400 hover:text-rose-600 dark:hover:bg-rose-950/20 active:scale-95 cursor-pointer shadow-2xs"
              aria-label="अंक मिटाएं"
            >
              <Delete className="h-6 w-6" />
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] text-dharma-muted">
            100% स्थानीय एन्क्रिप्शन · डेटा कभी किसी सर्वर पर नहीं जाता
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
