import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'AI Job Search Council vs Searching Alone: What Actually Works | jobsearch.quest',
  description: 'Most job seekers search alone and take 5x longer. An AI-powered Job Search Council brings structure and accountability to a process that usually has neither. Here\'s what changes.',
  alternates: { canonical: `${BASE}/learn/ai-job-search-council-vs-solo-search` },
  openGraph: {
    title: 'AI Job Search Council vs Searching Alone',
    description: 'Most job seekers search alone and take 5x longer. Here\'s what changes when you add structure and accountability.',
    type: 'article',
    url: `${BASE}/learn/ai-job-search-council-vs-solo-search`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    question: 'Can\'t I just be disciplined on my own?',
    answer: 'Some people can. If you\'re the type who sets a goal, builds a plan, and executes it without external pressure — solo searching may work fine. But most people aren\'t like that during a job search, which is one of the most emotionally taxing experiences in professional life. Structure helps even disciplined people stay focused on the right things.',
  },
  {
    question: 'What does an AI Job Search Council actually do differently than searching alone?',
    answer: 'It gives you a structured 10-session curriculum (the Never Search Alone methodology), asks you questions that challenge your assumptions, holds you to weekly commitments, and guides you through the full arc — from defining what you want to evaluating offers. Solo searching skips most of this and jumps straight to applying.',
  },
  {
    question: 'I\'ve been searching alone for months. Is it too late to try a council approach?',
    answer: 'No — and it might be exactly the right time. If you\'ve been searching for months without results, the structure of a council can help you identify what\'s not working. Many of the early sessions focus on the strategic work that solo searchers skip: defining must-haves, identifying candidate-market fit, and getting honest feedback on your approach.',
  },
  {
    question: 'How much time does an AI council add to my week?',
    answer: 'Each session takes about 30–45 minutes. That\'s roughly the same time you might spend scrolling job boards without applying. The difference is that council time is focused on strategy and accountability, not just browsing.',
  },
];

