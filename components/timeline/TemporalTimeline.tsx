'use client';

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Filter,
  FileCheck2,
  MapPin,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { TemporalEvent, EntityType } from '@/types/investigation';

interface TemporalTimelineProps {
  events: TemporalEvent[];
  selectedCaseId?: string;
  onEventClick?: (event: TemporalEvent) => void;
}

export default function TemporalTimeline({ events, selectedCaseId, onEventClick }: TemporalTimelineProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');

  // Filter events by time and search
  const filteredEvents = events.filter((evt) => {
    // Type filter
    if (selectedEventType !== 'all' && evt.eventType !== selectedEventType) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        (evt.location && evt.location.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Date filter
    if (timeFilter === '7d') {
      const diffDays = (Date.now() - new Date(evt.eventTime).getTime()) / (1000 * 3600 * 24);
      return diffDays <= 60; // Relative to investigation window
    }
    return true;
  }).sort((a, b) => new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime());

  // Distinct event types for filtering
  const distinctEventTypes = Array.from(new Set(events.map(e => e.eventType)));

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Timeline Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1633] p-3 rounded-lg border border-[#1e2f5b]">
        {/* Search */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search events, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#132042] text-xs text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded border border-[#23386e] focus:outline-none focus:border-blue-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {/* Event Category Filter */}
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="bg-[#132042] text-xs text-slate-200 px-3 py-1.5 rounded border border-[#23386e] focus:outline-none"
          >
            <option value="all">All Event Types ({events.length})</option>
            {distinctEventTypes.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>

          {/* Time range buttons */}
          <div className="flex rounded-md bg-[#132042] p-0.5 border border-[#23386e] text-xs">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-2.5 py-1 rounded transition ${
                timeFilter === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('30d')}
              className={`px-2.5 py-1 rounded transition ${
                timeFilter === '30d' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeFilter('7d')}
              className={`px-2.5 py-1 rounded transition ${
                timeFilter === '7d' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Recent Bursts
            </button>
          </div>
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-blue-800 before:to-transparent">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-[#0d1633] rounded-lg border border-[#1e2f5b] text-slate-400 text-xs">
            No temporal events recorded for this selection.
          </div>
        ) : (
          filteredEvents.map((evt, idx) => {
            const dateObj = new Date(evt.eventTime);
            const dateStr = dateObj.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            const timeStr = dateObj.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={evt.id}
                onClick={() => onEventClick && onEventClick(evt)}
                className="relative bg-[#0d1633] border border-[#1e2f5b] hover:border-blue-500/50 p-4 rounded-lg shadow transition cursor-pointer group"
              >
                {/* Timeline node circle */}
                <div className="absolute -left-[30px] sm:-left-[38px] top-4 w-4 h-4 rounded-full bg-[#0b132b] border-2 border-blue-400 group-hover:scale-125 transition flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#18274d]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-400">{dateStr}</span>
                    <span className="text-[11px] font-mono text-slate-400">{timeStr}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {evt.location && (
                    <div className="flex items-center space-x-1 text-xs text-rose-300">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-slate-100 mt-2.5 group-hover:text-blue-300 transition">
                  {evt.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {evt.description}
                </p>

                {/* Evidence Provenance pill */}
                {evt.evidenceFileName && (
                  <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-slate-400 bg-[#132042] px-2.5 py-1 rounded w-fit border border-[#23386e]">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Evidence Anchor: <strong className="text-slate-200">{evt.evidenceFileName}</strong></span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
