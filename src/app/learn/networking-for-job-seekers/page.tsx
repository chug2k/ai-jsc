import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'Networking Strategies for Job Seekers | jobsearch.quest',
  description: 'The Listening Tour approach to job search networking: build genuine connections that lead to opportunities, not awkward cold outreach. Practical scripts and frameworks included.',
  alternates: { canonical: `${BASE}/learn/networking-for-job-seekers` },
  openGraph: {
    title: 'Networking Strategies for Job Seekers',
    description: 'The Listening Tour approach: genuine connections that lead to opportunities, not awkward asks.',
    type: 'article',
    url: `${BASE}/learn/networking-for-job-seekers`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'How many networking conversations should I have per week?', answer: 'Aim for 3–5 conversations per week during active searching. This is enough to build momentum and generate referrals without burning out. Quality matters more than quantity — one great conversation that leads to three introductions is better than five surface-level chats.' },
  { question: 'What if I don\'t know anyone in my target field?', answer: 'Start with the Gratitude House exercise — list everyone who\'s helped you professionally, everyone you\'ve helped, and people you admire in your target field. You likely have more connections than you think. From there, each conversation should end with "who else should I talk to?" to expand your network into new territory.' },
  { question: 'How do I network without feeling like I\'m using people?', answer: 'The Listening Tour reframes networking as genuine learning, not transactional asking. You\'re having conversations to understand a field, validate your assumptions, and learn from people\'s experiences. When your curiosity is genuine, the conversation feels natural — and relationships that start this way are more likely to lead to opportunities.' },
];

