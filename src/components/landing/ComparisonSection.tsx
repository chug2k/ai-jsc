'use client';

export default function ComparisonSection() {
  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {/* ChatGPT side */}
      <div style={{ flex: 1, minWidth: '280px' }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-tertiary)',
          marginBottom: '12px',
        }}>
          ChatGPT
        </div>
        <div style={{
          background: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: '1rem',
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#d1d5db', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '14px', flexShrink: 0,
            }}>
              🤖
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6 }}>
              Here are some tips for your job search: 1) Update your resume with keywords from job descriptions. 2) Optimize your LinkedIn profile. 3) Practice common interview questions. 4) Network with people in your target industry. 5) Apply to 5-10 jobs per day and track your applications.
            </div>
          </div>
        </div>
      </div>

      {/* jobsearch.quest side */}
      <div style={{ flex: 1, minWidth: '280px' }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-tertiary)',
          marginBottom: '12px',
        }}>
          jobsearch.quest
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="chat-bubble chat-bubble-ai" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#818cf822', border: '1px solid #818cf844',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0,
            }}>
              🗺️
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#818cf8', marginBottom: '2px' }}>Eli</div>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                Before you apply anywhere, what does your ideal role actually look like? Not the title. The day-to-day.
              </div>
            </div>
          </div>
          <div className="chat-bubble chat-bubble-ai" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#ef444422', border: '1px solid #ef444444',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0,
            }}>
              😈
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#ef4444', marginBottom: '2px' }}>Rina</div>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                You said &ldquo;I need help.&rdquo; But help with what? Are you stuck on strategy, or are you just applying to everything and hoping?
              </div>
            </div>
          </div>
          <div className="chat-bubble chat-bubble-ai" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#f59e0b22', border: '1px solid #f59e0b44',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0,
            }}>
              ⚙️
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#f59e0b', marginBottom: '2px' }}>June</div>
              <div style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                Here&apos;s what I&apos;d do this week: call two people who have the job you want. Ask what surprised them about the role. Report back next session.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
