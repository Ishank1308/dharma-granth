'use client';

import { useState } from 'react';
import { MapPin, Mountain, Waves, TreePalm, Building2, Compass, Sparkles, Route } from 'lucide-react';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { PageHeader } from '@/app/components/apple/PageHeader';
import { PageCover } from '@/app/components/PagePhoto';
import { sacredLocations, locationTypes, type SacredLocation, type LocationType } from '@/data/locations';

const typeIcons: Record<LocationType, React.ReactNode> = {
  city: <Building2 className="w-4 h-4" aria-hidden="true" />,
  river: <Waves className="w-4 h-4" aria-hidden="true" />,
  forest: <TreePalm className="w-4 h-4" aria-hidden="true" />,
  mountain: <Mountain className="w-4 h-4" aria-hidden="true" />,
  pilgrimage: <Compass className="w-4 h-4" aria-hidden="true" />,
  cosmological: <Sparkles className="w-4 h-4" aria-hidden="true" />,
};

type YatraCircuitId = 'all' | 'ramayana' | 'mahabharata' | 'rivers';

interface YatraCircuit {
  id: YatraCircuitId;
  hi: string;
  en: string;
  noteHi: string;
  stopIds: string[];
  tone: 'gold' | 'teal';
}

const YATRA_CIRCUITS: YatraCircuit[] = [
  {
    id: 'all',
    hi: 'सभी चिह्न',
    en: 'All Markers',
    noteHi: 'समस्त शास्त्रीय नगर, पर्वत, वन, तीर्थ और पवित्र नदियाँ',
    stopIds: [],
    tone: 'teal',
  },
  {
    id: 'ramayana',
    hi: 'श्रीराम वनगमन पथ',
    en: 'Ramayana Path',
    noteHi: 'अयोध्या व सरयू से प्रयाग और दण्डकारण्य होते हुए रामेश्वरम् तक का क्रम',
    stopIds: ['ayodhya', 'sarayu', 'prayaga', 'dandakaranya', 'rameshvaram'],
    tone: 'gold',
  },
  {
    id: 'mahabharata',
    hi: 'महाभारत तीर्थ',
    en: 'Mahabharata',
    noteHi: 'मथुरा-वृन्दावन और द्वारका से कुरुक्षेत्र, नैमिषारण्य और बदरीनाथ तक',
    stopIds: ['mathura', 'vrindavan', 'dwaraka', 'kurukshetra', 'naimisha', 'badarinatha'],
    tone: 'gold',
  },
  {
    id: 'rivers',
    hi: 'पवित्र नदियाँ',
    en: 'Sacred Rivers',
    noteHi: 'सप्तसिन्धु व त्रिवेणी प्रवाह — गंगा, यमुना, सरस्वती, सरयू, नर्मदा, गोदावरी, कावेरी और सिन्धु',
    stopIds: ['saraswati', 'yamuna', 'prayaga', 'ganga', 'sarayu'],
    tone: 'teal',
  },
];

// Schematic river courses projected into viewBox="0 0 100 125"
const SCHEMATIC_RIVERS: {
  id: string;
  labelHi: string;
  d: string;
  labelX: number;
  labelY: number;
}[] = [
  {
    id: 'sindhu',
    labelHi: 'सिन्धु',
    d: 'M 53.8 27.8 C 46.5 20.4, 39.2 15.2, 33.2 14.5 C 26.8 18.8, 20.4 30.2, 14.8 41.2 C 12.4 46.2, 11.2 49.8, 10.4 52.5',
    labelX: 19.5,
    labelY: 31.2,
  },
  {
    id: 'ganga',
    labelHi: 'गंगा',
    d: 'M 47.8 28.8 C 44.5 32.8, 46.8 39.5, 56.0 47.5 C 60.2 48.2, 65.8 46.8, 72.4 49.4 C 76.2 51.8, 77.4 56.2, 78.0 60.0',
    labelX: 64.5,
    labelY: 45.2,
  },
  {
    id: 'yamuna',
    labelHi: 'यमुना',
    d: 'M 44.8 28.6 C 41.2 33.4, 41.6 38.6, 42.5 40.5 C 45.2 44.6, 50.4 46.8, 56.0 47.5',
    labelX: 46.2,
    labelY: 47.2,
  },
  {
    id: 'narmada',
    labelHi: 'नर्मदा',
    d: 'M 55.6 57.0 C 48.0 56.4, 38.8 57.6, 26.6 60.3',
    labelX: 41.2,
    labelY: 55.6,
  },
  {
    id: 'godavari',
    labelHi: 'गोदावरी',
    d: 'M 29.2 66.4 C 38.4 68.2, 48.6 71.2, 57.2 77.8',
    labelX: 42.2,
    labelY: 67.6,
  },
  {
    id: 'kaveri',
    labelHi: 'कावेरी',
    d: 'M 35.5 92.2 C 40.2 91.8, 45.0 95.8, 49.6 96.8',
    labelX: 42.8,
    labelY: 94.8,
  },
];

