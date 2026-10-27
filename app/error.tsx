'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('CrimIntel Application Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl p-8 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Investigation Error (500)</h1>
        <p className="text-xs text-slate-600 dark:text-[#a7b4c8] leading-relaxed">
          An operational exception occurred while retrieving investigation records. The error has been captured for audit review.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg hover:border-slate-300 transition flex items-center space-x-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
