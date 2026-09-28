'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  FolderOpen,
  Filter,
  Maximize2,
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { Entity, Relationship, InvestigationCase } from '@/types/investigation';
import NetworkGraph from '@/components/graph/NetworkGraph';

export default function NetworkPage() {
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  useEffect(() => {
    setCases(InvestigationStore.getCases());
    updateGraphData('all');
  }, []);

  const updateGraphData = (caseId: string) => {
    if (caseId === 'all') {
      setEntities(InvestigationStore.getEntities());
      setRelationships(InvestigationStore.getRelationships());
    } else {
      setEntities(InvestigationStore.getEntities(caseId));
      setRelationships(InvestigationStore.getRelationships(caseId));
    }
  };

  const handleCaseFilterChange = (caseId: string) => {
    setSelectedCaseId(caseId);
    updateGraphData(caseId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] space-y-3">
      {/* Top Header & Case Scope Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1633] p-3.5 rounded-xl border border-[#1e2f5b] shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Interactive Criminal Network Graph
            </h1>
            <p className="text-[11px] text-slate-400 leading-tight">
              Cytoscape.js temporal topological graph with cross-case correlation and centrality scoring
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Scope:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => handleCaseFilterChange(e.target.value)}
              className="bg-[#132042] text-xs font-semibold text-slate-200 px-3 py-1.5 rounded-lg border border-[#23386e] focus:outline-none max-w-[240px] truncate"
            >
              <option value="all">Global (All 5 Cases Interconnected)</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.title.slice(0, 28)}...
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center space-x-3 pl-3 border-l border-[#1e2f5b] text-[11px] font-mono text-slate-400">
            <span>Nodes: <strong className="text-cyan-400 font-bold">{entities.length}</strong></span>
            <span>Edges: <strong className="text-emerald-400 font-bold">{relationships.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Network Canvas */}
      <div className="flex-1 min-h-0 w-full rounded-xl overflow-hidden shadow-xl border border-[#1e2f5b]">
        <NetworkGraph
          entities={entities}
          relationships={relationships}
          selectedCaseId={selectedCaseId === 'all' ? undefined : selectedCaseId}
        />
      </div>
    </div>
  );
}
