'use client';

import React, { useState } from 'react';
import { HelpCircle, Info, X, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export const INVESTIGATION_TERMS = {
  entity: {
    term: 'Entity',
    definition: 'A record representing a person, phone number, account, vehicle, location, or organization.',
    importance: 'Entities are the core building blocks of the criminal network knowledge graph.',
    example: 'A suspect ("Vikram Malhotra"), their mobile number ("+91 9876543210"), or a muling bank account ("AC-9921004523").',
  },
  relationship: {
    term: 'Relationship (Connection)',
    definition: 'A recorded connection between two entities, supported by one or more sources.',
    importance: 'Connections reveal how syndicates coordinate, transfer assets, or communicate.',
    example: 'A call log linking a suspect to a burner phone, or a bank transfer between two accounts.',
  },
  entity_resolution: {
    term: 'Entity Resolution',
    definition: 'Checking whether records from different sources may refer to the same entity.',
    importance: 'Prevents duplicates while ensuring candidates are never silently merged without investigator review.',
    example: 'Matching "Vikram Malhotra" and "V. Malhotra" due to matching phone numbers and phonetic similarity.',
  },
  timeline: {
    term: 'Temporal Timeline',
    definition: 'A chronological view of recorded events.',
    importance: 'Shows the sequence of actions before, during, and after an incident.',
    example: 'A SIM-box activation at 10:14 AM followed by 4 extortion calls and an ATM cash withdrawal at 11:02 AM.',
  },
  provenance: {
    term: 'Evidence Provenance',
    definition: 'Information showing where a record came from and how it is linked to a finding.',
    importance: 'Guarantees that every finding is court-admissible and verifiable back to exact source documents.',
    example: 'Linking a telephone connection to CDR Excel file row #142, with file hash and timestamp.',
  },
  confidence: {
    term: 'Confidence Score',
    definition: 'A model or rule-based estimate of match strength. It is not proof that a match is correct.',
    importance: 'Guides investigator prioritization. Final judgment always remains with authorized officers.',
    example: 'An 85% score indicates high structural overlap (shared identifier + name match), requiring human confirmation.',
  },
  cross_case: {
    term: 'Cross-Case Connection',
    definition: 'A possible link between records belonging to different cases.',
    importance: 'Breaks down police station and jurisdictional silos by uncovering syndicate reuse of assets.',
    example: 'The same getaway vehicle plate appearing in a Delhi cyber fraud case and a Noida trafficking case.',
  },
  sha256: {
    term: 'SHA-256 Fingerprint',
    definition: 'A cryptographic calculation that checks whether a file has remained intact and untampered since upload.',
    importance: 'Preserves chain of custody. A matching hash confirms the file bytes have not been altered.',
    example: 'Recalculating the 64-character hash of a seized evidence document to verify integrity.',
  },
} as const;

export type TermKey = keyof typeof INVESTIGATION_TERMS;

// Robust resolver that maps both keys and formatted titles to definition objects
export function resolveInvestigationTerm(query?: string) {
  if (!query) return INVESTIGATION_TERMS.entity;
  const q = query.toLowerCase().replace(/[-\s_]/g, '');
  
  if (q.includes('entityres')) return INVESTIGATION_TERMS.entity_resolution;
  if (q.includes('entity')) return INVESTIGATION_TERMS.entity;
  if (q.includes('relat') || q.includes('connect')) return INVESTIGATION_TERMS.relationship;
  if (q.includes('time') || q.includes('tempor')) return INVESTIGATION_TERMS.timeline;
  if (q.includes('proven') || q.includes('source')) return INVESTIGATION_TERMS.provenance;
  if (q.includes('confid') || q.includes('score')) return INVESTIGATION_TERMS.confidence;
  if (q.includes('cross') || q.includes('crosscase')) return INVESTIGATION_TERMS.cross_case;
  if (q.includes('sha') || q.includes('finger') || q.includes('ledger') || q.includes('hash') || q.includes('audit')) {
    return INVESTIGATION_TERMS.sha256;
  }
  
  return INVESTIGATION_TERMS.entity;
}

export function HelpTooltip({
  term,
  termKey,
  text,
  onOpenModal
}: {
  term?: TermKey | string;
  termKey?: string;
  text?: string;
  onOpenModal?: () => void;
}) {
  const [show, setShow] = useState(false);
  const info = resolveInvestigationTerm((term || termKey || text) as string);

  return (
    <span className="relative inline-flex items-center ml-1 align-middle">
      <button
        type="button"
        onClick={() => {
          if (onOpenModal) onOpenModal();
          else setShow(!show);
        }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-[var(--text-muted)] hover:text-[var(--primary)] transition p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        aria-label={`Explain term: ${info.term}`}
      >
        <Info className="w-3.5 h-3.5 inline" />
      </button>

      {show && (
        <span className="absolute z-50 left-full ml-2 -top-2 w-64 p-3 bg-white dark:bg-[#15223e] border border-slate-200 dark:border-[#263650] rounded-lg shadow-xl text-xs text-left animate-in fade-in zoom-in-95 duration-150">
          <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
            {text || info.term}
          </span>
          <span className="text-slate-600 dark:text-slate-300 block leading-relaxed">
            {info.definition}
          </span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 block mt-2 pt-1.5 border-t border-slate-100 dark:border-[#1e2f5b]">
            💡 {info.importance}
          </span>
        </span>
      )}
    </span>
  );
}

export function TerminologyModal({
  isOpen,
  onClose,
  initialTerm
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-[#263650] flex items-center justify-between bg-slate-50 dark:bg-[#0f172a]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Investigation Guide & Plain-Language Terminology
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Understanding criminal network analysis concepts without jargon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#16243e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-300 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Crucial Policy Notice:</strong> CrimIntel is strictly an investigation decision-support tool. It assists authorized officers in connecting records. It does not determine guilt or replace human judgment.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {Object.entries(INVESTIGATION_TERMS).map(([key, item]) => {
              const isHighlighted = initialTerm && item.term.toLowerCase().includes(initialTerm.toLowerCase());
              return (
                <div
                  key={key}
                  className={`p-4 rounded-xl border transition shadow-sm ${
                    isHighlighted
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-[#263650] bg-white dark:bg-[#0f172a] hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1 flex items-center justify-between">
                    <span>{item.term}</span>
                    {isHighlighted && <span className="text-[10px] font-mono font-bold bg-blue-500 text-white px-1.5 py-0.2 rounded">Active Scope</span>}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mb-2">
                    {item.definition}
                  </p>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#13203c] p-2 rounded border border-slate-100 dark:border-[#1a2d54]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Example:</span> {item.example}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#0f172a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition shadow"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
}
