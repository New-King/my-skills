import raw from './timing.json';

export type WordTiming = {
  text: string;
  start: number;
  end: number;
};

export type SceneTiming = {
  id: string;
  text: string;
  audio: string;
  duration: number;
  start: number;
  words: WordTiming[];
};

export type Timing = {
  fps: number;
  lead: number;
  gap: number;
  total: number;
  endsAt: number;
  scenes: SceneTiming[];
};

export const timing = raw as Timing;
export const FPS = timing.fps;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 30 * FPS;
