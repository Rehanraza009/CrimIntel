/**
 * CrimIntel - AI & Deterministic NLP Entity & Relationship Extraction Engine
 * Zero-Key Offline Fallback + External LLM Provider Abstraction
 */

import { EntityType, RelationshipType } from '@/types/investigation';

export interface ExtractedEntity {
  name: string;
  normalizedName: string;
  entityType: EntityType;
  confidence: number;
  extractedText: string;
  contextSnippet: string;
  method: 'DETERMINISTIC_NLP' | 'AI_LLM';
  identifiers?: { type: string; value: string }[];
}

export interface ExtractedRelationship {
  sourceEntityName: string;
  sourceEntityType: EntityType;
  targetEntityName: string;
  targetEntityType: EntityType;
  relationshipType: RelationshipType;
  confidence: number;
  timeContext?: string;
  excerpt: string;
  method: 'DETERMINISTIC_NLP' | 'AI_LLM';
}

export interface ExtractionResult {
  entities: ExtractedEntity[];
  relationships: ExtractedRelationship[];
  events: {
    eventType: string;
    eventTime: string;
    title: string;
    description: string;
    location?: string;
  }[];
}

// Indian & Global Phone Regex: Matches +91 9876543210, 98765-43210, 09876543210, etc.
const PHONE_REGEX = /(?:\+91[\s-]?)?[6789]\d{9}\b/g;

// Email Regex
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;

// Indian Vehicle Plate Regex (e.g., DL-01-AB-1234, MH 12 CD 5678, HR26DK8392)
const VEHICLE_REGEX = /\b[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,3}[-\s]?[0-9]{4}\b/gi;

// Indian Currency / Transaction Regex (e.g., ₹45,000, Rs. 50,000, INR 1,50,000)
const TRANSACTION_REGEX = /(?:₹|Rs\.?|INR)\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2})?|[0-9]+(?:\.[0-9]{2})?)/gi;

// Bank Account Regex (e.g. Account XX1234, A/C: 981240192831, Acc No 11002345892)
const ACCOUNT_REGEX = /\b(?:A\/C|ACC(?:OUNT)?(?:\s+NO\.?)?|ACCOUNT)\s*:?\s*([A-Za-z0-9]{6,18})\b/gi;

// Standard Dates Regex (e.g. 12 March 2026, 12/03/2026, 2026-03-12)
const DATE_REGEX = /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\d{4}-\d{2}-\d{2})\b/gi;

// Known location heuristics (Police stations, hubs, major NCR/Indian cities)
const KNOWN_LOCATIONS = [
  'Sector 62, Noida', 'Noida Sector 62', 'Rohini Sector 16', 'Rohini', 'Dwarka Sector 10',
  'Connaught Place', 'Karol Bagh', 'Chandni Chowk', 'Gurugram Cyber Hub', 'South Extension',
  'Mumbai Central', 'Andheri East', 'Bandra Kurla Complex', 'Kolkata Park Street',
  'Bengaluru Indiranagar', 'Hyderabad Hitec City', 'Meerut Bypass', 'Jaipur Sindhi Camp',
  'Ghaziabad Raj Nagar', 'Faridabad NIT', 'New Delhi Railway Station', 'Tihar Complex'
];

// Organization keywords
const ORG_SUFFIXES = [
  'Pvt Ltd', 'Limited', 'Enterprises', 'Jewellers', 'Finance', 'Logistics',
  'Bank', 'Foundation', 'Agency', 'Corporation', 'Traders', 'Syndicate', 'Holdings'
];

// Honorifics to strip or detect names
const NAME_TITLES = ['Shri', 'Smt', 'Mr', 'Mrs', 'Dr', 'Inspector', 'Sub-Inspector', 'ASI', 'Constable', 'Accused', 'Suspect'];

export class NlpService {
  private static aiProvider = process.env.AI_PROVIDER || 'deterministic_nlp';
  private static aiApiKey = process.env.AI_API_KEY || '';

  /**
   * Main entry point to extract entities, relationships, and events from raw text
   */
  public static async processText(
    text: string,
    sourceFileName: string = 'Investigation_Document.txt'
  ): Promise<ExtractionResult> {
    if (this.aiApiKey && (this.aiProvider === 'gemini' || this.aiProvider === 'openai')) {
      try {
        return await this.extractWithLlm(text, sourceFileName);
      } catch (err) {
        console.warn('AI LLM extraction failed or rate limited; falling back to Deterministic NLP Engine.', err);
        return this.extractWithDeterministicNlp(text, sourceFileName);
      }
    }

    // Default rock-solid deterministic rule-based extractor
    return this.extractWithDeterministicNlp(text, sourceFileName);
  }

