'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  UploadCloud,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { EvidenceRecord, InvestigationCase } from '@/types/investigation';
import EvidenceChainViewer from '@/components/evidence/EvidenceChainViewer';

export default function EvidencePage() {
  const [cases, setCases] = useState<InvestigationCase[]>(() => InvestigationStore.getCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(() => InvestigationStore.getEvidence());

  const updateEvidence = (caseId: string) => {
    if (caseId === 'all') {
      setEvidenceList(InvestigationStore.getEvidence());
    } else {
      setEvidenceList(InvestigationStore.getEvidence(caseId));
    }
  };

  const handleCaseChange = (caseId: string) => {
    setSelectedCaseId(caseId);
    updateEvidence(caseId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111c30] p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-[#263650] shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
              DIGITAL CHAIN OF CUSTODY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Evidence Vault & Cryptographic Chain
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Sequential SHA-256 block-linked repository maintaining strict legal integrity and chain of custody.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <select
            value={selectedCaseId}
            onChange={(e) => handleCaseChange(e.target.value)}
            className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#263650] focus:outline-none max-w-[200px] truncate"
          >
            <option value="all">Global (All 10 Cases)</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.title.slice(0, 20)}...
              </option>
            ))}
          </select>

          <Link
            href="/import"
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Evidence</span>
          </Link>
        </div>
      </div>

      {/* Chain Viewer Component */}
      <EvidenceChainViewer evidenceList={evidenceList} />
    </div>
  );
}
