import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'The Never Search Alone Methodology Explained | jobsearch.quest',
  description: 'Never Search Alone is Phyl Terry\'s proven job search methodology built on accountability councils, structured curriculum, and peer feedback. Learn how it works.',
  alternates: { canonical: `${BASE}/learn/never-search-alone-methodology` },
  openGraph: {
    title: 'The Never Search Alone Methodology Explained',
    description: 'How Phyl Terry\'s 10-session curriculum turns solo job searching into a structured, accountable process.',
    type: 'article',
    url: `${BASE}/learn/never-search-alone-methodology`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'What is the Never Search Alone book about?', answer: 'Never Search Alone by Phyl Terry documents the Job Search Council methodology — a structured, 10-session peer accountability program for job seekers. It covers the full curriculum including the Mnookin Two-Pager, Gratitude House, Listening Tour, and Candidate-Market Fit frameworks.' },
  { question: 'What is the Mnookin Two-Pager?', answer: 'The Mnookin Two-Pager is a structured exercise named after Harvard negotiation professor Robert Mnookin. It forces you to articulate your Must-Nots (absolute dealbreakers) and Must-Haves (non-negotiable requirements) for your next role, creating clarity that makes the rest of your search more efficient.' },
  { question: 'How is the Never Search Alone methodology different from career coaching?', answer: 'Traditional coaching is one-on-one and advice-driven. The Never Search Alone methodology is peer-based and accountability-driven. Instead of being told what to do, you\'re held accountable for commitments by a group of peers who are going through the same experience.' },
];

const toc = [
  { id: 'origin', label: 'Origin Story' },
  { id: 'principles', label: 'Core Principles' },
  { id: 'two-pager', label: 'The Mnookin Two-Pager' },
  { id: 'listening-tour', label: 'The Listening Tour' },
  { id: 'gratitude-house', label: 'The Gratitude House' },
  { id: 'why-it-works', label: 'Why 5,000+ Councils Have Launched' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/what-is-a-job-search-council', title: 'What Is a Job Search Council?', description: 'The structure, format, and session flow of a Job Search Council explained.' },
  { href: '/learn/how-to-write-a-two-pager', title: 'How to Write a Mnookin Two-Pager', description: 'Step-by-step guide to the Must-Nots and Must-Haves exercise.' },
  { href: '/learn/networking-for-job-seekers', title: 'Networking Strategies for Job Seekers', description: 'The Listening Tour approach to building genuine connections.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="The Never Search Alone Methodology Explained" description="Never Search Alone is Phyl Terry's proven job search methodology built on accountability councils and structured curriculum." />
      <BreadcrumbJsonLd items={[{ name: 'Never Search Alone Methodology', href: `${BASE}/learn/never-search-alone-methodology` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Never Search Alone</div>
          <h1>The Never Search Alone Methodology</h1>
          <p className={styles.subtitle}>
            Phyl Terry&apos;s book and community have launched 5,000+ Job Search Councils. Here&apos;s how the methodology works — and why it changes outcomes.
          </p>

          <TableOfContents items={toc} />

          <h2 id="origin">Origin Story</h2>
          <p>
            Phyl Terry spent decades building customer-centric organizations before turning his attention to a broken system: job searching. He observed that talented people were making poor career decisions — not because they lacked skill, but because they lacked structure and outside perspective.
          </p>
          <p>
            His solution was the <a href="/learn/what-is-a-job-search-council">Job Search Council</a>: a small group of peers following a defined curriculum. The book <em>Never Search Alone</em> documents the methodology and has sparked a community of thousands.
          </p>

          <h2 id="principles">Core Principles</h2>
          <p>The methodology rests on a few key ideas:</p>
          <ul>
            <li><strong>Searching alone is a strategy — a bad one.</strong> Most job seekers operate in isolation, making decisions without feedback. This leads to longer searches and worse outcomes.</li>
            <li><strong>Structure beats motivation.</strong> A weekly cadence with exercises and commitments creates momentum that willpower alone can&apos;t sustain.</li>
            <li><strong><a href="/learn/job-search-accountability">Peer accountability</a> outperforms self-discipline.</strong> When you tell three people you&apos;ll send five outreach emails this week, you send them.</li>
            <li><strong>Multiple perspectives prevent blind spots.</strong> A recruiter, a career changer, and a senior executive will each see different things in your approach.</li>
          </ul>

          <h2 id="two-pager">The Mnookin Two-Pager</h2>
          <p>
            One of the methodology&apos;s signature tools is the <a href="/learn/how-to-write-a-two-pager">Mnookin Two-Pager</a>, named after Harvard negotiation professor Robert Mnookin. It&apos;s a structured exercise that forces you to articulate:
          </p>
          <ul>
            <li><strong>Must-Nots:</strong> The things you absolutely won&apos;t accept in your next role. Not preferences — dealbreakers.</li>
            <li><strong>Must-Haves:</strong> The non-negotiable requirements. Things like &quot;remote work&quot; or &quot;people management&quot; or &quot;Series B or later.&quot;</li>
          </ul>
          <p>
            Most job seekers skip this work. They apply broadly, hoping something will feel right. The Two-Pager forces specificity — and that specificity is what makes the rest of the search more efficient.
          </p>

          <h2 id="listening-tour">The Listening Tour</h2>
          <p>
            Instead of cold-applying to listings, the methodology advocates for a &quot;Listening Tour&quot; — a series of informational conversations with people in your target companies, roles, and industries. The goal isn&apos;t to ask for a job. It&apos;s to:
          </p>
          <ul>
            <li>Validate or refine your Two-Pager assumptions</li>
            <li>Learn what companies actually need (vs. what job descriptions say)</li>
            <li>Build genuine relationships that may lead to referrals</li>
            <li>Develop your <a href="/learn/candidate-market-fit">Candidate-Market Fit</a> positioning</li>
          </ul>
          <p>
            The council provides <a href="/learn/job-search-accountability">accountability</a> for the Listening Tour: how many conversations did you have? What did you learn? How does it change your approach?
          </p>

          <h2 id="gratitude-house">The Gratitude House</h2>
          <p>
            Another key framework is the Gratitude House — a structured way to map and activate your professional network. Instead of the anxiety-inducing &quot;I need to network,&quot; the Gratitude House reframes it: who are the people who&apos;ve helped you, taught you, or worked alongside you? Start there.
          </p>
          <p>
            The exercise produces a concrete contact list and outreach plan, turning <a href="/learn/networking-for-job-seekers">&quot;networking&quot;</a> from abstract to actionable.
          </p>

          <h2 id="why-it-works">Why 5,000+ Councils Have Launched</h2>
          <p>
            The methodology works because it addresses the real problem. Job seekers don&apos;t fail because they can&apos;t write resumes. They fail because they:
          </p>
          <ul>
            <li>Don&apos;t know what they actually want</li>
            <li>Apply too broadly without a clear strategy</li>
            <li>Lose momentum after weeks of <a href="/learn/job-search-burnout">rejection</a></li>
            <li>Accept the wrong offer out of desperation</li>
          </ul>
          <p>
            A council, whether human or AI-powered, systematically addresses each of these failure modes.
          </p>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Experience the methodology</h2>
            <p>Try an AI-powered Job Search Council session based on the Never Search Alone curriculum.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
