/**
 * CrimIntel - Multi-Signal Entity Resolution & Deduplication Engine
 * Problem Statement ID: SIH26189 - Ministry of Home Affairs - NCRB
 */

import { Entity, EntityMatchCandidate } from '@/types/investigation';

export class EntityResolutionService {
  /**
   * Compare two entities and compute multi-signal resolution score
   */
  public static compareEntities(entityA: Entity, entityB: Entity): {
    matchScore: number;
    signals: { signal: string; description: string; score: number }[];
    isCandidate: boolean;
  } {
    // Cannot merge different entity types (e.g. Person vs Vehicle)
    if (entityA.entityType !== entityB.entityType) {
      return { matchScore: 0, signals: [], isCandidate: false };
    }

    const signals: { signal: string; description: string; score: number }[] = [];
    let totalScore = 0;

    // Signal 1: Name Similarity (Levenshtein & Token Overlap)
    const nameScore = computeNameSimilarity(entityA.name, entityB.name);
    if (nameScore > 0.6) {
      const weightedScore = nameScore * 0.35;
      totalScore += weightedScore;
      signals.push({
        signal: 'Name Similarity',
        description: `Name "${entityA.name}" matches "${entityB.name}" with ${(nameScore * 100).toFixed(0)}% phonetic/token similarity`,
        score: weightedScore,
      });
    }

    // Signal 2: Shared Identifiers (Phone, Email, Account, Plate, PAN)
    const idA = entityA.identifiers || [];
    const idB = entityB.identifiers || [];

    for (const itemA of idA) {
      for (const itemB of idB) {
        if (itemA.identifierType === itemB.identifierType) {
          const valA = itemA.normalizedValue.toLowerCase();
          const valB = itemB.normalizedValue.toLowerCase();

          if (valA === valB) {
            let weight = 0.45;
            if (itemA.identifierType === 'PHONE_NUMBER') weight = 0.50;
            if (itemA.identifierType === 'BANK_ACC') weight = 0.48;
            if (itemA.identifierType === 'PAN_CARD' || itemA.identifierType === 'AADHAAR_HASH') weight = 0.60;

            totalScore += weight;
            signals.push({
              signal: `Shared ${itemA.identifierType.replace('_', ' ')}`,
              description: `Identical identifier match: ${itemA.identifierValue}`,
              score: weight,
            });
          }
        }
      }
    }

    // Signal 3: Geographic / Location Overlap
    const locA = entityA.metadata?.location || entityA.metadata?.address || '';
    const locB = entityB.metadata?.location || entityB.metadata?.address || '';
    if (locA && locB && (locA.toLowerCase().includes(locB.toLowerCase()) || locB.toLowerCase().includes(locA.toLowerCase()))) {
      const weight = 0.15;
      totalScore += weight;
      signals.push({
        signal: 'Location Proximity',
        description: `Both entities linked to region: "${locA}"`,
        score: weight,
      });
    }

    // Signal 4: Organization or Employer Overlap
    const orgA = entityA.metadata?.organization || '';
    const orgB = entityB.metadata?.organization || '';
    if (orgA && orgB && orgA.toLowerCase() === orgB.toLowerCase()) {
      const weight = 0.15;
      totalScore += weight;
      signals.push({
        signal: 'Affiliation Overlap',
        description: `Common organization: "${orgA}"`,
        score: weight,
      });
    }

    // Cap total score at 1.0 (100%)
    const normalizedScore = Math.min(1.0, Math.round(totalScore * 100) / 100);

    // Flag as candidate if confidence is above threshold (>= 65%)
    const isCandidate = normalizedScore >= 0.65;

    return {
      matchScore: normalizedScore,
      signals,
      isCandidate,
    };
  }

  /**
   * Scan an array of entities and detect all candidate duplicates across the system or case
   * Optimized with entityType partitioning to eliminate cross-type comparisons (O(K * (N/K)^2))
   */
  public static findDuplicateCandidates(entities: Entity[]): EntityMatchCandidate[] {
    const candidates: EntityMatchCandidate[] = [];

    // Bucket unmerged entities by entityType
    const byType = new Map<string, Entity[]>();
    for (const ent of entities) {
      if (ent.mergedIntoId) continue;
      const group = byType.get(ent.entityType);
      if (group) group.push(ent);
      else byType.set(ent.entityType, [ent]);
    }

    // Only compare entities within the same entityType
    for (const [, group] of byType) {
      const len = group.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const entA = group[i];
          const entB = group[j];
          if (entA.id === entB.id) continue;

          const comparison = this.compareEntities(entA, entB);
          if (comparison.isCandidate) {
            candidates.push({
              id: `match-${entA.id.slice(0, 8)}-${entB.id.slice(0, 8)}`,
              sourceEntityId: entA.id,
              candidateEntityId: entB.id,
              sourceEntity: entA,
              candidateEntity: entB,
              matchScore: comparison.matchScore,
              matchingSignals: comparison.signals,
              status: 'PENDING',
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    return candidates.sort((a, b) => b.matchScore - a.matchScore);
  }
}

/**
 * Calculates string similarity considering initials, prefixes, and token reordering
 * E.g. "Rahul Kumar" vs "R. Kumar" vs "Rahul K." vs "Rahul Kumar Singh"
 */
function computeNameSimilarity(nameA: string, nameB: string): number {
  const cleanA = nameA.toLowerCase().trim().replace(/^(shri|mr|mrs|dr)\.?\s+/i, '');
  const cleanB = nameB.toLowerCase().trim().replace(/^(shri|mr|mrs|dr)\.?\s+/i, '');

  if (cleanA === cleanB) return 1.0;

  const tokensA = cleanA.split(/\s+/);
  const tokensB = cleanB.split(/\s+/);

  // Check initial match: e.g. "R. Kumar" vs "Rahul Kumar"
  if (tokensA.length >= 2 && tokensB.length >= 2) {
    const lastNameA = tokensA[tokensA.length - 1];
    const lastNameB = tokensB[tokensB.length - 1];

    if (lastNameA === lastNameB) {
      const firstA = tokensA[0].replace('.', '');
      const firstB = tokensB[0].replace('.', '');

      if (firstA === firstB) return 0.95;
      if (firstA[0] === firstB[0] && (firstA.length === 1 || firstB.length === 1)) {
        return 0.85; // Initial matches full first name
      }
      if (tokensA.includes(tokensB[0]) || tokensB.includes(tokensA[0])) {
        return 0.80; // "Rahul Kumar Singh" vs "Rahul Kumar"
      }
    }
  }

  // Token set overlap (Jaccard similarity)
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection++;
  }
  const union = new Set([...tokensA, ...tokensB]).size;
  const jaccard = union > 0 ? intersection / union : 0;

  // Levenshtein distance similarity
  const levDist = levenshteinDistance(cleanA, cleanB);
  const maxLen = Math.max(cleanA.length, cleanB.length);
  const levScore = maxLen > 0 ? (maxLen - levDist) / maxLen : 0;

  return Math.max(jaccard, levScore);
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
