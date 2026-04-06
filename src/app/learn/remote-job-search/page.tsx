import { Metadata } from 'next';
import styles from '../learn.module.css';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, TableOfContents, FaqSection, RelatedGuides } from '../components';

const BASE = 'https://jobsearch.quest';

export const metadata: Metadata = {
  title: 'How to Find a Remote Job in 2026 | jobsearch.quest',
  description: 'A practical guide to remote job searching: where to find remote roles, how to stand out as a remote candidate, negotiating remote work, and avoiding scams.',
  alternates: { canonical: `${BASE}/learn/remote-job-search` },
  openGraph: {
    title: 'How to Find a Remote Job in 2026',
    description: 'Where to find remote roles, how to stand out, and how to negotiate remote work arrangements.',
    type: 'article',
    url: `${BASE}/learn/remote-job-search`,
    images: [{ url: `${BASE}/img/hero.jpg`, width: 1200, height: 630 }],
  },
};

const faqs = [
  { question: 'Are companies still hiring remotely in 2026?', answer: 'Yes, but the landscape has shifted. Many companies now offer hybrid arrangements rather than fully remote. Fully remote roles still exist — particularly at distributed-first companies, startups, and in roles like engineering, design, content, and customer success. The key is knowing where to look and how to position yourself.' },
  { question: 'How do I stand out when applying for remote jobs?', answer: 'Demonstrate remote-specific skills: async communication, self-management, documentation habits, and experience with distributed teams. In your resume and interviews, highlight specific examples of remote collaboration, not just that you "worked from home." Companies want evidence you thrive without in-person oversight.' },
  { question: 'Should I accept a lower salary for a remote role?', answer: 'Not automatically. Some companies adjust for cost of living, but many pay market rate regardless of location. Know the company\'s compensation philosophy before accepting a discount. Use the same negotiation framework you\'d use for any role — your value doesn\'t decrease because you work from home.' },
];

const toc = [
  { id: 'landscape', label: 'The Remote Work Landscape in 2026' },
  { id: 'where-to-look', label: 'Where to Find Remote Roles' },
  { id: 'stand-out', label: 'How to Stand Out as a Remote Candidate' },
  { id: 'interview', label: 'The Remote Interview Process' },
  { id: 'negotiating', label: 'Negotiating Remote Work' },
  { id: 'red-flags', label: 'Red Flags and Scams' },
  { id: 'faq', label: 'FAQ' },
];

const related = [
  { href: '/learn/candidate-market-fit', title: 'Candidate-Market Fit', description: 'Remote work is a Must-Have — position yourself for companies that value it.' },
  { href: '/learn/job-offer-negotiation', title: 'Job Offer Negotiation', description: 'How to negotiate remote arrangements and location-based compensation.' },
  { href: '/learn/how-to-write-a-two-pager', title: 'How to Write a Mnookin Two-Pager', description: 'Clarify whether remote is a Must-Have or a preference before you search.' },
];

