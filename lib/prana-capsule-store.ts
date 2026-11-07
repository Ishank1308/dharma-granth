/**
 * Prāṇa Capsule — Dynamic Island Global Activity Bus & State Machine
 *
 * Local-first, privacy-respecting state machine that arbitrates between:
 * - State A: Sacred Toast Confirmation (3s auto-revert)
 * - State B: Active Word / Concept Lookup (Śabda-Peek)
 * - State C: Active Audio Pārāyaṇa & Soundscape
 * - State D: Cross-Route Sadhana Session (Meditation Countdown or Japa Beads)
 * - State E: Chapter Scroll Progress & Resume Ribbon (Smṛti)
 * - State F: Idle / Ambient Pill
 */

export type PranaCapsuleMode =
  | 'toast'
  | 'sabda-peek'
  | 'audio-parayana'
  | 'sadhana'
  | 'smrti'
  | 'idle';

export interface PranaToastData {
  id: string;
  message: string;
  subMessage?: string;
  icon?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  durationMs?: number;
}

export interface SabdaPeekData {
  word: string;
  wordDevanagari?: string;
  transliteration?: string;
  meaningHi?: string;
  meaningEn?: string;
  root?: string;
  grammar?: string;
  verseRef?: string;
}

export interface SadhanaSessionData {
  type: 'meditation' | 'japa';
  title: string;
  /** For meditation: remaining seconds; for japa: current count */
  value: number;
  total?: number;
  running: boolean;
  rounds?: number;
  formattedTime?: string;
}

export interface ReaderScrollData {
  scriptureId: string;
  scriptureTitle: string;
  chapterNumber: number;
  totalChapters?: number;
  verseNumber: number;
  totalVerses: number;
  percent: number;
  resumeAvailable?: boolean;
}

export interface PranaCapsuleState {
  activeMode: PranaCapsuleMode;
  toast: PranaToastData | null;
  sabdaPeek: SabdaPeekData | null;
  sadhana: SadhanaSessionData | null;
  readerScroll: ReaderScrollData | null;
  isExpanded: boolean;
}

type Listener = (state: PranaCapsuleState) => void;

let currentState: PranaCapsuleState = {
  activeMode: 'idle',
  toast: null,
  sabdaPeek: null,
  sadhana: null,
  readerScroll: null,
  isExpanded: false,
};

const listeners = new Set<Listener>();
let toastTimer: ReturnType<typeof setTimeout> | null = null;
let sabdaTimer: ReturnType<typeof setTimeout> | null = null;

function notify() {
  listeners.forEach((listener) => {
    try {
      listener(currentState);
    } catch (err) {
      console.error('[PranaCapsule] listener error:', err);
    }
  });
}

function resolveActiveMode(s: PranaCapsuleState): PranaCapsuleMode {
  if (s.toast) return 'toast';
  if (s.sabdaPeek) return 'sabda-peek';
  // Check if soundscape or parayana is actively playing
  if (typeof window !== 'undefined') {
    try {
      const soundState = (window as unknown as { __dharma_soundscape_state?: { isPlaying?: boolean; parayanaActive?: boolean } }).__dharma_soundscape_state;
      if (soundState && (soundState.isPlaying || soundState.parayanaActive)) {
        return 'audio-parayana';
      }
    } catch {}
  }
  if (s.sadhana && s.sadhana.running) return 'sadhana';
  if (s.readerScroll && s.readerScroll.verseNumber > 0) return 'smrti';
  if (s.sadhana && s.sadhana.value > 0) return 'sadhana';
  return 'idle';
}

export function getPranaCapsuleState(): PranaCapsuleState {
  return currentState;
}

export function subscribePranaCapsule(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentState);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Triggers a serene, non-intrusive sacred toast in the capsule (auto-reverts in 3.5s)
 */
export function triggerPranaToast(toast: Omit<PranaToastData, 'id'> & { id?: string }): void {
  if (toastTimer) clearTimeout(toastTimer);

  const id = toast.id || Math.random().toString(36).slice(2, 9);
  const data: PranaToastData = {
    ...toast,
    id,
    durationMs: toast.durationMs || 3500,
  };

  currentState = {
    ...currentState,
    toast: data,
    activeMode: 'toast',
  };
  notify();

  toastTimer = setTimeout(() => {
    if (currentState.toast?.id === id) {
      currentState = {
        ...currentState,
        toast: null,
      };
      currentState.activeMode = resolveActiveMode(currentState);
      notify();
    }
  }, data.durationMs);
}

export function dismissPranaToast(): void {
  if (toastTimer) clearTimeout(toastTimer);
  currentState = {
    ...currentState,
    toast: null,
  };
  currentState.activeMode = resolveActiveMode(currentState);
  notify();
}

/**
 * Shows interactive word / padaccheda lookup in the capsule
 */
export function showSabdaPeek(peek: SabdaPeekData, autoDismissMs: number = 14000): void {
  if (sabdaTimer) clearTimeout(sabdaTimer);

  currentState = {
    ...currentState,
    sabdaPeek: peek,
    activeMode: 'sabda-peek',
    isExpanded: true, // expand slightly to present word meaning clearly
  };
  notify();

  if (autoDismissMs > 0) {
    sabdaTimer = setTimeout(() => {
      closeSabdaPeek();
    }, autoDismissMs);
  }
}

export function closeSabdaPeek(): void {
  if (sabdaTimer) clearTimeout(sabdaTimer);
  currentState = {
    ...currentState,
    sabdaPeek: null,
  };
  currentState.activeMode = resolveActiveMode(currentState);
  notify();
}

/**
 * Synchronizes active Sadhana (Meditation Timer or Japa Counter) cross-route
 */
export function updateSadhanaSession(sadhana: SadhanaSessionData | null): void {
  currentState = {
    ...currentState,
    sadhana,
  };
  currentState.activeMode = resolveActiveMode(currentState);
  notify();
}

/**
 * Updates chapter scroll position and reader progress
 */
export function updateReaderScrollProgress(readerScroll: ReaderScrollData | null): void {
  currentState = {
    ...currentState,
    readerScroll,
  };
  currentState.activeMode = resolveActiveMode(currentState);
  notify();
}

/**
 * Toggles expanded island modal state
 */
export function setPranaCapsuleExpanded(expanded: boolean): void {
  currentState = {
    ...currentState,
    isExpanded: expanded,
  };
  notify();
}

// Global DOM Event Listeners for zero-friction cross-component communication
if (typeof window !== 'undefined') {
  window.addEventListener('dharma:prana-toast', ((e: CustomEvent<Omit<PranaToastData, 'id'>>) => {
    if (e.detail) triggerPranaToast(e.detail);
  }) as EventListener);

  window.addEventListener('dharma:sabda-peek', ((e: CustomEvent<SabdaPeekData>) => {
    if (e.detail) showSabdaPeek(e.detail);
  }) as EventListener);

  window.addEventListener('dharma:soundscape-change', () => {
    currentState.activeMode = resolveActiveMode(currentState);
    notify();
  });
}
