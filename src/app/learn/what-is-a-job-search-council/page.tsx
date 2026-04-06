import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'What Is a Job Search Council? | jobsearch.quest',
  description: 'A Job Search Council is a small peer group that meets weekly to hold each other accountable, share strategy, and accelerate the job search. Learn how they work and why 5,000+ have launched.',
  alternates: { canonical: `${BASE}/learn/what-is-a-job-search-council` },
  openGraph: {
    title: 'What Is a Job Search Council?',
    description: 'A structured peer group that meets weekly to accelerate your job search through accountability and shared strategy.',
    type: 'article',
    url: `${BASE}/learn/what-is-a-job-search-council`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'How many people are in a Job Search Council?', answer: 'A typical council has 4–6 members. This is large enough for diverse perspectives but small enough that everyone gets meaningful airtime each session.' },
  { question: 'How long does a Job Search Council last?', answer: 'The Never Search Alone curriculum runs 10 sessions, typically one per week. Many councils continue meeting informally after the curriculum ends.' },
  { question: 'Do I need to be actively job searching to join a council?', answer: 'No. Councils are also valuable for people exploring a career change, considering their next move, or preparing for a future search. The early sessions focus on clarifying what you want.' },
];

const toc = [
  { id: 'short-answer', label: 'The Short Answer' },
  { id: 'why-they-work', label: 'Why Do Job Search Councils Work?' },
  { id: 'curriculum', label: 'The 10-Session Curriculum' },
  { id: 'typical-session', label: 'What Happens in a Typical Session?' },
  { id: 'real-vs-ai', label: 'Real vs. AI-Powered Councils' },
  { id: 'who-should-join', label: 'Who Should Join?' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/never-search-alone-methodology', title: 'The Never Search Alone Methodology', description: 'Deep dive into the 10-session curriculum, the Mnookin Two-Pager, and the Listening Tour.' },
  { href: '/learn/job-search-accountability', title: 'Why Accountability Matters', description: 'The research behind accountability partners and how to set one up today.' },
  { href: '/learn/job-search-burnout', title: 'How to Overcome Job Search Burnout', description: 'Recognize the signs and rebuild momentum when the search feels endless.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="What Is a Job Search Council?" description="A Job Search Council is a small peer group that meets weekly to hold each other accountable, share strategy, and accelerate the job search." />
      <BreadcrumbJsonLd items={[{ name: 'What Is a Job Search Council?', href: `${BASE}/learn/what-is-a-job-search-council` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Job Search Council</div>
          <h1>What Is a Job Search Council?</h1>
          <p className={styles.subtitle}>
            A small, structured peer group that meets weekly to hold each other accountable, challenge assumptions, and push each member toward the right role — faster.
          </p>

          <TableOfContents items={toc} />

          <h2 id="short-answer">The Short Answer</h2>
          <p>
            A Job Search Council (JSC) is a group of 4–6 people who are actively searching for work. They meet weekly for a structured session where each member shares progress, makes commitments, and receives honest feedback from the group. The concept was pioneered by Phyl Terry and documented in the book <em>Never Search Alone</em>.
          </p>
          <p>
            Unlike casual networking or job clubs, a JSC follows a specific curriculum. There are defined roles (moderator, hot-seat member), structured exercises, and accountability mechanisms. It&apos;s not a support group — it&apos;s a working group.
          </p>

          <h2 id="why-they-work">Why Do Job Search Councils Work?</h2>
          <p>
            Searching for a job alone is one of the most isolating professional experiences. You&apos;re making high-stakes decisions — which roles to target, when to accept an offer, how to negotiate — without the perspective you&apos;d normally have at work.
          </p>
          <p>A council fixes this by providing three things:</p>
          <ul>
            <li><strong>Accountability:</strong> Weekly commitments that prevent the drift of &quot;I&apos;ll apply tomorrow.&quot; Research shows that solo searchers take up to 5x longer without external accountability.</li>
            <li><strong>Perspective:</strong> Outside eyes catch blind spots. A recruiter in your council sees your resume differently than you do. A career changer asks questions your industry peers wouldn&apos;t think of.</li>
            <li><strong>Structure:</strong> The 10-session curriculum moves you through clear phases — from defining what you want, to building your network, to evaluating offers — so you&apos;re not just spinning your wheels.</li>
          </ul>

          <h2 id="curriculum">The 10-Session Curriculum</h2>
          <p>The Never Search Alone methodology uses a structured 10-session curriculum:</p>
          <ol>
            <li><strong>Trust-Building</strong> — Introductions, setting expectations, emotional landscape of the search</li>
            <li><strong>Your Story & Goals</strong> — Career context and articulating what you&apos;re actually looking for</li>
            <li><strong>Must-Nots & Must-Haves</strong> — The <a href="/learn/how-to-write-a-two-pager">Mnookin Two-Pager</a> exercise to clarify non-negotiables</li>
            <li><strong>Mnookin Review</strong> — Council feedback on your Two-Pager</li>
            <li><strong>Gratitude House</strong> — Building and activating your <a href="/learn/networking-for-job-seekers">network</a> with a contact list</li>
            <li><strong>Listening Tour</strong> — Conducting informational conversations and reporting back</li>
            <li><strong>Candidate-Market Fit</strong> — <a href="/learn/candidate-market-fit">Strategic positioning</a> based on what the market wants</li>
            <li><strong>Interview Prep</strong> — Practice, feedback, and <a href="/learn/interview-preparation-guide">offer evaluation</a> frameworks</li>
            <li><strong>Final Stretch</strong> — Making decisions and navigating offers</li>
            <li><strong>Closure</strong> — Reflection and paying it forward</li>
          </ol>

          <h2 id="typical-session">What Happens in a Typical Session?</h2>
          <p>Each session follows a consistent five-phase structure:</p>
          <ol>
            <li><strong>Check-In (5 min):</strong> Each member shares a quick update — what happened this week, how they&apos;re feeling, any wins or setbacks.</li>
            <li><strong>Exercise (15 min):</strong> The curriculum-specific exercise for that session. Might be filling out the Mnookin Two-Pager, reviewing a Listening Tour strategy, or practicing an elevator pitch.</li>
            <li><strong>Hot Seat (20 min):</strong> One member gets the floor. The council gives focused feedback on their specific situation — a job offer to evaluate, a networking challenge, a career pivot decision.</li>
            <li><strong>Commitments (5 min):</strong> Each member states 2–3 specific, measurable commitments for the coming week.</li>
            <li><strong>Check-Out (5 min):</strong> One word or phrase to close — how you&apos;re leaving the session.</li>
          </ol>

          <h2 id="real-vs-ai">Real vs. AI-Powered Councils</h2>
          <p>
            Over 5,000 real Job Search Councils have launched through the Never Search Alone community. They work incredibly well — when you can assemble one. The challenge is logistics: finding 4–6 people at the same career stage, coordinating schedules, and maintaining commitment over 10 weeks.
          </p>
          <p>
            An AI-powered council gives you the same structured methodology — the curriculum, the accountability, the multi-perspective feedback — available on your schedule, 24/7. It won&apos;t replace the human connection of a real council, but it removes every barrier to getting started.
          </p>

          <h2 id="who-should-join">Who Should Join a Job Search Council?</h2>
          <p>Councils are effective for anyone navigating a career transition:</p>
          <ul>
            <li>Active job seekers who want structure and accountability</li>
            <li><a href="/learn/career-pivot-guide">Career pivoters</a> trying to articulate their transferable value</li>
            <li>People considering a change but not yet &quot;officially&quot; searching</li>
            <li>Anyone who&apos;s been searching for months and feels <a href="/learn/job-search-burnout">stuck or burned out</a></li>
          </ul>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Try a Job Search Council session</h2>
            <p>Your first AI-powered council session is free. No signup required to explore.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
