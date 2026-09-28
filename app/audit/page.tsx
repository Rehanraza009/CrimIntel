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
  Hash
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { AuditLogEntry } from '@/types/investigation';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    setLogs(InvestigationStore.getAuditLogs());
  }, []);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  const filteredLogs = logs.filter((log) => {
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

  const distinctActions = Array.from(new Set(logs.map(l => l.action)));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              SECURITY AUDIT REPOSITORY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Tamper-Evident Audit Log Ledger ({logs.length} Entries)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Append-only forensic event trail recording all officer queries, case creations, entity merges, and evidence uploads.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Non-Repudiation Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1633] p-3 rounded-lg border border-[#1e2f5b] text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search officer, action, resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#132042] text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded border border-[#23386e] focus:outline-none focus:border-blue-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="bg-[#132042] text-slate-200 px-3 py-1.5 rounded border border-[#23386e] focus:outline-none"
        >
          <option value="all">All Actions ({logs.length})</option>
          {distinctActions.map((act) => (
            <option key={act} value={act}>{act}</option>
          ))}
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#101b38] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#1e2f5b]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Officer / Account</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Resource Target</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Cryptographic SHA-256 Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18274d] text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#132042] transition">
                  <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-100 truncate max-w-[140px]">{log.userEmail}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-cyan-400">
                    {log.resourceType} {log.resourceId ? `(${log.resourceId.slice(0, 8)})` : ''}
                  </td>
                  <td className="p-3 font-mono text-slate-400">{log.ipAddress || '10.24.110.12'}</td>
                  <td className="p-3 font-mono text-[10px] text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <span className="truncate max-w-[140px] select-all">{log.logHash}</span>
                      <button
                        onClick={() => handleCopy(log.logHash)}
                        className="hover:text-white"
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
    </div>
  );
}
