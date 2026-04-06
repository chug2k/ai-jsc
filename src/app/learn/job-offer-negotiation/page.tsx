import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'How to Negotiate a Job Offer | jobsearch.quest',
  description: 'A step-by-step job offer negotiation guide: when to negotiate, what to ask for, exact scripts to use, and how to handle counteroffers without burning bridges.',
  alternates: { canonical: `${BASE}/learn/job-offer-negotiation` },
  openGraph: {
    title: 'How to Negotiate a Job Offer',
    description: 'A step-by-step negotiation framework that helps you advocate for yourself without burning bridges.',
    type: 'article',
    url: `${BASE}/learn/job-offer-negotiation`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'Should I always negotiate a job offer?', answer: 'Almost always, yes. Over 70% of hiring managers expect candidates to negotiate. Not negotiating doesn\'t make you seem agreeable — it signals you don\'t know your market value. The exception is if the offer already exceeds your target and the role is exactly what you want.' },
  { question: 'What if they rescind the offer because I negotiated?', answer: 'This is extremely rare at reputable companies. A reasonable negotiation request — backed by data and delivered collaboratively — is expected and professional. If a company rescinds because you asked for market rate, that tells you something important about the culture.' },
  { question: 'What\'s the easiest thing to negotiate besides salary?', answer: 'Signing bonuses are often the easiest because they\'re a one-time cost for the company. Start date, extra PTO, title/level, remote work days, and professional development budgets are also commonly negotiable and sometimes easier to get than base salary increases.' },
];

