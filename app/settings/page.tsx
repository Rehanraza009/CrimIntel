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
  Database
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { UserProfile } from '@/types/investigation';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
          USER PREFERENCES & SECURITY
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
          Account & System Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage officer profile credentials, two-factor authentication, and investigation scope preferences.
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b] shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#18274d]">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">Investigating Officer Profile</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            {currentUser?.role}
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name & Rank</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#132042] text-slate-100 p-2.5 rounded-lg border border-[#23386e] focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full bg-[#091124] text-slate-400 p-2.5 rounded-lg border border-[#18274d] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Badge / Service Number</label>
              <input
                type="text"
                disabled
                value={currentUser?.badgeNumber || ''}
                className="w-full bg-[#091124] font-mono text-slate-400 p-2.5 rounded-lg border border-[#18274d] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Assigned Department</label>
              <input
                type="text"
                disabled
                value={currentUser?.department || ''}
                className="w-full bg-[#091124] text-slate-400 p-2.5 rounded-lg border border-[#18274d] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully</span>
              </span>
            ) : <span></span>}

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow transition"
            >
              Save Profile Updates
            </button>
          </div>
        </form>
      </div>

      {/* Security & AI Provider Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] space-y-3 text-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">Cryptographic 2FA & Custody</h3>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between py-1 border-b border-[#18274d]">
              <span className="text-slate-400">Two-Factor Authentication:</span>
              <span className="font-semibold text-emerald-400">ENABLED (Gov CA)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#18274d]">
              <span className="text-slate-400">Evidence Key Derivation:</span>
              <span className="font-mono text-cyan-300">ECDSA / SHA-256</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] space-y-3 text-xs">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">AI / NLP Provider Status</h3>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between py-1 border-b border-[#18274d]">
              <span className="text-slate-400">Active Extraction Mode:</span>
              <span className="font-bold text-emerald-400">Deterministic Forensic NLP</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#18274d]">
              <span className="text-slate-400">Zero-Key Fallback:</span>
              <span className="font-semibold text-cyan-300">Active (Fully Operational)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
