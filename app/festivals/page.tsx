'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { festivals, type Festival } from '@/data/festivals';
import { X, BookOpen, MapPin, Sparkles, Music, Utensils, Leaf, Clock, AlertCircle } from 'lucide-react';

import Link from 'next/link';
import { PageHeader } from '@/app/components/apple/PageHeader';

export default function FestivalsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = festivals.find((f) => f.id === selectedId);

  return (
    <main className="min-h-screen bg-dharma-bg">
      <PageHeader
        width="wide"
        eyebrow="Festivals"
        eyebrowHi="उत्सव"
        title="Festival Knowledge Centre"
        titleHi="उत्सव ज्ञान केंद्र"
        lead={
          <p lang="hi" className="font-devanagari">
              {festivals.length} प्रमुख त्योहारों का विस्तृत ज्ञान — अर्थ, शास्त्रीय स्रोत, क्षेत्रीय परंपराएँ, संबंधित देवता, पारंपरिक अनुष्ठान, जप और प्रार्थना, भोजन परंपरा, पर्यावरणीय विचार, और शास्त्रीय बनाम सांस्कृतिक रिवाज़ों का भेद।
            </p>
        }
      />

      {/* Festival Grid */}
      <section className="max-w-6xl mx-auto px-6 pt-6 relative z-10 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {festivals.map((festival, i) => (
            // CSS fade-up (globals.css): plays from the server HTML, so the cards are never shipped hidden.
            <div key={festival.id} className="fade-up-in" style={{ animationDelay: `${Math.min(i, 12) * 50}ms` }}>
              <Link
                href={`/festivals/${festival.id}/`}
                className="group block relative overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card p-6 text-left hover:shadow-xl transition-all h-full"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${festival.gradient}`} />
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${festival.gradient} flex items-center justify-center text-3xl shrink-0 shadow-md`}>
                    {festival.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">{festival.name}</h3>
                    <p className="text-sm text-saffron-700 font-semibold">{festival.sanskrit}</p>
                  </div>
                </div>
                <p className="text-sm text-dharma-muted leading-relaxed mb-4">{festival.shortDesc}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-dharma-border/60">
                  <span className="text-dharma-muted">{festival.category}</span>
                  <span className="font-semibold text-saffron-700 group-hover:translate-x-1 transition-transform">
                    पूरा विवरण व मंत्र देखें &rarr;
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && <FestivalDetail festival={selected} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </main>
  );
}

function FestivalDetail({ festival, onClose }: { festival: Festival; onClose: () => void }) {
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
        <div className={`relative bg-gradient-to-br ${festival.gradient} text-white p-6 rounded-t-3xl`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{festival.icon}</div>
            <div>
              <h2 className="text-2xl font-serif font-bold">{festival.name}</h2>
              <p className="text-lg opacity-90">{festival.sanskrit}</p>
              <p className="text-sm opacity-80 mt-1">{festival.category}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Timing */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase mb-1">समय (Timing)</p>
              <p className="text-sm text-dharma-text">{festival.timing}</p>
            </div>
          </div>

          {/* Meaning */}
          <Section icon={Sparkles} title="अर्थ (Meaning)">
            <p className="text-sm text-dharma-text leading-relaxed">{festival.meaning}</p>
          </Section>

          {/* Scriptural References */}
          <Section icon={BookOpen} title="शास्त्रीय स्रोत (Scriptural References)">
            <div className="flex flex-wrap gap-2">
              {festival.scripturalRefs.map((ref) => (
                <span key={ref} className="px-3 py-1 bg-saffron-50 text-saffron-800 rounded-full text-xs font-semibold border border-saffron-200">{ref}</span>
              ))}
            </div>
          </Section>

          {/* Related Deity & Narrative */}
          <Section icon={Sparkles} title="संबंधित देवता और कथा (Related Deity & Narrative)">
            <p className="text-sm text-dharma-text mb-2"><strong>देवता:</strong> {festival.relatedDeity}</p>
            <p className="text-sm text-dharma-muted leading-relaxed">{festival.relatedNarrative}</p>
          </Section>

          {/* Regional Traditions */}
          <Section icon={MapPin} title="क्षेत्रीय परंपराएँ (Regional Traditions)">
            <div className="space-y-3">
              {festival.regionalTraditions.map((rt, i) => (
                <div key={i} className="bg-dharma-card border border-dharma-border rounded-xl p-3">
                  <p className="text-xs font-bold text-saffron-700 mb-1">{rt.region}</p>
                  <p className="text-sm text-dharma-text leading-relaxed">{rt.tradition}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-dharma-muted italic mt-3">नोट: कोई भी क्षेत्रीय प्रथा सार्वभौमिक हिंदू प्रथा नहीं है। विविधता हिंदू परंपरा की विशेषता है।</p>
          </Section>

          {/* Traditional Practices */}
          <Section icon={Sparkles} title="पारंपरिक अनुष्ठान (Traditional Practices)">
            <ul className="space-y-1.5">
              {festival.traditionalPractices.map((practice, i) => (
                <li key={i} className="text-sm text-dharma-text flex items-start gap-2">
                  <span className="text-saffron-500 shrink-0">•</span>
                  {practice}
                </li>
              ))}
            </ul>
          </Section>

          {/* Common Chants */}
          <Section icon={Music} title="जप और प्रार्थना (Common Chants & Prayers)">
            <div className="space-y-3">
              {festival.commonChants.map((chant, i) => (
                <div key={i} className="bg-dharma-card border border-dharma-border rounded-xl p-3">
                  <p className="text-sm font-serif text-saffron-800">{chant.sanskrit}</p>
                  <p className="text-xs text-dharma-muted italic mt-1">{chant.transliteration}</p>
                  <p className="text-sm text-dharma-text mt-1">{chant.translation}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Food Traditions */}
          <Section icon={Utensils} title="भोजन परंपरा (Food Traditions)">
            <ul className="space-y-1.5">
              {festival.foodTraditions.map((food, i) => (
                <li key={i} className="text-sm text-dharma-text flex items-start gap-2">
                  <span className="text-saffron-500 shrink-0">•</span>
                  {food}
                </li>
              ))}
            </ul>
          </Section>

          {/* Environmental Considerations */}
          <Section icon={Leaf} title="पर्यावरणीय विचार (Environmental Considerations)">
            <p className="text-sm text-dharma-text leading-relaxed">{festival.environmentalConsiderations}</p>
          </Section>

          {/* Scriptural vs Custom */}
          <Section icon={AlertCircle} title="शास्त्रीय बनाम सांस्कृतिक रिवाज़ (Scriptural vs Custom)">
            <div className="space-y-3">
              {festival.scripturalVsCustom.map((item, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-emerald-800 uppercase mb-1">शास्त्रीय</p>
                    <p className="text-sm text-dharma-text">{item.scriptural}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-amber-800 uppercase mb-1">सांस्कृतिक रिवाज़</p>
                    <p className="text-sm text-dharma-text">{item.custom}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
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
