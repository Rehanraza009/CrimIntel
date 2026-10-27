-- ==============================================================================
-- CRIMINTEL: AI-Powered Criminal Network Analysis System
-- Database Schema & Security Architecture Migration
-- Problem Statement: SIH26189 - Ministry of Home Affairs (MHA) - NCRB
-- ==============================================================================

-- Enable UUID and Cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing types if necessary
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('ADMIN', 'INVESTIGATOR', 'ANALYST', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE case_status_type AS ENUM ('OPEN', 'UNDER_REVIEW', 'ACTIVE_ANALYSIS', 'ON_HOLD', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE case_priority_type AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE entity_category_type AS ENUM (
        'PERSON', 'PHONE', 'EMAIL', 'ACCOUNT', 'VEHICLE', 
        'LOCATION', 'ORGANIZATION', 'CASE', 'EVENT', 'DATE', 'TRANSACTION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE relationship_category_type AS ENUM (
        'CALLED', 'TRANSFERRED', 'OWNED', 'LOCATED_AT', 'ASSOCIATED_WITH',
        'WORKS_FOR', 'VISITED', 'COMMUNICATED_WITH', 'PART_OF_CASE', 
        'RELATED_TO', 'INVOLVED_IN', 'TRANSACTED_WITH'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evidence_source_category_type AS ENUM (
        'FIR_REPORT', 'CDR', 'BANK_TRANSACTIONS', 'VEHICLE_RECORDS',
        'CRIMINAL_HISTORY', 'FIELD_SURVEILLANCE', 'DIGITAL_FORENSICS', 'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity_type AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_category_type AS ENUM (
        'HIGH_PRIORITY', 'REVIEW_REQUIRED', 'UNUSUAL_PATTERN', 
        'CROSS_CASE_LINK', 'ENTITY_MATCH', 'DATA_QUALITY'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    badge_number TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL DEFAULT 'CID / Cyber Crime Division',
    role user_role_type NOT NULL DEFAULT 'ANALYST',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CASES
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    status case_status_type NOT NULL DEFAULT 'OPEN',
    priority case_priority_type NOT NULL DEFAULT 'MEDIUM',
    location TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    date_range_start DATE,
    date_range_end DATE,
    assigned_investigator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CASE MEMBERS (Collaborators on specific cases)
CREATE TABLE IF NOT EXISTS public.case_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'ANALYST',
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(case_id, user_id)
);

-- 4. EVIDENCE & TAMPER-EVIDENT HASH CHAIN
CREATE TABLE IF NOT EXISTS public.evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL,
    source_type evidence_source_category_type NOT NULL,
    sha256_hash TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    integrity_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (integrity_status IN ('VERIFIED', 'COMPROMISED', 'PENDING')),
    block_index BIGINT NOT NULL DEFAULT 1,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. EVIDENCE RECORDS (Individual parsed records/lines within an evidence file)
CREATE TABLE IF NOT EXISTS public.evidence_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE,
    record_index INT NOT NULL,
    page_number INT,
    raw_data JSONB NOT NULL,
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ENTITIES
CREATE TABLE IF NOT EXISTS public.entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
    entity_type entity_category_type NOT NULL,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    confidence REAL NOT NULL DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1.0),
    risk_indicator TEXT DEFAULT 'NEUTRAL' CHECK (risk_indicator IN ('HIGH', 'MEDIUM', 'LOW', 'NEUTRAL')),
    metadata JSONB DEFAULT '{}'::jsonb,
    merged_into_id UUID REFERENCES public.entities(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ENTITY IDENTIFIERS
CREATE TABLE IF NOT EXISTS public.entity_identifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    identifier_type TEXT NOT NULL,
    identifier_value TEXT NOT NULL,
    normalized_value TEXT NOT NULL,
    source_evidence_id UUID REFERENCES public.evidence(id) ON DELETE SET NULL,
    confidence REAL NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ENTITY MATCHES (Entity Resolution Candidates)
CREATE TABLE IF NOT EXISTS public.entity_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    candidate_entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    match_score REAL NOT NULL CHECK (match_score >= 0 AND match_score <= 1.0),
    matching_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'MERGED', 'REJECTED', 'REVIEW_LATER')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(source_entity_id, candidate_entity_id)
);

-- 9. RELATIONSHIPS
CREATE TABLE IF NOT EXISTS public.relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    target_entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    relationship_type relationship_category_type NOT NULL,
    confidence REAL NOT NULL DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1.0),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    source_evidence_id UUID REFERENCES public.evidence(id) ON DELETE SET NULL,
    evidence_provenance JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. EVENTS (Temporal Events)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_time TIMESTAMPTZ NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    source_evidence_id UUID REFERENCES public.evidence(id) ON DELETE SET NULL,
    related_entities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    sender_entity_id UUID REFERENCES public.entities(id) ON DELETE SET NULL,
    receiver_entity_id UUID REFERENCES public.entities(id) ON DELETE SET NULL,
    amount NUMERIC(16, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    transaction_type TEXT NOT NULL,
    channel TEXT,
    transaction_time TIMESTAMPTZ NOT NULL,
    source_evidence_id UUID REFERENCES public.evidence(id) ON DELETE SET NULL,
    reference_no TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ALERTS (Investigation Pattern Detection)
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    alert_type alert_category_type NOT NULL,
    severity alert_severity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 0.9,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'UNDER_REVIEW', 'INVESTIGATED', 'DISMISSED')),
    related_entities JSONB DEFAULT '[]'::jsonb,
    related_cases JSONB DEFAULT '[]'::jsonb,
    supporting_evidence_id UUID REFERENCES public.evidence(id) ON DELETE SET NULL,
    explainability JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    findings JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    file_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT LOGS (Append-Only Tamper-Evident Security Log)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    prev_hash TEXT NOT NULL,
    log_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. DATA SOURCES (Ingestion Feeds and Agency Gateway Integrations)
