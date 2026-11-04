import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {FPS, timing} from '../timing';

export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / FPS;
  const progress = Math.min(1, time / 30);

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 50}}>
      <div
        style={{
          position: 'absolute',
          top: 78,
          right: 120,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: '0.16em',
            color: 'rgba(245,241,231,0.38)',
            marginRight: 4,
          }}
        >
          30 SEC
        </div>
        {timing.scenes.map((s, i) => {
          const active = time >= s.start - 0.02 && (i === timing.scenes.length - 1 || time < timing.scenes[i + 1].start - 0.02);
          const past = time >= s.start - 0.02;
          return (
            <div
              key={s.id}
              style={{
                width: 34,
                height: 2,
                background: active ? C.amber : past ? 'rgba(245,241,231,0.4)' : 'rgba(245,241,231,0.12)',
                boxShadow: active ? '0 0 12px rgba(255,181,71,0.5)' : undefined,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: 2,
          background: 'rgba(245,241,231,0.1)',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, rgba(255,181,71,0.55), ${C.amber})`,
            boxShadow: '0 0 14px rgba(255,181,71,0.55)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
