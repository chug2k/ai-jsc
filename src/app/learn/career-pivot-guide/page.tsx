import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'How to Successfully Pivot Your Career | jobsearch.quest',
  description: 'A practical framework for career changers: identify transferable skills, test new directions with low-risk experiments, and position yourself for roles in a new field.',
  alternates: { canonical: `${BASE}/learn/career-pivot-guide` },
  openGraph: {
    title: 'How to Successfully Pivot Your Career',
    description: 'A framework for career changers: identifying transferable skills, testing new directions, and landing the role.',
    type: 'article',
    url: `${BASE}/learn/career-pivot-guide`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'How long does a career pivot take?', answer: 'Most successful career pivots take 6–18 months from decision to landing a new role. The timeline depends on how different your target field is, how much validation and networking you do upfront, and whether you need to build new skills. Rushing the process often means accepting the wrong role.' },
  { question: 'Do I need to go back to school to change careers?', answer: 'Usually not. Many pivots are better served by building a portfolio, doing side projects, or getting hands-on experience through freelancing or volunteering. A degree can help in regulated fields (medicine, law, engineering), but for most knowledge-work pivots, demonstrated skills matter more than credentials.' },
  { question: 'How do I explain a career change on my resume?', answer: 'Lead with a strong summary that frames your pivot narrative — why your background makes you uniquely valuable for this new direction. Then reorganize experience to highlight transferable skills relevant to your target role, rather than listing everything chronologically.' },
];

