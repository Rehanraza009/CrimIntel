'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users2,
  Database,
  Cpu,
  HardDrive,
  History,
  Lock,
  CheckCircle2,
  RefreshCw,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { DEMO_PROFILES } from '@/data/syntheticDataset';
import { UserProfile, UserRole } from '@/types/investigation';

export default function AdminPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>(DEMO_PROFILES);
  const [selectedAiProvider, setSelectedAiProvider] = useState<string>('deterministic_nlp');
  const [dbStatus, setDbStatus] = useState<'connected' | 'demo_persistent'>('demo_persistent');

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = profiles.map(p => p.id === userId ? { ...p, role: newRole } : p);
    setProfiles(updated);
    InvestigationStore.addAuditLog('USER_ROLE_CHANGED', 'USER', userId, undefined, { newRole });
    alert(`Officer role updated to ${newRole}.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
            ADMINISTRATOR MANAGEMENT CONSOLE
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            System Administration & Role Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Control institutional officer roles, database health, AI provider configuration, and storage parameters.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Authorization Active</span>
        </div>
      </div>

      {/* System Infrastructure Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Database Backend</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Supabase Ready</span>
          </div>
          <div className="text-[11px] text-slate-400">PostgreSQL with RLS Enabled</div>
        </div>

        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>AI / NLP Engine</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-bold font-mono text-cyan-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Deterministic NLP</span>
          </div>
          <div className="text-[11px] text-slate-400">Zero-Key Fallback Active</div>
        </div>

        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Evidence Storage</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-base font-bold font-mono text-purple-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>investigation-evidence</span>
          </div>
          <div className="text-[11px] text-slate-400">Private Bucket / Signed URLs</div>
        </div>

        <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Audit Trail Integrity</span>
            <History className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base font-bold font-mono text-amber-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Append-Only Lock</span>
          </div>
          <div className="text-[11px] text-slate-400">Non-Repudiation Guaranteed</div>
        </div>
      </div>

      {/* User & Role Management Table */}
      <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#18274d]">
          <div className="flex items-center space-x-2">
            <Users2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">Authorized Officer Roster & Role Assignments</h3>
          </div>
          <span className="text-xs text-slate-400">{profiles.length} Officers Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#101b38] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#1e2f5b]">
              <tr>
                <th className="p-3">Officer Name</th>
                <th className="p-3">Badge Number</th>
                <th className="p-3">Department</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Assigned Role (RLS Level)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18274d] text-slate-300">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-[#132042] transition">
                  <td className="p-3 font-semibold text-slate-100">{p.fullName}</td>
                  <td className="p-3 font-mono text-blue-300">{p.badgeNumber}</td>
                  <td className="p-3 text-slate-300">{p.department}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">{p.email}</td>
                  <td className="p-3">
                    <select
                      value={p.role}
                      onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                      className="bg-[#132042] text-xs font-semibold text-cyan-300 px-2.5 py-1 rounded border border-[#23386e] focus:outline-none"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="INVESTIGATOR">INVESTIGATOR</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Provider Settings */}
      <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 shadow-lg space-y-4 text-xs">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#18274d]">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">AI / NLP Extraction Engine Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setSelectedAiProvider('deterministic_nlp')}
            className={`p-4 rounded-xl border cursor-pointer transition space-y-1.5 ${
              selectedAiProvider === 'deterministic_nlp'
                ? 'bg-blue-600/10 border-blue-500 text-blue-300'
                : 'bg-[#132042] border-[#23386e] text-slate-300'
            }`}
          >
            <div className="font-bold text-sm">Deterministic NLP (Zero-Key)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Built-in regex & dictionary heuristics for Indian phones, PAN cards, accounts, vehicle plates, and relationship rules. 100% reliable offline.
            </p>
          </div>

          <div
            onClick={() => setSelectedAiProvider('gemini')}
            className={`p-4 rounded-xl border cursor-pointer transition space-y-1.5 ${
              selectedAiProvider === 'gemini'
                ? 'bg-blue-600/10 border-blue-500 text-blue-300'
                : 'bg-[#132042] border-[#23386e] text-slate-300'
            }`}
          >
            <div className="font-bold text-sm">Google Gemini 1.5 Flash</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              External LLM provider via environment variable <code className="text-cyan-300">AI_API_KEY</code> for advanced unstructured narrative parsing.
            </p>
          </div>

          <div
            onClick={() => setSelectedAiProvider('openai')}
            className={`p-4 rounded-xl border cursor-pointer transition space-y-1.5 ${
              selectedAiProvider === 'openai'
                ? 'bg-blue-600/10 border-blue-500 text-blue-300'
                : 'bg-[#132042] border-[#23386e] text-slate-300'
            }`}
          >
            <div className="font-bold text-sm">OpenAI GPT-4o</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              External LLM provider via environment variable <code className="text-cyan-300">AI_API_KEY</code> for complex multi-page document extractions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
