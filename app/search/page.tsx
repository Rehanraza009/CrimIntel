'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Users2,
  FolderOpen,
  FileCheck2,
  Share2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Phone,
  CreditCard,
  Car,
  MapPin,
  Building
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { Entity, InvestigationCase, EvidenceRecord, Relationship } from '@/types/investigation';

export const dynamic = 'force-dynamic';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState<string>(initialQuery);
  const [entities] = useState<Entity[]>(() => InvestigationStore.getEntities());
  const [cases] = useState<InvestigationCase[]>(() => InvestigationStore.getCases());
  const [evidenceList] = useState<EvidenceRecord[]>(() => InvestigationStore.getEvidence());
  const [relationships] = useState<Relationship[]>(() => InvestigationStore.getRelationships());

  const trimmed = query.trim().toLowerCase();

  // Search Results Filtering (memoized for high responsiveness)
  const matchedEntities = React.useMemo(() => {
    if (!trimmed) return [];
    return entities.filter((e) => {
      const inName = e.name.toLowerCase().includes(trimmed);
      const inDesc = e.description?.toLowerCase().includes(trimmed);
      const inId = e.identifiers?.some(i => i.identifierValue.toLowerCase().includes(trimmed));
      return inName || inDesc || inId;
    });
  }, [entities, trimmed]);

  const matchedCases = React.useMemo(() => {
    if (!trimmed) return [];
    return cases.filter((c) => {
      return (
        c.caseNumber.toLowerCase().includes(trimmed) ||
        c.title.toLowerCase().includes(trimmed) ||
        c.description.toLowerCase().includes(trimmed) ||
        c.category.toLowerCase().includes(trimmed)
      );
    });
  }, [cases, trimmed]);

  const matchedEvidence = React.useMemo(() => {
    if (!trimmed) return [];
    return evidenceList.filter((ev) => {
      return (
        ev.fileName.toLowerCase().includes(trimmed) ||
        ev.sha256Hash.toLowerCase().includes(trimmed) ||
        ev.sourceType.toLowerCase().includes(trimmed)
      );
    });
  }, [evidenceList, trimmed]);

  const matchedRelationships = React.useMemo(() => {
    if (!trimmed) return [];
    return relationships.filter((r) => {
      return (
        (r.sourceEntityName && r.sourceEntityName.toLowerCase().includes(trimmed)) ||
        (r.targetEntityName && r.targetEntityName.toLowerCase().includes(trimmed)) ||
        r.relationshipType.toLowerCase().includes(trimmed)
      );
    });
  }, [relationships, trimmed]);

  const totalResults = matchedEntities.length + matchedCases.length + matchedEvidence.length + matchedRelationships.length;

  const quickSearches = [
    '+91 9876543210',
    'Vikram Malhotra',
    'DL-01-AB-1234',
    'Account XX99881122',
    'Sector 62, Noida Safehouse',
    'Starlight Overseas',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="bg-white dark:bg-[#111c30] p-5 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm space-y-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
            GLOBAL INVESTIGATION INDEX
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#f1f5f9] mt-1">
            Universal Intelligence Search
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#a7b4c8] mt-1">
            Query across cases, suspect phone numbers, bank accounts, vehicle registrations, and evidence hashes.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Enter phone number, name, vehicle plate, or bank account..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f172a] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-[#263650] focus:outline-none focus:border-blue-500 shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Quick Sample Queries */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Quick Test Searches:</span>
          {quickSearches.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#132042] hover:bg-slate-200 dark:hover:bg-[#1b2d5c] border border-slate-200 dark:border-[#23386e] text-blue-600 dark:text-blue-300 font-mono text-[11px] transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {trimmed ? (
        <div className="space-y-6">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Search Results for &ldquo;{query}&rdquo;</span>
            <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">{totalResults} matches found</span>
          </div>

          {totalResults === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#111c30] rounded-xl border border-slate-200 dark:border-[#263650] text-slate-500 dark:text-slate-400 text-xs shadow-sm">
              No matching intelligence records found for this query.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Matched Entities */}
              {matchedEntities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <Users2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>Entities & Subjects ({matchedEntities.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedEntities.map((ent) => (
                      <Link
                        key={ent.id}
                        href={`/entities/${ent.id}`}
                        className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] hover:border-blue-500 p-4 rounded-xl transition shadow-sm flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1e2f5b]">
                            <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-cyan-400">{ent.entityType}</span>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{ent.caseNumber || 'Cross-Case'}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9] mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                            {ent.name}
                          </h4>
                          {ent.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{ent.description}</p>
                          )}
                        </div>
                        <div className="mt-3 text-[11px] text-blue-600 dark:text-blue-400 flex items-center justify-end space-x-1 font-semibold">
                          <span>Inspect Profile</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Cases */}
              {matchedCases.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Investigation Dockets ({matchedCases.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedCases.map((c) => (
                      <Link
                        key={c.id}
                        href={`/cases/${c.id}`}
                        className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] hover:border-blue-500 p-4 rounded-xl transition shadow-sm flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1e2f5b]">
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{c.caseNumber}</span>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{c.priority}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9] mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                            {c.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                        </div>
                        <div className="mt-3 text-[11px] text-blue-600 dark:text-blue-400 flex items-center justify-end space-x-1 font-semibold">
                          <span>Open Docket</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Evidence */}
              {matchedEvidence.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Evidentiary Records ({matchedEvidence.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {matchedEvidence.map((ev) => (
                      <div key={ev.id} className="p-3 rounded-lg bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] text-xs flex items-center justify-between shadow-sm">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-[#f1f5f9]">{ev.fileName}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate max-w-md">
                            SHA-256: {ev.sha256Hash}
                          </div>
                        </div>
                        <Link href="/evidence" className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                          View in Vault →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-[#111c30] rounded-xl border border-slate-200 dark:border-[#263650] text-slate-500 dark:text-slate-400 text-xs space-y-2 shadow-sm">
          <Search className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
          <p>Enter a search term above or click any of the quick test searches.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
