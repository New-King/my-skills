import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {range} from '../helpers';
import {C, FONT} from '../theme';
import {timing, FPS} from '../timing';

export const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / FPS;

  let active = 0;
  for (let i = 0; i < timing.scenes.length; i++) {
    if (time >= timing.scenes[i].start - 0.12) active = i;
  }
  const scene = timing.scenes[active];
  const rel = time - scene.start;

  let activeWord = -1;
  scene.words.forEach((w, i) => {
    if (rel >= w.start - 0.02) activeWord = i;
  });

  const fadeIn = range(time, scene.start - 0.12, scene.start + 0.03);
  const fadeOut = 1 - range(time, 29.08, 29.5);
  const opacity = Math.min(fadeIn, fadeOut);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  scene.words.forEach((w, i) => {
    const idx = scene.text.indexOf(w.text, cursor);
    if (idx === -1) return;
    if (idx > cursor) {
      nodes.push(
        <span key={`p-${i}`} style={{color: 'rgba(245,241,231,0.42)'}}>
          {scene.text.slice(cursor, idx)}
        </span>,
      );
    }
    const isActive = i === activeWord;
    const isPast = i < activeWord;
    nodes.push(
      <span
        key={`w-${i}`}
        style={{
          color: isActive ? C.amber : isPast ? C.ink : 'rgba(245,241,231,0.34)',
          textShadow: isActive ? '0 0 24px rgba(255,181,71,0.45)' : undefined,
        }}
      >
        {w.text}
      </span>,
    );
    cursor = idx + w.text.length;
  });
  if (cursor < scene.text.length) {
    nodes.push(<span key="tail">{scene.text.slice(cursor)}</span>);
  }

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 40}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 210,
          background:
            'linear-gradient(180deg, rgba(7,10,16,0) 0%, rgba(7,10,16,0.72) 55%, rgba(7,10,16,0.96) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 56,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 150px',
          opacity,
          transform: `translateY(${(1 - fadeIn) * 10}px)`,
        }}
      >
        <div
          style={{
            maxWidth: 1620,
            textAlign: 'center',
            fontFamily: FONT,
            fontSize: 33,
            lineHeight: 1.5,
            fontWeight: 500,
            letterSpacing: '0.035em',
            color: C.ink,
          }}
        >
          {nodes}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 34,
          width: 34,
          height: 2,
          marginLeft: -17,
          background: C.amber,
          opacity: opacity * 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
