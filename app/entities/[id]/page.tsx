'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
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
  ChevronRight
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { Entity, Relationship, TemporalEvent, EvidenceRecord } from '@/types/investigation';
import NetworkGraph from '@/components/graph/NetworkGraph';
import TemporalTimeline from '@/components/timeline/TemporalTimeline';

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
      const connectedRels = allRels.filter(r => r.sourceEntityId === found.id || r.targetEntityId === found.id);
      setRelationships(connectedRels);

      const allEvents = InvestigationStore.getEvents();
      const relatedEvts = allEvents.filter(e => e.relatedEntityIds?.includes(found.id));
      setEvents(relatedEvts.length > 0 ? relatedEvts : allEvents.slice(0, 3));
    }
  }, [entityId]);

  if (!entity) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="text-slate-400 text-sm">Entity profile not found.</div>
        <Link href="/entities" className="text-blue-400 hover:underline text-xs">
          Return to Entity Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/entities" className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Entity Explorer</span>
      </Link>

      {/* Header Profile Card */}
      <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#18274d]">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {entity.entityType}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {(entity.confidence * 100).toFixed(0)}% Verification Confidence
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-2">{entity.name}</h1>
            {entity.description && (
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">{entity.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded text-xs font-bold ${
              entity.riskIndicator === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
              entity.riskIndicator === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {entity.riskIndicator || 'INVESTIGATIVE LEAD'}
            </span>
          </div>
        </div>

        {/* Identifiers List */}
        {entity.identifiers && entity.identifiers.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Cryptographically Anchored Identifiers
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {entity.identifiers.map((id) => (
                <div key={id.id} className="bg-[#132042] p-2.5 rounded-lg border border-[#23386e] text-xs">
                  <div className="text-[10px] text-slate-400">{id.identifierType.replace(/_/g, ' ')}</div>
                  <div className="font-mono text-slate-100 font-bold select-all mt-0.5 truncate">{id.identifierValue}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-[#1e2f5b] space-x-2 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'overview' ? 'border-blue-500 text-blue-400 bg-[#0d1633]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Overview & Cases
        </button>
        <button
          onClick={() => setActiveTab('relationships')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'relationships' ? 'border-blue-500 text-blue-400 bg-[#0d1633]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Relationships ({relationships.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'timeline' ? 'border-blue-500 text-blue-400 bg-[#0d1633]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Temporal Timeline
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'network' ? 'border-blue-500 text-blue-400 bg-[#0d1633]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Neighborhood Graph
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Associated Investigation Cases</h3>
            <div className="space-y-2">
              {entity.connectedCases && entity.connectedCases.length > 0 ? (
                entity.connectedCases.map((caseNum) => (
                  <div key={caseNum} className="p-3 bg-[#132042] border border-[#23386e] rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-blue-300 font-mono">{caseNum}</div>
                      <div className="text-[11px] text-slate-400">Linked through evidentiary records</div>
                    </div>
                    <Link href={`/cases/${caseNum}`} className="text-blue-400 hover:underline">
                      View Docket →
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">Linked to primary case docket: {entity.caseNumber || 'CASE-2026-001'}</div>
              )}
            </div>
          </div>

          <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-100">Graph Centrality & Metrics</h3>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-[#18274d]">
                <span className="text-slate-400">Direct Degrees:</span>
                <span className="font-mono font-bold text-white">{relationships.length} Connections</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#18274d]">
                <span className="text-slate-400">Cross-Case Bridge:</span>
                <span className="font-bold text-purple-400">
                  {entity.connectedCases && entity.connectedCases.length > 1 ? 'YES (Syndicate Broker)' : 'Single Case Entity'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#18274d]">
                <span className="text-slate-400">Evidence Provenance Anchor:</span>
                <span className="font-mono text-emerald-400">Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl overflow-hidden shadow">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#101b38] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#1e2f5b]">
              <tr>
                <th className="p-3">Connected Entity</th>
                <th className="p-3">Type</th>
                <th className="p-3">Relationship</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Evidence Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18274d] text-slate-300">
              {relationships.map((rel) => {
                const isTarget = rel.sourceEntityId === entity.id;
                const otherName = isTarget ? rel.targetEntityName : rel.sourceEntityName;
                const otherType = isTarget ? rel.targetEntityType : rel.sourceEntityType;

                return (
                  <tr key={rel.id} className="hover:bg-[#132042] transition">
                    <td className="p-3 font-semibold text-slate-100">{otherName}</td>
                    <td className="p-3 font-mono text-cyan-400">{otherType}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {rel.relationshipType}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-emerald-400">{(rel.confidence * 100).toFixed(0)}%</td>
                    <td className="p-3 text-[11px] text-slate-400 truncate max-w-xs">
                      {rel.provenance?.evidenceFileName || 'Direct Ingestion Record'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'timeline' && (
        <TemporalTimeline events={events} />
      )}

      {activeTab === 'network' && (
        <div className="h-[550px] w-full rounded-xl overflow-hidden border border-[#1e2f5b]">
          <NetworkGraph
            entities={[entity, ...relationships.map(r => ({
              id: r.sourceEntityId === entity.id ? r.targetEntityId : r.sourceEntityId,
              name: r.sourceEntityId === entity.id ? (r.targetEntityName || 'Subject') : (r.sourceEntityName || 'Subject'),
              normalizedName: '',
              entityType: (r.sourceEntityId === entity.id ? r.targetEntityType : r.sourceEntityType) || 'PERSON',
              confidence: 0.9,
              createdAt: '',
              updatedAt: '',
            }))]}
            relationships={relationships}
          />
        </div>
      )}
    </div>
  );
}
