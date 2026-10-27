import { describe, it, expect } from 'vitest';
import { computeSha256, verifyEvidenceChain, verifyAuditChain } from '../lib/crypto';

describe('Tamper-Evident Cryptographic Utilities', () => {
  it('should compute valid 64-character hexadecimal SHA-256 hash', async () => {
    const hash = await computeSha256('CrimIntel_SIH26189_Forensic_Evidence');
    expect(hash).toBeDefined();
    expect(hash.length).toBe(64);
    expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
  });

  it('should compute deterministic hashes for identical inputs', async () => {
    const input = 'Suspect: Vikram Malhotra | Case: CASE-2026-001';
    const hash1 = await computeSha256(input);
    const hash2 = await computeSha256(input);
    expect(hash1).toBe(hash2);
  });

  it('should verify an intact sequential evidence block chain', () => {
    const intactChain = [
      {
        blockIndex: 1,
        sha256Hash: 'hash-block-1-abcdef0123456789',
        previousHash: '00000000000000000000000000000000',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        blockIndex: 2,
        sha256Hash: 'hash-block-2-abcdef0123456789',
        previousHash: 'hash-block-1-abcdef0123456789',
        createdAt: '2026-01-02T00:00:00Z',
      },
      {
        blockIndex: 3,
        sha256Hash: 'hash-block-3-abcdef0123456789',
        previousHash: 'hash-block-2-abcdef0123456789',
        createdAt: '2026-01-03T00:00:00Z',
      },
    ];

    const result = verifyEvidenceChain(intactChain);
    expect(result.isValid).toBe(true);
    expect(result.brokenBlockIndex).toBeUndefined();
  });

  it('should detect a tampered or broken link in the evidence chain', () => {
    const tamperedChain = [
      {
        blockIndex: 1,
        sha256Hash: 'hash-block-1-abcdef0123456789',
        previousHash: '00000000000000000000000000000000',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        blockIndex: 2,
        sha256Hash: 'hash-block-2-TAMPERED-xyz',
        previousHash: 'tampered-previous-does-not-match-block-1',
        createdAt: '2026-01-02T00:00:00Z',
      },
    ];

    const result = verifyEvidenceChain(tamperedChain);
    expect(result.isValid).toBe(false);
    expect(result.brokenBlockIndex).toBe(2);
    expect(result.error).toContain('Integrity broken at Block #2');
  });

  it('should verify unbroken audit log ledger sequence', () => {
    const auditLogs = [
      {
        id: 'aud-002',
        logHash: 'hash-audit-002',
        prevHash: 'hash-audit-001',
        createdAt: '2026-02-02T00:00:00Z',
      },
      {
        id: 'aud-001',
        logHash: 'hash-audit-001',
        prevHash: '00000000000000000000000000000000',
        createdAt: '2026-02-01T00:00:00Z',
      },
    ];

    const result = verifyAuditChain(auditLogs);
    expect(result.isValid).toBe(true);
  });
});
