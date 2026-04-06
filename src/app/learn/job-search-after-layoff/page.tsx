import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'Job Search After a Layoff: What to Do First | jobsearch.quest',
  description: 'Got laid off? A week-by-week guide to navigating the emotional and practical realities of job searching after a layoff, from severance negotiation to landing your next role.',
  alternates: { canonical: `${BASE}/learn/job-search-after-layoff` },
  openGraph: {
    title: 'Job Search After a Layoff: What to Do First',
    description: 'A week-by-week guide to navigating job search after a layoff — emotional and practical.',
    type: 'article',
    url: `${BASE}/learn/job-search-after-layoff`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'How soon should I start job searching after a layoff?', answer: 'Give yourself at least a few days to process before diving into applications. But don\'t wait too long — the first week is ideal for practical tasks (severance review, LinkedIn update, notifying your network). Start active searching by week 2–3, while the emotional support of friends and former colleagues is strongest.' },
  { question: 'Should I mention I was laid off in interviews?', answer: 'Yes — briefly and without shame. Layoffs are common and usually not a reflection of individual performance. A simple "The company restructured and my role was eliminated" is sufficient. Then pivot to what you\'re excited about next. Trying to hide a layoff creates more awkwardness than addressing it directly.' },
  { question: 'How do I handle the gap on my resume?', answer: 'For recent layoffs, you don\'t need to explain the gap — it\'s expected. If you\'ve been searching for several months, fill the gap with genuine activities: freelance projects, volunteering, courses, or simply "Career transition — focused on [specific skill/area]." Hiring managers care about what you can do, not that you took time between roles.' },
];

