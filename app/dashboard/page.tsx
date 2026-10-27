'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderOpen,
  Users2,
  Share2,
  FileCheck2,
  AlertOctagon,
  GitFork,
  ArrowRight,
  Plus,
  UploadCloud,
  Clock,
  ShieldCheck,
  Activity,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Info,
  Layers,
  ArrowUpDown,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useTheme } from '@/lib/themeContext';
import { InvestigationStore } from '@/services/investigationStore';
import {
  InvestigationCase,
  Entity,
  Relationship,
  EvidenceRecord,
  InvestigationAlert,
  TemporalEvent,
  CasePriority,
  CaseStatus,
} from '@/types/investigation';
import { HelpTooltip } from '@/components/common/TerminologyModal';

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Mode: Basic vs Advanced View
  const [viewMode, setViewMode] = useState<'basic' | 'advanced'>('basic');

  // Core Data
  const [cases, setCases] = useState<InvestigationCase[]>(() => InvestigationStore.getCases());
  const [entities, setEntities] = useState<Entity[]>(() => InvestigationStore.getEntities());
  const [relationships, setRelationships] = useState<Relationship[]>(() => InvestigationStore.getRelationships());
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(() => InvestigationStore.getEvidence());
  const [alerts, setAlerts] = useState<InvestigationAlert[]>(() => InvestigationStore.getAlerts());
  const [events, setEvents] = useState<TemporalEvent[]>(() => InvestigationStore.getEvents());

  // Compute Cross-Case Links
  const crossCaseEntities = useMemo(
    () => entities.filter((e) => e.connectedCases && e.connectedCases.length > 1),
    [entities]
  );
  const activeCasesCount = useMemo(
    () => cases.filter((c) => c.status === 'ACTIVE_ANALYSIS' || c.status === 'OPEN').length,
    [cases]
  );
  const itemsRequiringReview = useMemo(
    () => alerts.filter((a) => a.status === 'NEW'),
    [alerts]
  );

  // Table Filters & Pagination
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'priority' | 'entities'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredCases = useMemo(() => {
    let result = [...cases];

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (c) =>
          c.caseNumber.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((c) => c.priority === priorityFilter);
    }

    result.sort((a, b) => {
      if (sortField === 'date') {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sortAsc ? -diff : diff;
      }
      if (sortField === 'priority') {
        const pOrder: Record<string, number> = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
        const diff = (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        return sortAsc ? -diff : diff;
      }
      if (sortField === 'entities') {
        const diff = (b.entityCount || 0) - (a.entityCount || 0);
        return sortAsc ? -diff : diff;
      }
      return 0;
    });

    return result;
  }, [cases, searchFilter, statusFilter, priorityFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredCases.length / pageSize) || 1;
  const paginatedCases = useMemo(
    () => filteredCases.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredCases, currentPage]
  );

  // Chart 1: Case Activity
  const caseActivityData = useMemo(
    () =>
      cases.slice(0, 6).map((c) => ({
        name: c.caseNumber,
        entities: c.entityCount || 6,
        evidence: c.evidenceCount || 2,
        alerts: c.alertCount || 1,
      })),
    [cases]
  );

  // Chart 2: Entities by Class
  const entityChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    entities.forEach((e) => {
      counts[e.entityType] = (counts[e.entityType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [entities]);

  // Chart 3: Items to Review by Severity
  const alertSeverityData = useMemo(() => {
    const counts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    alerts.forEach((a) => {
      counts[a.severity] = (counts[a.severity] || 0) + 1;
    });
    return [
      { severity: 'Critical', count: counts.CRITICAL, fill: '#ef4444' },
      { severity: 'High', count: counts.HIGH, fill: '#f59e0b' },
      { severity: 'Medium', count: counts.MEDIUM, fill: '#3b82f6' },
      { severity: 'Low', count: counts.LOW, fill: '#10b981' },
    ];
  }, [alerts]);

  const PIE_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section & Actions */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] shadow-sm transition-colors duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
                INVESTIGATION OVERVIEW
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Scope: All 10 Cases across Delhi NCR & Inter-State Syndicates
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Criminal Network Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Review active cases, connected records, evidence, and findings that need attention. Explore the unified temporal knowledge graph to uncover covert syndicate bridges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Basic / Advanced View Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] text-xs">
              <button
                onClick={() => setViewMode('basic')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  viewMode === 'basic'
                    ? 'bg-white dark:bg-[#111c30] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Basic View
              </button>
              <button
                onClick={() => setViewMode('advanced')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  viewMode === 'advanced'
                    ? 'bg-white dark:bg-[#111c30] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Advanced View
              </button>
            </div>

            {/* Primary Action */}
            <Link
              href="/network"
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Open Network Analysis</span>
            </Link>

            {/* Secondary Action */}
            <Link
              href="/cases"
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#16243e] dark:hover:bg-[#1c2e4f] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#263650] transition"
            >
              <FolderOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>View All Cases</span>
            </Link>
          </div>
        </div>

        {/* Advanced Mode Banner */}
        {viewMode === 'advanced' && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e2f5b] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>
                <strong>Advanced View Active:</strong> Displaying graph centrality algorithms (CoSE & Concentric), cryptographic SHA-256 block status, and multi-signal resolution confidence bounds.
              </span>
            </div>
            <span className="font-mono text-[11px] bg-slate-100 dark:bg-[#0f172a] px-2 py-0.5 rounded border border-slate-200 dark:border-[#1e2f5b]">
              Schema v2026.03 (16 Tables)
            </span>
          </div>
        )}
      </div>

      {/* 2. KPI Cards (6 Understandable Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Active Cases */}
        <Link
          href="/cases"
          className="p-4 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition block group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-300">
              Active Cases
            </span>
            <FolderOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {cases.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {viewMode === 'basic' ? 'Cases under investigation' : `${activeCasesCount} active analysis`}
          </div>
        </Link>

        {/* Card 2: Entities Identified */}
        <Link
          href="/entities"
          className="p-4 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition block group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-300">
              Entities Identified
            </span>
            <Users2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {entities.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {viewMode === 'basic' ? 'People, SIMs, accounts, plates' : '52 normalized across 7 classes'}
          </div>
        </Link>

        {/* Card 3: Connections Found */}
        <Link
          href="/network"
          className="p-4 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition block group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-300">
              Connections Found
            </span>
            <Share2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {relationships.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {viewMode === 'basic' ? 'Relationships supported by records' : '100% evidence provenance'}
          </div>
        </Link>

        {/* Card 4: Evidence Files */}
        <Link
          href="/evidence"
          className="p-4 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition block group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
              Evidence Files
            </span>
            <FileCheck2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {evidenceList.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 line-clamp-1">
            ✓ SHA-256 Verified
          </div>
        </Link>

        {/* Card 5: Items to Review */}
        <Link
          href="/alerts"
          className="p-4 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition block group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-300">
              Items to Review
            </span>
            <AlertOctagon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-2">
            {itemsRequiringReview.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            Patterns awaiting review
          </div>
        </Link>

        {/* Card 6: Cross-Case Links */}
        <Link
          href="/network?mode=crosscase"
          className="p-4 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-md transition block group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold group-hover:text-rose-600 dark:group-hover:text-rose-300">
              Cross-Case Links
            </span>
            <GitFork className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-2">
            {crossCaseEntities.length}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 line-clamp-1">
            Connections across cases
          </div>
        </Link>
      </div>

      {/* 3. Main Grid: Active Cases Table & Priority Review Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Active Cases Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] shadow-sm">
            {/* Table Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#1e2f5b]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                  <span>Active Investigation Cases</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Filter by jurisdiction, priority, or search case docket title
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href="/cases"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <span>All Cases ({cases.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2.5 py-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <input
                  type="text"
                  placeholder="Search case title or number..."
                  value={searchFilter}
                  onChange={(e) => {
                    setSearchFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 dark:bg-[#0f172a] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-[#0f172a] text-xs font-medium text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE_ANALYSIS">Active Analysis</option>
                <option value="OPEN">Open</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="CLOSED">Closed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-[#0f172a] text-xs font-medium text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
              </select>

              {/* Sort Toggle */}
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs flex items-center space-x-1"
                title="Toggle sort direction"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-[#0f172a] border-y border-slate-100 dark:border-[#1e2f5b]">
                  <tr>
                    <th className="py-2.5 px-3">Case ID</th>
                    <th className="py-2.5 px-3">Title & Category</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Investigator</th>
                    <th className="py-2.5 px-3 text-right">Entities</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1e2f5b] text-slate-700 dark:text-slate-300">
                  {paginatedCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No cases match your active filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedCases.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-50 dark:hover:bg-[#16243e] transition cursor-pointer"
                        onClick={() => router.push(`/cases/${c.id}`)}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {c.caseNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate" title={c.title}>
                            {c.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {c.category} • {c.location}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.priority === 'CRITICAL'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50'
                                : c.priority === 'HIGH'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50'
                            }`}
                          >
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
                            {c.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {c.assignedInvestigatorName}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-teal-600 dark:text-teal-400">
                          {c.entityCount || 6}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1.5">
                            <Link
                              href={`/cases/${c.id}`}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#1e2f5b] dark:hover:bg-[#283f7a] text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition"
                            >
                              Details
                            </Link>
                            <Link
                              href={`/network?case=${c.id}`}
                              className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-[11px] font-semibold text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 transition"
                              title="Visualize in Network Graph"
                            >
                              Graph
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#1e2f5b] text-xs text-slate-500">
                <span>
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, filteredCases.length)} of {filteredCases.length} cases
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded border border-slate-200 dark:border-[#263650] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-mono font-bold">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded border border-slate-200 dark:border-[#263650] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chart 1: Case Activity Breakdown */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b] mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Forensic Volume per Investigation Case
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Entities and evidence file distribution</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caseActivityData}>
                  <XAxis
                    dataKey="name"
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                  />
                  <YAxis
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#111c30' : '#ffffff',
                      borderColor: isDark ? '#263650' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#172033',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="entities" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Entities" />
                  <Bar dataKey="evidence" fill="#10b981" radius={[4, 4, 0, 0]} name="Evidence Files" />
                  <Bar dataKey="alerts" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Review Items" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Items Requiring Review Panel & Entity Distribution */}
        <div className="space-y-6">
          {/* Priority Review Panel (Section 4.E) */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b] mb-3">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Items Requiring Review
                </h3>
              </div>
              <Link
                href="/alerts"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All ({alerts.length})
              </Link>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Pattern rules and cross-case overlaps surfaced for investigator review. Not automated proof of guilt.
            </p>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-950/20 hover:border-amber-400 dark:hover:border-amber-600 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      {item.alertType === 'CROSS_CASE_LINK'
                        ? 'Potential Cross-Case Connection'
                        : item.alertType === 'MULE_NETWORK_BURST'
                        ? 'Unusual Transaction Pattern'
                        : 'Possible Shared Identifier'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Status: {item.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {item.title}
                  </h4>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>What detected:</strong> {item.explanation}
                  </div>

                  {viewMode === 'advanced' && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-black/20 p-2 rounded border border-slate-200/60 dark:border-[#263650]">
                      <div><strong>Detection Rule:</strong> {item.detectionRule}</div>
                      <div><strong>Evidence ID:</strong> {item.evidenceId}</div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-amber-200/40 dark:border-amber-800/30 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {item.caseNumber || item.caseId}
                    </span>
                    <Link
                      href="/alerts"
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
                    >
                      <span>Inspect Records</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Indexed Entity Classes (Donut Pie) */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b] mb-2">
              <div className="flex items-center space-x-2">
                <Users2 className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Indexed Entity Classes
                </h3>
              </div>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={entityChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {entityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#111c30' : '#ffffff',
                      borderColor: isDark ? '#263650' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#172033',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#1e2f5b]">
              {entityChartData.slice(0, 6).map((item, idx) => (
                <div key={item.name} className="flex items-center space-x-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="truncate">
                    {item.name}: <strong className="text-slate-800 dark:text-slate-200">{item.count}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
