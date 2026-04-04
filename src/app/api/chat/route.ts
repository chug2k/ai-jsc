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
  const { system, messages, model, tools } = body;

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
      const name = m.memberName?.replace(/[^a-zA-Z0-9_-]/g, '_') || undefined;
      return { role: m.role, content, ...(name ? { name } : {}) };
    }),
  ];

  const payload: Record<string, unknown> = {
    model: modelId,
    max_completion_tokens: 1024,
    messages: msgs,
  };

  // Add tools if provided
  if (tools && tools.length > 0) {
    payload.tools = tools;
    payload.tool_choice = 'required'; // Must use a tool (send_message, stay_silent, etc.)
  }

  try {
    const res = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data);
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const choice = data.choices?.[0];

    // Handle tool calls
    if (choice?.message?.tool_calls?.length > 0) {
      const toolCalls = choice.message.tool_calls.map((tc: { function: { name: string; arguments: string } }) => ({
        name: tc.function.name,
        args: JSON.parse(tc.function.arguments),
      }));
      return NextResponse.json({ toolCalls });
    }

    // Fallback: plain text response (shouldn't happen with tool_choice: required)
    const text = choice?.message?.content || '';
    return NextResponse.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
