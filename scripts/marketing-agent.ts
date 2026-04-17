/**
 * Automated marketing agent for jobsearch.quest.
 *
 * Generates marketing content (tweet threads, blog posts, landing hero copy,
 * cold emails, LinkedIn posts) by feeding the project's own context into the
 * shared callOpenAI helper.
 *
 * Usage:
 *   npx tsx scripts/marketing-agent.ts <task> [--audience <a>] [--tone <t>] [--out <path>]
 *
 * Tasks: tweet-thread | blog-post | landing-hero | cold-email | linkedin-post
 *
 * Examples:
 *   npx tsx scripts/marketing-agent.ts tweet-thread
 *   npx tsx scripts/marketing-agent.ts blog-post --audience "laid-off PMs" --tone empathetic
 *   npx tsx scripts/marketing-agent.ts landing-hero --out drafts/hero.md
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

import { callOpenAI } from '../src/lib/council/openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in .env.local');
  process.exit(1);
}

const MODEL = process.env.MARKETING_MODEL || 'gpt-5.4';
const DEFAULT_OUT = path.resolve(__dirname, 'marketing-outputs.md');

type Task = 'tweet-thread' | 'blog-post' | 'landing-hero' | 'cold-email' | 'linkedin-post';

const TASK_BRIEFS: Record<Task, { format: string; constraints: string }> = {
  'tweet-thread': {
    format: 'A 6-8 tweet thread. Each tweet on its own line, prefixed with its index (e.g. "1/"). First tweet is the hook.',
    constraints: 'Each tweet ≤ 270 characters. No hashtags. One concrete detail per tweet. End with a soft CTA to jobsearch.quest.',
  },
  'blog-post': {
    format: 'A blog post with a title (H1), a one-sentence deck, 3-5 H2 sections, and a closing CTA.',
    constraints: '700-900 words. Lead with a real job-seeker pain. Cite the Never Search Alone methodology. Avoid generic SaaS language.',
  },
  'landing-hero': {
    format: 'Three distinct hero variants labeled A, B, C. Each has: headline (≤ 10 words), subhead (≤ 22 words), primary CTA (≤ 4 words).',
    constraints: 'Each variant takes a different angle (e.g. fear-of-searching-alone, speed, decision-quality). No jargon. No emojis.',
  },
  'cold-email': {
    format: 'A cold outreach email with subject line, 3-4 short paragraphs, and a single clear CTA.',
    constraints: 'Under 140 words total. Personal, specific, not salesy. Subject ≤ 6 words. No "I hope this finds you well".',
  },
  'linkedin-post': {
    format: 'A single LinkedIn post: strong opening line, 4-8 short paragraphs separated by blank lines, closing question or CTA.',
    constraints: '150-220 words. First line is a hook that stands alone in the feed. No hashtag spam (≤ 3 at the end, optional).',
  },
};

function parseArgs(argv: string[]) {
  const task = argv[2] as Task | undefined;
  const flags: Record<string, string> = {};
  for (let i = 3; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '');
    const value = argv[i + 1];
    if (key && value) flags[key] = value;
  }
  return { task, flags };
}

function readProjectContext(): string {
  const root = path.resolve(__dirname, '..');
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

function buildSystemPrompt(): string {
  return [
    'You are the marketing agent for jobsearch.quest, an AI-powered Job Search Council app.',
    'You write with the voice of a thoughtful operator: specific, concrete, warm, never hypey.',
    'You know the Never Search Alone methodology and reference it accurately when relevant.',
    'You avoid buzzwords ("leverage", "unlock", "revolutionize"), emojis, and generic SaaS copy.',
    'You never invent user testimonials, statistics, or features that are not in the project context.',
    'You return ONLY the requested artifact — no preambles, no meta commentary, no "Here is...".',
  ].join(' ');
}

function buildUserPrompt(task: Task, audience: string, tone: string, projectContext: string): string {
  const brief = TASK_BRIEFS[task];
  return [
    `TASK: Produce a ${task} for jobsearch.quest.`,
    `AUDIENCE: ${audience}`,
    `TONE: ${tone}`,
    ``,
    `FORMAT: ${brief.format}`,
    `CONSTRAINTS: ${brief.constraints}`,
    ``,
    `PROJECT CONTEXT:`,
    projectContext,
  ].join('\n');
}

function appendToOutput(outPath: string, task: Task, audience: string, tone: string, content: string) {
  const header = [
    ``,
    `---`,
    `## ${task} — ${new Date().toISOString()}`,
    `**Audience:** ${audience} · **Tone:** ${tone} · **Model:** ${MODEL}`,
    ``,
  ].join('\n');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.appendFileSync(outPath, header + content + '\n');
}

async function main() {
  const { task, flags } = parseArgs(process.argv);
  const validTasks = Object.keys(TASK_BRIEFS) as Task[];

  if (!task || !validTasks.includes(task)) {
    console.error(`Usage: npx tsx scripts/marketing-agent.ts <task> [--audience <a>] [--tone <t>] [--out <path>]`);
    console.error(`Tasks: ${validTasks.join(' | ')}`);
    process.exit(1);
  }

  const audience = flags.audience || 'mid-career job seekers who feel stuck searching alone';
  const tone = flags.tone || 'direct, warm, specific';
  const outPath = flags.out ? path.resolve(flags.out) : DEFAULT_OUT;

  const projectContext = readProjectContext();
  const system = buildSystemPrompt();
  const user = buildUserPrompt(task, audience, tone, projectContext);

  console.log(`[marketing-agent] task=${task} audience="${audience}" tone="${tone}" model=${MODEL}`);

  const result = await callOpenAI(
    OPENAI_API_KEY!,
    system,
    [{ role: 'user', content: user }],
    MODEL,
    undefined,
    { reasoningEffort: 'medium', maxOutputTokens: 2048 },
  );

  const content = (result.text || '').trim();
  if (!content) {
    console.error('[marketing-agent] empty response from model');
    process.exit(2);
  }

  console.log('\n' + content + '\n');
  appendToOutput(outPath, task, audience, tone, content);
  console.log(`[marketing-agent] appended to ${outPath} (latency ${result.latencyMs}ms)`);
}

main().catch((err) => {
  console.error('[marketing-agent] error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
