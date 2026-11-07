'use client';

import React, { useState, useId } from 'react';
import type { LearningConcept } from '@/data/learning-paths';
import { Sparkles, ArrowRight, BookOpen, Network } from 'lucide-react';

interface ConceptRelationshipGraphProps {
  concepts: LearningConcept[];
  title?: string;
  className?: string;
}

export function ConceptRelationshipGraph({
  concepts,
  title = 'Philosophical Concept Relationships (ज्ञान सम्बन्ध)',
  className = '',
}: ConceptRelationshipGraphProps) {
  const [selectedId, setSelectedId] = useState<string>(concepts[0]?.id || '');
  const idPrefix = useId();

  if (!concepts || concepts.length === 0) return null;

  const activeConcept = concepts.find((c) => c.id === selectedId) || concepts[0];

  // Calculate layout coordinates in a responsive circle / orbital layout for SVG
  const width = 640;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.36;

  const nodePositions = concepts.map((c, i) => {
    const angle = (2 * Math.PI * i) / concepts.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { ...c, x, y };
  });

  const positionMap = new Map(nodePositions.map((n) => [n.id, n]));

  // Find relationships to draw edges
  const edges: Array<{ from: { x: number; y: number; id: string }; to: { x: number; y: number; id: string } }> = [];
  nodePositions.forEach((source) => {
    source.relatedConceptIds.forEach((targetId) => {
      const target = positionMap.get(targetId);
      if (target && source.id < target.id) {
        // Draw each undirected edge once
        edges.push({ from: source, to: target });
      }
    });
  });

  return (
    <div className={`rounded-2xl border border-dharma-border bg-dharma-card/80 p-5 md:p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-dharma-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-saffron-100 dark:bg-stone-800 text-saffron-800 dark:text-saffron-300 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-dharma-text">
              {title}
            </h3>
            <p className="text-xs text-dharma-muted">
              Select any concept to examine its textual anchor and philosophical connections.
            </p>
          </div>
        </div>

        <div className="text-xs text-saffron-700 dark:text-saffron-400 font-serif font-semibold">
          {concepts.length} interlinked concepts
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Diagram Area */}
        <div className="lg:col-span-7 bg-amber-50/40 dark:bg-stone-900/40 rounded-xl border border-amber-200/50 dark:border-stone-800 p-3 relative overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-[380px] select-none"
            role="img"
            aria-label="Interactive concept relationship diagram"
          >
            <defs>
              <linearGradient id={`${idPrefix}-glow`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#cf440a" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Subtle background mandala circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-amber-300/30 dark:text-stone-700/40 stroke-dasharray-[4,4]"
              strokeWidth="1"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.45}
              fill="none"
              stroke="currentColor"
              className="text-amber-300/20 dark:text-stone-700/30 stroke-dasharray-[2,4]"
              strokeWidth="0.8"
            />

            {/* Connecting Edges */}
            {edges.map((edge, idx) => {
              const isHighlighted =
                edge.from.id === activeConcept.id || edge.to.id === activeConcept.id;
              return (
                <line
                  key={`edge-${idx}`}
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  stroke={isHighlighted ? 'url(#' + idPrefix + '-glow)' : 'currentColor'}
                  className={
                    isHighlighted
                      ? 'stroke-2 transition-all duration-300'
                      : 'text-amber-300/40 dark:text-stone-700/50 stroke-1'
                  }
                />
              );
            })}

            {/* Center Emblem */}
            <circle
              cx={centerX}
              cy={centerY}
              r="24"
              className="fill-amber-100 dark:fill-stone-800 stroke-saffron-300/50 dark:stroke-saffron-600/50"
              strokeWidth="1.5"
            />
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              className="font-devanagari text-base font-bold fill-saffron-800 dark:fill-saffron-300"
            >
              ॐ
            </text>

            {/* Concept Nodes */}
            {nodePositions.map((node) => {
              const isSelected = node.id === activeConcept.id;
              const isRelated = activeConcept.relatedConceptIds.includes(node.id);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer focus:outline-hidden"
                  onClick={() => setSelectedId(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(node.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${node.term} (${node.sanskrit}) concept node`}
                >
                  {/* Outer halo if selected */}
                  {isSelected && (
                    <circle
                      r="32"
                      fill="none"
                      className="stroke-saffron-500/60 dark:stroke-saffron-400/60 animate-pulse"
                      strokeWidth="2"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={isSelected ? 26 : 22}
                    className={`transition-all duration-300 ${
                      isSelected
                        ? 'fill-saffron-700 dark:fill-saffron-600 stroke-amber-200 shadow-md'
                        : isRelated
                        ? 'fill-amber-100 dark:fill-stone-800 stroke-saffron-400 dark:stroke-saffron-500'
                        : 'fill-stone-50 dark:fill-stone-800/90 stroke-stone-300 dark:stroke-stone-700'
                    }`}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />

                  {/* Sanskrit text in node */}
                  <text
                    textAnchor="middle"
                    y={node.sanskrit.length > 5 ? -1 : 4}
                    className={`font-devanagari select-none transition-colors ${
                      isSelected
                        ? 'fill-white text-caption font-bold'
                        : isRelated
                        ? 'fill-saffron-900 dark:fill-saffron-200 text-[11px] font-semibold'
                        : 'fill-dharma-text text-[10px]'
                    }`}
                  >
                    {node.sanskrit}
                  </text>

                  {/* English title tag below */}
                  <text
                    textAnchor="middle"
                    y={isSelected ? 38 : 34}
                    className={`font-serif select-none text-[10px] font-semibold tracking-wider uppercase ${
                      isSelected
                        ? 'fill-saffron-800 dark:fill-saffron-300 font-bold'
                        : 'fill-dharma-muted'
                    }`}
                  >
                    {node.term}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick concept pill selector on mobile / small screens */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-3 pt-3 border-t border-dharma-border/40 w-full">
            {concepts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all ${
                  selectedId === c.id
                    ? 'bg-saffron-700 text-white shadow-xs'
                    : 'bg-white/80 dark:bg-stone-800 text-dharma-text hover:bg-saffron-50 dark:hover:bg-stone-700 border border-dharma-border/60'
                }`}
              >
                <span className="font-devanagari mr-1">{c.sanskrit}</span>
                <span>{c.term}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Concept Inspector */}
        <div className="lg:col-span-5 bg-gradient-to-b from-amber-50/70 to-orange-50/30 dark:from-stone-900/90 dark:to-stone-950/90 rounded-xl border border-saffron-200/70 dark:border-stone-800 p-5 shadow-xs">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="font-devanagari text-2xl font-bold text-saffron-800 dark:text-saffron-300 block">
                {activeConcept.sanskrit}
              </span>
              <h4 className="font-serif font-bold text-lg text-dharma-text">
                {activeConcept.term}{' '}
                <span className="text-xs font-sans text-dharma-muted font-normal">
                  ({activeConcept.transliteration})
                </span>
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-saffron-100 dark:bg-stone-800 text-saffron-800 dark:text-saffron-300 border border-saffron-300/40">
              Core Axiom
            </span>
          </div>

          <p className="text-sm text-dharma-text leading-relaxed mt-3">
            {activeConcept.definition}
          </p>

          <div className="my-4 p-3 rounded-lg bg-amber-100/50 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700/60 text-xs">
            <span className="font-serif font-bold text-saffron-800 dark:text-saffron-300 block mb-1">
              Philosophical Context
            </span>
            <p className="text-dharma-text/90 italic leading-normal">
              {activeConcept.philosophicalContext}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-dharma-muted mb-4">
            <BookOpen className="w-3.5 h-3.5 text-saffron-600 dark:text-saffron-400" />
            <span className="font-semibold text-dharma-text">Anchor:</span>
            <span>{activeConcept.scriptureAnchor}</span>
          </div>

          {/* Related Concepts Chips */}
          <div>
            <span className="text-xs font-serif font-bold text-dharma-muted uppercase tracking-wider block mb-2">
              Philosophical Links (सम्बद्ध सूत्र)
            </span>
            <div className="flex flex-wrap gap-2">
              {activeConcept.relatedConceptIds.map((relId) => {
                const target = concepts.find((c) => c.id === relId);
                if (!target) return null;
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => setSelectedId(target.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-stone-800 border border-saffron-200 dark:border-stone-700 text-saffron-800 dark:text-saffron-300 hover:border-saffron-400 hover:bg-saffron-50 dark:hover:bg-stone-700 transition"
                  >
                    <span className="font-devanagari">{target.sanskrit}</span>
                    <span>{target.term}</span>
                    <ArrowRight className="w-3 h-3 text-saffron-500" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
