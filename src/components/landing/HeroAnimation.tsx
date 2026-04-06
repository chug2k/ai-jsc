'use client';

import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence } from 'remotion';

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);

const COUNCIL = [
  { emoji: '🗺️', name: 'Eli', color: '#818cf8' },
  { emoji: '😈', name: 'Rina', color: '#ef4444' },
  { emoji: '🪞', name: 'Sam', color: '#e879f9' },
  { emoji: '⚙️', name: 'June', color: '#f59e0b' },
  { emoji: '🎯', name: 'Kai', color: '#f97316' },
  { emoji: '🏢', name: 'Val', color: '#a3e635' },
  { emoji: '🔍', name: 'Dex', color: '#22d3ee' },
];

function CouncilOrb({ member, index, total }: { member: typeof COUNCIL[0]; index: number; total: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered entrance
  const delay = 15 + index * 6;
  const progress = interpolate(frame - delay, [0, 0.6 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_OVERSHOOT,
  });

  // Orbit position
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 90;
  const orbitSpeed = 0.003;
  const currentAngle = angle + frame * orbitSpeed;
  const x = Math.cos(currentAngle) * radius;
  const y = Math.sin(currentAngle) * radius * 0.55; // Slight ellipse for perspective

  // Pulse glow when "speaking"
  const speakFrame = 60 + index * 30;
  const glowIntensity = interpolate(
    frame,
    [speakFrame, speakFrame + 10, speakFrame + 30],
    [0, 1, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
  );

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(${x - 22}px, ${y - 22}px) scale(${interpolate(progress, [0, 1], [0, 1])})`,
      opacity: progress,
      zIndex: y > 0 ? 2 : 1,
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: `${member.color}22`,
        border: `2px solid ${member.color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        boxShadow: glowIntensity > 0.1 ? `0 0 ${16 * glowIntensity}px ${member.color}66` : 'none',
      }}>
        {member.emoji}
      </div>
      <div style={{
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 3,
        fontFamily: 'system-ui, sans-serif',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
      }}>
        {member.name}
      </div>
    </div>
  );
}

function ConnectionLine({ fromAngle, toAngle, frame, delay }: { fromAngle: number; toAngle: number; frame: number; delay: number }) {
  const { fps } = useVideoConfig();
  const progress = interpolate(frame - delay, [0, 0.3 * fps], [0, 0.6], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE,
  });

  if (progress <= 0) return null;

  const r = 90;
  const x1 = 50 + Math.cos(fromAngle) * r * 0.45;
  const y1 = 50 + Math.sin(fromAngle) * r * 0.25;
  const x2 = 50 + Math.cos(toAngle) * r * 0.45;
  const y2 = 50 + Math.sin(toAngle) * r * 0.25;

  return (
    <line
      x1={`${x1}%`} y1={`${y1}%`}
      x2={`${x2}%`} y2={`${y2}%`}
      stroke="rgba(255,255,255,0.08)"
      strokeWidth={1}
      opacity={progress}
    />
  );
}

function HeroComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Center "You" pulse
  const youScale = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_OVERSHOOT,
  });
  const youPulse = 1 + Math.sin(frame / 20) * 0.03;

  return (
    <AbsoluteFill style={{ background: 'transparent', overflow: 'hidden' }}>
      {/* Subtle connection lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {COUNCIL.map((_, i) => {
          const angle1 = (i / COUNCIL.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.003;
          const angle2 = ((i + 1) / COUNCIL.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.003;
          return <ConnectionLine key={i} fromAngle={angle1} toAngle={angle2} frame={frame} delay={40 + i * 5} />;
        })}
      </svg>

      {/* Center "You" node */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-24px, -24px) scale(${youScale * youPulse})`,
        zIndex: 3,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '2px solid rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          backdropFilter: 'blur(4px)',
        }}>
          You
        </div>
      </div>

      {/* Council orbs */}
      {COUNCIL.map((m, i) => (
        <Sequence key={m.name} from={0} layout="none">
          <CouncilOrb member={m} index={i} total={COUNCIL.length} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

export default function HeroAnimation() {
  return (
    <div style={{
      width: 320,
      height: 260,
      margin: '0 auto',
      position: 'relative',
    }}>
      <Player
        component={HeroComposition}
        durationInFrames={300}
        fps={30}
        compositionWidth={320}
        compositionHeight={260}
        style={{ width: '100%', height: '100%' }}
        autoPlay
        loop
        controls={false}
      />
    </div>
  );
}
