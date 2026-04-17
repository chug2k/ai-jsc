/**
 * Daily marketing routines. One per UTC day-of-week.
 *
 * Each routine is a pure config: a name, a goal, and a prompt builder.
 * The agent picks today's routine by day-of-week, runs the prompt through
 * the shared callOpenAI helper, and persists the result.
 *
 * Keep routines small and single-artifact — the agent is a daily drip,
 * not a campaign planner.
 */

export type RoutineName =
  | 'short_post'
  | 'linkedin_post'
  | 'landing_audit'
  | 'competitor_scan'
  | 'blog_draft'
  | 'weekly_review'
  | 'next_week_plan';

export interface RoutineContext {
  /** Recent outputs from prior runs — content + routine + age. Newest first. */
  recentOutputs: { routine: RoutineName; content: string; createdAt: string }[];
  /** PROJECT.md + DESIGN.md concatenated. */
  projectContext: string;
  /** Optional extra context passed in by the caller (e.g. today's date). */
  today: string;
}

export interface Routine {
  name: RoutineName;
  goal: string;
  /** Builds the user prompt. System prompt is shared across all routines. */
  buildPrompt: (ctx: RoutineContext) => string;
  /** Target output size. Used as maxOutputTokens. */
  maxTokens: number;
}

/** UTC day-of-week → routine. Sunday=0. */
const WEEKLY_SCHEDULE: Record<number, RoutineName> = {
  0: 'next_week_plan',
  1: 'short_post',
  2: 'linkedin_post',
  3: 'landing_audit',
  4: 'competitor_scan',
  5: 'blog_draft',
  6: 'weekly_review',
};

export function routineForDate(d: Date): RoutineName {
  return WEEKLY_SCHEDULE[d.getUTCDay()];
}

function recentOutputsBlock(ctx: RoutineContext, limit = 7): string {
  if (!ctx.recentOutputs.length) return '(no prior outputs yet)';
  return ctx.recentOutputs
    .slice(0, limit)
    .map((o) => `- [${o.createdAt.slice(0, 10)}] ${o.routine}: ${o.content.slice(0, 240).replace(/\n/g, ' ')}...`)
    .join('\n');
}