const toc = [
  { id: 'why-fails', label: 'Why Most Job Search Networking Fails' },
  { id: 'listening-tour', label: 'The Listening Tour' },
  { id: 'gratitude-house', label: 'The Gratitude House: Where to Start' },
  { id: 'reach-out', label: 'How to Reach Out' },
  { id: 'during', label: 'During the Conversation' },
  { id: 'after', label: 'After the Conversation' },
  { id: 'math', label: 'Networking Math' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/never-search-alone-methodology', title: 'The Never Search Alone Methodology', description: 'The full framework behind the Listening Tour and Gratitude House.' },
  { href: '/learn/career-pivot-guide', title: 'Career Pivot Guide', description: 'Networking is especially critical for career changers — here\'s the complete pivot framework.' },
  { href: '/learn/candidate-market-fit', title: 'Candidate-Market Fit', description: 'Use your networking conversations to validate your Candidate-Market Fit hypothesis.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="Networking Strategies for Job Seekers" description="The Listening Tour approach to job search networking: build genuine connections that lead to opportunities." />
      <BreadcrumbJsonLd items={[{ name: 'Networking for Job Seekers', href: `${BASE}/learn/networking-for-job-seekers` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Networking</div>
          <h1>Networking Strategies for Job Seekers</h1>
          <p className={styles.subtitle}>
            Most networking advice is backwards. You don&apos;t need to &quot;work the room&quot; or send 100 cold messages. You need genuine conversations with the right people. Here&apos;s how.
          </p>

          <TableOfContents items={toc} />

          <h2 id="why-fails">Why Most Job Search Networking Fails</h2>
          <p>
            The word &quot;networking&quot; makes people cringe because it&apos;s been reduced to transactional outreach: &quot;Hi, I see you work at [company]. I&apos;d love to pick your brain.&quot; People on the receiving end can feel the ask coming from a mile away.
          </p>
          <p>
            Effective networking during a job search doesn&apos;t feel like networking. It feels like learning. The <a href="/learn/never-search-alone-methodology">Never Search Alone methodology</a> calls this the Listening Tour.
          </p>

          <h2 id="listening-tour">The Listening Tour</h2>
          <p>
            A Listening Tour is a series of 15–20 informational conversations with people in your target companies, roles, and industries. The goal is <em>not</em> to ask for a job. It&apos;s to:
          </p>
          <ul>
            <li>Understand what companies actually need (vs. what job descriptions say)</li>
            <li>Validate your assumptions about roles and industries</li>
            <li>Build genuine relationships based on curiosity, not need</li>
            <li>Develop insider language and knowledge that makes you a stronger candidate</li>
          </ul>

          <h2 id="gratitude-house">The Gratitude House: Where to Start</h2>
          <p>
            The biggest barrier to networking is &quot;I don&apos;t know who to talk to.&quot; The Gratitude House exercise from the <a href="/learn/never-search-alone-methodology">Never Search Alone methodology</a> fixes this:
          </p>
          <ol>
            <li><strong>List everyone who&apos;s helped you professionally.</strong> Former managers, mentors, colleagues who taught you something, clients you worked well with.</li>
            <li><strong>List everyone you&apos;ve helped.</strong> People you mentored, colleagues you supported, friends you gave career advice to.</li>
            <li><strong>List people you admire in your target field.</strong> Authors, speakers, people whose work you follow online.</li>
          </ol>
          <p>
            You now have a list of 30–50 people. Most of them will be happy to have a 20-minute conversation with you. Start there.
          </p>

          <h2 id="reach-out">How to Reach Out</h2>
          <p>Good outreach is short, specific, and makes it easy to say yes:</p>
          <blockquote>
            &quot;Hi [Name], I&apos;m exploring [specific area] as a next career step and your experience at [company/role] really stands out. Would you be open to a 20-minute conversation about what the work is actually like? I&apos;m not looking for a referral — genuinely just trying to learn. Happy to work around your schedule.&quot;
          </blockquote>
          <p>Key principles:</p>
          <ul>
            <li><strong>Be specific about why them.</strong> Not &quot;I see you work in tech&quot; but &quot;your work on [specific project/article/talk].&quot;</li>
            <li><strong>Name the time commitment.</strong> &quot;20 minutes&quot; is much easier to agree to than an open-ended coffee chat.</li>
            <li><strong>Remove the pressure.</strong> Explicitly saying you&apos;re not asking for a referral makes people much more willing to talk.</li>
            <li><strong>Follow up once.</strong> If no response after a week, one polite follow-up. Then move on.</li>
          </ul>

          <h2 id="during">During the Conversation</h2>
          <p>The best Listening Tour conversations follow a simple structure:</p>
          <ul>
            <li><strong>Ask about their path:</strong> &quot;How did you end up in this role?&quot; People love telling their story, and you&apos;ll learn about paths you hadn&apos;t considered.</li>
            <li><strong>Ask about the reality:</strong> &quot;What surprises people about this work?&quot; or &quot;What&apos;s the hardest part of this job that doesn&apos;t show up in job descriptions?&quot;</li>
            <li><strong>Ask about the market:</strong> &quot;If you were hiring for your team right now, what would you look for?&quot;</li>
            <li><strong>Ask for connections:</strong> &quot;Is there anyone else you&apos;d recommend I talk to?&quot; This is how one conversation becomes three.</li>
          </ul>

          <h2 id="after">After the Conversation</h2>
          <ul>
            <li><strong>Send a thank-you within 24 hours.</strong> Mention something specific you learned.</li>
            <li><strong>Follow up on any referrals immediately.</strong> &quot;[Name] suggested I reach out to you...&quot; Warm intros expire fast.</li>
            <li><strong>Share something useful later.</strong> An article relevant to their work, a connection they might value. This turns a one-time conversation into an ongoing relationship.</li>
            <li><strong>Report back to your council.</strong> Share what you learned, how it changes your strategy, and what conversations you&apos;ll have next. This is where <a href="/learn/job-search-accountability">accountability</a> compounds.</li>
          </ul>

          <h2 id="math">Networking Math</h2>
          <p>
            Here&apos;s why this approach works at scale: if you have 15 conversations and each person refers you to 2 others, that&apos;s 45 people who know you, your story, and your goals. When a role opens on their team, you&apos;re not a stranger applying online — you&apos;re &quot;that person [mutual connection] mentioned.&quot;
          </p>
          <p>
            This is how most jobs are actually filled. Referrals account for 30–50% of hires at most companies, and referred candidates are hired at 3–4x the rate of applicants.
          </p>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Build your networking strategy</h2>
            <p>A council session dedicated to your Gratitude House and Listening Tour plan.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
