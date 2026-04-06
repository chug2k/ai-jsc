import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'Job Search Council vs Career Coach: Which Is Right for You? | jobsearch.quest',
  description: 'Comparing Job Search Councils, career coaches, and AI-powered councils. Real people are hard to beat — but an AI council is available when they aren\'t. Here\'s how to decide.',
  alternates: { canonical: `${BASE}/learn/job-search-council-vs-career-coach` },
  openGraph: {
    title: 'Job Search Council vs Career Coach: Which Is Right for You?',
    description: 'An honest comparison of Job Search Councils, career coaches, and AI-powered councils — what each does best and where each falls short.',
    type: 'article',
    url: `${BASE}/learn/job-search-council-vs-career-coach`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    question: 'Is an AI Job Search Council as good as a real one?',
    answer: 'No — and we\'re upfront about that. A real council of peers who know your industry, challenge your thinking in unexpected ways, and hold you accountable face-to-face is the gold standard. An AI council is the next best thing when you can\'t find a real one, can\'t wait to start one, or need support between sessions.',
  },
  {
    question: 'How much does a career coach cost compared to a Job Search Council?',
    answer: 'Career coaches typically charge $150–$500 per session, with engagements running $2,000–$10,000+. Traditional Job Search Councils are free — they\'re peer-led. An AI-powered council like jobsearch.quest offers a first session free, with paid plans for ongoing access.',
  },
  {
    question: 'Can I use an AI council and a real council at the same time?',
    answer: 'Absolutely — and we recommend it. Use the AI council to prep for your real council sessions, work through decisions between meetings, and practice conversations. They complement each other well.',
  },
  {
    question: 'What if I can\'t find people to form a Job Search Council?',
    answer: 'This is the most common barrier. The Never Search Alone community helps match people, but it still takes time. An AI-powered council lets you start the curriculum immediately while you look for peers.',
  },
  {
    question: 'Should I hire a career coach or join a Job Search Council?',
    answer: 'If you need specialized expertise (executive placement, salary negotiation for a specific industry), a coach may be worth it. If you need accountability, perspective, and structure, a council is often more effective — and much cheaper. Many people benefit from both.',
  },
];

