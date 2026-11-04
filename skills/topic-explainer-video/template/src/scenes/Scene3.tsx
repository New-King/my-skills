import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Car} from '../components/Car';
import {Kicker} from '../components/Kicker';
import {Road} from '../components/Road';
import {SceneShell} from '../components/SceneShell';
import {clamp01, findCue, range} from '../helpers';
import {C, FONT, MONO} from '../theme';
import type {SceneTiming} from '../timing';

const LANE_CENTERS = [447, 620, 793];

export const Scene3: React.FC<{scene: SceneTiming; durationInFrames: number; audioOffset: number}> = ({
  scene,
  durationInFrames,
  audioOffset,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps - audioOffset;

  const headEnter = 1 - range(t, -0.1, 0.3);
  const legend = range(t, 0.2, 0.6);
  const empty = range(t, findCue(scene, '什么都没有') - 0.5, findCue(scene, '什么都没有') + 0.1);
  const waveIn = range(t, 0.3, 0.75);

  const bandX = interpolate(t, [0.6, 6.35], [1420, 80], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cars: Array<{x: number; lane: number; i: number; brake: number}> = [];
  for (let lane = 0; lane < 3; lane++) {
    for (let i = 0; i < 6; i++) {
      const base = -100 + i * 235 + lane * 45;
      const x = base + Math.max(0, t) * 14;
      const d = Math.abs(x + 44 - bandX);
      const brake = clamp01(1 - d / 170);
      cars.push({x: x - brake * 8, lane, i, brake});
    }
  }

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(55% 45% at 18% 60%, rgba(255,91,77,0.06), transparent 70%)',
        }}
      />
      <div style={{position: 'absolute', left: 120, top: 76}}>
        <Kicker index="03" label="传播" />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 126,
          fontFamily: FONT,
          fontSize: 80,
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: '0.015em',
          color: C.ink,
          transform: `translateY(${headEnter * 24}px)`,
        }}
      >
        <div>车在向前，</div>
        <div>
          堵车波在<span style={{color: C.red}}>向后</span>。
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 128,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          opacity: legend,
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: '0.12em',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 36, color: C.ink}}>
          <span>车流</span>
          <span style={{color: C.amber}}>→</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 36, color: C.red}}>
          <span>拥堵波</span>
          <span>←</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 242,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: empty,
          transform: `translateY(${(1 - empty) * 8}px)`,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: C.teal,
            boxShadow: '0 0 14px rgba(66,232,195,0.75)',
          }}
        />
        <span style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.14em', color: C.teal}}>
          前方畅通
        </span>
        <span style={{fontSize: 15, color: 'rgba(245,241,231,0.4)'}}>无事故 · 无红灯</span>
      </div>

      <Road y={365} height={520} lanes={3} glow="red" />

      <div
        style={{
          position: 'absolute',
          left: 1390,
          top: 430,
          width: 390,
          height: 390,
          border: '1px dashed rgba(66,232,195,0.16)',
          opacity: empty,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '46%',
            textAlign: 'center',
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: '0.32em',
            color: 'rgba(66,232,195,0.5)',
          }}
        >
          CLEAR
        </div>
      </div>

      {cars.map(({x, lane, i, brake}) => (
        <React.Fragment key={`${lane}-${i}`}>
          {brake > 0.04 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: x - 42,
                  top: LANE_CENTERS[lane] - 14,
                  width: 86,
                  height: 28,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(closest-side, rgba(255,45,35,0.9), rgba(255,45,35,0.18) 55%, transparent 78%)',
                  filter: 'blur(7px)',
                  opacity: brake,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: x - 64,
                  top: LANE_CENTERS[lane] - 1,
                  width: 66,
                  height: 2,
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,64,48,0.85))',
                  opacity: brake * 0.8,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: x - 5,
                  top: LANE_CENTERS[lane] - 15,
                  width: 7,
                  height: 30,
                  borderRadius: 4,
                  background: '#FF3A2E',
                  boxShadow: '0 0 20px rgba(255,58,46,0.95)',
                  opacity: brake,
                }}
              />
            </>
          ) : null}
          <Car
            x={x}
            y={LANE_CENTERS[lane] - 22}
            width={88}
            height={44}
            body={['#2A3648', '#343B47', '#3A3631'][(i + lane) % 3]}
            brake={brake}
            headlight={0.55}
            z={2 + i}
          />
        </React.Fragment>
      ))}

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 365,
          width: '100%',
          height: 520,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: bandX - 26,
            top: -60,
            width: 340,
            height: 640,
            transform: 'rotate(-6deg)',
            background:
              'linear-gradient(90deg, rgba(255,59,48,0.30) 0%, rgba(255,59,48,0.11) 34%, rgba(255,91,77,0.03) 76%, transparent 100%)',
            filter: 'blur(9px)',
            opacity: waveIn * 0.85,
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: bandX - 2,
            top: -40,
            width: 2,
            height: 600,
            transform: 'rotate(-6deg)',
            background: `rgba(255,91,77,${0.82 * waveIn})`,
            boxShadow: '0 0 28px rgba(255,59,48,0.75)',
            opacity: waveIn,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: Math.min(1710, Math.max(40, bandX - 62)),
          top: 336,
          width: 124,
          display: 'flex',
          justifyContent: 'center',
          opacity: waveIn,
        }}
      >
        <div
          style={{
            padding: '7px 14px',
            border: '1px solid rgba(255,91,77,0.45)',
            background: 'rgba(255,91,77,0.12)',
            color: C.red,
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: '0.16em',
            whiteSpace: 'nowrap',
          }}
        >
          拥堵波
        </div>
      </div>
    </SceneShell>
  );
};
