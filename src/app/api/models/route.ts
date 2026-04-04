import { NextResponse } from 'next/server';

const MODELS = [
  { id: 'gpt-5.4-nano', name: 'GPT-5.4 Nano', tier: 'fast' },
  { id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini', tier: 'balanced' },
  { id: 'gpt-5.4', name: 'GPT-5.4', tier: 'smart' },
];

export async function GET() {
  return NextResponse.json({
    default: 'gpt-5.4-mini',
    moderatorDefault: 'gpt-5.4',
    models: MODELS,
  });
}
