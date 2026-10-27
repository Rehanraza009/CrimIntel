'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Copy,
  CheckCircle2,
  Calendar,
  User,
  Hash,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { AuditLogEntry } from '@/types/investigation';
import { verifyAuditChain } from '@/lib/crypto';
import { HelpTooltip, TerminologyModal } from '@/components/common/TerminologyModal';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => InvestigationStore.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<{ isValid: boolean; error?: string } | null>(null);
  const [showTerminologyModal, setShowTerminologyModal] = useState(false);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  const handleVerifyLedger = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyAuditChain(logs);
      setVerifyResult(res);
      setIsVerifying(false);
    }, 150);
  };

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      if (selectedAction !== 'all' && log.action !== selectedAction) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.userEmail.toLowerCase().includes(q) ||
          log.resourceType.toLowerCase().includes(q) ||
          (log.caseId && log.caseId.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [logs, selectedAction, searchQuery]);

  const distinctActions = React.useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.action)));
  }, [logs]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111c30] p-5 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
              SECURITY AUDIT REPOSITORY
            </span>
            <HelpTooltip termKey="Tamper-Evident Ledger" onOpenModal={() => setShowTerminologyModal(true)} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#f1f5f9] mt-1">
            Tamper-Evident Audit Chain ({logs.length} Entries)
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#a7b4c8] mt-1">
            Sequential append-only forensic event trail recording officer queries, docket creations, entity merges, and evidence uploads.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleVerifyLedger}
            disabled={isVerifying}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isVerifying ? 'Verifying Chain...' : 'Verify Audit Chain'}</span>
          </button>
          <div className="hidden sm:flex items-center space-x-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 rounded border border-emerald-200 dark:border-emerald-500/30">
            <span>Non-Repudiation</span>
          </div>
        </div>
      </div>

      {verifyResult && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center space-x-2.5 animate-in fade-in duration-200 ${
            verifyResult.isValid
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
          }`}
        >
          {verifyResult.isValid ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Audit Chain Verified:</strong> Sequential SHA-256 block hash linking is 100% intact across all {logs.length} audit entries. Zero unauthorized deletions or modifications detected.
              </span>
            </>
          ) : (
            <span>{verifyResult.error}</span>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#0f172a] p-3 rounded-lg border border-slate-200 dark:border-[#263650] text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search officer, action, resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#111c30] text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded border border-slate-200 dark:border-[#263650] focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="bg-white dark:bg-[#111c30] text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded border border-slate-200 dark:border-[#263650] focus:outline-none"
        >
          <option value="all">All Actions ({logs.length})</option>
          {distinctActions.map((act) => (
            <option key={act} value={act}>{act}</option>
          ))}
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-[#263650]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Officer / Account</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Resource Target</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Cryptographic SHA-256 Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#18274d] text-slate-700 dark:text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#132042] transition">
                  <td className="p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">{log.userEmail}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-blue-600 dark:text-cyan-400">
                    {log.resourceType} {log.resourceId ? `(${log.resourceId.slice(0, 8)})` : ''}
                  </td>
                  <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{log.ipAddress || '10.24.110.12'}</td>
                  <td className="p-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <span className="truncate max-w-[140px] select-all">{log.logHash}</span>
                      <button
                        onClick={() => handleCopy(log.logHash)}
                        className="hover:text-blue-600 dark:hover:text-white transition"
                        title="Copy Hash"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TerminologyModal
        isOpen={showTerminologyModal}
        onClose={() => setShowTerminologyModal(false)}
        initialTerm="Tamper-Evident Ledger"
      />
    </div>
  );
}