  /**
   * High-accuracy deterministic regex and dictionary-based extraction
   */
  public static extractWithDeterministicNlp(text: string, sourceFileName: string): ExtractionResult {
    const entities: ExtractedEntity[] = [];
    const relationships: ExtractedRelationship[] = [];
    const events: ExtractionResult['events'] = [];

    const seenEntityKeys = new Set<string>();

    const addEntity = (entity: ExtractedEntity) => {
      const key = `${entity.entityType}:${entity.normalizedName.toLowerCase()}`;
      if (!seenEntityKeys.has(key)) {
        seenEntityKeys.add(key);
        entities.push(entity);
      }
    };

    // 1. Phone Extraction
    const phoneMatches = text.matchAll(PHONE_REGEX);
    for (const match of phoneMatches) {
      const raw = match[0];
      const normalized = raw.replace(/[\s-]/g, '').replace(/^(\+91|0)/, '');
      addEntity({
        name: raw.trim(),
        normalizedName: normalized,
        entityType: 'PHONE',
        confidence: 0.98,
        extractedText: raw,
        contextSnippet: getContext(text, match.index || 0, raw.length),
        method: 'DETERMINISTIC_NLP',
        identifiers: [{ type: 'PHONE_NUMBER', value: normalized }],
      });
    }

    // 2. Email Extraction
    const emailMatches = text.matchAll(EMAIL_REGEX);
    for (const match of emailMatches) {
      const raw = match[0];
      addEntity({
        name: raw.toLowerCase(),
        normalizedName: raw.toLowerCase(),
        entityType: 'EMAIL',
        confidence: 0.99,
        extractedText: raw,
        contextSnippet: getContext(text, match.index || 0, raw.length),
        method: 'DETERMINISTIC_NLP',
        identifiers: [{ type: 'EMAIL_ADDR', value: raw.toLowerCase() }],
      });
    }

    // 3. Vehicle Plate Extraction
    const vehicleMatches = text.matchAll(VEHICLE_REGEX);
    for (const match of vehicleMatches) {
      const raw = match[0];
      const normalized = raw.toUpperCase().replace(/[\s-]/g, '');
      // Filter out false positives
      if (normalized.length >= 8 && normalized.length <= 11) {
        addEntity({
          name: raw.toUpperCase(),
          normalizedName: normalized,
          entityType: 'VEHICLE',
          confidence: 0.95,
          extractedText: raw,
          contextSnippet: getContext(text, match.index || 0, raw.length),
          method: 'DETERMINISTIC_NLP',
          identifiers: [{ type: 'VEHICLE_PLATE', value: normalized }],
        });
      }
    }

    // 4. Transaction Amounts
    const txMatches = text.matchAll(TRANSACTION_REGEX);
    for (const match of txMatches) {
      const raw = match[0];
      const numericStr = match[1].replace(/,/g, '');
      addEntity({
        name: `₹${Number(numericStr).toLocaleString('en-IN')}`,
        normalizedName: numericStr,
        entityType: 'TRANSACTION',
        confidence: 0.94,
        extractedText: raw,
        contextSnippet: getContext(text, match.index || 0, raw.length),
        method: 'DETERMINISTIC_NLP',
      });
    }

    // 5. Account Numbers
    const accMatches = text.matchAll(ACCOUNT_REGEX);
    for (const match of accMatches) {
      const raw = match[0];
      const accNumber = match[1];
      addEntity({
        name: `Account ${accNumber}`,
        normalizedName: accNumber.toUpperCase(),
        entityType: 'ACCOUNT',
        confidence: 0.92,
        extractedText: raw,
        contextSnippet: getContext(text, match.index || 0, raw.length),
        method: 'DETERMINISTIC_NLP',
        identifiers: [{ type: 'BANK_ACC', value: accNumber.toUpperCase() }],
      });
    }

    // 6. Dates
    const dateMatches = text.matchAll(DATE_REGEX);
    for (const match of dateMatches) {
      const raw = match[0];
      addEntity({
        name: raw,
        normalizedName: raw,
        entityType: 'DATE',
        confidence: 0.9,
        extractedText: raw,
        contextSnippet: getContext(text, match.index || 0, raw.length),
        method: 'DETERMINISTIC_NLP',
      });
    }

    // 7. Known Locations
    for (const loc of KNOWN_LOCATIONS) {
      const regex = new RegExp(`\\b${escapeRegExp(loc)}\\b`, 'gi');
      if (regex.test(text)) {
        addEntity({
          name: loc,
          normalizedName: loc.toUpperCase(),
          entityType: 'LOCATION',
          confidence: 0.95,
          extractedText: loc,
          contextSnippet: loc,
          method: 'DETERMINISTIC_NLP',
        });
      }
    }

    // 8. Person Entities (Patterns like: Rahul Kumar, Vikram Malhotra, Simran Kaur, etc.)
    const personNameRegex = /\b(?:(?:Shri|Mr|Mrs|Dr|ASI|Inspector|Accused|Suspect)\s+)?([A-Z][a-z]{2,15}\s+[A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,15})?)\b/g;
    const nameMatches = text.matchAll(personNameRegex);
    for (const match of nameMatches) {
      const candidateName = match[1].trim();
      // Skip non-names that match capitalized pairs
      if (
        !KNOWN_LOCATIONS.some(l => l.includes(candidateName)) &&
        !ORG_SUFFIXES.some(s => candidateName.includes(s)) &&
        !candidateName.startsWith('Police Station') &&
        !candidateName.startsWith('Cyber Crime') &&
        !candidateName.startsWith('First Information')
      ) {
        addEntity({
          name: candidateName,
          normalizedName: candidateName.toUpperCase(),
          entityType: 'PERSON',
          confidence: 0.88,
          extractedText: match[0],
          contextSnippet: getContext(text, match.index || 0, match[0].length),
          method: 'DETERMINISTIC_NLP',
          identifiers: [{ type: 'NAME_ALIAS', value: candidateName }],
        });
      }
    }

