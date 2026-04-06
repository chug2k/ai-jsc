import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'How to Write a Mnookin Two-Pager for Your Job Search | jobsearch.quest',
  description: 'The Mnookin Two-Pager is a structured exercise to define your Must-Haves and Must-Nots before job searching. Step-by-step guide with examples and templates.',
  alternates: { canonical: `${BASE}/learn/how-to-write-a-two-pager` },
  openGraph: {
    title: 'How to Write a Mnookin Two-Pager',
    description: 'Define your Must-Haves and Must-Nots before you search. Step-by-step guide with examples.',
    type: 'article',
    url: `${BASE}/learn/how-to-write-a-two-pager`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'What is a Mnookin Two-Pager?', answer: 'The Mnookin Two-Pager is a structured exercise from the Never Search Alone methodology, named after Harvard negotiation professor Robert Mnookin. It\'s a two-page document where you articulate your Must-Nots (absolute dealbreakers) and Must-Haves (non-negotiable requirements) for your next role. It creates the clarity that makes the rest of your job search more efficient.' },
  { question: 'How is a Must-Not different from a preference?', answer: 'A Must-Not is an absolute dealbreaker — something you would turn down an otherwise perfect role for. "No travel more than 10% of the time" is a Must-Not if you genuinely wouldn\'t take a role that requires weekly travel, regardless of compensation. "I\'d prefer less travel" is a preference. The Two-Pager only works if you\'re ruthlessly honest about the distinction.' },
  { question: 'Should I update my Two-Pager during my search?', answer: 'Yes. The Two-Pager is a living document. As you have Listening Tour conversations and learn more about what\'s available in the market, you\'ll likely refine your Must-Haves and Must-Nots. The key is that changes should be deliberate — driven by new information, not desperation.' },
];

