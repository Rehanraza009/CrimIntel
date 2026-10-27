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
  const [selectedAiProvider, setSelectedAiProvider] = useState<string>('gemini');
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    fetch('/api/ai-status')
      .then(res => res.json())
      .then(data => {
        setAiStatus(data);
        if (data.activeProvider) {
          setSelectedAiProvider(data.activeProvider);
        }
      })
      .catch(err => console.warn('Could not load AI status:', err));
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = profiles.map(p => p.id === userId ? { ...p, role: newRole } : p);
    setProfiles(updated);
    InvestigationStore.addAuditLog('USER_ROLE_CHANGED', 'USER', userId, undefined, { newRole });
    alert(`Officer role updated to ${newRole}.`);
  };

  const runExtractionTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const sampleText = 'Special Cell FIR 104/2026: Suspect Vikram Rathore called +91 9811223344 and wired Rs 1,50,000 to Account 981240192831 in Rohini Sector 16 using vehicle DL-01-AB-1234.';
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          sourceFileName: 'FIR_104_Special_Cell.txt',
          provider: selectedAiProvider,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message || 'Test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#111c30] p-5 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider font-mono">
            ADMINISTRATOR MANAGEMENT CONSOLE
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#f1f5f9] mt-1">
            System Administration & AI Governance
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#a7b4c8] mt-1">
            Institutional officer roles, database health, dual AI provider keys (Gemini & OpenAI), and deterministic zero-key fallbacks.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Authorization Active</span>
        </div>
      </div>

      {/* System Infrastructure Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-[#111c30] p-4 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Database Backend</span>
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Supabase Ready</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">PostgreSQL with RLS Enabled</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-4 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Primary AI Provider</span>
            <Cpu className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          </div>
          <div className="text-base font-bold font-mono text-blue-600 dark:text-cyan-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="capitalize">{aiStatus?.activeProvider === 'gemini' ? 'Gemini 3.5 Flash' : aiStatus?.activeProvider || 'Gemini'}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Keys Configured in .env.local</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-4 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Evidence Storage</span>
            <HardDrive className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-base font-bold font-mono text-purple-600 dark:text-purple-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400"></span>
            <span>investigation-evidence</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Private Bucket / SHA-256 Validated</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-4 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Zero-Key Resilience</span>
            <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-base font-bold font-mono text-amber-600 dark:text-amber-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></span>
            <span>Deterministic NLP Ready</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">100% Offline Capability</div>
        </div>
      </div>

      {/* AI / NLP Extraction Engine Configuration */}
      <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-xl p-5 shadow-sm space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-[#18274d]">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI / NLP Extraction Engine Configuration</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Active Provider: <strong className="text-blue-600 dark:text-cyan-300 uppercase">{selectedAiProvider}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gemini */}
          <div
            onClick={() => setSelectedAiProvider('gemini')}
            className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
              selectedAiProvider === 'gemini'
                ? 'bg-blue-50/80 dark:bg-blue-600/15 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 dark:bg-[#132042] border-slate-200 dark:border-[#23386e] text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Google Gemini</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                ACTIVE
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Model: <span className="font-semibold text-slate-700 dark:text-slate-300">{aiStatus?.gemini?.model || 'gemini-3.5-flash-lite'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Google Generative AI key configured via <code className="text-blue-600 dark:text-cyan-300 font-bold font-mono">GEMINI_API_KEY</code>. High-speed forensic narrative extraction.
            </p>
            {aiStatus?.gemini?.maskedKey && (
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                Key: {aiStatus.gemini.maskedKey}
              </div>
            )}
          </div>

          {/* OpenAI */}
          <div
            onClick={() => setSelectedAiProvider('openai')}
            className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
              selectedAiProvider === 'openai'
                ? 'bg-blue-50/80 dark:bg-blue-600/15 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 dark:bg-[#132042] border-slate-200 dark:border-[#23386e] text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">OpenAI</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                CONFIGURED
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Model: <span className="font-semibold text-slate-700 dark:text-slate-300">{aiStatus?.openai?.model || 'gpt-4o-mini'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              OpenAI key configured via <code className="text-blue-600 dark:text-cyan-300 font-bold font-mono">OPENAI_API_KEY</code>. Ready for production workloads when credits are active.
            </p>
            {aiStatus?.openai?.maskedKey && (
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                Key: {aiStatus.openai.maskedKey}
              </div>
            )}
          </div>

          {/* Deterministic NLP */}
          <div
            onClick={() => setSelectedAiProvider('deterministic_nlp')}
            className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
              selectedAiProvider === 'deterministic_nlp'
                ? 'bg-blue-50/80 dark:bg-blue-600/15 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 dark:bg-[#132042] border-slate-200 dark:border-[#23386e] text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Deterministic NLP</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                STANDBY / FALLBACK
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Engine: <span className="font-semibold text-slate-700 dark:text-slate-300">Rule-based regex & dictionary</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Zero-latency Indian jurisdiction regex heuristics (DL vehicle plates, +91 phones, PAN cards, IFSC codes). Never fails or rate-limits.
            </p>
            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
              Offline Uptime: 100%
            </div>
          </div>
        </div>

        {/* Live Extraction Probe */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#18274d] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Live AI Extraction Probe</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Test the active pipeline with a synthetic FIR snippet to verify end-to-end entity and relationship resolution.
              </div>
            </div>
            <button
              type="button"
              onClick={runExtractionTest}
              disabled={isTesting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition flex items-center space-x-2 shrink-0 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Extraction...' : 'Run Extraction Probe'}</span>
            </button>
          </div>

          {testResult && (
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-[#1e2f50] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Probe Status: {testResult.success ? 'Extraction Success' : 'Probe Failed'}
                </span>
                <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  <span>Provider: <strong className="text-blue-600 dark:text-cyan-300 uppercase">{testResult.providerUsed}</strong></span>
                  <span>Model: <strong>{testResult.modelUsed}</strong></span>
                  <span>Latency: <strong>{testResult.durationMs}ms</strong></span>
                </div>
              </div>
              {testResult.data && (
                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <div>
                    Extracted <strong>{testResult.data.entities?.length || 0} entities</strong>: {testResult.data.entities?.map((e: any) => `${e.name} (${e.entityType})`).join(', ')}
                  </div>
                  <div>
                    Extracted <strong>{testResult.data.relationships?.length || 0} relationships</strong>: {testResult.data.relationships?.map((r: any) => `${r.sourceEntityName} → ${r.relationshipType} → ${r.targetEntityName}`).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User & Role Management Table */}
      <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#18274d]">
          <div className="flex items-center space-x-2">
            <Users2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Authorized Officer Roster & Role Assignments</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{profiles.length} Officers Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-[#263650]">
              <tr>
                <th className="p-3">Officer Name</th>
                <th className="p-3">Badge Number</th>
                <th className="p-3">Department</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Assigned Role (RLS Level)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#18274d] text-slate-700 dark:text-slate-300">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#132042] transition">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{p.fullName}</td>
                  <td className="p-3 font-mono text-blue-600 dark:text-blue-300 font-bold">{p.badgeNumber}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.department}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">{p.email}</td>
                  <td className="p-3">
                    <select
                      value={p.role}
                      onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                      className="bg-slate-50 dark:bg-[#132042] text-xs font-semibold text-blue-600 dark:text-cyan-300 px-2.5 py-1 rounded border border-slate-200 dark:border-[#23386e] focus:outline-none"
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
    </div>
  );
}
