'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@/stores/session-store';

interface ModelInfo {
  endpoint: string;
  current: string;
  models: string[];
  error?: string;
}

export default function DevToolbar() {
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetch('/api/models')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setInfo(data);
          setSelectedModel(data.current);
        }
      })
      .catch(() => {});
  }, []);

  // Only render in dev
  if (!info) return null;

  const isLocal = info.endpoint.includes('localhost') || info.endpoint.includes('127.0.0.1');

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
      fontFamily: 'var(--font-pt-mono)', fontSize: 11,
    }}>
      {/* Collapsed bar */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'absolute', bottom: open ? undefined : 0, right: 12,
          padding: '4px 10px', borderRadius: '4px 4px 0 0',
          background: isLocal ? '#16a34a' : '#d97706', color: '#fff', border: 'none',
          fontSize: 10, cursor: 'pointer', letterSpacing: '0.05em',
        }}
      >
        {isLocal ? 'LOCAL' : 'REMOTE'} · {selectedModel.split('/').pop()} {open ? '▼' : '▲'}
      </button>

      {/* Expanded panel */}
      {open && (
        <div style={{
          background: '#111', borderTop: '1px solid #333', padding: '12px 16px',
          color: '#e2e8f0', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ color: '#64748b', marginBottom: 2 }}>ENDPOINT</div>
            <div style={{ color: isLocal ? '#4ade80' : '#fbbf24' }}>{info.endpoint}</div>
          </div>

          <div>
            <div style={{ color: '#64748b', marginBottom: 2 }}>MODEL</div>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                // Store in Zustand so sendMessage picks it up
                useSessionStore.setState({ _devModel: e.target.value } as Record<string, unknown>);
              }}
              style={{
                background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)',
                borderRadius: 3, padding: '3px 6px', fontSize: 11, fontFamily: 'inherit',
              }}
            >
              {info.models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {info.models.length === 0 && info.error && (
            <div style={{ color: '#ef4444' }}>{info.error}</div>
          )}

          <div style={{ color: '#475569', marginLeft: 'auto' }}>
            DEV ONLY — not visible in production
          </div>
        </div>
      )}
    </div>
  );
}
