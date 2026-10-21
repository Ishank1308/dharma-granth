'use client';

import React, { useState, useMemo, useId } from 'react';
import Link from 'next/link';
import {
  Network,
  Compass,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Filter,
  Layers,
  Info,
  Share2,
} from 'lucide-react';
import {
  buildVerseGraphData,
  RELATIONSHIP_META,
  type VerseGraphData,
  type VerseGraphNode,
  type RelationshipType,
} from '@/lib/verse-relationship-engine';

interface Props {
  scriptureId: string;
  chapterId: number;
  verseId: string | number;
  currentVerse: {
    number: string | number;
    sanskrit?: string;
    transliteration?: string;
    hindi?: string;
    translation?: string;
    explanation?: string;
  };
}

export function VerseGraphNetwork({ scriptureId, chapterId, verseId, currentVerse }: Props) {
  const graphData = useMemo(
    () => buildVerseGraphData(scriptureId, chapterId, verseId, currentVerse),
    [scriptureId, chapterId, verseId, currentVerse]
  );

  const [activeFilter, setActiveFilter] = useState<RelationshipType | 'all'>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    graphData.nodes[0]?.id || ''
  );
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const idPrefix = useId();

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (activeFilter === 'all') return graphData.nodes;
    return graphData.nodes.filter((n) => n.type === activeFilter);
  }, [graphData.nodes, activeFilter]);

  const activeNode: VerseGraphNode | undefined = useMemo(() => {
    return filteredNodes.find((n) => n.id === selectedNodeId) || filteredNodes[0] || graphData.nodes[0];
  }, [graphData.nodes, selectedNodeId, filteredNodes]);

  // Layout calculation for SVG Orbital Graph
  const width = 680;
  const height = 440;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.36;

  const nodePositions = useMemo(() => {
    const list = filteredNodes.length > 0 ? filteredNodes : graphData.nodes;
    return list.map((node, idx) => {
      const angle = (2 * Math.PI * idx) / list.length - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { ...node, x, y };
    });
  }, [filteredNodes, graphData.nodes, centerX, centerY, radius]);

  // No reviewed links: render nothing rather than a "not recorded yet" box.
  if (graphData.nodes.length === 0) return null;

  return (
    <section
      id="verse-graph"
      aria-labelledby="verse-graph-title"
      className="mt-10 rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-8 shadow-sm space-y-6"
    >
      {/* ─── SECTION HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-dharma-border/60 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
            <Network className="h-3.5 w-3.5 text-saffron-600" />
            <span>Interactive Verse Knowledge Graph · ज्ञान जाल</span>
          </div>
          <h2 id="verse-graph-title" className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
            श्लोक सम्बन्ध एवं पार-ग्रंथ संदर्भ
          </h2>
          <p className="text-xs sm:text-sm text-dharma-muted">
            Reviewed links only. A line here is a stored connection, not a guess from the neighboring verse.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-dharma-border bg-dharma-panel p-1 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode('graph')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              viewMode === 'graph'
                ? 'bg-saffron-600 text-white shadow-2xs'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            Visual Graph
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              viewMode === 'list'
                ? 'bg-saffron-600 text-white shadow-2xs'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            Structured List
          </button>
        </div>
      </div>

      {/* ─── FILTER TABS ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-dharma-border/60 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 font-semibold transition ${
            activeFilter === 'all'
              ? 'bg-saffron-600 text-white shadow-2xs'
              : 'border border-dharma-border bg-dharma-panel text-dharma-muted hover:border-saffron-300'
          }`}
        >
          <span>All Connections ({graphData.stats.totalConnections})</span>
        </button>

        {graphData.stats.crossScriptureCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter('cross_scripture')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 font-semibold transition ${
              activeFilter === 'cross_scripture'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'border border-dharma-border bg-dharma-panel text-dharma-muted hover:border-purple-300'
            }`}
          >
            <span>🟣 Cross-Scriptural ({graphData.stats.crossScriptureCount})</span>
          </button>
        )}

        {graphData.stats.parallelCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter('parallel')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 font-semibold transition ${
              activeFilter === 'parallel'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-dharma-border bg-dharma-panel text-dharma-muted hover:border-blue-300'
            }`}
          >
            <span>🔵 Parallel Teachings ({graphData.stats.parallelCount})</span>
          </button>
        )}

        {graphData.stats.supportingCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter('supporting')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 font-semibold transition ${
              activeFilter === 'supporting'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'border border-dharma-border bg-dharma-panel text-dharma-muted hover:border-emerald-300'
            }`}
          >
            <span>🟢 Supporting Verses ({graphData.stats.supportingCount})</span>
          </button>
        )}

        {graphData.stats.conceptCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilter('concept_connection')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 font-semibold transition ${
              activeFilter === 'concept_connection'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'border border-dharma-border bg-dharma-panel text-dharma-muted hover:border-amber-300'
            }`}
          >
            <span>🟡 Concepts ({graphData.stats.conceptCount})</span>
          </button>
        )}
      </div>

      {/* ─── GRAPH / LIST VIEW ───────────────────────────────────────────── */}
      {viewMode === 'graph' ? (
        <div className="space-y-6">
          {/* SVG Visual Orbital Graph Canvas */}
          <div className="relative rounded-3xl border border-dharma-border bg-gradient-to-b from-amber-50/30 via-dharma-panel to-amber-50/10 dark:from-stone-900/50 dark:via-dharma-card dark:to-stone-950 p-2 sm:p-4 overflow-hidden flex items-center justify-center min-h-[380px]">
            {/* role=group: role=img marks descendants presentational, so the node buttons fail nested-interactive. */}
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto max-h-[420px] select-none"
              role="group"
              aria-label="Interactive verse relationship graph"
            >
              <defs>
                <linearGradient id={`${idPrefix}-center-glow`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
                </linearGradient>

                <filter id={`${idPrefix}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Background Orbital Guide Rings */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeDasharray="4 4"
                className="text-amber-500/20 dark:text-stone-700/30"
                strokeWidth="1.2"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * 0.55}
                fill="none"
                stroke="currentColor"
                strokeDasharray="2 2"
                className="text-amber-500/10 dark:text-stone-800/20"
                strokeWidth="1"
              />

              {/* Connection Edges */}
              {nodePositions.map((node) => {
                const isSelected = activeNode?.id === node.id;
                const meta = RELATIONSHIP_META[node.type];
                return (
                  <g key={`edge-${node.id}`}>
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={node.x}
                      y2={node.y}
                      stroke={isSelected ? meta.color : 'currentColor'}
                      strokeWidth={isSelected ? '2.5' : '1.2'}
                      strokeDasharray={node.type === 'concept_connection' ? '4,4' : undefined}
                      className={
                        isSelected
                          ? 'transition-all duration-300'
                          : 'text-dharma-border/80 transition-all duration-300'
                      }
                      strokeOpacity={isSelected ? 0.9 : 0.4}
                    />
                  </g>
                );
              })}

              {/* Center Node (Current Verse) */}
              <g className="cursor-default">
                {/* Glow ring */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="48"
                  fill={`url(#${idPrefix}-center-glow)`}
                  fillOpacity="0.2"
                  className="animate-pulse"
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="38"
                  fill={`url(#${idPrefix}-center-glow)`}
                  filter={`url(#${idPrefix}-shadow)`}
                />
                <text
                  x={centerX}
                  y={centerY - 6}
                  textAnchor="middle"
                  className="font-serif font-bold text-xs fill-white select-none pointer-events-none"
                >
                  {graphData.centralNode.reference}
                </text>
                <text
                  x={centerX}
                  y={centerY + 10}
                  textAnchor="middle"
                  className="text-[9px] font-semibold tracking-wider uppercase fill-white/80 select-none pointer-events-none"
                >
                  Current Verse
                </text>
              </g>

              {/* Satellite Connection Nodes */}
              {nodePositions.map((node) => {
                const isSelected = activeNode?.id === node.id;
                const meta = RELATIONSHIP_META[node.type];

                return (
                  <g
                    key={`node-${node.id}`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-105"
                    tabIndex={0}
                    role="button"
                    aria-label={`Select connection: ${node.label}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNodeId(node.id);
                      }
                    }}
                  >
                    {/* Selection halo */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="32"
                        fill="none"
                        stroke={meta.color}
                        strokeWidth="2.5"
                        strokeDasharray="3,3"
                        className="animate-spin-slow"
                      />
                    )}

                    {/* Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="25"
                      fill={meta.color}
                      className="transition-all duration-200"
                      filter={`url(#${idPrefix}-shadow)`}
                    />

                    {/* Node Icon or Text */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      className="font-serif font-bold text-[10px] fill-white select-none pointer-events-none"
                    >
                      {node.reference.slice(0, 8)}
                    </text>

                    {/* Label below node */}
                    <text
                      x={node.x}
                      y={node.y + 36}
                      textAnchor="middle"
                      className={`text-[10px] font-bold select-none pointer-events-none ${
                        isSelected
                          ? 'fill-saffron-800 dark:fill-saffron-300 font-extrabold'
                          : 'fill-dharma-muted'
                      }`}
                    >
                      {node.label.length > 18 ? `${node.label.slice(0, 16)}…` : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Connection Detail Card */}
          {activeNode && (
            <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-7 space-y-4 shadow-sm animate-in fade-in duration-200">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-dharma-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider ${
                        RELATIONSHIP_META[activeNode.type].badgeCls
                      }`}
                    >
                      <span>{RELATIONSHIP_META[activeNode.type].icon}</span>
                      <span>{RELATIONSHIP_META[activeNode.type].label}</span>
                    </span>
                    <span className="text-2xs text-dharma-muted">
                      {RELATIONSHIP_META[activeNode.type].labelHi}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                    {activeNode.reference}
                  </h3>
                  <p className="text-xs text-dharma-muted">
                    {activeNode.scriptureTitle}
                    {activeNode.scriptureTitleSanskrit ? ` (${activeNode.scriptureTitleSanskrit})` : ''}
                  </p>
                </div>

                <div className="self-start sm:self-center">
                  <Link
                    href={activeNode.href}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 px-4 py-2 text-xs font-bold text-white transition shadow-2xs"
                  >
                    <span>{activeNode.type === 'concept_connection' ? 'Explore Concept' : 'Read Verse'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Sanskrit Text if available */}
              {activeNode.sanskrit && (
                <div className="rounded-2xl border-2 border-amber-700/25 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-950/20 p-4 space-y-1">
                  <p className="text-2xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    Sanskrit Text (मूल श्लोक / मंत्र)
                  </p>
                  <p className="font-devanagari text-base sm:text-lg font-semibold text-amber-950 dark:text-amber-100 leading-relaxed">
                    {activeNode.sanskrit}
                  </p>
                </div>
              )}

              {/* Translation */}
              {activeNode.translation && (
                <div className="space-y-1">
                  <p className="text-2xs font-bold uppercase tracking-wider text-dharma-muted">
                    Translation / Meaning (भावार्थ)
                  </p>
                  <p className="font-serif text-sm sm:text-base text-dharma-text leading-relaxed">
                    {activeNode.translation}
                  </p>
                </div>
              )}

              {/* Why Linked (Scholarly Context) */}
              <div className="rounded-2xl border border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 p-4 space-y-1">
                <p className="text-2xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  <span>Why This is Connected (सम्बन्ध का आधार)</span>
                </p>
                <p className="text-xs sm:text-sm text-dharma-text leading-relaxed">
                  {activeNode.relationshipReason}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ─── STRUCTURED LIST VIEW ─────────────────────────────────────── */
        <div className="space-y-4">
          {filteredNodes.map((node) => {
            const meta = RELATIONSHIP_META[node.type];
            return (
              <article
                key={node.id}
                className="rounded-2xl border border-dharma-border bg-dharma-card p-5 space-y-3 hover:border-saffron-300 transition"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-dharma-border/60 pb-3">
                  <div className="space-y-0.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider ${meta.badgeCls}`}
                    >
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </span>
                    <h3 className="font-serif text-lg font-bold text-dharma-text">
                      <Link href={node.href} className="hover:underline text-saffron-800 dark:text-saffron-300">
                        {node.reference}
                      </Link>
                    </h3>
                  </div>

                  <Link
                    href={node.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
                  >
                    <span>{node.type === 'concept_connection' ? 'Explore Concept' : 'Open Verse'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {node.sanskrit && (
                  <p className="font-devanagari text-sm sm:text-base font-semibold text-amber-950 dark:text-amber-100">
                    {node.sanskrit}
                  </p>
                )}

                {node.translation && (
                  <p className="text-xs sm:text-sm text-dharma-text font-serif leading-relaxed">
                    {node.translation}
                  </p>
                )}

                <p className="text-xs text-dharma-muted border-t border-dharma-border/50 pt-2">
                  <span className="font-bold text-dharma-text">Relationship: </span>
                  {node.relationshipReason}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
