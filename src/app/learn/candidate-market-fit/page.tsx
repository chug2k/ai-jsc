import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'Candidate-Market Fit: Finding the Right Role | jobsearch.quest',
  description: 'Stop applying everywhere. Candidate-Market Fit is a strategic framework for matching your strengths to roles where you\'ll thrive — and get hired faster.',
  alternates: { canonical: `${BASE}/learn/candidate-market-fit` },
  openGraph: {
    title: 'Candidate-Market Fit: Finding the Right Role',
    description: 'A strategic approach to matching your strengths to roles where you\'ll actually thrive.',
    type: 'article',
    url: `${BASE}/learn/candidate-market-fit`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'What is Candidate-Market Fit?', answer: 'Candidate-Market Fit is the alignment between what you offer (skills, experience, working style) and what the market actually needs (specific roles at specific companies at this moment). It\'s borrowed from the startup concept of product-market fit. When you have it, interviews go deeper, conversations lead somewhere, and offers come faster.' },
  { question: 'How do I know if I have Candidate-Market Fit?', answer: 'Signs you have it: conversations with target companies feel natural, interviewers say your background is exactly what they need, you can explain in one sentence why you\'re pursuing this type of role, and your application-to-interview conversion rate is improving. Signs you don\'t: you\'re applying to very different roles with the same resume, interviews stall after round one, and networking conversations don\'t lead to next steps.' },
  { question: 'How long does it take to find Candidate-Market Fit?', answer: 'Typically 2–4 weeks of focused work: completing a Mnookin Two-Pager to define your value, having 10–15 Listening Tour conversations to understand market demand, and iterating your positioning based on feedback. It\'s an investment that dramatically accelerates the rest of your search.' },
];

