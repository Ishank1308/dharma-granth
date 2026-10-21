'use client';

import { useMemo, useState, useRef, useCallback, useEffect, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, ChevronRight, Sparkles, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import {
  concepts as allConcepts,
  conceptCategories,
  type Concept,
  type ConceptCategory,
  getConnectedConcepts,
} from '@/data/concepts';
import { getConceptVerses, type ConceptVerse } from '@/data/concept-verses';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { readHref } from '@/lib/verse-paths';

// ── Force-directed layout simulation ────────────────────────────
interface SimNode { id: string; x: number; y: number; vx: number; vy: number; }

function simulateLayout(
  nodeIds: string[],
  edges: [string, string][],
  width: number,
  height: number,
  iterations = 400,
): Map<string, { x: number; y: number }> {
  const nodes = new Map<string, SimNode>();
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.38;

  // Initialize in a circle, grouped by category sector
  const catOrder: ConceptCategory[] = ['core', 'metaphysics', 'practice', 'psychology', 'cosmology'];
  const conceptMap = new Map(allConcepts.map((c) => [c.id, c]));

  nodeIds.forEach((id, i) => {
    const concept = conceptMap.get(id);
    const catIndex = concept ? catOrder.indexOf(concept.category) : 0;
    const catCount = concept ? allConcepts.filter((c) => c.category === concept.category).length : 1;
    const catStart = (catIndex / catOrder.length) * 2 * Math.PI;
    const catSpan = (1 / catOrder.length) * 2 * Math.PI;
    const withinCat = concept ? allConcepts.filter((c) => c.category === concept.category).findIndex((c) => c.id === id) : 0;
    const angle = catStart + ((withinCat + 0.5) / catCount) * catSpan;
    const r = concept?.category === 'core' ? radius * 0.3 : radius;

    nodes.set(id, {
      id,
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      vx: 0,
      vy: 0,
    });
  });

  const k = Math.sqrt((width * height) / Math.max(nodeIds.length, 1)) * 0.8;

  for (let iter = 0; iter < iterations; iter++) {
    const cooling = 1 - iter / iterations;

    // Repulsive forces
    const nodeArr = Array.from(nodes.values());
    for (let i = 0; i < nodeArr.length; i++) {
      const n1 = nodeArr[i];
      let fx = 0, fy = 0;
      for (let j = 0; j < nodeArr.length; j++) {
        if (i === j) continue;
        const n2 = nodeArr[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (k * k) / dist;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }
      n1.vx = (n1.vx + fx * 0.1 * cooling);
      n1.vy = (n1.vy + fy * 0.1 * cooling);
    }

    // Attractive spring forces along edges
    for (const [id1, id2] of edges) {
      const n1 = nodes.get(id1);
      const n2 = nodes.get(id2);
      if (!n1 || !n2) continue;
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist * dist) / k;
      const fx = (dx / dist) * force * 0.05 * cooling;
      const fy = (dy / dist) * force * 0.05 * cooling;
      n1.vx += fx;
      n1.vy += fy;
      n2.vx -= fx;
      n2.vy -= fy;
    }

    // Centering + damping + apply
    for (const n of Array.from(nodes.values())) {
      n.vx += (cx - n.x) * 0.005 * cooling;
      n.vy += (cy - n.y) * 0.005 * cooling;
      n.vx *= 0.82;
      n.vy *= 0.82;
      n.x += n.vx * cooling;
      n.y += n.vy * cooling;
    }
  }

  const result = new Map<string, { x: number; y: number }>();
  for (const [id, n] of Array.from(nodes.entries())) {
    result.set(id, { x: n.x, y: n.y });
  }
  return result;
}

// ── Category colors for SVG ─────────────────────────────────────
const catColors: Record<ConceptCategory, { fill: string; stroke: string; glow: string }> = {
  core: { fill: '#f97316', stroke: '#fbbf24', glow: 'rgba(249,115,22,0.4)' },
  metaphysics: { fill: '#6366f1', stroke: '#818cf8', glow: 'rgba(99,102,241,0.35)' },
  practice: { fill: '#10b981', stroke: '#34d399', glow: 'rgba(16,185,129,0.35)' },
  psychology: { fill: '#f43f5e', stroke: '#fb7185', glow: 'rgba(244,63,94,0.35)' },
  cosmology: { fill: '#a855f7', stroke: '#c084fc', glow: 'rgba(168,85,247,0.35)' },
};

const VW = 900;
const VH = 640;

// ── Component ───────────────────────────────────────────────────
export function ConceptGraph({ articleIds }: { articleIds: string[] }) {
  const reduce = useReducedMotion();
  const articles = useMemo(() => new Set(articleIds), [articleIds]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCats, setActiveCats] = useState<Set<ConceptCategory>>(
    new Set(conceptCategories.map((c) => c.key)),
  );
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; nodeX: number; nodeY: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  // Build edges and compute layout
  const { edges, layout } = useMemo(() => {
    const edgeSet = new Set<string>();
    const edgeList: [string, string][] = [];
    for (const c of allConcepts) {
      for (const conn of c.connections) {
        const key = [c.id, conn].sort().join('|');
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edgeList.push([c.id, conn]);
        }
      }
    }
    const pos = simulateLayout(
      allConcepts.map((c) => c.id),
      edgeList,
      VW,
      VH,
    );
    return { edges: edgeList, layout: pos };
  }, []);

  // Initialize positions from layout
  useEffect(() => {
    setPositions(new Map(layout));
  }, [layout]);

  const activeId = hoveredId ?? selectedId;
  const connectedIds = useMemo(() => {
    if (!activeId) return null;
    const concept = allConcepts.find((c) => c.id === activeId);
    if (!concept) return null;
    return new Set([activeId, ...concept.connections]);
  }, [activeId]);

  const searchLower = search.toLowerCase();
  const matchedIds = useMemo(() => {
    if (!search.trim()) return null;
    return new Set(
      allConcepts
        .filter(
          (c) =>
            c.label.toLowerCase().includes(searchLower) ||
            c.sanskrit.includes(search) ||
            c.transliteration.toLowerCase().includes(searchLower) ||
            c.shortDesc.toLowerCase().includes(searchLower),
        )
        .map((c) => c.id),
    );
  }, [search, searchLower]);

  const visibleConcepts = allConcepts.filter((c) => activeCats.has(c.category));
  const visibleIds = new Set(visibleConcepts.map((c) => c.id));
  const mobileConcepts = visibleConcepts.filter((c) => !matchedIds || matchedIds.has(c.id));

  const getNodeRadius = (concept: Concept) => {
    const connCount = concept.connections.length;
    if (concept.category === 'core') return 28 + connCount * 1.5;
    if (connCount >= 5) return 24;
    if (connCount >= 3) return 20;
    return 17;
  };

  // ── Drag handlers ──────────────────────────────────────────────
  const handleNodePointerDown = useCallback((e: ReactPointerEvent<SVGGElement>, id: string) => {
    e.stopPropagation();
    const pos = positions.get(id);
    if (!pos) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / VW, rect.height / VH) * zoom;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      nodeX: pos.x,
      nodeY: pos.y,
    };
    setDraggingNode(id);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, [positions, zoom]);

  const handlePointerMove = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    if (draggingNode && dragStartRef.current) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = Math.min(rect.width / VW, rect.height / VH) * zoom;
      const dx = (e.clientX - dragStartRef.current.x) / scale;
      const dy = (e.clientY - dragStartRef.current.y) / scale;
      setPositions((prev) => {
        const next = new Map(prev);
        next.set(draggingNode, {
          x: dragStartRef.current!.nodeX + dx,
          y: dragStartRef.current!.nodeY + dy,
        });
        return next;
      });
    } else if (panStartRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
    }
  }, [draggingNode, zoom]);

  const handlePointerUp = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    setDraggingNode(null);
    dragStartRef.current = null;
    panStartRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }, []);

  const handleBgPointerDown = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.target === e.currentTarget || (e.target as Element).tagName === 'rect') {
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    }
  }, [pan]);

  const selectedConcept = selectedId ? allConcepts.find((c) => c.id === selectedId) : null;
  const selectedConnections = selectedId ? getConnectedConcepts(selectedId) : [];
  const selectedVerses = selectedId ? getConceptVerses(selectedId) : [];

  const toggleCat = (cat: ConceptCategory) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="concept-graph">
      {/* ── Controls Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dharma-muted" />
          <input
            type="text"
            aria-label="अवधारणाएँ खोजें (Search concepts)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="अवधारणाएँ खोजें..."
            className="min-h-[44px] w-full pl-10 pr-4 py-2.5 rounded-xl bg-dharma-card border border-dharma-border text-sm text-dharma-text placeholder:text-dharma-muted focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 transition"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear concept search"
              onClick={() => setSearch('')}
              className="absolute right-1 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-lg text-dharma-muted hover:text-dharma-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Zoom controls */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
            className="p-2 rounded-lg bg-dharma-card border border-dharma-border hover:bg-saffron-50 transition"
            title="ज़ूम आउट"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-dharma-muted w-12 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            className="p-2 rounded-lg bg-dharma-card border border-dharma-border hover:bg-saffron-50 transition"
            title="ज़ूम इन"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-2 rounded-lg bg-dharma-card border border-dharma-border hover:bg-saffron-50 transition"
            title="दृश्य रीसेट"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Category Filters ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {conceptCategories.map((cat) => {
          const isActive = activeCats.has(cat.key);
          return (
            <button
              key={cat.key}
              onClick={() => toggleCat(cat.key)}
              className={`inline-flex min-h-[44px] items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isActive
                  ? `bg-gradient-to-r ${cat.gradient} text-white border-transparent shadow-md`
                  : 'bg-dharma-card text-dharma-muted border-dharma-border hover:border-saffron-300'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
              <span className={`text-[10px] ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                {allConcepts.filter((c) => c.category === cat.key).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Graph SVG ────────────────────────────────────────────── */}
      <section aria-labelledby="mobile-concepts-heading" className="mb-5 lg:hidden">
        <div className="mb-3">
          <h2 id="mobile-concepts-heading" className="font-serif text-lg font-bold text-dharma-text">
            अवधारणाएँ · Browse concepts
          </h2>
          <p className="mt-1 text-sm text-dharma-muted">
            Expand a concept to read its summary and see its connections.
          </p>
        </div>
        {mobileConcepts.length === 0 ? (
          <p role="status" className="rounded-xl border border-dashed border-dharma-border p-4 text-sm text-dharma-muted">
            No concepts match the current search and filters.
          </p>
        ) : (
          <ul className="space-y-2">
            {mobileConcepts.map((concept) => {
              const connections = getConnectedConcepts(concept.id);
              const category = conceptCategories.find((item) => item.key === concept.category);
              return (
                <li key={concept.id} id={`concept-${concept.id}`} className="rounded-2xl border border-dharma-border bg-dharma-card">
                  <details className="group">
                    <summary className="flex min-h-[56px] cursor-pointer list-none items-center gap-3 rounded-2xl p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 [&::-webkit-details-marker]:hidden">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category?.gradient} font-devanagari text-sm font-bold text-white`} lang="sa">
                        {concept.sanskrit.slice(0, 2)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="font-serif font-bold text-dharma-text">{concept.label}</span>
                          <span lang="sa" className="font-devanagari text-sm text-dharma-muted">{concept.sanskrit}</span>
                        </span>
                        <span className="mt-0.5 block text-xs text-dharma-muted">{category?.label}</span>
                      </span>
                      <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-dharma-muted transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="space-y-3 border-t border-dharma-border/70 px-4 pb-4 pt-3">
                      <p className="text-sm leading-relaxed text-dharma-text">{concept.shortDesc}</p>
                      {connections.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wide text-dharma-muted">
                            Related concepts · संबंधित अवधारणाएँ
                          </h3>
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {connections.map((connection) => (
                              <li key={connection.id}>
                                {articles.has(connection.id) ? (
                                  <Link
                                    href={`/concepts/${connection.id}`}
                                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text hover:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                                  >
                                    <span lang="sa" className="font-devanagari text-saffron-700 dark:text-saffron-300">{connection.sanskrit}</span>
                                    <span>{connection.label}</span>
                                  </Link>
                                ) : (
                                  <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text">
                                    <span lang="sa" className="font-devanagari text-dharma-muted">{connection.sanskrit}</span>
                                    <span>{connection.label}</span>
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {articles.has(concept.id) && (
                        <Link
                          href={`/concepts/${concept.id}`}
                          className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300"
                        >
                          Open concept page <ChevronRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="relative hidden rounded-2xl border border-dharma-border bg-dharma-card overflow-hidden shadow-lg lg:block" style={{ aspectRatio: `${VW}/${VH}` }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handleBgPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            {conceptCategories.map((cat) => (
              <radialGradient key={cat.key} id={`node-grad-${cat.key}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={catColors[cat.key].stroke} />
                <stop offset="100%" stopColor={catColors[cat.key].fill} />
              </radialGradient>
            ))}
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="edge-active" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
            </linearGradient>
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background rect for panning */}
          <rect x={0} y={0} width={VW} height={VH} fill="transparent" />

          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
            {/* ── Edges ───────────────────────────────────────────── */}
            {edges.map(([id1, id2], i) => {
              const p1 = positions.get(id1);
              const p2 = positions.get(id2);
              if (!p1 || !p2) return null;
              if (!visibleIds.has(id1) || !visibleIds.has(id2)) return null;

              const isHighlighted =
                activeId && (id1 === activeId || id2 === activeId);
              const isDimmed = activeId && !isHighlighted;
              const isMatched = matchedIds && (matchedIds.has(id1) || matchedIds.has(id2));

              return (
                <line
                  key={`edge-${i}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isHighlighted ? 'url(#edge-active)' : 'url(#edge-grad)'}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  strokeOpacity={isDimmed ? 0.08 : isMatched && !isHighlighted ? 0.5 : 1}
                  style={{ transition: 'stroke-opacity 0.3s, stroke-width 0.3s' }}
                />
              );
            })}

            {/* ── Nodes ───────────────────────────────────────────── */}
            {allConcepts.map((concept) => {
              const pos = positions.get(concept.id);
              if (!pos) return null;
              if (!visibleIds.has(concept.id)) return null;

              const r = getNodeRadius(concept);
              const colors = catColors[concept.category];
              const isActive = activeId === concept.id;
              const isConnected = connectedIds?.has(concept.id);
              const isDimmed = activeId && !isConnected;
              const isMatched = matchedIds?.has(concept.id);
              const isSearchDimmed = matchedIds && !isMatched;
              const dim = isDimmed || isSearchDimmed;

              return (
                <g
                  key={concept.id}
                  transform={`translate(${pos.x},${pos.y})`}
                  style={{ cursor: 'pointer', opacity: dim ? 0.25 : 1, transition: 'opacity 0.3s' }}
                  onPointerDown={(e) => handleNodePointerDown(e, concept.id)}
                  onPointerEnter={() => !draggingNode && setHoveredId(concept.id)}
                  onPointerLeave={() => !draggingNode && setHoveredId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!draggingNode) setSelectedId(concept.id);
                  }}
                >
                  {/* Glow ring for active node */}
                  {isActive && (
                    <motion.circle
                      r={r + 8}
                      fill="none"
                      stroke={colors.stroke}
                      strokeWidth={2}
                      strokeOpacity={0.6}
                      initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  {/* Matched search ring */}
                  {isMatched && !isActive && (
                    <circle r={r + 5} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeOpacity={0.5} strokeDasharray="4 3" />
                  )}
                  {/* Main circle */}
                  <motion.circle
                    r={r}
                    fill={`url(#node-grad-${concept.category})`}
                    stroke={colors.stroke}
                    strokeWidth={isActive ? 3 : 1.5}
                    filter={isActive ? 'url(#node-glow)' : undefined}
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.02 * allConcepts.indexOf(concept), type: 'spring', stiffness: 200, damping: 18 }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  {/* Sanskrit text inside node */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={concept.sanskrit.length > 3 ? r * 0.42 : r * 0.52}
                    fontWeight="bold"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {concept.sanskrit}
                  </text>
                  {/* English label below node */}
                  <text
                    y={r + 14}
                    textAnchor="middle"
                    fill="var(--dharma-text)"
                    fontSize={11}
                    fontWeight={isActive ? 700 : 500}
                    style={{ pointerEvents: 'none', userSelect: 'none', transition: 'font-weight 0.2s' }}
                  >
                    {concept.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hint overlay */}
        {!selectedId && !search && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-dharma-muted bg-dharma-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-dharma-border pointer-events-none">
            किसी अवधारणा पर क्लिक करें • नोड्स को खींचकर पुनर्व्यवस्थित करें • स्क्रॉल कर पैन करें
          </div>
        )}
      </div>

      {/* ── Detail Panel ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedConcept && (
          <motion.div
            key={selectedConcept.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6 relative bg-dharma-card rounded-2xl border-2 border-dharma-border shadow-xl overflow-hidden"
          >
            {/* Category accent bar */}
            <div className={`h-1.5 bg-gradient-to-r ${
              conceptCategories.find((c) => c.key === selectedConcept.category)?.gradient
            }`} />

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                      conceptCategories.find((c) => c.key === selectedConcept.category)?.gradient
                    } flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                  >
                    {selectedConcept.sanskrit.slice(0, 2)}
                  </div>
                  <div>
                    <p lang="sa" className="font-devanagari text-3xl text-saffron-700 leading-tight">
                      {selectedConcept.sanskrit}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <h3 className="text-xl font-serif font-bold text-dharma-text">
                        {selectedConcept.label}
                      </h3>
                      <span className="text-sm text-dharma-muted italic">
                        ({selectedConcept.transliteration})
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="p-2 rounded-lg text-dharma-muted hover:text-dharma-text hover:bg-saffron-50 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                  conceptCategories.find((c) => c.key === selectedConcept.category)?.gradient
                } text-white`}>
                  {conceptCategories.find((c) => c.key === selectedConcept.category)?.icon}
                  {conceptCategories.find((c) => c.key === selectedConcept.category)?.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-dharma-text leading-relaxed mb-4">
                {selectedConcept.description}
              </p>

              <div className="mb-6">
                {articles.has(selectedConcept.id) ? (
                  <Link
                    href={`/concepts/${selectedConcept.id}`}
                    className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-saffron-500/10 hover:bg-saffron-500/20 text-saffron-800 dark:text-saffron-200 border border-saffron-500/30 font-semibold text-sm transition-all group min-h-[44px]"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
                      <span>गहन शास्त्रीय व्याख्या व व्युत्पत्ति</span>
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <p className="rounded-xl border border-dharma-border bg-dharma-bg/40 p-3 text-sm text-dharma-muted">
                    इसका अलग लेख नहीं है। ऊपर दिया विवरण इसी पृष्ठ का संक्षिप्त रूप है।
                  </p>
                )}
              </div>

              {/* Scripture references */}
              {selectedConcept.scriptureRefs && selectedConcept.scriptureRefs.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2">
                    ग्रंथों में मिलता है
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedConcept.scriptureRefs.map((ref) => (
                      <span
                        key={ref}
                        className="px-3 py-1 bg-saffron-50 text-saffron-800 rounded-full text-xs font-semibold border border-saffron-200"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Verses */}
              {selectedVerses.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    Related Verses ({selectedVerses.length})
                  </p>
                  <div className="space-y-3">
                    {selectedVerses.map((verse, i) => {
                      const verseUrl =
                        verse.scriptureId && verse.chapterId && verse.verseId
                          ? readHref(verse.scriptureId, verse.chapterId, verse.verseId)
                          : verse.scriptureId
                            ? `/scripture/${verse.scriptureId}`
                            : null;
                      return (
                        <div
                          key={i}
                          className="relative rounded-xl border border-dharma-border bg-dharma-bg/40 p-4 hover:border-saffron-200 transition"
                        >
                          <div className="absolute -top-2.5 left-4 w-5 h-5 rounded-full bg-gradient-to-br from-saffron-500 to-amber-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                            {i + 1}
                          </div>
                          <p lang="sa" className="font-devanagari text-base text-dharma-text leading-relaxed mb-2 mt-1">
                            {verse.sanskrit}
                          </p>
                          {verse.transliteration && (
                            <p className="text-xs italic text-dharma-muted mb-2">
                              {verse.transliteration}
                            </p>
                          )}
                          <p className="text-sm text-dharma-text leading-relaxed mb-2">
                            {verse.translation}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider">
                              {verse.reference}
                            </span>
                            {verseUrl && (
                              <Link
                                href={verseUrl}
                                className="inline-flex min-h-[44px] items-center text-xs font-semibold text-saffron-600 hover:text-saffron-800 transition"
                              >
                                Read in context →
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Connected concepts */}
              {selectedConnections.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    संबंधित अवधारणाएँ ({selectedConnections.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedConnections.map((conn) => {
                      const cat = conceptCategories.find((c) => c.key === conn.category);
                      return (
                        <button
                          key={conn.id}
                          onClick={() => setSelectedId(conn.id)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-dharma-border hover:border-saffron-300 bg-dharma-card hover:bg-saffron-50/50 transition-all text-left group"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat?.gradient} flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0`}
                          >
                            {conn.sanskrit.slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p lang="sa" className="font-devanagari text-sm text-saffron-700 leading-tight">
                              {conn.sanskrit}
                            </p>
                            <p className="text-sm font-semibold text-dharma-text truncate">
                              {conn.label}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-dharma-muted group-hover:text-saffron-600 transition flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Legend ───────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {conceptCategories.map((cat) => (
          <div key={cat.key} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full bg-gradient-to-br shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${catColors[cat.key].stroke}, ${catColors[cat.key].fill})`,
              }}
            />
            <span className="text-sm text-dharma-muted">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