const toc = [
  { id: 'paradox', label: 'The Pivot Paradox' },
  { id: 'transferable-skills', label: 'Step 1: Identify Transferable Skills' },
  { id: 'validate', label: 'Step 2: Validate Before You Leap' },
  { id: 'narrative', label: 'Step 3: Build Your Narrative' },
  { id: 'network-in', label: 'Step 4: Network Into the Role' },
  { id: 'first-role', label: 'Step 5: Be Strategic About the First Role' },
  { id: 'mistakes', label: 'Common Pivot Mistakes' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/candidate-market-fit', title: 'Candidate-Market Fit', description: 'The strategic framework for matching your transferable skills to market demand.' },
  { href: '/learn/networking-for-job-seekers', title: 'Networking for Job Seekers', description: 'The Listening Tour is non-negotiable for career changers.' },
  { href: '/learn/how-to-write-a-two-pager', title: 'How to Write a Mnookin Two-Pager', description: 'Clarify your Must-Haves and Must-Nots before making the leap.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="How to Successfully Pivot Your Career" description="A practical framework for career changers: identify transferable skills, test new directions, and position yourself for roles in a new field." />
      <BreadcrumbJsonLd items={[{ name: 'Career Pivot Guide', href: `${BASE}/learn/career-pivot-guide` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Career Pivot</div>
          <h1>How to Successfully Pivot Your Career</h1>
          <p className={styles.subtitle}>
            Career pivots feel risky because they are. But the biggest risk isn&apos;t changing direction — it&apos;s doing it without a framework. Here&apos;s how to pivot strategically.
          </p>

          <TableOfContents items={toc} />

          <h2 id="paradox">The Pivot Paradox</h2>
          <p>
            Career changers face a catch-22: you need experience to get hired, but you need to get hired to gain experience. This is real, but it&apos;s not as insurmountable as it feels. The key is reframing your existing experience as <em>directly relevant</em> rather than starting over.
          </p>

          <h2 id="transferable-skills">Step 1: Identify Transferable Skills</h2>
          <p>
            Every career builds skills that transfer. The trick is identifying which ones matter in your target field and how to articulate them. Common high-transfer skills:
          </p>
          <ul>
            <li><strong>Problem-solving under constraints</strong> — Every field values people who can deliver with limited resources</li>
            <li><strong>Cross-functional communication</strong> — If you&apos;ve worked across teams, that&apos;s valuable everywhere</li>
            <li><strong>Project management</strong> — Shipping things on time transfers regardless of what you&apos;re shipping</li>
            <li><strong>Customer/stakeholder empathy</strong> — Understanding what people need is universal</li>
            <li><strong>Data-informed decision making</strong> — Doesn&apos;t require being a data scientist</li>
          </ul>
          <p>
            The <a href="/learn/how-to-write-a-two-pager">Mnookin Two-Pager exercise</a> is particularly useful here: it forces you to articulate what you bring and what you need, creating clarity for both you and potential employers.
          </p>

          <h2 id="validate">Step 2: Validate Before You Leap</h2>
          <p>
            Don&apos;t quit your job to &quot;figure it out.&quot; Test your new direction while you still have income and stability:
          </p>
          <ul>
            <li><strong>Listening Tour:</strong> Have 10–15 <a href="/learn/networking-for-job-seekers">conversations with people in your target field</a>. Ask what they do day-to-day, what surprised them about the role, and what skills they wish they&apos;d had.</li>
            <li><strong>Side projects:</strong> Build something small in your target field. A consultant who wants to move to product? Build a side project. A marketer who wants to move to UX? Do a pro-bono redesign.</li>
            <li><strong>Adjacent moves:</strong> Can you move toward your target within your current company? A lateral move to a related department is a lower-risk way to build relevant experience.</li>
          </ul>

          <h2 id="narrative">Step 3: Build Your Narrative</h2>
          <p>
            The pivot narrative is the most important thing you&apos;ll craft. It needs to answer one question convincingly: <strong>&quot;Why should someone in [new field] hire someone from [old field]?&quot;</strong>
          </p>
          <p>The best pivot narratives follow this structure:</p>
          <ol>
            <li><strong>I was good at X</strong> — Establish credibility in your previous career</li>
            <li><strong>I discovered Y</strong> — The genuine reason you&apos;re drawn to the new direction</li>
            <li><strong>X prepared me for Y because...</strong> — The specific transferable skills and insights</li>
            <li><strong>Here&apos;s proof</strong> — Projects, conversations, courses, or experiences that validate the transition</li>
          </ol>

          <h2 id="network-in">Step 4: Network Into the Role</h2>
          <p>
            Career changers almost never get hired through job boards. The resume doesn&apos;t check the boxes. Instead, you get hired through relationships — people who&apos;ve met you, seen your work, and can vouch for your ability to learn quickly.
          </p>
          <p>
            This is why the <a href="/learn/networking-for-job-seekers">Listening Tour</a> is non-negotiable for career changers. Every conversation builds your knowledge of the field, expands your network, and creates opportunities for referrals.
          </p>

          <h2 id="first-role">Step 5: Be Strategic About the First Role</h2>
          <p>
            Your first role in a new field probably won&apos;t be your dream role. That&apos;s fine. Optimize for learning velocity, not title or compensation. Look for:
          </p>
          <ul>
            <li>Roles that value your transferable skills while teaching new ones</li>
            <li>Companies that hire for potential, not just pedigree</li>
            <li>Managers who have a track record of developing people</li>
            <li>Environments where you&apos;ll get broad exposure quickly (startups, smaller teams)</li>
          </ul>

          <h2 id="mistakes">Common Pivot Mistakes</h2>
          <ul>
            <li><strong>Going back to school first:</strong> Sometimes necessary, but often a way to delay the uncomfortable work of networking and applying. Many pivots don&apos;t require a degree.</li>
            <li><strong>Hiding your background:</strong> Your previous career is an asset, not a liability. The most interesting hires are the ones with diverse backgrounds.</li>
            <li><strong>Targeting too broadly:</strong> &quot;I want to work in tech&quot; isn&apos;t a pivot strategy. &quot;I want a product marketing role at a B2B SaaS company&quot; is. Use the <a href="/learn/candidate-market-fit">Candidate-Market Fit</a> framework.</li>
            <li><strong>Pivoting alone:</strong> Career changes are complex, emotional decisions. Having a <a href="/learn/what-is-a-job-search-council">council</a> or accountability group to pressure-test your thinking is invaluable.</li>
          </ul>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Get perspective on your pivot</h2>
            <p>A council of AI advisors with different perspectives — strategist, recruiter, devil&apos;s advocate — to pressure-test your career change.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
