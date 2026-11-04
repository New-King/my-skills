import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Car} from '../components/Car';
import {Kicker} from '../components/Kicker';
import {Road} from '../components/Road';
import {SceneShell} from '../components/SceneShell';
import {clamp01, findCue, lerp, range} from '../helpers';
import {C, FONT, MONO} from '../theme';
import type {SceneTiming} from '../timing';

const LANE0_X0 = [40, 300, 560, 820, 1080];
const LANE0_X1 = [500, 645, 790, 935, 1080];
const LANE1_X0 = [150, 410, 670, 930, 1190];
const LANE1_X1 = [570, 715, 860, 1005, 1150];

const Chip: React.FC<{
  value: string;
  label: string;
  accent?: string;
  show: number;
}> = ({value, label, accent = C.ink, show}) => (
  <div
    style={{
      height: 58,
      padding: '0 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: `1px solid ${show > 0.5 ? 'rgba(245,241,231,0.2)' : 'rgba(245,241,231,0.1)'}`,
      background: 'rgba(245,241,231,0.028)',
      opacity: show,
      transform: `translateY(${(1 - show) * 14}px)`,
    }}
  >
    <span style={{fontFamily: MONO, fontSize: 28, color: accent, lineHeight: 1}}>{value}</span>
    <span style={{fontSize: 18, color: C.muted, letterSpacing: '0.08em'}}>{label}</span>
  </div>
);

export const Scene1: React.FC<{scene: SceneTiming; durationInFrames: number; audioOffset: number}> = ({
  scene,
  durationInFrames,
  audioOffset,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps - audioOffset;

  const titleIn = spring({frame, fps, config: {damping: 200, mass: 0.8, stiffness: 120}});
  const en = range(t, 0.32, 0.8);
  const rule = range(t, 0.48, 1.0);
  const chip1 = range(t, 0.62, 0.95);
  const chip2 = range(t, 0.86, 1.2);
  const chip3 = range(t, findCue(scene, '堵住') - 0.3, findCue(scene, '堵住') + 0.15);
  const definition = range(t, findCue(scene, '幽灵') - 0.25, findCue(scene, '幽灵') + 0.2);
  const clear = range(t, findCue(scene, '幽灵') - 0.5, findCue(scene, '幽灵') + 0.05);
  const jam = range(t, findCue(scene, '堵住') - 0.25, findCue(scene, '堵住') + 0.25);
  const ringPulse = 1 + 0.018 * Math.sin(Math.max(0, t) * 3.2);

  const cars = [
    ...LANE0_X0.map((x0, i) => ({x0, x1: LANE0_X1[i], y: 639, lane: 0, i})),
    ...LANE1_X0.map((x0, i) => ({x0, x1: LANE1_X1[i], y: 784, lane: 1, i})),
  ];

  return (
    <SceneShell durationInFrames={durationInFrames} first>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(60% 45% at 72% 54%, rgba(255,181,71,0.06), transparent 70%)',
        }}
      />

      <div style={{position: 'absolute', left: 120, top: 76}}>
        <Kicker index="01" label="现象" />
      </div>

      <div style={{position: 'absolute', left: 112, top: 130}}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 150,
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: '0.025em',
            color: C.ink,
            textShadow: '0 20px 70px rgba(0,0,0,0.55)',
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 26}px)`,
          }}
        >
          幽灵塞车
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: '0.42em',
            color: C.muted,
            opacity: en,
            transform: `translateY(${(1 - en) * 8}px)`,
          }}
        >
          PHANTOM TRAFFIC JAM
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 376,
          width: 86,
          height: 2,
          background: C.amber,
          transformOrigin: 'left center',
          transform: `scaleX(${rule})`,
          opacity: 0.9,
        }}
      />

      <div style={{position: 'absolute', left: 120, top: 408, display: 'flex', gap: 14}}>
        <Chip value="0" label="事故" show={chip1} />
        <Chip value="0" label="红灯" show={chip2} />
        <Chip value="?" label="看不见的堵点" accent={C.red} show={chip3} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 122,
          top: 500,
          fontFamily: FONT,
          fontSize: 29,
          letterSpacing: '0.04em',
          color: 'rgba(245,241,231,0.68)',
          opacity: definition,
          transform: `translateY(${(1 - definition) * 10}px)`,
        }}
      >
        一场<span style={{color: C.amber}}>没有肇事者</span>的拥堵。
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 552,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: clear,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: C.teal,
            boxShadow: '0 0 14px rgba(66,232,195,0.8)',
          }}
        />
        <span style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.14em', color: C.teal}}>
          前方畅通
        </span>
      </div>

      <Road y={590} height={290} lanes={2} glow="warm" />

      {jam > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 498,
            top: 615,
            width: 680,
            height: 235,
            borderRadius: 118,
            border: `1px dashed rgba(255,91,77,${0.36 * jam})`,
            opacity: jam,
            transform: `scale(${ringPulse})`,
            boxShadow: `inset 0 0 70px rgba(255,91,77,${0.05 * jam})`,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 778,
          top: 558,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: jam,
        }}
      >
        <div style={{width: 22, height: 1, background: C.red, opacity: 0.7}} />
        <span style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.18em', color: C.red}}>
          拥堵点 ?
        </span>
      </div>

      {cars.map(({x0, x1, y, lane, i}) => {
        const moveStart = 0.42 + (4 - i) * 0.17 + lane * 0.08;
        const p = interpolate(t, [moveStart, moveStart + 1.85], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const eased = p * p * (3 - 2 * p);
        const x = lerp(x0, x1, eased);
        const brakeStart = findCue(scene, '堵住') - 0.9 + (4 - i) * 0.19 + lane * 0.10;
        const brake = clamp01((t - brakeStart) / 0.26);
        const bob = Math.sin(t * 2.4 + i * 1.3 + lane) * 0.7;
        const palette = ['#2B3648', '#33404F', '#3A3B45', '#273B4A', '#40382F'];
        return (
          <Car
            key={`${lane}-${i}`}
            x={x}
            y={y + bob}
            width={102}
            height={46}
            body={palette[(i + lane * 2) % palette.length]}
            brake={brake}
            headlight={0.65}
            z={2 + i}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 872,
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: '0.14em',
          color: 'rgba(245,241,231,0.28)',
        }}
      >
        19:40 / 城市快速路
      </div>
    </SceneShell>
  );
};
