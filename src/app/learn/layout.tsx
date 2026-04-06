import styles from './learn.module.css';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <a href="/" className={styles.navMark}>jobsearch.quest</a>
          <div className={styles.navLinks}>
            <a href="/learn">Guides</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#faq">FAQ</a>
            <a href="/app" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Launch App</a>
          </div>
        </div>
      </nav>
      {children}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>
            <a href="/">jobsearch.quest</a> &mdash; Built on the <a href="https://neversearchalone.com" target="_blank" rel="noopener">Never Search Alone</a> methodology by Phyl Terry
          </p>
        </div>
      </footer>
    </>
  );
}
