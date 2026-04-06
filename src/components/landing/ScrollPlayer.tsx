'use client';

import { useRef, useEffect, useState, useCallback, type ComponentType } from 'react';
import { Player, type PlayerRef } from '@remotion/player';

interface ScrollPlayerProps {
  component: ComponentType<Record<string, unknown>>;
  durationInFrames: number;
  fps?: number;
  width: number;
  height: number;
  style?: React.CSSProperties;
  threshold?: number;
  loop?: boolean;
}

export default function ScrollPlayer({
  component,
  durationInFrames,
  fps = 30,
  width,
  height,
  style,
  threshold = 0.3,
  loop = true,
}: ScrollPlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !hasPlayed) {
      playerRef.current?.play();
      setHasPlayed(true);
    }
  }, [hasPlayed]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  return (
    <div ref={containerRef} style={style}>
      <Player
        ref={playerRef}
        component={component}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        style={{ width: '100%', height: 'auto', aspectRatio: `${width}/${height}` }}
        loop={loop}
        controls={false}
      />
    </div>
  );
}
