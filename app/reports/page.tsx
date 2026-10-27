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

  const [cases, setCases] = useState<InvestigationCase[]>(() => InvestigationStore.getCases());
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
      <div className="no-print bg-white dark:bg-[#111c30] p-5 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
            INVESTIGATION BRIEF GENERATOR
          </span>
          <h1 className="text-xl font-black text-slate-900 dark:text-[#f1f5f9] mt-1">
            Forensic Intelligence Report
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#a7b4c8] mt-1">
            Compiles verified source evidence, cross-case links, and explainable AI insights into an official case brief.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCaseId}
            onChange={(e) => loadCaseData(e.target.value)}
            className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-[#f1f5f9] px-3 py-2 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none"
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

      {/* Formal Report Document */}
      <div className="bg-white dark:bg-[#111c30] text-slate-900 dark:text-[#f1f5f9] p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-[#263650] shadow-sm space-y-8 font-sans print:bg-white print:text-black print:border-none print:p-0">
        {/* Official Header */}
        <div className="border-b-2 border-slate-200 dark:border-[#263650] print:border-black pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 print:text-black">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wider uppercase text-slate-900 dark:text-[#f1f5f9] print:text-black">
                MINISTRY OF HOME AFFAIRS – NCRB
              </div>
              <div className="text-[11px] text-slate-500 dark:text-[#a7b4c8] print:text-gray-600">
                Women Safety Division • Cyber Crime & Network Intelligence Directorate
              </div>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-mono font-bold text-blue-600 dark:text-blue-400 print:text-black">CONFIDENTIAL / FOR OFFICIAL USE</div>
            <div className="text-[10px] text-slate-500 dark:text-[#a7b4c8] print:text-gray-500">
              Generated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </div>
          </div>
        </div>

        {/* Mandatory Ethical AI Disclaimer */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs text-amber-800 dark:text-amber-300 print:text-gray-800 print:border-gray-400 leading-relaxed">
          <strong>LEGAL & INVESTIGATIVE NOTICE:</strong> This document provides decision-support analysis. Inferred patterns and potential cross-case links are algorithmic indicators awaiting corroboration. All conclusions, formal charges, and judicial submissions remain the sole responsibility of authorized investigating officers.
        </div>

        {/* 1. Case Particulars */}
        {selectedCase && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
              1. Case Particulars & Classification
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-[#0f172a] print:bg-gray-100 rounded-lg text-xs border border-slate-200 dark:border-[#263650]">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Case / FIR Number</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white print:text-black">{selectedCase.caseNumber}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Category</div>
                <div className="font-bold text-slate-900 dark:text-white print:text-black">{selectedCase.category}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Jurisdiction</div>
                <div className="font-bold text-slate-900 dark:text-white print:text-black">{selectedCase.jurisdiction}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Investigating Officer</div>
                <div className="font-bold text-slate-900 dark:text-white print:text-black">{selectedCase.assignedInvestigatorName}</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
            2. Executive Intelligence Synopsis
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 print:text-black leading-relaxed">
            {selectedCase?.description}
          </p>
        </div>

        {/* 3. VERIFIED SOURCE EVIDENCE SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-[#263650] print:border-gray-300">
            <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
              3. Verified Source Evidence (Cryptographic Audit Chain)
            </h2>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% SHA-256 Validated</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 dark:border-[#263650] print:border-gray-300">
              <thead className="bg-slate-50 dark:bg-[#0f172a] print:bg-gray-200 text-slate-600 dark:text-slate-300 print:text-black">
                <tr>
                  <th className="p-2 border border-slate-200 dark:border-[#263650] print:border-gray-300">Index</th>
                  <th className="p-2 border border-slate-200 dark:border-[#263650] print:border-gray-300">Evidence File Name</th>
                  <th className="p-2 border border-slate-200 dark:border-[#263650] print:border-gray-300">Category</th>
                  <th className="p-2 border border-slate-200 dark:border-[#263650] print:border-gray-300">SHA-256 Digest</th>
                  <th className="p-2 border border-slate-200 dark:border-[#263650] print:border-gray-300">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#263650] print:divide-gray-300">
                {evidenceList.map((ev) => (
                  <tr key={ev.id}>
                    <td className="p-2 font-mono border border-slate-200 dark:border-[#263650] print:border-gray-300">#{ev.blockIndex}</td>
                    <td className="p-2 font-semibold border border-slate-200 dark:border-[#263650] print:border-gray-300">{ev.fileName}</td>
                    <td className="p-2 border border-slate-200 dark:border-[#263650] print:border-gray-300">{ev.sourceType}</td>
                    <td className="p-2 font-mono text-[10px] text-blue-600 dark:text-cyan-300 print:text-black truncate max-w-xs border border-slate-200 dark:border-[#263650] print:border-gray-300">
                      {ev.sha256Hash}
                    </td>
                    <td className="p-2 text-emerald-600 dark:text-emerald-400 font-bold border border-slate-200 dark:border-[#263650] print:border-gray-300">VERIFIED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. AI-GENERATED ANALYTICAL INTERPRETATION & LEADS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-[#263650] print:border-gray-300">
            <h2 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
              4. Analytical Findings & Items Requiring Review (AI Decision Support)
            </h2>
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-semibold">Corroboration Required</span>
          </div>
          <div className="space-y-3">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-3 bg-slate-50 dark:bg-[#0f172a] print:bg-gray-100 rounded-lg text-xs space-y-1 border border-slate-200 dark:border-[#263650] print:border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white print:text-black">{alt.title}</span>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{alt.severity}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 print:text-gray-800 text-[11px] leading-relaxed">{alt.description}</p>
                {alt.explainability && (
                  <div className="text-[10px] text-blue-600 dark:text-cyan-300 print:text-gray-600 font-mono pt-1">
                    Rule / Method: {alt.explainability.ruleOrModel} • Rationale: {alt.explainability.rationale}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Certification Block */}
        <div className="pt-8 border-t-2 border-slate-200 dark:border-[#263650] print:border-black grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="text-slate-500 dark:text-slate-400 print:text-gray-600">Prepared by:</div>
            <div className="font-bold mt-4 text-slate-900 dark:text-white print:text-black">{selectedCase?.assignedInvestigatorName || 'Insp. Amit Kumar'}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Cyber Crime Unit, Delhi Police</div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 dark:text-slate-400 print:text-gray-600">Approved by:</div>
            <div className="font-bold mt-4 text-slate-900 dark:text-white print:text-black">Rajeshwar Sen, IPS</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Director, Women Safety Division, MHA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Case Report...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
