'use client';

import { useSessionStore } from '@/stores/session-store';

export default function Header() {
  const { view, setView, currentSession } = useSessionStore();

  return (
    <header className="border-b flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 flex-shrink-0"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="mono text-xs hidden sm:inline" style={{ color: 'var(--accent)' }}>▶</span>
        <span className="mono text-xs sm:hidden" style={{ color: 'var(--accent)' }}>▶</span>
        <div className="min-w-0">
          <div className="font-semibold text-xs sm:text-sm truncate">jobsearch.quest</div>
        </div>
      </div>
      <nav className="flex items-center gap-1 sm:gap-2">
        {view === 'session' && (
          <button onClick={() => setView('council')} className="btn btn-subtle text-xs px-2 py-1.5 sm:px-3">
            Team
          </button>
        )}
        {view !== 'session' && !currentSession && (
          <button onClick={() => {
            const store = useSessionStore.getState();
            if (!store.selectedIds.length) { setView('council'); return; }
            store.startSession();
          }} className="btn btn-primary text-xs px-2 py-1.5 sm:px-4">
            Start →
          </button>
        )}
        <button onClick={() => setView('settings')} className="btn btn-ghost text-xs px-2 py-1.5" title="Settings">⚙</button>
        <form action="/auth/signout" method="POST" className="inline">
          <button type="submit" className="btn btn-ghost text-xs px-2 py-1.5" title="Sign out">Sign out</button>
        </form>
      </nav>
    </header>
  );
}