// Gentle visual offsets (in SVG viewBox units) so co-located tirthas remain individually tappable
const MARKER_OFFSETS: Record<string, [number, number]> = {
  mathura: [0, 1.0],
  vrindavan: [1.3, -1.5],
  yamuna: [-2.1, -0.5],
  ayodhya: [-1.1, 0.5],
  sarayu: [1.8, -1.2],
  prayaga: [-0.6, 0.4],
  kashi: [0.8, -0.3],
};

// Map projection: Bharatavarsha schematic bounds (lat 6°N–37°N, lng 67°E–93°E)
// Mapped into viewBox="0 0 100 125"
const projectBaseX = (lng: number) => 8 + ((lng - 67) / (93 - 67)) * 84;
const projectBaseY = (lat: number) => 8 + ((37 - lat) / (37 - 6)) * 106;

function getMarkerPoint(loc: SacredLocation): { x: number; y: number } {
  const [dx, dy] = MARKER_OFFSETS[loc.id] ?? [0, 0];
  return {
    x: Number((projectBaseX(loc.coordinates.lng) + dx).toFixed(2)),
    y: Number((projectBaseY(loc.coordinates.lat) + dy).toFixed(2)),
  };
}

function buildArcPath(p1: { x: number; y: number }, p2: { x: number; y: number }, index: number): string {
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.hypot(dx, dy) || 1;
  const bend = Math.min(6.5, dist * 0.22) * (index % 2 === 0 ? 1 : -1);
  const cx = Number((mx - (dy / dist) * bend).toFixed(2));
  const cy = Number((my + (dx / dist) * bend).toFixed(2));
  return `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
}

export default function LocationsPage() {
  const [selectedType, setSelectedType] = useState<LocationType | 'all'>('all');
  const [activeYatra, setActiveYatra] = useState<YatraCircuitId>('all');
  const [selectedLocation, setSelectedLocation] = useState<SacredLocation | null>(null);

  const filteredLocations =
    selectedType === 'all'
      ? sacredLocations
      : sacredLocations.filter((l) => l.type === selectedType);

  const currentCircuit = YATRA_CIRCUITS.find((c) => c.id === activeYatra) ?? YATRA_CIRCUITS[0];
  const circuitStopSet = new Set(currentCircuit.stopIds);

  const orderedCircuitLocations = currentCircuit.stopIds
    .map((id) => sacredLocations.find((l) => l.id === id))
    .filter((l): l is SacredLocation => Boolean(l));

  // Tour stepper sequence: active Yatra stops when a circuit is chosen, else mappable filtered locations (fallback to all filtered if cosmological)
  const mappableFiltered = filteredLocations.filter(
    (l) => l.coordinates.lat !== 0 || l.coordinates.lng !== 0,
  );
  const tourLocations =
    activeYatra !== 'all' && orderedCircuitLocations.length > 0
      ? orderedCircuitLocations
      : mappableFiltered.length > 0
        ? mappableFiltered
        : filteredLocations;

  const activeTourIndex = selectedLocation
    ? tourLocations.findIndex((l) => l.id === selectedLocation.id)
    : -1;

  const handleSelectYatra = (yatraId: YatraCircuitId) => {
    setActiveYatra(yatraId);
    if (yatraId !== 'all') {
      const circuit = YATRA_CIRCUITS.find((c) => c.id === yatraId);
      if (selectedType !== 'all') {
        setSelectedType('all');
      }
      if (circuit && circuit.stopIds.length > 0) {
        const keepCurrent = selectedLocation && circuit.stopIds.includes(selectedLocation.id);
        if (!keepCurrent) {
          const firstStop = sacredLocations.find((l) => l.id === circuit.stopIds[0]);
          if (firstStop) setSelectedLocation(firstStop);
        }
      }
    }
  };

  const stepTour = (delta: -1 | 1) => {
    if (tourLocations.length === 0) return;
    if (activeTourIndex === -1) {
      const targetIndex = delta > 0 ? 0 : tourLocations.length - 1;
      setSelectedLocation(tourLocations[targetIndex]);
      return;
    }
    const nextIndex = (activeTourIndex + delta + tourLocations.length) % tourLocations.length;
    setSelectedLocation(tourLocations[nextIndex]);
  };

  return (
    <main className="apple-scope min-h-screen bg-dharma-bg">
      {/* ── Editorial PageHeader (Tokenized for Sandhya Light & Ratri Dark) ── */}
      <PageHeader
        width="wide"
        eyebrow="Sacred Geography"
        eyebrowHi="तीर्थमानचित्र"
        title="Sacred Geography"
        titleHi="पवित्र स्थान मानचित्र"
        cover={<PageCover photo="kailash" />}
        lead={
          <p lang="hi" className="font-devanagari">
            शास्त्रों के पवित्र भौगोलिक स्थानों का अन्वेषण करें — अयोध्या से कैलास तक, गंगा से सरस्वती तक। प्रत्येक स्थान को स्पष्ट रूप से पारंपरिक, वर्तमान, विवादित, और प्रतीकात्मक/ब्रह्मांडीय पहचान के साथ वर्गीकृत किया गया है।
          </p>
        }
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-gutter pt-8 pb-20 relative z-10">
        {/* ── Filter Bar ──────────────────────────────────────────── */}
        <FadeUp>
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="स्थान श्रेणी फ़िल्टर · Location type filter">
            <button
              type="button"
              aria-pressed={selectedType === 'all'}
              onClick={() => setSelectedType('all')}
              className={`focus-ring inline-flex min-h-[44px] items-center rounded-xl px-4 py-2 text-sm font-semibold transition ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-teal-700 to-cyan-700 text-white shadow-sm'
                  : 'bg-dharma-card/85 text-dharma-text border border-dharma-border hover:border-teal-500/50'
              }`}
            >
              सभी ({sacredLocations.length})
            </button>
            {locationTypes.map((type) => {
              const count = sacredLocations.filter((l) => l.type === type.key).length;
              if (count === 0) return null;
              const active = selectedType === type.key;
              return (
                <button
                  key={type.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedType(type.key);
                    if (activeYatra !== 'all') {
                      setActiveYatra('all');
                    }
                  }}
                  className={`focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-gradient-to-r from-teal-700 to-cyan-700 text-white shadow-sm'
                      : 'bg-dharma-card/85 text-dharma-text border border-dharma-border hover:border-teal-500/50'
                  }`}
                >
                  {typeIcons[type.key]}
                  <span>{type.label} ({count})</span>
                </button>
              );
            })}
          </div>
        </FadeUp>

        {/* ── Interactive Yatra Path Overlay Pills ────────────────── */}
        <FadeUp>
          <div className="mb-6 rounded-2xl border border-dharma-border/80 bg-dharma-card/85 p-3.5 sm:p-4 shadow-hairline">
            <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-dharma-muted">
              <Route className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
              <span>
                <span lang="hi" data-bi="hi" className="font-devanagari">यात्रा-पथ मानचित्र पटल</span>
                <span data-bi="sep" aria-hidden="true"> · </span>
                <span data-bi="en">Yatra Circuit Overlays</span>
              </span>
            </div>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="यात्रा पथ चयन · Sacred Yatra path overlays"
            >
              {YATRA_CIRCUITS.map((circuit) => {
                const active = activeYatra === circuit.id;
                const activeClass =
                  circuit.tone === 'gold'
                    ? 'bg-saffron-700 text-white border-saffron-700 shadow-sm'
                    : 'bg-gradient-to-r from-teal-700 to-cyan-700 text-white border-teal-700 shadow-sm';
                return (
                  <button
                    key={circuit.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleSelectYatra(circuit.id)}
                    className={`focus-ring inline-flex min-h-[44px] max-w-full items-center gap-1.5 rounded-xl border px-3.5 py-2 text-left text-xs sm:text-sm font-semibold transition ${
                      active
                        ? activeClass
                        : 'bg-dharma-bg/70 text-dharma-text border-dharma-border hover:border-teal-500/60'
                    }`}
                  >
                    <span lang="hi" data-bi="hi" className="font-devanagari">{circuit.hi}</span>
                    <span data-bi="sep" aria-hidden="true"> · </span>
                    <span data-bi="en">{circuit.en}</span>
                  </button>
                );
              })}
            </div>
            <p lang="hi" className="mt-2.5 font-devanagari text-xs text-dharma-muted leading-relaxed">
              {currentCircuit.noteHi}
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Map ───────────────────────────────────────────────── */}
          <FadeUp className="lg:col-span-2 min-w-0">
            <div className="card-sacred rounded-card border border-dharma-border/80 bg-dharma-card shadow-raised overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-500 via-cyan-600 to-saffron-500" />
              <div className="p-4 sm:p-5">
                <p id="sacred-map-note" lang="hi" className="mb-3 font-devanagari text-sm leading-relaxed text-dharma-muted">
                  सांकेतिक मानचित्र — भारत का यह सरल चित्र भौगोलिक सीमा या वास्तविक दूरी दर्शाने वाला सटीक मानचित्र नहीं है। नीचे दी गई स्थान-सूची से भी सभी विवरण उपलब्ध हैं।
                </p>

                {/* ── Interactive Tirtha Tour Stepper Bar ─────────── */}
                <div
                  role="group"
                  aria-label="तीर्थ भ्रमण नियंत्रण · Tirtha tour controls"
                  className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dharma-border/80 bg-dharma-bg/65 px-3 py-2"
                >
                  <div className="min-w-0 flex items-center gap-2 text-xs sm:text-sm">
                    <Compass className="w-4 h-4 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                    <span className="truncate font-semibold text-dharma-text">
                      {selectedLocation ? (
                        <>
                          <span lang="sa" className="font-devanagari text-dharma-saffron mr-1.5">
                            {selectedLocation.sanskrit}
                          </span>
                          <span>{selectedLocation.name}</span>
                        </>
                      ) : (
                        <>
                          <span lang="hi" data-bi="hi" className="font-devanagari">तीर्थ भ्रमण क्रम</span>
                          <span data-bi="sep" aria-hidden="true"> · </span>
                          <span data-bi="en">Tirtha Tour</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => stepTour(-1)}
                      disabled={tourLocations.length === 0}
                      aria-label="पिछला तीर्थ स्थान · Previous sacred location"
                      className="focus-ring inline-flex min-h-[44px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-card px-3 py-1.5 text-xs sm:text-sm font-semibold text-dharma-text hover:border-teal-500/60 disabled:opacity-40 transition"
                    >
                      <span aria-hidden="true" className="mr-1">◀</span>
                      <span lang="hi" data-bi="hi" className="font-devanagari">पिछला</span>
                      <span data-bi="en-only">Prev</span>
                    </button>

                    <span
                      aria-live="polite"
                      className="tabular-nums min-w-[3.5rem] text-center text-xs sm:text-sm font-bold text-dharma-text px-1"
                    >
                      {activeTourIndex >= 0 ? activeTourIndex + 1 : 0} / {tourLocations.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => stepTour(1)}
                      disabled={tourLocations.length === 0}
                      aria-label="अगला तीर्थ स्थान · Next sacred location"
                      className="focus-ring inline-flex min-h-[44px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-card px-3 py-1.5 text-xs sm:text-sm font-semibold text-dharma-text hover:border-teal-500/60 disabled:opacity-40 transition"
                    >
                      <span lang="hi" data-bi="hi" className="font-devanagari">अगला</span>
                      <span data-bi="en-only">Next</span>
                      <span aria-hidden="true" className="ml-1">▶</span>
                    </button>
                  </div>
                </div>

                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-dharma-border/80 bg-gradient-to-b from-teal-500/[0.08] via-dharma-bg/65 to-cyan-500/[0.14] dark:from-teal-950/45 dark:via-stone-950/80 dark:to-cyan-950/50">
                  {/* Schematic Bharatavarsha SVG Atlas */}
                  <svg
                    viewBox="0 0 100 125"
                    role="group"
                    aria-label="सांकेतिक तीर्थ स्थान मानचित्र"
                    aria-describedby="sacred-map-note"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="bharat-land-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(20,184,166,0.18)" />
                        <stop offset="55%" stopColor="rgba(13,148,136,0.11)" />
                        <stop offset="100%" stopColor="rgba(6,182,212,0.16)" />
                      </linearGradient>
                    </defs>

                    {/* Subtle graticule lines */}
                    <g aria-hidden="true" className="pointer-events-none">
                      {[30, 23.5, 16, 10].map((lat) => {
                        const gy = Number(projectBaseY(lat).toFixed(2));
                        const isTropic = lat === 23.5;
                        return (
                          <g key={`lat-${lat}`}>
                            <line
                              x1="4"
                              y1={gy}
                              x2="96"
                              y2={gy}
                              stroke="rgba(148,163,184,0.22)"
                              strokeWidth={isTropic ? '0.32' : '0.22'}
                              strokeDasharray={isTropic ? '1.6,1.2' : '0.8,1.6'}
                            />
                            <text
                              x="5.2"
                              y={gy - 0.8}
                              fontSize="1.65"
                              className="fill-dharma-muted opacity-65"
                            >
                              {lat}°N
                            </text>
                          </g>
                        );
                      })}
                      {[72, 78, 84, 90].map((lng) => {
                        const gx = Number(projectBaseX(lng).toFixed(2));
                        return (
                          <g key={`lng-${lng}`}>
                            <line
                              x1={gx}
                              y1="6"
                              x2={gx}
                              y2="118"
                              stroke="rgba(148,163,184,0.18)"
                              strokeWidth="0.22"
                              strokeDasharray="0.8,1.6"
                            />
                            <text
                              x={gx + 0.6}
                              y="117"
                              fontSize="1.65"
                              className="fill-dharma-muted opacity-65"
                            >
                              {lng}°E
                            </text>
                          </g>
                        );
                      })}
                    </g>

                    {/* Refined schematic Bharatavarsha silhouette + Lanka + Rama Setu */}
                    <g aria-hidden="true" className="pointer-events-none">
                      <path
                        d="M 32.6 9.4 C 37.8 9.0, 42.4 10.6, 45.2 13.5 C 46.4 17.2, 45.8 20.6, 46.8 23.7 C 48.4 26.8, 49.8 28.5, 51.3 29.9 C 56.2 33.4, 60.2 35.8, 63.6 37.1 C 68.5 38.6, 72.8 39.2, 76.5 39.5 C 79.8 39.4, 82.0 39.2, 83.9 39.1 C 87.2 38.4, 89.4 37.8, 90.7 38.1 C 91.6 41.2, 90.8 46.4, 89.4 50.4 C 86.2 50.2, 82.8 49.0, 79.7 48.3 C 79.2 52.8, 79.0 56.8, 78.4 60.3 C 74.8 62.6, 71.6 64.6, 68.7 66.8 C 64.4 70.6, 60.8 74.2, 57.4 77.8 C 54.6 81.8, 52.4 85.8, 51.0 90.1 C 50.2 93.6, 49.8 96.6, 49.4 99.3 C 49.0 101.0, 48.6 102.0, 48.1 102.8 C 46.4 104.2, 45.0 104.9, 43.9 105.5 C 43.0 106.2, 42.5 106.7, 42.1 106.9 C 40.2 105.0, 38.8 102.4, 37.7 99.6 C 35.0 94.0, 32.6 88.6, 30.6 83.2 C 29.0 78.4, 27.8 73.8, 26.7 69.5 C 26.4 66.2, 26.6 63.2, 26.4 60.3 C 23.8 61.6, 21.2 63.2, 19.0 63.0 C 16.4 62.0, 14.6 60.2, 14.1 58.3 C 15.2 56.8, 16.8 56.6, 18.0 56.2 C 15.8 55.2, 13.8 54.6, 12.8 53.5 C 14.2 49.8, 16.2 46.4, 18.3 42.9 C 22.4 38.2, 26.4 33.8, 30.0 29.2 C 30.8 25.6, 31.0 22.2, 31.6 18.9 C 31.8 15.2, 32.0 11.8, 32.6 9.4 Z"
                        fill="url(#bharat-land-fill)"
                        stroke="rgba(13,148,136,0.52)"
                        strokeWidth="0.55"
                        strokeLinejoin="round"
                      />
                      {/* Schematic Lanka island & Setu */}
                      <path
                        d="M 48.1 102.8 L 50.4 103.6"
                        fill="none"
                        stroke="rgba(217,119,6,0.65)"
                        strokeWidth="0.45"
                        strokeDasharray="0.7,0.6"
                      />
                      <path
                        d="M 50.6 103.8 C 53.0 104.4, 55.0 107.8, 54.5 111.8 C 54.0 114.8, 51.2 115.2, 49.8 112.2 C 49.0 109.4, 49.4 105.6, 50.6 103.8 Z"
                        fill="rgba(20,184,166,0.10)"
                        stroke="rgba(13,148,136,0.42)"
                        strokeWidth="0.45"
                      />

                      {/* Himalayan Range Crest */}
                      <path
                        d="M 33.5 14.2 Q 44.5 20.5 53.5 29.2 Q 66.5 36.2 84.5 37.8"
                        fill="none"
                        stroke="rgba(148,163,184,0.65)"
                        strokeWidth="0.55"
                        strokeDasharray="1.8,1.1"
                      />
                      <text
                        x="60"
                        y="26.2"
                        fontSize="2.1"
                        className="fill-dharma-muted font-devanagari"
                        textAnchor="middle"
                      >
                        हिमालय · Himalayas
                      </text>
                    </g>

                    {/* Schematic Sacred River Courses */}
                    <g aria-hidden="true" className="pointer-events-none">
                      {SCHEMATIC_RIVERS.map((river) => {
                        const riversHighlighted = activeYatra === 'rivers';
                        return (
                          <g key={river.id}>
                            {riversHighlighted && (
                              <path
                                d={river.d}
                                fill="none"
                                stroke="rgba(6,182,212,0.28)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            )}
                            <path
                              d={river.d}
                              fill="none"
                              stroke={riversHighlighted ? 'rgba(8,145,178,0.88)' : 'rgba(13,148,136,0.46)'}
                              strokeWidth={riversHighlighted ? '0.68' : '0.45'}
                              strokeLinecap="round"
                            />
                            <text
                              x={river.labelX}
                              y={river.labelY}
                              fontSize="1.85"
                              textAnchor="middle"
                              className="fill-teal-800 dark:fill-cyan-300 font-devanagari opacity-85"
                            >
                              {river.labelHi}
                            </text>
                          </g>
                        );
                      })}
                      {/* Underground / Vedic Saraswati trace when Sacred Rivers overlay is active */}
                      {activeYatra === 'rivers' && (
                        <path
                          d="M 43.2 29.2 Q 35.4 35.0 23.5 46.8"
                          fill="none"
                          stroke="rgba(14,165,233,0.75)"
                          strokeWidth="0.55"
                          strokeDasharray="1.2,1.0"
                        />
                      )}
                    </g>

                    {/* Active Yatra Circuit Curved Arcs */}
                    {activeYatra !== 'all' && orderedCircuitLocations.length > 1 && (
                      <g aria-hidden="true" className="pointer-events-none">
                        {orderedCircuitLocations.slice(0, -1).map((fromLoc, idx) => {
                          const toLoc = orderedCircuitLocations[idx + 1];
                          const p1 = getMarkerPoint(fromLoc);
                          const p2 = getMarkerPoint(toLoc);
                          const arcD = buildArcPath(p1, p2, idx);
                          const isGold = currentCircuit.tone === 'gold';
                          return (
                            <g key={`arc-${fromLoc.id}-${toLoc.id}`}>
                              <path
                                d={arcD}
                                fill="none"
                                stroke={isGold ? 'rgba(245,158,11,0.26)' : 'rgba(6,182,212,0.26)'}
                                strokeWidth="1.7"
                                strokeLinecap="round"
                              />
                              <path
                                d={arcD}
                                fill="none"
                                stroke={isGold ? '#d97706' : '#0891b2'}
                                strokeWidth="0.65"
                                strokeDasharray="1.8,1.1"
                                strokeLinecap="round"
                              />
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* Location markers */}
                    {filteredLocations.map((loc) => {
                      if (loc.coordinates.lat === 0 && loc.coordinates.lng === 0) return null;
                      const { x, y } = getMarkerPoint(loc);
                      const isSelected = selectedLocation?.id === loc.id;
                      const inCircuit = activeYatra !== 'all' && circuitStopSet.has(loc.id);
                      const circuitOrder = inCircuit ? currentCircuit.stopIds.indexOf(loc.id) + 1 : 0;
                      const dimmed = activeYatra !== 'all' && !inCircuit && !isSelected;

                      // Keep selected badge neatly inside SVG viewBox bounds
                      const badgeWidth = Math.min(34, Math.max(15, loc.name.length * 1.45 + 4));
                      const badgeX = Math.min(98 - badgeWidth / 2, Math.max(2 + badgeWidth / 2, x));
                      const badgeAbove = y > 15;
                      const badgeCenterY = badgeAbove ? y - 6.2 : y + 6.8;

                      return (
                        <g
                          key={loc.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`${loc.name} — स्थान का विवरण खोलें`}
                          onClick={() => setSelectedLocation(loc)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setSelectedLocation(loc);
                            }
                          }}
                          opacity={dimmed ? 0.42 : 1}
                          className="cursor-pointer focus:outline-none focus-visible:[&>circle]:stroke-amber-500 focus-visible:[&>circle]:stroke-[1.5px]"
                        >
                          {/* Invisible generous hit circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r="5.2"
                            fill={isSelected ? 'rgba(20,184,166,0.18)' : 'transparent'}
                            aria-hidden="true"
                          />

                          {/* Concentric aura rings on selected or active Yatra stop */}
                          {isSelected && (
                            <>
                              <circle
                                cx={x}
                                cy={y}
                                r="4.1"
                                fill="none"
                                stroke={inCircuit && currentCircuit.tone === 'gold' ? '#f59e0b' : '#14b8a6'}
                                strokeWidth="0.38"
                                strokeDasharray="1.1,0.8"
                                aria-hidden="true"
                              />
                              <circle
                                cx={x}
                                cy={y}
                                r="2.9"
                                fill="none"
                                stroke={inCircuit && currentCircuit.tone === 'gold' ? 'rgba(245,158,11,0.75)' : 'rgba(20,184,166,0.75)'}
                                strokeWidth="0.32"
                                aria-hidden="true"
                              />
                            </>
                          )}

                          {inCircuit && !isSelected && (
                            <circle
                              cx={x}
                              cy={y}
                              r="2.6"
                              fill={currentCircuit.tone === 'gold' ? 'rgba(245,158,11,0.22)' : 'rgba(6,182,212,0.22)'}
                              stroke={currentCircuit.tone === 'gold' ? '#d97706' : '#0891b2'}
                              strokeWidth="0.35"
                              aria-hidden="true"
                            />
                          )}

                          {/* Core marker jewel */}
                          <circle
                            cx={x}
                            cy={y}
                            r={isSelected ? 2.0 : inCircuit ? 1.65 : 1.3}
                            fill={
                              isSelected
                                ? inCircuit && currentCircuit.tone === 'gold'
                                  ? '#d97706'
                                  : '#0d9488'
                                : inCircuit
                                  ? currentCircuit.tone === 'gold'
                                    ? '#f59e0b'
                                    : '#06b6d4'
                                  : '#2dd4bf'
                            }
                            stroke="rgba(15,23,42,0.65)"
                            strokeWidth="0.32"
                          />

                          {/* Sequence badge on active Yatra circuit stops */}
                          {inCircuit && circuitOrder > 0 && (
                            <g aria-hidden="true" className="pointer-events-none">
                              <circle
                                cx={x + 2.3}
                                cy={y - 2.1}
                                r="1.45"
                                fill={currentCircuit.tone === 'gold' ? '#9a3412' : '#115e59'}
                                stroke="#ffffff"
                                strokeWidth="0.22"
                              />
                              <text
                                x={x + 2.3}
                                y={y - 1.62}
                                fontSize="1.55"
                                fontWeight="bold"
                                textAnchor="middle"
                                fill="#ffffff"
                              >
                                {circuitOrder}
                              </text>
                            </g>
                          )}

                          {/* Clean pill label badge on selected marker */}
                          {isSelected && (
                            <g aria-hidden="true" className="pointer-events-none">
                              <rect
                                x={badgeX - badgeWidth / 2}
                                y={badgeCenterY - 2.2}
                                width={badgeWidth}
                                height="4.2"
                                rx="1.4"
                                fill="rgba(15,23,42,0.88)"
                                stroke={inCircuit && currentCircuit.tone === 'gold' ? '#f59e0b' : '#2dd4bf'}
                                strokeWidth="0.3"
                              />
                              <text
                                x={badgeX}
                                y={badgeCenterY + 0.55}
                                fontSize="2.15"
                                textAnchor="middle"
                                fontWeight="bold"
                                fill="#f8fafc"
                              >
                                {loc.name}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Legend overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:max-w-xs rounded-xl border border-dharma-border/75 bg-dharma-card/90 backdrop-blur-md px-3 py-2 text-xs text-dharma-muted shadow-sm">
                    <p lang="hi" className="font-devanagari font-bold text-dharma-text mb-0.5">मानचित्र संकेत</p>
                    <p lang="hi" className="font-devanagari">● स्थान चुनने के लिए चिह्न पर टैप करें या Enter दबाएँ</p>
                    <p lang="hi" className="font-devanagari">● ब्रह्मांडीय स्थान (मेरु, वैकुण्ठ) नीचे सूची में उपलब्ध</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* ── Detail Panel ──────────────────────────────────────── */}
          <FadeUp className="min-w-0">
            {selectedLocation ? (
              <LocationDetail location={selectedLocation} />
            ) : (
              <div className="rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl shadow-raised overflow-hidden h-full">
                <div className="h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600" />
                <div className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <MapPin className="w-12 h-12 text-teal-600 dark:text-teal-400 mb-4" aria-hidden="true" />
                  <p lang="hi" className="font-devanagari text-dharma-muted leading-relaxed mb-4">
                    विवरण देखने के लिए मानचित्र पर स्थान का चिह्न चुनें, ऊपर तीर्थ भ्रमण बटन दबाएँ, या नीचे दी गई सूची से स्थान चुनें।
                  </p>
                  <button
                    type="button"
                    onClick={() => stepTour(1)}
                    className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <Compass className="w-4 h-4" aria-hidden="true" />
                    <span lang="hi" data-bi="hi" className="font-devanagari">तीर्थ भ्रमण आरंभ करें</span>
                    <span data-bi="sep" aria-hidden="true"> · </span>
                    <span data-bi="en">Start Tirtha Tour</span>
                  </button>
                </div>
              </div>
            )}
          </FadeUp>
        </div>

        {/* ── Location Cards Grid ─────────────────────────────────── */}
        <FadeUpOnView className="mt-10">
          <h2 lang="hi" className="text-lg font-devanagari font-bold text-dharma-text mb-4">
            सभी स्थान ({filteredLocations.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              const inCircuit = activeYatra !== 'all' && circuitStopSet.has(loc.id);
              const stopNum = inCircuit ? currentCircuit.stopIds.indexOf(loc.id) + 1 : 0;
              return (
                <button
                  key={loc.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedLocation(loc)}
                  className={`focus-ring group text-left rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
                    isSelected
                      ? 'border-teal-500/70 bg-dharma-card shadow-raised ring-1 ring-teal-500/30'
                      : inCircuit
                        ? 'border-saffron-500/50 bg-dharma-card/90 shadow-hairline hover:shadow-raised'
                        : 'border-dharma-border/80 bg-dharma-card/80 hover:shadow-raised hover:border-teal-500/45'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${loc.gradient} flex items-center justify-center text-xl shadow-md shrink-0`}>
                      {loc.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p lang="sa" className="font-devanagari text-base text-dharma-saffron opacity-90">
                        {loc.sanskrit}
                      </p>
                      {stopNum > 0 && (
                        <span className="tabular-nums rounded-full bg-saffron-700 px-2 py-0.5 text-[11px] font-bold text-white">
                          यात्रा #{stopNum}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-dharma-text group-hover:text-teal-700 dark:group-hover:text-teal-300 transition mb-1">
                    {loc.name}
                  </h3>
                  <p className="text-sm text-dharma-muted leading-relaxed mb-3">
                    {loc.shortDesc}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-dharma-muted">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                    <span>{loc.presentDayLocation}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </FadeUpOnView>
      </section>
    </main>
  );
}

function LocationDetail({ location }: { location: SacredLocation }) {
  return (
    <div className="rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl shadow-raised overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-r ${location.gradient}`} />
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${location.gradient} flex items-center justify-center text-2xl shadow-md shrink-0`}>
            {location.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-serif font-bold text-dharma-text break-words">{location.name}</h2>
            <p lang="sa" className="font-devanagari text-sm text-dharma-saffron">{location.sanskrit}</p>
          </div>
        </div>

        <p className="text-sm text-dharma-muted leading-relaxed mb-4">
          {location.description}
        </p>

        {/* Significance */}
        <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-500/[0.08] p-3.5">
          <p className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase mb-1">महत्व (Significance)</p>
          <p className="text-sm text-dharma-text leading-relaxed">{location.significance}</p>
        </div>

        {/* Associations */}
        <div className="mb-4">
          <p className="text-xs font-bold text-dharma-muted uppercase mb-2">संबंध (Associations)</p>
          <div className="flex flex-wrap gap-2">
            {location.associations.map((assoc) => (
              <span
                key={assoc}
                className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-900 dark:text-teal-200"
              >
                {assoc}
              </span>
            ))}
          </div>
        </div>

        {/* Identifications */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-dharma-muted uppercase">स्थान पहचान (Location Identification)</p>

          <div className="rounded-xl border border-dharma-saffron/30 bg-dharma-saffron/[0.08] p-3.5">
            <p className="text-xs font-bold text-dharma-saffron uppercase mb-1">पारंपरिक (Traditional)</p>
            <p className="text-sm text-dharma-text leading-relaxed">{location.identifications.traditional}</p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-3.5">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase mb-1">वर्तमान (Present Day)</p>
            <p className="text-sm text-dharma-text leading-relaxed">{location.identifications.presentDay}</p>
          </div>

          {location.identifications.debated && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] p-3.5">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase mb-1">विवादित (Debated)</p>
              <p className="text-sm text-dharma-text leading-relaxed">{location.identifications.debated}</p>
            </div>
          )}

          {location.identifications.symbolic && (
            <div className="rounded-xl border border-violet-500/30 bg-violet-500/[0.08] p-3.5">
              <p className="text-xs font-bold text-violet-800 dark:text-violet-300 uppercase mb-1">प्रतीकात्मक / ब्रह्मांडीय (Symbolic / Cosmological)</p>
              <p className="text-sm text-dharma-text leading-relaxed">{location.identifications.symbolic}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
