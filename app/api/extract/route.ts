import { NextRequest, NextResponse } from 'next/server';
import { NlpService, ExtractionResult } from '@/services/nlpService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ExtractRequestBody {
  text: string;
  sourceFileName?: string;
  provider?: 'gemini' | 'openai' | 'deterministic_nlp';
}

async function extractWithGemini(
  text: string,
  sourceFileName: string,
  apiKey: string,
  modelName: string = 'gemini-3.5-flash-lite'
): Promise<ExtractionResult | null> {
  const prompt = `You are a forensic criminal intelligence extraction system for law enforcement analysis.
Extract structured entities, relationships, and chronological events from the following case document.

Allowed Entity Types: PERSON, PHONE, EMAIL, ACCOUNT, VEHICLE, LOCATION, ORGANIZATION, TRANSACTION, DATE
Allowed Relationship Types: CALLED, TRANSFERRED, OWNED, LOCATED_AT, ASSOCIATED_WITH, WORKS_FOR, VISITED, COMMUNICATED_WITH, TRANSACTED_WITH

Rules:
1. Do not fabricate facts. Extract verbatim references.
2. Normalize phone numbers (e.g., remove dashes/spaces/country code), account numbers, and email addresses.
3. Every relationship must connect two extracted entities.
4. Provide a confidence between 0.70 and 0.99.

Output STRICT JSON conforming to:
{
  "entities": [
    {
      "name": "string",
      "normalizedName": "string",
      "entityType": "PERSON|PHONE|EMAIL|ACCOUNT|VEHICLE|LOCATION|ORGANIZATION|TRANSACTION|DATE",
      "confidence": 0.95,
      "extractedText": "exact quote"
    }
  ],
  "relationships": [
    {
      "sourceEntityName": "string",
      "sourceEntityType": "string",
      "targetEntityName": "string",
      "targetEntityType": "string",
      "relationshipType": "CALLED|TRANSFERRED|OWNED|LOCATED_AT|ASSOCIATED_WITH|WORKS_FOR|VISITED|COMMUNICATED_WITH|TRANSACTED_WITH",
      "confidence": 0.90,
      "excerpt": "brief excerpt from document"
    }
  ],
  "events": [
    {
      "eventType": "string",
      "eventTime": "YYYY-MM-DD or ISO string",
      "title": "string",
      "description": "string",
      "location": "string"
    }
  ]
}

Source Document: ${sourceFileName}
Record Content:
${text}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.warn(`[Gemini API] Failed with status ${res.status}:`, errorText.slice(0, 200));
    return null;
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  try {
    const parsed = JSON.parse(rawText);
    return {
      entities: (parsed.entities || []).map((e: any) => ({
        ...e,
        method: 'AI_LLM' as const,
        contextSnippet: e.extractedText ? `...${e.extractedText}...` : `Found in ${sourceFileName}`,
      })),
      relationships: (parsed.relationships || []).map((r: any) => ({
        ...r,
        method: 'AI_LLM' as const,
      })),
      events: parsed.events || [],
    };
  } catch (err) {
    console.warn('[Gemini API] Failed to parse JSON response:', err);
    return null;
  }
}

async function extractWithOpenAi(
  text: string,
  sourceFileName: string,
  apiKey: string,
  modelName: string = 'gpt-4o-mini'
): Promise<ExtractionResult | null> {
  const prompt = `You are a forensic criminal intelligence extraction system for law enforcement analysis.
Extract structured entities, relationships, and chronological events from the following case document.

Allowed Entity Types: PERSON, PHONE, EMAIL, ACCOUNT, VEHICLE, LOCATION, ORGANIZATION, TRANSACTION, DATE
Allowed Relationship Types: CALLED, TRANSFERRED, OWNED, LOCATED_AT, ASSOCIATED_WITH, WORKS_FOR, VISITED, COMMUNICATED_WITH, TRANSACTED_WITH

Output STRICT JSON conforming to:
{
  "entities": [{"name": "string", "normalizedName": "string", "entityType": "string", "confidence": 0.95, "extractedText": "string"}],
  "relationships": [{"sourceEntityName": "string", "sourceEntityType": "string", "targetEntityName": "string", "targetEntityType": "string", "relationshipType": "string", "confidence": 0.90, "excerpt": "string"}],
  "events": [{"eventType": "string", "eventTime": "string", "title": "string", "description": "string", "location": "string"}]
}

Document: ${sourceFileName}
Content:
${text}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(12000),
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: 'You are an expert law enforcement intelligence parser. Always respond with strict valid JSON.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.warn(`[OpenAI API] Failed with status ${res.status}:`, errorText.slice(0, 200));
    return null;
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) return null;

  try {
    const parsed = JSON.parse(rawText);
    return {
      entities: (parsed.entities || []).map((e: any) => ({
        ...e,
        method: 'AI_LLM' as const,
        contextSnippet: e.extractedText ? `...${e.extractedText}...` : `Found in ${sourceFileName}`,
      })),
      relationships: (parsed.relationships || []).map((r: any) => ({
        ...r,
        method: 'AI_LLM' as const,
      })),
      events: parsed.events || [],
    };
  } catch (err) {
    console.warn('[OpenAI API] JSON parse error:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ExtractRequestBody = await req.json();
    const { text, sourceFileName = 'Investigative_Document.txt', provider } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "text" field in request body' },
        { status: 400 }
      );
    }

    const preferredProvider = provider || process.env.AI_PROVIDER || 'gemini';
    const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const openAiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    let result: ExtractionResult | null = null;
    let providerUsed = 'deterministic_nlp';
    let modelUsed = 'rule-based-regex-v2';
    let fallbackOccurred = false;

    // 1. Try Gemini if configured and preferred (or as fallback)
    if (preferredProvider === 'gemini' && geminiKey) {
      result = await extractWithGemini(text, sourceFileName, geminiKey, geminiModel);
      if (result) {
        providerUsed = 'gemini';
        modelUsed = geminiModel;
      } else {
        fallbackOccurred = true;
      }
    }

    // 2. Try OpenAI if configured and preferred (or if Gemini failed)
    if (!result && (preferredProvider === 'openai' || fallbackOccurred) && openAiKey) {
      result = await extractWithOpenAi(text, sourceFileName, openAiKey, openAiModel);
      if (result) {
        providerUsed = 'openai';
        modelUsed = openAiModel;
      }
    }

    // 3. Deterministic NLP Engine Fallback (Guaranteed 100% offline uptime)
    if (!result) {
      fallbackOccurred = true;
      providerUsed = 'deterministic_nlp';
      modelUsed = 'rule-based-nlp-dictionary';
      result = NlpService.extractWithDeterministicNlp(text, sourceFileName);
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      providerUsed,
      modelUsed,
      fallbackOccurred,
      durationMs,
      data: result,
      summary: {
        entityCount: result.entities.length,
        relationshipCount: result.relationships.length,
        eventCount: result.events.length,
      },
    });
  } catch (error: any) {
    console.error('[API /api/extract] Unhandled error:', error);
    return NextResponse.json(
      { error: error?.message || 'Extraction processing failed' },
      { status: 500 }
    );
  }
}
