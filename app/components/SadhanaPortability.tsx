'use client';

import { useRef, useState } from 'react';
import { Check, Copy, Download, KeyRound, RefreshCw, Sparkles, Upload } from 'lucide-react';
import {
  generateSadhanaSyncString,
  restoreSadhanaFromSyncString,
  exportDharmaBackupFile,
  importDharmaBackupFile,
} from '@/lib/db/sadhana-sync';
import { triggerTactileFeedback } from '@/lib/haptics';

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Export and restore of sadhana journals, reading progress, and manana notes.
 * Supports zero-server compressed sync string (DG-SYNC-v1-...) and offline .dharma files.
 */
export function SadhanaPortability() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [syncCode, setSyncCode] = useState('');
  const [inputSyncCode, setInputSyncCode] = useState('');
  const [generatingCode, setGeneratingCode] = useState(false);
  const [restoringCode, setRestoringCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate Compressed Sadhana Sync String
  async function handleGenerateSyncCode() {
    setGeneratingCode(true);
    try {
      const code = await generateSadhanaSyncString();
      setSyncCode(code);
      triggerTactileFeedback('success', 'success');
      setMessage('साधना सिंक कोड तैयार है। इसे कॉपी करके दूसरे उपकरण पर पेस्ट करें।');
    } catch {
      setMessage('सिंक कोड बनाने में त्रुटि हुई।');
    } finally {
      setGeneratingCode(false);
    }
  }

  // Copy Sync String to clipboard
  async function handleCopySyncCode() {
    if (!syncCode) return;
    try {
      await navigator.clipboard.writeText(syncCode);
      setCopiedCode(true);
      triggerTactileFeedback('medium', 'softTap');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  }

  // Restore from Sync String
  async function handleRestoreFromSyncCode() {
    if (!inputSyncCode.trim()) return;
    setRestoringCode(true);
    try {
      const res = await restoreSadhanaFromSyncString(inputSyncCode);
      setMessage(res.message);
      if (res.success) {
        triggerTactileFeedback('success', 'success');
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch {
      setMessage('सिंक कोड अमान्य है।');
    } finally {
      setRestoringCode(false);
    }
  }

  // Download .dharma backup file
  async function downloadDharmaBackup() {
    try {
      const { blob, filename } = await exportDharmaBackupFile();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      triggerTactileFeedback('success', 'softTap');
      setMessage('.dharma साधना बैकअप फ़ाइल डाउनलोड हो गई।');
    } catch {
      setMessage('बैकअप फ़ाइल नहीं बन सकी।');
    }
  }

  // Upload .dharma / .json backup file
  async function uploadFile(file: File | undefined) {
    if (!file) return;
    const reset = () => {
      if (fileInput.current) fileInput.current.value = '';
    };
    if (file.size > MAX_BYTES) {
      setMessage('यह फ़ाइल बहुत बड़ी है।');
      reset();
      return;
    }

    if (
      !window.confirm(
        'यह इस ब्राउज़र की जप, ध्यान, चिंतन, और स्वाध्याय नोट्स को बैकअप से अद्यतित करेगा। क्या आप जारी रखना चाहते हैं?'
      )
    ) {
      reset();
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const res = await importDharmaBackupFile(buffer);
      setMessage(res.message);
      if (res.success) {
        triggerTactileFeedback('success', 'success');
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch {
      setMessage('फ़ाइल पढ़ने में त्रुटि हुई।');
    }
    reset();
  }

  return (
    <section
      aria-labelledby="sadhana-portability-heading"
      className="mt-10 rounded-3xl border border-saffron-200 bg-white/80 p-6 dark:border-saffron-900/40 dark:bg-dharma-card/60 backdrop-blur shadow-sm space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron-100 text-saffron-700 dark:bg-saffron-950/60 dark:text-saffron-300">
            <KeyRound className="h-4 w-4" />
          </span>
          <h2 id="sadhana-portability-heading" className="font-serif text-lg font-bold text-dharma-text">
            साधना पोर्टेबिलिटी एवं शून्य-सर्वर सिंक (Zero-Server Sadhana Sync)
          </h2>
        </div>
        <p className="text-xs text-dharma-muted leading-relaxed">
          आपका समस्त साधना डेटा (जप, ध्यान, स्वाध्याय नोट्स, बुकमार्क व अध्ययन प्रगति) पूर्णतः एन्क्रिप्टेड व संकुचित रूप में आपके उपकरण पर सुरक्षित रहता है। बिना किसी अकाउंट के एक उपकरण से दूसरे उपकरण पर स्थानांतरण करें।
        </p>
      </div>

      {/* ── Section 1: Compressed Sync Code ── */}
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3">
        <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          साधना सिंक स्ट्रिंग (Compressed Sync Code)
        </h3>
        <p className="text-[11px] text-dharma-muted">
          यह कोड आपके संपूर्ण अध्ययन व साधना स्थिति को GZIP संपीड़न द्वारा एक कॉम्पैक्ट टेक्स्ट में बदलता है।
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerateSyncCode}
            disabled={generatingCode}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-saffron-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-saffron-700 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${generatingCode ? 'animate-spin' : ''}`} />
            <span>सिंक कोड जनरेट करें</span>
          </button>

          {syncCode && (
            <button
              type="button"
              onClick={handleCopySyncCode}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-saffron-300 bg-dharma-card px-3.5 py-1.5 text-xs font-bold text-saffron-800 hover:bg-saffron-50 transition active:scale-95 dark:border-saffron-700 dark:text-saffron-200"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'कॉपी हो गया!' : 'कोड कॉपी करें'}</span>
            </button>
          )}
        </div>

        {syncCode && (
          <div className="rounded-xl border border-saffron-200 bg-dharma-card p-2.5 dark:border-saffron-900/40">
            <input
              type="text"
              readOnly
              value={syncCode}
              aria-label="Generated Sync String"
              className="w-full bg-transparent font-mono text-[11px] text-dharma-text outline-none select-all truncate"
            />
          </div>
        )}

        {/* Input Sync Code to Restore */}
        <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/30 flex flex-wrap gap-2">
          <input
            type="text"
            value={inputSyncCode}
            onChange={(e) => setInputSyncCode(e.target.value)}
            placeholder="यहाँ सिंक कोड पेस्ट करें (DG-SYNC-v1-...)"
            aria-label="Paste Sync String to Restore"
            className="flex-1 min-w-[200px] rounded-xl border border-dharma-border bg-dharma-bg px-3 py-1.5 text-xs font-mono text-dharma-text outline-none focus:border-saffron-400"
          />
          <button
            type="button"
            onClick={handleRestoreFromSyncCode}
            disabled={!inputSyncCode.trim() || restoringCode}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-saffron-300 bg-saffron-50 px-3.5 py-1.5 text-xs font-bold text-saffron-800 hover:bg-saffron-100 transition active:scale-95 disabled:opacity-40 dark:bg-saffron-950/40 dark:text-saffron-200 dark:border-saffron-700"
          >
            {restoringCode ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            <span>कोड से पुनर्स्थापित करें</span>
          </button>
        </div>
      </div>

      {/* ── Section 2: .dharma Offline File Backup ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadDharmaBackup}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-saffron-700 px-4 py-2 text-xs font-bold text-white hover:bg-saffron-800 transition active:scale-95 shadow-2xs"
          >
            <Download className="h-4 w-4" aria-hidden />
            <span>.dharma बैकअप डाउनलोड</span>
          </button>

          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-saffron-300 dark:border-saffron-700 px-4 py-2 text-xs font-bold text-saffron-800 dark:text-saffron-200 hover:bg-saffron-50 dark:hover:bg-saffron-950/40 transition active:scale-95"
          >
            <Upload className="h-4 w-4" aria-hidden />
            <span>फ़ाइल से Restore करें (.dharma / .json)</span>
          </button>

          <input
            ref={fileInput}
            type="file"
            accept=".dharma,.json,application/json,application/octet-stream"
            className="hidden"
            aria-label="Restore Sadhana Backup File"
            onChange={(e) => uploadFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {message && (
        <p role="status" className="text-xs font-medium text-saffron-900 dark:text-saffron-200 bg-saffron-50 dark:bg-saffron-950/40 p-2.5 rounded-xl border border-saffron-200 dark:border-saffron-900/40">
          {message}
        </p>
      )}
    </section>
  );
}
