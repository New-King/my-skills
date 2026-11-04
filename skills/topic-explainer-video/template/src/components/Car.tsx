import React from 'react';
import {interpolateColors} from 'remotion';

type Props = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  body?: string;
  brake?: number;
  headlight?: number;
  opacity?: number;
  z?: number;
};

export const Car: React.FC<Props> = ({
  x,
  y,
  width = 96,
  height = 46,
  body = '#2B3648',
  brake = 0,
  headlight = 0.8,
  opacity = 1,
  z = 1,
}) => {
  const b = Math.min(1, Math.max(0, brake));
  const tail = interpolateColors(b, [0, 0.35, 1], ['#5A2622', '#C0392B', '#FF3A2E']);
  const tailGlow = `0 0 ${6 + b * 18}px rgba(255,55,42,${0.35 + b * 0.6})`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity,
        zIndex: z,
        filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.55))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -width * 0.52,
          top: -height * 0.2,
          width: width * 0.62,
          height: height * 1.4,
          background:
            'linear-gradient(90deg, rgba(255,196,110,0.32), rgba(255,196,110,0.06) 55%, transparent)',
          filter: 'blur(7px)',
          opacity: headlight * 0.6,
          mixBlendMode: 'screen',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -width * 0.32,
          top: height * 0.05,
          width: width * 0.62,
          height: height * 0.9,
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(255,46,36,0.75), rgba(255,46,36,0.18) 50%, transparent 76%)',
          filter: 'blur(9px)',
          opacity: 0.18 + b * 0.78,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: height * 0.28,
          background: `linear-gradient(180deg, rgba(255,255,255,0.16), ${body} 24%, ${body} 72%, rgba(0,0,0,0.35))`,
          border: '1px solid rgba(235,242,255,0.2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: width * 0.28,
            top: height * 0.12,
            width: width * 0.42,
            height: height * 0.76,
            borderRadius: height * 0.16,
            background: 'linear-gradient(180deg, #172133, #0A0F18)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: width * 0.64,
            top: height * 0.16,
            width: width * 0.07,
            height: height * 0.68,
            borderRadius: 3,
            background:
              'linear-gradient(180deg, rgba(133,181,220,0.5), rgba(44,74,105,0.28))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: width * 0.3,
            top: height * 0.16,
            width: width * 0.055,
            height: height * 0.68,
            borderRadius: 3,
            background:
              'linear-gradient(180deg, rgba(130,170,205,0.26), rgba(32,50,72,0.18))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: width * 0.38,
            top: height * 0.2,
            width: width * 0.2,
            height: 1,
            background: 'rgba(255,255,255,0.18)',
          }}
        />
        {[0.17, 0.67].map((p, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: width * p,
                top: -2,
                width: width * 0.16,
                height: 5,
                borderRadius: 3,
                background: '#05070B',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: width * p,
                bottom: -2,
                width: width * 0.16,
                height: 5,
                borderRadius: 3,
                background: '#05070B',
              }}
            />
          </React.Fragment>
        ))}
      </div>
      {[0.22, 0.68].map((p, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              position: 'absolute',
              right: -2,
              top: height * p,
              width: 5,
              height: Math.max(6, height * 0.12),
              borderRadius: 3,
              background: '#FFE0A3',
              boxShadow: `0 0 12px rgba(255,206,122,${0.45 + headlight * 0.4})`,
              opacity: 0.55 + headlight * 0.45,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -2,
              top: height * p,
              width: 5,
              height: Math.max(6, height * 0.12),
              borderRadius: 3,
              background: tail,
              boxShadow: tailGlow,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
