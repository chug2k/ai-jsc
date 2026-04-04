import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenAI } from '@google/genai';

/**
 * Multi-provider LLM proxy.
 *
 * Supported providers:
 *   - openai: GPT-5.4 nano/mini/full (or any OpenAI-compatible endpoint)
 *   - gemini: Google Gemini models via @google/genai SDK
 *   - local: Any OpenAI-compatible local server (LM Studio, Ollama, etc.)
 *
 * The client sends { system, messages, model? }
 * Model format: "provider:model-id" (e.g. "openai:gpt-5.4-nano", "gemini:gemini-3.1-flash-lite-preview")
 * If no prefix, defaults to OpenAI.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const LOCAL_ENDPOINT = process.env.LLM_ENDPOINT || '';
const LOCAL_MODEL = process.env.LLM_MODEL || '';

const DEFAULT_MODEL = process.env.DEFAULT_LLM_MODEL || 'openai:gpt-5.4-nano';

interface ChatMessage {
  role: string;
  content: string;
}

function parseModel(model: string): { provider: string; modelId: string } {
  if (model.includes(':')) {
    const [provider, ...rest] = model.split(':');
    return { provider, modelId: rest.join(':') };
  }
  // No prefix — guess provider from model name
  if (model.startsWith('gemini')) return { provider: 'gemini', modelId: model };
  if (model.startsWith('gpt') || model.startsWith('o1') || model.startsWith('o3') || model.startsWith('o4')) return { provider: 'openai', modelId: model };
  // Assume local/OpenAI-compatible
  return { provider: 'local', modelId: model };
}

async function callOpenAI(modelId: string, system: string, messages: ChatMessage[]): Promise<string> {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const msgs = [{ role: 'developer', content: system }, ...messages];

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({ model: modelId, max_tokens: 4096, messages: msgs }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data));
  return data.choices?.[0]?.message?.content || '';
}

async function callGemini(modelId: string, system: string, messages: ChatMessage[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  // Convert OpenAI-style messages to Gemini format
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: m.content }],
  }));

  const response = await ai.models.generateContent({
    model: modelId,
    contents,
    config: {
      systemInstruction: system,
      maxOutputTokens: 4096,
    },
  });

  return response.text || '';
}

async function callLocal(modelId: string, system: string, messages: ChatMessage[]): Promise<string> {
  if (!LOCAL_ENDPOINT) throw new Error('No local LLM endpoint configured (set LLM_ENDPOINT)');
  const msgs = [{ role: 'developer', content: system }, ...messages];

  const res = await fetch(LOCAL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelId || LOCAL_MODEL, max_tokens: 4096, messages: msgs }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data));
  const content = data.choices?.[0]?.message?.content || '';
  const reasoning = data.choices?.[0]?.message?.reasoning_content || '';
  return content || reasoning.trim();
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { system, messages, model } = body;

  if (!system || !messages) {
    return NextResponse.json({ error: 'Missing system or messages' }, { status: 400 });
  }

  const { provider, modelId } = parseModel(model || DEFAULT_MODEL);

  try {
    let text: string;
    switch (provider) {
      case 'gemini':
        text = await callGemini(modelId, system, messages);
        break;
      case 'local':
        text = await callLocal(modelId, system, messages);
        break;
      case 'openai':
      default:
        text = await callOpenAI(modelId, system, messages);
        break;
    }

    return NextResponse.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
