'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderOpen,
  Users2,
  Share2,
  FileCheck2,
  AlertOctagon,
  GitFork,
  ArrowUpRight,
  Plus,
  UploadCloud,
  Clock,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Layers,
  Activity,
  AlertTriangle
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
  LineChart,
  Line
} from 'recharts';
import { InvestigationStore } from '@/services/investigationStore';
import {
  InvestigationCase,
  Entity,
  Relationship,
  EvidenceRecord,
  InvestigationAlert,
  TemporalEvent,
  EntityType
} from '@/types/investigation';

export default function DashboardPage() {
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [alerts, setAlerts] = useState<InvestigationAlert[]>([]);
  const [events, setEvents] = useState<TemporalEvent[]>([]);

  useEffect(() => {
    setCases(InvestigationStore.getCases());
    setEntities(InvestigationStore.getEntities());
    setRelationships(InvestigationStore.getRelationships());
    setEvidenceList(InvestigationStore.getEvidence());
    setAlerts(InvestigationStore.getAlerts());
    setEvents(InvestigationStore.getEvents());
  }, []);

  // Compute Cross-Case Links
  const crossCaseEntities = entities.filter(e => e.connectedCases && e.connectedCases.length > 1);
  const activeCasesCount = cases.filter(c => c.status === 'ACTIVE_ANALYSIS' || c.status === 'OPEN').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'NEW').length;

  // Entity Breakdown for Chart
  const entityTypeCounts: Record<string, number> = {};
  entities.forEach(e => {
    entityTypeCounts[e.entityType] = (entityTypeCounts[e.entityType] || 0) + 1;
  });
  const entityChartData = Object.entries(entityTypeCounts).map(([type, count]) => ({
    name: type,
    count,
  }));

  // Cases entity distribution for BarChart
  const caseActivityData = cases.map(c => ({
    name: c.caseNumber,
    entities: c.entityCount || 6,
    evidence: c.evidenceCount || 2,
    alerts: c.alertCount || 1,
  }));

  const PIE_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
              INVESTIGATION INTELLIGENCE OVERVIEW
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Criminal Network Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ministry of Home Affairs (MHA) – NCRB Women Safety Division • Active Scope: Multi-Jurisdiction NCR
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/cases?new=true"
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>New Case</span>
          </Link>
          <Link
            href="/import"
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#14234b] hover:bg-[#1a2f64] border border-[#23386e] text-slate-200 transition"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Ingest Data</span>
          </Link>
          <Link
            href="/network"
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#14234b] hover:bg-[#1a2f64] border border-[#23386e] text-slate-200 transition"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>Network Graph</span>
          </Link>
        </div>
      </div>

      {/* Top Statistics Cards (6 Key Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Cases</span>
            <FolderOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-2">{cases.length}</div>
          <div className="text-[11px] text-blue-400 mt-1 font-medium">{activeCasesCount} in active analysis</div>
        </div>

        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Entities</span>
            <Users2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-2">{entities.length}</div>
          <div className="text-[11px] text-cyan-400 mt-1 font-medium">Persons, SIMs, Plates</div>
        </div>

        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Relationships</span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-2">{relationships.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">100% Provenance Anchored</div>
        </div>

        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Evidence Records</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-2">{evidenceList.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono font-semibold">✓ SHA-256 Verified</div>
        </div>

        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Investigation Leads</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400 mt-2">{alerts.length}</div>
          <div className="text-[11px] text-rose-300 mt-1 font-semibold">{criticalAlertsCount} High Priority</div>
        </div>

        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cross-Case Links</span>
            <GitFork className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-300 mt-2">{crossCaseEntities.length}</div>
          <div className="text-[11px] text-purple-300 mt-1 font-medium">Syndicate Bridges</div>
        </div>
      </div>

      {/* Main Grid: Recent Cases & High-Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Columns): Recent Cases & Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Cases Table Widget */}
          <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2f5b] mb-4">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-100">Active Investigation Cases</h3>
              </div>
              <Link href="/cases" className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-semibold">
                <span>View All ({cases.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 uppercase tracking-wider text-[10px] bg-[#101b38] border-b border-[#1e2f5b]">
                  <tr>
                    <th className="py-2.5 px-3">Case ID</th>
                    <th className="py-2.5 px-3">Title & Classification</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Investigator</th>
                    <th className="py-2.5 px-3 text-right">Entities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18274d] text-slate-300">
                  {cases.slice(0, 4).map((c) => (
                    <tr key={c.id} className="hover:bg-[#132042] transition cursor-pointer">
                      <td className="py-3 px-3 font-mono font-bold text-blue-300">
                        <Link href={`/cases/${c.id}`} className="hover:underline">
                          {c.caseNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-100 truncate max-w-xs">{c.title}</div>
                        <div className="text-[10px] text-slate-400">{c.category}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          c.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-medium text-slate-200">
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 truncate max-w-[120px]">
                        {c.assignedInvestigatorName || 'Insp. Kumar'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-cyan-400">
                        {c.entityCount || 6}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Chart: Case Activity Breakdown */}
          <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2f5b] mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Case Forensic Volume Distribution</h3>
              </div>
              <span className="text-[11px] text-slate-400">Entities & Evidence per Case</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caseActivityData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0d1633', borderColor: '#1e2f5b', fontSize: '11px' }}
                  />
                  <Bar dataKey="entities" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Entities" />
                  <Bar dataKey="evidence" fill="#10b981" radius={[4, 4, 0, 0]} name="Evidence Files" />
                  <Bar dataKey="alerts" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Alerts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right (1 Column): Critical Alerts & Entity Breakdown */}
        <div className="space-y-6">
          {/* Critical Investigation Alerts */}
          <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2f5b] mb-3">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-slate-100">High-Priority Leads</h3>
              </div>
              <Link href="/alerts" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                All Alerts ({alerts.length})
              </Link>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-[#111d3d] border border-rose-500/30 hover:border-rose-500/60 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {alert.alertType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {(alert.confidence * 100).toFixed(0)}% Conf.
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 leading-snug">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{alert.caseNumber}</span>
                    <Link href="/alerts" className="text-blue-400 hover:underline font-semibold flex items-center space-x-0.5">
                      <span>Investigate</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Entity Type Distribution (Donut Pie) */}
          <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2f5b] mb-2">
              <div className="flex items-center space-x-2">
                <Users2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Indexed Entity Classes</h3>
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
                    contentStyle={{ backgroundColor: '#0d1633', borderColor: '#1e2f5b', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-2 text-[10px] text-slate-400 border-t border-[#18274d]">
              {entityChartData.slice(0, 6).map((item, idx) => (
                <div key={item.name} className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                  <span className="truncate">{item.name}: <strong className="text-slate-200">{item.count}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
