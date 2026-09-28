'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users2,
  Search,
  Filter,
  GitMerge,
  ShieldCheck,
  ChevronRight,
  Phone,
  CreditCard,
  Car,
  MapPin,
  Building,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { Entity, EntityType, EntityMatchCandidate } from '@/types/investigation';

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [matchCandidates, setMatchCandidates] = useState<EntityMatchCandidate[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'catalog' | 'resolution'>('catalog');

  const refreshData = () => {
    setEntities(InvestigationStore.getEntities());
    setMatchCandidates(InvestigationStore.getMatchCandidates());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleMerge = (candidate: EntityMatchCandidate) => {
    const success = InvestigationStore.mergeEntities(
      candidate.sourceEntityId,
      candidate.candidateEntityId,
      'Insp. Amit Kumar'
    );
    if (success) {
      alert(`Entities "${candidate.sourceEntity.name}" and "${candidate.candidateEntity.name}" successfully merged. Audit entry created.`);
      refreshData();
    }
  };

  const filteredEntities = entities.filter((e) => {
    if (selectedType !== 'all' && e.entityType !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.name.toLowerCase().includes(q);
      const matchIdent = e.identifiers?.some(i => i.identifierValue.toLowerCase().includes(q));
      return matchName || matchIdent;
    }
    return true;
  });

  const entityTypes: EntityType[] = [
    'PERSON',
    'PHONE',
    'ACCOUNT',
    'VEHICLE',
    'LOCATION',
    'ORGANIZATION',
    'EMAIL',
  ];

  return (
    <div className="space-y-6">
      {/* Header with View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
              CENTRAL INTELLIGENCE REPOSITORY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Forensic Entity Explorer ({entities.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Indexed subjects, burner handsets, shell bank accounts, transport plates, and safehouse nodes.
          </p>
        </div>

        {/* View Switcher: Catalog vs Entity Resolution */}
        <div className="flex rounded-lg bg-[#132042] p-1 border border-[#23386e] text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveView('catalog')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center space-x-1.5 ${
              activeView === 'catalog' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Entities Catalog</span>
          </button>
          <button
            onClick={() => setActiveView('resolution')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center space-x-1.5 ${
              activeView === 'resolution' ? 'bg-purple-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Entity Resolution Candidates ({matchCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CATALOG */}
      {activeView === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1633] p-3 rounded-lg border border-[#1e2f5b]">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by name, phone number, vehicle plate, account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#132042] text-xs text-slate-100 placeholder-slate-400 pl-8 pr-3 py-2 rounded-lg border border-[#23386e] focus:outline-none focus:border-blue-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Type Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-[#132042] text-slate-300 hover:bg-[#18274d]'
                }`}
              >
                All Classes
              </button>
              {entityTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-md transition font-medium ${
                    selectedType === type ? 'bg-blue-600 text-white' : 'bg-[#132042] text-slate-300 hover:bg-[#18274d]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Entity Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEntities.map((ent) => (
              <Link
                key={ent.id}
                href={`/entities/${ent.id}`}
                className="bg-[#0d1633] border border-[#1e2f5b] hover:border-blue-500/50 rounded-xl p-4 transition shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#18274d]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {ent.entityType}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {(ent.confidence * 100).toFixed(0)}% Conf.
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mt-2.5 group-hover:text-blue-300 transition truncate">
                    {ent.name}
                  </h3>
                  {ent.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {ent.description}
                    </p>
                  )}

                  {/* Identifiers preview */}
                  {ent.identifiers && ent.identifiers.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {ent.identifiers.slice(0, 2).map((id) => (
                        <div key={id.id} className="text-[11px] font-mono text-slate-300 bg-[#132042] px-2 py-0.5 rounded border border-[#23386e] truncate">
                          {id.identifierType}: <strong>{id.identifierValue}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-[#18274d] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-blue-300 font-semibold">{ent.caseNumber || 'Cross-Case'}</span>
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition flex items-center space-x-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MULTI-SIGNAL ENTITY RESOLUTION */}
      {activeView === 'resolution' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-start space-x-3 text-xs text-slate-300 leading-relaxed">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-purple-300">Human-In-The-Loop Entity Resolution:</strong> CrimIntel does not automatically merge entities to prevent erroneous connections. The system evaluates multi-signal metrics (phonetics, phone, bank account, location) and prompts the authorized officer to merge or keep separate.
            </div>
          </div>

          <div className="space-y-4">
            {matchCandidates.length === 0 ? (
              <div className="p-8 text-center bg-[#0d1633] rounded-xl border border-[#1e2f5b] text-slate-400 text-xs">
                No unresolved entity duplicate candidates detected.
              </div>
            ) : (
              matchCandidates.map((cand) => (
                <div key={cand.id} className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#18274d]">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Match Candidate</span>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {(cand.matchScore * 100).toFixed(0)}% Match Confidence
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Detected: {new Date(cand.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  {/* Side-by-Side Entity Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Entity A */}
                    <div className="bg-[#132042] p-4 rounded-lg border border-[#23386e] space-y-2">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Entity Record A</div>
                      <h4 className="text-sm font-bold text-white">{cand.sourceEntity.name}</h4>
                      <div className="text-slate-300 font-mono text-[11px]">Class: {cand.sourceEntity.entityType}</div>
                      <div className="text-slate-300">Case: <strong className="text-blue-300">{cand.sourceEntity.caseNumber || 'Global'}</strong></div>
                      {cand.sourceEntity.identifiers && (
                        <div className="text-slate-400 text-[11px]">
                          Identifiers: {cand.sourceEntity.identifiers.map(i => i.identifierValue).join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Entity B */}
                    <div className="bg-[#132042] p-4 rounded-lg border border-[#23386e] space-y-2">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Entity Record B</div>
                      <h4 className="text-sm font-bold text-white">{cand.candidateEntity.name}</h4>
                      <div className="text-slate-300 font-mono text-[11px]">Class: {cand.candidateEntity.entityType}</div>
                      <div className="text-slate-300">Case: <strong className="text-blue-300">{cand.candidateEntity.caseNumber || 'Global'}</strong></div>
                      {cand.candidateEntity.identifiers && (
                        <div className="text-slate-400 text-[11px]">
                          Identifiers: {cand.candidateEntity.identifiers.map(i => i.identifierValue).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Matching Signals Breakdown */}
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Matching Signal Weights
                    </div>
                    <div className="space-y-1">
                      {cand.matchingSignals.map((sig, sIdx) => (
                        <div key={sIdx} className="text-xs bg-[#101b38] p-2 rounded border border-[#1e2f5b] flex items-center justify-between text-slate-300">
                          <span className="font-semibold text-purple-300">{sig.signal}:</span>
                          <span className="text-slate-300 text-[11px] truncate max-w-md">{sig.description}</span>
                          <span className="font-mono text-emerald-400">+{(sig.score * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decision Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => alert('Candidate marked for review later.')}
                      className="px-3 py-1.5 rounded bg-[#132042] hover:bg-[#1b2d5c] text-slate-300 transition"
                    >
                      Review Later
                    </button>
                    <button
                      onClick={() => alert('Entities kept separate.')}
                      className="px-3 py-1.5 rounded bg-[#132042] hover:bg-[#1b2d5c] text-rose-300 transition"
                    >
                      Keep Separate
                    </button>
                    <button
                      onClick={() => handleMerge(cand)}
                      className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center space-x-1.5 shadow"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Confirm Merge (Audited)</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