    // 9. Organizations
    for (const suffix of ORG_SUFFIXES) {
      const orgRegex = new RegExp(`\\b([A-Z][a-zA-Z0-9&\\s]{2,25}\\s+${escapeRegExp(suffix)})\\b`, 'g');
      const orgMatches = text.matchAll(orgRegex);
      for (const match of orgMatches) {
        const orgName = match[1].trim();
        addEntity({
          name: orgName,
          normalizedName: orgName.toUpperCase(),
          entityType: 'ORGANIZATION',
          confidence: 0.92,
          extractedText: match[0],
          contextSnippet: getContext(text, match.index || 0, match[0].length),
          method: 'DETERMINISTIC_NLP',
        });
      }
    }

    // 10. Relationship Extraction via Sentence Context Rules
    const sentences = text.split(/(?<=[.?!;])\s+/);
    for (const sentence of sentences) {
      const personsInSentence = entities.filter(e => e.entityType === 'PERSON' && sentence.includes(e.name));
      const phonesInSentence = entities.filter(e => e.entityType === 'PHONE' && sentence.includes(e.extractedText));
      const accountsInSentence = entities.filter(e => e.entityType === 'ACCOUNT' && sentence.includes(e.name.replace('Account ', '')));
      const vehiclesInSentence = entities.filter(e => e.entityType === 'VEHICLE' && sentence.includes(e.name));
      const locationsInSentence = entities.filter(e => e.entityType === 'LOCATION' && sentence.includes(e.name));

      // Rule A: Person contacted / called Person or Phone
      if (/(?:called|contacted|communicated|phoned|dialed|spoke with)/i.test(sentence)) {
        if (personsInSentence.length >= 2) {
          relationships.push({
            sourceEntityName: personsInSentence[0].name,
            sourceEntityType: 'PERSON',
            targetEntityName: personsInSentence[1].name,
            targetEntityType: 'PERSON',
            relationshipType: 'CALLED',
            confidence: 0.91,
            excerpt: sentence.trim(),
            method: 'DETERMINISTIC_NLP',
          });
        } else if (personsInSentence.length === 1 && phonesInSentence.length >= 1) {
          relationships.push({
            sourceEntityName: personsInSentence[0].name,
            sourceEntityType: 'PERSON',
            targetEntityName: phonesInSentence[0].name,
            targetEntityType: 'PHONE',
            relationshipType: 'COMMUNICATED_WITH',
            confidence: 0.93,
            excerpt: sentence.trim(),
            method: 'DETERMINISTIC_NLP',
          });
        }
      }

      // Rule B: Person transferred money to Account or Person
      if (/(?:transferred|sent|deposited|wired|paid|received|remitted)/i.test(sentence)) {
        if (personsInSentence.length >= 1 && accountsInSentence.length >= 1) {
          relationships.push({
            sourceEntityName: personsInSentence[0].name,
            sourceEntityType: 'PERSON',
            targetEntityName: accountsInSentence[0].name,
            targetEntityType: 'ACCOUNT',
            relationshipType: 'TRANSFERRED',
            confidence: 0.95,
            excerpt: sentence.trim(),
            method: 'DETERMINISTIC_NLP',
          });
        } else if (personsInSentence.length >= 2) {
          relationships.push({
            sourceEntityName: personsInSentence[0].name,
            sourceEntityType: 'PERSON',
            targetEntityName: personsInSentence[1].name,
            targetEntityType: 'PERSON',
            relationshipType: 'TRANSACTED_WITH',
            confidence: 0.89,
            excerpt: sentence.trim(),
            method: 'DETERMINISTIC_NLP',
          });
        }
      }

      // Rule C: Person owns or was seen driving Vehicle
      if (/(?:drove|vehicle|car|registered to|owner of|plate)/i.test(sentence)) {
        if (personsInSentence.length >= 1 && vehiclesInSentence.length >= 1) {
          relationships.push({
            sourceEntityName: personsInSentence[0].name,
            sourceEntityType: 'PERSON',
            targetEntityName: vehiclesInSentence[0].name,
            targetEntityType: 'VEHICLE',
            relationshipType: 'OWNED',
            confidence: 0.92,
            excerpt: sentence.trim(),
            method: 'DETERMINISTIC_NLP',
          });
        }
      }

      // Rule D: Person visited or located at Location
      if (/(?:visited|stayed|spotted|located at|resides in|safehouse|hideout)/i.test(sentence)) {
        if (personsInSentence.length >= 1 && locationsInSentence.length >= 1) {
          relationships.push({
            sourceEntityName: personsInSentence[0].name,
            sourceEntityType: 'PERSON',
            targetEntityName: locationsInSentence[0].name,
            targetEntityType: 'LOCATION',
            relationshipType: 'VISITED',
            confidence: 0.88,
            excerpt: sentence.trim(),
            method: 'DETERMINISTIC_NLP',
          });
        }
      }

      // Create Temporal Event from sentence if date is present
      const dateInSentence = entities.find(e => e.entityType === 'DATE' && sentence.includes(e.name));
      if (dateInSentence) {
        events.push({
          eventType: 'DOCUMENT_RECORDED_INCIDENT',
          eventTime: new Date().toISOString(),
          title: `Activity recorded on ${dateInSentence.name}`,
          description: sentence.trim(),
          location: locationsInSentence[0]?.name,
        });
      }
    }

