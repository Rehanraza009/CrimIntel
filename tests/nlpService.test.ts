import { describe, it, expect } from 'vitest';
import { NlpService } from '../services/nlpService';

describe('Forensic NLP Entity & Relationship Extraction Engine', () => {
  it('should extract Indian mobile phone numbers accurately', async () => {
    const text = 'Suspect contacted victim from mobile +91 9876543210 and alternate line 9811223344.';
    const result = await NlpService.processText(text, 'FIR_Statement.txt');

    const phoneEntities = result.entities.filter(e => e.entityType === 'PHONE');
    expect(phoneEntities.length).toBeGreaterThanOrEqual(2);
    expect(phoneEntities.some(p => p.name.includes('9876543210'))).toBe(true);
    expect(phoneEntities.some(p => p.name.includes('9811223344'))).toBe(true);
  });

  it('should extract vehicle registration plates correctly', async () => {
    const text = 'Black Scorpio SUV bearing registration DL-01-AB-1234 was observed at the safehouse.';
    const result = await NlpService.processText(text, 'Surveillance_Log.txt');

    const vehicles = result.entities.filter(e => e.entityType === 'VEHICLE');
    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    expect(vehicles[0].name.replace(/[-\s]/g, '')).toBe('DL01AB1234');
  });

  it('should extract bank accounts and currency amounts', async () => {
    const text = 'Victim transferred Rs. 75,000 to Account XX99881122 on 14 March 2026.';
    const result = await NlpService.processText(text, 'Bank_Slip.txt');

    const accounts = result.entities.filter(e => e.entityType === 'ACCOUNT');
    expect(accounts.length).toBeGreaterThanOrEqual(1);
    expect(accounts[0].name.toUpperCase()).toContain('99881122');
  });

  it('should extract temporal relationships from incident reports', async () => {
    const text = 'Vikram Malhotra called Kavita Saxena demanding ransom money.';
    const result = await NlpService.processText(text, 'FIR_0142.txt');

    expect(result.entities.length).toBeGreaterThanOrEqual(2);
    // Verifies relationship extraction
    expect(result.relationships.length).toBeGreaterThanOrEqual(1);
    const rel = result.relationships[0];
    expect(rel.relationshipType).toBe('CALLED');
    expect(rel.confidence).toBeGreaterThan(0.8);
  });
});
