'use client';

import { useSessionStore } from '@/stores/session-store';

const SESSIONS = [
  { num: 0, name: 'Trust-Building', desc: 'Get to know your council. Share your story, your emotional landscape, and what brought you here. No homework, no pressure.' },
  { num: 1, name: 'Your Story & Goals', desc: 'Extended introduction — your career so far, what you\'re looking for, your timeframe. Establish what you\'re working toward.' },
  { num: 2, name: 'Must-Nots & Must-Haves', desc: 'The Mnookin Two-Pager exercises. What do you hate doing? What don\'t you want? Then invert: what do you love, and what are your must-haves?' },
  { num: 3, name: 'Mnookin Two-Pager Review', desc: 'Present your Two-Pager to the council. What resonates? What\'s missing? What needs sharpening?' },
  { num: 4, name: 'Gratitude House', desc: 'Reflect on who has helped your career. Write thank-you notes. Build your contact list for the Listening Tour.' },
  { num: 5, name: 'Listening Tour', desc: 'Report back on conversations with your network. What surprised you? What challenging feedback did you get?' },
  { num: 6, name: 'Listening Tour (continued)', desc: 'More conversations, more insights. What patterns are emerging? How is the picture coming together?' },
  { num: 7, name: 'Candidate-Market Fit', desc: 'Draft your 1-sentence job search strategy. Where your aspirations meet market reality.' },
  { num: 8, name: 'LinkedIn/Resume Rehab', desc: 'Review your LinkedIn and resume against your Candidate-Market Fit. Are they sending the right signal?' },
  { num: 9, name: 'Networking', desc: 'Share networking plans, set up your Megibow Dashboard, create your target company list. The hardest part — but you have a council.' },
  { num: 10, name: 'Interview Prep', desc: 'Practice interviews, draft your Job Mission with OKRs. Walk in with confidence and a clear narrative.' },
];

const MEETING_STRUCTURE = [
  { emoji: '👋', name: 'Check-In', desc: 'Personal prompt, emotional pulse (1-10 scale), professional updates, and a check on prior commitments.' },
  { emoji: '📋', name: 'Exercise', desc: 'The main activity for this session — varies by where you are in the curriculum.' },
  { emoji: '🎁', name: 'Hot Seat / Requests for Help', desc: 'Bring a specific issue for the council to weigh in on. A decision, a dilemma, whatever you need.' },
  { emoji: '✍️', name: 'Commitments', desc: 'What will you do before the next session? Specific, with a deadline and a clear done-state.' },
  { emoji: '✌️', name: 'Check-Out', desc: 'One word that captures how you\'re leaving today.' },
];

export default function LearnView() {
  const { setView } = useSessionStore();

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col">
      <div className="max-w-3xl mx-auto w-full mt-2">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('council')} className="btn btn-ghost">← Back</button>
          <h2 className="text-xl font-semibold">How JSC Works</h2>
        </div>

        {/* What is JSC */}
        <div className="card mb-4">
          <div className="section-label-accent mb-3">WHAT IS A JOB SEARCH COUNCIL?</div>
          <p className="text-sm leading-relaxed mb-3">
            A <strong>Job Search Council (JSC)</strong> is a small accountability group that meets regularly, follows a structured agenda, and holds each other accountable. Developed by <strong>Phyl Terry</strong> over 25 years of coaching leaders.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            The core insight: job searching alone is miserable, slow, and biased. A council gives you outside perspective, accountability, and structural discipline. This AI version replaces the human peer group with AI council members — each with a distinct voice and perspective.
          </p>
        </div>

        {/* Meeting Structure */}
        <div className="card mb-4">
          <div className="section-label-accent mb-4">EVERY SESSION FOLLOWS THIS STRUCTURE</div>
          <div className="space-y-3">
            {MEETING_STRUCTURE.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-mid)' }}>
                  {s.emoji}
                </div>
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 10-Session Curriculum */}
        <div className="card mb-4">
          <div className="section-label-accent mb-4">THE 10-SESSION CURRICULUM</div>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
            Each session builds on the last. By session 10, you'll have a clear strategy, a polished profile, and the confidence to negotiate.
          </p>
          <div className="space-y-4">
            {SESSIONS.map(s => (
              <div key={s.num} className="flex gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mono text-xs font-bold"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-mid)' }}>
                  {s.num}
                </div>
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Book */}
        <div className="card mb-4">
          <div className="section-label-accent mb-3">THE SOURCE MATERIAL</div>
          <div className="flex gap-4 items-start">
            <div className="w-16 h-20 rounded flex items-center justify-center flex-shrink-0 text-3xl" style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>📘</div>
            <div>
              <div className="font-semibold text-sm mb-0.5">Never Search Alone: The Job Seeker&apos;s Playbook</div>
              <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Phyl Terry with Marty Cagan · 2022</div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
                The full methodology with exercises, tools, and templates. Covers candidate-market fit, the Listening Tour, interview prep, offer negotiation, and the psychological traps most job seekers fall into.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="https://www.neversearchalone.org" target="_blank" rel="noopener" className="btn btn-ghost text-xs">neversearchalone.org →</a>
                <a href="https://www.amazon.com/Never-Search-Alone-Seekers-Playbook/dp/B0B9Q9YDQ5" target="_blank" rel="noopener" className="btn btn-ghost text-xs">Book on Amazon →</a>
              </div>
            </div>
          </div>
        </div>

        {/* Core principle */}
        <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-mid)' }}>
          <div className="section-label-accent mb-2">THE CORE PRINCIPLE</div>
          <p className="text-sm leading-relaxed">
            &quot;The job search is not a solo activity. It is a team sport. The people who search alone are slower, more prone to bad decisions, and more likely to take the first offer out of exhaustion.&quot;
          </p>
          <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>— Phyl Terry, <em>Never Search Alone</em></div>
        </div>

        <button onClick={() => setView('council')} className="btn btn-primary btn-lg w-full mb-2">
          Build My Council →
        </button>
      </div>
    </div>
  );
}
