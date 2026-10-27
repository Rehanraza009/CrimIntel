'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  FolderOpen,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { TemporalEvent, InvestigationCase } from '@/types/investigation';
import TemporalTimeline from '@/components/timeline/TemporalTimeline';
import { HelpTooltip, TerminologyModal } from '@/components/common/TerminologyModal';

export default function TimelinePage() {
  const [cases, setCases] = useState<InvestigationCase[]>(() => InvestigationStore.getCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [events, setEvents] = useState<TemporalEvent[]>(() => InvestigationStore.getEvents());
  const [showTerminologyModal, setShowTerminologyModal] = useState(false);

  const updateEvents = (caseId: string) => {
    if (caseId === 'all') {
      setEvents(InvestigationStore.getEvents());
    } else {
      setEvents(InvestigationStore.getEvents(caseId));
    }
  };

  const handleCaseChange = (caseId: string) => {
    setSelectedCaseId(caseId);
    updateEvents(caseId);
  };

  return (
    <div className="space-y-6">
      {/* Header & Scope */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111c30] p-5 rounded-xl border border-slate-200 dark:border-[#263650] shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
              TEMPORAL CHRONOLOGY ENGINE
            </span>
            <HelpTooltip termKey="Temporal Timeline" onOpenModal={() => setShowTerminologyModal(true)} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#f1f5f9] mt-1">
            Temporal Knowledge Analysis ({events.length} Events)
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#a7b4c8] mt-1">
            Reconstruct chronological communication spikes, transactional layering, and vehicle sightings over time.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setShowTerminologyModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#0f172a] text-slate-600 dark:text-[#a7b4c8] hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 dark:text-[#a7b4c8] font-semibold">Scope:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => handleCaseChange(e.target.value)}
              className="bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-[#f1f5f9] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none max-w-[240px] truncate"
            >
              <option value="all">Global (All Cases)</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Timeline View */}
      <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-xl p-5 md:p-6 shadow-sm">
        <TemporalTimeline events={events} selectedCaseId={selectedCaseId === 'all' ? undefined : selectedCaseId} />
      </div>

      <TerminologyModal
        isOpen={showTerminologyModal}
        onClose={() => setShowTerminologyModal(false)}
        initialTerm="Temporal Timeline"
      />
    </div>
  );
}