CREATE TABLE IF NOT EXISTS public.data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    source_type evidence_source_category_type NOT NULL,
    jurisdiction TEXT NOT NULL,
    reliability_score REAL NOT NULL DEFAULT 1.0 CHECK (reliability_score >= 0 AND reliability_score <= 1.0),
    update_frequency TEXT NOT NULL DEFAULT 'Daily Batch',
    record_count BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SYNCING', 'MAINTENANCE', 'OFFLINE')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. PROCESSING JOBS (Ingestion pipeline)
CREATE TABLE IF NOT EXISTS public.processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    evidence_id UUID REFERENCES public.evidence(id) ON DELETE SET NULL,
    source_type evidence_source_category_type NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PARSING', 'EXTRACTING_ENTITIES', 'RESOLVING_ENTITIES', 'EXTRACTING_RELATIONSHIPS', 'UPDATING_GRAPH', 'COMPLETED', 'FAILED')),
    progress_percent INT NOT NULL DEFAULT 0,
    current_step_message TEXT,
    entities_extracted INT NOT NULL DEFAULT 0,
    relationships_extracted INT NOT NULL DEFAULT 0,
    events_created INT NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);


-- ==============================================================================
-- DATABASE INDEXES FOR OPTIMIZED INVESTIGATION QUERIES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_priority ON public.cases(priority);
CREATE INDEX IF NOT EXISTS idx_cases_assigned ON public.cases(assigned_investigator_id);

CREATE INDEX IF NOT EXISTS idx_entities_case_id ON public.entities(case_id);
CREATE INDEX IF NOT EXISTS idx_entities_type ON public.entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_entities_normalized_name ON public.entities(normalized_name);
CREATE INDEX IF NOT EXISTS idx_entities_merged ON public.entities(merged_into_id);

CREATE INDEX IF NOT EXISTS idx_identifiers_entity ON public.entity_identifiers(entity_id);
CREATE INDEX IF NOT EXISTS idx_identifiers_val ON public.entity_identifiers(normalized_value);
CREATE INDEX IF NOT EXISTS idx_identifiers_type ON public.entity_identifiers(identifier_type);

