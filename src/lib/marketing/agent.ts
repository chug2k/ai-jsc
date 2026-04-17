/**
 * The automated marketing agent.
 *
 * One public entry point: `runDailyMarketing()`. Invoked by the daily Vercel
 * cron and by the local CLI runner. Steps:
 *   1. Pick today's routine from the weekly schedule (or caller override).
 *   2. Load recent outputs from Supabase + PROJECT.md / DESIGN.md context.
 *   3. Call the shared callOpenAI helper with a locked voice system prompt.
 *   4. Persist the result to jsc_marketing_outputs.
 */

import * as fs from 'fs';
import * as path from 'path';

import { callOpenAI } from '@/lib/council/openai';
import { getRoutine, routineForDate, type RoutineName } from './routines';
import { loadRecentOutputs, saveOutput, type MarketingOutput } from './storage';

const MODEL = process.env.MARKETING_MODEL || 'gpt-5.4';

/** Locked voice rules — mirrors MARKETING_PLAN.md. Keep them in sync. */
const SYSTEM_PROMPT = [
  'You are the automated marketing agent for jobsearch.quest, an AI-powered Job Search Council app',
  'built on the Never Search Alone (NSA) methodology by Phyl Terry.',
  '',
  'Voice: specific, concrete, warm. Never hypey. No buzzwords ("leverage", "unlock", "revolutionize").',
  'No emojis. No exclamation points except in quotes.',
  '',
  'Never invent testimonials, statistics, user counts, or features that are not present in the project',
  'context you are given. When you reference NSA concepts (Mnookin Two-Pager, Gratitude House, Listening',
  'Tour, Hot Seat, Must-Nots vs Must-Haves, Candidate-Market Fit), be accurate.',
  '',
  'Return ONLY the requested artifact — no preambles, no meta commentary, no "Here is...".',
].join(' ');

function readProjectContext(): string {
  const root = process.cwd();
  const files = ['PROJECT.md', 'DESIGN.md'];
  const parts: string[] = [];
  for (const f of files) {
    const p = path.join(root, f);
    if (fs.existsSync(p)) {
      parts.push(`=== ${f} ===\n${fs.readFileSync(p, 'utf-8')}`);
    }
  }
  return parts.join('\n\n');
}

export interface RunOptions {
  /** Override today's routine. Defaults to the day-of-week pick. */
  routine?: RoutineName;
  /** Override the date used for the schedule lookup. Defaults to now. */
  date?: Date;
  /** Skip persistence (used by local dry-runs). */
  dryRun?: boolean;
}

export interface RunResult {
  routine: RoutineName;
  content: string;
  model: string;
  latencyMs: number;
  stored: MarketingOutput | null;
}

export async function runDailyMarketing(options: RunOptions = {}): Promise<RunResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY missing');

  const date = options.date ?? new Date();
  const routineName = options.routine ?? routineForDate(date);
  const routine = getRoutine(routineName);

  const recentOutputs = options.dryRun ? [] : await loadRecentOutputs(14);
  const projectContext = readProjectContext();

  const userPrompt = routine.buildPrompt({
    recentOutputs: recentOutputs.map((o) => ({
      routine: o.routine,
      content: o.content,
      createdAt: o.created_at,
    })),
    projectContext,
    today: date.toISOString().slice(0, 10),
  });

  const result = await callOpenAI(
    apiKey,
    SYSTEM_PROMPT,
    [{ role: 'user', content: userPrompt }],
    MODEL,
    undefined,
    { reasoningEffort: 'medium', maxOutputTokens: routine.maxTokens },
  );

  const content = (result.text || '').trim();
  if (!content) throw new Error(`Routine ${routineName} returned empty content`);

  const stored = options.dryRun
    ? null
    : await saveOutput(routineName, content, {
        model: MODEL,
        latencyMs: result.latencyMs,
        goal: routine.goal,
        date: date.toISOString(),
      });

  return {
    routine: routineName,
    content,
    model: MODEL,
    latencyMs: result.latencyMs ?? 0,
    stored,
  };
}
