'use client';

import { useRef, useState } from 'react';
import { Check, Copy, Download, KeyRound, RefreshCw, Upload } from 'lucide-react';
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
        'यह इस ब्राउज़र की जप, ध्यान, चिंतन, कृतज्ञता, संकल्प, स्वाध्याय नोट्स और अध्ययन प्रगति को बैकअप से बदलेगा। अनुपयुक्त फ़ाइल कुछ नहीं लिखेगी। जारी रखें?'
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
      className="apple-card mt-10 space-y-6 p-5 sm:p-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="apple-tint-chip" aria-hidden="true">
            <KeyRound className="h-4 w-4" />
          </span>
          <h2 id="sadhana-portability-heading" className="text-[19px] font-semibold tracking-[-0.02em] text-dharma-text">
            <span>Move to another device</span>{' '}
            <span lang="hi" className="font-devanagari text-[15px] font-normal text-dharma-muted">साधना स्थानान्तरण</span>
          </h2>
        </div>
        <p className="text-xs text-dharma-muted leading-relaxed">
          यह स्थानांतरण इसी उपकरण पर तैयार होता है और किसी सर्वर पर नहीं भेजा जाता। बैकअप फ़ाइल और सिंक कोड GZIP से संपीड़ित होते हैं, कूटबद्ध नहीं। जिसके पास फ़ाइल या कोड होगा, वह उसमें रखा निजी डेटा पढ़ सकता है; इसे निजी रखें।{' '}
          <span lang="en">Transfer is prepared on this device and is not sent to a server. Backup files and sync codes are compressed with GZIP, not encrypted. Anyone with the file or code may read its private data; keep it private.</span>
        </p>
      </div>

      {/* ── Section 1: Compressed Sync Code ── */}
      <div className="space-y-3 rounded-group bg-dharma-text/[0.04] p-4">
        <h3 className="text-[15px] font-semibold text-dharma-text">
          <span>Sync code</span> <span lang="hi" className="font-devanagari font-normal text-dharma-muted">सिंक कोड</span>
        </h3>
        <p className="text-[11px] text-dharma-muted">
          यह कोड आपके अध्ययन व साधना डेटा को GZIP संपीड़न द्वारा छोटा करता है। यह कूटबद्ध नहीं है; जिसे भी कोड मिलेगा, वह इसे पढ़ सकेगा।
          <span lang="en" className="ml-1">The code compresses your study and practice data into compact text. It is not encrypted; anyone who gets the code can read it.</span>
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerateSyncCode}
            disabled={generatingCode}
            className="apple-pill disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${generatingCode ? 'animate-spin' : ''}`} />
            <span>सिंक कोड जनरेट करें</span>
          </button>

          {syncCode && (
            <button
              type="button"
              onClick={handleCopySyncCode}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-dharma-text/[0.06] px-5 text-[15px] text-dharma-text hover:bg-dharma-text/[0.1]"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'कॉपी हो गया!' : 'कोड कॉपी करें'}</span>
            </button>
          )}
        </div>

        {syncCode && (
          <div className="rounded-[12px] bg-dharma-card p-2.5">
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
        <div className="flex flex-wrap gap-2 border-t border-dharma-text/10 pt-3">
          <input
            type="text"
            value={inputSyncCode}
            onChange={(e) => setInputSyncCode(e.target.value)}
            placeholder="यहाँ सिंक कोड पेस्ट करें (DG-SYNC-v1-...)"
            aria-label="Paste Sync String to Restore"
            className="apple-field min-w-[200px] flex-1 !bg-dharma-card font-mono !text-[13px]"
          />
          <button
            type="button"
            onClick={handleRestoreFromSyncCode}
            disabled={!inputSyncCode.trim() || restoringCode}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-dharma-text/[0.06] px-5 text-[15px] text-dharma-text hover:bg-dharma-text/[0.1] disabled:opacity-40"
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
            className="apple-pill"
          >
            <Download className="h-4 w-4" aria-hidden />
            <span>.dharma बैकअप डाउनलोड</span>
          </button>

          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-dharma-text/[0.06] px-5 text-[15px] text-dharma-text hover:bg-dharma-text/[0.1]"
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
        <p role="status" className="rounded-[12px] bg-dharma-text/[0.04] p-3 text-[13px] text-dharma-text">
          {message}
        </p>
      )}
    </section>
  );
}
