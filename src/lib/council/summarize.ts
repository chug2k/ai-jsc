/**
 * Post-session summary service.
 *
 * After a session ends, this generates a structured summary of what happened.
 * Runs as a background call with high reasoning effort — latency doesn't matter.
 * The summary feeds into the next session's priorSessions context.
 */

import { callOpenAI, type LLMMessage } from './openai';

const SUMMARY_PROMPT = `You are a session analyst for a Job Search Council (JSC).
Your job is to produce a concise, structured summary of what happened in this session.

This summary will be read by council members in the NEXT session to maintain continuity.
Write it so that someone who wasn't in the room can quickly understand:
1. What the user shared about their situation
2. What key themes or patterns emerged
3. What the council advised and what resonated with the user
4. What the user pushed back on or disagreed with
5. What commitments were made
6. What emotional state the user is in

RULES:
- Write 4-8 sentences. Be specific, not generic.
- Name council members by name when attributing advice.
- Include direct quotes or near-quotes when something was particularly meaningful.
- Note any unresolved tensions or open questions for next session.
- Write in third person past tense: "Ray shared that..." not "You shared that..."
- Do NOT include platitudes, filler, or interpretation beyond what was said.

OUTPUT FORMAT:
Return ONLY the summary text. No headers, no bullet points, no JSON. Just the paragraph.`;

export interface SessionSummaryInput {
  sessionNumber: number;
  userName: string;
  messages: LLMMessage[];
  commitments: string[];
}

/**
 * Generate a post-session summary.
 * High reasoning, high latency — runs after session ends.
 */
export async function generateSessionSummary(
  apiKey: string,
  input: SessionSummaryInput,
): Promise<string> {
  const { sessionNumber, userName, messages, commitments } = input;

  const commitStr = commitments.length
    ? `\n\nCOMMITMENTS MADE THIS SESSION:\n${commitments.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
    : '';

  const systemPrompt = `${SUMMARY_PROMPT}

SESSION #${sessionNumber} for ${userName}${commitStr}

The full conversation transcript follows as the message history.`;

  const result = await callOpenAI(
    apiKey,
    systemPrompt,
    messages,
    'gpt-5.4',
    undefined, // no tools
    { reasoningEffort: 'high', maxOutputTokens: 4096 },
  );

  return result.text?.trim() || '';
}
