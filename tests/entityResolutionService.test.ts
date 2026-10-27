import { describe, it, expect } from 'vitest';
import { EntityResolutionService } from '../services/entityResolutionService';
import { Entity } from '../types/investigation';

describe('Multi-Signal Entity Resolution Service', () => {
  it('should flag candidate match when entities share identical phone number and similar name', () => {
    const entityA: Entity = {
      id: 'ent-a',
      entityType: 'PERSON',
      name: 'Vikram Malhotra',
      normalizedName: 'VIKRAM MALHOTRA',
      confidence: 0.95,
      identifiers: [
        {
          id: 'id-1',
          entityId: 'ent-a',
          identifierType: 'PHONE_NUMBER',
          identifierValue: '+91 9876543210',
          normalizedValue: '9876543210',
          confidence: 1.0,
          createdAt: '2026-01-01',
        },
      ],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };

    const entityB: Entity = {
      id: 'ent-b',
      entityType: 'PERSON',
      name: 'V. Malhotra',
      normalizedName: 'V MALHOTRA',
      confidence: 0.90,
      identifiers: [
        {
          id: 'id-2',
          entityId: 'ent-b',
          identifierType: 'PHONE_NUMBER',
          identifierValue: '+91 9876543210',
          normalizedValue: '9876543210',
          confidence: 1.0,
          createdAt: '2026-01-02',
        },
      ],
      createdAt: '2026-01-02',
      updatedAt: '2026-01-02',
    };

    const comparison = EntityResolutionService.compareEntities(entityA, entityB);
    expect(comparison.isCandidate).toBe(true);
    expect(comparison.matchScore).toBeGreaterThanOrEqual(0.65);
    expect(comparison.signals.some(s => s.signal.includes('PHONE'))).toBe(true);
  });

  it('should reject merging different entity types', () => {
    const person: Entity = {
      id: 'ent-person',
      entityType: 'PERSON',
      name: 'Deepak Chawla',
      normalizedName: 'DEEPAK CHAWLA',
      confidence: 0.9,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };

    const vehicle: Entity = {
      id: 'ent-vehicle',
      entityType: 'VEHICLE',
      name: 'DL-01-AB-1234',
      normalizedName: 'DL01AB1234',
      confidence: 0.95,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };

    const comparison = EntityResolutionService.compareEntities(person, vehicle);
    expect(comparison.isCandidate).toBe(false);
    expect(comparison.matchScore).toBe(0);
  });

  it('should find candidates in entity collections', () => {
    const entities: Entity[] = [
      {
        id: 'e1',
        entityType: 'PERSON',
        name: 'Rajesh Shinde',
        normalizedName: 'RAJESH SHINDE',
        confidence: 0.9,
        identifiers: [
          { id: 'i1', entityId: 'e1', identifierType: 'PAN_CARD', identifierValue: 'ARQPS8821N', normalizedValue: 'ARQPS8821N', confidence: 1.0, createdAt: '' },
        ],
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'e2',
        entityType: 'PERSON',
        name: 'R. Shinde',
        normalizedName: 'R SHINDE',
        confidence: 0.85,
        identifiers: [
          { id: 'i2', entityId: 'e2', identifierType: 'PAN_CARD', identifierValue: 'ARQPS8821N', normalizedValue: 'ARQPS8821N', confidence: 1.0, createdAt: '' },
        ],
        createdAt: '',
        updatedAt: '',
      },
    ];

    const candidates = EntityResolutionService.findDuplicateCandidates(entities);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates[0].matchScore).toBeGreaterThanOrEqual(0.65);
  });
});
