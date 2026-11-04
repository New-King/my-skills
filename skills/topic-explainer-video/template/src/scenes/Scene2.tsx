import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {Car} from '../components/Car';
import {Kicker} from '../components/Kicker';
import {Road} from '../components/Road';
import {SceneShell} from '../components/SceneShell';
import {clamp01, findCue, range} from '../helpers';
import {C, FONT, MONO} from '../theme';
import type {SceneTiming} from '../timing';

const X0 = [180, 604, 1028, 1452];
const SHIFT = [258, 176, 96, 18];
const TARGET = [0, 16, 44, 70];
const NAMES = ['后车 3', '后车 2', '后车 1', '头车'];

const Ripple: React.FC<{x: number; y: number; age: number; color: string}> = ({x, y, age, color}) => {
  if (age < 0 || age > 0.9) return null;
  const p = age / 0.9;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 22,
        top: y - 22,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        opacity: (1 - p) * 0.55,
        transform: `scale(${1 + p * 4.4})`,
      }}
    />
  );
};

export const Scene2: React.FC<{scene: SceneTiming; durationInFrames: number; audioOffset: number}> = ({
  scene,
  durationInFrames,
  audioOffset,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps - audioOffset;

  const headEnter = 1 - range(t, -0.1, 0.3);
  const sub = range(t, 0.35, 0.75);
  const barsIn = 1;

  const brakeStarts = [
    findCue(scene, '更重') - 0.06,
    findCue(scene, '踩') - 0.06,
    findCue(scene, '慢') - 0.06,
    findCue(scene, '轻刹') - 0.12,
  ];

  const state = X0.map((x0, i) => {
    const age = t - brakeStarts[i];
    const brake = clamp01(age / 0.22);
    const decel = range(age, 0, 0.85, 0, 1);
    const speed = Math.round(100 + (TARGET[i] - 100) * decel);
    const x = x0 + SHIFT[i] * decel;
    return {x, brake, speed, age, decel};
  });

  const stop = range(t, brakeStarts[0] + 0.35, brakeStarts[0] + 0.75);
  const speedColor = (speed: number) =>
    interpolateColors(speed / 100, [0, 0.45, 1], [C.red, C.amber, C.teal]);

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(55% 45% at 78% 20%, rgba(255,91,77,0.055), transparent 70%)',
        }}
      />
      <div style={{position: 'absolute', left: 120, top: 76}}>
        <Kicker index="02" label="放大" />
      </div>

      <div style={{position: 'absolute', left: 112, top: 128}}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 76,
            lineHeight: 1.24,
            fontWeight: 700,
            letterSpacing: '0.015em',
            color: C.ink,
            transform: `translateY(${headEnter * 26}px)`,
          }}
        >
          一脚轻刹车，
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 76,
            lineHeight: 1.24,
            fontWeight: 700,
            letterSpacing: '0.015em',
            color: C.ink,
            transform: `translateY(${headEnter * 26}px)`,
          }}
        >
          如何变成<span style={{color: C.red}}>一串急刹</span>？
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 116,
          top: 330,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: sub,
        }}
      >
        <div style={{width: 26, height: 1, background: C.red}} />
        <div style={{fontSize: 22, color: C.muted, letterSpacing: '0.06em'}}>
          后车慢半拍，刹车力度被逐级放大
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 330,
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: '0.16em',
          color: 'rgba(245,241,231,0.35)',
          opacity: sub,
        }}
      >
        车速 / km·h⁻¹
      </div>

      <Road y={590} height={290} lanes={1} glow="red" />

      {state.map(({x, brake, speed, age}, i) => {
        const center = x + 74;
        const barH = 100;
        const fill = (speed / 100) * barH;
        const col = speedColor(speed);
        return (
          <React.Fragment key={i}>
            <Ripple x={x + 6} y={708 + 32} age={age} color={C.red} />
            <div
              style={{
                position: 'absolute',
                left: center - 58,
                top: 420,
                width: 116,
                height: barH,
                opacity: barsIn,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid rgba(245,241,231,0.12)',
                  background: 'rgba(245,241,231,0.02)',
                }}
              />
              {[0.25, 0.5, 0.75].map((p) => (
                <div
                  key={p}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: barH * p,
                    height: 1,
                    background: 'rgba(245,241,231,0.07)',
                  }}
                />
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: 3,
                  right: 3,
                  bottom: 3,
                  height: Math.max(0, fill - 4),
                  background: col,
                  opacity: 0.9,
                  boxShadow: `0 0 22px ${col}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: -46,
                  fontFamily: MONO,
                  fontSize: 34,
                  color: col,
                  textAlign: 'center',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {speed}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: center - 70,
                top: 530,
                width: 140,
                textAlign: 'center',
                fontSize: 17,
                letterSpacing: '0.1em',
                color: i === 0 ? C.ink : C.muted,
                opacity: barsIn,
              }}
            >
              {NAMES[i]}
            </div>
          </React.Fragment>
        );
      })}

      {state.map(({x, brake}, i) => (
        <Car
          key={i}
          x={x}
          y={708}
          width={148}
          height={64}
          body={i === 0 ? '#3B4658' : ['#2C3A4A', '#333540', '#3E382F'][i - 1]}
          brake={brake}
          headlight={0.55}
          z={3 + i}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 1100,
          top: 630,
          padding: '10px 16px',
          border: `1px solid rgba(255,91,77,${0.45 * stop})`,
          background: `rgba(255,91,77,${0.1 * stop})`,
          color: C.red,
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: '0.12em',
          opacity: stop,
          transform: `translateY(${(1 - stop) * 8}px)`,
        }}
      >
        一次轻刹 → 四车停摆
      </div>
    </SceneShell>
  );
};
