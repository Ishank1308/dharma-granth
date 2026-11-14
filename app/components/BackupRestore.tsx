'use client';

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { createBackup, restoreBackup, type BackupRestoreMode } from '@/lib/backup';

const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

/** Export / import of local bookmarks, notes, settings and reading/practice progress. */
export function BackupRestore() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<BackupRestoreMode>('merge');
  const [message, setMessage] = useState('');

  function download() {
    try {
      const blob = new Blob([JSON.stringify(createBackup(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-granth-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMessage('बैकअप डाउनलोड हो गया · JSON backup downloaded.');
    } catch {
      setMessage('बैकअप नहीं बन सका · Could not create a backup; browser storage may be blocked.');
    }
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    const reset = () => {
      if (fileInput.current) fileInput.current.value = '';
    };
    if (file.size > MAX_BACKUP_BYTES) {
      setMessage('यह फ़ाइल बहुत बड़ी है · This file is too large to be a backup.');
      reset();
      return;
    }

    const choice = mode === 'merge'
      ? 'Merge keeps other local data and replaces matching keys with the imported values.'
      : 'Replace removes all Dharma Granth data in this browser before restoring the file.';
    if (!window.confirm(`${choice}\n\n${mode === 'merge' ? 'मिलाएँ' : 'प्रतिस्थापित करें'}? जारी रखें?`)) {
      reset();
      return;
    }

    try {
      const count = restoreBackup(await file.text(), mode);
      setMessage(`${count} items restored — reloading… · ${count} आइटम पुनर्स्थापित`);
      window.setTimeout(() => window.location.reload(), 900);
    } catch (error) {
      const reason = error instanceof Error ? error.message : '';
      setMessage(reason.includes('unsupported') || reason.includes('supported')
        ? 'यह बैकअप संस्करण समर्थित नहीं है · This backup version is not supported.'
        : 'यह फ़ाइल मान्य बैकअप नहीं है · This is not a valid backup file.');
    } finally {
      reset();
    }
  }

  return (
    <section aria-labelledby="backup-heading" className="apple-card mt-6 p-5 sm:p-6">
      <h2 id="backup-heading" className="text-title-3 font-semibold text-dharma-text">
        बैकअप और पुनर्स्थापन · Backup &amp; Restore
      </h2>
      <p className="mt-1 text-sm text-dharma-muted">
        Your practice and study data stays in this browser. Export a JSON copy to move it to another device; no account is needed.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-dharma-muted">
        JSON backups are readable and not encrypted. Keep the downloaded file somewhere private.
        <span lang="hi" className="ml-1 font-devanagari">JSON बैकअप पढ़े जा सकते हैं और कूटबद्ध नहीं होते। डाउनलोड की गई फ़ाइल को निजी स्थान पर रखें।</span>
      </p>

      <fieldset className="mt-4 grid gap-2 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold text-dharma-text">Import behavior · आयात विकल्प</legend>
        <label className="flex cursor-pointer items-start gap-2 rounded-field bg-dharma-text/[0.04] p-3 text-sm">
          <input type="radio" name="backup-restore-mode" value="merge" checked={mode === 'merge'} onChange={() => setMode('merge')} className="mt-0.5 h-5 w-5 shrink-0 accent-orange-700" />
          Merge · मिलाएँ — Keep other local entries; imported values replace matching keys.
        </label>
        <label className="flex cursor-pointer items-start gap-2 rounded-field bg-dharma-text/[0.04] p-3 text-sm">
          <input type="radio" name="backup-restore-mode" value="replace" checked={mode === 'replace'} onChange={() => setMode('replace')} className="mt-0.5 h-5 w-5 shrink-0 accent-orange-700" />
          Replace · बदलें — Remove all current Dharma Granth data before importing.
        </label>
      </fieldset>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={download} className="apple-pill">
          <Download className="h-4 w-4" aria-hidden="true" /> Export JSON
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-dharma-text/[0.06] px-5 text-subhead text-dharma-text hover:bg-dharma-text/[0.1]">
          <Upload className="h-4 w-4" aria-hidden="true" /> Import JSON
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void upload(event.target.files?.[0])} />
      </div>
      <p role="status" aria-live="polite" className="mt-3 text-sm text-dharma-muted">{message}</p>
    </section>
  );
}
