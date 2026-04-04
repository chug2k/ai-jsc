/**
 * Session phases — the 5-part JSC meeting structure.
 *
 * Based on the real Never Search Alone methodology:
 * 1. Check-In (personal prompt + emotional pulse + updates)
 * 2. Exercise (varies by session number — see SESSION_THEMES)
 * 3. Hot Seat / RFH (requests for help — the council weighs in)
 * 4. Commitments (what will you do before next session?)
 * 5. Checkout (closing word)
 *
 * See docs/jsc-research.md for sources.
 */

export const PHASE_ORDER = [
  'checkin',
  'exercise',
  'hot_seat',
  'commitments',
  'checkout',
  'done',
];

export const PHASE_LABELS: Record<string, string> = {
  checkin: 'Check-In',
  exercise: 'Exercise',
  hot_seat: 'Hot Seat',
  commitments: 'Commitments',
  checkout: 'Check-Out',
  done: 'Session Complete',
};

/**
 * Session themes from the Never Search Alone curriculum.
 * Session number maps to theme + exercise focus.
 */
export interface SessionTheme {
  name: string;
  exercise: string;
  description: string;
  homework: string;
}

export const SESSION_THEMES: Record<number, SessionTheme> = {
  0: {
    name: 'Trust-Building',
    exercise: 'Getting to know each other — your story, your emotional landscape, what brought you here.',
    description: 'This is your first session. No homework, no pressure. Just open up and talk about where you are.',
    homework: 'Read Chapters 1-3 of Never Search Alone. Think about what you want from this process.',
  },
  1: {
    name: 'Your Story & Goals',
    exercise: 'Extended introduction — your career so far, what role you\'re looking for, your timeframe, and what support you need.',
    description: 'Let\'s establish what you\'re working toward and what kind of help would be most valuable.',
    homework: 'Read Chapter 4 of Never Search Alone. Reflect on what you hate doing and what you don\'t want in your next job.',
  },
  2: {
    name: 'Must-Nots & Must-Haves',
    exercise: 'The Mnookin Two-Pager exercises — what you hate doing (then invert to what you love), what you don\'t want (then invert to must-haves).',
    description: 'Before you can find the right job, you need to know what you don\'t want. We\'ll work through this together.',
    homework: 'Complete your Mnookin Two-Pager draft. Schedule your first 3 Listening Tour calls.',
  },
  3: {
    name: 'Mnookin Two-Pager Review',
    exercise: 'Present your Mnookin Two-Pager — what you love/hate doing, must-haves, must-nots, career goals. The council gives feedback.',
    description: 'Share your Two-Pager with the council for feedback. What resonates? What\'s missing? What needs sharpening?',
    homework: 'Revise your Two-Pager. Read Chapter 5 and complete the Gratitude House exercise.',
  },
  4: {
    name: 'Gratitude House',
    exercise: 'Share results of your Gratitude House exercise — who has helped your career, what you\'re grateful for, who to reach out to.',
    description: 'The Gratitude House exercise builds your Listening Tour contact list and boosts confidence.',
    homework: 'Start your Listening Tour. Complete 3+ conversations and prepare to share what you learned.',
  },
  5: {
    name: 'Listening Tour',
    exercise: 'Report back on your Listening Tour conversations. What surprised you? What challenging feedback did you get? How has it changed what you\'re looking for?',
    description: 'Your Listening Tour conversations are where the real learning happens. Let\'s dig into what you\'re hearing.',
    homework: 'Continue Listening Tour. Revise your Mnookin based on what you\'re learning.',
  },
  6: {
    name: 'Listening Tour (continued)',
    exercise: 'Continue sharing insights from Listening Tour. What patterns are emerging? What will you revise in your Mnookin?',
    description: 'More conversations, more insights. Let\'s see how the picture is coming together.',
    homework: 'Read Chapter 9. Draft your 1-sentence job search strategy (Candidate-Market Fit).',
  },
  7: {
    name: 'Candidate-Market Fit',
    exercise: 'Present your Candidate-Market Fit statement — a 1-sentence job search strategy. The council pressure-tests it.',
    description: 'Your CMF is where your aspirations meet market reality. Let\'s make sure it\'s honest and actionable.',
    homework: 'Iterate on CMF. Read Chapter 10 and prepare for LinkedIn/resume rehab.',
  },
  8: {
    name: 'LinkedIn/Resume Rehab',
    exercise: 'Review your LinkedIn profile and resume against your Candidate-Market Fit. What\'s aligned? What\'s sending the wrong signal?',
    description: 'Your resume says something about you — let\'s make sure it\'s saying the right thing.',
    homework: 'Update LinkedIn and resume. Set up Megibow Dashboard. Create target company list.',
  },
  9: {
    name: 'Networking',
    exercise: 'Share your networking plans and resources. Review Megibow Dashboard. Go back to Listening Tour contacts and share your CMF.',
    description: 'Networking is the hardest part — but now you have a strong CMF and a council behind you.',
    homework: 'Continue networking. Read Chapter 12 for interview prep.',
  },
  10: {
    name: 'Interview Prep',
    exercise: 'Practice interview scenarios. Begin drafting your Job Mission with OKRs if interviewing.',
    description: 'Let\'s prepare you to walk into interviews with confidence and a clear narrative.',
    homework: 'Continue interviewing. Re-read Chapters 13-14 on negotiation.',
  },
};

