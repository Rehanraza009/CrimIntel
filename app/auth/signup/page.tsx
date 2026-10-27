'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, UserPlus, Sun, Moon } from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { UserRole } from '@/types/investigation';
import { useTheme } from '@/lib/themeContext';

export default function SignupPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [department, setDepartment] = useState('Cyber Crime Investigation Unit');
  const [role, setRole] = useState<UserRole>('INVESTIGATOR');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProfile = {
      id: `user-${Date.now()}`,
      email: email || 'officer@gov.in',
      fullName: fullName || 'Investigating Officer',
      badgeNumber: badgeNumber || `DL-POL-${Math.floor(Math.random() * 9000) + 1000}`,
      department,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    InvestigationStore.setCurrentUser(newProfile);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative transition-colors">
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#0f172a] text-slate-600 dark:text-[#a7b4c8] hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-[#0d1633] border border-slate-200 dark:border-[#1e2f5b] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-wider">Officer Registration</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            MHA – NCRB Crimson Investigation Network
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name & Rank</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Insp. Rajeshwar Singh"
              className="w-full bg-slate-50 dark:bg-[#132042] text-xs text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#23386e] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official NIC / Police Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name.badge@delhipolice.nic.in"
              className="w-full bg-slate-50 dark:bg-[#132042] text-xs text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#23386e] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Badge / Service Number</label>
            <input
              type="text"
              required
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              placeholder="e.g. DL-CYBER-9912"
              className="w-full bg-slate-50 dark:bg-[#132042] text-xs text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#23386e] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#132042] text-xs text-slate-900 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#23386e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Permission</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-50 dark:bg-[#132042] text-xs text-slate-800 dark:text-slate-100 p-2.5 rounded-lg border border-slate-200 dark:border-[#23386e] focus:outline-none"
            >
              <option value="INVESTIGATOR">INVESTIGATOR</option>
              <option value="ANALYST">ANALYST</option>
              <option value="ADMIN">ADMIN</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center space-x-2 mt-4"
          >
            <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

