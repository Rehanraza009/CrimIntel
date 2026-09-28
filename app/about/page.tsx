'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Info, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 mb-4">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <span>Smart India Hackathon • Problem ID: SIH26189</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">About CRIMINTEL</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            AI-Powered Criminal Network Analysis System
          </p>
        </div>

        <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b] space-y-4 text-xs leading-relaxed text-slate-300">
          <h3 className="text-sm font-bold text-slate-100">Institutional Charter</h3>
          <p>
            Developed in response to Problem Statement <strong>SIH26189</strong> issued by the <strong>Ministry of Home Affairs (MHA) – National Crime Records Bureau (NCRB)</strong>, Women Safety Division. The challenge focuses on converting fragmented investigation data into a unified, searchable, and explainable network view.
          </p>
          <p>
            Traditional investigations into cyber financial fraud, inter-state trafficking syndicates, and organized extortion rings often suffer from fragmented evidence silos across police stations, telecom circles, and banking branches. CrimIntel overcomes this by creating an automated, explainable knowledge graph anchored directly in source documents.
          </p>
        </div>

        <div className="bg-[#0d1633] p-6 rounded-xl border border-[#1e2f5b] space-y-3 text-xs leading-relaxed text-slate-300">
          <h3 className="text-sm font-bold text-slate-100">Core Principles of Ethical Investigation AI</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Investigation Support Only:</strong> CrimIntel does not declare anyone guilty, assign criminal labels, or predict individual criminality. Conclusions remain strictly with authorized investigators.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>100% Evidence Provenance:</strong> Every connection displayed in the knowledge graph cites the exact source file, row index, and quote from verified evidence.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Human-in-the-Loop Entity Resolution:</strong> Algorithms calculate similarity metrics, but merging duplicate entities requires manual investigator approval and creates an immutable audit trail.</span>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-lg transition inline-flex items-center space-x-2"
          >
            <span>Proceed to Investigation Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
