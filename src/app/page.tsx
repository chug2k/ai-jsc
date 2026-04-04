import Image from 'next/image';
import styles from './landing.module.css';
import FaqItem from '@/components/ui/FaqItem';
import { getPlans, type PlanData } from '@/lib/plans';
import PricingButton from '@/components/ui/PricingButton';

// Rebuild every 5 minutes to pick up plan changes from admin
export const revalidate = 300;

export default async function LandingPage() {
  const plans = await getPlans();
  return (
    <>
      {/* ═══════ NAV ═══════ */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <a href="#" className={styles['nav-mark']}>jobsearch.quest</a>
          <div className={styles['nav-links']}>
            <a href="#how">How it works</a>
            <a href="#council">Council</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="/app" className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-sm']}`}>Launch App</a>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero}>
        <Image
          src="/img/hero.jpg"
          alt=""
          width={1920}
          height={520}
          priority
          className={styles['hero-img']}
        />
        <div className={styles['hero-overlay']}>
          <div className={styles['hero-content']}>
            <div className={styles['section-label']}>Based on the Never Search Alone methodology</div>
            <h1 className={styles.display}>Stop job searching alone.</h1>
            <p className={styles.subtitle}>
              The proven Job Search Council methodology &mdash; a structured 10-session curriculum with accountability, perspective, and support &mdash; available on your schedule, guided by AI.
            </p>
            <div className={styles['hero-ctas']}>
              <a href="/app" className={`${styles.btn} ${styles['btn-lg']} ${styles['btn-hero-primary']}`}>Start Your First Session Free</a>
              <a href="#how" className={`${styles.btn} ${styles['btn-lg']} ${styles['btn-hero-ghost']}`}>See How It Works</a>
            </div>
            <p className={styles.note}>5,000+ real JSCs launched through Never Search Alone. This is the AI-powered edition.</p>
          </div>
        </div>
      </section>

      {/* ═══════ PROBLEM ═══════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles['section-label']}>The problem</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Searching alone is a losing strategy</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Solo seekers are slower, less selective, and more likely to take the wrong offer.</p>
          <div className={styles['problem-grid']}>
            <div className={styles['problem-card']}>
              <div className={styles.stat}>73%</div>
              <h3>Apply to the wrong roles</h3>
              <p>Without outside perspective, seekers chase titles instead of fit. They optimize for what sounds impressive, not what matches.</p>
            </div>
            <div className={styles['problem-card']}>
              <div className={styles.stat}>5&times;</div>
              <h3>Longer without accountability</h3>
              <p>Solo seekers spend weeks &ldquo;researching&rdquo; instead of acting. A council forces specific commitments every week.</p>
            </div>
            <div className={styles['problem-card']}>
              <div className={styles.stat}>1 in 3</div>
              <h3>Quit within 6 months</h3>
              <p>Taking the first offer from exhaustion leads to regret. A council keeps you honest about what you actually want.</p>
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Each member has a distinct voice and challenge style. They don&apos;t agree with each other.</p>

          {/* Convo 1: Hot Seat */}
          <div style={{ marginBottom: '40px' }}>
            <div className={styles['convo-scenario']}>
              <div className={styles['convo-scenario-label']}>Hot Seat &middot; Startup vs. Big Tech</div>
              <h3>Sarah has a VP Eng offer but can&apos;t pull the trigger</h3>
            </div>
            <div className={styles['convo-thread']}>
              <div className={`${styles.msg} ${styles['msg-user']}`}>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--text-tertiary)', textAlign: 'right' }}>Sarah</div>
                  <div className={styles['msg-text']}>I have an offer from a Series A startup as VP Eng but the equity seems low &mdash; 0.5%. Salary is 40% less than Google. I love the team but I keep going back and forth.</div>
                </div>
                <div className={styles['msg-avatar']}>S</div>
              </div>
              <div className={styles.msg}>
                <div className={styles['msg-avatar']}>&#x1F985;</div>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--primary)' }}>Paul Graham</div>
                  <div className={styles['msg-text']}>Why are you valuing the safety of a salary over the chance to build something that might actually matter in five years? If this company succeeds, will 0.5% dwarf your current income? And if it fails, what is the real cost: losing money or wasting time on problems where you have no ownership?</div>
                </div>
              </div>
              <div className={styles.msg}>
                <div className={styles['msg-avatar']}>&#x1F94A;</div>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--primary)' }}>Ben Horowitz</div>
                  <div className={styles['msg-text']}>The &ldquo;going back and forth&rdquo; is the tell. In a wartime situation, hesitation is the enemy. You already know what you want &mdash; you&apos;re just looking for permission. 0.5% is negotiable. Team chemistry isn&apos;t. Which one is harder to find?</div>
                </div>
              </div>
              <div className={styles.msg}>
                <div className={styles['msg-avatar']}>&#x1FA91;</div>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--primary)' }}>Sheryl Sandberg</div>
                  <div className={styles['msg-text']}>Before you negotiate the number, negotiate the narrative. What does the equity conversation tell you about how this company values its leaders? If they won&apos;t move on comp for their VP Eng, what happens when you need resources for your team?</div>
                </div>
              </div>
            </div>
          </div>

          {/* Convo 2: Accountability */}
          <div style={{ marginBottom: '40px' }}>
            <div className={styles['convo-scenario']}>
              <div className={styles['convo-scenario-label']}>Check-In &middot; Commitments</div>
              <h3>Marcus promised 5 cold emails. He sent 1.</h3>
            </div>
            <div className={styles['convo-thread']}>
              <div className={`${styles.msg} ${styles['msg-user']}`}>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--text-tertiary)', textAlign: 'right' }}>Marcus</div>
                  <div className={styles['msg-text']}>I said I&apos;d send 5 cold outreach emails this week but I only sent 1. Work got really busy.</div>
                </div>
                <div className={styles['msg-avatar']}>M</div>
              </div>
              <div className={styles.msg}>
                <div className={styles['msg-avatar']}>&#x2699;&#xFE0F;</div>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--primary)' }}>The Operator</div>
                  <div className={styles['msg-text']}>One is better than zero &mdash; that&apos;s real. What got in the way of the other four? If we can figure out the blocker, we can make next week&apos;s commitment more realistic. Could you send two more by end of day Friday?</div>
                </div>
              </div>
              <div className={styles.msg}>
                <div className={styles['msg-avatar']}>&#x1FA9E;</div>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--primary)' }}>The Witness</div>
                  <div className={styles['msg-text']}>I notice you said &ldquo;ran out of time&rdquo; rather than &ldquo;chose not to.&rdquo; There&apos;s something underneath the busyness. What would it mean if you sent those emails and people didn&apos;t respond?</div>
                </div>
              </div>
            </div>
          </div>

          {/* Convo 3: Guilt */}
          <div>
            <div className={styles['convo-scenario']}>
              <div className={styles['convo-scenario-label']}>Hot Seat &middot; Loyalty trap</div>
              <h3>Priya feels guilty about leaving a struggling company</h3>
            </div>
            <div className={styles['convo-thread']}>
              <div className={`${styles.msg} ${styles['msg-user']}`}>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--text-tertiary)', textAlign: 'right' }}>Priya</div>
                  <div className={styles['msg-text']}>My company is struggling and I feel guilty leaving. The CEO hired me personally. I keep putting off applications.</div>
                </div>
                <div className={styles['msg-avatar']}>P</div>
              </div>
              <div className={styles.msg}>
                <div className={styles['msg-avatar']}>&#x1FA9E;</div>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--primary)' }}>The Witness</div>
                  <div className={styles['msg-text']}>I hear how much this relationship means to you &mdash; that says something good about who you are. But I notice you said &ldquo;putting off&rdquo; applications, not &ldquo;decided against.&rdquo; It sounds like part of you already knows what you need to do.</div>
                </div>
              </div>
              <div className={styles.msg}>
                <div className={styles['msg-avatar']}>&#x1F608;</div>
                <div className={styles['msg-body']}>
                  <div className={styles['msg-name']} style={{ color: 'var(--primary)' }}>Devil&apos;s Advocate</div>
                  <div className={styles['msg-text']}>Have you considered: if the company was thriving, would you still be staying? Sometimes what feels like loyalty is really just the comfort of not having to face the uncertainty of a search. What if exploring options doesn&apos;t mean you&apos;re betraying anyone?</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className={styles.section} id="how">
        <div className={styles.container}>
          <div className={styles['section-label']}>How it works</div>
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>A proven 10-session curriculum, guided by AI</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Based on the real moderator agendas and exercises from <em>Never Search Alone</em> by Phyl Terry.</p>

          <div className={styles.phases}>
            <span className={styles['phase-tag']}>👋 Check-In</span>
            <span className={styles['phase-tag']}>📋 Exercise</span>
            <span className={styles['phase-tag']}>🎁 Hot Seat</span>
            <span className={styles['phase-tag']}>✍️ Commitments</span>
            <span className={styles['phase-tag']}>✌️ Check-Out</span>
          </div>

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
          <h2 className={styles.display} style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>15+ perspectives. Build the council you need.</h2>
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
            <div className={styles['roster-card']}><div className={styles.emoji}>&#x1F4CB;</div><div className={styles.name}>Jordan</div><div className={styles.role}>Facilitator</div></div>
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
              A JSC is a small accountability group (4-6 people) who meet weekly to support each other&apos;s job search. Developed by Phyl Terry and documented in <em>Never Search Alone</em>. Over 5,000 real JSCs launched. jobsearch.quest brings this to AI so you can run a session anytime.
            </FaqItem>
            <FaqItem question="Is this a replacement for a real JSC?">
              It&apos;s a complement. A real JSC with humans is powerful in ways AI can&apos;t replicate. But jobsearch.quest is available right now, any time, with no scheduling friction. Many people use it between real council meetings. We encourage joining a real one at <a href="https://neversearchalone.org/jsc">neversearchalone.org</a>.
            </FaqItem>
            <FaqItem question="What AI models does it use?">
              Paid plans include premium cloud models (GPT-5.4, Claude). Free tier uses GPT-4.1 mini. Pro users can also bring their own API key or run a local model via LM Studio, Ollama, or any OpenAI-compatible endpoint.
            </FaqItem>
            <FaqItem question='Are the "real people" actually those people?'>
              No. They are AI approximations based on each person&apos;s documented communication style, published ideas, and known worldview. Think of it as &ldquo;what would Paul Graham likely say, based on everything he&apos;s written?&rdquo;
            </FaqItem>
            <FaqItem question="Is my data private?">
              Session data is stored securely and tied to your Google account. We don&apos;t share your data. You can delete your data at any time from settings.
            </FaqItem>
            <FaqItem question="What if I land a job before my plan expires?">
              On the Legendary Quest and Founder&apos;s Circle plans, unused time is refunded &mdash; no questions asked. We want you to find the right role, not pay for months you don&apos;t need.
            </FaqItem>
            <FaqItem question="Can I use this if I'm not actively searching?">
              Yes. The app supports &ldquo;Slow Seeker&rdquo; and &ldquo;Exploring Quietly&rdquo; modes. The council adapts &mdash; less urgency, more strategic framing. Many users run monthly sessions to stay intentional about their career.
            </FaqItem>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className={`${styles.section} ${styles['cta-banner']}`}>
        <div className={styles.container}>
          <h2 className={styles.display}>Your council is ready.</h2>
          <p>First session is free. Sign in with Google to get started.</p>
          <a href="/app" className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-lg']}`}>Start Your First Session</a>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div>
            <span className={styles.mono} style={{ fontSize: '13px', fontWeight: 700 }}>jobsearch.quest</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginLeft: '8px' }}>Built on the Never Search Alone methodology</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="https://neversearchalone.org">Never Search Alone</a>
            <a href="https://phyl.org">Phyl Terry</a>
            <a href="https://www.amazon.com/Never-Search-Alone-Seekers-Playbook/dp/B0B9Q9YDQ5">The Book</a>
          </div>
        </div>
      </footer>
    </>
  );
}
