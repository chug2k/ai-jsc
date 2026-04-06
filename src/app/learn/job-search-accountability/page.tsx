import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'Why Accountability Matters in Job Search | jobsearch.quest',
  description: 'Job seekers without accountability take up to 5x longer. Learn how accountability partners, councils, and structured check-ins accelerate your search.',
  alternates: { canonical: `${BASE}/learn/job-search-accountability` },
  openGraph: {
    title: 'Why Accountability Matters in Job Search',
    description: 'Solo searchers take 5x longer. Here\'s why accountability changes the math.',
    type: 'article',
    url: `${BASE}/learn/job-search-accountability`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'How often should I check in with an accountability partner?', answer: 'Weekly is the sweet spot for job search accountability. Monthly is too slow to maintain momentum, and daily is unsustainable. A weekly cadence creates urgency without pressure.' },
  { question: 'What\'s the difference between an accountability partner and a Job Search Council?', answer: 'An accountability partner is one person you check in with. A Job Search Council is a group of 4–6 peers following a structured curriculum with defined exercises, roles, and phases. The council provides both accountability and diverse perspectives.' },
  { question: 'Can AI provide real accountability?', answer: 'AI can track commitments, ask follow-up questions, and provide structured check-ins. It works best when it follows a proven methodology rather than just asking "how\'s the search going?" The key is structure — weekly sessions with specific commitment tracking.' },
];

const toc = [
  { id: 'gap', label: 'The Accountability Gap' },
  { id: 'without', label: 'What Happens Without Accountability' },
  { id: 'types', label: 'Types of Job Search Accountability' },
  { id: 'good-accountability', label: 'What Good Accountability Looks Like' },
  { id: 'setup', label: 'How to Set Up Accountability Today' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/what-is-a-job-search-council', title: 'What Is a Job Search Council?', description: 'The structured group format that builds accountability into your weekly routine.' },
  { href: '/learn/job-search-burnout', title: 'How to Overcome Job Search Burnout', description: 'Accountability prevents burnout by creating external structure and progress signals.' },
  { href: '/learn/never-search-alone-methodology', title: 'The Never Search Alone Methodology', description: 'The proven curriculum that provides both structure and accountability.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="Why Accountability Matters in Job Search" description="Job seekers without accountability take up to 5x longer. Learn how accountability partners and councils accelerate your search." />
      <BreadcrumbJsonLd items={[{ name: 'Why Accountability Matters', href: `${BASE}/learn/job-search-accountability` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Accountability</div>
          <h1>Why Accountability Matters in Job Search</h1>
          <p className={styles.subtitle}>
            Solo job seekers take up to 5x longer. The missing ingredient isn&apos;t skill or effort — it&apos;s someone to answer to.
          </p>

          <TableOfContents items={toc} />

          <h2 id="gap">The Accountability Gap</h2>
          <p>
            When you&apos;re employed, accountability is built into your day. You have standup meetings, deadlines, managers, teammates who notice when things slip. When you&apos;re job searching, all of that disappears overnight.
          </p>
          <p>
            Suddenly you&apos;re responsible for setting your own priorities, maintaining your own momentum, and evaluating your own strategy — with no feedback loop. It&apos;s like trying to get fit without a gym buddy, a trainer, or even a mirror.
          </p>

          <h2 id="without">What Happens Without Accountability</h2>
          <p>The pattern is predictable:</p>
          <ol>
            <li><strong>Week 1–2:</strong> High energy. You update your resume, set up job alerts, apply to a dozen listings.</li>
            <li><strong>Week 3–4:</strong> Silence from applications. Energy dips. You start &quot;researching&quot; companies instead of reaching out to people.</li>
            <li><strong>Week 5–8:</strong> The drift. Days blur together. You tell yourself you&apos;re being strategic, but you&apos;re actually avoiding the uncomfortable parts — <a href="/learn/networking-for-job-seekers">networking</a>, follow-ups, difficult conversations.</li>
            <li><strong>Week 9+:</strong> <a href="/learn/job-search-burnout">Burnout</a> or panic. Either you disengage, or you accept the first offer that comes along because you&apos;re exhausted.</li>
          </ol>
          <p>
            Accountability breaks this cycle by creating external checkpoints. When you know you&apos;ll report your progress on Friday, Monday looks different.
          </p>

          <h2 id="types">Types of Job Search Accountability</h2>

          <h3>1. Accountability Partner</h3>
          <p>
            The simplest version: one person you check in with weekly. You share what you committed to, what you actually did, and what you&apos;ll do next. Even this minimal structure dramatically reduces drift.
          </p>

          <h3>2. Job Search Council</h3>
          <p>
            A more structured approach: 4–6 peers meeting weekly with a defined curriculum. The group provides not just accountability but also diverse perspectives, feedback, and shared knowledge. The <a href="/learn/never-search-alone-methodology">Never Search Alone methodology</a> uses this format.
          </p>

          <h3>3. AI-Powered Accountability</h3>
          <p>
            For people who can&apos;t assemble a human council — or want to supplement one — <a href="/learn/ai-job-search-tools">AI tools</a> can provide structured check-ins, commitment tracking, and feedback. The key is that the accountability is <em>structured</em>, not just a chatbot asking &quot;how&apos;s the search going?&quot;
          </p>

          <h2 id="good-accountability">What Good Accountability Looks Like</h2>
          <p>Effective job search accountability has four qualities:</p>
          <ul>
            <li><strong>Specific:</strong> &quot;Send 5 outreach emails to people at target companies&quot; — not &quot;do some networking.&quot;</li>
            <li><strong>Time-bound:</strong> Weekly commitments with weekly check-ins. Monthly is too slow for job search velocity.</li>
            <li><strong>Honest:</strong> The point is to surface what&apos;s not working, not to perform productivity. A good accountability partner asks &quot;why didn&apos;t you do it?&quot; without judgment.</li>
            <li><strong>Reciprocal:</strong> You&apos;re not being managed. You&apos;re in a partnership where both sides benefit from the structure.</li>
          </ul>

          <h2 id="setup">How to Set Up Accountability Today</h2>
          <p>You don&apos;t need to wait for the perfect group. Start now:</p>
          <ol>
            <li><strong>Pick one person</strong> — a friend who&apos;s also searching, a former colleague, anyone willing to check in weekly.</li>
            <li><strong>Set a recurring time</strong> — 30 minutes, same day each week. Put it on the calendar.</li>
            <li><strong>Use a simple format:</strong> What did you commit to? What did you actually do? What will you commit to this week?</li>
            <li><strong>Track commitments in writing</strong> — a shared doc, a Slack channel, anything that creates a record.</li>
          </ol>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Get structured accountability now</h2>
            <p>An AI-powered council that tracks your commitments and checks in every session.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