CREATE INDEX IF NOT EXISTS idx_rel_source ON public.relationships(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_rel_target ON public.relationships(target_entity_id);
CREATE INDEX IF NOT EXISTS idx_rel_case ON public.relationships(case_id);
CREATE INDEX IF NOT EXISTS idx_rel_type ON public.relationships(relationship_type);
CREATE INDEX IF NOT EXISTS idx_rel_time ON public.relationships(start_time);

CREATE INDEX IF NOT EXISTS idx_evidence_case ON public.evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON public.evidence(sha256_hash);

CREATE INDEX IF NOT EXISTS idx_events_case ON public.events(case_id);
CREATE INDEX IF NOT EXISTS idx_events_time ON public.events(event_time);

CREATE INDEX IF NOT EXISTS idx_alerts_case ON public.alerts(case_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON public.alerts(severity);

CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_case ON public.audit_logs(case_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS & POLICIES
-- ==============================================================================

-- Helper: Get role of currently authenticated user
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role_type AS $$
DECLARE
    v_role user_role_type;
BEGIN
    SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(v_role, 'VIEWER'::user_role_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check if user is an ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.get_current_user_role() = 'ADMIN'::user_role_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check case access permission
CREATE OR REPLACE FUNCTION public.has_case_access(p_case_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Admins have global access
    IF public.is_admin() THEN
        RETURN TRUE;
    END IF;

    -- Check if assigned investigator or creator
    IF EXISTS (
        SELECT 1 FROM public.cases
        WHERE id = p_case_id 
        AND (assigned_investigator_id = auth.uid() OR created_by = auth.uid())
    ) THEN
        RETURN TRUE;
    END IF;

    -- Check case membership
    IF EXISTS (
        SELECT 1 FROM public.case_members
        WHERE case_id = p_case_id AND user_id = auth.uid()
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "data_sources_select_policy" ON public.data_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "data_sources_admin_policy" ON public.data_sources FOR ALL TO authenticated USING (public.is_admin());

-- Profiles: Users can read their own or others in the system; Admins can edit
CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin());

-- Cases: Authorized users can view and assigned investigators/admins can update
CREATE POLICY "cases_select_policy" ON public.cases FOR SELECT TO authenticated USING (public.has_case_access(id) OR public.is_admin());
CREATE POLICY "cases_insert_policy" ON public.cases FOR INSERT TO authenticated WITH CHECK (
    public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR')
);
CREATE POLICY "cases_update_policy" ON public.cases FOR UPDATE TO authenticated USING (
    public.is_admin() OR (public.has_case_access(id) AND public.get_current_user_role() = 'INVESTIGATOR')
);

-- Evidence: Accessible only by case authorized members
CREATE POLICY "evidence_select_policy" ON public.evidence FOR SELECT TO authenticated USING (public.has_case_access(case_id) OR public.is_admin());
CREATE POLICY "evidence_insert_policy" ON public.evidence FOR INSERT TO authenticated WITH CHECK (
    public.has_case_access(case_id) AND public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR')
);

-- Entities & Relationships: Read access for authorized members, write for investigators/analysts
CREATE POLICY "entities_select_policy" ON public.entities FOR SELECT TO authenticated USING (case_id IS NULL OR public.has_case_access(case_id) OR public.is_admin());
CREATE POLICY "entities_write_policy" ON public.entities FOR ALL TO authenticated USING (
    public.is_admin() OR public.get_current_user_role() IN ('INVESTIGATOR', 'ANALYST')
);

CREATE POLICY "rel_select_policy" ON public.relationships FOR SELECT TO authenticated USING (case_id IS NULL OR public.has_case_access(case_id) OR public.is_admin());
CREATE POLICY "rel_write_policy" ON public.relationships FOR ALL TO authenticated USING (
    public.is_admin() OR public.get_current_user_role() IN ('INVESTIGATOR', 'ANALYST')
);

-- Audit logs: Read only by Admins and Investigators, Insert by system/authenticated
CREATE POLICY "audit_select_policy" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin() OR public.get_current_user_role() = 'INVESTIGATOR');
CREATE POLICY "audit_insert_policy" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);
-- STRICT RULE: Audit logs can NEVER be updated or deleted by normal users (Append-Only)
-- No UPDATE or DELETE policies are granted on public.audit_logs!

-- ==============================================================================
-- STORAGE BUCKETS SETUP NOTE:
-- Bucket: "investigation-evidence" (Private, secured by RLS policies)
-- Bucket: "investigation-reports" (Private, secured by RLS policies)
-- ==============================================================================
