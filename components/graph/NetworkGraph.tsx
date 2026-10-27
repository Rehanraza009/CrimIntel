'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, NodeSingular, EdgeSingular } from 'cytoscape';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Route,
  Layers,
  FileCheck2,
  AlertTriangle,
  X,
  Share2,
  Compass,
  ArrowUpRight,
  Shield,
  Download,
  Info,
  Calendar,
  FileText,
} from 'lucide-react';
import { useTheme } from '@/lib/themeContext';
import { Entity, Relationship, EntityType, RelationshipType } from '@/types/investigation';

interface NetworkGraphProps {
  entities: Entity[];
  relationships: Relationship[];
  selectedCaseId?: string;
  onNodeSelect?: (entity: Entity | null) => void;
  onEdgeSelect?: (relationship: Relationship | null) => void;
  className?: string;
}

const ENTITY_COLORS: Record<EntityType, string> = {
  PERSON: '#3b82f6', // Blue
  PHONE: '#06b6d4', // Cyan
  EMAIL: '#8b5cf6', // Purple
  ACCOUNT: '#10b981', // Emerald
  VEHICLE: '#f59e0b', // Amber
  LOCATION: '#f43f5e', // Rose
  ORGANIZATION: '#a855f7', // Violet
  CASE: '#64748b', // Slate
  EVENT: '#eab308', // Yellow
  DATE: '#94a3b8',
  TRANSACTION: '#ec4899',
};

const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  CALLED: '#38bdf8',
  TRANSFERRED: '#34d399',
  OWNED: '#fbbf24',
  LOCATED_AT: '#f87171',
  ASSOCIATED_WITH: '#94a3b8',
  WORKS_FOR: '#c084fc',
  VISITED: '#fb923c',
  COMMUNICATED_WITH: '#22d3ee',
  PART_OF_CASE: '#64748b',
  RELATED_TO: '#cbd5e1',
  INVOLVED_IN: '#f43f5e',
  TRANSACTED_WITH: '#4ade80',
};

