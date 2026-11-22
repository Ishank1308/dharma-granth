'use client';

import { useState } from 'react';
import { MapPin, Mountain, Waves, TreePalm, Building2, Compass, Sparkles } from 'lucide-react';
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

export default function LocationsPage() {
  const [selectedType, setSelectedType] = useState<LocationType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<SacredLocation | null>(null);

  const filteredLocations =
    selectedType === 'all'
      ? sacredLocations
      : sacredLocations.filter((l) => l.type === selectedType);

  // Map projection: India bounds roughly lat 6-37, lng 68-89
  // Mapped to a 0-100% coordinate system
  const projectX = (lng: number) => ((lng - 68) / (89 - 68)) * 100;
  const projectY = (lat: number) => ((37 - lat) / (37 - 6)) * 100;

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
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="स्थान श्रेणी फ़िल्टर · Location type filter">
            <button
              type="button"
              aria-pressed={selectedType === 'all'}
              onClick={() => setSelectedType('all')}
              className={`focus-ring inline-flex min-h-[44px] items-center rounded-xl px-4 py-2 text-sm font-semibold transition ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm'
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
                  onClick={() => setSelectedType(type.key)}
                  className={`focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm'
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Map ───────────────────────────────────────────────── */}
          <FadeUp className="lg:col-span-2">
            <div className="rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl shadow-raised overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600" />
              <div className="p-4 sm:p-5">
                <p id="sacred-map-note" lang="hi" className="mb-3 font-devanagari text-sm leading-relaxed text-dharma-muted">
                  सांकेतिक मानचित्र — भारत का यह सरल चित्र भौगोलिक सीमा या वास्तविक दूरी दर्शाने वाला सटीक मानचित्र नहीं है। नीचे दी गई स्थान-सूची से भी सभी विवरण उपलब्ध हैं।
                </p>
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-dharma-border/80 bg-gradient-to-b from-teal-500/[0.08] via-dharma-bg/65 to-cyan-500/[0.12] dark:from-teal-950/45 dark:via-stone-950/75 dark:to-cyan-950/45">
                  {/* Simplified India outline */}
                  <svg
                    viewBox="0 0 100 125"
                    role="group"
                    aria-label="सांकेतिक तीर्थ स्थान मानचित्र"
                    aria-describedby="sacred-map-note"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* India landmass approximation */}
                    <path
                      d="M 30 10 L 45 8 L 55 12 L 65 18 L 70 25 L 72 35 L 68 45 L 65 55 L 60 65 L 55 75 L 50 85 L 48 95 L 52 105 L 50 115 L 45 118 L 40 115 L 38 105 L 35 95 L 32 85 L 28 75 L 25 65 L 22 55 L 20 45 L 22 35 L 25 25 L 28 18 Z"
                      fill="rgba(20,184,166,0.11)"
                      stroke="rgba(20,184,166,0.42)"
                      strokeWidth="0.5"
                    />
                    {/* Himalayas line */}
                    <path
                      d="M 25 12 L 35 10 L 45 8 L 55 10 L 65 14 L 70 18"
                      fill="none"
                      stroke="rgba(148,163,184,0.55)"
                      strokeWidth="0.5"
                      strokeDasharray="2,1"
                    />
                    <text x="50" y="8" fontSize="2" className="fill-dharma-muted" textAnchor="middle">
                      Himalayas
                    </text>

                    {/* Location markers */}
                    {filteredLocations.map((loc) => {
                      if (loc.coordinates.lat === 0 && loc.coordinates.lng === 0) return null;
                      const x = projectX(loc.coordinates.lng);
                      const y = projectY(loc.coordinates.lat);
                      const isSelected = selectedLocation?.id === loc.id;

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
                          className="cursor-pointer focus:outline-none focus-visible:[&>circle]:stroke-amber-500 focus-visible:[&>circle]:stroke-[1.5px]"
                        >
                          <circle cx={x} cy={y} r="5" fill={isSelected ? 'rgba(20,184,166,0.2)' : 'transparent'} aria-hidden="true" />
                          <circle
                            cx={x}
                            cy={y}
                            r={isSelected ? 2 : 1.3}
                            fill={isSelected ? '#14b8a6' : '#2dd4bf'}
                            stroke="rgba(15,23,42,0.55)"
                            strokeWidth="0.3"
                          />
                          {isSelected && (
                            <text
                              x={x}
                              y={y - 3}
                              fontSize="2.5"
                              textAnchor="middle"
                              fontWeight="bold"
                              className="fill-teal-900 dark:fill-teal-200"
                            >
                              {loc.name}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Legend overlay */}
                  <div className="absolute bottom-3 left-3 rounded-xl border border-dharma-border/75 bg-dharma-card/90 backdrop-blur-md px-3.5 py-2.5 text-xs text-dharma-muted shadow-sm">
                    <p lang="hi" className="font-devanagari font-bold text-dharma-text mb-1">मानचित्र संकेत</p>
                    <p lang="hi" className="font-devanagari">● स्थान चुनने के लिए मानचित्र के चिह्न पर टैप करें या Enter दबाएँ</p>
                    <p lang="hi" className="font-devanagari">● ब्रह्मांडीय स्थान मानचित्र पर नहीं</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* ── Detail Panel ──────────────────────────────────────── */}
          <FadeUp>
            {selectedLocation ? (
              <LocationDetail location={selectedLocation} />
            ) : (
              <div className="rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl shadow-raised overflow-hidden h-full">
                <div className="h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600" />
                <div className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <MapPin className="w-12 h-12 text-teal-500 dark:text-teal-400 mb-4" aria-hidden="true" />
                  <p lang="hi" className="font-devanagari text-dharma-muted leading-relaxed">
                    विवरण देखने के लिए मानचित्र पर स्थान का चिह्न चुनें या नीचे दी गई सूची से स्थान चुनें।
                  </p>
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
              return (
                <button
                  key={loc.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedLocation(loc)}
                  className={`focus-ring group text-left rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
                    isSelected
                      ? 'border-teal-500/70 bg-dharma-card shadow-raised ring-1 ring-teal-500/30'
                      : 'border-dharma-border/80 bg-dharma-card/80 hover:shadow-raised hover:border-teal-500/45'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${loc.gradient} flex items-center justify-center text-xl shadow-md`}>
                      {loc.icon}
                    </div>
                    <p lang="sa" className="font-devanagari text-base text-dharma-saffron opacity-90">
                      {loc.sanskrit}
                    </p>
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
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${location.gradient} flex items-center justify-center text-2xl shadow-md shrink-0`}>
            {location.icon}
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-dharma-text">{location.name}</h2>
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
