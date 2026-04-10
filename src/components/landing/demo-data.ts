import type { Member, Message } from '@/stores/session-store';

/**
 * Static demo data for landing-page session previews.
 * Sourced from real simulation transcripts so the marketing surface
 * mirrors the actual app voice and member identities.
 */

const blank = { voice: '', challenge: '' };

const ELI: Member = { id: 'strategist', name: 'Eli', emoji: '\uD83D\uDDFA\uFE0F', color: '#818cf8', role: 'Career Arc Advisor', ...blank };
const JUNE: Member = { id: 'operator', name: 'June', emoji: '\u2699\uFE0F', color: '#f59e0b', role: 'Action Partner', ...blank };
const RINA: Member = { id: 'devils_advocate', name: 'Rina', emoji: '\uD83D\uDE08', color: '#ef4444', role: 'Assumption Checker', ...blank };
const SAM: Member = { id: 'therapist', name: 'Sam', emoji: '\uD83E\uDE9E', color: '#e879f9', role: 'Emotional Compass', ...blank };
const KAI: Member = { id: 'interview_coach', name: 'Kai', emoji: '\uD83C\uDFAF', color: '#f97316', role: 'Interview Coach', ...blank };
const MAUDE: Member = { id: 'facilitator', name: 'Maude', emoji: '\uD83D\uDCCB', color: '#4ade80', role: 'Moderator', moderator: true, ...blank };

export interface DemoSession {
  scenarioLabel: string;
  headline: string;
  phase: string;
  userName: string;
  members: Member[];
  messages: Message[];
}

export const HERO_DEMO: DemoSession = {
  scenarioLabel: 'Session 0 \u00b7 Hot Seat',
  headline: '"I\u2019ve been at my job for 6 years and I can\u2019t tell if I\u2019m stuck or just comfortable."',
  phase: 'hot_seat',
  userName: 'You',
  members: [MAUDE, ELI, RINA, SAM, JUNE],
  messages: [
    { role: 'user', content: "I've been at my job for 6 years and I can't tell if I'm stuck or just comfortable." },
    { role: 'assistant', memberName: 'Maude', content: "That's a useful distinction. Council \u2014 what do you hear?" },
    { role: 'assistant', memberName: 'Eli', content: "The difference is whether the comfort is building something or just protecting you from the uncertainty of change." },
    { role: 'assistant', memberName: 'Rina', content: "What if 'comfortable' is just a nicer word for 'afraid to test whether you're still growing'?" },
    { role: 'assistant', memberName: 'Sam', content: "You said 'can't tell' \u2014 not 'I'm happy' or 'I want to leave.' That in-between is where most people get stuck." },
    { role: 'assistant', memberName: 'June', content: "Have 3 conversations with people in roles you'd want. If none excite you, you have your answer." },
  ],
};

export const RAY_DEMO: DemoSession = {
  scenarioLabel: 'Session 1 \u00b7 Check-In',
  headline: "Ray has been saying he'll explore climate tech for a year. His council won't let that slide.",
  phase: 'checkin',
  userName: 'Ray',
  members: [MAUDE, RINA, JUNE],
  messages: [
    { role: 'user', content: "I think I've been using my family as an excuse not to act. Like, \u201cI can't take risks because of them\u201d \u2014 but maybe the real risk is spending another decade somewhere that's slowly killing my motivation." },
    { role: 'assistant', memberName: 'Rina', content: "It may not be family holding you back so much as the story that \u201cgood fathers don't change.\u201d Avoidance can masquerade as responsibility. If you never test a path forward, you may be teaching caution, but also teaching resignation." },
    { role: 'assistant', memberName: 'June', content: "Your wife doesn't want you to stay stuck \u2014 she wants a plan with numbers. Pull three months of essential spending tonight. That's the first input for a bridge plan she can actually react to." },
  ],
};

export const DEREK_DEMO: DemoSession = {
  scenarioLabel: 'Session 0 \u00b7 Trust-Building',
  headline: "Derek got fired from his first job. He's ashamed to tell his parents.",
  phase: 'checkin',
  userName: 'Derek',
  members: [MAUDE, SAM, KAI],
  messages: [
    { role: 'user', content: "The worst part is telling my parents. They came here from Korea with nothing. They worked 80-hour weeks so I could go to college. And I got fired from my first real job." },
    { role: 'assistant', memberName: 'Sam', content: "The loss here isn't just the job \u2014 it's the shock of realizing the rules you lived by didn't protect you in this setting." },
    { role: 'assistant', memberName: 'Kai', content: "You can tell your parents: \u201cYour sacrifices matter to me, and this is painful, but I'm treating it as feedback and building a plan.\u201d That honors their sacrifice without inviting a shame spiral." },
  ],
};

export const SOFIA_DEMO: DemoSession = {
  scenarioLabel: 'Session 4 \u00b7 Gratitude House',
  headline: "Sofia has been avoiding calling the one person who could actually help.",
  phase: 'hot_seat',
  userName: 'Sofia',
  members: [MAUDE, ELI, RINA],
  messages: [
    { role: 'user', content: "I need to talk to Diane. I've been avoiding it because I think she'll push me and I'm not ready to be pushed. But maybe that's exactly why I should call her." },
    { role: 'assistant', memberName: 'Eli', content: "The mentors who unsettle us most are usually the ones closest to the truth we already sense. The task is not to let her push you, but to let her help you name the shape of the next chapter." },
    { role: 'assistant', memberName: 'Rina', content: "\u201cShe'll push me\u201d can become a reason to keep the door half-open without ever testing the conversation. Call Diane with one specific ask: where did she see your work have structural leverage? Don't ask her to solve your whole next move in one call." },
  ],
};
