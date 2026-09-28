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
  Layers
} from 'lucide-react';
import { EvidenceRecord } from '@/types/investigation';
import { verifyEvidenceChain } from '@/lib/crypto';

interface EvidenceChainViewerProps {
  evidenceList: EvidenceRecord[];
  onSelectEvidence?: (record: EvidenceRecord) => void;
}

export default function EvidenceChainViewer({ evidenceList, onSelectEvidence }: EvidenceChainViewerProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    brokenBlockIndex?: number;
    error?: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

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
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Chain Status Card */}
      <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-lg p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-100">Tamper-Evident Evidence Chain</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                SHA-256 VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Every item of electronic evidence is hashed using SHA-256 and linked sequentially to the preceding evidence record, creating an auditable cryptographic proof of custody and immutability.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunIntegrityVerification}
            disabled={isVerifying}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Cryptographic Chain'}</span>
          </button>
        </div>
      </div>

      {/* Verification result feedback banner */}
      {verificationResult && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center space-x-2.5 animate-in fade-in duration-200 ${
            verificationResult.isValid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {verificationResult.isValid ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Chain Verified:</strong> All {evidenceList.length} evidence blocks have matching cryptographic hashes. Zero tampering detected.
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>
                <strong>Integrity Failure:</strong> {verificationResult.error}
              </span>
            </>
          )}
        </div>
      )}

      {/* Sequential Chain of Blocks */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Evidence Blocks Sequence ({evidenceList.length} Records)</span>
          <span className="text-[11px] text-slate-500">Ordered by Chain Index</span>
        </div>

        {evidenceList.map((record, index) => {
          const isGenesis = record.previousHash === '0000000000000000000000000000000000000000000000000000000000000000';

          return (
            <div key={record.id} className="relative">
              {/* Connector Link between blocks */}
              {index > 0 && (
                <div className="flex items-center justify-center my-1">
                  <div className="flex items-center space-x-2 bg-[#132042] px-2.5 py-0.5 rounded-full border border-[#23386e] text-[10px] text-slate-400 font-mono">
                    <LinkIcon className="w-3 h-3 text-cyan-400" />
                    <span>Previous Hash Linked</span>
                  </div>
                </div>
              )}

              <div
                onClick={() => onSelectEvidence && onSelectEvidence(record)}
                className="bg-[#0d1633] border border-[#1e2f5b] hover:border-blue-500/50 rounded-lg p-4 transition shadow cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#18274d] gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-mono text-xs font-bold text-blue-300">
                      #{record.blockIndex}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition">
                        {record.fileName}
                      </h4>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span className="font-mono text-blue-300">{record.caseNumber || 'CASE-2026-001'}</span>
                        <span>•</span>
                        <span>{record.sourceType.replace(/_/g, ' ')}</span>
                        <span>•</span>
                        <span>{(record.fileSize / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                      <Lock className="w-3 h-3" />
                      <span>{record.integrityStatus}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                      {new Date(record.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Cryptographic Hashes Details */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  {/* Current Block Hash */}
                  <div className="bg-[#132042] p-2 rounded border border-[#23386e]">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="text-cyan-400 font-sans font-semibold">Current Block SHA-256</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(record.sha256Hash);
                        }}
                        className="hover:text-white flex items-center space-x-0.5"
                      >
                        <Copy className="w-2.5 h-2.5" />
                        <span>{copiedHash === record.sha256Hash ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-slate-200 text-[11px] truncate select-all">
                      {record.sha256Hash}
                    </div>
                  </div>

                  {/* Previous Block Hash */}
                  <div className="bg-[#132042] p-2 rounded border border-[#23386e]">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="text-amber-400 font-sans font-semibold">
                        {isGenesis ? 'Genesis Block (Root)' : 'Previous Block Hash (Parent)'}
                      </span>
                      {!isGenesis && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(record.previousHash);
                          }}
                          className="hover:text-white flex items-center space-x-0.5"
                        >
                          <Copy className="w-2.5 h-2.5" />
                          <span>{copiedHash === record.previousHash ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    <div className="text-slate-400 text-[11px] truncate select-all">
                      {record.previousHash}
                    </div>
                  </div>
                </div>

                {/* Extracted Stats */}
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#18274d] text-[11px] text-slate-400">
                  <div className="flex items-center space-x-4">
                    <span>Uploaded by: <strong className="text-slate-200">{record.uploadedByName || 'Authorized Officer'}</strong></span>
                    <span>Indexed Entities: <strong className="text-blue-300">{record.extractedEntitiesCount || 0}</strong></span>
                    <span>Relationships: <strong className="text-blue-300">{record.extractedRelationshipsCount || 0}</strong></span>
                  </div>
                  <div className="text-blue-400 group-hover:translate-x-0.5 transition flex items-center space-x-1 text-xs font-semibold">
                    <span>Inspect Evidence</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
