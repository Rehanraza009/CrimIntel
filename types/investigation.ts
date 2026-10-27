/**
 * CrimIntel - AI-Powered Criminal Network Analysis System
 * TypeScript Core Types & Domain Models
 * Problem Statement ID: SIH26189 - Ministry of Home Affairs (MHA) - NCRB
 */

export type UserRole = 'ADMIN' | 'INVESTIGATOR' | 'ANALYST' | 'VIEWER';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  badgeNumber: string;
  department: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type CaseStatus = 'OPEN' | 'UNDER_REVIEW' | 'ACTIVE_ANALYSIS' | 'ON_HOLD' | 'CLOSED';
export type CasePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  category: string;
  status: CaseStatus;
  priority: CasePriority;
  location: string;
  jurisdiction: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  assignedInvestigatorId?: string;
  assignedInvestigatorName?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  entityCount?: number;
  evidenceCount?: number;
  relationshipCount?: number;
  alertCount?: number;
}

export type EntityType = 
  | 'PERSON'
  | 'PHONE'
  | 'EMAIL'
  | 'ACCOUNT'
  | 'VEHICLE'
  | 'LOCATION'
  | 'ORGANIZATION'
  | 'CASE'
  | 'EVENT'
  | 'DATE'
  | 'TRANSACTION';

export interface EntityIdentifier {
  id: string;
  entityId: string;
  identifierType: 'PHONE_NUMBER' | 'EMAIL_ADDR' | 'BANK_ACC' | 'PAN_CARD' | 'AADHAAR_HASH' | 'PASSPORT_NO' | 'VEHICLE_PLATE' | 'IMEI' | 'IP_ADDR' | 'NAME_ALIAS' | 'OTHER';
  identifierValue: string;
  normalizedValue: string;
  sourceEvidenceId?: string;
  confidence: number;
  createdAt: string;
}

export interface Entity {
  id: string;
  caseId?: string | null; // null if cross-case or global
  caseNumber?: string;
  caseTitle?: string;
  entityType: EntityType;
  name: string;
  normalizedName: string;
  description?: string;
  category?: string;
  confidence: number;
  riskIndicator?: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEUTRAL';
  metadata?: Record<string, any>;
  mergedIntoId?: string | null;
  identifiers?: EntityIdentifier[];
  connectedCases?: string[];
  createdAt: string;
  updatedAt: string;
  degreeCentrality?: number;
}

export interface EntityMatchCandidate {
  id: string;
  sourceEntityId: string;
  candidateEntityId: string;
  sourceEntity: Entity;
  candidateEntity: Entity;
  matchScore: number; // e.g. 0.87 (87%)
  matchingSignals: {
    signal: string;
    description: string;
    score: number;
  }[];
  status: 'PENDING' | 'MERGED' | 'REJECTED' | 'REVIEW_LATER';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export type RelationshipType = 
  | 'CALLED'
  | 'TRANSFERRED'
  | 'OWNED'
  | 'LOCATED_AT'
  | 'ASSOCIATED_WITH'
  | 'WORKS_FOR'
  | 'VISITED'
  | 'COMMUNICATED_WITH'
  | 'PART_OF_CASE'
  | 'RELATED_TO'
  | 'INVOLVED_IN'
  | 'TRANSACTED_WITH';

export interface RelationshipProvenance {
  evidenceId: string;
  evidenceFileName: string;
  recordIndex?: number;
  pageNumber?: number;
  timestamp?: string;
  rawExcerpt?: string;
  method: 'MANUAL_ENTRY' | 'AUTOMATED_EXTRACTION' | 'AI_ASSISTED' | 'DETERMINISTIC_RULES';
}

export interface Relationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  sourceEntityName?: string;
  sourceEntityType?: EntityType;
  targetEntityName?: string;
  targetEntityType?: EntityType;
  relationshipType: RelationshipType;
  confidence: number;
  startTime?: string;
  endTime?: string;
  caseId?: string;
  sourceEvidenceId?: string;
  provenance?: RelationshipProvenance;
  metadata?: Record<string, any>;
  createdAt: string;
}

export type EvidenceSourceType =
  | 'FIR_REPORT'
  | 'CDR'
  | 'BANK_TRANSACTIONS'
  | 'VEHICLE_RECORDS'
  | 'CRIMINAL_HISTORY'
  | 'FIELD_SURVEILLANCE'
  | 'DIGITAL_FORENSICS'
  | 'OTHER';

