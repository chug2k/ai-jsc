import { NextResponse } from 'next/server';

const ENDPOINT = process.env.LLM_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '';

export async function GET() {
  // Only available in dev
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }

  const baseUrl = ENDPOINT.replace('/chat/completions', '/models');
  const headers: Record<string, string> = {};
  if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

  try {
    const res = await fetch(baseUrl, { headers });
    const data = await res.json();
    const models = (data.data || [])
      .map((m: { id: string }) => m.id)
      .filter((id: string) => !id.includes('embedding'));
    return NextResponse.json({
      endpoint: ENDPOINT,
      current: process.env.LLM_MODEL || 'gpt-4.1',
      models,
    });
  } catch {
    return NextResponse.json({
      endpoint: ENDPOINT,
      current: process.env.LLM_MODEL || 'gpt-4.1',
      models: [],
      error: 'Could not fetch models',
    });
  }
}
