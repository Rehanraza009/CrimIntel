'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, CheckCircle2, ExternalLink, X, Bell } from 'lucide-react';
import { InvestigationAlert } from '@/types/investigation';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: InvestigationAlert[];
  onMarkRead: (id: string) => void;
}

export default function NotificationsPopover({
  isOpen,
  onClose,
  alerts,
  onMarkRead,
}: NotificationsPopoverProps) {
  if (!isOpen) return null;

  const newAlerts = alerts.filter((a) => a.status === 'NEW');

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover Card */}
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-[#263650] bg-white dark:bg-[#111c30] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-[#263650] flex items-center justify-between bg-slate-50 dark:bg-[#0f172a]">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Investigation Notifications
            </span>
            {newAlerts.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                {newAlerts.length} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1a2d54]">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 text-xs transition ${
                  alert.status === 'NEW'
                    ? 'bg-amber-500/5 dark:bg-amber-500/10'
                    : 'bg-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-500'
                          : alert.severity === 'HIGH'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {alert.explanation}
                      </p>
                      <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400">
                        <span>Case: {alert.caseId}</span>
                        <span>•</span>
                        <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#1a2d54]/60">
                  <Link
                    href={`/alerts`}
                    onClick={onClose}
                    className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  {alert.status === 'NEW' && (
                    <button
                      onClick={() => onMarkRead(alert.id)}
                      className="text-[10px] text-slate-400 hover:text-emerald-500 flex items-center space-x-1 transition"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark reviewed</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#0f172a] text-center">
          <Link
            href="/alerts"
            onClick={onClose}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All Investigation Alerts ({alerts.length})
          </Link>
        </div>
      </div>
    </>
  );
}
