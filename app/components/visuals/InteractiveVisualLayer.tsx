'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  Workflow,
  Network,
  Milestone,
  ArrowRight,
  BookOpen,
  Info,
  Maximize2,
  Minimize2,
  Volume2,
} from 'lucide-react';
import { VISUAL_CONCEPTS, type VisualConceptData, type VisualLayerRing, type FlowNode } from '@/data/visual-concepts';
import { triggerTactileFeedback, playSoundEffect } from '@/lib/haptics';
import { toAsciiDigits } from '@/lib/verse-format';

export type VisualMode = 'geometry' | 'flowchart' | 'knowledge' | 'stages';

interface InteractiveVisualLayerProps {
  conceptId: string;
  initialMode?: VisualMode;
  compact?: boolean;
}

export function InteractiveVisualLayer({
  conceptId,
  initialMode = 'geometry',
  compact = false,
}: InteractiveVisualLayerProps) {
  const data: VisualConceptData | undefined = VISUAL_CONCEPTS[conceptId];
  const [mode, setMode] = useState<VisualMode>(initialMode);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  // Default active layer
  useEffect(() => {
    if (data?.geometry.layers.length) {
      setSelectedLayerId(data.geometry.layers[0].id);
    }
    if (data?.flowchart.nodes.length) {
      setSelectedNodeId(data.flowchart.nodes[0].id);
    }
  }, [data]);

  // Gentle ambient rotation animation for sacred geometry
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isRotating]);

  const activeLayer = useMemo(() => {
    if (!data) return null;
    return data.geometry.layers.find((l) => l.id === selectedLayerId) ?? data.geometry.layers[0];
  }, [data, selectedLayerId]);

  const activeNode = useMemo(() => {
    if (!data) return null;
    return data.flowchart.nodes.find((n) => n.id === selectedNodeId) ?? data.flowchart.nodes[0];
  }, [data, selectedNodeId]);

  const handleSelectLayer = useCallback((layer: VisualLayerRing) => {
    triggerTactileFeedback('selection', 'softTap');
    setSelectedLayerId(layer.id);
  }, []);

  const handleSelectNode = useCallback((node: FlowNode) => {
    triggerTactileFeedback('selection', 'click');
    setSelectedNodeId(node.id);
  }, []);

  const handleModeChange = useCallback((newMode: VisualMode) => {
    triggerTactileFeedback('medium', 'softTap');
    setMode(newMode);
  }, []);

  if (!data) {
    return (
      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        <p>इस अवधारणा के लिए दृश्य आरेख शीघ्र ही उपलब्ध होगा।</p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={`${data.label} (${data.sanskrit}) दृश्य ज्ञान आरेख`}
      className={`relative overflow-hidden rounded-3xl border border-dharma-border/80 bg-gradient-to-b ${data.theme.bgGradient} shadow-2xl backdrop-blur-md transition-all`}
    >
      {/* ── Top Header & Tab Ribbon ────────────────────────────────────────── */}
      <div className="border-b border-dharma-border/60 bg-dharma-bg/80 px-4 py-3 sm:px-6 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border font-devanagari text-lg font-bold shadow-md"
            style={{
              borderColor: data.theme.primary,
              backgroundColor: `${data.theme.primary}18`,
              color: data.theme.primary,
            }}
          >
            {data.binduSymbol}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-dharma-text">
                {data.label}
              </span>
              <span className="font-devanagari text-sm font-semibold text-dharma-muted">
                ({data.sanskrit})
              </span>
            </div>
            <p className="font-devanagari text-xs text-saffron-700 dark:text-saffron-400">
              {data.coreMantra}
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 rounded-2xl border border-dharma-border/80 bg-dharma-card/90 p-1 text-xs">
          <button
            type="button"
            onClick={() => handleModeChange('geometry')}
            aria-pressed={mode === 'geometry'}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-semibold transition-all ${
              mode === 'geometry'
                ? 'bg-saffron-600 text-white shadow-md'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-devanagari">पवित्र ज्यामिति</span>
            <span className="sm:hidden">ज्यामिति</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('flowchart')}
            aria-pressed={mode === 'flowchart'}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-semibold transition-all ${
              mode === 'flowchart'
                ? 'bg-saffron-600 text-white shadow-md'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Workflow className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-devanagari">प्रवाह आरेख</span>
            <span className="sm:hidden">प्रवाह</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('knowledge')}
            aria-pressed={mode === 'knowledge'}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-semibold transition-all ${
              mode === 'knowledge'
                ? 'bg-saffron-600 text-white shadow-md'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-devanagari">ज्ञान मानचित्र</span>
            <span className="sm:hidden">मानचित्र</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('stages')}
            aria-pressed={mode === 'stages'}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-semibold transition-all ${
              mode === 'stages'
                ? 'bg-saffron-600 text-white shadow-md'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Milestone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-devanagari">क्रमिक सोपान</span>
            <span className="sm:hidden">सोपान</span>
          </button>
        </div>
      </div>

      {/* ── Main Interactive Canvas ────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* ── 1. SACRED GEOMETRY / 3D MANDALA VIEW ─────────────────────────── */}
        {mode === 'geometry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG Visualizer Canvas */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <button
                type="button"
                className="relative flex h-72 w-72 sm:h-96 sm:w-96 items-center justify-center select-none rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                onClick={() => setIsRotating((r) => !r)}
                aria-label="मंडला घूर्णन टॉगल करें"
                title="घूर्णन रोकने/प्रारंभ करने हेतु क्लिक करें"
              >
                {/* Background Cosmic Radiance */}
                <div
                  className="absolute inset-4 rounded-full opacity-35 blur-2xl transition-all duration-700"
                  style={{ backgroundColor: activeLayer?.glowColor ?? data.theme.primary }}
                />

                <svg
                  viewBox="0 0 400 400"
                  className="h-full w-full drop-shadow-2xl"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transition: isRotating ? 'none' : 'transform 0.4s ease-out',
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id={`glow-${data.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={data.theme.primary} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={data.theme.secondary} stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Outer Sacred Ring */}
                  <circle
                    cx="200"
                    cy="200"
                    r="190"
                    fill="none"
                    stroke={data.theme.primary}
                    strokeWidth="1.2"
                    strokeDasharray="4 6"
                    opacity="0.45"
                  />

                  {/* Radiating 12 Rays */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = 200 + Math.cos(angle) * 35;
                    const y1 = 200 + Math.sin(angle) * 35;
                    const x2 = 200 + Math.cos(angle) * 185;
                    const y2 = 200 + Math.sin(angle) * 185;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={data.theme.primary}
                        strokeWidth="0.8"
                        strokeDasharray="2 8"
                        opacity="0.3"
                      />
                    );
                  })}

                  {/* Concentric Layers */}
                  {data.geometry.layers.map((layer, idx) => {
                    const radius = (layer.radiusPercent / 100) * 180;
                    const isSelected = layer.id === selectedLayerId;
                    return (
                      <g key={layer.id} className="cursor-pointer">
                        <circle
                          cx="200"
                          cy="200"
                          r={radius}
                          fill={isSelected ? `${layer.glowColor}25` : 'none'}
                          stroke={layer.glowColor}
                          strokeWidth={isSelected ? '3.5' : '1.5'}
                          opacity={isSelected ? 1 : 0.55}
                          className="transition-all duration-300"
                        />
                        {/* Layer Orbiting Bead */}
                        <circle
                          cx={200 + radius}
                          cy="200"
                          r={isSelected ? '5.5' : '3.5'}
                          fill={layer.glowColor}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? '2' : '1'}
                          className="transition-all"
                        />
                      </g>
                    );
                  })}

                  {/* Center Bindu */}
                  <circle cx="200" cy="200" r="28" fill={data.theme.primary} opacity="0.9" />
                  <circle cx="200" cy="200" r="32" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                </svg>

                {/* Central Devanagari Bindu Character (Static, doesn't spin) */}
                <div
                  className="absolute flex h-14 w-14 items-center justify-center rounded-full font-devanagari text-2xl font-black text-white shadow-xl ring-2 ring-white/30 backdrop-blur-sm pointer-events-none"
                  style={{ backgroundColor: data.theme.primary }}
                >
                  {data.binduSymbol}
                </div>
              </button>
              <p className="mt-2 text-[11px] font-medium text-dharma-muted">
                {isRotating ? '● निरंतर ब्रह्माण्डीय प्रवाह (क्लिक कर रोकें)' : '○ स्थिर (क्लिक कर प्रारंभ करें)'}
              </p>
            </div>

            {/* Layer Explanation Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  {data.geometry.titleEn}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                  {data.geometry.titleHi}
                </h3>
                <p className="text-xs text-dharma-muted leading-relaxed">
                  {data.geometry.interpretationHi}
                </p>
              </div>

              {/* Layer Selection Pill Grid */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                  आवरण चुनें (Select Layer to Inspect)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {data.geometry.layers.map((layer) => {
                    const isSelected = layer.id === selectedLayerId;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => handleSelectLayer(layer)}
                        className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-saffron-500 bg-saffron-500/15 shadow-md ring-2 ring-saffron-500/20'
                            : 'border-dharma-border/70 bg-dharma-card/80 hover:border-saffron-400'
                        }`}
                      >
                        <span
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border shadow-sm"
                          style={{ backgroundColor: layer.glowColor, borderColor: '#ffffff' }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-devanagari text-xs font-bold text-dharma-text">
                            {layer.nameHi}
                          </p>
                          <p className="text-[11px] text-dharma-muted truncate">
                            {layer.nameEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Layer Deep Dive Card */}
              {activeLayer && (
                <div className="rounded-2xl border border-saffron-500/30 bg-dharma-card/95 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full animate-ping"
                      style={{ backgroundColor: activeLayer.glowColor }}
                    />
                    <h4 className="font-serif text-sm font-bold text-dharma-text">
                      {activeLayer.nameHi} · {activeLayer.nameEn}
                    </h4>
                  </div>
                  <p className="font-devanagari text-xs text-dharma-text leading-relaxed">
                    {activeLayer.descHi}
                  </p>
                  <p className="mt-1 text-xs text-dharma-muted italic">
                    {activeLayer.descEn}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 2. INTERACTIVE FLOWCHART VIEW ───────────────────────────────── */}
        {mode === 'flowchart' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                {data.flowchart.titleEn}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                {data.flowchart.titleHi}
              </h3>
              <p className="text-xs text-dharma-muted">
                {data.flowchart.descriptionHi}
              </p>
            </div>

            {/* Horizontal / Stacked Flow Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              {data.flowchart.nodes.map((node, idx) => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleSelectNode(node)}
                      className={`w-full rounded-2xl border p-4 text-center transition-all ${
                        isSelected
                          ? 'scale-105 border-saffron-500 bg-gradient-to-b from-saffron-600 to-amber-700 text-white shadow-xl ring-4 ring-saffron-500/20'
                          : 'border-dharma-border bg-dharma-card hover:border-saffron-400'
                      }`}
                    >
                      <span className="mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h4 className={`font-devanagari text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-dharma-text'}`}>
                        {node.titleHi}
                      </h4>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-dharma-muted'}`}>
                        {node.titleEn}
                      </p>
                    </button>
                    {idx < data.flowchart.nodes.length - 1 && (
                      <div className="my-1 text-saffron-600 dark:text-saffron-400 md:hidden">
                        <ArrowRight className="h-4 w-4 rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Node Details */}
            {activeNode && (
              <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 max-w-2xl mx-auto text-center space-y-2 shadow-md">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  {activeNode.titleEn}
                </span>
                <h4 className="font-serif text-lg font-bold text-dharma-text">
                  {activeNode.titleHi}
                </h4>
                <p className="font-devanagari text-sm text-dharma-text leading-relaxed">
                  {activeNode.subtitleHi}
                </p>
                <p className="text-xs text-dharma-muted italic">
                  {activeNode.subtitleEn}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── 3. KNOWLEDGE MAP VIEW ────────────────────────────────────────── */}
        {mode === 'knowledge' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scripture Citations */}
            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-dharma-border/60 pb-2">
                <BookOpen className="h-4 w-4 text-saffron-600" />
                <h4 className="font-serif text-sm font-bold text-dharma-text">
                  शास्त्रीय आधार (Foundational Scriptures)
                </h4>
              </div>
              <ul className="space-y-2 text-xs">
                {data.knowledgeMap.scriptures.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-dharma-text">
                    <span className="text-saffron-600 font-bold">●</span>
                    <div>
                      <strong className="font-bold">{s.name}:</strong>{' '}
                      <span className="text-dharma-muted">{s.ref}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Core Pillars */}
            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-dharma-border/60 pb-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <h4 className="font-serif text-sm font-bold text-dharma-text">
                  मूल लक्षण (Core Attributes & Pillars)
                </h4>
              </div>
              <ul className="space-y-2 text-xs">
                {data.knowledgeMap.corePillars.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-dharma-text">
                    <span className="text-amber-600 font-bold">✓</span>
                    <div>
                      <span className="font-devanagari font-semibold">{p.hi}</span>{' '}
                      <span className="text-dharma-muted">({p.en})</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spiritual Practices */}
            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-dharma-border/60 pb-2">
                <Workflow className="h-4 w-4 text-emerald-600" />
                <h4 className="font-serif text-sm font-bold text-dharma-text">
                  दैनिक साधना एवं आचरण (Spiritual Practices)
                </h4>
              </div>
              <ul className="space-y-2 text-xs">
                {data.knowledgeMap.practices.map((pr, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-dharma-text">
                    <span className="text-emerald-600 font-bold">→</span>
                    <div>
                      <span className="font-devanagari font-semibold">{pr.hi}</span>{' '}
                      <span className="text-dharma-muted">({pr.en})</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ultimate Fruit */}
            <div className="rounded-2xl border border-saffron-500/40 bg-gradient-to-br from-saffron-500/10 to-amber-600/10 p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-dharma-border/60 pb-2">
                <Milestone className="h-4 w-4 text-saffron-600" />
                <h4 className="font-serif text-sm font-bold text-dharma-text">
                  परम फल (Ultimate Fruit of Realization)
                </h4>
              </div>
              <p className="font-devanagari text-sm font-semibold text-dharma-text leading-relaxed">
                {data.knowledgeMap.ultimateFruit.hi}
              </p>
              <p className="text-xs text-dharma-muted italic">
                {data.knowledgeMap.ultimateFruit.en}
              </p>
            </div>
          </div>
        )}

        {/* ── 4. SACRED STAGES / LADDER VIEW ───────────────────────────────── */}
        {mode === 'stages' && (
          <div className="space-y-5">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                {data.stages.titleEn}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                {data.stages.titleHi}
              </h3>
            </div>

            <div className="space-y-3">
              {data.stages.items.map((stage) => (
                <div
                  key={stage.step}
                  className="rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition hover:border-saffron-400 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-saffron-500/15 text-saffron-700 dark:text-saffron-300 font-devanagari text-lg font-black border border-saffron-500/30">
                    {toAsciiDigits(stage.step)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-devanagari text-base font-bold text-dharma-text">
                        {stage.nameHi}
                      </h4>
                      <span className="text-xs text-dharma-muted">({stage.nameEn})</span>
                      <span className="rounded-full bg-saffron-500/10 px-2 py-0.5 text-[11px] font-mono text-saffron-800 dark:text-saffron-300">
                        {stage.sanskrit}
                      </span>
                    </div>
                    <p className="font-devanagari text-xs text-dharma-text leading-relaxed">
                      {stage.descHi}
                    </p>
                    <p className="text-xs text-dharma-muted italic">
                      {stage.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Reference Bar ─────────────────────────────────────────── */}
      <div className="border-t border-dharma-border/60 bg-dharma-card/50 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between text-xs text-dharma-muted">
        <span>स्रोत प्रमाण: {data.scriptureSource}</span>
        <Link
          href={`/concepts/${data.id}`}
          className="font-semibold text-saffron-700 dark:text-saffron-400 hover:underline inline-flex items-center gap-1"
        >
          <span>विस्तृत शास्त्रीय टीका पढ़ें</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* ── Offscreen Table for Screen Readers (Accessibility) ─────────────── */}
      <div className="sr-only">
        <h4>{data.label} Visual Learning Table</h4>
        <table>
          <caption>Summary of {data.label} across its layers and stages</caption>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Sanskrit</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {data.geometry.layers.map((l) => (
              <tr key={l.id}>
                <td>{l.nameEn}</td>
                <td>{l.nameHi}</td>
                <td>{l.descEn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
