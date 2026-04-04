import { create } from 'zustand';
import { ARCHETYPES, REAL_PEOPLE, FOUNDERS_CIRCLE } from '@/lib/council/roster';
import { detectPhaseTransition } from '@/lib/council/phases';
import { track } from '@/lib/posthog';
import { extractCommitments } from '@/lib/commitments';

// @ts-nocheck — roster files are untyped JS ports

export interface Member {
  id: string;
  name: string;
  emoji: string;
  color: string;
  role: string;
  voice: string;
  challenge: string;
  real?: boolean;
  founders_circle?: boolean;
}

export interface Commitment {
  id: string;
  text: string;
  done: boolean;
  completed_at?: string | null;
  created_at: string;
  session_id?: string | null;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  memberName?: string | null;
}

export interface Session {
  id: string;
  started_at: string;
  ended_at?: string | null;
  phase: string;
  member_ids: string[];
}

interface UserProfile {
  id: string;
  name: string;
  search_status: string;
  context: string;
  plan: string;
}

interface PlanLimits {
  sessions_per_month: number | null;
  max_council_members: number;
  real_people_voices: boolean;
  custom_members: boolean;
  session_history: number | null;
  email_reminders: boolean;
  premium_models: boolean;
  byo_model: boolean;
  export_sessions: boolean;
}

interface SessionState {
  // User
  user: UserProfile | null;
  authUser: { email: string; name: string } | null;
  limits: PlanLimits | null;
  usage: { sessions_used: number };

  // Council
  selectedIds: string[];
  customMembers: Member[];
  councilConfigId: string | null;

  // Session
  currentSession: {
    dbId: string | null;
    phase: string;
    messages: Message[];
    memberIds: string[];
    hotSeatReady: boolean;
    sessionNumber: number;
  } | null;
  pastSessions: Session[];
  commitments: Commitment[];

  // UI
  isLoading: boolean;
  error: string | null;
  view: 'council' | 'session' | 'learn' | 'settings';

  // Actions
  init: () => Promise<void>;
  setView: (view: SessionState['view']) => void;
  toggleMember: (id: string) => boolean;
  addCustomMember: (member: Member) => void;
  updateUser: (fields: Partial<Pick<UserProfile, 'name' | 'search_status' | 'context'>>) => Promise<void>;
  startSession: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  toggleCommitment: (id: string) => Promise<void>;
  loadSessionHistory: (sessionId: string) => Promise<Message[]>;
}

function allMembers(customMembers: Member[]): Member[] {
  return [...(ARCHETYPES as Member[]), ...(REAL_PEOPLE as Member[]), ...(FOUNDERS_CIRCLE as Member[]), ...customMembers];
}

function memberById(id: string, customMembers: Member[]): Member | undefined {
  return allMembers(customMembers).find(m => m.id === id);
}