export default function NetworkGraph({
  entities,
  relationships,
  selectedCaseId,
  onNodeSelect,
  onEdgeSelect,
  className = '',
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedNode, setSelectedNode] = useState<Entity | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Relationship | null>(null);
  const [layoutName, setLayoutName] = useState<string>('cose');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pathSourceId, setPathSourceId] = useState<string>('');
  const [pathTargetId, setPathTargetId] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Record<EntityType, boolean>>({
    PERSON: true,
    PHONE: true,
    EMAIL: true,
    ACCOUNT: true,
    VEHICLE: true,
    LOCATION: true,
    ORGANIZATION: true,
    CASE: true,
    EVENT: true,
    DATE: true,
    TRANSACTION: true,
  });

  // Initialize or Re-style Cytoscape Instance
  useEffect(() => {
    if (!containerRef.current) return;

    const validEntityIds = new Set(entities.map((e) => e.id));
    const validRelationships = relationships.filter(
      (r) => validEntityIds.has(r.sourceEntityId) && validEntityIds.has(r.targetEntityId)
    );

    const elements = [
      ...entities.map((e) => {
        const isCrossCase = e.connectedCases && e.connectedCases.length > 1;
        return {
          group: 'nodes' as const,
          data: {
            id: e.id,
            label: e.name,
            entityType: e.entityType,
            confidence: e.confidence,
            color: ENTITY_COLORS[e.entityType] || '#3b82f6',
            isCrossCase: isCrossCase ? 'yes' : 'no',
            degree: e.degreeCentrality || 0.1,
            rawEntity: e,
          },
        };
      }),
      ...validRelationships.map((r) => ({
        group: 'edges' as const,
        data: {
          id: r.id,
          source: r.sourceEntityId,
          target: r.targetEntityId,
          label: r.relationshipType,
          color: RELATIONSHIP_COLORS[r.relationshipType] || '#64748b',
          confidence: r.confidence,
          rawRelationship: r,
        },
      })),
    ];

    const nodeLabelColor = isDark ? '#f8fafc' : '#172033';
    const nodeTextBg = isDark ? '#091124' : '#ffffff';
    const edgeLabelColor = isDark ? '#94a3b8' : '#475569';
    const edgeTextBg = isDark ? '#091124' : '#ffffff';

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            label: 'data(label)',
            color: nodeLabelColor,
            'font-size': '11px',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-opacity': 0.9,
            'text-background-color': nodeTextBg,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            width: '38px',
            height: '38px',
            'border-width': 2,
            'border-color': isDark ? '#ffffff' : '#cbd5e1',
            'border-opacity': isDark ? 0.6 : 0.9,
            'overlay-opacity': 0,
          },
        },
        {
          selector: 'node[isCrossCase = "yes"]',
          style: {
            'border-width': 4,
            'border-color': '#f43f5e',
            'border-opacity': 1.0,
            width: '46px',
            height: '46px',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(label)',
            'font-size': '9px',
            color: edgeLabelColor,
            'text-rotation': 'autorotate',
            'text-background-opacity': 0.9,
            'text-background-color': edgeTextBg,
            'text-background-padding': '2px',
            'arrow-scale': 0.9,
            opacity: 0.85,
          },
        },
        {
          selector: ':selected',
          style: {
            'border-width': 4,
            'border-color': '#38bdf8',
            'line-color': '#38bdf8',
            'target-arrow-color': '#38bdf8',
            'shadow-blur': 12,
            'shadow-color': '#38bdf8',
            'shadow-opacity': 0.8,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'border-width': 5,
            'border-color': '#fbbf24',
            'line-color': '#fbbf24',
            'target-arrow-color': '#fbbf24',
            opacity: 1,
            'z-index': 999,
          },
        },
        {
          selector: '.dimmed',
          style: {
            opacity: 0.15,
          },
        },
      ],
      layout: {
        name: layoutName,
        padding: 40,
        animate: false,
        nodeDimensionsIncludeLabels: false,
        numIter: 250,
      } as any,
      minZoom: 0.2,
      maxZoom: 3.5,
    });

    // Node Click Listener
    cy.on('tap', 'node', (evt) => {
      const node = evt.target as NodeSingular;
      const entity = node.data('rawEntity') as Entity;
      setSelectedNode(entity);
      setSelectedEdge(null);
      if (onNodeSelect) onNodeSelect(entity);

      // Highlight neighborhood (1-hop)
      cy.elements().removeClass('highlighted dimmed');
      const neighborhood = node.neighborhood().add(node);
      cy.elements().not(neighborhood).addClass('dimmed');
      neighborhood.addClass('highlighted');
    });

    // Edge Click Listener
    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target as EdgeSingular;
      const rel = edge.data('rawRelationship') as Relationship;
      setSelectedEdge(rel);
      setSelectedNode(null);
      if (onEdgeSelect) onEdgeSelect(rel);

      cy.elements().removeClass('highlighted dimmed');
      edge.addClass('highlighted');
      edge.connectedNodes().addClass('highlighted');
    });

    // Canvas Background Click: Reset highlights
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        cy.elements().removeClass('highlighted dimmed');
        setSelectedNode(null);
        setSelectedEdge(null);
        if (onNodeSelect) onNodeSelect(null);
        if (onEdgeSelect) onEdgeSelect(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [entities, relationships]);

  // Instant filter toggle without destroying graph
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.batch(() => {
      cy.nodes().forEach((node) => {
        const type = node.data('entityType') as EntityType;
        if (activeFilters[type] === false) {
          node.style('display', 'none');
        } else {
          node.style('display', 'element');
        }
      });
    });
  }, [activeFilters]);

  // Instant layout update
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.layout({
      name: layoutName,
      padding: 40,
      animate: false,
      nodeDimensionsIncludeLabels: false,
      numIter: 250,
    } as any).run();
  }, [layoutName]);

  // Instant theme update
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const nodeLabelColor = isDark ? '#f8fafc' : '#172033';
    const nodeTextBg = isDark ? '#091124' : '#ffffff';
    const edgeLabelColor = isDark ? '#94a3b8' : '#475569';
    const edgeTextBg = isDark ? '#091124' : '#ffffff';
    cy.batch(() => {
      cy.nodes().style({
        color: nodeLabelColor,
        'text-background-color': nodeTextBg,
      });
      cy.edges().style({
        color: edgeLabelColor,
        'text-background-color': edgeTextBg,
      });
    });
  }, [isDark]);

  // Handle Search in Graph
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const cy = cyRef.current;
    if (!cy) return;

    if (!term.trim()) {
      cy.elements().removeClass('highlighted dimmed');
      return;
    }

    const matches = cy.nodes().filter((node) => {
      const label = node.data('label') || '';
      return label.toLowerCase().includes(term.toLowerCase());
    });

    if (matches.length > 0) {
      cy.elements().addClass('dimmed');
      matches.removeClass('dimmed').addClass('highlighted');
      matches.neighborhood().removeClass('dimmed').addClass('highlighted');
      cy.animate({
        center: { eles: matches },
        zoom: 1.2,
        duration: 400,
      });
    }
  };

  // Find Shortest Path
  const handleFindShortestPath = () => {
    const cy = cyRef.current;
    if (!cy || !pathSourceId || !pathTargetId) return;

    const sourceNode = cy.getElementById(pathSourceId);
    const targetNode = cy.getElementById(pathTargetId);

    if (sourceNode.nonempty() && targetNode.nonempty()) {
      const aStar = cy.elements().aStar({
        root: sourceNode,
        goal: targetNode,
        directed: false,
      });

      cy.elements().removeClass('highlighted dimmed');
      if (aStar.found) {
        cy.elements().addClass('dimmed');
        aStar.path.removeClass('dimmed').addClass('highlighted');
        cy.animate({
          fit: { eles: aStar.path, padding: 50 },
          duration: 500,
        });
      } else {
        alert('No path found between selected entities.');
      }
    }
  };

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 40);
  const handleExportPng = () => {
    if (!cyRef.current) return;
    const bg = isDark ? '#0b1220' : '#f5f7fb';
    const png64 = cyRef.current.png({ full: true, bg });
    const link = document.createElement('a');
    link.href = png64;
    link.download = `CrimIntel_Network_Graph_${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  };

  return (
    <div
      className={`relative flex h-full w-full bg-[var(--bg-page)] border border-slate-200 dark:border-[#263650] rounded-2xl overflow-hidden shadow-sm transition-colors duration-200 ${className}`}
    >
      {/* Top Controls Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-white/90 dark:bg-[#111c30]/90 backdrop-blur-md border border-slate-200 dark:border-[#263650] p-1.5 rounded-xl shadow-lg">
        {/* Node Search */}
        <div className="relative w-44">
          <input
            type="text"
            placeholder="Search graph nodes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f172a] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-7 pr-2 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
        </div>

        {/* Layout Selector */}
        <select
          value={layoutName}
          onChange={(e) => setLayoutName(e.target.value)}
          className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
        >
          <option value="cose">Force Directed (CoSE)</option>
          <option value="concentric">Concentric Centrality</option>
          <option value="breadthfirst">Hierarchical Tree</option>
          <option value="circle">Circular Ring</option>
          <option value="grid">Orthogonal Grid</option>
        </select>

        {/* Zoom & Fit Actions */}
        <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-[#263650] pl-1.5">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFit}
            title="Fit Graph to Viewport"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200 transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExportPng}
            title="Export Network Diagram (PNG)"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-[#16243e] text-blue-600 dark:text-blue-400 transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Entity Type Legend / Filter Toggles */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-[#111c30]/90 backdrop-blur-md border border-slate-200 dark:border-[#263650] p-2.5 rounded-xl text-xs max-w-xs shadow-lg hidden sm:block">
        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Entity Legend & Filter</span>
          <span className="text-[9px] text-slate-400">Click to toggle</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {(['PERSON', 'PHONE', 'ACCOUNT', 'VEHICLE', 'LOCATION', 'ORGANIZATION'] as EntityType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setActiveFilters((prev) => ({ ...prev, [type]: !prev[type] }))}
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-md transition ${
                  activeFilters[type]
                    ? 'bg-slate-100 dark:bg-[#16243e] text-slate-800 dark:text-slate-200 font-medium'
                    : 'opacity-40 text-slate-400 line-through'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: ENTITY_COLORS[type] }}
                />
                <span className="truncate">{type}</span>
              </button>
            )
          )}
        </div>
        <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-[#1e2f5b] text-[10px] text-rose-600 dark:text-rose-400 flex items-center space-x-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-rose-500 bg-rose-500/20 flex-shrink-0"></span>
          <span>Red halo = Cross-Case Linked Entity</span>
        </div>
      </div>

      {/* Main Cytoscape Canvas */}
      <div ref={containerRef} className="cytoscape-container flex-1" />

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div className="w-80 sm:w-96 bg-white dark:bg-[#111c30] border-l border-slate-200 dark:border-[#263650] p-5 flex flex-col z-20 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b]">
            <div className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ENTITY_COLORS[selectedNode.entityType] }}
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {selectedNode.entityType} Profile
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedNode(null);
                cyRef.current?.elements().removeClass('highlighted dimmed');
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {selectedNode.name}
              </h3>
              {selectedNode.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {selectedNode.description}
                </p>
              )}
            </div>

            {/* Cross-case notice */}
            {selectedNode.connectedCases && selectedNode.connectedCases.length > 1 && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs">
                <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>Cross-Case Link Detected</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  This entity is cross-referenced in multiple cases: <strong>{selectedNode.connectedCases.join(', ')}</strong>
                </div>
              </div>
            )}

            {/* Verified Identifiers */}
            {selectedNode.identifiers && selectedNode.identifiers.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Verified Identifiers
                </div>
                {selectedNode.identifiers.map((id) => (
                  <div
                    key={id.id}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] text-xs"
                  >
                    <div className="text-[10px] text-slate-400">{id.identifierType}</div>
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200 select-all">
                      {id.identifierValue}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Plain-Language Assessment */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Match Confidence:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {(selectedNode.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Assigned Docket:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {selectedNode.caseNumber || 'Global Entity'}
                </span>
              </div>
            </div>

            {/* Pathfinding Controls */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#1e2f5b] space-y-2">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Investigative Path Finding
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPathSourceId(selectedNode.id)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition ${
                    pathSourceId === selectedNode.id
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-50 dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#263650]'
                  }`}
                >
                  Set as Origin
                </button>
                <button
                  onClick={() => setPathTargetId(selectedNode.id)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition ${
                    pathTargetId === selectedNode.id
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-50 dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#263650]'
                  }`}
                >
                  Set as Target
                </button>
              </div>

              {pathSourceId && pathTargetId && (
                <button
                  onClick={handleFindShortestPath}
                  className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 shadow"
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>Highlight Connection Path</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Relationship / Edge Inspector Drawer with Plain-Language Explanations */}
      {selectedEdge && (
        <div className="w-80 sm:w-96 bg-white dark:bg-[#111c30] border-l border-slate-200 dark:border-[#263650] p-5 flex flex-col z-20 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Connection Inspector
            </span>
            <button
              onClick={() => {
                setSelectedEdge(null);
                cyRef.current?.elements().removeClass('highlighted dimmed');
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="inline-block px-2.5 py-1 rounded-md text-xs font-bold tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
              {selectedEdge.relationshipType.replace(/_/g, ' ')}
            </div>

            {/* Connected Entities Flow */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b]">
                <div className="text-[10px] text-slate-400">Source Record</div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedEdge.sourceEntityName || 'Entity A'}
                </div>
              </div>

              <div className="text-center text-slate-400 text-xs font-bold">↓</div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b]">
                <div className="text-[10px] text-slate-400">Target Record</div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedEdge.targetEntityName || 'Entity B'}
                </div>
              </div>
            </div>

            {/* Plain-Language Explanation (Section 7 Requirement) */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-1.5 font-bold text-blue-700 dark:text-blue-300 mb-1">
                <Info className="w-4 h-4 text-blue-500" />
                <span>Plain-Language Finding</span>
              </div>
              <p className="leading-relaxed">
                Both records are linked by an observed <strong>{selectedEdge.relationshipType.toLowerCase()}</strong> connection in the evidence log. This indicates an operational relationship between the two entities, requiring investigator verification.
              </p>
            </div>

            {/* Exact Evidence Provenance Citation */}
            {selectedEdge.provenance ? (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] text-xs space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Evidence Source Reference</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-[11px] space-y-0.5">
                  <div><strong>Document:</strong> {selectedEdge.provenance.evidenceFileName}</div>
                  {selectedEdge.provenance.recordIndex !== undefined && (
                    <div><strong>Log Entry / Row:</strong> #{selectedEdge.provenance.recordIndex}</div>
                  )}
                  {selectedEdge.provenance.pageNumber !== undefined && (
                    <div><strong>Page Number:</strong> {selectedEdge.provenance.pageNumber}</div>
                  )}
                  {selectedEdge.provenance.rawExcerpt && (
                    <div className="mt-2 p-2 rounded-lg bg-white dark:bg-black/30 border border-slate-200 dark:border-[#263650] text-[10px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{selectedEdge.provenance.rawExcerpt}"
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-2 text-xs text-slate-400 bg-slate-50 dark:bg-[#0f172a] rounded">
                Direct raw excerpt not attached to this edge.
              </div>
            )}

            {/* Timestamps */}
            {selectedEdge.startTime && (
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Observed: {new Date(selectedEdge.startTime).toLocaleDateString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
