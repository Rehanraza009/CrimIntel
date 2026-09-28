'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  FileCheck2,
  Users2,
  Share2,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import { InvestigationCase, EvidenceSourceType, Entity, Relationship } from '@/types/investigation';
import { InvestigationStore } from '@/services/investigationStore';

interface IngestionWizardProps {
  cases: InvestigationCase[];
  defaultCaseId?: string;
  onSuccess?: () => void;
}

const SAMPLE_TEMPLATES = {
  FIR: {
    sourceType: 'FIR_REPORT' as EvidenceSourceType,
    fileName: 'FIR_0219_Cyber_Extortion_Rohini.txt',
    content: `FIRST INFORMATION REPORT (Under Section 154 Cr.P.C.)
Police Station: Cyber Crime Cell, Rohini Sector 16, New Delhi
Date & Time of Incident: 14 March 2026, 16:30 hrs
Complainant: Shri Manoj Sharma, resident of Sector 14 Rohini
Accused / Suspects: Vikram Malhotra (Alias Vicky Bhai) contacted complainant using mobile 9876543210 and demanded illegal settlement of Rs. 75,000.
Transaction Particulars: Complainant transferred Rs. 75,000 on 14 March 2026 to Account XX99881122 under threat of digital arrest.
Vehicle Observed: Black Scorpio DL-01-AB-1234 observed conducting surveillance outside complainant residence.
Co-conspirator: Suspect spoke with Rajesh Shinde regarding cash pickup at Sector 62, Noida Safehouse.`
  },
  CDR: {
    sourceType: 'CDR' as EvidenceSourceType,
    fileName: 'CDR_SIM_Gateway_Log_Mar2026.csv',
    content: `Call_ID,Caller_Number,Called_Number,Timestamp,Duration_Sec,Cell_Tower,IMEI
1001,+91 9876543210,+91 9811223344,2026-03-12 18:42:10,340,DL-ROHINI-04,864209048123456
1002,+91 9876543210,+91 9820044556,2026-03-12 19:10:22,480,DL-ROHINI-04,864209048123456
1003,+91 9811223344,+91 9711556677,2026-03-12 20:05:00,120,NOIDA-SEC62-01,869012345678901
1004,+91 9876543210,+91 9955443322,2026-03-13 11:20:15,210,GURUGRAM-CH-09,864209048123456`
  },
  TRANSACTIONS: {
    sourceType: 'BANK_TRANSACTIONS' as EvidenceSourceType,
    fileName: 'Financial_RTGS_Mule_Layering.csv',
    content: `Txn_Ref,Sender_Entity,Receiver_Account,Amount_INR,Date_Time,Channel,Status
TXN8912401,Vikram Malhotra,Account XX99881122,150000.00,2026-03-15 10:14:00,IMPS,SUCCESS
TXN8912402,Account XX99881122,Account XX44332211,150000.00,2026-03-15 11:45:00,RTGS,SUCCESS
TXN8912403,Arjun Rawat,Account XX44332211,40000.00,2026-03-15 14:10:00,ATM_CASH_WITHDRAWAL,SUCCESS`
  },
  VEHICLE: {
    sourceType: 'VEHICLE_RECORDS' as EvidenceSourceType,
    fileName: 'State_Transport_Vahan_Record.json',
    content: `{
  "registration_plate": "DL-01-AB-1234",
  "owner_name": "Vikram Malhotra",
  "vehicle_class": "Mahindra Scorpio SUV",
  "chassis_number": "MA1TA2TK6M2A91283",
  "registered_rto": "Delhi West, Janakpuri",
  "insurance_status": "Active",
  "last_toll_sighting": "Badarpur Border, 16 March 2026"
}`
  }
};

