# CRIMINTEL
### AI-Powered Criminal Network Analysis System

**Problem Statement ID:** SIH26189  
**Organization:** Ministry of Home Affairs (MHA) – National Crime Records Bureau (NCRB)  
**Division:** Women Safety Division  
**Category:** Software | **Theme:** Blockchain & Cybersecurity  

> **CRITICAL INVESTIGATION-SUPPORT NOTICE:**  
> CrimIntel is strictly an **investigation decision-support platform**. It does **NOT** declare a person guilty, predict crime, or automatically label anyone as a criminal. The platform surfaces relationships, patterns, evidence provenance, and investigative leads. Final conclusions remain exclusively with authorized human investigators and constitutional courts.  
>  
> **DEMONSTRATION DATA NOTICE:**  
> All demonstration investigation data in this repository is **100% synthetic and anonymized** for technical evaluation and hackathon judging.

---

## 1. Executive Summary

Traditional law enforcement investigations into organized cyber fraud, transnational SIM-box arrays, human trafficking, and financial muling syndicates struggle with fragmented data silos across separate police stations, telecom circles, and banking networks.

**CrimIntel** transforms fragmented investigation records (FIRs, CDRs, Bank RTGS/IMPS logs, vehicle registrations, and field surveillance memos) into an **explainable, evidence-anchored temporal knowledge graph**.

### Primary Tagline:
> *"From fragmented investigation records to explainable relationships."*

---

## 2. Core Product Differentiators

1. **Complete Day/Night Theme System:**
   - Seamless, instant switching between an enterprise **Day Mode** (`#F5F7FB` background, crisp white cards, `#E2E8F0` borders, `#172033` high-contrast typography) and a low-strain **Night Mode** (`#0B1220` navy background, `#111C30` cards, `#263650` borders, `#F1F5F9` text).
   - Dynamic canvas adaptation for Cytoscape.js graphs and Recharts analytics.
   - Zero-flash client preference persistence in `localStorage` with OS `prefers-color-scheme` auto-detection.
2. **Plain-Language Demystification (Basic vs. Advanced View):**
   - Contextual terminology guide explaining concepts like *Entity*, *Relationship*, *Entity Resolution*, *Temporal Timeline*, *Evidence Provenance*, and *Confidence Score* in plain English.
   - Interactive Basic / Advanced view toggle on the dashboard for officers and prosecutors.
3. **Cross-Case Correlation:**
   - Automatically surfaces shared burner phone numbers, muling bank accounts, cloned vehicle plates, and safehouse locations across independent FIRs and police jurisdictions.
4. **Multi-Signal Entity Resolution:**
   - Evaluates phonetic name similarity, shared phone numbers, bank accounts, and geographic proximity to propose duplicate candidate entities without silently merging them, enforcing human-in-the-loop auditable approval.
5. **Temporal Knowledge Graph:**
   - Models relationships with timestamps and durations. Allows investigators to filter by date ranges and witness how criminal networks mobilized and transferred assets over time.
6. **Evidence Provenance & Cryptographic Chain:**
   - Every single node and relationship links back to exact source evidence (file name, page number, row index, and raw excerpt). A tamper-evident SHA-256 sequential audit chain guarantees chain of custody.

---

## 3. Technology Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Theme Engine:** Custom CSS-variable-based theme provider with anti-flash head hydration script and dynamic Cytoscape stylesheet synchronizer
- **Network Graph:** Cytoscape.js (CoSE force-directed, concentric, and hierarchical layouts) with Day/Night node label backgrounds and edge inspector drawer
- **Analytics Charts:** Recharts (Forensic case distribution, entity classes breakdown) with adaptive dark/light tooltips and axes
- **Forms & Validation:** React Hook Form, Zod
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Supabase Auth, Storage)
- **AI / NLP Engine:** Hybrid architecture supporting external LLM providers (Google Gemini / OpenAI) with an intelligent **Deterministic Forensic NLP Engine** (zero API keys required for offline demo reliability)
- **Cryptographic Security:** Web Crypto API & SHA-256 sequential block hash chaining
- **Deployment:** Vercel-ready with full Supabase integration

---

## 4. Application Architecture & Routes

### Public Routes:
- `/` - Institutional Landing Page with problem statement, workflow, and capabilities
- `/features` - Comprehensive forensic intelligence feature matrix
- `/security` - Cryptographic hash chain specs, Row Level Security, and auditability charter
- `/about` - MHA/NCRB mission, ethical AI principles, and SIH26189 context
- `/auth/login` - Officer sign-in with 1-click test roles (Admin, Investigator, Analyst, Viewer)
- `/auth/signup` - Officer credential registration

