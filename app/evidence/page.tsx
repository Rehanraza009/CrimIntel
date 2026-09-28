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
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);

  useEffect(() => {
    setCases(InvestigationStore.getCases());
    updateEvidence('all');
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              DIGITAL CHAIN OF CUSTODY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Evidence Vault & Cryptographic Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable SHA-256 block-linked repository maintaining strict legal chain of custody.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <select
            value={selectedCaseId}
            onChange={(e) => handleCaseChange(e.target.value)}
            className="bg-[#132042] text-xs font-semibold text-slate-200 px-3 py-2 rounded-lg border border-[#23386e] focus:outline-none max-w-[200px] truncate"
          >
            <option value="all">Global (All Cases)</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.title.slice(0, 20)}...
              </option>
            ))}
          </select>

          <Link
            href="/import"
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest New Evidence</span>
          </Link>
        </div>
      </div>

      {/* Chain Viewer Component */}
      <EvidenceChainViewer evidenceList={evidenceList} />
    </div>
  );
}
