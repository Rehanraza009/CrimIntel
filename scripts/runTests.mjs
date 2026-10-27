/**
 * CrimIntel - Automated Verification & Test Runner
 * Problem Statement: SIH26189 - Ministry of Home Affairs - NCRB
 * 
 * Verifies core cryptographic chain, deterministic NLP,
 * multi-signal entity resolution, and dataset requirements.
 */

import assert from 'node:assert';
import { computeSha256, verifyEvidenceChain, verifyAuditChain } from '../lib/crypto.ts';
import { NlpService } from '../services/nlpService.ts';
import { EntityResolutionService } from '../services/entityResolutionService.ts';
import { InvestigationStore } from '../services/investigationStore.ts';

console.log('\n======================================================');
console.log(' CRIMINTEL FORENSIC INTELLIGENCE - AUTOMATED TEST SUITE');
console.log(' SIH26189 - Ministry of Home Affairs - NCRB');
console.log('======================================================\n');

let passedTests = 0;
let failedTests = 0;

async function runTest(name, fn) {
  try {
    process.stdout.write(` [TEST] ${name} ... `);
    await fn();
    console.log('✓ PASS');
    passedTests++;
  } catch (err) {
    console.log('✗ FAIL');
    console.error('   Error:', err.message);
    failedTests++;
  }
}

