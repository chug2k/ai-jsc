/**
 * Shared OpenAI calling logic — used by both /api/chat route and simulation script.
 *
 * This is the single codepath for all LLM calls. It handles:
 * - Message formatting (developer role, name sanitization, replyTo injection)
 * - Tool calling with tool_choice: required
 * - Response parsing (tool calls or fallback text)
 */

export interface LLMMessage {
  role: 'user' | 'assistant';
  content: string;
  memberName?: string | null;
  replyTo?: { memberName: string | null; content: string } | null;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface LLMResult {
  toolCalls?: ToolCall[];
  text?: string;
}

/**
 * Format messages into OpenAI chat format and call the API.
 */
export async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  messages: LLMMessage[],
  model: string,
  tools?: unknown[],
): Promise<LLMResult> {
  const msgs = [
    { role: 'developer', content: systemPrompt },
    ...messages.slice(-30).map((m) => {
      let content = m.content;
      if (m.replyTo) {
        content = `[replying to ${m.replyTo.memberName || 'User'}: "${m.replyTo.content.substring(0, 80)}"]\n${content}`;
      }
      const name = m.role === 'assistant' && m.memberName
        ? m.memberName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 64)
        : undefined;
      return { role: m.role, content, ...(name ? { name } : {}) };
    }),
  ];

  const payload: Record<string, unknown> = {
    model,
    max_completion_tokens: 1024,
    messages: msgs,
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
    payload.tool_choice = 'required';
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.error?.message || `OpenAI ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const choice = data.choices?.[0];

  if (choice?.message?.tool_calls?.length > 0) {
    return {
      toolCalls: choice.message.tool_calls.map((tc: { function: { name: string; arguments: string } }) => ({
        name: tc.function.name,
        args: JSON.parse(tc.function.arguments || '{}'),
      })),
    };
  }

  return { text: choice?.message?.content || '' };
}