const toc = [
  { id: 'what-is', label: 'What Is the Mnookin Two-Pager?' },
  { id: 'why', label: 'Why This Exercise Matters' },
  { id: 'must-nots', label: 'Page 1: Your Must-Nots' },
  { id: 'must-haves', label: 'Page 2: Your Must-Haves' },
  { id: 'common-mistakes', label: 'Common Mistakes' },
  { id: 'council-review', label: 'Getting Council Feedback' },
  { id: 'using-it', label: 'Using Your Two-Pager' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/never-search-alone-methodology', title: 'The Never Search Alone Methodology', description: 'The Two-Pager is one piece of a larger curriculum — see the full picture.' },
  { href: '/learn/candidate-market-fit', title: 'Candidate-Market Fit', description: 'Your Two-Pager defines your side. Candidate-Market Fit matches it to the market.' },
  { href: '/learn/job-offer-negotiation', title: 'Job Offer Negotiation', description: 'Your Must-Haves become your negotiation priorities when an offer arrives.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="How to Write a Mnookin Two-Pager for Your Job Search" description="The Mnookin Two-Pager is a structured exercise to define your Must-Haves and Must-Nots. Step-by-step guide with examples." />
      <BreadcrumbJsonLd items={[{ name: 'How to Write a Mnookin Two-Pager', href: `${BASE}/learn/how-to-write-a-two-pager` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Mnookin Two-Pager</div>
          <h1>How to Write a Mnookin Two-Pager</h1>
          <p className={styles.subtitle}>
            Before you apply to a single job, answer this: what do you actually want? The Mnookin Two-Pager is the exercise that forces clarity — and makes everything else easier.
          </p>

          <TableOfContents items={toc} />

          <h2 id="what-is">What Is the Mnookin Two-Pager?</h2>
          <p>
            The Mnookin Two-Pager is a signature exercise from the <a href="/learn/never-search-alone-methodology">Never Search Alone methodology</a>, named after Harvard negotiation professor Robert Mnookin. It&apos;s exactly what it sounds like: a two-page document.
          </p>
          <ul>
            <li><strong>Page 1: Must-Nots</strong> — The things you absolutely will not accept in your next role. Dealbreakers, not preferences.</li>
            <li><strong>Page 2: Must-Haves</strong> — The non-negotiable requirements your next role must include.</li>
          </ul>
          <p>
            The power of the Two-Pager is its constraint. Two pages forces you to prioritize. If everything is a Must-Have, nothing is. If you have 20 Must-Nots, you haven&apos;t done the hard work of distinguishing dealbreakers from preferences.
          </p>

          <h2 id="why">Why This Exercise Matters</h2>
          <p>
            Most job seekers skip this step. They start searching based on a vague sense of what they want — &quot;something in product,&quot; &quot;a senior role at a good company,&quot; &quot;remote with good comp.&quot; This vagueness leads to:
          </p>
          <ul>
            <li><strong>Applying too broadly</strong> — wasting time on roles that don&apos;t actually fit</li>
            <li><strong>Poor negotiation</strong> — accepting offers without knowing what matters most to you</li>
            <li><strong>Regret</strong> — taking a role that sounds good on paper but violates an unstated need</li>
            <li><strong>Burnout</strong> — the scatter of an unfocused search drains <a href="/learn/job-search-burnout">energy</a> faster</li>
          </ul>
          <p>
            The Two-Pager eliminates vagueness. Once you&apos;ve written it, every job description can be quickly evaluated against your criteria. Every networking conversation has a clear frame. Every offer has a rubric.
          </p>

          <h2 id="must-nots">Page 1: Your Must-Nots</h2>
          <p>
            Must-Nots are dealbreakers. These are conditions under which you would decline an offer, regardless of how appealing the rest of the package is. The key question: <strong>&quot;Would I actually walk away over this?&quot;</strong>
          </p>
          <p>If the answer is &quot;well, it depends...&quot; — it&apos;s a preference, not a Must-Not.</p>
          <p>Examples of real Must-Nots:</p>
          <ul>
            <li>&quot;No roles requiring more than 20% travel&quot; (because of family obligations)</li>
            <li>&quot;No companies with fewer than 50 employees&quot; (because I need structure to do my best work)</li>
            <li>&quot;No roles reporting to someone who doesn&apos;t have direct authority over my budget&quot;</li>
            <li>&quot;No industries I don&apos;t believe in ethically&quot; (with specific examples)</li>
            <li>&quot;No base salary below $X&quot; (based on actual financial requirements, not aspiration)</li>
          </ul>
          <p>
            Notice these aren&apos;t generic. They&apos;re specific, personal, and grounded in self-knowledge. The best Must-Nots come from <em>experience</em> — things you&apos;ve learned about yourself through previous roles.
          </p>

          <h2 id="must-haves">Page 2: Your Must-Haves</h2>
          <p>
            Must-Haves are non-negotiable requirements. The role must include these for you to accept it. Again, the bar is: <strong>&quot;Would I decline an offer that doesn&apos;t include this?&quot;</strong>
          </p>
          <p>Examples of real Must-Haves:</p>
          <ul>
            <li>&quot;People management — I need to be growing a team, not just doing IC work&quot;</li>
            <li>&quot;Remote-first or fully remote (not hybrid with in-office expectations)&quot;</li>
            <li>&quot;Direct impact on product decisions, not just executing someone else&apos;s roadmap&quot;</li>
            <li>&quot;A manager who has managed managers before&quot;</li>
            <li>&quot;Series B or later — I need the stability of product-market fit&quot;</li>
          </ul>
          <p>
            Aim for 5–8 Must-Haves. Fewer than that and you haven&apos;t pushed hard enough. More than that and you may be confusing Must-Haves with Nice-to-Haves.
          </p>

          <h2 id="common-mistakes">Common Mistakes</h2>
          <ul>
            <li><strong>Too generic:</strong> &quot;Good culture&quot; is not a Must-Have. &quot;A culture where decisions are made transparently with written rationale&quot; is.</li>
            <li><strong>Too aspirational:</strong> Don&apos;t list what you wish you wanted. List what you actually need. If comp is your #1 priority, own it.</li>
            <li><strong>Confusing preferences with dealbreakers:</strong> If you&apos;d accept a role without it for the right comp or the right team, it&apos;s not a Must-Have.</li>
            <li><strong>Not being honest about Must-Nots:</strong> The Two-Pager only works if you tell the truth. &quot;No return-to-office mandates&quot; is a valid Must-Not if that&apos;s real for you.</li>
            <li><strong>Writing it alone:</strong> The Two-Pager improves dramatically with outside feedback. A <a href="/learn/what-is-a-job-search-council">council</a> will catch the places where you&apos;re not being specific enough or honest enough.</li>
          </ul>

          <h2 id="council-review">Getting Council Feedback</h2>
          <p>
            In the <a href="/learn/never-search-alone-methodology">Never Search Alone curriculum</a>, Session 4 is dedicated to the council reviewing your Two-Pager. This is where the document gets sharp:
          </p>
          <ul>
            <li>Council members challenge vague items: &quot;What does &apos;good culture&apos; actually mean to you?&quot;</li>
            <li>They test your conviction: &quot;If you got a dream offer that violated Must-Not #3, would you really walk away?&quot;</li>
            <li>They spot blind spots: &quot;You didn&apos;t mention comp at all — is that intentional?&quot;</li>
            <li>They share their own Two-Pagers for comparison and calibration</li>
          </ul>

          <h2 id="using-it">Using Your Two-Pager</h2>
          <p>Once written and reviewed, the Two-Pager becomes your operational filter:</p>
          <ul>
            <li><strong>Screening roles:</strong> Before applying, check the listing against your Must-Nots and Must-Haves. If it violates a Must-Not or misses a Must-Have, skip it — no matter how appealing the title or company.</li>
            <li><strong>Networking conversations:</strong> Share your Must-Haves (not Must-Nots) with your <a href="/learn/networking-for-job-seekers">network</a>. It helps people connect you to relevant opportunities.</li>
            <li><strong>Interview evaluation:</strong> Ask questions in <a href="/learn/interview-preparation-guide">interviews</a> that test your Must-Haves. If the answers don&apos;t align, you have your answer.</li>
            <li><strong><a href="/learn/job-offer-negotiation">Offer negotiation</a>:</strong> Your Must-Haves become your negotiation priorities. You know what you&apos;re willing to flex on and what you&apos;re not.</li>
          </ul>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Write your Two-Pager with guidance</h2>
            <p>An AI council session dedicated to helping you define your Must-Haves and Must-Nots.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
