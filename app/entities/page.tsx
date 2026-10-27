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
  Sparkles,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { Entity, EntityType, EntityMatchCandidate } from '@/types/investigation';

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>(() => InvestigationStore.getEntities());
  const [matchCandidates, setMatchCandidates] = useState<EntityMatchCandidate[]>(() => InvestigationStore.getMatchCandidates());
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'catalog' | 'resolution'>('catalog');

  // Confirmation Modal for Merge
  const [candidateToMerge, setCandidateToMerge] = useState<EntityMatchCandidate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = () => {
    setEntities(InvestigationStore.getEntities());
    setMatchCandidates(InvestigationStore.getMatchCandidates());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmMerge = () => {
    if (!candidateToMerge) return;
    const success = InvestigationStore.mergeEntities(
      candidateToMerge.sourceEntityId,
      candidateToMerge.candidateEntityId,
      'Insp. Amit Kumar'
    );
    if (success) {
      showToast(`Merged "${candidateToMerge.sourceEntity.name}" & "${candidateToMerge.candidateEntity.name}" into primary entity with cryptographic audit trail.`);
      setCandidateToMerge(null);
      refreshData();
    }
  };

  const filteredEntities = React.useMemo(() => {
    return entities.filter((e) => {
      if (selectedType !== 'all' && e.entityType !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = e.name.toLowerCase().includes(q);
        const matchIdent = e.identifiers?.some((i) => i.identifierValue.toLowerCase().includes(q));
        return matchName || matchIdent;
      }
      return true;
    });
  }, [entities, selectedType, searchQuery]);

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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111c30] p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-[#263650] shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider font-mono">
              CENTRAL INTELLIGENCE REPOSITORY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Forensic Entity Explorer ({entities.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Indexed subjects, burner handsets, shell bank accounts, transport plates, and safehouse nodes.
          </p>
        </div>

        {/* View Switcher: Catalog vs Entity Resolution */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-[#0f172a] p-1 border border-slate-200 dark:border-[#1e2f5b] text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveView('catalog')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              activeView === 'catalog'
                ? 'bg-white dark:bg-[#111c30] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Entities Catalog</span>
          </button>
          <button
            onClick={() => setActiveView('resolution')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              activeView === 'resolution'
                ? 'bg-white dark:bg-[#111c30] text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5 text-purple-500" />
            <span>Resolution Candidates ({matchCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CATALOG */}
      {activeView === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111c30] p-3 rounded-xl border border-slate-200 dark:border-[#263650] text-xs shadow-xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search name, phone, plate, account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Type Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${
                  selectedType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-50 dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16243e]'
                }`}
              >
                All Classes
              </button>
              {entityTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-lg transition font-medium ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16243e]'
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
                className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-5 transition shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1e2f5b]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                      {ent.entityType}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {(ent.confidence * 100).toFixed(0)}% Conf.
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition truncate">
                    {ent.name}
                  </h3>
                  {ent.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {ent.description}
                    </p>
                  )}

                  {/* Identifiers preview */}
                  {ent.identifiers && ent.identifiers.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {ent.identifiers.slice(0, 2).map((id) => (
                        <div
                          key={id.id}
                          className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#0f172a] px-2 py-0.5 rounded border border-slate-200 dark:border-[#1e2f5b] truncate"
                        >
                          {id.identifierType}: <strong>{id.identifierValue}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-[#1e2f5b] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{ent.caseNumber || 'Cross-Case'}</span>
                  <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition flex items-center space-x-0.5 font-semibold">
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
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 flex items-start space-x-3 text-xs text-purple-900 dark:text-purple-300 leading-relaxed">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-purple-700 dark:text-purple-200">Human-In-The-Loop Entity Resolution:</strong> CrimIntel does not automatically merge entities to prevent erroneous links. The system calculates multi-signal metrics (phonetics, phone overlap, bank account congruence, location) and requires an authorized officer to confirm or keep separate.
            </div>
          </div>

          <div className="space-y-4">
            {matchCandidates.length === 0 ? (
              <div className="p-10 text-center bg-white dark:bg-[#111c30] rounded-2xl border border-slate-200 dark:border-[#263650] text-slate-400 text-xs shadow-sm">
                No unresolved entity duplicate candidates detected.
              </div>
            ) : (
              matchCandidates.map((cand) => (
                <div key={cand.id} className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#1e2f5b]">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Potential Match Candidate</span>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                        {(cand.matchScore * 100).toFixed(0)}% Match Confidence
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Detected: {new Date(cand.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  {/* Side-by-Side Entity Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Entity A */}
                    <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-[#1e2f5b] space-y-2">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Entity Record A</div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cand.sourceEntity.name}</h4>
                      <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">Class: {cand.sourceEntity.entityType}</div>
                      <div className="text-slate-600 dark:text-slate-300">Case: <strong className="text-blue-600 dark:text-blue-400">{cand.sourceEntity.caseNumber || 'Global'}</strong></div>
                      {cand.sourceEntity.identifiers && (
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Identifiers: {cand.sourceEntity.identifiers.map((i) => i.identifierValue).join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Entity B */}
                    <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-[#1e2f5b] space-y-2">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Entity Record B</div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cand.candidateEntity.name}</h4>
                      <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">Class: {cand.candidateEntity.entityType}</div>
                      <div className="text-slate-600 dark:text-slate-300">Case: <strong className="text-blue-600 dark:text-blue-400">{cand.candidateEntity.caseNumber || 'Global'}</strong></div>
                      {cand.candidateEntity.identifiers && (
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Identifiers: {cand.candidateEntity.identifiers.map((i) => i.identifierValue).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Matching Signals Breakdown */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                      Matching Signal Weights
                    </div>
                    <div className="space-y-1">
                      {cand.matchingSignals.map((sig, sIdx) => (
                        <div key={sIdx} className="text-xs bg-slate-50 dark:bg-[#0f172a] p-2.5 rounded-lg border border-slate-200 dark:border-[#1e2f5b] flex items-center justify-between text-slate-700 dark:text-slate-300">
                          <span className="font-semibold text-purple-700 dark:text-purple-300">{sig.signal}:</span>
                          <span className="text-slate-600 dark:text-slate-300 text-[11px] truncate max-w-md">{sig.description}</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+{(sig.score * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decision Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => showToast('Candidate marked for review later.')}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-600 dark:text-slate-300 transition"
                    >
                      Review Later
                    </button>
                    <button
                      onClick={() => showToast('Entities recorded as distinct and kept separate.')}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-rose-600 dark:text-rose-400 transition"
                    >
                      Keep Separate
                    </button>
                    <button
                      onClick={() => setCandidateToMerge(cand)}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center space-x-1.5 shadow"
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

      {/* Confirmation Modal for Merge */}
      {candidateToMerge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-3 text-purple-600 dark:text-purple-400">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <GitMerge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Entity Merge?
                </h3>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Audited Operational Operation
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to merge <strong>{candidateToMerge.sourceEntity.name}</strong> and <strong>{candidateToMerge.candidateEntity.name}</strong>?
            </p>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
              <div>⚠️ All relationships, call records, and transactions will point to the consolidated primary entity.</div>
              <div>🔒 An unalterable entry will be cryptographically signed into the Audit Ledger.</div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setCandidateToMerge(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMerge}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition shadow"
              >
                Execute Merge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
