'use client';

import ScrollPlayer from './ScrollPlayer';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence } from 'remotion';

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const STEPS = [
  { num: '01', icon: '🏗️', title: 'Build your council', desc: 'Pick 3-5 advisors with distinct perspectives', color: '#818cf8' },
  { num: '02', icon: '📖', title: 'Follow the curriculum', desc: '10 sessions from Two-Pager to offer negotiation', color: '#f59e0b' },
  { num: '03', icon: '🤝', title: 'Get real perspective', desc: 'Multiple lenses on your specific situation', color: '#ef4444' },
  { num: '04', icon: '📋', title: 'Stay accountable', desc: 'Weekly commitments your council remembers', color: '#4ade80' },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE,
  });

  // Progress line growing
  const lineProgress = interpolate(frame, [0.2 * fps, 0.7 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE,
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      opacity: progress,
      transform: `translateX(${interpolate(progress, [0, 1], [-20, 0])}px)`,
    }}>
      {/* Number + line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: `${step.color}18`,
          border: `2px solid ${step.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: step.color,
          fontFamily: 'system-ui, sans-serif',
        }}>
          {step.num}
        </div>
        {index < STEPS.length - 1 && (
          <div style={{
            width: 2,
            height: 30,
            background: `${step.color}33`,
            marginTop: 4,
            transformOrigin: 'top',
            transform: `scaleY(${lineProgress})`,
          }} />
        )}
      </div>
      {/* Content */}
      <div style={{ paddingTop: 4 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginBottom: 2, fontFamily: 'system-ui, sans-serif' }}>
          {step.icon} {step.title}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, fontFamily: 'system-ui, sans-serif' }}>
          {step.desc}
        </div>
      </div>
    </div>
  );
}

function HowItWorksComposition() {
  return (
    <AbsoluteFill style={{ background: '#FAFAF8', padding: '24px 20px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STEPS.map((step, i) => (
          <Sequence key={i} from={i * 25} layout="none">
            <StepCard step={step} index={i} />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
}

export default function HowItWorksAnimation() {
  return (
    <ScrollPlayer
      component={HowItWorksComposition}
      durationInFrames={180}
      width={400}
      height={320}
      style={{
        width: '100%',
        maxWidth: 400,
        margin: '24px auto 0',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #e5e5e5',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      }}
    />
  );
}
