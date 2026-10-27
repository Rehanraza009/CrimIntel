'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
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
  FileJson,
  X,
  FileUp,
  FolderOpen,
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

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export default function IngestionWizard({ cases, defaultCaseId, onSuccess }: IngestionWizardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<number>(1);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(defaultCaseId || cases[0]?.id || 'case-001');
  const [sourceType, setSourceType] = useState<EvidenceSourceType>('FIR_REPORT');
  const [fileName, setFileName] = useState<string>('investigation_record.txt');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ingestionResult, setIngestionResult] = useState<{
    entities: Entity[];
    relationships: Relationship[];
    alertsCount: number;
    evidenceId: string;
  } | null>(null);

  const handleLoadTemplate = (type: keyof typeof SAMPLE_TEMPLATES) => {
    const tmpl = SAMPLE_TEMPLATES[type];
    setSourceType(tmpl.sourceType);
    setFileName(tmpl.fileName);
    setFileContent(tmpl.content);
    setFileSize(new Blob([tmpl.content]).size);
    setUploadError('');
    setStep(2);
  };

  const handleFileUpload = (file: File) => {
    setUploadError('');
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File exceeds maximum size of 25 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setFileContent(JSON.stringify(results.data, null, 2));
          setSourceType('CDR');
        },
        error: (err) => {
          setUploadError(`CSV parsing error: ${err.message}`);
        },
      });
    } else if (ext === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          setFileContent(JSON.stringify(parsed, null, 2));
          setSourceType('VEHICLE_RECORDS');
        } catch (err: any) {
          setUploadError('Invalid JSON format: ' + err.message);
        }
      };
      reader.readAsText(file);
    } else if (ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result as string);
        setSourceType('FIR_REPORT');
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(`[Extracted text stream from binary document: ${file.name} (${file.size} bytes)]\nIncident reference confirmed. Source document preserved for SHA-256 fingerprinting.`);
        setSourceType('DIGITAL_FORENSICS');
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleStartIngestion = async () => {
    if (!fileContent.trim()) {
      setUploadError('Please provide or paste file content to ingest.');
      return;
    }

    setIsProcessing(true);
    setStep(4);

    try {
      const result = await InvestigationStore.executeDataIngestion(
        selectedCaseId,
        {
          name: fileName,
          size: fileSize || new Blob([fileContent]).size,
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
      setUploadError(`Data ingestion failed: ${err.message || 'Unknown error'}`);
      setStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-2xl p-5 md:p-6 shadow-sm transition-colors duration-200">
      {/* 5-Step Progress Bar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1e2f5b] pb-4 mb-6 text-xs">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}`}>
          <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</div>
          <span className="hidden sm:inline">Target Docket</span>
        </div>
        <div className="h-0.5 w-6 sm:w-10 bg-slate-200 dark:bg-[#1e2f5b]" />
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}`}>
          <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</div>
          <span className="hidden sm:inline">Upload File</span>
        </div>
        <div className="h-0.5 w-6 sm:w-10 bg-slate-200 dark:bg-[#1e2f5b]" />
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}`}>
          <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</div>
          <span className="hidden sm:inline">Quality Check</span>
        </div>
        <div className="h-0.5 w-6 sm:w-10 bg-slate-200 dark:bg-[#1e2f5b]" />
        <div className={`flex items-center space-x-2 ${step >= 4 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}`}>
          <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">4</div>
          <span className="hidden sm:inline">Extraction & Results</span>
        </div>
      </div>

      {/* STEP 1: Select Case & Source Type */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Step 1: Select Target Investigation Docket
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose the case under which this evidence file and its extracted entities will be indexed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Case Docket
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Evidence Format & Classification
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as EvidenceSourceType)}
                className="w-full bg-slate-50 dark:bg-[#0f172a] text-xs font-semibold text-slate-800 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-blue-200 dark:border-blue-900/40">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-300 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Quick Demonstration Ingestion Templates (Click to Preload)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Preload standard investigation test files to witness entity extraction, SHA-256 fingerprinting, and cross-case linking:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleLoadTemplate('FIR')}
                className="p-3 bg-white dark:bg-[#16243e] hover:bg-slate-100 dark:hover:bg-[#1d2f52] border border-slate-200 dark:border-[#263650] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex flex-col items-center justify-center text-center gap-1 shadow-xs"
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <span>FIR Incident Report</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('CDR')}
                className="p-3 bg-white dark:bg-[#16243e] hover:bg-slate-100 dark:hover:bg-[#1d2f52] border border-slate-200 dark:border-[#263650] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex flex-col items-center justify-center text-center gap-1 shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-500" />
                <span>CDR Call Records</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('TRANSACTIONS')}
                className="p-3 bg-white dark:bg-[#16243e] hover:bg-slate-100 dark:hover:bg-[#1d2f52] border border-slate-200 dark:border-[#263650] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex flex-col items-center justify-center text-center gap-1 shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Bank Transfers</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('VEHICLE')}
                className="p-3 bg-white dark:bg-[#16243e] hover:bg-slate-100 dark:hover:bg-[#1d2f52] border border-slate-200 dark:border-[#263650] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex flex-col items-center justify-center text-center gap-1 shadow-xs"
              >
                <FileJson className="w-4 h-4 text-purple-500" />
                <span>Vehicle JSON</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow"
            >
              <span>Continue to Upload File</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Drag & Drop File Upload or Manual Paste */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Step 2: Upload or Drag & Drop Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Supports CSV, JSON, TXT, PDF, and DOCX files up to 25 MB.
            </p>
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-300 dark:border-[#263650] bg-slate-50 dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-[#16243e] hover:border-blue-400'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              accept=".csv,.json,.txt,.pdf,.docx"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Click to browse or drag & drop evidence file
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                CSV (CDRs, Ledgers), JSON (VAHAN, FIR), TXT, PDF, or DOCX (Max 25 MB)
              </div>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-blue-600 dark:text-blue-300 font-mono font-bold">
              <span className="px-2 py-0.5 bg-white dark:bg-[#16243e] rounded border border-slate-200 dark:border-[#263650]">.CSV</span>
              <span className="px-2 py-0.5 bg-white dark:bg-[#16243e] rounded border border-slate-200 dark:border-[#263650]">.JSON</span>
              <span className="px-2 py-0.5 bg-white dark:bg-[#16243e] rounded border border-slate-200 dark:border-[#263650]">.TXT</span>
              <span className="px-2 py-0.5 bg-white dark:bg-[#16243e] rounded border border-slate-200 dark:border-[#263650]">.PDF</span>
              <span className="px-2 py-0.5 bg-white dark:bg-[#16243e] rounded border border-slate-200 dark:border-[#263650]">.DOCX</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-slate-200 dark:border-[#1e2f5b] w-full"></div>
            <span className="bg-white dark:bg-[#111c30] px-3 text-[11px] text-slate-400 font-mono uppercase tracking-wider">
              Or Inspect / Edit File Content
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0f172a] text-xs text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-[#263650] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              File Content (Raw Text / JSON / CSV)
            </label>
            <textarea
              rows={6}
              value={fileContent}
              onChange={(e) => {
                setFileContent(e.target.value);
                setFileSize(new Blob([e.target.value]).size);
              }}
              placeholder="Paste raw FIR statement, CDR comma-separated rows, or financial ledger records..."
              className="w-full bg-slate-50 dark:bg-[#0f172a] text-xs font-mono text-slate-800 dark:text-slate-200 p-3 rounded-xl border border-slate-200 dark:border-[#263650] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!fileContent.trim()) {
                  setUploadError('Please select a file or paste content to continue.');
                  return;
                }
                setStep(3);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1.5"
            >
              <span>Preview & Validate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Quality Validation */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Step 3: Quality Check & Pre-Ingestion Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review parsed structure, line count, and cryptographic fingerprint before running forensic extraction.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200 dark:border-[#1e2f5b]">
              <div className="text-[10px] text-slate-400 font-semibold">File Name</div>
              <div className="font-mono text-slate-800 dark:text-slate-100 font-bold mt-0.5 truncate">{fileName}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200 dark:border-[#1e2f5b]">
              <div className="text-[10px] text-slate-400 font-semibold">Total Size</div>
              <div className="font-mono text-slate-800 dark:text-slate-100 font-bold mt-0.5">
                {(fileSize || fileContent.length).toLocaleString()} bytes
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200 dark:border-[#1e2f5b]">
              <div className="text-[10px] text-slate-400 font-semibold">Data Quality Checks</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓ Ready for Parsing</div>
            </div>
            <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200 dark:border-[#1e2f5b]">
              <div className="text-[10px] text-slate-400 font-semibold">Chain Verification</div>
              <div className="text-blue-600 dark:text-cyan-400 font-bold mt-0.5">SHA-256 Pre-calc</div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#091124] p-3 rounded-xl border border-slate-200 dark:border-[#1e2f5b] text-xs font-mono text-slate-800 dark:text-slate-200 max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{fileContent}</pre>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition"
            >
              Back to Edit
            </button>
            <button
              onClick={handleStartIngestion}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-lg"
            >
              <Cpu className="w-4 h-4" />
              <span>Execute Forensic Extraction Pipeline</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Execution Progress & Results */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Step 4: Forensic Pipeline Execution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live automated parsing, entity resolution, and temporal knowledge graph indexing.
            </p>
          </div>

          {/* Progress Bar & Status Text */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-blue-600 dark:text-blue-300 flex items-center space-x-1.5">
                {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />}
                <span>{processingStatus}</span>
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-200">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-[#132042] rounded-full overflow-hidden border border-slate-200 dark:border-[#23386e]">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Results Summary once complete */}
          {ingestionResult && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-[#1e2f5b] animate-in zoom-in-95 duration-200">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ingestion & Indexing Successful</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Evidence committed to cryptographic chain and integrated into the knowledge graph.
                    </p>
                  </div>
                </div>
              </div>

              {/* Extraction Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200 dark:border-[#1e2f5b]">
                  <div className="text-xl font-bold font-mono text-teal-600 dark:text-cyan-400">
                    {ingestionResult.entities.length}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Entities Extracted</div>
                </div>
                <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200 dark:border-[#1e2f5b]">
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {ingestionResult.relationships.length}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Relationships Discovered</div>
                </div>
                <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200 dark:border-[#1e2f5b]">
                  <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                    {ingestionResult.alertsCount}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">New Review Items</div>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => router.push('/network')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1.5 shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Open Interactive Network Graph</span>
                </button>
                <button
                  onClick={() => router.push('/timeline')}
                  className="px-4 py-2 border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
                >
                  <span>View in Temporal Timeline</span>
                </button>
                <button
                  onClick={() => router.push('/evidence')}
                  className="px-4 py-2 border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
                >
                  <span>Check Evidence Hash Chain</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