/** Get the theme for a session number. Sessions 11+ reuse the "ongoing" format. */
export function getSessionTheme(sessionNumber: number): SessionTheme {
  if (sessionNumber in SESSION_THEMES) return SESSION_THEMES[sessionNumber];
  // Sessions 11+ are ongoing networking/interviewing/negotiation
  return {
    name: 'Ongoing',
    exercise: 'Check in on your search progress. Bring your biggest request for help — a decision, a dilemma, interview prep, negotiation strategy, whatever you need.',
    description: 'You\'re deep in the search now. The council is here to help with whatever comes up.',
    homework: 'Keep going. Bring your wins and your challenges next time.',
  };
}

/** Personal check-in prompts, one per session (from Cassie's doc) */
export const CHECKIN_PROMPTS: Record<number, string> = {
  0: 'Tell me about you — your life, your career, how you\'re feeling about your job search.',
  1: 'What routines energize or restore you?',
  2: 'What was a highlight from your past week?',
  3: 'What is one highlight from the past week?',
  4: 'What did you want to be when you grew up?',
  5: 'What\'s one thing that brings you energy and joy lately?',
  6: 'If you could snap your fingers and have any new skill, what would you choose?',
  7: 'What did you do for your very first job? What stands out as you think back?',
  8: 'What is one highlight from your past week?',
  9: 'What\'s something — an activity, a person, a place — that\'s giving you joy lately?',
  10: 'What\'s something you\'re looking forward to?',
};

export function getCheckinPrompt(sessionNumber: number): string {
  if (sessionNumber in CHECKIN_PROMPTS) return CHECKIN_PROMPTS[sessionNumber];
  return 'What\'s been on your mind lately — outside of the job search?';
}

export const PHASE_HINTS: Record<string, { placeholder: string; chips: string[] }> = {
  checkin: {
    placeholder: 'Share how you\'re doing — personally and professionally.',
    chips: ['Things are good', 'It\'s been a week', 'Some updates to share'],
  },
  exercise: {
    placeholder: 'Work through today\'s exercise with the council.',
    chips: ['Ready to dive in', 'I have some thoughts', 'I need help with this'],
  },
  hot_seat: {
    placeholder: 'What\'s the thing you\'d like the council\'s perspective on?',
    chips: ['I have a specific dilemma', 'Weighing a decision', 'Something\'s been on my mind'],
  },
  commitments: {
    placeholder: 'What feels like the right next step? What will you do before next session?',
    chips: ['I have a couple ideas', 'Help me think through this', 'One clear thing'],
  },
  checkout: {
    placeholder: 'One word — how are you leaving today\'s session?',
    chips: ['Energized', 'Clear', 'Determined', 'Hopeful', 'Grounded', 'Lighter'],
  },
  done: {
    placeholder: 'Session complete.',
    chips: [],
  },
};

/**
 * Detect phase transitions from moderator text.
 * Returns the next phase key, or the current one if no transition detected.
 */
export function detectPhaseTransition(currentPhase: string, aiText: string, messageCount: number): string {
  const t = aiText.toLowerCase();

  switch (currentPhase) {
    case 'checkin':
      // Transition to exercise when the moderator introduces today's exercise/topic
      if (t.includes('exercise') || t.includes('today\'s topic') || t.includes('let\'s work on')
        || t.includes('let\'s dig into') || t.includes('let\'s get into')
        || t.includes('today we\'re going to') || t.includes('main topic')
        || t.includes('mnookin') || t.includes('must-haves') || t.includes('must-nots')
        || t.includes('gratitude house') || t.includes('listening tour')
        || t.includes('candidate-market fit') || t.includes('linkedin')
        || t.includes('networking') || t.includes('interview prep'))
        return 'exercise';
      break;
    case 'exercise':
      // Transition to hot seat when the moderator opens it up for RFH
      if (t.includes('hot seat') || t.includes('request for help')
        || t.includes('council\'s perspective') || t.includes('council weigh in')
        || t.includes('bring to the council') || t.includes('anything else')
        || t.includes('what do you need help with'))
        return 'hot_seat';
      break;
    case 'hot_seat':
      // Transition to commitments
      if (t.includes('commit') || t.includes('next step') || t.includes('before next session')
        || t.includes('what will you do') || t.includes('action') || t.includes('homework'))
        return 'commitments';
      break;
    case 'commitments':
      // Transition to checkout after commitments are captured
      if (t.includes('commitments_block_end'))
        return 'checkout';
      break;
    case 'checkout':
      // Transition to done after closing word
      if ((t.includes('session') || t.includes('see you') || t.includes('next time')
        || t.includes('great work') || t.includes('good work')) && messageCount > 5)
        return 'done';
      break;
  }

  return currentPhase;
}
