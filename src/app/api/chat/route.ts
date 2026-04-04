import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

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

  const modelId = model || 'gpt-5.4-mini';

  const msgs = [
    { role: 'developer', content: system },
    ...messages.map((m: { role: string; content: string; memberName?: string; replyTo?: { memberName: string | null; content: string } }) => {
      let content = m.content;
      if (m.replyTo) {
        content = `[replying to ${m.replyTo.memberName || 'User'}: "${m.replyTo.content.substring(0, 80)}"]\n${content}`;
      }
      // Use OpenAI's name field to identify who said what without polluting content
      const name = m.memberName?.replace(/[^a-zA-Z0-9_-]/g, '_') || undefined;
      return { role: m.role, content, ...(name ? { name } : {}) };
    }),
  ];

  try {
    const res = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelId,
        max_completion_tokens: 1024,
        messages: msgs,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data);
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const text = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
