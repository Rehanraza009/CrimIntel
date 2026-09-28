'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Share2,
  GitMerge,
  Clock,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  Search,
  FileSpreadsheet,
  Lock,
  History,
  FileText
} from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: Share2,
      color: 'text-blue-400',
      title: 'Interactive Cytoscape.js Network Analysis',
      description: 'Force-directed, concentric, and hierarchical visualization of criminal syndicates with multi-hop neighborhood expansion, shortest path analysis, and degree centrality scoring.',
    },
    {
      icon: GitMerge,
      color: 'text-purple-400',
      title: 'Multi-Signal Entity Resolution Engine',
      description: 'Phonetic name similarity, shared burner phone numbers, bank accounts, and geographic proximity scoring to detect duplicate entities while preserving human-in-the-loop audit logs.',
    },
    {
      icon: Clock,
      color: 'text-cyan-400',
      title: 'Temporal Knowledge Graph',
      description: 'Models relations with start and end timestamps. Filter by time windows to visualize how communication bursts and cash layerings shifted across incident dates.',
    },
    {
      icon: AlertTriangle,
      color: 'text-amber-400',
      title: 'Cross-Case Correlation & Pattern Detection',
      description: 'Discovers shared identifiers (burners, vehicles, safehouses) across separate FIRs and police jurisdictions. Generates explainable investigative leads.',
    },
    {
      icon: FileCheck2,
      color: 'text-emerald-400',
      title: 'Tamper-Evident SHA-256 Custody Chain',
      description: 'Cryptographic hash chaining connects each evidence item to its predecessor, guaranteeing evidentiary integrity and non-repudiation.',
    },
    {
      icon: Cpu,
      color: 'text-rose-400',
      title: 'AI / Zero-Key NLP Abstraction',
      description: 'Extracts Indian phone numbers, vehicle registrations, bank accounts, and entities automatically using deterministic regex or optional Gemini/OpenAI integration.',
    },
    {
      icon: FileText,
      color: 'text-blue-400',
      title: 'Executive Investigation Reports',
      description: 'Generates structured analytical briefs strictly distinguishing verified source evidence from AI-derived leads, exportable for court submissions.',
    },
    {
      icon: History,
      color: 'text-slate-400',
      title: 'Append-Only Tamper-Evident Audit Logs',
      description: 'Maintains an immutable record of every user query, case update, entity merge, and evidence viewing for institutional accountability.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111d3d] border border-[#223565] text-xs text-blue-300 mb-4">
            <span>CrimIntel Capability Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Forensic Intelligence Features
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            Every feature is designed to reduce investigation latency from weeks to minutes, surfacing hidden syndicate links without sacrificing evidence provenance.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow transition"
            >
              Open Live Dashboard
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-[#132042] hover:bg-[#1b2d5c] text-slate-300 text-xs font-semibold rounded-lg border border-[#23386e] transition"
            >
              Return Home
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b] hover:border-blue-500/40 transition shadow-lg">
                <div className={`w-10 h-10 rounded-lg bg-[#14234b] border border-[#23386e] flex items-center justify-center ${f.color} mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100">{f.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
