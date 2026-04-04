'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@/stores/session-store';

interface ModelData {
  default: string;
  moderatorDefault: string;
  models: { id: string; name: string; tier: string }[];
}

export default function DevToolbar() {
  const [data, setData] = useState<ModelData | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetch('/api/models')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setData(d);
          setSelectedModel(d.default);
        }
      })
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
      fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'absolute', bottom: open ? undefined : 0, right: 12,
          padding: '4px 10px', borderRadius: '4px 4px 0 0',
          background: '#10b981', color: '#fff', border: 'none',
          fontSize: 10, cursor: 'pointer', letterSpacing: '0.05em',
        }}
      >
        OpenAI · {selectedModel} {open ? '▼' : '▲'}
      </button>

      {open && (
        <div style={{
          background: '#111', borderTop: '1px solid #333', padding: '12px 16px',
          color: '#e2e8f0', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ color: '#64748b', marginBottom: 2 }}>OVERRIDE ALL</div>
            <select
              value={selectedModel}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedModel(val);
                if (val === data.default) {
                  // Reset — use per-agent defaults
                  useSessionStore.setState({ _devModel: undefined } as Record<string, unknown>);
                } else {
                  useSessionStore.setState({ _devModel: val } as Record<string, unknown>);
                }
              }}
              style={{
                background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155',
                borderRadius: 3, padding: '3px 6px', fontSize: 11, fontFamily: 'inherit',
                minWidth: 180,
              }}
            >
              <option value={data.default}>Default (Maude: {data.moderatorDefault}, others: {data.default})</option>
              {data.models.map(m => (
                <option key={m.id} value={m.id}>All agents: {m.name}</option>
              ))}
            </select>
          </div>

          <div style={{ color: '#475569', marginLeft: 'auto' }}>
            DEV ONLY
          </div>
        </div>
      )}
    </div>
  );
}
