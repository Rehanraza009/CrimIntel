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
  Download
} from 'lucide-react';
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

  // Initialize Cytoscape Instance
  useEffect(() => {
    if (!containerRef.current) return;

    // Filter entities and relationships
    const filteredEntities = entities.filter(e => activeFilters[e.entityType] !== false);
    const validEntityIds = new Set(filteredEntities.map(e => e.id));
    const filteredRelationships = relationships.filter(
      r => validEntityIds.has(r.sourceEntityId) && validEntityIds.has(r.targetEntityId)
    );

    const elements = [
      ...filteredEntities.map(e => {
        const isCrossCase = (e.connectedCases && e.connectedCases.length > 1);
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
      ...filteredRelationships.map(r => ({
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

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#f8fafc',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-opacity': 0.85,
            'text-background-color': '#091124',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'width': '38px',
            'height': '38px',
            'border-width': 2,
            'border-color': '#ffffff',
            'border-opacity': 0.6,
            'overlay-opacity': 0,
          },
        },
        {
          selector: 'node[isCrossCase = "yes"]',
          style: {
            'border-width': 4,
            'border-color': '#f43f5e',
            'border-opacity': 1.0,
            'width': '46px',
            'height': '46px',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '9px',
            'color': '#94a3b8',
            'text-rotation': 'autorotate',
            'text-background-opacity': 0.9,
            'text-background-color': '#091124',
            'text-background-padding': '2px',
            'arrow-scale': 0.9,
            'opacity': 0.8,
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
            'opacity': 1,
            'z-index': 999,
          },
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.15,
          },
        },
      ],
      layout: {
        name: layoutName,
        padding: 50,
        animate: true,
        animationDuration: 500,
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
  }, [entities, relationships, activeFilters, layoutName]);

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
    const png64 = cyRef.current.png({ full: true, bg: '#091124' });
    const link = document.createElement('a');
    link.href = png64;
    link.download = `CrimIntel_Network_Graph_${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  };

  return (
    <div className={`relative flex h-full w-full bg-[#080d1f] border border-[#18274d] rounded-lg overflow-hidden ${className}`}>
      {/* Top Controls Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-[#0d1633]/90 backdrop-blur border border-[#1e2f5b] p-1.5 rounded-lg shadow-lg">
        {/* Node Search */}
        <div className="relative w-44">
          <input
            type="text"
            placeholder="Filter nodes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-[#132042] text-xs text-slate-100 placeholder-slate-400 pl-7 pr-2 py-1 rounded border border-[#23386e] focus:outline-none focus:border-blue-400"
          />
          <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
        </div>

        {/* Layout Selector */}
        <select
          value={layoutName}
          onChange={(e) => setLayoutName(e.target.value)}
          className="bg-[#132042] text-xs text-slate-200 px-2 py-1 rounded border border-[#23386e] focus:outline-none"
        >
          <option value="cose">Force Directed (CoSE)</option>
          <option value="concentric">Concentric Centrality</option>
          <option value="breadthfirst">Hierarchical Tree</option>
          <option value="circle">Circular Ring</option>
          <option value="grid">Orthogonal Grid</option>
        </select>

        {/* Zoom & Fit Actions */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1 rounded bg-[#132042] hover:bg-[#1b2d5c] text-slate-200 transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1 rounded bg-[#132042] hover:bg-[#1b2d5c] text-slate-200 transition"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFit}
          title="Fit Graph to Viewport"
          className="p-1 rounded bg-[#132042] hover:bg-[#1b2d5c] text-slate-200 transition"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleExportPng}
          title="Export Network Diagram (PNG)"
          className="p-1 rounded bg-[#132042] hover:bg-[#1b2d5c] text-slate-200 transition"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>

      {/* Entity Type Legend / Filter Toggles */}
      <div className="absolute bottom-3 left-3 z-10 bg-[#0d1633]/90 backdrop-blur border border-[#1e2f5b] p-2 rounded-lg text-xs max-w-xs shadow-lg hidden sm:block">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Entity Legend & Filter</span>
          <span className="text-[9px] text-slate-400">Click to toggle</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          {(['PERSON', 'PHONE', 'ACCOUNT', 'VEHICLE', 'LOCATION', 'ORGANIZATION'] as EntityType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }))}
              className={`flex items-center space-x-1.5 px-1.5 py-0.5 rounded transition ${
                activeFilters[type] ? 'bg-[#152244] text-slate-200' : 'opacity-40 text-slate-400 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ENTITY_COLORS[type] }}></span>
              <span>{type}</span>
            </button>
          ))}
        </div>
        <div className="mt-1 pt-1 border-t border-[#1e2f5b] text-[10px] text-rose-400 flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full border border-rose-500 bg-rose-500/20"></span>
          <span>Red border = Cross-Case Linked Entity</span>
        </div>
      </div>

      {/* Main Cytoscape Canvas */}
      <div ref={containerRef} className="cytoscape-container flex-1" />

      {/* Inspector Sidebar for Selected Node or Edge */}
      {selectedNode && (
        <div className="w-80 bg-[#0d1633] border-l border-[#1e2f5b] p-4 flex flex-col z-20 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e2f5b]">
            <div className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ENTITY_COLORS[selectedNode.entityType] }}
              ></span>
              <span className="text-xs font-semibold text-slate-400">{selectedNode.entityType}</span>
            </div>
            <button
              onClick={() => {
                setSelectedNode(null);
                cyRef.current?.elements().removeClass('highlighted dimmed');
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-bold text-slate-100">{selectedNode.name}</h3>
            {selectedNode.description && (
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedNode.description}</p>
            )}

            {/* Cross-case notice */}
            {selectedNode.connectedCases && selectedNode.connectedCases.length > 1 && (
              <div className="mt-3 p-2 rounded bg-rose-500/10 border border-rose-500/30 text-xs">
                <div className="font-semibold text-rose-300 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Cross-Case Link Detected</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Appears in: {selectedNode.connectedCases.join(', ')}
                </div>
              </div>
            )}

            {/* Identifiers */}
            {selectedNode.identifiers && selectedNode.identifiers.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Verified Identifiers
                </div>
                <div className="space-y-1.5">
                  {selectedNode.identifiers.map((id) => (
                    <div key={id.id} className="bg-[#132042] p-1.5 rounded border border-[#23386e] text-xs">
                      <div className="text-[10px] text-slate-400">{id.identifierType}</div>
                      <div className="font-mono text-slate-200 select-all">{id.identifierValue}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Node Metadata & Degree */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#18274d]">
                <span className="text-slate-400">Confidence Score:</span>
                <span className="font-semibold text-emerald-400">{(selectedNode.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#18274d]">
                <span className="text-slate-400">Risk Assessment:</span>
                <span className="font-semibold text-amber-400">{selectedNode.riskIndicator || 'INVESTIGATIVE LEAD'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#18274d]">
                <span className="text-slate-400">Associated Case:</span>
                <span className="font-semibold text-blue-300">{selectedNode.caseNumber || 'Global Entity'}</span>
              </div>
            </div>

            {/* Pathfinding helper */}
            <div className="mt-6 pt-4 border-t border-[#1e2f5b]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Path Analysis
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPathSourceId(selectedNode.id)}
                  className={`flex-1 py-1 text-xs rounded border transition ${
                    pathSourceId === selectedNode.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-[#132042] text-slate-300 border-[#23386e]'
                  }`}
                >
                  Set Origin
                </button>
                <button
                  onClick={() => setPathTargetId(selectedNode.id)}
                  className={`flex-1 py-1 text-xs rounded border transition ${
                    pathTargetId === selectedNode.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-[#132042] text-slate-300 border-[#23386e]'
                  }`}
                >
                  Set Destination
                </button>
              </div>
              {pathSourceId && pathTargetId && (
                <button
                  onClick={handleFindShortestPath}
                  className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition flex items-center justify-center space-x-1"
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>Find Connection Path</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedEdge && (
        <div className="w-80 bg-[#0d1633] border-l border-[#1e2f5b] p-4 flex flex-col z-20 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e2f5b]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Relationship Inspector</span>
            <button
              onClick={() => {
                setSelectedEdge(null);
                cyRef.current?.elements().removeClass('highlighted dimmed');
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3">
            <div className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {selectedEdge.relationshipType}
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="p-2 rounded bg-[#132042] border border-[#23386e]">
                <div className="text-[10px] text-slate-400">Source Entity</div>
                <div className="font-semibold text-slate-100">{selectedEdge.sourceEntityName || 'Entity A'}</div>
              </div>
              <div className="text-center text-slate-500 text-xs font-bold">↓</div>
              <div className="p-2 rounded bg-[#132042] border border-[#23386e]">
                <div className="text-[10px] text-slate-400">Target Entity</div>
                <div className="font-semibold text-slate-100">{selectedEdge.targetEntityName || 'Entity B'}</div>
              </div>
            </div>

            {/* Provenance Details */}
            {selectedEdge.provenance ? (
              <div className="mt-4 p-2.5 rounded bg-[#101b38] border border-blue-500/30 text-xs">
                <div className="font-semibold text-blue-300 flex items-center space-x-1 mb-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Evidence Provenance</span>
                </div>
                <div className="text-slate-300 text-[11px] space-y-1">
                  <div><strong>File:</strong> {selectedEdge.provenance.evidenceFileName}</div>
                  {selectedEdge.provenance.recordIndex !== undefined && (
                    <div><strong>Row / Record:</strong> #{selectedEdge.provenance.recordIndex}</div>
                  )}
                  {selectedEdge.provenance.pageNumber !== undefined && (
                    <div><strong>Page:</strong> {selectedEdge.provenance.pageNumber}</div>
                  )}
                  {selectedEdge.provenance.rawExcerpt && (
                    <div className="mt-1.5 p-1.5 rounded bg-[#091124] text-[10px] font-mono text-slate-300 border border-[#1e2f5b] leading-relaxed">
                      "{selectedEdge.provenance.rawExcerpt}"
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-2 text-xs text-slate-400 bg-[#132042] rounded">
                Direct evidence provenance not attached to this edge.
              </div>
            )}

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#18274d]">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-semibold text-emerald-400">{(selectedEdge.confidence * 100).toFixed(0)}%</span>
              </div>
              {selectedEdge.startTime && (
                <div className="flex justify-between py-1 border-b border-[#18274d]">
                  <span className="text-slate-400">Observed Time:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{new Date(selectedEdge.startTime).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
