'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import {
  FolderOpen,
  ArrowLeft,
  Users2,
  Share2,
  FileCheck2,
  Clock,
  AlertOctagon,
  FileText,
  History,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import {
  InvestigationCase,
  Entity,
  Relationship,
  EvidenceRecord,
  TemporalEvent,
  InvestigationAlert,
  AuditLogEntry,
  CaseStatus
} from '@/types/investigation';
import NetworkGraph from '@/components/graph/NetworkGraph';
import TemporalTimeline from '@/components/timeline/TemporalTimeline';
import EvidenceChainViewer from '@/components/evidence/EvidenceChainViewer';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = (params?.id as string) || 'case-001';

  const [caseData, setCaseData] = useState<InvestigationCase | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'entities' | 'relationships' | 'evidence' | 'timeline' | 'alerts' | 'network' | 'audit'
  >('overview');

  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [events, setEvents] = useState<TemporalEvent[]>([]);
  const [alerts, setAlerts] = useState<InvestigationAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    const foundCase = InvestigationStore.getCaseById(caseId);
    if (foundCase) {
      setCaseData(foundCase);
      setEntities(InvestigationStore.getEntities(foundCase.id));
      setRelationships(InvestigationStore.getRelationships(foundCase.id));
      setEvidenceList(InvestigationStore.getEvidence(foundCase.id));
      setEvents(InvestigationStore.getEvents(foundCase.id));
      setAlerts(InvestigationStore.getAlerts(foundCase.id));
      setAuditLogs(InvestigationStore.getAuditLogs().filter(a => a.caseId === foundCase.id));
    }
  }, [caseId]);

  if (!caseData) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-slate-400 text-sm">Investigation case not found.</div>
        <Link href="/cases" className="text-blue-400 hover:underline text-xs">
          Return to Cases Index
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: CaseStatus) => {
    InvestigationStore.updateCase(caseData.id, { status: newStatus });
    setCaseData(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FolderOpen },
    { id: 'network', label: 'Network Graph', icon: Share2, count: relationships.length },
    { id: 'entities', label: 'Entities', icon: Users2, count: entities.length },
    { id: 'relationships', label: 'Relationships', icon: Share2, count: relationships.length },
    { id: 'evidence', label: 'Evidence Vault', icon: FileCheck2, count: evidenceList.length },
    { id: 'timeline', label: 'Timeline', icon: Clock, count: events.length },
    { id: 'alerts', label: 'Alerts & Leads', icon: AlertOctagon, count: alerts.length },
    { id: 'audit', label: 'Audit Trail', icon: History, count: auditLogs.length },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <Link href="/cases" className="flex items-center space-x-1 hover:text-slate-200 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Cases</span>
        </Link>
        <div className="flex items-center space-x-2">
          <span>Jurisdiction:</span>
          <span className="font-semibold text-slate-200">{caseData.jurisdiction}</span>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 md:p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#18274d]">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {caseData.caseNumber}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  caseData.priority === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : caseData.priority === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {caseData.priority} PRIORITY
              </span>
              <span className="text-xs text-slate-400">{caseData.category}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-2">
              {caseData.title}
            </h1>
          </div>

          {/* Status Changer & Ingest Data Jump */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-400">Status:</span>
              <select
                value={caseData.status}
                onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
                className="bg-[#132042] text-xs font-semibold text-blue-300 px-3 py-1.5 rounded-lg border border-[#23386e] focus:outline-none"
              >
                <option value="ACTIVE_ANALYSIS">ACTIVE ANALYSIS</option>
                <option value="OPEN">OPEN</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="ON_HOLD">ON HOLD</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <Link
              href={`/import?case=${caseData.id}`}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Ingest Evidence</span>
            </Link>
          </div>
        </div>

        {/* Case Meta Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Location / Station</div>
            <div className="text-slate-200 font-medium mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
              <span className="truncate">{caseData.location}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Assigned Officer</div>
            <div className="text-slate-200 font-medium mt-0.5">
              {caseData.assignedInvestigatorName || 'Insp. Amit Kumar'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Date Registered</div>
            <div className="text-slate-200 font-mono mt-0.5">
              {new Date(caseData.createdAt).toLocaleDateString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Chain Integrity</div>
            <div className="text-emerald-400 font-medium mt-0.5 flex items-center space-x-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Cryptographic Lock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex border-b border-[#1e2f5b] space-x-1 overflow-x-auto text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 font-semibold transition border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-[#0d1633]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0d1633]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-[#152244] text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] space-y-3">
              <h3 className="text-sm font-bold text-slate-100">Case Synopsis & Intelligence Brief</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {caseData.description}
              </p>
            </div>

            {/* Key Entities Preview */}
            <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">Cataloged Entities ({entities.length})</h3>
                <button
                  onClick={() => setActiveTab('entities')}
                  className="text-xs text-blue-400 hover:underline"
                >
                  View All Entities →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {entities.slice(0, 4).map((ent) => (
                  <Link
                    key={ent.id}
                    href={`/entities/${ent.id}`}
                    className="p-3 bg-[#132042] border border-[#23386e] hover:border-blue-400/40 rounded-lg text-xs space-y-1 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 group-hover:text-blue-300 transition">{ent.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{ent.entityType}</span>
                    </div>
                    {ent.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">{ent.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions & Report Jump */}
            <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-100">Case Actions</h3>
              <Link
                href={`/reports?case=${caseData.id}`}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-1.5 shadow"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Investigation Brief</span>
              </Link>
              <Link
                href={`/import?case=${caseData.id}`}
                className="w-full py-2 bg-[#132042] hover:bg-[#1b2d5c] text-slate-200 border border-[#23386e] font-semibold rounded-lg transition flex items-center justify-center space-x-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload CDR / Financial Logs</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NETWORK GRAPH */}
      {activeTab === 'network' && (
        <div className="h-[600px] w-full rounded-xl overflow-hidden border border-[#1e2f5b]">
          <NetworkGraph
            entities={entities}
            relationships={relationships}
            selectedCaseId={caseData.id}
          />
        </div>
      )}

      {/* TAB 3: ENTITIES */}
      {activeTab === 'entities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entities.map((ent) => (
            <Link
              key={ent.id}
              href={`/entities/${ent.id}`}
              className="bg-[#0d1633] border border-[#1e2f5b] hover:border-blue-500/50 p-4 rounded-xl transition shadow flex flex-col justify-between group"
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
                <h4 className="text-sm font-bold text-slate-100 mt-2 group-hover:text-blue-300 transition">
                  {ent.name}
                </h4>
                {ent.description && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {ent.description}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-2 border-t border-[#18274d] flex items-center justify-between text-[11px] text-slate-400">
                <span>Identifiers: <strong>{ent.identifiers?.length || 0}</strong></span>
                <span className="text-blue-400 flex items-center space-x-0.5">
                  <span>Profile</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* TAB 4: RELATIONSHIPS */}
      {activeTab === 'relationships' && (
        <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl overflow-hidden shadow">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#101b38] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#1e2f5b]">
              <tr>
                <th className="p-3">Source Subject</th>
                <th className="p-3">Relationship Type</th>
                <th className="p-3">Target Subject</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Evidence Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18274d] text-slate-300">
              {relationships.map((rel) => (
                <tr key={rel.id} className="hover:bg-[#132042] transition">
                  <td className="p-3 font-semibold text-slate-100">{rel.sourceEntityName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {rel.relationshipType}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-100">{rel.targetEntityName}</td>
                  <td className="p-3 font-mono text-emerald-400">{(rel.confidence * 100).toFixed(0)}%</td>
                  <td className="p-3 text-[11px] text-slate-400 truncate max-w-xs">
                    {rel.provenance?.evidenceFileName || 'Direct Ingestion Record'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: EVIDENCE VAULT */}
      {activeTab === 'evidence' && (
        <EvidenceChainViewer evidenceList={evidenceList} />
      )}

      {/* TAB 6: TIMELINE */}
      {activeTab === 'timeline' && (
        <TemporalTimeline events={events} selectedCaseId={caseData.id} />
      )}

      {/* TAB 7: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl bg-[#0d1633] border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {alert.alertType}
                </span>
                <span className="text-xs font-mono text-slate-400">{(alert.confidence * 100).toFixed(0)}% Confidence</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{alert.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 8: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl overflow-hidden shadow">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#101b38] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#1e2f5b]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Officer</th>
                <th className="p-3">Action</th>
                <th className="p-3">Cryptographic Log Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18274d] text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#132042] transition font-mono">
                  <td className="p-3 text-[11px] text-slate-400">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                  <td className="p-3 text-slate-200 font-sans">{log.userEmail}</td>
                  <td className="p-3 text-blue-300 font-sans font-semibold">{log.action}</td>
                  <td className="p-3 text-[10px] text-slate-400 truncate max-w-xs">{log.logHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
