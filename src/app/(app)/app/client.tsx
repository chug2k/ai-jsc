'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { identify, track } from '@/lib/posthog';
import Header from '@/components/ui/Header';
import CouncilBuilder from '@/components/council/CouncilBuilder';
import SessionView from '@/components/session/SessionView';
import LearnView from '@/components/council/LearnView';
import Welcome from '@/components/onboarding/Welcome';
import DevToolbar from '@/components/ui/DevToolbar';

export default function AppClient() {
  const { view, init, user, authUser, pastSessions } = useSessionStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    init().then(() => {
      const state = useSessionStore.getState();
      if (state.user && state.authUser) {
        identify(state.user.id, {
          name: state.user.name,
          email: state.authUser.email,
          plan: state.user.plan,
          search_status: state.user.search_status,
        });
        track('app_loaded', { plan: state.user.plan });
      }
      setReady(true);
    });
  }, [init]);

  // Loading state
  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'IBM Plex Mono, monospace' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // First-time user: never completed onboarding
  const isNewUser = user?.context === null && pastSessions.length === 0;
  if (isNewUser && view !== 'session' && view !== 'council' && view !== 'learn') {
    return <Welcome />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Header />
      <div className="flex-1 overflow-y-auto">
        {view === 'council' && <CouncilBuilder />}
        {view === 'session' && <SessionView />}
        {view === 'learn' && <LearnView />}
        {view === 'settings' && <SettingsView />}
      </div>
      {process.env.NODE_ENV === 'development' && <DevToolbar />}
    </div>
  );
}

function SettingsView() {
  const { user, updateUser, setView } = useSessionStore();
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await updateUser({
      name: form.get('name') as string || 'Friend',
      search_status: form.get('search_status') as string || 'slow',
      context: form.get('context') as string || '',
    });
    setView('council');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start">
      <form onSubmit={handleSave} className="w-full max-w-lg space-y-4 mt-8">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        <div>
          <label className="section-label block mb-1.5">YOUR NAME</label>
          <input name="name" type="text" defaultValue={user?.name || ''} placeholder="Your name" className="w-full" />
        </div>

        <div>
          <label className="section-label block mb-1.5">SEARCH STATUS</label>
          <select name="search_status" defaultValue={user?.search_status || 'slow'} className="w-full">
            <option value="slow">Slow Seeker — currently employed, exploring</option>
            <option value="fast">Fast Seeker — actively searching</option>
            <option value="exploring">Exploring quietly</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        <div>
          <label className="section-label block mb-1.5">CONTEXT</label>
          <textarea name="context" rows={4} defaultValue={user?.context || ''}
            placeholder="e.g. At a VC firm I don't enjoy. Want to get back to startups..."
            className="w-full resize-none" />
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-full">Save Settings</button>
        <button type="button" onClick={() => setView('council')} className="btn btn-ghost btn-lg w-full">
          ← Back to Council
        </button>
      </form>
    </div>
  );
}
