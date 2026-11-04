import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';

type Props = {
  index: string;
  label: string;
  color?: string;
  align?: 'left' | 'center';
};

export const Kicker: React.FC<Props> = ({index, label, color = C.amber, align = 'left'}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [0, 8], [0.35, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: 18,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 8}px)`,
      }}
    >
      <div style={{width: 46, height: 1, background: color, opacity: 0.9}} />
      <div
        style={{
          fontFamily: MONO,
          fontSize: 19,
          letterSpacing: '0.24em',
          color,
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {index} <span style={{opacity: 0.45}}>/</span> {label}
      </div>
    </div>
  );
};
