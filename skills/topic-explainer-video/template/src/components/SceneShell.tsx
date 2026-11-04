import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

type Props = {
  durationInFrames: number;
  children: React.ReactNode;
  last?: boolean;
  first?: boolean;
};

export const SceneShell: React.FC<Props> = ({
  durationInFrames,
  children,
  last = false,
  first = false,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = first ? 7 : 0;
  const opacity = last
    ? interpolate(frame, [0, 1, durationInFrames - 22, durationInFrames], [1, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  return <AbsoluteFill style={{opacity, overflow: 'hidden'}}>{children}</AbsoluteFill>;
};
