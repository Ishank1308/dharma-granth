'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Mountain, Waves, TreePalm, Building2, Compass, Sparkles } from 'lucide-react';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { sacredLocations, locationTypes, type SacredLocation, type LocationType } from '@/data/locations';

const typeIcons: Record<LocationType, React.ReactNode> = {
  city: <Building2 className="w-4 h-4" />,
  river: <Waves className="w-4 h-4" />,
  forest: <TreePalm className="w-4 h-4" />,
  mountain: <Mountain className="w-4 h-4" />,
  pilgrimage: <Compass className="w-4 h-4" />,
  cosmological: <Sparkles className="w-4 h-4" />,
};

export default function LocationsPage() {
  const [selectedType, setSelectedType] = useState<LocationType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<SacredLocation | null>(null);

  const filteredLocations =
    selectedType === 'all'
      ? sacredLocations
      : sacredLocations.filter((l) => l.type === selectedType);

  // Map projection: India bounds roughly lat 6-37, lng 68-89
  // We'll map to a 0-100% coordinate system
  const projectX = (lng: number) => ((lng - 68) / (89 - 68)) * 100;
  const projectY = (lat: number) => ((37 - lat) / (37 - 6)) * 100;

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 text-white py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              तीर्थमानचित्र — Sacred Geography
            </p>
            <h1 className="font-serif text-[clamp(1.9rem,calc(1.45rem+2.3vw),3rem)] leading-tight font-bold mb-4 [overflow-wrap:anywhere]">
              पवित्र स्थान मानचित्र (Sacred Geography)
            </h1>
            <p className="text-base sm:text-lg leading-relaxed opacity-90 max-w-2xl">
              शास्त्रों के पवित्र भौगोलिक स्थानों का अन्वेषण करें — अयोध्या से कैलास तक, गंगा से सरस्वती तक। प्रत्येक स्थान को स्पष्ट रूप से पारंपरिक, वर्तमान, विवादित, और प्रतीकात्मक/ब्रह्मांडीय पहचान के साथ वर्गीकृत किया गया है।
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        {/* ── Filter Bar ──────────────────────────────────────────── */}
        <FadeUp>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                  : 'bg-dharma-card text-dharma-text border border-dharma-border hover:border-teal-300'
              }`}
            >
              सभी ({sacredLocations.length})
            </button>
            {locationTypes.map((type) => {
              const count = sacredLocations.filter((l) => l.type === type.key).length;
              if (count === 0) return null;
              return (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    selectedType === type.key
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                      : 'bg-dharma-card text-dharma-text border border-dharma-border hover:border-teal-300'
                  }`}
                >
                  {typeIcons[type.key]}
                  {type.label} ({count})
                </button>
              );
            })}
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Map ───────────────────────────────────────────────── */}
          <FadeUp className="lg:col-span-2">
            <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600" />
              <div className="p-4">
                <p id="sacred-map-note" lang="hi" className="mb-3 text-sm leading-relaxed text-dharma-muted">
                  सांकेतिक मानचित्र — भारत का यह सरल चित्र भौगोलिक सीमा या वास्तविक दूरी दर्शाने वाला सटीक मानचित्र नहीं है। नीचे दी गई स्थान-सूची से भी सभी विवरण उपलब्ध हैं।
                </p>
                <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-teal-50 to-cyan-50 rounded-xl overflow-hidden border border-dharma-border">
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
                      fill="rgba(20,184,166,0.08)"
                      stroke="rgba(20,184,166,0.3)"
                      strokeWidth="0.5"
                    />
                    {/* Himalayas line */}
                    <path
                      d="M 25 12 L 35 10 L 45 8 L 55 10 L 65 14 L 70 18"
                      fill="none"
                      stroke="rgba(120,113,108,0.4)"
                      strokeWidth="0.5"
                      strokeDasharray="2,1"
                    />
                    <text x="50" y="8" fontSize="2" fill="rgba(120,113,108,0.6)" textAnchor="middle">
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
                          className="cursor-pointer focus:outline-none focus-visible:[&>circle]:stroke-amber-800 focus-visible:[&>circle]:stroke-[1.5px]"
                        >
                          <circle cx={x} cy={y} r="5" fill={isSelected ? 'rgba(20,184,166,0.12)' : 'transparent'} aria-hidden="true" />
                          <circle
                            cx={x}
                            cy={y}
                            r={isSelected ? 2 : 1.2}
                            fill={isSelected ? '#0d9488' : '#14b8a6'}
                            stroke="white"
                            strokeWidth="0.3"
                          />
                          {isSelected && (
                            <text x={x} y={y - 3} fontSize="2.5" fill="#0f766e" textAnchor="middle" fontWeight="bold">
                              {loc.name}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Legend overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-dharma-muted">
                    <p className="font-bold mb-1">मानचित्र संकेत</p>
                    <p>● स्थान चुनने के लिए मानचित्र के चिह्न पर टैप करें या Enter दबाएँ</p>
                    <p>● ब्रह्मांडीय स्थान मानचित्र पर नहीं</p>
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
              <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden h-full">
                <div className="h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600" />
                <div className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <MapPin className="w-12 h-12 text-teal-400 mb-4" />
                  <p className="text-dharma-muted">
                    विवरण देखने के लिए मानचित्र पर स्थान का चिह्न चुनें या नीचे दी गई सूची से स्थान चुनें।
                  </p>
                </div>
              </div>
            )}
          </FadeUp>
        </div>

        {/* ── Location Cards Grid ─────────────────────────────────── */}
        <FadeUpOnView className="mt-8">
          <h2 className="text-lg font-serif font-bold text-dharma-text mb-4">
            सभी स्थान ({filteredLocations.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className="group text-left rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:shadow-xl hover:border-teal-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${loc.gradient} flex items-center justify-center text-xl shadow-md`}>
                    {loc.icon}
                  </div>
                  <p lang="sa" className="font-devanagari text-base text-saffron-600 opacity-80">
                    {loc.sanskrit}
                  </p>
                </div>
                <h3 className="font-serif font-bold text-dharma-text group-hover:text-teal-700 transition mb-1">
                  {loc.name}
                </h3>
                <p className="text-sm text-dharma-muted leading-relaxed mb-3">
                  {loc.shortDesc}
                </p>
                <div className="flex items-center gap-2 text-xs text-dharma-muted">
                  <MapPin className="w-3 h-3" />
                  <span>{loc.presentDayLocation}</span>
                </div>
              </button>
            ))}
          </div>
        </FadeUpOnView>
      </section>
    </main>
  );
}

