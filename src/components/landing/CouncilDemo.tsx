'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence } from 'remotion';

/* ─── DATA ─────────────────────────────────────────────────────────────────── */

const MEMBERS = [
  { name: 'Eli', emoji: '🗺️', color: '#818cf8', role: 'Career Arc' },
  { name: 'Rina', emoji: '😈', color: '#ef4444', role: 'Challenger' },
  { name: 'Sam', emoji: '🪞', color: '#e879f9', role: 'Emotional' },
  { name: 'June', emoji: '⚙️', color: '#f59e0b', role: 'Action' },
  { name: 'Maude', emoji: '📋', color: '#4ade80', role: 'Moderator' },
];

const MESSAGES = [
  { speaker: 'user', name: 'You', text: "I've been at my job for 6 years and I can't tell if I'm stuck or just comfortable." },
  { speaker: 'Maude', text: "That's a useful distinction. Council — what do you hear?" },
  { speaker: 'Eli', text: "The difference is whether the comfort is building something or just protecting you from the uncertainty of change." },
  { speaker: 'Rina', text: "What if 'comfortable' is just a nicer word for 'afraid to test whether you're still growing'?" },
  { speaker: 'Sam', text: "You said 'can't tell' — not 'I'm happy' or 'I want to leave.' That in-between is where most people get stuck." },
  { speaker: 'June', text: "Have 3 conversations with people in roles you'd want. If none excite you, you have your answer." },
];

const PHASES = ['Check-In', 'Exercise', 'Hot Seat', 'Commitments', 'Check-Out'];

const EASE_IN_OUT = Easing.bezier(0.45, 0, 0.55, 1);
const EASE_DECEL = Easing.bezier(0.16, 1, 0.3, 1);

/* ─── COMPONENTS ───────────────────────────────────────────────────────────── */

function PhaseIndicator() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase moves from Hot Seat (2) to Commitments (3) at ~6s
  const phaseProgress = interpolate(frame, [0, 6 * fps], [2, 3], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_IN_OUT,
  });
  const activeIndex = Math.round(phaseProgress);

  return (
    <div style={{ display: 'flex', gap: 3, padding: '10px 16px', background: '#fff', borderBottom: '1px solid #e5e5e5' }}>
      {PHASES.map((phase, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;

        return (
          <div
            key={phase}
            style={{
              flex: 1,
              padding: '5px 0',
              borderRadius: 4,
              textAlign: 'center',
              fontSize: 9,
              fontWeight: isActive ? 700 : 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              background: isActive ? '#3B82F6' : isPast ? '#3B82F611' : 'transparent',
              color: isActive ? '#fff' : isPast ? '#3B82F6' : '#9CA3AF',
            }}
          >
            {isPast ? '✓ ' : ''}{phase}
          </div>
        );
      })}
    </div>
  );
}

function MemberOrb({ member, index }: { member: typeof MEMBERS[0]; index: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 4;

  const progress = interpolate(frame - delay, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_DECEL,
  });

  // Gentle float
  const float = Math.sin((frame + index * 15) / 25) * 2;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [16, 0]) + float}px) scale(${interpolate(progress, [0, 1], [0.7, 1])})`,
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: `${member.color}18`,
        border: `2px solid ${member.color}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
      }}>
        {member.emoji}
      </div>
      <span style={{ fontSize: 9, fontWeight: 600, color: member.color, fontFamily: 'system-ui, sans-serif' }}>
        {member.name}
      </span>
    </div>
  );
}

function ChatMessage({ msg, index }: { msg: typeof MESSAGES[0]; index: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_DECEL,
  });

  const member = MEMBERS.find(m => m.name === msg.speaker);
  const isUser = msg.speaker === 'user';

  return (
    <div style={{
      display: 'flex',
      gap: 7,
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
      padding: '0 16px',
    }}>
      {!isUser && (
        <div style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: `${member?.color || '#666'}18`,
          border: `1px solid ${member?.color || '#666'}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          flexShrink: 0,
          marginTop: 2,
        }}>
          {member?.emoji || '💬'}
        </div>
      )}
      <div style={{
        maxWidth: '82%',
        background: isUser ? '#3B82F60A' : '#fff',
        border: `1px solid ${isUser ? '#3B82F622' : '#e5e5e5'}`,
        borderRadius: 10,
        padding: '7px 11px',
        borderLeft: !isUser ? `3px solid ${member?.color || '#666'}` : undefined,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        {!isUser && (
          <div style={{ fontSize: 9, fontWeight: 700, color: member?.color || '#666', marginBottom: 1, fontFamily: 'system-ui, sans-serif' }}>
            {msg.speaker}
          </div>
        )}
        <div style={{ fontSize: 11, lineHeight: 1.5, color: '#1f2937', fontFamily: 'system-ui, sans-serif' }}>
          {msg.text}
        </div>
      </div>
      {isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: '#f0f0ee', border: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, color: '#999', fontFamily: 'system-ui, sans-serif',
          flexShrink: 0, marginTop: 2,
        }}>
          Y
        </div>
      )}
    </div>
  );
}

/* ─── MAIN COMPOSITION ─────────────────────────────────────────────────────── */

function CouncilSession() {
  return (
    <AbsoluteFill style={{ background: '#FAFAF8', overflow: 'hidden' }}>
      {/* Phase bar */}
      <Sequence from={0} >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <PhaseIndicator />
        </div>
      </Sequence>

      {/* Member orbs */}
      <Sequence from={8} >
        <div style={{
          position: 'absolute',
          top: 46,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          padding: '8px 16px',
        }}>
          {MEMBERS.map((m, i) => (
            <MemberOrb key={m.name} member={m} index={i} />
          ))}
        </div>
      </Sequence>

      {/* Chat messages — staggered appearance */}
      <div style={{
        position: 'absolute',
        top: 126,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        overflow: 'hidden',
      }}>
        {MESSAGES.map((msg, i) => (
          <Sequence key={i} from={35 + i * 30}  layout="none">
            <ChatMessage msg={msg} index={i} />
          </Sequence>
        ))}
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        background: 'linear-gradient(transparent, #FAFAF8)',
        pointerEvents: 'none',
        zIndex: 5,
      }} />
    </AbsoluteFill>
  );
}

/* ─── PLAYER WRAPPER ───────────────────────────────────────────────────────── */

export default function CouncilDemo() {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry.isIntersecting && !hasPlayed) {
      playerRef.current?.play();
      setHasPlayed(true);
    }
  }, [hasPlayed]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid #e5e5e5',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <Player
        ref={playerRef}
        component={CouncilSession}
        durationInFrames={280}
        fps={30}
        compositionWidth={480}
        compositionHeight={400}
        style={{ width: '100%', height: 'auto', aspectRatio: '480/400' }}
        loop
        controls={false}
      />
    </div>
  );
}