const toc = [
  { id: 'first-week', label: 'The First Week' },
  { id: 'emotional', label: 'The Emotional Reality' },
  { id: 'practical', label: 'The Practical Playbook' },
  { id: 'network', label: 'Leveraging Your Network After a Layoff' },
  { id: 'common-traps', label: 'Common Post-Layoff Traps' },
  { id: 'reframe', label: 'The Reframe' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/job-search-burnout', title: 'Job Search Burnout', description: 'Layoffs compound burnout risk — recognize the signs early.' },
  { href: '/learn/job-search-accountability', title: 'Why Accountability Matters', description: 'External accountability is critical when your daily structure disappears overnight.' },
  { href: '/learn/what-is-a-job-search-council', title: 'What Is a Job Search Council?', description: 'The structured peer group designed for exactly this moment.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="Job Search After a Layoff: What to Do First" description="A week-by-week guide to navigating job search after a layoff — emotional and practical." />
      <BreadcrumbJsonLd items={[{ name: 'Job Search After a Layoff', href: `${BASE}/learn/job-search-after-layoff` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / After a Layoff</div>
          <h1>Job Search After a Layoff: What to Do First</h1>
          <p className={styles.subtitle}>
            A layoff isn&apos;t just a career event — it&apos;s an emotional one. Here&apos;s how to navigate both realities, from the first week through landing your next role.
          </p>

          <TableOfContents items={toc} />

          <h2 id="first-week">The First Week</h2>
          <p>
            The first week after a layoff is for stabilization, not optimization. Don&apos;t try to do everything at once. Focus on these priorities:
          </p>
          <ol>
            <li><strong>Review your severance agreement carefully.</strong> Don&apos;t sign immediately. Understand what you&apos;re getting (pay, benefits continuation, outplacement services) and what you&apos;re giving up (non-compete clauses, release of claims). If the package is significant, it may be worth a lawyer&apos;s review.</li>
            <li><strong>Secure your finances.</strong> Know how many months of runway you have. This determines how aggressive or selective your search can be. Apply for unemployment if eligible — it&apos;s not a sign of weakness, it&apos;s insurance you paid for.</li>
            <li><strong>Save your work artifacts.</strong> Before you lose access: download performance reviews, recommendation letters, project portfolios, and contact information for colleagues. These are harder to get later.</li>
            <li><strong>Tell your close network.</strong> Not a LinkedIn post yet — just the 10–15 people closest to you, personally and professionally. They&apos;ll be your first line of support and leads.</li>
          </ol>

          <h2 id="emotional">The Emotional Reality</h2>
          <p>
            Even when you know a layoff isn&apos;t personal, it <em>feels</em> personal. The emotions are real and they follow a pattern:
          </p>
          <ul>
            <li><strong>Shock and relief:</strong> The first few days often feel surreal. Some people feel unexpected relief alongside the anxiety.</li>
            <li><strong>Anger and grief:</strong> Resentment toward the company, grief for relationships and routines. These are normal and need space.</li>
            <li><strong>Identity crisis:</strong> &quot;What am I if I&apos;m not [title] at [company]?&quot; This is the deepest challenge — and the one most people try to skip past.</li>
            <li><strong>Rebuilding:</strong> Gradually, energy returns and the search starts to feel like a project rather than a crisis.</li>
          </ul>
          <p>
            Don&apos;t rush through these stages. Launching a frantic job search while still processing anger or grief leads to <a href="/learn/job-search-burnout">burnout</a> or bad decisions. A few days of genuine rest is not a luxury — it&apos;s strategic.
          </p>

          <h2 id="practical">The Practical Playbook</h2>
          <p>Once you&apos;ve stabilized (usually week 2), work through this sequence:</p>

          <h3>Week 2: Clarity</h3>
          <ul>
            <li>Complete the <a href="/learn/how-to-write-a-two-pager">Mnookin Two-Pager</a> — what are your Must-Haves and Must-Nots for the next role?</li>
            <li>Don&apos;t start applying yet. A targeted search outperforms a panicked one.</li>
            <li>Update your LinkedIn profile and resume, but don&apos;t post publicly until you know your narrative.</li>
          </ul>

          <h3>Week 3–4: Outreach</h3>
          <ul>
            <li>Start your <a href="/learn/networking-for-job-seekers">Listening Tour</a>. Have 3–5 conversations per week.</li>
            <li>Post on LinkedIn if you&apos;re comfortable. Layoff announcements get high engagement and surface opportunities.</li>
            <li>Begin targeted applications — quality over quantity.</li>
          </ul>

          <h3>Week 5+: Momentum</h3>
          <ul>
            <li>Establish a weekly routine with <a href="/learn/job-search-accountability">accountability</a>.</li>
            <li>Refine your <a href="/learn/candidate-market-fit">Candidate-Market Fit</a> based on conversations.</li>
            <li>Prep for interviews systematically with the <a href="/learn/interview-preparation-guide">three-layer approach</a>.</li>
          </ul>

          <h2 id="network">Leveraging Your Network After a Layoff</h2>
          <p>
            A layoff activates your network in a way that voluntary searching doesn&apos;t. People want to help. The key is making it easy for them:
          </p>
          <ul>
            <li><strong>Be specific about what you&apos;re looking for.</strong> &quot;I&apos;m looking for a Senior PM role at a B2B SaaS company, Series B to D, with a remote option&quot; is actionable. &quot;Let me know if you hear of anything&quot; is not.</li>
            <li><strong>Ask for introductions, not jobs.</strong> &quot;Do you know anyone at [company] I could talk to?&quot; is much easier for people to act on than &quot;Are they hiring?&quot;</li>
            <li><strong>Update your network regularly.</strong> A monthly update to your supporters — what you&apos;ve learned, where you&apos;re focusing — keeps you top of mind and gives them new ways to help.</li>
          </ul>

          <h2 id="common-traps">Common Post-Layoff Traps</h2>
          <ul>
            <li><strong>Panic applying:</strong> Sending 50 applications in the first week because action feels better than uncertainty. This is the opposite of strategy — it&apos;s emotion dressed as productivity.</li>
            <li><strong>Accepting too fast:</strong> Taking the first offer because the anxiety of unemployment is unbearable. A <a href="/learn/what-is-a-job-search-council">council</a> can help you evaluate objectively.</li>
            <li><strong>Isolating:</strong> Withdrawing from friends and avoiding conversations about work. Isolation is the enemy of a successful search.</li>
            <li><strong>Overinvesting in skills:</strong> Signing up for three courses and two certifications before applying to a single job. Learning is fine, but it often becomes a form of avoidance.</li>
            <li><strong>Comparing timelines:</strong> &quot;My colleague found something in two weeks.&quot; Every search is different. Comparison creates anxiety without information.</li>
          </ul>

          <h2 id="reframe">The Reframe</h2>
          <p>
            A layoff is a disruption. But it&apos;s also something most people in long careers experience at least once — and many look back on as a turning point. With structure, <a href="/learn/job-search-accountability">accountability</a>, and a strategic approach, this can be the search that leads to your best role yet.
          </p>
          <p>
            The key is not doing it alone.
          </p>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Don&apos;t search alone</h2>
            <p>A structured council session to help you process, strategize, and build momentum.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
