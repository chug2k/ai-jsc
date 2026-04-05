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

/**
 * Full session agendas from the real Never Search Alone curriculum.
 * Source: Phyl Terry's first 10 agendas + Cassie Zawilski's detailed run-of-show (JSC 249).
 *
 * Maude gets the entire agenda as her run-of-show for the session.
 * She drives through it using move_to_phase, call_on, and create_commitment.
 */
export const SESSION_AGENDAS: Record<number, string> = {
  0: `SESSION 0: TRUST-BUILDING (First Meeting)
No homework. This is about opening up and building trust.

RUN OF SHOW:
1. CHECK-IN: Welcome everyone. Ask: "Where are you based? On a scale of 1-10, what's your level of energy right now?" Then: "What routines energize or restore you?"

2. INTRODUCTIONS (main exercise): This is the bulk of the session. Each person gets time to share:
   - Tell us about YOU. Your personal life. Your career.
   - How are you doing emotionally during your job search? Everyone has some level of fear, anxiety, insecurity — what about you?
   - Where are you in your job search process? What's your timeframe?
   - What type of support do you need or want?
   - How scary is it for you to join strangers to do this?
   Use call_on to give each council member a turn to respond to what the user shares.

3. REQUESTS FOR HELP: Address any RFHs that came up during introductions.

4. HOMEWORK: Read Chapters 1-3 of Never Search Alone. Think about what you want from this process.

5. CHECK-OUT: "What are you looking forward to this week?" Then close the session.`,

  1: `SESSION 1: CHARTER & EXTENDED INTRODUCTIONS
Pre-work: Read Chapters 1-3. Review the "Checklist If You Just Left or Lost Your Job."

RUN OF SHOW:
1. CHECK-IN: Welcome back. Ask: "What routines energize or restore you?" Emotional pulse 1-10. Professional updates.

2. EXTENDED INTRODUCTIONS: Each person shares:
   - What brought you to this community?
   - What role are you looking for?
   - Where are you in your search? What's your timeframe?
   - How are you feeling about your search?
   - What's one challenge you're experiencing?
   - What type of support do you need?
   Use call_on to have council members respond with their lens.

3. REQUESTS FOR HELP: Address any RFHs.

4. HOMEWORK: Read Chapter 4. Reflect on what you hate doing and what you don't want in your job to prep for the must-nots/must-haves exercise next session.

5. CHECK-OUT: One word for how you're leaving today.`,

  2: `SESSION 2: MNOOKIN TWO-PAGER — MUST-NOTS & MUST-HAVES
Pre-work: Read Chapter 4. Come ready to do the exercises.

RUN OF SHOW:
1. CHECK-IN: Ask: "What was a highlight from your past week?" Emotional pulse 1-10. Professional updates. Any RFHs?

2. EXERCISE — WHAT YOU HATE (AND LOVE) DOING:
   Ask the user:
   - What kinds of jobs, industries, and functions do you HATE doing?
   - What about past jobs did you DISLIKE?
   Then have them INVERT their list to what they LOVE doing.
   Use call_on to have council members react and probe.

3. EXERCISE — MUST-NOTS & MUST-HAVES:
   Ask the user:
   - What do you NOT want in your next job?
   - Have you ever had a bad job or bad boss? What did that teach you about what you don't want?
   Then INVERT the must-nots into must-haves.
   Have the user present their must-haves for discussion. Use call_on for feedback.
   Framework for feedback: "I like... I wish... I wonder..."

4. REQUESTS FOR HELP.

5. HOMEWORK: Draft your Mnookin Two-Pager. Schedule your first 3 Listening Tour calls.

6. CHECK-OUT: One word.`,

  3: `SESSION 3: MNOOKIN TWO-PAGER PRESENTATIONS
Pre-work: Draft your Mnookin Two-Pager and be ready to present.

RUN OF SHOW:
1. CHECK-IN: Ask: "What is one highlight from the past week?" Emotional pulse 1-10. Professional updates.

2. MNOOKIN PRESENTATIONS: The user presents their Mnookin Two-Pager.
   - Give them time to share their full two-pager: what they love/hate, must-haves, must-nots, career goals.
   - Then open it up for council feedback using call_on.
   - Feedback framework: "I like... I wish... I wonder..."
   - Ask: What might be missing? What should be edited? What resonates?

3. REQUESTS FOR HELP.

4. HOMEWORK: Revise your Mnookin with the council's feedback. Read Chapter 5 and complete the Gratitude House exercise. Schedule Listening Tour calls.

5. CHECK-OUT: "What surprised, encouraged, or inspired you about today?"`,

  4: `SESSION 4: GRATITUDE HOUSE
Pre-work: Revise Mnookin. Read Chapter 5. Complete the Gratitude House exercise. Schedule Listening Tour calls.

RUN OF SHOW:
1. CHECK-IN: Ask: "What did you want to be when you grew up?" Emotional pulse 1-10. Professional updates.

2. MNOOKIN REVISIONS (if needed): Quick check on any revised two-pagers. Time for feedback.

3. GRATITUDE HOUSE EXERCISE: The user shares insights from their Gratitude House exercise:
   - Who has helped your career?
   - What are you grateful for?
   - Who should you reach out to?
   - What surprises, learnings, or takeaways came from this exercise?
   Use call_on for council to react and connect dots.

4. REQUESTS FOR HELP.

5. HOMEWORK: Start your Listening Tour. Complete 3+ conversations and prepare to report back.

6. CHECK-OUT: One word.`,

  5: `SESSION 5: LISTENING TOUR (First Report-Back)
Pre-work: Read Chapters 6-8. Complete 3+ Listening Tour calls. Revise Mnookin. Schedule more calls.

RUN OF SHOW:
1. CHECK-IN: Ask: "What's one thing that brings you energy and joy lately?" Emotional pulse 1-10. Professional updates. Any help needed?

2. LISTENING TOUR EXERCISE: The user reports back on their conversations:
   - What surprised, encouraged, or inspired you from those calls?
   - Was there any challenging feedback to receive?
   - What has been the most useful job search advice you've received?
   - How have the insights from those calls informed what you're looking for?
   - What will you revise in your Mnookin Two-Pager as a result?
   - What questions or approaches have led to helpful feedback?
   Use call_on to have council members probe and connect dots.

3. REQUESTS FOR HELP.

4. HOMEWORK: Continue Listening Tour. Revise Mnookin based on what you're learning.

5. CHECK-OUT: "What are you most looking forward to over the next week?"`,

  6: `SESSION 6: LISTENING TOUR (Continued)
Pre-work: Continue Listening Tour. Revise Mnookin. Prepare to share insights.

RUN OF SHOW:
1. CHECK-IN: Ask: "If you could snap your fingers and have any new skill, what would you choose?" Emotional pulse 1-10. Professional updates.

2. LISTENING TOUR (continued): Same prompts as session 5 — what's new from recent conversations?
   - New surprises, challenging feedback, useful advice?
   - How are the insights changing what you're looking for?
   - What will you revise in your Mnookin?
   Use call_on for council feedback.

3. REQUESTS FOR HELP.

4. HOMEWORK: Read Chapter 9. Draft your 1-sentence job search strategy (Candidate-Market Fit).

5. CHECK-OUT: "Which of your strengths are you most grateful for?"`,

  7: `SESSION 7: CANDIDATE-MARKET FIT
Pre-work: Continue Listening Tour. Read Chapter 9. Draft CMF statements.

RUN OF SHOW:
1. CHECK-IN: Ask: "What did you do for your very first job? What stands out as you think back?" Emotional pulse 1-10. Professional updates.

2. LISTENING TOUR UPDATE: Brief check-in on recent conversations and Mnookin revisions.

3. CANDIDATE-MARKET FIT EXERCISE: The user presents their draft CMF statement for feedback.
   - Share your career goal (CMF statement) and what you learned from the Listening Tour.
   - Include any disconnect between what you want and what the market sees for you today.
   - Share your job search strategy and outline a multi-step plan if you can't get to your goal right away.
   Use call_on for council to pressure-test the CMF: Is it specific enough? Does it match market reality? What's missing?

4. REQUESTS FOR HELP.

5. HOMEWORK: Iterate on CMF. Read Chapter 10 and prepare for LinkedIn/resume rehab.

6. CHECK-OUT: "What is something you're looking forward to this weekend?"`,

  8: `SESSION 8: LINKEDIN/RESUME REHAB
Pre-work: Read Chapter 10. Prepare LinkedIn profile and resume for review. Bring CMF and Mnookin.

RUN OF SHOW:
1. CHECK-IN: Ask: "What is one highlight from your past week?" Emotional pulse 1-10. Professional updates.

2. CMF CHECK-IN: Quick round of updated CMF statements and feedback from council.

3. LINKEDIN/RESUME REHAB EXERCISE: Review the user's LinkedIn profile and resume against their CMF.
   - Does the headline/summary match their CMF?
   - Do the bullets show scope, outcomes, and seniority — or just tasks?
   - What signal does the profile send to a recruiter in 20 seconds?
   Use call_on for council to give specific, actionable feedback.

4. REQUESTS FOR HELP.

5. HOMEWORK: Update LinkedIn and resume. Set up Megibow Dashboard. Create target company list. Join networking groups.

6. CHECK-OUT: "What's something you're looking forward to this month?"`,

  9: `SESSION 9: NETWORKING
Pre-work: Read Chapter 11. Update your broader network. Set up Megibow Dashboard and Opportunity Screener. Create target company list.

RUN OF SHOW:
1. CHECK-IN: Ask: "What's something — an activity, a person, a place — that's giving you joy lately?" Emotional pulse 1-10. Professional updates.

2. NETWORKING EXERCISE: Share your networking strategy and resources.
   - Who are you reaching out to? What's your approach?
   - Review Megibow Dashboard.
   - Go back to Listening Tour contacts and share your CMF — turn them into Listening Posts.
   Note: Networking is one of the most difficult parts of the search, but with a strong CMF and a council behind you, you have the support to do it well.
   Use call_on for council to help with strategy and introductions.

3. REQUESTS FOR HELP.

4. HOMEWORK: Continue networking. Read Chapter 12 for interview prep.

5. CHECK-OUT: One word.`,

  10: `SESSION 10: INTERVIEW PREP
Pre-work: Read Chapter 12. Research companies you're interviewing with. Draft Job Mission with OKRs if interviewing.

RUN OF SHOW:
1. CHECK-IN: Ask: "What's something you're looking forward to?" Emotional pulse 1-10. Professional updates.

2. INTERVIEW PREP EXERCISE: Practice interview scenarios.
   - Paired interview prep: practice telling your story using your CMF.
   - Post-interview debrief: if you've had recent interviews, share what happened.
   - Begin drafting your Job Mission with OKRs if you have a specific employer in mind.
   Use call_on for council to give feedback on interview responses and strategy.

3. REQUESTS FOR HELP.

4. HOMEWORK: Continue interviewing. Re-read Chapters 13-14 on negotiation.

5. CHECK-OUT: One word.`,
};

/** Get the full session agenda. Sessions 11+ use a generic ongoing format. */
export function getSessionAgenda(sessionNumber: number): string {
  if (sessionNumber in SESSION_AGENDAS) return SESSION_AGENDAS[sessionNumber];
  return `SESSION ${sessionNumber}: ONGOING (Networking / Interviewing / Negotiating)
Continue the search. The council is here for whatever comes up.

RUN OF SHOW:
1. CHECK-IN: Personal prompt. Emotional pulse 1-10. Professional updates.
2. MAIN DISCUSSION: Bring your biggest request for help — a decision, a dilemma, interview prep, negotiation strategy, or anything you need.
3. REQUESTS FOR HELP.
4. HOMEWORK: Keep going. Bring your wins and challenges next time.
5. CHECK-OUT: One word.`;
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
