import { Metadata } from 'next';
import Image from 'next/image';
import styles from './landing.module.css';
import FaqItem from '@/components/ui/FaqItem';
import { getPlans, type PlanData } from '@/lib/plans';
import PricingButton from '@/components/ui/PricingButton';
import HeroAnimation from '@/components/landing/HeroAnimation';
import HowItWorksAnimation from '@/components/landing/HowItWorksAnimation';
import MobileNav from '@/components/landing/MobileNav';
import SessionPreview from '@/components/landing/SessionPreview';
import ComparisonSection from '@/components/landing/ComparisonSection';
import { HERO_DEMO, RAY_DEMO, DEREK_DEMO, SOFIA_DEMO } from '@/components/landing/demo-data';

export const metadata: Metadata = {
  title: 'jobsearch.quest — The Job Search Council You\'ll Actually Use',
  description: 'The job search council you\'ll actually use. The proven Never Search Alone methodology, guided by AI, on your schedule. Start your first session free.',
  alternates: { canonical: 'https://jobsearch.quest' },
  openGraph: {
    title: 'jobsearch.quest — The Job Search Council You\'ll Actually Use',
    description: 'The proven Never Search Alone methodology. No recruiting, no scheduling. Start your first session free.',
    type: 'website',
    url: 'https://jobsearch.quest',
    images: [{ url: 'https://jobsearch.quest/img/hero.jpg', width: 1200, height: 630 }],
  },
};

// Rebuild every 5 minutes to pick up plan changes from admin
export const revalidate = 300;

