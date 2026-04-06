import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'Interview Preparation: A Complete Guide | jobsearch.quest',
  description: 'A structured approach to interview prep: behavioral questions, STAR method, company research, negotiation strategy, and how to practice effectively.',
  alternates: { canonical: `${BASE}/learn/interview-preparation-guide` },
  openGraph: {
    title: 'Interview Preparation: A Complete Guide',
    description: 'From behavioral questions to offer stage — a structured approach to interview prep.',
    type: 'article',
    url: `${BASE}/learn/interview-preparation-guide`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'How many stories should I prepare for behavioral interviews?', answer: '8–10 stories that cover different competencies: leadership, conflict resolution, failure, delivery under pressure, decision-making with incomplete information, influencing without authority, changing course, and your proudest accomplishment. You won\'t use all of them, but having options lets you match the best story to each question.' },
  { question: 'How long should my interview answers be?', answer: 'Behavioral answers should be 90 seconds to 2 minutes. Shorter feels underprepared; longer loses the interviewer\'s attention. Practice with a timer until you hit this range consistently.' },
  { question: 'What questions should I ask the interviewer?', answer: 'Ask questions that demonstrate genuine curiosity about the role and company, not questions you could Google. Good examples: "What does success look like in this role in the first 6 months?" "What\'s the biggest challenge the team is facing right now?" "How does this team make decisions?"' },
];

