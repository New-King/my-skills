import React from 'react';
import {Composition} from 'remotion';
import {Explainer} from './Video';
import {DURATION, FPS, HEIGHT, WIDTH} from './timing';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Explainer30"
      component={Explainer}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
