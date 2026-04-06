'use client';

import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence } from 'remotion';

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const LINES = [
  "I've been at my job for 6 years and I can't tell if I'm stuck.",
  "I got fired three days ago. I still can't believe it.",
  "Does 15 years of government experience even translate?",
  "I have the offer. But I don't know how to negotiate.",
  "I keep applying to jobs I don't even want.",
  "My council helped me see what I couldn't see alone.",
];

function RotatingLine({ text, index }: { text: string; index: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each line gets ~3 seconds: 0.5s enter, 2s hold, 0.5s exit
  const duration = 3 * fps;
  const enterEnd = 0.4 * fps;
  const exitStart = duration - 0.4 * fps;

  const enterProgress = interpolate(frame, [0, enterEnd], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE,
  });

  const exitProgress = interpolate(frame, [exitStart, duration], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE,
  });

  const progress = Math.min(enterProgress, exitProgress);
  const isLast = index === LINES.length - 1;

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        opacity: isLast ? enterProgress : progress,
        transform: `translateY(${interpolate(isLast ? enterProgress : progress, [0, 1], [8, 0])}px)`,
        textAlign: 'center',
        padding: '0 20px',
        maxWidth: 500,
      }}>
        <div style={{
          fontSize: 18,
          fontWeight: 300,
          color: isLast ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1.5,
          fontStyle: isLast ? 'normal' : 'italic',
          letterSpacing: isLast ? '0.01em' : 0,
        }}>
          {isLast ? text : `"${text}"`}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function HeroComposition() {
  const { fps } = useVideoConfig();
  const perLine = 3 * fps; // 3 seconds per line

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {LINES.map((line, i) => (
        <Sequence key={i} from={i * perLine} durationInFrames={perLine} layout="none">
          <RotatingLine text={line} index={i} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

export default function HeroAnimation() {
  const fps = 30;
  const totalFrames = LINES.length * 3 * fps;

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '16px auto 8px', height: 60 }}>
      <Player
        component={HeroComposition}
        durationInFrames={totalFrames}
        fps={fps}
        compositionWidth={520}
        compositionHeight={60}
        style={{ width: '100%', height: '100%' }}
        autoPlay
        loop
        controls={false}
      />
    </div>
  );
}
