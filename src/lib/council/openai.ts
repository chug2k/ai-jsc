/**
 * Shared OpenAI calling logic — uses the Responses API (/v1/responses).
 *
 * This is the single codepath for all LLM calls. It handles:
 * - Message formatting (instructions + input items)
 * - Tool calling with tool_choice: required
 * - Response parsing (function_call output items or text)
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
  maxOutputTokens?: number;
}

/**
 * Format messages and call the OpenAI Responses API.
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

  // Build input items from message history
  const input = messages.slice(-60).map((m) => {
    let content = m.content;
    if (m.replyTo) {
      content = `[replying to ${m.replyTo.memberName || 'User'}: "${m.replyTo.content.substring(0, 80)}"]\n${content}`;
    }
    // For assistant messages, prefix with member name so the model knows who said what
    if (m.role === 'assistant' && m.memberName) {
      content = `[${m.memberName}] ${content}`;
    }
    return { role: m.role, content };
  });

  const payload: Record<string, unknown> = {
    model,
    instructions: systemPrompt,
    input,
    max_output_tokens: options?.maxOutputTokens ?? 1024,
  };

  if (options?.reasoningEffort) {
    payload.reasoning = { effort: options.reasoningEffort };
  }

  if (tools && tools.length > 0) {
    // Convert chat completions tool format to responses API format
    // Chat: { type: 'function', function: { name, description, parameters } }
    // Responses: { type: 'function', name, description, parameters }
    payload.tools = (tools as Array<{ type: string; function?: { name: string; description?: string; parameters?: unknown } }>).map((t) => {
      if (t.type === 'function' && t.function) {
        return {
          type: 'function',
          name: t.function.name,
          description: t.function.description,
          parameters: t.function.parameters,
        };
      }
      return t;
    });
    payload.tool_choice = 'required';
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
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

  // Parse output items — look for function_call and message types
  const output = data.output || [];
  const functionCalls = output.filter((item: { type: string }) => item.type === 'function_call');
  const messageItems = output.filter((item: { type: string }) => item.type === 'message');

  if (functionCalls.length > 0) {
    return {
      toolCalls: functionCalls.map((fc: { name: string; arguments: string }) => ({
        name: fc.name,
        args: JSON.parse(fc.arguments || '{}'),
      })),
      latencyMs,
    };
  }

  // Extract text from message output items
  if (messageItems.length > 0) {
    const textParts = messageItems
      .flatMap((item: { content: Array<{ type: string; text: string }> }) =>
        (item.content || []).filter((c: { type: string }) => c.type === 'output_text').map((c: { text: string }) => c.text),
      );
    return { text: textParts.join('') || '', latencyMs };
  }

  // Fallback: check output_text shorthand
  if (data.output_text) {
    return { text: data.output_text, latencyMs };
  }

  return { text: '', latencyMs };
}
