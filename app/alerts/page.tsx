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
  Info
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { InvestigationAlert, AlertSeverity, AlertType } from '@/types/investigation';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<InvestigationAlert[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshAlerts = () => {
    setAlerts(InvestigationStore.getAlerts());
  };

  useEffect(() => {
    refreshAlerts();
  }, []);

  const handleUpdateStatus = (id: string, status: InvestigationAlert['status']) => {
    InvestigationStore.updateAlertStatus(id, status);
    refreshAlerts();
  };

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && a.alertType !== selectedType) return false;
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
              ANOMALY & LEAD DISCOVERY ENGINE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Investigation Alerts & Actionable Leads ({alerts.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AI and deterministic pattern detectors identifying shared burners, rapid muling layerings, and cross-case bridges.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center space-x-2 self-start sm:self-auto">
          <Info className="w-4 h-4 text-blue-400" />
          <span>Non-labeling ethical decision support</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1633] p-3 rounded-lg border border-[#1e2f5b] text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search leads, cases, descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#132042] text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded border border-[#23386e] focus:outline-none focus:border-blue-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[#132042] text-slate-200 px-3 py-1.5 rounded border border-[#23386e] focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#132042] text-slate-200 px-3 py-1.5 rounded border border-[#23386e] focus:outline-none"
          >
            <option value="all">All Lead Categories</option>
            <option value="CROSS_CASE_LINK">CROSS CASE LINK</option>
            <option value="ENTITY_MATCH">ENTITY MATCH</option>
            <option value="UNUSUAL_PATTERN">UNUSUAL PATTERN</option>
            <option value="HIGH_PRIORITY">HIGH PRIORITY</option>
            <option value="DATA_QUALITY">DATA QUALITY</option>
          </select>
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#0d1633] rounded-xl border border-[#1e2f5b] text-slate-400 text-xs">
            No active investigation alerts match your current filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-[#0d1633] border rounded-xl p-5 shadow-lg space-y-3.5 transition ${
                alert.severity === 'CRITICAL'
                  ? 'border-rose-500/40 hover:border-rose-500/70'
                  : alert.severity === 'HIGH'
                  ? 'border-amber-500/40 hover:border-amber-500/70'
                  : 'border-[#1e2f5b] hover:border-blue-500/40'
              }`}
            >
              {/* Alert Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#18274d]">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : alert.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {alert.alertType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-emerald-400">
                    {(alert.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-mono text-blue-300">{alert.caseNumber}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(alert.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-bold text-slate-100">{alert.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.description}</p>
              </div>

              {/* Explainability & Signals */}
              {alert.explainability && (
                <div className="bg-[#111d3d] p-3 rounded-lg border border-[#23386e] text-xs space-y-1.5">
                  <div className="font-semibold text-cyan-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Explainability & Algorithmic Rationale ({alert.explainability.ruleOrModel})</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {alert.explainability.rationale}
                  </p>
                  {alert.explainability.signals && alert.explainability.signals.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {alert.explainability.signals.map((sig, sIdx) => (
                        <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-[#15244c] text-slate-300 border border-[#23386e]">
                          • {sig}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Related Entities & Evidence */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#18274d] text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Related Subjects:</span>
                  {alert.relatedEntities.map((e) => (
                    <Link
                      key={e.id}
                      href={`/entities/${e.id}`}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#132042] text-blue-300 border border-[#23386e] hover:border-blue-400 transition"
                    >
                      {e.name} ({e.entityType})
                    </Link>
                  ))}
                  {alert.supportingEvidenceName && (
                    <span className="text-[11px] text-slate-400 ml-2">
                      Anchor: <strong className="text-slate-200">{alert.supportingEvidenceName}</strong>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    href="/network"
                    className="px-2.5 py-1 rounded bg-[#132042] hover:bg-[#1b2d5c] text-slate-200 border border-[#23386e] transition flex items-center space-x-1 text-xs"
                  >
                    <Share2 className="w-3 h-3 text-cyan-400" />
                    <span>Inspect Graph</span>
                  </Link>
                  {alert.status === 'NEW' ? (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'INVESTIGATED')}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition text-xs flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Investigated</span>
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                      ✓ Investigated
                    </span>
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
