import React from 'react';
import {interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {Car} from '../components/Car';
import {Kicker} from '../components/Kicker';
import {Road} from '../components/Road';
import {SceneShell} from '../components/SceneShell';
import {clamp01, findCue, range} from '../helpers';
import {C, FONT, MONO} from '../theme';
import type {SceneTiming} from '../timing';

const BASE_X = [210, 650, 1090, 1530];

const StatCard: React.FC<{
  x: number;
  label: string;
  value: string;
  unit: string;
  note: string;
  show: number;
  color: string;
}> = ({x, label, value, unit, note, show, color}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: 112,
      width: 252,
      height: 128,
      border: `1px solid rgba(245,241,231,${0.13 * show})`,
      background: 'rgba(245,241,231,0.025)',
      opacity: show,
      transform: `translateY(${(1 - show) * 16}px)`,
      padding: '18px 22px',
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 15,
        letterSpacing: '0.1em',
        color: C.muted,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </div>
    <div style={{marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 7}}>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 40,
          lineHeight: 1,
          color: C.ink,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
      <span style={{fontSize: 17, color: C.muted}}>{unit}</span>
    </div>
    <div style={{marginTop: 8, fontSize: 14, color: 'rgba(245,241,231,0.38)', letterSpacing: '0.05em'}}>
      {note}
    </div>
  </div>
);

export const Scene4: React.FC<{scene: SceneTiming; durationInFrames: number; audioOffset: number}> = ({
  scene,
  durationInFrames,
  audioOffset,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps - audioOffset;

  const headEnter = 1 - range(t, -0.1, 0.3);
  const gapShow = range(t, findCue(scene, '车距') - 0.1, findCue(scene, '车距') + 0.45);
  const speedShow = range(t, findCue(scene, '匀速') - 0.1, findCue(scene, '匀速') + 0.4);
  const brackets = range(t, findCue(scene, '车距'), findCue(scene, '车距') + 0.6);
  const lightShow = range(t, findCue(scene, '一片') - 0.05, findCue(scene, '一片') + 0.35);

  const tap = findCue(scene, '一脚');
  const tap2 = findCue(scene, '一片');
  const pulse = (start: number) =>
    clamp01(Math.min(range(t, start, start + 0.16), 1 - range(t, start + 1.15, start + 1.55)));
  const tapBrake = Math.max(pulse(tap), pulse(tap2));
  const cars = BASE_X.map((x, i) => ({
    x: x + Math.max(0, t) * 26,
    i,
    brake: i === 3 ? tapBrake : 0,
  }));

  const litColor = interpolateColors(tapBrake, [0, 1], ['rgba(255,91,77,0.3)', C.red]);

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(60% 50% at 20% 58%, rgba(66,232,195,0.055), transparent 72%)',
        }}
      />
      <div style={{position: 'absolute', left: 120, top: 76}}>
        <Kicker index="04" label="解药" color={C.teal} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 126,
          fontFamily: FONT,
          fontSize: 96,
          lineHeight: 1.16,
          fontWeight: 700,
          letterSpacing: '0.02em',
          color: C.ink,
          transform: `translateY(${headEnter * 24}px)`,
        }}
      >
        把波，<span style={{color: C.teal}}>抚平。</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 116,
          top: 262,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 22,
          letterSpacing: '0.16em',
          color: C.muted,
          opacity: gapShow,
        }}
      >
        <div style={{width: 26, height: 1, background: C.teal}} />
        保持车距 · 匀速跟车
      </div>

      <StatCard
        x={1340}
        label="跟车距离"
        value="2.0"
        unit="秒"
        note="约 33 米 · 留出反应时间"
        show={gapShow}
        color={C.teal}
      />
      <StatCard
        x={1618}
        label="车速"
        value="60"
        unit="km/h"
        note="稳定 · 不忽快忽慢"
        show={speedShow}
        color={C.teal}
      />

      <div
        style={{
          position: 'absolute',
          left: 1340,
          top: 270,
          width: 530,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: speedShow,
        }}
      >
        <span style={{fontFamily: MONO, fontSize: 14, letterSpacing: '0.12em', color: C.muted}}>
          刹车灯
        </span>
        <div style={{display: 'flex', gap: 10}}>
          {[0, 1, 2, 3].map((i) => {
            const lit = i === 3 && tapBrake > 0.05;
            return (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 8,
                  borderRadius: 4,
                  background: lit ? litColor : 'rgba(66,232,195,0.22)',
                  boxShadow: lit ? '0 0 14px rgba(255,91,77,0.65)' : undefined,
                }}
              />
            );
          })}
        </div>
        <span
          style={{
            fontSize: 15,
            color: C.teal,
            opacity: lightShow,
            letterSpacing: '0.06em',
          }}
        >
          只亮一盏
        </span>
      </div>

      <Road y={450} height={340} lanes={1} glow="teal" />

      {cars.map(({x, i, brake}) => (
        <React.Fragment key={i}>
          <div
            style={{
              position: 'absolute',
              left: x - 70,
              top: 620,
              width: 220,
              height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(66,232,195,0.32), transparent)',
              opacity: 0.6,
            }}
          />
          <Car
            x={x}
            y={592}
            width={140}
            height={56}
            body={['#2B3B48', '#344049', '#2E3A40', '#3B4148'][i]}
            brake={brake}
            headlight={0.7}
            z={3 + i}
          />
        </React.Fragment>
      ))}

      {cars.slice(0, 3).map(({x}, i) => (
        <React.Fragment key={`gap-${i}`}>
          <div
            style={{
              position: 'absolute',
              left: x + 152,
              top: 556,
              width: 288,
              height: 1,
              background: `rgba(66,232,195,${0.55 * brackets})`,
              transformOrigin: 'left center',
              transform: `scaleX(${brackets})`,
            }}
          />
          {[0, 288].map((dx) => (
            <div
              key={dx}
              style={{
                position: 'absolute',
                left: x + 152 + dx,
                top: 549,
                width: 1,
                height: 15,
                background: `rgba(66,232,195,${0.55 * brackets})`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              left: x + 152,
              top: 522,
              width: 288,
              textAlign: 'center',
              fontFamily: MONO,
              fontSize: 15,
              letterSpacing: '0.08em',
              color: 'rgba(66,232,195,0.82)',
              opacity: brackets,
            }}
          >
            ≈ 2 秒
          </div>
        </React.Fragment>
      ))}

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 808,
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: '0.13em',
          color: 'rgba(66,232,195,0.4)',
          opacity: gapShow,
        }}
      >
        SMOOTH FLOW / 60 KM·H⁻¹
      </div>
    </SceneShell>
  );
};
