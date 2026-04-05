/**
 * Shared OpenAI calling logic — used by both /api/chat route and simulation script.
 *
 * This is the single codepath for all LLM calls. It handles:
 * - Message formatting (developer role, name sanitization, replyTo injection)
 * - Tool calling with tool_choice: required
 * - Response parsing (tool calls or fallback text)
 * - Reasoning effort per agent
 * - Latency measurement
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
  latencyMs?: number;
}

export interface CallOptions {
  reasoningEffort?: 'low' | 'medium' | 'high';
  maxCompletionTokens?: number;
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
  options?: CallOptions,
): Promise<LLMResult> {
  const start = Date.now();

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
    max_completion_tokens: options?.maxCompletionTokens ?? 1024,
    messages: msgs,
  };

  if (options?.reasoningEffort) {
    payload.reasoning_effort = options.reasoningEffort;
  }

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

  const latencyMs = Date.now() - start;

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
      latencyMs,
    };
  }

  return { text: choice?.message?.content || '', latencyMs };
}