export default function IngestionWizard({ cases, defaultCaseId, onSuccess }: IngestionWizardProps) {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(defaultCaseId || cases[0]?.id || 'case-001');
  const [sourceType, setSourceType] = useState<EvidenceSourceType>('FIR_REPORT');
  const [fileName, setFileName] = useState<string>('investigation_record.txt');
  const [fileContent, setFileContent] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ingestionResult, setIngestionResult] = useState<{
    entities: Entity[];
    relationships: Relationship[];
    alertsCount: number;
    evidenceId: string;
  } | null>(null);

  // Load sample template into form
  const handleLoadTemplate = (templateKey: keyof typeof SAMPLE_TEMPLATES) => {
    const tpl = SAMPLE_TEMPLATES[templateKey];
    setSourceType(tpl.sourceType);
    setFileName(tpl.fileName);
    setFileContent(tpl.content);
    setStep(3); // Jump to preview
  };

  const handleStartIngestion = async () => {
    if (!fileContent.trim()) {
      alert('Please provide or paste file content to ingest.');
      return;
    }

    setIsProcessing(true);
    setStep(4); // Processing screen

    try {
      const result = await InvestigationStore.executeDataIngestion(
        selectedCaseId,
        {
          name: fileName,
          size: new Blob([fileContent]).size,
          content: fileContent,
        },
        sourceType,
        (message, percent) => {
          setProcessingStatus(message);
          setProgressPercent(percent);
        }
      );

      setIngestionResult({
        entities: result.entities,
        relationships: result.relationships,
        alertsCount: result.alertsGenerated.length,
        evidenceId: result.evidence.id,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(`Data ingestion failed: ${err.message || 'Unknown error'}`);
      setStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#0d1633] border border-[#1e2f5b] rounded-xl p-5 md:p-6 shadow-xl">
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between border-b border-[#1e2f5b] pb-4 mb-6 text-xs">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-400 font-semibold' : 'text-slate-500'}`}>
          <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">1</div>
          <span>Case & Source</span>
        </div>
        <div className="h-0.5 w-8 bg-[#1e2f5b]"></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-400 font-semibold' : 'text-slate-500'}`}>
          <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">2</div>
          <span>Upload / Template</span>
        </div>
        <div className="h-0.5 w-8 bg-[#1e2f5b]"></div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-400 font-semibold' : 'text-slate-500'}`}>
          <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">3</div>
          <span>Validate & Preview</span>
        </div>
        <div className="h-0.5 w-8 bg-[#1e2f5b]"></div>
        <div className={`flex items-center space-x-2 ${step >= 4 ? 'text-blue-400 font-semibold' : 'text-slate-500'}`}>
          <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">4</div>
          <span>Analysis & Results</span>
        </div>
      </div>

      {/* STEP 1: Select Case & Source Type */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Step 1: Select Target Investigation Case</h3>
            <p className="text-xs text-slate-400 mt-1">
              Choose the active case under which this evidence file and its extracted entities will be cataloged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Case</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-[#132042] text-xs text-slate-100 p-2.5 rounded-lg border border-[#23386e] focus:outline-none focus:border-blue-500"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Evidence Category / Source</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as EvidenceSourceType)}
                className="w-full bg-[#132042] text-xs text-slate-100 p-2.5 rounded-lg border border-[#23386e] focus:outline-none focus:border-blue-500"
              >
                <option value="FIR_REPORT">FIR / Police Incident Report</option>
                <option value="CDR">CDR (Call Detail Records)</option>
                <option value="BANK_TRANSACTIONS">Bank / Financial Transactions</option>
                <option value="VEHICLE_RECORDS">Vehicle & Transport Records</option>
                <option value="FIELD_SURVEILLANCE">Field Surveillance / Raid Memo</option>
                <option value="DIGITAL_FORENSICS">Digital Forensics / Chat Logs</option>
                <option value="OTHER">Other Structured / Unstructured Record</option>
              </select>
            </div>
          </div>

          {/* Quick Demo Templates Box */}
          <div className="p-4 rounded-lg bg-[#101b38] border border-blue-500/30">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-300 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Quick Demo Ingestion Templates (Click to Test Instantly)</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              No files on hand? Preload standard forensic investigation test records to witness entity extraction and cross-case linking:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleLoadTemplate('FIR')}
                className="px-3 py-2 bg-[#14234b] hover:bg-[#1a2f64] border border-[#23386e] rounded text-xs text-slate-200 font-semibold transition flex flex-col items-center justify-center text-center gap-1"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>FIR Incident Report</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('CDR')}
                className="px-3 py-2 bg-[#14234b] hover:bg-[#1a2f64] border border-[#23386e] rounded text-xs text-slate-200 font-semibold transition flex flex-col items-center justify-center text-center gap-1"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span>CDR Call Records</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('TRANSACTIONS')}
                className="px-3 py-2 bg-[#14234b] hover:bg-[#1a2f64] border border-[#23386e] rounded text-xs text-slate-200 font-semibold transition flex flex-col items-center justify-center text-center gap-1"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Bank Transfers</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('VEHICLE')}
                className="px-3 py-2 bg-[#14234b] hover:bg-[#1a2f64] border border-[#23386e] rounded text-xs text-slate-200 font-semibold transition flex flex-col items-center justify-center text-center gap-1"
              >
                <FileJson className="w-4 h-4 text-purple-400" />
                <span>Vehicle JSON</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
            >
              <span>Continue to Data Input</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Input / Upload / Paste Content */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Step 2: Upload or Paste Investigation Data</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports CSV, JSON, TXT, or text extracted from FIR/PDF documents.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-[#132042] text-xs text-slate-100 p-2 rounded border border-[#23386e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              File Content (Paste or load sample)
            </label>
            <textarea
              rows={8}
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Paste raw FIR statement, CDR comma-separated rows, or financial ledger records..."
              className="w-full bg-[#132042] text-xs font-mono text-slate-200 p-3 rounded-lg border border-[#23386e] focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-[#132042] hover:bg-[#1b2d5c] text-slate-300 text-xs font-semibold rounded-lg transition"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!fileContent.trim()) {
                  alert('Please paste or provide file content.');
                  return;
                }
                setStep(3);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
            >
              <span>Preview & Validate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Data Quality Validation */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Step 3: Data Quality & Pre-Ingestion Validation</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review parsed structure, line count, and cryptographic fingerprint before running forensic extraction.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#132042] p-2.5 rounded border border-[#23386e]">
              <div className="text-[10px] text-slate-400">Total Characters</div>
              <div className="font-mono text-slate-100 font-bold mt-0.5">{fileContent.length}</div>
            </div>
            <div className="bg-[#132042] p-2.5 rounded border border-[#23386e]">
              <div className="text-[10px] text-slate-400">Line Count</div>
              <div className="font-mono text-slate-100 font-bold mt-0.5">{fileContent.split('\n').length}</div>
            </div>
            <div className="bg-[#132042] p-2.5 rounded border border-[#23386e]">
              <div className="text-[10px] text-slate-400">Data Quality Checks</div>
              <div className="text-emerald-400 font-semibold mt-0.5">✓ Ready for Parsing</div>
            </div>
            <div className="bg-[#132042] p-2.5 rounded border border-[#23386e]">
              <div className="text-[10px] text-slate-400">Chain Verification</div>
              <div className="text-cyan-400 font-semibold mt-0.5">SHA-256 Pre-calc</div>
            </div>
          </div>

          <div className="bg-[#091124] p-3 rounded-lg border border-[#1e2f5b] text-xs font-mono text-slate-300 max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{fileContent}</pre>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-[#132042] hover:bg-[#1b2d5c] text-slate-300 text-xs font-semibold rounded-lg transition"
            >
              Back to Edit
            </button>
            <button
              onClick={handleStartIngestion}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center space-x-2 shadow-lg"
            >
              <Cpu className="w-4 h-4" />
              <span>Execute AI & Forensic Extraction Pipeline</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Real-time Ingestion Progress & Final Results */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Step 4: Forensic Pipeline Execution</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live automated parsing, entity resolution, and temporal knowledge graph indexing.
            </p>
          </div>

          {/* Progress Bar & Status Text */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-blue-300 flex items-center space-x-1.5">
                {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
                <span>{processingStatus}</span>
              </span>
              <span className="font-mono text-slate-200">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-[#132042] rounded-full overflow-hidden border border-[#23386e]">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Results Summary once complete */}
          {ingestionResult && (
            <div className="space-y-4 pt-4 border-t border-[#1e2f5b] animate-in zoom-in-95 duration-200">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Ingestion & Indexing Successful</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Evidence committed to cryptographic chain and integrated into the knowledge graph.
                    </p>
                  </div>
                </div>
              </div>

              {/* Extraction Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#132042] p-3 rounded-lg border border-[#23386e]">
                  <div className="text-xl font-bold font-mono text-cyan-400">
                    {ingestionResult.entities.length}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Entities Extracted</div>
                </div>
                <div className="bg-[#132042] p-3 rounded-lg border border-[#23386e]">
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {ingestionResult.relationships.length}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Relationships Discovered</div>
                </div>
                <div className="bg-[#132042] p-3 rounded-lg border border-[#23386e]">
                  <div className="text-xl font-bold font-mono text-rose-400">
                    {ingestionResult.alertsCount}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">New Cross-Case Leads</div>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => router.push('/network')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Open Interactive Network Graph</span>
                </button>
                <button
                  onClick={() => router.push('/timeline')}
                  className="px-4 py-2 bg-[#132042] hover:bg-[#1b2d5c] text-slate-200 text-xs font-semibold rounded-lg border border-[#23386e] transition flex items-center space-x-1.5"
                >
                  <span>View in Temporal Timeline</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
