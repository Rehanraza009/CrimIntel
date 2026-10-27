'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  MapPin,
  Users2,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  X,
  Share2,
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { InvestigationCase, CaseStatus, CasePriority } from '@/types/investigation';

export const dynamic = 'force-dynamic';

function CasesContent() {
  const searchParams = useSearchParams();
  const [cases, setCases] = useState<InvestigationCase[]>(() => InvestigationStore.getCases());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'entities'>('date');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form state for creating a new case
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Cyber Financial Fraud');
  const [newPriority, setNewPriority] = useState<CasePriority>('HIGH');
  const [newLocation, setNewLocation] = useState('Delhi NCR');
  const [newJurisdiction, setNewJurisdiction] = useState('Special Crime Branch');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    setCases(InvestigationStore.getCases());
    if (searchParams.get('new') === 'true') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    InvestigationStore.createCase({
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      location: newLocation,
      jurisdiction: newJurisdiction,
      description: newDescription,
      status: 'OPEN',
    });

    setCases(InvestigationStore.getCases());
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const filteredCases = React.useMemo(() => {
    return cases
      .filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            c.caseNumber.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const weight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (sortBy === 'entities') {
          return (b.entityCount || 0) - (a.entityCount || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [cases, statusFilter, priorityFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111c30] p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-[#263650] shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
              CASE REPOSITORY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Investigation Cases ({cases.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Centralized index of multi-jurisdictional FIRs, digital SIM-box operations, and organized syndicates.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Case</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111c30] p-3 rounded-xl border border-slate-200 dark:border-[#263650] text-xs shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by case number, title, jurisdiction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE_ANALYSIS">ACTIVE ANALYSIS</option>
            <option value="OPEN">OPEN</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="ON_HOLD">ON HOLD</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
          >
            <option value="date">Sort: Recent First</option>
            <option value="priority">Sort: Severity / Priority</option>
            <option value="entities">Sort: Entity Count</option>
          </select>
        </div>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((c) => (
          <Link
            key={c.id}
            href={`/cases/${c.id}`}
            className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-5 transition shadow-sm hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b]">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {c.caseNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.priority === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                      : c.priority === 'HIGH'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
                  }`}
                >
                  {c.priority}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition leading-snug">
                {c.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {c.description}
              </p>

              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">{c.location}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Jurisdiction: <strong className="text-slate-800 dark:text-slate-200">{c.jurisdiction}</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#1e2f5b] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1" title="Linked entities">
                  <Users2 className="w-3.5 h-3.5 text-teal-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.entityCount || 6}</span>
                </span>
                <span className="flex items-center space-x-1" title="Evidence records">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.evidenceCount || 2}</span>
                </span>
              </div>

              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1 group-hover:translate-x-1 transition">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal: Create Case */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b]">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Register New Investigation Case</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Case Title / FIR Heading
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operation HawkEye - Digital SIM-Box Array"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
                  >
                    <option value="Cyber Financial Fraud">Cyber Financial Fraud</option>
                    <option value="Human Trafficking & Forgery">Human Trafficking & Forgery</option>
                    <option value="Financial Crime / Hawala">Financial Crime / Hawala</option>
                    <option value="Organized Vehicle Theft">Organized Vehicle Theft</option>
                    <option value="Extortion & Cyber Harassment">Extortion & Cyber Harassment</option>
                    <option value="Narcotics & Counterfeiting">Narcotics & Counterfeiting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as CasePriority)}
                    className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location / Police Station
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber PS Rohini, Delhi"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jurisdiction / Agency
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi Police Special Cell"
                    value={newJurisdiction}
                    onChange={(e) => setNewJurisdiction(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Case Synopsis & Intelligence Brief
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of initial complaint, modus operandi, and target syndicate assets..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition"
                >
                  Create Investigation Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CasesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading cases...</div>}>
      <CasesContent />
    </Suspense>
  );
}