async function api(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API error: ${res.status}`);
  }
  return res.json();
}

/** Call /api/chat with dev model override if set */
async function chatApi(system: string, messages: unknown[]) {
  // Check for dev model override (set by DevToolbar)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const devModel = (useSessionStore.getState() as any)._devModel as string | undefined;
  return api('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ system, messages, ...(devModel ? { model: devModel } : {}) }),
  });
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  user: null,
  authUser: null,
  limits: null,
  usage: { sessions_used: 0 },
  selectedIds: ['facilitator', 'strategist', 'operator'],
  customMembers: [],
  councilConfigId: null,
  currentSession: null,
  pastSessions: [],
  commitments: [],
  isLoading: false,
  error: null,
  view: 'council',

  init: async () => {
    try {
      const [userData, councilData, sessions, commitments] = await Promise.all([
        api('/api/user'),
        api('/api/council'),
        api('/api/sessions'),
        api('/api/commitments'),
      ]);

      set({
        user: userData.user,
        authUser: userData.authUser,
        limits: userData.limits,
        usage: userData.usage,
        selectedIds: councilData.selected_ids || ['facilitator', 'strategist', 'operator'],
        customMembers: councilData.custom_members || [],
        councilConfigId: councilData.id || null,
        pastSessions: sessions,
        commitments: commitments,
      });
    } catch (err) {
      console.warn('Failed to init store:', err);
    }
  },

  setView: (view) => set({ view }),

  toggleMember: (id) => {
    const { selectedIds, limits } = get();
    const idx = selectedIds.indexOf(id);
    let newIds: string[];
    if (idx >= 0) {
      newIds = selectedIds.filter(x => x !== id);
    } else {
      const max = limits?.max_council_members ?? 5;
      if (selectedIds.length >= max) return false;
      newIds = [...selectedIds, id];
    }
    set({ selectedIds: newIds });
    // Persist in background
    api('/api/council', {
      method: 'PUT',
      body: JSON.stringify({ selectedIds: newIds, customMembers: get().customMembers }),
    }).catch(console.warn);
    return true;
  },

  addCustomMember: (member) => {
    const { customMembers, selectedIds } = get();
    const newMembers = [...customMembers, member];
    set({ customMembers: newMembers });
    api('/api/council', {
      method: 'PUT',
      body: JSON.stringify({ selectedIds, customMembers: newMembers }),
    }).catch(console.warn);
  },

  updateUser: async (fields) => {
    await api('/api/user', { method: 'PATCH', body: JSON.stringify(fields) });
    set((s) => ({ user: s.user ? { ...s.user, ...fields } : s.user }));
  },

  startSession: async () => {
    const { selectedIds, pastSessions } = get();
    set({ error: null });

    // Check for an unfinished session (phase !== 'done')
    const unfinished = pastSessions.find(s => s.phase !== 'done');
    if (unfinished) {
      // Resume it
      const messages = await api(`/api/messages?sessionId=${unfinished.id}`);
      const sessionIndex = pastSessions.indexOf(unfinished);
      set({
        currentSession: {
          dbId: unfinished.id,
          phase: unfinished.phase || 'checkin',
          messages: (messages || []).map((m: { role: string; content: string; member_name?: string }) => ({
            role: m.role,
            content: m.content,
            memberName: m.member_name || null,
          })),
          memberIds: unfinished.member_ids || selectedIds,
          hotSeatReady: false,
          sessionNumber: sessionIndex,
        },
        view: 'session',
      });
      return;
    }

    // Create new session
    const memberIds = [...selectedIds];
    const sessionNumber = pastSessions.length;

    try {
      const session = await api('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ memberIds }),
      });
      const sessionId = session.id;

      set({
        currentSession: {
          dbId: sessionId,
          phase: 'checkin',
          messages: [],
          memberIds,
          hotSeatReady: false,
          sessionNumber,
        },
        view: 'session',
      });

      track('session_started', { member_count: memberIds.length, member_ids: memberIds });

      // Send initial AI message
      await get().sendMessage('__INIT__');
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  sendMessage: async (text) => {
    const state = get();
    if (!state.currentSession || state.isLoading) return;
    set({ isLoading: true });

    const { currentSession, selectedIds, customMembers, user } = state;
    const { phase, messages, memberIds } = currentSession;
    const members = memberIds.map(id => memberById(id, customMembers)).filter(Boolean) as Member[];
    const lead = members.find(m => m.id === 'facilitator') || members[0];

    const isInit = text === '__INIT__';
    const userMsg = isInit ? 'Begin the JSC session.' : text;

    // Add user message to local state (unless init)
    if (!isInit) {
      const userMessage: Message = { role: 'user', content: text };
      set((s) => ({
        currentSession: s.currentSession ? {
          ...s.currentSession,
          messages: [...s.currentSession.messages, userMessage],
        } : null,
      }));
      // Persist user message
      if (currentSession.dbId) {
        api('/api/messages', {
          method: 'POST',
          body: JSON.stringify({
            sessionId: currentSession.dbId,
            role: 'user',
            content: text,
            phase,
          }),
        }).catch(console.warn);
      }
    } else {
      // Store seed message for history continuity
      set((s) => ({
        currentSession: s.currentSession ? {
          ...s.currentSession,
          messages: [{ role: 'user', content: userMsg }],
        } : null,
      }));
    }

    // Build message history for API
    const currentMessages = get().currentSession?.messages || [];

    // Determine if hot seat multi-member
    const isHotSeatActive = phase === 'hot_seat' && currentSession.hotSeatReady && !isInit;

    const { buildModeratorPrompt, buildWrapupPrompt, buildMemberPrompt } = await import('@/lib/council/prompts');

    const ctx = {
      userName: user?.name || 'Friend',
      searchStatus: user?.search_status || 'slow',
      userContext: user?.context || '',
      commitments: state.commitments.filter(c => !c.done).map(c => ({ text: c.text })),
      sessionNumber: currentSession.sessionNumber,
    };

    try {
      if (isHotSeatActive) {
        // Each member responds
        for (const member of members) {
          const sys = buildMemberPrompt(member, members, ctx);
          const directive = {
            role: 'user' as const,
            content: `The user just said on the hot seat: "${userMsg}"\n\nNow respond as ${member.name} — your unique lens only, 2–4 sentences. Don't repeat what other council members have already said. No pleasantries. Get to the point.`,
          };
          const history = get().currentSession?.messages.slice(-20) || [];
          const { text: aiText } = await chatApi(sys, [...history, directive]);
          if (aiText) {
            const msg: Message = { role: 'assistant', content: `[${member.name}] ${aiText}`, memberName: member.name };
            set((s) => ({
              currentSession: s.currentSession ? {
                ...s.currentSession,
                messages: [...s.currentSession.messages, msg],
              } : null,
            }));
            if (currentSession.dbId) {
              api('/api/messages', {
                method: 'POST',
                body: JSON.stringify({ sessionId: currentSession.dbId, role: 'assistant', content: msg.content, memberName: member.name, phase }),
              }).catch(console.warn);
            }
          }
        }
        // Moderator wrap-up
        const wrapSys = buildWrapupPrompt(lead, members, ctx);
        const history = get().currentSession?.messages.slice(-20) || [];
        const { text: wrapText } = await chatApi(wrapSys, history);
        if (wrapText) {
          const msg: Message = { role: 'assistant', content: `[${lead.name}] ${wrapText}`, memberName: lead.name };
          set((s) => ({
            currentSession: s.currentSession ? {
              ...s.currentSession,
              messages: [...s.currentSession.messages, msg],
            } : null,
          }));
          advancePhase(wrapText, get, set);
        }
      } else {
        // Moderator turn
        const sys = buildModeratorPrompt(lead, members, phase, ctx);
        const { text: aiText } = await chatApi(sys, currentMessages);
        if (aiText) {
          const msg: Message = { role: 'assistant', content: `[${lead.name}] ${aiText}`, memberName: lead.name };
          set((s) => ({
            currentSession: s.currentSession ? {
              ...s.currentSession,
              messages: [...s.currentSession.messages, msg],
            } : null,
          }));
          if (currentSession.dbId) {
            api('/api/messages', {
              method: 'POST',
              body: JSON.stringify({ sessionId: currentSession.dbId, role: 'assistant', content: msg.content, memberName: lead.name, phase }),
            }).catch(console.warn);
          }
          advancePhase(aiText, get, set);
          // Mark hot seat ready after moderator asks
          if (phase === 'hot_seat' && !currentSession.hotSeatReady && !isInit) {
            set((s) => ({
              currentSession: s.currentSession ? { ...s.currentSession, hotSeatReady: true } : null,
            }));
          }
        }
      }
    } catch (err) {
      console.error('AI call failed:', err);
    }

    set({ isLoading: false });
  },

  toggleCommitment: async (id) => {
    const { commitments } = get();
    const c = commitments.find(c => c.id === id);
    if (!c) return;
    const newDone = !c.done;
    set({
      commitments: commitments.map(c =>
        c.id === id ? { ...c, done: newDone, completed_at: newDone ? new Date().toISOString() : null } : c
      ),
    });
    api('/api/commitments', {
      method: 'PATCH',
      body: JSON.stringify({ id, done: newDone }),
    }).catch(console.warn);
  },

  loadSessionHistory: async (sessionId) => {
    const messages = await api(`/api/messages?sessionId=${sessionId}`);
    return messages;
  },
}));

