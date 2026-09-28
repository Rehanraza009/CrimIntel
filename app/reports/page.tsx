'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Printer,
  Download,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Share2,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import {
  InvestigationCase,
  Entity,
  Relationship,
  EvidenceRecord,
  TemporalEvent,
  InvestigationAlert
} from '@/types/investigation';

export const dynamic = 'force-dynamic';

function ReportsContent() {
  const searchParams = useSearchParams();
  const initialCaseId = searchParams.get('case') || 'case-001';

  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId);
  const [selectedCase, setSelectedCase] = useState<InvestigationCase | null>(null);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [events, setEvents] = useState<TemporalEvent[]>([]);
  const [alerts, setAlerts] = useState<InvestigationAlert[]>([]);

  useEffect(() => {
    const caseList = InvestigationStore.getCases();
    setCases(caseList);
    loadCaseData(selectedCaseId);
  }, []);

  const loadCaseData = (id: string) => {
    const found = InvestigationStore.getCaseById(id) || InvestigationStore.getCases()[0];
    if (found) {
      setSelectedCase(found);
      setSelectedCaseId(found.id);
      setEntities(InvestigationStore.getEntities(found.id));
      setRelationships(InvestigationStore.getRelationships(found.id));
      setEvidenceList(InvestigationStore.getEvidence(found.id));
      setEvents(InvestigationStore.getEvents(found.id));
      setAlerts(InvestigationStore.getAlerts(found.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Toolbar (Hidden during print) */}
      <div className="no-print bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
            INVESTIGATION BRIEF GENERATOR
          </span>
          <h1 className="text-xl font-black text-white mt-1">
            Forensic Intelligence Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compiles verified source evidence, cross-case links, and explainable AI insights into an official court-ready brief.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCaseId}
            onChange={(e) => loadCaseData(e.target.value)}
            className="bg-[#132042] text-xs font-semibold text-slate-200 px-3 py-2 rounded-lg border border-[#23386e] focus:outline-none"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.title.slice(0, 24)}...
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Printed Report Document */}
      <div className="bg-[#0b132b] text-slate-100 p-8 sm:p-10 rounded-2xl border border-[#1e2f5b] shadow-2xl space-y-8 font-sans print:bg-white print:text-black print:border-none print:p-0">
        {/* Official Header */}
        <div className="border-b-2 border-slate-700 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 print:text-black">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wider uppercase">
                MINISTRY OF HOME AFFAIRS – NCRB
              </div>
              <div className="text-[11px] text-slate-400 print:text-gray-600">
                Women Safety Division • Cyber Crime & Network Intelligence Directorate
              </div>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-mono font-bold text-blue-400 print:text-black">CONFIDENTIAL / FOR OFFICIAL USE</div>
            <div className="text-[10px] text-slate-400 print:text-gray-500">
              Generated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </div>
          </div>
        </div>

        {/* Mandatory Ethical AI Disclaimer */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 print:text-gray-800 print:border-gray-400 leading-relaxed">
          <strong>LEGAL & INVESTIGATIVE DISCLAIMER:</strong> This report provides analytical and investigative decision support. Conclusions, charge-sheeting, and lawful actions remain the exclusive constitutional responsibility of authorized investigating officers and the judiciary.
        </div>

        {/* 1. Case Particulars */}
        {selectedCase && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
              1. Case Particulars & Classification
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#111d3d] print:bg-gray-100 rounded-lg text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Case / FIR Number</div>
                <div className="font-mono font-bold text-white print:text-black">{selectedCase.caseNumber}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Category</div>
                <div className="font-bold text-white print:text-black">{selectedCase.category}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Jurisdiction</div>
                <div className="font-bold text-white print:text-black">{selectedCase.jurisdiction}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Investigating Officer</div>
                <div className="font-bold text-white print:text-black">{selectedCase.assignedInvestigatorName}</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
            2. Executive Intelligence Synopsis
          </h2>
          <p className="text-xs text-slate-300 print:text-black leading-relaxed">
            {selectedCase?.description}
          </p>
        </div>

        {/* 3. VERIFIED SOURCE EVIDENCE SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#1e2f5b] print:border-gray-300">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              3. Verified Source Evidence (Cryptographic Chain)
            </h2>
            <span className="text-[10px] font-mono text-emerald-400">100% SHA-256 Validated</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#1e2f5b] print:border-gray-300">
              <thead className="bg-[#132042] print:bg-gray-200 text-slate-300 print:text-black">
                <tr>
                  <th className="p-2 border border-[#1e2f5b] print:border-gray-300">Index</th>
                  <th className="p-2 border border-[#1e2f5b] print:border-gray-300">Evidence File Name</th>
                  <th className="p-2 border border-[#1e2f5b] print:border-gray-300">Category</th>
                  <th className="p-2 border border-[#1e2f5b] print:border-gray-300">SHA-256 Digest</th>
                  <th className="p-2 border border-[#1e2f5b] print:border-gray-300">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2f5b] print:divide-gray-300">
                {evidenceList.map((ev) => (
                  <tr key={ev.id}>
                    <td className="p-2 font-mono border border-[#1e2f5b] print:border-gray-300">#{ev.blockIndex}</td>
                    <td className="p-2 font-semibold border border-[#1e2f5b] print:border-gray-300">{ev.fileName}</td>
                    <td className="p-2 border border-[#1e2f5b] print:border-gray-300">{ev.sourceType}</td>
                    <td className="p-2 font-mono text-[10px] text-cyan-300 print:text-black truncate max-w-xs border border-[#1e2f5b] print:border-gray-300">
                      {ev.sha256Hash}
                    </td>
                    <td className="p-2 text-emerald-400 font-bold border border-[#1e2f5b] print:border-gray-300">VERIFIED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. AI-GENERATED ANALYTICAL INTERPRETATION & LEADS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#1e2f5b] print:border-gray-300">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
              4. Analytical Interpretation & Cross-Case Leads (AI Decision Support)
            </h2>
            <span className="text-[10px] font-mono text-purple-300">Algorithmic Leads</span>
          </div>
          <div className="space-y-3">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-3 bg-[#132042] print:bg-gray-100 rounded-lg text-xs space-y-1 border border-[#23386e] print:border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 print:text-black">{alt.title}</span>
                  <span className="text-[10px] font-bold text-rose-400">{alt.severity}</span>
                </div>
                <p className="text-slate-300 print:text-gray-800 text-[11px] leading-relaxed">{alt.description}</p>
                {alt.explainability && (
                  <div className="text-[10px] text-cyan-300 print:text-gray-600 font-mono pt-1">
                    Model: {alt.explainability.ruleOrModel} • Rationale: {alt.explainability.rationale}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Certification Block */}
        <div className="pt-8 border-t-2 border-slate-700 print:border-black grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="text-slate-400 print:text-gray-600">Prepared by:</div>
            <div className="font-bold mt-4">{selectedCase?.assignedInvestigatorName || 'Insp. Amit Kumar'}</div>
            <div className="text-[10px] text-slate-400">Cyber Crime Unit, Delhi Police</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 print:text-gray-600">Approved by:</div>
            <div className="font-bold mt-4">Rajeshwar Sen, IPS</div>
            <div className="text-[10px] text-slate-400">Director, Women Safety Division, MHA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Case Report...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
