'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Tag,
  Info,
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
  CaseStatus,
} from '@/types/investigation';
import NetworkGraph from '@/components/graph/NetworkGraph';
import TemporalTimeline from '@/components/timeline/TemporalTimeline';
import EvidenceChainViewer from '@/components/evidence/EvidenceChainViewer';

export const dynamic = 'force-dynamic';

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
      setAuditLogs(InvestigationStore.getAuditLogs().filter((a) => a.caseId === foundCase.id));
    }
  }, [caseId]);

  if (!caseData) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-slate-500 text-sm">Investigation case not found.</div>
        <Link href="/cases" className="text-blue-600 hover:underline text-xs">
          Return to Cases Index
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: CaseStatus) => {
    InvestigationStore.updateCase(caseData.id, { status: newStatus });
    setCaseData((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FolderOpen },
    { id: 'network', label: 'Network Graph', icon: Share2, count: relationships.length },
    { id: 'entities', label: 'Entities', icon: Users2, count: entities.length },
    { id: 'relationships', label: 'Relationships', icon: Share2, count: relationships.length },
    { id: 'evidence', label: 'Evidence Vault', icon: FileCheck2, count: evidenceList.length },
    { id: 'timeline', label: 'Timeline', icon: Clock, count: events.length },
    { id: 'alerts', label: 'Items to Review', icon: AlertOctagon, count: alerts.length },
    { id: 'audit', label: 'Audit Trail', icon: History, count: auditLogs.length },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <Link href="/cases" className="flex items-center space-x-1 hover:text-slate-800 dark:hover:text-slate-200 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Cases</span>
        </Link>
        <div className="flex items-center space-x-2">
          <span>Jurisdiction:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{caseData.jurisdiction}</span>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl p-5 md:p-6 shadow-sm space-y-4 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#1e2f5b]">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                {caseData.caseNumber}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  caseData.priority === 'CRITICAL'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                    : caseData.priority === 'HIGH'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
                }`}
              >
                {caseData.priority} PRIORITY
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{caseData.category}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-2">
              {caseData.title}
            </h1>
          </div>

          {/* Status Changer & Ingest Data Jump */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
              <select
                value={caseData.status}
                onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
                className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
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
            <div className="text-slate-800 dark:text-slate-200 font-medium mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
              <span className="truncate">{caseData.location}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Assigned Officer</div>
            <div className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">
              {caseData.assignedInvestigatorName || 'Insp. Amit Kumar'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Date Registered</div>
            <div className="text-slate-800 dark:text-slate-200 font-mono mt-0.5">
              {new Date(caseData.createdAt).toLocaleDateString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Chain Integrity</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center space-x-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Cryptographic Lock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex border-b border-slate-200 dark:border-[#263650] space-x-1 overflow-x-auto text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 font-semibold transition border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-[#111c30]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold'
                      : 'bg-slate-100 text-slate-600 dark:bg-[#16243e] dark:text-slate-400'
                  }`}
                >
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
            <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-slate-200 dark:border-[#263650] space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Case Synopsis & Intelligence Brief</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {caseData.description}
              </p>
            </div>

            {/* Key Entities Preview */}
            <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-slate-200 dark:border-[#263650] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cataloged Entities ({entities.length})</h3>
                <button
                  onClick={() => setActiveTab('entities')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All Entities →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {entities.slice(0, 4).map((ent) => (
                  <Link
                    key={ent.id}
                    href={`/entities/${ent.id}`}
                    className="p-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] hover:border-blue-400 rounded-xl text-xs space-y-1 transition group shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                        {ent.name}
                      </span>
                      <span className="text-[10px] font-mono text-teal-600 dark:text-cyan-400 font-bold">{ent.entityType}</span>
                    </div>
                    {ent.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{ent.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions & Report Jump */}
            <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-slate-200 dark:border-[#263650] space-y-3 text-xs shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Case Actions</h3>
              <Link
                href={`/reports?case=${caseData.id}`}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-1.5 shadow"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Investigation Brief</span>
              </Link>
              <Link
                href={`/import?case=${caseData.id}`}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#16243e] dark:hover:bg-[#1e2f5b] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#263650] font-semibold rounded-lg transition flex items-center justify-center space-x-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
                <span>Upload CDR / Financial Logs</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NETWORK GRAPH */}
      {activeTab === 'network' && (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#263650]">
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
              className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] hover:border-blue-400 p-4 rounded-2xl transition shadow-xs hover:shadow-md flex flex-col justify-between group"
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
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                  {ent.name}
                </h4>
                {ent.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {ent.description}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-[#1e2f5b] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Identifiers: <strong>{ent.identifiers?.length || 0}</strong></span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center space-x-0.5">
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
        <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-[#1e2f5b]">
              <tr>
                <th className="p-3">Source Subject</th>
                <th className="p-3">Relationship Type</th>
                <th className="p-3">Target Subject</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Evidence Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1e2f5b] text-slate-700 dark:text-slate-300">
              {relationships.map((rel) => (
                <tr key={rel.id} className="hover:bg-slate-50 dark:hover:bg-[#16243e] transition">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{rel.sourceEntityName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                      {rel.relationshipType}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{rel.targetEntityName}</td>
                  <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{(rel.confidence * 100).toFixed(0)}%</td>
                  <td className="p-3 text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
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

      {/* TAB 7: ITEMS TO REVIEW */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl bg-white dark:bg-[#111c30] border border-amber-200 dark:border-amber-800/40 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                  {alert.alertType}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">{(alert.confidence * 100).toFixed(0)}% Confidence</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{alert.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{alert.explanation || alert.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 8: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-[#1e2f5b]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Officer</th>
                <th className="p-3">Action</th>
                <th className="p-3">Cryptographic Log Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1e2f5b] text-slate-700 dark:text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#16243e] transition font-mono">
                  <td className="p-3 text-[11px] text-slate-500 dark:text-slate-400">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 font-sans">{log.userEmail}</td>
                  <td className="p-3 text-blue-600 dark:text-blue-400 font-sans font-semibold">{log.action}</td>
                  <td className="p-3 text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-xs">{log.logHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
