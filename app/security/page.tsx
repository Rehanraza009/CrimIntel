'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  History,
  FileCheck2,
  Users2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Key
} from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 mb-4 font-mono font-semibold">
            <span>CRYPTOGRAPHIC SECURITY ARCHITECTURE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Security, Integrity & Privacy by Design
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            Detailed technical documentation of the blockchain-inspired tamper-evident evidence chain, Row Level Security policies, and append-only audit verification.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/evidence"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow transition"
            >
              Inspect Live Evidence Chain
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-[#132042] hover:bg-[#1b2d5c] text-slate-300 text-xs font-semibold rounded-lg border border-[#23386e] transition"
            >
              Return Home
            </Link>
          </div>
        </div>

        {/* 1. Tamper-Evident Hash Chain Architecture */}
        <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">1. Tamper-Evident SHA-256 Hash Chain</h3>
              <p className="text-xs text-slate-400">Blockchain-inspired immutable verification without public ledger token overhead</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every uploaded electronic file (FIR, CDR, Bank CSV, Surveillance report) receives a cryptographic SHA-256 digest. This digest is bound to the preceding block&apos;s hash, timestamp, and index:
          </p>
          <div className="p-3 bg-[#091124] rounded-lg border border-[#1e2f5b] font-mono text-xs text-cyan-300">
            Hash<sub>n</sub> = SHA-256(BlockIndex<sub>n</sub> || PrevHash<sub>n-1</sub> || ContentPayload || Timestamp)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            If an unauthorized actor alters an evidence record in the database, the cryptographic hash verification will immediately fail, flagging the exact corrupted block index to administrators.
          </p>
        </div>

        {/* 2. Role-Based Access Control & Supabase RLS */}
        <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">2. Row Level Security (RLS) & Granular Roles</h3>
              <p className="text-xs text-slate-400">Enforced directly in PostgreSQL at the database level</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#1e2f5b]">
              <thead className="bg-[#132042] text-slate-300 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3 border-b border-[#1e2f5b]">Role</th>
                  <th className="p-3 border-b border-[#1e2f5b]">Permissions</th>
                  <th className="p-3 border-b border-[#1e2f5b]">Case Scope</th>
                  <th className="p-3 border-b border-[#1e2f5b]">Audit & User Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2f5b] text-slate-300">
                <tr>
                  <td className="p-3 font-bold text-rose-400">ADMIN</td>
                  <td className="p-3">Manage Users, Cases, Evidence, Settings</td>
                  <td className="p-3">Global (All Cases)</td>
                  <td className="p-3">Full Access</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-400">INVESTIGATOR</td>
                  <td className="p-3">Create Cases, Upload Evidence, Merge Entities, Reports</td>
                  <td className="p-3">Assigned & Team Cases</td>
                  <td className="p-3">Read-Only Case Audits</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-purple-400">ANALYST</td>
                  <td className="p-3">Analyze Network, Filter Timeline, Run AI Extractions</td>
                  <td className="p-3">Authorized Cases</td>
                  <td className="p-3">No Access</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-emerald-400">VIEWER</td>
                  <td className="p-3">Read-Only Graph and Report Inspection (Judiciary / Auditing)</td>
                  <td className="p-3">Explicitly Shared Cases</td>
                  <td className="p-3">No Access</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Append-Only Audit Logging */}
        <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">3. Immutable Append-Only Audit Logs</h3>
              <p className="text-xs text-slate-400">Strictly non-deletable records of all officer queries and modifications</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The <code className="text-cyan-300 font-mono">public.audit_logs</code> table implements an INSERT-only policy with no UPDATE or DELETE privileges granted to application roles. Each audit event hashes the previous audit record, forming a parallel audit blockchain.
          </p>
        </div>
      </div>
    </div>
  );
}