function LocationDetail({ location }: { location: SacredLocation }) {
  return (
    <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-r ${location.gradient}`} />
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${location.gradient} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
            {location.icon}
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-dharma-text">{location.name}</h2>
            <p lang="sa" className="font-devanagari text-sm text-saffron-600">{location.sanskrit}</p>
          </div>
        </div>

        <p className="text-sm text-dharma-muted leading-relaxed mb-4">
          {location.description}
        </p>

        {/* Significance */}
        <div className="mb-4 rounded-xl bg-teal-50 border border-teal-200 p-3">
          <p className="text-xs font-bold text-teal-700 uppercase mb-1">महत्व (Significance)</p>
          <p className="text-sm text-dharma-text">{location.significance}</p>
        </div>

        {/* Associations */}
        <div className="mb-4">
          <p className="text-xs font-bold text-dharma-muted uppercase mb-2">संबंध (Associations)</p>
          <div className="flex flex-wrap gap-2">
            {location.associations.map((assoc) => (
              <span key={assoc} className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-semibold border border-teal-200">
                {assoc}
              </span>
            ))}
          </div>
        </div>

        {/* Identifications */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-dharma-muted uppercase">स्थान पहचान (Location Identification)</p>

          <div className="rounded-xl border border-saffron-200 bg-saffron-50 p-3">
            <p className="text-xs font-bold text-saffron-700 uppercase mb-1">पारंपरिक (Traditional)</p>
            <p className="text-sm text-dharma-text leading-relaxed">{location.identifications.traditional}</p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-bold text-emerald-700 uppercase mb-1">वर्तमान (Present Day)</p>
            <p className="text-sm text-dharma-text leading-relaxed">{location.identifications.presentDay}</p>
          </div>

          {location.identifications.debated && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-bold text-amber-700 uppercase mb-1">विवादित (Debated)</p>
              <p className="text-sm text-dharma-text leading-relaxed">{location.identifications.debated}</p>
            </div>
          )}

          {location.identifications.symbolic && (
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
              <p className="text-xs font-bold text-violet-700 uppercase mb-1">प्रतीकात्मक / ब्रह्मांडीय (Symbolic / Cosmological)</p>
              <p className="text-sm text-dharma-text leading-relaxed">{location.identifications.symbolic}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