const toc = [
  { id: 'why-negotiate', label: 'Why You Should (Almost) Always Negotiate' },
  { id: 'preparation', label: 'Before the Offer: Preparation' },
  { id: 'when-offer-comes', label: 'When the Offer Comes' },
  { id: 'what-not-to-do', label: 'What Not to Do' },
  { id: 'council-role', label: 'The Role of Your Council' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/interview-preparation-guide', title: 'Interview Preparation Guide', description: 'The interview process that leads to an offer worth negotiating.' },
  { href: '/learn/how-to-write-a-two-pager', title: 'How to Write a Mnookin Two-Pager', description: 'Knowing your Must-Haves helps you negotiate what actually matters.' },
  { href: '/learn/candidate-market-fit', title: 'Candidate-Market Fit', description: 'Strong positioning leads to stronger offers with more negotiating leverage.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="How to Negotiate a Job Offer" description="A step-by-step job offer negotiation guide: when to negotiate, what to ask for, and how to handle counteroffers." />
      <BreadcrumbJsonLd items={[{ name: 'Job Offer Negotiation', href: `${BASE}/learn/job-offer-negotiation` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Negotiation</div>
          <h1>How to Negotiate a Job Offer</h1>
          <p className={styles.subtitle}>
            Most people leave money on the table because they don&apos;t negotiate — or negotiate badly. Here&apos;s a practical framework that works for any role or level.
          </p>

          <TableOfContents items={toc} />

          <h2 id="why-negotiate">Why You Should (Almost) Always Negotiate</h2>
          <p>
            Research consistently shows that 70%+ of hiring managers expect candidates to negotiate. Not negotiating doesn&apos;t make you seem agreeable — it signals that you don&apos;t know your market value or don&apos;t advocate for yourself.
          </p>
          <p>
            The financial impact compounds over time. A $10K difference in starting salary, with 3% annual raises, becomes a $130K+ difference over 10 years. And that&apos;s before accounting for bonuses calculated as a percentage of base.
          </p>

          <h2 id="preparation">Before the Offer: Preparation</h2>

          <h3>Know Your Numbers</h3>
          <p>Before any negotiation conversation, you need three numbers:</p>
          <ul>
            <li><strong>Your target:</strong> The compensation you&apos;d be genuinely excited about. Based on market data, not wishful thinking.</li>
            <li><strong>Your minimum:</strong> The number below which you&apos;d walk away. Informed by your <a href="/learn/how-to-write-a-two-pager">Must-Haves and Must-Nots</a>.</li>
            <li><strong>Their range:</strong> What the company is likely budgeted for. From job postings (some states require it), Levels.fyi, Glassdoor, or your <a href="/learn/networking-for-job-seekers">network</a>.</li>
          </ul>

          <h3>Delay the Salary Conversation</h3>
          <p>
            If asked about salary expectations early in the process, deflect politely: &quot;I&apos;d love to learn more about the role first. I&apos;m confident we can find a number that works for both of us.&quot; The more they invest in you as a candidate, the more flexibility they&apos;ll have on compensation.
          </p>

          <h2 id="when-offer-comes">When the Offer Comes</h2>

          <h3>Step 1: Express Enthusiasm (But Don&apos;t Accept)</h3>
          <p>
            Your first response should be warm but not committal: &quot;Thank you — I&apos;m really excited about this opportunity. I&apos;d like to take a day or two to review the full package. Can we set up a call to discuss?&quot;
          </p>
          <p>Never accept or negotiate in the moment. You need time to evaluate and prepare.</p>

          <h3>Step 2: Evaluate the Full Package</h3>
          <p>Compensation is more than base salary. Review:</p>
          <ul>
            <li><strong>Base salary</strong> — The foundation, and usually the most negotiable</li>
            <li><strong>Equity/stock</strong> — Vesting schedule matters as much as the number</li>
            <li><strong>Signing bonus</strong> — Often the easiest thing to add because it&apos;s a one-time cost</li>
            <li><strong>Annual bonus</strong> — Target vs. actual payout history</li>
            <li><strong>Benefits</strong> — Health insurance, 401k match, PTO, parental leave</li>
            <li><strong>Remote/hybrid policy</strong> — Has real financial implications (commute, housing)</li>
            <li><strong>Title/level</strong> — Affects future job searches and internal growth</li>
            <li><strong>Start date</strong> — Can be valuable if you need time between roles</li>
          </ul>

          <h3>Step 3: Make Your Ask</h3>
          <p>
            Frame the negotiation as collaborative, not adversarial. You&apos;re working together to find a package that reflects your value and makes the partnership work.
          </p>
          <blockquote>
            &quot;I&apos;m very excited about joining the team. Based on my research and the scope of this role, I was hoping we could get the base to [X]. I&apos;m basing this on [specific data point — market data, competing offers, scope of responsibilities]. Is there flexibility there?&quot;
          </blockquote>
          <p>Key principles:</p>
          <ul>
            <li><strong>Ask for a specific number,</strong> not a range. If you give a range, they&apos;ll anchor to the bottom.</li>
            <li><strong>Justify with data,</strong> not personal need. &quot;The market rate is X&quot; is stronger than &quot;I need X for my mortgage.&quot;</li>
            <li><strong>Negotiate one or two things,</strong> not everything. Pick the levers that matter most to you.</li>
            <li><strong>Have a fallback ask.</strong> If base is rigid, pivot: &quot;Would a signing bonus of [Y] be possible?&quot;</li>
          </ul>

          <h3>Step 4: Handle Counteroffers</h3>
          <p>If they come back with a number between their original offer and your ask:</p>
          <ul>
            <li>If it&apos;s above your minimum and close to your target — accept gracefully</li>
            <li>If there&apos;s still a gap — try a different lever (&quot;Could we revisit after 6 months?&quot; or &quot;Would a signing bonus close the gap?&quot;)</li>
            <li>If they say it&apos;s final — take them at their word. Pushing past a stated limit damages the relationship before it starts.</li>
          </ul>

          <h2 id="what-not-to-do">What Not to Do</h2>
          <ul>
            <li><strong>Don&apos;t lie about competing offers.</strong> It&apos;s a small world. Get caught and the offer evaporates.</li>
            <li><strong>Don&apos;t negotiate via email if you can help it.</strong> Tone is hard to read in text. A phone call lets you be warm and direct simultaneously.</li>
            <li><strong>Don&apos;t apologize for negotiating.</strong> &quot;Sorry to ask, but...&quot; undermines your position. You&apos;re not doing anything wrong.</li>
            <li><strong>Don&apos;t accept and then renegotiate.</strong> Once you say yes, the negotiation is over.</li>
          </ul>

          <h2 id="council-role">The Role of Your Council</h2>
          <p>
            Negotiation is one of the areas where outside perspective is most valuable. A <a href="/learn/what-is-a-job-search-council">Job Search Council</a> can help you evaluate whether an offer is competitive, practice your negotiation conversation, and reality-check your expectations — so you walk in confident, not anxious.
          </p>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Practice your negotiation</h2>
            <p>Get feedback from multiple AI advisors on your offer evaluation and negotiation strategy.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
