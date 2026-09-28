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
  Lock,
  Layers,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu,
  FileSpreadsheet,
  Building2,
  Database
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Public Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#091124]/90 backdrop-blur-md border-b border-[#18274d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm tracking-wider flex items-center space-x-2">
                <span>CRIMINTEL</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-400/30">
                  SIH26189
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                MHA – NCRB | Women Safety Division
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
            <Link href="#problem" className="hover:text-blue-400 transition">The Problem</Link>
            <Link href="#architecture" className="hover:text-blue-400 transition">How It Works</Link>
            <Link href="#capabilities" className="hover:text-blue-400 transition">Core Capabilities</Link>
            <Link href="#security" className="hover:text-blue-400 transition">Security & Hash Chain</Link>
            <Link href="/features" className="hover:text-blue-400 transition">Features</Link>
            <Link href="/security" className="hover:text-blue-400 transition">Security Specs</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="text-xs font-semibold px-3 py-1.5 rounded text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition flex items-center space-x-1.5"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-[#18274d]">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111d3d] border border-[#223565] text-xs text-blue-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold">Ministry of Home Affairs (MHA) – NCRB</span>
            <span className="text-slate-500">•</span>
            <span>Women Safety Division</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            CRIMINTEL
          </h1>
          <p className="text-lg sm:text-xl font-medium text-blue-400 mt-2">
            AI-Powered Criminal Network Analysis System
          </p>

          <blockquote className="text-lg sm:text-2xl text-slate-300 font-light mt-6 max-w-3xl mx-auto leading-relaxed italic">
            &ldquo;From fragmented investigation records to explainable relationships.&rdquo;
          </blockquote>

          <p className="text-xs sm:text-sm text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Ingests multi-source FIRs, CDR phone calls, financial banking ledgers, and field surveillance logs into a unified, evidence-anchored temporal knowledge graph. Empowers investigators to surface covert syndicate bridges, cross-case overlaps, and actionable leads.
          </p>

          {/* Synthetic Data Disclaimer Pill */}
          <div className="mt-6 inline-flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Evaluation Environment:</strong> Loaded with 100% Synthetic & Anonymized Demonstration Data.
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl transition flex items-center space-x-2"
            >
              <span>Open Investigation Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/network"
              className="px-6 py-3 rounded-lg bg-[#111d3d] hover:bg-[#182952] text-slate-200 border border-[#223565] font-semibold text-sm transition flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Explore Network Graph Demo</span>
            </Link>
          </div>

          {/* Hero Statistics Counters */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b]">
              <div className="text-2xl font-bold font-mono text-cyan-400">5 Cases</div>
              <div className="text-xs text-slate-400 mt-1">Cross-Correlated Ring</div>
            </div>
            <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b]">
              <div className="text-2xl font-bold font-mono text-blue-400">25+ Entities</div>
              <div className="text-xs text-slate-400 mt-1">Persons, SIMs, Accounts, Cars</div>
            </div>
            <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b]">
              <div className="text-2xl font-bold font-mono text-emerald-400">100% Verified</div>
              <div className="text-xs text-slate-400 mt-1">SHA-256 Custody Chain</div>
            </div>
            <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b]">
              <div className="text-2xl font-bold font-mono text-purple-400">Multi-Signal</div>
              <div className="text-xs text-slate-400 mt-1">Entity Resolution Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. THE PROBLEM */}
      <section id="problem" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 border-b border-[#18274d]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">The Operational Challenge</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Fragmented Data Silos Blind Conventional Investigations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            Police officers and cyber analysts receive gigabytes of unstructured records from telecom operators, banks, and field surveillance. Critical connections stay buried across state jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b]">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Disjointed Heterogeneous Sources</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              CDRs, bank account statements, FIR text, and toll plaza logs arrive in different schemas, making manual cross-referencing tedious and prone to missing key clues.
            </p>
          </div>

          <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b]">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <GitMerge className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Name Variations & Aliases</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              The same syndicate operative appears as &ldquo;Rahul Kumar&rdquo;, &ldquo;R. Kumar&rdquo;, and &ldquo;Rahul K. Singh&rdquo;. Conventional keyword searches fail to resolve identical individuals.
            </p>
          </div>

          <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b]">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Inter-State Jurisdiction Blindspots</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              A SIM used for cyber fraud in Delhi remains invisible to human trafficking investigators in Uttar Pradesh or financial muling officers in Haryana without automated cross-case indexing.
            </p>
          </div>
        </div>
      </section>

      {/* 2. HOW CRIMINTEL WORKS */}
      <section id="architecture" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 border-b border-[#18274d]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Automated Pipeline</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            From Raw Evidence to Explainable Temporal Graph
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            CrimIntel executes an auditable multi-phase pipeline that indexes evidence, normalizes entities, and maintains cryptographic provenance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b]">
            <div className="text-blue-400 font-mono font-bold text-xs mb-2">STAGE 01</div>
            <h4 className="text-sm font-bold text-slate-100">Multi-Source Ingestion</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Parses CSV, JSON, TXT, and FIR records. Generates immediate SHA-256 fingerprint for chain of custody.
            </p>
          </div>

          <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b]">
            <div className="text-cyan-400 font-mono font-bold text-xs mb-2">STAGE 02</div>
            <h4 className="text-sm font-bold text-slate-100">Forensic Entity Extraction</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Identifies Persons, Phones, Accounts, Vehicles, Locations, and Transactions with contextual excerpts.
            </p>
          </div>

          <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b]">
            <div className="text-emerald-400 font-mono font-bold text-xs mb-2">STAGE 03</div>
            <h4 className="text-sm font-bold text-slate-100">Multi-Signal Resolution</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Detects possible duplicate matches using phone, email, address, and name phonetics. Requires investigator audit to merge.
            </p>
          </div>

          <div className="bg-[#0d1633] p-4 rounded-xl border border-[#1e2f5b]">
            <div className="text-purple-400 font-mono font-bold text-xs mb-2">STAGE 04</div>
            <h4 className="text-sm font-bold text-slate-100">Cross-Case Correlation</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Automatically discovers hidden links across different FIRs and generates actionable investigative leads.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PRODUCT DIFFERENTIATORS */}
      <section id="capabilities" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 border-b border-[#18274d]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Core Differentiators</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Built for Real-World Investigative Rigor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            Engineered specifically to solve the core bottlenecks highlighted in the SIH26189 problem statement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0d1633] p-6 rounded-xl border border-blue-500/30 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
              <h3 className="text-base font-bold text-slate-100">Cross-Case Correlation</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Syndicates frequently reuse burner handsets, bank accounts, or transport vehicles across distinct operations. CrimIntel surfaces cross-case bridges instantly (e.g. Phone +91 9876543210 shared between Case #001 and Case #002) with confidence metrics.
            </p>
          </div>

          <div className="bg-[#0d1633] p-6 rounded-xl border border-purple-500/30 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">2</div>
              <h3 className="text-base font-bold text-slate-100">Multi-Signal Entity Resolution</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never silently merges entities based on string match alone. Combines name similarity, phone overlap, bank account congruence, and location proximity into an explainable score. Preserves human-in-the-loop auditable approval.
            </p>
          </div>

          <div className="bg-[#0d1633] p-6 rounded-xl border border-cyan-500/30 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">3</div>
              <h3 className="text-base font-bold text-slate-100">Temporal Knowledge Graph</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Criminal operations evolve over time. CrimIntel models relationships with timestamps and durations. Allows investigators to filter by date ranges and observe how the network adapted before and after incidents.
            </p>
          </div>

          <div className="bg-[#0d1633] p-6 rounded-xl border border-emerald-500/30 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">4</div>
              <h3 className="text-base font-bold text-slate-100">Evidence Provenance</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every single node and relationship links back to exact source evidence (file name, page number, row index, raw quote). Eliminates AI hallucinations and ensures court-admissible clarity.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECURITY & BLOCKCHAIN THEME */}
      <section id="security" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 border-b border-[#18274d]">
        <div className="bg-[#0c1630] border border-[#1e2f5b] rounded-2xl p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#1e2f5b]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  Cryptographic Chain of Custody & Security
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Blockchain-inspired tamper-evident hash chaining without public blockchain gas overhead.
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 font-mono">
              STATUS: HASH CHAIN VERIFIED
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-[#111d3d] p-4 rounded-xl border border-[#223565]">
              <div className="font-bold text-xs text-cyan-400 uppercase tracking-wider mb-1">Evidence Integrity</div>
              <h4 className="text-sm font-semibold text-slate-200">SHA-256 Block Chaining</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Each uploaded file computes: Hash<sub>n</sub> = SHA256(File + Hash<sub>n-1</sub> + Timestamp). Any modification breaks the chain immediately.
              </p>
            </div>

            <div className="bg-[#111d3d] p-4 rounded-xl border border-[#223565]">
              <div className="font-bold text-xs text-purple-400 uppercase tracking-wider mb-1">Access Control</div>
              <h4 className="text-sm font-semibold text-slate-200">Supabase Row Level Security</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Strict database-level enforcement of ADMIN, INVESTIGATOR, ANALYST, and VIEWER roles. Sensitive evidence never exposed to unauthorized queries.
              </p>
            </div>

            <div className="bg-[#111d3d] p-4 rounded-xl border border-[#223565]">
              <div className="font-bold text-xs text-amber-400 uppercase tracking-wider mb-1">Auditability</div>
              <h4 className="text-sm font-semibold text-slate-200">Append-Only Audit Logs</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every sensitive query, case update, entity merge, and evidence viewing is permanently logged with IP and user identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ETHICAL AI & INVESTIGATION PRINCIPLES */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center border-b border-[#18274d]">
        <div className="p-6 rounded-2xl bg-[#0d1633] border border-blue-500/30">
          <h3 className="text-base font-bold text-slate-100 flex items-center justify-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <span>Ethical AI & Investigation Decision Support Charter</span>
          </h3>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            CrimIntel strictly functions as an <strong>investigation-support platform</strong>. It does not declare a person guilty, predict crime, or replace constitutional judicial processes. It surfaces relationships, statistical patterns, and verifiable leads so that authorized human investigators can make informed conclusions.
          </p>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="py-12 bg-[#091124] text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex justify-center space-x-6">
            <Link href="/dashboard" className="text-slate-200 hover:text-blue-400 font-semibold">Dashboard</Link>
            <Link href="/features" className="hover:text-slate-200">Features</Link>
            <Link href="/security" className="hover:text-slate-200">Security Architecture</Link>
            <Link href="/about" className="hover:text-slate-200">About Project</Link>
            <Link href="/auth/login" className="hover:text-slate-200">Officer Sign In</Link>
          </div>
          <p className="text-slate-500 text-[11px]">
            Problem Statement ID: SIH26189 • Ministry of Home Affairs (MHA) – National Crime Records Bureau (NCRB) • Women Safety Division
          </p>
          <p className="text-[10px] text-slate-600">
            All demonstration data is purely synthetic and anonymized for technical evaluation purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
