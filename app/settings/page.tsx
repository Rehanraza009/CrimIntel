'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  User,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Lock,
  Cpu,
  Database,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { UserProfile } from '@/types/investigation';
import { useTheme } from '@/lib/themeContext';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { theme, toggleTheme, setTheme } = useTheme();

  useEffect(() => {
    const user = InvestigationStore.getCurrentUser();
    setCurrentUser(user);
    setFullName(user.fullName);
    setPhone(user.phone || '+91 98100 11223');
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = { ...currentUser, fullName, phone };
    InvestigationStore.setCurrentUser(updated);
    setCurrentUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#111c30] p-5 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm">
        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
          USER PREFERENCES & SECURITY
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#f1f5f9] mt-1">
          Account & System Settings
        </h1>
        <p className="text-xs text-slate-600 dark:text-[#a7b4c8] mt-1">
          Manage officer profile credentials, display themes, two-factor authentication, and investigation scope preferences.
        </p>
      </div>

      {/* Interface Theme Preference */}
      <div className="bg-white dark:bg-[#111c30] p-6 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9]">Interface Theme</h3>
            <p className="text-xs text-slate-500 dark:text-[#a7b4c8] mt-0.5">
              Customize interface contrast for bright daytime workspaces or low-light operations.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#263650]">
            Current: {theme === 'dark' ? 'Night Mode' : 'Day Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-start space-x-3 p-3.5 rounded-xl border transition text-left ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-[#263650] bg-white dark:bg-[#0f172a] hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Day Mode (Light)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Crisp `#F5F7FB` background, pure white cards, and high-contrast text designed for bright office environments.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-start space-x-3 p-3.5 rounded-xl border transition text-left ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-[#263650] bg-white dark:bg-[#0f172a] hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Night Mode (Dark)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Deep `#0B1220` navy palette, `#111C30` surfaces, and reduced glare for night investigation shifts.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-[#111c30] p-6 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f5b]">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9]">Investigating Officer Profile</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30">
            {currentUser?.role}
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name & Rank</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full bg-slate-100 dark:bg-[#091124] text-slate-500 dark:text-slate-400 p-2.5 rounded-lg border border-slate-200 dark:border-[#18274d] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Badge / Service Number</label>
              <input
                type="text"
                disabled
                value={currentUser?.badgeNumber || ''}
                className="w-full bg-slate-100 dark:bg-[#091124] font-mono text-slate-500 dark:text-slate-400 p-2.5 rounded-lg border border-slate-200 dark:border-[#18274d] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Department</label>
              <input
                type="text"
                disabled
                value={currentUser?.department || ''}
                className="w-full bg-slate-100 dark:bg-[#091124] text-slate-500 dark:text-slate-400 p-2.5 rounded-lg border border-slate-200 dark:border-[#18274d] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully</span>
              </span>
            ) : <span></span>}

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition"
            >
              Save Profile Updates
            </button>
          </div>
        </form>
      </div>

      {/* Security & AI Provider Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#111c30] p-5 rounded-xl border border-slate-200 dark:border-[#263650] space-y-3 text-xs shadow-sm">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Cryptographic 2FA & Custody</h3>
          </div>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#18274d]">
              <span className="text-slate-500 dark:text-slate-400">Two-Factor Authentication:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">ENABLED (Gov CA)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#18274d]">
              <span className="text-slate-500 dark:text-slate-400">Evidence Key Derivation:</span>
              <span className="font-mono text-blue-600 dark:text-cyan-300">ECDSA / SHA-256</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-5 rounded-xl border border-slate-200 dark:border-[#263650] space-y-3 text-xs shadow-sm">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI / NLP Provider Status</h3>
          </div>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#18274d]">
              <span className="text-slate-500 dark:text-slate-400">Active Extraction Mode:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Deterministic Forensic NLP</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#18274d]">
              <span className="text-slate-500 dark:text-slate-400">Zero-Key Fallback:</span>
              <span className="font-semibold text-blue-600 dark:text-cyan-300">Active (Fully Operational)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

