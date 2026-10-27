'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Mail, CheckCircle2, KeyRound, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your registered official email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/login`,
        });
        if (error) {
          throw error;
        }
      } else {
        // Safe offline demonstration simulation
        await new Promise((r) => setTimeout(r, 600));
      }
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send password recovery instructions. Please verify your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0d1633] border border-[#1e2f5b] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-white tracking-wider">RESET ACCESS CREDENTIALS</h1>
          <p className="text-xs text-slate-400">
            CrimIntel Law Enforcement Authentication Recovery • MHA – NCRB
          </p>
        </div>

        {isSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-emerald-300">Recovery Instructions Dispatched</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an authorized officer account is linked to <strong className="text-white">{email}</strong>, password reset and two-factor re-keying instructions have been transmitted.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Officer Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official Registered Police / Agency Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer.name@delhipolice.nic.in"
                  className="w-full bg-[#132042] text-xs text-slate-100 pl-9 pr-3 py-2.5 rounded-lg border border-[#23386e] focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Password recovery tokens are strictly monitored under the system audit ledger.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Verifying Authorization...' : 'Send Recovery Instructions'}</span>
            </button>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Officer Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