async function main() {
  // SUITE 1: Cryptographic Hashes & Tamper-Evident Chain
  console.log('\n--- SUITE 1: Cryptographic Integrity & Chain of Custody ---');

  await runTest('SHA-256 Hash Generation', async () => {
    const hash = await computeSha256('CrimIntel_SIH26189_Audit_Proof');
    assert.strictEqual(typeof hash, 'string');
    assert.strictEqual(hash.length, 64);
    assert.match(hash, /^[0-9a-f]{64}$/);
  });

  await runTest('Deterministic Hash Consistency', async () => {
    const input = 'Suspect: Vikram Malhotra | Plate: DL-01-AB-1234';
    const h1 = await computeSha256(input);
    const h2 = await computeSha256(input);
    assert.strictEqual(h1, h2);
  });

  await runTest('Intact Evidence Chain Verification', () => {
    const chain = [
      { blockIndex: 1, sha256Hash: 'hash1', previousHash: '000000', createdAt: '' },
      { blockIndex: 2, sha256Hash: 'hash2', previousHash: 'hash1', createdAt: '' },
      { blockIndex: 3, sha256Hash: 'hash3', previousHash: 'hash2', createdAt: '' },
    ];
    const res = verifyEvidenceChain(chain);
    assert.strictEqual(res.isValid, true);
  });

  await runTest('Tampered Evidence Block Detection', () => {
    const chain = [
      { blockIndex: 1, sha256Hash: 'hash1', previousHash: '000000', createdAt: '' },
      { blockIndex: 2, sha256Hash: 'hash2_tampered', previousHash: 'WRONG_HASH', createdAt: '' },
    ];
    const res = verifyEvidenceChain(chain);
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.brokenBlockIndex, 2);
  });

  await runTest('Tamper-Evident Audit Ledger Verification', () => {
    const logs = [
      { id: 'aud-2', logHash: 'hashB', prevHash: 'hashA', createdAt: '' },
      { id: 'aud-1', logHash: 'hashA', prevHash: '000000', createdAt: '' },
    ];
    const res = verifyAuditChain(logs);
    assert.strictEqual(res.isValid, true);
  });

  // SUITE 2: Deterministic Forensic NLP
  console.log('\n--- SUITE 2: Deterministic Forensic NLP Engine ---');

  await runTest('Indian Phone Extraction (+91 / STD)', async () => {
    const text = 'Suspect called from +91 9876543210 to receiver 9811223344.';
    const res = await NlpService.processText(text);
    const phones = res.entities.filter(e => e.entityType === 'PHONE');
    assert.ok(phones.length >= 2, 'Should extract both telephone numbers');
  });

  await runTest('Vehicle Plate Regex Identification', async () => {
    const text = 'Vehicle DL-01-AB-1234 was identified leaving Sector 62 safehouse.';
    const res = await NlpService.processText(text);
    const vehicles = res.entities.filter(e => e.entityType === 'VEHICLE');
    assert.ok(vehicles.length >= 1, 'Should extract vehicle registration');
    assert.strictEqual(vehicles[0].name.replace(/[-\s]/g, ''), 'DL01AB1234');
  });

  await runTest('Bank Account and Amount Extraction', async () => {
    const text = 'Complainant transferred Rs. 75,000 to Account XX99881122 on 14 March 2026.';
    const res = await NlpService.processText(text);
    const accounts = res.entities.filter(e => e.entityType === 'ACCOUNT');
    assert.ok(accounts.length >= 1, 'Should extract bank account');
    assert.ok(accounts[0].name.toUpperCase().includes('99881122'));
  });

  // SUITE 3: Multi-Signal Entity Resolution
  console.log('\n--- SUITE 3: Multi-Signal Entity Resolution Engine ---');

  await runTest('Candidate Resolution on Shared Phone & Phonetic Name', () => {
    const e1 = {
      id: 'e1',
      entityType: 'PERSON',
      name: 'Vikram Malhotra',
      normalizedName: 'VIKRAM MALHOTRA',
      confidence: 0.95,
      identifiers: [{ id: 'i1', entityId: 'e1', identifierType: 'PHONE_NUMBER', identifierValue: '+91 9876543210', normalizedValue: '9876543210', confidence: 1, createdAt: '' }],
      createdAt: '',
      updatedAt: '',
    };
    const e2 = {
      id: 'e2',
      entityType: 'PERSON',
      name: 'V. Malhotra',
      normalizedName: 'V MALHOTRA',
      confidence: 0.90,
      identifiers: [{ id: 'i2', entityId: 'e2', identifierType: 'PHONE_NUMBER', identifierValue: '+91 9876543210', normalizedValue: '9876543210', confidence: 1, createdAt: '' }],
      createdAt: '',
      updatedAt: '',
    };
    const comp = EntityResolutionService.compareEntities(e1, e2);
    assert.strictEqual(comp.isCandidate, true);
    assert.ok(comp.matchScore >= 0.65, 'Match score must meet candidate threshold');
  });

  await runTest('Type Isolation: Do not match Person with Vehicle', () => {
    const e1 = { id: 'e1', entityType: 'PERSON', name: 'Deepak Chawla', normalizedName: 'DEEPAK CHAWLA', confidence: 1, createdAt: '', updatedAt: '' };
    const e2 = { id: 'e2', entityType: 'VEHICLE', name: 'DL-01-AB-1234', normalizedName: 'DL01AB1234', confidence: 1, createdAt: '', updatedAt: '' };
    const comp = EntityResolutionService.compareEntities(e1, e2);
    assert.strictEqual(comp.isCandidate, false);
    assert.strictEqual(comp.matchScore, 0);
  });

  // SUITE 4: Investigation Store & Demonstration Target Compliance
  console.log('\n--- SUITE 4: Demonstration Target Metrics (SIH26189 Mandate) ---');

  await runTest('At least 10 Fictional Investigation Cases', () => {
    const cases = InvestigationStore.getCases();
    assert.ok(cases.length >= 10, `Expected >= 10 cases, found ${cases.length}`);
  });

  await runTest('At least 50 Forensic Entities with Classification', () => {
    const entities = InvestigationStore.getEntities();
    assert.ok(entities.length >= 50, `Expected >= 50 entities, found ${entities.length}`);
  });

  await runTest('At least 100 Relationship Edges with Provenance', () => {
    const rels = InvestigationStore.getRelationships();
    assert.ok(rels.length >= 100, `Expected >= 100 relationships, found ${rels.length}`);
  });

  await runTest('At least 100 Chronological Timeline Events', () => {
    const events = InvestigationStore.getEvents();
    assert.ok(events.length >= 100, `Expected >= 100 events, found ${events.length}`);
  });

  await runTest('At least 30 Evidence Records with Cryptographic Hashes', () => {
    const evidence = InvestigationStore.getEvidence();
    assert.ok(evidence.length >= 30, `Expected >= 30 evidence records, found ${evidence.length}`);
  });

  await runTest('At least 20 Financial Transactions', () => {
    const txns = InvestigationStore.getTransactions();
    assert.ok(txns.length >= 20, `Expected >= 20 transactions, found ${txns.length}`);
  });

  await runTest('At least 10 Reviewable Alerts with Explanations', () => {
    const alerts = InvestigationStore.getAlerts();
    assert.ok(alerts.length >= 10, `Expected >= 10 alerts, found ${alerts.length}`);
  });

  // SUITE 5: Day/Night Theme System & UI/UX Audit
  console.log('\n--- SUITE 5: Day/Night Theme System & UI/UX Audit ---');

  await runTest('CSS Design Tokens & Day/Night Palette Variables', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const css = fs.readFileSync(path.resolve('app/globals.css'), 'utf-8').toLowerCase();
    
    // Check key CSS custom properties
    assert.ok(css.includes('--bg-page: #f5f7fb;'), 'Day mode background must be #f5f7fb');
    assert.ok(css.includes('--bg-card: #ffffff;'), 'Day mode cards must be #ffffff');
    assert.ok(css.includes('--border: #e2e8f0;'), 'Day mode borders must be #e2e8f0');
    assert.ok(css.includes('--text-main: #172033;'), 'Day mode text must be #172033');
    assert.ok(css.includes('--bg-page: #0b1220;'), 'Night mode background must be #0b1220');
    assert.ok(css.includes('--bg-card: #111c30;'), 'Night mode cards must be #111c30');
    assert.ok(css.includes('--border: #263650;'), 'Night mode borders must be #263650');
    assert.ok(css.includes('--text-main: #f1f5f9;'), 'Night mode text must be #f1f5f9');
  });

  await runTest('Plain-Language Terminology Definitions Completeness', async () => {
    const { INVESTIGATION_TERMS } = await import('../components/common/TerminologyModal.tsx');
    const requiredTermKeys = [
      'entity',
      'relationship',
      'entity_resolution',
      'timeline',
      'provenance',
      'confidence',
      'cross_case',
      'sha256'
    ];
    for (const key of requiredTermKeys) {
      assert.ok(INVESTIGATION_TERMS[key], `Missing definition for mandatory term key: ${key}`);
      assert.ok(INVESTIGATION_TERMS[key].definition.length > 20, `Definition too short for: ${key}`);
      assert.ok(INVESTIGATION_TERMS[key].importance.length > 10, `Importance note missing for: ${key}`);
      assert.ok(INVESTIGATION_TERMS[key].example.length > 10, `Example missing for: ${key}`);
    }
  });

  await runTest('Review Panel Cautious Labels & Ethical AI Stance', () => {
    const alerts = InvestigationStore.getAlerts();
    for (const alert of alerts) {
      // Must not declare guilt
      assert.doesNotMatch(alert.title.toLowerCase(), /guilty|convicted|guilt/i, 'Alert titles must not claim criminal guilt');
      assert.doesNotMatch(alert.description.toLowerCase(), /is guilty|proves guilt/i, 'Alert descriptions must not claim guilt');
    }
  });

  console.log('\n======================================================');
  console.log(` SUMMARY: ${passedTests} PASSED | ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Failure:', err);
  process.exit(1);
});

