'use client';

import { useState } from 'react';

export default function MobileNav({ styles }: { styles: Record<string, string> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        className={styles['nav-hamburger']}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span style={{
          display: 'block',
          width: 20,
          height: 2,
          background: 'var(--primary)',
          borderRadius: 1,
          transform: open ? 'rotate(45deg) translateY(5px)' : 'none',
          transition: 'transform 0.2s',
        }} />
        <span style={{
          display: 'block',
          width: 20,
          height: 2,
          background: 'var(--primary)',
          borderRadius: 1,
          opacity: open ? 0 : 1,
          transition: 'opacity 0.2s',
          marginTop: 4,
        }} />
        <span style={{
          display: 'block',
          width: 20,
          height: 2,
          background: 'var(--primary)',
          borderRadius: 1,
          transform: open ? 'rotate(-45deg) translateY(-5px)' : 'none',
          transition: 'transform 0.2s',
          marginTop: 4,
        }} />
      </button>

      {/* Mobile menu dropdown */}
      {open && (
        <div className={styles['nav-mobile-menu']} onClick={() => setOpen(false)}>
          <a href="#how">How it works</a>
          <a href="#council">Council</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="/learn">Guides</a>
          <a href="/app" className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-sm']}`} style={{ textAlign: 'center' }}>Launch App</a>
        </div>
      )}
    </>
  );
}
