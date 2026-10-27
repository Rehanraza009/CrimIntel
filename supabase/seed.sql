-- ==============================================================================
-- CRIMINTEL: AI-Powered Criminal Network Analysis System
-- Reproducible Synthetic Demonstration Seed Script
-- Problem Statement: SIH26189 - Ministry of Home Affairs (MHA) - NCRB
-- ==============================================================================

-- 1. DATA SOURCES
INSERT INTO public.data_sources (id, name, source_type, jurisdiction, reliability_score, update_frequency, record_count, status)
VALUES
('d0000000-0000-0000-0000-000000000001', 'CCTNS National Police FIR Registry', 'FIR_REPORT', 'All India Inter-State', 0.99, 'Real-Time Sync', 148200, 'ACTIVE'),
('d0000000-0000-0000-0000-000000000002', 'DoT Licensee Telecom Gateway (CDR / IPDR)', 'CDR', 'Delhi & NCR Telecom Circles', 0.98, 'Automated 6-Hour Batch', 4210900, 'ACTIVE'),
('d0000000-0000-0000-0000-000000000003', 'MoRTH VAHAN National Vehicle Registry', 'VEHICLE_RECORDS', 'National Transport Network', 0.97, 'Daily Batch', 890200, 'ACTIVE'),
('d0000000-0000-0000-0000-000000000004', 'NPCI / RBI Financial Intelligence Gateway (FIU-IND)', 'BANK_TRANSACTIONS', 'Scheduled Commercial Banks & UPI Switches', 0.99, 'Real-Time API Push', 312000, 'ACTIVE'),
('d0000000-0000-0000-0000-000000000005', 'National Cybercrime Reporting Portal (NCRP)', 'DIGITAL_FORENSICS', 'Ministry of Home Affairs', 0.95, 'Hourly Polling', 65400, 'ACTIVE'),
('d0000000-0000-0000-0000-000000000006', 'Bureau of Immigration & Passport Verification Service', 'OTHER', 'Ministry of External Affairs', 0.99, 'Automated Push', 94000, 'ACTIVE'),
('d0000000-0000-0000-0000-000000000007', 'State Anti-Human Trafficking Unit (AHTU) Central Feed', 'FIELD_SURVEILLANCE', 'Delhi-UP-Haryana Joint Taskforce', 0.94, 'Daily Batch', 12400, 'ACTIVE'),
('d0000000-0000-0000-0000-000000000008', 'Wildlife Crime Control Bureau (WCCB) Seizure Logs', 'FIELD_SURVEILLANCE', 'Ports, ICDs, and Forest Transit Corridors', 0.96, 'Weekly Digest', 4800, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 2. CASES (10 Fictional Investigation Dockets)
INSERT INTO public.cases (id, case_number, title, description, category, status, priority, location, jurisdiction, date_range_start, date_range_end)
VALUES
('c0000000-0000-0000-0000-000000000001', 'CASE-2026-001', 'Operation Gridlock - Cyber SIM-Box & Digital Arrest Extortion', 'Transnational SIM-box extortion and courier impersonation racket targeting senior citizens and working professionals in NCR.', 'Cyber Financial Fraud', 'ACTIVE_ANALYSIS', 'CRITICAL', 'Cyber PS, Rohini Sector 16, New Delhi', 'Delhi Police Special Cell', '2026-02-01', '2026-03-25'),
('c0000000-0000-0000-0000-000000000002', 'CASE-2026-002', 'Operation Starlight - Inter-State Trafficking & Forged Identity Network', 'Inter-state racket providing counterfeit Aadhaar and forged passports, exploiting vulnerable individuals under guise of overseas consultancies.', 'Human Trafficking & Forgery', 'ACTIVE_ANALYSIS', 'CRITICAL', 'Sector 62, Noida & Ghaziabad Border', 'UP Anti-Human Trafficking Unit (AHTU)', '2026-01-15', '2026-03-28'),
('c0000000-0000-0000-0000-000000000003', 'CASE-2026-003', 'Syndicate Funnel - ATM Cash Skimming & Layered Muling Network', 'Rapid ATM cash dispersion funnel moving defrauded capital through 18 intermediary mule accounts within minutes of deposit.', 'Financial Crime / Hawala', 'UNDER_REVIEW', 'HIGH', 'Connaught Place & South Extension, New Delhi', 'Economic Offences Wing (EOW)', '2026-02-10', '2026-03-22'),
('c0000000-0000-0000-0000-000000000004', 'CASE-2026-004', 'Operation CounterPlate - Stolen Luxury Vehicle Smuggling', 'Tampered chassis numbers and cloned registration plates on luxury SUVs transporting illicit consignments across Delhi-Haryana-Rajasthan borders.', 'Organized Vehicle Theft', 'OPEN', 'MEDIUM', 'Gurugram Expressway & NH-48', 'Haryana Police Crime Branch', '2026-03-01', '2026-03-27'),
('c0000000-0000-0000-0000-000000000005', 'CASE-2026-005', 'Digital Honeytrap & Organized Extortion Syndicate', 'Coordinated extortion ring blackmailing business executives using recorded private video calls, routed through virtual numbers.', 'Extortion & Cyber Harassment', 'ACTIVE_ANALYSIS', 'HIGH', 'Dwarka Sector 10 & Gurugram Cyber Hub', 'Special Cell Women Safety Wing', '2026-02-18', '2026-03-28'),
('c0000000-0000-0000-0000-000000000006', 'CASE-2026-006', 'Operation HawalaNexus - Cross-Border Trade-Based Forex Layering', 'Under-invoicing export front moving illicit funds between import houses in Old Delhi and shell consultancies in Southeast Asia.', 'Financial Crime / Hawala', 'ACTIVE_ANALYSIS', 'CRITICAL', 'Chandni Chowk & Karol Bagh, New Delhi', 'Enforcement Directorate Coordination Desk', '2026-01-10', '2026-03-20'),
('c0000000-0000-0000-0000-000000000007', 'CASE-2026-007', 'Operation DarkPharm - Counterfeit Life-Saving Pharmaceuticals Ring', 'Illicit manufacturing facility pressing spurious oncology and antibiotic pills distributed to retail medical stores.', 'Illicit Trade & Public Health Hazard', 'UNDER_REVIEW', 'HIGH', 'Faridabad Industrial Area & Okhla Phase III', 'State Drug Control & Special Task Force', '2026-02-15', '2026-03-26'),
('c0000000-0000-0000-0000-000000000008', 'CASE-2026-008', 'Operation IronClad - Inter-State Illicit Firearms & Ammo Logistics', 'Country-made firearm shipments concealed in modified commercial transport trucks originating from Meerut moving towards NCR.', 'Arms Trafficking', 'ACTIVE_ANALYSIS', 'CRITICAL', 'Meerut Bypass & Anand Vihar Border', 'Delhi Police Crime Branch', '2026-02-25', '2026-03-27'),
('c0000000-0000-0000-0000-000000000009', 'CASE-2026-009', 'Operation PhantomSIM - Telecom Gateways & Government Impersonation', 'Automated VoIP dialer gateways spoofing Department of Telecommunications (DoT) and vigilance credentials.', 'Cyber Impersonation', 'OPEN', 'HIGH', 'Janakpuri & Cyber Hub Sector 29', 'Cyber Crime Unit / MHA NCRP', '2026-03-02', '2026-03-28'),
('c0000000-0000-0000-0000-000000000010', 'CASE-2026-010', 'Operation RedSanders - Protected Timber & Wildlife Smuggling Syndicate', 'Trafficking syndicate moving seized endangered logs disguised as agricultural produce via interstate container consignments.', 'Wildlife & Forest Contraband', 'UNDER_REVIEW', 'MEDIUM', 'Tughlakabad Inland Container Depot (ICD)', 'Wildlife Crime Control Bureau (WCCB)', '2026-01-20', '2026-03-18')
ON CONFLICT (id) DO NOTHING;

-- 3. EVIDENCE RECORDS (Sample of Cryptographic Hash Chain)
INSERT INTO public.evidence (id, case_id, file_name, file_path, file_size, mime_type, source_type, sha256_hash, previous_hash, integrity_status, block_index)
VALUES
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'FIR_2026_0142_Cyber_PS_Rohini.pdf', 'evidence/case-001/FIR_2026_0142_Cyber_PS_Rohini.pdf', 412850, 'application/pdf', 'FIR_REPORT', 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0', '0000000000000000000000000000000000000000000000000000000000000000', 'VERIFIED', 1),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'CDR_SIM_Box_Gateway_Feb2026.csv', 'evidence/case-001/CDR_SIM_Box_Gateway_Feb2026.csv', 1845920, 'text/csv', 'CDR', 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1', 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0', 'VERIFIED', 2),
('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Bank_Statement_Account_XX99881122.csv', 'evidence/case-001/Bank_Statement_Account_XX99881122.csv', 94520, 'text/csv', 'BANK_TRANSACTIONS', 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef2', 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1', 'VERIFIED', 3),
('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Vahan_Vehicle_Search_DL01AB1234.json', 'evidence/case-001/Vahan_Vehicle_Search_DL01AB1234.json', 12450, 'application/json', 'VEHICLE_RECORDS', 'd4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef3', 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef2', 'VERIFIED', 4)
ON CONFLICT (id) DO NOTHING;

-- 4. ENTITIES (Sample Key Network Subjects)
INSERT INTO public.entities (id, case_id, entity_type, name, normalized_name, description, category, confidence, risk_indicator)
VALUES
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'PERSON', 'Vikram Malhotra', 'VIKRAM MALHOTRA', 'Suspected technical orchestrator for SIM box array deployment and VoIP routing.', 'Key Subject', 0.94, 'HIGH'),
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'PHONE', '+91 9876543210', '9876543210', 'Primary burner telephone number active in extortion calls and SIM box routing.', 'Communication Vector', 0.99, 'HIGH'),
('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'PERSON', 'Rajesh Shinde', 'RAJESH SHINDE', 'Mule coordinator in charge of opening current accounts using fabricated GST registrations.', 'Financial Mule Operator', 0.88, 'HIGH'),
('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'ACCOUNT', 'Account XX99881122', 'ACC-XX99881122', 'Central collection mule account receiving initial victim extortion deposits.', 'Financial Muling Node', 0.98, 'HIGH'),
('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'VEHICLE', 'DL-01-AB-1234', 'DL01AB1234', 'Black Mahindra Scorpio observed outside victim residences and safehouses.', 'Surveillance Vehicle', 0.95, 'HIGH'),
('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'LOCATION', 'Sector 62 Noida Safehouse', 'SECTOR 62 NOIDA SAFEHOUSE', 'Shared clandestine apartment housing SIM box modems and cash counting equipment.', 'Logistical Safehouse', 0.92, 'HIGH')
ON CONFLICT (id) DO NOTHING;

-- 5. RELATIONSHIPS
INSERT INTO public.relationships (id, source_entity_id, target_entity_id, relationship_type, confidence, start_time, case_id)
VALUES
('r0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'OWNED', 0.98, '2026-02-05 10:00:00+00', 'c0000000-0000-0000-0000-000000000001'),
('r0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'OWNED', 0.94, '2026-02-06 12:00:00+00', 'c0000000-0000-0000-0000-000000000001'),
('r0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'LOCATED_AT', 0.92, '2026-02-07 14:30:00+00', 'c0000000-0000-0000-0000-000000000001'),
('r0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'ASSOCIATED_WITH', 0.91, '2026-02-08 18:00:00+00', 'c0000000-0000-0000-0000-000000000001'),
('r0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'TRANSFERRED', 0.97, '2026-02-09 10:15:00+00', 'c0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 6. AUDIT LOGS (Genesis Chain)
INSERT INTO public.audit_logs (id, user_email, action, resource_type, resource_id, prev_hash, log_hash)
VALUES
('a0000000-0000-0000-0000-000000000001', 'admin.mha@crimintel.nic.in', 'SYSTEM_INITIALIZED', 'SYSTEM', 'CRIMINTEL_CORE', '0000000000000000000000000000000000000000000000000000000000000000', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
ON CONFLICT (id) DO NOTHING;
