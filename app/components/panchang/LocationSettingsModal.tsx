'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, Globe, MapPin, Search, Sliders, X, AlertCircle } from 'lucide-react';
import { LocationConfig, PRESET_LOCATIONS } from '@/lib/panchang';

interface LocationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationConfig;
  onSelectLocation: (loc: LocationConfig) => void;
}

export function LocationSettingsModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}: LocationSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [searchQuery, setSearchQuery] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const presetsTabRef = useRef<HTMLButtonElement>(null);
  const customTabRef = useRef<HTMLButtonElement>(null);

  // Custom location fields
  const [customName, setCustomName] = useState('');
  const [customRegion, setCustomRegion] = useState('');
  const [customCountry, setCustomCountry] = useState('India');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [customTimezone, setCustomTimezone] = useState('IST');
  const [customUtcOffset, setCustomUtcOffset] = useState('5.5');
  const [customError, setCustomError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]):not([tabindex="-1"]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const next =
        e.key === 'Home' ? 'presets'
        : e.key === 'End' ? 'custom'
        : activeTab === 'presets' ? 'custom' : 'presets';
      setActiveTab(next);
      (next === 'presets' ? presetsTabRef : customTabRef).current?.focus();
    }
  };

  if (!isOpen) return null;

  const filteredPresets = PRESET_LOCATIONS.filter((loc) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.nameHi.toLowerCase().includes(q) ||
      loc.region.toLowerCase().includes(q) ||
      loc.country.toLowerCase().includes(q) ||
      loc.timezone.toLowerCase().includes(q)
    );
  });

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    if (!customName.trim()) {
      setCustomError('Please enter a location or city name.');
      return;
    }

    const latNum = parseFloat(customLat);
    const lonNum = parseFloat(customLon);
    const offsetNum = parseFloat(customUtcOffset);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      setCustomError('Please enter a latitude between -90 and 90 degrees.');
      return;
    }
    if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      setCustomError('Please enter a longitude between -180 and 180 degrees.');
      return;
    }
    if (isNaN(offsetNum) || offsetNum < -12 || offsetNum > 14) {
      setCustomError('Please enter a UTC offset between -12 and +14 hours.');
      return;
    }

    const newLoc: LocationConfig = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      nameHi: customName.trim(),
      region: customRegion.trim() || 'Custom',
      country: customCountry.trim() || 'User Location',
      latitude: latNum,
      longitude: lonNum,
      timezone: customTimezone.trim() || 'Custom TZ',
      utcOffsetHours: offsetNum,
      hasReliableCoordinates: true,
      notes: 'Custom geographic coordinate profile.',
    };

    onSelectLocation(newLoc);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close dialog backdrop"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 cursor-default"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl border border-dharma-border bg-dharma-card shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dharma-border px-6 py-4 bg-dharma-panel">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-700 dark:text-saffron-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 id="location-settings-title" className="font-serif text-lg font-bold text-dharma-text">
                <span lang="hi" data-bi="hi">स्थान सेटिंग्स</span><span data-bi="sep"> · </span><span data-bi="en">Location Settings</span>
              </h2>
              <p className="text-xs text-dharma-muted">
                Choose your observation point for solar and lunar calculations
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-dharma-muted hover:bg-dharma-bg hover:text-dharma-text transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div
          role="tablist"
          aria-label="Location input mode"
          className="flex border-b border-dharma-border px-6 pt-3 gap-2 bg-dharma-panel/50"
        >
          <button
            ref={presetsTabRef}
            id="loc-tab-presets"
            type="button"
            role="tab"
            aria-selected={activeTab === 'presets'}
            aria-controls="loc-panel-presets"
            tabIndex={activeTab === 'presets' ? 0 : -1}
            onKeyDown={handleTabKeyDown}
            onClick={() => setActiveTab('presets')}
            className={`focus-ring flex min-h-[44px] items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'presets'
                ? 'border-saffron-600 text-saffron-700 dark:text-saffron-400'
                : 'border-transparent text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Preset Cities ({PRESET_LOCATIONS.length})</span>
          </button>
          <button
            ref={customTabRef}
            id="loc-tab-custom"
            type="button"
            role="tab"
            aria-selected={activeTab === 'custom'}
            aria-controls="loc-panel-custom"
            tabIndex={activeTab === 'custom' ? 0 : -1}
            onKeyDown={handleTabKeyDown}
            onClick={() => setActiveTab('custom')}
            className={`focus-ring flex min-h-[44px] items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'custom'
                ? 'border-saffron-600 text-saffron-700 dark:text-saffron-400'
                : 'border-transparent text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Custom Coordinates</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'presets' && (
            <div id="loc-panel-presets" role="tabpanel" aria-labelledby="loc-tab-presets" className="space-y-4">
              {/* Search box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dharma-muted" aria-hidden="true" />
                <input
                  type="text"
                  aria-label="Search city, state, or country"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, state, or country..."
                  className="w-full min-h-[44px] rounded-xl border border-dharma-border bg-dharma-bg py-2.5 pl-10 pr-4 text-xs sm:text-sm text-dharma-text placeholder:text-dharma-muted focus:border-saffron-500 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                />
              </div>

              {/* Presets list */}
              <div className="grid gap-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredPresets.map((loc) => {
                  const isSelected = loc.id === currentLocation.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        onSelectLocation(loc);
                        onClose();
                      }}
                      className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition ${
                        isSelected
                          ? 'border-saffron-500 bg-saffron-500/10 text-dharma-text shadow-sm'
                          : 'border-dharma-border bg-dharma-card hover:border-dharma-border/80 hover:bg-dharma-bg'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-dharma-text truncate">
                            {loc.name}
                          </span>
                          <span lang="hi" className="text-xs text-saffron-700 dark:text-saffron-400 font-devanagari">
                            {loc.nameHi}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-dharma-muted">
                          {loc.region ? `${loc.region}, ` : ''}{loc.country} ·{' '}
                          <span className="font-mono">{loc.timezone} (UTC{loc.utcOffsetHours >= 0 ? `+${loc.utcOffsetHours}` : loc.utcOffsetHours})</span>
                        </p>
                        {loc.notes && (
                          <p className="mt-1 text-[11px] text-dharma-muted/90 italic">
                            {loc.notes}
                          </p>
                        )}
                        {!loc.hasReliableCoordinates && (
                          <span className="mt-1 inline-block rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                            No coordinates (Demo unavailable state)
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-saffron-600 text-white shadow-sm">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  );
                })}

                {filteredPresets.length === 0 && (
                  <p className="py-8 text-center text-xs text-dharma-muted">
                    No location matches &ldquo;{searchQuery}&rdquo;. Try Custom Coordinates instead.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <form id="loc-panel-custom" role="tabpanel" aria-labelledby="loc-tab-custom" onSubmit={handleSaveCustom} className="space-y-4">
              <p className="text-xs text-dharma-muted leading-relaxed">
                Provide custom geographic coordinates for your town or village. High precision
                ensures reliable local sunrise and astronomical elongation calculations.
              </p>

              {customError && (
                <div role="alert" className="flex items-center gap-2 rounded-xl bg-rose-500/15 p-3 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{customError}</span>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-dharma-text mb-1">
                    City / Location Name *
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Jaipur"
                      className="mt-1 w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-xs text-dharma-text focus:border-saffron-500 focus:outline-none"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dharma-text mb-1">
                    State / Region
                    <input
                      type="text"
                      value={customRegion}
                      onChange={(e) => setCustomRegion(e.target.value)}
                      placeholder="e.g. Rajasthan"
                      className="mt-1 w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-xs text-dharma-text focus:border-saffron-500 focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-dharma-text mb-1">
                    Latitude (-90 to +90) *
                    <input
                      type="number"
                      step="any"
                      required
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      placeholder="e.g. 26.9124"
                      className="mt-1 w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-xs font-mono text-dharma-text focus:border-saffron-500 focus:outline-none"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dharma-text mb-1">
                    Longitude (-180 to +180) *
                    <input
                      type="number"
                      step="any"
                      required
                      value={customLon}
                      onChange={(e) => setCustomLon(e.target.value)}
                      placeholder="e.g. 75.7873"
                      className="mt-1 w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-xs font-mono text-dharma-text focus:border-saffron-500 focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-dharma-text mb-1">
                    Timezone Label
                    <input
                      type="text"
                      value={customTimezone}
                      onChange={(e) => setCustomTimezone(e.target.value)}
                      placeholder="e.g. IST, PST, CET"
                      className="mt-1 w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-xs text-dharma-text focus:border-saffron-500 focus:outline-none"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dharma-text mb-1">
                    UTC Offset Hours (-12 to +14) *
                    <input
                      type="number"
                      step="0.25"
                      required
                      value={customUtcOffset}
                      onChange={(e) => setCustomUtcOffset(e.target.value)}
                      placeholder="e.g. 5.5 for IST"
                      className="mt-1 w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-xs font-mono text-dharma-text focus:border-saffron-500 focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className="focus-ring inline-flex min-h-[44px] items-center rounded-xl border border-dharma-border bg-dharma-card px-4 py-2 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="focus-ring inline-flex min-h-[44px] items-center rounded-xl bg-saffron-700 px-5 py-2 text-xs font-bold text-white shadow hover:bg-saffron-600 transition"
                >
                  Apply Custom Location
                </button>
              </div>
            </form>
          )}

          {/* Active Mathematical Standards */}
          <div className="mt-6 rounded-2xl border border-dharma-border/70 bg-dharma-panel/60 p-4 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
              Calculation Settings Active
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-dharma-muted">Ayanamsha:</span>{' '}
                <span className="font-semibold text-dharma-text">Chitra Paksha (Lahiri)</span>
              </div>
              <div>
                <span className="text-dharma-muted">Reckoning Rule:</span>{' '}
                <span className="font-semibold text-dharma-text">Udaya Tithi (Sunrise)</span>
              </div>
              <div>
                <span className="text-dharma-muted">Ephemeris Basis:</span>{' '}
                <span className="font-semibold text-dharma-text">Drik Ganita (Observational)</span>
              </div>
              <div>
                <span className="text-dharma-muted">Purpose:</span>{' '}
                <span className="font-semibold text-amber-600 dark:text-amber-400">Educational Study</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
