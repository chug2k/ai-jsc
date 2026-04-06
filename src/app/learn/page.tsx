import { Metadata } from 'next';
import styles from './learn.module.css';

export const metadata: Metadata = {
  title: 'Job Search Guides & Resources | jobsearch.quest',
  description: 'Free guides on job search strategy, accountability, interview prep, networking, negotiation, and more. Based on the Never Search Alone methodology.',
  openGraph: {
    title: 'Job Search Guides & Resources | jobsearch.quest',
    description: 'Free guides on job search strategy, accountability, interview prep, networking, negotiation, and more.',
    type: 'website',
  },
};

const guides = [
  {
    href: '/learn/what-is-a-job-search-council',
    title: 'What Is a Job Search Council?',
    description: 'A structured peer group that meets weekly to hold each other accountable, share strategy, and accelerate the search.',
  },
  {
    href: '/learn/never-search-alone-methodology',
    title: 'The Never Search Alone Methodology',
    description: 'How Phyl Terry\'s 10-session curriculum transforms solo job searching into a structured, accountable process.',
  },
  {
    href: '/learn/job-search-accountability',
    title: 'Why Accountability Matters in Job Search',
    description: 'Solo searchers take 5x longer. Here\'s why accountability partners change the math — and how to set one up.',
  },
  {
    href: '/learn/ai-job-search-tools',
    title: 'AI Tools for Job Searching in 2026',
    description: 'From resume optimization to mock interviews, a practical guide to AI tools that actually help you land a role.',
  },
  {
    href: '/learn/job-search-burnout',
    title: 'How to Overcome Job Search Burnout',
    description: 'Recognize the signs, break the cycle, and rebuild momentum when the search feels endless.',
  },
  {
    href: '/learn/career-pivot-guide',
    title: 'How to Successfully Pivot Your Career',
    description: 'A framework for career changers: identifying transferable skills, testing new directions, and landing the role.',
  },
  {
    href: '/learn/interview-preparation-guide',
    title: 'Interview Preparation: A Complete Guide',
    description: 'From behavioral questions to offer stage — a structured approach to interview prep that works.',
  },
  {
    href: '/learn/networking-for-job-seekers',
    title: 'Networking Strategies for Job Seekers',
    description: 'The Listening Tour approach: how to build genuine connections that lead to opportunities, not awkward asks.',
  },
  {
    href: '/learn/job-offer-negotiation',
    title: 'How to Negotiate a Job Offer',
    description: 'A step-by-step negotiation framework that helps you advocate for yourself without burning bridges.',
  },
  {
    href: '/learn/candidate-market-fit',
    title: 'Candidate-Market Fit: Finding the Right Role',
    description: 'Stop applying everywhere. A strategic approach to matching your strengths to the roles where you\'ll actually thrive.',
  },
  {
    href: '/learn/remote-job-search',
    title: 'How to Find a Remote Job in 2026',
    description: 'Where to find remote roles, how to stand out as a remote candidate, and how to negotiate remote arrangements.',
  },
  {
    href: '/learn/job-search-after-layoff',
    title: 'Job Search After a Layoff',
    description: 'A week-by-week guide to navigating the emotional and practical realities of searching after a layoff.',
  },
  {
    href: '/learn/how-to-write-a-two-pager',
    title: 'How to Write a Mnookin Two-Pager',
    description: 'The Must-Haves and Must-Nots exercise that brings clarity to your entire search. Step-by-step guide.',
  },
  {
    href: '/learn/job-search-for-senior-professionals',
    title: 'Job Search for Senior Professionals',
    description: 'Fewer openings, longer timelines, higher stakes — the playbook for directors, VPs, and executives.',
  },
  {
    href: '/learn/job-search-council-vs-career-coach',
    title: 'Job Search Council vs Career Coach',
    description: 'An honest comparison: real councils, career coaches, and AI-powered councils — what each does best and when to use them.',
  },
];

export default function LearnIndex() {
  return (
    <article className={styles.article}>
      <div className={styles.container}>
        <h1>Job Search Guides</h1>
        <p className={styles.subtitle}>
          Free, practical guides based on the Never Search Alone methodology. No fluff — just the frameworks, tools, and strategies that help people land the right role faster.
        </p>
        <div className={styles.grid}>
          {guides.map((guide) => (
            <a key={guide.href} href={guide.href} className={styles.card}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </a>
          ))}
        </div>

        <div className={styles.cta}>
          <h2>Ready to put this into practice?</h2>
          <p>Start your first AI-powered Job Search Council session free.</p>
          <a href="/app" className={styles.btnCta}>Start Free Session</a>
        </div>
      </div>
    </article>
  );
}
