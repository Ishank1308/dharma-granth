'use client';

import { useMemo, useState, useRef, useCallback, useEffect, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, ChevronRight, Sparkles, ZoomIn, ZoomOut, Maximize, Users, BookOpen, MessageSquare, Scale, Heart } from 'lucide-react';
import {
  characters as allCharacters,
  characterCategories,
  type Character,
  type CharacterCategory,
} from '@/data/characters';

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

  nodeIds.forEach((id, i) => {
    const angle = (i / nodeIds.length) * Math.PI * 2;
    nodes.set(id, {
      id,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
    });
  });

  for (let iter = 0; iter < iterations; iter++) {
    const k = 0.08;
    const repulsion = 6000;
    const attraction = 0.02;

    nodes.forEach((n) => { n.vx = 0; n.vy = 0; });

    nodes.forEach((a) => {
      nodes.forEach((b) => {
        if (a.id === b.id) return;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const force = repulsion / (dist * dist);
        a.vx += (dx / dist) * force;
        a.vy += (dy / dist) * force;
      });
    });

    edges.forEach(([a, b]) => {
      const na = nodes.get(a);
      const nb = nodes.get(b);
      if (!na || !nb) return;
      const dx = nb.x - na.x;
      const dy = nb.y - na.y;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const force = (dist - 120) * attraction;
      na.vx += (dx / dist) * force;
      nb.vx -= (dx / dist) * force;
      na.vy += (dy / dist) * force;
      nb.vy -= (dy / dist) * force;
    });

    nodes.forEach((n) => {
      const dx = cx - n.x;
      const dy = cy - n.y;
      n.vx += dx * k * 0.5;
      n.vy += dy * k * 0.5;
      n.x += n.vx * 0.1;
      n.y += n.vy * 0.1;
      n.x = Math.max(40, Math.min(width - 40, n.x));
      n.y = Math.max(40, Math.min(height - 40, n.y));
    });
  }

  const result = new Map<string, { x: number; y: number }>();
  nodes.forEach((n) => result.set(n.id, { x: n.x, y: n.y }));
  return result;
}

