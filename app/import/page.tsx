'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { UploadCloud, ShieldCheck, Database, Layers } from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { InvestigationCase } from '@/types/investigation';
import IngestionWizard from '@/components/ingest/IngestionWizard';

export const dynamic = 'force-dynamic';

function ImportContent() {
  const searchParams = useSearchParams();
  const defaultCaseId = searchParams.get('case') || undefined;

  const [cases, setCases] = useState<InvestigationCase[]>([]);

  useEffect(() => {
    setCases(InvestigationStore.getCases());
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              EVIDENCE INGESTION & PIPELINE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Data Ingestion & Extraction Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload multi-format investigation records (FIR, CDR, Bank Ledgers, Surveillance Memos) to auto-extract entities and link into knowledge graph.
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>SHA-256 Chain Ready</span>
        </div>
      </div>

      {/* Main Wizard */}
      <IngestionWizard cases={cases} defaultCaseId={defaultCaseId} />
    </div>
  );
}

export default function ImportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Ingestion Wizard...</div>}>
      <ImportContent />
    </Suspense>
  );
}