### Authenticated Investigation Suite:
- `/dashboard` - Main investigation command center with live metrics and charts
- `/cases` - Docket repository with status filters, priority sorting, and new case registration
- `/cases/[id]` - Comprehensive case detail page (Overview, Graph, Entities, Relationships, Evidence, Timeline, Alerts, Audit)
- `/entities` - Entity Explorer and Multi-Signal Entity Resolution engine
- `/entities/[id]` - Entity Profile with verified identifiers, connected cases, and 1-hop graph
- `/network` - Full-screen interactive Cytoscape.js network analysis canvas
- `/timeline` - Temporal chronogram filtering events and relationship windows
- `/evidence` - Evidence vault with cryptographic SHA-256 custody chain verification
- `/alerts` - Investigation leads with explainability metrics and actionable review buttons
- `/reports` - Court-admissible report generator with strict separation of Source Evidence vs AI Analysis
- `/import` - 10-step data ingestion wizard with realistic templates (FIR, CDR, Bank, Vehicle)
- `/search` - Universal investigation search across names, phone numbers, plates, and accounts
- `/audit` - Append-only tamper-evident audit log ledger
- `/settings` - Officer profile and security preferences
- `/admin` - Administrator console for user management and AI engine configuration

---

## 5. Getting Started (Local Development)

### Prerequisites:
- Node.js 18.x or 20.x or 22.x
- npm or pnpm

### Installation & Windows PowerShell Setup:
```powershell
# Clone the repository
git clone <repository_url>
cd CrimIntel

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables template (PowerShell)
Copy-Item .env.example .env.local

# Run automated test suite (SHA-256, NLP extraction, entity resolution, and dataset targets)
npm test

# Run the local development server
npm run dev

# Or verify production build
npm run build
```

Visit `http://localhost:3000` in your web browser.

---

## 6. Supabase Database & Backend Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open and run the schema migration script located at:
   `supabase/migrations/20260301000000_crimintel_init.sql`
4. Run the seed script to populate reproducible demonstration records:
   `supabase/seed.sql`
5. The migration and seed configure:
   - All 16 tables (`profiles`, `cases`, `case_members`, `evidence`, `evidence_records`, `entities`, `entity_identifiers`, `entity_matches`, `relationships`, `events`, `transactions`, `alerts`, `reports`, `audit_logs`, `data_sources`, `processing_jobs`)
   - Optimized B-tree indexes for fast graph traversal and identifier lookup
   - PostgreSQL Row Level Security (RLS) policies for `ADMIN`, `INVESTIGATOR`, `ANALYST`, and `VIEWER`
   - Strict append-only rules on audit logs
6. Create a Storage Bucket in Supabase called `investigation-evidence` with private access.
7. Copy your **Supabase URL** and **Anon Key** into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-server-only
   ```

*Note: CrimIntel includes an automatic high-fidelity in-browser store fallback. If Supabase environment variables are left blank, the entire application seamlessly runs with complete persistence in localStorage and rich demonstration data!*

---

## 7. AI Provider Configuration

CrimIntel employs an AI-provider abstraction:
- **Default Mode:** `AI_PROVIDER=deterministic_nlp` (Built-in regex and heuristic parser for Indian mobile numbers, vehicle plates, bank accounts, and relationship rules. Requires zero external keys).
- **External LLM Mode:**
  ```env
  AI_PROVIDER=gemini
  AI_API_KEY=your-google-gemini-api-key
  ```
  or
  ```env
  AI_PROVIDER=openai
  AI_API_KEY=your-openai-api-key
  ```

---

## 8. Complete Hackathon Demonstration Workflow

Judges can execute this complete end-to-end investigation scenario in under 2 minutes:

1. **Sign In:** Click **Officer Sign In** and select **Insp. Amit Kumar (INVESTIGATOR)**.
2. **Dashboard:** Inspect active cases, high-priority alerts, and the cross-case link badge.
3. **Open Case:** Open docket `CASE-2026-001` (Operation Gridlock - Cyber SIM-Box Fraud).
4. **Data Ingestion (`/import`):**
   - Click **Ingest Evidence**.
   - Click **FIR Incident Report** template to auto-fill an extortion report.
   - Click **Execute AI & Forensic Extraction Pipeline**.
   - Watch the animated progress bar extract entities, verify the SHA-256 chain, and discover cross-case links.
5. **Entity Resolution (`/entities`):**
   - Switch to **Entity Resolution Candidates**.
   - Review the candidate match between *Vikram Malhotra* and *V. Malhotra* (87% confidence, shared phone +91 9876543210).
   - Click **Confirm Merge (Audited)**.
6. **Network Graph (`/network`):**
   - Click node *Vikram Malhotra*. Notice the red halo indicating a cross-case link.
   - Click the edge to view the **Evidence Provenance** inspector linking back to CDR row #142.
   - Switch layouts to **Concentric Centrality** or **Hierarchical Tree**.
7. **Temporal Timeline (`/timeline`):**
   - Filter by **30 Days** to observe the chronological sequence of calls and muling withdrawals.
8. **Evidence Vault (`/evidence`):**
   - Inspect the block chain. Click **Verify Cryptographic Chain** to validate the unbroken SHA-256 chain of custody.
9. **Investigation Report (`/reports`):**
   - Generate the official brief. Review the clean distinction between verified source evidence and AI-derived leads.
   - Click **Print / Save PDF**.
10. **Audit Log (`/audit`):**
    - Verify that every action taken during the demo was cryptographically signed into the append-only ledger.

---

## 9. License & Institutional Context

Developed for the **Smart India Hackathon (SIH26189)**.  
Submitted under the **Ministry of Home Affairs (MHA) – National Crime Records Bureau (NCRB)**, Women Safety Division.

## 10. Contribution
Niharika Swain, Rehan Raza