const toc = [
  { id: 'three-layers', label: 'The Three Layers of Interview Prep' },
  { id: 'content', label: 'Layer 1: Content Preparation' },
  { id: 'narrative', label: 'Layer 2: Narrative Strategy' },
  { id: 'evaluation', label: 'Layer 3: Your Evaluation Framework' },
  { id: 'practice', label: 'Practice That Works' },
  { id: 'day-of', label: 'The Day-Of Checklist' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/job-offer-negotiation', title: 'How to Negotiate a Job Offer', description: 'What to do when the interview process leads to an offer.' },
  { href: '/learn/candidate-market-fit', title: 'Candidate-Market Fit', description: 'The strategic positioning work that makes interview narratives click.' },
  { href: '/learn/what-is-a-job-search-council', title: 'What Is a Job Search Council?', description: 'Get mock interview practice with multi-perspective feedback.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="Interview Preparation: A Complete Guide" description="A structured approach to interview prep: behavioral questions, STAR method, company research, and negotiation strategy." />
      <BreadcrumbJsonLd items={[{ name: 'Interview Preparation Guide', href: `${BASE}/learn/interview-preparation-guide` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Interview Prep</div>
          <h1>Interview Preparation: A Complete Guide</h1>
          <p className={styles.subtitle}>
            Interview prep isn&apos;t about memorizing answers. It&apos;s about building a strategic narrative, practicing delivery, and walking in with a clear evaluation framework.
          </p>

          <TableOfContents items={toc} />

          <h2 id="three-layers">The Three Layers of Interview Prep</h2>
          <p>Most people only do Layer 1. The best candidates do all three:</p>
          <ol>
            <li><strong>Content:</strong> What you&apos;ll say — your stories, examples, and answers to common questions</li>
            <li><strong>Narrative:</strong> The thread that connects everything — why you, why this role, why now</li>
            <li><strong>Evaluation:</strong> Your framework for deciding if this opportunity is right for you</li>
          </ol>

          <h2 id="content">Layer 1: Content Preparation</h2>

          <h3>Build Your Story Bank</h3>
          <p>
            Before you prep for specific questions, build a bank of 8–10 stories from your career that demonstrate different competencies. Each story should cover a situation, your specific actions, and measurable results. This is the STAR method, but the key insight is: <em>build the bank before you need it</em>.
          </p>
          <p>Stories you should have ready:</p>
          <ul>
            <li>A time you led a team through a difficult challenge</li>
            <li>A conflict you resolved with a colleague or stakeholder</li>
            <li>A failure and what you learned from it</li>
            <li>A time you delivered results under tight constraints</li>
            <li>A decision you made with incomplete information</li>
            <li>An example of influencing without authority</li>
            <li>A time you had to change course mid-project</li>
            <li>Your proudest professional accomplishment and why</li>
          </ul>

          <h3>Company Research That Matters</h3>
          <p>Skip the &quot;I looked at your website&quot; research. Focus on:</p>
          <ul>
            <li><strong>Recent company decisions</strong> — acquisitions, product launches, leadership changes. These reveal priorities.</li>
            <li><strong>Team structure</strong> — Who would you report to? Who are your peers? What does the org chart tell you about how the company values this function?</li>
            <li><strong>Challenges they&apos;re facing</strong> — From earnings calls, press coverage, Glassdoor reviews, or your <a href="/learn/networking-for-job-seekers">network</a>. The more specific you can be about their problems, the more valuable your candidacy becomes.</li>
            <li><strong>Culture signals</strong> — How do they communicate publicly? What do current/former employees say? Does their culture match your <a href="/learn/how-to-write-a-two-pager">Must-Haves and Must-Nots</a>?</li>
          </ul>

          <h2 id="narrative">Layer 2: Narrative Strategy</h2>
          <p>
            Interviewers meet many qualified candidates. What they remember is the narrative — the compelling reason why <em>this particular person</em> is the right fit for <em>this particular role</em>.
          </p>
          <p>Your narrative should answer three questions:</p>
          <ol>
            <li><strong>Why you?</strong> What unique combination of skills and experience do you bring?</li>
            <li><strong>Why this role?</strong> What specifically about this opportunity — not just this company — excites you?</li>
            <li><strong>Why now?</strong> What makes this the logical next step in your <a href="/learn/career-pivot-guide">career arc</a>?</li>
          </ol>
          <p>
            Every answer you give should subtly reinforce this narrative. Your story about resolving a conflict? Connect it to the collaborative culture this company values. Your example of delivering under constraints? Link it to the stage this company is at.
          </p>

          <h2 id="evaluation">Layer 3: Your Evaluation Framework</h2>
          <p>
            An interview is a two-way evaluation. Going in without your own criteria leads to accepting roles you&apos;ll regret. Before the interview, be clear about:
          </p>
          <ul>
            <li>What specific questions will you ask to assess your Must-Haves?</li>
            <li>What signals would make you excited? What signals would be red flags?</li>
            <li>What does the interviewer&apos;s behavior tell you about the culture?</li>
          </ul>

          <h2 id="practice">Practice That Works</h2>
          <p>
            Reading your answers silently is not practice. Effective interview prep requires speaking out loud — ideally to another person or an <a href="/learn/ai-job-search-tools">AI practice tool</a>.
          </p>
          <ul>
            <li><strong>Record yourself:</strong> Most people are surprised by how they sound. Recording reveals filler words, rambling, and unclear transitions.</li>
            <li><strong>Time your answers:</strong> Behavioral answers should be 90 seconds to 2 minutes. Practice hitting that range.</li>
            <li><strong>Practice with someone who pushes back:</strong> A <a href="/learn/what-is-a-job-search-council">Job Search Council</a> is ideal for this — multiple people, different perspectives, honest feedback.</li>
            <li><strong>Do full mock interviews:</strong> Not just individual questions. The stamina and flow of a full 45-minute interview is a skill that requires practice.</li>
          </ul>

          <h2 id="day-of">The Day-Of Checklist</h2>
          <ul>
            <li>Review your narrative thread — the connective story across your answers</li>
            <li>Re-read the job description and your research notes</li>
            <li>Prepare 3–5 specific questions that demonstrate genuine curiosity</li>
            <li>Have your story bank mentally indexed — you won&apos;t use all 10, but you need options</li>
            <li>Know your <a href="/learn/job-offer-negotiation">salary expectations and negotiation boundaries</a></li>
          </ul>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Practice with a council</h2>
            <p>Get interview prep feedback from multiple AI perspectives — recruiter, strategist, and coach.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
