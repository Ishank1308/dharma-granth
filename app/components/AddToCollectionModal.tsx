'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FolderPlus, FolderCheck, Plus, X, Check } from 'lucide-react';
import { useStudyProgress, type VerseRef } from '@/lib/useStudyProgress';
import { triggerTactileFeedback } from '@/lib/haptics';
import { useAccessibleModal } from '@/lib/useAccessibleModal';

interface AddToCollectionModalProps {
  open: boolean;
  onClose: () => void;
  verse: VerseRef | null;
}

export function AddToCollectionModal({ open, onClose, verse }: AddToCollectionModalProps) {
  const reduce = useReducedMotion();
  const { collections, createCollection, addToCollection, removeFromCollection } = useStudyProgress();
  const [showCreate, setShowCreate] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const createInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useAccessibleModal(open && Boolean(verse), dialogRef, onClose, closeButtonRef);

  useEffect(() => {
    if (showCreate) {
      createInputRef.current?.focus();
    }
  }, [showCreate]);

  if (!verse) return null;

  const isVerseInCollection = (collectionId: string) => {
    const col = collections.find((c) => c.id === collectionId);
    if (!col) return false;
    return col.verseRefs.some(
      (ref) =>
        ref.scriptureId === verse.scriptureId &&
        ref.chapterId === verse.chapterId &&
        String(ref.verseId) === String(verse.verseId),
    );
  };

  const toggleCollection = (collectionId: string) => {
    triggerTactileFeedback('light', 'softTap');
    if (isVerseInCollection(collectionId)) {
      removeFromCollection(collectionId, verse.scriptureId, verse.verseId);
    } else {
      addToCollection(collectionId, verse);
    }
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    const id = createCollection(newColName.trim(), newColDesc.trim() || undefined);
    addToCollection(id, verse);
    setNewColName('');
    setNewColDesc('');
    setShowCreate(false);
    triggerTactileFeedback('medium', 'success');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={reduce ? {} : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduce ? {} : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-modal-title"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-saffron-700">
                  {verse.scriptureTitle}
                </span>
                <h3 id="collection-modal-title" className="text-lg font-serif font-bold text-dharma-text mt-0.5">
                  संग्रह में जोड़ें (Add to Collection)
                </h3>
                <p className="text-xs text-dharma-muted mt-1">
                  अध्याय {verse.chapterId} · श्लोक {verse.verseId}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-dharma-muted hover:bg-dharma-bg hover:text-dharma-text transition"
                aria-label="Close collection dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Existing Collections List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-4">
              {collections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-dharma-border p-6 text-center">
                  <FolderPlus className="h-8 w-8 text-dharma-muted mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-dharma-muted leading-relaxed">
                    अभी कोई संग्रह नहीं बना है। नीचे नया संग्रह बनाएँ।
                  </p>
                </div>
              ) : (
                collections.map((col) => {
                  const inCol = isVerseInCollection(col.id);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => toggleCollection(col.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
                        inCol
                          ? 'border-saffron-500 bg-saffron-500/10 text-dharma-text'
                          : 'border-dharma-border bg-dharma-bg/40 text-dharma-text hover:border-saffron-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {inCol ? (
                            <FolderCheck className="h-4 w-4 shrink-0 text-saffron-600" />
                          ) : (
                            <FolderPlus className="h-4 w-4 shrink-0 text-dharma-muted" />
                          )}
                          <span className="text-sm font-semibold truncate">{col.name}</span>
                        </div>
                        {col.description && (
                          <p className="text-[11px] text-dharma-muted truncate mt-0.5 pl-6">
                            {col.description}
                          </p>
                        )}
                      </div>
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          inCol
                            ? 'border-saffron-600 bg-saffron-600 text-white'
                            : 'border-dharma-border bg-dharma-card'
                        }`}
                      >
                        {inCol && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Create new collection section */}
            {!showCreate ? (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-dharma-border py-2.5 text-xs font-semibold text-saffron-700 hover:border-saffron-400 hover:bg-saffron-50/50 transition dark:hover:bg-saffron-950/20"
              >
                <Plus className="h-4 w-4" />
                <span>नया संग्रह बनाएँ (New Collection)</span>
              </button>
            ) : (
              <form onSubmit={handleCreateCollection} className="rounded-xl border border-dharma-border bg-dharma-bg/50 p-3 space-y-2.5">
                <div>
                  <input
                    ref={createInputRef}
                    type="text"
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    placeholder="संग्रह का नाम (e.g. कर्म योग, शांति)..."
                    className="w-full rounded-lg border border-dharma-border bg-dharma-card px-3 py-1.5 text-xs text-dharma-text placeholder:text-dharma-muted/60 focus:border-saffron-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newColDesc}
                    onChange={(e) => setNewColDesc(e.target.value)}
                    placeholder="विवरण (वैकल्पिक)..."
                    className="w-full rounded-lg border border-dharma-border bg-dharma-card px-3 py-1.5 text-xs text-dharma-text placeholder:text-dharma-muted/60 focus:border-saffron-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreate(false);
                      setNewColName('');
                      setNewColDesc('');
                    }}
                    className="rounded-lg px-2.5 py-1 text-xs text-dharma-muted hover:text-dharma-text transition"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={!newColName.trim()}
                    className="rounded-lg bg-saffron-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-saffron-700 disabled:opacity-50 transition"
                  >
                    बनाएँ और जोड़ें
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
