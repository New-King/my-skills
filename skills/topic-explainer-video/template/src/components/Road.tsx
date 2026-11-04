import React from 'react';
import {C} from '../theme';

type Props = {
  y: number;
  height: number;
  lanes?: number;
  edge?: boolean;
  glow?: 'warm' | 'red' | 'teal' | 'none';
};

export const Road: React.FC<Props> = ({y, height, lanes = 2, edge = true, glow = 'warm'}) => {
  const glowColor =
    glow === 'red'
      ? 'rgba(255,91,77,0.07)'
      : glow === 'teal'
        ? 'rgba(66,232,195,0.07)'
        : 'rgba(255,181,71,0.06)';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: '100%',
        height,
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #121925 0%, #0D121B 18%, #0A0E16 55%, #0D121B 100%)',
        borderTop: edge ? '1px solid rgba(245,241,231,0.22)' : undefined,
        borderBottom: edge ? '1px solid rgba(245,241,231,0.16)' : undefined,
        boxShadow:
          'inset 0 40px 80px rgba(0,0,0,0.55), inset 0 -40px 80px rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.016) 0 1px, transparent 1px 7px), repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 3px, transparent 3px 9px)',
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${glowColor}, transparent 42%, transparent 70%, ${glowColor})`,
        }}
      />
      {Array.from({length: lanes - 1}, (_, i) => {
        const top = ((i + 1) * height) / lanes;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top,
              height: 2,
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(245,241,231,0.28) 0 44px, transparent 44px 92px)',
              opacity: 0.7,
            }}
          />
        );
      })}
      {Array.from({length: lanes + 1}, (_, i) => {
        const top = (i * height) / lanes;
        return (
          <div
            key={`tick-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              top: Math.min(height - 2, top),
              height: 1,
              width: '100%',
              background: 'rgba(245,241,231,0.045)',
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 60,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.34), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 50,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.32), transparent)',
        }}
      />
    </div>
  );
};
