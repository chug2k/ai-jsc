import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callOpenAI } from '@/lib/council/openai';
import { getSoul } from '@/lib/council/souls';
import { defaultIdentity } from '@/lib/council/identities';
import { buildModeratorPrompt, buildReactiveMemberPrompt, buildFilterPrompt } from '@/lib/council/prompts';
import { runReactionLoop, type AgentMessage, type EngineCallbacks } from '@/lib/council/engine';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

/**
 * Server-side council session endpoint.
 *
 * The client sends a lightweight payload (message + IDs).
 * The server builds all prompts, runs the reaction loop,
 * and streams each agent message back via SSE.
 *
 * SSE events:
 *   message       — agent spoke (data: { role, content, memberName })
 *   phase_change  — phase advanced (data: { phase, message })
 *   commitment    — commitment recorded (data: { text, deadline })
 *   call_on       — member called on (data: { memberName, prompt })
 *   end_session   — session ended (data: { message })
 *   error         — engine error (data: { message })
 *   done          — stream complete
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const {
    sessionId,
    message,
    memberIds,
    phase,
    sessionNumber = 0,
    turnsInPhase = 0,
    replyToMember,
    isInit = false,
  } = body;

  if (!memberIds || !phase) {
    return new Response(JSON.stringify({ error: 'Missing memberIds or phase' }), { status: 400 });
  }

  // Load user profile
  const { data: userProfile } = await supabase
    .from('jsc_users')
    .select('name, search_status, context')
    .eq('auth_id', user.id)
    .single();

  // Load commitments
  const { data: commitments } = await supabase
    .from('jsc_commitments')
    .select('text')
    .eq('user_id', user.id)
    .eq('done', false);

  // Load past session summaries
  const { data: pastSessions } = await supabase
    .from('jsc_sessions')
    .select('summary')
    .eq('user_id', user.id)
    .eq('phase', 'done')
    .not('summary', 'is', null)
    .order('started_at', { ascending: true });

  // Load message history for this session
  let messageHistory: AgentMessage[] = [];
  if (sessionId) {
    const { data: dbMessages } = await supabase
      .from('jsc_messages')
      .select('role, content, member_name')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (dbMessages) {
      messageHistory = dbMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
        memberName: m.member_name || null,
      }));
    }
  }

  // Add the current user message and persist it
  const userMsg = isInit ? 'Begin the JSC session.' : message;
  if (!isInit && message) {
    messageHistory.push({ role: 'user', content: message });
    if (sessionId) {
      await supabase.from('jsc_messages').insert({
        session_id: sessionId, role: 'user', content: message, phase,
      });
    }
  } else if (isInit) {
    messageHistory.push({ role: 'user', content: userMsg });
  }

  // Build context
  const ctx = {
    userName: userProfile?.name || 'Friend',
    searchStatus: userProfile?.search_status || 'slow',
    userContext: userProfile?.context || '',
    commitments: (commitments || []).map(c => ({ text: c.text })),
    sessionNumber,
    priorSessions: (pastSessions || []).map((s, i) => ({ number: i, summary: s.summary! })),
    turnsInPhase,
  };

  // Build agents server-side (souls + identities + prompts never leave the server)
  const identities = memberIds.map((id: string) => defaultIdentity(id));
  const agents = memberIds.map((id: string, i: number) => {
    const identity = identities[i];
    const soul = getSoul(id);
    return {
      id,
      name: identity.name,
      isModerator: id === 'facilitator',
      model: id === 'facilitator' ? 'gpt-5.4' : 'gpt-5.4-mini',
      filterModel: 'gpt-5.4-nano',
      reasoningEffort: identity.reasoning_effort,
      buildSystemPrompt: () =>
        id === 'facilitator'
          ? buildModeratorPrompt(soul, identity, identities, phase, ctx)
          : buildReactiveMemberPrompt(soul, identity, identities, phase, ctx),
      buildFilterPrompt: () =>
        buildFilterPrompt(identity, identities, phase, { userName: ctx.userName }),
    };
  });

  // Stream responses via SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const callbacks: EngineCallbacks = {
        onMessage: (msg) => {
          send('message', { role: msg.role, content: msg.content, memberName: msg.memberName });
          // Persist to DB (fire-and-forget, don't block the stream)
          if (sessionId) {
            supabase.from('jsc_messages').insert({
              session_id: sessionId,
              role: msg.role,
              content: msg.content,
              member_name: msg.memberName || null,
              phase,
            }).then(() => {});
          }
        },
        onPhaseChange: (newPhase, message) => {
          send('phase_change', { phase: newPhase, message });
          if (sessionId) {
            supabase.from('jsc_sessions').update({ phase: newPhase }).eq('id', sessionId)
              .then(() => {});
          }
        },
        onCommitment: (text, deadline) => send('commitment', { text, deadline }),
        onCallOn: (memberName, prompt) => send('call_on', { memberName, prompt }),
        onEndSession: (message) => {
          send('end_session', { message });
          if (sessionId) {
            supabase.from('jsc_sessions').update({ phase: 'done' }).eq('id', sessionId)
              .then(() => {});
          }
        },
      };

      try {
        await runReactionLoop({
          agents,
          messages: messageHistory,
          moderatorOnly: isInit,
          replyToMember,
          callbacks,
          llm: async (system, messages, model, tools, options) => {
            return callOpenAI(OPENAI_API_KEY, system, messages, model || 'gpt-5.4-mini', tools, options);
          },
        });
      } catch (err) {
        send('error', { message: (err as Error).message });
      }

      send('done', {});
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
