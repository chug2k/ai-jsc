import { NextResponse } from 'next/server';

const LOCAL_ENDPOINT = process.env.LLM_ENDPOINT || '';
const DEFAULT_MODEL = process.env.DEFAULT_LLM_MODEL || 'openai:gpt-5.4-mini';

/** Available cloud models. */
const CLOUD_MODELS = [
  { id: 'openai:gpt-5.4-nano', name: 'GPT-5.4 Nano', provider: 'openai' },
  { id: 'openai:gpt-5.4-mini', name: 'GPT-5.4 Mini', provider: 'openai' },
  { id: 'openai:gpt-5.4', name: 'GPT-5.4', provider: 'openai' },
  { id: 'gemini:gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Flash Lite', provider: 'gemini' },
];

export async function GET() {
  const models = [...CLOUD_MODELS];

  // In dev, also fetch local models from LM Studio
  if (process.env.NODE_ENV === 'development' && LOCAL_ENDPOINT) {
    try {
      const baseUrl = LOCAL_ENDPOINT.replace('/chat/completions', '/models');
      const res = await fetch(baseUrl);
      const data = await res.json();
      const localModels = (data.data || [])
        .map((m: { id: string }) => m.id)
        .filter((id: string) => !id.includes('embedding'))
        .map((id: string) => ({ id: `local:${id}`, name: id, provider: 'local' }));
      models.push(...localModels);
    } catch {
      // Local models unavailable, that's fine
    }
  }

  return NextResponse.json({
    default: DEFAULT_MODEL,
    models,
  });
}
