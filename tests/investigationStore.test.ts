import { describe, it, expect } from 'vitest';
import { InvestigationStore } from '../services/investigationStore';

describe('Investigation Store Repository & Demonstration State', () => {
  it('should load at least 10 demo cases with valid metadata', () => {
    const cases = InvestigationStore.getCases();
    expect(cases.length).toBeGreaterThanOrEqual(10);
    expect(cases[0].caseNumber).toBeDefined();
    expect(cases[0].title).toBeDefined();
  });

  it('should load at least 50 forensic entities across multiple categories', () => {
    const entities = InvestigationStore.getEntities();
    expect(entities.length).toBeGreaterThanOrEqual(50);

    const types = new Set(entities.map(e => e.entityType));
    expect(types.has('PERSON')).toBe(true);
    expect(types.has('PHONE')).toBe(true);
    expect(types.has('VEHICLE')).toBe(true);
    expect(types.has('ACCOUNT')).toBe(true);
    expect(types.has('LOCATION')).toBe(true);
    expect(types.has('ORGANIZATION')).toBe(true);
  });

  it('should load at least 100 relational edges with provenance', () => {
    const relationships = InvestigationStore.getRelationships();
    expect(relationships.length).toBeGreaterThanOrEqual(100);
    expect(relationships[0].provenance).toBeDefined();
    expect(relationships[0].confidence).toBeGreaterThan(0.7);
  });

  it('should load at least 100 temporal timeline events', () => {
    const events = InvestigationStore.getEvents();
    expect(events.length).toBeGreaterThanOrEqual(100);
    expect(events[0].eventTime).toBeDefined();
    expect(events[0].title).toBeDefined();
  });

  it('should load at least 30 evidence records with SHA-256 block hashes', () => {
    const evidence = InvestigationStore.getEvidence();
    expect(evidence.length).toBeGreaterThanOrEqual(30);
    expect(evidence[0].sha256Hash).toBeDefined();
    expect(evidence[0].integrityStatus).toBe('VERIFIED');
  });

  it('should load at least 20 financial transactions', () => {
    const txns = InvestigationStore.getTransactions();
    expect(txns.length).toBeGreaterThanOrEqual(20);
    expect(txns[0].amount).toBeGreaterThan(0);
    expect(txns[0].referenceNo).toBeDefined();
  });

  it('should load at least 10 reviewable pattern alerts', () => {
    const alerts = InvestigationStore.getAlerts();
    expect(alerts.length).toBeGreaterThanOrEqual(10);
    expect(alerts[0].explainability).toBeDefined();
  });

  it('should surface cross-case linkages for key subjects', () => {
    const entities = InvestigationStore.getEntities();
    const vikram = entities.find(e => e.name === 'Vikram Malhotra');
    expect(vikram).toBeDefined();
    expect(vikram?.connectedCases).toBeDefined();
    expect(vikram?.connectedCases?.length).toBeGreaterThanOrEqual(2);
  });

  it('should create an investigation case and register an audit log', () => {
    const created = InvestigationStore.createCase({
      title: 'Automated Test Docket',
      category: 'Unit Testing',
      priority: 'MEDIUM',
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe('Automated Test Docket');

    const auditLogs = InvestigationStore.getAuditLogs();
    const log = auditLogs.find(a => a.resourceId === created.id);
    expect(log).toBeDefined();
    expect(log?.action).toBe('CASE_CREATED');
  });
});
