'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  AlertTriangle,
  GitFork,
  Sparkles,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Share2,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { InvestigationAlert, AlertSeverity, AlertType } from '@/types/investigation';
import { HelpTooltip } from '@/components/common/TerminologyModal';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<InvestigationAlert[]>(() => InvestigationStore.getAlerts());
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshAlerts = () => {
    setAlerts(InvestigationStore.getAlerts());
  };

  const handleUpdateStatus = (id: string, status: InvestigationAlert['status']) => {
    InvestigationStore.updateAlertStatus(id, status);
    refreshAlerts();
  };

  const filteredAlerts = React.useMemo(() => {
    return alerts.filter((a) => {
      if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) return false;
      if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          (a.caseNumber && a.caseNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [alerts, selectedSeverity, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111c30] p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-[#263650] shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
              INVESTIGATION REVIEW QUEUE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Items Requiring Review ({alerts.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Surfaces potential cross-case connections, shared burner identifiers, and unusual financial flows for authorized human inspection.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-300 flex items-center space-x-2 self-start sm:self-auto">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span>Non-labeling decision support. Final determinations remain with officers.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111c30] p-3 rounded-xl border border-slate-200 dark:border-[#263650] text-xs shadow-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search review items, cases, identifiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
          >
            <option value="all">All Review Statuses</option>
            <option value="NEW">Awaiting Review (NEW)</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="INVESTIGATED">Investigated</option>
            <option value="DISMISSED">Dismissed</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Review Queue Items */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-[#111c30] rounded-2xl border border-slate-200 dark:border-[#263650] text-slate-500 dark:text-slate-400 text-xs shadow-sm">
            No items match your active search and severity filters.
          </div>
        ) : (
          filteredAlerts.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border bg-white dark:bg-[#111c30] shadow-sm space-y-3.5 transition ${
                item.severity === 'CRITICAL'
                  ? 'border-rose-200 dark:border-rose-800/40 hover:border-rose-400 dark:hover:border-rose-600'
                  : item.severity === 'HIGH'
                  ? 'border-amber-200 dark:border-amber-800/40 hover:border-amber-400 dark:hover:border-amber-600'
                  : 'border-slate-200 dark:border-[#263650] hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#1e2f5b]">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      item.severity === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                        : item.severity === 'HIGH'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
                    }`}
                  >
                    {item.severity}
                  </span>

                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {item.alertType === 'CROSS_CASE_LINK'
                      ? 'Potential Cross-Case Connection'
                      : item.alertType === 'MULE_NETWORK_BURST'
                      ? 'Unusual Transaction Pattern'
                      : 'Possible Shared Identifier'}
                  </span>

                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {(item.confidence * 100).toFixed(0)}% Rule Match
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.caseNumber}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  <strong>What was detected:</strong> {item.explanation || item.description}
                </p>
              </div>

              {/* Why it matters & Supporting Records */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b]">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Why it matters to investigation:
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Connecting records across police boundaries reveals reuse of burner phones or money-funneling accounts by organized syndicates.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b]">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Supporting Records & Detection Rule:
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Anchor: <strong>{item.supportingEvidenceName || 'Seized Telecom / Banking Extract'}</strong>
                    <br />
                    Rule: <span className="font-mono text-[10px]">{item.detectionRule}</span>
                  </p>
                </div>
              </div>

              {/* Related Subjects & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#1e2f5b] text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Related Subjects:</span>
                  {item.relatedEntities.map((e) => (
                    <Link
                      key={e.id}
                      href={`/entities/${e.id}`}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#16243e] dark:hover:bg-[#1e2f5b] text-blue-600 dark:text-blue-300 font-medium transition"
                    >
                      {e.name} ({e.entityType})
                    </Link>
                  ))}
                </div>

                {/* Status & Review Buttons */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/network?case=${item.caseId}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200 font-semibold transition flex items-center space-x-1"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>View in Graph</span>
                  </Link>

                  {item.status === 'NEW' ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'REVIEWED')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center space-x-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Reviewed</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'DISMISSED')}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-500 dark:text-slate-400 font-semibold transition"
                        title="Dismiss lead"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/40 text-xs">
                        ✓ {item.status}
                      </span>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'NEW')}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Reopen item"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
