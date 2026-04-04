'use client';

import { useState } from 'react';

export default function PricingButton({
  plan,
  children,
  className,
  style,
}: {
  plan: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (plan === 'free') {
      window.location.href = '/app';
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (res.status === 401) {
        window.location.href = `/auth/signin?next=${encodeURIComponent('/#pricing')}`;
        return;
      }

      const { url, error } = await res.json();
      if (error) { alert(error); return; }
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
      style={{ ...style, opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer' }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
