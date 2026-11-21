'use client';

import React from 'react';
import { BookOpen, Compass, ExternalLink, Globe2, HelpCircle, ShieldAlert, Sparkles, X } from 'lucide-react';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataSourceModal({ isOpen, onClose }: DataSourceModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="datasource-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 cursor-default"
        onClick={onClose}
      />
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-dharma-border bg-dharma-card shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dharma-border px-6 py-4 bg-dharma-panel">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 id="datasource-modal-title" className="font-serif text-lg font-bold text-dharma-text">
                <span lang="hi" data-bi="hi">डेटा स्रोत व पंचांग विज्ञान</span><span data-bi="sep"> · </span><span data-bi="en">Data Sources & Methodology</span>
              </h2>
              <p className="text-xs text-dharma-muted">
                Mathematical ephemeris, regional traditions, and educational framing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-dharma-muted hover:bg-dharma-bg hover:text-dharma-text transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm text-dharma-text">
          {/* Section 1: Non-authoritative framing */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Educational Focus vs Authoritative Ritual Calculator</span>
            </div>
            <p className="mt-2 text-xs text-dharma-muted leading-relaxed">
              Dharma Granth Panchang exists to help seekers harmonize daily scriptural readings,
              understand astronomical symbolism in the Puranas and Epics, and maintain seasonal
              mindfulness.
            </p>
            <p className="mt-2 text-xs text-dharma-muted leading-relaxed font-semibold">
              It is NOT intended as a sacramental manual for temple pratishthas, marriage muhurtas,
              or strict karmakanda rites. For life-cycle ceremonies (Samskaras), consult your family
              pandit or established regional almanac.
            </p>
          </div>

          {/* Section 2: Mathematical Ephemeris */}
          <div>
            <h3 className="font-serif text-base font-bold text-dharma-text flex items-center gap-2">
              <Compass className="h-4 w-4 text-saffron-600" />
              <span>1. Astronomical Algorithms (Drik Ganita)</span>
            </h3>
            <p className="mt-2 text-dharma-muted leading-relaxed">
              We employ observational planetary algorithms (Drik Siddhanta) derived from classical
              celestial mechanics (Jean Meeus and VSOP87 orbital formulations). These model:
            </p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-dharma-muted">
              <li>
                <strong>Solar Longitude:</strong> Accounts for Earth&apos;s elliptical orbital eccentricity,
                perihelion, and equation of center.
              </li>
              <li>
                <strong>Lunar Longitude:</strong> Incorporates primary perturbations including Evection (1.27°),
                Variation (0.66°), Annual Equation (-0.18°), and Equation of Center (6.29°).
              </li>
              <li>
                <strong>Chitra Paksha (Lahiri) Ayanamsha:</strong> Applied to convert Tropical (Sayana)
                equatorial positions into the Sidereal (Nirayana) Vedic zodiac.
              </li>
            </ul>
          </div>

          {/* Section 3: Surya Siddhanta vs Drik Siddhanta */}
          <div>
            <h3 className="font-serif text-base font-bold text-dharma-text flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>2. Surya Siddhanta vs Drik Siddhanta</span>
            </h3>
            <p className="mt-2 text-dharma-muted leading-relaxed">
              Traditional Indian astronomy contains two primary computational schools:
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-dharma-border bg-dharma-panel p-3">
                <span className="font-bold text-xs text-dharma-text">Surya Siddhanta (Traditional)</span>
                <p className="mt-1 text-xs text-dharma-muted leading-relaxed">
                  Historical algorithms from ancient medieval texts using mean motion constants without
                  microscopic planetary perturbations. Used by several heritage pandits in Kashi and Bengal.
                </p>
              </div>
              <div className="rounded-xl border border-dharma-border bg-dharma-panel p-3">
                <span className="font-bold text-xs text-dharma-text">Drik Siddhanta (Observational)</span>
                <p className="mt-1 text-xs text-dharma-muted leading-relaxed">
                  Adopted by the Indian Calendar Reform Committee (1952) and Indian Astronomical Ephemeris.
                  Matches what telescopes actually observe in the night sky. Dharma Granth follows this model.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Regional Traditions */}
          <div>
            <h3 className="font-serif text-base font-bold text-dharma-text flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-emerald-600" />
              <span>3. Regional Month-End Conventions</span>
            </h3>
            <p className="mt-2 text-dharma-muted leading-relaxed">
              A major reason two printed Hindu calendars differ on the name of the current month is
              the regional month convention:
            </p>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-dharma-border bg-dharma-bg p-3">
                <strong className="text-dharma-text">Pūrṇimānta (पूर्णिमान्त):</strong> Common in Uttar Pradesh,
                Bihar, Rajasthan, Madhya Pradesh, and Punjab. The lunar month ends on the Full Moon (Purnima);
                Krishna Paksha begins the new month.
              </div>
              <div className="rounded-xl border border-dharma-border bg-dharma-bg p-3">
                <strong className="text-dharma-text">Amānta (अमान्त):</strong> Common in Maharashtra, Gujarat,
                Karnataka, Andhra Pradesh, and Tamil Nadu. The lunar month ends on the New Moon (Amavasya);
                Shukla Paksha begins the new month.
              </div>
              <div className="rounded-xl border border-dharma-border bg-dharma-bg p-3">
                <strong className="text-dharma-text">Solar Months (Saura Māna):</strong> In Bengal, Odisha, Assam,
                Tamil Nadu, and Kerala, dates are reckoned according to the Sun&apos;s ingress into sidereal
                rashi signs (Sankrantis).
              </div>
            </div>
          </div>

          {/* Section 5: The 5 Limbs definition */}
          <div>
            <h3 className="font-serif text-base font-bold text-dharma-text flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-purple-600" />
              <span>4. What Are the 5 Limbs (Pancha-Angas)?</span>
            </h3>
            <p className="mt-2 text-dharma-muted leading-relaxed">
              The word <em>Pañcāṅga</em> literally signifies &ldquo;five limbs&rdquo;, representing five
              cosmic relationships between Surya (Prana/Vital Spirit) and Chandra (Manas/Mind):
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-dharma-panel p-2.5">
                <strong>1. Tithi (तिथि):</strong> Phase angle. Each 12° departure of the Moon from the Sun.
              </div>
              <div className="rounded-lg bg-dharma-panel p-2.5">
                <strong>2. Vāra (वार):</strong> Solar day of the week, ruled by the governing planet of sunrise.
              </div>
              <div className="rounded-lg bg-dharma-panel p-2.5">
                <strong>3. Nakṣatra (नक्षत्र):</strong> Moon&apos;s current sidereal asterism out of 27 lunar mansions (13°20&apos; each).
              </div>
              <div className="rounded-lg bg-dharma-panel p-2.5">
                <strong>4. Yoga (योग):</strong> Combined angular sum of Sun and Moon (Surya + Chandra), partitioned into 27 segments.
              </div>
              <div className="rounded-lg bg-dharma-panel p-2.5">
                <strong>5. Karaṇa (करण):</strong> Half of a Tithi (6° elongation), defining the day&apos;s tactical temperament.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-dharma-border px-6 py-4 bg-dharma-panel flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-saffron-700 px-5 py-2 text-xs font-bold text-white shadow hover:bg-saffron-600 transition"
          >
            Understood · Close
          </button>
        </div>
      </div>
    </div>
  );
}
