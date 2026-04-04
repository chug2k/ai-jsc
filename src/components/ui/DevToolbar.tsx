'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@/stores/session-store';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

interface ModelData {
  default: string;
  models: ModelOption[];
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

  const current = data.models.find(m => m.id === selectedModel);
  const providerColor: Record<string, string> = {
    openai: '#10b981',
    gemini: '#3b82f6',
    local: '#f59e0b',
  };

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
          background: providerColor[current?.provider || 'openai'] || '#666',
          color: '#fff', border: 'none', fontSize: 10, cursor: 'pointer', letterSpacing: '0.05em',
        }}
      >
        {current?.provider?.toUpperCase() || 'LLM'} · {current?.name || selectedModel} {open ? '▼' : '▲'}
      </button>

      {open && (
        <div style={{
          background: '#111', borderTop: '1px solid #333', padding: '12px 16px',
          color: '#e2e8f0', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ color: '#64748b', marginBottom: 2 }}>MODEL</div>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                useSessionStore.setState({ _devModel: e.target.value } as Record<string, unknown>);
              }}
              style={{
                background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155',
                borderRadius: 3, padding: '3px 6px', fontSize: 11, fontFamily: 'inherit',
                minWidth: 200,
              }}
            >
              {data.models.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.provider}] {m.name}
                </option>
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
