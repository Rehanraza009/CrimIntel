'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, User, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { DEMO_PROFILES } from '@/data/syntheticDataset';
import { InvestigationStore } from '@/services/investigationStore';
import { UserProfile } from '@/types/investigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('INVESTIGATOR');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Find matching demo profile or pick by role
    const profile = DEMO_PROFILES.find(p => p.role === selectedRole) || DEMO_PROFILES[1];
    InvestigationStore.setCurrentUser(profile);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  const handleQuickDemoLogin = (profile: UserProfile) => {
    InvestigationStore.setCurrentUser(profile);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0d1633] border border-[#1e2f5b] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-white tracking-wider">CRIMINTEL</h1>
          <p className="text-xs text-slate-400">
            Secure Investigation Intelligence Portal • MHA – NCRB
          </p>
        </div>

        {/* 1-Click Quick Demo Switcher */}
        <div className="p-3 bg-[#111d3d] border border-[#23386e] rounded-xl space-y-2">
          <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center justify-between">
            <span>Fast Judge Evaluation Login</span>
            <span className="text-[10px] text-emerald-400 font-normal">1-Click Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {DEMO_PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickDemoLogin(p)}
                className="p-2 rounded bg-[#15244c] hover:bg-[#1b2f64] border border-[#263e79] text-left transition"
              >
                <div className="font-bold text-slate-100 text-xs truncate">{p.fullName}</div>
                <div className="text-[10px] text-blue-300 font-mono font-semibold">{p.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer.name@delhipolice.nic.in"
              className="w-full bg-[#132042] text-xs text-slate-100 p-2.5 rounded-lg border border-[#23386e] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Passphrase / 2FA Token</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#132042] text-xs text-slate-100 p-2.5 rounded-lg border border-[#23386e] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Role Authorization</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-[#132042] text-xs text-slate-100 p-2.5 rounded-lg border border-[#23386e] focus:outline-none"
            >
              <option value="INVESTIGATOR">INVESTIGATOR (Default)</option>
              <option value="ANALYST">ANALYST (Crime Analysis)</option>
              <option value="ADMIN">ADMIN (System & User Management)</option>
              <option value="VIEWER">VIEWER (Read-Only Court Review)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-lg transition flex items-center justify-center space-x-2"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Investigation Suite'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Need an authorized account?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:underline">
            Register officer credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