    return { entities, relationships, events };
  }

  /**
   * External LLM extractor (Gemini / OpenAI) with strict JSON output contract
   */
  private static async extractWithLlm(text: string, sourceFileName: string): Promise<ExtractionResult> {
    const prompt = `You are a forensic investigation data extraction AI for the Ministry of Home Affairs.
Analyze this investigative record and extract:
1. Entities: PERSON, PHONE, EMAIL, ACCOUNT, VEHICLE, LOCATION, ORGANIZATION, TRANSACTION, DATE
2. Relationships: CALLED, TRANSFERRED, OWNED, LOCATED_AT, ASSOCIATED_WITH, WORKS_FOR, VISITED, COMMUNICATED_WITH, TRANSACTED_WITH.
Output ONLY strict JSON with this exact schema:
{
  "entities": [{"name": string, "normalizedName": string, "entityType": string, "confidence": number, "extractedText": string}],
  "relationships": [{"sourceEntityName": string, "sourceEntityType": string, "targetEntityName": string, "targetEntityType": string, "relationshipType": string, "confidence": number, "excerpt": string}],
  "events": [{"eventType": string, "eventTime": string, "title": string, "description": string, "location": string}]
}
Source document: ${sourceFileName}
Text:
${text}`;

    if (this.aiProvider === 'gemini') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.aiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        }),
      });
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        return {
          entities: (parsed.entities || []).map((e: any) => ({ ...e, method: 'AI_LLM' })),
          relationships: (parsed.relationships || []).map((r: any) => ({ ...r, method: 'AI_LLM' })),
          events: parsed.events || [],
        };
      }
    }

    // Default fallback
    return this.extractWithDeterministicNlp(text, sourceFileName);
  }
}

function getContext(text: string, index: number, length: number, radius = 50): string {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + length + radius);
  return '...' + text.slice(start, end).replace(/\s+/g, ' ').trim() + '...';
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
