import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'How to Overcome Job Search Burnout | jobsearch.quest',
  description: 'Job search burnout is real. Learn to recognize the signs, understand why it happens, and rebuild momentum with practical strategies that work.',
  alternates: { canonical: `${BASE}/learn/job-search-burnout` },
  openGraph: {
    title: 'How to Overcome Job Search Burnout',
    description: 'Recognize the signs, break the cycle, and rebuild momentum when the search feels endless.',
    type: 'article',
    url: `${BASE}/learn/job-search-burnout`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'How long does job search burnout last?', answer: 'Without intervention, burnout tends to deepen over time. With deliberate changes — adding structure, getting accountability, redefining progress metrics — most people see improvement within 2–3 weeks. The key is breaking the isolation and creating external momentum.' },
  { question: 'Is it okay to take a break from job searching?', answer: 'Yes. A deliberate 1–2 week break is better than months of low-effort searching. The key word is deliberate — set a specific return date, tell your accountability partner, and use the time to genuinely recharge rather than feeling guilty about not searching.' },
  { question: 'How do I stay motivated during a long job search?', answer: 'Motivation is unreliable — structure is what sustains a search. Set a weekly schedule, join an accountability group or Job Search Council, track input metrics you control (conversations, applications), and celebrate progress beyond just offers.' },
];

const toc = [
  { id: 'why-different', label: 'Why Job Search Burnout Is Different' },
  { id: 'signs', label: 'Recognizing the Signs' },
  { id: 'why-it-happens', label: 'Why It Happens' },
  { id: 'strategies', label: 'Strategies That Actually Help' },
  { id: 'signal', label: 'When Burnout Is a Signal' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/job-search-accountability', title: 'Why Accountability Matters', description: 'External accountability is the #1 antidote to job search drift and burnout.' },
  { href: '/learn/candidate-market-fit', title: 'Candidate-Market Fit', description: 'Burnout often means you\'re targeting too broadly. A strategic framework to fix that.' },
  { href: '/learn/job-search-after-layoff', title: 'Job Search After a Layoff', description: 'When burnout meets the emotional weight of a layoff — specific strategies that help.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="How to Overcome Job Search Burnout" description="Job search burnout is real. Learn to recognize the signs and rebuild momentum with practical strategies." />
      <BreadcrumbJsonLd items={[{ name: 'Job Search Burnout', href: `${BASE}/learn/job-search-burnout` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Burnout</div>
          <h1>How to Overcome Job Search Burnout</h1>
          <p className={styles.subtitle}>
            1 in 3 job seekers quit within 6 months — not because they can&apos;t find work, but because the process itself breaks them down. Here&apos;s how to recognize burnout and rebuild momentum.
          </p>

          <TableOfContents items={toc} />

          <h2 id="why-different">Why Job Search Burnout Is Different</h2>
          <p>
            Work burnout has a clear cause: too much work, too little support. Job search burnout is more insidious because it comes from a <em>lack</em> of structure, feedback, and progress signals.
          </p>
          <p>
            When you&apos;re employed, you get daily feedback — tasks completed, meetings attended, problems solved. When you&apos;re searching, you can work hard for weeks and have nothing to show for it. Applications disappear into a void. Rejections are impersonal. The timeline is unknown.
          </p>

          <h2 id="signs">Recognizing the Signs</h2>
          <p>Job search burnout rarely announces itself. Watch for these patterns:</p>
          <ul>
            <li><strong>Avoidance disguised as research:</strong> Spending hours reading about companies or &quot;optimizing&quot; your resume instead of making contact with actual humans.</li>
            <li><strong>Shrinking ambition:</strong> Gradually lowering your standards — &quot;maybe I should just take anything&quot; — not from strategic recalibration but from exhaustion.</li>
            <li><strong>Social withdrawal:</strong> Avoiding conversations about your search, skipping networking events, isolating from friends who have jobs.</li>
            <li><strong>Identity erosion:</strong> Starting to define yourself by your unemployment rather than your skills and experience.</li>
            <li><strong>Physical symptoms:</strong> Disrupted sleep, low energy, difficulty concentrating on applications or interview prep.</li>
          </ul>

          <h2 id="why-it-happens">Why It Happens</h2>
          <p>Three factors compound to create burnout:</p>
          <ol>
            <li><strong>No feedback loop:</strong> You apply, you wait, you hear nothing. Without feedback, you can&apos;t learn or adjust. You just repeat the same actions hoping for different results.</li>
            <li><strong>Loss of identity:</strong> For many people, work is central to their sense of self. Losing that — even temporarily — creates an existential weight that sits underneath every application.</li>
            <li><strong>Isolation:</strong> Job searching is one of the most solitary professional activities. Without peers going through the same experience, you have no way to normalize the difficulty or share strategies.</li>
          </ol>

          <h2 id="strategies">Strategies That Actually Help</h2>

          <h3>1. Create External Structure</h3>
          <p>
            The biggest risk in job searching is the absence of structure. Create it artificially: set a daily schedule, designate specific blocks for different activities (applications, networking, interview prep), and take actual weekends off.
          </p>

          <h3>2. Get Accountability</h3>
          <p>
            Find someone — a friend, a <a href="/learn/what-is-a-job-search-council">Job Search Council</a>, an AI-powered accountability tool — to check in with weekly. The simple act of stating commitments out loud changes your relationship with the work. <a href="/learn/job-search-accountability">More on why accountability works.</a>
          </p>

          <h3>3. Redefine Progress</h3>
          <p>
            If &quot;progress&quot; only means &quot;got an offer,&quot; you&apos;ll feel stuck for months. Redefine progress in terms of inputs you control: conversations had, applications submitted, skills practiced, clarity gained about what you want.
          </p>

          <h3>4. Protect Your Identity</h3>
          <p>
            You are not your job search. Maintain activities, relationships, and routines that remind you who you are outside of work. Exercise, creative projects, volunteering — anything that provides a sense of agency and accomplishment.
          </p>

          <h3>5. Set a Strategy, Not Just Goals</h3>
          <p>
            &quot;Apply to 10 jobs a week&quot; is a goal, not a strategy. A strategy means: what kinds of roles, at what companies, through what channels, with what positioning. The <a href="/learn/candidate-market-fit">Candidate-Market Fit</a> framework helps here.
          </p>

          <h3>6. Limit Job Board Time</h3>
          <p>
            Scrolling job boards for hours feels productive but usually isn&apos;t. Most roles are filled through referrals and direct outreach. Cap your job board time at 30 minutes/day and spend the rest on <a href="/learn/networking-for-job-seekers">networking and conversations</a>.
          </p>

          <h2 id="signal">When Burnout Is a Signal</h2>
          <p>
            Sometimes burnout is telling you something important: that you&apos;re chasing the wrong roles, that your approach isn&apos;t working, or that you need to fundamentally rethink your strategy. Don&apos;t just push through burnout — listen to it. A structured conversation with a council or advisor can help you figure out what needs to change.
          </p>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Break the cycle</h2>
            <p>A structured council session can help you rebuild clarity and momentum.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
