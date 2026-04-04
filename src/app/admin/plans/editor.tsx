'use client';

import { useState, useEffect } from 'react';

interface Plan {
  plan: string;
  display_name: string;
  description: string;
  amount_cents: number;
  duration_months: number;
  price_label: string;
  price_sublabel: string;
  cta_text: string;
  featured: boolean;
  active: boolean;
  sort_order: number;
  sessions_per_month: number | null;
  max_council_members: number;
  real_people_voices: boolean;
  custom_members: boolean;
  premium_models: boolean;
}

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '6px 10px', fontSize: 13, border: '1px solid #E5E7EB',
  borderRadius: 4, fontFamily: 'inherit', background: '#fff',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase' as const,
  letterSpacing: '0.06em', fontFamily: 'var(--font-pt-mono)', marginBottom: 4, display: 'block',
};

export default function PlanEditor() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/plans').then(r => r.json()).then(setPlans);
  }, []);

  const handleSave = async (plan: Plan) => {
    setSaving(plan.plan);
    setMessage('');
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage(`Saved ${plan.display_name}`);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
    setSaving(null);
  };

  const updateField = (planKey: string, field: string, value: string | number | boolean | null) => {
    setPlans(plans.map(p => p.plan === planKey ? { ...p, [field]: value } : p));
  };

  if (!plans.length) return <p style={{ color: '#9CA3AF', fontSize: 14 }}>Loading plans...</p>;

  return (
    <div>
      {message && (
        <div style={{ padding: '8px 12px', marginBottom: 16, fontSize: 13, borderRadius: 4, background: message.startsWith('Error') ? '#FEE2E2' : '#DCFCE7', color: message.startsWith('Error') ? '#991B1B' : '#166534' }}>
          {message}
        </div>
      )}

      {plans.map(plan => (
        <div key={plan.plan} style={{
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6,
          padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          opacity: plan.active ? 1 : 0.5,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-pt-mono)', fontSize: 12, color: '#9CA3AF' }}>{plan.plan}</span>
              <h3 style={{ fontFamily: 'var(--font-montserrat)', fontSize: 18, fontWeight: 700 }}>{plan.display_name}</h3>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="checkbox" checked={plan.active} onChange={e => updateField(plan.plan, 'active', e.target.checked)} />
                Active
              </label>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="checkbox" checked={plan.featured} onChange={e => updateField(plan.plan, 'featured', e.target.checked)} />
                Featured
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Display Name</label>
              <input style={fieldStyle} value={plan.display_name} onChange={e => updateField(plan.plan, 'display_name', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <input style={fieldStyle} value={plan.description} onChange={e => updateField(plan.plan, 'description', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Price Label (display)</label>
              <input style={fieldStyle} value={plan.price_label} onChange={e => updateField(plan.plan, 'price_label', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Price Sublabel</label>
              <input style={fieldStyle} value={plan.price_sublabel} onChange={e => updateField(plan.plan, 'price_sublabel', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Amount (cents)</label>
              <input style={fieldStyle} type="number" value={plan.amount_cents} onChange={e => updateField(plan.plan, 'amount_cents', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label style={labelStyle}>Duration (months)</label>
              <input style={fieldStyle} type="number" value={plan.duration_months} onChange={e => updateField(plan.plan, 'duration_months', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label style={labelStyle}>CTA Text</label>
              <input style={fieldStyle} value={plan.cta_text} onChange={e => updateField(plan.plan, 'cta_text', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input style={fieldStyle} type="number" value={plan.sort_order} onChange={e => updateField(plan.plan, 'sort_order', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
            <label style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={plan.real_people_voices} onChange={e => updateField(plan.plan, 'real_people_voices', e.target.checked)} />
              Real People Voices
            </label>
            <label style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={plan.custom_members} onChange={e => updateField(plan.plan, 'custom_members', e.target.checked)} />
              Custom Members
            </label>
            <label style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={plan.premium_models} onChange={e => updateField(plan.plan, 'premium_models', e.target.checked)} />
              Premium Models
            </label>
            <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              Sessions/mo:
              <input style={{ ...fieldStyle, width: 60 }} type="number" value={plan.sessions_per_month ?? ''} placeholder="∞"
                onChange={e => updateField(plan.plan, 'sessions_per_month', e.target.value === '' ? null : parseInt(e.target.value))} />
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              Max members:
              <input style={{ ...fieldStyle, width: 50 }} type="number" value={plan.max_council_members}
                onChange={e => updateField(plan.plan, 'max_council_members', parseInt(e.target.value) || 3)} />
            </div>
          </div>

          <button
            onClick={() => handleSave(plan)}
            disabled={saving === plan.plan}
            style={{
              padding: '6px 16px', fontSize: 13, fontWeight: 500, borderRadius: 4, border: 'none',
              background: '#111', color: '#fff', cursor: saving === plan.plan ? 'wait' : 'pointer',
              opacity: saving === plan.plan ? 0.6 : 1,
            }}
          >
            {saving === plan.plan ? 'Saving...' : 'Save'}
          </button>
        </div>
      ))}
    </div>
  );
}
