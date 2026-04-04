'use client';

import { useState } from 'react';
import styles from '@/app/landing.module.css';

export default function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles['faq-item']} ${open ? styles.open : ''}`}>
      <div className={styles['faq-q']} onClick={() => setOpen((o) => !o)}>
        {question}
      </div>
      <div className={styles['faq-a']}>{children}</div>
    </div>
  );
}