export function CharacterMap() {
  const reduce = useReducedMotion();
  const [search, setSearch] = useState('');
  const [activeCats, setActiveCats] = useState<Set<CharacterCategory>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const W = 900;
  const H = 600;

  const filtered = useMemo(() => {
    return allCharacters.filter((c) => {
      const matchesSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.sanskrit.includes(search) ||
        c.shortDesc.includes(search);
      const matchesCat = activeCats.size === 0 || activeCats.has(c.category);
      return matchesSearch && matchesCat;
    });
  }, [search, activeCats]);

  const filteredIds = useMemo(() => new Set(filtered.map((c) => c.id)), [filtered]);

  const edges = useMemo(() => {
    const result: [string, string][] = [];
    filtered.forEach((c) => {
      c.relations.forEach((r) => {
        if (r.characterId && filteredIds.has(r.characterId)) {
          result.push([c.id, r.characterId]);
        }
      });
    });
    return result;
  }, [filtered, filteredIds]);

  const positions = useMemo(() => {
    if (filtered.length === 0) return new Map();
    return simulateLayout(filtered.map((c) => c.id), edges, W, H);
  }, [filtered, edges]);

  const selectedCharacter = useMemo(() => {
    return selectedId ? allCharacters.find((c) => c.id === selectedId) : null;
  }, [selectedId]);

  const selectedRelations = useMemo(() => {
    if (!selectedCharacter) return [];
    return selectedCharacter.relations
      .filter((r) => r.characterId)
      .map((r) => ({
        ...r,
        character: allCharacters.find((c) => c.id === r.characterId),
      }))
      .filter((r) => r.character);
  }, [selectedCharacter]);

  const toggleCat = (cat: CharacterCategory) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handlePointerDown = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.target instanceof SVGElement && (e.target as SVGElement).dataset.nodeId) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const handlePointerMove = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  }, []);

  const handlePointerUp = useCallback(() => { dragRef.current = null; }, []);

  useEffect(() => {
    const handler = () => { dragRef.current = null; };
    window.addEventListener('pointerup', handler);
    return () => window.removeEventListener('pointerup', handler);
  }, []);

  const getCatStyle = (cat: CharacterCategory) => characterCategories.find((c) => c.key === cat);

  return (
    <div className="character-map">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dharma-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="पात्र खोजें..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dharma-card border border-dharma-border text-sm text-dharma-text placeholder:text-dharma-muted focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-dharma-muted hover:text-dharma-text">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} className="p-2 rounded-lg bg-dharma-card border border-dharma-border hover:bg-saffron-50 transition" title="ज़ूम आउट">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-dharma-muted w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))} className="p-2 rounded-lg bg-dharma-card border border-dharma-border hover:bg-saffron-50 transition" title="ज़ूम इन">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 rounded-lg bg-dharma-card border border-dharma-border hover:bg-saffron-50 transition" title="दृश्य रीसेट">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {characterCategories.map((cat) => {
          const isActive = activeCats.has(cat.key);
          return (
            <button
              key={cat.key}
              onClick={() => toggleCat(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isActive
                  ? `bg-gradient-to-r ${cat.gradient} text-white border-transparent shadow-md`
                  : 'bg-dharma-card text-dharma-muted border-dharma-border hover:border-saffron-300'
              }`}
            >
              <span className="mr-1">👤</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Graph + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Graph */}
        <div className="relative bg-dharma-card/30 border border-dharma-border rounded-2xl overflow-hidden" style={{ height: H + 40 }}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${W} ${H}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="cursor-grab active:cursor-grabbing touch-none"
            style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, transformOrigin: 'center' }}
          >
            {/* Edges */}
            <g>
              {edges.map(([a, b], i) => {
                const pa = positions.get(a);
                const pb = positions.get(b);
                if (!pa || !pb) return null;
                const isHighlighted = selectedId === a || selectedId === b;
                return (
                  <line
                    key={i}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    className={isHighlighted ? 'stroke-saffron-400' : 'stroke-dharma-border'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    opacity={selectedId && !isHighlighted ? 0.2 : 0.5}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {filtered.map((char) => {
                const pos = positions.get(char.id);
                if (!pos) return null;
                const cat = getCatStyle(char.category);
                const isSelected = selectedId === char.id;
                const isDimmed = selectedId && !isSelected;
                return (
                  <g
                    key={char.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(isSelected ? null : char.id)}
                    data-node-id={char.id}
                  >
                    <circle
                      r={isSelected ? 28 : 22}
                      className={isSelected ? 'fill-saffron-200' : 'fill-dharma-card'}
                      stroke={isSelected ? '#f97316' : '#d4c5b0'}
                      strokeWidth={isSelected ? 3 : 2}
                      opacity={isDimmed ? 0.3 : 1}
                    />
                    <text
                      textAnchor="middle"
                      dy="-2"
                      className="pointer-events-none"
                      fontSize="18"
                      opacity={isDimmed ? 0.3 : 1}
                    >
                      {char.icon}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="20"
                      className="pointer-events-none fill-dharma-text font-semibold"
                      fontSize="11"
                      opacity={isDimmed ? 0.3 : 1}
                    >
                      {char.name.length > 12 ? char.name.slice(0, 11) + '…' : char.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Hint overlay */}
          {!selectedId && !search && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-dharma-muted bg-dharma-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-dharma-border pointer-events-none">
              किसी पात्र पर क्लिक करें • ड्रैग कर पैन करें • स्क्रॉल कर ज़ूम करें
            </div>
          )}
        </div>

        {/* Detail Panel. initial={false}: the first panel is server-rendered visible; later switches animate. */}
        <AnimatePresence mode="wait" initial={false}>
          {selectedCharacter ? (
            <motion.div
              key={selectedCharacter.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-dharma-card border border-dharma-border rounded-2xl p-6 overflow-y-auto"
              style={{ maxHeight: H + 40 }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedCharacter.gradient} flex items-center justify-center text-2xl shrink-0`}>
                  {selectedCharacter.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-serif font-bold text-dharma-text">{selectedCharacter.name}</h3>
                  <p className="text-sm text-saffron-700 font-semibold">{selectedCharacter.sanskrit}</p>
                  <p className="text-xs text-dharma-muted mt-1">{selectedCharacter.shortDesc}</p>
                </div>
                <button onClick={() => setSelectedId(null)} className="text-dharma-muted hover:text-dharma-text shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Biography */}
              <div className="mb-6">
                <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" /> जीवनी (Biography)
                </p>
                <p className="text-sm text-dharma-text leading-relaxed">{selectedCharacter.biography}</p>
              </div>

              {/* Family */}
              {selectedCharacter.relations.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> परिवार और संबंध (Family)
                  </p>
                  <div className="space-y-1.5">
                    {selectedCharacter.relations.map((rel, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-dharma-text font-medium">{rel.name}</span>
                        <span className="text-dharma-muted text-xs">{rel.relation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Major Events */}
              {selectedCharacter.events.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> प्रमुख घटनाएँ (Major Events)
                  </p>
                  <div className="space-y-3">
                    {selectedCharacter.events.map((event, i) => (
                      <div key={i} className="border-l-2 border-saffron-300 pl-3">
                        <p className="text-sm font-semibold text-dharma-text">{event.title}</p>
                        <p className="text-xs text-dharma-muted mt-0.5">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dialogues */}
              {selectedCharacter.dialogues.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" /> महत्वपूर्ण संवाद (Dialogues)
                  </p>
                  <div className="space-y-3">
                    {selectedCharacter.dialogues.map((d, i) => (
                      <div key={i} className="bg-saffron-50/50 rounded-xl p-3 border border-saffron-100">
                        <p className="text-sm italic text-dharma-text leading-relaxed">&ldquo;{d.text}&rdquo;</p>
                        <p className="text-xs text-dharma-muted mt-1.5">— {d.speaker}, {d.context}</p>
                        <p className="text-xs text-saffron-700 font-semibold mt-0.5">{d.reference}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ethical Dilemmas */}
              {selectedCharacter.dilemmas.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scale className="w-3 h-3" /> नैतिक दुविधाएँ (Ethical Dilemmas)
                  </p>
                  <div className="space-y-3">
                    {selectedCharacter.dilemmas.map((d, i) => (
                      <div key={i} className="bg-dharma-card border border-dharma-border rounded-xl p-3">
                        <p className="text-sm font-semibold text-dharma-text">{d.title}</p>
                        <p className="text-xs text-dharma-muted mt-1">{d.description}</p>
                        <p className="text-xs text-emerald-700 mt-1.5 font-medium">समाधान: {d.resolution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Verses */}
              {selectedCharacter.verses.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> संबंधित श्लोक (Related Verses)
                  </p>
                  <div className="space-y-2">
                    {selectedCharacter.verses.map((v, i) => (
                      <div key={i} className="bg-dharma-card border border-dharma-border rounded-xl p-3">
                        <p className="text-sm font-serif text-saffron-800">{v.sanskrit}</p>
                        {v.transliteration && <p className="text-xs text-dharma-muted italic mt-1">{v.transliteration}</p>}
                        <p className="text-sm text-dharma-text mt-1">{v.translation}</p>
                        <p className="text-xs text-saffron-700 font-semibold mt-0.5">{v.reference}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interpretations */}
              {selectedCharacter.interpretations.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Heart className="w-3 h-3" /> परंपराओं में व्याख्या (Interpretations)
                  </p>
                  <div className="space-y-2">
                    {selectedCharacter.interpretations.map((interp, i) => (
                      <div key={i} className="bg-dharma-card border border-dharma-border rounded-xl p-3">
                        <p className="text-xs font-bold text-saffron-700 mb-1">{interp.tradition}</p>
                        <p className="text-xs text-dharma-text leading-relaxed">{interp.view}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-dharma-card/50 border border-dharma-border rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              style={{ minHeight: 200 }}
            >
              <Users className="w-12 h-12 text-dharma-muted mb-3" />
              <p className="text-sm text-dharma-muted">
                किसी पात्र पर क्लिक करें जीवनी, परिवार, घटनाएँ, संवाद, नैतिक दुविधाएँ, श्लोक और व्याख्याएँ देखने के लिए।
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
