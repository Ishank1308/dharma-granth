'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  Trash2,
  HardDrive,
  WifiOff,
  Loader2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { OFFLINE_READING_PACKS } from '@/data/offline-packs';
import {
  getAllOfflinePacks,
  saveOfflinePack,
  deleteOfflinePack,
} from '@/lib/study/storage';
import { saveChapterVersesToDB } from '@/lib/db/granth-indexeddb';
import type { OfflineReadingPack } from '@/lib/study/types';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function OfflinePacksModal({ isOpen, onClose }: Props) {
  const [downloadedPacks, setDownloadedPacks] = useState<Record<string, OfflineReadingPack>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const loadDownloaded = async () => {
    const list = await getAllOfflinePacks();
    const map: Record<string, OfflineReadingPack> = {};
    list.forEach((p) => {
      if (p.isComplete) map[p.id] = p;
    });
    setDownloadedPacks(map);
  };

  useEffect(() => {
    if (isOpen) {
      loadDownloaded();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadPack = async (pack: OfflineReadingPack) => {
    if (downloadingId) return;
    setDownloadingId(pack.id);
    setProgress(5);
    setStatusMsg('अध्याय सूची तैयार की जा रही है…');
    triggerTactileFeedback('selection', 'softTap');

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    try {
      const totalScriptures = pack.scriptureIds.length;
      let scripturesCompleted = 0;

      for (const scriptureId of pack.scriptureIds) {
        setStatusMsg(`${scriptureId} डाउनलोड हो रहा है…`);

        // Check if full JSON exists
        try {
          const res = await fetch(`${basePath}/data/scriptures-full/${scriptureId}.json`);
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.chapters)) {
              for (const ch of data.chapters) {
                if (ch && Array.isArray(ch.verses)) {
                  await saveChapterVersesToDB(scriptureId, ch.number || 1, ch.verses);
                }
              }
            }
          }
        } catch {
          // If bulk file not available, try chapter shards 1 through 20
          for (let ch = 1; ch <= 18; ch++) {
            try {
              const shardRes = await fetch(`${basePath}/data/scriptures-full/${scriptureId}/ch-${ch}.json`);
              if (shardRes.ok) {
                const shard = await shardRes.json();
                if (shard?.chapter?.verses) {
                  await saveChapterVersesToDB(scriptureId, ch, shard.chapter.verses);
                }
              } else {
                break;
              }
            } catch {
              break;
            }
          }
        }

        scripturesCompleted++;
        const pct = Math.round((scripturesCompleted / totalScriptures) * 95);
        setProgress(pct);
      }

      // Mark complete
      const completedRecord: OfflineReadingPack = {
        ...pack,
        isComplete: true,
        downloadedAt: new Date().toISOString(),
      };
      await saveOfflinePack(completedRecord);
      setDownloadedPacks((prev) => ({ ...prev, [pack.id]: completedRecord }));
      setProgress(100);
      setStatusMsg('सफलतापूर्वक डाउनलोड संपन्न!');
      triggerTactileFeedback('success', 'softTap');
      setTimeout(() => {
        setDownloadingId(null);
        setProgress(0);
        setStatusMsg('');
      }, 1500);
    } catch (err) {
      console.error('Download failed:', err);
      setStatusMsg('डाउनलोड में त्रुटि हुई। पुनः प्रयास करें।');
      setDownloadingId(null);
    }
  };

  const handleDeletePack = async (packId: string) => {
    if (confirm('क्या आप इस ऑफ़लाइन पैक को हटाना चाहते हैं? (Remove downloaded pack to free space?)')) {
      triggerTactileFeedback('medium', 'softTap');
      await deleteOfflinePack(packId);
      setDownloadedPacks((prev) => {
        const next = { ...prev };
        delete next[packId];
        return next;
      });
    }
  };

  const totalBytes = Object.values(downloadedPacks).reduce((sum, p) => sum + (p.estimatedBytes || 0), 0);
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900 manuscript-surface z-10 flex flex-col my-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-200/70 dark:border-stone-800/70">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-saffron-700 dark:text-saffron-400 font-bold flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" />
                <span>ऑफ़लाइन स्वाध्याय संग्रह · Offline Reading Packs</span>
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                विमान यात्रा, एकांत साधना एवं बिना इंटरनेट स्वाध्याय
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body list of packs */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
            {/* Storage info bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-xs">
              <span className="flex items-center gap-2 font-medium text-stone-700 dark:text-stone-300">
                <HardDrive className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
                <span>ऑफ़लाइन सुरक्षित डेटा: <strong>{totalMb} MB</strong> ({Object.keys(downloadedPacks).length} पैक सुरक्षित)</span>
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">IndexedDB v2</span>
            </div>

            {/* Pack Cards */}
            <div className="space-y-3">
              {OFFLINE_READING_PACKS.map((pack) => {
                const isDownloaded = Boolean(downloadedPacks[pack.id]);
                const isCurrentlyDownloading = downloadingId === pack.id;
                const sizeMb = (pack.estimatedBytes / (1024 * 1024)).toFixed(1);

                return (
                  <div
                    key={pack.id}
                    className={`rounded-2xl border p-4.5 transition-all ${
                      isDownloaded
                        ? 'border-emerald-300/80 bg-emerald-500/5 dark:border-emerald-700/60'
                        : 'border-stone-200/80 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-950/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">
                            {pack.title}
                          </h4>
                          {isDownloaded && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>सुरक्षित (Offline Ready)</span>
                            </span>
                          )}
                        </div>
                        <p lang="hi" className="font-devanagari text-xs text-saffron-700 dark:text-saffron-400 font-semibold mb-1">
                          {pack.titleHi}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-2">
                          {pack.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                          <span>{pack.totalVerses} श्लोक</span>
                          <span>•</span>
                          <span>लगभग {sizeMb} MB</span>
                          <span>•</span>
                          <span>{pack.scriptureIds.length} ग्रंथ</span>
                        </div>
                      </div>

                      {/* Download / Delete Action */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isDownloaded ? (
                          <button
                            type="button"
                            onClick={() => handleDeletePack(pack.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>हटाएं</span>
                          </button>
                        ) : isCurrentlyDownloading ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-saffron-500/15 text-saffron-800 dark:text-saffron-300 text-xs font-bold">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{progress}%</span>
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDownloadPack(pack)}
                            disabled={Boolean(downloadingId)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>डाउनलोड</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress bar during download */}
                    {isCurrentlyDownloading && (
                      <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800/60">
                        <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-saffron-600 transition-all duration-300 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 italic">
                          {statusMsg}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-stone-50/60 dark:bg-stone-950/60 border-t border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>🔒 सभी डेटा केवल आपके इस डिवाइस में सुरक्षित रहता है।</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              बंद करें (Done)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
