import { create } from 'zustand';
import { ARCHETYPES, REAL_PEOPLE, FOUNDERS_CIRCLE } from '@/lib/council/roster';
import { getNextPhase } from '@/lib/council/phases';
import { track } from '@/lib/posthog';

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
  moderator?: boolean;
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
  replyTo?: { memberName: string | null; content: string; index: number } | null;
}

export interface Session {
  id: string;
  started_at: string;
  ended_at?: string | null;
  phase: string;
  member_ids: string[];
  summary?: string | null;
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
    hotSeatReady?: boolean;
    sessionNumber: number;
    turnsInPhase: number;
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
  advancePhase: () => void;
  sendMessage: (text: string, replyTo?: { memberName: string | null; content: string; index: number } | null) => Promise<void>;
  toggleCommitment: (id: string) => Promise<void>;
  loadSessionHistory: (sessionId: string) => Promise<Message[]>;
}

function allMembers(customMembers: Member[]): Member[] {
  return [...(ARCHETYPES as Member[]), ...(REAL_PEOPLE as Member[]), ...(FOUNDERS_CIRCLE as Member[]), ...customMembers];
}

/** Ensure facilitator is included and strip any IDs that don't exist in the roster. */
function ensureFacilitator(ids: string[], customMembers: Member[] = []): string[] {
  const validIds = new Set(allMembers(customMembers).map(m => m.id));
  const cleaned = ids.filter(id => validIds.has(id));
  return cleaned.includes('facilitator') ? cleaned : ['facilitator', ...cleaned];
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

/** Stream council session via SSE from /api/chat/council */
async function streamCouncil(
  payload: {
    sessionId: string | null;
    message: string;
    memberIds: string[];
    phase: string;
    sessionNumber: number;
    turnsInPhase: number;
    replyToMember?: string;
    isInit: boolean;
  },
  handlers: {
    onMessage: (msg: { role: string; content: string; memberName?: string | null }) => void;
    onPhaseChange: (phase: string, message: string) => void;
    onCommitment: (text: string, deadline?: string) => void;
    onCallOn: (memberName: string, prompt: string) => void;
    onEndSession: (message: string) => void;
    onError: (message: string) => void;
  },
) {
  const res = await fetch('/api/chat/council', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API error: ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    let currentEvent = '';
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7);
      } else if (line.startsWith('data: ') && currentEvent) {
        const data = JSON.parse(line.slice(6));
        switch (currentEvent) {
          case 'message': handlers.onMessage(data); break;
          case 'phase_change': handlers.onPhaseChange(data.phase, data.message); break;
          case 'commitment': handlers.onCommitment(data.text, data.deadline); break;
          case 'call_on': handlers.onCallOn(data.memberName, data.prompt); break;
          case 'end_session': handlers.onEndSession(data.message); break;
          case 'error': handlers.onError(data.message); break;
          case 'done': break;
        }
        currentEvent = '';
      }
    }
  }
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  user: null,
  authUser: null,
  limits: null,
  usage: { sessions_used: 0 },
  selectedIds: ['facilitator', 'strategist', 'operator', 'devils_advocate'],
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
        selectedIds: ensureFacilitator(councilData.selected_ids || ['facilitator', 'strategist', 'operator'], councilData.custom_members || []),
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
    // Facilitator is always in the session — can't be removed
    if (id === 'facilitator') return false;
    const { selectedIds, limits } = get();
    const idx = selectedIds.indexOf(id);
    let newIds: string[];
    if (idx >= 0) {
      newIds = selectedIds.filter(x => x !== id);
    } else {
      // Max count excludes the facilitator (they're always there)
      const nonModeratorCount = selectedIds.filter(x => x !== 'facilitator').length;
      const max = limits?.max_council_members ?? 5;
      if (nonModeratorCount >= max) return false;
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
          turnsInPhase: 0,
        },
        view: 'session',
      });
      return;
    }

    // Create new session — facilitator is always included
    const memberIds = selectedIds.includes('facilitator')
      ? [...selectedIds]
      : ['facilitator', ...selectedIds];
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
          turnsInPhase: 0,
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

  advancePhase: () => {
    const { currentSession } = get();
    if (!currentSession || currentSession.phase === 'done') return;
    const next = getNextPhase(currentSession.phase);
    if (!next) return;
    set((s) => ({
      currentSession: s.currentSession ? { ...s.currentSession, phase: next, turnsInPhase: 0 } : null,
    }));
    if (currentSession.dbId) {
      api('/api/sessions', {
        method: 'PATCH',
        body: JSON.stringify({ id: currentSession.dbId, phase: next }),
      }).catch(console.warn);
    }
  },

  sendMessage: async (text, replyTo) => {
    const state = get();
    if (!state.currentSession || state.isLoading) return;
    set({ isLoading: true });

    const { currentSession, customMembers, user } = state;
    const { phase, memberIds } = currentSession;
    const members = memberIds.map(id => memberById(id, customMembers)).filter(Boolean) as Member[];

    const isInit = text === '__INIT__';
    const userMsg = isInit ? 'Begin the JSC session.' : text;

    // Add user message to local state for instant UI feedback (DB persist is now server-side)
    if (!isInit) {
      const userMessage: Message = { role: 'user', content: text, replyTo: replyTo || null };
      set((s) => ({
        currentSession: s.currentSession ? {
          ...s.currentSession,
          messages: [...s.currentSession.messages, userMessage],
          turnsInPhase: (s.currentSession.turnsInPhase || 0) + 1,
        } : null,
      }));
    } else {
      set((s) => ({
        currentSession: s.currentSession ? {
          ...s.currentSession,
          messages: [{ role: 'user', content: userMsg }],
        } : null,
      }));
    }

    try {
      const replyToMemberId = replyTo?.memberName
        ? members.find(m => m.name === replyTo.memberName)?.id
        : undefined;

      await streamCouncil(
        {
          sessionId: currentSession.dbId,
          message: userMsg,
          memberIds,
          phase,
          sessionNumber: currentSession.sessionNumber,
          turnsInPhase: currentSession.turnsInPhase || 0,
          replyToMember: replyToMemberId,
          isInit,
        },
        {
          onMessage: (msg) => {
            const message: Message = { role: msg.role as 'user' | 'assistant', content: msg.content, memberName: msg.memberName };
            set((s) => ({
              currentSession: s.currentSession ? {
                ...s.currentSession,
                messages: [...s.currentSession.messages, message],
              } : null,
            }));
          },
          onPhaseChange: (newPhase, _message) => {
            track('phase_advanced', { from: get().currentSession?.phase, to: newPhase });
            set((s) => ({
              currentSession: s.currentSession ? { ...s.currentSession, phase: newPhase, turnsInPhase: 0 } : null,
            }));
          },
          onCommitment: (text, deadline) => {
            if (currentSession.dbId) {
              api('/api/commitments', {
                method: 'POST',
                body: JSON.stringify({ texts: [`${text}${deadline ? ` (by ${deadline})` : ''}`], sessionId: currentSession.dbId }),
              }).then((newCommitments) => {
                set((s) => ({ commitments: [...newCommitments, ...s.commitments] }));
              }).catch(console.warn);
            }
          },
          onCallOn: (memberName, _prompt) => {
            console.log(`[engine] Maude called on ${memberName}`);
          },
          onEndSession: (_message) => {
            set((s) => ({
              currentSession: s.currentSession ? { ...s.currentSession, phase: 'done' } : null,
            }));
            if (currentSession.dbId) {
              api('/api/sessions/summarize', {
                method: 'POST',
                body: JSON.stringify({ sessionId: currentSession.dbId }),
              }).then((res) => {
                if (res.summary) console.log('[summary] Generated:', res.summary.substring(0, 100) + '...');
              }).catch(console.warn);
            }
          },
          onError: (message) => {
            console.error('[council] Server error:', message);
          },
        },
      );
    } catch (err) {
      console.error('Council stream failed:', err);
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

export { allMembers, memberById };
