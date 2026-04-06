import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'Job Search for Senior Professionals & Executives | jobsearch.quest',
  description: 'Senior-level job searching is a different game: fewer openings, longer timelines, higher stakes. A strategic guide for directors, VPs, and executives navigating their next move.',
  alternates: { canonical: `${BASE}/learn/job-search-for-senior-professionals` },
  openGraph: {
    title: 'Job Search for Senior Professionals & Executives',
    description: 'Fewer openings, longer timelines, higher stakes — a strategic guide for senior job seekers.',
    type: 'article',
    url: `${BASE}/learn/job-search-for-senior-professionals`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'How long does a senior-level job search typically take?', answer: 'Senior searches (Director+) typically take 4–8 months, and executive searches (VP/C-suite) can take 6–12+ months. The timeline is longer because there are fewer roles, the evaluation process is more thorough, and timing plays a bigger factor. Accepting this timeline upfront prevents panic-driven decisions.' },
  { question: 'Should senior professionals use recruiters?', answer: 'Yes, but strategically. Executive recruiters (retained search firms) work on specific engagements and can be very valuable. Build relationships with 2–3 recruiters who specialize in your function and level. But don\'t rely on recruiters alone — they fill a fraction of senior roles. Your network and direct outreach are equally important.' },
  { question: 'Is it harder to change industries at the senior level?', answer: 'It\'s harder but not impossible. The key is identifying which parts of your experience are industry-agnostic (leadership, strategy, team-building) and which are industry-specific (domain knowledge, regulatory understanding). Pivots at the senior level usually work best when you move to a new industry but keep the same function, or vice versa — not both at once.' },
];