const toc = [
  { id: 'the-pattern', label: 'The Pattern Most Job Seekers Fall Into' },
  { id: 'what-solo-misses', label: 'What Solo Searching Misses' },
  { id: 'comparison', label: 'Side-by-Side: Solo vs AI Council' },
  { id: 'solo-works-when', label: 'When Solo Searching Actually Works' },
  { id: 'council-works-when', label: 'When an AI Council Makes the Difference' },
  { id: 'getting-started', label: 'Making the Switch' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/what-is-a-job-search-council', title: 'What Is a Job Search Council?', description: 'How the JSC model works and why 5,000+ councils have been launched.' },
  { href: '/learn/job-search-burnout', title: 'How to Overcome Job Search Burnout', description: 'Recognize the signs and rebuild momentum when the search feels endless.' },
  { href: '/learn/job-search-accountability', title: 'Why Accountability Matters', description: 'The research behind accountability partners and how to set one up.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="AI Job Search Council vs Searching Alone: What Actually Works" description="Most job seekers search alone and take 5x longer. An AI-powered Job Search Council brings structure and accountability to a process that usually has neither." />
      <BreadcrumbJsonLd items={[{ name: 'AI Job Search Council vs Solo Search', href: `${BASE}/learn/ai-job-search-council-vs-solo-search` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / AI Council vs Solo Search</div>
          <h1>AI Job Search Council vs Searching Alone</h1>
          <p className={styles.subtitle}>
            Most people search for jobs alone. Most people also take far longer than they need to, apply to the wrong roles, and accept offers they regret. These things are related.
          </p>

          <TableOfContents items={toc} />

          <h2 id="the-pattern">The Pattern Most Job Seekers Fall Into</h2>
          <p>
            Here&apos;s how solo job searching usually goes: You update your resume. You start browsing job boards. You apply to anything that looks reasonable. You hear nothing for weeks. You apply to more things, less selectively. You get a few interviews, maybe bomb one. You start to doubt yourself. You keep applying, now with less energy and lower standards. Eventually you take something — maybe the right thing, maybe not.
          </p>
          <p>
            This isn&apos;t a failure of willpower. It&apos;s what happens when there&apos;s no structure, no external perspective, and no one asking you hard questions about whether you&apos;re actually pursuing the right roles.
          </p>

          <h2 id="what-solo-misses">What Solo Searching Misses</h2>
          <p>
            The Never Search Alone methodology identifies several things that solo searchers almost always skip:
          </p>
          <ul>
            <li><strong>Defining your must-haves and dealbreakers.</strong> Most solo searchers never write these down. They apply based on vibes, then wonder why they&apos;re not excited about any of their options.</li>
            <li><strong>Candidate-market fit.</strong> Are you targeting roles where your specific experience is a competitive advantage? Solo searchers rarely ask this question — they search by title, not by fit.</li>
            <li><strong>Honest feedback on your approach.</strong> When you search alone, no one tells you your resume buries the lede, your target list is too broad, or your interview stories aren&apos;t landing.</li>
            <li><strong>Weekly commitments and accountability.</strong> &ldquo;I&apos;ll apply to 10 jobs this week&rdquo; is not a strategy. &ldquo;I&apos;ll have three conversations with people at my target companies and refine my Two-Pager based on what I learn&rdquo; is.</li>
            <li><strong>A framework for evaluating offers.</strong> Solo searchers often accept the first offer out of relief. The council approach helps you evaluate offers against your must-haves, not just your desperation level.</li>
          </ul>

          <h2 id="comparison">Side-by-Side: Solo vs AI Council</h2>
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}></th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Solo Search</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>AI Job Search Council</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Strategy', 'Apply and hope', 'Define fit, then target'],
                  ['Structure', 'None — make it up as you go', '10-session curriculum with clear arc'],
                  ['Accountability', 'You vs your willpower', 'Weekly commitments tracked across sessions'],
                  ['Feedback', 'None until interviews', 'Every session challenges your thinking'],
                  ['Time to start', 'Immediate', 'Immediate'],
                  ['Cost', 'Free', 'First session free'],
                  ['Emotional support', 'Friends, maybe', 'Built into session structure'],
                  ['Offer evaluation', 'Gut feeling', 'Structured framework against your must-haves'],
                  ['Typical duration', 'Months, often drifting', 'Focused 10-session arc'],
                ].map(([label, solo, ai], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 500 }}>{label}</td>
                    <td style={{ padding: '10px 16px' }}>{solo}</td>
                    <td style={{ padding: '10px 16px' }}>{ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="solo-works-when">When Solo Searching Actually Works</h2>
          <p>
            Let&apos;s be fair — searching alone isn&apos;t always wrong:
          </p>
          <ul>
            <li><strong>You know exactly what you want.</strong> If you&apos;ve done the strategic work before, you have a clear target, and you&apos;re just executing, solo can work.</li>
            <li><strong>You&apos;re being recruited.</strong> If companies are coming to you, the search dynamic is different. You still need to evaluate offers carefully, but the outbound grind is minimal.</li>
            <li><strong>Your network is strong and active.</strong> If you have people regularly checking in on your search and giving you honest feedback, you&apos;re getting some of what a council provides informally.</li>
            <li><strong>You&apos;re early in your career with transferable skills.</strong> When you&apos;re junior and willing to be flexible, the cost of a suboptimal choice is lower.</li>
          </ul>

          <h2 id="council-works-when">When an AI Council Makes the Difference</h2>
          <ul>
            <li><strong>You&apos;ve been searching for weeks and aren&apos;t getting traction.</strong> If your current approach isn&apos;t working, doing more of the same won&apos;t fix it. A council forces you to step back and examine the strategy.</li>
            <li><strong>You&apos;re applying to everything.</strong> Breadth without focus is the most common job search mistake. The council curriculum starts with narrowing, not widening.</li>
            <li><strong>You don&apos;t have people to talk to about your search.</strong> Maybe you&apos;re between communities, new to a city, or just don&apos;t want to burden friends. The AI council fills that gap.</li>
            <li><strong>You&apos;re making a career change.</strong> Pivots require more strategic thinking than lateral moves. The Two-Pager exercise and candidate-market fit framework are especially valuable here.</li>
            <li><strong>You keep procrastinating.</strong> Weekly structure with commitments breaks the paralysis cycle that solo searching often creates.</li>
          </ul>

          <h2 id="getting-started">Making the Switch</h2>
          <p>
            If you&apos;ve been searching alone and it&apos;s not working, trying a structured approach costs almost nothing. The first session is free, takes about 30 minutes, and focuses on the strategic foundation that most solo searchers skip entirely.
          </p>
          <p>
            You don&apos;t have to commit to all 10 sessions. But if the first one surfaces something you hadn&apos;t considered — a must-have you hadn&apos;t articulated, a target you hadn&apos;t explored, a pattern you hadn&apos;t noticed — that&apos;s a sign the structure is working.
          </p>

          <section id="faq">
            <FaqSection faqs={faqs} />
          </section>

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Done searching alone?</h2>
            <p>Try your first AI-powered Job Search Council session free.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
