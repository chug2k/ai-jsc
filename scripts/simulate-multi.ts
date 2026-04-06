/**
 * Multi-session simulation runner.
 *
 * Chains sessions together: runs session N, generates summary,
 * feeds it into session N+1 automatically.
 *
 * Usage: npx tsx scripts/simulate-multi.ts <multi-persona-file.json>
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

import { buildModeratorPrompt, buildReactiveMemberPrompt, buildFilterPrompt } from '../src/lib/council/prompts';
import { runReactionLoop, type AgentMessage, type CouncilAgent } from '../src/lib/council/engine';
import { callOpenAI } from '../src/lib/council/openai';
import { generateSessionSummary } from '../src/lib/council/summarize';
import { getSoul } from '../src/lib/council/souls';
import { defaultIdentity, type AgentIdentity } from '../src/lib/council/identities';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) { console.error('Missing OPENAI_API_KEY'); process.exit(1); }

const MODERATOR_MODEL = 'gpt-5.4';
const MEMBER_MODEL = 'gpt-5.4-mini';
const FILTER_MODEL = 'gpt-5.4-nano';

interface SessionInput {
  sessionNumber: number;
  memberIds: string[];
  messages: string[];
}

interface MultiPersona {
  name: string;
  searchStatus: 'slow' | 'fast' | 'exploring' | 'paused';
  userContext: string;
  sessions: SessionInput[];
}

async function runSession(
  persona: MultiPersona,
  session: SessionInput,
  priorSessions: { number: number; summary: string }[],
  priorCommitments: { text: string }[],
) {
  let memberIds = session.memberIds;
  if (!memberIds.includes('facilitator')) memberIds = ['facilitator', ...memberIds];
  const identities: AgentIdentity[] = memberIds.map(id => defaultIdentity(id));

  const ctx = {
    userName: persona.name,
    searchStatus: persona.searchStatus,
    userContext: persona.userContext,
    commitments: priorCommitments,
    sessionNumber: session.sessionNumber,
    priorSessions,
  };

  let phase = 'checkin';
  const messages: AgentMessage[] = [];
  const newCommitments: { text: string }[] = [];

  const llm = async (systemPrompt: string, msgs: AgentMessage[], model?: string, tools?: unknown[], options?: { reasoningEffort?: 'low' | 'medium' | 'high' }) => {
    return callOpenAI(OPENAI_API_KEY!, systemPrompt, msgs, model || MEMBER_MODEL, tools, options);
  };

  const buildAgents = (): CouncilAgent[] => identities.map(identity => ({
    id: identity.soul_id,
    name: identity.name,
    isModerator: identity.is_moderator,
    model: identity.is_moderator ? MODERATOR_MODEL : MEMBER_MODEL,
    filterModel: FILTER_MODEL,
    reasoningEffort: identity.reasoning_effort,
    buildSystemPrompt: () => {
      const soul = getSoul(identity.soul_id);
      return identity.is_moderator
        ? buildModeratorPrompt(soul, identity, identities, phase, ctx)
        : buildReactiveMemberPrompt(soul, identity, identities, phase, ctx);
    },
    buildFilterPrompt: () => buildFilterPrompt(identity, identities, phase, { userName: ctx.userName }),
  }));

  const log = (prefix: string, text: string) => console.log(`[${prefix}] ${text}`);

  log('SYS', `Session ${session.sessionNumber} | ${persona.name} | Phase: ${phase}`);

  // Init
  messages.push({ role: 'user', content: 'Begin the JSC session.' });
  await runReactionLoop({
    agents: buildAgents(), messages: [...messages], llm, moderatorOnly: true,
    callbacks: {
      onMessage: msg => { messages.push(msg); log(msg.memberName || '?', msg.content); },
      onPhaseChange: p => { phase = p; log('SYS', `Phase -> ${phase}`); },
      onCommitment: t => { newCommitments.push({ text: t }); log('SYS', `Commitment: ${t}`); },
      onCallOn: () => {}, onEndSession: () => { log('SYS', 'Session ended.'); },
    },
  });

  // User messages
  for (const userMsg of session.messages) {
    messages.push({ role: 'user', content: userMsg, memberName: persona.name });
    log(persona.name, userMsg);

    let ended = false;
    await runReactionLoop({
      agents: buildAgents(), messages: [...messages], llm,
      callbacks: {
        onMessage: msg => { messages.push(msg); log(msg.memberName || '?', msg.content); },
        onPhaseChange: p => { phase = p; log('SYS', `Phase -> ${phase}`); },
        onCommitment: t => {
          if (!newCommitments.some(c => c.text === t)) { newCommitments.push({ text: t }); log('SYS', `Commitment: ${t}`); }
        },
        onCallOn: () => {}, onEndSession: () => { ended = true; log('SYS', 'Session ended.'); },
      },
    });
    if (ended) break;
    console.log('');
  }

  // Generate summary
  console.log('\n--- Generating summary ---');
  const summary = await generateSessionSummary(OPENAI_API_KEY!, {
    sessionNumber: session.sessionNumber,
    userName: persona.name,
    messages,
    commitments: newCommitments.map(c => c.text),
  });
  console.log(summary);

  return { messages, phase, commitments: newCommitments, summary };
}

async function main() {
  const file = process.argv[2];
  if (!file) { console.error('Usage: npx tsx scripts/simulate-multi.ts <file.json>'); process.exit(1); }

  const persona: MultiPersona = JSON.parse(fs.readFileSync(path.resolve(file), 'utf-8'));
  const priorSessions: { number: number; summary: string }[] = [];
  let allCommitments: { text: string }[] = [];

  for (const session of persona.sessions) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`SESSION ${session.sessionNumber}: ${persona.name}`);
    console.log(`${'='.repeat(70)}\n`);

    const result = await runSession(persona, session, priorSessions, allCommitments);

    priorSessions.push({ number: session.sessionNumber, summary: result.summary });
    allCommitments = [...allCommitments, ...result.commitments];

    console.log(`\nMessages: ${result.messages.length} | Phase: ${result.phase}`);
    console.log(`Commitments: ${result.commitments.map(c => c.text).join('; ') || 'none'}`);
    console.log(`${'='.repeat(70)}\n`);
  }

  // Final report
  console.log('\n' + '='.repeat(70));
  console.log('MULTI-SESSION REPORT');
  console.log('='.repeat(70));
  console.log(`Persona: ${persona.name}`);
  console.log(`Sessions: ${persona.sessions.length}`);
  console.log(`Total commitments: ${allCommitments.length}`);
  console.log('\nSession Summaries:');
  for (const ps of priorSessions) {
    console.log(`\n  Session ${ps.number}:`);
    console.log(`  ${ps.summary}`);
  }

  const outPath = `/tmp/multi-sim-${Date.now()}.txt`;
  fs.writeFileSync(outPath, priorSessions.map(ps => `Session ${ps.number}:\n${ps.summary}`).join('\n\n'), 'utf-8');
  console.log(`\nSummaries saved: ${outPath}`);
}

main().catch(err => { console.error('Failed:', err); process.exit(1); });