export const ROUTINES: Record<RoutineName, Routine> = {
  short_post: {
    name: 'short_post',
    goal: 'One X/Twitter post seeded with a concrete NSA methodology idea.',
    maxTokens: 512,
    buildPrompt: (ctx) =>
      [
        'ROUTINE: short_post',
        'Write ONE standalone post for X/Twitter. Not a thread. Not a reply.',
        '',
        'FORMAT: a single post, ≤ 270 characters, no hashtags, no emojis.',
        '- Lead with a concrete, specific observation about job searching.',
        '- Reference one real NSA concept (e.g. Mnookin Two-Pager, Gratitude House, Listening Tour, Hot Seat, Must-Nots vs Must-Haves).',
        '- End with a soft, implicit nod to jobsearch.quest — not a hard CTA.',
        '',
        'RECENT OUTPUTS (avoid repeating angles):',
        recentOutputsBlock(ctx),
        '',
        'PROJECT CONTEXT:',
        ctx.projectContext,
      ].join('\n'),
  },

  linkedin_post: {
    name: 'linkedin_post',
    goal: 'One LinkedIn post for mid-career professionals who are stuck searching alone.',
    maxTokens: 768,
    buildPrompt: (ctx) =>
      [
        'ROUTINE: linkedin_post',
        'Write ONE LinkedIn post. The first line is a hook that stands alone in the feed.',
        '',
        'FORMAT: 150-220 words, 4-8 short paragraphs separated by blank lines. No emojis.',
        'End with a question or a soft CTA. Optional ≤ 3 hashtags on the final line.',
        '',
        'SUBSTANCE:',
        '- A specific, hard-won insight about the job search — not a platitude.',
        '- Tie back to the idea of searching with a council (NSA methodology) without being salesy.',
        '',
        'RECENT OUTPUTS (avoid repeating angles):',
        recentOutputsBlock(ctx),
        '',
        'PROJECT CONTEXT:',
        ctx.projectContext,
      ].join('\n'),
  },

  landing_audit: {
    name: 'landing_audit',
    goal: 'Audit the landing copy against 3 conversion principles and propose concrete edits.',
    maxTokens: 1024,
    buildPrompt: (ctx) =>
      [
        'ROUTINE: landing_audit',
        'Audit the landing page copy represented in PROJECT.md against these 3 principles:',
        '  1) The first 5 seconds — does the hero promise a specific outcome?',
        '  2) Proof — does the page give a reader reason to trust the claim?',
        '  3) Friction — is the first action obvious and low-stakes?',
        '',
        'OUTPUT (plain markdown, no preamble):',
        '## Landing audit — <today>',
        '',
        'For each principle, 2-4 sentences of diagnosis, then 1-3 concrete edits as a bullet list.',
        'If a principle is already solid, say so briefly. Do not pad.',
        '',
        'PROJECT CONTEXT:',
        ctx.projectContext,
      ].join('\n'),
  },

  competitor_scan: {
    name: 'competitor_scan',
    goal: 'Sketch a 1-page note on how jobsearch.quest is positioned vs. adjacent products.',
    maxTokens: 1024,
    buildPrompt: (ctx) =>
      [
        'ROUTINE: competitor_scan',
        'Write a 1-page positioning note. You do not have live web access, so',
        'work from general knowledge of the category and from PROJECT.md.',
        '',
        'PICK 3 adjacent product categories (not specific brands) that a jobseeker might consider instead',
        '(e.g. "1:1 career coaches", "AI resume tools", "community-led job hunt groups").',
        '',
        'OUTPUT (plain markdown):',
        '## Positioning scan — <today>',
        '',
        'For each category, 3-5 sentences: what they offer, how jobsearch.quest is',
        'different, and the strongest claim we can make against them without overreaching.',
        '',
        'RECENT OUTPUTS:',
        recentOutputsBlock(ctx, 3),
        '',
        'PROJECT CONTEXT:',
        ctx.projectContext,
      ].join('\n'),
  },

  blog_draft: {
    name: 'blog_draft',
    goal: 'One 700-900 word blog post on a NSA exercise or concept.',
    maxTokens: 2048,
    buildPrompt: (ctx) =>
      [
        'ROUTINE: blog_draft',
        'Write ONE blog post. Pick ONE NSA exercise or concept (Mnookin Two-Pager,',
        'Gratitude House, Listening Tour, Candidate-Market Fit, Hot Seat, etc.) that',
        'has not been the primary subject of a recent output (see list below).',
        '',
        'FORMAT:',
        '- H1 title (no subtitle in the H1 itself)',
        '- One-sentence deck directly under the title',
        '- 3-5 H2 sections',
        '- Closing paragraph with a soft CTA (not a hard sell)',
        '- 700-900 words',
        '',
        'SUBSTANCE:',
        '- Lead with a real, specific job-seeker pain — not an abstract framing.',
        '- Explain the exercise in enough detail that a reader could try it alone.',
        '- Acknowledge why doing it with a council is materially better.',
        '- No invented stats. No fake quotes. No emojis.',
        '',
        'RECENT OUTPUTS (avoid repeating subjects):',
        recentOutputsBlock(ctx, 10),
        '',
        'PROJECT CONTEXT:',
        ctx.projectContext,
      ].join('\n'),
  },

  weekly_review: {
    name: 'weekly_review',
    goal: 'Review the week of outputs, score them, flag the top 1-2 to ship.',
    maxTokens: 1024,
    buildPrompt: (ctx) =>
      [
        'ROUTINE: weekly_review',
        'Review every output from the past 7 days (below). For each:',
        '  - Score 1-5 on: specificity, voice fit, likely resonance with the audience.',
        '  - One-sentence reason for each score.',
        '',
        'Then: flag the top 1-2 outputs to ship this coming week, and name ONE',
        'failure pattern you noticed across the week (e.g. "too abstract", "repeats same angle").',
        '',
        'OUTPUT (plain markdown, no preamble):',
        '## Weekly review — <today>',
        '',
        'PAST 7 DAYS OF OUTPUTS:',
        recentOutputsBlock(ctx, 14),
      ].join('\n'),
  },

  next_week_plan: {
    name: 'next_week_plan',
    goal: 'Propose themes + angles for the coming week based on recent outputs.',
    maxTokens: 1024,
    buildPrompt: (ctx) =>
      [
        'ROUTINE: next_week_plan',
        'Propose a coming-week plan. For each of the 6 daily content routines',
        '(short_post, linkedin_post, landing_audit, competitor_scan, blog_draft, weekly_review),',
        'suggest ONE specific angle or topic.',
        '',
        'Constraints:',
        '- Angles must not duplicate recent outputs (listed below).',
        '- Prefer angles that build on or react to what worked in the last 2 weeks.',
        '- Each suggestion: 1-2 sentences, concrete enough that the agent can execute without further direction.',
        '',
        'OUTPUT (plain markdown, no preamble):',
        '## Next week plan — <today>',
        '',
        'RECENT OUTPUTS:',
        recentOutputsBlock(ctx, 14),
        '',
        'PROJECT CONTEXT:',
        ctx.projectContext,
      ].join('\n'),
  },
};

export function getRoutine(name: RoutineName): Routine {
  const r = ROUTINES[name];
  if (!r) throw new Error(`Unknown routine: ${name}`);
  return r;
}
