'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Bookmark,
  BookOpen,
  WifiOff,
  AlertCircle,
  FileQuestion,
  RefreshCw,
  FolderHeart,
  Edit3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  titleSanskrit?: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  titleSanskrit,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[24px] border border-dharma-border/80 bg-dharma-card/60 shadow-2xs',
        className
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-dharma-border bg-dharma-panel-muted text-dharma-muted shadow-2xs">
          {icon}
        </div>
      )}

      {titleSanskrit && (
        <span className="text-xs font-devanagari font-bold text-saffron-700 dark:text-saffron-400 mb-1">
          {titleSanskrit}
        </span>
      )}

      <h3 className="text-base sm:text-lg font-bold font-devanagari text-dharma-text">
        {title}
      </h3>

      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-dharma-muted leading-relaxed">
        {description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-5">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 rounded-xl bg-saffron-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition hover:bg-saffron-700 shadow-xs"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-xl bg-saffron-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition hover:bg-saffron-700 shadow-xs cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Pre-configured States ──────────────────────────────────────────

export function NoSearchResultsState({
  query,
  onReset,
}: {
  query: string;
  onReset?: () => void;
}) {
  return (
    <EmptyState
      icon={<Search className="h-6 w-6 text-saffron-600" />}
      title="कोई परिणाम नहीं मिला"
      titleSanskrit="अनुपलब्ध परिणाम"
      description={`"${query}" के लिए कोई श्लोक, अध्याय या विषय नहीं मिला। कृपया शब्द की वर्तनी जाँचें अथवा किसी अन्य संदर्भ से खोजें।`}
      actionLabel={onReset ? 'खोज रीसेट करें' : undefined}
      onAction={onReset}
    />
  );
}

export function NoBookmarksState() {
  return (
    <EmptyState
      icon={<Bookmark className="h-6 w-6 text-amber-600" />}
      title="कोई सुरक्षित श्लोक नहीं"
      titleSanskrit="रिक्त संग्रह"
      description="आपने अभी तक कोई श्लोक सहेजकर नहीं रखा है। पढ़ते समय श्लोक कार्ड पर बने बुकमार्क चिह्न को दबाकर यहाँ सुरक्षित करें।"
      actionLabel="शास्त्र पढ़ना आरंभ करें"
      actionHref="/scriptures"
    />
  );
}

export function NoCollectionsState() {
  return (
    <EmptyState
      icon={<FolderHeart className="h-6 w-6 text-rose-600" />}
      title="कोई व्यक्तिगत संग्रह नहीं"
      titleSanskrit="रिक्त संकलन"
      description="अपने चिंतन और स्वाध्याय के अनुसार श्लोकों को थीम-आधारित संग्रहों में व्यवस्थित करें।"
      actionLabel="शास्त्र संग्रह देखें"
      actionHref="/scriptures"
    />
  );
}

export function NoJournalEntriesState() {
  return (
    <EmptyState
      icon={<Edit3 className="h-6 w-6 text-indigo-600" />}
      title="स्वाध्याय दैनिकी रिक्त है"
      titleSanskrit="रिक्त दैनिकी"
      description="आपके विचार और मनन आपके अपने उपकरण में पूर्णतः निजी रहते हैं। किसी भी श्लोक पर 'नोट लिखें' चुनकर दैनिकी प्रारंभ करें।"
      actionLabel="दैनिक श्लोक देखें"
      actionHref="/daily"
    />
  );
}

export function OfflineUnavailableState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<WifiOff className="h-6 w-6 text-dharma-muted" />}
      title="ऑफ़लाइन सामग्री अनुपलब्ध"
      titleSanskrit="ऑफ़लाइन स्थिति"
      description="यह अंश आपके उपकरण में अभी संचित नहीं है। इंटरनेट जुड़ने पर यह स्वतः उपलब्ध हो जाएगा।"
      actionLabel={onRetry ? 'पुनः प्रयास करें' : undefined}
      onAction={onRetry}
    />
  );
}

export function MissingCommentaryState() {
  return (
    <EmptyState
      icon={<FileQuestion className="h-6 w-6 text-dharma-muted" />}
      title="पारंपरिक भाष्य समीक्षाधीन"
      titleSanskrit="समीक्षाधीन"
      description="इस श्लोक का मूल पाठ एवं सरल अर्थ पूर्णतः सत्यापित है। शास्त्रीय टीका एवं विस्तृत व्याख्या की पांडुलिपि समीक्षा जारी है।"
    />
  );
}
