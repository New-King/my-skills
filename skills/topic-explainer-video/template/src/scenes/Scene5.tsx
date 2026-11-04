import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Car} from '../components/Car';
import {Kicker} from '../components/Kicker';
import {Road} from '../components/Road';
import {SceneShell} from '../components/SceneShell';
import {findCue, range} from '../helpers';
import {C, FONT} from '../theme';
import type {SceneTiming} from '../timing';

export const Scene5: React.FC<{scene: SceneTiming; durationInFrames: number; audioOffset: number}> = ({
  scene,
  durationInFrames,
  audioOffset,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps - audioOffset;

  const line1 = range(t, 0.5, 0.9);
  const line2 = range(t, findCue(scene, '不是') - 0.18, findCue(scene, '不是') + 0.36);
  const advice = range(t, 4.22, 4.62);
  const ring = spring({frame: frame - 4, fps, config: {damping: 200, mass: 1, stiffness: 50}});
  const draw = range(t, 1.0, 3.6);

  return (
    <SceneShell durationInFrames={durationInFrames} last>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(58% 48% at 50% 42%, rgba(255,181,71,0.055), transparent 72%)',
        }}
      />

      <div style={{position: 'absolute', left: 120, top: 76}}>
        <Kicker index="05" label="结论" />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 440,
          width: 760,
          height: 760,
          marginLeft: -380,
          marginTop: -380,
          borderRadius: '50%',
          border: '1px solid rgba(245,241,231,0.06)',
          opacity: ring * 0.9,
          transform: `scale(${0.86 + ring * 0.14})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 440,
          width: 560,
          height: 560,
          marginLeft: -280,
          marginTop: -280,
          borderRadius: '50%',
          border: '1px dashed rgba(245,241,231,0.055)',
          opacity: ring * 0.8,
          transform: `scale(${0.9 + ring * 0.1}) rotate(${t * 1.2}deg)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 146,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '0.22em',
          color: C.ink,
        }}
      >
        幽灵塞车
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 238,
          width: 54,
          height: 2,
          marginLeft: -27,
          background: C.amber,
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 300,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 88,
          lineHeight: 1.28,
          fontWeight: 700,
          letterSpacing: '0.025em',
          color: C.ink,
          whiteSpace: 'nowrap',
          opacity: line1,
          transform: `translateY(${(1 - line1) * 34}px)`,
        }}
      >
        是<span style={{color: C.amber}}>集体节奏</span>的失控
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 420,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 88,
          lineHeight: 1.28,
          fontWeight: 700,
          letterSpacing: '0.025em',
          color: 'rgba(245,241,231,0.78)',
          whiteSpace: 'nowrap',
          opacity: line2,
          transform: `translateY(${(1 - line2) * 34}px)`,
        }}
      >
        不是<span style={{color: C.ink}}>某个人</span>的错
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 570,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 18,
          opacity: advice,
          transform: `translateY(${(1 - advice) * 10}px)`,
        }}
      >
        <div style={{width: 36, height: 1, background: C.amber, opacity: 0.7}} />
        <div style={{fontSize: 28, letterSpacing: '0.1em', color: 'rgba(245,241,231,0.62)'}}>
          下一次，先松开油门。
        </div>
        <div style={{width: 36, height: 1, background: C.amber, opacity: 0.7}} />
      </div>

      <svg
        width={1920}
        height={260}
        style={{position: 'absolute', left: 0, top: 620, opacity: 0.55}}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1">
            <stop offset="0%" stopColor={C.red} stopOpacity="0.9" />
            <stop offset="48%" stopColor={C.amber} stopOpacity="0.8" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d="M0 146 L82 110 L156 158 L238 114 L318 152 L402 118 L486 146 L566 124 C700 124 730 106 840 106 C1000 106 1080 90 1220 90 C1420 90 1580 90 1920 90"
          fill="none"
          stroke="url(#waveGrad)"
          strokeWidth={3.5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          strokeLinecap="round"
        />
      </svg>

      <Road y={760} height={180} lanes={1} glow="teal" edge={false} />

      {[
        {x: 420, i: 0},
        {x: 930, i: 1},
        {x: 1440, i: 2},
      ].map(({x, i}) => (
        <React.Fragment key={i}>
          <div
            style={{
              position: 'absolute',
              left: x + 30,
              top: 826,
              width: 300,
              height: 1,
              background:
                'linear-gradient(90deg, rgba(66,232,195,0.36), rgba(66,232,195,0))',
            }}
          />
          <Car
            x={x + Math.max(0, t) * 18}
            y={814}
            width={118}
            height={50}
            body={['#2C3B46', '#37414A', '#2F3A3F'][i]}
            headlight={0.8}
            z={2 + i}
          />
        </React.Fragment>
      ))}
    </SceneShell>
  );
};
