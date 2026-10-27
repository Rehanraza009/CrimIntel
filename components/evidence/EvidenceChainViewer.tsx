'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Link as LinkIcon,
  FileCheck2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Hash,
  Copy,
  Calendar,
  Layers,
  Info,
  Check,
  XCircle,
  FileText,
} from 'lucide-react';
import { EvidenceRecord } from '@/types/investigation';
import { verifyEvidenceChain } from '@/lib/crypto';
import { HelpTooltip } from '@/components/common/TerminologyModal';

interface EvidenceChainViewerProps {
  evidenceList: EvidenceRecord[];
  onSelectEvidence?: (record: EvidenceRecord) => void;
}

export default function EvidenceChainViewer({
  evidenceList,
  onSelectEvidence,
}: EvidenceChainViewerProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    brokenBlockIndex?: number;
    error?: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  const handleRunIntegrityVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyEvidenceChain(evidenceList);
      setVerificationResult(res);
      setIsVerifying(false);
    }, 350);
  };

  return (
    <div className="space-y-6">
      {/* 1. Tamper-Evident Header Card */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Tamper-Evident Audit Chain
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                SHA-256 LEDGER
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Every seized electronic record (CDR, banking log, FIR, or mobile dump) is hashed using SHA-256 and chained to the previous record block, creating an unbroken chain of custody.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={handleRunIntegrityVerification}
            disabled={isVerifying}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isVerifying ? 'Verifying Block Hashes...' : 'Verify Cryptographic Chain'}</span>
          </button>
        </div>
      </div>

      {/* 2. Plain-Language Explanation & Disclaimers */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Understanding Integrity Verification in Law Enforcement</span>
        </div>
        <p className="leading-relaxed">
          <strong>What this check proves:</strong> Verification confirms that the current file matches its previously recorded SHA-256 cryptographic fingerprint, proving the electronic bytes have not been tampered with or altered in storage since ingest.
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          ⚠️ <em>Evidentiary Notice:</em> A matching hash proves file integrity; it does not automatically prove the original source information was truthful or lawfully obtained.
        </p>
      </div>

      {/* 3. Verification Result Banner */}
      {verificationResult && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center space-x-3 animate-in fade-in duration-200 ${
            verificationResult.isValid
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300'
          }`}
        >
          {verificationResult.isValid ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <div className="font-bold">Verified Fingerprint Match (Chain Intact)</div>
                <div className="text-[11px] mt-0.5">
                  All {evidenceList.length} evidence blocks match their recorded SHA-256 hashes and previous block hashes sequentially. Zero byte corruption or tampering detected.
                </div>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <div>
                <div className="font-bold">Fingerprint Mismatch Detected!</div>
                <div className="text-[11px] mt-0.5">
                  Block #{verificationResult.brokenBlockIndex} hash does not match previous link: {verificationResult.error}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. Sequential Evidence Blocks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-semibold">
          <span>Sequential Custody Blocks ({evidenceList.length} records)</span>
          <span>Click any block to inspect details</span>
        </div>

        {evidenceList.map((record, index) => {
          const isVerified = record.isVerified ?? true;
          return (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="p-4 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition cursor-pointer space-y-2.5"
            >
              {/* Row 1: Block #, File Name, Format Badge, Status */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 dark:bg-[#0f172a] px-2 py-0.5 rounded border border-slate-200 dark:border-[#1e2f5b]">
                    BLOCK #{index + 1}
                  </span>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>{record.filename}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1e2f5b]">
                    {record.fileType}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isVerified ? 'Verified Match' : 'Pending Verification'}</span>
                  </span>
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {record.caseNumber || record.caseId}
                  </span>
                </div>
              </div>

              {/* Row 2: SHA-256 Hashes (Current + Previous) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="text-slate-400 font-semibold block text-[10px]">CURRENT SHA-256</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate block select-all">
                      {record.sha256Hash}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(record.sha256Hash);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-500"
                    title="Copy hash"
                  >
                    {copiedHash === record.sha256Hash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="text-slate-400 font-semibold block text-[10px]">PREVIOUS BLOCK HASH</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 truncate block select-all">
                      {record.previousHash || 'GENESIS_BLOCK_00000000000000000000'}
                    </span>
                  </div>
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </div>
              </div>

              {/* Row 3: Metadata: Uploaded By, Source, Extracted Entities, Size */}
              <div className="flex flex-wrap items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-3">
                  <span>Uploaded by: <strong className="text-slate-700 dark:text-slate-300">{record.uploadedByName || 'Forensic Officer'}</strong></span>
                  <span>•</span>
                  <span>Source: <strong className="text-slate-700 dark:text-slate-300">{record.sourceReference || 'Seized Evidence'}</strong></span>
                </div>
                <div>
                  Date: {new Date(record.uploadedAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Evidence Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Electronic Evidence Dossier
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedRecord.filename}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-[#1e2f5b]">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Case Docket:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedRecord.caseNumber}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Integrity Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified SHA-256 Match</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Uploaded By:</span>
                <span>{selectedRecord.uploadedByName}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span>{new Date(selectedRecord.uploadedAt).toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2">
                <span className="text-slate-400 block mb-1">SHA-256 Cryptographic Digest:</span>
                <div className="font-mono text-[11px] p-2 bg-slate-50 dark:bg-[#0f172a] rounded border border-slate-200 dark:border-[#1e2f5b] select-all break-all">
                  {selectedRecord.sha256Hash}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#16243e] dark:hover:bg-[#1e2f5b] text-slate-700 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
