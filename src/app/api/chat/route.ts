import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Configure via env vars:
//   LLM_ENDPOINT=http://127.0.0.1:1234/v1/chat/completions  (local LM Studio)
//   LLM_ENDPOINT=https://api.openai.com/v1/chat/completions  (production)
//   LLM_MODEL=qwen/qwen3.5-35b-a3b  (local)
//   LLM_MODEL=gpt-4.1  (production)
//   LLM_API_KEY=  (optional, not needed for local models)

const ENDPOINT = process.env.LLM_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.LLM_MODEL || 'gpt-4.1';
const API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '';

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

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

  const msgs = [
    { role: 'developer', content: system },
    ...messages,
  ];

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        max_tokens: 4096,
        messages: msgs,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data);
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const content = data.choices?.[0]?.message?.content || '';
    const reasoning = data.choices?.[0]?.message?.reasoning_content || '';
    const text = content || reasoning.trim();

    return NextResponse.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
