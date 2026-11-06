'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Download,
  AlertCircle,
  HelpCircle,
  Check,
  X,
  Smartphone,
  HardDrive,
  Users,
  Trophy,
} from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { createBackup } from '@/lib/backup';
import { triggerHaptic } from '@/lib/haptics';

interface PrivacySettings {
  pin: string | null;
  isLocked: boolean;
  lastBackupDate: string | null;
}

/**
 * Privacy controls, explicit 4-pillar privacy statement, optional 4-digit PIN lock,
 * and smart backup reminder for the Sadhana sanctuary.
 */
export function PrivacyLockBanner({
  onUnlockedStateChange,
}: {
  onUnlockedStateChange?: (unlocked: boolean) => void;
}) {
  const [pin, setPin] = useLocalStorage<string | null>('dharma.practice.pin', null);
  const [isLocked, setIsLocked] = useLocalStorage<boolean>('dharma.practice.is_locked', false);
  const [lastBackup, setLastBackup] = useLocalStorage<string | null>(
    'dharma.practice.last_backup',
    null,
  );

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [setupError, setSetupError] = useState('');

  const [showPrivacyPillars, setShowPrivacyPillars] = useState(false);
  const [backupDismissed, setBackupDismissed] = useState(false);

  // Check if backup reminder should show (> 7 days since last backup)
  const showBackupReminder = !backupDismissed && (() => {
    if (!lastBackup) return true;
    const diffDays = (Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  })();

  function handleUnlock() {
    if (pinInput === pin) {
      triggerHaptic('success');
      setIsLocked(false);
      setPinInput('');
      setPinError(false);
      onUnlockedStateChange?.(true);
    } else {
      triggerHaptic('heavy');
      setPinError(true);
      setPinInput('');
    }
  }

  function handleLockNow() {
    triggerHaptic('medium');
    setIsLocked(true);
    onUnlockedStateChange?.(false);
  }

  function handleSaveNewPin() {
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setSetupError('कृपया 4 अंकों का पिन दर्ज करें (4 numeric digits required)');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setSetupError('पिन मेल नहीं खा रहा है (PINs do not match)');
      return;
    }
    triggerHaptic('success');
    setPin(newPinInput);
    setShowPinSetup(false);
    setNewPinInput('');
    setConfirmPinInput('');
    setSetupError('');
  }

  function handleRemovePin() {
    if (window.confirm('क्या आप स्थानीय पिन लॉक हटाना चाहते हैं? / Remove local PIN protection?')) {
      triggerHaptic('medium');
      setPin(null);
      setIsLocked(false);
      setShowPinSetup(false);
    }
  }

  function handleQuickBackup() {
    try {
      const blob = new Blob([JSON.stringify(createBackup(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const todayStr = new Date().toISOString().slice(0, 10);
      a.download = `dharma-sadhana-backup-${todayStr}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setLastBackup(new Date().toISOString());
      setBackupDismissed(true);
    } catch {}
  }

  return (
    <div className="space-y-4">
      {/* 1. Backup Reminder Notice (Gentle, dismissible) */}
      {showBackupReminder && (
        <div className="apple-group flex flex-col items-start justify-between gap-3 p-4 text-[13px] sm:flex-row sm:items-center">
          <div className="flex items-start gap-2.5">
            <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-dharma-saffron" />
            <div>
              <p className="font-semibold text-dharma-text">
                साधना बैकअप अनुस्मारक · Device Backup Reminder
              </p>
              <p className="mt-0.5 text-dharma-muted">
                आपकी साधना का डेटा केवल इस ब्राउज़र में सहेजा गया है। JSON बैकअप कूटबद्ध नहीं होता; डाउनलोड की गई फ़ाइल निजी रखें।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleQuickBackup}
              className="apple-pill !min-h-9 !px-4 !text-[13px]"
            >
              <Download className="w-3.5 h-3.5" /> बैकअप लें · Export
            </button>
            <button
              type="button"
              onClick={() => setBackupDismissed(true)}
              className="apple-icon-button h-9 w-9 text-dharma-muted"
              aria-label="Dismiss backup reminder"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Privacy Banner & PIN Lock Status Bar */}
      <div className="apple-group space-y-4 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="apple-tint-chip" style={{ background: '#15803d' }}>
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-dharma-text">
                  स्थानीय साधना डेटा · Practice data stays local
                </h2>
                <button
                  type="button"
                  onClick={() => setShowPrivacyPillars(!showPrivacyPillars)}
                  className="text-dharma-muted hover:text-saffron-700 transition"
                  title="गोपनीयता नीति विस्तार · Privacy details"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-dharma-muted">
                आपकी जप, चिंतन और डायरी इसी ब्राउज़र में रहती है · No public profiles or account
              </p>
            </div>
          </div>

          {/* PIN Protection Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {pin ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isLocked ? () => {} : handleLockNow}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    isLocked
                      ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'
                      : 'border-dharma-border text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
                  }`}
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isLocked ? 'लॉक है · Locked' : 'अभी लॉक करें · Lock now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPinSetup(true)}
                  className="p-1.5 text-dharma-muted hover:text-dharma-text rounded-lg border border-dharma-border"
                  title="पिन बदलें या हटाएं · Change PIN"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPinSetup(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-dharma-border hover:border-saffron-300 text-dharma-muted hover:text-saffron-700 transition"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>स्थानीय पिन सेट करें · Set local PIN</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs leading-relaxed text-dharma-muted">
          The optional PIN is an in-app screen lock; it does not encrypt browser storage or backup files.
          <span lang="hi" className="ml-1 font-devanagari">वैकल्पिक पिन केवल ऐप के भीतर स्क्रीन लॉक है; यह ब्राउज़र स्टोरेज या बैकअप फ़ाइलों को कूटबद्ध नहीं करता।</span>
        </p>

        {/* The 4 Privacy Pillars Explainer (Collapsible) */}
        {showPrivacyPillars && (
          <div className="pt-3 border-t border-dharma-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-dharma-panel-muted border border-dharma-border/50 space-y-1">
              <span className="font-bold text-dharma-text flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-saffron-600" /> केवल डिवाइस पर
              </span>
              <p className="text-dharma-muted">
                आपका जप, चिंतन और डायरी किसी बाहरी सर्वर पर नहीं भेजी जाती।
              </p>
            </div>

            <div className="p-3 rounded-xl bg-dharma-panel-muted border border-dharma-border/50 space-y-1">
              <span className="font-bold text-dharma-text flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> कोई प्रोफ़ाइल नहीं
              </span>
              <p className="text-dharma-muted">
                किसी ईमेल या साइन-अप की आवश्यकता नहीं। साधना आत्मा का एकांत है।
              </p>
            </div>

            <div className="p-3 rounded-xl bg-dharma-panel-muted border border-dharma-border/50 space-y-1">
              <span className="font-bold text-dharma-text flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-600" /> कोई प्रतिस्पर्धा नहीं
              </span>
              <p className="text-dharma-muted">
                यहाँ कोई सार्वजनिक लीडरबोर्ड या रैंकिंग नहीं है। अपनी गति से साधना करें।
              </p>
            </div>

            <div className="p-3 rounded-xl bg-dharma-panel-muted border border-dharma-border/50 space-y-1">
              <span className="font-bold text-dharma-text flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-rose-600" /> स्टोरेज चेतावनी
              </span>
              <p className="text-dharma-muted">
                ब्राउज़र हिस्ट्री या कुकीज़ पूर्णतः साफ़ करने से डेटा मिट सकता है; समय-समय पर बैकअप लें।
              </p>
            </div>
          </div>
        )}

        {/* PIN Setup Modal / Box */}
        {showPinSetup && (
          <div className="pt-3 border-t border-dharma-border/60 p-4 rounded-xl bg-dharma-panel-muted border border-dharma-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-dharma-text">
                {pin ? 'पिन बदलें या हटाएं · Modify PIN' : '4-अंकीय सुरक्षा पिन सेट करें · Set 4-digit PIN'}
              </h4>
              <button
                type="button"
                onClick={() => setShowPinSetup(false)}
                className="text-dharma-muted hover:text-dharma-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-dharma-muted">
              पिन सेट करने पर साधना कक्ष में प्रवेश करते ही निजी डायरी और अभ्यास गोपनीय रहेंगे।
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="password"
                maxLength={4}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="4 अंक का पिन"
                className="w-28 px-3 py-1.5 rounded-lg border border-dharma-border bg-white dark:bg-stone-900 text-center font-mono text-sm tracking-widest text-dharma-text focus:outline-none focus:ring-1 focus:ring-saffron-500"
              />
              <input
                type="password"
                maxLength={4}
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                placeholder="पिन दोबारा डालें"
                className="w-28 px-3 py-1.5 rounded-lg border border-dharma-border bg-white dark:bg-stone-900 text-center font-mono text-sm tracking-widest text-dharma-text focus:outline-none focus:ring-1 focus:ring-saffron-500"
              />

              <button
                type="button"
                onClick={handleSaveNewPin}
                className="px-4 py-1.5 rounded-lg bg-saffron-600 text-white font-bold text-xs hover:bg-saffron-700 transition"
              >
                सुरक्षित करें · Save
              </button>

              {pin && (
                <button
                  type="button"
                  onClick={handleRemovePin}
                  className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50"
                >
                  पिन हटाएं · Remove PIN
                </button>
              )}
            </div>

            {setupError && (
              <p className="text-xs text-rose-600 font-medium">{setupError}</p>
            )}
          </div>
        )}
      </div>

      {/* 3. Unlock Dialog Overlay if Locked */}
      {pin && isLocked && (
        <div className="p-6 rounded-2xl border-2 border-saffron-300 dark:border-saffron-900/60 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-950 text-center space-y-4 shadow-md">
          <div className="w-12 h-12 rounded-full bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-dharma-text">
              साधना कक्ष लॉक है · Sanctuary is Locked
            </h3>
            <p className="text-xs text-dharma-muted mt-1 max-w-sm mx-auto">
              आपकी साधना प्रविष्टियां और डायरी सुरक्षित हैं। खोलने के लिए अपना 4-अंकीय पिन दर्ज करें।
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUnlock();
              }}
              placeholder="••••"
              className="w-32 px-3 py-2 rounded-xl border border-dharma-border bg-white dark:bg-stone-900 text-center font-mono text-xl tracking-[0.5em] text-dharma-text focus:outline-none focus:ring-2 focus:ring-saffron-500 shadow-inner"
            />
            <button
              type="button"
              onClick={handleUnlock}
              className="px-5 py-2 rounded-xl bg-saffron-600 text-white font-bold text-xs hover:bg-saffron-700 shadow transition"
            >
              खोलें · Unlock
            </button>
          </div>

          {pinError && (
            <p className="text-xs text-rose-600 font-bold">
              पिन अशुद्ध है। कृपया पुनः प्रयास करें। (Incorrect PIN)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
