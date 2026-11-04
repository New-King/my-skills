import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Backdrop} from './components/Backdrop';
import {Caption} from './components/Caption';
import {Chrome} from './components/Chrome';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {C, FONT} from './theme';
import {DURATION, FPS, timing} from './timing';
import type {SceneTiming} from './timing';

type SceneProps = {
  scene: SceneTiming;
  durationInFrames: number;
  audioOffset: number;
};

const SCENE_COMPONENTS: Record<string, React.ComponentType<SceneProps>> = {
  s1: Scene1,
  s2: Scene2,
  s3: Scene3,
  s4: Scene4,
  s5: Scene5,
};

const audioStarts = timing.scenes.map((s) => Math.round(s.start * FPS));
const visualStarts = timing.scenes.map((s, i) =>
  i === 0 ? 0 : Math.round((s.start - 0.10) * FPS),
);
const visualEnds = timing.scenes.map((_, i) =>
  i === timing.scenes.length - 1 ? DURATION : visualStarts[i + 1],
);

export const Explainer: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, fontFamily: FONT, overflow: 'hidden'}}>
      <Backdrop />
      <Audio src={staticFile('audio/bed.wav')} volume={0.16} />

      {timing.scenes.map((scene, i) => {
        const Comp = SCENE_COMPONENTS[scene.id];
        const from = visualStarts[i];
        const durationInFrames = visualEnds[i] - from;
        const audioOffset = (audioStarts[i] - from) / FPS;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} layout="none">
            <Comp scene={scene} durationInFrames={durationInFrames} audioOffset={audioOffset} />
          </Sequence>
        );
      })}

      {timing.scenes.map((scene, i) => (
        <Sequence
          key={`audio-${scene.id}`}
          from={audioStarts[i]}
          durationInFrames={Math.ceil(scene.duration * FPS) + 4}
          layout="none"
        >
          <Audio src={staticFile(scene.audio)} />
        </Sequence>
      ))}

      <Caption />
      <Chrome />
    </AbsoluteFill>
  );
};