function advancePhase(
  aiText: string,
  get: () => SessionState,
  set: (fn: (s: SessionState) => Partial<SessionState>) => void
) {
  const session = get().currentSession;
  if (!session) return;
  const userMsgCount = session.messages.filter(m => m.role === 'user').length;
  const next = detectPhaseTransition(session.phase, aiText, userMsgCount);
  if (next !== session.phase) {
    track('phase_advanced', { from: session.phase, to: next });
    set((s) => ({
      currentSession: s.currentSession ? {
        ...s.currentSession,
        phase: next,
        hotSeatReady: next === 'hot_seat' ? false : s.currentSession.hotSeatReady,
      } : null,
    }));
    // Sync phase to server
    if (session.dbId) {
      api(`/api/sessions`, {
        method: 'PATCH',
        body: JSON.stringify({ id: session.dbId, phase: next }),
      }).catch(console.warn);
    }
  }

  // Extract commitments from AI text
  const texts = extractCommitments(aiText);
  {
    if (texts.length) {
      api('/api/commitments', {
        method: 'POST',
        body: JSON.stringify({ texts, sessionId: session.dbId }),
      }).then((newCommitments) => {
        set((s) => ({ commitments: [...newCommitments, ...s.commitments] }));
      }).catch(console.warn);
    }
  }
}

export { allMembers, memberById };
