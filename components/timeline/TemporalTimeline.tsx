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

  // Filter events by time and search (memoized for high responsiveness)
  const filteredEvents = React.useMemo(() => {
    return events
      .filter((evt) => {
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
          return diffDays <= 60;
        }
        return true;
      })
      .sort((a, b) => new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime());
  }, [events, selectedEventType, searchQuery, timeFilter]);

  // Distinct event types for filtering
  const distinctEventTypes = React.useMemo(() => {
    return Array.from(new Set(events.map((e) => e.eventType)));
  }, [events]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Timeline Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#0f172a] p-3 rounded-lg border border-slate-200 dark:border-[#263650]">
        {/* Search */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search events, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#111c30] text-xs text-slate-900 dark:text-[#f1f5f9] placeholder-slate-400 pl-8 pr-3 py-1.5 rounded border border-slate-200 dark:border-[#263650] focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {/* Event Category Filter */}
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="bg-white dark:bg-[#111c30] text-xs text-slate-800 dark:text-[#f1f5f9] px-3 py-1.5 rounded border border-slate-200 dark:border-[#263650] focus:outline-none"
          >
            <option value="all">All Event Types ({events.length})</option>
            {distinctEventTypes.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>

          {/* Time range buttons */}
          <div className="flex rounded-md bg-white dark:bg-[#111c30] p-0.5 border border-slate-200 dark:border-[#263650] text-xs">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-2.5 py-1 rounded transition ${
                timeFilter === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('30d')}
              className={`px-2.5 py-1 rounded transition ${
                timeFilter === '30d' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeFilter('7d')}
              className={`px-2.5 py-1 rounded transition ${
                timeFilter === '7d' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Recent Bursts
            </button>
          </div>
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-blue-300 dark:before:via-blue-800 before:to-transparent">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-[#263650] text-slate-500 dark:text-slate-400 text-xs">
            No temporal events recorded for this selection.
          </div>
        ) : (
          filteredEvents.map((evt) => {
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
                className="relative bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] hover:border-blue-500/50 p-4 rounded-lg shadow-sm transition cursor-pointer group"
              >
                {/* Timeline node circle */}
                <div className="absolute -left-[30px] sm:-left-[38px] top-4 w-4 h-4 rounded-full bg-slate-100 dark:bg-[#0b1220] border-2 border-blue-500 group-hover:scale-125 transition flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 dark:border-[#1e2f5b]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{dateStr}</span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{timeStr}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {evt.location && (
                    <div className="flex items-center space-x-1 text-xs text-rose-600 dark:text-rose-300">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-slate-900 dark:text-[#f1f5f9] mt-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                  {evt.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {evt.description}
                </p>

                {/* Evidence Provenance pill */}
                {evt.evidenceFileName && (
                  <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0f172a] px-2.5 py-1 rounded w-fit border border-slate-200 dark:border-[#263650]">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Evidence Anchor: <strong className="text-slate-700 dark:text-slate-200">{evt.evidenceFileName}</strong></span>
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
