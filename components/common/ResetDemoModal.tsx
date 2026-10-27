'use client';

import React from 'react';
import { RefreshCw, AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface ResetDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isResetting: boolean;
}

export default function ResetDemoModal({
  isOpen,
  onClose,
  onConfirm,
  isResetting,
}: ResetDemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-[#263650] flex items-center justify-between bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset Demo Data?
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Synthetic Investigation Environment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isResetting}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-xs text-slate-600 dark:text-slate-300 space-y-3">
          <p>
            This action will reset your local in-browser investigation store to the original <strong>10 synthetic cases</strong>, <strong>52 entities</strong>, <strong>105 relationships</strong>, and <strong>32 verified evidence files</strong>.
          </p>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2f5b] text-[11px] text-slate-500 dark:text-slate-400">
            🔒 <strong>Safety Assurance:</strong> Only local demonstration records in your browser storage will be reset. No production or Supabase databases will be modified.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#0f172a] flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isResetting}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isResetting}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition shadow disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting Store...' : 'Yes, Reset Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
