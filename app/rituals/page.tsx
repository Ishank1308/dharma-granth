'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FadeUp } from '@/app/components/motion/primitives';
import { rituals, type Ritual } from '@/data/rituals';
import { X, BookOpen, Sparkles, MapPin, Lightbulb, HandHeart, AlertTriangle, ListChecks } from 'lucide-react';

export default function RitualsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = rituals.find((r) => r.id === selectedId);

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-800 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              मंदिर एवं अनुष्ठान विवरण (Temple & Ritual Explainer)
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              मंदिर एवं अनुष्ठान विवरण (Temple & Ritual Explainer)
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              {rituals.length} प्रमुख हिंदू अनुष्ठानों का विस्तृत विवरण — पूजा, आरती, अभिषेक, दर्शन, प्रसाद, होम, संस्कार, मंदिर वास्तुकला, मूर्ति पूजन, मंत्र, मुद्रा, यंत्र, और परिक्रमा। प्रत्येक का अर्थ, शास्त्रीय आधार, प्रतीकवाद, क्षेत्रीय विविधता, दार्शनिक व्याख्या, व्यावहारिक शिष्टाचार, और दीक्षा/निर्देशन की चेतावनी जहाँ आवश्यक हो।
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Ritual Grid */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rituals.map((ritual, i) => (
            // CSS fade-up (globals.css): plays from the server HTML, so the cards are never shipped hidden.
            <button
              type="button"
              key={ritual.id}
              onClick={() => setSelectedId(ritual.id)}
              style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              className="fade-up-in group relative overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card p-6 text-left hover:shadow-xl transition-all"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${ritual.gradient}`} />
              <div className="flex items-start gap-4 mb-3">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ritual.gradient} flex items-center justify-center text-3xl shrink-0 shadow-md`}>
                  {ritual.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">{ritual.name}</h3>
                  <p className="text-sm text-saffron-700 font-semibold">{ritual.sanskrit}</p>
                </div>
              </div>
              <p className="text-sm text-dharma-muted leading-relaxed mb-3">{ritual.shortDesc}</p>
              {ritual.requiresInitiation && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 mb-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="font-semibold">दीक्षा आवश्यक (Initiation Required)</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-dharma-muted">{ritual.transliteration}</span>
                <span className="font-semibold text-saffron-700 group-hover:translate-x-1 transition-transform">विवरण देखें →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && <RitualDetail ritual={selected} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </main>
  );
}

function RitualDetail({ ritual, onClose }: { ritual: Ritual; onClose: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-dharma-bg rounded-3xl shadow-2xl border border-dharma-border max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative bg-gradient-to-br ${ritual.gradient} text-white p-6 rounded-t-3xl`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{ritual.icon}</div>
            <div>
              <h2 className="text-2xl font-serif font-bold">{ritual.name}</h2>
              <p className="text-lg opacity-90">{ritual.sanskrit}</p>
              <p className="text-sm opacity-80 mt-1">{ritual.transliteration}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Initiation Warning */}
          {ritual.requiresInitiation && ritual.initiationWarning && (
            <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase mb-1">चेतावनी: दीक्षा/निर्देशन आवश्यक (Warning: Initiation Required)</p>
                <p className="text-sm text-amber-900 leading-relaxed">{ritual.initiationWarning}</p>
              </div>
            </div>
          )}

          {/* Meaning */}
          <Section icon={Sparkles} title="अर्थ (Meaning)">
            <p className="text-sm text-dharma-text leading-relaxed">{ritual.meaning}</p>
          </Section>

          {/* Scriptural Basis */}
          <Section icon={BookOpen} title="शास्त्रीय/पारंपरिक आधार (Scriptural or Traditional Basis)">
            <p className="text-sm text-dharma-text leading-relaxed">{ritual.scripturalBasis}</p>
          </Section>

          {/* Symbolism */}
          <Section icon={Lightbulb} title="प्रतीकवाद (Symbolism)">
            <p className="text-sm text-dharma-text leading-relaxed">{ritual.symbolism}</p>
          </Section>

          {/* Regional Variations */}
          <Section icon={MapPin} title="क्षेत्रीय विविधता (Regional Variations)">
            <div className="space-y-3">
              {ritual.regionalVariations.map((rv, i) => (
                <div key={i} className="bg-dharma-card border border-dharma-border rounded-xl p-3">
                  <p className="text-xs font-bold text-saffron-700 mb-1">{rv.region}</p>
                  <p className="text-sm text-dharma-text leading-relaxed">{rv.variation}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Philosophical Interpretation */}
          <Section icon={Sparkles} title="दार्शनिक व्याख्या (Philosophical Interpretation)">
            <p className="text-sm text-dharma-text leading-relaxed">{ritual.philosophicalInterpretation}</p>
          </Section>

          {/* Practical Etiquette */}
          <Section icon={HandHeart} title="व्यावहारिक शिष्टाचार (Practical Etiquette)">
            <ul className="space-y-1.5">
              {ritual.practicalEtiquette.map((item, i) => (
                <li key={i} className="text-sm text-dharma-text flex items-start gap-2">
                  <span className="text-saffron-500 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Steps (if available) */}
          {ritual.steps && ritual.steps.length > 0 && (
            <Section icon={ListChecks} title="विधि चरण (Steps)">
              <ol className="space-y-2">
                {ritual.steps.map((step, i) => (
                  <li key={i} className="text-sm text-dharma-text flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 font-bold text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </Section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof BookOpen; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {title}
      </p>
      {children}
    </div>
  );
}