const toc = [
  { id: 'different-game', label: 'A Different Game' },
  { id: 'hidden-market', label: 'The Hidden Job Market' },
  { id: 'positioning', label: 'Positioning at the Senior Level' },
  { id: 'network-strategy', label: 'Network Strategy' },
  { id: 'interview-dynamics', label: 'Senior Interview Dynamics' },
  { id: 'emotional', label: 'The Emotional Challenge' },
  { id: 'timeline', label: 'Managing the Timeline' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/candidate-market-fit', title: 'Candidate-Market Fit', description: 'At the senior level, fit is everything — positioning must be precise.' },
  { href: '/learn/job-offer-negotiation', title: 'Job Offer Negotiation', description: 'Senior compensation packages have more levers — equity, bonuses, scope, title.' },
  { href: '/learn/networking-for-job-seekers', title: 'Networking for Job Seekers', description: 'At the senior level, your network IS the job market.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="Job Search for Senior Professionals & Executives" description="Senior-level job searching: fewer openings, longer timelines, higher stakes. A strategic guide for directors, VPs, and executives." />
      <BreadcrumbJsonLd items={[{ name: 'Job Search for Senior Professionals', href: `${BASE}/learn/job-search-for-senior-professionals` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Senior Professionals</div>
          <h1>Job Search for Senior Professionals & Executives</h1>
          <p className={styles.subtitle}>
            At the senior level, job searching is a fundamentally different exercise. Fewer openings, longer timelines, more stakeholders, and higher stakes. Here&apos;s the playbook.
          </p>

          <TableOfContents items={toc} />

          <h2 id="different-game">A Different Game</h2>
          <p>
            If you&apos;re a Director, VP, or executive searching for your next role, most generic job search advice doesn&apos;t apply to you. The dynamics are different:
          </p>
          <ul>
            <li><strong>Fewer openings:</strong> There are dramatically fewer senior roles than mid-level ones. The funnel inverts — you&apos;re not choosing from dozens of listings, you&apos;re hunting for a handful of the right opportunities.</li>
            <li><strong>Longer evaluation:</strong> Senior hiring involves more stakeholders, more rounds, and more diligence. A single hire might take 2–3 months from first conversation to offer.</li>
            <li><strong>Relationship-driven:</strong> The majority of senior roles are filled through networks and referrals, not applications. Many are never publicly posted.</li>
            <li><strong>Higher stakes:</strong> A bad hire at the senior level is expensive for everyone. Companies are cautious, and you should be too — <a href="/learn/how-to-write-a-two-pager">knowing what you want</a> is non-negotiable.</li>
          </ul>

          <h2 id="hidden-market">The Hidden Job Market</h2>
          <p>
            At the senior level, the &quot;hidden job market&quot; isn&apos;t a myth — it&apos;s the primary market. Roles are often created for specific people, filled through retained search firms, or decided in board-level conversations before a job description is ever written.
          </p>
          <p>To access this market:</p>
          <ul>
            <li><strong>Maintain relationships with executive recruiters.</strong> Build these relationships before you need them. 2–3 search firms that specialize in your function and level can be invaluable.</li>
            <li><strong>Stay visible in your industry.</strong> Speaking, writing, advising, board work — anything that keeps your name in circulation among decision-makers.</li>
            <li><strong>Leverage your board and investor network.</strong> If you&apos;ve worked with boards or investors, they have visibility into companies that are about to hire at your level.</li>
          </ul>

          <h2 id="positioning">Positioning at the Senior Level</h2>
          <p>
            <a href="/learn/candidate-market-fit">Candidate-Market Fit</a> is even more critical at the senior level because the margin for error is smaller. You&apos;re not competing with hundreds of applicants — you&apos;re competing with 3–5 highly qualified candidates. Your positioning must be precise:
          </p>
          <ul>
            <li><strong>Lead with outcomes, not responsibilities.</strong> &quot;Grew revenue from $40M to $120M&quot; beats &quot;Led the sales organization.&quot;</li>
            <li><strong>Be specific about your superpower.</strong> What do you do better than other people at your level? Turnarounds? Scaling? Team building? IPO readiness? The more specific, the more memorable.</li>
            <li><strong>Know your stage.</strong> Are you a 0-to-1 builder? A 1-to-10 scaler? A steady-state optimizer? Different companies need different leaders, and mismatching your stage to theirs is the #1 cause of senior-level failure.</li>
          </ul>

          <h2 id="network-strategy">Network Strategy</h2>
          <p>
            At the senior level, your <a href="/learn/networking-for-job-seekers">network</a> IS the job market. But senior networking looks different from mid-career networking:
          </p>
          <ul>
            <li><strong>Peer conversations:</strong> Other executives at your level are your best source of intelligence about which companies are hiring, which boards are making changes, and which roles are about to open.</li>
            <li><strong>Board members and investors:</strong> They have portfolio-wide visibility and often make introductions for senior hires.</li>
            <li><strong>Former direct reports:</strong> People you&apos;ve managed who are now in senior roles themselves. They&apos;re often in a position to recommend you or create a role for you.</li>
            <li><strong>Industry advisors and consultants:</strong> They talk to many companies and have broad visibility into who&apos;s looking for what.</li>
          </ul>

          <h2 id="interview-dynamics">Senior Interview Dynamics</h2>
          <p>
            Senior interviews are less about &quot;tell me about a time when...&quot; and more about strategic alignment:
          </p>
          <ul>
            <li><strong>Vision alignment:</strong> Does your vision for the function match the CEO&apos;s or board&apos;s expectations? Misalignment here is a dealbreaker.</li>
            <li><strong>100-day plan:</strong> You may be asked — directly or indirectly — what you&apos;d do in the first 100 days. Have a thoughtful answer that shows you&apos;ve listened more than you&apos;ve assumed.</li>
            <li><strong>Culture add, not just culture fit:</strong> Boards and CEOs often hire senior leaders specifically to <em>change</em> something. Understand what they want to change and whether you&apos;re the right person to drive it.</li>
            <li><strong>Reference dynamics:</strong> At this level, references are taken very seriously. Former board members, CEOs you&apos;ve worked with, and direct reports will all be called. Prepare them.</li>
          </ul>

          <h2 id="emotional">The Emotional Challenge</h2>
          <p>
            Senior professionals often struggle more with the <em>identity</em> component of job searching. When your title and company have been central to how you introduce yourself and how others perceive you, losing that — even temporarily — hits hard.
          </p>
          <p>
            The <a href="/learn/job-search-burnout">burnout patterns</a> are amplified: longer timelines mean longer uncertainty. Fewer openings mean more weight on each opportunity. Higher comp expectations mean more financial pressure.
          </p>
          <p>
            This is exactly why the <a href="/learn/what-is-a-job-search-council">Job Search Council</a> format is so valuable at the senior level. Having a group of peers who understand the specific dynamics of senior job searching — the ego challenges, the political complexity, the longer timelines — provides something that no amount of individual prep can match.
          </p>

          <h2 id="timeline">Managing the Timeline</h2>
          <p>Accept these realities upfront:</p>
          <ul>
            <li><strong>4–8 months is normal for Director+ roles.</strong> 6–12 months for VP/C-suite. Planning for this prevents panic.</li>
            <li><strong>Gaps are less stigmatized at senior levels.</strong> Boards and hiring committees understand that senior transitions take time. A well-explained gap is not a red flag.</li>
            <li><strong>Use the time strategically.</strong> Board advisory roles, consulting engagements, or writing establish you as active and visible during the search.</li>
            <li><strong>Set <a href="/learn/job-search-accountability">weekly accountability</a>.</strong> Even with longer timelines, weekly structure prevents drift.</li>
          </ul>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Get senior-level perspective</h2>
            <p>AI advisors trained on executive career strategy — strategist, recruiter, and insider perspectives.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
