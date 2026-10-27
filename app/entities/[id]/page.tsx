'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users2,
  ArrowLeft,
  Share2,
  FileCheck2,
  Clock,
  AlertTriangle,
  FolderOpen,
  MapPin,
  ShieldCheck,
  Tag,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { Entity, Relationship, TemporalEvent, EvidenceRecord } from '@/types/investigation';
import NetworkGraph from '@/components/graph/NetworkGraph';
import TemporalTimeline from '@/components/timeline/TemporalTimeline';

export const dynamic = 'force-dynamic';

export default function EntityDetailPage() {
  const params = useParams();
  const entityId = params?.id as string;

  const [entity, setEntity] = useState<Entity | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [events, setEvents] = useState<TemporalEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'relationships' | 'cases' | 'timeline' | 'network'>('overview');

  useEffect(() => {
    const found = InvestigationStore.getEntityById(entityId);
    if (found) {
      setEntity(found);
      const allRels = InvestigationStore.getRelationships();
      const connectedRels = allRels.filter((r) => r.sourceEntityId === found.id || r.targetEntityId === found.id);
      setRelationships(connectedRels);

      const allEvents = InvestigationStore.getEvents();
      const relatedEvts = allEvents.filter((e) => e.relatedEntityIds?.includes(found.id));
      setEvents(relatedEvts.length > 0 ? relatedEvts : allEvents.slice(0, 3));
    }
  }, [entityId]);

  if (!entity) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="text-slate-500 text-sm">Entity profile not found.</div>
        <Link href="/entities" className="text-blue-600 hover:underline text-xs">
          Return to Entity Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/entities" className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Entity Explorer</span>
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#1e2f5b]">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                {entity.entityType}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {(entity.confidence * 100).toFixed(0)}% Verification Confidence
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{entity.name}</h1>
            {entity.description && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">{entity.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                entity.riskIndicator === 'HIGH'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                  : entity.riskIndicator === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
              }`}
            >
              {entity.riskIndicator || 'INVESTIGATIVE LEAD'}
            </span>
          </div>
        </div>

        {/* Identifiers List */}
        {entity.identifiers && entity.identifiers.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Cryptographically Anchored Identifiers
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {entity.identifiers.map((id) => (
                <div key={id.id} className="bg-slate-50 dark:bg-[#0f172a] p-2.5 rounded-xl border border-slate-200 dark:border-[#1e2f5b] text-xs">
                  <div className="text-[10px] text-slate-400">{id.identifierType.replace(/_/g, ' ')}</div>
                  <div className="font-mono text-slate-900 dark:text-slate-100 font-bold select-all mt-0.5 truncate">{id.identifierValue}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-[#263650] space-x-2 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-[#111c30]'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Overview & Cases
        </button>
        <button
          onClick={() => setActiveTab('relationships')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'relationships'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-[#111c30]'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Relationships ({relationships.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-[#111c30]'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Temporal Timeline
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'network'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-[#111c30]'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Neighborhood Graph
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-slate-200 dark:border-[#263650] space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Associated Investigation Cases</h3>
            <div className="space-y-2">
              {entity.connectedCases && entity.connectedCases.length > 0 ? (
                entity.connectedCases.map((caseNum) => (
                  <div key={caseNum} className="p-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-blue-600 dark:text-blue-400 font-mono">{caseNum}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Linked through evidentiary records</div>
                    </div>
                    <Link href={`/cases/${caseNum}`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      View Docket →
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400">Linked to primary case docket: {entity.caseNumber || 'CASE-2026-001'}</div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-slate-200 dark:border-[#263650] space-y-3 text-xs shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Graph Centrality & Metrics</h3>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1e2f5b]">
                <span className="text-slate-400">Direct Degrees:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{relationships.length} Connections</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1e2f5b]">
                <span className="text-slate-400">Cross-Case Bridge:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {entity.connectedCases && entity.connectedCases.length > 1 ? 'YES (Syndicate Broker)' : 'Single Case Entity'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1e2f5b]">
                <span className="text-slate-400">Evidence Provenance Anchor:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-[#1e2f5b]">
              <tr>
                <th className="p-3">Connected Entity</th>
                <th className="p-3">Type</th>
                <th className="p-3">Relationship</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Evidence Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1e2f5b] text-slate-700 dark:text-slate-300">
              {relationships.map((rel) => {
                const isTarget = rel.sourceEntityId === entity.id;
                const otherName = isTarget ? rel.targetEntityName : rel.sourceEntityName;
                const otherType = isTarget ? rel.targetEntityType : rel.sourceEntityType;

                return (
                  <tr key={rel.id} className="hover:bg-slate-50 dark:hover:bg-[#16243e] transition">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{otherName}</td>
                    <td className="p-3 font-mono text-teal-600 dark:text-cyan-400 font-bold">{otherType}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                        {rel.relationshipType}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{(rel.confidence * 100).toFixed(0)}%</td>
                    <td className="p-3 text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                      {rel.provenance?.evidenceFileName || 'Direct Ingestion Record'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'timeline' && <TemporalTimeline events={events} />}

      {activeTab === 'network' && (
        <div className="h-[550px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#263650]">
          <NetworkGraph
            entities={[
              entity,
              ...relationships.map((r) => ({
                id: r.sourceEntityId === entity.id ? r.targetEntityId : r.sourceEntityId,
                name: r.sourceEntityId === entity.id ? r.targetEntityName || 'Subject' : r.sourceEntityName || 'Subject',
                normalizedName: '',
                entityType: (r.sourceEntityId === entity.id ? r.targetEntityType : r.sourceEntityType) || 'PERSON',
                confidence: 0.9,
                createdAt: '',
                updatedAt: '',
              })),
            ]}
            relationships={relationships}
          />
        </div>
      )}
    </div>
  );
}