export default function Page() {
  return (
    <>
      <ArticleJsonLd headline="How to Find a Remote Job in 2026" description="A practical guide to remote job searching: where to find remote roles, how to stand out, and how to negotiate remote work." />
      <BreadcrumbJsonLd items={[{ name: 'Remote Job Search', href: `${BASE}/learn/remote-job-search` }]} />
      <FaqJsonLd faqs={faqs} />
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><a href="/learn">Guides</a> / Remote Job Search</div>
          <h1>How to Find a Remote Job in 2026</h1>
          <p className={styles.subtitle}>
            Remote roles are still out there — but finding them requires a different strategy than the 2020 gold rush. Here&apos;s what works now.
          </p>

          <TableOfContents items={toc} />

          <h2 id="landscape">The Remote Work Landscape in 2026</h2>
          <p>
            The remote work market has matured. The pandemic-era explosion of remote roles has settled into a more nuanced landscape. Some companies have returned to office-first. Others have committed to distributed work permanently. Many have landed on hybrid models.
          </p>
          <p>
            For job seekers, this means remote work is no longer the default — it&apos;s a feature you need to specifically target and negotiate for. The good news: companies that <em>are</em> remote tend to be very intentional about it, which often means better remote culture and support.
          </p>

          <h2 id="where-to-look">Where to Find Remote Roles</h2>
          <p>Not all job boards are created equal for remote searches:</p>
          <ul>
            <li><strong>Remote-first job boards:</strong> Sites like We Work Remotely, Remote.co, and FlexJobs specialize in verified remote positions. The signal-to-noise ratio is much better than filtering &quot;remote&quot; on LinkedIn.</li>
            <li><strong>Company career pages:</strong> If you have target companies, go directly to their careers page. Many remote roles are posted there before they hit aggregators.</li>
            <li><strong>Your network:</strong> This is where the <a href="/learn/networking-for-job-seekers">Listening Tour</a> pays off. People in your network know which companies are genuinely remote-friendly vs. which say &quot;remote&quot; but really mean &quot;we&apos;ll tolerate it grudgingly.&quot;</li>
            <li><strong>Distributed-first company lists:</strong> Some organizations maintain curated lists of companies that are built to be remote. These are gold mines because remote is embedded in the culture, not bolted on.</li>
          </ul>

          <h2 id="stand-out">How to Stand Out as a Remote Candidate</h2>
          <p>
            Remote hiring managers screen for different signals than in-office ones. They want evidence that you can thrive without in-person oversight:
          </p>
          <ul>
            <li><strong>Async communication:</strong> Can you write clear, concise updates? Do you document decisions? Can you move projects forward without waiting for meetings?</li>
            <li><strong>Self-management:</strong> Can you prioritize your own work, manage your time, and deliver consistently without someone checking in daily?</li>
            <li><strong>Proactive communication:</strong> Do you over-communicate status, blockers, and decisions? In remote work, no one can see you working — your communication <em>is</em> your visibility.</li>
            <li><strong>Remote tools fluency:</strong> Are you comfortable with the async toolstack — Slack, Notion, Loom, GitHub, project management tools?</li>
          </ul>
          <p>
            In your resume and <a href="/learn/interview-preparation-guide">interviews</a>, highlight specific examples of each. &quot;Managed a 6-person distributed team across 3 time zones&quot; is much stronger than &quot;experience working remotely.&quot;
          </p>

          <h2 id="interview">The Remote Interview Process</h2>
          <p>Remote interviews have their own dynamics:</p>
          <ul>
            <li><strong>Your setup matters.</strong> Good lighting, clean background, reliable audio. These aren&apos;t superficial — they signal that you take remote communication seriously.</li>
            <li><strong>Expect async components.</strong> Many remote companies include written exercises, async video responses, or take-home projects. These test your async communication skills directly.</li>
            <li><strong>Ask remote-specific questions:</strong> &quot;How does the team handle time zone differences?&quot; &quot;What does a typical day look like for someone in this role?&quot; &quot;How do you maintain team culture remotely?&quot;</li>
          </ul>

          <h2 id="negotiating">Negotiating Remote Work</h2>
          <p>
            If a role is listed as hybrid but you want fully remote, or if the <a href="/learn/job-offer-negotiation">compensation</a> includes a location adjustment:
          </p>
          <ul>
            <li><strong>Know your leverage.</strong> If you&apos;re a strong candidate, many companies will flex on location. Bring it up after they&apos;re invested in you, not in the first screen.</li>
            <li><strong>Frame it as mutual benefit.</strong> &quot;I do my best work in focused, async environments&quot; is better than &quot;I don&apos;t want to commute.&quot;</li>
            <li><strong>Negotiate location-based pay carefully.</strong> Understand the company&apos;s philosophy before accepting a discount. Some companies pay the same regardless; others tier by region.</li>
            <li><strong>Get it in writing.</strong> &quot;Remote for now&quot; is not the same as &quot;remote&quot; in your offer letter.</li>
          </ul>

          <h2 id="red-flags">Red Flags and Scams</h2>
          <p>The remote job market attracts scams. Watch for:</p>
          <ul>
            <li>Requests for payment for &quot;equipment&quot; or &quot;training&quot; before starting</li>
            <li>Job descriptions that are vague about the company name or responsibilities</li>
            <li>Interviews that skip directly to &quot;you&apos;re hired&quot; without assessing your skills</li>
            <li>Communication only through messaging apps, never video calls</li>
            <li>Salary significantly above market rate for entry-level work</li>
          </ul>
          <p>
            A legitimate remote company will have a real website, verifiable employees on LinkedIn, a structured interview process, and will never ask you to pay anything upfront.
          </p>

          <FaqSection faqs={faqs} />

          <RelatedGuides guides={related} />

          <div className={styles.cta}>
            <h2>Strategize your remote search</h2>
            <p>Get advice from AI advisors on positioning yourself for remote roles.</p>
            <a href="/app" className={styles.btnCta}>Start Free Session</a>
          </div>
        </div>
      </article>
    </>
  );
}