const toc = [
  { id: 'honest-take', label: 'The Honest Take' },
  { id: 'what-is-what', label: 'What Each Option Actually Is' },
  { id: 'comparison', label: 'Side-by-Side Comparison' },
  { id: 'real-council-best', label: 'When a Real Council Is Best' },
  { id: 'career-coach-best', label: 'When a Career Coach Is Best' },
  { id: 'ai-council-best', label: 'When an AI Council Is Best' },
  { id: 'use-together', label: 'Using Them Together' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/what-is-a-job-search-council', title: 'What Is a Job Search Council?', description: 'How the JSC model works and why 5,000+ councils have been launched.' },
  { href: '/learn/never-search-alone-methodology', title: 'The Never Search Alone Methodology', description: 'Deep dive into the 10-session curriculum that powers every council.' },
  { href: '/learn/ai-job-search-tools', title: 'AI Tools for Job Searching in 2026', description: 'A practical guide to AI tools that actually help you land a role.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="Job Search Council vs Career Coach: Which Is Right for You?" description="An honest comparison of Job Search Councils, career coaches, and AI-powered councils — what each does best and where each falls short." />
      <BreadcrumbJsonLd items={[{ name: 'Job Search Council vs Career Coach', href: `${BASE}/learn/job-search-council-vs-career-coach` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / JSC vs Career Coach</div>
          <h1>Job Search Council vs Career Coach: Which Is Right for You?</h1>
          <p className={styles.subtitle}>
            A real Job Search Council with real people is hard to beat. A good career coach can be transformative. But neither is always available when you need them. Here&apos;s an honest look at each option — including the AI-powered alternative.
          </p>

          <TableOfContents items={toc} />

          <h2 id="honest-take">The Honest Take</h2>
          <p>
            Let&apos;s be direct: if you can find 4–5 peers to form a Job Search Council and meet weekly, that&apos;s the best option. Real people bring real-world experience, genuine empathy, and the kind of unpredictable challenge that pushes you to think differently. The Never Search Alone methodology has helped thousands of people land better roles faster through exactly this model.
          </p>
          <p>
            The problem? Most people can&apos;t find a council. They don&apos;t know enough people who are actively searching. Or the timing doesn&apos;t work out. Or they need to start now and can&apos;t wait three weeks to get a group together.
          </p>
          <p>
            That&apos;s why we built jobsearch.quest — not to replace real councils, but to make the methodology accessible when a real council isn&apos;t an option. It&apos;s the same 10-session curriculum, the same structure, guided by AI instead of peers. It&apos;s more practical for most people, even if it&apos;s not the same as the real thing.
          </p>

          <h2 id="what-is-what">What Each Option Actually Is</h2>

          <h3>Job Search Council (Real People)</h3>
          <p>
            A small group of 4–6 job seekers who meet weekly for structured sessions. Each person shares their progress, makes commitments, and gets honest feedback. The model was created by Phyl Terry and documented in <em>Never Search Alone</em>. It&apos;s free, peer-led, and follows a 10-session curriculum covering everything from defining your must-haves to negotiating offers.
          </p>

          <h3>Career Coach</h3>
          <p>
            A paid professional who provides one-on-one guidance on your job search. Good coaches bring deep expertise in specific industries or job functions, help with resume and interview strategy, and offer personalized advice. Sessions typically run $150–$500 each, and most engagements span several months.
          </p>

          <h3>AI-Powered Job Search Council (jobsearch.quest)</h3>
          <p>
            The same Never Search Alone curriculum delivered through AI. You go through structured sessions that cover the full 10-session arc — from writing your Two-Pager to evaluating offers. The AI plays the role of council members: asking questions, challenging assumptions, and keeping you accountable. Available on your schedule, no coordination required.
          </p>

          <h2 id="comparison">Side-by-Side Comparison</h2>
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}></th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Real JSC</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Career Coach</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>AI Council</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cost', 'Free', '$150–$500/session', 'First session free, then paid plans'],
                  ['Availability', 'Need to find peers', 'Book appointments', 'Anytime, on-demand'],
                  ['Accountability', 'Strong — peer pressure works', 'Moderate — you\'re paying for it', 'Moderate — structured commitments'],
                  ['Diverse perspectives', 'Yes — multiple viewpoints', 'One expert viewpoint', 'Simulated panel of perspectives'],
                  ['Industry expertise', 'Depends on your group', 'Often deep and specific', 'Broad but not specialized'],
                  ['Emotional support', 'Strong — shared experience', 'Professional but limited', 'Available but not the same'],
                  ['Structure', '10-session curriculum', 'Varies by coach', '10-session curriculum'],
                  ['Flexibility', 'Fixed weekly schedule', 'By appointment', 'Your schedule'],
                  ['Setup time', 'Weeks to find members', 'Days to find a coach', 'Minutes'],
                ].map(([label, jsc, coach, ai], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 500 }}>{label}</td>
                    <td style={{ padding: '10px 16px' }}>{jsc}</td>
                    <td style={{ padding: '10px 16px' }}>{coach}</td>
                    <td style={{ padding: '10px 16px' }}>{ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="real-council-best">When a Real Council Is Best</h2>
          <ul>
            <li><strong>You know other people who are job searching.</strong> Friends, former colleagues, or connections through Never Search Alone who are actively looking.</li>
            <li><strong>You want genuine human accountability.</strong> There&apos;s something about telling real people &ldquo;I&apos;ll do X by next week&rdquo; that AI can&apos;t fully replicate.</li>
            <li><strong>You thrive on serendipity.</strong> Real council members bring unexpected connections, referrals, and perspectives that no algorithm can predict.</li>
            <li><strong>You can commit to a weekly schedule.</strong> The cadence matters — councils work best when everyone shows up consistently.</li>
          </ul>

          <h2 id="career-coach-best">When a Career Coach Is Best</h2>
          <ul>
            <li><strong>You need specialized expertise.</strong> Executive search, niche industry transitions, or salary negotiation at senior levels benefit from a coach who&apos;s done it before.</li>
            <li><strong>You have a specific, urgent problem.</strong> You&apos;re negotiating an offer this week, or you need to decide between two roles tomorrow.</li>
            <li><strong>You want someone to do research for you.</strong> Good coaches map the market, identify target companies, and connect you with their network.</li>
            <li><strong>Budget isn&apos;t a constraint.</strong> At $200+ per session, coaching is an investment that not everyone can make.</li>
          </ul>

          <h2 id="ai-council-best">When an AI Council Is Best</h2>
          <ul>
            <li><strong>You can&apos;t find peers to form a council.</strong> This is the number one barrier. Most people don&apos;t know 4–5 others who are actively searching right now.</li>
            <li><strong>You need to start immediately.</strong> No waiting to coordinate schedules, no matching process — start your first session in minutes.</li>
            <li><strong>You want the structure without the logistics.</strong> The full 10-session Never Search Alone curriculum, without needing to organize a group.</li>
            <li><strong>You search on an unpredictable schedule.</strong> Working full-time while searching? Sessions at 11pm or on Sunday mornings are fine.</li>
            <li><strong>You want a complement to a real council.</strong> Use AI sessions to prep, practice, and work through decisions between your real council meetings.</li>
          </ul>

          <h2 id="use-together">Using Them Together</h2>
          <p>
            These aren&apos;t mutually exclusive. The most effective approach for many people is a combination:
          </p>
          <ul>
            <li><strong>Start with AI, graduate to real peers.</strong> Use jobsearch.quest to begin the curriculum immediately while you look for council members through Never Search Alone or your own network.</li>
            <li><strong>AI for prep, real council for accountability.</strong> Run through your session topics with AI before your weekly council meeting. Show up better prepared, get more out of the group time.</li>
            <li><strong>Coach for strategy, council for execution.</strong> A career coach can help you set direction. A council (real or AI) keeps you moving in that direction every week.</li>
          </ul>

          <section id="faq">
            <FaqSection faqs={faqs} />
          </section>

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Ready to start?</h2>
            <p>Try your first AI-powered Job Search Council session free. No credit card required.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
