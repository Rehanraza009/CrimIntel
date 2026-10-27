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
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { Entity, Relationship, InvestigationCase } from '@/types/investigation';
import NetworkGraph from '@/components/graph/NetworkGraph';
import { TerminologyModal } from '@/components/common/TerminologyModal';

export default function NetworkPage() {
  const [cases, setCases] = useState<InvestigationCase[]>(() => InvestigationStore.getCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [entities, setEntities] = useState<Entity[]>(() => InvestigationStore.getEntities());
  const [relationships, setRelationships] = useState<Relationship[]>(() => InvestigationStore.getRelationships());
  const [showGuide, setShowGuide] = useState(false);

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
    <div className="flex flex-col h-[calc(100vh-5.5rem)] space-y-3">
      {/* Top Header & Case Scope Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-slate-200 dark:border-[#263650] shadow-xs flex-shrink-0 transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center space-x-2">
              <span>Interactive Criminal Network Analysis</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Cytoscape.js
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              Topological relationship graph with cross-case correlation, 1-hop neighborhood analysis, and evidence provenance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 text-xs">
          {/* Guide Trigger */}
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#111c30] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16243e] font-semibold text-xs transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Terminology Guide</span>
          </button>

          {/* Scope Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-semibold hidden md:inline">Scope:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => handleCaseFilterChange(e.target.value)}
              className="bg-slate-50 dark:bg-[#111c30] text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#263650] focus:outline-none max-w-[200px] sm:max-w-[260px] truncate"
            >
              <option value="all">Global (All 10 Interconnected Cases)</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.title.slice(0, 28)}...
                </option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-[#263650] text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>Nodes: <strong className="text-blue-600 dark:text-cyan-400 font-bold">{entities.length}</strong></span>
            <span>Edges: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{relationships.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Network Canvas */}
      <div className="flex-1 min-h-0 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-[#263650]">
        <NetworkGraph
          entities={entities}
          relationships={relationships}
          selectedCaseId={selectedCaseId === 'all' ? undefined : selectedCaseId}
        />
      </div>

      <TerminologyModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}