const toc = [
  { id: 'what-is', label: 'What Is Candidate-Market Fit?' },
  { id: 'why-missing', label: 'Why Most People Don\'t Have It' },
  { id: 'framework', label: 'Finding Your Fit: A Framework' },
  { id: 'signs-found', label: 'Signs You\'ve Found It' },
  { id: 'signs-not', label: 'Signs You Haven\'t Found It Yet' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/how-to-write-a-two-pager', title: 'How to Write a Mnookin Two-Pager', description: 'The foundation exercise for defining your unique value and non-negotiables.' },
  { href: '/learn/networking-for-job-seekers', title: 'Networking for Job Seekers', description: 'The Listening Tour that validates your Candidate-Market Fit hypothesis.' },
  { href: '/learn/career-pivot-guide', title: 'Career Pivot Guide', description: 'For career changers, Candidate-Market Fit requires extra validation.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="Candidate-Market Fit: Finding the Right Role" description="A strategic framework for matching your strengths to roles where you'll thrive and get hired faster." />
      <BreadcrumbJsonLd items={[{ name: 'Candidate-Market Fit', href: `${BASE}/learn/candidate-market-fit` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Candidate-Market Fit</div>
          <h1>Candidate-Market Fit: Finding the Right Role</h1>
          <p className={styles.subtitle}>
            73% of job seekers apply to the wrong roles. The issue isn&apos;t effort — it&apos;s aim. Candidate-Market Fit is the framework for targeting roles where you&apos;ll actually win.
          </p>

          <TableOfContents items={toc} />

          <h2 id="what-is">What Is Candidate-Market Fit?</h2>
          <p>
            Borrowed from the startup concept of &quot;product-market fit,&quot; Candidate-Market Fit is the alignment between what you offer (your skills, experience, and working style) and what the market actually needs (specific roles at specific companies at this specific moment).
          </p>
          <p>
            When you have Candidate-Market Fit, job searching feels different. Conversations lead somewhere. Interviews go deeper. Offers come faster. When you don&apos;t have it, everything feels like pushing uphill — lots of applications, few callbacks, generic rejections.
          </p>

          <h2 id="why-missing">Why Most People Don&apos;t Have It</h2>
          <p>Three common patterns:</p>
          <ol>
            <li><strong>Targeting based on title, not fit.</strong> &quot;I want to be a Director of Product&quot; says nothing about which companies need someone with your specific background. A Director of Product at a Series A startup is a completely different role than at a Fortune 500.</li>
            <li><strong>Applying too broadly.</strong> Applying to 50 different roles across 10 industries isn&apos;t a strategy — it&apos;s a lottery ticket. Each application gets less preparation, and none of them are compelling.</li>
            <li><strong>Ignoring the market&apos;s perspective.</strong> You know what you want. But do you know what hiring managers are actually looking for? The gap between self-perception and market perception is where most searches stall.</li>
          </ol>

          <h2 id="framework">Finding Your Fit: A Framework</h2>

          <h3>Step 1: Define Your Unique Value</h3>
          <p>
            Not &quot;what are you good at?&quot; but &quot;what combination of skills and experience makes you unusually valuable for specific types of problems?&quot;
          </p>
          <p>
            The <a href="/learn/how-to-write-a-two-pager">Mnookin Two-Pager</a> is the starting tool here. It forces you to articulate your Must-Haves and Must-Nots, which narrows the field. But Candidate-Market Fit goes further — it asks you to think about what makes you <em>competitively strong</em> for specific roles.
          </p>
          <p>Ask yourself:</p>
          <ul>
            <li>What problems have I solved that most people in my field haven&apos;t?</li>
            <li>What combination of experiences do I have that&apos;s unusual?</li>
            <li>What do colleagues or managers consistently come to me for?</li>
            <li>Where does my background give me an unfair advantage?</li>
          </ul>

          <h3>Step 2: Map the Market</h3>
          <p>
            Now look at the demand side. Not &quot;what jobs are open?&quot; but &quot;what kinds of companies are hiring for the problems I&apos;m uniquely good at solving?&quot;
          </p>
          <ul>
            <li><strong>Company stage:</strong> Startups need builders. Growth companies need scalers. Enterprises need optimizers. Which stage matches your strengths?</li>
            <li><strong>Industry dynamics:</strong> Some industries are expanding and hiring aggressively. Others are consolidating. Your experience may be more valuable in a specific sector.</li>
            <li><strong>Role evolution:</strong> What new roles are emerging? Cross-functional roles often favor people with diverse backgrounds.</li>
          </ul>

          <h3>Step 3: Validate Through Conversations</h3>
          <p>
            Your Candidate-Market Fit hypothesis needs testing. The <a href="/learn/networking-for-job-seekers">Listening Tour</a> is where you validate:
          </p>
          <ul>
            <li>Is the problem I solve actually a priority at these companies?</li>
            <li>Do hiring managers describe the ideal candidate the way I describe myself?</li>
            <li>What am I missing in my understanding of what this role requires?</li>
          </ul>
          <p>
            After 10–15 conversations, your positioning should be sharper. You&apos;ll know which companies are a fit, which roles play to your strengths, and how to talk about your experience in terms the market cares about.
          </p>

          <h3>Step 4: Position Yourself</h3>
          <p>
            Once you know your fit, adjust everything to reflect it:
          </p>
          <ul>
            <li><strong>Resume:</strong> Lead with the experiences most relevant to your target roles, not the most recent ones.</li>
            <li><strong>LinkedIn:</strong> Your headline and summary should speak directly to the problem you solve for your target market.</li>
            <li><strong>Outreach:</strong> When you contact people at target companies, you can be specific: &quot;I&apos;ve spent 8 years solving [specific problem] and I know your team is dealing with this at scale.&quot;</li>
            <li><strong>Interviews:</strong> Your <a href="/learn/interview-preparation-guide">narrative</a> becomes tight because you know exactly why you&apos;re the right person for this specific role.</li>
          </ul>

          <h2 id="signs-found">Signs You&apos;ve Found It</h2>
          <ul>
            <li>Conversations with target companies feel natural, not forced</li>
            <li>Interviewers say things like &quot;your background is exactly what we&apos;re looking for&quot;</li>
            <li>You can explain in one sentence why you&apos;re pursuing this specific type of role</li>
            <li>You&apos;re getting referrals to similar roles without asking for them</li>
            <li>Your application-to-interview conversion rate improves significantly</li>
          </ul>

          <h2 id="signs-not">Signs You Haven&apos;t Found It Yet</h2>
          <ul>
            <li>You&apos;re applying to very different types of roles with the same resume</li>
            <li>Interviews don&apos;t progress past the first round</li>
            <li>You struggle to articulate why <em>you</em> specifically for <em>this</em> role specifically</li>
            <li>Networking conversations don&apos;t lead to next steps</li>
          </ul>
          <p>
            If this is you, it&apos;s not a failure — it&apos;s information. Go back to Step 1, refine your positioning, and test again. A <a href="/learn/what-is-a-job-search-council">Job Search Council</a> can provide the outside perspective to help you see what you&apos;re missing.
          </p>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Find your Candidate-Market Fit</h2>
            <p>A council session dedicated to identifying your unique positioning and target market.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
