import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const activeProvider = process.env.AI_PROVIDER || (geminiKey ? 'gemini' : openAiKey ? 'openai' : 'deterministic_nlp');
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const openAiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  return NextResponse.json({
    activeProvider,
    gemini: {
      configured: Boolean(geminiKey && geminiKey.length > 5),
      model: geminiModel,
      maskedKey: geminiKey ? `${geminiKey.slice(0, 4)}...${geminiKey.slice(-4)}` : null,
      status: geminiKey ? 'READY' : 'NOT_CONFIGURED',
    },
    openai: {
      configured: Boolean(openAiKey && openAiKey.length > 5),
      model: openAiModel,
      maskedKey: openAiKey ? `${openAiKey.slice(0, 7)}...${openAiKey.slice(-4)}` : null,
      status: openAiKey ? 'READY' : 'NOT_CONFIGURED',
    },
    deterministicNlp: {
      status: 'ACTIVE_FALLBACK',
      capabilities: ['REGEX_NER', 'DICTIONARY_MATCHING', 'INDIAN_JURISDICTION_HEURISTICS', 'ZERO_LATENCY'],
    },
    disclaimer: 'AI outputs are investigative decision-support hypotheses only. Every entity and relationship maintains audit provenance.',
  });
}
