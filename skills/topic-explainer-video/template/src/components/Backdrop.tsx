import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';

const PARTICLES = Array.from({length: 34}, (_, i) => ({
  x: (i * 277 + 91) % 1920,
  y: (i * 431 + 160) % 1080,
  r: 1 + ((i * 7) % 17) / 10,
  speed: 2 + ((i * 11) % 9),
  phase: (i * 1.7) % 6.28,
  alpha: 0.05 + ((i * 13) % 10) / 100,
}));

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 95% at 50% 112%, #182235 0%, #0B111C 46%, #070A10 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(55% 45% at 88% 8%, rgba(255,181,71,0.055), transparent 70%), radial-gradient(45% 40% at 4% 70%, rgba(66,232,195,0.035), transparent 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,241,231,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,231,0.035) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage:
            'radial-gradient(75% 70% at 50% 40%, rgba(0,0,0,0.7), transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(75% 70% at 50% 40%, rgba(0,0,0,0.7), transparent 100%)',
          opacity: 0.45,
        }}
      />
      {PARTICLES.map((p, i) => {
        const y = ((p.y - (frame / 30) * p.speed) % 1080 + 1080) % 1080;
        const twinkle = 0.55 + 0.45 * Math.sin(frame / 22 + p.phase);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: y,
              width: p.r,
              height: p.r,
              borderRadius: '50%',
              background: i % 7 === 0 ? C.amber : C.ink,
              opacity: p.alpha * twinkle,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(105% 85% at 50% 50%, transparent 42%, rgba(3,5,9,0.62) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