export default async function LandingPage() {
  const plans = await getPlans();
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'jobsearch.quest',
    applicationCategory: 'BusinessApplication',
    description: 'The job search council you\'ll actually use. The proven Never Search Alone methodology, guided by AI, on your schedule. Start your first session free.',
    url: 'https://jobsearch.quest',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'First session free',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a Job Search Council?',
        acceptedAnswer: { '@type': 'Answer', text: 'A Job Search Council (JSC) is a small accountability group of 4-6 people who meet weekly to support each other\'s job search. Developed by Phyl Terry and documented in Never Search Alone, over 5,000 real JSCs have been launched. jobsearch.quest is the council you can start tonight — the proven methodology with zero activation energy.' },
      },
      {
        '@type': 'Question',
        name: 'Is an AI Job Search Council a replacement for a real one?',
        acceptedAnswer: { '@type': 'Answer', text: 'It\'s a complement, not a replacement. A real JSC with humans is powerful in ways AI can\'t replicate — real empathy, serendipitous connections, genuine social accountability. But jobsearch.quest is available right now, any time, with no scheduling friction. Many people use it between real council meetings or while looking for peers to form a real council.' },
      },
      {
        '@type': 'Question',
        name: 'How does an AI Job Search Council work?',
        acceptedAnswer: { '@type': 'Answer', text: 'jobsearch.quest follows the Never Search Alone 10-session curriculum. Each session has structured phases: check-in, exercise, hot seat (where AI council members challenge your thinking from multiple perspectives), commitments, and check-out. The AI remembers your context across sessions, tracks your commitments, and guides you from defining what you want through evaluating offers.' },
      },
      {
        '@type': 'Question',
        name: 'How much does jobsearch.quest cost?',
        acceptedAnswer: { '@type': 'Answer', text: 'Your first session is free, no credit card required. Paid plans start with monthly access and go up to unlimited sessions. If you land a job before your plan expires, unused time is refunded.' },
      },
      {
        '@type': 'Question',
        name: 'What is the Never Search Alone methodology?',
        acceptedAnswer: { '@type': 'Answer', text: 'Never Search Alone is a book and methodology by Phyl Terry that provides a structured 10-session curriculum for job seekers. It includes exercises like the Mnookin Two-Pager (defining must-haves and dealbreakers), the Listening Tour (strategic networking), and Candidate-Market Fit (matching your strengths to roles). Over 5,000 Job Search Councils have been launched using this approach.' },
      },
      {
        '@type': 'Question',
        name: 'Can I use jobsearch.quest if I\'m not actively searching?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. The app supports "Slow Seeker" and "Exploring Quietly" modes. The council adapts with less urgency and more strategic framing. Many users run monthly sessions to stay intentional about their career, especially for career pivots or finding Candidate-Market Fit.' },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {/* ═══════ NAV ═══════ */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <a href="#" className={styles['nav-mark']}>jobsearch.quest</a>
          <div className={styles['nav-links']}>
            <a href="#compare">Compare</a>
            <a href="#how">How it works</a>
            <a href="#council">Council</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="/learn">Guides</a>
            <a href="/app" className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-sm']}`}>Launch App</a>
          </div>
          <MobileNav styles={styles} />
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero}>
        <Image
          src="/img/hero.jpg"
          alt="jobsearch.quest — AI-powered Job Search Council based on the Never Search Alone methodology"
          width={1920}
          height={520}
          priority
          className={styles['hero-img']}
        />
        <div className={styles['hero-overlay']}>
          <div className={styles['hero-content']}>
            <div className={styles['section-label']}>Based on the Never Search Alone methodology</div>
            <h1 className={styles.display}>The job search council you&apos;ll actually use.</h1>
            <p className={styles.subtitle}>
              The proven Never Search Alone methodology. No recruiting. No scheduling. No 10-week commitment. Just structured support, on your schedule.
            </p>
            <HeroAnimation />
            <div className={styles['hero-ctas']}>
              <a href="/app" className={`${styles.btn} ${styles['btn-lg']} ${styles['btn-hero-primary']}`}>Start Your First Session Free</a>
              <a href="#how" className={`${styles.btn} ${styles['btn-lg']} ${styles['btn-hero-ghost']}`}>See How It Works</a>
            </div>
            <p className={styles.note}>Based on the Never Search Alone methodology by Phyl Terry. 5,000+ real Job Search Councils launched. This is the version you can start tonight.</p>
          </div>
        </div>
      </section>

      {/* ═══════ PROBLEM ═══════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles['section-label']}>The problem</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Searching alone is a losing strategy</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Solo seekers are slower, less selective, and more likely to take the wrong offer. That&apos;s why the Never Search Alone methodology exists &mdash; and why <a href="/learn/job-search-accountability" style={{ color: 'inherit', textDecoration: 'underline' }}>job search accountability</a> changes everything.</p>
          <div className={styles['problem-grid']}>
            <div className={styles['problem-card']}>
              <div className={styles.stat}>73%</div>
              <h3>Apply to the wrong roles</h3>
              <p>Without outside perspective, seekers chase titles instead of fit. They optimize for what sounds impressive, not <a href="/learn/candidate-market-fit" style={{ color: 'inherit', textDecoration: 'underline' }}>what matches</a>.</p>
            </div>
            <div className={styles['problem-card']}>
              <div className={styles.stat}>5&times;</div>
              <h3>Longer without accountability</h3>
              <p>Solo seekers spend weeks &ldquo;researching&rdquo; instead of acting. A council forces <a href="/learn/job-search-accountability" style={{ color: 'inherit', textDecoration: 'underline' }}>specific commitments</a> every week.</p>
            </div>
            <div className={styles['problem-card']}>
              <div className={styles.stat}>1 in 3</div>
              <h3>Quit within 6 months</h3>
              <p>Taking the first offer from <a href="/learn/job-search-burnout" style={{ color: 'inherit', textDecoration: 'underline' }}>exhaustion</a> leads to regret. A council keeps you honest about what you actually want.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WHY NOT CHATGPT ═══════ */}
      <section className={styles.section} id="compare">
        <div className={styles.container}>
          <div className={styles['section-label']}>Why not just use ChatGPT?</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>One voice vs. a whole council</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>ChatGPT gives you tips. A Job Search Council gives you perspectives, structure, and accountability.</p>
          <ComparisonSection />
        </div>
      </section>

      {/* ═══════ WHAT IS IT ═══════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles['section-label']}>What is jobsearch.quest?</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px' }}>You read the book. You know JSCs work. Now you need one.</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.75, color: 'var(--text)', marginBottom: '16px' }}>
            <strong>jobsearch.quest</strong> is an AI-powered <a href="/learn/what-is-a-job-search-council" style={{ color: 'inherit', textDecoration: 'underline' }}>Job Search Council</a> that runs the full <a href="/learn/never-search-alone-methodology" style={{ color: 'inherit', textDecoration: 'underline' }}>Never Search Alone</a> 10-session curriculum &mdash; the Mnookin Two-Pager, Listening Tour, Candidate-Market Fit, all of it &mdash; with AI council members who challenge your thinking, hold you accountable, and push you toward the right role.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.75, color: 'var(--text)', marginBottom: '16px' }}>
            A real Job Search Council with real people is the gold standard. But finding 4&ndash;5 peers who are actively searching, aligning schedules, and getting everyone to show up every week &mdash; most people never get past that step. jobsearch.quest is the council you can <a href="/learn/ai-job-search-council-vs-solo-search" style={{ color: 'inherit', textDecoration: 'underline' }}>start tonight</a>.
          </p>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '24px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p className={styles.mono} style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>The curriculum</p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                10 sessions covering the <a href="/learn/how-to-write-a-two-pager" style={{ color: 'inherit', textDecoration: 'underline' }}>Mnookin Two-Pager</a>, <a href="/learn/candidate-market-fit" style={{ color: 'inherit', textDecoration: 'underline' }}>Candidate-Market Fit</a>, <a href="/learn/networking-for-job-seekers" style={{ color: 'inherit', textDecoration: 'underline' }}>Listening Tour</a>, <a href="/learn/interview-preparation-guide" style={{ color: 'inherit', textDecoration: 'underline' }}>interview prep</a>, and <a href="/learn/job-offer-negotiation" style={{ color: 'inherit', textDecoration: 'underline' }}>offer negotiation</a>.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p className={styles.mono} style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>The council</p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                10 AI council members with distinct perspectives &mdash; from strategic thinkers to devil&apos;s advocates. They don&apos;t agree with each other.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <p className={styles.mono} style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>The accountability</p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Weekly <a href="/learn/job-search-accountability" style={{ color: 'inherit', textDecoration: 'underline' }}>commitments</a> tracked across sessions. Your council remembers what you said you&apos;d do &mdash; and asks about it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ THE BOOK ═══════ */}
      <section className={`${styles.section} ${styles['book-section']}`}>
        <div className={styles.container}>
          <div className={styles['book-layout']}>
            <div className={styles['book-img']}>
              <img src="/img/nsa-book.png" alt="Never Search Alone book cover by Phyl Terry" width={900} height={938} loading="lazy" />
            </div>
            <div className={styles['book-text']}>
              <div className={styles['section-label']}>The methodology</div>
              <h2 className={styles.display}>Built on <em>Never Search Alone</em></h2>
              <p>
                Phyl Terry spent 25 years coaching leaders &mdash; from first-time PMs to Fortune 500 CEOs &mdash; through job transitions. The core insight: people who search with a structured accountability group find better roles, faster, and with less psychological damage.
              </p>
              <p>
                The book lays out the complete system: how to form a Job Search Council, the 10-session progressive curriculum, candidate-market fit, and the commitments framework that turns good intentions into actual progress. Over 5,000 councils have launched through the Never Search Alone community.
              </p>
              <p>
                <strong>jobsearch.quest brings this methodology to AI.</strong> Same structured curriculum. Same accountability loop. Same exercises &mdash; Mnookin Two-Pager, Gratitude House, Listening Tour, Candidate-Market Fit. But available right now, any time, with no scheduling friction &mdash; your council never cancels.
              </p>
              <div className={styles['book-links']}>
                <a href="https://www.neversearchalone.org" target="_blank" rel="noopener" className={`${styles.btn} ${styles['btn-outline']} ${styles['btn-sm']}`}>neversearchalone.org</a>
                <a href="https://www.amazon.com/Never-Search-Alone-Seekers-Playbook/dp/B0B9Q9YDQ5" target="_blank" rel="noopener" className={`${styles.btn} ${styles['btn-outline']} ${styles['btn-sm']}`}>Book on Amazon</a>
                <a href="https://www.neversearchalone.org/jsc" target="_blank" rel="noopener" className={`${styles.btn} ${styles['btn-outline']} ${styles['btn-sm']}`}>Join a Real JSC</a>
              </div>
              <p className={styles.disclaimer}>jobsearch.quest is an independent project inspired by the Never Search Alone methodology. Not affiliated with Phyl Terry or the Never Search Alone organization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CONVERSATIONS ═══════ */}
      <section className={`${styles.section} ${styles['convo-section']}`} id="conversations">
        <div className={styles.container}>
          <div className={styles['section-label']}>Real council conversations</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Hear what your council sounds like</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Real output from real sessions. Support, accountability, and honest challenge.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: 640, margin: '0 auto' }}>
            <SessionPreview {...RAY_DEMO} />
            <SessionPreview {...DEREK_DEMO} />
            <SessionPreview {...SOFIA_DEMO} />
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className={styles.section} id="how">
        <div className={styles.container}>
          <div className={styles['section-label']}>How it works</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Start a council session in minutes, not weeks</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>The same 10-session curriculum from <em>Never Search Alone</em>. Same exercises. Same accountability. Zero activation energy.</p>

          <div className={styles.phases}>
            <span className={styles['phase-tag']}>👋 Check-In</span>
            <span className={styles['phase-tag']}>📋 Exercise</span>
            <span className={styles['phase-tag']}>🎁 Hot Seat</span>
            <span className={styles['phase-tag']}>✍️ Commitments</span>
            <span className={styles['phase-tag']}>✌️ Check-Out</span>
          </div>

          <HowItWorksAnimation />

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles['step-num']}>01</div>
              <div className={styles['step-icon']}>&#x1F3D7;&#xFE0F;</div>
              <h3>Build your council</h3>
              <p>Pick your advisors &mdash; archetypes with distinct perspectives, fictional voices inspired by real thinkers, or create your own. Each sees your situation differently.</p>
            </div>
            <div className={styles.step}>
              <div className={styles['step-num']}>02</div>
              <div className={styles['step-icon']}>&#x1F4D6;</div>
              <h3>Follow the curriculum</h3>
              <p>10 sessions that build on each other: discover what you want (Mnookin Two-Pager), build your network (Listening Tour), define your strategy (Candidate-Market Fit), and prepare to land it.</p>
            </div>
            <div className={styles.step}>
              <div className={styles['step-num']}>03</div>
              <div className={styles['step-icon']}>&#x1F91D;</div>
              <h3>Get real perspective</h3>
              <p>Each session includes a Hot Seat where every council member weighs in on your specific situation. Multiple lenses, one conversation.</p>
            </div>
            <div className={styles.step}>
              <div className={styles['step-num']}>04</div>
              <div className={styles['step-icon']}>&#x1F4CB;</div>
              <h3>Stay accountable</h3>
              <p>End each session with specific commitments. Next session, the council checks in. The structure creates momentum &mdash; not pressure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ COUNCIL ═══════ */}
      <section className={styles.section} id="council" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className={styles.container}>
          <div className={styles['section-label']}>Your council</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>10 perspectives. Build the council you need.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Purpose-built archetypes plus fictional voices inspired by real thinkers. Each sees your situation from a different angle.</p>

          <p className={styles.mono} style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Archetypes</p>
          <div className={styles['roster-scroll']}>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F5FA;&#xFE0F;</div><div className={styles.name}>The Strategist</div><div className={styles.role}>Long-horizon career arc</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x2699;&#xFE0F;</div><div className={styles.name}>The Operator</div><div className={styles.role}>Action partner</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F608;</div><div className={styles.name}>Devil&apos;s Advocate</div><div className={styles.role}>Assumption checker</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F50D;</div><div className={styles.name}>Market Mirror</div><div className={styles.role}>Outside-in reality</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F680;</div><div className={styles.name}>The Founder</div><div className={styles.role}>Startup instinct</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1FA9E;</div><div className={styles.name}>The Witness</div><div className={styles.role}>Emotional compass</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F578;&#xFE0F;</div><div className={styles.name}>The Connector</div><div className={styles.role}>Network activator</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F4CB;</div><div className={styles.name}>Maude</div><div className={styles.role}>Moderator · every session</div></div>
          </div>

          <p className={styles.mono} style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '16px', marginBottom: '4px' }}>Fictional Voices Inspired by Real People</p>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>AI approximations based on published writings, talks, and interviews. Not endorsed by or affiliated with these individuals. Just for fun.</p>
          <div className={styles['roster-scroll']}>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F985;</div><div className={styles.name}>Paul Graham</div><div className={styles.role}>First principles</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F9D8;</div><div className={styles.name}>Naval Ravikant</div><div className={styles.role}>Leverage &amp; compounding</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F94A;</div><div className={styles.name}>Ben Horowitz</div><div className={styles.role}>Hard things</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1FA91;</div><div className={styles.name}>Sheryl Sandberg</div><div className={styles.role}>Career capital</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x265F;&#xFE0F;</div><div className={styles.name}>Peter Thiel</div><div className={styles.role}>Contrarian</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x26A1;</div><div className={styles.name}>Patrick Collison</div><div className={styles.role}>Speed &amp; standards</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x2696;&#xFE0F;</div><div className={styles.name}>Marcus Aurelius</div><div className={styles.role}>Stoic clarity</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F578;&#xFE0F;</div><div className={styles.name}>Reid Hoffman</div><div className={styles.role}>Network strategy</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F3ED;</div><div className={styles.name}>Andy Grove</div><div className={styles.role}>Inflection points</div></div>
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F916;</div><div className={styles.name}>Sam Altman</div><div className={styles.role}>Asymmetric upside</div></div>
          </div>
        </div>
      </section>

      {/* ═══════ QUOTE + VIDEO ═══════ */}
      <section className={styles.section} style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className={styles.container}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div className={styles['quote-block']} style={{ margin: 0, maxWidth: 'none' }}>
                <blockquote>&ldquo;The job search is not a solo activity. It is a team sport. The people who search alone are slower, more prone to bad decisions, and more likely to take the first offer out of exhaustion.&rdquo;</blockquote>
                <cite>Phyl Terry, <em>Never Search Alone</em></cite>
              </div>
            </div>
            <div style={{ flexShrink: 0, width: '320px' }}>
              <a href="https://www.youtube.com/watch?v=OH3nzRdwYPA" target="_blank" rel="noopener" style={{ display: 'block', position: 'relative', borderRadius: '6px', overflow: 'hidden', boxShadow: 'var(--paper-shadow-lg)' }}>
                <img src="https://img.youtube.com/vi/OH3nzRdwYPA/maxresdefault.jpg" alt="Never Search Alone — Phyl Terry talk" style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', transition: 'background 0.2s' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '10px 0 10px 18px', borderColor: 'transparent transparent transparent var(--primary)', marginLeft: '3px' }}></div>
                  </div>
                </div>
              </a>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'center' }}>Watch: The Never Search Alone method explained</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ORIGIN STORY ═══════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'start', flexWrap: 'wrap', maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div className={styles['section-label']}>Why I built this</div>
              <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px' }}>A friend handed me a book.</h2>
              <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                <p style={{ marginBottom: '12px' }}>My friend Junius told me to read <em>Never Search Alone</em>. I picked it up expecting another career advice book. Instead, I found a system &mdash; a structured, repeatable way to stop spinning in your own head and actually move forward.</p>
                <p style={{ marginBottom: '12px' }}>The problem was obvious: the methodology works because of the group. But forming a real council means finding 4-5 people, aligning schedules, and hoping everyone actually shows up every week. Most people never get past that step.</p>
                <p style={{ marginBottom: '12px' }}>I thought: what if the council was always there? What if you could run through the Mnookin exercises, get feedback on your Candidate-Market Fit, and prep for interviews &mdash; all with AI council members who each see your situation differently &mdash; at 11pm on a Tuesday when the anxiety hits?</p>
                <p>So I built it.</p>
                <p style={{ marginTop: '16px', fontFamily: 'var(--font-pt-mono), monospace', fontSize: '13px', color: 'var(--text-tertiary)' }}>&mdash; Charles</p>
              </div>
            </div>
            <div style={{ flexShrink: 0, width: '240px', marginTop: '48px' }}>
              <img src="/img/junius-charles.jpg" alt="Junius and Charles" style={{ width: '100%', borderRadius: '6px', boxShadow: 'var(--paper-shadow-lg)' }} loading="lazy" />
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px', lineHeight: 1.5, textAlign: 'center' }}>Junius and Charles. He recommended the book. Also helped me pick out new joggers. Everything you need to kick off a job search.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PRICING (from DB) ═══════ */}
      <section className={styles.section} id="pricing">
        <div className={styles.container}>
          <div className={styles['section-label']}>Pricing</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Pick the length of your search.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Start free. Upgrade when you&apos;re ready to go all-in.</p>

          <div className={styles['pricing-grid']}>
            {plans.filter(p => p.plan !== 'founders_circle').map((p) => (
              <div key={p.plan} className={`${styles['pricing-card']} ${p.featured ? styles.featured : ''}`}>
                {p.featured && <div className={styles['pricing-badge']}>Best Value</div>}
                <div className={styles['pricing-name']}>{p.display_name}</div>
                <div className={styles['pricing-desc']}>{p.description}</div>
                <div className={styles['pricing-price']}>
                  <span className={styles.amount}>{p.price_label}</span>
                  <span className={styles.period}>{p.price_sublabel}</span>
                </div>
                <ul className={styles['pricing-features']}>
                  <li>{p.sessions_per_month === null ? 'Unlimited sessions' : `${p.sessions_per_month} sessions per month`}</li>
                  <li>{p.max_council_members} council members</li>
                  {p.real_people_voices ? <li>All voices + custom members</li> : <li className={styles.disabled}>Real people voices</li>}
                  {p.premium_models ? <li>Premium models</li> : <li>Cloud model included</li>}
                </ul>
                <PricingButton
                  plan={p.plan}
                  className={`${styles.btn} ${p.featured ? styles['btn-primary'] : styles['btn-outline']}`}
                  style={{ width: '100%' }}
                >
                  {p.cta_text}
                </PricingButton>
              </div>
            ))}

            {/* Founder's Circle — special layout */}
            {plans.filter(p => p.plan === 'founders_circle').map((p) => (
              <div key={p.plan} className={`${styles['pricing-card']} ${styles['fc-card']}`}>
                <div className={styles['fc-inner']}>
                  <div className={styles['fc-desc']}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '28px' }}>🧊</span>
                      <div>
                        <div className={styles['pricing-name']} style={{ color: 'var(--accent-blue)' }}>{p.display_name}</div>
                        <div className={styles['pricing-desc']} style={{ marginBottom: 0 }}>{p.description}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '12px 0' }}>
                      The person who built this thing sits on your council. Charles has built companies, hired hundreds of people, and knows exactly what&apos;s on the other side of the hiring table.
                    </p>
                  </div>
                  <div className={styles['fc-cta']}>
                    <div className={styles['pricing-price']} style={{ marginBottom: '12px' }}>
                      <span className={styles.amount} style={{ color: 'var(--accent-blue)' }}>{p.price_label}</span>
                      <span className={styles.period}>{p.price_sublabel}</span>
                    </div>
                    <PricingButton
                      plan={p.plan}
                      className={styles.btn}
                      style={{ width: '100%', background: 'var(--accent-blue)', color: '#fff', borderColor: 'var(--accent-blue)' }}
                    >
                      {p.cta_text}
                    </PricingButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className={styles.section} id="faq">
        <div className={styles.container}>
          <div className={styles['section-label']}>FAQ</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>Common questions</h2>
          <div className={styles['faq-list']}>
            <FaqItem question="What is a Job Search Council?">
              A JSC is a small accountability group (4-6 people) who meet weekly to support each other&apos;s job search. Developed by Phyl Terry and documented in <em>Never Search Alone</em>. Over 5,000 real JSCs launched. jobsearch.quest brings this to AI so you can run a session anytime. <a href="/learn/what-is-a-job-search-council">Learn more about how JSCs work.</a>
            </FaqItem>
            <FaqItem question="Is this a replacement for a real JSC?">
              It&apos;s a complement. A real JSC with humans is powerful in ways AI can&apos;t replicate. But jobsearch.quest is available right now, any time, with no scheduling friction. Many people use it between real council meetings. We encourage joining a real one at <a href="https://neversearchalone.org/jsc">neversearchalone.org</a>. <a href="/learn/never-search-alone-methodology">Read about the methodology.</a>
            </FaqItem>
            <FaqItem question="Who are the council members?">
              Seven distinct advisors, each with a name and a specific lens: Eli (career strategy), June (action steps), Rina (challenging assumptions), Dex (market positioning), Sam (emotional awareness), Kai (interview prep), and Val (hiring insider perspective). Plus Maude, your moderator, who keeps the session moving. You pick 3&ndash;5 for your council.
            </FaqItem>
            <FaqItem question="Is my data private?">
              Session data is stored securely and tied to your Google account. We don&apos;t share your data. You can delete your data at any time from settings.
            </FaqItem>
            <FaqItem question="What if I land a job before my plan expires?">
              On the Legendary Quest and Founder&apos;s Circle plans, unused time is refunded &mdash; no questions asked. We want you to find the right role, not pay for months you don&apos;t need.
            </FaqItem>
            <FaqItem question="Can I use this if I'm not actively searching?">
              Yes. The app supports &ldquo;Slow Seeker&rdquo; and &ldquo;Exploring Quietly&rdquo; modes. The council adapts &mdash; less urgency, more strategic framing. Many users run monthly sessions to stay intentional about their career. Great for <a href="/learn/career-pivot-guide">career pivots</a> or <a href="/learn/candidate-market-fit">finding your Candidate-Market Fit</a>.
            </FaqItem>
            <FaqItem question="How do I start a Job Search Council?">
              The traditional way is to find 4&ndash;5 peers who are also searching and commit to meeting weekly. The <a href="https://neversearchalone.org/jsc">Never Search Alone community</a> helps match people. If you can&apos;t find a group right away, <a href="/learn/ai-job-search-council-vs-solo-search">start with an AI-powered council</a> on jobsearch.quest and begin the curriculum immediately while you look for real peers.
            </FaqItem>
            <FaqItem question="How is this different from ChatGPT or other AI career tools?">
              ChatGPT doesn&apos;t remember your last conversation. It doesn&apos;t check whether you followed through on what you said you&apos;d do. It doesn&apos;t have seven people who each see your situation differently and build on each other&apos;s advice over weeks. jobsearch.quest follows a <a href="/learn/never-search-alone-methodology">structured 10-session curriculum</a>, tracks your commitments across sessions, and keeps a running understanding of your story &mdash; your must-haves, your fears, your progress, and what the council has already told you. <a href="/learn/ai-career-coach-vs-job-search-council">See the full comparison.</a>
            </FaqItem>
            <FaqItem question="What is the Never Search Alone methodology?">
              It&apos;s a system developed by Phyl Terry, documented in the book <em>Never Search Alone</em>. The methodology provides a 10-session progressive curriculum including the Mnookin Two-Pager (defining your <a href="/learn/how-to-write-a-two-pager">must-haves and dealbreakers</a>), the Listening Tour (<a href="/learn/networking-for-job-seekers">strategic networking</a>), and <a href="/learn/candidate-market-fit">Candidate-Market Fit</a>. Over 5,000 Job Search Councils have launched using this approach.
            </FaqItem>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className={`${styles.section} ${styles['cta-banner']}`}>
        <div className={styles.container}>
          <h2 className={styles.display}>Your Job Search Council is ready.</h2>
          <p>You don&apos;t need to find members. You don&apos;t need to align schedules. First session is free.</p>
          <a href="/app" className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-lg']}`}>Start Your First Session</a>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles['footer-grid']}>
            <div>
              <span className={styles.mono} style={{ fontSize: '13px', fontWeight: 700 }}>jobsearch.quest</span>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '8px', lineHeight: 1.6 }}>
                AI-powered Job Search Council based on the Never Search Alone methodology.
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <a href="https://neversearchalone.org">Never Search Alone</a>
                <a href="https://phyl.org">Phyl Terry</a>
                <a href="https://www.amazon.com/Never-Search-Alone-Seekers-Playbook/dp/B0B9Q9YDQ5">The Book</a>
              </div>
            </div>
            <div>
              <p className={styles['footer-heading']}>Guides</p>
              <a href="/learn/what-is-a-job-search-council">What Is a Job Search Council?</a>
              <a href="/learn/never-search-alone-methodology">The Never Search Alone Methodology</a>
              <a href="/learn/job-search-accountability">Why Accountability Matters</a>
              <a href="/learn/ai-job-search-tools">AI Tools for Job Searching</a>
              <a href="/learn/candidate-market-fit">Candidate-Market Fit</a>
              <a href="/learn/how-to-write-a-two-pager">How to Write a Two-Pager</a>
            </div>
            <div>
              <p className={styles['footer-heading']}>Job Search Help</p>
              <a href="/learn/job-search-burnout">Overcoming Burnout</a>
              <a href="/learn/career-pivot-guide">Career Pivot Guide</a>
              <a href="/learn/interview-preparation-guide">Interview Preparation</a>
              <a href="/learn/networking-for-job-seekers">Networking Strategies</a>
              <a href="/learn/job-offer-negotiation">Offer Negotiation</a>
              <a href="/learn/job-search-after-layoff">Searching After a Layoff</a>
            </div>
            <div>
              <p className={styles['footer-heading']}>Compare</p>
              <a href="/learn/job-search-council-vs-career-coach">JSC vs Career Coach</a>
              <a href="/learn/ai-job-search-council-vs-solo-search">AI Council vs Solo Search</a>
              <a href="/learn/ai-career-coach-vs-job-search-council">AI Coach vs JSC</a>
              <a href="/learn/job-search-accountability-tools-compared">Accountability Tools Compared</a>
              <a href="/learn/remote-job-search">Remote Job Search</a>
              <a href="/learn/job-search-for-senior-professionals">Senior Professionals</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
