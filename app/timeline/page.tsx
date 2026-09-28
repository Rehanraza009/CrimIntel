'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  FolderOpen,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { TemporalEvent, InvestigationCase } from '@/types/investigation';
import TemporalTimeline from '@/components/timeline/TemporalTimeline';

export default function TimelinePage() {
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [events, setEvents] = useState<TemporalEvent[]>([]);

  useEffect(() => {
    setCases(InvestigationStore.getCases());
    updateEvents('all');
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1633] p-5 rounded-xl border border-[#1e2f5b] shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
              TEMPORAL CHRONOLOGY ENGINE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Temporal Knowledge Analysis ({events.length} Events)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reconstruct communication spikes, rapid financial muling layerings, and vehicle sightings over time.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-semibold">Scope:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => handleCaseChange(e.target.value)}
            className="bg-[#132042] text-xs font-semibold text-slate-200 px-3 py-2 rounded-lg border border-[#23386e] focus:outline-none max-w-[240px] truncate"
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

      {/* Main Timeline View */}
      <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 md:p-6 shadow-xl">
        <TemporalTimeline events={events} selectedCaseId={selectedCaseId === 'all' ? undefined : selectedCaseId} />
      </div>
    </div>
  );
}