export type IntegrityStatus = 'VERIFIED' | 'COMPROMISED' | 'PENDING';

export interface EvidenceRecord {
  id: string;
  caseId: string;
  caseNumber?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  sourceType: EvidenceSourceType;
  sha256Hash: string;
  previousHash: string;
  integrityStatus: IntegrityStatus;
  blockIndex: number;
  uploadedBy: string;
  uploadedByName?: string;
  metadata?: Record<string, any>;
  extractedEntitiesCount?: number;
  extractedRelationshipsCount?: number;
  createdAt: string;
}

export interface TemporalEvent {
  id: string;
  caseId: string;
  eventType: string;
  eventTime: string;
  title: string;
  description: string;
  location?: string;
  sourceEvidenceId?: string;
  evidenceFileName?: string;
  relatedEntityIds?: string[];
  relatedEntities?: { id: string; name: string; entityType: EntityType }[];
  createdAt: string;
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertType = 
  | 'HIGH_PRIORITY'
  | 'REVIEW_REQUIRED'
  | 'UNUSUAL_PATTERN'
  | 'CROSS_CASE_LINK'
  | 'ENTITY_MATCH'
  | 'DATA_QUALITY';

export type AlertStatus = 'NEW' | 'UNDER_REVIEW' | 'INVESTIGATED' | 'DISMISSED';

export interface InvestigationAlert {
  id: string;
  caseId?: string;
  caseNumber?: string;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  confidence: number;
  status: AlertStatus;
  relatedEntities: { id: string; name: string; entityType: EntityType }[];
  relatedCases: { id: string; caseNumber: string; title: string }[];
  supportingEvidenceId?: string;
  supportingEvidenceName?: string;
  explainability: {
    ruleOrModel: string;
    rationale: string;
    signals: string[];
    isAiDerived: boolean;
  };
  createdAt: string;
}

export interface InvestigationReport {
  id: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  title: string;
  executiveSummary: string;
  keyEntities: { id: string; name: string; type: EntityType; roleNote: string }[];
  criticalRelationships: { source: string; target: string; type: string; evidenceRef: string }[];
  crossCaseConnections: { otherCaseNumber: string; sharedEntity: string; details: string }[];
  timelineSummary: { time: string; event: string }[];
  investigativeLeads: string[];
  evidenceIntegritySummary: { totalRecords: number; verifiedChain: boolean; hashTip: string };
  analyticalNotes: string;
  disclaimer: string;
  generatedBy: string;
  generatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  caseId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  prevHash: string;
  logHash: string;
  createdAt: string;
}

export interface IngestionJob {
  id: string;
  caseId: string;
  sourceType: EvidenceSourceType;
  fileName: string;
  fileSize: number;
  status: 'PENDING' | 'PARSING' | 'EXTRACTING_ENTITIES' | 'RESOLVING_ENTITIES' | 'EXTRACTING_RELATIONSHIPS' | 'UPDATING_GRAPH' | 'COMPLETED' | 'FAILED';
  progressPercent: number;
  currentStepMessage: string;
  entitiesExtracted: number;
  relationshipsExtracted: number;
  eventsCreated: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DataSource {
  id: string;
  name: string;
  sourceType: EvidenceSourceType;
  jurisdiction: string;
  reliabilityScore: number;
  updateFrequency: string;
  recordCount: number;
  status: 'ACTIVE' | 'SYNCING' | 'MAINTENANCE' | 'OFFLINE';
  lastSyncAt: string;
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  caseId: string;
  caseNumber?: string;
  senderEntityId?: string;
  senderName: string;
  senderAccount: string;
  receiverEntityId?: string;
  receiverName: string;
  receiverAccount: string;
  amount: number;
  currency: string;
  transactionType: 'IMPS' | 'NEFT' | 'RTGS' | 'UPI' | 'ATM_CASH_WITHDRAWAL' | 'HAWALA_TRANSFER';
  channel: string;
  transactionTime: string;
  sourceEvidenceId?: string;
  referenceNo: string;
  status: 'SUCCESS' | 'FLAGGED' | 'BLOCKED';
}

